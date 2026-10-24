# @dotui/capture

Reads what a real product looks like, so a preset can be measured against it: the probe and the diff, reference packs, the census and the model behind it, frozen copies, the pixel probe, drift, and each system's `looks.json` for its doc page. It depends on `@dotui/colors` only and never imports www. www renders the presets side (the specimen sheets and the fit, in [`www/src/modules/preset-lab`](../../www/src/modules/preset-lab/README.md)); the process around both is in [`www/src/modules/presets/README.md`](../../www/src/modules/presets/README.md).

- `src/`: the modules (`probe.ts`, `compare.ts`, `census.ts`, `model.ts`, `looks.ts`, `fit.ts`, `pixel.ts`, `snapshot.ts`, `system-looks.ts`), imported as `@dotui/capture/<module>`. `sheets.ts` names the specimen sheets the probe's targets sit on; www's `SHEETS` must match it.
- `refs/<id>/`: one reference pack per preset.
- `scripts/`: the capture commands and what they share (`preset-pages.ts`: paths, the probe id, the browser, page steps). The probe id is the newest commit that changed `probe.ts` or `compare.ts`, exact moves left out, so moving a file never makes a new probe. The `presets:*` commands in `www/package.json` run them from `www/`, where `.scratch-refs/` lives.

## Frozen copies

A part file (`<part>-<mode>.json`, `PartFile` in `snapshot.ts`) holds a frozen copy of one part of the real product, beside its crop (`<part>-<mode>.png`): the part's DOM with its computed styles inlined, pseudo-elements and shadow roots included. A copy stays sharp at any zoom and its text can be redacted; a crop is what the screen showed. `--shots` writes both, copies for parts up to 640×480, and so does the local capture kit for signed-in pages, its copies always redacted ([`scripts/local-capture/RUNBOOK.md`](scripts/local-capture/RUNBOOK.md)). They stay in `crops/` folders under `.scratch-refs/<id>/`, never in git.

`snapshotSnippet()` is the in-page expression that makes a copy. `redact: true` turns letters into x, digits into 0 and images into gray boxes, and drops every `url()` that points outside the copy. A copy loads its fonts from their original URLs.

## Reference packs

`refs/<id>/` holds what the real product measures, as text only. Images never go in git.

