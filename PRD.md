# Bookify — Product Requirements Document

*Version 1.0 · Pre-implementation*

---

## 1. Vision

Most reading apps solve the wrong problem. Goodreads solves *cataloguing* — it's a database of what you've read, with a UI that hasn't fundamentally changed because cataloguing doesn't need to feel good, it just needs to work. The problem it doesn't solve, and the one that actually determines whether someone reads more books this year than last, is **motivation decay**. People don't stop reading because they run out of books to read. They stop because reading has no immediate feedback loop — you can go three weeks without opening a book and nothing in your life visibly changes. Contrast that with a habit app, a fitness tracker, or Duolingo: the feedback is instant, visible, and slightly uncomfortable to ignore.

Bookify's vision is to give reading that same feedback loop, without cheapening the actual experience of reading. The mechanism is a shift in framing: **books are the input, identity is the output.** Every other reading app asks "what have you read?" Bookify asks "who are you becoming as a reader?" — and answers that question back to the user in a way that's specific, evolving, and worth checking on.

**Why this matters emotionally, not just functionally**: a progress bar that says "12 books this year" is a fact. A profile that says "You're becoming The Midnight Librarian — 68% fantasy, reads almost exclusively at night, hasn't abandoned a book in 4 months" is a *mirror*. People don't get emotionally attached to facts about themselves. They get attached to a reflection of themselves that feels accurate and slightly flattering. That's the mechanism Spotify Wrapped exploits, and it's the one Bookify is built around.

**What makes this defensible, not just different**: Goodreads *could* copy individual features (streaks, badges) and has half-heartedly tried. What's hard to copy is the identity layer, because it requires the gamification, the recommendation engine, and the mood system to all feed one coherent model of "who this reader is" rather than existing as disconnected feature checkboxes. That's the actual product bet — not any single feature, but the fact that they all compound into one thing.

---

## 2. Mission

**To turn reading into a habit people are proud of, by turning every book into a piece of evidence for who they're becoming.**

---

## 3. Target Audience

Being honest about primary vs. secondary here matters, because "book lovers" as a target audience is close to meaningless — a 19-year-old BookTok reader and a 45-year-old literary fiction reader who finishes 60 books a year have almost nothing in common in terms of what they want from an app.

**Primary: Aspirational readers, 18–30.** People who *want* to read more than they currently do, who have some combination of a TikTok/BookTok-influenced relationship with books, a graveyard of unfinished Goodreads shelves, and a genuine but under-supported desire to make reading a bigger part of their identity. Their pain point isn't book discovery (BookTok already solves that) — it's follow-through. They buy the book, read 40 pages, and lose momentum. Bookify's entire gamification and streak system is built for this person specifically.

**Secondary: Established heavy readers, 25–45**, who already read consistently and are attracted by the analytics/identity layer rather than the motivation layer — they want to *see* their reading patterns, not be nudged into new ones. This group is smaller but higher-retention and more likely to pay for a premium tier, if one exists later.

**Explicitly not a primary target at launch: casual readers with no aspiration to read more.** A person who reads one book a year on vacation and is fine with that has no problem Bookify solves. Designing for them would dilute the product — resist the temptation to broaden the audience definition just to make the TAM slide look bigger.

---

## 4. User Personas

Five were requested; I'd push back slightly here — two of the five in a typical spec like this end up being redundant restatements of the primary persona with a different job title. I've kept five, but made sure each one earns a genuinely different product implication. If, after review, personas 4 and 5 don't end up changing any actual feature decisions, they should be cut rather than kept for completeness.

### Persona 1 — "The Restart" (Maya, 21, college student)
- **Goals**: Wants to read for pleasure again after years of assigned reading killed the habit.
- **Reading habits**: Bursts of 3-4 books during breaks, then months of nothing. Owns 15 unread books.
- **Pain points**: Guilt over unfinished books; no sense of momentum; picks up her phone instead of a book by default.
- **Motivations**: Aesthetic/identity ("becoming a reader" is part of her self-image, influenced by BookTok).
- **How Bookify helps**: Streaks and daily micro-goals give her a reason to read for 15 minutes instead of defaulting to Instagram. Mood-based recommendations meet her where she is instead of demanding she commit to a 500-page fantasy epic.

