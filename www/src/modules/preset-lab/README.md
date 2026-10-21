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
- `targets.json`: `{ "<page url>": { "mode"?, "dark"?, "storage"?, "signedIn"?, "parts": { "<part>": Target } } }`, the elements to probe on each page of the real product (`Page` and `Target` in `probe.ts`). List only pages whose readings are the truth for their parts; cross-checks (a login screen with larger controls) go in `sources.md`.
  - Modes: a page without `mode` is measured in both through `prefers-color-scheme`. A page that switches theme by URL names its dark URL in `dark` (a Storybook theme global), one that shows a single theme sets `mode`, and a next-themes site names its localStorage key (`"storage": "theme"`).
  - `signedIn` pages are measured in the user's Chrome. A key that isn't a URL is a file in the pack's folder: a local harness page that loads the system's published components or CSS from a CDN, for systems whose docs wrap their components in their own chrome.
  - A `Target` finds its element with `selector`, `text`, `within`, `nth` and `surface`. In `selector`, `within`, `box` and `ink`, `a >>> b` looks inside a's shadow root and a leading `>>>` inside the part's own (web components: Material Web, Polaris); a box with no paint also takes it from a covering child in its shadow root. It can add:
    - `focus: true` to tab to it first, `before: [{ "click" | "hover" | "press": … }]` to open a menu or hover a tooltip trigger (Puppeteer selectors: `::-p-text(Options)` matches by text);
    - `box: "::before"` or a child selector where the product paints the box apart from the control, `ink` for a child that carries the text (a nav row's label span);
    - `only: ["backgroundColor", "edge"]` for the props this page owns, or `skip: ["paddingInline"]` for the few the two sides place differently.
- `tokens.json`: `{ "probe": "<commit>", "light": { "<part>": { "<prop>": "<computed value>" } }, "dark": { … } }`, written by `--pack` and `--merge`. Each measured part replaces its stored entry; parts nothing measured this run are kept. Part names follow `SPECIMEN_TARGETS` in `probe.ts` (`button.primary`, `input`, `menu`, `dialog`, …); a pack measures the parts its product shows, not all of them.
- Packs from token tables: a system that publishes its resolved tokens (Material 3's DSM token tables, Carbon themes, Primer primitives) can fill `tokens.json` from them by hand, in the probe's value format, with `"probe": "tokens"` (no probe-version warning). `sources.md` records the table, its build or version, and how it was resolved (platform, theme); a pack can mix token-table parts with measured ones.

Screenshots, crops and compare sheets go to the project's shared files (`presets/<id>/<date>/`), or `.scratch-*` locally.

## Commands

From `www/`, with a dev server running (`pnpm dev:www --port <port>` from the repo root):

```sh
# Capture specimens: .scratch-specimens/<id>/<sheet>-<mode>.png (DPR 2)
pnpm presets:capture --preset linear --mode both --sheet all --port <port>

# Pair reference images with sheets: .scratch-specimens/<id>/compare-<sheet>.png
pnpm presets:compare --preset linear --refs <dir of reference pngs>

# Measure the specimens and diff them against refs/<id>/tokens.json, then list
# what moved since the previous run (or --baseline <measures.json>)
pnpm presets:measure --preset linear --port <port>

# Measure every public page of a pack (4 at a time) into refs/<id>/tokens.json
pnpm presets:measure --pack linear [--url <one page>]

# The probe for a signed-in tab driven by Claude in Chrome: one expression for
# the plain parts, then one per focus or `before` part with its steps. Save each
# JSON result and merge it into tokens.json
pnpm presets:measure --snippet --pack linear --url <page>
pnpm presets:measure --pack linear --url <page> --merge <file> --mode dark

# Try targets on any page before adding it to a pack: prints its measures
pnpm presets:measure --url <page> --targets <file> --mode dark

# Every axis, and where each of the preset's values comes from
pnpm presets:catalog --preset linear [--chapter buttons]
```

- References match sheets by filename: the first word that names a component decides the sheet (`segmented-display-popover-dark.png` → `actions`, dark). Start names with the component word and end with `-light`/`-dark`; unmatched ones land in `compare-unmatched.png`.
- `measure` reads the same computed styles from both sides and passes a property within tolerance: radius ±1px (two radii that round the whole end of their box match), edge and ring widths ±0.25px, ring offset ±1px, height and padding ±2px, color ΔE ≤ 0.02 in OKLab, weight ±30, same first font family (`system-ui`, `ui-sans-serif`, `-apple-system` and `BlinkMacSystemFont` are one). Translucent and clear colors are read as they show, composited over the backgrounds under them, so a clear button on white reads white. Borders are read as `edge`, and spread-only shadow layers as `edge` or `ring`, so a system drawing lines with rings compares with one drawing borders. `edge` is the hairline around a box wherever it is drawn: a border, a ring (a spread-only box-shadow), or either on `::before`/`::after`; a border on some sides only names them (`1px … bottom`), and those must match too. A box with no fill of its own takes its paint from a child that covers it (a selected tab's indicator), else from a `::before`/`::after` that covers most of it. `ring` is the focus ring on focused parts (`button.focus`, `input.focus`): an outline, the outermost box-shadow ring, or the topmost inset ring merged with a border of its color, always with a signed offset (an inset outline is `-2px`). A focus line inset flush with the outer edge (Linear's 1px outline at `-1px`, Carbon's 2px inset) reads as the edge instead, so it matches a field whose border turns the accent color; `ring` is left for lines off the edge. Parts the specimens don't show are listed apart from the off count. Leave a property out of `tokens.json` when the two sides put it in different places (Linear pads the menu row, dotUI pads inside the item's inset). Marketing pages run larger than the app; measure app controls at their default size.
- Every measure prints the probe commit (`probe.ts` + `compare.ts`). Off counts and tokens from different probe versions don't compare; `--preset` says when the reference is older.
- The off count hides magnitude, so `--preset` also lists every row that moved since the previous run (`fixed`, `broke`, `closer`, `further`, `changed`). For a before/after of a whole change, save `measures.json` before editing and pass it as `--baseline`.
- In ad-hoc Puppeteer scripts, pass `page.evaluate` a string expression (like `snippet()` returns), not a function: tsx injects a `__name` helper the page doesn't have.
- `capture-refs.mts` captures Geist docs showcases into `.scratch-refs/` (older, manifest-driven).
- Cloud sessions: install with `PUPPETEER_SKIP_DOWNLOAD=1 pnpm install` and point Puppeteer at the preinstalled Chromium: `export PUPPETEER_EXECUTABLE_PATH=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell | head -1)`. The scripts add `--no-sandbox` when they run as root. The network policy may block product hosts; measure those through Claude in Chrome instead.
