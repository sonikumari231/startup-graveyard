# RAG guide for "Ask AI"

Goal: answer questions such as "Why did Quibi fail?" or "Which startups ran out of cash?" using
approved catalog content, and show which startups each answer used. PostgreSQL is authoritative;
ChromaDB is a derived search index.

RAG means: **find the relevant records first, then give only those records to the LLM** and ask it
to answer from them. The LLM never answers from memory, so it cannot invent reasons or numbers.

This guide has no code on purpose. It tells you what to build, in order.

---

## 1. The flow for one question

```
question
  → (1) turn the question into an embedding
  → (2) find the most similar chunks in ChromaDB
  → (3) also run a keyword search for exact names (hybrid)
  → (4) merge, remove duplicates, keep the best 6 to 8 chunks
  → (5) build a prompt: rules + chunks + last few messages + question
  → (6) call the LLM
  → (7) return { answer, sources } to the client
```

## 2. What to store

Keep PostgreSQL as the source of truth for startups, reasons, and timeline (the shape in
`API.md`). Store searchable chunks in ChromaDB as a derived index. Each chunk has:

- the text itself
- the startup it belongs to (`startupId`)
- a type label: `summary`, `reason`, `timeline`, or `lesson`
- its embedding (stored by ChromaDB)

Store the startup ID and other useful metadata with each ChromaDB record. Use ChromaDB's metadata
filters for fields such as sector or country. PostgreSQL remains authoritative; ChromaDB can be
rebuilt from approved records if the index is lost.

## 3. How to split text into chunks

Do **not** split by length. Split by meaning, because your data is already structured:

| Chunk | Text to embed |
| --- | --- |
| summary | name, what it was, sector, country, years, money raised, status, founders |
| reason (one per reason) | name + cause label + reason title + reason text |
| timeline | name + all timeline lines joined |
| lesson | name + lesson |

Always put the **company name at the start of every chunk**. Without it, a chunk like "Costs grew
faster than sales" does not say which company it is about, and the LLM will mix them up.

## 4. Ingestion (run when data changes)

1. Read approved startup content from the Startup Catalog service, or consume its approved-change
   events.
2. Build the chunks above.
3. Send the chunk texts to an embedding model in batches.
4. Upsert vectors into ChromaDB. Re-embed only the startups that changed.
5. Trigger indexing from durable approved-change events. Keep the event and catalog change
   consistent with an outbox; make the consumer idempotent and retry failed jobs. Provide a
   reconciliation/rebuild path in case events are missed.

Use one embedding model for everything. If you change the model later, re-embed all chunks,
because vectors from different models cannot be compared.

## 5. Retrieval

- **Vector search:** embed the question with the same model, get the 8 nearest chunks from
  ChromaDB.
- **Keyword search:** use an internal Startup Catalog search endpoint or ChromaDB text search for
  company names and terms. This catches questions like "Byju's" that embeddings can miss; do not
  query the Catalog service's database directly.
- **Merge:** combine both lists, remove duplicate chunks, and keep the top 6 to 8.
- **Filters:** if the question names a sector, country, or year, use chunk metadata filters where
  available.
- **Follow-up questions:** a message like "and why did it close?" has no company name. Use the last
  few messages to rewrite it into a full question before searching ("Why did Humane close?").
  A cheap LLM call is enough for this.

## 6. The prompt

Build it from three parts:

1. **Rules (system message):**
   - Answer only from the provided context.
   - If the context does not contain the answer, say you do not know. Do not guess.
   - Never invent dates, amounts or causes.
   - Name the companies you used.
   - Keep answers short, in plain text, no markdown.
2. **Context:** each chunk labelled with its startup `id` and name.
3. **The conversation:** last few messages, then the question.

Ask the LLM to return structured output: the answer text, plus the list of startup `id`s it used.
Check that every returned `id` belongs to approved catalog content, using the retrieved metadata
and, when needed, a bulk lookup through the Catalog service's internal API. Drop any invalid IDs;
do not query the Catalog database directly.

## 7. Response

Return `{ "answer": "...", "sources": [{ "id": "...", "name": "..." }] }` as described in `API.md`.

## 8. Using the same pipeline for the daily feed

The daily news job and RAG share the same data:

1. Fetch articles from news search, RSS feeds, or a news API.
2. Ask the LLM to extract fields as JSON (name, country, reasons, money raised) from the article text.
   Tell it to use `null` for anything the article does not say.
3. Save as `pending`. Approve by hand. Keep the source URL.
4. Once approved, chunk and embed it, so the chat can answer about it too.

## 9. Safety and quality checklist

- Only approved records are searchable; remove or update ChromaDB entries when their catalog
  records are unapproved, edited, or deleted.
- Every answer shows its sources, and clicking a source opens the case.
- Set a similarity cut-off. If the best chunk is a weak match, answer "I could not find that".
- Limit input length and rate-limit `/api/chat` per user or IP. Keep the LLM key on the server only.
- Log questions and sources so you can see where answers go wrong.
- Build a test list of 20 to 30 questions with known answers (for example, "Which startups failed
  because of fraud?" should return Theranos and Builder.ai). Run it after every change to chunking,
  the embedding model, or the prompt.
- Do not put personal data in prompts or logs.

## 10. Build order

1. Choose ChromaDB deployment and create a collection using one embedding model.
2. Build an idempotent indexer for approved catalog records/events; support retries and a full
   rebuild.
3. Implement retrieval and test the returned chunks on representative questions.
4. Add the LLM call and grounded-answer prompt.
5. Expose `POST /api/chat` through Ask AI and the API gateway. Preserve the client response
   contract.
6. Add evaluation questions, rate limits, request tracing, and cost/error monitoring.
7. Later: streaming answers and re-ranking if evaluation shows retrieval needs it.
