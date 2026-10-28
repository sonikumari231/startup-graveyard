import { useEffect, useState } from "react";
import { getFeed, getStartups } from "./api";
import { FEED } from "./data/feed";
import { STARTUPS } from "./data/startups";
import type { FeedItem, Startup } from "./types";

interface DataState {
  startups: Startup[];
  feed: FeedItem[];
  live: boolean;
  loading: boolean;
}

/** Loads data from the API. If the API is not reachable, it falls back to the sample data. */
export function useData(): DataState {
  const [state, setState] = useState<DataState>({ startups: [], feed: [], live: false, loading: true });
  useEffect(() => {
    let off = false;
    (async () => {
      try {
        const [startups, feed] = await Promise.all([getStartups(), getFeed()]);
        if (!off) setState({ startups, feed, live: true, loading: false });
      } catch {
        if (!off) setState({ startups: STARTUPS, feed: FEED, live: false, loading: false });
      }
    })();
    return () => { off = true; };
  }, []);
  return state;
}

/** A boolean-set stored in localStorage (used for saved cases). */
export function useSavedSet(key: string): [Set<string>, (id: string) => boolean] {
  const [saved, setSaved] = useState<Set<string>>(() => {
    try { return new Set<string>(JSON.parse(localStorage.getItem(key) || "[]")); } catch { return new Set<string>(); }
  });
  const toggle = (id: string): boolean => {
    const next = new Set(saved);
    const nowSaved = !next.has(id);
    if (nowSaved) next.add(id); else next.delete(id);
    setSaved(next);
    try { localStorage.setItem(key, JSON.stringify([...next])); } catch { /* storage unavailable */ }
    return nowSaved;
  };
  return [saved, toggle];
}
