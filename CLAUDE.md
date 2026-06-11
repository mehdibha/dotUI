# dotUI

This is the dotUI repository — a design-system builder. Users compose a
complete design system at dotui.org/create — colors, typography, icons,
density, radius, per-component styles — preview every change live on real
components, and export it as code they own: into their codebase via the
shadcn CLI, or straight into v0, Bolt, and Lovable. It's built on React Aria
Components with Tailwind CSS v4 and tailwind-variants, themed by an OKLCH
color engine, and distributed as a shadcn-compatible registry served from a
TanStack Start app.

## Product direction

This is the goal, not the current state — check the code before assuming an
axis exists. The end state is that **every visual decision is a
user-configurable axis of the builder**, not a hardcoded choice:

- Color system: simple or advanced, selectable generation algorithm, semantic
  tokens, optionally context-aware tokens.
- Typography, icon library, density, radius, interactive/disabled cursors.
- Grouped tweaks — e.g. translucent menus/popovers as a single switch.
- Per-component styles: a curated set of named variants per component (the
  20% of styles that cover 80% of design systems), plus hover effect, radius…
- For consistency, related components form synced groups: Button and
  ToggleButton share the same styles and must stay in sync.
- More export targets beyond CLI + v0/Bolt/Lovable: Figma, Claude design, etc.

What this means when writing code today:

- New visual decisions go through tokens/variants so the builder can own them
  later — never inline one-off values in registry components.
- Style related components as a group, not individually.
- Everything must stay live-previewable in the builder.
- Registry output stays portable: plain React files, shadcn-schema
  compatible, no www-internal imports leaking into registry items.

## Layout

- `www/` — the dotui.org app: docs, the /create builder, and the registry
  endpoints (TanStack Start + Vite, fumadocs-mdx, Tailwind v4,
  tailwind-variants). Registry source lives in `www/src/registry/`
  (`ui/`, `hooks/`, `lib/`, `theme/`, `__generated__/`).
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

## Commands

- Dev: `pnpm dev:www`. In a fresh clone or worktree, run `pnpm build:registry`
  first or the dev server 500s (`build` and `typecheck` run it themselves;
  `dev` does not).
- Before pushing: `pnpm check` (oxlint + `oxfmt --check` — CI fails on
  formatting and import order). Fix with `pnpm check:fix`.
- `pnpm typecheck` · `pnpm test` (vitest, covers `packages/colors`).

## Generated files

- `www/src/registry/__generated__/*` and `www/src/registry/base/colors.css`
  are committed artifacts of `pnpm build:registry`; CI's registry-drift job
  diffs exactly these files. After touching registry items, regenerate and
  commit.
- `build:registry` also builds the showcase bundle. Its theme stub is a blind
  spot for the drift guard: if bundled code changes its `@/registry/theme`
  imports, update `themeStub()` in `www/scripts/build-showcase-bundle.ts` —
  missing named exports there once broke "Open in v0".
- API references: never run `pnpm build:references` to fix one field —
  generator drift rewrites ~121 files. Hand-edit the specific JSON instead.
  Documented props come from `types.ts`, not `base.tsx`.
- `www/src/routeTree.gen.ts` is TanStack-generated; never edit it.

## Conventions & gotchas

- Issues and PRDs are tracked in GitHub Issues for `mehdibha/dotUI`.
- PR titles become commit titles. Format `type(scope): summary` — describe
  the change, don't justify it (cut clauses like "with…", "to improve…").
  Aim ~50–60 chars, but never drop information to hit it.
  Good: `docs: rewrite CLAUDE.md` · Bad: `docs: rewrite CLAUDE.md with real
  project context`.
- Theming: semantic tokens resolve and freeze at `:root` — color/radius
  changes cannot be scoped to a subtree (density is the exception, via React
  context). Previews that re-theme need an iframe or must re-theme the whole
  page.
- RAC SSR: ListBox inside Tabs and Combobox both crash SSR
  (`selectionManager` null) — in demos prefer Select, CheckboxGroup, or a
  sibling ListBox.
