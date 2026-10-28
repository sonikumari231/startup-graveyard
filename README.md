# Startup Graveyard

A site about failed startups: what they were, when they started and closed, who built them,
and a detailed account of why they failed. It also has a daily feed of recent shutdowns, an Ask AI
chat (LLM + RAG), a compare view, saved cases, and charts.

```
startup-graveyard/
├── client/    React + Vite + TypeScript frontend (done)
├── server/    Empty. Build your Node + Express + PostgreSQL backend here
└── docs/
    ├── API.md   The endpoints the frontend needs, with JSON examples
    └── RAG.md   How to build the Ask AI (LLM + RAG) backend with PostgreSQL and pgvector
```

## Run the frontend

```bash
cd client
npm install
npm run dev          # http://localhost:5173
```

With no backend running, the app shows built-in sample data (23 startups and 8 feed items), and the
Ask AI tab gives a labelled offline demo answer. When your API is up on `http://localhost:5000`,
the app uses it automatically.

Other commands:

```bash
npm run build        # type-check and build to client/dist
npm run preview      # serve the production build
```

Copy `client/.env.example` to `client/.env` to point the app at a deployed API
(`VITE_API_URL`) or to force sample data (`VITE_USE_MOCK=true`).

## Where things live (client/src)

| File | What it does |
| --- | --- |
| `App.tsx` | Page layout, tabs, open case, compare bar, toast |
| `api.ts` | The two fetch calls |
| `hooks.ts` | Loads data, falls back to sample data, saved cases in localStorage |
| `types.ts` | `Startup` and `FeedItem` types. This is the API shape. |
| `lib/filter.ts` | Search, filters and sorting |
| `components/Hero3D.tsx` | 3D graveyard scene (three.js, loaded lazily) |
| `components/Library.tsx` | Category tabs, filters, card grid and table |
| `components/StoneCard.tsx` | Tombstone card with the 3D tilt |
| `components/CaseSheet.tsx` | Case page: reasons, timeline, facts, sources |
| `components/CompareSheet.tsx` | Side-by-side comparison |
| `components/DailyFeed.tsx` | Daily feed with filters |
| `components/Insights.tsx` | Charts |
| `components/AskAI.tsx` | Chat screen. Calls `POST /api/chat`, shows sources |
| `lib/offlineAnswer.ts` | Offline demo answers used only when the chat API is not reachable |
| `index.css` | All styles and colors (CSS variables at the top) |
| `data/` | Sample data, used until the API exists |

## Notes

- Filtering and sorting run in the browser. That is fine for a few hundred startups. If the list
  grows past that, add query parameters and paging to `GET /api/startups` and update `api.ts`.
- Check every fact and keep a source link on each entry. Dates and amounts in the sample data come
  from public reporting and should be verified before publishing.
