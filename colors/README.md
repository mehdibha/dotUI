# colors — colors.dotui.org

An interactive learning path teaching the color concepts needed to build a
state-of-the-art design-system color engine — perception, OKLCH, gamut,
contrast, ramps, tokens.

TanStack Start + Vite, React Aria Components, Tailwind v4. Chapters are MDX,
wired through fumadocs-mdx; each chapter has an interactive playground.

## Structure

- `content/chapters/*.mdx` — chapter prose + imported playgrounds. The filename
  (no numeric prefix) is the slug; it must match `curriculum.ts`.
- `src/config/curriculum.ts` — the single source of truth for the learning
  path: parts, chapters, order, and published/planned status.
- `src/routes/index.tsx` — home: hero + curriculum listing.
- `src/routes/$slug.tsx` — a chapter page (fumadocs loader + MDX render).
- `src/components/playgrounds/` — the interactive playgrounds.
- `src/ui/` — the vendored React Aria component kit.

## Commands

- `pnpm --filter colors dev` — dev server (port 4446). Runs `fumadocs-mdx`
  first to generate `.source`.
- `pnpm --filter colors build` / `preview`.
- `pnpm --filter colors typecheck`.

## Adding a chapter

1. Set the chapter's `status` to `published` in `src/config/curriculum.ts`.
2. Add `content/chapters/<slug>.mdx` with matching frontmatter
   (`title`, `description`, `part`, `question`).
3. Import and place its playground inside the MDX.
