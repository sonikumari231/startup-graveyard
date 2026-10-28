# API contract for the frontend

The client calls these endpoints and expects JSON. Until they exist, it shows built-in sample data
(`client/src/data/`), so you can build the backend step by step.

The two GET endpoints return a plain JSON **array** with status `200`. The chat endpoint is a POST and is described at the end.
Field names are camelCase. Map them to your PostgreSQL column names however you like.

---

## `GET /api/startups`

Returns every approved startup. The client does the searching, filtering and sorting itself,
so you do not need query parameters to start. (Add server-side paging later if the list gets large.)

```jsonc
[
  {
    "id": "quibi",                       // string, unique, URL-safe. Used in links like /#case-quibi
    "name": "Quibi",
    "what": "Premium short-form video made for phones.",   // one sentence
    "sector": "Media",                   // shown as category tabs
    "country": "US",
    "hq": "Los Angeles, California",
    "founded": 2018,                     // number (year)
    "closedYear": 2020,                  // number (year), used for sorting and charts
    "closedLabel": "Oct 2020",           // text shown to people, can be "Early 2017" or "2024"
    "raisedMillions": 1750,              // number, US dollars in millions
    "status": "Shut down",               // Shut down, Bankrupt, Liquidated, Assets sold, ...
    "founders": ["Jeffrey Katzenberg", "Meg Whitman"],
    "investors": ["Disney", "Alibaba"],
    "competitors": ["Netflix", "YouTube"],
    "reasons": [                         // at least 1. The first one is shown on the card.
      {
        "cause": "market",               // one of the cause keys below
        "title": "Viewers did not need it",
        "text": "Longer explanation, 1 to 3 sentences."
      }
    ],
    "timeline": [                        // oldest first. The last item is highlighted.
      { "when": "2018", "text": "Founded." },
      { "when": "Oct 2020", "text": "Founders announce the shutdown." }
    ],
    "lesson": "One sentence takeaway.",
    "sources": [                         // optional
      { "title": "PhocusWire", "url": "https://example.com/article" }
    ],
    "wikiQuery": "Quibi"                 // optional, text used for the "Search Wikipedia" link
  }
]
```

### Cause keys

`reasons[].cause` must be one of:

| key | label shown |
| --- | --- |
| `market` | No market need |
| `cash` | Ran out of cash |
| `cost` | Costs beat revenue |
| `product` | Product did not work |
| `compete` | Outcompeted |
| `timing` | Bad timing |
| `fraud` | Fraud or deception |
| `scale` | Scaled too fast |
| `legal` | Legal or regulatory |
| `focus` | Lost focus |
| `growth` | Could not grow |
| `model` | Weak business model |

To add a new cause, add it to `client/src/types.ts` and `client/src/data/causes.ts`.

---

## `GET /api/feed`

Recent shutdowns found in news reports (the "Daily feed" tab).

```jsonc
[
  {
    "id": "feed-1",
    "date": "2026-10-13",               // use "date" (YYYY-MM-DD) when the exact day is known...
    // "month": "2026-09",              // ...or "month" (YYYY-MM) when only the month is known
    "when": "Mid-July",                 // optional extra text next to the money line
    "name": "Character.AI",
    "country": "US",                    // optional
    "raised": "Raised over $193M",      // free text
    "causes": ["legal", "cost"],        // cause keys
    "why": "Plain-language explanation of why it closed.",
    "sourceTitle": "TechCrunch",
    "sourceUrl": "https://example.com/article"
  }
]
```

---

## `POST /api/chat` (Ask AI tab)

The "Ask AI" tab sends the user's question here. Your backend answers it with RAG
(see [`RAG.md`](./RAG.md)).

Request body:

```json
{
  "message": "Why did Quibi fail?",
  "history": [
    { "role": "user", "content": "Which startups ran out of cash?" },
    { "role": "assistant", "content": "..." }
  ]
}
```

`history` holds up to the last 6 messages, oldest first. It can be empty.

Response, status `200`:

```json
{
  "answer": "Quibi failed for three main reasons: ...",
  "sources": [
    { "id": "quibi", "name": "Quibi" }
  ]
}
```

- `answer` is plain text. Line breaks are kept. No markdown is rendered.
- `sources` lists the startups the answer used. Each `id` must match a `Startup.id` from
  `GET /api/startups`, because clicking a source opens that case. Use `[]` if nothing matched.

If the request fails, the tab shows a clearly labelled offline demo answer built from the sample
data, so it never looks broken.

---

## Errors

If a request fails (any non-2xx status or no response), the client shows the sample data and a
small note in the footer. It never crashes.
