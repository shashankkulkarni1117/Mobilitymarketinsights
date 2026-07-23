import { getDeployStore, getStore } from "@netlify/blobs";

export function newsStore() {
  return Netlify.context?.deploy?.context === "production"
    ? getStore("marketpulse-news", { consistency: "strong" })
    : getDeployStore("marketpulse-news");
}
