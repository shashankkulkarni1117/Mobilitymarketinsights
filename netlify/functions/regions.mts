import type { Config, Context } from "@netlify/functions";
import data from "../../data/regions.json" with { type: "json" };
export default async (_req: Request, _context: Context) => Response.json(data);
export const config: Config = { path: "/api/regions", method: ["GET"] };
