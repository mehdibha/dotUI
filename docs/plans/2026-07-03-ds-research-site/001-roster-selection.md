# 001 — Roster selection research

Planned at `9c86ac02`. Gates 002/004. Read [README.md](README.md) Phase 0 first.

## Goal

Decide **which 8–12 design systems get deep analysis** in v1, with documented criteria and scores — and make the selection itself publishable content ("how we chose what to study"). Quality over popularity is the founding editorial rule: the maintainer explicitly wants "a list of the design systems we should really follow, not shitty ones — popular doesn't mean good."

## Deliverables

1. `docs/research/2026-MM-DD-ds-roster-selection.md` — the research report: longlist, criteria, scores, shortlist, rejections with reasons. (Follows the existing `docs/research/` convention; it later becomes the site's "methodology / how we chose" page.)
2. A machine-readable roster: `ds/data/roster.json` (or, if 003 hasn't landed, park it next to the report and move it later) — `[{ slug, name, org, type, status: 'tier1' | 'watchlist' | 'rejected', sources: {...}, rationale }]`.

## Method

Run as maintainer-driven agent research sessions (Phase-0 decision 7). For each candidate, agents must actually open the docs/repo/shipped CSS — no scoring from memory or reputation.

### Longlist (start here, expand during research)

Confirmed maintainer interest: **Vercel Geist, Linear** (no public repo — inspect shipped CSS variables), **Adobe Spectrum 2, GitHub Primer, Material 3 (M3/HCT), Radix (Colors + Themes), shadcn/ui** (it has a real color system, not just a CLI — evaluate the thing itself, not the distribution model). Maintainer also named **"Astryx by Meta"** — ⚠️ unverified name; first task is to identify what Meta system this refers to (could be an internal DS; verify existence and inspectability before scoring; if it can't be confirmed, record that and drop it).

Additional candidates to score: IBM Carbon, Shopify Polaris, Atlassian Design System, Microsoft Fluent 2, Salesforce Lightning, Uber Base, Mantine, Chakra v3 / Park UI (Panda ecosystem), Hero UI, Once UI, Nord (Provet), Orbit (Kiwi), Ant Design, Arco, Tailwind (Catalyst + the Tailwind palette as a token system), Stripe (shipped-CSS inspection; no public DS), Airbnb DLS (likely uninspectable — verify), Untitled UI (maintainer: "check if it's slop; if so forget it"), Atlassian, GOV.UK Design System, USWDS. Also consider **pure token/color systems** that aren't full DSs but are canonical for the v1 dimension: Open Props, Tailwind colors, Radix Colors standalone, Adobe Leonardo.

### Scoring criteria (draft — refine in the report, then freeze)

Score each candidate 0–3 per criterion, **for the v1 dimension (color & tokens)** specifically:

- **Technical depth of the color/token system** — real architecture (layers, generation, contrast strategy) vs a flat palette.
- **Originality / lessons** — does studying it teach something the others don't? (e.g. M3's HCT, Spectrum's Leonardo-based contrast targets, Radix's 12-step scale semantics.)
- **Inspectability** — public repo > public docs > shipped CSS only > closed. Closed + shallow = drop; closed + excellent (Linear, Stripe) = keep, tagged `reverse-engineered`.
- **Documentation quality** — can facts be cited to stable URLs?
- **Influence on the field** — tiebreaker only, never the lead criterion.

### Entity typing (from Phase 0 — typed entities, correctly classified)

Assign each entry a `type` (`corporate-design-system` / `component-library` / `primitives-library` / `token-or-color-system` / `figma-kit`) and optional `upstream` links (shadcn→Radix/Base UI, Park→Ark/Panda, dotUI→React Aria). Get the classification *right* — the maintainer flagged that lazy typing (e.g. "Radix = just primitives", "shadcn = just a CLI") is exactly the error to avoid. Comparisons on the site will only span comparable types.

## Steps

1. Verify/resolve the "Astryx by Meta" reference (web research; check Meta's public design resources).
2. Fan out agent research: one pass per longlist candidate producing a filled scorecard with evidence links.
3. Score, rank, cut to 8–12 tier-1 + a watchlist. Write rejections down (binding for future roster debates, like audit rejected-findings).
4. Maintainer sign-off on the final roster (this is a product decision — do not proceed to 004 without it).
5. Write the report + `roster.json`.

## Done criteria

- Report exists in `docs/research/` with per-candidate scorecards and evidence links (no candidate scored without opened sources).
- `roster.json` validates against the shape above; 8–12 `tier1` entries; every rejection has a reason.
- Maintainer has explicitly approved the tier-1 list.

## STOP conditions

- If scoring produces >12 strong tier-1 candidates, STOP and present the tradeoff to the maintainer rather than silently widening v1.
- If a maintainer-named system (Linear, "Astryx") turns out to be effectively uninspectable even via shipped CSS, STOP and report before dropping it.
