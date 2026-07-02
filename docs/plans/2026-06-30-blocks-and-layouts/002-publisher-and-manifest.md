# 002 — Publisher + `registryBlocks` manifest + init bundling

> Read the [folder README](README.md) and [001](001-block-registry-items.md) first. Planned at `744a9179`. Gates 003's export wiring and 005's drift checks. The publisher is "messy and a rewrite is planned" (CLAUDE.md) — verify behavior by reading code, do **not** deepen its reach into `registry/`, and keep changes additive.

## Goal

Make blocks first-class in the build/publish pipeline: glob `blocks/*/meta.ts` into a new `registryBlocks` manifest, emit each block through the existing publishable path so its `variant` resolves to one canonical file, and add the seam that lets `/r/init` bundle the user's `includedBlocks`. Most variant *resolution* already works (loader precedent); the new work is registration, the `registry:block` plumbing, drift coverage, and init bundling.

## What exists (verified — Agent map + reads)

- `www/scripts/registry-build.ts` orchestrates `build:registry`: integrity/drift checks (`checkScopeDrift`, `checkRegistryDepsDrift`, name-uniqueness, allowlist-stale), then `buildPublishables()` over `registryUi`, then demo/icon/example indices, then `base/colors.css`.
- `www/src/registry/__generated__/registry-items.ts` exports `registryUi: RegistryItem[]` and `registryLib: RegistryItem[]`, built by importing every on-disk `meta.ts` (glob over `ui/*`, `lib/*`). Drift guard compares the generated arrays to a fresh glob by module identity.
- `www/src/publisher/build-time/build-publishables.ts`: `buildPublishables()` → `buildOne()` per item: extract config → transform base → collect extra files → render `__generated__/publishables/<name>.ts`. `collectBaseFiles()` already scans `meta.params[*].files[*]` for **enum-variant base files** (the loader path) and emits `publishableByPath`.
- Request path `www/src/routes/r/$name.tsx`: loads the publishable, `selectPublishable()` picks the variant entry from `publishableByPath` using the preset's param selection, calls `publish()` (`www/src/publisher/publish.ts`), formats with oxfmt, returns the shadcn JSON item. `publish()` drops dotui-only fields (`params`, `group`) and rewrites known dotui `registryDependencies` to absolute `/r/*` URLs.
- `www/src/routes/r/init.tsx` → `resolveRequestPreset(encoded)` (`lib/registry-preset.ts`) → `emitInitItem({ baseRegistryCss, preset, encodedPreset, registryRoot })`. The preset carries `color`, `density`, `componentParams`, `codeOptions` — **not** an `includedBlocks` notion yet.

## Steps

### Step 1 — Add the `registryBlocks` manifest

1. In `registry-build.ts`, add a glob over `blocks/*/meta.ts` (mirror the `ui/*` glob) and generate a `registryBlocks: BlockRegistryItem[]` export in `__generated__/registry-items.ts`. Sort stably (by `name`) like the others.
2. Extend the drift guard (`checkScopeDrift`) to cover `blocks/` ↔ `registryBlocks` with the same module-identity comparison, so a new/removed block dir without a rebuild fails CI.
3. Run blocks through `buildPublishables()` too: pass `registryBlocks` alongside `registryUi` (or concatenate for the publishable loop). Confirm `collectBaseFiles()` already handles the `params.variant.files.*` shape — it does for loader; a block is the same shape with `type: 'registry:block'`. If `collectBaseFiles` filters by `type === 'registry:ui'` anywhere, generalize it to accept `registry:block`.

### Step 2 — `registry:block` plumbing through publish

