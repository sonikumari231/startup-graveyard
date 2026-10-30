// Adds a few documented historical shutdowns to the local archive.
// Run from server/: npm run seed:real
require("dotenv").config({ path: require("node:path").join(__dirname, "..", ".env") });

const prisma = require("../src/db/prisma");
const fs = require("node:fs");
const path = require("node:path");

function loadBuiltInCatalog() {
  const catalogPath = path.join(__dirname, "../../client/src/data/startups.ts");
  const source = fs.readFileSync(catalogPath, "utf8");
  const start = source.indexOf("= [") + 2;
  const end = source.lastIndexOf("];");
  if (start < 2 || end < start) throw new Error("Could not read the built-in startup catalog");
  return JSON.parse(source.slice(start, end + 1));
}

const records = [
  {
    id: "homejoy",
    name: "Homejoy",
    what: "An online service that connected customers with home-cleaning professionals.",
    sector: "Hospitality",
    country: "US",
    hq: "San Francisco, California",
    founded: 2012,
    closedYear: 2015,
    closedLabel: "Jul 2015",
    raisedMillions: 40,
    status: "Shut down",
    founders: ["Adora Cheung", "Aaron Cheung"],
    investors: [],
    competitors: ["Handy"],
    lesson: "Track repeat use and service economics, and account for the legal costs of the labor model.",
    website: "https://homejoy.com",
    reasons: [
      {
        cause: "legal",
        title: "Worker classification lawsuits",
        text: "Homejoy faced lawsuits alleging that cleaners were misclassified as independent contractors. Its CEO said the legal situation made fundraising more difficult and was a deciding factor in the shutdown.",
      },
      {
        cause: "cash",
        title: "Could not raise enough to continue",
        text: "The company shut down after it could not raise enough funding to keep operating. Reports also described growth and repeat-customer challenges; these are reported contributing factors, not a single proven cause.",
      },
    ],
    timeline: [
      { when: "2012", text: "Founded by siblings Adora and Aaron Cheung." },
      { when: "Jul 2015", text: "Announced it would close on July 31 after failing to raise sufficient funding." },
    ],
    sources: [
      { title: "Homejoy Is Shutting Down At The End Of The Month — TechCrunch", url: "https://techcrunch.com/2015/07/17/homejoy-is-shutting-down-at-the-end-of-the-month/" },
      { title: "How to Avoid Crashing and Burning Like This $150 Million Company — Inc.", url: "https://www.inc.com/alex-moazed/3-tips-to-avoid-crashing-and-burning-a-150-million-startup.html" },
    ],
  },
  {
    id: "grooveshark",
    name: "Grooveshark",
    what: "A web-based music service where users could stream and share music on demand.",
    sector: "Music",
    country: "US",
    hq: "Gainesville, Florida",
    founded: 2006,
    closedYear: 2015,
    closedLabel: "Apr 2015",
    raisedMillions: 4.28,
    status: "Shut down",
    founders: ["Sam Tarantino", "Josh Greenberg", "Andres Barreto"],
    investors: [],
    competitors: ["Spotify", "Deezer"],
    lesson: "Secure the rights needed to distribute content before building the service around it.",
    website: "https://grooveshark.com",
    reasons: [
      {
        cause: "legal",
        title: "Copyright settlement ended the service",
        text: "After years of litigation over unlicensed music, Grooveshark reached a settlement with major record labels and agreed to cease operations, remove the labels’ copyrighted works, and hand over its intellectual property.",
      },
    ],
    timeline: [
      { when: "2006", text: "Founded as a web-based music streaming service." },
      { when: "Apr 2015", text: "Shut down as part of a settlement with major record labels." },
    ],
    sources: [
      { title: "Music Streaming Site Grooveshark Closes As Part Of Legal Settlement — TechCrunch", url: "https://techcrunch.com/2015/04/30/grooveshark-sinks/" },
      { title: "Music Streaming Website Grooveshark Shuts Down — TIME", url: "https://time.com/3842959/grooveshark-shuts-down-sued-internet-business-escape-media-group/" },
      { title: "Grooveshark — Startup Graveyard (funding estimate)", url: "https://startupgraveyard.io/grooveshark/" },
    ],
  },
  {
    id: "rdio",
    name: "Rdio",
    what: "A subscription music-streaming service for discovering, listening to, and sharing music.",
    sector: "Music",
    country: "US",
    hq: "San Francisco, California",
    founded: 2008,
    closedYear: 2015,
    closedLabel: "Dec 2015",
    raisedMillions: 127.7,
    status: "Shut down; assets acquired",
    founders: ["Janus Friis", "Niklas Zennström"],
    investors: [],
    competitors: ["Spotify", "Pandora"],
    lesson: "A sale of selected technology and talent does not always preserve the original service.",
    website: "https://www.rdio.com",
    reasons: [
      {
        cause: "cash",
        title: "Filed for bankruptcy and wound down",
        text: "Rdio entered Chapter 11 and discontinued its service in December 2015. Pandora acquired selected technology and intellectual property, not Rdio’s operating business; the cited filings confirm the shutdown and asset sale but do not establish one definitive underlying failure cause.",
      },
    ],
    timeline: [
      { when: "2008", text: "Founded as a music-streaming service." },
      { when: "Nov 2015", text: "Announced a bankruptcy-supervised sale of selected assets to Pandora." },
      { when: "Dec 2015", text: "Discontinued its service as it wound down." },
    ],
    sources: [
      { title: "Pandora to acquire key assets from Rdio — SEC filing", url: "https://www.sec.gov/Archives/edgar/data/1230276/000123027615000046/p-ex991_20151116.htm" },
      { title: "Pandora Completes Acquisition of Rdio technology, IP — SEC filing", url: "https://www.sec.gov/Archives/edgar/data/1230276/000110465915086419/a15-25418_1ex99d1.htm" },
      { title: "Rdio — Startup Graveyard (funding estimate)", url: "https://startupgraveyard.io/rdio/" },
    ],
  },
];

