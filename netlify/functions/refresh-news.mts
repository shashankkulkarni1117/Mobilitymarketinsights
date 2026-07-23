
import type { Config, Context } from "@netlify/functions";

export default async (req: Request, _context: Context) => {
  const token = Netlify.env.get("REFRESH_TOKEN");

  if (!token || req.headers.get("x-refresh-token") !== token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const crawlerUrl = new URL(
    "/.netlify/functions/news-crawler-background",
    req.url
  );

  const response = await fetch(crawlerUrl, { method: "POST" });

  return Response.json(
    {
      accepted: response.ok,
      message: response.ok
        ? "Three-month news crawl started. Review candidates after several minutes."
        : "Crawler could not be started."
    },
    { status: response.ok ? 202 : 500 }
  );
};

export const config: Config = {
  path: "/api/refresh-news",
  method: ["POST"]
};
