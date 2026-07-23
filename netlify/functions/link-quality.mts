import type { Config, Context } from "@netlify/functions";
import seed from "../../data/news.json" with {type:"json"};
import { newsStore } from "./_shared/store.mts";
import { isExactArticleUrl } from "./_shared/article-url.mts";
export default async(_req:Request,_context:Context)=>{const stored=await newsStore().get("news.json",{type:"json"}) as any;const items=stored?.items||seed;const exact=(items as any[]).filter(x=>x.url&&isExactArticleUrl(x.url));const missing=(items as any[]).filter(x=>!x.url||!isExactArticleUrl(x.url));return Response.json({total:items.length,exactArticleLinks:exact.length,missingExactArticleLinks:missing.length,missing:missing.map(x=>({country:x.country,month:x.month,category:x.category,title:x.title||x.text,source:x.source}))});};
export const config:Config={path:"/api/link-quality",method:["GET"]};