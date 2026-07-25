# Bookify — Visual UI Specification

*Version 1.0 · Build-ready. Extends Design System + Screen Architecture; does not contradict them.*

**Document structure**: Part A (Global System) defines every value that applies everywhere — grid, spacing rhythm, elevation, typography, motion, accessibility baseline. Part B (Component Library) gives exact pixel specs for every reusable component. Part C (Screens) states only what's specific to each screen — exact hero/card dimensions, breakpoint transformation logic, screen-specific composition — and references Parts A/B for everything already defined there rather than restating it. Part D closes with the eight requested reference sections.

---

# PART A — Global System

## A1. Breakpoints & Grid

| Breakpoint | Range | Columns | Gutter | Margin | Content max-width |
|---|---|---|---|---|---|
| Mobile | 375–767px | 4 | 16px | 16px | fluid (100% − margins) |
| Tablet | 768–1023px | 8 | 20px | 32px | fluid |
| Desktop | 1024–1439px | 12 | 24px | 64px | 1200px |
| Large Desktop | 1440px+ | 12 | 24px | auto (centers content) | 1280px, hard cap — extra width becomes background/whitespace, never stretched content or additional columns of information |

**Vertical rhythm**: page-level section gaps use `--space-12` (48px) at mobile, `--space-16`–`--space-20` (64–80px) at desktop/large desktop, per Design System §5. Card-internal padding stays constant across all four breakpoints (16–20px) — only inter-section rhythm compresses/expands, never intra-component spacing. This is the single rule that governs every "how does this reflow" question below unless a screen explicitly overrides it.

**Safe areas**: all full-bleed mobile layouts respect `env(safe-area-inset-*)` on notch/home-indicator devices — bottom nav height includes `env(safe-area-inset-bottom)` as additional padding, not a fixed 64px regardless of device.

## A2. Typography — exact values

(Extends Design System §4 with weight/letter-spacing precision.)

| Token | Size/Line-height | Weight | Letter-spacing | Face |
|---|---|---|---|---|
| `display-xl` | 56px/1.05 (mobile: 40px/1.1) | 500 | −0.01em | Fraunces |
| `display-lg` | 40px/1.1 (mobile: 32px/1.15) | 500 | −0.01em | Fraunces |
| `h1` | 32px/1.2 (mobile: 26px/1.25) | 500 | 0 | Fraunces |
| `h2` | 24px/1.25 | 500 | 0 | Fraunces |
| `h3` | 20px/1.3 | 600 | 0 | General Sans |
| `h4` | 17px/1.35 | 600 | 0 | General Sans |
| `body-lg` | 16px/1.5 | 400 | 0 | General Sans |
| `body-md` | 14px/1.5 | 400 | 0 | General Sans |
| `caption` | 12px/1.4 | 500 | 0.01em | General Sans |
| `button` | 15px/1 | 600 | 0.01em | General Sans |
| `label` | 13px/1.2 | 600 | 0.02em, uppercase | General Sans |
| `stat-lg` | 36px/1 (mobile: 28px/1) | 500 | −0.01em, tabular-nums | Space Grotesk |
| `stat-md` | 20px/1 | 500 | tabular-nums | Space Grotesk |
| `stat-sm` | 14px/1 | 500 | tabular-nums | Space Grotesk |

Mobile display/h1 sizes step down as noted — everything `h2` and smaller is size-stable across all four breakpoints (only line-length/wrapping changes, not the type scale itself).

## A3. Elevation, Shadow, Blur — exact usage

Full token values already defined in Design System §7/§13. Usage rule set here:

- Cards at rest: `elevation-1`. Interactive-card hover (desktop only — no hover state exists on touch): `elevation-2`, `120ms ease-out` transition on `box-shadow` and a simultaneous `transform: translateY(-2px)` — never combined with a scale transform per Design System §7.
- Dropdowns/popovers: `elevation-2`. Modals, bottom sheets, achievement-unlock overlay: `elevation-3`/`elevation-4` per Design System §7 table.
- Blur usage is deliberately narrow: `backdrop-filter: blur(8px)` on the save-icon scrim over book covers (A2 of Component Library, Book Card) and on modal/sheet scrims (`--opacity-scrim: 0.6` over `blur(--blur-scrim: 8px)`). Blur is never used as a generic "glassmorphism" background panel treatment elsewhere — Design System §0/§14 explicitly scoped glassmorphism to "only where appropriate," and the only appropriate uses in this product are legibility-over-varying-imagery (the cover scrim) and scrim-behind-overlay (modals/sheets).
- Cover ambient glow (Design System §11): a blurred (`blur(48px)`), color-extracted, low-opacity (18–24%) duplicate of the book cover, positioned behind the cover at 1.4× scale, used on Book Detail and Wrapped hero cards only — never on grid/row card contexts, where it would create visual noise across many simultaneous covers.

## A4. Motion — global table

| Token | Duration | Curve | Used for |
|---|---|---|---|
| `instant` | 80ms | ease-out | Button press (scale 0.97) |
| `fast` | 120ms | ease-out | Hover lift, chip selection toggle |
| `base` | 200–250ms | ease-in-out | Route/page transitions, modal/sheet enter-exit |
| `moderate` | 400–600ms | `cubic-bezier(0.34,1.15,0.64,1)` (overshoot) | Progress ring/bar fill, XP tick count-up |
| `celebratory` | 600–800ms, multi-stage | custom, sequenced | Achievement unlock, archetype-change reveal |

