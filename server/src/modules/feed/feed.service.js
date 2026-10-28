const prisma = require("../../db/prisma");

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

module.exports = { listApprovedFeedItems };