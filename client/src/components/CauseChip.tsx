import { CAUSES } from "../data/causes";
import type { CauseKey } from "../types";

export default function CauseChip({ cause }: { cause: CauseKey }) {
  return (
    <span className="chip">
      <span className="dot" style={{ "--h": CAUSES[cause].hue } as React.CSSProperties} />
      {CAUSES[cause].label}
    </span>
  );
}
