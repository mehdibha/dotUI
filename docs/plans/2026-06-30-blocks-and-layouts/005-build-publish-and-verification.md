# 005 — Build / publish / drift + verification

> Read the [folder README](README.md) and 001–004 first. Planned at `744a9179`. This is the regenerate-commit-verify discipline and the **axis-robustness acceptance gate**. Run its checks after 002/003/004 and as the final gate before merge.

## Goal

Guarantee the blocks feature is drift-clean, publish-correct, SSR-safe, and — most importantly — that every block survives the full axis space (the one quality bar shadcn doesn't have to meet).

## Regenerate + commit (registry discipline)

Per CLAUDE.md "Registry changes":
- After any change under `www/src/registry/`, run `pnpm build:registry` and commit the regenerated `__generated__/*` + `base/colors.css`. CI's registry-drift job diffs exactly these.
- `__generated__/publishables/` is gitignored — never commit it; do confirm each block is in the build's **"written"** list, not "skipped" (styles-less detection via `existsSync('styles.ts')`).
- After touching any `types.ts`, run `pnpm build:references` **full** (unscoped) and commit `www/src/modules/references/generated/` — but note blocks have no public prop API to document unless a block ships a typed component; if `BlockRegistryItem` doesn't feed the references generator, this is a no-op (verify).
- If blocks ever reach the Open-in-v0 showcase bundle or a new `@/registry/theme` export, update `themeStub()` in `scripts/build-showcase-bundle.ts` (drift guard can't catch a missing named export there — it once broke "Open in v0"). v1 blocks are not in the showcase; verify and note.

## Publish-correctness tests

Add tests (alongside the existing publisher/playground specs):
- `GET /r/login` (no preset) → `base.centered.tsx` content emitted at `target: login.tsx`, `type: 'registry:block'`, `category`/`display`/`params`/`group` **absent** from the JSON.
- `GET /r/login?preset=<variant=split>` → `base.split.tsx` content at `target: login.tsx`.
- `GET /r/init?preset=<includedBlocks:[{slot:login,variant:split}]>` → init item's `registryDependencies` includes `/r/login` (absolute URL), and the chosen variant resolves transitively.
- Negative: removing a `registryDependencies` entry that only a non-default variant file imports makes `pnpm build:registry` fail (`checkRegistryDepsDrift` covers all variant files — 002 §3).

## Pre-merge gates (CLAUDE.md "Before committing")

- `pnpm check` (oxlint + oxfmt) — CI fails on formatting/import order.
- `pnpm typecheck`.
- `pnpm test` — run the **full** suite, not scoped. (Memory `project-remove-registry-component`: `Run tests` is not a required check, so a red suite can still merge — run it yourself. Adding a block must not ENOENT any playground-fidelity spec.)
- `pnpm build:registry` clean + regenerated files committed.

## SSR / prerender

- Production build (`pnpm build`) prerenders `/blocks` without breaking (modal/iframe client-gated like `/presets`). Confirm no block composition imports something SSR-hostile; if a block needs client-only behavior, gate it the way existing previews do.

## Axis-robustness acceptance gate (the real bar)

For **every** block × **every** variant, verify it still looks intentional across the axis extremes — because dotUI blocks render in arbitrary user systems, unlike shadcn's single-theme blocks. Use the live preview (`/create` Blocks section or `/blocks` with a switched preset) and the worktree-headless recipe from memory (`preview-worktree-viewport-gotcha`, `project-verify-deployed-preview-headless`) where pixels matter:

Matrix to spot-check per variant:
- Radius: `0` and `max`.
- Density: `compact` and `comfortable`.
- Foundation: tonal and flat.
- Accent: default and a saturated non-default hue (check `text-fg-on-*` contrast — memory `dotui-on-primary-text-utility`: on-primary text uses `text-fg-on-primary`, not `text-primary-fg`).
- Dark mode.

A variant that breaks (overflow, cramped, unreadable, invisible on-color text) at any corner is **not done** — fix with tokens/components, never a magic number. If it can't be fixed without a new token, that's a missing-axis signal to flag to the maintainer (Phase 0 #2), not a workaround.

## Done criteria

- `build:registry`, `check`, `typecheck`, full `test`, production build all green; generated files committed.
- Publish tests prove variant resolution + init bundling + drift coverage.
- Every block × variant passes the axis-robustness matrix (or its failures are filed as missing-axis flags, not patched with magic numbers).

## STOP conditions

- If a block can only be made axis-robust by introducing a token or a second knob, STOP and flag the missing axis — do not ship a magic number or a hidden second param.
- If `build:registry` drift can't be resolved by regenerating (e.g. the branch is behind main), rebase onto main, regenerate, recommit (memory `project-registry-drift-from-stale-branch`) — don't hand-edit generated bundles.
