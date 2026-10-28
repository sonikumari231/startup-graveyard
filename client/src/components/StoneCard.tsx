import { useRef, type CSSProperties, type PointerEvent } from "react";
import type { Case } from "../types";
import { hue } from "../lib/utils";

interface Props {
  d: Case;
  saved: boolean;
  onOpen: (id: string) => void;
  onSave: (id: string) => void;
}

const reduceMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function StoneCard({ d, saved, onOpen, onSave }: Props) {
  const ref = useRef<HTMLElement>(null);

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || reduceMotion || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const s = ref.current.style;
    s.setProperty("--ry", ((px - 0.5) * 18).toFixed(2) + "deg");
    s.setProperty("--rx", ((0.5 - py) * 16).toFixed(2) + "deg");
    s.setProperty("--mx", (px * 100).toFixed(1) + "%");
    s.setProperty("--my", (py * 100).toFixed(1) + "%");
  };
  const onLeave = () => {
    const s = ref.current?.style;
    ["--rx", "--ry", "--mx", "--my"].forEach((k) => s?.removeProperty(k));
  };

  return (
    <article
      ref={ref}
      className="sgc"
      style={{ "--h": hue(d.name) } as CSSProperties}
      onClick={() => onOpen(d.id)}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <button className="open" type="button" onClick={(e) => { e.stopPropagation(); onOpen(d.id); }}>
        <span className="logo" aria-hidden="true">{d.name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2)}</span>
        <h3>{d.name}</h3>
      </button>
      <span className="cat">{d.sector}</span>
      <span className="epi">{d.founded} – {d.closedYear}</span>
      <span className="mono meta">Lived {d.life} {d.life === 1 ? "year" : "years"}</span>
      <span className="why"><b>Why it failed</b>{d.reasons[0]?.title}</span>
      <span className="more-cue">Read full story →</span>
      <button
        className="mini star"
        type="button"
        aria-pressed={saved}
        aria-label={(saved ? "Remove " : "Save ") + d.name + (saved ? " from saved" : "")}
        onClick={(e) => { e.stopPropagation(); onSave(d.id); }}
      >
        {saved ? "★" : "☆"}
      </button>
    </article>
  );
}
