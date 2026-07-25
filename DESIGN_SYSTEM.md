# Bookify — Design System

*Version 1.0 · Single source of truth for all future UI decisions*

---

## 0. The one decision everything else follows from

Before the token tables: most "premium Gen Z app" briefs default to one of three looks — warm cream-and-serif literary, near-black-with-neon-accent tech, or hairline-rule editorial broadsheet. All three would be *wrong* for Bookify specifically, not just overused: cream-and-serif reads as Kindle/literary-nostalgia (the opposite of "not like a library catalog"), near-black-and-neon reads as a trading app, and broadsheet reads as a newspaper. None of them contain a bookshelf.

Bookify's signature is the **Spine** — a vertical, multi-segment color bar, proportioned like a book's spine on a shelf, where each segment's width encodes a share of the reader's genre DNA. It's the visual answer to "books are input, identity is output" made literal: a shelf of books compresses into one bar that *is* a person's reading identity. This single motif recurs everywhere — as the loading indicator, the profile header accent, the genre-distribution chart, even (subtly) as the shape of a progress bar. It's the one place this system spends its boldness; everything else stays quiet in support of it.

---

## 1. Brand Personality

**Bookify feels like**: the quiet satisfaction of a well-organized bookshelf lit by evening lamp light, crossed with the momentum of watching a streak counter tick up. Warm, not cold. Confident, not loud. Personal, not generic.

**Relative to the reference set**:
- **vs. Spotify** — Bookify borrows Spotify's confidence in bold color-blocked artwork and its trust in data-as-identity, but Spotify's palette is built for a wall of album art in every color; Bookify's book covers are already visually loud (publishers design them to be), so Bookify's *own* UI needs to be quieter than Spotify's to avoid visual competition with the content it's displaying.
- **vs. Goodreads** — the explicit anti-reference. Beige, dense, form-like, un-opinionated about hierarchy. Bookify is the inverse on every axis: generous whitespace, one clear focal element per screen, opinionated color.
- **vs. Kindle/Apple Books** — both are reading *interfaces* (optimized for the page itself); Bookify is a reading *companion* app and never renders actual book text, so it doesn't inherit their paper-and-serif restraint. Bookify can be more expressive because it's not competing with an open book for the user's eye.
- **vs. Notion** — shares a respect for calm, structured information density, but Notion is intentionally neutral (a blank canvas for anything); Bookify is the opposite of neutral — it has a strong point of view and should never feel like a tool the user configures.
- **vs. Pinterest** — shares a visual-grid confidence and a taste-driven identity layer (Pinterest boards are also "input becomes identity"), but Pinterest is infinite and undirected; Bookify is always pointed at one next action, never an endless scroll with no destination.

**Emotions the UI should evoke, in priority order**: warmth → momentum → pride → calm curiosity. Notably *not* urgency, competition, or gamified frenzy — those emotions belong to a different kind of app and would undercut the "premium, not childish" mandate.

---

## 2. Design Principles

