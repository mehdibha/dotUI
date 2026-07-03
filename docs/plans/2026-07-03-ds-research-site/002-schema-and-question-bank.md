# 002 — Fact schema, question bank, and 2-system pilot

Planned at `9c86ac02`. Depends on [001](001-roster-selection.md) (roster + entity types). Gates [004](004-research-execution.md). Read [README.md](README.md) Phase 0 first.

## Goal

Design the data model that everything else is a view over, and **stabilize it against two real systems before fanning out**. Schema churn after 10 systems are researched means 10 rewrites; churn after 2 is cheap. The schema is the product — topic pages, profiles, and matrices are all renderers over it.

## Core ideas (binding)

1. **The question bank IS the taxonomy.** A canonical, versioned list of research questions per dimension. V1 ships only the `color-tokens` dimension. Topic pages = one question (or cluster) across systems; profiles = one system across questions; matrices = generated from structured answers. Adding a dimension later (focus, density, typography…) = adding questions, not reshaping the schema.
2. **Independent taxonomy** (Phase-0 decision): questions are phrased as a neutral researcher would, never in dotUI-builder vocabulary.
3. **Every fact carries evidence** (Phase-0 decision 4): source URL(s), retrieval date, method (`documented` / `source-read` / `reverse-engineered`), and a `verifiedAt` date. A fact without evidence fails CI.
4. **Structured answers where comparison needs them, prose where nuance needs it.** Each question declares an answer shape (enum / number / structured object / free-form). Matrices only render questions with structured shapes.

## Question bank v1 — `color-tokens` (draft; finalize during pilot)

The maintainer's own questions, made canonical (IDs are permanent once published):

- `palette.structure` — Base palettes? How many ramps, steps per ramp, step semantics (Radix-style 1–12 with defined roles? Tailwind 50–950? custom)?
- `palette.generation` — How are colors generated? Algorithm (HCT, Leonardo/contrast-targeted, OKLCH interpolation, hand-picked), inputs (seed/brand color? lightness curve?), open-source implementation?
- `palette.colorspace` — Working color space(s) and output formats (OKLCH, HCT, LAB, sRGB hex; P3 support?).
- `contrast.strategy` — Contrast guarantees: enforced by construction (per-step targets), checked in tooling, or convention only? WCAG 2.x vs APCA? Guaranteed pairings (text-on-bg tokens)?
- `tokens.layers` — Token architecture: primitive → semantic → component layers? Which layers exist, what are they called, examples of each?
- `tokens.scope` — What is tokenized beyond color: spacing, radius, typography, elevation, motion, breakpoints…? (Structured checklist.)
- `tokens.naming` — Naming convention and grammar (`--color-bg-accent-emphasis` style analysis), theming mechanism (CSS vars? build-time? data attributes?).
- `modes.support` — Light/dark/HC modes: separate palettes, transformed palettes, or same tokens re-pointed? System sync?
- `focus.construction` — How the focus highlight is built (outline vs ring vs shadow, offset, color source token, :focus-visible discipline). Included in v1 as maintainer-requested color-adjacent mechanics.
- `component.color-usage` — spot-check: how a Button consumes the system (which token layer does it touch, how many color variants exist).

## Schema sketch (implement as zod in `ds/src/data/schema.ts`, TS types inferred)

```
system.json    { slug, name, org, type, upstream[], sources{docs,repo,figma,site}, status, addedAt }
facts.json     [{ questionId, answer: <shape per question>, summary: string,
                  evidence: [{ url, kind: 'docs'|'source'|'shipped-css'|'changelog'|'talk',
                               retrievedAt, excerpt?, note? }],
                  method, verifiedAt, confidence: 'verified'|'inferred', notes? }]
analysis/*.mdx prose deep-dive per system, may embed facts by questionId (never restate values by hand)
question-bank.ts  [{ id, dimension, prompt, answerShape (zod), matrixable: boolean, rationale }]
```

Location: `ds/data/systems/<slug>/` + `ds/src/data/` for schema/bank. If 003 hasn't landed yet, develop under `docs/research/ds-pilot/` and move.

## The pilot (the actual work of this plan)

Research **two systems end-to-end** through every question, chosen to stress opposite methods:

- **Radix (Colors + Themes)** — fully open: docs + source citations, tests `documented`/`source-read` flows.
- **Linear** — closed: shipped-CSS inspection only, tests the `reverse-engineered` flow (CSS variable extraction from the live site, dated observations, minimal excerpts).

For each: fill `facts.json` completely, write a short `analysis.mdx`, and note every place the schema fought you. Then revise the question bank/schema **once**, and freeze v1 (additive changes allowed after; breaking changes need a migration note).

## Reverse-engineering rules (binding for 004 too)

- Facts from shipped CSS are observations: record retrieval date and page inspected; phrase as "as shipped on linear.app, 2026-07-XX", never as official documentation.
- Quote minimal excerpts (variable names, values) — never republish whole files or embed proprietary assets.
- Prefer corroboration (blog posts, talks by the system's team) when it exists; cite both.

## Done criteria

- `question-bank` v1 frozen with ≥10 questions, each with an answer shape and matrixable flag.
- zod schema validates both pilot systems' data in CI (`pnpm --filter=ds check:data` or equivalent vitest).
- Both pilot systems: 100% of questions answered or explicitly marked `not-applicable`/`unknown` with a reason; every fact has evidence + dates.
- A short schema-retro note appended to this plan (what churned during the pilot).

## STOP conditions

- If the pilot shows a question can't be answered for a closed system even via CSS inspection, STOP and decide with the maintainer: mark `unknown` (honest) vs drop the question — don't guess.
- If answer shapes turn out to need per-system special-casing (schema fighting reality), STOP and redesign before fan-out; do not bolt on `anyOf` escape hatches.
