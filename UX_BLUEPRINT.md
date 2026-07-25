# Bookify — UX Blueprint

*Version 1.0 · Pre-visual-design*

---

## 1. Information Architecture

**Guiding rule before the map itself**: the requested list mixes navigation-level pages (Dashboard, Discover, Library) with what are actually *modes within* a page (Reading, Personality) or *sub-views* (Stats might live inside Profile, not be a top-level tab). Flattening everything into one nav would produce exactly the cluttered, checkbox-feature-list feeling Bookify is trying not to have. So the IA below groups by what the user is actually trying to do, not by feature inventory.

### Public (unauthenticated)
- **Landing** — the "this is not Goodreads" pitch. Exists to convert, not inform; should not attempt to explain every feature.
- **Sign in / Sign up** — including Google OAuth, forgot password, email verification pending state.

### Authenticated — Primary Navigation (persistent, 4 items, not 6+)
Kept deliberately tight. A 6-7 item primary nav is a classic sign the IA is organized around the engineering feature list instead of user intent.

1. **Home** (Dashboard) — "What should I do right now?" Default landing screen after login.
2. **Discover** — "What should I read next?" Browse, search, mood-based entry points.
3. **Library** — "What am I reading / have I read?" Shelves, collections, the archive.
4. **You** (Profile) — "Who am I as a reader?" This is where Personality, Reading DNA, Stats, Wrapped, Achievements, and Settings all live as sub-sections. Bundling the entire identity layer under one tab is a deliberate choice, not a compromise — it reinforces the core philosophy (books are input, *you* are the output) at the navigation level itself. Splitting Personality/Stats/Achievements into separate top-level tabs would fragment the one experience that's supposed to feel unified.

### Inside "You" (secondary navigation, tabbed or scrollable sections, not separate pages requiring back-navigation)
- **Reading Identity** — Reading DNA, archetype, Main Character Title, evolution timeline
- **Stats** — heatmap, charts, session history, goal progress
- **Achievements** — badge case, XP/level, coins
- **Wrapped** — current period recap + archive of past Wrapped periods
- **Settings** — account, notifications, reading goal configuration, theme
- **Edit Profile** — bio, avatar, favorite genres/authors (editable post-onboarding)

### Reading Mode (not in nav — entered contextually)
Opened from a book in Library or Dashboard's "continue reading" card, not a nav destination itself. This is intentional: reading logging is an *action taken from context* (I'm looking at this specific book), never a place you navigate to in the abstract the way you'd navigate to "Discover." Treating it as a nav item would imply users think "let me go to the Reading screen," which isn't how the mental model works.

### Utility / overlay-level (not primary nav)
- **Notifications** — bell icon in the header, opens a panel/drawer, not a full page destination
- **Search** — accessible from Discover and as a global quick-action, not a separate nav tab

**Why this structure specifically**: every one of the 10+ pages named in the brief exists in this IA, but organized around 4 user *intents* (do something now / find something / manage my books / understand myself) rather than 10 flat destinations. This matters concretely for Maya's persona (PRD §4) — someone rebuilding a habit needs the app to feel simple to open, not like a dashboard of features to learn.

---

## 2. Complete User Flows

Format per flow: Goal → Screens → Actions → System Response → Success → Failure → Edge Cases → UX Improvement. I've grouped the requested list into the ones that actually need full detail (novel interaction patterns) versus ones that are straightforward CRUD and get a condensed treatment — writing all 19 at full depth would bury the important ones in repetition.

### 2.1 New User (full detail)
- **Goal**: Go from "never heard of Bookify" to "have a personalized dashboard with a first book saved," feeling like the app already gets them.
- **Screens**: Landing → Signup → Email verify (soft-gate, see below) → Onboarding (genre picks → author picks → reading goal → mood/aspiration question) → Dashboard (populated, not empty).
- **Actions**: Sign up (email or Google) → select 5-8 genres → optionally select authors → set a starter reading goal → land on dashboard.
- **System response**: Immediately after genre selection, show a first-pass "Reading DNA" teaser ("Based on your picks, you lean Fantasy & Contemporary — let's find your first book") — this converts an abstract quiz into an immediate personalized payoff, before the user has done anything else.
- **Success state**: User has at least one book saved to "Want to Read" before leaving onboarding — onboarding should end on Discover with 3-4 personalized picks already surfaced, not on a blank dashboard.
- **Failure state**: User abandons mid-onboarding. Recovery: save partial state, so returning users resume rather than restart — nothing kills activation faster than re-asking questions someone already answered.
- **Edge case**: User skips genre selection entirely. The system needs a genuine fallback (trending/popular books) rather than a broken empty Discover screen.
- **UX improvement over the literal brief**: don't gate the dashboard behind email verification. Let users explore immediately (verification banner, non-blocking) — friction here costs activation for a security step that can happen in parallel. This is a direct pushback on treating email verification as a hard gate in the flow.

