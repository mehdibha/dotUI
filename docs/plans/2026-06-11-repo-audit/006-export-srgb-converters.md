# Plan 006: Export sRGB converters from @dotui/colors (research "master key" #2)

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report — do not improvise. When done, update the status row for this plan in `docs/plans/2026-06-11-repo-audit/README.md`.
>
> **Drift check (run first)**: `git diff --stat 0da0afa3..HEAD -- packages/colors/src docs/research/open-in/README.md`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding; on a mismatch, treat it as a STOP condition.

## Status

- **Priority**: P3
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: direction
- **Planned at**: commit `0da0afa3`, 2026-06-11

## Why this matters

The "Open in &lt;tool&gt;" research (`docs/research/open-in/README.md`, dated 2026-06-11) names two "master keys" that "unblock almost everything" in the export roadmap. Master key #1 — shipping `/r/registry.json` — has since been built (`www/src/routes/r/registry[.]json.tsx` exists and serves the index), but the research doc still says "404 today" and has no decision line. Master key #2 — "Export an OKLCH → hex/RGB converter from `@dotui/colors`; design tools and swatches need sRGB; dotUI emits OKLCH only" — is still open: `toSrgb` exists in the kernel but is not in the package's public API, and there is no hex helper at all. This plan exports the converters with tests and appends the decision lines the research workflow expects (CLAUDE.md: "When a report's open question gets decided, append a dated `> Decision:` line to its status header").

## Current state

- `packages/colors/src/shared/color.ts:42-50` — the converter exists, package-internal:

```ts
/** sRGB channels (0..1) of any color. */
export function toSrgb(input: string | Oklch): {
  r: number
  g: number
  b: number
} {
  const [r, g, b] = colorOf(input).to('srgb').coords
  return { r: r ?? 0, g: g ?? 0, b: b ?? 0 }
}
```

The same file exports `gamutMap(o: Oklch): Oklch` (line 52, CSS Color 4 chroma-reduce + clip) and the file's other kernel ops (`toOklch`, `oklchCss`, `apca`, `wcag2`).

- `packages/colors/src/index.ts` — the public API. The shared-kernel export block currently reads:

```ts
// Shared kernel ops + types
export {
  apca,
  type ContrastFormula,
  gamutMap,
  type Oklch,
  oklchCss,
  toOklch,
  wcag2,
} from './shared/color'
```

`toSrgb` is absent; nothing named `toHex` exists anywhere in the package (verified by grep).

- Tests live next to sources: `packages/colors/src/shared/shared.test.ts` (8 tests) is the structural model for kernel-op tests. `pnpm test` from the repo root runs them (vitest).
- `docs/research/open-in/README.md` — "The core insight" section lists the two master keys (the `1.` / `2.` list under "Two **master keys** unblock almost everything:"). Research-doc convention per CLAUDE.md: append dated `> Decision:` lines rather than rewriting history.
- The package is private/workspace-consumed (`@dotui/colors`, used by www) — adding exports is purely additive; no semver ceremony needed.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Install | `pnpm install` | exit 0 |
| Tests | `pnpm test` | all pass (this plan touches packages/colors → tests are mandatory per CLAUDE.md) |
| Typecheck | `pnpm typecheck` | exit 0 |
| Lint/format | `pnpm check` | exit 0 |

## Scope

**In scope**:

- `packages/colors/src/shared/color.ts` (add `toHex`)
- `packages/colors/src/index.ts` (export `toSrgb`, `toHex`)
- `packages/colors/src/shared/shared.test.ts` (tests)
- `docs/research/open-in/README.md` (two `> Decision:` lines)

**Out of scope**:

- Any consumer changes in `www/` — nothing consumes these yet; the export IS the deliverable.
- The rest of the open-in roadmap (`/r/bundle` engine, tool buttons) — separate, much larger plans the operator hasn't selected yet.
- Reformatting or restructuring the research doc beyond the two appended lines.

## Git workflow

- Branch: `advisor/006-export-srgb-converters`
- Commit style: `feat(colors): export toSrgb and toHex` (+ `docs(research): record open-in master-key decisions` if you split commits).
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Add `toHex`

In `packages/colors/src/shared/color.ts`, directly below `toSrgb`, add a hex serializer that is gamut-safe (out-of-gamut OKLCH must map into sRGB before quantizing, mirroring how `gamutMap` is already used in this kernel):

