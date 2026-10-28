import { useMemo, useState, type KeyboardEvent } from "react";
import { CAUSES } from "../data/causes";
import { money } from "../lib/utils";
import type { Case, CauseKey } from "../types";

interface Props {
  cases: Case[];
  onPickYear: (year: number) => void;
  onOpen: (id: string) => void;
}

const key = (fn: () => void) => (e: KeyboardEvent) => {
  if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fn(); }
};

export default function Insights({ cases, onPickYear, onOpen }: Props) {
  const [pt, setPt] = useState<Case | null>(null);

  const { topCause, topYear, byYear, yearList, causeTotals } = useMemo(() => {
    const byYear: Record<number, number> = {};
    cases.forEach((d) => { byYear[d.closedYear] = (byYear[d.closedYear] ?? 0) + 1; });
    const ys = cases.map((d) => d.closedYear);
    const yearList: number[] = [];
    if (ys.length) for (let y = Math.min(...ys); y <= Math.max(...ys); y++) yearList.push(y);
    const cc = (Object.keys(CAUSES) as CauseKey[]).map((k) => [k, cases.filter((d) => d.causes.includes(k)).length] as [CauseKey, number]).sort((a, b) => b[1] - a[1]);
    const ty = Object.entries(byYear).sort((a, b) => b[1] - a[1] || +b[0] - +a[0])[0];
    const causeTotals = (Object.keys(CAUSES) as CauseKey[])
      .map((k) => [k, cases.filter((d) => d.causes.includes(k)).reduce((s, d) => s + d.raisedMillions, 0)] as [CauseKey, number])
      .filter((x) => x[1] > 0).sort((a, b) => b[1] - a[1]);
    return { topCause: cc[0], topYear: ty, byYear, yearList, causeTotals };
  }, [cases]);

  if (!cases.length) return <div className="pane"><div className="empty"><p>No data to chart yet.</p></div></div>;

  // closures by year
  const W = 640, H = 230, L = 28, B = 28, T = 18, R = 6;
  const pw = W - L - R, ph = H - B - T;
  const ymax = Math.max(...Object.values(byYear));
  const bw = pw / yearList.length;

  // money raised against lifespan (log scale)
  const SW = 640, SH = 330, SL = 58, SB = 40, ST = 14, SR = 16;
  const spw = SW - SL - SR, sph = SH - SB - ST;
  const xmax = 20, lo = Math.log10(10), hi = Math.log10(10000);
  const sx = (v: number) => SL + (v / xmax) * spw;
  const sy = (m: number) => ST + sph - ((Math.log10(m) - lo) / (hi - lo)) * sph;
  const maxCause = Math.max(...causeTotals.map((t) => t[1]));

  return (
    <div className="pane">
      <section className="stats" aria-label="Library totals">
        <div className="stat"><span className="label">Cases in library</span><b>{cases.length}</b></div>
        <div className="stat"><span className="label">Most common cause</span><b>{CAUSES[topCause[0]].label} ({topCause[1]})</b></div>
        <div className="stat"><span className="label">Most closures in one year</span><b>{topYear[0]} ({topYear[1]})</b></div>
      </section>

      <div className="charts">
        <section className="chart span2">
          <h2>Closures by year</h2>
          <span className="label">Select a year to see those cases in the library</span>
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Closures per year, ${yearList[0]} to ${yearList[yearList.length - 1]}`}>
            {Array.from({ length: ymax + 1 }, (_, v) => {
              const y = T + ph - (v / ymax) * ph;
              return <g key={v}><line className="gl" x1={L} x2={W - R} y1={y} y2={y} /><text x={L - 6} y={y + 4} textAnchor="end">{v}</text></g>;
            })}
            {yearList.map((yr, i) => {
              const n = byYear[yr] ?? 0;
              const x = L + i * bw + bw * 0.15, w = bw * 0.7, h = (n / ymax) * ph;
              const label = yr % 5 === 0 ? <text x={x + w / 2} y={H - 8} textAnchor="middle">{yr}</text> : null;
              if (!n) return <g key={yr}>{label}</g>;
              return (
                <g key={yr} className="yb" tabIndex={0} role="button" aria-label={`${yr}: ${n} closures. Show these cases`}
                  onClick={() => onPickYear(yr)} onKeyDown={key(() => onPickYear(yr))}>
                  <rect x={x} y={T + ph - h} width={w} height={h} rx={1} />
                  <text className="v" x={x + w / 2} y={T + ph - h - 4} textAnchor="middle">{n}</text>
                  {label}
                </g>
              );
            })}
          </svg>
        </section>

        <section className="chart">
          <h2>Money raised against lifespan</h2>
          <span className="label">Each dot is one company · hover, focus or tap for details</span>
          <svg viewBox={`0 0 ${SW} ${SH}`} role="img" aria-label="Money raised against years active, one dot per company">
            {[10, 100, 1000, 10000].map((m) => (
              <g key={m}><line className="gl" x1={SL} x2={SW - SR} y1={sy(m)} y2={sy(m)} /><text x={SL - 8} y={sy(m) + 4} textAnchor="end">{money(m)}</text></g>
            ))}
            {[0, 5, 10, 15, 20].map((v) => (
              <g key={v}><line className="gl" x1={sx(v)} x2={sx(v)} y1={ST} y2={ST + sph} /><text x={sx(v)} y={SH - 22} textAnchor="middle">{v}</text></g>
            ))}
            <text x={SL + spw / 2} y={SH - 4} textAnchor="middle">Years active</text>
            {cases.map((d) => (
              <g key={d.id} className="pt" tabIndex={0} role="button" aria-label={`${d.name}: ${d.life} years, ${money(d.raisedMillions)} raised`}
                onMouseEnter={() => setPt(d)} onFocus={() => setPt(d)} onClick={() => setPt(d)} onKeyDown={key(() => setPt(d))}>
                <circle cx={sx(d.life)} cy={sy(d.raisedMillions)} r={6} />
              </g>
            ))}
          </svg>
          <div className="sc-info" aria-live="polite">
            {pt ? (<><b>{pt.name}</b> · {pt.life} years · ~{money(pt.raisedMillions)} raised · <button className="mini" type="button" onClick={() => onOpen(pt.id)}>Open case</button></>) : "Pick a dot to see which company it is."}
          </div>
        </section>

        <section className="chart">
          <h2>Money raised, by cause</h2>
          <span className="label">Total raised by companies with that cause · one company can count under several causes</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {causeTotals.map(([k, v]) => (
              <div className="bar static" key={k}>
                <span className="name">{CAUSES[k].label}</span>
                <span className="track"><span className="fill" style={{ width: `${(v / maxCause) * 100}%`, background: "var(--accent)" }} /></span>
                <span className="n" style={{ color: "var(--ink)" }}>{money(v)}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
      <p className="note">Charts cover the cases currently loaded, which is not every startup that failed.</p>
    </div>
  );
}
