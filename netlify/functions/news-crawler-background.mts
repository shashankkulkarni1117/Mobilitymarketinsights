
import type { Context } from "@netlify/functions";
import configs from "../../data/global-search-config.json" with { type: "json" };
import { newsStore } from "./_shared/store.mts";
import { searchNewsApi } from "./_shared/newsapi.mts";

function latestThreeMonths(): string[] {
  const result: string[] = [];
  const now = new Date();

  for (let offset = 0; offset < 3; offset++) {
    const date = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1)
    );
    result.push(date.toISOString().slice(0, 7));
  }

  return result;
}

function dedupe(items: any[]) {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = String(item.url || item.id || "").toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default async (_req: Request, _context: Context) => {
  const store = newsStore();
  const existingQueue = await store.get(
    "review-queue.json",
    { type: "json" }
  ) as any;

  const candidates: any[] = [...(existingQueue?.items || [])];
  const errors: Array<{ query: string; error: string }> = [];

  for (const month of latestThreeMonths()) {
    for (const config of configs as any[]) {
      try {
        const results = await searchNewsApi(config, month);
        candidates.push(
          ...results.map((item) => ({
            ...item,
            confidence: 60
          }))
        );
      } catch (error) {
        errors.push({
          query: `${config.country}:${config.category}:${month}`,
          error: String(error)
        });
      }
    }
  }

  const items = dedupe(candidates).sort(
    (a, b) => String(b.date).localeCompare(String(a.date))
  );

  await store.setJSON("review-queue.json", {
    generatedAt: new Date().toISOString(),
    count: items.length,
    errors,
    items
  });
};
