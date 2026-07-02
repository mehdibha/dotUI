# 003 — `/create` Blocks section

> Read the [folder README](README.md), [001](001-block-registry-items.md), and [002](002-publisher-and-manifest.md) first. Planned at `744a9179`. Builds the Blocks experience inside the canonical `/create` page. Consumes blocks from 001 and the `registryBlocks` manifest + init bundling from 002.

## Goal

Add a **Blocks** top-level section to the canonical `/create` customizer: an explorer gallery of every block × variant rendered live in the user's DS, a "Your system" slot-card tray for added blocks, and a per-card variant chooser — wired to DS state and export exactly as Phase 0 describes (empty by default, one named `variant` tweak, reversible, resolved-at-publish).

## What exists (verified — Agent map)

- **Canonical route:** `www/src/routes/_app/create.tsx`. No flags → `<CreatePage>` = two panes: `CustomizerPanel` (left) + `PreviewPanel` (right). `?lab=true` swaps in the experimental `modules/create/panel/` — **ignore it**; build on the canonical panel.
- **Left panel:** `www/src/modules/create/customizer-panel.tsx`. Sections are a `menu: MenuItem[]` array (`{ id, title, preview, config }`); below the menu it renders the components list (`<AllComponentsView/>`, from `registryUi.filter(i => i.group)`). Stack-based navigation: selecting a menu item slides in its `config`.
- **DS state:** `useDesignSystem()` (`modules/create/preset/use-design-system.ts`) over `DesignSystem` (`preset/types.ts`): `componentParams`, `tokens`, `density`, `color?`, `codeOptions?`. Compact `DesignSystemState` (`p/t/d/c/o`) + `codec.ts` (base64url `?preset=`) + `storage.ts` (localStorage `dotui:preset`). Setters: `setComponentParam(name, param, value)`, etc.
- **Variant control:** `modules/create/components/index.tsx` → `ComponentDetailView` → `ParamEditor`. Enum params render `<Select>`+`<Popover>`+`<ListBox>` from `def.values`, reading `selectedParams[param]`, calling `onParamChange(param, value)`. Reuse this for the block variant chooser.
- **Preview:** `PreviewPanel` (`modules/create/preview/preview-panel.tsx`) hosts an iframe → `routes/preview/$slug.tsx`, synced live via `postMessage`. `$slug.tsx` resolves `GroupExamplesIndex[slug] ?? ExamplesIndex[slug]` and renders inside `<DesignSystemProvider params/tokens/density/color>`. Composite previews already exist: `group-examples/cards.tsx` renders `<CardsGrid variant="preview"/>`.
- **Export:** `modules/create/export/` (`targets.tsx` = shadcn + v0, `use-export-url.ts`), `/r/init` reads the preset. 002 adds `includedBlocks` bundling.

## Steps

### Step 1 — Extend DS state with included blocks

In `preset/types.ts`:
- `DesignSystem.includedBlocks?: Array<{ slot: string; variant: string }>`.
- Compact form: add `b?: Array<[slot, variant]>` (tuple to keep the URL short) to `DesignSystemState`.
- Update `codec.ts` encode/decode to round-trip `b ↔ includedBlocks` (coordinate the exact shape with 002 §4).
- Add setters in `use-design-system.ts`: `addBlock(slot, variant)`, `removeBlock(slot)`, `setBlockVariant(slot, variant)`. Each also writes the variant into `componentParams[slot]` (so publish resolution is free) **and** maintains the `includedBlocks` list. Keep the two in sync: removing a block clears both.

Rationale for storing the variant twice (in `componentParams` and `includedBlocks`): `componentParams` is what the publisher resolves; `includedBlocks` is what export bundles and what the UI lists. Document this so a future reader doesn't "dedupe" them and break resolution or bundling.

### Step 2 — The Blocks section in the customizer

