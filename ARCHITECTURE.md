# Bookify — Architecture Foundation

## 1. Repository structure

Monorepo, two deployables (`web` on Vercel, `api` on Railway/Render), one shared package for types/validation so frontend and backend never drift out of sync on shapes.

```
bookify/
├── apps/
│   ├── web/                        # Next.js 14 App Router
│   │   ├── app/
│   │   │   ├── (marketing)/        # public landing, unauthenticated
│   │   │   ├── (auth)/             # sign-in, sign-up, verify, forgot-password
│   │   │   ├── (app)/              # everything behind auth
│   │   │   │   ├── discover/
│   │   │   │   ├── library/
│   │   │   │   ├── book/[id]/
│   │   │   │   ├── profile/[username]/
│   │   │   │   ├── wrapped/
│   │   │   │   ├── stats/
│   │   │   │   └── layout.tsx      # auth guard lives here
│   │   │   ├── api/                # BFF routes only (webhooks, edge-cached reads) — NOT business logic
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── ui/                 # shadcn primitives
│   │   │   ├── book/               # BookCard, BookCover, BookGrid
│   │   │   ├── reading/            # ProgressRing, Heatmap, SessionLogger
│   │   │   ├── gamification/       # XPBar, BadgeGrid, StreakFlame
│   │   │   └── charts/             # Recharts wrappers
│   │   ├── hooks/                  # useReadingSession, useLibrary, useRecommendations
│   │   ├── stores/                 # Zustand: uiStore, playerStore-equivalent (activeSessionStore)
│   │   ├── lib/
│   │   │   ├── api-client.ts       # typed fetch wrapper, injects auth header
│   │   │   ├── query-client.ts     # React Query config
│   │   │   └── utils.ts
│   │   └── styles/
│   │
│   └── api/                        # Express + TypeScript
│       ├── src/
│       │   ├── modules/            # feature-first, not layer-first
│       │   │   ├── auth/
│       │   │   │   ├── auth.routes.ts
│       │   │   │   ├── auth.controller.ts
│       │   │   │   ├── auth.service.ts
│       │   │   │   └── auth.schema.ts     # zod
│       │   │   ├── books/          # search, external API proxy + cache
│       │   │   ├── library/
│       │   │   ├── reading-sessions/
│       │   │   ├── goals/
│       │   │   ├── gamification/
│       │   │   ├── recommendations/
│       │   │   ├── personality/
│       │   │   ├── wrapped/
│       │   │   └── notifications/
│       │   ├── jobs/                # background workers (see §4)
│       │   │   ├── recompute-stats.job.ts
│       │   │   ├── recompute-personality.job.ts
│       │   │   ├── streak-check.job.ts
│       │   │   └── recommendation-refresh.job.ts
│       │   ├── middleware/
│       │   │   ├── auth.middleware.ts
│       │   │   ├── error-handler.ts
│       │   │   ├── rate-limit.ts
│       │   │   └── validate.ts
│       │   ├── lib/
│       │   │   ├── prisma.ts
│       │   │   ├── redis.ts
│       │   │   ├── google-books.client.ts
│       │   │   └── open-library.client.ts
│       │   └── server.ts
│       └── prisma/
│           ├── schema.prisma
│           └── migrations/
│
├── packages/
│   └── shared/
│       ├── types/                  # DTOs shared between web & api
│       └── validation/             # zod schemas, single source of truth
│
└── turbo.json / pnpm-workspace.yaml
```

**Why feature-first modules instead of `controllers/`, `services/`, `models/` folders:** with 14 features of this depth, a layer-first structure means every change to "recommendations" touches four unrelated top-level folders. Feature-first keeps each domain's routes/controller/service/validation together, which is what actually scales as the team (or your own context-switching) grows.

## 2. API design

REST over `/api/v1`, resource-oriented, feature modules own their routes:

```
POST   /api/v1/auth/signup
POST   /api/v1/auth/login
POST   /api/v1/auth/google
POST   /api/v1/auth/verify-email
POST   /api/v1/auth/forgot-password

GET    /api/v1/books/search?q=&genre=&author=
GET    /api/v1/books/:id
GET    /api/v1/books/trending
GET    /api/v1/books/recommended        // "Made For You"

GET    /api/v1/library                  // ?status=CURRENTLY_READING
POST   /api/v1/library                  // add book to a shelf
PATCH  /api/v1/library/:bookId          // change status / current page

POST   /api/v1/reading-sessions         // log a session
GET    /api/v1/stats?period=WEEKLY

GET    /api/v1/personality              // cached, recomputed async
GET    /api/v1/wrapped?period=2026      

POST   /api/v1/mood                     // log mood, get mood-based recs
```

Every list endpoint is cursor-paginated (`?cursor=&limit=`), never offset-based — offset pagination degrades badly once `UserLibrary`/`ReadingSession` tables have millions of rows, and cursor pagination is a two-line change now versus a rewrite later.

**Validation**: zod schemas in `packages/shared/validation`, imported by both the Express route (server-side enforcement) and the React Query mutation (client-side instant feedback). One schema, two consumers — this is the actual payoff of the monorepo.

## 3. Auth flow

Auth.js (NextAuth) with a credentials provider (email/password) and Google OAuth provider, JWT session strategy so the Express API can verify sessions statelessly.

