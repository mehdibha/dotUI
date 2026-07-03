# ds.dotui.org — design-systems research site

Feature-design plan (not an audit; follows the folder/index/`NNN-slug.md` convention). Planned at `9c86ac02`, decisions resolved with the maintainer on 2026-07-03 in a structured Q&A session.

**What this is:** a new site at **ds.dotui.org** (header wordmark: **"ds."**) — a rigorous, citation-backed research property about how the best design systems actually work, starting with the deepest possible treatment of **color & token systems** across a curated roster of ~8–12 genuinely excellent systems (Geist, Linear, Spectrum 2, Primer, Material 3, Radix, shadcn/ui, …). Every fact is cited and dated. The site is the upstream truth; **dotui.org/create follows the research, never the reverse**.

Start from this index, never from an individual plan. Read the whole plan you pick up, honor its STOP conditions, and update its status row here when done.

## Phase 0 — product decisions (RESOLVED 2026-07-03)

All resolved with the maintainer; these are binding for every plan in this folder.

1. **Purpose — the full flywheel, with a fixed direction of truth.** The research feeds the builder (cataloging real systems reveals which axes `/create` is missing), publishing it earns authority, authority feeds the product. But causality is one-way: **research findings drive `/create`; `/create`'s needs never bend the published research.** If the research disagrees with how `/create` does something today, the research publishes the disagreement and `/create` gets an issue to follow it.
2. **Scope of v1 — narrow & deep, one dimension.** V1 covers **color & token systems only** — palette structure, generation algorithm, base palettes, semantic vs component tokens, what exactly is tokenized (colors only? spacing? …), contrast guarantees, plus adjacent color-mechanics like focus-highlight construction. Focus rings in full, density, typography, component variants etc. become v1.1+, reusing the same schema/machinery. Roster: **8–12 systems**, selected by [001](001-roster-selection.md) — quality over popularity ("popular doesn't mean good").
3. **Content shape — topics AND profiles from day one, over one dataset.** Two co-equal entry points: **topic deep-dives** ("how 10 systems generate color", "semantic vs component tokens: who does what") and **system profiles** (the Geist page, the Linear page). Both are views over the same structured fact data; comparison matrices are generated, never hand-maintained.
4. **Truth standard — every fact cited + dated.** Each data point carries evidence (source URL / repo file / shipped-CSS observation), a retrieval date, and a method tag (`documented` / `source-read` / `reverse-engineered`). Reverse-engineered facts (e.g. Linear's CSS variables read from the shipped site) are first-class but always labeled as observed-not-official. This is the moat.
5. **Editorial line — describe, don't rank; fun awards allowed.** No leaderboards or scored verdicts. Occasional light-hearted awards (e.g. "most obsessive focus ring") are fine; they must still be evidence-backed.
6. **Data — hybrid, git-source, zero new paid services.** Structured facts as schema-validated JSON + MDX analysis in the repo (open data); a build step compiles them into a static index the site queries. Vercel is the only paid service; no database.
7. **Ops — maintainer-driven agent sessions.** The maintainer kicks off Claude Code research sessions per system; agents produce schema-valid facts + citations; every merge is a reviewed PR. Scheduled autonomous re-verification is deferred until the dataset and schema are stable (explicitly phase-2).
8. **Tech — new TanStack Start app `ds/` in this monorepo,** own Vercel project on ds.dotui.org. Same stack as `www` (TanStack Start, Tailwind v4). The site **dogfoods dotUI**: its UI is installed from the dotUI registry via the shadcn CLI, exactly as a user would; installation problems found along the way get fixed as product bugs (maintainer: "if you find issues installing, you can fix them").
9. **Interactivity — interactive-first showpieces.** Topic pages are explorable: live palette ramps per system, "same seed color through each system's algorithm", contrast-guarantee checkers — powered by `@dotui/colors` plus each system's own open algorithm packages where they exist (`@material/material-color-utilities`, Adobe Leonardo, Radix scales…). Guardrails in [005](005-topic-showpieces.md) keep any single page from eating a month.
10. **Launch — progressive + open data.** Publish when the schema is stable and ~3 systems meet the citation bar; grow in the open ("12 planned, 3 published"). Data/content openly licensed; corrections arrive as PRs.
11. **Research→create pipeline — implications → GitHub issues.** Every topic page ends with a neutral "implications for builders" section; each finding `/create` should adopt becomes a GitHub issue on `mehdibha/dotUI` labeled `research-finding`, linking the evidence. Traceable: page → issue → axis.
12. **Name & voice — "ds." on ds.dotui.org.** Plain disclosure in the footer: built by dotUI; the builder follows this research, not the reverse. Voice: rigorous, human, cited; occasional fun.

### Amendment — 2026-07-03 (maintainer, post-pilot)

After the first fan-out system shipped, the maintainer scrapped the question-bank/facts
content shape (part of decisions 3–4): prose fact-blocks are a bad way to explore a color
system. Superseding decisions:

- **Profiles are exploration pages** built from structured color-system data per system
  (`colors.json`: ramps, token groups, layers, focus, contrast, overview) rendered by
  shared visual components — swatch ramp grids, searchable token tables, diagrams. Topic
  pages (views over the question bank) were removed with the bank; cross-system topic
  pages will be rebuilt later over the same structured data.
- **Dating model**: per-evidence `retrievedAt` is gone; each system carries
  `createdAt` / `updatedAt` / `reviewedAt`. Sources survive as plain URL lists attached
  to every section — the citation standard (decision 4) otherwise stands.

Migration note in `ds/data/RETRO.md`.

### Amendment — 2026-07-03 (maintainer, reordering)

Plans 004–006 are superseded in their ordering: the site design, system pages, playgrounds,
and interactive widgets get built **first** (against the pilot systems' data), the data shape
freezes from what those pages need, and only then does the research fan-out (004) run.
`ds/README.md` is now the project's front door and states the order of work; this folder is
planning history.

## Execution order

```
001 roster selection ──►  002 schema + question bank (pilot: 2 systems) ──►  004 research execution (roster fan-out)
                                        │                                            │
                    003 app scaffold ───┴──────────►  005 topic showpieces  ◄────────┤
                    (parallel with 002)                                              │
                                                      006 profiles + matrices + launch
```

- [001](001-roster-selection.md) gates everything: it decides *what* we study and produces the first publishable artifact ("how we chose").
- [002](002-schema-and-question-bank.md) is the intellectual core — the fact schema and the canonical question bank. It pilots on 2 systems (one documented, one reverse-engineered) so schema churn happens before the fan-out, not after.
- [003](003-app-scaffold.md) is independent of 001/002 (needs only the schema's rough shape) and can run in parallel.
- [004](004-research-execution.md) fans out across the roster once the pilot has frozen the schema. One PR per system.
- [005](005-topic-showpieces.md) needs ≥3 systems' facts to be worth building against real data.
- [006](006-profiles-matrices-launch.md) is the launch gate: profiles, generated matrices, implications→issues pipeline, licensing, SEO, go-live.

## Status

| Plan | Title | Status |
|---|---|---|
| 000 | Phase 0 product decisions | DONE — resolved 2026-07-03 (grill session; 12 decisions above) |
| [001](001-roster-selection.md) | Roster selection research | DONE — 2026-07-03; ~30 candidates recon'd by 8 parallel agent sessions, report + `roster.json` in [docs/research/2026-07-03-ds-roster-selection/](../../research/2026-07-03-ds-roster-selection/README.md). Maintainer-approved tier-1 = **15 systems** (approved deviation from the 8–12 cap; STOP condition honored — tradeoff was presented): Spectrum 2 (+Leonardo), Material 3, Radix, USWDS, Ant Design, Fluent 2, Polaris, Primer, Astryx (Meta — verified real, June 2026), Linear (RE), Stripe (RE), Carbon, Geist, shadcn/ui, Tailwind palette. 8 watchlist, 8 rejected with reasons (binding). |
| [002](002-schema-and-question-bank.md) | Fact schema + canonical question bank + 2-system pilot | DONE — 2026-07-03; schema + 10-question `color-tokens` bank v1 frozen (`ds/src/data/schema.ts`, `ds/src/data/question-bank.ts`), both pilots 10/10 answered with cited evidence, validation green via `pnpm --filter=ds check:data`. Pilot data in `ds/data/systems/{radix,linear}/`. See [ds/data/RETRO.md](../../../ds/data/RETRO.md) for the freeze + flagged maintainer decisions (Linear contrast unknowns, marketing-site scoping). |
| [003](003-app-scaffold.md) | `ds/` app scaffold, Vercel project, dogfooded UI, data build pipeline | DONE — 2026-07-03; `ds/` TanStack Start app live on [ds.dotui.org](https://ds.dotui.org) (Vercel project `dotui-ds`, rootDirectory `ds`, git-linked). Routes `/`, `/systems/$slug`, `/topics/$slug`, `/methodology` prerendered (27 pages); data pipeline (zod validation → static index) proven end-to-end with 002's pilot data rendering citations + verified-dates on the profile shells. Dogfood found 13 registry/publisher bugs — 5 fixed in-branch, rest logged in [ds/DOGFOOD.md](../../../ds/DOGFOOD.md) (table/checkbox/field left out: field-family publisher bug, STOP honored). |
| [004](004-research-execution.md) | Per-system research execution across the roster | TODO |
| [005](005-topic-showpieces.md) | Topic deep-dive pages + interactive widget kit | TODO |
| [006](006-profiles-matrices-launch.md) | Profiles, generated matrices, research→create pipeline, launch | TODO |

## Architecture in one paragraph

A second TanStack Start app, `ds/`, sibling of `www/` in the pnpm workspace, deployed as its own Vercel project on ds.dotui.org. Its source of truth is `ds/data/`: one directory per rostered system holding schema-validated `facts` JSON (zod-checked in CI) plus MDX analysis, and a shared `question-bank` that defines the canonical research questions for each dimension. A build step compiles all facts into a static, client-queryable index — topic pages, system profiles, and comparison matrices are all views over that one index, so nothing is hand-duplicated and every rendered fact carries its citation + verified-date from the data layer. The site's own components are installed from the dotUI registry via the shadcn CLI (dogfooding); interactive showpieces implement each system's color algorithm behind one common `PaletteAlgorithm` interface (own engine `@dotui/colors`, plus published packages like material-color-utilities and Leonardo, plus static scales like Radix). No database, no new services.

## Rejected / deferred (binding until revisited)

- **Wide-and-shallow catalog (60–100+ systems)** — rejected for v1. Quality-curated roster instead; count is not the product.
- **Rankings/leaderboards** — rejected. Describe, don't rank (fun awards excepted).
- **Untitled UI on the roster by default** — not assumed; 001 evaluates it on merit ("check if it's slop; if so, forget it").
- **Scheduled autonomous refresh agents** — deferred to phase 2, after schema stability. Do not build refresh automation in v1.
- **Real database / CMS / any new paid service** — rejected. Git + build-time index only.
- **dotUI-axis-shaped schema** — rejected; the taxonomy is independent. A `/create`-mapping layer may exist later, but the descriptive schema never bends to the builder's vocabulary.
- **Hard product funnel (recreate-in-dotUI CTAs, per-system dotUI themes)** — rejected for v1; the flow is research→product, not product-marketing→reader.