### Persona 2 — "The Optimizer" (Daniel, 27, software engineer)
- **Goals**: Reading is part of a broader self-improvement stack alongside gym tracking, habit apps, and productivity systems.
- **Reading habits**: Consistent but joyless — reads nonfiction on a schedule, tracks it in a spreadsheet already.
- **Pain points**: Existing tools (Goodreads) feel dated and give him no *analytics* — he wants to see patterns, not just a list.
- **Motivations**: Data, self-quantification, visible progress.
- **How Bookify helps**: The stats dashboard, reading velocity, and Personality Engine give him the quantified-self layer Goodreads never built. Risk: if the gamification skews too "cutesy," he'll bounce — this persona is why tone calibration in §5 matters.

### Persona 3 — "The Collector" (Priya, 24, marketing coordinator)
- **Goals**: Reading is social and aesthetic — she wants a beautiful shelf, wants to share what she's reading, wants recommendations that feel personally curated rather than algorithmic.
- **Reading habits**: Reads consistently, heavily genre-driven (romance, fantasy), active in online book communities.
- **Pain points**: Feels like Goodreads' recommendation engine doesn't know her; existing "for you" shelves feel generic.
- **Motivations**: Belonging, self-expression, discovery.
- **How Bookify helps**: Mood-based discovery and genre-DNA visualization give her something worth screenshotting. This persona is the one most likely to drive organic growth via shared Wrapped cards — treat her as the growth-loop persona, not just an engagement one.

### Persona 4 — "The Lapsed Reader" (James, 34, parent, marketing manager)
- **Goals**: Used to read 30+ books a year before kids; wants to reclaim even a fraction of that.
- **Reading habits**: Reads in 10-minute fragments — waiting rooms, before bed.
- **Pain points**: Time scarcity, not motivation scarcity. Different problem from Maya's.
- **Motivations**: Nostalgia for his past reading identity; wants proof he's still "a reader" even at reduced volume.
- **How Bookify helps**: This persona is the argument for why streaks/goals must be *adjustable and forgiving* — a rigid daily-page-count goal will make James feel like a failure within a week and churn him. His existence in the persona set is a direct check on over-aggressive gamification design.

### Persona 5 — "The Completionist" (Sofia, 29, grad student)
- **Goals**: Wants to track everything meticulously — ratings, reviews, rereads, DNFs.
- **Reading habits**: Heavy, structured, often academic + leisure reading in parallel.
- **Pain points**: Existing apps don't distinguish reread from first read, don't handle DNF gracefully, don't support multiple simultaneous books well.
- **Motivations**: Thoroughness, control, personal archive.
- **How Bookify helps**: Validates that the data model (already built — see `UserLibrary`, `ReadingSession`, DNF status) needs to support power-user edge cases even though the primary personas won't stress-test them. Lowest-priority persona for MVP feature-building, but a useful edge-case check.

**Design implication across all five**: Maya and James are the ones the streak/goal system must be designed for — both are one bad, punishing experience away from churning. Daniel is the one the tone of gamification must be designed for — cutesy language will lose him. Priya is the growth-loop persona. Sofia is the edge-case QA persona. If a feature decision doesn't map to at least one of these, question why it's in the MVP.

---

## 5. Core Product Philosophy

1. **Books are input. Identity is output.** Every feature should be evaluated by whether it helps the user understand who they're becoming as a reader, not just what they've consumed.
2. **Consistency is the metric that matters, not volume.** A user who reads 10 minutes a day for a year should feel more successful in the product than one who binges 5 books in January and reads nothing after. The XP/streak system must reflect this — reward frequency over raw page count.
3. **Progress should be visible before it's complete.** Don't make users wait until they finish a book to feel something — session-level feedback (today's pages, today's XP) matters more to retention than book-level milestones.
4. **Gamify the habit, not the content.** XP for reading consistently: yes. Turning book *ratings* or *reviews* into a scored minigame: no — that starts to trivialize the actual reading. This is the line between Duolingo (gamifies the practice of language learning, not the language itself) and a badly-designed app that gamifies things that shouldn't be gamified.
5. **Celebrate progress without infantilizing it.** This is the direct answer to Daniel's persona risk. Badges and confetti are fine for a first book or a 100-day streak. Constant congratulatory pop-ups for routine actions (marking a page as read) will alienate exactly the heavy-reader segment that's most valuable long-term. Reserve celebration for moments that are actually milestones.
6. **Every screen should make reading feel like the obvious next action** — not through nagging, but through the dashboard always surfacing "here's exactly where you left off, here's exactly how close you are to today's goal." Reduce friction to zero between opening the app and picking up the book.
7. **Recommendations should feel curated, not computed.** Even when the underlying mechanism is a similarity score, the *presentation* should always include a human-readable reason ("because you loved Fourth Wing" beats a bare percentage match).

