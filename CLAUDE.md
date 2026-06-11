# dotUI

This is the dotUI repository — a design-system builder. Users compose a complete design system at dotui.org/create — colors, typography, icons, density, radius, per-component styles — preview every change live on real components, and export it as code they own: into their codebase via the shadcn CLI, or straight into v0 — with Bolt, Lovable, Figma and more planned. It's built on React Aria Components with Tailwind CSS v4 and tailwind-variants, themed by an OKLCH color engine, and distributed as a shadcn-compatible registry served from a TanStack Start app.

## Product direction

This is the goal, not the current state — check the code before assuming an axis exists.

The north star: the builder should be flexible enough to recreate almost any design system. If a user can't reproduce the look of a Material-, Geist-, or Linear-style system, an axis is missing. Coverage comes from a complete set of well-chosen axes, not infinite options: **every visual decision is a user-configurable axis of the builder**, never a hardcoded choice. Axes include (not exhaustive):

- Color system: simple or advanced, selectable generation algorithm, semantic tokens, optionally context-aware tokens.
- Typography, icon library, density, radius, interactive/disabled cursors.
- Grouped tweaks — e.g. translucent menus/popovers as a single switch.
- Per-component styles: named variants curated per component — the 20% of styles that cover 80% of design systems — plus hover effect, radius…
- For consistency, related components form synced groups: Button and ToggleButton share the same styles and must stay in sync.

A second customization layer beyond visuals: `codeOptions` — the style of the exported code itself. Separator comments or not, arrow functions vs function declarations, tailwind-variants styles as commented arrays vs one line per slot/variant, etc. The exported design system should read like the user's codebase, not ours.

Beyond that, export keeps widening: CLI + v0 today; Bolt, Lovable, Figma, Claude design, etc. planned.

What this means when writing code today:

- The test for hardcoded values: would two design systems disagree on it? The design system's look (color, radius, typography, shadows, density-affected spacing) goes through tokens/variants — `bg-primary`, not `bg-[#635bff]`. Component mechanics (internal layout, hairlines, hit areas) stay plain values — don't tokenize them. Look with no covering axis? Flag the missing axis; don't invent a token.
- A style change to one component in a synced group is a change to the whole group (Button ⇄ ToggleButton) — land them together.
- New axes and styles must be switchable at runtime (CSS variables, variant props, data attributes), never decided at build time — the builder previews live.
- Registry items import only from `@/registry/*`, relative paths, and published packages — plain React files, shadcn-schema compatible. www-side imports (router, fumadocs, `@/components`) must never leak in.
- Author registry source in one canonical style (current files are the reference) — `codeOptions` will be mechanical publisher transforms over it, and inconsistent source breaks the transforms.

## Structure

- `www/` — the dotui.org app: docs, the /create builder, and the registry endpoints (TanStack Start + Vite, fumadocs-mdx, Tailwind v4, tailwind-variants). Registry source lives in `www/src/registry/` — see Registry below.
- `packages/colors` — `@dotui/colors`, the OKLCH color engine (private, consumed by www).
- Starter themes and the Tailwind plugins (`tailwindcss-autocontrast`, `tailwindcss-with`) live in standalone repos, consumed from npm — their source is not here.
- `docs/research/` — date-prefixed (`YYYY-MM-DD-topic.md`) point-in-time research and assessment reports; multi-file topics get a subfolder (e.g. `open-in/`). Check it before re-researching a topic; findings are snapshots, not kept current. When a report's open question gets decided, append a dated `> Decision:` line to its status header rather than leaving it open.
- `docs/plans/` — numbered implementation plans (`NNN-slug.md`) from codebase audits, indexed by `docs/plans/README.md` (execution order, status table, vetted + rejected findings). Plans are self-contained handoffs for cold-context executors: read the whole plan first, honor its STOP conditions, and update its status row in the index when done. Before auditing or fixing an area, check the index — it records what's already planned and which findings were rejected and why.
- `patches/` — pnpm patches. `tailwindcss-react-aria-components` is patched for an upstream `not-*` variant bug; don't bump it without re-checking the patch.

