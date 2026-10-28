# Backend system design

The target architecture is a set of independently deployable services behind one API gateway.
This is an architecture plan, not an implementation: the service folders contain documentation
only. The existing Express app, Prisma schema, migrations, and PostgreSQL Compose service have not
been moved or changed.

## Context and request flow

```text
                         ┌─────────────────────┐
Browser / React ────────▶│ API gateway :5000   │
                         └──────────┬──────────┘
                           ┌────────┼─────────┐
                           ▼        ▼         ▼
                    Startup Catalog  News Feed  Ask AI
                           │        │         │
                           ▼        ▼         ├──▶ ChromaDB
                    Catalog DB    Feed DB     └──▶ LLM provider
                           │
                           └── outbox / events ───▶ AI indexing worker
```

The gateway keeps the browser-facing API stable. The frontend currently calls
`GET /api/startups`, `GET /api/feed`, and `POST /api/chat`; preserve their response formats from
[`../docs/API.md`](../docs/API.md). It should route requests and apply shared edge concerns, not
contain catalog, feed, or AI business logic.

## Service boundaries and data ownership

| Component | Owns | Storage | Scale independently when |
|---|---|---|---|
| `api-gateway/` | Public routing, request IDs, shared rate limits | No business data | Public traffic or gateway work grows |
| `startup-catalog/` | Startup records, reasons, timelines, sources, approval | PostgreSQL through Prisma | Catalog reads/writes need different capacity |
| `news-feed/` | News items, source metadata, feed approval | PostgreSQL | News ingestion or feed reads grow |
| `ask-ai/` | Retrieval, prompt construction, model calls, source validation | ChromaDB; no authoritative company records | Embedding/search/model workload grows |
| AI indexing worker | Converts approved catalog changes into searchable chunks | ChromaDB; consumes catalog events | Embedding jobs need independent throughput |

Each service owns its data and exposes it through an API or event contract. Other services must
not read or write its tables directly. In local development, PostgreSQL may run as one server with
separate databases or schemas and separate service credentials. This is a deployment convenience,
not shared table ownership; separate database instances can be introduced when operationally
useful.

The current [`prisma/schema.prisma`](./prisma/schema.prisma) belongs to the Startup Catalog
boundary. Before splitting services into separate deployable applications, move the schema and
migrations into the catalog service and give each service its own configuration and lifecycle.
Do not point multiple services at one shared Prisma schema.

## Cross-service data flow

1. An authorized editor submits a startup to Startup Catalog; it is stored as pending.
2. Catalog review approves it and commits the record plus an outbox event in one transaction.
3. An asynchronous worker consumes the event, creates or updates the startup's chunks in ChromaDB,
   and records/retries processing safely.
4. Ask AI searches ChromaDB, calls the LLM with retrieved context, and returns only verified
   catalog IDs as sources.
5. Catalog edits and removals emit events too, so stale vectors can be updated or removed.

This event-driven index keeps a slow embedding provider out of the catalog write request. Event
delivery is at least once: consumers must be idempotent. Use an outbox to avoid committing catalog
data without its corresponding event. Search results may briefly lag behind an approval or edit;
the catalog remains the source of truth.

## Reliability, security, and scaling

- Keep gateway and API services stateless; store durable state in their owned databases. This
  allows multiple service instances behind a load balancer.
- Set request timeouts and bounded retries for service-to-service calls. Do not retry writes
  unless they use idempotency protection. Use a circuit breaker or controlled unavailable response
  when a dependency is unhealthy.
- Bound list endpoints with pagination as catalog size grows. Add indexes based on measured
  query patterns; avoid unbounded result sets.
- Validate inputs at the service boundary. Protect catalog write/review operations with
  authentication and authorization. Keep database and LLM credentials server-side.
- Apply rate limits and request-size limits at the gateway; add tighter limits to costly AI calls.
- Use health/readiness checks, structured logs with a request/correlation ID, error monitoring,
  and metrics for latency, failure rate, database pools, queue lag, and AI cost.
- Back up authoritative PostgreSQL data and test restore procedures. ChromaDB is a derived index
  and should be rebuildable from approved catalog data/events.

## Suggested implementation sequence

1. Keep the existing database and Express API working while defining service contracts.
2. Extract Startup Catalog first; keep the frontend paths and response shapes stable through the
   gateway.
3. Add News Feed with its own data ownership.
4. Add Ask AI retrieval and the asynchronous indexing flow after catalog approval/edit events are
   reliable.
5. Add a message broker only when asynchronous indexing or ingestion needs it; begin locally with
   a simple durable queue/outbox implementation, then choose managed infrastructure for deployment.
6. Containerize and deploy services independently; add replicas, caching, and separate database
   capacity only when measurements justify them.

## Current status

Only PostgreSQL is currently managed by [`compose.yaml`](./compose.yaml). The service folders are
architecture scaffolding and are not runnable services. The frontend development proxy targets
`http://localhost:5000`. The RAG plan is in [`../docs/RAG.md`](../docs/RAG.md).

Keep secrets in a private `.env` file; the repository root ignores `.env`. Do not put secrets in
the frontend's environment because frontend values can be exposed in the browser bundle.
