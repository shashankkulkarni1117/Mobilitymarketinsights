
import type { NewsRecord } from "./types.mts";

function monthRange(month: string) {
  const [year, mon] = month.split("-").map(Number);
  const from = `${month}-01`;
  const next = new Date(Date.UTC(year, mon, 1));
  const to = new Date(next.getTime() - 86400000).toISOString().slice(0, 10);
  return { from, to };
}

function clean(value = "") {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function idFromUrl(url: string) {
  return Buffer.from(url).toString("base64url").slice(0, 48);
}

export async function searchNewsApi(config: any, month: string): Promise<NewsRecord[]> {
  const apiKey = Netlify.env.get("NEWS_API_KEY");
  if (!apiKey) throw new Error("NEWS_API_KEY is not configured.");

  const { from, to } = monthRange(month);
  const params = new URLSearchParams({
    q: config.query,
    from,
    to,
    sortBy: "publishedAt",
    pageSize: "25",
    language: "en",
    apiKey
  });

  const response = await fetch(`https://newsapi.org/v2/everything?${params}`);
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`NewsAPI ${response.status}: ${body}`);
  }

  const payload = await response.json() as any;
  return (payload.articles || [])
    .filter((article: any) => article.url && article.title && article.publishedAt)
    .map((article: any) => {
      const date = String(article.publishedAt).slice(0, 10);
      return {
        id: idFromUrl(article.url),
        country: config.country,
        region: config.region,
        month,
        date,
        category: config.category,
        title: clean(article.title),
        text: clean(article.description || article.title).slice(0, 420),
        source: article.source?.name || new URL(article.url).hostname,
        url: article.url,
        eventType: config.label,
        approved: false,
        fetchedAt: new Date().toISOString()
      } satisfies NewsRecord;
    })
    .filter((item: NewsRecord) => item.date.startsWith(month));
}
