import fs from "node:fs";
import path from "node:path";
import { parseDocument } from "htmlparser2";
import { findAll, textContent } from "domutils";

const root = path.resolve(process.argv[2] || "dist");
const base = "https://pepperfarmdeli.com";
const files = fs.readdirSync(root, { recursive: true }).filter(f => f.endsWith(".html") && !f.replaceAll("\\", "/").startsWith("test/"));
const pages = new Map();
const errors = [];
const warnings = [];
const check = (ok, page, message) => { if (!ok) errors.push({ page, message }); };
for (const file of files) {
  const relative = file.replaceAll("\\", "/");
  const url = "/" + relative.replace(/index\.html$/, "");
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const doc = parseDocument(html);
  const nodes = findAll(n => n.type === "tag" || n.type === "script", doc.children);
  const tags = (name) => nodes.filter(n => n.name === name);
  const title = tags("title").map(textContent).join("").trim();
  const description = tags("meta").find(n => n.attribs.name === "description")?.attribs.content;
  const canonical = tags("link").filter(n => n.attribs.rel === "canonical");
  check(title.length > 0, url, "Missing title");
  check(!!description?.trim(), url, "Missing description");
  check(tags("h1").length === 1, url, "Expected exactly one H1");
  check(canonical.length === 1 && canonical[0].attribs.href === base + url, url, "Incorrect canonical");
  for (const script of tags("script").filter(n => n.attribs.type === "application/ld+json")) {
    try {
      const schema = JSON.parse(textContent(script));
      check(!!schema["@type"], url, "Structured data missing type");
      if (schema["@type"] === "MenuItem") {
        check(!!schema.name && schema.url === base + url, url, "Menu item name or URL missing");
        for (const offer of [schema.offers].flat().filter(Boolean)) check(Number(offer.price) > 0, url, "Invalid offer price");
      }
    } catch (error) { errors.push({ page: url, message: "Invalid JSON-LD: " + error.message }); }
  }
  for (const img of tags("img")) {
    check("alt" in img.attribs, url, "Image missing alt attribute");
    if ((img.attribs.src || "").includes("missing_image") || /image unavailable/i.test(img.attribs.alt || "")) warnings.push({ page: url, message: "Original food photograph needed" });
  }
  check(!/description comings? soon/i.test(textContent(doc)), url, "Placeholder menu description");
  check(!/Only 3 Same-Day Slots/.test(html), url, "Unverified same-day availability claim");
  const ids = new Set(nodes.map(n => n.attribs?.id).filter(Boolean));
  pages.set(url, { title, nodes, ids });
}
for (const [url, page] of pages) {
  for (const node of page.nodes.filter(n => ["a", "img", "script", "link"].includes(n.name))) {
    const target = node.attribs.href || node.attribs.src;
    if (!target || /^(tel:|mailto:|data:|javascript:)/.test(target)) continue;
    const resolved = new URL(target, base + url);
    if (resolved.origin !== base) continue;
    const pathname = decodeURIComponent(resolved.pathname);
    const onDisk = path.resolve(root, "." + pathname);
    check(onDisk.startsWith(root + path.sep) || onDisk === root, url, "Link escapes output folder");
    check(fs.existsSync(onDisk) || fs.existsSync(path.join(onDisk, "index.html")), url, "Broken internal URL: " + pathname);
    if (resolved.hash && pages.has(pathname)) check(pages.get(pathname).ids.has(decodeURIComponent(resolved.hash.slice(1))), url, "Broken fragment: " + target);
  }
}
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
check(new Set(locations).size === locations.length, "/sitemap.xml", "Duplicate sitemap URLs");
for (const location of locations) check(pages.has(new URL(location).pathname), "/sitemap.xml", "Sitemap URL not generated: " + location);
for (const url of pages.keys()) check(locations.includes(base + url), url, "Page absent from sitemap");
const titles = new Map();
for (const [url, { title }] of pages) {
  check(!titles.has(title), url, "Duplicate title: " + title);
  titles.set(title, url);
}
const report = { pages: pages.size, sitemapUrls: locations.length, errors, warnings: [...new Map(warnings.map(w => [w.page + w.message, w])).values()] };
fs.mkdirSync("audit", { recursive: true });
fs.writeFileSync("audit/seo-latest.json", JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exitCode = 1;
