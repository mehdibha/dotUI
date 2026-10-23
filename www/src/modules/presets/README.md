# Presets

A built-in preset recreates a real design system (Linear, Vercel, Polaris…) as a diff over Origin, the builder defaults. Every preset is kept and more will be added, so each review should also leave the next preset cheaper: measurements land in a reference pack, gaps land in the ledger, nothing is re-researched from zero.

The steps are the `preset` skill (`.claude/skills/preset/SKILL.md`); the tools are in [`../preset-lab/README.md`](../preset-lab/README.md).

## The bar

- **Recognizable at a glance** on every specimen sheet, in light and dark, next to the real product. High fidelity, not a pixel clone.
- **Measured, not guessed.** Values come from the product's computed styles or its published tokens, recorded in `preset-lab/refs/<id>/`. Popular reputations mislead: "dense" Vercel and Linear both measure at our default density.
- **Free stand-ins** for proprietary fonts and icon sets, named in a comment. No protected brand assets.
- **One mode in the product:** derive the other so it keeps the product's character, and say so in a comment.

## A preset file

`<id>.ts` calls `definePreset` with `id`, `name`, a one-phrase `description` of the look, a `swatch` legible on light and dark, `inspiredBy`, and the `diff`. `linear.ts` is the reference shape.

- Group the diff in panel order under section comments: Style, Color, Typography, Icons, Shape, Surfaces, States, then the component chapters.
- Hold only what differs from Origin and from the Style's column. Write effective values: no rule may fire. `presets.test.ts` enforces all three.
- Comment a value when it isn't obvious: the measured value it comes from (`// Content panel #f8f8f9 / #111212.`) or `// Stand-in: …`. Sources and dates belong in the pack's `sources.md`, not in comments.
- A new preset is also added to `PRESETS` in `index.ts` (picker order).

## Decision order

1. **Style**, the material: Flat, Tactile or Chunky. Use the swap test in `studio/axes/core/README.md`.
2. **Color:** brand, neutral tint, `lightBg`/`darkBg`, status seeds, which components paint with the brand.
3. **Type:** fonts, UI text size, title style, label weight.
4. **Shape and density:** base radius, role radii, density.
5. **Surfaces and states:** layers, edges, shadows, focus, disabled.
6. **Components**, chapter by chapter. `pnpm --filter www presets:catalog --preset <id>` lists every key with its options (and the systems each option comes from) and where the preset's value comes from. Keys still at `default` need an explicit look, not an assumption.

## When no axis fits

1. Search the catalog first: most gaps turn out to be an existing key set wrong.
2. Use the closest value with a `// Stand-in: …` comment.
3. Comment on the [preset gap ledger](https://github.com/mehdibha/dotUI/issues/1020): one look per comment, or your system added to an existing row. Comments get folded into its table; never edit the body, since other reviews write at the same time.
4. Never add a token, an override or an axis inside a preset PR. A row becomes an axis proposal, in its own issue, once three systems need it, or two including a north-star system (Material, Geist, Linear). Adding an axis is Mehdi's call (CLAUDE.md).
5. Component bugs found along the way get their own issue.

## Where things live

| What                                                              | Where                                                              |
| ----------------------------------------------------------------- | ------------------------------------------------------------------ |
| The preset                                                        | `presets/<id>.ts`                                                  |
| Reference pack: `sources.md`, `targets.json`, `tokens.json`       | `preset-lab/refs/<id>/` (text only)                                |
| Screenshots, crops, compare sheets                                | The project's shared files, `presets/<id>/<date>/`; never git      |
| Review page: real product next to dotUI, measured diff, open gaps | One project artifact per preset, listed in the preset tracker      |
| Looks with no axis                                                | [Preset gap ledger](https://github.com/mehdibha/dotUI/issues/1020) |

## Done

- `pnpm test`, `pnpm typecheck` and `pnpm check` pass.
- The reference pack is committed and covers the parts the product shows.
- `pnpm --filter www presets:measure --preset <id>` shows nothing off that a preset value could fix; whatever remains has a stand-in comment or a ledger row.
- All 12 sheets are captured in both modes and compared; the review artifact and the tracker row are updated.
- `pnpm build:registry` ran after the last preset edit and its `presets/__generated__/catalog.ts` is committed (CI's registry-drift job checks it).
- Origin and Spotify have example templates: after changing either, run `pnpm smoke:examples` and commit `examples/`. CI regenerates the cover for any preset.
