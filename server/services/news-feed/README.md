# News Feed service

## Responsibility and ownership

Own recent shutdown-news items, their source metadata, review state, and the feed read API. The
frontend response shape is documented in [`../../../docs/API.md`](../../../docs/API.md).
The service should own its persistence; other services consume its API or events rather than
reading its tables.

## Data lifecycle

News collection and extraction should create pending items. A reviewer approves items before they
are public. Keep source URLs and distinguish exact dates from month-only dates as required by the
client contract.

If approved news is also indexed for Ask AI, publish an event after the feed record is committed.
Use durable event delivery and idempotent consumers rather than calling embedding/LLM providers in
the feed write request.

The feed service is architecture documentation only; no schema, process, or endpoints exist yet.