1. Sign-up → hash password (bcrypt/argon2) → create `User` (emailVerified: false) → send verification email (Resend/SES) → issue session.
2. Protected routes: Next.js middleware checks the session cookie at the edge before the page even renders — unauthenticated users never see a flash of protected content.
3. Express API independently verifies the JWT on every request via `auth.middleware.ts` — the API must never trust the frontend, since it's a separate deployable that could be called directly.
4. Google OAuth: Auth.js handles the OAuth dance; on first login we upsert a `User` row with `authProvider: GOOGLE`, `passwordHash: null`, `emailVerified: true` (Google already verified it).

## 4. Why background jobs matter here specifically

This is the part of the architecture most likely to be underestimated. Three of Bookify's signature features are expensive to compute:

- **Reader Personality Engine** — needs to scan a user's full `ReadingSession`/`UserLibrary`/`Rating` history and compute genre distribution + archetype.
- **Reading Wrapped** — same, scoped to a year, plus comparisons to the prior period.
- **Recommendations** — needs cross-user signals for collaborative filtering, not just one user's row.

None of these should run inline on a page request. The pattern:

- `ReadingSession` write → enqueue a lightweight job → update `StreakLog` and `ReadingStats` for *today only* (cheap, immediate, keeps the UI's XP/streak feel snappy).
- Nightly cron → `recompute-personality.job.ts` for users with N+ new sessions since last compute → writes to `PersonalityProfile`.
- Nightly cron → `recommendation-refresh.job.ts` → repopulates `Recommendation` table per user.
- On Dec 31 / month-end → `wrapped` job pre-generates the recap payload so the "Wrapped" screen loads instantly instead of computing a year of data live when the user taps it (same reason Spotify pre-renders Wrapped instead of generating it on open).

Use BullMQ + Redis for the queue — you already need Redis for caching (§5), so this doesn't add new infra.

## 5. Caching strategy

Three layers, each solving a different problem:

| Layer | What | Why |
|---|---|---|
| **Redis** | Google Books/Open Library API responses, keyed by query | External APIs have rate limits; a trending search shouldn't hit Google Books for every user. TTL ~24h for search, ~7d for a specific book's metadata (books don't change). |
| **Redis** | Computed `PersonalityProfile`, `Recommendation` list, `ReadingStats` for "current period" | These are already Postgres tables (durable), but hot ones (today's stats, active recs) get a short-TTL Redis layer in front to avoid a query on every dashboard paint. |
| **React Query** | Client-side cache of all API responses | `staleTime` tuned per resource: book search (5 min), user's own library (0 — always fresh after a mutation via invalidation), trending/discovery lists (15 min). |

**Cache invalidation rule that actually matters:** any write to `UserLibrary` or `ReadingSession` invalidates that user's React Query cache for `library`, `stats`, and `recommendations` keys immediately (optimistic update), but the *server-side* Redis cache for `ReadingStats`/`PersonalityProfile` is intentionally allowed to be stale until the next job run — the UI feels instant via optimistic updates while the "real" recomputation happens async. Don't try to make personality/stats recompute synchronously on every session log; that's the mistake that makes this feature slow at scale.

## 6. State management split

- **Server state (React Query)**: anything that lives in Postgres — library, books, stats, recommendations, notifications. This is ~90% of the app's data.
- **Client state (Zustand)**: ephemeral UI state that has no business touching the network — active reading session timer, theme toggle, mobile nav open/closed, onboarding wizard step. A good test: if refreshing the page should lose it, it's Zustand; if it shouldn't, it's server state via React Query.

Do not put server data in Zustand "for convenience" — it's the most common way these apps end up with stale-data bugs (library shows a book as "Currently Reading" in one component and "Finished" in another because two different stores disagreed).

## 7. Key edge cases the schema/architecture already account for

- **Same book from two sources**: `Book.@@unique([source, externalId])` — Google Books and Open Library will occasionally both surface "the same" book with different IDs; we intentionally don't try to de-dupe across sources at the DB level (that's a fuzzy-matching problem, not a constraint problem) — instead the search layer prefers one source consistently and only falls back to the other on miss.
- **User deletes account**: every relation to `User` is `onDelete: Cascade` except `MoodHistory.book` (`SetNull`) — deleting a book from the catalog shouldn't be blocked by someone's old mood log.
- **Streak timezone correctness**: `StreakLog.date` is date-truncated and the streak-check job runs per-user in *their* timezone (stored on `User` — add a `timezone` field when you build this out), not server UTC — otherwise users near midnight lose streaks incorrectly.
- **Partial book data from APIs**: `pageCount`, `publishedDate`, `averageRating` are all nullable — Open Library in particular frequently lacks page counts. UI must design for "pages read: 40 / —" states, not assume every book has a total.

## 8. Security & validation baseline

- All mutation routes: zod validation middleware rejects before touching the controller.
- Rate limiting (express-rate-limit + Redis store) on `/auth/*` and `/reading-sessions` specifically — the latter because XP/streak systems are a real target for scripted abuse (bots farming XP).
- `currentPage` on session log is server-validated against `Book.pageCount` — never trust the client to self-report a page count that exceeds the book's actual length; this both prevents cheating and prevents corrupt stats.
- Image uploads (avatars, collection covers) go straight to Cloudinary via signed upload URLs generated by the API — the Express server never proxies raw file bytes.

---

**Next step candidates**: I'd suggest either (a) the auth module in full (routes/controller/service + the Next.js middleware + protected route pattern), or (b) the book discovery + library core loop (external API integration, search, shelves) since it's the first thing a user actually touches. Your call.
