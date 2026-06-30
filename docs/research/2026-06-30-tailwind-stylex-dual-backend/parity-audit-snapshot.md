# Registry-wide StyleX parity audit (snapshot)

> Generated from the real `publish()` (StyleX engine) + `analyzeParity` over every component.
> A point-in-time sizing — regenerate as the translator grows. Not kept current.

**66 publishable components — all work with both backends.** StyleX backend emitted:

- **emits StyleX** (`stylex.create`): 44
- **no styling** (identical file either engine): 22
- **inline `tv()`**: 0

Translator coverage: only **7** distinct uncovered same-element utilities remain registry-wide (down from ~288) — the rest map 1:1. The `PARITY-TODO` column counts each export's genuine at-a-distance remainder (descendant/group/has) that needs `when.*`/refactor.

Remaining uncovered (custom-plugin / keyframes / semantic-set gaps):
`animate-spin`, `invalid:selected:text-fg-onMutedDanger`, `popover`, `separator`, `skeleton--none`, `skeleton--pulse`, `skeleton--shimmer`

| component | backend | parity difficulty | PARITY-TODO |
|---|---|---|--:|
| accordion | stylex | descendant | 1 |
| alert | stylex | descendant | 19 |
| avatar | stylex | descendant | 25 |
| badge | stylex | descendant | 7 |
| breadcrumbs | stylex | descendant | 2 |
| button | stylex | descendant | 12 |
| calendar | stylex | descendant | 19 |
| card | stylex | descendant | 13 |
| chart | no-styles | trivial | 0 |
| chart-area | no-styles | trivial | 0 |
| chart-bar | no-styles | trivial | 0 |
| chart-line | no-styles | trivial | 0 |
| chart-pie | no-styles | trivial | 0 |
| chart-radar | no-styles | trivial | 0 |
| chart-radial | no-styles | trivial | 0 |
| checkbox | stylex | descendant | 12 |
| checkbox-group | stylex | trivial | 0 |
| color-area | stylex | ancestor | 1 |
| color-editor | no-styles | trivial | 0 |
| color-field | no-styles | trivial | 0 |
| color-picker | no-styles | trivial | 0 |
| color-slider | stylex | descendant | 10 |
| color-swatch | stylex | trivial | 0 |
| color-swatch-picker | stylex | descendant | 16 |
| color-thumb | stylex | ancestor | 2 |
| combobox | no-styles | trivial | 0 |
| command | stylex | descendant | 5 |
| context-menu | no-styles | trivial | 0 |
| date-field | no-styles | trivial | 0 |
| date-picker | no-styles | trivial | 0 |
| dialog | stylex | ancestor | 13 |
| disclosure | stylex | descendant | 5 |
| drawer | stylex | trivial | 0 |
| drop-zone | stylex | trivial | 0 |
| empty | stylex | descendant | 6 |
| field | stylex | descendant | 16 |
| file-trigger | no-styles | trivial | 0 |
| group | stylex | descendant | 20 |
| kbd | stylex | descendant | 1 |
| link | stylex | trivial | 0 |
| list-box | stylex | descendant | 28 |
| loader | no-styles | trivial | 0 |
| mention | stylex | trivial | 0 |
| menu | stylex | descendant | 23 |
| modal | stylex | descendant | 3 |
| number-field | no-styles | trivial | 0 |
| pagination | stylex | descendant | 1 |
| popover | stylex | descendant | 6 |
| radio-group | stylex | ancestor | 15 |
| search-field | no-styles | trivial | 0 |
| select | no-styles | trivial | 0 |
| separator | stylex | extend | 1 |
| sidebar | stylex | descendant | 59 |
| skeleton | stylex | descendant | 116 |
| switch | stylex | ancestor | 11 |
| table | stylex | descendant | 43 |
| tabs | stylex | descendant | 6 |
| tag-group | stylex | descendant | 13 |
| text | no-styles | trivial | 0 |
| text-field | no-styles | trivial | 0 |
| time-field | no-styles | trivial | 0 |
| toast | stylex | descendant | 15 |
| toggle-button | stylex | descendant | 10 |
| toggle-button-group | stylex | descendant | 13 |
| tooltip | stylex | descendant | 5 |
| tree | stylex | descendant | 4 |
