
import type { Config, Context } from "@netlify/functions";

export default async(_req:Request,_context:Context)=>{
  return Response.json({
    generatedAt:new Date().toISOString(),
    count:0,
    items:[],
    message:"Review is disabled. Portfolio-relevant items are published automatically."
  });
};

export const config:Config={
  path:"/api/review-queue",
  method:["GET"]
};
