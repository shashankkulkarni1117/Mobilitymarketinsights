
import type { Config, Context } from "@netlify/functions";
import regions from "../../data/regions.json" with { type: "json" };
import seed from "../../data/news.json" with { type: "json" };
import { newsStore } from "./_shared/store.mts";

const categories = [
  "competition",
  "ev",
  "policy",
  "threeWheeler",
  "social"
];

function latestThreeMonths() {
  const months: string[] = [];
  const now = new Date();

  for (let offset = 0; offset < 3; offset++) {
    const date = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - offset, 1)
    );
    months.push(date.toISOString().slice(0, 7));
  }

  return months;
}

export default async (_req: Request, _context: Context) => {
  const stored = await newsStore().get(
    "news.json",
    { type: "json" }
  ) as any;
  const news = stored?.items || seed;
  const rows: any[] = [];

  for (const month of latestThreeMonths()) {
    for (const region of regions as any[]) {
      for (const country of region.countries || []) {
        const countryItems = (news as any[]).filter(
          (item) =>
            item.approved !== false &&
            item.country === country.name &&
            item.month === month
        );

        const counts = Object.fromEntries(
          categories.map((category) => [
            category,
            countryItems.filter(
              (item) => item.category === category
            ).length
          ])
        );

        rows.push({
          region: region.name,
          country: country.name,
          month,
          counts,
          total: countryItems.length,
          covered: countryItems.length > 0
        });
      }
    }
  }

  return Response.json({
    generatedAt: new Date().toISOString(),
    months: latestThreeMonths(),
    rows
  });
};

export const config: Config = {
  path: "/api/coverage-live",
  method: ["GET"]
};