---

## 6. User Journey

**Landing → Signup**: The landing page's job is singular — communicate "this is not Goodreads" within 3 seconds, via visual identity (large covers, gradients, motion) rather than a feature list. Signup should be frictionless: email or Google, nothing else required upfront.

**Onboarding → Favorite genres → Favorite authors**: This is a taste-collection step disguised as a quiz, not a form. Framed as "building your Reading DNA" from message one — the user should feel like onboarding *is* the first personality read, not a prerequisite to reach the real app. 5-8 genre picks, optional author picks, one mood question ("what kind of reader do you want to become this year?"). Keep this under 90 seconds — every additional screen here is measurable signup-to-activation drop-off.

**Dashboard**: First real screen after onboarding. Must answer three questions in under 2 seconds of looking at it: What am I currently reading? How close am I to today's goal? What should I read next? Resist the temptation to cram gamification, personality summary, AND recommendations all above the fold — pick one hero element (current book + today's progress) and let the rest live one scroll down.

**Discover → Save books**: Browsing should feel like Spotify's browse tab — mood/moment-based entry points ("Rainy Day," "Because you read...") rather than a flat genre grid. Saving a book to "Want to Read" should have zero friction — one tap, no modal.

**Read → Log reading**: This is the highest-frequency action in the app and must be the fastest. Update current page → session auto-calculated → immediate XP/progress feedback. No mandatory fields beyond the page number.

**Earn XP → Unlock badges**: Immediate and visible, but per Philosophy #5, calibrated — a daily session gets a small, quiet XP tick; a badge unlock gets a real moment (see §9).

**Reading personality evolves → Better recommendations**: This is the loop that has to be *felt*, not just true. The personality profile should visibly update ("Your Fantasy affinity grew from 38% → 42% this month") rather than silently recomputing in the background — otherwise the user never notices the system is learning about them, and the emotional payoff of the identity layer is lost.

**Bookify Wrapped**: The seasonal payoff — covered fully in §11.

**Critical gap in the requested flow worth naming**: there's no defined "re-engagement" path for a lapsed user (James's persona) — what happens when someone hasn't opened the app in 3 weeks and their streak broke? The journey as specced ends at Wrapped, but the highest-leverage moment for retention is actually the *comeback* screen after a break. Recommend adding this explicitly to Phase 3 — a non-punishing "welcome back" state (streak-freeze mechanics, not streak-shame) rather than just resetting the counter to zero silently.

---

## 7. Feature List

### Must Have (MVP)
- Email + Google auth, protected routes, email verification
- User profile (bio, avatar, favorite genres/authors, reading goal)
- Book search + book detail pages (Google Books/Open Library backed)
- Personal library with core shelves (Want to Read, Currently Reading, Finished, DNF)
- Reading session logging (current page → auto-calculated progress)
- Basic streak system + daily/weekly goal
- XP + leveling (simple linear/curve system, no seasonal events yet)
- Core achievement badges (5-10 to start, not the full catalog)
- Basic genre/author-based recommendations
- Dashboard with current book, today's progress, next-up suggestion

**Why this is the MVP boundary, not more**: everything above ships the core loop (discover → save → read → log → feel progress) end to end. Nothing above requires cross-user data, meaning it can launch before the app has enough users for collaborative filtering to work.

### Should Have (fast-follow, post-launch)
- Mood-based discovery
- Full achievement/badge catalog + coins + unlockable titles
- Reading analytics (heatmap, weekly/monthly reports)
- Custom collections/shelves
- Reader Personality Engine v1 (genre distribution + archetype, no evolution tracking yet)
- Notifications (reminders, achievement unlocks, goal completion)

