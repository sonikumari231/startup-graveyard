import { CAUSES } from "../data/causes";
import type { Case, ChatResponse } from "../types";
import { money } from "./utils";

/**
 * Offline demo used only when POST /api/chat is not reachable.
 * It scores startups by matching words (no LLM, no embeddings) and writes the answer from their text.
 * Your real backend replaces this with retrieval + an LLM.
 */
const STOP = new Set(("the a an and or of to in on for is are was were why how what which who when did do does it its out " +
  "this that with from by as at be been about tell me give show startup startups company companies failed fail failure " +
  "more detail details explain elaborate else also then and so please ok yes " +
  "reason reasons because").split(" "));

// Lowercase words, with a simple plural fix, so "startups" and "startup" match.
const norm = (w: string): string => (w.length > 3 && w.endsWith("s") ? w.slice(0, -1) : w);
const words = (s: string): string[] => (s.toLowerCase().match(/[a-z0-9]+/g) ?? []).map(norm);
const tokens = (s: string): string[] => words(s).filter((w) => w.length > 2 && !STOP.has(w));

function score(d: Case, q: string[], raw: string): number {
  let s = 0;
  if (raw.toLowerCase().includes(d.name.toLowerCase())) s += 20;
  const name = new Set(words(d.name));
  const body = new Set(words([d.what, d.sector, d.country, d.hq, d.founders.join(" "), d.investors.join(" "), d.lesson,
    d.reasons.map((r) => r.title + " " + r.text).join(" "), d.causes.map((c) => CAUSES[c].label).join(" ")].join(" ")));
  const causeWords = new Set(words(d.causes.map((c) => CAUSES[c].label).join(" ")));
  for (const w of q) {
    if (name.has(w)) s += 3;
    if (body.has(w)) s += 1;
    if (causeWords.has(w)) s += 2;
  }
  return s;
}

/** Full explanation for one startup. */
function explain(d: Case): string {
  const lines = d.reasons.map((r) => `• ${r.title}: ${r.text}`).join("\n");
  return `${d.name} (${d.founded} to ${d.closedLabel}, about ${money(d.raisedMillions)} raised) failed for ${d.reasons.length} main reasons:\n${lines}\nLesson: ${d.lesson}`;
}

/**
 * `lastSourceIds` are the startups used in the previous answer. They make follow-ups such as
 * "why?" or "tell me more" work. (A real backend does this by rewriting the question with the chat history.)
 */
export function offlineAnswer(question: string, cases: Case[], lastSourceIds: string[] = []): ChatResponse {
  const q = tokens(question);
  const ranked = cases
    .map((d) => ({ d, s: score(d, q, question) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 3);

  const followUp = lastSourceIds.length > 0 && q.length === 0;
  if (followUp) {
    const prev = lastSourceIds.map((id) => cases.find((c) => c.id === id)).filter(Boolean).slice(0, 3) as Case[];
    if (prev.length) {
      return { answer: prev.map(explain).join("\n\n"), sources: prev.map((d) => ({ id: d.id, name: d.name })) };
    }
  }

  if (!ranked.length) {
    return {
      answer: "I could not find anything about that in the graveyard. Try a company name, a sector, or a cause such as running out of cash.",
      sources: [],
    };
  }

  const top = ranked[0].d;
  const named = question.toLowerCase().includes(top.name.toLowerCase());
  if (named) {
    return { answer: explain(top), sources: [{ id: top.id, name: top.name }] };
  }

  const lines = ranked.map(({ d }) => `• ${d.name} (${d.founded} to ${d.closedYear}): ${d.reasons[0].title}. ${d.reasons[0].text}`).join("\n");
  return {
    answer: `Closest matches in the graveyard:\n${lines}`,
    sources: ranked.map(({ d }) => ({ id: d.id, name: d.name })),
  };
}
