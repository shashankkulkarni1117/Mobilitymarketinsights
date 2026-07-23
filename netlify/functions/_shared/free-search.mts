import type { NewsRecord } from "./types.mts";
import { isExactArticleUrl } from "./article-url.mts";
function clean(v=""){return v.replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();}
function idFromUrl(url:string){return Buffer.from(url).toString("base64url").slice(0,48);}
export async function searchGdelt(config:any,month:string):Promise<NewsRecord[]>{
 const [y,m]=month.split("-").map(Number);const start=`${month.replace("-","")}01000000`;const next=new Date(Date.UTC(y,m,1)).toISOString().slice(0,10).replaceAll("-","")+"000000";
 const p=new URLSearchParams({query:config.query,mode:"artlist",maxrecords:"50",format:"json",sort:"datedesc",startdatetime:start,enddatetime:next});
 const r=await fetch(`https://api.gdeltproject.org/api/v2/doc/doc?${p}`);if(!r.ok)return[];const body=await r.json() as any;
 return (body.articles||[]).map((a:any)=>{const raw=String(a.seendate||"");const date=raw.slice(0,8).replace(/(\d{4})(\d{2})(\d{2})/,"$1-$2-$3");const url=a.url||"";return{id:idFromUrl(url),country:config.country,region:config.region,month,date,category:config.category,title:clean(a.title||""),text:clean(a.title||""),source:a.domain||"GDELT source",url,eventType:config.label,confidence:55,approved:false,fetchedAt:new Date().toISOString()} satisfies NewsRecord;}).filter((x:NewsRecord)=>isExactArticleUrl(x.url)&&x.title&&x.date.startsWith(month)).map((x:NewsRecord)=>({...x,exactArticleUrl:true,originalTitle:x.title} as NewsRecord));
}