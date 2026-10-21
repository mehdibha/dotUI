# Material 3: reference sources

Captured 2026-10-21, light and dark. No sign-in.

## Official tokens (what `tokens.json` holds)

Every value in `tokens.json` comes from the M3 token database behind m3.material.io, not from a rendered page, so the pack has no `targets.json`: `--pack` would overwrite the token values with the docs site's theme. The pack sets `"probe": "tokens"`; the values follow the format of probe `8eb9b12`. Clear fills are written as the surface they show over.

- Each component's Specs page loads its token tables as `https://m3.material.io/_dsm/data/dsdb-m3/<build>/TOKEN_TABLE.<id>.json` (build `2026-10-13_06-10-19` here). Open the page headless and collect the responses whose URL contains `TOKEN_TABLE`.
- A table resolves per context: pick the tags `platform: web`, `audience: 3p` and `theme: light` or `dark`, then follow each token's reference tree to a value. The sets marked `[Deprecated]` are the 2023 baseline; the current ones are M3 Expressive.
- Colors are the baseline static scheme (primary `#6750a4`, surface `#fef7ff` / `#141218`). `material-color-utilities` 0.4.0 tonal spot from `#6750a4` gives a different primary (`#65558f`), so the static scheme is the reference, not a regenerated one.
- Shadows are the M3 elevation levels (level 1 cards, level 2 menus, level 3 dialogs). The compare checks only that a shadow is present.
- Type comes from the type scale: label-large 14/500 tracking 0.1 (buttons, tabs, menu rows), body-large 16/400 tracking 0.5 (field values), body-small 12/400 tracking 0.4 (tooltips).

Parts and the tokens behind them:

| part                    | M3 component and tokens                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------------------------- |
| page                    | surface, on-surface                                                                                           |
| button.primary          | filled button, small: 40dp, full corner, 16dp padding                                                         |
| button.secondary        | tonal button: secondary-container, on-secondary-container                                                     |
| button.quiet            | text button: primary label, 12dp padding                                                                      |
| input, select.trigger   | filled text field: surface-container-highest, 56dp, 4dp top corners, 16dp padding, 1dp bottom line            |
| checkbox                | 18dp, 2dp corner, 2dp on-surface-variant outline                                                              |
| switch.on               | track 52x32dp, primary                                                                                        |
| tab.selected            | primary tab: 48dp, primary label                                                                              |
| menu, menu.item         | vertical menu (Expressive): surface-container-low, 16dp corner; rows 44dp, 4dp corner, 16dp padding           |
| tooltip                 | plain tooltip: inverse-surface, 4dp corner, 24dp, 8dp padding                                                 |
| dialog                  | surface-container-high, 28dp corner                                                                           |
| card                    | elevated card: surface-container-low, 12dp corner                                                             |
| badge, badge.accent     | assist chip (1dp outline-variant edge), selected filter chip (secondary-container); 32dp, 8dp corner          |
| input.focus             | filled text field focused: 2dp primary bottom line, no ring                                                   |
| field.label             | populated label: body-small 12/400, tracking 0.4, on-surface-variant                                          |
| radio, radio.checked    | 20dp, 2dp on-surface-variant ring; primary when selected                                                      |
| button.icon             | filled tonal icon button (the specimen's is secondary): 40dp, full corner                                     |
| segmented, segmented.\* | outlined segmented button: 40dp pill, 1dp outline; selected secondary-container                               |
| progress, progress.fill | linear progress (Expressive): 4dp, secondary-container track, primary fill                                    |
| calendar.\*             | date picker days: 40dp circles, body-large 16/400, on surface-container-high; today primary, selected primary |

## Rendered references

- Material Web 2.5.0 (`@material/web`, Google's web components) rendered in a local page with the baseline theme above, for the reference screenshots in project files. It ships the 2023 baseline, not Expressive: filled buttons have 24px padding and menus have 4px corners and full-width rows.
- material-web.dev's live demos are custom elements with shadow roots, and the probe reads only the host: heights, corners and padding match the tokens, but colors and fonts are the docs site's own theme. Switches, tabs and chips have no live demo there.

Screenshots: project files, `presets/material3/2026-10-21/`.
