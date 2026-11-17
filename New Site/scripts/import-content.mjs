import fs from 'node:fs';
import path from 'node:path';
import {load} from 'cheerio';
import localArticles from '../../_data/localArticles.js';
const root=path.resolve('..'), out=path.resolve('public'), data=path.resolve('data');
fs.mkdirSync(data,{recursive:true});fs.mkdirSync(path.join(out,'images'),{recursive:true});
function asset(src){
 if(!src)return '';
 if(src.startsWith('//'))return 'https:'+src;
 if(src.startsWith('http'))return src;
 const file=path.join(root,'dist',src.replace(/^\//,''));
 if(!fs.existsSync(file))return '';
 const name=path.basename(src);fs.copyFileSync(file,path.join(out,'images',name));return '/images/'+name;
}
for(const [from,to] of [['src/assets/img/logo.webp','logo.webp'],['src/assets/img/featured_product_dish.png','hero.png'],['src/assets/breakfast-burrito.png','breakfast-burrito.png'],['src/assets/catering-landing.webp','catering.webp'],['src/assets/img/store-image.png','store.png'],['src/assets/team.webp','team.webp']]){
 if(fs.existsSync(path.join(root,from)))fs.copyFileSync(path.join(root,from),path.join(out,'images',to));
}
const $=load(fs.readFileSync(path.join(root,'dist/menu/index.html'),'utf8'));
let category='Menu';const items=new Map();
$('.category-header,.product').each((_,el)=>{const e=$(el);if(e.hasClass('category-header')){category=e.find('h2').text().trim();return;}
 const a=e.find('h3 a').first(),slug=a.attr('href')?.split('/').filter(Boolean).pop();if(!slug)return;
 const im=e.find('img').first();
 items.set(slug,{slug,name:a.text().trim(),category,price:e.find('data').attr('value')||'',description:e.find('p').first().text().trim(),image:/unavailable/i.test(im.attr('alt')||'')?'':asset(im.attr('src')),orderUrl:e.find('a').filter((_,a)=>($(a).attr('href')||'').startsWith('https://order.toasttab.com')).last().attr('href')||''});
});
items.set('breakfast-burrito',{slug:'breakfast-burrito',name:'Egg & Cheese Breakfast Burrito',category:'Breakfast',price:'7.99',description:'Warm eggs and cheese wrapped in a toasted tortilla. A satisfying start to your Santee morning.',image:'/images/breakfast-burrito.png',orderUrl:''});
const blogs=[];
for(const folder of fs.readdirSync(path.join(root,'dist/blog'),{withFileTypes:true}).filter(x=>x.isDirectory())){
 const file=path.join(root,'dist/blog',folder.name,'index.html');if(!fs.existsSync(file))continue;
 const b=load(fs.readFileSync(file,'utf8'));const article=b('article').first().length?b('article').first():b('main');
 const title=article.find('h1').first().text().trim();if(!title)continue;
 const known=localArticles.find(x=>x.slug===folder.name);
 const body=article.clone();body.find('nav,h1,time,script,style').remove();body.find('p').filter((_,e)=>/^By Pepper Farm/.test(b(e).text())).remove();
 const image=asset(article.find('img').first().attr('src'));
 body.find('img').remove();body.find('*').each((_,e)=>{for(const key of Object.keys(e.attribs||{}))if(!['href'].includes(key))b(e).removeAttr(key);});
 blogs.push({slug:folder.name,title,date:known?.date||article.find('time').attr('datetime')||'2026-09-15',description:known?.description||b('meta[name="description"]').attr('content')||'',image,html:body.html()||''});
}
blogs.sort((a,b)=>b.date.localeCompare(a.date));
const pages={};
for(const slug of ['privacy-policy','terms-of-use','best-sandwiches','healthy-food','same-day-catering','links']){
 const file=path.join(root,'dist',slug,'index.html');if(!fs.existsSync(file))continue;
 const p=load(fs.readFileSync(file,'utf8'));const main=p('main').first();const title=main.find('h1').first().text();main.find('script,style,nav,form,h1').remove();
 main.find('img').each((_,e)=>p(e).attr('src',asset(p(e).attr('src'))));main.find('*').each((_,e)=>{for(const key of Object.keys(e.attribs||{}))if(!['href','src','alt'].includes(key))p(e).removeAttr(key);});
 pages[slug]={title,html:main.html()||''};
}
fs.writeFileSync(path.join(data,'content.json'),JSON.stringify({menu:[...items.values()],blogs,pages},null,2));
console.log(`Imported ${items.size} menu items, ${blogs.length} articles, ${Object.keys(pages).length} supporting pages.`);
