/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{njk,md,js}",
    "./_includes/**/*.{njk,md,js}",
    ".eleventy.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
