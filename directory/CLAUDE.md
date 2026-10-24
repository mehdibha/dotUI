# directory: ds.dotui.org

A public directory of design systems, as structured per-system data
(`systems/<slug>/system.json` plus `colors.json` and `components.json`)
rendered by shared sections. TanStack Start + Vite. The Zod schemas in
`src/data/schema.ts` take additive changes only. `data/catalog.json` is the
scored catalog. This repo's shadcn `colors.json` is also the pinned-SHA ground
truth dotUI uses to verify its color axis.

## Data pipeline (the rules)

Data comes from machine-readable sources through extraction scripts — never
from a person or agent typing values. The pipeline has two stages:

1. **Snapshot** — `pnpm snapshot <slug>` captures the raw source into
   `sources/<slug>/` with a `manifest.json` (source URL, pinned ref,
   retrievedAt, sha256 per file). Open-source systems: vendor the relevant
   files at a pinned git SHA or npm version. Live-website systems: fetch the
   deployed stylesheets (or computed custom properties via headless browser —
   themes/dark mode often need a rendered page) and commit the raw CSS.
2. **Extract** — `pnpm extract <slug>` parses ONLY the committed snapshot into
   `systems/<slug>/colors.json`. Never parse the live network; extraction must
   be reproducible offline and byte-deterministic (stable ordering, no
   timestamps).

Hard rules:

- Committed data files are build artifacts: never hand-authored, never
  hand-edited. Wrong value = fix the extractor and re-run. Agents may write
  and fix extractors; they must never edit emitted data files.
- Every data file carries `provenance` (schema-enforced): method
  `script`/`manual`, extractor path, sources with pinned ref or retrievedAt.
- Source tiering, strongest first: **repo/npm** (pinned ref) → **live-site
  CSS** (committed snapshot, stamped) → **manual** (flagged, weakest — only
  when no machine-readable source exists).
- Before committing data: `pnpm test` (schema, color formats, complete
  scales, refs, manifest hashes) and `pnpm --filter directory drift` (re-extracts and diffs
  against committed data — pinned sources fail hard on any mismatch;
  live-site snapshot changes produce a "source changed, review the diff"
  report instead).
- Per-system code is a thin config in `scripts/systems/<slug>.ts` over the
  shared toolkit in `scripts/lib/` — no framework, no per-system forks of
  shared logic.
