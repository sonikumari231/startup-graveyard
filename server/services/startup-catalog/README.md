# Startup Catalog service

## Responsibility and ownership

Own authoritative startup records, failure reasons, timelines, sources, approval state, and
catalog APIs. PostgreSQL is the source of truth; use Prisma for this service's persistence. Other
services must not access the catalog's tables directly.

The current schema and migration history remain in [`../../prisma/`](../../prisma/). They are
currently part of the existing backend, not yet extracted into this service. Before independent
deployment, move ownership deliberately and preserve the migration history.

## Data lifecycle

- New submissions are pending and are not visible through public catalog reads.
- Authorized reviewers approve, edit, or reject submissions.
- Approved creates/updates and removals publish an outbox event in the same transaction as the
  catalog change.
- Event consumers may receive duplicates; event IDs and handlers must support idempotent
  processing.

## API contract

Provide public reads matching [`../../../docs/API.md`](../../../docs/API.md). Protect write and
moderation operations with authentication and role-based authorization. Add paging and filters
when the catalog outgrows returning a bounded result set.

The catalog is architecture documentation only; no separate service process or endpoints exist.
