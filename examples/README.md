# Consumer examples

Bare framework apps that install dotUI the way a user does — `shadcn init` against the registry, then `shadcn add` — so the CLI path gets exercised end to end, not just the JSON the registry serves.

| Example     | Framework                    | Where components land |
| ----------- | ---------------------------- | --------------------- |
| `next/`     | Next.js (App Router, `src/`) | `src/components/ui/`  |
| `tanstack/` | TanStack Start               | `src/components/ui/`  |

Each app is a scaffold plus one page (`src/components/showcase.tsx`) that composes a few installed components. Nothing the CLI writes is committed: `components.json`, `src/components/ui`, `src/hooks`, `src/lib` and the Tailwind entry stylesheet (which `shadcn init` appends the theme to) are gitignored and regenerated on every run. Until you run the smoke, the showcase imports are unresolved on purpose.

The apps are not part of the monorepo workspace: each carries its own `pnpm-workspace.yaml` so it installs standalone. Their dependencies never touch the root lockfile, and a `pnpm install` at the monorepo root never pulls in Next.

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

One example only:

```bash
pnpm smoke:examples --example tanstack
```

Per example the script wipes generated files, runs `pnpm install`, `shadcn init <origin>/r/init`, `shadcn add @dotui/<name>` for every item in `<origin>/r/registry.json`, then a production build and `tsc --noEmit`. The shadcn version is pinned in `scripts/smoke.ts`.

After a run you can `pnpm dev` inside an example to look at the result. The run also leaves each example's `package.json` modified — the CLI adds the components' npm dependencies to it, as it would in any project. `git checkout examples` resets the scaffolds.

## CI

`.github/workflows/examples.yml` runs the smoke for each example on pull requests that touch the registry, the publisher, the `/r/*` routes, or `examples/`. It serves the branch's registry with the www dev server. Trigger it manually with an `origin` input to run against a preview URL.

## Adding a framework

Add a directory with the scaffold, the same `showcase.tsx`, a `typecheck` and `build` script, its own `pnpm-workspace.yaml`, and the `.gitignore` block for generated files. Then register it in `scripts/smoke.ts` (`EXAMPLES` and its stylesheet seed) and add it to the matrix in the workflow.
