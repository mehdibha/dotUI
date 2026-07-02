# 004 — Public `/blocks` explorer page

> Read the [folder README](README.md) and [001](001-block-registry-items.md) first. Planned at `744a9179`. Builds the public gallery. Depends only on 001 (needs ≥1 block in `registryBlocks`); independent of 003. Per the goal: be creative but **stay on the existing site design** — reuse the shared gallery primitives, don't invent a new visual language.

## Goal

A public `/blocks` page that mirrors `/presets` and `/charts`: a `PageHero`, a categorized grid of `ShowcaseCard`s each previewing a block live in a selectable design system, and a presentation modal (spec sheet + live preview + light/dark toggle) with a deeplink that adds the block+variant into `/create`.

## What exists (verified — Agent map)

- **Shared primitives:** `components/page-hero.tsx` (`PageHero`: eyebrow/title/description/children CTA), `components/showcase-card.tsx` (`ShowcaseCard`: label + optional action over a fixed-height framed preview), `components/layout/footer.tsx` (`Footer`).
- **Reference pages (copy their structure):**
  - `/presets`: route `routes/_app/presets.tsx` → module `modules/presets/presets-page.tsx`, data `modules/presets/presets-data.ts` (`Preset[]`), modal `modules/presets/preset-modal.tsx` (two-pane: spec left, live iframe `/preview/cards?preset=…` right, light/dark via `postMessage`).
  - `/charts`: route `routes/_app/charts.tsx` → `modules/charts/` (hero + live gallery + playground; `chart-code-modal.tsx` for source view).
- **Grid pattern:** `<section className="container mt-12 sm:mt-16"><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">…</div></section>`.
- **Live-in-DS previews:** `modules/docs/demo-preset.tsx` (`DemoPreset` wraps children in scoped `<DesignSystemProvider>` from the stored preset via `useStoredPreset()`); `modules/presets/preset-thumbnail.tsx` shows the scoped-provider thumbnail pattern. `<DesignSystemProvider scoped>` clones the `:root` token closure onto the wrapper so each preview themes independently.
- **Chrome:** `routes/_app/route.tsx` renders `<Header items={items}/>` + `<main>` around the page `<Outlet/>`; the page module must use a fragment (not its own `<main>`) — see the `presets-page.tsx` landmark comment.
- **Nav:** `config/site.ts` `navItems` array; `<Header>` highlights by longest-prefix `match`.
- **Why plain route, not MDX:** `/presets`/`/charts` are plain routes; new `.mdx` needs a dev-server restart + build-time processing. A gallery wants state (modal, filters, DS switcher) → plain route.

## Steps

### Step 1 — Route + module skeleton

- `routes/_app/blocks.tsx`: copy `presets.tsx` — `createFileRoute('/_app/blocks')` with `head()` (title, description, OG tags), `component: BlocksPage`.
- `modules/blocks/blocks-page.tsx`: `min-h-[calc(100vh-var(--header-height))]` wrapper (fragment, no `<main>`), `PageHero`, the grid `<section>`, the modal, `Footer`.
- Add `{ name: 'Blocks', match: '/blocks', to: '/blocks' }` to `navItems` in `config/site.ts`. Place it sensibly relative to Components/Charts/Presets; check the mobile-nav double-listing caveat the charts plan noted.

### Step 2 — Block data source

Drive the gallery from the `registryBlocks` manifest (single source of truth), not a hand-kept array. Read `name`, `category`, `display.title/description`, and `params.variant.values/variantLabels`. If a derived view is convenient, build a thin selector over `registryBlocks` in `modules/blocks/blocks-data.ts` — but do not duplicate metadata that already lives in `meta.ts`.

Group the grid by `category` (Layouts / Pages / Sections) with section headings, matching how `/docs/components` groups by category.

### Step 3 — Block card

`modules/blocks/block-card.tsx`: a `ShowcaseCard` with `label={display.title}`, `action={category chip}`, and a live preview child. Preview options (pick by measured perf):
- Scoped-provider thumbnail (`<DesignSystemProvider scoped>` + the block's default variant), like `preset-thumbnail.tsx` — lighter, many-per-page.
- Reserve the heavier iframe preview for the modal.
Wrap the grid (or each card) in `DemoPreset` so previews render in the visitor's **saved** design system when they have one (the "see it in *your* system" payoff), falling back to defaults otherwise.

### Step 4 — Presentation modal

`modules/blocks/block-modal.tsx`: copy `preset-modal.tsx`'s two-pane shape.
- **Left (spec):** block title, category, description, a variant switcher (the named variants), and CTAs: **Add to my system** (deeplink to `/create` with this block+variant pre-added) and a **copy install command** (`npx shadcn add <host>/r/<slot>?preset=…` — reuse `use-export-url.ts`).
- **Right (live):** the block in a live preview with the existing light/dark toggle + open-in-new-tab, in a selectable DS (default the visitor's saved preset). Switching the variant updates the preview — the same morph moment as the builder.

### Step 5 — Deeplink into `/create`

"Add to my system" should land in `/create` with the block already in `includedBlocks` at the chosen variant. Reuse the preset codec: construct a `?preset=` that includes the block (depends on 003's `includedBlocks` codec). If 003 hasn't landed yet, ship the modal + "copy install command" first and wire the deeplink once the codec supports blocks — note the dependency in the status row.

## Verification (live)

`pnpm build:registry` then start dev.
- `/blocks` renders the hero + categorized grid; cards preview blocks live; visiting with a saved preset themes them to it.
- Open a card → modal shows spec + live preview + variant switcher + working light/dark toggle.
- "Add to my system" lands in `/create` with the block pre-added at the chosen variant (once 003 codec exists).
- Nav highlights "Blocks" on `/blocks`.
- `pnpm typecheck` + `pnpm check` green. Production build prerenders `/blocks` (no SSR break — modal/iframe are client-gated like `/presets`).

## Done criteria

- `/blocks` exists as a plain route + `modules/blocks/` module, on the shared `PageHero`/`ShowcaseCard`/modal design, driven by `registryBlocks`.
- Live in-DS previews via scoped provider / `DemoPreset`; modal with variant switcher + deeplink + install command.
- Nav entry added.

## STOP conditions

- Do not invent a new page visual language — reuse `PageHero`/`ShowcaseCard`/modal (the goal says stay on the site's design). Creativity goes into the block content and the preview/morph interaction, not bespoke chrome.
- Do not author a parallel hand-kept block list — read `registryBlocks`.
- Do not use MDX for this page.
