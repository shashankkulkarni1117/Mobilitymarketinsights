import type { Config, Context } from "@netlify/functions";
import { newsStore } from "./_shared/store.mts";
export default async (_req: Request, _context: Context) => {
  const queue = await newsStore().get("review-queue.json", { type: "json" });
  return Response.json(queue || { generatedAt: null, count: 0, items: [] });
};
export const config: Config = { path: "/api/review-queue", method: ["GET"] };
