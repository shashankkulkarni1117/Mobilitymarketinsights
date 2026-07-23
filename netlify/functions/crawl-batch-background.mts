
import type { Context } from "@netlify/functions";
import seed from "../../data/news.json" with {type:"json"};
import sources from "../../data/sources.json" with {type:"json"};
import configs from "../../data/global-search-config.json" with {type:"json"};
import { newsStore } from "./_shared/store.mts";
import { searchGdelt } from "./_shared/free-search.mts";
import { crawlSource } from "./_shared/direct-crawler.mts";
import { evaluateArticle } from "./_shared/portfolio-filter.mts";

function unique(items:any[]){
  return [...new Map(items.map(x=>[String(x.url||x.id).toLowerCase(),x])).values()];
}

export default async(req:Request,_context:Context)=>{
  const u=new URL(req.url);
  const region=u.searchParams.get("region")||"";
  const month=u.searchParams.get("month")||"";
  if(!region||!/^\d{4}-\d{2}$/.test(month))throw new Error("region and month required");

  const store=newsStore();
  const currentNews=await store.get("news.json",{type:"json"}) as any;
  const discovered:any[]=[];

  for(const source of (sources as any[]).filter(x=>String(x.region).toUpperCase()===region.toUpperCase())){
    try{
      discovered.push(...(await crawlSource(source,month)).map(x=>({...x,confidence:78})));
    }catch{}
  }

  for(const config of (configs as any[]).filter(x=>String(x.region).toUpperCase()===region.toUpperCase())){
    try{
      discovered.push(...await searchGdelt(config,month));
    }catch{}
  }

  const published=discovered
    .map(evaluateArticle)
    .filter(Boolean)
    .filter((x:any)=>Number(x.confidence||0)>=60)
    .map((x:any)=>({...x,approved:true}));

  const newsItems=unique([
    ...published,
    ...(currentNews?.items||seed)
  ]).sort((a:any,b:any)=>String(b.date).localeCompare(String(a.date)));

  await store.setJSON("news.json",{
    generatedAt:new Date().toISOString(),
    autoPublishedCount:published.length,
    items:newsItems
  });

  await store.setJSON("review-queue.json",{
    generatedAt:new Date().toISOString(),
    count:0,
    items:[]
  });

  await store.setJSON(`job-${region}-${month}.json`,{
    completedAt:new Date().toISOString(),
    region,
    month,
    discovered:discovered.length,
    autoPublished:published.length,
    reviewRequired:false
  });
};
