import { useMemo, useState } from "react";
import { CAUSES } from "../data/causes";
import type { CauseKey, FeedItem } from "../types";
import CauseChip from "./CauseChip";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function dayLabel(key: string): { main: string; sub: string } {
  if (key.length === 10) {
    const [y, m, d] = key.split("-").map(Number);
    return {
      main: new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }),
      sub: "",
    };
  }
  const [y, m] = key.split("-").map(Number);
  return { main: `${MONTHS[m - 1]} ${y}`, sub: "Exact day not reported" };
}

export default function DailyFeed({ feed }: { feed: FeedItem[] }) {
  const [q, setQ] = useState("");
  const [country, setCountry] = useState("");
  const [cause, setCause] = useState("");

  const countries = useMemo(() => [...new Set(feed.map((f) => f.country).filter(Boolean) as string[])].sort(), [feed]);
  const causes = useMemo(
    () => [...new Set(feed.flatMap((f) => f.causes))].sort((a, b) => CAUSES[a].label.localeCompare(CAUSES[b].label)) as CauseKey[],
    [feed],
  );

  const list = feed.filter((f) => {
    if (country && f.country !== country) return false;
    if (cause && !f.causes.includes(cause as CauseKey)) return false;
    const t = q.trim().toLowerCase();
    if (t) {
      const hay = [f.name, f.country ?? "", f.why, f.causes.map((c) => CAUSES[c].label).join(" ")].join(" ").toLowerCase();
      if (!t.split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    return true;
  });

  const groups = new Map<string, FeedItem[]>();
  [...list]
    .sort((a, b) => (b.date ?? b.month ?? "").localeCompare(a.date ?? a.month ?? ""))
    .forEach((f) => {
      const k = (f.date ?? f.month) as string;
      groups.set(k, [...(groups.get(k) ?? []), f]);
    });

  const thisMonth = new Date().toISOString().slice(0, 7);
  const inMonth = list.filter((f) => (f.date ?? f.month ?? "").startsWith(thisMonth)).length;
  const on: string[] = [];
  if (cause) on.push(CAUSES[cause as CauseKey].label);
  if (country) on.push(country);
  if (q.trim()) on.push(`"${q.trim()}"`);
  const reset = () => { setQ(""); setCountry(""); setCause(""); };

  return (
    <div className="pane">
      <section className="stats" aria-label="Daily feed summary">
        <div className="stat"><span className="label">Closures shown</span><b>{list.length}</b></div>
        <div className="stat"><span className="label">Reported this month</span><b>{inMonth}</b></div>
        <div className="stat"><span className="label">In the feed</span><b>{feed.length}</b></div>
      </section>
      <p className="note">This feed lists shutdowns found in news reports, newest first. It is not a full count, because no public source publishes one for each day. Each entry links to the report it came from.</p>

      <section className="tools" aria-label="Filter the feed">
        <div className="field"><label className="label" htmlFor="fq">Search</label>
          <input id="fq" type="search" placeholder="Name, country or reason" autoComplete="off" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <div className="field"><label className="label" htmlFor="fcountry">Country</label>
          <select id="fcountry" value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">All countries</option>{countries.map((c) => <option key={c}>{c}</option>)}
          </select></div>
        <div className="field"><label className="label" htmlFor="fcause">Cause of death</label>
          <select id="fcause" value={cause} onChange={(e) => setCause(e.target.value)}>
            <option value="">All causes</option>{causes.map((c) => <option key={c} value={c}>{CAUSES[c].label}</option>)}
          </select></div>
        <button className="btn" type="button" onClick={reset}>Reset</button>
      </section>

      <span className="label">{on.length ? `${list.length} of ${feed.length} closures · ${on.join(" · ")}` : `Showing all ${feed.length} closures`}</span>

      {!list.length ? (
        <div className="empty"><p>No closure in the feed matches these filters.</p><button className="btn" type="button" onClick={reset}>Clear filters</button></div>
      ) : (
        <div className="feed">
          {[...groups].map(([k, items]) => {
            const l = dayLabel(k);
            return (
              <section className="day" key={k}>
                <div className="day-head"><b>{l.main}</b><span className="mono label">{items.length} reported{l.sub ? " · " + l.sub : ""}</span></div>
                <div className="day-items">
                  {items.map((f) => (
                    <article className="item" key={f.id}>
                      <h3>{f.name}</h3>
                      <span className="mono meta">{[f.country, f.raised, f.when].filter(Boolean).join(" · ")}</span>
                      <p>{f.why}</p>
                      <div className="chips">{f.causes.map((c) => <CauseChip key={c} cause={c} />)}</div>
                      <a className="src" href={f.sourceUrl} target="_blank" rel="noopener noreferrer">Source: {f.sourceTitle} ↗</a>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
