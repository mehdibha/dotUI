# Implementation Plans

Audit-generated, executor-ready implementation plans. One date-prefixed folder per audit; each folder holds that audit's plans (`NNN-slug.md`) and its own `README.md` index (execution order, dependency graph, status table, vetted + rejected findings). Start from the folder index, never from an individual plan. A new audit adds a new folder and a row here — don't renumber or mix plans across folders.

## Audits

| Folder | Scope | Planned at | Plans |
|---|---|---|---|
| [2026-06-11-repo-audit/](2026-06-11-repo-audit/README.md) | Whole repo — publisher publishables, CI/verification baseline, builder perf, edge hardening, dependency hygiene, colors exports | `0da0afa3` | 6 |
| [2026-06-11-colors-audit/](2026-06-11-colors-audit/README.md) | `packages/colors` kernel + its `www/src/registry/theme` consumption boundary — spec recovery, characterization, open algorithm registry, kernel dark mode, new color axes | `05b44151` | 9 |

## Cross-audit notes

- repo-audit 005 (dependency hygiene) is the "separate task" the colors-audit index points at for the www dependency vulnerabilities it ruled out of scope.
- repo-audit 006 (export `toSrgb`/`toHex`) touches `packages/colors/src/shared/color.ts` and `index.ts` but is purely additive — it changes no generated output, so it is safe before, between, or after the colors-audit sequence (whose plans gate on byte-identical default output).
- Both audits' rejected-findings sections are binding for future audits: check them before re-investigating an area.

## Conventions

- Executors update their plan's status row in their audit folder's README (status values: TODO | IN PROGRESS | DONE | BLOCKED | REJECTED, with one-line reasons where applicable).
- Plans are self-contained for cold-context executors: verified code excerpts, per-step verification commands, machine-checkable done criteria, drift checks against the planned-at commit, and STOP conditions. Honor the STOP conditions — report back instead of improvising.
