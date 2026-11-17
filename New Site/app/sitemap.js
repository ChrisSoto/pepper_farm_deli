import content from '../data/content.json';

const base = 'https://pepperfarmdeli.com';
export const dynamic = 'force-static';

export default function sitemap() {
  const paths = [
    '/',
    '/menu/',
    '/breakfast-in-santee/',
    '/blog/',
    '/about/',
    '/catering/',
    '/catering-inquiry/',
    '/contact/',
    ...content.menu.map((item) => `/menu/${item.slug}/`),
    ...content.blogs.map((article) => `/blog/${article.slug}/`),
    ...Object.keys(content.pages).map((slug) => `/${slug}/`),
  ];

  return [...new Set(paths)].map((path) => ({ url: `${base}${path}` }));
}
