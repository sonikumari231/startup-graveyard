# Ask AI service

## Responsibility and ownership

Own question handling, retrieval, prompt construction, model-provider calls, and response/source
validation for `POST /api/chat`. The RAG flow is documented in
[`../../../docs/RAG.md`](../../../docs/RAG.md).

Use ChromaDB as a derived vector index, not as the authoritative company database. Index only
approved content. Catalog/feed records remain owned by their respective services; Ask AI receives
approved-content events for indexing and does not query their tables.

## Reliability and safety

- Keep provider keys server-side; never expose them to the browser.
- Limit request size, history length, concurrency, and per-client/provider spend.
- Apply timeouts and bounded retries to provider calls; surface a controlled error if retrieval or
  generation is unavailable.
- Verify returned source IDs against retrieved, approved records before responding.
- Make indexing idempotent, track failures, and support replay/rebuild of the derived collection.

This directory is architecture documentation only; no ChromaDB connection, model integration,
service process, or endpoint exists yet.