## Registry

`www/src/registry/` is the product's source of truth and must stay clean: registry items, their files, demos, and descriptions only — no tooling internals. (Publisher output still sits in `__generated__/publishables` today; known-wrong, don't add more.)

Anatomy of an item (`www/src/registry/ui/<component>/`):

- `base.tsx` — what users receive via the shadcn CLI, after the publisher transforms it (styles resolved, icons swapped, etc.).
- `styles.ts` — the full style definition with every param; not shipped as-is. On publish, styles are resolved and cleaned — e.g. the density param is removed, its values resolved — before landing in the shipped `base.tsx`.
- `index.tsx` — the www-side wrapper (site-only concerns like router links); never shipped.
- `types.ts` — prop types; the source for API reference docs.
- `meta.ts`, `demos/`, `examples.tsx` — item metadata and docs demos.

When working on a component's styles, compare against the shadcn equivalent to catch missing classes — especially logical classes, but everything else too. Their styles map to our density levels: `style-mira` ≈ compact, `style-nova` ≈ default, `style-vega` ≈ comfortable. In shadcn-ui/ui a component's classes live in two places — shared rules in `apps/v4/registry/styles/style-{name}.css` and per-component classes in the registry file itself (`apps/v4/registry/bases/{base,radix}/ui/<component>.tsx`); check both, or you'll conclude classes are "missing" that just live in the other file.

## Publisher

`www/src/publisher/` turns registry source into what users install: resolves `styles.ts`, strips builder-only params, swaps icons, and emits the shipped `base.tsx` and registry JSON. It's messy and a rewrite is planned — verify behavior by reading the code, don't pattern-match its structure, and don't deepen its reach into `www/src/registry/`.

## Workflow

### Commands

- `pnpm dev:www` — dev server. In a fresh clone or worktree, run `pnpm build:registry` first or it 500s (`build` and `typecheck` run it themselves; `dev` does not).
- `pnpm check` — oxlint + `oxfmt --check`; `pnpm check:fix` to auto-fix.
- `pnpm typecheck` · `pnpm test` — vitest, covers `packages/colors`.

### Registry changes

After modifying `www/src/registry/`, run `pnpm build:registry` and commit the regenerated `__generated__/*` + `base/colors.css` — CI's registry-drift job diffs exactly these files. If bundled code changes its `@/registry/theme` imports, also update `themeStub()` in `www/scripts/build-showcase-bundle.ts`: the drift guard can't catch missing named exports there (once broke "Open in v0").

### Before committing

- `pnpm check` — CI fails on formatting and import order.
- `pnpm typecheck`; `pnpm test` if you touched `packages/colors`.
- Touched the registry? Regenerate first (see Registry changes).

## Conventions & gotchas

- Issues and PRDs are tracked in GitHub Issues for `mehdibha/dotUI`.
- PR titles become commit titles. Format `type(scope): summary` — describe the change, don't justify it (cut clauses like "with…", "to improve…"). Aim ~50–60 chars, but never drop information to hit it. Good: `docs: rewrite CLAUDE.md` · Bad: `docs: rewrite CLAUDE.md with real project context`.
- Adding a tweak (new axis, variant, style param, semantic token) is a product decision: propose it and wait for approval before implementing — never slip one into a component PR.
- Spot something worth a refactor or rewrite? Propose it — in a "Suggested refactors" note in the PR description, or a GitHub issue if bigger — never by expanding the current diff. Bar: recurring or task-impeding, and specific enough to act on; no "this could be cleaner". Skip areas with a planned rewrite (the publisher).
- Never run `pnpm build:references` to fix one field — generator drift rewrites ~121 files. Hand-edit the specific JSON; documented props come from `types.ts`, not `base.tsx`.
- `www/src/routeTree.gen.ts` is TanStack-generated; never edit it.
