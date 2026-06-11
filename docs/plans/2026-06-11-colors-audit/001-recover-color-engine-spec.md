# Plan 001: Recover the color-engine design spec into docs/research

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `docs/plans/2026-06-11-colors-audit/README.md` — unless a reviewer dispatched you and told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat 05b44151..HEAD -- packages/colors/src docs/research`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: docs
- **Planned at**: commit `05b44151`, 2026-06-11

## Why this matters

The `@dotui/colors` kernel's source comments cite numbered sections of a design spec — `§4.2`, `§4.3`, `§4.4`, `§4.5`, `§4.6`, `§4.7a` — but that spec is not checked into the repository, and `docs/research/` contains no color-engine document. At least one of those references is load-bearing: `§4.7a` is the recorded justification for the oklch producer being mode-agnostic (light and dark ramps identical), which is the design decision at the center of a planned dark-mode refactor (plan 005). Without the spec, nobody can reconstruct *why* these decisions were made, which makes changing them risky. This plan reconstructs the spec as a dated research report so later plans can amend decisions with a paper trail.

This plan modifies **documentation only** — zero source-code edits.

## Current state

- `packages/colors/` is `@dotui/colors`, a private OKLCH color engine: producer registry (`src/producer.ts`), orchestrator (`src/theme.ts`), producers (`src/producers/{oklch,contrast,material,fixed,presets}.ts`), shared utilities (`src/shared/`), and a contrast-verification layer (`src/verify/`).
- The §-references in source today (verify with the grep in Step 1):
  - `src/producers/oklch.ts:2` — `OKLCH-perceptual producer — the DEFAULT (§4.2)`
  - `src/producers/oklch.ts:7` — `Background-INDEPENDENT and mode-agnostic`
  - `src/shared/on-color.ts:3` — `Foreground (on-*) picker (§4.3)`
  - `src/verify/index.ts:2` — `Post-generation contrast verification (§4.4)`
  - `src/shared/seed-anchor.ts:2` — `Seed anchoring (§4.5)`
  - `src/producers/material.ts:2` — `Material 3 HCT producer (§4.6, "should")`
  - `src/producers/contrast.ts:2` — `Contrast-locked producer (§4.6) — the DEMOTED option (was the default)`
  - `src/engine.test.ts:148` — test titled `light and dark ramps are identical (mode-agnostic, §4.7a)`
- The engine landed in PR #158 (`feat(colors): @dotui/colors engine — OKLCH-perceptual default, producer registry, verify layer`), with follow-ups in PRs #186, #187, #188. The original spec most likely lives in the PR #158 description or its linked issue.
- Repo convention for research docs (from `CLAUDE.md`): `docs/research/` holds **date-prefixed** (`YYYY-MM-DD-topic.md`) point-in-time reports. When a report's open question gets decided later, a dated `> Decision:` line is appended to its status header. An existing exemplar to match for tone/structure: `docs/research/2026-06-11-autocontrast-assessment.md`.
- Markdown prose convention in this repo: one line per paragraph/bullet — do not hard-wrap prose at 80 characters.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| List §-refs in source | `grep -rhoE '§4\.[0-9]+[a-z]?' packages/colors/src \| sort -u` | the list of section ids the doc must cover |
| Fetch PR bodies | `gh pr view 158 --repo mehdibha/dotUI --json title,body,url` (also 186, 187, 188) | JSON with the PR description |
| Tests (unchanged) | `pnpm test` | exit 0, all pass |
| Lint/format | `pnpm check` | exit 0 |

## Scope

**In scope** (the only files you may create or modify):

- `docs/research/2026-06-11-color-engine-spec.md` (create)
- `docs/plans/2026-06-11-colors-audit/README.md` (status row update)

**Out of scope** (do NOT touch):

- Anything under `packages/colors/src/` — including the comments carrying the §-references. The doc maps to them; the code does not change.
- `CLAUDE.md`, any other doc.

## Git workflow

- Branch: `advisor/001-color-engine-spec`
- One commit; message style matches repo convention, e.g. `docs: recover color engine design spec`
- Run `pnpm check:fix` before committing (CI fails on formatting). Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Collect the section inventory and the source material

Run `grep -rnE '§4\.[0-9]+[a-z]?' packages/colors/src` to get every reference with its context line. Then fetch the descriptions of PRs 158, 186, 187, 188 with `gh pr view <n> --repo mehdibha/dotUI --json title,body,url`. PR #158's body is the primary candidate for the original spec text (it introduced the engine and the § numbering). PRs #186–#188 record later decisions (palette SSOT, typed `BaseThemeOptions`, live `--on-*` preview parity).

**Verify**: the grep returns at least the 8 locations listed in "Current state" → you have the full inventory.

### Step 2: Write `docs/research/2026-06-11-color-engine-spec.md`

Structure (match the repo's research-report style — status header first, then content):

1. A status header: what this doc is (reconstruction of the `@dotui/colors` design spec referenced by §-numbers in source), the source material used (PR bodies, code, tests), and an explicit note that it is a point-in-time reconstruction.
2. One section per § id found in Step 1, with the heading carrying the § id verbatim (e.g. `## §4.2 — OKLCH-perceptual producer (the default)`), so a reader grepping a § id from a code comment lands on the right heading. For each section: the decision, the rationale (from the PR text where available, otherwise inferred from code + tests — and **labeled "inferred from code"** when so), and pointers to the implementing files.
3. Sections that must exist at minimum: §4.2 (oklch default: fixed perceptual lightness anchors, mid-peak tapered chroma, background-independent), §4.3 (on-color picker: tinted poles, then pure-pole fallback, honest `meetsFloor`), §4.4 (verify layer: pure reporter, never mutates), §4.5 (seed anchoring: seed lightness discarded by default, `preserveSeedAt` opt-in), §4.6 (material producer "should"-level; contrast producer demoted from default), §4.7/§4.7a (mode semantics: oklch ramps are mode-agnostic, dark mode handled by the consumer via lightness-ladder reversal — see `www/src/registry/theme/primitives.ts:1-12` for the consumer's documented rationale).
4. A closing "Open questions" list, which must include: "mode polarity is producer-dependent (oklch ignores `isDark`, material/contrast honor it) — should the kernel own dark-mode generation?" (this is the question plan 005 answers; do not answer it in this doc).

**Verify**: `for s in $(grep -rhoE '§4\.[0-9]+[a-z]?' packages/colors/src | sort -u); do grep -q -- "$s" docs/research/2026-06-11-color-engine-spec.md || echo "MISSING $s"; done` → prints nothing.

### Step 3: Final checks

**Verify**: `pnpm check` → exit 0. `pnpm test` → all pass (nothing should have changed). `git status --porcelain` → only the new doc and `docs/plans/2026-06-11-colors-audit/README.md` are modified.

## Test plan

No code tests — this is a docs-only plan. The machine-checkable gate is the §-coverage grep loop in Step 2.

## Done criteria

- [ ] `docs/research/2026-06-11-color-engine-spec.md` exists with a status header and one heading per § id.
- [ ] The §-coverage grep loop (Step 2 verify) prints nothing.
- [ ] No files under `packages/colors/src` modified (`git status --porcelain packages/colors` is empty).
- [ ] `pnpm check` exits 0.
- [ ] `docs/plans/2026-06-11-colors-audit/README.md` status row updated.

## STOP conditions

Stop and report back (do not improvise) if:

- `gh pr view 158` fails or the PR body contains no spec-like content **and** you cannot confidently infer a section's rationale from code+tests — in that case write the sections you can support and report which § ids are documented as "rationale unrecoverable" rather than inventing rationale.
- `docs/research/2026-06-11-color-engine-spec.md` already exists (another run got here first) — reconcile instead of overwriting.

## Maintenance notes

- Plan 005 (kernel-owned dark mode) will append a dated `> Decision:` line to this doc's §4.7a section when it changes the mode-agnostic behavior. That is the expected lifecycle per `CLAUDE.md` — decisions are appended, history is not rewritten.
- If a future PR adds a producer or changes anchoring, the corresponding § section should gain a `> Decision:` line, not an in-place rewrite.
