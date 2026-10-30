const OpenAI = require("openai");
const prisma = require("../../db/prisma");

function makeSearchText(startup) {
  return [
    startup.name,
    startup.what,
    startup.sector,
    startup.country,
    startup.status,
    startup.lesson,
    ...startup.reasons.map((reason) =>
      `${reason.cause} ${reason.title} ${reason.text}`
    ),
    ...startup.timeline.map((item) =>
      `${item.whenLabel} ${item.text}`
    ),
  ]
    .join(" ")
    .toLowerCase();
}

function scoreStartup(startup, question) {
  const searchText = makeSearchText(startup);
  const words = question.toLowerCase().match(/[a-z0-9]+/g) || [];

  return words.reduce(
    (score, word) => score + (searchText.includes(word) ? 1 : 0),
    0
  );
}

async function answerChat(message, history) {
  if (!process.env.LLM_API_KEY || !process.env.LLM_MODEL) {
    throw new Error("Chat API is not configured");
  }

const openai = new OpenAI({
  apiKey: process.env.LLM_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

  const startups = await prisma.startup.findMany({
    where: { approved: true },
    include: {
      reasons: { orderBy: { position: "asc" } },
      timeline: { orderBy: { position: "asc" } },
    },
  });

  const matches = startups
    .map((startup) => ({ startup, score: scoreStartup(startup, message) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((item) => item.startup);

  if (matches.length === 0) {
    return {
      answer: "I could not find an approved startup in the catalog that answers that question.",
      sources: [],
    };
  }

  const context = matches.map((startup) => ({
    id: startup.id,
    name: startup.name,
    what: startup.what,
    sector: startup.sector,
    country: startup.country,
    founded: startup.founded,
    closedYear: startup.closedYear,
    raisedMillions: Number(startup.raisedMillions),
    status: startup.status,
    reasons: startup.reasons.map(({ cause, title, text }) => ({
      cause,
      title,
      text,
    })),
    timeline: startup.timeline.map(({ whenLabel, text }) => ({
      when: whenLabel,
      text,
    })),
    lesson: startup.lesson,
  }));

  const response = await openai.responses.create({
    model: process.env.LLM_MODEL,
    instructions:
      "Answer only from the supplied startup catalog context. If it does not answer the question, say you do not know. Do not invent facts, dates, amounts, or causes. Reply briefly in plain text without markdown.",
    input: [
      ...history.map(({ role, content }) => ({ role, content })),
      {
        role: "user",
        content: `Catalog context:\n${JSON.stringify(context)}\n\nQuestion: ${message}`,
      },
    ],
  });

  return {
    answer: response.output_text,
    sources: matches.map(({ id, name }) => ({ id, name })),
  };
}

module.exports = { answerChat };