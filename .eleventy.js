import { EleventyHtmlBasePlugin } from "@11ty/eleventy";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import EleventyFetch from "@11ty/eleventy-fetch";

import CleanCSS from 'clean-css';

import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import contentful from "contentful";

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_KEY,
});

const home_end = "https://cdn.contentful.com/spaces/" + process.env.CONTENTFUL_SPACE_ID + "/environments/master/entries/" + process.env.HOME_ID + "?access_token=" + process.env.CONTENTFUL_ACCESS_KEY + "&include=3";
export default function (eleventyConfig) {

  let contentfulData = null;

  eleventyConfig.addGlobalData("home", () => {
    return client.getEntry(process.env.HOME_ID).then((homePage) => {
      return homePage.fields;
    });
  });

  eleventyConfig.addGlobalData("menu", () => {
    return client.getEntries({'include': 2, 'sys.id': process.env.MAIN_MENU})
      .then((data) => {
        const menu = data.items[0].fields.productCategories;
        return menu;
      })
  });

  eleventyConfig.addGlobalData("catering", () => {
    return client.getEntries({'include': 3, 'sys.id': process.env.CATERING_MENU})
      .then((data) => {
        const menu = data.items[0].fields.cateringSections;
        return menu;
      })
  });

  eleventyConfig.addGlobalData("products", () => {
    return client.getEntries({'include': 2, 'sys.id': process.env.MAIN_MENU})
      .then((data) => {
        const menu = data.items[0].fields.productCategories;

        let allProducts = [];

        // transform data so that I can also have only products for product pagination
        menu.forEach((category) => {
          if("products" in category.fields) {
            category.fields.products.forEach((product) => {
              let productFields = product.fields;
              productFields.category = category.fields.name;
              allProducts.push(productFields);
            });
          }
        });

        return allProducts;
      })
  });

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
  })

  eleventyConfig.addPassthroughCopy({ "src/favicon": "/" });
  eleventyConfig.addPassthroughCopy("src/site.webmanifest");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/browserconfig.xml");

  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });

  eleventyConfig.setWatchThrottleWaitTime(60000);
}

export const config = {
  dir: {
    includes: "../_includes",
    data: "../_data",
    input: "src",
    output: "dist"
  }
};