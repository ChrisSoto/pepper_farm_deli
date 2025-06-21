import { EleventyHtmlBasePlugin } from "@11ty/eleventy";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import EleventyFetch from "@11ty/eleventy-fetch";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";

import CleanCSS from "clean-css";

import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import contentful from "contentful";
import { getW3CDate } from "./utility/util.js";

import MarkdownIt from "markdown-it";

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_KEY,
});

//update 3

function richTextOptions() {
  return {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node) => {
        const alt = node.data.target.fields.description;
        const url = node.data.target.fields.file.url;
        return `
          <div class="blog-image flex flex-row justify-center items-center">
            <img src="https:${url}?w=650" alt="${alt}">
          </div>
        `;
      },
    },
  };
}

export default function (eleventyConfig) {
  let contentfulData = null;

  eleventyConfig.addGlobalData("home", () => {
    return client.getEntry(process.env.HOME_ID).then((homePage) => {
      return homePage.fields;
    });
  });

  eleventyConfig.addGlobalData("menu", () => {
    return client
      .getEntries({ include: 2, "sys.id": process.env.MAIN_MENU })
      .then((data) => {
        const menu = data.items[0].fields.productCategories;
        return menu;
      });
  });

  eleventyConfig.addGlobalData("catering", () => {
    return client
      .getEntries({ include: 3, "sys.id": process.env.CATERING_MENU })
      .then((data) => {
        const menu = data.items[0].fields.cateringSections;
        return menu;
      });
  });

  eleventyConfig.addGlobalData("contactFaqs", () => {
    return client
      .getEntries({ include: 2, "sys.id": process.env.CONTACT_FAQ })
      .then((data) => {
        const faqs = data.items[0].fields.items;
        return faqs;
      });
  });

  eleventyConfig.addGlobalData("blog", () => {
    return client
      .getEntries({ include: 3, "sys.id": process.env.BLOG_LIST })
      .then((data) => {
        const posts = data.items[0].fields.items;
        return posts;
      });
  });

  eleventyConfig.addGlobalData("landings", () => {
    return client
      .getEntries({ include: 3, "sys.id": process.env.LANDING_PAGES })
      .then((data) => {
        const posts = data.items[0].fields.items;
        return posts;
      });
  });

  eleventyConfig.addGlobalData("products", () => {
    return client
      .getEntries({ include: 2, "sys.id": process.env.MAIN_MENU })
      .then((data) => {
        const menu = data.items[0].fields.productCategories;

        let allProducts = [];

        // transform data so that I can also have only products for product pagination
        menu.forEach((category) => {
          if ("products" in category.fields) {
            category.fields.products.forEach((product) => {
              let productFields = product.fields;
              productFields.category = category.fields.name;
              allProducts.push(productFields);
            });
          }
        });

        return allProducts;
      });
  });

  // rerun5
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    extensions: "html",
    formats: ["webp"],
    defaultAttributes: {
      loading: "lazy",
      decoding: "async",
    },
  });

  eleventyConfig.addPassthroughCopy({
    "global.out.css": "/css/global.css",
  });

  eleventyConfig.addPassthroughCopy({
    "src/assets": "assets",
  });

  eleventyConfig.addPassthroughCopy({ "src/favicon": "/" });
  eleventyConfig.addPassthroughCopy({ "app/catering/dist": "/test" });
  eleventyConfig.addPassthroughCopy("src/site.webmanifest");
  eleventyConfig.addPassthroughCopy("src/browserconfig.xml");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });

  eleventyConfig.addFilter("w3c", (date) => {
    return getW3CDate(date);
  });

  eleventyConfig.addFilter("md", (string) => {
    return MarkdownIt().render(string);
  });

  eleventyConfig.addFilter("cfimg", (url) => {
    if (url) return "https:" + url;
    return "/assets/img/broken.webp";
  });

  eleventyConfig.addFilter("richText", (data) => {
    return documentToHtmlString(data, richTextOptions());
  });
}

export const config = {
  dir: {
    includes: "../_includes",
    data: "../_data",
    input: "src",
    output: "dist",
  },
};
