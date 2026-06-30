# Registry-wide StyleX parity audit (snapshot)

> Generated from the real `publish()` (StyleX engine) + `analyzeParity` over every component.
> A point-in-time sizing — regenerate as the translator grows. Not kept current.

**66 publishable components.** Which backend the StyleX export emits:

- **emits StyleX** (`stylex.create`): 44
- **no styling** (no `styles.ts` — identical file either engine): 22
- **inline `tv()`** (not lowered to IR): 0

→ **66/66 work with both backends.** (4 more components — input, otp-field, progress-bar, slider — are skipped by `build:registry` for a pre-existing reason: their `styles.ts` uses dynamic `fieldStyles()`/computed values the extractor can’t statically read, so they have no publishable in **either** engine — unrelated to StyleX.)

Each emitted export flags its own descendant/group/has remainder inline as `PARITY-TODO`. Distinct uncovered same-element utilities still to map: **288**.

| component | StyleX backend | parity difficulty | uncovered utils |
|---|---|---|--:|
| accordion | stylex | descendant | 0 |
| alert | stylex | descendant | 9 |
| avatar | stylex | descendant | 12 |
| badge | stylex | descendant | 0 |
| breadcrumbs | stylex | descendant | 3 |
| button | stylex | descendant | 0 |
| calendar | stylex | descendant | 11 |
| card | stylex | descendant | 16 |
| chart | no-styles | trivial | 0 |
| chart-area | no-styles | trivial | 0 |
| chart-bar | no-styles | trivial | 0 |
| chart-line | no-styles | trivial | 0 |
| chart-pie | no-styles | trivial | 0 |
| chart-radar | no-styles | trivial | 0 |
| chart-radial | no-styles | trivial | 0 |
| checkbox | stylex | descendant | 12 |
| checkbox-group | stylex | trivial | 0 |
| color-area | stylex | ancestor | 2 |
| color-editor | no-styles | trivial | 0 |
| color-field | no-styles | trivial | 0 |
| color-picker | no-styles | trivial | 0 |
| color-slider | stylex | descendant | 1 |
| color-swatch | stylex | trivial | 0 |
| color-swatch-picker | stylex | descendant | 1 |
| color-thumb | stylex | ancestor | 6 |
| combobox | no-styles | trivial | 0 |
| command | stylex | descendant | 1 |
| context-menu | no-styles | trivial | 0 |
| date-field | no-styles | trivial | 0 |
| date-picker | no-styles | trivial | 0 |
| dialog | stylex | ancestor | 7 |
| disclosure | stylex | descendant | 5 |
| drawer | stylex | extend | 41 |
| drop-zone | stylex | extend | 4 |
| empty | stylex | descendant | 5 |
| field | stylex | descendant | 3 |
| file-trigger | no-styles | trivial | 0 |
| group | stylex | descendant | 2 |
| kbd | stylex | descendant | 1 |
| link | stylex | trivial | 0 |
| list-box | stylex | descendant | 14 |
| loader | no-styles | trivial | 0 |
| mention | stylex | trivial | 0 |
| menu | stylex | descendant | 6 |
| modal | stylex | descendant | 20 |
| number-field | no-styles | trivial | 0 |
| pagination | stylex | descendant | 1 |
| popover | stylex | descendant | 19 |
| radio-group | stylex | ancestor | 8 |
| search-field | no-styles | trivial | 0 |
| select | no-styles | trivial | 0 |
| separator | stylex | extend | 1 |
| sidebar | stylex | descendant | 29 |
| skeleton | stylex | descendant | 3 |
| switch | stylex | ancestor | 13 |
| table | stylex | descendant | 34 |
| tabs | stylex | descendant | 16 |
| tag-group | stylex | descendant | 3 |
| text | no-styles | trivial | 0 |
| text-field | no-styles | trivial | 0 |
| time-field | no-styles | trivial | 0 |
| toast | stylex | descendant | 43 |
| toggle-button | stylex | descendant | 5 |
| toggle-button-group | stylex | descendant | 0 |
| tooltip | stylex | descendant | 19 |
| tree | stylex | descendant | 9 |
