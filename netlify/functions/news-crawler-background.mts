
import type { Context } from "@netlify/functions";
import configs from "../../data/global-search-config.json" with { type: "json" };
import { newsStore } from "./_shared/store.mts";
import { searchNewsApi } from "./_shared/newsapi.mts";

function recentMonths(count = 2): string[] {
  const result: string[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    result.push(d.toISOString().slice(0, 7));
  }
  return result;
}

function dedupe(items: any[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = String(item.url || item.id).toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default async (_req: Request, _context: Context) => {
  const store = newsStore();
  const existing = await store.get("review-queue.json", { type: "json" }) as any;
  const candidates: any[] = [...(existing?.items || [])];
  const errors: Array<{query:string;error:string}> = [];

  for (const month of recentMonths(2)) {
    for (const config of configs as any[]) {
      try {
        candidates.push(...await searchNewsApi(config, month));
      } catch (error) {
        errors.push({
          query: `${config.country}:${config.category}:${month}`,
          error: String(error)
        });
      }
    }
  }

  const items = dedupe(candidates);
  await store.setJSON("review-queue.json", {
    generatedAt: new Date().toISOString(),
    count: items.length,
    errors,
    items
  });
};