const feedItems = [
  {
    id: "homejoy-closure-2015",
    date: new Date("2015-07-31T00:00:00.000Z"),
    month: "2015-07",
    whenLabel: "Jul 2015",
    name: "Homejoy",
    country: "US",
    raised: "Nearly $40M",
    causes: ["legal", "cash"],
    why: "Homejoy closed after it could not raise enough money to continue. Reporting at the time described worker-classification lawsuits as a deciding factor, alongside fundraising and growth challenges.",
    sourceTitle: "Homejoy Is Shutting Down At The End Of The Month — TechCrunch",
    sourceUrl: "https://techcrunch.com/2015/07/17/homejoy-is-shutting-down-at-the-end-of-the-month/",
  },
  {
    id: "grooveshark-closure-2015",
    date: new Date("2015-04-30T00:00:00.000Z"),
    month: "2015-04",
    whenLabel: "Apr 2015",
    name: "Grooveshark",
    country: "US",
    raised: "$4.28M reported",
    causes: ["legal"],
    why: "Grooveshark shut down as part of a settlement with major record labels after years of copyright litigation over music distributed through its service.",
    sourceTitle: "Music Streaming Site Grooveshark Closes As Part Of Legal Settlement — TechCrunch",
    sourceUrl: "https://techcrunch.com/2015/04/30/grooveshark-sinks/",
  },
  {
    id: "rdio-closure-2015",
    date: new Date("2015-12-22T00:00:00.000Z"),
    month: "2015-12",
    whenLabel: "Dec 2015",
    name: "Rdio",
    country: "US",
    raised: "$127.7M reported",
    causes: ["cash"],
    why: "Rdio entered Chapter 11 and discontinued its service as Pandora acquired selected technology and intellectual property. The filings confirm the wind-down and asset sale, not a single definitive cause of failure.",
    sourceTitle: "Pandora Completes Acquisition of Rdio technology, IP — SEC filing",
    sourceUrl: "https://www.sec.gov/Archives/edgar/data/1230276/000110465915086419/a15-25418_1ex99d1.htm",
  },
];

async function main() {
  for (const record of records) {
    const exists = await prisma.startup.findUnique({ where: { id: record.id }, select: { id: true } });
    if (exists) {
      console.log(`Skipped ${record.name}: ID ${record.id} already exists.`);
      continue;
    }

    await prisma.startup.create({
      data: {
        ...record,
        approved: true,
        reasons: { create: record.reasons.map((item, position) => ({ ...item, position })) },
        timeline: { create: record.timeline.map((item, position) => ({ whenLabel: item.when, text: item.text, position })) },
        sources: { create: record.sources },
      },
    });
    console.log(`Added ${record.name} to the approved archive.`);
  }

  // The frontend's existing catalog contains 23 real-world case records. Import
  // its entries too, so a working API/database doesn't hide that larger catalog.
  for (const record of loadBuiltInCatalog()) {
    const exists = await prisma.startup.findUnique({ where: { id: record.id }, select: { id: true } });
    if (exists) {
      console.log(`Skipped ${record.name}: ID ${record.id} already exists.`);
      continue;
    }

    await prisma.startup.create({
      data: {
        ...record,
        approved: true,
        reasons: { create: record.reasons.map((item, position) => ({ ...item, position })) },
        timeline: { create: record.timeline.map((item, position) => ({ whenLabel: item.when, text: item.text, position })) },
        sources: { create: record.sources ?? [] },
      },
    });
    console.log(`Added ${record.name} from the built-in catalog.`);
  }

  for (const item of feedItems) {
    const exists = await prisma.feedItem.findUnique({ where: { id: item.id }, select: { id: true } });
    if (exists) {
      console.log(`Skipped ${item.name} feed entry: ID ${item.id} already exists.`);
      continue;
    }

    await prisma.feedItem.create({ data: { ...item, approved: true } });
    console.log(`Added ${item.name} to the verified closure feed.`);
  }
}

main()
  .catch((error) => {
    console.error("Could not seed real startup records:", error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
