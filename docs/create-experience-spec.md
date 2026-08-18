# /create — experience spec (draft 1)

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

**Deep build is the paying job. First touch is the funnel.** Design the
structure for deep build, make the identity layer delightful for first touch,
and never let either break the return visit (search/jump + legible state).

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

## Open questions (for Mehdi)

1. Is deep build really primary — or is first touch, since /create is also the
   marketing demo?
2. Should first touch be *guided* (an ordered walk through the identity eight)
   or just visually prioritized?
3. Does "Space" belong in identity, or is density a refinement?
4. Accordion sits in Display for now — worth a Disclosure family with Menus?
