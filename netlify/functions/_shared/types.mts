
export type Category =
  | "competition"
  | "ev"
  | "policy"
  | "threeWheeler"
  | "social";

export interface NewsRecord {
  id: string;
  country: string;
  region: string;
  month: string;
  date: string;
  category: Category;
  title?: string;
  text: string;
  source: string;
  url: string;
  oem?: string;
  model?: string;
  eventType?: string;
  vehicleType?: string;
  displacementCc?: number;
  confidence?: number;
  approved: boolean;
  fetchedAt?: string;
}
