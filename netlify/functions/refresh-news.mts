import type { Config, Context } from "@netlify/functions";
import seed from "../../data/news.json" with { type: "json" };
import { newsStore } from "./_shared/store.mts";

export default async (req: Request, _context: Context) => {
  const token = Netlify.env.get("REFRESH_TOKEN");
  if (!token || req.headers.get("x-refresh-token") !== token) {
    return new Response("Unauthorized", { status: 401 });
  }
  const store = newsStore();
  await store.setJSON("news.json", { generatedAt: new Date().toISOString(), items: seed });
  await store.setJSON("review-queue.json", { generatedAt: new Date().toISOString(), count: 0, items: [] });
  return Response.json({ refreshed: true, totalCount: (seed as any[]).length });
};
export const config: Config = { path: "/api/refresh-news", method: ["POST"] };
