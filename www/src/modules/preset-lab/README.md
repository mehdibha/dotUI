# Preset lab

Dev-only tooling for tuning a preset against the system it recreates. Nothing here ships: the route is gated on `import.meta.env.DEV`.

## Specimen sheets

`/internal/specimens?preset=<id>&mode=light|dark&sheet=<name>` renders real registry components under the preset, through the same global-mode `DesignSystemProvider` as the studio preview iframe, so color, tokens, fonts, icons and density all apply. Each sheet fits 1280×900: `actions`, `fields`, `selection`, `menu`, `dialog`, `drawer`, `command`, `navigation`, `feedback`, `display`, `dates`, `type`. `/internal/specimens` with no sheet lists every preset × sheet.

## Loop for a preset agent

From `www/`, with your dev server running (`pnpm exec vite dev --port <port>`):

```sh
# 1. Capture: writes .scratch-specimens/<preset>/<sheet>-<mode>.png (DPR 2)
npx tsx scripts/capture-specimens.mts --preset linear --mode both --sheet all --port <port>

# 2. Compare: pairs each reference with its sheet → .scratch-specimens/<preset>/compare-<sheet>.png
npx tsx scripts/compose-refs.mts --preset linear --refs <dir of reference pngs>
```

3. Read the `compare-*.png` files (and the full-resolution sheets when a detail matters), change the preset, recapture the sheets you touched (`--sheet menu`), repeat.

- References are matched to sheets by filename tokens (`buttons-dark.png` → `actions`, dark). Name refs with a component word and a `-light`/`-dark` suffix; unmatched ones land in `compare-unmatched.png` without a specimen.
- Captures freeze animations (loops on frame one, entries at their end) and hide the caret. The `fields` sheet focuses its "focused" input, the `actions` sheet its keyboard-focus Primary, and the `menu` sheet highlights "Billing" via `[data-specimen-focus]`.
- Overlays (menu, select, tooltip, dialog, drawer, command palette, toast) are controlled open. The toast sits at the preset's toast position.
- A new sheet: add a component in `sheets/`, register it in `sheets/index.ts`; the capture script reads the list from the page.

`refs/` holds older component captures from `scripts/capture-refs.mts`; `compose-refs` accepts them too (`--refs src/modules/preset-lab/refs/vercel`).
