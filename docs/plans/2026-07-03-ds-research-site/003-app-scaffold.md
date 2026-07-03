# 003 — `ds/` app scaffold, dogfooded UI, data build pipeline

Planned at `9c86ac02`. Independent of 001/002 (needs only the schema's rough shape from [002](002-schema-and-question-bank.md)); runs in parallel. Read [README.md](README.md) Phase 0 first.

## Goal

A deployable, near-empty but real site: new TanStack Start app `ds/` in the workspace, its own Vercel project on **ds.dotui.org**, UI installed from the dotUI registry (dogfooding), and the data build pipeline (validate → index) wired into the monorepo's turbo/CI conventions.

## Decisions baked in

- **Folder `ds/` at repo root**, sibling of `www/` (matches the existing `www` naming-by-host convention). Package name `ds`, private.
- Same stack as `www`: TanStack Start + Vite, Tailwind v4, React 19 — all via `catalog:` versions so the two apps can't drift.
- **Own Vercel project** (`dotui-ds` or similar) rooted at `ds/`, domain `ds.dotui.org`. Independent deploys from `www` — that isolation is the reason it's a separate app.
- **Dogfooding**: components come from the dotUI registry via the shadcn CLI (`shadcn add`) against the production registry (or a local registry build during dev) into `ds/src/components/ui/`. This is deliberate end-to-end product testing: **every friction point is a product bug — fix it in the registry/publisher (as its own PR), don't work around it in `ds/`** (maintainer-approved). Do NOT import from `www/src/registry/*` across workspaces; that bypasses exactly the pipeline we want to test.
- No fumadocs for v1 unless a concrete need appears — content is data-driven pages + plain MDX, not a docs tree.

## Steps

1. **Workspace wiring**: add `- ds` to `pnpm-workspace.yaml` `packages`; create `ds/package.json` (scripts mirroring `www`: `dev`, `build`, `typecheck`), extend `turbo.json` only if task shapes differ; add root convenience scripts `dev:ds`, `build:ds`.
2. **App skeleton**: TanStack Start entry, root route with the **"ds." wordmark** header, footer disclosure line ("Built by dotUI. The builder follows this research — not the reverse."), 404, base theme. Keep the shell spartan; content carries the site.
3. **Dogfood install**: `shadcn` init against the dotUI registry; install the initial kit (button, link, tabs, table, tooltip, popover, kbd, badge…). Log every rough edge into a running list; file/fix registry bugs separately.
4. **Data pipeline**: `ds/src/data/schema.ts` (zod, from 002), `ds/data/` content tree, and a build step that (a) validates every `systems/<slug>/` against the schema — CI-fatal on violation, missing evidence, or unknown `questionId` — and (b) emits a static index (one JSON: all systems × all facts + question bank) consumed by routes at build time. Client-side search over the same index (orama/fuse) — no server, no service.
5. **Routes (empty-state versions)**: `/` (mission + roster grid with published/planned status), `/systems/$slug` (profile shell), `/topics/$slug` (topic shell), `/methodology` (from 001's report). Prerender everything prerenderable; the site is static-first.
6. **CI/conventions**: `pnpm check`, `typecheck` green across the workspace; data validation runs in `test` or a dedicated turbo task; Vercel project + domain configured and a hello-world deploy live on ds.dotui.org.

## Done criteria

- `pnpm dev:ds` serves the shell locally; `pnpm build` (turbo) builds both apps; `check` + `typecheck` green.
- ds.dotui.org serves the deployed shell over the real domain.
- Pilot data from 002 (once merged) renders on a profile shell page with citations + verified-dates visible — proving the data→index→UI path end-to-end.
- A "dogfood friction log" exists (in the PR description or `docs/research/`) with each registry/CLI issue found, and fixes filed or landed separately.

## STOP conditions

- If dogfood installation is blocked by a registry/publisher bug that can't be fixed in a reasonable side PR, STOP and surface it — do not vendor/hand-copy components as a workaround (that silently kills the dogfood value).
- If sharing code with `www` becomes tempting (layouts, utils), STOP and prefer duplication or a small `packages/` extraction — never `ds` → `www/src/*` imports.