### Could Have (differentiator layer, once retention data exists)
- Reading Wrapped (monthly + yearly)
- Main Character Titles that evolve
- Personality evolution timeline
- Reading challenges / seasonal events
- Similarity-based ("readers like you") recommendations

### Future
- Social features (friend activity, shared shelves, buddy reads)
- Reviews/ratings as a public-facing layer (currently private-only in MVP)
- AI-generated personalized reading paths
- Author/publisher partnerships, ARC access
- Audiobook session tracking

**Note on sequencing**: Wrapped is listed as "Could Have" rather than a launch feature deliberately — it needs a full year (or at minimum a full month) of real user data to not feel hollow. Building it before there's data to fill it is building a feature nobody can experience yet.

---

## 8. Reading Identity System

This is the feature that makes Bookify defensible, so it deserves the most rigor, not the most decoration.

**Reading DNA**: A living genre/theme breakdown, computed from `UserLibrary` (finished books) + `ReadingSession` history — not from stated preferences. What someone *says* they like (from onboarding) is the seed; what they actually finish is the ground truth. DNA should be weighted toward recency — the last 3 months should move the needle more than books read a year ago, so the profile feels current rather than anchored to old data.

**Reader Personality / Archetype**: A named synthesis of the DNA plus behavioral signals — completion rate, reading time-of-day, session length, consistency. The archetype ("The Midnight Librarian") is a label; the *summary paragraph* underneath it is what actually creates the emotional hit ("You read consistently and rarely abandon books, gravitating toward emotionally rich, hopeful stories"). The label without the summary is just a horoscope; the summary is what makes it feel earned.

**Genre Distribution**: Visualized, not just listed — the earlier example (Fantasy 42%, Mystery 21%...) should render as an evolving pie/radar, not a table.

**Reading Evolution**: The historical view — "6 months ago you were 60% Romance, now you're 40% Romance / 35% Fantasy." This is the piece most apps skip entirely and it's the one with the highest emotional payoff, because it's proof of *change*, which is what makes the identity feel alive rather than static.

**Behavior Tracking**: Time-of-day patterns, session length trends, abandonment rate, rereads. Feeds the archetype engine — should never be surfaced as raw data to the user without narrative wrapping (nobody wants to see "DNF rate: 12%" — they want "You give most books a real chance before setting them aside").

**Reading Timeline**: A chronological visual history of books read, functioning as both a personal archive and a "scroll back through who you were" feature — this is a retention mechanic as much as a data feature, since it gives long-term users a reason the app becomes *more* valuable the longer they stay, not less.

