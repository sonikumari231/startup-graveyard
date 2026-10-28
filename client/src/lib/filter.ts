import { CAUSES } from "../data/causes";
import type { Case, CauseKey, Startup } from "../types";

export interface Filters {
  q: string;
  sector: string;
  country: string;
  yfrom: string;
  yto: string;
  fund: string;
  sort: string;
  causes: CauseKey[];
  savedOnly: boolean;
}

export const initialFilters: Filters = {
  q: "", sector: "", country: "", yfrom: "", yto: "", fund: "", sort: "closed", causes: [], savedOnly: false,
};

/** Adds the values the UI needs: lifespan, cause list, and a case number by closing order. */
export function enrich(items: Startup[]): Case[] {
  const withDerived = items.map((d) => ({
    ...d,
    life: d.closedYear - d.founded,
    causes: [...new Set(d.reasons.map((r) => r.cause))] as CauseKey[],
    no: 0,
  }));
  [...withDerived]
    .sort((a, b) => a.closedYear - b.closedYear || a.founded - b.founded || a.name.localeCompare(b.name))
    .forEach((d, i) => { d.no = i + 1; });
  return withDerived;
}

export function matches(d: Case, f: Filters, saved: Set<string>, withCauses: boolean): boolean {
  if (f.sector && d.sector !== f.sector) return false;
  if (f.country && d.country !== f.country) return false;
  if (f.yfrom && d.closedYear < +f.yfrom) return false;
  if (f.yto && d.closedYear > +f.yto) return false;
  if (f.fund === "lt100" && !(d.raisedMillions < 100)) return false;
  if (f.fund === "100-500" && !(d.raisedMillions >= 100 && d.raisedMillions <= 500)) return false;
  if (f.fund === "gt500" && !(d.raisedMillions > 500)) return false;
  if (f.savedOnly && !saved.has(d.id)) return false;
  const q = f.q.trim().toLowerCase();
  if (q) {
    const hay = [
      d.name, d.country, d.hq, d.sector, d.what, d.founders.join(" "), d.investors.join(" "),
      d.competitors.join(" "), d.reasons.map((r) => r.title + " " + r.text).join(" "),
      d.causes.map((c) => CAUSES[c].label).join(" "),
    ].join(" ").toLowerCase();
    if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
  }
  if (withCauses && f.causes.length && !d.causes.some((c) => f.causes.includes(c))) return false;
  return true;
}

export const sorters: Record<string, (a: Case, b: Case) => number> = {
  closed: (a, b) => b.closedYear - a.closedYear || a.name.localeCompare(b.name),
  closedasc: (a, b) => a.closedYear - b.closedYear || a.name.localeCompare(b.name),
  raised: (a, b) => b.raisedMillions - a.raisedMillions,
  life: (a, b) => a.life - b.life || a.name.localeCompare(b.name),
  lifelong: (a, b) => b.life - a.life || a.name.localeCompare(b.name),
  name: (a, b) => a.name.localeCompare(b.name),
};
