import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { json, foodSchema, menuDescription } from "../utility/seo.js";

const hostile = 'A "quoted" name\n</script><script>alert(1)</script>';
assert.equal(JSON.parse(json(hostile)), hostile);
assert.ok(!json(hostile).includes("</script>"));
assert.ok(!menuDescription("Description comings soon...", "Side").includes("comings"));
assert.ok(!("offers" in foodSchema({ name: "Wrap" }, "/wrap/")));
const catering = foodSchema({ fields: { name: hostile, complexPrice: [{ fields: { protion: "6 halves", value: 45 } }] } }, "/wrap/");
assert.equal(catering.offers.price, 45);
assert.equal(catering.offers.name, "6 halves");
assert.ok(!("availability" in catering.offers));

const trackingSource = fs.readFileSync("_includes/js/analytics.js", "utf8");
const formSource = fs.readFileSync("_includes/js/main.js", "utf8");
async function scenario(ok, result) {
  const listeners = {};
  const context = {
    window: { location: { pathname: "/catering-inquiry/", href: "https://pepperfarmdeli.com/catering-inquiry/?email=private", origin: "https://pepperfarmdeli.com" }, dataLayer: [] },
    document: { addEventListener: (name, fn) => listeners[name] = fn, getElementById: () => null, querySelectorAll: () => [] },
    URL, console, fetch: async () => ({ ok, json: async () => result }), $: () => ({ trigger() {} }),
  };
  vm.createContext(context);
  vm.runInContext(trackingSource, context);
  vm.runInContext(formSource, context);
  vm.runInContext('sendForm({ id: "contact-form", url: "/test-only", data: "{}" })', context);
  await new Promise(resolve => setImmediate(resolve));
  return { context, listeners };
}
for (const [ok, result] of [[false, {}], [true, {}]]) {
  const { context } = await scenario(ok, result);
  assert.equal(context.window.dataLayer.some(e => e.event === "generate_lead"), false);
  assert.equal(context.window.dataLayer.filter(e => e.event === "form_error").length, 1);
}
const { context, listeners } = await scenario(true, { result: "confirmed" });
assert.equal(context.window.dataLayer.filter(e => e.event === "generate_lead").length, 1);
for (const href of ["tel:+16192018129", "https://order.toasttab.com/online/deli?email=private", "https://maps.app.goo.gl/example"]) {
  listeners.click({ target: { closest: () => ({ href, closest: () => null }) } });
}
assert.deepEqual(Array.from(context.window.dataLayer.slice(-3), e => e.event), ["phone_click", "order_click", "directions_click"]);
assert.ok(!JSON.stringify(context.window.dataLayer).includes("private"));
console.log("SEO serialization and analytics success/failure tests passed.");
