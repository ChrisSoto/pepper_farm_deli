import fs from 'node:fs';
import {load} from 'cheerio';
import sharp from 'sharp';
const $=load(fs.readFileSync('../dist/menu/crispy-chicken-chipotle-sandwich/index.html','utf8'));
let url;
$('script[type="application/ld+json"]').each((_,e)=>{try{const d=JSON.parse($(e).text());if(d['@type']==='MenuItem')url=d.image;}catch{}});
const response=await fetch(url+'?w=1200&fm=webp&q=90');if(!response.ok)throw Error(response.status);
fs.writeFileSync('public/images/hero-sandwich.webp',Buffer.from(await response.arrayBuffer()));
for(const name of ['breakfast-burrito','catering','store','team']){const source='public/images/'+name+(name==='breakfast-burrito'?'.png':name==='store'?'.png':'.webp');if(fs.existsSync(source)){const b=await sharp(source).resize({width:1400,withoutEnlargement:true}).webp({quality:85}).toBuffer();fs.writeFileSync('public/images/'+name+'-optimized.webp',b);}}
console.log('Hero image and optimized local photos ready');
