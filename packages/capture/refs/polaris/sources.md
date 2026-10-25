# Polaris reference pack

Measured 2026-10-21 from the packages and 2026-10-22 in the signed-in Shopify Admin. Light is Polaris's only production theme. Dark is `dark-experimental`, a partial theme Shopify ships behind a flag: it recolors the page, surfaces, fills and text, and leaves fields, navigation, badges and banners on their light values. The Shopify Admin has no dark mode: no appearance setting, and it ignores `prefers-color-scheme`. The web component previews on shopify.dev stay light when the docs go dark.

## Official tokens

Polaris publishes its tokens as code, so colors come from the packages first.

- [`@shopify/polaris-tokens`](https://github.com/Shopify/polaris/tree/main/polaris-tokens) 9.4.2: the light theme and `dark-experimental`.
- [`@shopify/polaris`](https://github.com/Shopify/polaris/tree/main/polaris-react) 13.9.5: component CSS (`build/esm/styles.css`, tokens included as `--p-*`).

| Token                                       | Light              | dark-experimental  |
| ------------------------------------------- | ------------------ | ------------------ |
| `color-bg` (page)                           | #f1f1f1            | #1a1a1a            |
| `color-bg-surface` (cards, menus, modals)   | #ffffff            | #303030            |
| `color-bg-surface-secondary` (modal header) | #f7f7f7            | not themed         |
| `color-nav-bg` / `-surface-selected`        | #ebebeb / #fafafa  | not themed         |
| `color-bg-fill` (secondary button)          | #ffffff            | #303030            |
| `color-bg-fill-brand` (primary button)      | #303030            | #ffffff            |
| `color-text-brand-on-bg-fill`               | #ffffff            | #303030            |
| `color-bg-fill-tertiary` (badge, track)     | #e3e3e3            | #303030            |
| `color-text` / `color-text-secondary`       | #303030 / #616161  | #e3e3e3 / #b5b5b5  |
| `color-text-link`, `color-border-focus`     | #005bd3            | not themed         |
| `color-input-bg-surface`                    | #fdfdfd            | not themed         |
| `color-input-border`                        | #8a8a8a            | not themed         |
| `color-bg-fill-critical` / `-success`       | #c70a24 / #047b5d  | not themed         |
| `color-bg-fill-warning` / `-caution`        | #ffb800 / #ffe600  | not themed         |
| `color-bg-fill-info` (ProgressBar)          | #91d0ff            | not themed         |
| `color-bg-inverse` (toast)                  | #1a1a1a            | not themed         |
| Backdrop (`.Polaris-Backdrop`)              | rgba(0, 0, 0, 0.5) | rgba(0, 0, 0, 0.5) |

## Measured pages

The Polaris React docs and Storybook are gone (polaris-react.shopify.com redirects to shopify.dev, which documents the web components; storybook.polaris.shopify.com doesn't answer), so the pack measures two harness pages in this folder that load the published packages from CDNs (esm.sh, jsdelivr, cdn.shopify.com). `pnpm presets:measure --pack polaris` opens them as files; nothing to install or serve.

- `react.html?sheet=<sheet>&theme=light|dark`: Polaris React 13.9.5 with its own `styles.css`, every component at its default size, the theme set by `AppProvider theme`. `targets.json` lists the dark pages only for the parts `dark-experimental` themes, each with `only` the props it owns.
- `https://admin.shopify.com/…`: the live Shopify Admin, signed in, captured in Mehdi's own Chrome session (`--snippet`, then `--merge`) on a new trial store with no products, orders or customers. The real URLs carry the store's handle (`/store/<handle>/…`), left out of the keys. UI chrome only, nothing saved. The Admin now renders most components as Polaris web components (`s-internal-*` custom elements with shadow roots, read through `>>>`); Tabs, the older text fields and keycaps are still Polaris React, and the sidebar is hashed CSS modules.
  - `/products`: the page, the sidebar and its rows, a card.
  - `/products/new`: the Title field (rest and focus) and its label, the Status picker, a switch, the description toolbar's tooltip.
  - `/customers`: the Export dialog, its radios and checked checkbox.
  - `/analytics`: the More actions menu and its rows.
  - `/settings/locations`: tabs (the Products tabs are disabled on an empty store).
- Light parts come from the Admin wherever it shows them in a plain context, and the harness pages leave those parts out, so a headless `--pack` never overwrites them. The harness keeps the rest and all of dark. Kept from the harness on purpose: buttons (the Admin's empty-state buttons carry an icon, so padding reads the icon side, 4px 12px 4px 6px), `button.icon` (Admin page-header actions are gray, #e3e3e3 with no edge, while in-page secondary buttons stay white), `kbd` (only in the dark top bar), `badge` (only a "Yes" chip inside a gray chip), `link` (only a neutral banner link), `alert` (only an untitled white banner) and type (Admin page titles are 18px/600 and its sample text a 12px caption, not the heading scale).
- `web.html`: Polaris web components (`polaris.js`), light only, for the switch: Polaris React has no switch. The switch's input sits in the `s-switch` shadow root (`s-switch >>> input`).
- `react.html` marks `button.focus` and `input.focus` with `data-specimen-focus` and focuses the button, since Polaris doesn't forward data attributes.
- The Dates page shows the current month, so Polaris marks today (bold, no fill).
- Polaris has no segmented control: `ButtonGroup variant="segmented"` stands in. The group paints nothing of its own; its corners are its end buttons' 8px, so `segmented` leaves its radius out.
- `button.quiet`, `tab`, `calendar.day` and `calendar.today` leave their fill out: both sides are clear, and Polaris shows the white card behind them where the specimens show the page.
- The dark `card` probes `.Polaris-ShadowBevel::before`, which draws the bevel and the 12px corners; the fill comes from a child Box.
- Buttons, tabs, nav rows, badges and calendar days take type from their `.Polaris-Text--root` label (`ink`).
- `tokens.json` keeps, per part, only the properties both sides draw in the same place.
- The harness is measured at DPR 1, where Polaris's 0.66px checkbox edge (`border-width-0165`) stays 0.66px and Chrome rounds field borders to 1px. The Admin was captured at DPR 2, where fields, selects and radios read 0.66px too.

## Read by hand (no probe part)

From the harness (Polaris React), `getComputedStyle` with overlays open, with the live Admin's values where they differ:

- Buttons: 28px, 12px inline padding, 12px/550, `ShadowBevel` (inset bottom shade, 0.5px top highlight).
- Text fields and select: 32px, 13px/450 values on #fdfdfd behind a 0.66px #8a8a8a edge (top #898f94). Focus: the edge turns #1a1a1a over #f7f7f7 and a 2px #005bd3 ring sits 1px outside. Invalid: #fee8eb fill, #8e0b21 edge, a 13px #8e0b21 message with an icon; the label keeps its ink.
- Checkbox and radio: 16px on #ffffff; checked #303030, the radio as a #303030 disc around a white center.
- Switch (web components): 32×16 track; off #fdfdfd with a 1px #8a8a8a edge, on #303030.
- Tabs: pill buttons at button size, 28px, 12px padding, idle #4a4a4a (#616161 in the Admin), selected rgba(0, 0, 0, 0.08) over the card.
- Navigation: 28px rows, 13px, full ink at 550; the current row is #fafafa at 650 (600 in the Admin) on the #ebebeb sidebar.
- Menu (ActionList): #ffffff, 12px corners; 32px rows, 13px/450, 8px row radius. The Admin's web-component menus have 28px rows padded 6px, inside a 1px ring under a soft shadow.
- Tooltip: white surface, 28px, 8px padding, 13px/450, 8px corners, a tail. In the Admin it also draws a 1px ring (#e8e8e8) under a soft shadow.
- Modal: 620px wide, 16px corners, a 1px ring under a soft shadow in the Admin; a #f3f3f3 header band with a hairline, 14px/650 title; footer with a top hairline. Backdrop 50% black.
- Badge: 20px, 8px padding, 8px corners, 12px/450; neutral 6% black (#f0f0f0 on white) with #616161 text; success #affebf / #014b40, attention #ffeb78 / #4f4700, critical #fed1d7 / #8e0b21, info #d5ebff / #003a5a.
- Banner: a solid status header strip (warning #ffb800, info #91d0ff) over a white body; inside a card, a compact tinted row with an icon.
- Type: Inter; headings 3xl/2xl/xl 700 with -0.54 / -0.3 / -0.2px tracking, lg 650; card titles stay 13px/650; body 13px/450, secondary #616161.
- Avatar: initials on a palette color picked from the name (#52f490 with #014b40 text for "MB"), 28px with 6px corners.
- KeyboardKey: 20px, 4px corners, #f3f3f3, 12px/550 #616161.
- Card (Admin): white, 12px corners, a 1px rgba(0, 0, 0, 0.06) ring (#e2e2e2 over the page) under five soft drop shadows; React's `ShadowBevel` inset rim is gone.