Add a `menu[]` entry in `customizer-panel.tsx`:
```ts
{ id: 'blocks', title: 'Blocks', preview: <BlocksSummary />, config: <BlocksConfig /> }
```
- `BlocksSummary` (the home-card preview): a compact state of the Blocks section — e.g. "3 blocks added" or an empty-state hint. Match the visual language of the other menu-card previews.
- `BlocksConfig` (the slide-in detail): the section body. Two states:
  - **Empty / add:** the explorer entry point — a categorized grid (Layouts / Pages / Sections) of available blocks from `registryBlocks`. Each tile previews the block live (Step 4). Clicking a tile (or a variant within it) calls `addBlock(slot, variant)`.
  - **Your system:** the list of added blocks as slot-cards. Each card shows the block title + current variant label; clicking it opens the variant chooser (Step 3). A remove affordance calls `removeBlock`.

Keep `BlocksConfig` self-contained and reading/writing only through `useDesignSystem()`; the panel framework handles navigation/undo automatically (per the existing sections).

### Step 3 — The variant chooser (reuse `ParamEditor`)

When a slot-card is opened, render the block's `params.variant` through the **same enum control** as `ParamEditor` (extract/share it if needed). `def.values` come from the block's `meta.params.variant.values`; labels from `meta.display.variantLabels`. `selected = includedBlocks.find(b => b.slot===slot)?.variant ?? def.default`; `onChange = (v) => setBlockVariant(slot, v)`. The live preview (Step 4) updates as the value changes — this is the "morph in your system" moment.

### Step 4 — Live block previews

Blocks render through the existing iframe/preview path:
- For each block, add a preview entry `modules/create/preview/group-examples/block-<slot>.tsx` whose default export renders the block's **current variant** (read from the preset the iframe already receives) inside the normal provider. Prefer rendering the registry source variant directly so the preview is the real thing.
- Register it in the `GroupExamplesIndex` (confirm whether `__generated__/examples.tsx` is generated by `registry-build.ts` or hand-maintained — see README gotcha — and follow that path; if generated, the generator needs a `group-examples/*` or block-aware glob).
- **Slug-collision guard:** namespace block preview slugs `block-<slot>` so they never shadow a component slug in `GroupExamplesIndex[slug] ?? ExamplesIndex[slug]` (README gotcha, `$slug.tsx:25-28`).
- The explorer tiles can either reuse the iframe (heavier) or render scoped `<DesignSystemProvider scoped>` thumbnails like `/presets` does (`preset-thumbnail.tsx`) for a lighter grid; pick per performance once measured. The full-screen/focused preview should use the real iframe preview pane.

### Step 5 — Export wiring

- Confirm `includedBlocks` flows into `?preset=` via the codec (Step 1) and that `/r/init` bundles them (002 §4).
- In the export UI (`modules/create/export/`), no new target is required for v1; the existing shadcn-init command now installs blocks too. Optionally surface the count ("+3 blocks") near the export button so the user sees blocks are included.

## Verification (live — see CLAUDE.md preview workflow + memory `project-worktree-dev-publishables-500`)

Run `pnpm build:registry` **then** start the dev server (fresh worktrees 500 until publishables exist).
- Open `/create`, open **Blocks**: section is empty by default.
- Add Login → a slot-card appears; the preview pane can render the login in the current DS.
- Open the card → variant chooser lists Centered/Split/Minimal; switching updates the live preview.
- Change a foundation axis (radius/accent/density) → the login preview re-themes live (proves blocks consume the DS).
- Reload → `includedBlocks` persists (localStorage) and re-hydrates the slot-cards.
- Export → the copied `shadcn init` command's `?preset=` decodes to include the block (inspect `/r/init?preset=…` JSON for `/r/login` in `registryDependencies`).
- `pnpm typecheck` + `pnpm check` green.

## Done criteria

- A **Blocks** section exists in the canonical customizer, empty by default, with explorer-add + slot-card + variant-chooser, all live in the user's DS.
- DS state round-trips `includedBlocks` through codec + storage; export bundles them.
- Blocks never appear in the components list (no `group`).

## STOP conditions

- Build on the **canonical** panel (`customizer-panel.tsx`), not `?lab`/`panel/`. If the canonical panel has materially changed since this plan, re-map before coding.
- Do not add a second per-block knob or any new token (Phase 0 #2/#3).
- If `__generated__/examples.tsx` is generated and the generator can't index a new group-example without a registry change, coordinate that change into 002 rather than hand-editing generated files.
