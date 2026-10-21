# Preset lab

Dev-only tooling for tuning a preset against the system it recreates. Nothing here ships: the route is gated on `import.meta.env.DEV`. The process around it (fidelity bar, decision order, definition of done) is in [`../presets/README.md`](../presets/README.md).

## Specimen sheets

`/internal/specimens?preset=<id>&mode=light|dark&sheet=<name>` renders real registry components under the preset, through the same global-mode `DesignSystemProvider` as the studio preview iframe, so color, tokens, fonts, icons and density all apply. Each sheet fits 1280×900: `actions`, `fields`, `selection`, `menu`, `dialog`, `drawer`, `command`, `navigation`, `feedback`, `display`, `dates`, `type`. `/internal/specimens` with no sheet lists every preset × sheet.

- Captures freeze animations (loops on frame one, entries at their end) and hide the caret. The `fields` sheet focuses its "focused" input, the `actions` sheet its keyboard-focus Primary, and the `menu` sheet highlights "Billing" via `[data-specimen-focus]`.
- Overlays (menu, select, tooltip, dialog, drawer, command palette, toast) are controlled open. The toast sits at the preset's toast position.
- Each `Cell` carries `data-cell="<label>"`, so probes can target a specimen by its label.
- A new sheet: add a component in `sheets/`, register it in `sheets/index.ts`; the capture script reads the list from the page.

## Reference packs

`refs/<id>/` holds what the real product measures, as text only. Images never go in git.

- `sources.md`: what was captured, from which page or app screen, when, and in which modes. Link official token sources (Primer primitives, Carbon themes, Polaris tokens, Material color utilities, Radix colors) when the system publishes them.
- `targets.json`: `{ "<page url>": { "<part>": Target } }`, the elements to probe on each page of the real product (see `Target` in `probe.ts`). The next review re-measures in one pass.
- `tokens.json`: `{ "light": { "<part>": { "<prop>": "<computed value>" } }, "dark": { … } }`. Part names follow `SPECIMEN_TARGETS` in `probe.ts` (`button.primary`, `input`, `menu`, `dialog`, …); a pack measures the parts its product shows, not all of them.

Screenshots, crops and compare sheets go to the project's shared files (`presets/<id>/<date>/`), or `.scratch-*` locally.

## Commands

From `www/`, with a dev server running (`pnpm dev:www --port <port>` from the repo root):

```sh
# Capture specimens: .scratch-specimens/<id>/<sheet>-<mode>.png (DPR 2)
pnpm presets:capture --preset linear --mode both --sheet all --port <port>

# Pair reference images with sheets: .scratch-specimens/<id>/compare-<sheet>.png
pnpm presets:compare --preset linear --refs <dir of reference pngs>

# Measure the specimens and diff them against refs/<id>/tokens.json
pnpm presets:measure --preset linear --port <port>

# The probe as one JS expression, for a signed-in tab driven by Claude in Chrome
pnpm presets:measure --snippet --targets <targets file>

# Measure a public page headless (no sign-in)
pnpm presets:measure --url <url> --targets <targets file> --mode dark

# Every axis, and where each of the preset's values comes from
pnpm presets:catalog --preset linear [--chapter buttons]
```

- References match sheets by filename tokens (`buttons-dark.png` → `actions`, dark). Name them with a component word and a `-light`/`-dark` suffix; unmatched ones land in `compare-unmatched.png`.
- `measure` reads the same computed styles from both sides and passes a property within tolerance: radius ±1px, height and padding ±2px, color ΔE ≤ 0.02 in OKLab, weight ±30, same first font family. Marketing pages run larger than the app; measure app controls at their default size.
- `capture-refs.mts` captures Geist docs showcases into `.scratch-refs/` (older, manifest-driven).
- Cloud sessions: install with `PUPPETEER_SKIP_DOWNLOAD=1 pnpm install` and point Puppeteer at the preinstalled Chromium: `export PUPPETEER_EXECUTABLE_PATH=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell | head -1)`. The scripts add `--no-sandbox` when they run as root. The network policy may block product hosts; measure those through Claude in Chrome instead.
