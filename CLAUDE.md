# dotUI

This is the dotUI repository — a design-system builder. Users compose a
complete design system at dotui.org/create — colors, typography, icons,
density, radius, per-component styles — preview every change live on real
components, and export it as code they own: into their codebase via the
shadcn CLI, or straight into v0 — with Bolt, Lovable, Figma and more
planned. It's built on React Aria
Components with Tailwind CSS v4 and tailwind-variants, themed by an OKLCH
color engine, and distributed as a shadcn-compatible registry served from a
TanStack Start app.

## Product direction

This is the goal, not the current state — check the code before assuming an
axis exists.

The north star: the builder should be flexible enough to recreate almost any
design system. If a user can't reproduce the look of a Material-, Geist-, or
Linear-style system, an axis is missing. Coverage comes from a complete set
of well-chosen axes, not infinite options: **every visual decision is a
user-configurable axis of the builder**, never a hardcoded choice. Axes
include (not exhaustive):

- Color system: simple or advanced, selectable generation algorithm, semantic
  tokens, optionally context-aware tokens.
- Typography, icon library, density, radius, interactive/disabled cursors.
- Grouped tweaks — e.g. translucent menus/popovers as a single switch.
- Per-component styles: named variants curated per component — the 20% of
  styles that cover 80% of design systems — plus hover effect, radius…
- For consistency, related components form synced groups: Button and
  ToggleButton share the same styles and must stay in sync.

Beyond the visual axes, export keeps widening: CLI + v0 today;
Bolt, Lovable, Figma, Claude design, etc. planned.

What this means when writing code today:

- New visual decisions go through tokens/variants so the builder can own them
  later — never inline one-off values in registry components.
- A style change to one component in a synced group is a change to the whole
  group (Button ⇄ ToggleButton) — land them together.
- New axes and styles must be switchable at runtime (CSS variables, variant
  props, data attributes), never decided at build time — the builder
  previews live.
- Registry items import only from `@/registry/*`, relative paths, and
  published packages — plain React files, shadcn-schema compatible. www-side
  imports (router, fumadocs, `@/components`) must never leak in.

## Structure

- `www/` — the dotui.org app: docs, the /create builder, and the registry
  endpoints (TanStack Start + Vite, fumadocs-mdx, Tailwind v4,
  tailwind-variants). Registry source lives in `www/src/registry/` — see
  Registry below.
- `packages/colors` — `@dotui/colors`, the OKLCH color engine (private,
  consumed by www).
- Starter themes and the Tailwind plugins (`tailwindcss-autocontrast`,
  `tailwindcss-with`) are moving to standalone repos, consumed from npm.
- `docs/research/` — date-prefixed (`YYYY-MM-DD-topic.md`) point-in-time
  research and assessment reports; multi-file topics get a subfolder (e.g.
  `open-in/`). Check it before re-researching a topic; findings are
  snapshots, not kept current. When a report's open question gets decided,
  append a dated `> Decision:` line to its status header rather than
  leaving it open.
- `patches/` — pnpm patches. `tailwindcss-react-aria-components` is patched
  for an upstream `not-*` variant bug; don't bump it without re-checking the
  patch.

## Registry

`www/src/registry/` is the product's source of truth and must stay clean:
registry items, their files, demos, and descriptions only — no tooling
internals. (Publisher output still sits in `__generated__/publishables`
today; known-wrong, don't add more.)

Anatomy of an item (`www/src/registry/ui/<component>/`):

- `base.tsx` — what users receive via the shadcn CLI, after the publisher
  transforms it (styles resolved, icons swapped, etc.).
- `styles.ts` — the full style definition with every param; not shipped
  as-is. On publish, styles are resolved and cleaned — e.g. the density
  param is removed, its values resolved — before landing in the shipped
  `base.tsx`.
- `index.tsx` — the www-side wrapper (site-only concerns like router links);
  never shipped.
- `types.ts` — prop types; the source for API reference docs.
- `meta.ts`, `demos/`, `examples.tsx` — item metadata and docs demos.

## Publisher

`www/src/publisher/` turns registry source into what users install: resolves
`styles.ts`, strips builder-only params, swaps icons, and emits the shipped
`base.tsx` and registry JSON. It's messy and a rewrite is planned — verify
behavior by reading the code, don't pattern-match its structure, and don't
deepen its reach into `www/src/registry/`.

## Workflow

### Commands

- `pnpm dev:www` — dev server. In a fresh clone or worktree, run
  `pnpm build:registry` first or it 500s (`build` and `typecheck` run it
  themselves; `dev` does not).
- `pnpm check` — oxlint + `oxfmt --check`; `pnpm check:fix` to auto-fix.
- `pnpm typecheck` · `pnpm test` — vitest, covers `packages/colors`.

### Registry changes

After modifying `www/src/registry/`, run `pnpm build:registry` and commit the
regenerated `__generated__/*` + `base/colors.css` — CI's registry-drift job
diffs exactly these files. If bundled code changes its `@/registry/theme`
imports, also update `themeStub()` in `www/scripts/build-showcase-bundle.ts`:
the drift guard can't catch missing named exports there (once broke
"Open in v0").

### Before committing

- `pnpm check` — CI fails on formatting and import order.
- `pnpm typecheck`; `pnpm test` if you touched `packages/colors`.
- Touched the registry? Regenerate first (see Registry changes).

## Conventions & gotchas

- Issues and PRDs are tracked in GitHub Issues for `mehdibha/dotUI`.
- PR titles become commit titles. Format `type(scope): summary` — describe the change, don't justify it (cut clauses like "with…", "to improve…").
  Aim ~50–60 chars, but never drop information to hit it.
  Good: `docs: rewrite CLAUDE.md` · Bad: `docs: rewrite CLAUDE.md with real project context`.
- Never run `pnpm build:references` to fix one field — generator drift
  rewrites ~121 files. Hand-edit the specific JSON; documented props come
  from `types.ts`, not `base.tsx`.
- `www/src/routeTree.gen.ts` is TanStack-generated; never edit it.
