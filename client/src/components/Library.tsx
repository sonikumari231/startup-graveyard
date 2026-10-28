import { useEffect, useMemo, useState } from "react";
import { CAUSES } from "../data/causes";
import { matches, type Filters } from "../lib/filter";
import { money, pad } from "../lib/utils";
import type { Case, CauseKey } from "../types";
import CauseChip from "./CauseChip";
import StoneCard from "./StoneCard";

const PAGE = 12;

interface Props {
  cases: Case[];
  view: Case[];
  f: Filters;
  setF: (patch: Partial<Filters>) => void;
  resetAll: () => void;
  saved: Set<string>;
  onSave: (id: string) => void;
  onOpen: (id: string) => void;
}

export default function Library({ cases, view, f, setF, resetAll, saved, onSave, onOpen }: Props) {
  const [show, setShow] = useState(PAGE);
  const [layout, setLayout] = useState<"grid" | "table">("grid");
  useEffect(() => setShow(PAGE), [f]);

  const sectors = useMemo(() => [...new Set(cases.map((d) => d.sector))].sort(), [cases]);
  const countries = useMemo(() => [...new Set(cases.map((d) => d.country))].sort(), [cases]);
  const yearList = useMemo(() => {
    const ys = cases.map((d) => d.closedYear);
    if (!ys.length) return [] as number[];
    const out: number[] = [];
    for (let y = Math.min(...ys); y <= Math.max(...ys); y++) out.push(y);
    return out;
  }, [cases]);

  const catCounts = useMemo(() => {
    const pool = cases.filter((d) => matches(d, { ...f, sector: "" }, saved, true));
    return [["", pool.length] as [string, number], ...sectors.map((s) => [s, pool.filter((d) => d.sector === s).length] as [string, number])];
  }, [cases, f, saved, sectors]);

  const causeCounts = useMemo(() => {
    const base = cases.filter((d) => matches(d, f, saved, false));
    return (Object.keys(CAUSES) as CauseKey[])
      .map((k) => [k, base.filter((d) => d.causes.includes(k)).length] as [CauseKey, number])
      .sort((a, b) => b[1] - a[1]);
  }, [cases, f, saved]);
  const maxCause = Math.max(1, ...causeCounts.map((c) => c[1]));

  const shown = view.slice(0, show);
  const left = view.length - shown.length;
  const avg = view.length ? view.reduce((s, d) => s + d.life, 0) / view.length : 0;

  const tags: string[] = [];
  if (f.causes.length) tags.push(f.causes.map((c) => CAUSES[c].label).join(" or "));
  if (f.sector) tags.push(f.sector);
  if (f.country) tags.push(f.country);
  if (f.yfrom || f.yto) tags.push(`closed ${f.yfrom || "any"} to ${f.yto || "any"}`);
  if (f.fund) tags.push({ lt100: "under $100M", "100-500": "$100M to $500M", gt500: "over $500M" }[f.fund] ?? "");
  if (f.savedOnly) tags.push("saved");
  if (f.q.trim()) tags.push(`"${f.q.trim()}"`);

  const toggleCause = (k: CauseKey) =>
    setF({ causes: f.causes.includes(k) ? f.causes.filter((c) => c !== k) : [...f.causes, k] });

  return (
    <div className="pane">
      <div className="cats" role="group" aria-label="Category">
        {catCounts.map(([s, n]) => (
          <button key={s || "all"} className="catb" type="button" aria-pressed={f.sector === s} onClick={() => setF({ sector: s })}>
            {s || "All"}<span className="n">{n}</span>
          </button>
        ))}
      </div>

      <div className="topsearch">
        <label className="label" htmlFor="qtop" style={{ position: "absolute", left: -9999 }}>Search</label>
        <input id="qtop" type="search" placeholder="Search by name, founder, investor or reason" autoComplete="off"
          value={f.q} onChange={(e) => setF({ q: e.target.value })} />
      </div>

      <details className="filters">
        <summary>More filters, sorting and layout</summary>

        <section className="stats" aria-label="Summary of the cases shown">
          <div className="stat"><span className="label">Cases shown</span><b>{view.length}</b></div>
          <div className="stat"><span className="label">Money raised</span><b>{money(view.reduce((s, d) => s + d.raisedMillions, 0))}</b></div>
          <div className="stat"><span className="label">Average lifespan</span><b>{view.length ? avg.toFixed(1).replace(/\.0$/, "") : "0"} yrs</b></div>
        </section>

        <section className="causes" aria-label="Cause of death">
          <div className="causes-head">
            <span className="label">Cause of death · select one or more</span>
            <span className="mono meta">A company can have several causes</span>
          </div>
          <div className="bars">
            {causeCounts.map(([k, n]) => (
              <button key={k} type="button" className={"bar" + (n === 0 ? " zero" : "")} aria-pressed={f.causes.includes(k)} onClick={() => toggleCause(k)}>
                <span className="name">{CAUSES[k].label}</span>
                <span className="track"><span className="fill" style={{ width: `${(n / maxCause) * 100}%` }} /></span>
                <span className="n">{n}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="tools" aria-label="Filters">
          <div className="field"><label className="label" htmlFor="sector">Sector</label>
            <select id="sector" value={f.sector} onChange={(e) => setF({ sector: e.target.value })}>
              <option value="">All sectors</option>{sectors.map((s) => <option key={s}>{s}</option>)}
            </select></div>
          <div className="field"><label className="label" htmlFor="country">Country</label>
            <select id="country" value={f.country} onChange={(e) => setF({ country: e.target.value })}>
              <option value="">All countries</option>{countries.map((s) => <option key={s}>{s}</option>)}
            </select></div>
          <div className="field"><label className="label" htmlFor="yfrom">Closed from</label>
            <select id="yfrom" value={f.yfrom} onChange={(e) => setF({ yfrom: e.target.value })}>
              <option value="">Any year</option>{yearList.map((y) => <option key={y}>{y}</option>)}
            </select></div>
          <div className="field"><label className="label" htmlFor="yto">Closed to</label>
            <select id="yto" value={f.yto} onChange={(e) => setF({ yto: e.target.value })}>
              <option value="">Any year</option>{[...yearList].reverse().map((y) => <option key={y}>{y}</option>)}
            </select></div>
          <div className="field"><label className="label" htmlFor="fund">Money raised</label>
            <select id="fund" value={f.fund} onChange={(e) => setF({ fund: e.target.value })}>
              <option value="">Any amount</option><option value="lt100">Under $100M</option>
              <option value="100-500">$100M to $500M</option><option value="gt500">Over $500M</option>
            </select></div>
          <div className="field"><label className="label" htmlFor="sort">Sort by</label>
            <select id="sort" value={f.sort} onChange={(e) => setF({ sort: e.target.value })}>
              <option value="closed">Closed, latest first</option><option value="closedasc">Closed, earliest first</option>
              <option value="raised">Money raised</option><option value="life">Lifespan, shortest first</option>
              <option value="lifelong">Lifespan, longest first</option><option value="name">Name</option>
            </select></div>
          <button className="btn" type="button" aria-pressed={f.savedOnly} onClick={() => setF({ savedOnly: !f.savedOnly })}>Saved only ({saved.size})</button>
          <button className="btn" type="button" onClick={resetAll}>Reset</button>
          <button className="btn primary" type="button" onClick={() => { const pool = view.length ? view : cases; if (pool.length) onOpen(pool[Math.floor(Math.random() * pool.length)].id); }}>Random case</button>
        </section>
      </details>

      <section>
        <div className="count">
          <span className="label">{tags.length ? `${view.length} of ${cases.length} cases · ${tags.join(" · ")}` : `Showing all ${cases.length} cases`}</span>
          <div className="seg" role="group" aria-label="Layout">
            <button type="button" aria-pressed={layout === "grid"} onClick={() => setLayout("grid")}>Cards</button>
            <button type="button" aria-pressed={layout === "table"} onClick={() => setLayout("table")}>Table</button>
          </div>
        </div>

        {!view.length ? (
          <div className="empty">
            <p>{f.savedOnly && !saved.size ? "You have not saved any cases yet. Use the star on a case to keep it here." : "No case matches these filters."}</p>
            <button className="btn" type="button" onClick={resetAll}>Clear filters</button>
          </div>
        ) : layout === "grid" ? (
          <div className="grid">
            {shown.map((d) => <StoneCard key={d.id} d={d} saved={saved.has(d.id)} onOpen={onOpen} onSave={onSave} />)}
          </div>
        ) : (
          <div className="tablewrap">
            <table>
              <thead><tr><th>Case</th><th>Company</th><th>Active</th><th>Closed</th><th>Raised</th><th>Country</th><th>Sector</th><th>Main cause</th><th /></tr></thead>
              <tbody>
                {shown.map((d) => (
                  <tr key={d.id}>
                    <td className="num">{pad(d.no)}</td>
                    <td><button className="open" type="button" onClick={() => onOpen(d.id)}>{d.name}</button></td>
                    <td className="num">{d.founded} to {d.closedYear}<br /><span className="meta">{d.life} {d.life === 1 ? "yr" : "yrs"}</span></td>
                    <td className="num">{d.closedLabel}</td>
                    <td className="num">{money(d.raisedMillions)}</td>
                    <td>{d.country}</td><td>{d.sector}</td>
                    <td><CauseChip cause={d.causes[0]} /></td>
                    <td><button className="mini" type="button" aria-pressed={saved.has(d.id)} onClick={() => onSave(d.id)}>{saved.has(d.id) ? "★ Saved" : "☆ Save"}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {left > 0 && (
          <div className="more">
            <button className="btn" type="button" onClick={() => setShow((n) => n + PAGE)}>Show {Math.min(PAGE, left)} more · {left} left</button>
          </div>
        )}
      </section>

      <p className="note">Amounts and dates come from public reporting and are rounded. Failures usually have several causes that build up over years, so treat each account as a starting point and check the sources before you quote it. Saved cases are stored in this browser only.</p>
    </div>
  );
}
