import { useState } from "react";
import type { Case } from "../types";
import { causeLabel, money, pad, years } from "../lib/utils";
import CauseChip from "./CauseChip";
import Sheet from "./Sheet";

interface Props {
  d: Case;
  list: Case[];
  total: number;
  saved: boolean;
  inCompare: boolean;
  onSave: (id: string) => void;
  onCompare: (id: string) => void;
  onOpen: (id: string) => void;
  onClose: () => void;
  toast: (msg: string) => void;
}

function summaryText(d: Case): string {
  return (
    `${d.name} (${d.founded} to ${d.closedLabel})\n${d.what}\nRaised about ${money(d.raisedMillions)}. ${d.hq}.\n` +
    `Causes: ${d.causes.map(causeLabel).join(", ")}.\n` +
    d.reasons.map((r) => `- ${r.title}: ${r.text}`).join("\n") +
    `\nLesson: ${d.lesson}`
  );
}

export default function CaseSheet({ d, list, total, saved, inCompare, onSave, onCompare, onOpen, onClose, toast }: Props) {
  const [copyText, setCopyText] = useState<string | null>(null);
  const idx = list.findIndex((x) => x.id === d.id);
  const prev = list[(idx - 1 + list.length) % list.length] ?? d;
  const next = list[(idx + 1) % list.length] ?? d;
  const wiki = encodeURIComponent(d.wikiQuery ?? d.name);

  async function copy() {
    const text = summaryText(d);
    try {
      await navigator.clipboard.writeText(text);
      toast("Summary copied");
    } catch {
      setCopyText(text);
      toast("Copy blocked here. The text is selected, press Ctrl+C");
    }
  }

  return (
    <Sheet labelledBy="d-name" resetKey={d.id} onClose={onClose}>
      <div className="sheet-top">
        <span className="mono label">Case {pad(d.no)} of {total}</span>
        <button className="btn x" type="button" data-close aria-label="Close case" onClick={onClose}>✕</button>
      </div>

      <div className="block">
        <span className="mono status">{d.status}</span>
        <h2 id="d-name">{d.name}</h2>
        <p>{d.what}</p>
      </div>

      <div className="rowbtns">
        <button className="btn sm" type="button" aria-pressed={saved} onClick={() => onSave(d.id)}>{saved ? "★ Saved" : "☆ Save"}</button>
        <button className="btn sm" type="button" aria-pressed={inCompare} onClick={() => onCompare(d.id)}>{inCompare ? "✓ In compare" : "Add to compare"}</button>
        <button className="btn sm" type="button" onClick={copy}>Copy summary</button>
      </div>
      {copyText !== null && (
        <textarea className="copybox" readOnly value={copyText} aria-label="Summary text" autoFocus onFocus={(e) => e.currentTarget.select()} />
      )}

      <div className="facts">
        <div><span className="label">Started</span><b>{d.founded}</b></div>
        <div><span className="label">Closed</span><b>{d.closedLabel}</b></div>
        <div><span className="label">Lived</span><b>{years(d.life)}</b></div>
        <div><span className="label">Raised</span><b>~{money(d.raisedMillions)}</b></div>
        <div><span className="label">Based in</span><b>{d.hq}</b></div>
        <div><span className="label">Sector</span><b>{d.sector}</b></div>
        <div className="full"><span className="label">Founders</span><b>{d.founders.join(", ")}</b></div>
        <div className="full"><span className="label">Main backers</span><b>{d.investors.join(", ")}</b></div>
      </div>

      <div className="block">
        <span className="label">Why it failed · {d.reasons.length} causes</span>
        <div>
          {d.reasons.map((r) => (
            <div className="reason" key={r.title}>
              <div className="chips"><CauseChip cause={r.cause} /></div>
              <h4>{r.title}</h4>
              <p>{r.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="block">
        <span className="label">Timeline</span>
        <ol className="tl">
          {d.timeline.map((t, i) => (
            <li key={i} className={i === d.timeline.length - 1 ? "end" : ""}>
              <span className="when">{t.when}</span>
              <span>{t.text}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="block">
        <span className="label">Competitors</span>
        <div className="chips">{d.competitors.map((c) => <span className="chip plain" key={c}>{c}</span>)}</div>
      </div>

      <div className="lesson"><span className="label">Lesson</span><p>{d.lesson}</p></div>

      <div className="block">
        <span className="label">Read more</span>
        <div className="links">
          {d.sources?.map((s) => <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer">{s.title} ↗</a>)}
          <a href={`https://en.wikipedia.org/wiki/Special:Search?search=${wiki}`} target="_blank" rel="noopener noreferrer">Search Wikipedia for {d.name} ↗</a>
        </div>
        <p className="note">Failure usually has several causes that build up over years. This is a summary of public reporting, not a final verdict.</p>
      </div>

      <div className="nav">
        <button className="btn" type="button" onClick={() => onOpen(prev.id)}>← {prev.name}</button>
        <button className="btn" type="button" onClick={() => onOpen(next.id)}>{next.name} →</button>
      </div>
    </Sheet>
  );
}
