const prisma = require("../../db/prisma");
const { randomUUID } = require("node:crypto");

const REPORT_QUERY = '(startup OR "start-up") ("shuts down" OR "shutting down" OR shutdown OR bankruptcy OR liquidation OR "ceases operations")';
let reportCache = { expiresAt: 0, reports: null, updatedAt: null };
let reportRetryAt = 0;
let reportInFlight = null;

async function searchRecentShutdownReports() {
  if (reportCache.reports && reportCache.expiresAt > Date.now()) return reportCache;
  if (reportInFlight) return reportInFlight;
  if (reportRetryAt > Date.now()) {
    if (reportCache.reports) return reportCache;
    const error = new Error("GDELT is temporarily unavailable; retry after the cooldown");
    error.status = 429;
    error.suppressed = true;
    error.retryAt = reportRetryAt;
    throw error;
  }

  reportInFlight = fetchRecentShutdownReports();
  try {
    return await reportInFlight;
  } finally {
    reportInFlight = null;
  }
}

async function fetchRecentShutdownReports() {
  const params = new URLSearchParams({
    query: REPORT_QUERY,
    mode: "ArtList",
    format: "json",
    sort: "DateDesc",
    timespan: "30d",
    maxrecords: "30",
  });
  let response;
  try {
    response = await fetch(`https://api.gdeltproject.org/api/v2/doc/doc?${params}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(15000),
    });
  } catch (error) {
    // Avoid retrying a failed outbound request on every page refresh.
    reportRetryAt = Date.now() + 2 * 60 * 1000;
    throw error;
  }

  if (!response.ok) {
    const retryHeader = response.headers.get("retry-after");
    const retrySeconds = Number(retryHeader);
    const retryDate = retryHeader ? Date.parse(retryHeader) : NaN;
    const retryDelay = Number.isFinite(retrySeconds) && retrySeconds > 0
      ? retrySeconds * 1000
      : Number.isFinite(retryDate) && retryDate > Date.now()
        ? retryDate - Date.now()
        : response.status === 429 ? 15 * 60 * 1000 : 2 * 60 * 1000;
    reportRetryAt = Date.now() + Math.max(retryDelay, 60 * 1000);
    const error = new Error(`GDELT returned ${response.status}`);
    error.status = response.status;
    error.retryAt = reportRetryAt;
    throw error;
  }

  const body = await response.json();
  const reports = (Array.isArray(body.articles) ? body.articles : [])
    .filter((article) => typeof article.title === "string" && typeof article.url === "string")
    .map((article) => {
      const seen = String(article.seendate || "");
      const date = /^\d{14}$/.test(seen)
        ? `${seen.slice(0, 4)}-${seen.slice(4, 6)}-${seen.slice(6, 8)}`
        : null;
      let source = article.domain;
      if (!source) {
        try { source = new URL(article.url).hostname; } catch { return null; }
      }
      return {
        id: article.url,
        title: article.title,
        url: article.url,
        source,
        date,
        country: article.sourcecountry || null,
      };
    })
    .filter(Boolean)
    .filter((report, index, all) => all.findIndex((item) => item.url === report.url) === index);

  reportCache = { reports, expiresAt: Date.now() + 10 * 60 * 1000, updatedAt: new Date().toISOString() };
  reportRetryAt = 0;
  return reportCache;
}

async function listApprovedFeedItems() {
  const rows = await prisma.feedItem.findMany({
    where: { approved: true },
    orderBy: [
      { date: { sort: "desc", nulls: "last" } },
      { month: { sort: "desc", nulls: "last" } },
      { createdAt: "desc" },
    ],
    select: {
      id: true,
      date: true,
      month: true,
      whenLabel: true,
      name: true,
      country: true,
      raised: true,
      causes: true,
      why: true,
      sourceTitle: true,
      sourceUrl: true,
    },
  });

  return rows.map((item) => ({
    id: item.id,
    ...(item.date
      ? { date: item.date.toISOString().slice(0, 10) }
      : item.month
        ? { month: item.month }
        : {}),
    ...(item.whenLabel ? { when: item.whenLabel } : {}),
    name: item.name,
    ...(item.country ? { country: item.country } : {}),
    raised: item.raised,
    causes: item.causes,
    why: item.why,
    sourceTitle: item.sourceTitle,
    sourceUrl: item.sourceUrl,
  }));
}

async function createFeedItemRecord(data) {
  const item = await prisma.feedItem.create({
    data: {
      id: data.id?.trim() || randomUUID(),
      date: data.date ? new Date(`${data.date}T00:00:00.000Z`) : null,
      month: data.month || (data.date ? data.date.slice(0, 7) : null),
      whenLabel: data.when?.trim() || null,
      name: data.name.trim(),
      country: data.country?.trim() || null,
      raised: data.raised.trim(),
      causes: data.causes,
      why: data.why.trim(),
      sourceTitle: data.sourceTitle.trim(),
      sourceUrl: data.sourceUrl.trim(),
      approved: true,
    },
    select: {
      id: true,
      date: true,
      month: true,
      whenLabel: true,
      name: true,
      country: true,
      raised: true,
      causes: true,
      why: true,
      sourceTitle: true,
      sourceUrl: true,
    },
  });

  return {
    id: item.id,
    ...(item.date
      ? { date: item.date.toISOString().slice(0, 10) }
      : item.month
        ? { month: item.month }
        : {}),
    ...(item.whenLabel ? { when: item.whenLabel } : {}),
    name: item.name,
    ...(item.country ? { country: item.country } : {}),
    raised: item.raised,
    causes: item.causes,
    why: item.why,
    sourceTitle: item.sourceTitle,
    sourceUrl: item.sourceUrl,
  };
}

module.exports = { listApprovedFeedItems, searchRecentShutdownReports, createFeedItemRecord };
