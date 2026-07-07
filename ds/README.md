# ds.

A catalog for exploring the best design systems — [ds.dotui.org](https://ds.dotui.org).

Browse the systems worth learning from and see how each one actually works: its
color ramps, tokens, and the conventions that hold it together. No prose walls,
no citations — just the system, laid out so you can poke at it.

It backs [dotUI](https://dotui.org/create), a design-system builder: to recreate
almost any system, we first need to understand what the great ones do.

## How it grows

One axis at a time, one system at a time. Rather than shallow coverage of
everything, each pass goes deep on a single dimension for a few systems.

**Today:** the color system and tokens for shadcn/ui.

Every system in the catalog shows up from day one; it becomes explorable once
its pages are built.

## Development

```sh
pnpm i
pnpm --filter=ds dev   # build the data index, then vite dev
```

Deployed as its own Vercel project on ds.dotui.org.
