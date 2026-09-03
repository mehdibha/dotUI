# Consumer templates

Bare framework apps that install dotUI the way a user does — `shadcn init` against the registry with a preset baked in, then `shadcn add` — so the CLI path gets exercised end to end, not just the JSON the registry serves. One template per preset × framework:

| Template                  | Preset  | Framework                    | Where components land |
| ------------------------- | ------- | ---------------------------- | --------------------- |
| `origin-next/`            | Origin  | Next.js (App Router, `src/`) | `src/components/ui/`  |
| `origin-tanstack-start/`  | Origin  | TanStack Start               | `src/components/ui/`  |
| `spotify-next/`           | Spotify | Next.js (App Router, `src/`) | `src/components/ui/`  |
| `spotify-tanstack-start/` | Spotify | TanStack Start               | `src/components/ui/`  |

Each app is a scaffold plus one page (`src/components/showcase.tsx`) that composes a few installed components. Nothing the CLI writes is committed: `components.json`, `src/components/ui`, `src/hooks`, `src/lib` and the Tailwind entry stylesheet (which `shadcn init` appends the theme to) are gitignored and regenerated on every run. Until you run the smoke, the showcase imports are unresolved on purpose.

The apps are not part of the monorepo workspace: each carries its own `pnpm-workspace.yaml` so it installs standalone. Their dependencies never touch the root lockfile, and a `pnpm install` at the monorepo root never pulls in Next.

Presets are identified by their encoded design system in the init URL (`/r/init?preset=…`), the same value the create page bakes into `components.json`. The smoke gets it from `www/scripts/encode-preset.ts`, so the encoding always comes from this checkout even when the registry origin is a deployment.

## Run

Against a local dev server (serves this checkout's registry):

```bash
pnpm dev:www
pnpm smoke:examples
```

Against a deployment — a Vercel preview, or production:

```bash
pnpm smoke:examples --origin https://dotui-git-my-branch.vercel.app
```

One template only:

```bash
pnpm smoke:examples --example spotify-tanstack-start
```

Per template the script wipes generated files, runs `pnpm install`, `shadcn init <origin>/r/init?preset=…`, `shadcn add @dotui/<name>` for every item in `<origin>/r/registry.json`, then a production build and `tsc --noEmit`. After the build it also checks that every `@import url()` in the stylesheet survived into the built CSS (bundlers drop a misplaced import silently instead of failing), and, when the preset ships fonts, that the CLI wired them the framework's way — `next/font/google` in the Next.js root layout, an `@fontsource` import elsewhere — and that the faces made it into the built CSS. The shadcn version is pinned in `scripts/smoke.ts`.

After a run you can `pnpm dev` inside a template to look at the result. The run also leaves each template's `package.json` modified (the CLI adds the components' npm dependencies) and, on Next.js with a preset that ships fonts, `src/app/layout.tsx` (the CLI wires `next/font/google` there), as it would in any project. `git checkout examples` resets the scaffolds.

## CI

`.github/workflows/examples.yml` runs the smoke per template on pull requests that touch the registry, the publisher, the `/r/*` routes, or `examples/`. It serves the branch's registry with the www dev server. Trigger it manually with an `origin` input to run against a preview URL.

## Adding a template

Copy the scaffold for the framework (or add a new framework scaffold: same `showcase.tsx`, a `typecheck` and `build` script, its own `pnpm-workspace.yaml`, and the `.gitignore` block for generated files). Then register it in `scripts/smoke.ts` (`EXAMPLES`, plus `STYLESHEET` for a new framework) and add it to the matrix in the workflow.
