# API gateway

## Responsibility

Provide the single browser-facing API origin, route requests to backend services, and apply
cross-cutting edge policies. The gateway should not own startup, feed, or chat business rules or
query service databases directly.

## Public contract

Keep the frontend-facing paths and JSON shapes documented in
[`../../../docs/API.md`](../../../docs/API.md):

- `GET /api/startups` → Startup Catalog
- `GET /api/feed` → News Feed
- `POST /api/chat` → Ask AI

The gateway can add a version prefix for future breaking changes, but should preserve the current
paths until the client is deliberately updated.

## System concerns

- Assign or propagate a request/correlation ID across internal calls.
- Enforce request size limits, shared rate limits, and authentication policies where appropriate.
- Use bounded timeouts and return a consistent unavailable response when a downstream service is
  unhealthy. Do not retry non-idempotent writes automatically.
- Keep the gateway stateless so multiple instances can sit behind a load balancer.
- Do not put database credentials for service-owned databases in the gateway.

This directory is architecture documentation only; there is no gateway process or routing code.
