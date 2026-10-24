# directory: ds.dotui.org

A directory of how design systems are built: their colors, tokens, type,
shape and components, captured as per-system data and rendered by shared
sections. The data is never typed by hand; [CLAUDE.md](./CLAUDE.md) has the
pipeline rules.

`~/` imports this app, `@/` imports www's source: registry components, the
site stylesheet and the preset engine come straight from there, as in
`video/`.

## Commands

From the repo root:

- `pnpm --filter directory dev`: builds the data index, then vite dev on port 4445.
- `pnpm --filter directory build`: the same, then the production app.
- `pnpm --filter directory snapshot|extract|drift <slug>`: the data pipeline.
- `pnpm --filter directory build:data` / `check:data`: regenerate or validate the data index.
