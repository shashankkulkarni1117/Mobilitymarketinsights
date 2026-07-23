import type { Config, Context } from "@netlify/functions";
import fuelPrices from "../../data/fuel-prices.json" with { type: "json" };

export default async (req: Request, _context: Context) => {
  const url = new URL(req.url);
  const country = url.searchParams.get("country") || "";
  const month = url.searchParams.get("month") || "";

  if (!country || !/^\d{4}-\d{2}$/.test(month)) {
    return Response.json(
      {
        status: "error",
        message: "country and a valid month are required."
      },
      { status: 400 }
    );
  }

  const record = (fuelPrices as any[]).find(
    (item) =>
      item.country.toLowerCase() === country.toLowerCase() &&
      item.month === month &&
      item.verified === true
  );

  if (!record) {
    return Response.json({
      status: "NA",
      country,
      month,
      points: []
    });
  }

  return Response.json({
    status: "ok",
    country,
    month,
    currency: record.currency,
    source: record.source,
    points: [
      {
        day: 1,
        value: record.pricePerLitre
      }
    ]
  });
};

export const config: Config = {
  path: "/api/fuel",
  method: ["GET"]
};
