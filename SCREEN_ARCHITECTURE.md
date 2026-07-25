# Bookify — Screen Architecture & Wireframe Blueprint

*Version 1.0 · Master reference for UI design and frontend implementation*

Builds directly on Architecture, PRD, UX Blueprint, and Design System — nothing here should be read in isolation from those four documents. Where a rule was already established (spacing, empty-state tone, motion budget, color roles), this document applies it rather than re-deriving it.

---

## 0. How to read this document

Three treatment tiers, applied deliberately rather than uniformly:

- **Full treatment** (all structural fields, judgment calls called out explicitly): Dashboard, Discover, Book Detail, Library, the reading-log interaction, Analytics, Reading DNA, Personality Evolution, Wrapped. These are the screens where a wrong hierarchy decision actually costs the product something.
- **Consolidated treatment** (shared template + delta table): Authentication's three variants, Onboarding's seven steps. These share a layout skeleton almost entirely; documenting each independently at full length would bury the two or three decisions that actually differ per step.
- **Systemic reference** (rules mapped to screens, not re-authored): Error Pages, Empty States, Offline Experience. The UX Blueprint already defines *how* Bookify handles these (§7-8 of that doc); this document's job is only to specify which variant applies where, in one table (§Systemic States below), rather than repeating three full essays.

---

## 1. Landing Page

| Field | Detail |
|---|---|
| Purpose | Convert a visitor into a signup within one scroll's worth of attention. Not to explain every feature. |
| User Goal | "Is this different from the reading apps I already know, and worth trying?" |
| Primary CTA | Sign Up |
| Secondary Actions | Log In (header, low-emphasis), scroll to learn more |

