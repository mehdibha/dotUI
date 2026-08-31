# /create — experience spec (draft 2)

What building a design system on dotui.org/create should feel like. Layout
candidates are judged against this page, not against taste. Draft — correct it;
every wrong line here is cheaper than a wrong prototype.

## The feeling

Working with a sharp design consultant, not filling in a tax form. You make a
decision, the whole system responds instantly, and you always know what you've
decided so far. Calm comes from hierarchy and legible state — never from
hiding capability.

## The three sessions

| Session | Duration | Job | Success looks like |
| --- | --- | --- | --- |
| **First touch** | 2–10 min | "Make it mine" — brand color, font, radius, watch everything respond | A moment of delight inside 2 minutes; leaves with something that looks theirs |
| **Deep build** | 1–4 h+ | Recreate a target look (their brand, a Linear-like system) with precision | Never wonders "can it do X?"; finds any axis in seconds; ends in export |
| **Return visit** | 2–5 min | Change one thing, re-export | Cold-start find → change → out, under a minute |

**Decided (Aug 2026): first touch and deep build carry equal weight.** /create
is both the marketing demo and the working tool, and a candidate that
sacrifices either loses. Practically: the identity layer must delight a
2-minute visitor, the structure must not cap the hours-long build, and the
prototypes must be tested against both. Return visit is never allowed to break
(search/jump + legible state).

## Non-negotiables

1. **The canvas is the hero.** The preview next to the panel shows the system;
   the panel never duplicates that job. A chapter in the panel needs identity
   (name), state (current values), and controls — a full specimen stage inside
   a 360px column is compensation for a missing canvas, not a feature.
2. **Never lost.** At any moment the user can answer *where am I, what exists,
   how do I get back* without thinking. Navigation depth ≤ 2. Search/jump
   reaches any chapter from anywhere.
3. **State always legible.** Modified-ness and current values readable without
   opening anything. (The summary line earned this; it stays in every
   candidate.)
4. **Not all axes are equal.** Identity decisions get prominence and richness;
   refinements get compactness and findability. Presenting 44 chapters as
   equals is the root cause of "too much".
5. **Reversible everywhere.** One global reset; no dead ends. (Per-chapter
   reset buttons: rejected.)
6. **Live, always.** Every control applies instantly; nothing blocks on
   network.

## Decision weight — Identity vs Refinements

**Identity (8):** Color · Typography · Shape · Space · Surfaces · Buttons ·
Inputs · Focus. These define ~90% of how a system reads. They deserve the
richest treatment and come first — a user who only ever touches these eight
should still leave with a coherent, personal system.

**Refinements (36):** everything else, grouped by family:

- *Foundations:* Icons · Motion · Cursor · Selection · Scrollbars · Disabled · Links
- *Actions:* Button groups · Toggles · Segmented control · Kbd
- *Forms:* Switch · Checkbox · Radio · Choice cards · Input groups · Number field · OTP field · Pickers · Calendar · Sliders
- *Overlays:* Menus · Dialogs · Popovers · Tooltips
- *Navigation:* Tabs · Breadcrumbs · Pagination
- *Feedback:* Notices · Skeleton · Spinner · Progress
- *Display:* Badges · Avatars · Tables · Accordion

**The inheritance rule that makes this work:** refinements inherit from
identity (menus inherit Surfaces + Shape; checkbox inherits the accent; every
control inherits Focus). A refinement chapter is where you *override* an
inherited default — an exception, not a required stop. Most users should never
open most refinement chapters, and the UI should quietly say "this is already
fine unless you care."

## What each session needs from the panel

- **First touch** → the identity eight, big and delightful; refinements out of
  the way.
- **Deep build** → full coverage, fast jumping, per-family grouping, state
  audit ("what have I changed?").
- **Return visit** → search first; legible summaries so the answer is often
  read, not opened.

## The test (any candidate must pass)

1. **Linear test** — recreate Linear's feel (color, font, radius, buttons):
   under 5 minutes, identity chapters only.
2. **Tooltip test** — cold start, find and change the tooltip look: under 10
   seconds to locate.
3. **Audit test** — "tell me everything you've modified": answerable in under
   10 seconds without opening chapters.
4. **Lostness watch** — a first-time user runs tasks 1–3 while you only
   observe: every stall, backtrack, or scroll-hunt is a defect. Two or three
   observers find most problems.

## Rejected so far (with why)

- **Per-chapter reset** — noise ×44; one global reset + modified dots carries it.
- **Chapter card with heading chrome** — the heading repeated what the row
  already said.
- **Prose captions in control groups** — annotation is noise; controls must be
  self-evident.
- **Popover as chapter editor** — expected fail (covers the panel, needs
  nested popovers, dies on scroll); cheap to confirm as a variant of the
  drill-in chapter page if we want the evidence.

## Decided (Aug 2026)

1. **First touch and deep build are equal.** Neither may be sacrificed for the
   other; candidates are tested against both.
2. **First touch is visually prioritized, not guided.** Identity comes first
   and gets richer treatment; no wizard. A guided layer can sit on top of
   whichever layout wins, later.
3. **Space stays in the Identity 8.** Density is a fast way to tell systems
   apart; everyone should make that decision.

## Layout verdict (Aug 2026)

**Drill-in wins** over the structured scroll and the accordion stacks, with
Mehdi's modifications:

- The index shows exactly **two sections — Foundations, then Components** — a
  **Templates** section is planned (user-picked blocks). Identity emphasis
  survives as ordering, not extra chrome.
- Index rows are roomy and two-line: **label over its muted value** on the
  left, a **small state-driven micro-preview** and the chevron on the right.
  Previews render only where a ~16px specimen is honest (real brand color,
  real font, real fill); chapters without one show nothing.
- The chapter page keeps the full hero — in the panel index the canvas (and
  the micro-preview) carry the visual load.

Structured scroll (variant A) and the stacks served as comparison references;
the drill-in won and they have been deleted from panel-lab.

## Taxonomy revision (Aug 2026, four-lens panel)

A four-agent panel (convention, user-task, code-measured, minimalist lenses)
reviewed the 43-chapter list. Unanimous findings: per-component chapters were
inventory, not taxonomy — the panel's unit is the *decision* (radio and switch
contribute zero unique axes; their only key is checkbox's `checkFill`); Color
is never split; thinness alone is never grounds for a merge (named chapters
like Tooltips stay findable); merged cards must SHOW their absorbed members
and future search must index absorbed names.

**Adopted (Mehdi):** 43 → 35 chapters via composite index chapters
(`groups.ts` COMPOSITES): **Interaction** ← cursor + selection +
scrollbars + disabled (new, hostless); **Buttons** ← button-groups + toggles +
segmented-control; **Inputs** ← input-groups + number-field + otp-field;
**Links** moved to Components (overriding the panel's Typography-merge
recommendation).

**Panel-recommended, not yet adopted:** Selection controls ← switch + checkbox
+ radio (+ choice cards); Pickers ← calendar; Loading ← skeleton + spinner +
progress; Badges ← kbd; rename Notices → "Alerts & toasts".

Answered: Accordion stays solo — accordion and menus share zero state keys or
recipes; there is no Disclosure family in the code.

## Open questions

*(none currently)*
