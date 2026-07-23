
import type { Config, Context } from "@netlify/functions";

function lastDayOfMonth(month: string): string {
  const [year, monthNumber] = month.split("-").map(Number);
  return new Date(Date.UTC(year, monthNumber, 0))
    .toISOString()
    .slice(0, 10);
}

function selectWeeklyPoints(
  rows: Array<{ date: string; rate: number }>
): Array<{ day: number; value: number }> {
  const targets = [1, 5, 10, 15, 20, 25, 31];

  const points = targets
    .map((target) => {
      if (!rows.length) return null;

      return rows.reduce((closest, row) => {
        const day = Number(row.date.slice(-2));
        const closestDay = Number(closest.date.slice(-2));
        return Math.abs(day - target) < Math.abs(closestDay - target)
          ? row
          : closest;
      });
    })
    .filter(
      (
        row,
        index,
        array
      ): row is { date: string; rate: number } =>
        Boolean(row) &&
        array.findIndex(
          (candidate) =>
            candidate?.date === row?.date &&
            candidate?.rate === row?.rate
        ) === index
    );

  return points
    .map((row) => ({
      day: Number(row.date.slice(-2)),
      value: row.rate
    }))
    .sort((a, b) => a.day - b.day);
}

export default async (req: Request, _context: Context) => {
  const url = new URL(req.url);
  const currency = (url.searchParams.get("currency") || "").toUpperCase();
  const month = url.searchParams.get("month") || "";

  if (!/^[A-Z]{3}$/.test(currency) || !/^\d{4}-\d{2}$/.test(month)) {
    return Response.json(
      {
        status: "error",
        message: "A valid ISO currency and YYYY-MM month are required."
      },
      { status: 400 }
    );
  }

  if (currency === "USD") {
    return Response.json({
      status: "ok",
      provider: "USD base",
      currency,
      month,
      points: [{ day: 1, value: 1 }]
    });
  }

  const from = `${month}-01`;
  const to = lastDayOfMonth(month);

  try {
    const endpoint =
      `https://api.frankfurter.dev/v2/rates` +
      `?base=USD` +
      `&quotes=${encodeURIComponent(currency)}` +
      `&from=${from}` +
      `&to=${to}`;

    const response = await fetch(endpoint, { cache: "no-store" });

    if (!response.ok) {
      return Response.json({
        status: "NA",
        provider: "Frankfurter v2",
        currency,
        month,
        points: []
      });
    }

    const payload = await response.json() as Array<{
      date?: string;
      base?: string;
      quote?: string;
      rate?: number;
    }>;

    const rows = (Array.isArray(payload) ? payload : [])
      .filter(
        (row) =>
          row.quote === currency &&
          typeof row.date === "string" &&
          typeof row.rate === "number" &&
          Number.isFinite(row.rate)
      )
      .map((row) => ({
        date: row.date as string,
        rate: row.rate as number
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const points = selectWeeklyPoints(rows);

    return Response.json({
      status: points.length ? "ok" : "NA",
      provider: "Frankfurter v2",
      currency,
      month,
      points
    });
  } catch (error) {
    return Response.json({
      status: "NA",
      provider: "Frankfurter v2",
      currency,
      month,
      points: [],
      message:
        error instanceof Error ? error.message : "Historical FX request failed."
    });
  }
};

export const config: Config = {
  path: "/api/fx",
  method: ["GET"]
};
