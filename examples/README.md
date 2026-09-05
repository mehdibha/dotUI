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

The generated output is committed with the registry change that caused it, like every other generated file in the repo. Touched the registry, the publisher, presets, or `/r/*`? Regenerate and commit `examples/`:

```bash
pnpm smoke:examples                              # all four templates, ~5 min
pnpm smoke:examples --example spotify-next       # one template
pnpm smoke:examples --no-build                   # write the files, skip build + typecheck
```

With no arguments the script builds the registry, serves this checkout with the www dev server (or reuses one you already have running), and for every template: wipes what the CLI wrote, runs `pnpm install`, `shadcn init <origin>/r/init?preset=…`, `shadcn add @dotui/<name>` for every item in `/r/registry.json`, a production build, `tsc --noEmit`, and checks that the theme's fonts survived into the built output. It runs offline: the CLI's own base files (its style list and base color) are answered from `scripts/shadcn-base/`, vendored from [shadcn-ui/ui](https://github.com/shadcn-ui/ui/tree/main/apps/v4/public/r), through the CLI's `REGISTRY_URL` override — so a sandboxed agent session can regenerate too, and CI and a laptop produce the same bytes. If the CLI ever fetches a file that isn't vendored, the run logs `shadcn-base: no vendored file for …` and fails; add the file from the same place.

Never hand-edit or hand-merge `examples/`: if two registry branches conflict there, regenerate on the merged result.

Against a deployment instead — a Vercel preview, or production:

```bash
pnpm smoke:examples --origin https://dotui-git-my-branch.vercel.app
```

Two things are normalised so a regeneration only differs when the registry did: `components.json` always points at `https://dotui.org` whatever origin served the run, and `package.json` is kept as committed unless the set of dependencies changed (`pnpm add` would otherwise re-resolve version ranges on every run). The shadcn version is pinned in `scripts/smoke.ts`.

Presets are identified by their encoded design system in the init URL, the same value the create page bakes into `components.json`. The smoke gets it from `www/scripts/encode-preset.ts`, so the encoding always comes from this checkout even when the registry origin is a deployment.

## Live preview while working

To see real consumer output on every save, without the CLI:

```bash
pnpm examples:preview --example spotify-tanstack-start --watch   # terminal 1
cd examples/spotify-tanstack-start && pnpm install && pnpm dev   # terminal 2
```

`examples:preview` runs the publisher in-process for every item, exactly as `/r/<name>` serves it, and writes the files where the CLI would put them, plus the stylesheet rendered from the init item's CSS fields; `--watch` re-runs on changes under `www/src/registry` and `www/src/publisher`, so the template's dev server hot-reloads the real components. Component files come out byte-identical to what the CLI installs. The stylesheet does not: `shadcn init` merges the same fields into the consumer's file in its own layout and wires the preset's fonts per framework, which the preview skips. It is a preview of the output, never the output itself — regenerate with `pnpm smoke:examples` before committing, and don't commit what the preview wrote.

## CI

`.github/workflows/examples.yml` runs on every pull request and merge-group run. It decides in-job whether the change can reach consumer output (the registry, the publisher, `/r/*`, presets, `packages/colors`, `examples/`); if so, one job per template regenerates it from scratch with the real CLI, builds, type-checks, and then requires the result to match what is committed. A stale template fails the check, with the diff in the job summary and the full patch as an artifact: run `pnpm smoke:examples` and commit. Nothing is committed by CI. Trigger the workflow manually with an `origin` input to regenerate from a preview URL.

## Adding a template

Copy the scaffold for the framework (or add a new framework scaffold: same `showcase.tsx`, a `typecheck` and `build` script, its own `pnpm-workspace.yaml`, and a `.gitignore` for build artifacts). Register it in `scripts/smoke.ts` (`EXAMPLES`, plus `FRAMEWORKS` for a new framework) and in `www/scripts/preview-example.ts`, add it to the matrix in the workflow, regenerate, and commit.
