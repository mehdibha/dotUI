# Blocks & layouts — implementation plan

Feature-design plan (not an audit, but follows the same folder/index/`NNN-slug.md` convention) to add **blocks** and **layouts** to dotUI: curated, multi-variant compositions (a login page, a sidebar app-shell, a dashboard) that are themed live by the user's design system, picked in `/create`, browsed on a new public `/blocks` page, and exported as canonical owned files. Planned at `744a9179` (worktree branch `claude/mystifying-rubin-2430d6`); all code facts below are verified against the working tree at that commit.

Goal: in `/create` a user opens a new **Blocks** section (empty by default), browses an explorer of real screens rendered live in *their* design system, adds the ones they want — each becomes one slot-card with a single **variant** tweak — and exports them as clean canonical files (`login.tsx`, not `login-3.tsx`) alongside the components they depend on. A public `/blocks` page lets anyone browse every block × variant on-brand and deeplink it into the builder. It is "a better starter for your design system."

Start from this index, never from an individual plan. Read the whole plan you pick up, honor its STOP conditions, and update its status row here when done.

## Phase 0 — product decisions (RESOLVED 2026-06-30)

Decided with the maintainer across the design conversation that produced this plan. Per CLAUDE.md, new axes / tokens / dependencies need sign-off before implementing — the decisions below are that sign-off for this feature's scope, and just as importantly they fix what this feature must **not** become.

1. **One section, not two — `Blocks`.** A single new top-level builder section. *Layouts*, *Pages*, and (later) *Sections* / *Interactive* are **categories inside it**, not separate top-level sections. Rationale: the layout-vs-page boundary is genuinely fuzzy (a dashboard is both); a flat "blocks" model matches shadcn (`login-NN`, `sidebar-NN`, `dashboard-NN`) and the export targets that already speak it; categories scale, hard-coded sections don't.

2. **Blocks consume the design system; they add zero axes or tokens.** A block is a composition of already-themed components. It must introduce **no** new token and **no** new axis. If a block cannot be built without a token that doesn't exist, that is a *missing-axis signal to flag* (per CLAUDE.md tweak governance) — never a magic number baked into the block. This is what keeps blocks from quietly expanding the token surface.

3. **Exactly one tweak per block — a named `variant`. Forever.** No second knob, ever. If a block seems to "need" a toggle (illustration on/off, social logins on/off), it doesn't — that is another named variant. The uniformity (every block card behaves identically: open → pick variant) is the load-bearing constraint that makes the whole feature legible.

4. **Variants are named, not numbered.** shadcn ships flat numbers because it is an undifferentiated registry; dotUI curates, so the builder shows names — *Centered · Split · Minimal* — even where source provenance maps to `login-01..05`. Same mechanism as the existing per-component named styles, at screen scale.

5. **Resolved at publish into a canonical file.** The chosen variant resolves at publish time into one clean canonical file — the user installs `login.tsx`, not `login-3.tsx`. This is **not new machinery**: it is exactly the "enum-with-files" param that `loader` already uses (`params.style.files.{spinner,ring}` → both `target: ui/loader.tsx`). See Architecture.

6. **Empty by default; optional and additive.** The Blocks section starts empty. The user browses an explorer gallery, adds blocks à la carte; each added block becomes one **slot-card** in a "Your system" tray. Re-clicking a card reopens the variant chooser (live, in their DS). Fully reversible; nothing is committed until export, so exploring is free.

7. **A block is a slot: included 0 or 1 times, one variant.** You don't add five logins — you add *Login* once and choose its variant. The explorer may *show* many login designs ("many login pages"), but adding any of them fills the single Login slot-card. Layouts work the same per-block: you add several **distinct** layout blocks (sidebar shell, centered shell), each its own slot-card.

8. **The variant is a starting point, not final pixels.** Someone who wants "variant 2 without the illustration" picks variant 2 and edits it in their own repo. dotUI is **not** a page builder — there is no in-app composition editing beyond variant selection. The builder hands over the closest great screen; the last 10% happens in code the user owns.

9. **Public `/blocks` explorer page.** Browse every block × variant, previewed live, strictly on the existing site design (reuse `PageHero` / `ShowcaseCard` / the presentation modal that `/presets` and `/charts` already share). A detail view deeplinks the block+variant into `/create`.

10. **Export carries the included blocks.** The export paths (install command, Open in v0, init project) ship the chosen block files plus their component `registryDependencies`, themed — whole screens, not just tokens. This is the strongest version of the "ship code you own" pitch.

### Deferred — explicitly NOT in v1 (binding for future work)

- **Coherence helper.** A posture lever (*Expressive ↔ Minimal*) or variant tagging so one choice pre-selects matching variants across all blocks. Genuinely valuable — the thing every block gallery (shadcn included) misses — but a v2. The single-variant model does not solve cross-block coherence on its own; ship it first.
- **App-shell layout as a first-class axis.** Whether "what is my app frame" becomes a singular live-previewed DS axis (like density/radius) rather than just another block. Ship it as a block first; graduate to an axis only if usage warrants. Do not build the axis speculatively.
- **Composition micro-toggles** (illustration on/off as a runtime prop). Subsumed by named variants per decision #3.
- **Interactive / app blocks** (kanban, media player, voice waveform — the `docs/research/2026-06-29-*` real-world-blocks exploration). Same "Blocks" pillar, a separate category, later. This plan establishes the section + variant model + registry shape they will plug into — they are not a different feature.
- **In-app block editing / live composition** beyond picking a variant.

