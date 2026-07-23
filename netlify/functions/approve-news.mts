import type { Config, Context } from "@netlify/functions";
import seed from "../../data/news.json" with { type: "json" };
import { newsStore } from "./_shared/store.mts";

export default async (req: Request, _context: Context) => {
  const token = Netlify.env.get("REFRESH_TOKEN");
  if (!token || req.headers.get("x-refresh-token") !== token) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { ids = [] } = await req.json() as { ids?: string[] };
  const store = newsStore();
  const queue = await store.get("review-queue.json", { type: "json" }) as any;
  const current = await store.get("news.json", { type: "json" }) as any;
  const selected = (queue?.items || []).filter((x:any) => ids.includes(x.id)).map((x:any) => ({...x, approved:true}));
  const merged = [...selected, ...(current?.items || seed)];
  await store.setJSON("news.json", { generatedAt:new Date().toISOString(), items: merged });
  return Response.json({ approved: selected.length });
};
export const config: Config = { path: "/api/approve-news", method: ["POST"] };
