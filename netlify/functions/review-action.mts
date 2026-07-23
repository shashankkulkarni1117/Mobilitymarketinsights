
import type { Config, Context } from "@netlify/functions";
import seed from "../../data/news.json" with { type: "json" };
import { newsStore } from "./_shared/store.mts";

export default async (req: Request, _context: Context) => {
  const token = Netlify.env.get("REFRESH_TOKEN");

  if (!token || req.headers.get("x-refresh-token") !== token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json() as {
    approveIds?: string[];
    rejectIds?: string[];
  };

  const approveIds = new Set(body.approveIds || []);
  const rejectIds = new Set(body.rejectIds || []);

  const store = newsStore();
  const queue = await store.get(
    "review-queue.json",
    { type: "json" }
  ) as any;
  const current = await store.get(
    "news.json",
    { type: "json" }
  ) as any;

  const allQueueItems = queue?.items || [];

  const approved = allQueueItems
    .filter((item: any) => approveIds.has(item.id))
    .map((item: any) => ({
      ...item,
      approved: true,
      confidence: Math.max(Number(item.confidence || 0), 80)
    }));

  const remaining = allQueueItems.filter(
    (item: any) =>
      !approveIds.has(item.id) &&
      !rejectIds.has(item.id)
  );

  const merged = [
    ...approved,
    ...(current?.items || seed)
  ];

  const unique = [
    ...new Map(
      merged.map((item: any) => [item.url || item.id, item])
    ).values()
  ];

  await store.setJSON("news.json", {
    generatedAt: new Date().toISOString(),
    items: unique
  });

  await store.setJSON("review-queue.json", {
    generatedAt: new Date().toISOString(),
    count: remaining.length,
    items: remaining
  });

  return Response.json({
    approved: approved.length,
    rejected: rejectIds.size,
    remaining: remaining.length
  });
};

export const config: Config = {
  path: "/api/review-action",
  method: ["POST"]
};
