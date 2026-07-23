
import type { Config, Context } from "@netlify/functions";

export default async (req: Request, _context: Context) => {
  const token = Netlify.env.get("REFRESH_TOKEN");

  if (!token || req.headers.get("x-refresh-token") !== token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json() as { ids?: string[] };
  const endpoint = new URL("/api/review-action", req.url);

  return fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-refresh-token": token
    },
    body: JSON.stringify({
      approveIds: body.ids || [],
      rejectIds: []
    })
  });
};

export const config: Config = {
  path: "/api/approve-news",
  method: ["POST"]
};
