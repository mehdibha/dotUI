# Consumer templates

Real apps, one per preset × framework, with the registry's resolved output committed: every item installed the way a user installs it — `shadcn init` against the registry with the preset baked in, then `shadcn add` for every item — so the code a consumer actually gets is browsable, type-checked and runnable in one place. Styles collapsed to the preset, icon imports swapped, params inlined.

| Template                  | Preset  | Framework                    |
| ------------------------- | ------- | ---------------------------- |
| `origin-next/`            | Origin  | Next.js (App Router, `src/`) |
| `origin-tanstack-start/`  | Origin  | TanStack Start               |
| `spotify-next/`           | Spotify | Next.js (App Router, `src/`) |
| `spotify-tanstack-start/` | Spotify | TanStack Start               |

Each app is a scaffold plus one page (`src/components/showcase.tsx`) that composes a few installed components. Everything else under `src/components/ui`, `src/hooks`, `src/lib`, plus `components.json`, the Tailwind entry stylesheet, and (on Next.js, for presets with fonts) the `next/font` wiring in `src/app/layout.tsx`, is written by the shadcn CLI. Don't edit those by hand — regenerate.

To look at one:

```bash
cd examples/spotify-next && pnpm install && pnpm dev
```

The apps are not part of the monorepo workspace: each carries its own `pnpm-workspace.yaml` so it installs standalone. Their dependencies never touch the root lockfile, and a `pnpm install` at the monorepo root never pulls in Next.

## Regenerating

Nobody maintains the generated output by hand. When a change to the registry lands on `main`, CI regenerates every template and commits the result (`chore(examples): regenerate templates`), so `examples/` always matches what the registry serves.

To regenerate locally — to look at what a branch produces, or to iterate on the publisher:

```bash
pnpm smoke:examples
```

With no arguments the script builds the registry, serves this checkout with the www dev server (or reuses one you already have running), and for every template: wipes what the CLI wrote, runs `pnpm install`, `shadcn init <origin>/r/init?preset=…`, `shadcn add @dotui/<name>` for every item in `/r/registry.json`, a production build, `tsc --noEmit`, and checks that the theme's fonts survived into the built output. Committing the result is optional; `main` converges on its own.

Against a deployment instead — a Vercel preview, or production:

```bash
pnpm smoke:examples --origin https://dotui-git-my-branch.vercel.app
```

One template only:

```bash
pnpm smoke:examples --example spotify-tanstack-start
```

Two things are normalised so a regeneration only differs when the registry did: `components.json` always points at `https://dotui.org` whatever origin served the run, and `package.json` is kept as committed unless the set of dependencies changed (`pnpm add` would otherwise re-resolve version ranges on every run). The shadcn version is pinned in `scripts/smoke.ts`.

Presets are identified by their encoded design system in the init URL, the same value the create page bakes into `components.json`. The smoke gets it from `www/scripts/encode-preset.ts`, so the encoding always comes from this checkout even when the registry origin is a deployment.

## CI

`.github/workflows/examples.yml` has two sides. On pull requests that touch the registry, the publisher, the `/r/*` routes, presets, or `examples/`, it regenerates each template, builds and type-checks it, and reports the diff against the committed template in the job summary (full patch as an artifact) — so a registry change is reviewable as the consumer-facing files it changes. Drift never fails a PR. On push to `main` it regenerates everything and commits the result. Trigger the workflow manually with an `origin` input to regenerate from a preview URL.

## Adding a template

Copy the scaffold for the framework (or add a new framework scaffold: same `showcase.tsx`, a `typecheck` and `build` script, its own `pnpm-workspace.yaml`, and a `.gitignore` for build artifacts). Register it in `scripts/smoke.ts` (`EXAMPLES`, plus `FRAMEWORKS` for a new framework), add it to the matrix in the workflow, regenerate, and commit.
