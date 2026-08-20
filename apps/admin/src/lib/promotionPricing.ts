import { USD_TO_PEN_RATE } from "@vc/config";

export function estimatePricePenFromUsd(usd: number): number {
  return Math.round(usd * USD_TO_PEN_RATE);
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
