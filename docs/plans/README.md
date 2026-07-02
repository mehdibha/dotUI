# Implementation Plans

Audit-generated, executor-ready implementation plans. One date-prefixed folder per audit; each folder holds that audit's plans (`NNN-slug.md`) and its own `README.md` index (execution order, dependency graph, status table, vetted + rejected findings). Start from the folder index, never from an individual plan. A new audit adds a new folder and a row here — don't renumber or mix plans across folders.

## Audits

| Folder | Scope | Planned at | Plans |
|---|---|---|---|
| [2026-06-11-repo-audit/](2026-06-11-repo-audit/README.md) | Whole repo — publisher publishables, CI/verification baseline, builder perf, edge hardening, dependency hygiene, colors exports | `0da0afa3` | 6 |
| [2026-06-11-colors-audit/](2026-06-11-colors-audit/README.md) | `packages/colors` kernel + its `www/src/registry/theme` consumption boundary — spec recovery, characterization, open algorithm registry, kernel dark mode, new color axes | `05b44151` | 9 |
| [2026-06-12-docs-module-audit/](2026-06-12-docs-module-audit/README.md) | Docs module — `modules/docs` + `modules/references` + `content/docs` + docs/llms routes + api-docs-builder: typeLinks payload/determinism, fail-loud MDX pipeline, fumadocs security bump, legacy engine retirement, shiki deploy weight, content fixes | `e0ca5b16` | 7 |
| [2026-06-13-charts/](2026-06-13-charts/README.md) | Charts feature (design plan, not an audit) — Recharts-based chart registry items with shadcn parity, a `--chart-N` builder colors axis, a new Charts docs section + gallery + nav, and the build/publish/SSR/a11y discipline to ship them | `a4c39a38` | 5 |
| [2026-06-30-blocks-and-layouts/](2026-06-30-blocks-and-layouts/README.md) | Blocks & layouts feature (design plan, not an audit) — multi-variant block/layout registry items (one item per slot; a named `variant` that resolves at publish to a canonical file via `loader`'s enum-with-files), a new `Blocks` section in `/create` (explorer + slot-cards + variant chooser), a public `/blocks` gallery, and the `registryBlocks` manifest + init-bundling + axis-robustness discipline to ship them | `744a9179` | 5 |

## Cross-audit notes

- repo-audit 005 (dependency hygiene) is the "separate task" the colors-audit index points at for the www dependency vulnerabilities it ruled out of scope.
- docs-audit 003 (fumadocs bump → patched next) executes the fumadocs slice of repo-audit 005's "clear audit highs" step — whichever runs first, update the other's status notes; the rest of 005 (seroval/devtools chain, puppeteer, RAC patch) is untouched by it.
- docs-audit 001 finally makes `pnpm build:references` safe to run (machine-independent output) — it retires the standing "generator drift rewrites ~121 files" caveat in CLAUDE.md once landed (update CLAUDE.md's warning then).
- The docs-audit's evidence base includes `docs/research/2026-06-11-docs-build-memory.md` (build-memory + typeLinks measurements), rescued from an uncommitted worktree on 2026-06-12 — ensure it's committed.
- repo-audit 006 (export `toSrgb`/`toHex`) touches `packages/colors/src/shared/color.ts` and `index.ts` but is purely additive — it changes no generated output, so it is safe before, between, or after the colors-audit sequence (whose plans gate on byte-identical default output).
- Both audits' rejected-findings sections are binding for future audits: check them before re-investigating an area.
- The charts plan rejected "mirror all ~70 shadcn blocks as separate registry items" (variants-as-demos instead); the blocks-and-layouts plan honors that — one item per block with variants **internal** — differing only in resolution (enum-with-files resolved to one shipped screen, because a block is a singleton slot, not a family you sample). See its README "Architecture decision vs the charts plan".
- blocks-and-layouts adds a new `registryBlocks` manifest + `registry:block` items and extends `checkRegistryDepsDrift` to all variant files; it touches the same publisher/`registry-build.ts` seams as repo-audit's publisher work — coordinate if both are in flight.

## Conventions

- Executors update their plan's status row in their audit folder's README (status values: TODO | IN PROGRESS | DONE | BLOCKED | REJECTED, with one-line reasons where applicable).
- Plans are self-contained for cold-context executors: verified code excerpts, per-step verification commands, machine-checkable done criteria, drift checks against the planned-at commit, and STOP conditions. Honor the STOP conditions — report back instead of improvising.
