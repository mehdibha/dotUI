# Preset lab

The www half of tuning a preset against the system it recreates, in dev and on Vercel previews: the specimen sheets that render a preset, and the fit that searches studio states against a pack. Nothing here ships to dotui.org: the routes are gated on `INTERNAL_PAGES` (`../internal/enabled.ts`). What the real product measures (reference packs, the probe, the census, models, frozen copies, the pixel probe, drift, system looks) is [`@dotui/capture`](../../../../packages/capture/README.md), which also lists every `presets:*` command. The process around both (fidelity bar, decision order, definition of done) is in [`../presets/README.md`](../presets/README.md).

## Specimen sheets

`/internal/specimens?preset=<id>&mode=light|dark&sheet=<name>` renders real registry components under the preset, through the same global-mode `DesignSystemProvider` as the studio preview iframe, so color, tokens, fonts, icons and density all apply. Each sheet fits 1280×900: `actions`, `fields`, `selection`, `menu`, `dialog`, `drawer`, `command`, `navigation`, `feedback`, `display`, `dates`, `type`. `/internal/specimens` with no sheet lists every preset × sheet.

- Captures freeze animations (loops on frame one, entries at their end) and hide the caret. The `fields` sheet focuses its "focused" input, the `actions` sheet its keyboard-focus Primary, and the `menu` sheet highlights "Billing" via `[data-specimen-focus]`.
- Overlays (menu, select, tooltip, dialog, drawer, command palette, toast) are controlled open. The toast sits at the preset's toast position.
- Each `Cell` carries `data-cell="<label>"`, so probes can target a specimen by its label.
- A new sheet: add a component in `sheets/`, register it in `sheets/index.ts`; the capture script reads the list from the page.
- `&diff=<json>` merges a partial studio state over the preset (parsed like a saved one), and `await window.__specimen.setDiff(diff)` swaps it without a reload, resolving once the new design has rendered, for scripts that try one change at a time.

## Fit

`pnpm presets:fit --pack <id> [--preset <id>]` (`scripts/fit-preset.ts`) searches the studio state whose specimens read closest to the pack's reference, dev server running. Each candidate (every option of every enum and boolean key, numbers coarse then fine) renders for real through `__specimen.setDiff` and is scored on every row: 0 when ok, 1 to 2 when off by how far. A sensitivity map (each option set alone on Origin: which rows it moves, `.scratch-specimens/sensitivity-<build>.json`, rendered once per registry, studio and probe version) skips candidates that touch no off row and limits each render to the sheets it can change. Each round keeps the best change, then others on other rows while the full render still scores lower.

- It prints the changes kept (rows fixed and broken), the preset's full draft diff, and the residual off rows by look; `--write-gaps` replaces the pack's `fit` entries in `gaps.json` with them. `--keys a,b*` narrows the search; `--preset origin` starts a new preset from the defaults.
- Color and font keys are left out: the color engine is queued for a rewrite, and fonts are catalog picks with stand-ins. The draft is a starting point a preset thread reviews, never applied as is: a change that fixes rows on the specimens can still be wrong for the product (a radius that matches buttons by bending cards).
- Don't edit files the specimens page imports during a run: the dev server reloads the tabs. A tab that reloads or stops answering (each step times out by name) is opened again; a candidate that fails twice is skipped and logged. The map is saved every ten keys, so a stopped run on a clean tree picks up where it left off; with uncommitted edits it renders the map afresh.
- On GitHub (152 keys, about 6 minutes for the map, 4 rounds after it) it took 85 off rows to 80: `roleSurface: lg` (the segmented control's radius, at the cost of the menu's), tonal surface layers, accent links and the halo input focus, each a change for the GitHub thread to judge. The rest are looks with no axis, which `--write-gaps` files.
