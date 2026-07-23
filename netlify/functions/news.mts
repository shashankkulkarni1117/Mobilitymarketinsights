import type { Config, Context } from "@netlify/functions";
import seed from "../../data/news.json" with { type: "json" };
import { newsStore } from "./_shared/store.mts";

export default async (req: Request, _context: Context) => {
  const url = new URL(req.url);
  const stored = await newsStore().get("news.json", { type: "json" }) as any;
  const all = stored?.items || seed;
  const items = (all as any[]).filter((item) =>
    item.approved !== false &&
    (!url.searchParams.get("month") || item.month === url.searchParams.get("month")) &&
    (!url.searchParams.get("region") || item.region === url.searchParams.get("region")) &&
    (!url.searchParams.get("country") || item.country === url.searchParams.get("country")) &&
    (!url.searchParams.get("category") || item.category === url.searchParams.get("category"))
  );
  return Response.json({ generatedAt: stored?.generatedAt || null, totalCount: items.length, items });
};
export const config: Config = { path: "/api/news", method: ["GET"] };