**Main Character Titles**: Playful, evolving labels layered on top of the archetype. These should be treated as a skin on the underlying serious personality system, not a replacement for it — the risk (per Daniel's persona) is that if the *only* identity output is a quirky title, heavy readers will find it gimmicky. The title is the shareable hook; the personality summary is the substance underneath it.

**How it evolves over time**: Recomputed on a cadence (weekly, or after N new sessions — see Architecture doc §4), with the delta between the old and new state explicitly surfaced to the user rather than silently overwritten. The evolution *is* the product, not the current-state snapshot.

---

## 9. Gamification System

The single biggest risk in this section, flagged directly: a gamification system that feels like a mobile game will alienate the exact readers (Daniel, Sofia, and honestly a good chunk of Priya's audience too) who are put off by anything resembling FarmVille mechanics bolted onto books. The design principle throughout: **gamify consistency, not cuteness.**

**XP**: Earned from reading sessions, scaled by time spent and pages read (not just "finished a book," which would under-reward the daily habit that's the actual retention driver). Small, quiet XP ticks per session — not a full animation every time.

**Levels**: A "Reading Level" that increases with cumulative XP, using a curve that gets meaningfully harder at higher levels (standard RPG-style scaling) so early levels feel fast (hooks new users) and later levels feel earned (retains power users without trivializing their commitment).

**Achievements & Badges**: Two tiers — *habit badges* (streak milestones, session consistency) and *taste badges* (genre exploration, "read 5 mystery novels"). Habit badges matter more for retention; taste badges matter more for the personality/identity narrative. Avoid badge bloat — a catalog of 200 badges nobody remembers is worse than 30 that are genuinely meaningful.

**Coins**: A secondary currency, spent on cosmetic unlockables (avatar frames, profile themes, title customization) — never on anything that affects recommendations or functionality, to avoid the app feeling pay-to-win even though nothing is actually for sale at MVP. This also sets up a clean future monetization path (cosmetic purchases) without needing to touch the core loop later.

**Milestones**: Book-count and streak-count thresholds (10th book, 100-day streak) that trigger a genuine celebratory moment — this is where the confetti/animation budget should go, not on routine actions.

**Daily / Weekly / Monthly / Yearly goals**: User-configurable, not fixed — and critically, adjustable *after* being set without penalty (directly answers James's persona risk: a goal that can only be lowered by "breaking" it will churn time-scarce users).

**Challenges & seasonal events**: Post-MVP. Time-boxed genre challenges ("Spooky Season: read 2 horror/thriller books in October") tie into real calendar moments the way Duolingo's seasonal events do, and give lapsed users a reason to come back at a specific moment rather than a vague "we miss you" push.

**Motivation mechanism summary**: Short-term (session-to-session) motivation comes from XP + streak. Medium-term (weekly-to-monthly) comes from goals + badges. Long-term (month-to-year) comes from the identity system (§8) and Wrapped (§11). A gamification system that only operates on the short loop will feel repetitive by month two — the identity layer is what carries motivation past the point where XP numbers stop feeling novel.

---

## 10. Recommendation System

**Phase 1 (launch, cold-start friendly)**: Genre affinity (from onboarding + finished books) and author affinity — both work from day one with zero other users on the platform, which matters because collaborative approaches are structurally impossible until there's a user base.

**Phase 1.5**: Mood-based — user selects a current mood, system filters/ranks the existing genre-affinity pool by mood-tagged books. This requires a mood-tag taxonomy on the `Book` side (a curation task, not just an algorithm task — worth flagging as real content-ops work, not just engineering).

**Phase 2 (needs real usage data)**: Reading-history-weighted — completion rate and rating start influencing score, not just genre match (a user who DNFs every long fantasy book they save should stop being recommended 800-page epics even if "Fantasy" is their top genre).

**Phase 3 (needs a real user base)**: Behavior-based and similarity scoring — "readers like you" collaborative filtering. This is explicitly gated on having enough concurrent active users with overlapping libraries for the signal to be meaningful; building this before there's a user base produces recommendations that are collaborative in name only, based on noise.

**Future**: LLM-assisted natural-language discovery ("something like Fourth Wing but sadder") — a genuinely differentiated feature, but one that should be scoped as its own R&D effort once the core recommendation engine and personality system are proven, not bundled into MVP timeline pressure.

**Presentation principle** (ties back to Philosophy #7): every recommendation surfaces its reason in plain language. This is both a UX and a trust requirement — a bare "94% match" number is meaningless and slightly creepy; "Because you finished and loved Iron Widow" is legible and earns trust in the system.

---

## 11. Bookify Wrapped

The clearest opportunity for organic growth in the entire product, so it should be designed with sharing as a first-class requirement, not an afterthought bolted on at the end.

**Structure**: A sequential, animated recap (Spotify Wrapped's card-by-card format is the right reference) — Books Read → Pages Read → Favorite Genre → Favorite Author → Reading Streak → Longest Session → Most Active Reading Day → Genre Evolution (this year vs. last) → Personality Evolution ("You went from The Cozy Sage to The Fantasy Wanderer") → Achievements unlocked this year → a final "Your Reading Identity" card that functions as the hero shareable.

**Monthly vs. Yearly**: Monthly Wrapped should be a lighter, faster version (3-4 cards, not the full sequence) — its job is to keep the Wrapped format familiar and anticipated so the yearly one feels like an event rather than the first time the user has seen this UI. Doing the full 10-card treatment monthly will cause Wrapped fatigue by month three.

**Shareable cards**: Each major card should be independently exportable as a static image sized for Instagram Stories — this is the actual growth mechanism, and it should be scoped explicitly as a requirement (correct aspect ratio, no UI chrome, branded but not ad-like) rather than left as a generic "screenshot it yourself" afterthought.

**Design requirement**: Wrapped should only ever show real, well-populated data — a user with 2 books read should get a smaller, honest version of the experience ("Your reading year, so far") rather than an awkwardly sparse full sequence. Gate the full experience behind a minimum threshold (e.g., 3+ books or 30+ days of activity) and design a graceful lighter version below that, per the note in §7 about sequencing this after real data exists.

---

## 12. Success Metrics

Organized by what stage of the funnel they measure, since a flat KPI list obscures which numbers actually matter at which point in the product's life:

**Activation**
- Signup → onboarding completion rate (genre/author selection finished)
- Onboarding → first book saved to library (same session)
- First session logged within 48 hours of signup

**Habit formation (the metric the whole product is betting on)**
- 7-day and 30-day streak retention (% of users who reach each threshold)
- Daily Active Users / Monthly Active Users ratio — this is the real "is this a habit" number, more informative than raw DAU
- Average sessions logged per active week

**Depth of engagement**
- Books completed per active user per month
- Average session length (reading time logged per session)
- Recommendation acceptance rate (saved/started vs. shown)
- Personality/Wrapped screen views per user per month — a proxy for whether the identity layer is actually landing emotionally, not just functionally present

**Growth**
- Wrapped card share rate (shares per eligible user) — the clearest signal of whether the growth-loop persona (Priya) is actually being served
- Signup attribution from shared Wrapped content

**Guardrail metrics (things that should NOT move in the wrong direction as growth metrics improve)**
- Churn rate among users who break a streak — validates whether the "forgiving goals" philosophy (§5, §9) is actually working, or whether streak breaks are silently killing retention
- Time-to-first-frustration in onboarding (drop-off point analysis) — should decrease over time, not just be measured once

---

## 13. Product Roadmap

**Phase 1 — Foundation**
Auth, user profiles, book search/detail via external APIs, basic library shelves. Goal: prove the core data pipeline (external book data → local cache → user library) works end to end. No gamification yet — this phase is infrastructure, not delight.

**Phase 2 — Core Reading**
Reading session logging, current-page tracking, basic dashboard, basic streak counter. Goal: the fundamental daily loop (open app → see progress → log reading) exists and feels fast. This is the phase where the product either does or doesn't have a reason to be opened daily — treat it as the highest-risk phase to get right, not just the "simple" phase before the fun features.

**Phase 3 — Gamification**
Full XP/leveling, badge catalog, coins, adjustable goals, and — per the gap identified in §6 — the re-engagement/comeback flow for lapsed users. Goal: convert the Phase 2 loop into a habit with real stickiness, without tipping into the childish-gamification risk flagged in §9.

**Phase 4 — Identity Engine**
Reading DNA, personality archetype, genre distribution visualization, Main Character Titles. Goal: ship the feature that's actually defensible against Goodreads-style competitors. Requires Phase 2/3 data to have accumulated — don't rush this ahead of having real usage history to compute from.

**Phase 5 — Wrapped**
Monthly + yearly recap, shareable cards. Goal: the growth-loop payoff. Explicitly sequenced after Phase 4 because Wrapped's "personality evolution" card depends on the Identity Engine already existing.

**Phase 6 — Social Features**
Friend activity, shared shelves, public reviews. Goal: second growth loop, additive to (not a replacement for) the Wrapped-driven sharing loop. Deliberately late — social features built before the core solo experience is validated tend to produce a ghost-town social layer that hurts the product's credibility rather than helping it.

**Phase 7 — Future AI Features**
Natural-language discovery, personalized reading paths, deeper behavioral recommendation models. Goal: R&D layer built once there's enough usage data and a proven core product to justify the investment — explicitly not a launch differentiator, a retention/moat investment for an already-successful product.

---

## Summary of the strongest pushback points in this document

For quick reference when reviewing:
1. Persona set — verify all 5 change real decisions before keeping them all in future docs.
2. Re-engagement/comeback flow is missing from the requested user journey and should be added explicitly, not left implicit.
3. Wrapped and the full badge catalog are sequenced *after* MVP deliberately — they need real data to not feel hollow.
4. Gamification tone is the single biggest risk to the "not childish" requirement — habit badges over taste badges, quiet XP over constant celebration, adjustable goals over rigid ones.
5. Collaborative-filtering recommendations are structurally gated on user-base size — don't let roadmap pressure pull this earlier than the data supports.
