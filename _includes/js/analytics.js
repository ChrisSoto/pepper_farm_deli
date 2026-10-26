// Only categorical values are sent; never form fields, query strings, or contact details.
(() => {
  window.dataLayer = window.dataLayer || [];
  window.trackDeliEvent = (event, details = {}) => {
    window.dataLayer.push({ event, page_path: window.location.pathname, ...details });
  };
  document.addEventListener("click", (event) => {
    const link = event.target.closest?.("a[href]");
    if (!link) return;
    const url = new URL(link.href, window.location.href);
    const placement = link.closest("header") ? "header" : link.closest("footer") ? "footer" : "content";
    if (url.protocol === "tel:") {
      window.trackDeliEvent("phone_click", { placement });
    } else if (["order.toasttab.com", "www.ubereats.com", "www.grubhub.com", "www.doordash.com"].includes(url.hostname)) {
      window.trackDeliEvent("order_click", { placement, order_provider: url.hostname });
    } else if (url.hostname === "maps.app.goo.gl" || (url.hostname === "www.google.com" && url.pathname.startsWith("/maps"))) {
      window.trackDeliEvent("directions_click", { placement });
    } else if (url.origin === window.location.origin && url.pathname === "/catering-inquiry/") {
      window.trackDeliEvent("catering_inquiry_click", { placement });
    }
  });
})();