### 2.2 Returning User (condensed)
- **Goal**: Pick up exactly where they left off with zero re-orientation cost.
- **Flow**: Open app → Dashboard shows current book + today's progress + streak status, already loaded, no "continue where you left off?" confirmation dialog needed — just show it.
- **Edge case**: Returning after a long gap — see §2.16 (30-day return) for the distinct treatment this needs.

### 2.3 Searching for a Book (condensed)
- **Goal**: Find a specific book fast.
- **Flow**: Search from Discover or global search → results ranked by relevance, title match first → tap result → Book Detail.
- **Failure state**: No results — see Error States §8 ("book not found"), never a bare blank state.
- **Edge case**: Search term matches a book already in the user's library — surface that status inline in results ("Already in your library — Currently Reading") rather than letting them add a duplicate.

### 2.4 Adding a Book (full detail)
- **Goal**: Save a book to a shelf with minimum friction — this is one of the highest-frequency actions and must never feel heavier than one tap.
- **Screens**: Discover/Search results or Book Detail.
- **Actions**: Tap "Add" → default shelf selector appears (Want to Read / Currently Reading) inline, not a modal → confirm.
- **System response**: Instant optimistic UI update (book appears on shelf immediately, network call happens behind it) — never make the user wait on a spinner for this action.
- **Success state**: Toast/inline confirmation, book now visible on the relevant shelf.
- **Failure state**: Network failure — optimistic update rolls back gracefully with a retry affordance, not a jarring disappearance.
- **Edge case**: Adding a book already in another shelf (e.g. it's in "Want to Read," user adds to "Currently Reading") — this should be a *move*, prompted clearly ("Move from Want to Read to Currently Reading?"), not a silent duplicate entry.

### 2.5 Starting Reading (full detail)
- **Goal**: The moment a "Want to Read" book becomes "Currently Reading" — this is an emotionally meaningful transition (intent → commitment) and deserves slightly more weight than a routine status change.
- **Screens**: Book Detail.
- **Actions**: Tap "Start Reading."
- **System response**: Status updates, `startedAt` timestamp set, a small but genuine moment — not confetti-level, but distinct from a routine shelf move (e.g., the book's cover becomes the dashboard's hero "currently reading" card immediately).
- **Success state**: Book now appears as the dashboard's primary reading card.
- **Edge case**: User already has several "Currently Reading" books (multi-book readers, per Sofia's persona in PRD §4) — the dashboard must handle multiple active books without forcing an artificial "pick one" constraint, but should still make one primary/most-recent for the hero card.

### 2.6 Logging Reading (full detail — highest-frequency flow in the product)
- **Goal**: Update progress in under 5 seconds, from anywhere the current book is visible.
- **Screens**: Dashboard's current-book card, or Book Detail — both should support inline logging, not force navigation to a separate "log reading" screen.
- **Actions**: Tap current book's progress element → simple page-number input (or a "+X pages" quick-add) → confirm.
- **System response**: Session calculated automatically (pages since last log, time since last log if the app was actively open) → immediate XP tick and progress bar animation.
- **Success state**: Updated progress ring, streak maintained/incremented, subtle positive feedback.
- **Failure state**: User enters a page number lower than current progress (e.g. mis-tap) — don't silently accept it as a "reread portion"; ask for confirmation, since this is ambiguous (could be a typo or an intentional reread).
- **Edge case**: Page number exceeds book's total page count — validate against `Book.pageCount`, but handle the null-pageCount case (common with Open Library data, per Architecture doc §7) gracefully rather than blocking the log entirely.
- **UX improvement**: Offer a lightweight session-length capture (optional, not required) — "how long did you read?" as a secondary, skippable input, since forcing it on every single log would add friction to the highest-frequency action in the app.

### 2.7 Completing a Book (full detail)
- **Goal**: Make finishing a book feel like a genuine milestone, not just another status change.
- **Screens**: Triggered from logging reading (page count reaches total) or manual "Mark as Finished."
- **System response**: A dedicated completion moment — not a full-screen takeover every time (that would fatigue heavy readers, violating Philosophy §5 from the PRD), but distinct from routine logging: book moves to Finished shelf, XP awarded, optional prompt for a private rating/reflection.
- **Success state**: Completion contributes to stats, personality recompute is queued, and — if it's a milestone book count (10th, 25th, 50th) — a slightly bigger celebratory state triggers.
- **Edge case**: User "finishes" a book they'd marked DNF earlier (came back to it) — status transition should be smooth, not treated as an error state.

### 2.8 Receiving XP (condensed)
- **Goal**: Understand instantly why XP was earned, without needing to seek that information out.
- **Flow**: XP tick appears inline at the point of the triggering action (session log, milestone, achievement) — never as a separate notification requiring a tap to understand. See Delight Moments §9 for tuning on frequency/intensity.

### 2.9 Unlocking an Achievement (full detail)
- **Goal**: A genuine, memorable moment — this is one of the few places a fuller celebratory treatment is warranted.
- **Screens**: Triggered contextually (usually right after a session log or completion), surfaces as an overlay/card, not a full-page interrupt.
- **System response**: Badge reveal animation, XP/coin reward shown, option to view in the Achievements case or dismiss.
- **Success state**: Badge added to profile, viewable later in "You → Achievements."
- **Edge case**: Multiple achievements unlock simultaneously (e.g. finishing a book that completes both a genre badge and a streak badge) — queue them as a short sequence rather than stacking overlays, so neither gets lost.

### 2.10 Viewing Reading Personality (condensed)
- **Goal**: Feel seen. This is a reflective, not transactional, flow — pacing should be slower and more narrative than the rest of the app.
- **Flow**: You → Reading Identity → archetype headline + summary paragraph + genre distribution visualization + evolution-over-time view.
- **Edge case**: New user with insufficient data — see Empty States §7, not a broken/blank chart.

### 2.11 Viewing Reading DNA (condensed — largely folded into 2.10)
Reading DNA and Personality are presented as one continuous experience (genre distribution feeds directly into the archetype narrative), not two separate flows a user has to navigate between — treating them as fully separate flows in the UI would undercut the "one coherent identity" philosophy from the PRD.

### 2.12 Checking Recommendations (condensed)
- **Goal**: Find something worth reading next without effortful browsing.
- **Flow**: Discover home surfaces "Made For You" and mood entry points by default; every recommended book carries its plain-language reason inline (per PRD §10).
- **Edge case**: Insufficient data for personalized recs (new user) — falls back to trending/genre-seeded picks, framed honestly ("Popular picks to get started" rather than pretending it's personalized).

### 2.13 Exploring Discover (condensed)
- **Goal**: Open-ended browsing, mood-first.
- **Flow**: Mood selector at top (optional, not required to proceed) → curated rows below (Trending, New Releases, Hidden Gems, Because You Read X, Similar to your recent finish) → search always accessible.

### 2.14 Updating Reading Goal (full detail — directly tied to PRD's "forgiving goals" principle)
- **Goal**: Adjust a goal without it feeling like admitting failure.
- **Screens**: You → Settings, or a direct prompt if the system detects a goal is consistently missed.
- **Actions**: Adjust target value/period → save.
- **System response**: Immediate effect, no "are you sure you want to lower your goal" guilt-tripping copy — framed neutrally ("Goal updated") never negatively.
- **UX improvement**: If a user has missed a goal 3+ weeks running, proactively suggest an adjustment ("Want to set a goal that fits your week better?") rather than waiting for them to feel bad and dig through settings themselves — this is the concrete implementation of James's persona need.

### 2.15 Viewing Wrapped (condensed — full experience detailed in §3 equivalent, see PRD §11)
- **Flow**: You → Wrapped, or a push notification/in-app banner when a new Wrapped period is ready. Card-by-card sequence, tap or swipe to advance, share button on key cards.
- **Edge case**: Insufficient data (per PRD §11's threshold gating) — lighter "so far" version, never the full sequence stretched thin.

### 2.16 Returning After 30 Days (full detail — the gap identified in the PRD, now specced properly)
- **Goal**: Re-engage without shame; make the on-ramp back into the habit as low-friction as the very first onboarding.
- **Screens**: A distinct "Welcome back" dashboard state, not the standard dashboard silently showing a broken streak.
- **System response**: Streak shown as paused/preserved-with-a-freeze-mechanic rather than reset to zero and displayed coldly; a short, optional re-onboarding nudge ("Still into Fantasy & Romance, or has your taste shifted?"); one clear, low-commitment call to action ("Pick up where you left off" showing their last in-progress book).
- **Success state**: User logs a session or updates a goal within this visit.
- **Failure state**: User leaves again without engaging — this is fine; the state shouldn't be manipulative or guilt-driven, just genuinely welcoming. Avoid dark-pattern urgency ("Your streak is about to disappear forever!").
- **UX improvement over a naive implementation**: this state is the single highest-leverage screen for James's persona (PRD §4) and should be treated as a first-class designed screen, not a fallback of the normal dashboard.

### 2.17 Deleting a Book (condensed)
- **Goal**: Remove a book from library/shelves without ambiguity about what's actually being deleted.
- **Flow**: From Book Detail or shelf, "Remove from Library" → confirmation only if the book has reading history attached (sessions logged) — no confirmation needed for a bare "Want to Read" entry with zero engagement, since that's low-stakes and confirmation dialogs on trivial actions just train users to blindly tap through them.
- **Edge case**: Deleting a "Finished" book with achievements tied to it — clarify that stats/achievements already earned are not retroactively removed, only the library entry is.

### 2.18 Editing Profile (condensed)
- Standard form flow — bio, avatar (Cloudinary upload), favorite genres/authors editable anytime post-onboarding, since taste genuinely changes and locking it to onboarding-only would fight the "evolution" narrative core to the identity system.

### 2.19 Broken Streak Recovery (added — not in the original list, but a necessary companion to 2.16)
- **Goal**: When a streak breaks mid-session (not a 30-day lapse, just missed yesterday), the response must be proportionate — this is a one-day miss, not an abandonment.
- **System response**: Neutral framing, no shame copy. Consider a limited "streak freeze" mechanic (earned via consistency, spendable to protect against an occasional missed day) — directly mitigates the punishing-goal risk flagged for James's persona in the PRD, and is a well-proven pattern (Duolingo) worth adopting rather than reinventing.

---

## 3. Dashboard Experience

**Above the fold** (visible without scrolling, on first paint):
1. **Current book hero card** — cover, title, progress bar/ring, one-tap "Log reading" action. This is the single most important element on the entire screen; everything else is secondary to it.
2. **Today's goal status** — a compact progress indicator (e.g. "12 of 20 pages today") integrated near or on the hero card, not a separate competing element.
3. **Streak indicator** — small, persistent, always visible, but not oversized — it's a supporting signal, not the hero.

**Below the fold**:
4. **"Made For You" row** — 3-5 personalized recommendations, horizontally scrollable.
5. **This week's snapshot** — a compact stat or two (pages this week, sessions this week) — not a full chart, just enough to create a light pull toward the fuller Stats view.
6. **Recent achievement or personality nudge** — rotates: a recently earned badge, or a personality-evolution teaser ("Your Fantasy affinity is up 4% this month — see your full DNA").

**What changes daily**: current book progress, today's goal status, streak count, XP total.
**What changes weekly**: the "this week's snapshot" stats, potentially a rotating weekly challenge card once that feature ships (post-MVP per PRD roadmap).
**What changes monthly**: personality nudge content, Wrapped-availability banner near month-end, monthly goal progress if the user has one configured.

**Never-empty guarantee — how**: a truly new user with zero library activity still sees a populated dashboard, just with a different hero: instead of a "currently reading" card, a "Let's find your first book" card surfaces top recommendations from onboarding genre picks directly on the dashboard, not requiring a trip to Discover first. The dashboard's job is never to say "nothing here yet" — it always proposes the next action.

**How it evolves as the user reads more**: early on (few books), the dashboard leans harder on Discover content and onboarding-derived recommendations, since there isn't enough personal data to be interesting yet. As library and session history grow, the balance shifts — the personality/stats teasers become more prominent and specific (a vague "keep reading!" becomes "You're 3 books from a 25-book year"), and the dashboard starts to feel like it's *about* the user rather than about the catalog. This transition should happen gradually and automatically based on data volume, not as a discrete "leveled up" UI mode switch.

---

## 4. Reading Experience

**Opening a book** (Book Detail): cover, metadata, synopsis, current status/shelf, and — if not yet started — a single clear "Start Reading" CTA. If in progress, the CTA becomes "Log reading" / "Continue."

**Reading progress**: primary visualization is a progress ring or bar tied to page count — always paired with a plain-language readout ("142 of 384 pages · 37%"), never a bare percentage or bare ring alone, since either alone loses information the other provides.

**Logging pages**: see Flow 2.6 above — inline, fast, optional session-length capture, immediate feedback.

**Session tracking**: sessions are the underlying data unit but are largely invisible to the user in the moment — they experience "I updated my progress," not "I created a session record." Session history becomes visible later, in Stats, as an aggregate (heatmap, weekly report), not surfaced as a raw log the user has to manage.

**Daily goal**: shown contextually on the dashboard and reading screens, never demanding attention as a full-screen state — it's ambient information, present but not naggy.

**Milestones**: page-based (halfway point, 100 pages in a single book), streak-based, and count-based (10th/25th/50th/100th book) — each tier gets proportionate treatment (halfway point: a small ring animation; 100th book: a genuinely special full moment).

**Completion**: per Flow 2.7 — a dedicated but calibrated moment, book moves to Finished, optional private reflection prompt, personality recompute queued.

**Micro-interactions**: progress ring fills with a smooth animation on log (not instant snap — the motion itself is part of the satisfaction); XP number ticks upward rather than jumping; page-turn-style transitions when moving between book detail states, used sparingly so they stay special rather than becoming visual noise.

**Loading states**: skeleton screens matching final layout (book cover placeholders, shimmer text blocks) — never a bare spinner on content-heavy screens like Discover or Stats, since skeletons preserve the feeling of the app already knowing its shape even before data arrives.

**Empty states**: see §7 in full.

**Error states**: see §8 in full.

---

## 5. Emotional Journey

| Stage | Target emotion | How the UX creates it |
|---|---|---|
| Landing/Signup | Curiosity | Visual identity alone (motion, gradients, large covers) signals "this is different," before any copy is read. |
| Onboarding | Anticipation | Framed as building something ("your Reading DNA starts here"), not filling out a form. |
| First book saved | Excitement | Immediate, tangible payoff — the book appears on a shelf instantly, no delay between intent and result. |
| Daily logging | Motivation | Fast, low-friction, immediate small feedback (XP tick, ring fill) — motivation is sustained by frequency of small wins, not size of any single one. |
| Achievement unlock | Achievement / Pride | The one place a fuller celebratory moment is warranted — reserved, so it still feels earned rather than routine. |
| Finishing a book | Pride / Reflection | Completion moment plus an optional reflective beat (private rating/note) — gives the emotional weight of finishing something real, not just clearing a checklist item. |
| Personality view | Reflection / Belonging | Narrative summary language ("you gravitate toward...") makes the user feel *understood*, not measured. |
| Streak break | (Deliberately not shame) — Reassurance | Neutral, forgiving framing; freeze mechanic; no red/warning color language for a missed day. |
| 30-day return | Belonging, not guilt | Welcome-back state (Flow 2.16) designed to feel like the app missed them in a warm way, not a cold reset. |
| Wrapped reveal | Nostalgia / Pride / Excitement | Sequential storytelling format mirrors year-in-review formats users already have strong positive associations with (Spotify Wrapped) — borrowing that emotional pattern intentionally. |

---

## 6. Retention Loops

**Daily**: current-book progress + streak + quiet XP. The loop is "open app → see exactly where I am → log a few pages → feel a small win." This must work even for a user who never engages with gamification consciously — the core reading-progress visibility alone should be worth opening the app for (this hedges against Daniel's persona, who may actively dislike leaning on gamification as the *stated* reason to return).

**Weekly**: goal progress check-in + "this week's snapshot" on the dashboard + (post-MVP) weekly challenges. The loop is coarser than daily — it's less about a single visit and more about the dashboard consistently answering "am I on pace this week?" across several visits.

**Monthly**: monthly Wrapped-lite recap + personality nudge (visible DNA movement) + monthly goal cycle reset. The loop here leans on the identity system specifically — this is where "books are input, identity is output" becomes a retention mechanism rather than just a tagline, since the personality delta is the thing that makes month N+1 feel different from month N even if daily behavior is identical.

**Yearly**: full Wrapped, reading timeline reflection, archetype-of-the-year narrative. The loop is the payoff loop — it's not trying to bring someone back tomorrow, it's building the reason someone stays subscribed to the *idea* of Bookify across a full year, and the reason they'd tell a friend about it in December.

**Why this isn't "notifications as the only reason to return," concretely**: notifications exist (goal reminders, achievement alerts, streak-preserving nudges) but every loop above is designed to work as a *pull* — the dashboard itself is interesting enough to check even without a push prompting it, because it visibly changes (progress, stats, personality nuance) on its own cadence. Notifications should be positioned as a convenience for people who want them, not as the mechanism carrying the entire retention strategy — a product that only comes back to life when it pings you isn't sticky, it's naggy.

---

## 7. Empty States

Every empty state below follows the same rule: **name the future state honestly, and give exactly one clear action to get there** — never a bare "nothing here" with no path forward.

- **Library**: "Your shelves are waiting. Save a book you're curious about and it'll show up here." → CTA to Discover.
- **Recommendations**: If truly no data yet — "We're still learning your taste. Here's what's trending while we get to know you." → shows trending, framed honestly as not-yet-personalized rather than pretending.
- **Wrapped**: Below the data threshold (PRD §11) — "Your reading year is just getting started. Come back once you've logged a few sessions and we'll show you your first recap." Never a locked/greyed-out teaser that feels like a paywall — it's a "not yet," not a "no."
- **Stats**: "Log your first reading session and your stats start here." — show the *shape* of the eventual chart (axes, empty state illustration) rather than a blank white box, so the user understands what's coming.
- **Personality**: "Your Reading DNA needs a few finished books to take shape. Every book you read sharpens the picture." — again, name what's needed, not just absence.
- **Achievements**: Show the full badge case with locked/greyed silhouettes and clear unlock conditions visible — this is more motivating than hiding badges entirely, since it previews the game board rather than presenting a void.
- **Discover**: Should essentially never be empty (falls back to trending/popular), but if a filtered/mood view returns nothing — "No matches for this mood right now — try another, or browse everything." Never a dead end.
- **Goals**: "Set a goal that fits your week — even 10 minutes a day counts." Framed around accessibility (low bar to start) rather than ambition, directly serving the time-scarce persona (James).

---

## 8. Error States

- **Offline**: Cached library/dashboard data remains viewable (read-only); reading-session logs queue locally and sync on reconnect rather than being silently lost or blocking the user with an error screen.
- **Book not found (search)**: "No results for '[query]' — try a different spelling, or search by author instead." Never a bare "0 results."
- **API failure (external book data)**: If Google Books/Open Library is down, degrade to cached/local data where possible; for a book detail page with no cache, a friendly retry state ("Having trouble loading this book's details — try again") rather than a raw error or blank page.
- **Network issue (general)**: Toast-style, non-blocking where the action can be safely retried in the background (e.g. a session log) — reserve full-screen error states for genuinely blocking failures (e.g. can't load the app shell at all).
- **Goal "failed" (missed)**: Reframed entirely — there is no "failed" state in the UI's language. A missed goal simply rolls into the next period with neutral copy, per the emotional-journey principle of never shaming.
- **Broken streak**: See Flow 2.19 — freeze mechanic, neutral copy, no red/alarm visual language.
- **No recommendations available**: Same pattern as the Recommendations empty state — honest fallback to trending, never a dead end.

**Cross-cutting principle**: no error state in Bookify should ever imply the *user* did something wrong (a missed goal, a broken streak) — those get the empty-state treatment (forward-looking, neutral) even though technically they're "failure" conditions. Genuine error states are reserved for actual system/network failures, and even those get a recovery path, never a dead end.

---

## 9. Delight Moments

Ranked roughly by intensity — this ordering matters, because using a big moment for a small event cheapens the big ones (the core risk flagged throughout this document).

**Quiet, frequent** (every session): progress ring fill animation, XP tick.
**Small, regular** (weekly-ish): goal completion for the day/week, minor milestone (halfway through a book).
**Medium, occasional** (every few weeks): badge/achievement unlock, level up.
**Large, rare** (handful of times a year): first book ever finished, 30-day streak, 100th day, yearly Wrapped reveal, a major personality evolution (archetype actually changes, not just percentages shifting).

**First Book**: deserves a genuinely distinct, one-time-only celebratory sequence — this is the single most important moment to get right in the whole app, since it's the proof-of-concept moment for the entire "identity as output" premise landing for the very first time.

**First Week / early streak**: light, encouraging, not over-the-top — early streaks should feel achievable and rewarded, but a 3-day streak triggering the same intensity as a 100-day one teaches users to discount celebration going forward.

**30-Day Streak**: a clear tier-up moment — meaningfully bigger than daily/weekly celebration, positioned as a genuine milestone.

**Level Up**: medium — animated but brief, doesn't interrupt flow.

**Book Completion**: medium, per Flow 2.7 — consistently present but calibrated so it doesn't fatigue a heavy reader finishing several books a month.

**Reading DNA Changes / Personality Evolution**: this is a delight moment worth treating specially even though it's not explicitly "exciting" in the confetti sense — the payoff here is closer to recognition/insight than celebration, and the UX should lean into that quieter register (a thoughtful reveal, not fireworks) rather than forcing it into the same visual language as a badge unlock.

**Wrapped Reveal**: the single largest delight moment in the product's calendar — full sequential treatment, justified precisely because it's rare (yearly, lighter monthly version) rather than a pattern repeated often enough to lose its shine.

**Badge Unlock**: medium, per Flow 2.9.

**Explicit anti-pattern to avoid**: any celebration that fires on an action with zero real significance (e.g., simply opening the app, or logging a single page) — this is the fastest way to train users to ignore all celebratory UI in the product, at which point even the big moments stop landing.

---

## 10. UX Principles

These are the constraints every future screen must be checked against before shipping:

1. **Reduce friction on high-frequency actions, add weight only to meaningful ones.** Logging a page: one tap. Finishing a book: a real moment. Don't confuse "important to the business" with "should require more taps" — they're often inverted.
2. **Celebrate progress proportionately.** Match the intensity of the moment to the actual significance of the milestone (§9) — never celebrate routine actions at the same level as rare ones.
3. **Never shame users.** No red/warning visual language for missed goals or broken streaks. Missed goals and broken streaks get the empty-state treatment (forward-looking, neutral), not the error-state treatment.
4. **Always propose the next reading action.** No screen — including empty states — should be a dead end. Every state names what's next and how to get there.
5. **Identity over statistics.** Numbers are raw material; every surfaced stat should be wrapped in narrative language somewhere in its presentation ("You give most books a real chance" beats "DNF rate: 12%"), even if the raw number is also available for users like Daniel/Sofia who want it.
6. **Consistency over quantity, everywhere in the UI, not just in the gamification system.** Visual weighting throughout the app should favor streak/frequency signals over raw volume signals (books-per-year isn't the hero metric; days-active-per-month is).
7. **Books are input, reader is the hero.** Book covers and metadata support the experience; the user's own evolving profile is the through-line the UI keeps returning to. When in doubt about what a screen should emphasize, default to the user's own data/identity over the catalog's.
8. **Honesty over polish when they conflict.** An honest "we don't have enough data yet" beats a fake-personalized empty state dressed up to look complete — trust, once lost by a recommendation or personality read that obviously wasn't real, is expensive to rebuild.
9. **Motion should communicate state change, not decorate.** Every animation should be answerable with "what information does this convey" (progress filling, XP accruing) — if an animation's only purpose is to look impressive, it's a candidate to cut.
10. **Every future feature gets checked against the philosophy, not just the feature spec.** Before shipping any new screen: does this reinforce "books are input, identity is output," or does it just add another number to track? If it's the latter, it needs a narrative wrapper before it ships.

---

## Summary of the strongest pushback points in this document

1. The requested nav list conflates pages and sub-views — collapsed into 4 primary destinations, with the entire identity layer (Personality, Stats, Achievements, Wrapped) deliberately unified under one "You" section rather than fragmented across the top nav.
2. The 30-day-return flow (2.16) and streak-freeze mechanic (2.19) are added as first-class designed flows — the original brief listed "returning after 30 days" but the PRD had already identified this as a genuine gap, and it deserves real design attention, not a fallback state.
3. Delight moments are explicitly tiered and ranked — the brief's flat list is reorganized so intensity scales with actual significance, protecting the big moments (first book, Wrapped) from being cheapened by overuse elsewhere.
4. Error states and "failure" states (missed goals, broken streaks) are deliberately split — the latter get empty-state treatment, not error treatment, because implying user fault where there's no actual failure is the single fastest way to violate "never shame users."
