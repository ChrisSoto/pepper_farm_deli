export const json = (value) => JSON.stringify(value ?? null).replace(/</g, "\\u003c");

export function menuDescription(description, name) {
  const text = typeof description === "string" ? description.trim() : "";
  return text && !/^description comings? soon\.*$/i.test(text)
    ? text : `Explore ${name} on Pepper Farm Deli's Santee menu. Contact the deli for current ingredients and availability.`;
}

export function foodSchema(entry, url) {
  const data = entry.fields || entry;
  const item = { "@context": "https://schema.org", "@type": "MenuItem",
    name: data.name, description: menuDescription(data.description, data.name), url };
  const image = data.images?.[0]?.fields?.file?.url;
  if (image) item.image = image.startsWith("//") ? `https:${image}` : image;
  const prices = data.complexPrice?.map(({ fields }) => ({
    "@type": "Offer", name: fields.protion || fields.portion,
    price: fields.value, priceCurrency: "USD", url,
  })) || [];
  if (data.price !== undefined && data.price !== null && data.price !== "") {
    prices.unshift({ "@type": "Offer", price: data.price, priceCurrency: "USD", url });
  }
  const valid = prices.filter((offer) => Number.isFinite(Number(offer.price)) && Number(offer.price) > 0);
  if (valid.length) item.offers = valid.length === 1 ? valid[0] : valid;
  return item;
}

export function sitemapEntries(pages) {
  return [...new Set(pages.map((item) => item.url).filter((url) => url?.endsWith("/") && !url.startsWith("/test/")))].sort();
}
