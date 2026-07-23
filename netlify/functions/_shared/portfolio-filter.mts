
import type { NewsRecord } from "./types.mts";

const EXCLUDED = /\b(car|cars|automobile|suv|truck|bus|van|aircraft|ship|bicycle|e-bike|ebike)\b/i;
const ICE_SCOOTER = /\b(scooter|moped|maxi-scooter|underbone)\b/i;
const MOTORCYCLE = /\b(motorcycle|motorbike|motocicleta|motosiklet|motociclette|moto\b|roadster|commuter|naked bike|sportbike|cruiser|adventure bike|dual sport)\b/i;
const EV_2W = /\b(electric scooter|e-scooter|electric motorcycle|e-motorcycle|battery swapping|battery swap|electric two-wheeler|electric 2w|scooter elétric|moto elétric|scooter électrique|moto électrique)\b/i;
const THREE_W = /\b(three[- ]?wheeler|three wheel|tricycle|tuk[- ]?tuk|auto[- ]?rickshaw|e[- ]?rickshaw|cargo trike|mototaxi|motocarro|triciclo)\b/i;
const POLICY = /\b(regulation|policy|law|tax|duty|tariff|registration|licen[cs]e|emission|safety|standard|certification|incentive|subsidy|import|export|localization|road rule|ban)\b/i;
const SOCIAL = /\b(campaign|promotion|discount|dealer|showroom|test ride|roadshow|exhibition|motor show|csr|community|rider event|service camp|after-sales|anniversary)\b/i;

function ccValues(text: string): number[] {
  return [...text.matchAll(/\b(\d{2,4})\s?cc\b/gi)].map(m => Number(m[1]));
}

export function evaluateArticle(item: NewsRecord): NewsRecord | null {
  const text = `${item.title || ""} ${item.text || ""}`;

  if (EXCLUDED.test(text)) return null;

  let category = item.category;
  let score = Number(item.confidence || 50);

  if (POLICY.test(text)) {
    category = "policy";
    score += 20;
  } else if (THREE_W.test(text)) {
    category = "threeWheeler";
    score += 25;
  } else if (SOCIAL.test(text)) {
    category = "social";
    score += 15;
  } else if (EV_2W.test(text)) {
    category = "ev";
    score += 25;
  } else {
    if (ICE_SCOOTER.test(text)) return null;
    if (!MOTORCYCLE.test(text)) return null;

    const ccs = ccValues(text);
    if (ccs.some(cc => cc > 400)) return null;

    category = "competition";
    score += 20;
  }

  return {
    ...item,
    category,
    confidence: Math.min(score, 100)
  };
}
