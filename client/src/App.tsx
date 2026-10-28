import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import AskAI from "./components/AskAI";
import CaseSheet from "./components/CaseSheet";
import CompareSheet from "./components/CompareSheet";
import DailyFeed from "./components/DailyFeed";
import Insights from "./components/Insights";
import Library from "./components/Library";
import { useData, useSavedSet } from "./hooks";
import { enrich, initialFilters, matches, sorters, type Filters } from "./lib/filter";
import type { ChatMsg } from "./types";

// The 3D scene pulls in three.js, so it loads after the first paint.
const Hero3D = lazy(() => import("./components/Hero3D"));

type Tab = "library" | "daily" | "insights" | "ask";
const TABS: { id: Tab; label: string }[] = [
  { id: "library", label: "Graveyard" },
  { id: "daily", label: "Daily feed" },
  { id: "insights", label: "Insights" },
  { id: "ask", label: "Ask AI" },
];

function initialTab(): Tab {
  const h = window.location.hash.replace("#", "");
  return h === "daily" || h === "insights" || h === "ask" ? h : "library";
}

export default function App() {
  const { startups, feed, live, loading } = useData();
  const cases = useMemo(() => enrich(startups), [startups]);

  const [tab, setTab] = useState<Tab>(initialTab);
  const [f, setFilters] = useState<Filters>(initialFilters);
  const [saved, toggleSaved] = useSavedSet("sg-saved");
  const [compare, setCompare] = useState<string[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [showCompare, setShowCompare] = useState(false);
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const timer = useRef<number>();

  const setF = useCallback((patch: Partial<Filters>) => setFilters((p) => ({ ...p, ...patch })), []);
  const resetAll = useCallback(() => setFilters(initialFilters), []);

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToastMsg(null), 2200);
  }, []);

  const view = useMemo(
    () => cases.filter((d) => matches(d, f, saved, true)).sort(sorters[f.sort]),
    [cases, f, saved],
  );

  // Open a case from the link, for example /#case-quibi
  useEffect(() => {
    const h = window.location.hash.replace("#", "");
    if (h.startsWith("case-") && cases.some((d) => d.id === h.slice(5))) setOpenId(h.slice(5));
  }, [cases]);

  const save = (id: string) => toast(toggleSaved(id) ? "Saved in this browser" : "Removed from saved");
  const toggleCompare = (id: string) => {
    if (compare.includes(id)) { setCompare(compare.filter((x) => x !== id)); return; }
    if (compare.length >= 3) { toast("You can compare up to 3 cases"); return; }
    setCompare([...compare, id]);
  };

  const open = cases.find((d) => d.id === openId) ?? null;
  const sheetList = open && view.some((d) => d.id === open.id) ? view : [...cases].sort(sorters[f.sort]);
  const compareItems = compare.map((id) => cases.find((d) => d.id === id)).filter(Boolean) as typeof cases;

  useEffect(() => { document.body.classList.toggle("has-bar", compare.length > 0); }, [compare.length]);

  return (
    <div className="wrap">
      <div className="topbar">
        <a className="brand" href="#library" onClick={(e) => { e.preventDefault(); setTab("library"); }}>
          <svg viewBox="0 0 24 32" width="22" height="30" aria-hidden="true">
            <path d="M8 1h8l6 9-4 21H6L2 10z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M12 9v10M8 13h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>Startup Graveyard</span>
        </a>
        <div className="tabs" role="tablist" aria-label="Views">
          {TABS.map((t) => (
            <button key={t.id} className="tab" type="button" role="tab" id={`tab-${t.id}`} aria-selected={tab === t.id} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <header className="hero">
        <div className="sky" aria-hidden="true" />
        <h1><span>Welcome to</span> <em>Startup Graveyard</em></h1>
        <Suspense fallback={<div className="scene" aria-hidden="true" />}>
          <Hero3D />
        </Suspense>
        <p className="sub">A place to learn from startups that failed. Open any one to see when it started, when it closed, who built it, and why it ended.</p>
        <span className="label">{cases.length} case files</span>
      </header>

      {loading ? (
        <div className="empty"><p>Loading the graveyard…</p></div>
      ) : (
        <>
          {tab === "library" && (
            <Library cases={cases} view={view} f={f} setF={setF} resetAll={resetAll} saved={saved} onSave={save} onOpen={setOpenId} />
          )}
          {tab === "daily" && <DailyFeed feed={feed} />}
          {tab === "ask" && <AskAI cases={cases} messages={chat} setMessages={setChat} onOpen={setOpenId} />}
          {tab === "insights" && (
            <Insights
              cases={cases}
              onOpen={setOpenId}
              onPickYear={(y) => { setFilters({ ...initialFilters, yfrom: String(y), yto: String(y) }); setTab("library"); window.scrollTo(0, 0); }}
            />
          )}
        </>
      )}

      <footer className="foot">
        <div className="ticker" aria-hidden="true">
          <div className="ticker-in">
            {Array.from({ length: 20 }, (_, i) => <span key={i}>Startup ★ Graveyard</span>)}
          </div>
        </div>
        <p className="note">
          This site is a learning resource, not a final source of fact. Startups usually fail for several reasons that build up over years, and the accounts here summarize public reporting. © {new Date().getFullYear()} Startup Graveyard
          {!live && !loading ? " · Showing built-in sample data because the API could not be reached." : ""}
        </p>
      </footer>

      {open && !showCompare && (
        <CaseSheet
          d={open}
          list={sheetList}
          total={cases.length}
          saved={saved.has(open.id)}
          inCompare={compare.includes(open.id)}
          onSave={save}
          onCompare={toggleCompare}
          onOpen={setOpenId}
          onClose={() => setOpenId(null)}
          toast={toast}
        />
      )}
      {showCompare && compareItems.length >= 2 && (
        <CompareSheet
          items={compareItems}
          onOpen={(id) => { setShowCompare(false); setOpenId(id); }}
          onClose={() => setShowCompare(false)}
        />
      )}

      {compare.length > 0 && (
        <div className="cmpbar">
          <div className="cmpbar-in">
            <span><b>Compare:</b> {compareItems.map((d) => d.name).join(", ")} <span style={{ opacity: 0.7 }}>(up to 3)</span></span>
            <span style={{ display: "flex", gap: 8 }}>
              <button className="btn" type="button" disabled={compare.length < 2} style={compare.length < 2 ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
                onClick={() => { setOpenId(null); setShowCompare(true); }}>
                {compare.length < 2 ? "Pick one more" : `Compare ${compare.length} cases`}
              </button>
              <button className="btn ghost" type="button" onClick={() => setCompare([])}>Clear</button>
            </span>
          </div>
        </div>
      )}
      {toastMsg && <div className="toast" role="status" aria-live="polite">{toastMsg}</div>}
    </div>
  );
}