**Delay rule**: sequenced entrances (e.g., Wrapped card internals, onboarding step transitions) stagger child elements by `40–60ms` per element, capped at 4 staggered elements — beyond that, elements animate as one group, since longer stagger chains read as sluggish rather than polished.

**Trigger rule**: state-driven animations (ring fill, XP tick, badge unlock) fire only on the actual data-change event, never on scroll-into-view for anything already-resolved data (a ring that's already 60% filled does not "fill up from 0" every time it scrolls into view — it renders at 60% instantly, and only animates when the underlying value changes).

**Reduced motion**: `prefers-reduced-motion: reduce` collapses `moderate`/`celebratory` timings to a single 150ms opacity cross-fade with no transform/overshoot; `instant`/`fast` are unaffected (they're already too brief to cause discomfort); the achievement-unlock and archetype-change sequences degrade to their final static state rendered directly, skipping the multi-stage build entirely rather than playing a slowed-down version of it.

## A5. Accessibility Baseline (applies to every screen and component below without restatement)

- **Touch targets**: 44×44px minimum hit area on every interactive element, regardless of visual size (icon buttons achieve this via padding, not by growing the icon itself).
- **Contrast**: WCAG AA minimum (4.5:1 body text, 3:1 large text/UI components) verified per the Design System §3 palette; this spec introduces no new colors, so no new verification is needed beyond what's already confirmed.
- **Focus states**: 2px solid `bookmark-500` ring, 2px offset from the element edge, visible on every interactive element for keyboard/switch-control users — implemented via `:focus-visible` (not `:focus`) so mouse/touch interaction doesn't show a ring, only keyboard navigation does.
- **Focus order**: DOM order matches visual reading order on every screen (left-to-right, top-to-bottom at each breakpoint) — no `tabindex` manipulation to achieve visual layouts; if a layout requires visual reordering that breaks logical DOM order, the layout is revised instead.
- **ARIA**: book cards are `role="article"` with an accessible name combining title + author; progress rings expose `role="progressbar"` with `aria-valuenow/min/max`; the bottom nav uses `role="navigation"` with `aria-current="page"` on the active item; toasts use `role="status"` (polite) except error toasts, which use `role="alert"` (assertive); modals/sheets trap focus and set `aria-modal="true"` with a labeled heading referenced via `aria-labelledby`.
- **Screen readers**: decorative elements (ambient cover glow, background gradient washes, the Spine motif when used purely as flourish rather than data) are `aria-hidden="true"`; the Spine motif *as a data visualization* (Reading DNA screen) instead exposes the underlying percentages as a visually-hidden text equivalent alongside the SVG.
- **Reduced motion**: per A4.

---

# PART B — Component Library

## B1. Book Card

**Proportions**: cover uses true book aspect ratio (~2:3, matching the source image's actual ratio rather than forcing a fixed crop — per Design System §10/§11, covers are never cropped/stretched).

| Context | Cover width | Card total width |
|---|---|---|
| Discover/row card (mobile) | 108px | 108px |
| Discover/row card (desktop) | 140px | 140px |
| Library grid (mobile, 2-col) | ~45vw (fluid) | matches cover |
| Library grid (desktop, 5–6 col) | 160–180px (fluid, grid-derived) | matches cover |
| Book Detail hero | 240px (mobile) / 320px (desktop) | matches cover |

**Composition (top to bottom)**: cover image (`radius-cover` 6px, 1px inset border at 8% opacity of the surface-inverse color) → 8px gap → title (`h4`, max 2 lines, `text-overflow: ellipsis`) → 2px gap → author (`caption`, 70% opacity, max 1 line, truncate) → genre chips are **not** shown on the card itself (row/grid density doesn't support them legibly at these widths) — they appear only on Book Detail.

**CTA placement**: a 32px circular icon-button, top-right corner of the cover, inset 8px from the edge, background `rgba(surface, 0.7)` + `backdrop-filter: blur(8px)` (ensures legibility against covers of any color) — bookmark-outline icon at rest, fills solid `bookmark-500` when saved.

**Save animation**: icon path morph (outline → filled) over `120ms ease-out`, simultaneous scale pulse `1 → 1.15 → 1` over `250ms` total (the pulse overshoots slightly past the fast-token duration deliberately, since this is a satisfying confirmation moment worth a touch more time than a pure UI-state toggle).

**Hover** (desktop/pointer devices only, via `@media (hover: hover)`): card `elevation-1 → elevation-2`, cover `transform: scale(1.02)`, both `120ms ease-out`. No hover state renders on touch devices.

**Loading skeleton**: cover-shaped rectangle at the exact target aspect ratio in `ink-800`/`paper-200`, two shimmer bars beneath (title-width ~80%, author-width ~50%), shimmer sweep per A4/Design System §9 (1.5s linear loop, low contrast).

**Responsive**: row-context cards never resize with viewport beyond the two breakpoint values in the table (108px mobile, 140px desktop/tablet) — row density (cards visible at once) changes, card size does not, since a book cover has a real-world reference size and shouldn't visually balloon just because there's more screen. Grid-context cards (Library) do fluidly resize within their column, since grid density is the more natural lever there.

## B2. Progress Ring

**Construction**: SVG circle pair (track + progress arc), `stroke-linecap: round`, track = `bookmark-500` at 15% opacity, progress arc = `bookmark-500` solid.

| Context | Diameter | Stroke width | Center content |
|---|---|---|---|
| Inline/list-row (Library card overlay, Activity list) | 32px | 3px | none (ring only) |
| Book Detail progress module | 64px | 5px | `stat-md` percentage |
| Dashboard hero | 96px (mobile) / 120px (desktop) | 6px | `stat-lg` percentage + `caption` "142/384 pg" below it |

**Fill animation**: `stroke-dashoffset` transition, `moderate` token (400–600ms, overshoot curve) — fires only on value change (A4 trigger rule), renders at current value instantly on initial mount/scroll-into-view.

## B3. Buttons

| Variant | Height (mobile/desktop) | Radius | Fill | Text |
|---|---|---|---|---|
| Primary | 48px / 44px | `radius-md` 12px | `bookmark-500` | `button` token, `paper-50` |
| Secondary | 48px / 44px | `radius-md` 12px | transparent, 1.5px border (`ink-700` dark / `paper-300` light) | `button` token, `ink-50`/`ink-900` |
| Tertiary | 44px / 40px (text-only, no fixed box) | — | none | `button` token, `bookmark-500` |

Horizontal padding: 24px (primary/secondary), 8px (tertiary). Press state: `scale(0.97)`, `instant` token, no easing overshoot. Disabled: `opacity: var(--opacity-disabled)` (0.4), `pointer-events: none`. Loading: label replaced by a spinner sized to the button's text line-height, button width does not change (prevents layout shift).

## B4. Inputs

Height 48px, `radius-sm` 8px, fill `ink-900`/`paper-100`, bottom border 1.5px `ink-700`/`paper-300` at rest → `bookmark-500` on focus (border, not full box-shadow glow, per Design System §10) → `error-500` on validation error. Label (`label` token) sits 8px above the field. Helper/error text (`caption`) sits 4px below, error text in `error-500`.

## B5. Chips (Genre / Mood / Filter)

Height 36px, `radius-sm` 8px, horizontal padding 16px. At rest: fill `ink-800`/`paper-200`, text `body-md` at 85% opacity. Selected: fill `bookmark-500` solid, text `paper-50`, weight bumps to 600 — fill-based distinction, never outline-only (Design System §10 accessibility note). Toggle transition: `fast` token (120ms) on background-color.

## B6. Bottom Navigation (mobile/tablet)

Height 64px + `env(safe-area-inset-bottom)`, 4 equal-width items, `elevation-2`, background `ink-900`/`paper-50`. Per item: icon 24px (line at rest, filled at active, per Design System §8) centered, `caption`-scale label (11px) 4px below icon, active state adds a 4px `bookmark-500` dot centered 4px above the icon (not a full background fill, per Design System §10). Not present at desktop breakpoint — replaced by B7.

## B7. Left Rail Navigation (desktop/large desktop)

Fixed width 240px (collapses to 72px icon-only rail at the lower edge of the desktop breakpoint if content width is under pressure — 1024–1150px range), same 4 items, icon + full label horizontally (icon-only + tooltip in the collapsed state), active state uses a `bookmark-500` left-edge bar (3px) plus filled icon, rather than the dot used in bottom-nav — the difference in indicator shape (dot vs. bar) is intentional to match each context's geometry, not an inconsistency.

## B8. Header

Height 56px (mobile) / 64px (desktop), horizontal padding matches the breakpoint's margin (A1). Mobile: back/menu control left, page title (`h3`) center-or-left depending on screen (center only on screens with no back action, e.g. primary tab roots), search + notification-bell icons right (24px, 44px hit area each). Desktop: logo/wordmark left (only on primary tab roots), page title left-aligned elsewhere, search field inline-expandable at right, notification bell adjacent.

## B9. Search

Field height 48px, `radius-sm`, auto-focused on entry. Results list: each row 64px height (cover thumbnail 40px + title/author two-line stack), `fast` token fade/slide-in per result batch, no per-keystroke reorder animation (A4/Design System §9 — replace, don't reflow-animate).

## B10. Notifications Panel

Desktop/tablet: 380px-wide right-anchored panel, `elevation-2`, slides in from the header bell, `base` token. Mobile: full-screen takeover, slides up from the bottom, `base` token. List rows 72px height, unread state indicated by a 6px `bookmark-500` dot at the row's leading edge (not a background-color difference, which would be harder to distinguish under `prefers-contrast` settings).

## B11. Bottom Sheets

Mobile default pattern for contextual actions (shelf-move, reading-session log, filters). `radius-xl` on top corners only, `elevation-3`, scrim behind at `opacity-scrim` (0.6) + `blur-scrim` (8px). Enter: slide up from `translateY(100%)` + fade, `base` token (250ms), `ease-out`. Drag-to-dismiss gesture supported (velocity-based, standard iOS/Android sheet physics) in addition to a explicit close affordance — never drag-only, since a gesture-only dismiss fails discoverability and accessibility.

## B12. Modals (Dialogs)

Desktop/tablet default for confirmations with real consequence (delete account, discard changes). Centered, max-width 480px, `radius-xl`, `elevation-3`, scrim as B11. Enter: `scale(0.96) → 1` + fade, `base` token, `ease-out`. Reserved for genuinely interruptive actions per Design System §10 — most flows use B11 instead.

## B13. Drawers

Desktop-only variant of the mobile bottom sheet for the same contextual-action use cases — right-anchored, 400px width, same elevation/scrim/timing as B11, slide direction is horizontal (`translateX(100%) → 0`) instead of vertical.

## B14. Toasts

Bottom-anchored, mobile: full-width minus margins, centered above the bottom nav (respecting its 64px + safe-area height so it never overlaps nav). Desktop: 360px width, bottom-right corner. Height auto (min 48px), `radius-md`, `elevation-2`. Auto-dismiss 3.5s (4.5s if it contains an action link, e.g. "Undo"). Enter/exit: fade + 8px vertical slide, `fast` token.

## B15. Dropdowns

Anchored directly below/above trigger (flips if insufficient viewport space), `radius-md`, `elevation-2`, max-height with internal scroll beyond 6 visible items. Enter: `fast` token fade + 4px slide toward the trigger.

## B16. Tabs

Underline style (not pill/segmented-control style) for section-level tabs (e.g. Library shelf tabs, Profile sub-sections): `body-md` weight 600 when active / 400 when inactive, 2px `bookmark-500` underline beneath the active tab, underline position transitions (`fast` token, `translateX`) rather than disappearing/reappearing when switching tabs — this transition is the one exception to "don't animate list/filter switching" since it's a positional indicator move, not content re-layout.

## B17. Filters

Presented as a horizontal chip row (B5) for single/simple filtering (Discover mood, Library shelf), escalating to a bottom sheet (B11) containing grouped checkbox/toggle controls only when filter count exceeds ~5 simultaneous options (Search's type filters, once faceted).

## B18. Charts

Recharts-based (per Architecture doc). Line/area charts use `bookmark-500` as the primary series color with a low-opacity area fill beneath the line (`bookmark-500` at 12%); genre-distribution charts use the Spine-motif segmented-bar treatment (B20) rather than a generic pie/donut, per Design System §10. Axis labels use `caption` token at reduced opacity (60%); gridlines, where present, are 1px at 8% opacity — kept minimal, never a dense grid.

## B19. Heatmap (Reading Calendar)

Cell size 14px (desktop full-year grid) / 18px (mobile month view), 2px gap, `radius-sm`-scaled-down corner (2px) per cell. Intensity mapped to `bookmark-500` at 4 opacity steps (15%/40%/70%/100%) based on pages-read quartile for that day, empty days at `ink-800`/`paper-200` (neutral, not zero-opacity-accent, so an empty day is visually distinct from a very-light-activity day). No per-cell animation on render (A4 — heatmaps render instantly, per Screen Architecture §11's explicit rule against staggered reveal here).

## B20. Reading DNA / Spine Visualization

The signature component (Design System §0). Full specification:

- **Construction**: a horizontal (mobile: can rotate to vertical at very narrow widths) segmented bar, each segment's width proportional to that genre's percentage share, `radius-full` on the two outer end-caps only (interior segment boundaries are hard edges, not individually rounded — reads as one continuous bar, not a row of separate pills).
- **Sizing**: dashboard-teaser scale — 4px height × full card width (~280px effective); full Reading DNA screen scale — 24px height × full content width, with the top 3–4 segments individually labeled directly beneath their segment (genre name + percentage, `caption` token) and remaining smaller segments grouped into a single "Other" label.
- **Segment colors**: each genre maps to a fixed hue from a defined 8-color extension palette (derived from, but distinct from, the three UI accent colors, so genre-DNA colors are never confused with functional UI color — e.g. Fantasy = a violet, Romance = the existing `bookmark-500` family, Mystery = a deep teal, Nonfiction = `moss-500` family, etc.) — full 8-color genre palette is a content-ops deliverable alongside the genre taxonomy itself (flagged, not fully enumerated here, since it depends on final genre-list scope).
- **Animation**: on recompute, segments animate from previous proportions to new ones via a width/position morph, `celebratory`-adjacent timing (700ms, `ease-in-out`, no overshoot — this specific animation intentionally does *not* use the overshoot curve that ring-fills and XP-ticks use, keeping its register calmer/more "insight" than "reward," per Screen Architecture §12).
- **Label positioning**: below the bar for the full-screen version; omitted (bar only) for the compact dashboard-teaser version, where the top genre name + percentage instead appears as a single `caption`-token line above the bar.
- **Responsive**: bar remains horizontal down to 320px viewport width (minimum supported); segment labels wrap to two lines rather than truncating, since genre names are short enough this rarely triggers.
- **Interaction**: tapping a segment expands a small inline detail (contributing book count + a 2-3 cover thumbnail preview) directly beneath that segment, pushing subsequent segments' labels down rather than opening a separate overlay — keeps the interaction lightweight and contextual.

## B21. Badges (Achievement)

44px diameter (grid context) / 64px (unlock overlay, detail view), `radius-full`, soft gradient fill unique per category (habit badges: `bookmark-500`-family gradient; taste badges: `moss-500`-family gradient, per Design System §10). Locked state: same silhouette shape at 100% size, rendered as a flat, low-contrast outline (`ink-700`/`paper-300`) with no fill — visible, not hidden, per the empty-state philosophy.

## B22. XP Bar / Level Indicator

Compact horizontal bar, height 8px, `radius-full`, track `ink-800`/`paper-200`, fill `amber-500` (gamification's reserved hue — never `bookmark-500` here, per Design System §14 anti-pattern). Level number displayed as a small `stat-sm` badge at the bar's leading edge, not embedded inside the bar itself. Fill animates on XP gain using the `moderate` overshoot token, identical mechanics to the progress ring but visually distinct via color and bar (not ring) shape, keeping "reading progress" (bookmark-colored ring) and "gamification progress" (amber-colored bar) unambiguous at a glance.

## B23. Empty / Error State Template

Shared composition across every instance in the Systemic States table (Screen Architecture doc): centered column, small line-illustration (per Design System §11's narrow illustration family) at 96px, `h3` message directly beneath (16px gap), optional `body-md` supporting line (8px gap), single CTA button (B3 tertiary or secondary, never primary-heavy for an empty state — primary-weight buttons are reserved for a screen's actual main action) 24px below the text block.

## B24. Offline Banner

Persistent, non-blocking, 32px height strip anchored directly beneath the header (not a full-screen takeover, per Screen Architecture's Systemic States table), background `warning-500` at 12% opacity with `warning-500` text/icon, `body-md`-scale text ("You're offline — some content may be out of date"), no dismiss control (it should disappear automatically on reconnect, not require user action either way).

---

# PART C — Screens (deltas only; everything not listed here inherits Parts A/B unchanged)

## C1. Landing

- **Container**: full-bleed hero, content constrained to A1 max-widths below the fold.
- **Hero visual**: 100vh (mobile) / 640px fixed height (desktop) — the book-cover-to-Spine-motif animation described in Screen Architecture §1, single orchestrated `celebratory`-tier entrance (1.2s, sequenced), then settles static.
- **Breakpoint transform**: mobile hero is a simplified static composition (lighter asset, load-time priority); tablet/desktop render the full sequenced animation. Proof-point section: 1-column stack (mobile) → 3-column row (desktop), each column 320px min-width before wrapping.

## C2. Auth (Login / Sign Up / Forgot Password)

- **Card**: 400px max-width at all breakpoints ≥ tablet; full-width minus 16px margins at mobile. Vertical padding 32px, horizontal 24px (mobile) / 32px (desktop).
- **Field stack gap**: 16px between fields, 24px between the field stack and the primary CTA, 16px between CTA and the secondary text link.
- **Breakpoint transform**: identical structure at every size (per Screen Architecture §2) — only the card's outer margin changes, not its internal composition.

## C3. Onboarding

- **Progress indicator**: 4px-tall segmented bar, full content width, fixed to the top safe area, segments = step count, `fast`-token fill transition between steps.
- **Genre chip grid**: B5 chips in a wrapping flex grid, 8px gap, centered; live Spine-preview bar (B20, compact scale) appears 24px below the grid once 3+ selections are made, `moderate`-token entrance.
- **Breakpoint transform**: single-column at all sizes (Screen Architecture §3) — desktop simply increases the horizontal margin (up to A1's 64px) rather than introducing multi-column content.

## C4. Dashboard

- **Hero card**: full content-width, fixed internal layout — cover (96px mobile/128px desktop) left-aligned, title/author/progress-ring (B2 hero size) stacked right of the cover, log-reading CTA (B3 primary, full-width on mobile beneath the cover block, inline right-aligned on desktop) — total card height ~180px mobile / 160px desktop (desktop is shorter because the wider viewport allows a single row instead of a stacked block).
- **Streak/XP strip**: 56px height, directly beneath the hero card with 16px gap, horizontally split into two compact stat clusters (streak: flame icon + `stat-md`; XP: level badge + `amber-500` B22 bar).
- **Below-fold module gap**: 32px between each teaser card (identity, made-for-you, week-at-a-glance, activity, discover-preview) at mobile; desktop introduces the two-column split described in Screen Architecture §4 at 24px column gap.
- **Breakpoint transform**: mobile — full single-column stack in the exact order specified in Screen Architecture §4. Tablet — hero + streak/XP strip may sit side-by-side if width allows (≥ 900px effective content width); below-fold stays single column. Desktop/large desktop — two-column below-fold grid as specified, hero remains full-width/dominant at every size.

## C5. Discover

- **Mood strip**: horizontal scroll of B5 chips, mobile: pinned top, 48px height row; desktop: converts to a 200px-wide left-side vertical filter panel (Screen Architecture §5), chips stack vertically with the same B5 spec rotated.
- **Rows**: row title `h3`, 16px below it the horizontal scroll of B1 cards at 12px inter-card gap, with a partial "peek" of the next card (minimum 24px of the next card visible at the row's right edge at all breakpoints, signaling scrollability without a visible scrollbar).
- **Snap behavior**: CSS scroll-snap, `scroll-snap-align: start` per card, mandatory on mobile (touch), proximity (not mandatory) on desktop (mouse/trackpad scroll shouldn't feel like it's fighting the user).
- **Row loading**: skeleton row renders B1's skeleton state × 4-5 cards immediately, replaced card-by-card as data resolves (not row-by-row block-swap) — reduces perceived wait.
- **Infinite loading** (within a row, "see more"): triggers at 80% scroll depth of the row's current content, appends next batch with the same `fast`-token fade-in as B9 search results.

## C6. Search

- **Result row**: 64px height (B9), full content-width list, 1px divider (`ink-700`/`paper-300` at 40% opacity) between rows — the one place a hairline divider is used in the system, since a dense text list benefits from it more than card-based screens do.
- **Breakpoint transform**: mobile — full-screen overlay takeover, field pinned to top under the header. Desktop — inline expanding panel from the header search icon, 480px width, `elevation-2`, results list contained within it rather than taking the full viewport.

## C7. Book Details

- **Cover block**: B1 hero size (240/320px) with ambient glow (A3) behind it, centered on mobile, left-aligned in a two-column split on desktop (cover+progress left column 400px fixed, description/metadata right column fluid).
- **Primary CTA**: B3 primary, full-width on mobile directly beneath the cover block; fixed 280px width on desktop, right of the cover in the left column.
- **Progress module**: B2 medium ring + B10-equivalent readout, appears directly beneath the CTA only when the book has an active `UserLibrary` status beyond "want to read."
- **Similar Books row**: identical spec to C5's row treatment, full-width, positioned last regardless of breakpoint.

## C8. Personal Library

- **Shelf tabs**: B16 tabs, horizontally scrollable if they exceed viewport width on mobile (Currently Reading / Want to Read / Finished / Paused / DNF / Favorites / + Collections).
- **Grid**: 2 columns mobile (16px gap) / 3-4 tablet (20px gap) / 5-6 desktop (24px gap), each cell = B1 grid-context card with an added compact progress-ring overlay (B2 inline, 32px, bottom-right corner of the cover) when status is "Currently Reading," and a small shelf-status corner badge (16px, `radius-sm`, colored per status — a muted neutral set, distinct from and quieter than the genre-DNA palette so it doesn't compete with it) otherwise.
- **Selection state** (future bulk-manage): selected cards get a 2px `bookmark-500` border + a checkmark overlay (24px circle, top-left) — spec'd now for architectural consistency even though bulk actions are a future feature per the Screen Architecture roadmap.

## C9. Reading Session (logging interaction)

- **Sheet height**: intrinsic/content-based (not a fixed viewport percentage) — typically ~280px covering the page-number stepper + collapsed secondary fields, expanding to ~420px if "add session details" is expanded.
- **Page-number control**: large `stat-lg`-scale numeral, center-aligned, flanked by 44×44px stepper buttons (B3 tertiary variant, icon-only); direct numeral tap opens the OS numeric keypad for fast manual entry as an alternative to stepping.
- **Confirm CTA**: B3 primary, full sheet width, pinned to the sheet's bottom edge above the safe-area inset.

## C10. Reading Progress (embedded component contract)

Already fully specified as B2 + its readout line — no independent screen-level spec needed; this entry exists only to confirm no deltas apply beyond B2.

## C11. Reading Analytics

- **Period selector**: B16-style tabs (Week/Month/Year), pinned top.
- **Heatmap**: B19, full content-width, year view on desktop (12-column month grid within the component), scrollable month-by-month paginated view on mobile.
- **Stat cluster**: 2×2 grid mobile (each cell: `stat-lg` + `caption` label beneath) / single row of 4 on desktop, 24px gaps.
- **Trend charts**: B18, full-width, stacked vertically with 32px gaps between each chart.

## C12. Reading DNA

- **Spine visualization**: B20 at full-screen scale, centered, 48px top margin from the header, full content-width minus margins.
- **Percentage list**: directly beneath, 24px gap, each row: color swatch (12px square, `radius-sm`-scaled) + genre name (`body-md`) + percentage (`stat-sm`, right-aligned) — 12px row height, 8px row gap.

## C13. Personality Evolution

- **Archetype headline**: `display-lg`, centered, 32px top margin.
- **Summary paragraph**: `body-lg`, max-width 560px, centered, 16px below headline.
- **Timeline**: horizontal scroll-snap row of past-state markers (48px circular thumbnails representing each archetype era + date label beneath) on desktop; converts to a vertical stacked list (Screen Architecture §13's explicit mobile rule) with each entry as a 64px-height row (thumbnail left, archetype name + date range right) on mobile.

## C14. Achievements

- **XP strip**: same B22 spec as C4's dashboard version, given full-width prominence here (72px height vs. the dashboard's compact 56px).
- **Badge grid**: 4 columns mobile / 6 tablet / 8 desktop, each cell = B21, 16px gap, category filter (B16 tabs) pinned above the grid.

## C15. Challenges

- **Active challenge card**: full-width, `elevation-1`, internal padding 20px, composition: challenge title (`h3`) + short description (`body-md`) + progress element (B2 inline or a simple B-style linear progress bar if the challenge metric isn't page-based) + static countdown text (`caption`, per A4's explicit no-animated-countdown rule) + join/progress CTA.
- **Max concurrent**: 2 cards visible before a "see more" reveals past/upcoming challenges in a collapsed list.

## C16. Notifications

Fully specified at B10 — no additional screen-level deltas.

## C17. Profile ("You")

- **Header block**: avatar (96px circle, `radius-full`) + name (`h2`) + username (`body-md`, 60% opacity) + Main Character Title (`h3`, `bookmark-500` colored, positioned directly beneath username) + bio (`body-md`, max 2 lines, "see more" expand) — mobile: centered column; desktop: left-aligned row (avatar left, text block right).
- **Entry-point list/grid**: mobile — vertical list, each row 64px (icon 24px + label `body-lg` + chevron); desktop — 2×3 card grid, each card 140px height, `elevation-1`, icon (32px) + label (`h4`) centered.

## C18. Settings

- **Grouped list**: section header (`label` token, uppercase) + rows beneath (56px height each, label left / control right — toggle, chevron, or value text), 24px gap between groups, danger-zone group visually separated by a 32px gap + a 1px divider above it (the one other hairline-divider use in the system, reserved for exactly this separation purpose).

## C19. Bookify Wrapped

- **Card canvas**: full-screen (100vh/100vw), one stat/statement per card, generated gradient background (per-card, derived from that period's dominant genre color — pulls from the same 8-color genre palette defined in B20).
- **Typography**: headline stat in `display-xl` (mobar down to `display-lg` if the string is long, e.g. a book title), centered both axes, supporting line in `body-lg` beneath at 60–70% of the headline's visual weight.
- **Number animation**: count-up on card entrance, `celebratory`-adjacent (800ms), easing that decelerates into the final value (no overshoot on the number itself — the *card* transition may use overshoot, the *number* should land precisely, since overshooting past the real stat and settling back would read as a bug, not delight).
- **Image placement** (book covers featured on relevant cards — favorite author/genre/book cards): cover positioned upper-third or lower-third of the frame (never dead-center, which would compete with the centered headline text), at ~35% of the card's height, with the same ambient-glow treatment as Book Detail (A3).
- **Sharing layout**: export crop is a fixed 9:16 canvas (Stories-native), all text/imagery kept within a safe zone inset 64px from every edge (accounts for platform UI overlays — profile bar top, reply field bottom — on the destination platform) — the visible-in-app card and the exported-share card are the same composition, just the share export enforces the safe-zone inset that the in-app version doesn't need to.
- **Breakpoint transform**: mobile is the native/primary experience; desktop renders the identical full-screen single-card-at-a-time sequence rather than a multi-card layout (Screen Architecture §19's explicit rule against fitting multiple cards on screen at once).

## C20–C22. Systemic States (Error / Empty / Offline)

Composition fully specified at B23 (empty/error template) and B24 (offline banner) — screen-by-screen application already mapped in the Screen Architecture doc's Systemic States table; no further per-screen visual deltas beyond inserting B23 into that screen's content area in place of its normal content.

---

# PART D — Closing Reference Sections

## D1. Component Inventory

B1 Book Card · B2 Progress Ring · B3 Buttons · B4 Inputs · B5 Chips · B6 Bottom Nav · B7 Left Rail · B8 Header · B9 Search · B10 Notifications Panel · B11 Bottom Sheet · B12 Modal · B13 Drawer · B14 Toast · B15 Dropdown · B16 Tabs · B17 Filters · B18 Chart · B19 Heatmap · B20 Spine/DNA Visualization · B21 Badge · B22 XP Bar · B23 Empty/Error Template · B24 Offline Banner. 24 components cover every screen in Part C with zero one-off, screen-specific UI elements — any new screen added later should be buildable from this inventory; if it isn't, that's a signal to add a 25th reusable component rather than a bespoke one.

## D2. Design Tokens Mapping

Every pixel value in Parts A–C traces to a token defined in the Design System (§13) or this document's Part A — spacing values are always one of the `--space-*` scale steps (never an arbitrary pixel value like "18px" invented mid-spec), radius values are always one of the six `--radius-*` tokens, colors are always one of the palette tokens (§3) or the 8-color genre-extension palette (B20, flagged as a separate content-ops deliverable). This mapping discipline is what keeps the system a *system* rather than a collection of per-screen decisions — any engineer implementing a new screen should be able to express every measurement as a token reference, not a raw number.

## D3. Responsive Rules (the four-breakpoint logic, stated once)

1. **Card-context components** (B1 Book Card, B21 Badge) hold a small number of fixed sizes tied to *density* (more/fewer visible at once), not fluid scaling — a book cover has a real-world reference size and shouldn't balloon on a wider screen.
2. **Layout/grid components** (Library grid, Discover mood panel, Dashboard's below-fold split) genuinely reflow structurally between breakpoints — column count, stacking order, and single-vs-multi-column composition all change, per each screen's C-section entry.
3. **Chrome components** (Header, Navigation) swap pattern entirely at the tablet/desktop boundary (B6 bottom-nav → B7 left-rail) rather than the same component fluidly resizing — mobile and desktop navigation are different components serving the same role, not one component with responsive CSS.
4. **Detail/content screens** (Book Detail, Profile) move from stacked single-column (mobile) to a fixed-proportion two-column split (desktop) at the point where content column width would otherwise exceed a comfortable reading measure (~700px) — the split isn't purely breakpoint-triggered, it's measure-triggered, which is why the exact pixel boundary is stated per-screen in Part C rather than globally.

## D4. Animation Library (consolidated from A4 + component-specific entries)

| Animation | Duration | Curve | Defined at |
|---|---|---|---|
| Button press | 80ms | ease-out | B3 |
| Card hover lift | 120ms | ease-out | A3/B1 |
| Chip select toggle | 120ms | ease-out | B5 |
| Route/modal/sheet transition | 200–250ms | ease-in-out / ease-out | A4, B11, B12, B13 |
| Progress ring/bar fill | 400–600ms | overshoot | B2, B22 |
| XP count-up | 400–600ms | overshoot | B22 |
| Save icon morph | 120–250ms | ease-out | B1 |
| Wrapped number count-up | 800ms | decelerate, no overshoot | C19 |
| DNA/Spine recompute morph | 700ms | ease-in-out, no overshoot | B20 |
| Achievement/archetype reveal | 600–800ms, sequenced | custom | A4, C13 |
| Tab underline move | 120ms (`fast`) | ease-out | B16 |
| Toast enter/exit | 120ms | ease-out | B14 |

## D5. UI Consistency Rules

1. Every screen has exactly one primary-weight (B3 primary) CTA visible at a time.
2. `amber-500` never appears outside gamification contexts (B22, achievement rewards) — enforced at the token-usage level, not just a style guideline.
3. Hover states exist only behind `@media (hover: hover)` — no phantom hover-triggered UI on touch devices.
4. Every list/grid uses `fast`-token instant-feeling transitions for reordering/filtering; only genuinely rare, meaningful state changes (ring fill, XP, badges, DNA morph, Wrapped) get `moderate`/`celebratory` treatment.
5. Any hairline divider use beyond the two explicitly spec'd exceptions (Search results list, Settings danger-zone separator) should be treated as a spec violation, not a minor styling choice — the system otherwise relies on spacing and elevation, not rules, to separate content.

## D6. Anti-Patterns (visual-implementation-specific, extending Design System §14)

- Implementing the Book Card cover as a fixed-square crop instead of true aspect ratio — breaks B1's core spec and the product's "beautiful, large book covers" mandate simultaneously.
- Using `box-shadow` glow on input focus instead of the specified border-color shift (B4) — a common default that reads as louder/more generic than this system's calm-interface intent.
- Animating heatmap cells on render (B19 explicitly forbids this) — a tempting default (staggered grid reveals are a common template pattern) that actively slows down a screen meant for fast pattern-scanning.
- Using the overshoot easing curve on the Wrapped number count-up (C19 explicitly specifies decelerate-only) — visually implies the number is "wrong" before settling, undermining trust in a screen whose entire point is presenting accurate, impressive stats.
- Building bespoke one-off components per screen instead of composing from the 24-item Part B inventory (D1) — the fastest way for this system to drift out of consistency within two sprints of engineering.

## D7. Developer Notes

- Every token in Part A/B should be implemented as actual CSS custom properties / a shared theme object (per the Design System §13 token file), never hardcoded per-component — this spec assumes that infrastructure exists before screen-level work begins.
- The B1 Book Card and B2 Progress Ring are the two highest-reuse components (appearing on effectively every screen in Part C) — build and stabilize these first; nearly every other screen's implementation is downstream of them.
- B20 (Spine/DNA Visualization) has a real content-ops dependency (the 8-color genre palette) that isn't fully resolved in this document — flag this explicitly as a blocking dependency for C4 (Dashboard identity teaser), C12 (Reading DNA), and C19 (Wrapped) before those screens can be considered complete, not just for C12 alone.
- `prefers-reduced-motion` handling (A4) should be implemented as a single global CSS media query scoping duration/curve custom properties, not as per-component conditional logic — keeps the reduced-motion behavior consistent and auditable in one place rather than re-implemented (and potentially missed) 24 times across the component library.

## D8. Pixel-Perfect Implementation Checklist

- [ ] All spacing values trace to a `--space-*` token (no arbitrary pixel values in component CSS)
- [ ] All radius values trace to a `--radius-*` token
- [ ] All colors trace to a palette token (§3 palette or the B20 genre-extension palette)
- [ ] Touch targets verified ≥44×44px on every interactive element, including icon-only buttons
- [ ] Focus-visible ring present and correctly offset on every interactive element
- [ ] Hover states scoped behind `@media (hover: hover)`, verified absent on touch
- [ ] `prefers-reduced-motion` verified against every `moderate`/`celebratory`-tier animation
- [ ] Book covers render at true aspect ratio at every breakpoint, never cropped/stretched
- [ ] `amber-500` usage audited — present only in B22/achievement contexts
- [ ] Heatmap (B19) renders without per-cell entrance animation
- [ ] Wrapped number count-up (C19) uses decelerate curve, not the overshoot token used elsewhere
- [ ] Bottom sheets (B11) support both drag-to-dismiss and an explicit close control
- [ ] All ARIA roles/labels from A5 present and verified with a screen reader pass, not just visually reviewed
- [ ] Safe-area insets applied on bottom nav (B6) and any full-bleed mobile sheet/toast
- [ ] Skeleton loading states implemented for every data-dependent component in Part B, matching final layout dimensions exactly (no layout shift on data arrival)
