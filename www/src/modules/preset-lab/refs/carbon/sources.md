# Carbon reference pack

Measured 2026-10-21. Light is Carbon's White theme, dark is G100.

## Official tokens

Carbon publishes its tokens as code, so colors come from the packages first.

- [`@carbon/themes`](https://github.com/carbon-design-system/carbon/tree/main/packages/themes) 11.83.0: `scss/generated/_themes.scss` (theme tokens for White, G10, G90, G100) and `scss/generated/_button-tokens.scss`.
- [`@carbon/styles`](https://github.com/carbon-design-system/carbon/tree/main/packages/styles) 1.117.0: component CSS (`css/styles.css`).

| Token                                                | White                       | G100                        |
| ---------------------------------------------------- | --------------------------- | --------------------------- |
| `background`                                         | #ffffff                     | #161616                     |
| `layer-01` (fields, menus, modals, tiles, popovers)  | #f4f4f4                     | #262626                     |
| `layer-hover-01`                                     | #e8e8e8                     | #333333                     |
| `layer-selected-01`, `layer-accent-01`               | #e0e0e0                     | #393939                     |
| `field-02` (fields on a layer, e.g. in a modal)      | #ffffff                     | #393939                     |
| `border-subtle-00` / `-01`                           | #e0e0e0 / #c6c6c6           | #393939 / #525252           |
| `border-strong-01` (field bottom line)               | #8d8d8d                     | #6f6f6f                     |
| `text-primary` / `text-secondary` / `text-helper`    | #161616 / #525252 / #6f6f6f | #f4f4f4 / #c6c6c6 / #a8a8a8 |
| `icon-primary` (checkbox and radio edge)             | #161616                     | #f4f4f4                     |
| `interactive`, `button-primary`                      | #0f62fe                     | #4589ff, #0f62fe            |
| `link-primary` (links, ghost and tertiary buttons)   | #0f62fe                     | #78a9ff                     |
| `focus`                                              | #0f62fe                     | #ffffff                     |
| `background-inverse` (tooltips, notifications)       | #393939                     | #f4f4f4                     |
| `button-secondary`                                   | #393939                     | #6f6f6f                     |
| `support-success` (toggle on)                        | #24a148                     | #42be65                     |
| `support-error` / `support-warning` / `support-info` | #da1e28 / #f1c21b / #0043ce | #fa4d56 / #f1c21b / #4589ff |
| `overlay`                                            | rgba(0, 0, 0, 0.6)          | rgba(0, 0, 0, 0.6)          |

## Measured pages

The [Carbon React Storybook](https://react.carbondesignsystem.com) renders the real components at their default size. Each story is opened headless as `iframe.html?viewMode=story&id=<story>`; the theme is a URL global (`&globals=backgrounds.value:white` or `:g100`), so `targets.json` lists every page once per theme and `--mode` stays `light`.

- Re-measure one page: `pnpm presets:measure --url '<url from targets.json>' --targets src/modules/preset-lab/refs/carbon/targets.json --mode light`, then merge the result into `tokens.json` under `light` (White) or `dark` (G100). A key's parenthesis names the interaction done before probing (`switch.off` clicks the toggle, which the story renders on).
- `tokens.json` keeps, per part, only the properties both sides draw in the same place: no `borderColor`/`borderWidth` (`edge` covers hairlines), no content-sized heights.
- `menu` and `menu.item` use `&args=size:md`, the 40px rows Dropdown and OverflowMenu default to. The default Menu story is `sm` (32px).
- Buttons are the default `lg` (48px): the Button story ignores a `size` arg. Carbon's `md` is 40px, the field height.
- `badge` is the gray read-only Tag (`.cds--tag--gray`).
- `checkbox` probes the label, whose `::before` draws the box (`edge`); its 2px radius, 16px size and the `checkbox.checked` fill (`icon-primary`) are read by hand from that `::before`.
- `nav.item` and `nav.item.active` take color from `.cds--side-nav__link-text` (the anchor itself computes link blue). `panel` is the page background: the UI Shell content area paints nothing.
- `heading.1`–`heading.4`, `text` and `text.muted` come from `@carbon/type` and the theme tokens: productive headings at 400 in `text-primary`, body in `text-primary`, secondary text in `text-secondary`. Sizes are left out: the specimen's scale and Carbon's don't map one to one.
- Left out: `button.focus` and `input.focus`. Both sides draw an inset focus, but Carbon uses an inset outline on fields and a border plus inset rings on buttons, while dotUI draws inset box-shadows, which the probe's `ring` skips. Card padding too: Carbon pads the tile, dotUI the card's sections.

## Read by hand (no probe part)

From the same stories, both themes, with `getComputedStyle` (pseudo-elements and opened overlays included):

- Field label and helper text: 12px/400, `text-secondary` and `text-helper`; values 14px/400, letter-spacing 0.16px; fields 40px, 16px inline padding.
- Invalid field: a 2px `support-error` outline inside the box; the label stays `text-secondary`; the message is 12px `text-error`.
- Focus: a 2px inset `focus` outline on fields; buttons draw a 2px `focus` edge with a 1px `focus-inset` ring inside it.
- Buttons: label at the start, 15px leading and 63px trailing padding (the icon slot), 14px/400. Ghost and tertiary text in `link-primary`.
- Toggle: 48×24 track, 18px white knob; off `toggle-off` (#8d8d8d / #6f6f6f), on `support-success`.
- Radio: 18px ring and dot in `icon-primary`.
- Tabs (line): 40px, 16px padding, 2px bottom line on every tab (`border-subtle` / `border-interactive` when selected), selected 14px/600.
- Dropdown open: options 40px with 1px `border-subtle` hairlines between them, text `text-secondary`; selected option `layer-selected` with its check at the end. Menu `md`: 40px rows in `text-secondary`, selectable checks at the start, shortcuts at the end.
- Menus, dropdowns and the date picker: `layer-01` with `0 2px 6px` shadow (0.3 White, 0.8 G100).
- Tooltip: `background-inverse`, 14px/400, 16px padding, 2px radius, 12×6 caret. Popover: `layer-01`, 2px radius, caret.
- Modal: `layer-01` with a 1px `border-subtle-01` edge, no shadow, 60% black overlay, 20px/400 title, 64px full-bleed footer buttons, fields inside on `field-02`.
- Tile: `layer-01`, 16px padding, square. Selected radio tile: 1px `layer-selected-inverse` edge and a filled check.
- Tag: pill, 24px, 12px/400, letter-spacing 0.32px, 8px padding.
- Inline and toast notifications (default, high contrast): `background-inverse`, a 3px status stripe at the start, a filled status icon, 14px/600 title.
- Data table: header `layer-accent` (#e0e0e0 / #393939) 14px/600, rows 48px, cells `text-secondary`.
- Progress bar: 8px, `layer-accent` track, `interactive` fill. Slider: 2px track, 14px `icon-primary` thumb.
- Date picker: 40px day cells; today in `link-primary` 600 with a dot under it; the selected day fills with `button-primary`.
- Side nav: `background` fill, 32px items; the current one on `background-selected` (#8d8d8d at 20%) with a 3px `border-interactive` bar at the start, text 600.

Reference images (both themes) are in the project files under `presets/carbon/2026-10-21/refs/`.