### Open questions for the maintainer (small — confirm before/early in execution)

- **Section name:** `Blocks` (recommended) vs `Compositions` / `Patterns` / `Starters`.
- **Starter set (first 3–5 blocks):** recommended *Login* (auth/page), *Sidebar app-shell* (layout), *Dashboard* (page), *Settings* (page) — confirm the list and how many variants each ships at launch.
- **Card vs gallery granularity in the explorer:** flat gallery of variants that collapses to one slot-card on add (recommended, resolved in conversation) vs one tile per block that expands to variants.

## Architecture in one paragraph

Blocks and layouts ship as a new family of registry items under `www/src/registry/blocks/<name>/`, parallel to `ui/`. Each block is **one** registry item with `type: 'registry:block'`, a `category` (`layout | page | section`), and a single `variant` axis modeled as an **enum-with-files** param: `params.variant.files` maps each named variant to its own composition file (`base.centered.tsx`, `base.split.tsx`, …), all sharing one `target` (`login.tsx`) — the exact mechanism `loader` already ships (`params.style.files.{spinner,ring}` → both `target: ui/loader.tsx`, verified in `www/src/registry/ui/loader/meta.ts`). Blocks are **styles-less** like `loader` (a variant is a whole different file, not a `tv()` class diff), so there is no `styles.ts` and no density resolution to do in the block itself — its themed look comes entirely from the components it composes. The publisher resolves the chosen variant at request time through the existing `selectPublishable` → `publish()` path (`www/src/publisher/`): the user installs `login.tsx`, never `login-split.tsx`, with **zero publisher changes** for resolution. Blocks declare every component they compose in `registryDependencies` (the `checkRegistryDepsDrift` guard enforces completeness). They register through a **new `registryBlocks` manifest array** globbed from `blocks/*/meta.ts` — deliberately separate from `registryUi` so blocks never carry a `ComponentGroup` and therefore never leak into the `/create` components list or the `/docs/components` gallery (both filter on `.group`). In `/create`, **Blocks** is a new top-level entry in the `menu[]` of `customizer-panel.tsx`: an explorer gallery renders every block × variant live in the user's DS via the existing iframe + `group-examples` preview path, adding a block creates one slot-card, and re-clicking it opens a variant chooser reusing the `ParamEditor` enum control. Selection state extends the `DesignSystem` type (`preset/types.ts`) with the chosen variant stored in `componentParams[block]` (so resolution is free) **plus** a new `includedBlocks` list naming which block items to bundle; the `/r/init` export adds those to the init item's `registryDependencies`. The public `/blocks` page mirrors `/presets`/`/charts` exactly — a plain TanStack route (`routes/_app/blocks.tsx`) + module (`modules/blocks/`), reusing `PageHero`, `ShowcaseCard`, the presentation modal, and `DemoPreset` for live in-DS previews — and deeplinks a block+variant into `/create`.

## Execution order

```
001 block & layout registry items ──┬──► 002 publisher + registryBlocks manifest ──┐
  (item shape, loader-style          │      (glob blocks/*, registry:block emit,    │
   variant-files, first blocks)      │       drift guards, init bundling seam)      ├──► 005 build / publish /
                                     │                                              │     drift + verification
                                     ├──► 003 /create Blocks section ───────────────┤     (final gate +
                                     │      (explorer, slot-cards, variant chooser, │      axis-robustness)
                                     │       DS state, export wiring)               │
                                     │                                              │
                                     └──► 004 public /blocks page ──────────────────┘
```

