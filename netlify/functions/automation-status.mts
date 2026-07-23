
import type { Config, Context } from "@netlify/functions";
import { newsStore } from "./_shared/store.mts";

export default async(_req:Request,_context:Context)=>{
  const store=newsStore();
  const news=await store.get("news.json",{type:"json"}) as any;
  return Response.json({
    status:"fully-automatic-zero-review",
    generatedAt:news?.generatedAt||null,
    publishedItems:(news?.items||[]).length,
    reviewRequired:false,
    scope:{
      ice:"Motorcycles only, up to 400cc; ICE scooters excluded",
      ev:"Electric scooters and electric motorcycles",
      excluded:"Cars, buses, trucks, bicycles and motorcycles above 400cc"
    }
  });
};

export const config:Config={
  path:"/api/automation-status",
  method:["GET"]
};
