import fs from 'node:fs';
const html=fs.readFileSync('../dist/index.html','utf8');
const match=html.match(/id="hero-img"[^>]*url\('([^']+)'\)/);
const response=await fetch(match[1]);if(!response.ok)throw Error(response.status);
fs.writeFileSync('public/images/original-hero.webp',Buffer.from(await response.arrayBuffer()))
console.log('Original hero image copied locally.');