- **001 gates everything** — it defines the item shape and the first blocks the other plans render. It can land a first block end-to-end before 002–004 start.
- **002** (manifest + publish path) gates 003's export wiring and 005's drift checks. Most of the publish *resolution* already works (loader precedent); 002 is mainly the `registryBlocks` glob, the `registry:block` type wiring, and the init-bundling seam.
- **003** and **004** both consume blocks from 001 and are independent of each other (the public page doesn't need the builder section). Either can go first.
- **005** is the regenerate-commit-verify discipline plus the axis-robustness acceptance gate; run its checks after 002/003/004 and as the final gate.

## Status

| Plan | Title | Status |
|---|---|---|
| 000 | Phase 0 product decisions | DONE — resolved 2026-06-30 (one `Blocks` section; blocks consume the DS, zero new axes; one named `variant` tweak; resolved-at-publish canonical file via loader's enum-with-files; empty/optional; starter-not-editor; `/blocks` page; coherence + app-shell-axis deferred) |
| [001](001-block-registry-items.md) | Block & layout registry items + variant model | TODO |
| [002](002-publisher-and-manifest.md) | Publisher + `registryBlocks` manifest + init bundling | TODO |
| [003](003-create-blocks-section.md) | `/create` Blocks section | TODO |
| [004](004-blocks-explore-page.md) | Public `/blocks` explorer page | TODO |
| [005](005-build-publish-and-verification.md) | Build / publish / drift + verification | TODO |

## Verified gotchas (confirmed in the working tree at `744a9179`)

These are the traps that will bite; each is grounded in a file read, not assumed.

- **Slug shadowing in the preview router.** `routes/preview/$slug.tsx` resolves `GroupExamplesIndex[slug] ?? ExamplesIndex[slug]` — group/block slugs share one namespace with component slugs and **win** the lookup (the in-file comment calls out `cards` shadowing `card`). A block slug must not collide with any component slug or it silently shadows it. Namespace block preview slugs (e.g. `block-login`) or assert non-collision in 003/005.
- **enum-with-files needs a default in top-level `files` too.** In `loader/meta.ts` the top-level `files` array points at the default variant (`base.spinner.tsx`) *and* `params.style.files.spinner` repeats it. Block meta must mirror this: top-level `files` = the default variant's file, `params.variant.files.<each>` = per-variant files, all sharing one `target`. Miss the top-level entry and the no-preset/default publish path has nothing to emit.
- **Dependency-drift guard is fatal and complete.** `checkRegistryDepsDrift` (`scripts/registry-build.ts`) scans each shipped base file's `@/registry/ui/X` imports and fails the build if any is absent from `registryDependencies` (allowlist: `utils`, `focus-styles`, `theme`, `context`, `use-image-loading-status`). A block composes many components — list **every** one, in every variant file, or `build:registry` fails.
- **Blocks must stay out of the components taxonomies.** The `/create` components list and `/docs/components` gallery are built from items with a `group` (`registryUi.filter(i => i.group)` and `componentsData`). Give blocks a `ComponentGroup` and they leak into both. Keep blocks in the separate `registryBlocks` manifest with **no** `group` — they surface only through the new Blocks section and `/blocks` page.
- **Styles-less ≠ params-less (and that's the point here).** The publisher decides shipping behavior by `existsSync('styles.ts')`, independent of `params` — `loader` is the styles-less-with-params precedent. Blocks are styles-less and carry the `variant` enum-with-files param. Confirm each block lands in the publishables **"written"** list, not "skipped" (005).
- **Export "no changes" is only half true.** The existing `componentParams` → `/r/init` → `emitInitItem` path resolves a block's *variant* for free (it's just a param). It does **not** bundle the block itself — `/r/init` must learn to add `includedBlocks` to the init item's `registryDependencies` (or emit per-block `add` commands). This is the real export work (002/003), not zero.
- **`group-examples` registration path.** Block previews render via `modules/create/preview/group-examples/<name>.tsx` indexed in the generated `__generated__/examples.tsx` (`GroupExamplesIndex`). Confirm whether that index is hand-maintained or generated by `registry-build.ts` before assuming a new file auto-registers (003).
- **Plain route, not MDX — deliberately.** `/presets` and `/charts` are plain TanStack routes; new fumadocs `.mdx` content needs a dev-server restart and build-time processing. `/blocks` is a plain route + module (004) to stay hot-reload-friendly and stateful (modal, filters, DS switcher).
- **Open-in-v0 / showcase-bundle blast radius.** If blocks ever join the marketing showcase or reach a new `@/registry/theme` export, `themeStub()` in `scripts/build-showcase-bundle.ts` must be updated — the drift guard can't catch a missing named export there (it once broke "Open in v0"). v1 blocks are not in the showcase; flag if that changes (005).

## Architecture decision vs the charts plan (reconciled)

The [2026-06-13 charts plan](../2026-06-13-charts/README.md) explicitly **rejected** "mirroring all ~70 shadcn blocks as separate registry items," choosing instead few items with **variants-as-demos** (copyable `demos/*.tsx`). This plan is consistent with that rejection, not a reversal: a block is **one** item (not 70), and its variants live **inside** it. The one deliberate difference is *how* the variants live — charts ship every variant as a copyable demo because a chart family is a set you pick from at call sites; a block is a **singleton slot** where the user commits to exactly one variant, so its variants are enum-with-files that **resolve to one shipped screen**. Same "few items, variants internal" philosophy; different resolution because the unit of use is different (a screen you adopt, not a family you sample).

## Conventions

- Update your plan's status row above (TODO | IN PROGRESS | DONE | BLOCKED | REJECTED) with a one-line reason.
- Plans are self-contained for cold-context executors: verified excerpts, per-step verification, drift checks against `744a9179`, and STOP conditions. Honor STOP conditions — report back instead of improvising.
- Blocks and layouts that share a sub-composition form **synced groups** (Button ⇄ ToggleButton convention) — a change to the shared piece lands across the group in one PR.
- **Axis-robustness is the acceptance gate for every block.** Unlike shadcn (authored against one theme), a dotUI block renders in arbitrary user systems. The done-criterion for any block is "it still looks intentional at the extremes of every axis — radius max, density comfortable, flat foundation, any accent." Author with tokens only, no magic numbers (CLAUDE.md). This is the single biggest quality risk and is gated in 001 (authoring) and 005 (verification).