- `sources.md`: what was captured, from which page or app screen, when, and in which modes. Link official token sources (Primer primitives, Carbon themes, Polaris tokens, Material color utilities, Radix colors) when the system publishes them.
- `targets.json`: `{ "<page url>": Page }`, the elements to probe on each page of the real product (`Page` and `Target` in `probe.ts`). Keys are exact URLs: notes go in `sources.md`, and a `#hash` lists one page twice. A `signedIn` page is never loaded headless, only named by `--merge --url`, so its key writes account segments as placeholders (`https://vercel.com/<team>/<project>/settings/environment-variables`), which keeps the account's slugs out of the repo. List only pages whose readings are the truth for their parts; cross-checks (a login screen with larger controls) go in `sources.md`.
  - Modes: a page without `mode` is measured in both through `prefers-color-scheme` (a next-themes site whose default is "system" needs nothing more). A page that switches theme by URL names its dark URL in `dark` (a Storybook theme global), one that shows a single theme sets `mode`, and a next-themes site pinned to a theme names its localStorage key (`"storage": "theme"`). Each page runs in its own browser context, so pages measured side by side don't share a theme.
  - `steps` walk to the page's state after each load (a lesson behind onboarding clicks), `settle` waits longer after load for an app that ignores clicks until it hydrates (1500ms by default; claude.ai's hash-routed Settings dialog needs 5000), and `width` pins the viewport where the product's type scale has a breakpoint (1440 by default). The page reloads through `about:blank` (a goto that changes only the hash keeps the document; do the same between hash-routed pages in a signed-in pass) and replays `steps` before each part with `before` steps, so the walk has to land in the same state every time; a walk that changes server or cookie state (Duolingo's guest onboarding) goes in separate page keys with plain parts.
  - `signedIn` pages are measured in the user's Chrome. A key that isn't a URL is a file in the pack's folder: a local harness page. Look for one before asking for a signed-in browser: a public login or help page often ships the design system's CSS (Spotify's Encore; its dark theme is a second stylesheet, so load both), an app with no docs often ships its component classes in every page's stylesheet (grep the CSS for a class prefix: Higgsfield's `.q-*` and `--hf-*`, laid out in `refs/higgsfield/q.html`; those stylesheet URLs carry build hashes and go stale on each deploy, so `sources.md` says where to re-read them, the stylesheet links in any page's head), a library with no live docs loads from esm.sh (`refs/polaris/react.html`; a large package needs `?bundle` and an import map that keeps react, react-dom and its theming package external, or its hundreds of modules stall navigation), docs that embed the real renderer (Stripe Apps docs render Sail) can be measured as they are, and a product's public share pages often run the app's own renderer (notion.site templates ship Notion's top bar, sidebar, database views, menus, tooltips and search palette, and open a database item in center or side peek with `?p=<id>&pm=c` or `pm=s`, which waits on `{ "wait": ".notion-peek-renderer .notion-scroller" }`: public dialog and drawer references). A harness renders the system's own components, which the product may not ship (Encore's 28×16 switch against the web player's 42×24 Settings switch, and its legacy buttons): its parts stay provisional until a real page confirms them, and move to the real page when one shows the part. On pages users write, such as templates, type and link styles are the author's choice: take those from the vendor's own pages. One harness file can serve both modes: key the pages `encore.html#light` and `encore.html#dark` and let its script pick the theme from `location.hash`. A harness can set what the product's script would (Higgsfield's tab indicator reads `--active-tab-*` variables set from JS), and an attribute once it has rendered, for a `{ "wait": … }` step. Load a harness's stylesheets from unpkg: headless Chrome blocks cdn.jsdelivr.net CSS (ORB). A native `<progress>` paints its fill in a pseudo-element the probe can't read, so enter `progress` and `progress.fill` by hand from the component CSS and cite it in `sources.md`.
  - A `Target` finds its element with `selector`, `text`, `within` (`withinNth` picks a later match, for a page with several demo blocks), `nth` and `surface` (the nearest painted ancestor, fonts included: skip `fontFamily` when the product sets fonts on components, not the page). In `selector`, `within`, `box` and `ink`, `a >>> b` looks inside a's shadow root and a leading `>>>` inside the part's own (web components: Material Web, Polaris); a box with no paint also takes it from a covering child in its shadow root. CSS-module class names carry a build hash: match their stable part with `[class*="_Button_"]`. Overlays often mount in a portal layer, not next to their trigger: target the portal, and check with `--shots`. A `surface` on a transparent wrapper (Spotify's `#context-menu`, a tooltip host) climbs past the overlay to the page: select the painted child (the run warns, as it does for a part read at opacity 0). Fills at 10% alpha or less read as clear, so a white-10% chip needs its painted inner element. It can add:
    - `focus: true` for a focus part: it (or the first control inside it) is focused from the keyboard first, and only focus parts read `ring`. A field painted on a wrapper (Geist, Primer) targets the wrapper, with `ink` on the input and `focus: true`: the ring is read off the wrapper's `:focus-within`. Some systems turn a required field `:invalid` when it's focused empty: measure one that isn't required.
    - `before` steps to open a menu or show a tooltip: `click`, `hover`, `focus` (opens React Aria and Primer tooltips, which ignore hover), `press` and `wait`. Turn a part on with `click`, not `press` Enter: a key press leaves a focus ring that reads as the part's edge. Each waits for its selector to show (Puppeteer selectors: `::-p-text(Options)` matches by text), the part is read once two reads agree, and the page reloads before the next part with steps.
    - `box: "::before"` or a child selector where the product paints the box apart from the control, `ink` for a child that carries the text (a nav row's label span). A row that reads 0 radius or the wrapper's font usually paints its highlight on an inset `::before` and its text on a nested span (Linear's menu, ⌘K and sidebar rows; Geist's badges paint their fill on a `::before` with `mix-blend-mode`): check for both before logging a gap. A control with no plate (Claude's ghost select, a value and a chevron) reads clear with 0px corners and no edge: that is the reading, not a miss;
    - `only: ["backgroundColor", "edge"]` to replace the props the part's kind is compared on (`props` in `SPECIMEN_TARGETS`: no type on a checkbox, no height on a paragraph, `edge` and `ring` on focus parts), or `skip: ["paddingInline"]` for the few the two sides place differently. Skip `backgroundColor` on a clear part that sits on a band or card in the product but on the page in the specimens, and `fontSize` on plain body text that takes the host page's size. A keycap inside a search button reads no `edge`, since the button's pill draws the outline (Supabase's header ⌘K chip): skip it or target a key in ⌘K or a tooltip. A tooltip holding key chips reads taller than a plain one: skip its `height`.
- `tokens.json`: `{ "probe": "<commit>", "fonts"?, "light": { "<part>": { "<prop>": "<computed value>" } }, "dark": { … } }`, written by `--pack` and `--merge`. Each measured part replaces its stored entry, one per part and mode, so list a part on one page per mode: a harness page measured headless would overwrite the signed-in reading (`--pack` warns). Parts nothing measured this run are kept, so a part entered by hand (cited in `sources.md`) stays as long as no page's targets measure it. Both list the kept parts no page names: after renaming a part in `targets.json`, delete its old key here. Part names follow `SPECIMEN_TARGETS` in `probe.ts` (`button.primary`, `input`, `menu`, `dialog`, …); a pack measures the parts its product shows, not all of them.
- `fonts` maps a reference family the preset can't ship to its stand-in, lowercase (`{ "din-round": "nunito", "geistsans": "geist" }`): those rows pass as `stand-in`. Cite the choice in `sources.md`.
- Packs from token tables: a system that publishes its resolved tokens (Material 3's DSM token tables, Carbon themes, Primer primitives) can fill `tokens.json` from them by hand, in the probe's value format, with `"probe": "tokens"` (no probe-version warning). `sources.md` records the table, its build or version, and how it was resolved (platform, theme); `refs/material3/sources.md` is the worked example. A pack can mix token-table parts with measured ones. A product that ships a dark palette it never renders (Airbnb) writes dark by hand the same way: the light entries' props, clear fills composited over the dark page, shadows only where the palette has them.

- `gaps.json`: the looks the preset can't reach with today's axes, one entry per look (`Gap` in `looks.ts`): its look id, a title, the stand-in the preset uses, and its source (`ledger` for the rows backfilled from the #1020 ledger, `hand`, or `fit <probe>` for residual rows the fit filed). Look ids come from the vocabulary in `looks.ts`, each under a pattern (size, type, surface, ink, radius, color, anatomy, state, flourish, font): add a look there when none fits, never a free-text one. `pnpm presets:gaps` builds the ledger from every pack: looks per pattern, the systems behind each, and which meet the proposal bar (3 systems, or 2 with a north star: Material 3, Vercel, Linear; color looks wait for the engine rewrite).
- `model.json`: the system behind the product, inferred from a census (below). Committed, so drift has a baseline.
- `pixel.json`: what the pixel probe read from screenshots (below), in `tokens.json`'s format with `"probe": "pixel"`. The diff and the fit read it only for the props `tokens.json` lacks, and say which.

## Census and model

The census (`census.ts`) reads every element a page paints or labels, with no hand-written selectors: its role (ARIA, then tag, then box shape), the control or landmark it sits in, its box, its text's length (never the text), the probe's 12 values from the probe itself plus about 25 computed styles, and for one element per look its hover, pressed and focus changes and the custom property behind each value. `pnpm presets:crawl` runs it:

- Headless over a pack's public pages in their modes (`--url` for any page, `--follow n` for linked pages, `--open n` to open popups one per fresh load), or in a signed-in Chrome over its debugging port (`--connect <port> --pages <file>`, page keys with placeholders, copies redacted). From Claude in Chrome, the local kit's `__dotui.census(pass)` does the same per page and pass (focus only, no hover or pressed) and `presets:kit --collect` files it next to `raw/`.
- Output: `<out>/pages/*.json` (one per page, pass and mode), `census.json` (looks per role group, light paired with the same element in dark), and frozen copies of each look's sample at rest and in its states, `crops/<look>-<state>-<mode>.{json,html}`, which a system's `looks.json` points at. `<out>` defaults to `.scratch-refs/<id>/<date>/census`.
- The model (`model.ts`, written to `refs/<id>/model.json` and printed as a DESIGN.md-style summary): radius rungs and pills, type styles, control heights, the spacing grid, OKLCH neutrals and accent hues per mode, the custom properties that feed most elements, and the looks of each control. `--from <dir>` (repeatable) rebuilds it from saved pages with no browser: how a public run and a signed-in one become one model.

## System looks

`pnpm presets:looks --pack <id>` writes the system's `looks.json` for its doc page (`system-looks.ts`): the pages read and how, the palette per mode with the color roles the probe parts name, type, shape, spacing, distinct shadows, every component look (keyed by registry component; census groups with none go under `other`) with its states, custom properties and frozen copies, the fit's misses on the looks they belong to, and `gaps.json`. Each probe part is tied to the census look whose values agree with it (three quarters of its props or more), so the page can show ours beside theirs. It reads `model.json` (run the census first), the newest census under `.scratch-refs/<id>/` and the fit's `fit.json` when there is one; copies stay under `.scratch-refs/<id>/`, never in git. Output: `../directory/systems/<id>/looks.json`.

## Pixel probe

For products with no DOM to read (native apps), `pixel.ts` reads a part from a screenshot alone: fill, ink, edge and its width, corner radius (sub-pixel, from where the corner's diagonal meets the arc), height, inline padding from the first ink column, and whether a shadow falls below. `pnpm presets:pixel --pack <id> --shot <png> --rects <file> --mode light|dark [--write]` takes boxes in the shot's points (`__dotui.rects()` output, or written by eye: each side snaps to the strongest edge within 8 points) and merges into `pixel.json`. It reads parts with a visible box; type, focus rings and boxless parts (a tab's label) stay by hand. On GitHub's real Code button it reads fill, ink, edge and height exactly, radius 5.5 for 6, padding 13.5 for 12 (the icon's side bearing), and misses a 4% shadow.

## Drift

`pnpm presets:drift --pack <id>` re-runs the headless census and lists the looks gone or new against the committed model, on the pages both share (a model that also holds signed-in pages compares fairly). It writes no model: when the product changed, re-run the census, rebuild with `--from` (signed-in folders included), and re-check the preset.

Screenshots, crops and compare sheets go to the project's shared files (`presets/<id>/<date>/`), or `.scratch-*` locally.

## Commands

From `www/`; the specimen commands (`capture`, `compare`, `measure --preset`, `fit`) need a dev server running (`pnpm dev:www --port <port>` from the repo root):

```sh
# Capture specimens: .scratch-specimens/<id>/<sheet>-<mode>.png (DPR 2)
pnpm presets:capture --preset linear --mode both --sheet all --port <port>

# Pair reference images with sheets: .scratch-specimens/<id>/compare-<sheet>.png
pnpm presets:compare --preset linear --refs <dir of reference pngs>

# Measure the specimens and diff them against refs/<id>/tokens.json, then list
# what moved since the previous run (or --baseline <measures.json>)
pnpm presets:measure --preset linear --port <port>

# Measure every public page of a pack (4 at a time) into refs/<id>/tokens.json;
# --shots also crops each part as it was measured, with its part file, for
# presets:compare, and a frozen copy per part (--shots .scratch-refs/<id>/crops)
pnpm presets:measure --pack linear [--url <one page>] [--shots <dir>]

# The probe for a signed-in tab driven by Claude in Chrome: the page's steps,
# one expression for the plain parts, then one per focus or `before` part with
# its steps. Save each JSON result and merge it into tokens.json
pnpm presets:measure --snippet --pack linear --url <page>
pnpm presets:measure --pack linear --url <page> --merge <file> --mode dark

# Try targets on any page before adding it to a pack: prints its measures
pnpm presets:measure --url <page> --targets <file> --mode dark

# Every axis, where each of the preset's values comes from, and the options a
# rule overrides on that preset (presets.test rejects them)
pnpm presets:catalog --preset linear [--chapter buttons]

# The gap ledger from every pack's gaps.json, or one look across systems
pnpm presets:gaps [--pattern size] | pnpm presets:gaps --look size.switch

# Census of a pack's public pages, the model, and frozen copies of each look
pnpm presets:crawl --pack linear [--url <page>] [--open 2] [--follow 5]
pnpm presets:crawl --pack linear --from <census dir> --from <signed-in census dir>

# Draft diff and residual gaps for a pack, against the dev server
pnpm presets:fit --pack linear --port <port> [--keys button*] [--write-gaps]

# A native app's parts from a screenshot
pnpm presets:pixel --pack spotify --shot app.png --rects rects.json --mode dark --write

# What moved on the product since its committed model
pnpm presets:drift --pack linear
```

- References match sheets by filename: the first word that names a component decides the sheet, plurals included (`segmented-display-popover-dark.png` → `actions`, dark). Start names with the component word, full-page shots too (`menu-image-page-dark.png`), and end with `-light`/`-dark`; unmatched ones land in `compare-unmatched.png`. `--shots` names crops `<part>-<mode>.png`, which match.
- `measure` reads the same computed styles from both sides and passes a property within tolerance: radius ±1px as drawn (no rounder than half the box, so a pill against 8px on a 20px badge is 2px off; two radii that round the whole end of their box match), edge and ring widths ±0.25px, ring offset ±1px, height and padding ±2px, color ΔE ≤ 0.02 in OKLab, weight ±30, same first font family (`system-ui`, `ui-sans-serif`, `-apple-system` and `BlinkMacSystemFont` are one, and a pack's `fonts` stand-ins pass).
- Colors are read as they show: translucent and clear ones composited over the backgrounds under them (a border or inset ring over its own box's fill first), so a clear button on white reads white.
- `edge` is the hairline around a box wherever it is drawn: a border, a spread-only box-shadow ring (rings of one width stack, as Supabase draws two faint ones), an outline on or inside the edge (Spotify's at -1px; not on focus parts), or any of them on `::before`/`::after`. A border on some sides only names them (`1px … bottom`), and those must match too. A line in the box's own fill color doesn't show and isn't read (Sail rings solid buttons in their fill), nor is a rotated or moved `::before`/`::after` (a check mark drawn as two borders). A box with no fill of its own takes its paint from a child that covers it (a selected tab's indicator), else from a `::before`/`::after` that covers most of it.
- `ring` is the focus ring on focus parts (`button.focus`, `input.focus`), read from the part when it or something inside it has focus: an outline, the outermost box-shadow ring, or the topmost inset ring merged with a border of its color, always with a signed offset (an inset outline is `-2px`). A focus line drawn inside from the outer edge, or up to 1px further in (Linear's 1px outline at `-1px`, Carbon's 2px inset, Primer's 2px at `-2px`), reads as the edge instead, so it matches a field whose border turns the accent color; `ring` is left for lines off the edge.
- Parts the specimens don't show are listed apart from the off count. Leave a property out of `tokens.json` when the two sides put it in different places (Linear pads the menu row, dotUI pads inside the item's inset). Marketing pages run larger than the app; measure app controls at their default size.
- Every measure prints the probe commit (`probe.ts` + `compare.ts`). Off counts and tokens from different probe versions don't compare; `--preset` says when the reference is older.
- The off count hides magnitude, so `--preset` also lists every row that moved since the previous run (`fixed`, `broke`, `closer`, `further`, `changed`), and every reference value that changed (a re-measured pack). For a before/after of a whole change, save `measures.json` before editing and pass it as `--baseline`.
- In ad-hoc Puppeteer scripts, pass `page.evaluate` a string expression (like `snippet()` returns), not a function: tsx injects a `__name` helper the page doesn't have. Or register a no-op `globalThis.__name` with `evaluateOnNewDocument`.
- `capture-refs.mts` captures Geist docs showcases into `.scratch-refs/` (older, manifest-driven).
- Cloud sessions: install with `PUPPETEER_SKIP_DOWNLOAD=1 pnpm install`. The scripts find the preinstalled Chromium under `/opt/pw-browsers` themselves (or take `PUPPETEER_EXECUTABLE_PATH`) and add `--no-sandbox` when they run as root. The network policy may block product hosts; measure those through Claude in Chrome instead.

## Probe changes

A pack measured on an older probe re-runs `--pack` (and `--merge` for its signed-in pages) before its counts compare.

- 8eb9b12: the page reloads before each part with `before` steps, and pages run in their own browser context. Pages take `steps`, `settle` and `width`; steps add `focus` and `wait`, and wait for their selector. Outlines at rest read as `edge`; same-width rings stack; lines in the fill's color and rotated marks are ignored; a focus line up to 1px further in than flush reads as `edge`. Radii compare as drawn; `fonts` stand-ins pass. `withinNth`; `--shots`; the snippet writes only owned props; reference changes in `--preset`. New specimen parts: `button.icon`, `toggle`, `toggle.on`, `segmented`, `segmented.item`, `segmented.selected`, `pagination.current`, `field.label`, `radio`, `radio.checked`, `progress`, `progress.fill`, `alert`, `calendar.day`, `calendar.today`, `calendar.selected`. `shell` compares only its fill.
- 89a5551: only focus parts read `ring`, from the part or a focused control inside it (`:focus-within`), so a `before: click` plus `only: ["edge"]` on a wrapped field becomes `focus: true`. Each part writes only its kind's props (`only` replaces them). Borders and inset rings composite over their own fill; `>>>` reaches into shadow roots; system font aliases; probe ids are seven characters.
- d3433f1: a focus line inset flush with the outer edge reads as `edge`; `--preset` lists what moved since the previous run.
- 227b008: borders and spread-only rings read as `edge` (`borderColor` and `borderWidth` are gone); clear fills composite as they show; transparent outlines are ignored.