1. Confirm `publish()` passes `meta.type` through unchanged (it does — `itemShape.type = meta.type`). A block emits `type: 'registry:block'` in its `/r/<name>` JSON. Verify shadcn's installer treats `registry:block` items correctly (files written to their `target`, `registryDependencies` resolved).
2. Confirm the `target` resolution: all variant files share `target: 'login.tsx'`, and `selectPublishable()` picks the chosen variant's file. Add a publish-path test (005) asserting `GET /r/login?preset=<variant=split>` returns the `base.split.tsx` content at `target: login.tsx`.
3. Drop block-only fields on emit: `category` and `display` are dotui-only (like `group`/`params`) and must be stripped from the shipped JSON in `publish()` alongside the existing `params`/`group` drop. Verify they don't leak.

### Step 3 — `checkRegistryDepsDrift` over blocks

`checkRegistryDepsDrift` walks shipped base files' `@/registry/ui/X` imports vs `registryDependencies`. Extend it to walk **all** of a block's variant files (`params.variant.files[*]`), not just the top-level `files[0]` — a component imported only in `base.split.tsx` must still be required. Without this, a split-only dependency would 404 for a user who picks `split`. This is the most important new guard.

### Step 4 — Init bundling seam (`includedBlocks`)

This is the real export work (the `componentParams` path resolves a block's *variant* for free but does **not** include the block itself).

1. Extend the preset types (owned by 003 in `preset/types.ts`, consumed here): `DesignSystem.includedBlocks?: Array<{ slot: string; variant: string }>` and its compact form. Coordinate the exact shape with 003 so the codec round-trips it.
2. In `lib/registry-preset.ts` `resolveRequestPreset`, carry `includedBlocks` onto the `PublishPreset`.
3. In `emitInitItem` (the `/r/init` payload), add each included block to the init item's `registryDependencies` as an absolute `/r/<slot>` URL (the same rewrite `publish()` uses for component deps). The block's chosen `variant` is already in `componentParams[slot]`, so when `shadcn` fetches `/r/<slot>?preset=…` the variant resolves. Net effect: `npx shadcn init <preset>/r/init` pulls the theme **and** the chosen blocks **and**, transitively, the components those blocks depend on.
4. Decision to confirm with maintainer (small): bundle blocks into `init` (one command installs everything) vs surface per-block `npx shadcn add <preset>/r/<slot>` commands in the export UI. Recommend **bundle into init** for the "init a project with them" experience (Phase 0 framing); the per-block add command can also be shown in the `/blocks` page detail modal (004).

## Verification

- `pnpm build:registry` runs clean with the Login block present; the block appears in `registryBlocks` and in the publishables **"written"** list (not "skipped"). Commit the regenerated `__generated__/*` + `base/colors.css` (CI registry-drift diffs exactly these).
- `GET /r/login` (default) returns `base.centered.tsx` content as `login.tsx`; `GET /r/login?preset=<variant=split>` returns `base.split.tsx` as `login.tsx`. (Add as a publish test in 005.)
- `GET /r/init?preset=<…includedBlocks:[{slot:login,variant:split}]>` includes `/r/login` in `registryDependencies`.
- `checkRegistryDepsDrift` fails if you remove a `registryDependencies` entry that a non-default variant file imports (prove the guard works).
- `pnpm typecheck` green.

## Done criteria

- `registryBlocks` manifest generated + drift-guarded; blocks build through `buildPublishables` and publish with variant resolution.
- `category`/`display` stripped from shipped JSON; `registry:block` type passes through.
- Dependency-drift guard covers every variant file.
- `/r/init` bundles `includedBlocks` (+ transitive component deps) and resolves each block's variant.

## STOP conditions

- If extending the publisher requires restructuring it (not just additive globs/guards), STOP and report — a rewrite is already planned; do not deepen the mess.
- If `collectBaseFiles`/`selectPublishable` turn out **not** to support `registry:block` without invasive change, STOP and report the exact seam; the resolution model depends on it (loader proves it works for `registry:ui` — most likely a type-filter widening, not a rewrite).
- Do not hand-edit `__generated__/registry-items.ts` or `publishables/*` — regenerate via `build:registry`.
- `__generated__/publishables/` is gitignored — never commit it.
