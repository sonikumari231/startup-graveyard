const prisma = require("../../db/prisma");

async function listApprovedStartups() {
  const rows = await prisma.startup.findMany({
    where: { approved: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      what: true,
      sector: true,
      country: true,
      hq: true,
      founded: true,
      closedYear: true,
      closedLabel: true,
      raisedMillions: true,
      status: true,
      founders: true,
      investors: true,
      competitors: true,
      lesson: true,
      wikiQuery: true,
      website: true,
      reasons: {
        orderBy: [{ position: "asc" }, { id: "asc" }],
        select: { cause: true, title: true, text: true },
      },
      timeline: {
        orderBy: [{ position: "asc" }, { id: "asc" }],
        select: { whenLabel: true, text: true },
      },
      sources: {
        orderBy: { id: "asc" },
        select: { title: true, url: true },
      },
    },
  });

  return rows.map((startup) => ({
    id: startup.id,
    name: startup.name,
    what: startup.what,
    sector: startup.sector,
    country: startup.country,
    hq: startup.hq,
    founded: startup.founded,
    closedYear: startup.closedYear,
    closedLabel: startup.closedLabel,
    raisedMillions: Number(startup.raisedMillions),
    status: startup.status,
    founders: startup.founders,
    investors: startup.investors,
    competitors: startup.competitors,
    reasons: startup.reasons,
    timeline: startup.timeline.map(({ whenLabel, text }) => ({
      when: whenLabel,
      text,
    })),
    lesson: startup.lesson,
    sources: startup.sources,
    website: startup.website,
    ...(startup.wikiQuery === null ? {} : { wikiQuery: startup.wikiQuery }),
  }));
}


async function createStartupRecord(data) {
  return prisma.startup.create({
    data: {
      id: data.id,
      name: data.name,
      what: data.what,
      sector: data.sector,
      country: data.country,
      hq: data.hq,
      founded: data.founded,
      closedYear: data.closedYear,
      closedLabel: data.closedLabel,
      raisedMillions: data.raisedMillions ?? 0,
      status: data.status,
      founders: data.founders ?? [],
      investors: data.investors ?? [],
      competitors: data.competitors ?? [],
      lesson: data.lesson,
      website: data.website,
      wikiQuery: data.wikiQuery,
      approved: false,
      reasons: {
        create: data.reasons.map((reason, position) => ({
          cause: reason.cause,
          title: reason.title,
          text: reason.text,
          position,
        })),
      },
      timeline: {
        create: data.timeline.map((item, position) => ({
          whenLabel: item.when,
          text: item.text,
          position,
        })),
      },
      sources: {
        create: data.sources.map((source) => ({
          title: source.title,
          url: source.url,
        })),
      },
    },
  });
}

module.exports = { listApprovedStartups, createStartupRecord };