export type CauseKey =
  | "market" | "cash" | "cost" | "product" | "compete" | "timing"
  | "fraud" | "scale" | "legal" | "focus" | "growth" | "model";

export interface Reason {
  cause: CauseKey;
  title: string;
  text: string;
}

export interface TimelineItem {
  when: string;
  text: string;
}

/** Shape returned by GET /api/startups (array). */
export interface Startup {
  id: string;
  name: string;
  what: string;
  sector: string;
  country: string;
  hq: string;
  founded: number;
  closedYear: number;
  closedLabel: string;
  raisedMillions: number;
  status: string;
  founders: string[];
  investors: string[];
  competitors: string[];
  reasons: Reason[];
  timeline: TimelineItem[];
  lesson: string;
  sources?: { title: string; url: string }[];
  wikiQuery?: string;
}

/** Shape returned by GET /api/feed (array). Use either `date` (YYYY-MM-DD) or `month` (YYYY-MM). */
export interface FeedItem {
  id: string;
  date?: string;
  month?: string;
  when?: string;
  name: string;
  country?: string;
  raised: string;
  causes: CauseKey[];
  why: string;
  sourceTitle: string;
  sourceUrl: string;
}

/** A startup plus values the UI works out itself. */
export interface Case extends Startup {
  life: number;
  causes: CauseKey[];
  no: number;
}

/** One message in the Ask AI chat. */
export interface ChatMsg {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** Startups the answer is based on. Each `id` matches a Startup `id`. */
  sources?: { id: string; name: string }[];
  /** True when the answer came from the built-in offline demo and not from your API. */
  demo?: boolean;
}

/** Body of POST /api/chat */
export interface ChatRequest {
  message: string;
  history: { role: "user" | "assistant"; content: string }[];
}

/** Response of POST /api/chat */
export interface ChatResponse {
  answer: string;
  sources: { id: string; name: string }[];
}
