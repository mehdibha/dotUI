# /studio — experience spec (draft 2)

> **Superseded in part (Oct 2026).** The panel's structure lives in the code
> (`www/src/modules/studio/`: `chapters.ts` lists the chapters,
> `sections/components.tsx` the components) and in CLAUDE.md's /studio panel
> entry. The feeling, sessions, non-negotiables and tests below still stand;
> the taxonomy and layout sections are history, corrected where they
> contradicted the code.

What building a design system on dotui.org/studio should feel like. Layout
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

**Decided (Aug 2026): first touch and deep build carry equal weight.** /studio
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
   refinements get compactness and findability. Presenting every axis as an
   equal is the root cause of "too much".
5. **Reversible everywhere.** One global reset; no dead ends. (Per-chapter
   reset buttons: rejected.)
6. **Live, always.** Every control applies instantly; nothing blocks on
   network.

## Decision weight — Identity vs Refinements

**Identity (Aug 2026):** Color · Typography · Shape · Space · Surfaces ·
Buttons · Inputs · Focus define ~90% of how a system reads. They deserve the
richest treatment and come first — a user who only ever touches these should
still leave with a coherent, personal system. The original 36 "refinement"
chapters are gone: the panel is Foundations, then one row per component in
the component chapters (see Taxonomy revision).

**The inheritance rule that makes this work:** refinements inherit from
identity (menus inherit Surfaces + Shape; checkbox inherits the accent; every
control inherits Focus). A component row is where you *override* an
inherited default — an exception, not a required stop. Most users should never
open most component pages, and the UI should quietly say "this is already
fine unless you care."

## What each session needs from the panel

- **First touch** → the identity set, big and delightful; refinements out of
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

1. **First touch is visually prioritized, not guided.** Identity comes first
   and gets richer treatment; no wizard. A guided layer can sit on top of
   whichever layout wins, later.
2. **Space stays in the identity set.** Density is a fast way to tell systems
   apart; everyone should make that decision.

## Layout verdict (Aug 2026)

**Drill-in wins** over the structured scroll and the accordion stacks, with
Mehdi's modifications:

- The index shows **Foundations, then the component chapters** (Actions,
  Forms, Overlays, Navigation, Data display, Feedback) — a **Templates**
  section is planned (user-picked blocks). Identity emphasis survives as
  ordering, not extra chrome.
- Index rows are one line (Sept 2026): **label, then its muted value** on the
  left — only where the micro-preview can't carry it (identity, page chrome,
  component states) — and a **small state-driven micro-preview** on the right.
  Previews render only where a ~16px specimen is honest (real brand color,
  real font, real fill); chapters without one show nothing.
- Chapter pages have no hero (Sept 2026) — the canvas and the micro-preview
  carry the visual load; the page is controls only.

Structured scroll (variant A) and the stacks served as comparison references;
the drill-in won and they have been deleted from the studio module.

## Taxonomy revision (Aug 2026, four-lens panel)

A four-agent panel (convention, user-task, code-measured, minimalist lenses)
reviewed the 43-chapter list. Unanimous findings: per-component chapters were
inventory, not taxonomy — the panel's unit is the *decision* (radio and switch
contribute zero unique axes; their only key is checkbox's `checkFill`); Color
is never split; thinness alone is never grounds for a merge (named chapters
like Tooltips stay findable); merged cards must SHOW their absorbed members
and future search must index absorbed names.

**Adopted (Oct 2026):** after Foundations, six component chapters (Actions,
Forms, Overlays, Navigation, Data display, Feedback) list **one row per
component** (`sections/components.tsx`). A component with one row renders it
directly; one with several rows opens a drill-in page of them. Related
components share a row and are found by alias (Button answers to Toggle
button and Button group). Alert and Toast have rows like every other
component. Per-control colors (checkbox, switch, slider, tabs, links…) are
leaves of Color › Primary, each also a row on its component's page.

## Open questions

*(none currently)*
