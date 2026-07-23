
import type { Config, Context } from "@netlify/functions";

export default async (req: Request, _context: Context) => {
  const crawlerUrl = new URL(
    "/.netlify/functions/news-crawler-background",
    req.url
  );
  await fetch(crawlerUrl, { method: "POST" });
};

export const config: Config = {
  schedule: "0 2 * * *"
};
