import type { Case } from "../types";
import { money, years } from "../lib/utils";
import CauseChip from "./CauseChip";
import Sheet from "./Sheet";

interface Props {
  items: Case[];
  onOpen: (id: string) => void;
  onClose: () => void;
}

export default function CompareSheet({ items, onOpen, onClose }: Props) {
  const row = (label: string, render: (d: Case) => React.ReactNode) => (
    <div className="cmp-row" key={label}>
      <span className="label">{label}</span>
      {items.map((d) => <div key={d.id}>{render(d)}</div>)}
    </div>
  );
  return (
    <Sheet wide labelledBy="d-name" onClose={onClose}>
      <div className="sheet-top">
        <span className="mono label">Compare {items.length} cases</span>
        <button className="btn x" type="button" data-close aria-label="Close comparison" onClick={onClose}>✕</button>
      </div>
      <h2 id="d-name" style={{ fontSize: "clamp(26px,6vw,36px)" }}>Side by side</h2>
      <div className="cmp-wrap">
        <div className="cmp" style={{ "--n": items.length } as React.CSSProperties}>
          <div className="cmp-row cmp-head">
            <span />
            {items.map((d) => (
              <div key={d.id}>
                <b>{d.name}</b><br />
                <button className="mini" type="button" onClick={() => onOpen(d.id)}>Open case</button>
              </div>
            ))}
          </div>
          {row("Started", (d) => d.founded)}
          {row("Closed", (d) => d.closedLabel)}
          {row("Lived", (d) => years(d.life))}
          {row("Raised", (d) => "~" + money(d.raisedMillions))}
          {row("Country", (d) => d.country)}
          {row("Sector", (d) => d.sector)}
          {row("Status", (d) => d.status)}
          {row("Founders", (d) => d.founders.join(", "))}
          {row("Causes", (d) => <div className="chips">{d.causes.map((c) => <CauseChip key={c} cause={c} />)}</div>)}
          {row("Main reason", (d) => <><b>{d.reasons[0].title}</b><p>{d.reasons[0].text}</p></>)}
          {row("Lesson", (d) => <p>{d.lesson}</p>)}
        </div>
      </div>
    </Sheet>
  );
}
