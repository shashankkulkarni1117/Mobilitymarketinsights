
import type { Config, Context } from "@netlify/functions";

export default async (req: Request, _context: Context) => {
  const origin = new URL(req.url).origin;
  await fetch(`${origin}/.netlify/functions/news-crawler-background`, { method: "POST" });
};

export const config: Config = {
  schedule: "0 2 * * *"
};
