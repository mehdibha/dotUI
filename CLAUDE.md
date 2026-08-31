# dotUI

This is the dotUI repository — a design-system builder. Users compose a complete design system at dotui.org/studio — colors, typography, icons, density, radius, per-component styles — preview every change live on real components, and export it as code they own: into their codebase via the shadcn CLI, or straight into v0 — with Bolt, Lovable, Figma and more planned. It's built on React Aria Components with Tailwind CSS v4 and tailwind-variants, themed by an OKLCH color engine, and distributed as a shadcn-compatible registry served from a TanStack Start app.

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
- Researching design systems (preset fidelity, a missing axis, component comparisons)? Start from [docs/design-system-references.md](docs/design-system-references.md) — a curated, link-verified list of the systems worth studying.

## Current state of the project

An honest snapshot (August 2026) to calibrate against. Task-level work is tracked in GitHub issues; this is the standing picture.

- **Solid:** the docs (one last revision pass pending) and the components — they look and behave well individually. Cross-component composition is less proven: treat "these compose cleanly" as a claim to verify, not an assumption.
- **Known-weak:** the components page (several demos misbehave); the presets page (very slow); the presets themselves on both landing and presets page — due to be replaced by fewer, high-fidelity presets of popular systems (Linear, Vercel, …); chart colors (need a full rewrite); site performance overall (never audited — a docs site must feel instant).
- **In progress — the /studio panel rewrite** (tracking: issue #666). The panel-lab drill-in panel (`www/src/modules/panel-lab/`) is /studio's real panel; its chrome (switcher, reset, search, save, export) is wired to the create engine, and chapters are being wired one at a time — one short-lived PR per chapter, merged to main. Rules: the panel schema (`panel-lab/state.ts`) is the source of truth — wiring a chapter means making the engine/preview/export respond to its axes (reuse engine machinery where an axis matches, change the engine where it diverges, build what's new; never bend the panel to old engine params). A chapter carries a WIP chip until its values actually drive the preview and export. The old panel (`www/src/modules/create/panel/`, unmounted) holds working wiring logic — mine it per chapter, delete what's absorbed in the same PR. `/internal/panel-lab` mounts the same panel without the engine wiring (`create.tsx`'s `system` prop + wired chapters) for design iteration — never fork the panel per surface; the wiring, not the components, is what differs between the two mounts. Note `use-lab.ts` backs both mounts until every chapter reads from the engine. Panel chrome is instant by design — no easing on overlay open/close or pane swaps (in-place control feedback like segmented indicators still eases). At the parity bar (every chip dropped): delete the internal lab route, remove old-panel leftovers and the by-then-unused `use-lab.ts`, and rename the module out of its "lab" name.
- **Queued for rewrite — don't deepen:** the color system gets a complete rewrite — the goal is really good foundations, not incremental fixes; it starts with a playground to verify generated colors visually (current output is average). The publisher is also queued (see below), and the registry should get a small refactor and clean up. In these areas, verify behavior by reading the code and keep changes shallow.
- **AI slop:** much of the codebase was written by AI agents and hasn't all been walked through. When working in an area, leave it simpler than you found it — cut needless comments, indirection, and dead options rather than matching the existing style.

## Structure

- `www/` — the dotui.org app: docs, the /studio builder, and the registry endpoints (TanStack Start + Vite, fumadocs-mdx, Tailwind v4, tailwind-variants). Registry source lives in `www/src/registry/` — see Registry below.
- `packages/colors` — `@dotui/colors`, the OKLCH color engine (private, consumed by www).
- Starter themes and the Tailwind plugins (`tailwindcss-autocontrast`, `tailwindcss-with`) live in standalone repos, consumed from npm — their source is not here.

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

- `pnpm dev:www` — dev server. Like `build` and `typecheck`, it builds the registry first (~2s), so fresh clones, worktrees, and branch switches always serve current output.
- `pnpm check` — oxlint + `oxfmt --check`; `pnpm check:fix` to auto-fix.
- `pnpm typecheck` · `pnpm test` — vitest, covers `packages/colors`.

### Registry changes

After modifying `www/src/registry/`, run `pnpm build:registry` and commit the regenerated `__generated__/*` + `base/colors.css` — CI's registry-drift job diffs exactly these files.

### Before committing

- `pnpm check` — CI fails on formatting and import order.
- `pnpm typecheck`; `pnpm test` if you touched `packages/colors`.
- Touched the registry? Regenerate first (see Registry changes).

## Dev tweaker (design exploration)

`www/src/dev/tweaker` is a **dev-only** floating panel for exploring designs/layouts live. Only during active PR/feature-branch work, and only when the user explicitly asks for tweaks/options on a specific feature — never unprompted, never on `main`, never as a way to add real config, and never author `useTweak` in `www/src/registry/`. Workflow and API: the `dev-tweaker` skill, then [`www/src/dev/tweaker/README.md`](www/src/dev/tweaker/README.md).

## Conventions & gotchas

- Issues and PRDs are tracked in GitHub Issues for `mehdibha/dotUI`.
- PR titles become commit titles. Format `type(scope): summary` — describe the change, don't justify it (cut clauses like "with…", "to improve…"). Aim ~50–60 chars, but never drop information to hit it. Good: `docs: rewrite CLAUDE.md` · Bad: `docs: rewrite CLAUDE.md with real project context`.
- Adding a tweak (new axis, variant, style param, semantic token) is a product decision: propose it and wait for approval before implementing — never slip one into a component PR.
- Spot something worth a refactor or rewrite? Propose it — in a "Suggested refactors" note in the PR description, or a GitHub issue if bigger — never by expanding the current diff. Bar: recurring or task-impeding, and specific enough to act on; no "this could be cleaner". Skip areas with a planned rewrite (see Current state).
- `pnpm build:references` is deterministic and safe to run wholesale — after touching a `types.ts`, regenerate and commit `www/src/modules/docs/references/generated/` (CI's references-drift job fails on stale output). Documented props come from `types.ts`, not `base.tsx`. Commit full-run output: scoped `-f` runs can flip union member order in a few complex types.
- `www/src/routeTree.gen.ts` is TanStack-generated; never edit it.
