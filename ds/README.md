# ds. — design systems research

**ds.dotui.org** studies the best design systems in the world — Radix, Material, Spectrum, Linear, Stripe, Geist… — to understand what actually makes them good.

## Why

dotUI is a design-system builder ([dotui.org/create](https://dotui.org/create)). For it to be able to recreate almost any design system, we need to know what the great ones actually do: how they generate color palettes, what they tokenize, how they guarantee contrast, how they build focus rings. This site is that research, published. Findings drive what the builder supports — never the other way around.

V1 covers **color & token systems only**, across ~15 curated systems ([data/roster.json](data/roster.json)). Other dimensions (typography, density, focus rings, component variants) come later on the same machinery.

## How it works

- One folder per system in [data/systems/](data/systems/): `system.json` (identity, sources, dates) + `colors.json` (ramps, token groups, layers, focus, contrast). Zod-validated — `pnpm --filter=ds check:data`.
- The site renders that data as **exploration pages**: swatch ramps, searchable token tables, playgrounds — not prose. Every fact carries source URLs and a date; reverse-engineered facts (e.g. Linear's shipped CSS) are labeled as observed, not official.
- No database. Git is the source of truth; a build step compiles the data into a static index.
- The site's UI is installed from the dotUI registry via the shadcn CLI — we dogfood our own product, and installation bugs get fixed upstream ([DOGFOOD.md](DOGFOOD.md)).

## Order of work

The full roster is on the site from day 1 — every system shows as `planned` until it becomes explorable.

1. **V1 = Radix only.** Design the site and build all of Radix's exploration pages, playgrounds, showcase, and interactive widgets. Going deep on one system decides what data we actually need — and what "done" looks like for every other system.
2. Freeze that data shape.
3. Research the rest of the roster, one system per session/PR.
4. Cross-system analysis and comparison pages.

## Development

```sh
pnpm i
pnpm --filter=ds dev        # builds the data index, then vite dev
pnpm --filter=ds check:data # validate data against the schema
```

Deployed as its own Vercel project (`dotui-ds`) on ds.dotui.org.

Planning history lives in `docs/plans/2026-07-03-ds-research-site/`; lessons from the scrapped first data model are in [data/RETRO.md](data/RETRO.md).
