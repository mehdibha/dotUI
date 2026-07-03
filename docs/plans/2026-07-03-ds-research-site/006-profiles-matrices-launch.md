# 006 — System profiles, generated matrices, research→create pipeline, launch

Planned at `9c86ac02`. Depends on [003](003-app-scaffold.md), [005](005-topic-showpieces.md), and ≥3 systems from [004](004-research-execution.md). Read [README.md](README.md) Phase 0 first.

## Goal

The second entry point (per Phase-0 decision 3: topics AND profiles co-equal from day one), the generated comparison views, the pipeline that makes findings change `/create`, and the actual go-live.

## Profiles (`/systems/$slug`)

One rich page per system, entirely rendered from the data layer:

- Header: name, org, entity type, upstream links ("builds on React Aria"), sources, overall `verifiedAt` freshness.
- The system's answers to every question in the bank, grouped by cluster — each fact with its citation popover, method badge (`documented`/`source-read`/`reverse-engineered`), and date. Reverse-engineered profiles (Linear) open with the observed-not-official disclosure.
- The `analysis.mdx` deep-dive inline.
- Its palette rendered live (`PaletteRamp` from 005).
- Cross-links into every topic page that features it.

## Matrices (`/compare`, and embedded per-topic)

Generated from `matrixable` questions — never hand-maintained (Phase-0 decision 3). Filter by entity type so comparisons stay apples-to-apples (typed-entities decision). Cells link to evidence. An empty/sparse column (system not yet researched) renders as "planned", not blank — progressive-launch honesty.

## Research→create pipeline (Phase-0 decision 11)

- Every topic page's "Implications for builders" section is neutral and public (no dotUI pitch — decision 1's direction-of-truth).
- For each implication that `/create` should act on: file a GitHub issue on `mehdibha/dotUI`, label **`research-finding`** (create the label), title as an axis/behavior proposal, body links the topic page + specific facts. Per CLAUDE.md, these are proposals awaiting maintainer approval — the pipeline feeds product decisions, it doesn't make them.
- Add a short section to the site's `/methodology` page explaining this pipeline publicly (it's part of the credibility story).

## Launch checklist

1. **Open data**: license the `ds/data/` content clearly (data/prose CC BY 4.0, code stays MIT — confirm with maintainer at PR time); a `/data` page or README section explains how to consume the JSON and how to submit corrections (PRs welcome).
2. **SEO/meta**: per-page titles/descriptions/OG images (static generation fine for v1), sitemap, canonical URLs on ds.dotui.org. The matrices and topic pages are the linkable assets — make their URLs stable and their headings anchor-linkable.
3. **Freshness UI**: site-wide "last verified" surfacing; a `/changelog` (or just the GitHub history link) showing the data is alive.
4. **Cross-site**: one quiet link from www's footer/nav to ds.dotui.org and back — no aggressive funnel (decision on funnel direction).
5. **Go-live gate**: schema frozen, ≥3 systems published to citation standard, topic pages 1–3 live, profiles live, methodology page live, lighthouse/a11y sanity pass (the site dogfoods an accessibility-first registry — it should ace this), maintainer sign-off, announce.

## Done criteria

- Profiles + `/compare` render fully from the index for every published system; zero hand-duplicated facts anywhere in the app.
- `research-finding` label exists with ≥1 real issue filed through the pipeline end-to-end.
- Launch checklist items all checked; ds.dotui.org public and announced.

## STOP conditions

- Do not launch with any `verified`-marked fact lacking a working citation — run a link-check over all evidence URLs as part of the gate; downgrade or fix failures first.
- If licensing questions arise beyond the simple CC-BY/MIT split (e.g. quoting limits for reverse-engineered material), STOP and resolve with the maintainer before publishing the affected pages.