**Layout (top to bottom)**: Hero — a single striking visual (a book cover morphing/resolving into a Spine-motif bar, communicating "books become identity" without a word of copy) + one headline + one CTA, no supporting stat block (Design System §0's note about avoiding the "big number + gradient" template applies directly here). Below: three short proof-points (not a feature grid — three short narrative beats: discovery, habit, identity). Below: a Wrapped-card preview (borrowed, anonymized) as social proof of the payoff. Footer: minimal, sign-up CTA repeated once.

**Eye path**: hero visual → headline → CTA. Nothing else competes for first attention.

**Dynamic vs constant**: hero visual may rotate/showcase different genre-DNA examples on repeat visits (subtle, not required); everything else is static content.

**Animate**: hero visual has one orchestrated entrance animation (per Design System §9's "one choreographed moment lands harder than scattered effects"); scroll-triggered fade-ins for each proof-point section, single-use, not looping. **Never animate**: the CTA button beyond its standard press state — a landing page CTA that's visually busy reduces perceived trustworthiness.

**Emotion**: curiosity, immediately followed by a sense that this is premium/considered, not another tracker.

**Responsive**: hero visual simplifies on mobile (static image/lighter animation, not the full desktop sequence, to protect load time); proof points stack vertically at all but desktop width.

**Entry/exit**: entry is the root URL, or referral links (e.g. a shared Wrapped card). Exit is Sign Up or Log In.

**Scalability**: hero visual becomes a natural home for future A/B testing (different genre-DNA examples, different headline framings) without touching the rest of the page.

---

## 2. Authentication — Login, Sign Up, Forgot Password (consolidated)

**Shared skeleton**: centered single-column card (`radius-lg`, `elevation-2`) on a quiet background (a very subtle, blurred cover-glow wash per Design System §11, not a busy image) — max-width ~400px regardless of viewport, since a wide auth form actively hurts scannability. Google OAuth button above the email/password fields (reduces friction for the majority path), divider, then the form fields, then the primary CTA, then a single secondary text link to the alternate flow (Sign Up ↔ Login, or Forgot Password).

| | Login | Sign Up | Forgot Password |
|---|---|---|---|
| Primary CTA | Log In | Create Account | Send Reset Link |
| Fields | Email, password | Email, username, password | Email |
| Secondary action | "Forgot password?" / "Sign up" link | "Log in" link | "Back to login" link |
| Success state | Redirect to Dashboard (or Onboarding if first login) | Redirect to Onboarding | Confirmation message, "check your email," no reveal of whether the email exists (security: prevents account enumeration) |
| Distinct error | Invalid credentials — inline, specific but not revealing which field is wrong | Email already registered — inline, with a direct "log in instead?" link (turns a dead-end error into a recovered flow) | Rate-limit messaging if resent too quickly |

**Animate**: field focus states (border color shift, per Design System §10 Inputs), button loading state (spinner replaces label text, same button size — no layout shift). **Never animate**: the card container itself — auth should feel stable and fast, not showcase-y.

**Emotion**: calm confidence — this is a utility moment, not a delight moment; over-designing it would misplace where the product's personality budget is spent.

**Responsive**: identical structure at all breakpoints, card simply centers with margin — auth is one of the few screens where mobile and desktop should look almost identical, since there's no content-density tradeoff to make.

**Entry/exit**: entry from Landing, from a logged-out session redirect (protected route hit while unauthenticated), or from an email link (verification, reset). Exit to Dashboard/Onboarding on success, or back to Landing.

**Scalability**: this skeleton absorbs future auth methods (Apple Sign-In, magic links) as additional buttons above the divider without restructuring the page.

---

## 3. Onboarding — Welcome, Genres, Authors, Goals, Mood, Notifications, Completion (consolidated)

**Shared skeleton**: full-screen, single-step-at-a-time flow with a persistent thin progress indicator at the top (not numbered "Step 3 of 7" text — a slim segmented bar, quieter and less bureaucratic-feeling), a single question/prompt per screen, and a consistent "Continue" primary CTA. Back navigation always available (top-left), skip available on steps that aren't strictly required (see table).

| Step | Core interaction | Required? | Notable UX decision |
|---|---|---|---|
| Welcome | Single framing statement + illustration (Spine motif forming) + Continue | — | Sets the "building your Reading DNA" frame explicitly here, so every subsequent step feels like contribution, not form-filling (per UX Blueprint §2.1) |
| Favorite Genres | Multi-select grid of genre chips (Design System §10 Chips, selected = filled `bookmark-500`) | Yes, but soft-required — a "Skip for now" ghost link still exists, feeding the honest-fallback behavior defined for Discover's empty state | Live micro-preview appears after 3+ selections: a tiny Spine-motif bar builds in real time as segments are chosen — this is the single highest-leverage moment in onboarding for making the DNA concept concrete immediately, not just described |
| Favorite Authors | Searchable multi-select, optional | No | Explicitly optional and framed that way in copy — author-level preference is a nice-to-have signal, not a gate |
| Reading Goals | Simple period + target picker (e.g. "15 minutes a day") with a visible, honest framing ("even a little counts") | Yes | Directly implements the PRD's "forgiving goals" principle at the point of first setting — pre-selected default is deliberately modest, not aspirational-max, to avoid setting up an early failure |
| Mood Preferences | Single question, mood chips, optional | No | Feeds Discover's mood entry points from day one rather than showing a cold mood selector on first Discover visit |
| Notifications | Simple opt-in toggle with plain-language framing of what's sent (reading reminder, streak, achievement) — not a generic OS permission prompt with no context first | Yes (the choice, not opt-in specifically) | Ask *why* before the OS system prompt fires — priming the permission request with context is a well-established pattern for improving opt-in rates without being manipulative |
| Completion | Brief personalized teaser ("Based on your picks, you lean Fantasy & Contemporary") + direct transition into Discover pre-populated with matching books, not a static "You're all set!" screen | — | Onboarding's actual exit point is Discover with books already visible and saveable — per UX Blueprint §2.1's success-state definition, onboarding isn't "done" until a first book is saved |

**Dynamic vs constant**: progress bar and layout skeleton constant; content and (on Genres) the live DNA preview dynamic per step.

**Animate**: step transitions (simple slide/fade, `duration-base`), the live DNA-preview build on the Genres step (this is worth a slightly more expressive animation — it's the first time the product's core metaphor appears). **Never animate**: form field interactions themselves beyond standard focus states — onboarding needs to feel fast to complete, not showcase motion.

**Emotion**: anticipation, building toward a small payoff at Completion.

**Responsive**: single-column at all breakpoints; desktop simply adds generous side margins rather than a fundamentally different layout — a multi-column onboarding form would undercut the single-focus-per-step design.

**Entry/exit**: entry immediately after signup (first login only). Exit to Discover (pre-populated) → naturally toward first book save → Dashboard.

**Scalability**: step skeleton supports adding/removing/reordering steps without restructuring — genuinely likely, since onboarding length is a classic post-launch tuning target once activation data exists.

---

## 4. Dashboard (deep treatment — with a scope correction)

**The correction, stated plainly**: the requested module list (Hero, Continue Reading, Reading DNA Snapshot, Daily Goal, Streak, XP Progress, Main Character Title, Reading Insights, Recommendations, Recent Activity, Weekly Challenge, Achievements, Mood Recommendation, Reading Calendar, Discover Preview — fourteen distinct modules) cannot all live at meaningful size on one screen without becoming exactly the "dense, spreadsheet-like dashboard" the Design System explicitly rejected (§14) and without violating "one focal point per screen" (Design System §2, UX Blueprint §3). This isn't a matter of tight layout — fourteen modules is fourteen decisions competing for the same attention budget. The resolution: most of these already have (or should have) their own dedicated screen elsewhere in this document (Reading DNA → screen 12, Personality/Main Character Title → screen 13, Achievements → screen 14, Challenges → screen 15, Reading Calendar → part of Analytics, screen 11). The Dashboard's job is to be the **daily front door**, not a control panel — it shows a *teaser* of each, sized by actual daily relevance, and links out to the full experience.

**Layout (top to bottom)**:
1. **Hero: Continue Reading** — current book cover (large), progress ring/bar, one-tap log action, today's goal readout integrated directly into this card rather than as a separate module. This is the one true focal point (matches UX Blueprint §3's "above the fold" definition exactly).
2. **Streak + XP strip** — a slim, secondary-weight horizontal strip directly below the hero (not competing with it in size): streak count with flame icon, XP total with level indicator. Compact by design — these are supporting signals, not headlines.
3. **Identity teaser** (merges "Reading DNA Snapshot," "Main Character Title," and "Reading Insights" into one card, since presenting these as three separate dashboard modules would triple-count what is really one narrative unit): current archetype title + one-line insight + a small Spine-motif fragment, linking to the full Reading DNA / Personality Evolution screens. Rotates content weekly so it doesn't feel static.
4. **Made For You row** (Personalized Recommendations + Mood Recommendation combined into one horizontally-scrollable row, with a mood-selector chip pinned at the row's start rather than as a separate module) — 4-6 books, each with its plain-language reason.
5. **This week at a glance** (folds in "Weekly Challenge" if that feature is live, plus a compact version of "Reading Calendar" — a 7-day mini heatmap strip, not the full monthly calendar which belongs on Analytics) — single compact card, not multiple.
6. **Recent Activity + Achievement teaser** — a single combined list-style module: last 2-3 meaningful events (finished a book, unlocked a badge, hit a milestone), each linking to its full context. Not a persistent feed — this is a light glance-back, not a social timeline.
7. **Discover Preview** — a single row teasing what's trending/new, positioned last, functioning as the bridge to the Discover tab rather than duplicating Discover's content in depth.

**What's deliberately cut from a literal one-to-one module list**: a standalone "Achievements" grid (lives on its own screen, teased in #6 only), a full "Reading Calendar" (lives on Analytics, teased in #5 only), a standalone "Reading DNA" percentage breakdown (lives on its own screen, teased in #3 only). Each of these still has dashboard presence — just as a teaser proportional to daily relevance, not a full render.

**Eye path**: hero card → streak/XP strip → everything below in whatever order the user chooses to scroll; only the first two are considered "must-see," everything else is "available to browse."

**Dynamic vs constant**: hero card, streak/XP, and identity teaser update daily; Made For You and Discover Preview refresh on a slower cadence (don't want recommendations visibly reshuffling every single visit, which reads as unstable rather than fresh); Recent Activity updates as events occur.

**Animate**: progress ring fill and XP tick on log actions (as defined in Design System §9); card entrance on first load is a single subtle staggered fade, not per-scroll-trigger animation on every module (that would be excessive per the anti-pattern list). **Never animate**: the below-fold module order/layout itself — content within cards can update, but users should never see cards visibly reordering or resizing, which reads as unstable.

**Emotion**: momentum and orientation — "I know exactly where I am and what to do next" — with a light current of pride/curiosity from the identity teaser.

**Responsive**: mobile stacks all modules in the single-column order above; tablet may pair the streak/XP strip alongside the hero card rather than stacking (since there's width to spare); desktop introduces a two-column layout below the hero (identity teaser + made-for-you on one side, week-at-a-glance + activity on the other) — but the hero card remains full-width/dominant at every breakpoint.

**Entry/exit**: default landing screen post-login for returning users. Exits to every other primary section via its respective teaser module.

**Scalability**: the teaser-card pattern established here (§3-7) is the template for how *any* future feature gets a dashboard presence — new features get a proportional teaser card, never a new full-sized standalone module, keeping the fourteen-modules-worth-of-fourteen-full-cards problem from recurring as the product grows.

---

## 5. Discover

| Field | Detail |
|---|---|
| Purpose | Open-ended, mood-first browsing — the "what should I read next" destination. |
| User Goal | Find something worth saving without effortful searching. |
| Primary CTA | Save/Add book (per-card) |
| Secondary Actions | Mood filter, genre filter, tap into Book Detail, Search entry |

**Layout**: mood selector strip pinned near the top (optional, collapsible), then curated horizontally-scrolling rows: Made For You, Trending, New Releases, Popular This Week, Hidden Gems, Because You Read [X], Editor's Picks. Rows are reordered/personalized over time (a new user sees Trending/New Releases first; an established user sees Made For You and Because-You-Read rows promoted higher) — this reordering is itself a piece of scalability worth specifying now rather than hardcoding row order.

**Eye path**: mood strip → first row's first 2-3 covers → user-directed scrolling from there.

**Dynamic vs constant**: row contents refresh periodically (not live per-visit); row *order* personalizes over time as noted above; mood strip and row labels are structurally constant.

**Animate**: horizontal scroll is native/inertial, no custom animation needed; save action gets the same optimistic-instant feedback as everywhere else in the product. **Never animate**: row reordering itself should never happen visibly mid-session — personalization changes take effect on next load, not live under the user's thumb.

**Emotion**: calm curiosity, browsing without pressure.

**Responsive**: mobile — vertically stacked rows, each horizontally scrollable; desktop — same row structure but more cards visible per row at once, mood strip becomes a persistent left-side filter panel rather than a top strip (more room to use productively).

**Entry/exit**: entry via primary nav, Dashboard's Discover Preview teaser, or post-onboarding. Exit to Book Detail, Search, or Save action (in-place).

**Scalability**: row-based architecture accepts new curated shelves (e.g. future seasonal/challenge-tied rows) as a config change, not a layout change.

---

## 6. Search

| Field | Detail |
|---|---|
| Purpose | Fast, direct retrieval of a specific known book/author/genre. |
| User Goal | "I know roughly what I want — find it now." |
| Primary CTA | Tap a result → Book Detail |
| Secondary Actions | Filter by type (book/author/genre), clear search |

**Layout**: search field prominent at top (auto-focused on entry), results list below, ranked title-match-first. Empty query state shows recent searches (if any) rather than a blank field.

**Eye path**: search field → first result once results populate.

**Dynamic vs constant**: results dynamic per keystroke (debounced); field and layout chrome constant.

**Animate**: results fade/slide in as they populate (fast, `duration-fast`), no animation on the field itself. **Never animate**: don't animate result *reordering* as relevance scores shift mid-type — replace, don't reflow-animate, since animating a ranked list changing order per keystroke is visually chaotic.

**Emotion**: efficient, low-friction — this screen has no ambition to delight, only to be fast.

**Responsive**: overlay/full-screen takeover on mobile (search deserves full attention there); inline expanding panel from the header on desktop, non-blocking.

**Entry/exit**: entry from global header icon or Discover's search affordance. Exit to Book Detail or back/dismiss.

**Scalability**: result-type filter (book/author/genre/series/publisher/tags, per PRD §13) can expand as facets without restructuring the list-result pattern.

---

## 7. Book Details

| Field | Detail |
|---|---|
| Purpose | The decision/action point for a specific book — save, start, log, or just learn more. |
| User Goal | Depends on entry context: "should I read this?" (from Discover) or "let me update my progress" (from Library) |
| Primary CTA | Contextual: "Add to Library" (not yet saved) → "Start Reading" (saved, not started) → "Log Reading" (in progress) → "Mark Finished" (near/at completion) |
| Secondary Actions | Change shelf, add to collection, remove, rate/reflect (post-completion) |

**Layout**: large cover + ambient cover-glow background wash (Design System §11) at top, title/author/metadata directly below, primary CTA prominent, then description, then (if applicable) current progress module, then metadata details (genre, page count, publisher), then a "Similar books" row at the bottom.

**Eye path**: cover → title → primary CTA. Description and metadata are secondary, browsed only if the user lingers.

**Dynamic vs constant**: the primary CTA and progress module change based on library status (this is the screen's main dynamic element); cover/metadata static once loaded.

**Animate**: CTA state transitions (e.g. "Add to Library" morphing into "Start Reading" after the add completes) should cross-fade rather than hard-swap, so the state change registers clearly. Progress module, when present, uses the standard ring-fill animation on log. **Never animate**: description/metadata text — no reveal animations on static content.

**Emotion**: from Discover entry — anticipation/interest; from Library entry — a sense of continuity/momentum ("here's where I am").

**Responsive**: mobile — single column, cover-first, full-width CTA; desktop — two-column (cover + progress on one side, description/metadata on the other), similar-books row remains full-width at the bottom regardless.

**Entry/exit**: entry from Discover, Search, Library, or Dashboard's Continue Reading card. Exit back to origin, or forward into a logging interaction (see screen 9) or Similar Books.

**Scalability**: the contextual-CTA pattern (state-dependent primary action) is reusable wherever a book appears with an action attached (Library cards can use the same logic inline, not just the detail page).

---

## 8. Personal Library

| Field | Detail |
|---|---|
| Purpose | The organizational home for everything the user has saved — the archive and the working shelf. |
| User Goal | "Where's the book I was reading / what have I saved / what have I finished?" |
| Primary CTA | Tap a book → Book Detail |
| Secondary Actions | Switch shelf/filter, create a custom collection, bulk-manage (future), search within library |

**Layout**: shelf/status tabs at top (Currently Reading, Want to Read, Finished, Paused, DNF, Favorites, + custom Collections), grid of covers below, sortable (recently added, title, progress).

**Eye path**: active tab → grid, scanned left-to-right/top-to-bottom by cover recognition (users know their own books by cover, not title, most of the time — grid density and cover size should respect this).

**Dynamic vs constant**: grid contents change with shelf/filter selection and as books are added/moved; tab structure constant (aside from user-created Collections, which are additive).

**Animate**: shelf-switch is an instant content swap, not a sliding panel transition (per the "don't animate list reordering/filtering" rule in Design System §9) — speed matters more than flourish for a screen used this frequently. Adding/removing a book from a shelf can use a brief fade-out/in for the specific card affected. **Never animate**: grid re-layout when sorting changes — snap instantly.

**Emotion**: a light sense of ownership/pride looking at Finished and Favorites specifically; neutral efficiency on Currently Reading / Want to Read (utility shelves).

**Responsive**: grid column count scales with viewport (2-3 columns mobile, 4-5 tablet, 6+ desktop) — same card component throughout, just more per row.

**Entry/exit**: entry via primary nav. Exit to Book Detail, or Collection creation flow.

**Scalability**: tab list absorbs new statuses/custom Collections without restructuring; grid component is shared with Discover rows and Search results (one card component, several contexts — direct application of the Component Reuse principle, see §Component Reuse Map below).

---

## 9. Reading Session (the logging interaction — deliberately not a standalone page)

**Framing note carried over from the UX Blueprint (§2.6)**: this is not a navigable destination. It's a contextual interaction — a bottom sheet (mobile) or inline expansion (desktop) triggered from the Dashboard hero card or Book Detail's progress module. Documenting it as a "screen" here means documenting the *interaction*, not a route.

| Field | Detail |
|---|---|
| Purpose | Update reading progress in the fewest possible steps. |
| User Goal | "I read some pages, record that fact and get on with my day." |
| Primary CTA | Confirm/Save |
| Secondary Actions | Optional session-length input, optional mood tag |

**Layout**: current page number, large and editable (numeric input or a simple +/- stepper), pages-since-last-log auto-calculated and shown as immediate feedback, optional secondary fields collapsed by default (tap to expand "add session details").

**Eye path**: the page-number input, immediately.

**Dynamic vs constant**: pages-read delta and resulting progress percentage recalculate live as the number changes.

**Animate**: sheet enter/exit per Design System §9 (250ms slide+fade); progress ring fill and XP tick fire on confirm, not before. **Never animate**: the numeric input itself — no bouncy number-picker gimmicks on the primary, highest-frequency input in the app; it should feel like a fast, serious tool in that one moment.

**Emotion**: quick satisfaction — small, immediate, not a big production (per delight-moment tiering).

**Responsive**: bottom sheet on mobile, right-side drawer or inline card expansion on desktop — never a full-page takeover at any breakpoint, since that would overweight a high-frequency, low-ceremony action.

**Entry/exit**: entry from Dashboard hero or Book Detail. Exit on confirm (returns to origin with updated state) or dismiss (no change).

**Scalability**: the same sheet pattern is reusable for "Mark as Finished" and "Log a mood" interactions — one lightweight interaction shell, several contextual payloads.

---

## 10. Reading Progress (the persistent progress *view*, distinct from the logging *interaction* above)

This is the always-visible progress module that appears embedded in the Dashboard hero card and Book Detail — not a separate route, but worth specifying as its own component contract since it appears in multiple places and must behave identically everywhere.

**Composition**: progress ring or bar (per Design System §10), plain-language readout (current/total pages, percentage), and — contextually — a secondary line noting recent velocity ("You're 3 pages ahead of pace this week") when that data is meaningfully positive; this line is omitted rather than shown negatively phrased when behind pace, per the "never shame" principle — falling behind pace gets no comment here at all, not a gently-worded warning.

**Animate**: fills on update (per §9), otherwise static between updates. **Never animate**: idle pulsing/attention-seeking animation on an unlogged book — the module should invite action through clarity, not through nagging motion.

**Scalability**: this component contract (ring + readout + optional velocity line) is the single source of truth referenced by Dashboard, Book Detail, and Library card hover/expanded states — building it once as a shared component avoids three slightly-different progress UIs drifting apart over time.

---

## 11. Reading Analytics (Stats)

| Field | Detail |
|---|---|
| Purpose | The deep, data-forward view for users who want to see their patterns (directly serves the Optimizer persona from the PRD). |
| User Goal | "Show me my reading, quantified." |
| Primary CTA | None single dominant one — this is a browse/reflect screen, not an action screen |
| Secondary Actions | Switch time period (week/month/year), tap into a specific stat for detail |

**Layout**: period selector at top, full reading calendar/heatmap (the complete version teased only briefly on Dashboard), key stat cluster (pages read, sessions, average session length, longest session) below in `stat-lg`/`stat-md` typography per the Design System's numeral treatment, then trend charts (pace over time, genre mix over time) using the Spine-motif-echoing chart style specified in Design System §10.

**Eye path**: heatmap first (most visually distinctive element, immediately communicates "this is about patterns over time"), then the stat cluster, then charts.

**Dynamic vs constant**: all content changes with period selection; layout skeleton constant.

**Animate**: chart entrance (numbers count up, bars/lines draw in) on period-change, once per change, not looping. **Never animate**: heatmap cell coloring — should render instantly, since users scanning a full year's grid don't want to wait for a staggered reveal.

**Emotion**: reflective satisfaction, quantified pride — this is the one screen where leaning fully into "numbers as headline" is appropriate, since it's explicitly the destination for users who want that (distinct from the Dashboard/Identity screens, which deliberately subordinate numbers to narrative).

**Responsive**: heatmap reflows from a full year grid (desktop) to a scrollable/paginated month view (mobile) — a full 365-cell grid genuinely doesn't work at mobile width and shouldn't be forced to.

**Entry/exit**: entry from Profile ("You" section) or Dashboard's week-at-a-glance teaser. Exit back to Profile, or into a specific stat's detail state.

**Scalability**: period-selector + stat-cluster + chart-row pattern extends cleanly to future comparison views (this year vs. last year) without restructuring.

---

## 12. Reading DNA

| Field | Detail |
|---|---|
| Purpose | The genre/theme composition view — the "input" half of the Reading Identity system made visual. |
| User Goal | "What do I actually read, in aggregate?" |
| Primary CTA | None dominant — reflective screen |
| Secondary Actions | Tap a genre segment for detail (books contributing to it), link into Personality Evolution |

**Layout**: large Spine-motif visualization (the segmented bar, now shown at full size and detail rather than as a dashboard fragment) at top, percentage breakdown list below it, then a short "what this means" narrative line, then a link into the full Personality Evolution timeline.

**Eye path**: the Spine visualization itself, immediately — it's the payoff of the whole screen and should be unmistakably the first thing seen.

**Dynamic vs constant**: recomputed on the cadence defined in the Architecture doc (§4) — not live, so the screen should show a "last updated" or implicit freshness cue rather than implying real-time computation.

**Animate**: on first load after a recompute, the Spine bar's segments should animate into their new proportions from the previous state (a brief morph, not a hard cut) — this is the one place worth spending motion budget specifically because it's the visual proof of "your identity is evolving," which is the product's central emotional claim. **Never animate**: the percentage list — numbers should appear settled, not counting up dramatically (that treatment is reserved for XP/gamification numbers specifically, keeping the identity layer's register distinct and calmer per Design System §1).

**Emotion**: recognition — "that's accurate," ideally followed by mild surprise at a specific data point.

**Responsive**: Spine visualization scales down proportionally on mobile but never below a size where segment boundaries remain legible; percentage list always available as text below it regardless of visual size, so the information isn't lost at small sizes.

**Entry/exit**: entry from Profile ("You" section) or Dashboard's identity teaser. Exit into Personality Evolution or back to Profile.

**Scalability**: segment-tap-for-detail interaction sets up future depth (author DNA, theme DNA) without needing a new visualization paradigm.

---

## 13. Personality Evolution

| Field | Detail |
|---|---|
| Purpose | The narrative/timeline half of the Reading Identity system — the "output" made explicit over time. |
| User Goal | "Who have I become as a reader, and how has that changed?" |
| Primary CTA | None dominant — reflective screen |
| Secondary Actions | Scrub/select a past period on the timeline, share (limited, curated — not the full Wrapped share mechanic, but a lighter "share your archetype" option) |

**Layout**: current archetype headline (Fraunces display type, largest text on the screen) + full narrative summary paragraph, below that a horizontal timeline of past archetypes/states (visual markers, tappable), below that the specific deltas that drove the most recent change ("Fantasy affinity +4%, driven by 3 finished books this month").

**Eye path**: archetype headline first — this is the screen's entire reason to exist, everything else supports it.

**Dynamic vs constant**: headline and summary update per recompute cycle; timeline grows additively over the user's history.

**Animate**: a genuinely special reveal treatment when the *archetype itself* changes (not just percentage drift) — per UX Blueprint §9, this sits in the "quieter, insight-register" delight category, not the confetti register: a slow, confident cross-fade/reveal rather than a celebratory burst. **Never animate**: the historical timeline entries once rendered — they're a static record, not something that should draw ongoing attention.

**Emotion**: the deepest reflective/nostalgic beat in the core app (short of Wrapped itself) — this is where "belonging" and "pride" from the Emotional Journey table (UX Blueprint §5) are meant to land hardest.

**Responsive**: timeline becomes vertically stacked and scrollable on mobile rather than horizontal-scroll, since horizontal timelines are a common mobile usability failure point (easy to miss that it scrolls at all).

**Entry/exit**: entry from Reading DNA screen or Profile. Exit back, or into Wrapped if a yearly boundary has been crossed.

**Scalability**: timeline architecture is designed to hold years of entries without redesign — pagination/collapsing older entries into summarized eras ("2025: mostly Romance → Fantasy Explorer") rather than an ever-growing flat list.

---

## 14. Achievements

| Field | Detail |
|---|---|
| Purpose | The full badge case — browsable proof of habit and taste history. |
| User Goal | "What have I earned, and what's next to unlock?" |
| Primary CTA | None dominant — browse screen |
| Secondary Actions | Filter by category (habit/taste), tap a badge for detail/unlock criteria |

**Layout**: XP/level summary strip at top (consistent with the dashboard's compact treatment, just given more room here), then the badge grid — earned badges in full color, locked badges shown as visible silhouettes with unlock criteria on tap (per UX Blueprint §7's empty-state rule: preview the game board, don't hide it).

**Eye path**: XP/level strip briefly, then straight into the badge grid, scanned for color (earned) vs. silhouette (locked).

**Dynamic vs constant**: grid contents grow over time; category filters constant.

**Animate**: newly-earned badges (arrived at this screen right after an unlock) get a brief settle-in highlight the first time this screen is viewed post-unlock, then behave as static thereafter. **Never animate**: locked badge silhouettes — no shimmer/glow inviting attention to what's locked, which would tip into nagging/manipulative gamification territory the product is explicitly avoiding.

**Emotion**: light pride, plus a specific, achievable curiosity about next unlocks (not FOMO-driven — the tone is "here's what's next," not "you're missing out").

**Responsive**: grid column count scales with viewport, same pattern as Library.

**Entry/exit**: entry from Profile or Dashboard's activity teaser. Exit back, or into an achievement-unlock detail state.

**Scalability**: category system (habit/taste, per Design System §10's badge-color-coding) accepts new categories without restructuring the grid.

---

## 15. Challenges

| Field | Detail |
|---|---|
| Purpose | Time-boxed, optional engagement spikes tied to real calendar moments (per PRD §9) — explicitly post-MVP but specified now for architectural consistency. |
| User Goal | "Is there something fun/seasonal to aim for right now?" |
| Primary CTA | Join Challenge |
| Secondary Actions | View past/completed challenges |

**Layout**: active challenge(s) as a small number of prominent cards (never more than 2-3 concurrent — challenge sprawl would undercut their specialness), progress shown once joined, past challenges collapsed into a simple list below.

**Eye path**: active challenge card(s) first.

**Dynamic vs constant**: challenge content is genuinely time-boxed/seasonal, rotating on a real calendar; layout skeleton constant.

**Animate**: joining a challenge gets a small distinct confirmation (between the "quiet tick" and "medium" delight tiers); completing one gets the medium tier treatment, same register as a badge unlock. **Never animate**: the countdown/time-remaining element on active challenges — a ticking, animated countdown timer reads as urgency-manipulation, which conflicts with the calm-interface principle; a static "5 days left" readout, refreshed on load, is sufficient.

**Emotion**: playful motivation, deliberately lighter/more game-like than the rest of the app — Challenges is the one screen where slightly more energetic tone is appropriate, since it's opt-in and time-boxed rather than a persistent pressure.

**Responsive**: standard card-stack responsive behavior, nothing unusual.

**Entry/exit**: entry from Profile/nav (post-MVP) or a Dashboard teaser once live. Exit into the relevant book/shelf actions needed to progress the challenge.

**Scalability**: this screen is designed to be entirely config-driven (challenge definitions, dates, rules) so new seasonal events ship without frontend changes.

---

## 16. Notifications

| Field | Detail |
|---|---|
| Purpose | A lightweight log of things worth knowing, accessible on demand — not the primary retention mechanism (per UX Blueprint §6). |
| User Goal | "What did I miss / what just happened?" |
| Primary CTA | Tap a notification → relevant screen |
| Secondary Actions | Mark all read, manage notification settings (deep-link to Settings) |

**Layout**: panel/drawer (not a full page on desktop; can be a full page on mobile if opened directly), reverse-chronological list, unread visually distinguished (subtle indicator, not a loud badge-count obsession).

**Eye path**: top of list (most recent), unread items visually lighter-weight distinguished from read.

**Dynamic vs constant**: list content obviously dynamic; empty state ("Nothing new — go read something," linking to Dashboard) follows the same encouraging-forward-action rule as every other empty state in the product.

**Animate**: new items entering while the panel is open (rare, but should gently insert rather than jump-scroll the list). **Never animate**: the unread indicator — no pulsing dot, which would create the exact naggy quality the retention-loop philosophy explicitly avoids.

**Emotion**: neutral utility — this screen should not be trying to create an emotion, just deliver information efficiently.

**Responsive**: drawer/panel on desktop and tablet, full-screen on mobile (standard pattern, no innovation needed).

**Entry/exit**: entry from the header bell icon anywhere in the app. Exit to whatever screen the tapped notification concerns, or dismiss.

**Scalability**: list-item template accepts new notification types (per the Architecture doc's `NotificationType` enum) without layout changes — icon + copy vary, structure doesn't.

---

## 17. Profile ("You")

| Field | Detail |
|---|---|
| Purpose | The identity hub — entry point to Reading DNA, Personality, Stats, Achievements, Wrapped, and account management. |
| User Goal | Either self-directed ("let me see my reading identity") or navigational ("let me get to settings/stats"). |
| Primary CTA | None single dominant one — this is a navigation hub with light identity content of its own |
| Secondary Actions | Edit profile, navigate into any sub-section |

**Layout**: header block (avatar, name, username, bio, current Main Character Title prominently displayed here — this is its most natural home, more than the Dashboard), a compact identity summary (echoing the Reading DNA teaser, slightly more detailed than Dashboard's version), then a clear list/grid of entry points into Reading Identity, Stats, Achievements, Wrapped, Settings.

**Eye path**: header/title first, then the entry-point list.

**Dynamic vs constant**: header content (title, avatar) updates as identity evolves; entry-point list structurally constant.

**Animate**: Main Character Title update (when it changes) gets the same measured, insight-register treatment as Personality Evolution's archetype-change animation — consistent register, not a separate celebratory style. **Never animate**: the entry-point list itself — pure navigation, no decoration warranted.

**Emotion**: a mild, ambient version of the pride/belonging feeling that peaks fully on the Personality Evolution and Wrapped screens — this page is a hub, not a destination to linger on.

**Responsive**: header stacks (avatar above text) on mobile, sits side-by-side on tablet/desktop; entry-point list becomes a grid on wider viewports rather than a vertical list.

**Entry/exit**: entry via primary nav ("You" tab). Exit into any of its sub-sections.

**Scalability**: entry-point list is the natural home for future features (social/friend activity, per PRD Phase 6) without restructuring the header.

---

## 18. Settings

| Field | Detail |
|---|---|
| Purpose | Account and preference management — pure utility. |
| User Goal | Change something specific and leave. |
| Primary CTA | Save (where applicable — many settings should save instantly on toggle, not require an explicit save step) |
| Secondary Actions | Log out, delete account (clearly separated, not adjacent to routine settings) |

**Layout**: grouped list — Account (email, password, connected Google account), Reading Goals (editable anytime, per UX Blueprint §2.18), Notifications (granular toggles per type), Theme (light/dark/system), Privacy, then a clearly visually-separated danger zone (log out, delete account) at the very bottom, never interspersed with routine settings.

**Eye path**: top of the grouped list, scanned rather than focused on one element — this is a reference/utility screen.

**Dynamic vs constant**: toggle/value states dynamic per user configuration; group structure constant.

**Animate**: toggle switches use standard, instant state-change feedback — no flourish. **Never animate**: anything on this screen beyond basic input feedback — Settings is the single lowest-priority screen in the entire product for motion budget.

**Emotion**: neutral, efficient — should not evoke anything beyond "this is easy to use."

**Responsive**: single-column list at all breakpoints, simply gains margin on wider viewports — no responsive complexity needed.

**Entry/exit**: entry from Profile. Exit back to Profile, or to logged-out state (Landing) via Log Out.

**Scalability**: grouped-list pattern absorbs new setting categories without restructuring.

---

## 19. Bookify Wrapped

| Field | Detail |
|---|---|
| Purpose | The single largest delight moment in the product (per UX Blueprint §9) — sequential, shareable, celebratory recap. |
| User Goal | "Show me my reading year/month, and let me feel good about it." |
| Primary CTA | Advance to next card (tap/swipe) |
| Secondary Actions | Share individual card, replay, view archive of past Wrapped periods |

**Layout**: full-screen, immersive, card-by-card sequence — each card gets a distinct generated gradient background (Design System §11) derived from that period's dominant genre color, large Fraunces-set headline stat, minimal supporting text. Sequence: Books Read → Pages Read → Favorite Genre → Favorite Author → Streak → Longest Session → Most Active Day → Genre Evolution (vs. prior period) → Personality Evolution → Achievements This Year → final "Your Reading Identity" hero card (the primary shareable).

**Eye path**: each card is a single focal stat/statement, filling the frame — no competing elements per card, by design, since this is the most disciplined "one focal point" enforcement in the entire product.

**Dynamic vs constant**: entirely generated from that period's real data; sequence structure constant, contracting to a lighter 3-4 card version for monthly Wrapped per PRD §11 (never the full 10-card treatment monthly, to avoid Wrapped fatigue).

**Animate**: this is the one screen where the full motion budget is intentionally spent — each card gets an entrance animation (number count-ups, gradient reveal), transitions between cards are the most deliberate in the product. Still bounded by `prefers-reduced-motion` (degrades to static reveals per Design System §12), and the *content* pacing (how long each card holds before requiring input) should never feel rushed — this is a moment to be experienced, not skimmed. **Never animate**: don't loop or repeat animations if the user pauses on a card — a single settle-and-hold per card, not continuous motion that becomes visual noise if lingered on.

**Emotion**: the peak emotional moment of the product — nostalgia, pride, excitement, in that rough sequence across the cards.

**Responsive**: designed mobile-first (this is fundamentally a mobile/social-sharing experience) — desktop version maintains the same full-screen immersive framing rather than trying to fit multiple cards on screen at once, which would undercut the sequential-reveal pacing that makes the format work.

**Entry/exit**: entry from Profile's Wrapped entry point, a Dashboard/notification banner when a new period is ready, or (for viewers of a shared card) a public, limited preview. Exit back to Profile, or out to the sharing flow.

**Scalability**: card sequence is data-driven and config-extensible — new stat categories can be added as new card types without restructuring the playback shell.

---

## Systemic States: Error Pages, Empty States, Offline Experience

These aren't independent screens so much as behaviors applied across every screen above. The UX Blueprint (§7-8) already defines the *rules*; this table maps them to where they actually surface, so nothing is ambiguous at build time.

| Screen | Relevant empty state | Relevant error state | Offline behavior |
|---|---|---|---|
| Library | "Shelves are waiting" (per UX Blueprint §7) | — | Cached shelves fully viewable, read-only |
| Discover | Falls back to trending, never blank | No-results-for-mood → suggest another mood | Cached rows viewable if previously loaded; live search disabled with a clear inline note |
| Search | Recent searches shown pre-query | "No results for '[query]'" with a spelling/author-search suggestion | Disabled with inline note, not a broken/frozen field |
| Recommendations (Dashboard/Discover) | Honest "still learning your taste" fallback to trending | Same as Discover | Cached last-known set viewable |
| Stats/Analytics | "Log your first session and your stats start here," shape of eventual chart shown | — | Fully viewable from cache (this data doesn't need to be live) |
| Reading DNA / Personality | "Needs a few finished books to take shape" | — | Fully viewable from cache |
| Achievements | Full badge case shown with locked silhouettes, never hidden | — | Fully viewable from cache |
| Wrapped | "Your reading year is just getting started" below data threshold, never a locked/paywall-style teaser | — | Fully viewable from cache once generated |
| Book Detail | — | Book data failed to load → friendly retry, cached data preferred if available | Cached book detail viewable; actions requiring network (save, log) queue and sync on reconnect |
| Reading Session (logging) | — | — | Logs queue locally, sync on reconnect — never blocked or lost |
| Goals | "Set a goal that fits your week" | Missed goal → rolls to next period neutrally, never framed as failure (empty-state treatment, not error-state, per UX Blueprint §8's cross-cutting rule) | Goal progress viewable from cache |
| Auth | — | Invalid credentials / already-registered email, per §2 above | Auth actions require connectivity; a clear "you're offline" state blocks the form rather than failing silently |
| Global | — | App-shell failure to load at all → the one true full-screen error state in the product, with a retry action | A persistent, non-blocking offline indicator (not a full-screen takeover) whenever connectivity is lost, since most of the app remains usable read-only |

---

## Closing Maps

### 1. Screen Hierarchy Map

```
Landing
 └─ Auth (Login / Sign Up / Forgot Password)
     └─ Onboarding (first login only)
         └─ Discover (onboarding exit point)
             └─ Dashboard (steady-state home)
                 ├─ Discover
                 │   └─ Search
                 │       └─ Book Detail
                 │           └─ Reading Session (interaction)
                 ├─ Library
                 │   └─ Book Detail
                 ├─ You (Profile)
                 │   ├─ Reading DNA
                 │   │   └─ Personality Evolution
                 │   ├─ Reading Analytics
                 │   ├─ Achievements
                 │   ├─ Challenges
                 │   ├─ Wrapped
                 │   └─ Settings
                 └─ Notifications (overlay, any depth)
```

### 2. Navigation Map

- **Persistent primary nav** (4 items, all depths): Home, Discover, Library, You.
- **Contextual/overlay nav**: Notifications (header icon, any screen), Search (from Discover or global header), Reading Session logging (from Dashboard or Book Detail).
- **Depth rule**: no core action (log reading, check stats, browse recommendations) sits deeper than 3 taps from Home, per Design System §14's anti-pattern rule.
- **Back behavior**: standard stack-based back navigation everywhere except the Onboarding and Wrapped sequences, which use their own forward/back within a bounded flow rather than the OS/browser back stack, since both are linear experiences that shouldn't be interrupted by an accidental system-back.

### 3. Component Reuse Map

| Component | Used in |
|---|---|
| Book Card (cover + contextual CTA) | Discover rows, Search results, Library grid, Similar Books, Made For You |
| Progress Ring/Bar | Dashboard hero, Book Detail, Reading Session interaction, Library card (compact variant) |
| Badge (achievement) | Achievements screen, unlock overlay, Recent Activity teaser, Dashboard activity module |
| Chip (genre/mood/filter) | Onboarding, Discover mood strip, Library filters, Settings (notification categories) |
| Bottom Sheet | Reading Session logging, shelf-move confirmation, filter panels |
| Toast | Book added, settings saved, any low-stakes confirmation |
| Spine Motif visualization | Onboarding genre step, Dashboard identity teaser, Reading DNA (full size), Wrapped genre/evolution cards |
| Stat Cluster (label + `stat-lg`/`stat-md` numeral) | Dashboard streak/XP strip, Analytics, Wrapped cards, Profile header |
| Empty State template (illustration + message + one CTA) | Every screen listed in the Systemic States table |

### 4. User Journey Map (condensed — full detail in UX Blueprint §2)

Landing → Sign Up → Onboarding (DNA seeded) → Discover (first save) → Dashboard (steady state) → daily loop (log → XP/streak) → weekly loop (goal check-in) → monthly loop (Wrapped-lite, personality nudge) → yearly loop (full Wrapped) → either continued steady-state engagement or a 30-day-lapse → Welcome Back state → re-entry into the daily loop.

### 5. Screen Dependency Map

- **Onboarding** must exist before Dashboard can show a populated identity teaser (falls back to generic state otherwise).
- **Reading DNA / Personality Evolution** depend on the Architecture doc's background recompute jobs (§4) — cannot be "live," must always reflect the last completed computation.
- **Wrapped** depends on Personality Evolution already existing (its evolution card references it directly) and on the data-volume threshold defined in the PRD (§11) — cannot ship before both are real.
- **Challenges** depends on nothing else structurally but is explicitly sequenced late in the roadmap (PRD Phase 3) since it's the lowest-necessity screen in this document.
- **Achievements/Badges** depend on the gamification event pipeline (XP/session logging) being live first — cannot be meaningfully populated before Dashboard's core loop exists.

### 6. MVP vs. Future Screens

**MVP**: Landing, Auth (all 3), Onboarding (all 7 steps, though length may be tuned post-launch), Dashboard (core modules: hero, streak/XP strip, Made For You, Discover Preview — identity teaser can launch in a simplified "coming soon" state if Personality Engine isn't ready day one), Discover, Search, Book Detail, Library, Reading Session interaction, Reading Progress component, Notifications, Profile (hub only, sub-screens gated by their own readiness), Settings.

**Fast-follow**: Reading Analytics, Achievements (full catalog), Reading DNA.

**Later**: Personality Evolution (needs DNA + time to accumulate history), Wrapped (needs Personality Evolution + a full data period), Challenges.

This mapping is a direct application of the PRD's Must-Have/Should-Have/Could-Have breakdown (§7) to this document's specific screen list — nothing here contradicts that sequencing, it just makes the screen-level implications explicit.

### 7. Suggested Implementation Order

1. Auth + Onboarding (nothing else is reachable without these)
2. Dashboard shell + Book Detail + Library + Reading Session interaction (the core daily loop — this is the phase where the product either does or doesn't have a reason to be opened tomorrow)
3. Discover + Search (completes the discovery-to-library pipeline)
4. Notifications + Settings (utility layer, needed for a complete MVP but not blocking core-loop validation)
5. Reading Analytics + Achievements (first layer of the gamification/identity payoff, once there's real usage data to show)
6. Reading DNA + Personality Evolution (the defensible, signature layer — deliberately not first, since it needs accumulated data to not feel hollow, consistent with the PRD's explicit sequencing argument)
7. Wrapped (the growth-loop payoff, gated on Personality Evolution existing and a real data period having passed)
8. Challenges (lowest priority, purely additive engagement mechanic)

This order optimizes for validating the core habit loop (steps 1-3) before investing in the harder-to-build identity/wrapped layer (steps 6-7) — if the daily loop doesn't retain users, no amount of Wrapped polish fixes that, so it's deliberately proven first.
