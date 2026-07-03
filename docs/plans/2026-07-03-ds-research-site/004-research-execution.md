# 004 — Per-system research execution across the roster

Planned at `9c86ac02`. Depends on [001](001-roster-selection.md) (approved roster) and [002](002-schema-and-question-bank.md) (frozen schema + pilot). Read [README.md](README.md) Phase 0 first.

## Goal

Fill `ds/data/systems/<slug>/` for every tier-1 roster system to the citation standard, via maintainer-driven agent sessions. One system = one session (or a few) = **one PR**, reviewed by the maintainer. This is the long middle of the project; the playbook below keeps quality uniform across sessions run weeks apart.

## The playbook (per system)

1. **Recon** — locate all inspectable sources: docs site, public repo(s), npm packages, design blog posts / conference talks by the team, Figma community files, and the shipped product/site for CSS inspection. Record them in `system.json.sources`.
2. **Answer the question bank** — for each question in the `color-tokens` bank, in order:
   - Find the answer in the *most authoritative* source available (docs > source code > shipped CSS > secondary writing).
   - Record the structured answer per the question's shape, a one-line `summary`, and full `evidence` (URL, kind, retrieval date, minimal excerpt).
   - Unknown or not-applicable is a valid, honest answer — with a reason. Never infer silently; if you infer, mark `confidence: 'inferred'` and say from what.
3. **Reverse-engineering pass** (closed systems, or verification for open ones) — inspect shipped CSS: enumerate custom properties, map ramps/steps, sample computed colors, measure text/background contrast pairs. Follow 002's binding rules (dated observations, minimal excerpts, observed-not-official phrasing).
4. **Analysis MDX** — a readable per-system deep-dive of the color/token architecture: what's distinctive, what the numbers show, one or two genuinely interesting findings. Embed facts by `questionId`; never restate values by hand (they'd rot independently).
5. **Cross-check** — a second agent pass that attempts to *refute* each recorded fact against the cited source (adversarial verify). Facts that fail get fixed or downgraded to `inferred`/`unknown`.
6. **PR** — data + MDX + any question-bank clarifications (additive only). Maintainer reviews like any code PR; CI validates schema/evidence.

## Order of execution

Pilot systems (Radix, Linear) are done in 002. Suggested next order — alternate open and closed to keep both muscles exercised, and front-load the systems whose findings most inform `/create`'s color engine: Material 3 (HCT — richest algorithm), Spectrum 2 (Leonardo/contrast-targeted), Geist, Primer, shadcn/ui, then the rest of the approved roster.

## Publishing cadence

Per Phase-0 decision 10 (progressive launch): systems go live as they're merged once the site (003/005/006) is up. The roster grid shows `published` vs `planned` — visible momentum is a feature, not an embarrassment.

## Refresh discipline (v1 = manual, minimal)

No automation in v1 (deferred, Phase-0 decision 7). Two cheap habits instead:

- Every fact already has `verifiedAt`; the UI (006) surfaces staleness honestly.
- When touching a system for any reason, re-verify its most volatile facts (versions, package names, step counts) and bump dates.

## Done criteria (per system)

- 100% of the question bank answered / explicitly unknown-with-reason; CI green.
- Cross-check pass ran; no `verified` fact lacks a working citation.
- Analysis MDX exists and renders with embedded facts.
- Merged via a maintainer-reviewed PR.

## Roster progress

Note (2026-07-03): statuses below predate the same-day v2 data-model pivot (see the
README amendment); all three systems were migrated to the `colors.json` shape.

| System | Status |
|---|---|
| radix | DONE — plan-002 pilot (open method) |
| linear | DONE — plan-002 pilot (reverse-engineered) |
| spectrum-2 | DONE — 2026-07-03; researched via the v1 question bank (adversarial cross-check 11/11), then migrated to v2 structured data |

## Done criteria (plan)

- All approved tier-1 systems merged; status table in [README.md](README.md) updated with per-system checkmarks (add a roster-progress table to this file as systems land).

## STOP conditions

- If the frozen question bank/schema proves inadequate mid-roster (not just a missing question — a shape problem), STOP the fan-out and route back to 002 for a versioned schema change; don't fork per-system conventions.
- If a system turns out to be dramatically shallower than its 001 score suggested, STOP and ask the maintainer whether to demote it to the watchlist rather than padding thin facts to fill the bank.
