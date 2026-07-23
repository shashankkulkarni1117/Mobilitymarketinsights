import type { Config, Context } from "@netlify/functions";

export default async(req:Request,_context:Context)=>{
  const month=new Date().toISOString().slice(0,7);
  const u=new URL("/.netlify/functions/crawl-batch-background",req.url);
  u.searchParams.set("region","MENA");
  u.searchParams.set("month",month);
  await fetch(u,{method:"POST"});
};

export const config:Config={
  schedule:"0 4 * * *"
};
