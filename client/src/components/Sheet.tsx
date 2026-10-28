import { useEffect, useRef, type ReactNode } from "react";

interface Props {
  wide?: boolean;
  labelledBy: string;
  resetKey?: string;
  onClose: () => void;
  children: ReactNode;
}

/** Side panel with a backdrop. Handles Escape, focus trapping and returning focus on close. */
export default function Sheet({ wide, labelledBy, resetKey, onClose, children }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    ref.current?.querySelector<HTMLElement>("[data-close]")?.focus();
    return () => {
      document.body.style.overflow = "";
      if (prev && document.contains(prev)) prev.focus();
    };
  }, []);

  useEffect(() => { if (ref.current) ref.current.scrollTop = 0; }, [resetKey]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab" || !ref.current) return;
      const f = [...ref.current.querySelectorAll<HTMLElement>("button:not([disabled]),a[href],textarea:not([hidden])")];
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div>
      <div className="scrim" onClick={onClose} />
      <aside ref={ref} className={"sheet" + (wide ? " wide" : "")} role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
        {children}
      </aside>
    </div>
  );
}
