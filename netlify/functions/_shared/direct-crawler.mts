import type { NewsRecord } from "./types.mts";
import { isExactArticleUrl } from "./article-url.mts";
function clean(v=""){return v.replace(/<script[\s\S]*?<\/script>/gi," ").replace(/<style[\s\S]*?<\/style>/gi," ").replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();}
function idFromUrl(url:string){return Buffer.from(url).toString("base64url").slice(0,48);}
async function getText(url:string){const r=await fetch(url,{redirect:"follow",headers:{"user-agent":"MarketMobilityInsights/3.5"}});if(!r.ok)throw new Error(`${r.status} ${url}`);return{html:await r.text(),finalUrl:r.url};}
function extractLinks(html:string,base:string){const out=new Set<string>();for(const m of html.matchAll(/<a[^>]+href=["']([^"'#]+)["']/gi)){try{const u=new URL(m[1],base).toString();if(isExactArticleUrl(u))out.add(u);}catch{}}return[...out];}
function readMeta(html:string){const title=(html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i)||[])[1]||(html.match(/<title>([\s\S]*?)<\/title>/i)||[])[1]||"";const description=(html.match(/<meta[^>]+(?:name|property)=["'](?:description|og:description)["'][^>]+content=["']([^"']+)/i)||[])[1]||"";const published=(html.match(/<meta[^>]+(?:property|name)=["'](?:article:published_time|datePublished|date)["'][^>]+content=["']([^"']+)/i)||[])[1]||(html.match(/"datePublished"\s*:\s*"([^"]+)"/i)||[])[1]||"";return{title:clean(title),description:clean(description),published};}
export async function crawlSource(source:any,month:string):Promise<NewsRecord[]>{
 const starts=[...(source.startUrls||[]),...(source.sitemaps||[]),source.baseUrl].filter(Boolean);const candidates=new Set<string>();
 for(const s of starts){try{const{html,finalUrl}=await getText(s);for(const u of extractLinks(html,finalUrl)){const host=new URL(u).hostname.replace(/^www\./,"");if((source.domains||[]).some((d:string)=>host===d||host.endsWith(`.${d}`)))candidates.add(u);}}catch{}}
 const records:NewsRecord[]=[];
 for(const candidate of [...candidates].slice(0,80)){try{const{html,finalUrl}=await getText(candidate);if(!isExactArticleUrl(finalUrl))continue;const a=readMeta(html);const date=a.published?new Date(a.published).toISOString().slice(0,10):"";if(!date.startsWith(month)||!a.title)continue;records.push({id:idFromUrl(finalUrl),country:source.country,region:source.region,month,date,category:"competition",title:a.title,originalTitle:a.title,text:a.description||a.title,source:source.name,url:finalUrl,exactArticleUrl:true,confidence:78,approved:false,fetchedAt:new Date().toISOString()} as NewsRecord);}catch{}}
 return records;
}