```ts
/** Lowercase #rrggbb of any color, gamut-mapped into sRGB first (swatch-safe). */
export function toHex(input: string | Oklch): string {
  const { r, g, b } = toSrgb(gamutMap(toOklch(input)))
  const channel = (v: number) =>
    Math.round(Math.min(1, Math.max(0, v)) * 255)
      .toString(16)
      .padStart(2, '0')
  return `#${channel(r)}${channel(g)}${channel(b)}`
}
```

Match the file's doc-comment style (one-liner `/** … */`). Check the local helpers first: `toOklch` and `gamutMap` are in this same file — use them as shown rather than reaching into colorjs.io serialization APIs.

**Verify**: `pnpm typecheck` → exit 0.

### Step 2: Export both from the package index

In `packages/colors/src/index.ts`, add `toHex` and `toSrgb` to the shared-kernel export block (alphabetical position within the block, matching the existing sorted style: `…, oklchCss, toHex, toOklch, toSrgb, wcag2`).

**Verify**: `pnpm typecheck` → exit 0; `grep -n "toSrgb\|toHex" packages/colors/src/index.ts` → both present.

### Step 3: Tests

In `packages/colors/src/shared/shared.test.ts`, following the file's existing test style, add:

- `toSrgb('#ff0000')` → `{ r: 1, g: 0, b: 0 }` (use `toBeCloseTo` per channel).
- `toHex('#3b82f6')` → `'#3b82f6'` (round-trip through the converter).
- `toHex` on white/black OKLCH inputs (`{ l: 1, c: 0, h: 0 }` → `'#ffffff'`, `{ l: 0, c: 0, h: 0 }` → `'#000000'`).
- Gamut safety: an out-of-sRGB OKLCH (e.g. `{ l: 0.7, c: 0.4, h: 150 }`) produces a valid `#rrggbb` string matching `/^#[0-9a-f]{6}$/` (no NaN, no clipping artifacts beyond the regex).

**Verify**: `pnpm test` → all pass including the new cases.

### Step 4: Record the decisions in the research doc

In `docs/research/open-in/README.md`, append directly under the two-item master-key list (keep each on one line, matching the repo's no-hard-wrap markdown convention):

```markdown
> Decision (2026-06-11): master key #1 shipped — `/r/registry.json` is served by `www/src/routes/r/registry[.]json.tsx`, indexing `PUBLISHABLE_NAMES`.
> Decision (<today's date>): master key #2 shipped — `toSrgb` and `toHex` are exported from `@dotui/colors` (see docs/plans/2026-06-11-repo-audit/006).
```

Use the actual date you execute this for the second line.

**Verify**: `grep -c "> Decision" docs/research/open-in/README.md` → ≥ 2.

### Step 5: Full sweep

**Verify**: `pnpm check && pnpm typecheck && pnpm test` → all exit 0.

## Test plan

Step 3's four cases in `shared.test.ts` (model: the file's existing kernel-op tests). `pnpm test` is mandatory here because `packages/colors` changed (CLAUDE.md rule).

## Done criteria

- [ ] `toSrgb` and `toHex` exported from `@dotui/colors` (`packages/colors/src/index.ts`)
- [ ] `toHex` is gamut-mapped and returns lowercase `#rrggbb`
- [ ] New tests pass; `pnpm test` exits 0
- [ ] Two `> Decision:` lines appended to `docs/research/open-in/README.md`
- [ ] `pnpm check` and `pnpm typecheck` exit 0
- [ ] `docs/plans/2026-06-11-repo-audit/README.md` status row updated

## STOP conditions

Stop and report back if:

- `colorOf`/`toOklch`/`gamutMap` behave unexpectedly for string inputs (e.g. `toOklch` doesn't accept hex strings — read its implementation in `shared/color.ts` first; if string handling differs from this plan's assumption, report rather than papering over).
- A `toHex`/`toSrgb` symbol already exists somewhere in `packages/colors` by the time you execute (drift).

## Maintenance notes

- These exports are the contract design-tool exporters (Figma plugin, theme galleries) will build on — treat their signatures as public API from now on; changing them later means checking www consumers and any external callers.
- The next open-in step per the research is the `/r/bundle` engine (P2 in the research roadmap; see `docs/research/open-in/architecture.md`) — deliberately not planned here; it needs operator selection because it is multi-day and product-shaping.