1. **The reader is the hero, the book cover is the supporting cast.** Book covers are the loudest visual element on any screen almost by default (publishers optimize them to grab attention) — the UI around them must consistently make room rather than compete, which mostly means large image real estate against otherwise quiet surfaces.
2. **One focal point per screen.** Every screen has exactly one thing it wants the user to look at first (current book, one chart, one CTA). If a screen has two competing focal points, it needs to be split or re-prioritized, not resolved by making both smaller.
3. **Content-first, chrome-second.** Navigation, labels, and containers recede; covers, charts, and the Spine motif carry visual weight.
4. **Calm by default, expressive at milestones.** The baseline interface is quiet — motion, color intensity, and scale are reserved and spent deliberately at genuinely significant moments (ties directly to the UX Blueprint's delight-moment tiering).
5. **Consistent rhythm over decorative variety.** One spacing scale, one radius scale, one elevation scale, applied everywhere — visual interest comes from photography (book covers) and the Spine motif, not from varying the container language screen to screen.
6. **Numbers are supporting evidence, not headlines.** Stats always appear with narrative framing nearby (per UX principle "identity over statistics") — typographically, this means numbers get a distinct, precise typeface treatment but are rarely the single largest element on a screen; the archetype/summary language is.
7. **Dark mode is the primary experience, light mode is fully supported.** Given the target demographic and evening-reading context (many sessions happen at night, per the Reading Identity system tracking time-of-day), dark mode is designed first and light mode is derived with equal rigor — not an afterthought inversion.

---

## 3. Color System

### Palette

| Token | Hex | Role |
|---|---|---|
| `ink-950` | `#0E0E16` | Dark mode base background — a near-black with a deliberate cool-violet undertone, not a flat black or a warm charcoal. Reads as "night reading lamp off" rather than "OLED tech app." |
| `ink-900` | `#16161F` | Dark mode surface (cards, sheets) |
| `ink-800` | `#1F1F2C` | Dark mode elevated surface (modals, popovers) |
| `ink-700` | `#2A2A3A` | Dark mode borders/dividers |
| `paper-50` | `#FAF9F7` | Light mode base background — warm off-white, not stark `#FFFFFF` and deliberately not the cliché cream (`#F4F1EA`); slightly cooler and less saturated so it reads as "clean paper" rather than "vintage parchment." |
| `paper-100` | `#F1EFEC` | Light mode surface |
| `paper-200` | `#E6E3DE` | Light mode elevated surface |
| `paper-300` | `#D6D2CA` | Light mode borders/dividers |
| **`bookmark-500`** | `#E8395A` | **Primary accent.** A warm raspberry-crimson, chosen specifically to evoke a ribbon bookmark and to avoid both the Claude-associated terracotta (`#D97757` territory) and generic "app blue." This is the color of primary CTAs, the active nav state, and the Spine motif's dominant hue. |
| `bookmark-400` | `#F0637F` | Hover/lighter state of primary accent (dark mode) |
| `bookmark-600` | `#C41F3D` | Pressed/darker state of primary accent (light mode) |
| **`amber-500`** | `#F2A93C` | **Secondary accent — reserved for gamification only** (XP, coins, streak flame). Deliberately a *different* hue family from the primary accent so gamification visually reads as its own layer, never competing with primary actions for attention. This separation is a direct implementation of "gamify without becoming childish" — XP/coin color never appears on core navigation or reading UI. |
| `moss-500` | `#4F9E7A` | Tertiary accent — used sparingly for "growth" moments specifically (personality evolution, genre DNA increases). A third distinct hue so the three accent colors each have exactly one job: bookmark = action, amber = reward, moss = growth/insight. |
| `success-500` | `#3EAD6E` | Semantic success (distinct from `moss` despite visual proximity — success is transactional feedback, moss is identity-layer feedback; keeping them separate tokens allows them to diverge later without a breaking change) |
| `warning-500` | `#E8A33D` | Semantic warning |
| `error-500` | `#E24B4B` | Semantic error — intentionally *not* the same hue as `bookmark-500` despite both being warm reds; error is more orange-leaning, primary accent is more magenta-leaning, so they're never confusable at a glance |
| `info-500` | `#5B8DEF` | Semantic info |

### Elevation (both modes derive from the same scale, inverted)

Dark mode elevates by getting *lighter* (ink-950 → ink-900 → ink-800); light mode elevates by getting subtly *cooler and adding shadow* rather than getting darker (paper-50 → paper-100 → paper-200 with increasing shadow depth, since a pure lightness-based elevation scale reads as "dirty" in light mode rather than "elevated").

### Why this palette specifically, not the generic alternative

A generic version of this brief produces indigo-and-white with a single teal accent (the default "modern app" palette) or the cream/terracotta literary default. Bookify's palette instead derives directly from *physical reading objects*: ink (the base), paper (the light-mode base), a bookmark ribbon (primary accent), a highlighter (amber, reward layer), and new growth/a bookplate wax seal (moss, identity layer). Every color has a one-sentence justification rooted in the subject matter, not just "looks good."

### Accessibility

- All text-on-background pairings target WCAG AA minimum (4.5:1 for body text, 3:1 for large text/UI components); `bookmark-500` on `ink-950` and `ink-900` on `paper-50` are both verified above 4.5:1.
- Semantic colors (success/warning/error) are never the *sole* indicator of state — always paired with an icon or label, since `bookmark-500` and `error-500` are close enough in hue family that colorblind users (protanopia/deuteranopia specifically) may not reliably distinguish them by color alone.
- Dark mode avoids pure black (`#000000`) specifically because true black against bright accent colors produces halation/glow artifacts on OLED screens that cause eye strain during exactly the long evening reading sessions this app is designed around.

---

## 4. Typography

**Display / Headlines — Fraunces (variable)**: A serif with real character — soft ball terminals, springy contrast — used at large sizes for archetype reveals, Wrapped headlines, and onboarding moments. Chosen because it carries literary warmth without tipping into the twee/decorative territory of a full illuminated-manuscript aesthetic, and its variable axes (optical size, weight) let one typeface handle both a 64px Wrapped headline and a 20px card title without needing a second display face.

**Body / UI — General Sans**: A clean, humanist grotesk for all interface text, labels, and body copy — chosen deliberately over the extremely common Inter default; General Sans has slightly warmer curves that pair better with Fraunces than a purely geometric sans would, keeping the "warm, not corporate" brand personality intact even in the smallest UI text.

**Numerals / Stats — Space Grotesk (tabular figures)**: Reserved specifically for numbers — page counts, XP totals, percentages, streak counts. Its distinct, slightly technical character makes numbers visually legible as *data* against Fraunces headlines and General Sans body copy, which matters given Principle §2's rule that numbers should read as supporting evidence, not compete with narrative text for hierarchy — using a third, distinct face for numerals makes that hierarchy immediate rather than relying on size/weight alone.

### Scale (dark and light mode share the same scale)

| Token | Size / Line height | Face | Use |
|---|---|---|---|
| `display-xl` | 56px / 1.05 | Fraunces, 500 | Wrapped hero cards, archetype reveal |
| `display-lg` | 40px / 1.1 | Fraunces, 500 | Onboarding headlines, section heroes |
| `h1` | 32px / 1.2 | Fraunces, 500 | Page titles |
| `h2` | 24px / 1.25 | Fraunces, 500 | Section headers |
| `h3` | 20px / 1.3 | General Sans, 600 | Card titles, subsection headers |
| `h4` | 17px / 1.35 | General Sans, 600 | List headers, compact titles |
| `body-lg` | 16px / 1.5 | General Sans, 400 | Primary body copy |
| `body-md` | 14px / 1.5 | General Sans, 400 | Secondary body copy, descriptions |
| `caption` | 12px / 1.4 | General Sans, 500 | Metadata, timestamps, helper text |
| `button` | 15px / 1 | General Sans, 600 | All button labels |
| `label` | 13px / 1.2, uppercase, +0.02em tracking | General Sans, 600 | Section eyebrows, form labels |
| `stat-lg` | 36px / 1 tabular | Space Grotesk, 500 | Hero stats (XP total, streak count) |
| `stat-md` | 20px / 1 tabular | Space Grotesk, 500 | Inline stats (progress readouts) |
| `stat-sm` | 14px / 1 tabular | Space Grotesk, 500 | Compact stats in dense contexts (list rows) |

**Readability rules**: body copy never drops below 14px anywhere in the product (accessibility floor, see §12); line length for paragraph content (personality summaries, book descriptions) is capped around 60-70 characters via container max-width, not left to stretch full-bleed on wide screens; Fraunces is used at display sizes only (20px minimum) — never for body text, where its contrast and warmth become a readability liability rather than an asset.

---

## 5. Spacing System

Base unit: **4px**, scaling geometrically at the small end and linearly at the large end (matches how spacing actually needs to work — fine control for tight UI, coarse control for page-level rhythm):

`4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96`

| Context | Token |
|---|---|
| Icon-to-label gap, tight inline groups | 4-8 |
| Card internal padding | 16-20 |
| Gap between cards in a grid/row | 12-16 |
| Section internal padding (mobile) | 20 |
| Section internal padding (desktop) | 32 |
| Gap between distinct sections on a page | 48-64 |
| Page top/bottom margin (desktop) | 80-96 |

**Grid**: 4-column on mobile (16px gutters), 8-column on tablet, 12-column on desktop (24px gutters) — standard, deliberately not a place to innovate, since grid conventions exist to be invisible.

**Responsive spacing rule**: section-level spacing (48-96 range) compresses roughly 25-30% at mobile breakpoints; card-internal spacing (16-20 range) stays nearly constant across breakpoints — the rhythm *between* things should feel different on mobile (tighter, more content-dense) while the rhythm *within* a component stays consistent, since that's what makes a card recognizably "the same card" across screen sizes.

---

## 6. Border Radius

| Token | Value | Use |
|---|---|---|
| `radius-sm` | 8px | Chips, small buttons, input fields |
| `radius-md` | 12px | Cards, standard buttons |
| `radius-lg` | 20px | Large cards (dashboard hero), sheets |
| `radius-xl` | 28px | Modals, bottom sheets (top corners only) |
| `radius-full` | 999px | Pills, avatar frames, progress bars, badges |
| `radius-cover` | 6px | Book cover images specifically — deliberately *smaller* than the card radius that contains them |

**Why book covers get their own smaller radius token**: publishers design covers as rectangles with sharp or near-sharp corners; rounding them aggressively to match card radius makes them look like generic app thumbnails rather than book covers, undermining the "large, beautiful book covers" requirement from the product brief. A small 6px softening removes harsh pixel corners without disguising that it's a book.

**General rule**: radius scales with element size (bigger elements get proportionally larger radius, not the same absolute value), and progress rings/bars always use `radius-full` — this is a direct visual link to the Spine motif's rounded bar-segment ends.

---

## 7. Shadows & Elevation

Dark mode elevation is carried primarily by *surface lightness change* (§3) with shadows used sparingly and only as a secondary cue, since shadows read poorly against dark backgrounds; light mode elevation is carried primarily by *shadow* with surface lightness as the secondary cue. This inversion is deliberate, not an oversight — each mode uses the cue that's actually visible in that context.

| Token | Light mode | Dark mode | Use |
|---|---|---|---|
| `elevation-0` | none | none | Base page background |
| `elevation-1` | `0 1px 2px rgba(20,16,10,0.04)` | surface = `ink-900`, no shadow | Standard cards |
| `elevation-2` | `0 4px 12px rgba(20,16,10,0.08)` | surface = `ink-800`, subtle `0 2px 8px rgba(0,0,0,0.3)` | Dropdowns, hover-lifted cards |
| `elevation-3` | `0 12px 32px rgba(20,16,10,0.12)` | surface = `ink-800`, `0 8px 24px rgba(0,0,0,0.45)` | Modals, bottom sheets |
| `elevation-4` | `0 16px 48px rgba(20,16,10,0.16)` | `0 12px 32px rgba(0,0,0,0.55)` | Floating action elements, achievement-unlock overlay |

**Hover state rule**: interactive cards lift exactly one elevation tier on hover with a fast (120ms) transition — never more than one tier, and never combined with a scale transform at the same time (pick one motion cue per interaction, not both, per the motion philosophy in §9).

---

## 8. Iconography

**Style: line icons, rounded caps and joins, 1.5px stroke weight, 24px default grid** — using Lucide (already in the frontend stack per the architecture doc) as the base library rather than a custom icon set, for velocity and consistency, with custom icons built to match Lucide's exact stroke/corner conventions only where the product needs something Lucide doesn't have (the Spine motif icon, mood-selector icons, badge/achievement iconography).

**Why line over filled by default**: filled icons carry more visual weight than line icons at the same size, and per Principle §3 (content-first, chrome-second), navigation/utility icons should recede rather than compete with book covers. Filled icons are reserved specifically for *active/selected states* (a nav icon fills in when its tab is active) — this gives the interface a free, consistent way to communicate "selected" without needing a separate color treatment every time.

**Rounded, not sharp**: matches the rounded corner language of the radius system (§6) and softens what would otherwise be a fairly severe, technical feel — ties back to "warm, not corporate."

**Animated icons**: reserved for exactly three contexts — the streak flame (subtle idle flicker when active), the loading/Spine motif, and achievement badges at the moment of unlock. Everywhere else, icons are static. This scarcity is deliberate — an interface where every icon has a little animation stops feeling alive and starts feeling busy.

**Illustrated icons/mascots**: none. Bookify does not have a mascot character (a conscious departure from Duolingo's owl-style approach) — the "not childish" mandate is better served by the Spine motif and typography carrying personality than by an illustrated character, which skews younger than this product's actual target audience.

**Consistency rule**: one icon per concept, used identically everywhere it appears (the icon for "reading session" in the dashboard is pixel-identical to the one in Stats and in Notifications) — icon meaning should be learnable once and trusted everywhere.

---

## 9. Motion Design

**Philosophy**: motion communicates state change; it does not decorate. Every animation in the product should be answerable with "what information does this convey" — if the honest answer is "it looks nice," it's a candidate to cut (directly inherited from UX Principle §9).

| Interaction | Duration | Easing | Notes |
|---|---|---|---|
| Button press | 80ms | ease-out | Scale to 0.97, no bounce — presses should feel immediate, not springy |
| Hover lift (cards) | 120ms | ease-out | Elevation tier +1 only, see §7 |
| Progress ring/bar fill | 400-600ms | custom cubic-bezier(0.34, 1.15, 0.64, 1) — slight overshoot | The one place a small "bounce" is warranted — it's the core dopamine moment of logging a session and deserves a touch of springiness the rest of the system avoids |
| XP number tick-up | 500ms | ease-out, counting animation | Numbers count up rather than snap, but stay fast enough not to feel like a slot machine |
| Page/route transition | 200-250ms | ease-in-out | Simple cross-fade + slight vertical slide (12px) — no full-screen slide transitions, which feel heavy at this frequency |
| Modal/sheet enter | 250ms | ease-out | Slide up + fade for bottom sheets; scale + fade (0.96→1) for centered modals |
| Achievement/badge unlock | 600-800ms sequence | custom, multi-stage | The one genuinely choreographed animation in the system — badge scales in with overshoot, brief particle/shimmer accent, settles. Reserved exclusively for this moment and the Wrapped reveal sequence, per the delight-moment tiering in the UX Blueprint |
| Skeleton loading shimmer | 1.5s loop | linear | Subtle, low-contrast — should read as "waiting" not "exciting" |

**When NOT to animate**: list re-ordering/filtering (snap instantly — animating every filter change in a long list feels sluggish, not delightful); any state change during onboarding beyond simple fades (onboarding needs to feel fast, not showcase motion craft); error states (no bounce/playful motion on errors — matches the "no shame, but also no forced cheerfulness" principle from the UX Blueprint's error-state guidance); anything if `prefers-reduced-motion` is set (see §12 — all durations above collapse to near-instant cross-fades, and the achievement-unlock sequence degrades to a single static reveal with no particle effects).

**Duration philosophy summary**: nothing in the core navigation/reading loop exceeds 250ms (speed matters more than flourish for high-frequency actions); the achievement/Wrapped sequences are the only places motion is allowed to take real time, because they're rare enough to earn it.

---

## 10. Component Rules

*(Rules, not specs — actual component design/code comes later.)*

- **Buttons**: three tiers — primary (`bookmark-500` fill), secondary (outline/ghost with `ink`/`paper` text), tertiary (text-only). Never more than one primary button visible at once per screen — reinforces "one focal point" (§2). Minimum touch target 44×44px regardless of visual size.
- **Inputs**: flat fill (`ink-900` / `paper-100`) with a bottom-weighted focus indicator (border or underline color shift to `bookmark-500`), not a full box-shadow glow — quieter, matches the calm-interface principle.
- **Cards**: `radius-md` or `radius-lg` depending on hierarchy (§6), `elevation-1` at rest, `elevation-2` on hover if interactive. Book-cover-forward cards (Discover, Library grids) let the cover fill 60-70% of card area minimum — the card is a frame, not a competing visual element.
- **Book Covers**: always displayed at their true aspect ratio (never cropped/stretched to a square), `radius-cover` (§6), subtle 1px inner border in low-opacity `ink`/`paper` to define edges against similarly-toned backgrounds without needing a heavy drop shadow.
- **Badges (achievement)**: circular, `radius-full`, filled with a soft gradient unique to its category (habit badges lean `bookmark`, taste badges lean `moss`) — this gives the badge case (§ UX Blueprint) an at-a-glance color-coded organization without needing labels.
- **Chips**: `radius-sm`, used for genre tags/filters, filled-quiet at rest, filled-`bookmark-500` when selected/active — never outlined-only for selected state, since outline-vs-fill as the only selected/unselected distinction is a common accessibility miss (relies too much on subtle contrast).
- **Progress Rings**: the primary metaphor for reading progress. Stroke uses `bookmark-500` on a low-opacity track of the same hue (not a neutral gray track) — keeps the ring feeling like it belongs to the brand rather than a generic system component.
- **Charts**: Recharts-based (per architecture doc), styled to use the semantic/accent palette consistently — genre-distribution charts specifically should visually echo the Spine motif's segmented-bar language rather than defaulting to a generic pie chart, reinforcing the signature element every time reading identity data appears.
- **Navigation**: bottom tab bar on mobile (4 items per §1 of the UX Blueprint), left rail on desktop/tablet — icons line-style at rest, filled at active state (§8), active tab additionally gets a small `bookmark-500` indicator dot/underline, never a full background fill (too heavy for a persistent element).
- **Search**: full-width field, prominent but not oversized, appears inline at the top of Discover and as an overlay/expand pattern from the global header elsewhere — never a separate full-page "search mode" that removes context.
- **Modals**: centered, `radius-xl`, `elevation-3`, reserved for genuinely interruptive actions (confirmations with real consequences) — most flows in this product should use bottom sheets or inline expansion instead, since modals are the heaviest-weight pattern in the system and should be used least often.
- **Bottom Sheets**: the default "more detail without leaving context" pattern (mobile-first, works as a right-side drawer on desktop) — used for shelf selection, quick book actions, filter panels.
- **Toasts**: bottom-anchored on mobile, top-right on desktop, auto-dismiss 3-4s, used for confirmations of low-stakes actions (book added, settings saved) — never used for anything requiring a decision (that's a modal or inline prompt instead).
- **Dropdowns**: `elevation-2`, `radius-md`, anchored directly to their trigger, closing on outside click/escape — standard behavior, no reinvention needed here.
- **Tooltips**: reserved for genuine disambiguation (an icon-only button whose meaning isn't obvious), never used to explain core UI that should be self-evident from labels/layout alone — a product that needs many tooltips has an IA problem tooltips can't fix.

---

## 11. Imagery

**Book covers**: the primary imagery language of the entire product. Always shown at true aspect ratio, `radius-cover`, occasionally with a soft ambient glow behind large hero covers (a blurred, color-extracted version of the cover itself as a background wash) — this technique (also used by Spotify/Apple Music for album art) ties the surrounding UI's color mood to the actual content without requiring manual curation.

**Illustration style**: used only for empty states and onboarding, never for marketing/functional UI elsewhere. Style: simple, geometric, single/limited-color-fill line-and-shape illustrations (not cutesy character illustration, not photorealistic) — small stylized shelf/book/bookmark motifs that echo the Spine concept rather than generic stock-style empty-state art. This is a deliberate, narrow illustration system, not an open-ended one — every empty-state illustration should look like it belongs to the same small family.

**Background graphics**: primarily the ambient cover-glow technique described above, plus occasional very subtle Spine-motif fragments (a few soft, out-of-focus vertical color bars) used sparingly on marketing/onboarding surfaces only — never on dense in-app screens, where they'd compete with real content.

**Gradients**: used deliberately and sparingly — the ambient cover-glow wash, the Wrapped card backgrounds (each Wrapped card gets a distinct, generated gradient derived from that period's dominant genre color), and achievement-badge fills. Never used as a generic decorative background on standard app screens (dashboard, library, discover) — those stay on flat `ink`/`paper` surfaces so the gradient treatment stays special and tied specifically to identity/celebration moments.

**Patterns/textures**: none as a general system element. A subtle grain/noise texture may be applied *only* to Wrapped's full-bleed gradient cards (a common technique to keep large flat gradients from banding, and it adds a tactile, premium quality at exactly the moment the product is trying to feel most special) — not used anywhere else.

---

## 12. Accessibility

- **Color contrast**: WCAG AA minimum across the entire system (§3); large display text (Fraunces headlines) held to a slightly higher standard in practice since its lighter optical weight at large sizes reads thinner than equivalent-weight sans text.
- **Keyboard navigation**: full tab-order support on web, logical focus order matching visual layout, no keyboard traps in modals/sheets (focus is trapped *within* an open modal, but escape/tab-through always has an exit).
- **Reduced motion**: `prefers-reduced-motion` respected globally — all durations in §9 collapse to near-instant simple fades; the achievement-unlock and Wrapped sequences degrade to a single static reveal rather than being disabled entirely (the moment still needs to land, just without motion as the mechanism).
- **Focus states**: a visible focus ring (2px, `bookmark-500`, offset 2px from the element) on every interactive element for keyboard users — never removed for aesthetic reasons, never relying on color change alone as the only focus indicator.
- **Touch targets**: 44×44px minimum on all interactive elements regardless of visual size (§10, Buttons) — a small icon button's visual footprint can be 24px while its tap target remains 44px via padding.
- **Typography scaling**: layout must hold up at 200% OS-level text scaling without clipping or overlap — this is a hard constraint on the spacing system (§5), not an edge case to patch later; card layouts that only work at default text size are a bug, not a v2 fix.

---

## 13. Design Tokens

Representative token set (full implementation-ready token file is a build-phase deliverable, not this document — this establishes the naming convention and structure every future token must follow).

```
// COLOR
--color-ink-950: #0E0E16;
--color-ink-900: #16161F;
--color-ink-800: #1F1F2C;
--color-ink-700: #2A2A3A;
--color-paper-50: #FAF9F7;
--color-paper-100: #F1EFEC;
--color-paper-200: #E6E3DE;
--color-paper-300: #D6D2CA;
--color-bookmark-400: #F0637F;
--color-bookmark-500: #E8395A;
--color-bookmark-600: #C41F3D;
--color-amber-500: #F2A93C;
--color-moss-500: #4F9E7A;
--color-success-500: #3EAD6E;
--color-warning-500: #E8A33D;
--color-error-500: #E24B4B;
--color-info-500: #5B8DEF;

// SPACING
--space-1: 4px;  --space-2: 8px;   --space-3: 12px;
--space-4: 16px; --space-5: 20px;  --space-6: 24px;
--space-8: 32px; --space-10: 40px; --space-12: 48px;
--space-16: 64px; --space-20: 80px; --space-24: 96px;

// TYPOGRAPHY
--font-display: "Fraunces", serif;
--font-body: "General Sans", sans-serif;
--font-stat: "Space Grotesk", monospace;
--text-display-xl: 56px/1.05;
--text-display-lg: 40px/1.1;
--text-h1: 32px/1.2;
--text-h2: 24px/1.25;
--text-h3: 20px/1.3;
--text-h4: 17px/1.35;
--text-body-lg: 16px/1.5;
--text-body-md: 14px/1.5;
--text-caption: 12px/1.4;

// RADIUS
--radius-sm: 8px;  --radius-md: 12px; --radius-lg: 20px;
--radius-xl: 28px; --radius-full: 999px; --radius-cover: 6px;

// ELEVATION (light mode shadow values; dark mode uses surface-token swap, see §7)
--elevation-1: 0 1px 2px rgba(20,16,10,0.04);
--elevation-2: 0 4px 12px rgba(20,16,10,0.08);
--elevation-3: 0 12px 32px rgba(20,16,10,0.12);
--elevation-4: 0 16px 48px rgba(20,16,10,0.16);

// MOTION
--duration-instant: 80ms;
--duration-fast: 120ms;
--duration-base: 200ms;
--duration-moderate: 400ms;
--duration-celebratory: 600ms;
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--ease-overshoot: cubic-bezier(0.34, 1.15, 0.64, 1);

// OPACITY
--opacity-disabled: 0.4;
--opacity-hover-overlay: 0.06;
--opacity-scrim: 0.6;

// BLUR
--blur-cover-glow: 48px;
--blur-scrim: 8px;
```

---

## 14. Anti-Patterns

Explicit decisions Bookify will never make, each tied to a specific reason rather than a bare rule:

- **More than one primary-accent CTA per screen** — dilutes the "one focal point" principle and makes the interface feel indecisive about what it wants the user to do.
- **Gamification color (`amber-500`) appearing outside gamification contexts** — the moment XP-yellow shows up on a settings toggle or nav icon, the whole palette's meaning system breaks down.
- **Heavy skeuomorphism** (fake leather textures, page-curl effects, realistic bookshelf renders) — reads as dated/gimmicky rather than premium; the Spine motif achieves the "bookshelf" reference abstractly instead.
- **Dense, spreadsheet-like dashboards** — direct rejection of the Goodreads reference; if a screen needs more than one primary chart/stat cluster to feel complete, it's two screens, not one dense one.
- **Tiny text anywhere** (sub-12px) — both an accessibility floor violation and a "trying to fit too much on screen" symptom that should be solved by reducing content, not shrinking type.
- **A navigation structure deeper than 3 taps to any core action** — logging a reading session, checking stats, or browsing recommendations should never require tunneling through nested menus.
- **Excessive/constant animation** — per §9, if every interaction has a flourish, none of them read as special; motion is a budget, and it's mostly spent on the achievement/Wrapped moments.
- **A mascot or cartoon character system** — considered and deliberately rejected (§8); skews the brand younger and cuter than the "premium, sophisticated" mandate supports.
- **Confetti/celebration on routine actions** — directly undermines the delight-moment tiering established in the UX Blueprint; if a page-log triggers the same visual celebration as a 100-day streak, the 100-day streak stops meaning anything.
- **Pure black backgrounds** — per §3's accessibility note, both an eye-strain and OLED-halation issue specifically relevant to this app's heavy evening-usage pattern.
- **Cream-and-serif "literary nostalgia" aesthetic, or generic indigo-and-teal "modern SaaS" aesthetic** — both were the default outcomes this system deliberately steered away from at the outset (§0); reintroducing either through an unreviewed future screen would quietly erode the system's actual point of view.

---

## Summary of the strongest choices in this document

1. **The Spine motif** — a single, content-derived signature element (genre-DNA-as-bookshelf-spine) that recurs across loading states, charts, profile accents, and progress bars, giving the whole system one memorable idea instead of a grab-bag of trends.
2. **Three accent colors, three strict jobs** — `bookmark` (action), `amber` (reward, gamification-only), `moss` (growth/identity) — a color-coding discipline that does real information-architecture work, not just decoration.
3. **A three-typeface hierarchy where numbers get their own face** — makes "identity over statistics" a typographic rule, not just a stated value: stats are visually marked as *supporting evidence* by using a distinct, technical face, while narrative/identity language always carries the warmer display face.
4. **Dark-mode-first elevation logic that inverts appropriately in light mode**, rather than one elevation system naively reused across both.
5. **A narrow, deliberately rare motion budget** — most of the system moves in under 250ms; the achievement-unlock and Wrapped sequences are the only places allowed to take real time, which is what makes them still feel special after months of daily use.
