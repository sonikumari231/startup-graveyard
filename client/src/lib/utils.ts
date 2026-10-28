import { CAUSES } from "../data/causes";
import type { CauseKey } from "../types";

export const money = (m: number): string =>
  m >= 1000
    ? "$" + (m / 1000).toFixed(m >= 10000 ? 0 : 2).replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "") + "B"
    : "$" + Math.round(m) + "M";

export const hue = (s: string): number => {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
};

export const pad = (n: number): string => String(n).padStart(3, "0");
export const causeLabel = (c: CauseKey): string => CAUSES[c].label;
export const years = (n: number): string => `${n} ${n === 1 ? "year" : "years"}`;
