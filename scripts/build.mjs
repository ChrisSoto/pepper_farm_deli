import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

// Build into a fresh staging folder so removed CMS pages cannot survive in dist.
const project = fs.realpathSync(".");
fs.mkdirSync(".cache", { recursive: true });
const staging = fs.mkdtempSync(path.join(project, ".cache", "seo-build-"));
const run = (args) => {
  const result = spawnSync(process.execPath, args, { stdio: "inherit", cwd: project });
  if (result.status !== 0) process.exit(result.status || 1);
};
run(["node_modules/@11ty/eleventy/cmd.cjs", "--quiet", "--output=" + staging]);
run(["scripts/audit-seo.mjs", staging]);
const dist = path.join(project, "dist");
fs.mkdirSync(dist, { recursive: true });
if (fs.realpathSync(dist) !== dist) throw new Error("Refusing to modify a linked output directory.");
const obsolete = fs.readdirSync(dist, { recursive: true })
  .filter(file => file.endsWith(".html") && !file.replaceAll("\\", "/").startsWith("test/") && !fs.existsSync(path.join(staging, file)));
for (const file of obsolete) {
  const target = path.resolve(dist, file);
  if (!target.startsWith(dist + path.sep) || fs.realpathSync(target) !== target) throw new Error("Unsafe generated file path");
  fs.unlinkSync(target);
}
fs.cpSync(staging, dist, { recursive: true });
console.log("Validated build copied to dist; removed " + obsolete.length + " obsolete generated HTML files.");
