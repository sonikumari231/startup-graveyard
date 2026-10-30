import type { FeedItem, RecentShutdownReport, Startup } from "./types";

const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? "";
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

async function get<T>(path: string): Promise<T> {
  if (USE_MOCK) throw new Error("mock mode");
  const res = await fetch(`${BASE}${path}`, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${path} failed with ${res.status}`);
  return (await res.json()) as T;
}

export const getStartups = () => get<Startup[]>("/api/startups");
export const getFeed = () => get<FeedItem[]>("/api/feed");
export const getRecentReports = () => get<{ reports: RecentShutdownReport[]; updatedAt: string }>("/api/feed/recent-reports");

import type { ChatRequest, ChatResponse } from "./types";

/** Sends a question to your RAG endpoint. Throws if the API is not reachable. */
export async function askChat(body: ChatRequest): Promise<ChatResponse> {
  if (USE_MOCK) throw new Error("mock mode");
  const res = await fetch(`${BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`/api/chat failed with ${res.status}`);
  return (await res.json()) as ChatResponse;
}
