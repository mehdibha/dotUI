# Wise reference pack

Measured 2026-10-21, headless, no sign-in. Wise's design system is Neptune; the web app and wise.com render it in Inter, with Wise Sans (proprietary) only for display headlines. Light is the default theme; Neptune ships a full dark theme (`personal--dark`) that the app offers as a setting.

## Official tokens

Neptune publishes its tokens and components on npm (Apache-2.0):

- [`@transferwise/neptune-tokens`](https://www.npmjs.com/package/@transferwise/neptune-tokens) 8.26.0: `themes/personal/tokens.css` and `themes/personal--dark/tokens.css`.
- [`@transferwise/neptune-css`](https://www.npmjs.com/package/@transferwise/neptune-css) 14.29.6 and [`@transferwise/components`](https://www.npmjs.com/package/@transferwise/components) 46.165.5: component CSS and React components.
- [`@wise/components-theming`](https://www.npmjs.com/package/@wise/components-theming) 1.10.3: `ThemeProvider` (`theme="personal"`, `screenMode`).

| Token                                           | personal            | personal--dark    |
| ----------------------------------------------- | ------------------- | ----------------- |
| `background-screen` (page)                      | #ffffff             | #121511           |
| `background-elevated` (menus, modals)           | #ffffff             | #1e211d           |
| `background-neutral` (prompts, tracks)          | #16330014           | #ffffff1a         |
| `content-primary` / `-secondary`                | #0e0f0c / #454745   | #f3f5f1 / #e8ebe6 |
| `content-tertiary`                              | #6a6c6a             | #cacfc7           |
| `content-link`                                  | #163300             | #9fe870           |
| `interactive-accent` (primary button)           | #9fe870             | #9fe870           |
| `interactive-primary` (checks, focus)           | #163300             | #9fe870           |
| `interactive-secondary` (control edges)         | #868685             | #b9bab7           |
| `interactive-control` (label on accent)         | #163300             | #163300           |
| `border-neutral`                                | #0e0f0c1f           | #ffffff33         |
| `sentiment-negative` / `-secondary`             | #cb272f / #fbeaea   | #ffa8ad / #410b0d |
| `sentiment-positive` / `-secondary`             | #054d28 / #e2f6d5   | #bae5a0 / #252c20 |
| `sentiment-warning`                             | #ffd11a             | #fadc65           |
| Radii (`small` / `medium` / `large` / `xlarge`) | 10 / 16 / 24 / 32px | same              |

## Measured pages

- `https://wise.com/login`, light only (the public page has no theme switch): page, email field, field label, primary button, link.
- `react.html?sheet=<sheet>&theme=light|dark`: a harness in this folder that loads the published packages above (CSS from unpkg, modules from esm.sh) and renders Neptune components inside `ThemeProvider theme="personal"` with the requested `screenMode`. Every part not on the login page, and all of dark, comes from it. `pnpm presets:measure --pack wise` opens it as a file.
  - esm.sh needs `?bundle` for `@transferwise/components` and `@transferwise/icons` (the unbundled build pulls hundreds of modules and stalls); the import map keeps React, react-intl and the theming package external so there is one copy of each. jsdelivr CSS is blocked by Chrome's ORB in headless runs, so stylesheets come from unpkg.
  - `Button` needs the `v2` prop for the current pill buttons; without it the legacy square button renders.
  - The harness sets `data-specimen-focus` on the focused field and button, then `html[data-specimen-ready]`, which every harness page waits for.
- Parts and their Neptune components: `button.*` Button v2 (primary, secondary, tertiary for quiet), `button.icon` IconButton secondary, `toggle` / `toggle.on` Chips (filter chips), `segmented` SegmentedControl, `select.trigger` SelectInput, `menu` / `menu.item` the SelectInput list, `command` a filterable SelectInput (Neptune has no command palette; its popover radius is left out), `tooltip` Tooltip (`.np-panel__content`, height left out since it wraps), `dialog` Modal, `tab` Tabs, `alert` InfoPrompt (the login page's Alert is deprecated), `badge` neutral Tag, `badge.accent` the success Tag (the proposition Tag is teal, not brand), `card` BaseCard (`.np-Card`: `background-neutral` in light, `background-elevated` in dark, 32px corners, 24px padding, no edge or shadow), `calendar.*` DateLookup, `heading.1`–`.4` the Title screen / section / subsection / body styles (size and tracking left out: Neptune's titles step 30 / 26 / 22 / 18px at -0.021 to -0.014em, where the specimens use the dotUI scale), `text` Body large, `text.muted` Body in secondary ink.
- `progress` and `progress.fill` are entered by hand from neptune-css (`.progress` track `background-neutral`, 8px, 10px corners; fill `interactive-primary` with the same corners): the native `<progress>` fill can't be probed.

## Cross-checks on wise.com

Twelve public pages surveyed headless on 2026-10-21 (home, send money, pricing, currency converter, card, account, business, help centre and an article, login, register, compare), light only: the public site has no dark theme and ignores `prefers-color-scheme`. Production agrees with the harness wherever both show a component, so these pages stay out of `targets.json`:

- Send money's currency picker opens the same SelectInput popover: white, 10px corners, `0 0 40px rgba(69, 71, 69, .2)`, 8px list padding, 48px rows padded 16px at 16/400 in forest, a 1px #868685 ring on the keyboard-active row, and a search field whose focus is a 3px forest inset edge.
- Info tooltips: white `np-panel__content`, 16px corners and padding, 14/400 #0e0f0c, the same 40px shadow; the fee popover is the same panel.
- The converter's range Chips: 32px pills padded 16px at 600, outlined at rest, forest under a bright green label when selected.
- Prompts (`wds-info-prompt`): 16px corners, 12px padding, the sentiment's secondary fill (#e2f6d5 under #054d28 for success).
- Buttons: the calculator's `wds-Button` primary is 48px with 16px padding; legacy `np-btn` buttons on marketing and help pages pad 24px at 48px. Currency pickers are `secondary-neutral` pills on #16330014.
- Help centre: the article search is a 48px pill (24px corners) with the 3px focus edge, while form fields stay 10px boxes; topic tiles are links on `background-neutral` with 16px corners and 24px padding.
- Titles: screen 30/600, subsection 22/600, body 18/600 in #0e0f0c; body copy 14/400 in #454745; links 600 underlined in forest.

## Not measured

The app shell and sidebar nav rows (`shell`, `panel`, `nav.item`, `nav.item.active`) live only in the signed-in web app, and Neptune publishes no sidebar component. A signed-in pass was tried on 2026-10-21 and stopped before reading anything: the device's permission check refuses signed-in banking pages.

## Read by hand (no probe part)

From the harness with overlays open:

- Buttons: lg (the default) is 48px with 16px inline padding and 16px/600 labels; md and sm step down. Secondary is `sentiment-positive-secondary`-like #e2f6d5 with a forest label; dark #163300 under bright green. Negative primary is #cb272f, #ffa8ad in dark.
- Fields: 48px, 16px values, 1px #868685 edge drawn as an inset shadow, 10px corners. Focus thickens the edge to 3px forest (bright green in dark), no outer ring. Invalid: #cb272f edge and a #fbeaea message band with an icon.
- Checkbox 22px with 3px corners, radio 24px with a forest ring around a dot, switch 28px tall; all forest when on in light, bright green with forest marks in dark.
- Chips: 32px, 14px/600, outlined #868685 at rest, filled forest with a bright-green label when selected (inverted in dark).
- SegmentedControl: a #16330014 pill track, the selected item a page-colored pill with no edge or shadow, 14px.
- Menus and SelectInput lists: elevated surface, 10px corners, a soft `0 0 40px rgba(69, 71, 69, .2)` shadow, 48px rows in forest ink (bright green in dark).
- Tooltip: elevated surface, 16px corners and padding, 14px text, the same 40px shadow, a tail.
- Modal: 32px corners, no shadow, a gray circular close button; Drawer docks square to the edge.
- Tabs: 40px, 24px padding, 16px, regular #454745, the current tab forest at 600 with a 2px forest line.
- InfoPrompt: `background-neutral` with 16px corners; status prompts take their sentiment's secondary fill.
- Tag: 6px corners, 12px/600, 4px padding.
- DateLookup: 40px circular days, 600 on weekdays, three-letter weekday labels, today underlined, the selected day forest under a bright-green numeral.
- Type: Inter throughout the UI; display headlines are Wise Sans, a heavy condensed face with no free equivalent close enough to stand in.
