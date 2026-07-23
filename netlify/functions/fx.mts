import type { Config, Context } from "@netlify/functions";

function monthEnd(month: string): string {
  const [year, monthNumber] = month.split("-").map(Number);
  const nextMonth = new Date(Date.UTC(year, monthNumber, 1));
  return new Date(nextMonth.getTime() - 86_400_000)
    .toISOString()
    .slice(0, 10);
}

export default async (req: Request, _context: Context) => {
  const url = new URL(req.url);
  const currency = (url.searchParams.get("currency") || "").toUpperCase();
  const month = url.searchParams.get("month") || "";

  if (!/^[A-Z]{3}$/.test(currency) || !/^\d{4}-\d{2}$/.test(month)) {
    return Response.json(
      {
        status: "error",
        message: "Valid currency and month parameters are required."
      },
      { status: 400 }
    );
  }

  if (currency === "USD") {
    return Response.json({
      status: "ok",
      provider: "Fixed USD base",
      currency,
      month,
      points: [{ day: 1, value: 1 }]
    });
  }

  const startDate = `${month}-01`;
  const endDate = monthEnd(month);

  try {
    const endpoint =
      `https://api.frankfurter.app/${startDate}..${endDate}` +
      `?from=USD&to=${encodeURIComponent(currency)}`;

    const response = await fetch(endpoint);

    if (!response.ok) {
      return Response.json({
        status: "NA",
        provider: "Frankfurter",
        currency,
        month,
        points: []
      });
    }

    const payload = await response.json() as {
      rates?: Record<string, Record<string, number>>;
    };

    const allPoints = Object.entries(payload.rates || {})
      .map(([date, rates]) => ({
        day: Number(date.slice(-2)),
        value: rates[currency]
      }))
      .filter((point) => Number.isFinite(point.value));

    // Keep one point per week to avoid an overcrowded chart.
    const preferredDays = [1, 5, 10, 15, 20, 25, 31];
    const points = preferredDays
      .map((targetDay) =>
        allPoints.reduce<null | { day: number; value: number }>(
          (closest, point) => {
            if (!closest) return point;
            return Math.abs(point.day - targetDay) <
              Math.abs(closest.day - targetDay)
              ? point
              : closest;
          },
          null
        )
      )
      .filter(
        (
          point,
          index,
          array
        ): point is { day: number; value: number } =>
          Boolean(point) &&
          array.findIndex(
            (candidate) =>
              candidate?.day === point?.day &&
              candidate?.value === point?.value
          ) === index
      )
      .sort((a, b) => a.day - b.day);

    return Response.json({
      status: points.length ? "ok" : "NA",
      provider: "Frankfurter",
      currency,
      month,
      points
    });
  } catch (error) {
    return Response.json({
      status: "NA",
      provider: "Frankfurter",
      currency,
      month,
      points: [],
      message: error instanceof Error ? error.message : "FX request failed"
    });
  }
};

export const config: Config = {
  path: "/api/fx",
  method: ["GET"]
};
