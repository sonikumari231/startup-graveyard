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
  const featuredCase = cases.find((d) => d.id === "quibi") ?? cases[0] ?? null;

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

  const focusSearch = useCallback(() => {
    setTab("library");
    window.requestAnimationFrame(() => document.getElementById("qtop")?.focus());
  }, []);
  const exploreArchive = useCallback(() => {
    setTab("library");
    window.requestAnimationFrame(() => document.getElementById("archive")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }, []);

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

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        focusSearch();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focusSearch]);

  const closedYears = cases.map((d) => d.closedYear);
  const yearSpan = closedYears.length
    ? `${Math.min(...closedYears)} — ${Math.max(...closedYears)}`
    : "—";
  const comparePatterns = () => {
    if (cases.length < 2) return;

    const selected = [featuredCase ?? cases[0]];
    while (selected.length < Math.min(3, cases.length)) {
      const remaining = cases.filter((candidate) => !selected.some((item) => item.id === candidate.id));
      const next = remaining.sort((a, b) => {
        const score = (candidate: typeof a) => {
          const newCauses = candidate.causes.filter((cause) => selected.every((item) => !item.causes.includes(cause))).length;
          const newSector = selected.some((item) => item.sector === candidate.sector) ? 0 : 1;
          return newCauses * 3 + newSector * 2;
        };
        return score(b) - score(a);
      })[0];
      if (!next) break;
      selected.push(next);
    }

    setCompare(selected.map((item) => item.id));
    setOpenId(null);
    setShowCompare(true);
  };

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
        <button className="search-launch" type="button" onClick={focusSearch} aria-label="Search the archive">
          <span aria-hidden="true">⌕</span><span>Search archive</span><kbd>/</kbd>
        </button>
      </div>

      <header className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><i /> A field guide to what went wrong</span>
          <h1>Failure leaves <em>clues.</em></h1>
          <p className="sub">Explore the decisions, timing, and market shifts behind startup shutdowns. Learn from the past before you build what comes next.</p>
          <div className="hero-actions">
            <button className="btn primary hero-cta" type="button" onClick={exploreArchive}>Explore the archive <span aria-hidden="true">↓</span></button>
            <button className="btn hero-compare" type="button" onClick={comparePatterns} disabled={cases.length < 2}><span aria-hidden="true">⇄</span> Compare failure patterns</button>
          </div>
          <div className="hero-metrics" aria-label="Archive overview">
            <div><b>{cases.length}</b><span>case files</span></div>
            <div><b>{new Set(cases.map((d) => d.sector)).size}</b><span>sectors</span></div>
            <div><b>{yearSpan}</b><span>closure years</span></div>
          </div>
        </div>
        <div className="hero-art">
          <div className="art-label"><span>THE FAILURE FILES · VOL. 01</span><span className="art-live"><i /> {live ? "LIVE ARCHIVE" : "SAMPLE ARCHIVE"}</span></div>
          <Suspense fallback={null}><Hero3D /></Suspense>
          <div className="art-caption"><span>{featuredCase ? `REMEMBERING ${featuredCase.name.toUpperCase()}` : "A LIVING ARCHIVE OF CLOSED STARTUPS"}</span><span>Move your pointer to explore</span></div>
        </div>
      </header>

      {loading ? (
        <div className="empty"><p>Loading the graveyard…</p></div>
      ) : (
        <>
          {tab === "library" && (
            <div id="archive" className="archive-section">
              <div className="section-heading">
                <div><span className="eyebrow"><i /> THE ARCHIVE</span><h2>Stories from the other side.</h2></div>
                <p>Browse the companies, then open a case file to see the full timeline and lessons.</p>
              </div>
              <Library cases={cases} view={view} f={f} setF={setF} resetAll={resetAll} saved={saved} onSave={save} onOpen={setOpenId} />
            </div>
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
