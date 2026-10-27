# Polaris reference pack

Light is the redesigned Shopify Admin, read signed in on 2026-10-25/26. Shopify began rolling out a new Admin look on 2026-09-15 ([blog post](https://www.shopify.com/blog/admin-new-look), 2026-09-24), store by store with no opt-out: pill actions, a white page inside a dark #0a0a0a frame and sidebar, #101010 ink, flat #ebebeb secondary buttons, 20px cards, 16px popovers, dark pill tooltips and 500-weight headings. It keeps Polaris's `--p-*` token names with new values. The published packages (`@shopify/polaris-tokens` 9.4.2, `@shopify/polaris` 13.9.5, `polaris.js`) still render the classic look this pack measured on 2026-10-21/22; that look is kept below for the record.

Dark is `dark-experimental`, a partial theme Shopify ships behind a flag, read from the classic packages: the Admin has no dark mode (no appearance setting, and it ignores `prefers-color-scheme`), and the redesign brought none.

## The 2026 Admin (light)

Each light part copies one look from the signed-in census of the Admin (`presets:crawl` at probe ce94064, 27 Admin pages, 2026-10-25/26; archive `system-docs/polaris/scratch-refs-polaris-2026-10-26-census.tgz` in the project files, its looks also in `directory/systems/polaris/spec.json`), keeping the props the part's target owns. The probe is the one `presets:measure` uses, so the values are probe readings. The census reads every element with no selectors, so the parts a target names below still re-measure with `--snippet` and `--merge` on their page; the rest wait for targets of their own.

| Part               | Census look                                              | Sampled on                    | Looks |
| ------------------ | -------------------------------------------------------- | ----------------------------- | ----- |
| `page`             | `page.1`                                                 | `/`                           | 27    |
| `shell`            | `panel.2` (the sidebar)                                  | `/`                           | 27    |
| `panel`            | `main.1` (the white page inside the frame, 16px corners) | `/`                           | 27    |
| `nav.item`         | `link.13`                                                | `/`                           | 12    |
| `nav.item.active`  | `box.4`                                                  | `/`                           | 42    |
| `button.primary`   | `button.26`                                              | `/customers`                  | 5     |
| `button.secondary` | `button.17`                                              | `/`                           | 10    |
| `button.quiet`     | `link.24`                                                | `/content/metaobjects`        | 3     |
| `button.icon`      | `button.18`                                              | `/markets`                    | 10    |
| `button.focus`     | `button.26`, focused                                     | `/customers`                  | 5     |
| `tab`              | `tab.1`, label `text@tab.1`                              | `/settings/billing`           | 5     |
| `tab.selected`     | `tab.1` selected, label `text@tab.3`                     | `/settings/billing`           | 5     |
| `input`            | `textbox.3`                                              | `/products/new`               | 6     |
| `select.trigger`   | `combobox.2`                                             | `/products/new`               | 1     |
| `field.label`      | `label.2`                                                | `/settings`                   | 8     |
| `switch.off`       | `checkbox.1`                                             | `/settings/customer_accounts` | 4     |
| `switch.on`        | `checkbox.1`, selected                                   | `/settings/customer_accounts` | 4     |
| `radio`            | `radio.1`                                                | `/settings`                   | 7     |
| `radio.checked`    | `radio.1`, selected                                      | `/settings`                   | 7     |
| `menu`             | `popover.5` (More actions)                               | `/analytics`                  | 1     |
| `menu.item`        | `menuitem.2`                                             | `/settings`                   | 9     |
| `tooltip`          | `tooltip.1`                                              | `/`                           | 1     |
| `card`             | `card.1`                                                 | `/analytics`                  | 102   |
| `alert`            | `status.1` (info banner; shape only)                     | `/analytics`                  | 3     |
| `link`             | `link.17`                                                | `/analytics`                  | 5     |
| `heading.1`        | `heading.h1.1` (page titles)                             | `/products/new`               | 17    |
| `heading.2`        | `heading.h2.4`                                           | `/products`                   | 2     |
| `heading.3`        | `heading.h2.1` (card titles)                             | `/products/new`               | 55    |
| `text`             | `text.1`                                                 | `/products/new`               | 47    |
| `text.muted`       | `text.2`                                                 | `/products/new`               | 35    |

- `ShopifyInter` is Shopify's build of Inter (`fonts` maps it to the preset's Inter).
- The specimen's first alert is the neutral one, while the Admin's banners are tinted by status (info: #cdf7ff with #002d3b ink), so `alert` compares only its corners, shadow and edge.
- Menus: the account menu (`popover.2`) sits over the dark top bar, so its 1px `rgba(0, 0, 0, 0.08)` ring reads near black; the More actions menu reads it over white (#ebebeb).
- Not seen in the new Admin, so not measured in light until a signed-in re-probe: keycaps, checkboxes, the export dialog, segmented groups, the date picker, progress bars and a neutral badge. The badges it shows are vivid: success #aafb6a with #214b03 ink, warning #ffe332 with #574100, 20px, 8px corners, 12px/500.
- Field focus is a 1px #457fff edge drawn as a shadow with a faint 3px halo, not an outline, so `input.focus` waits for a re-probe; buttons, checkboxes and pickers keep a 2px #457fff outline 1px out.
- Links in running text are #101010 and underlined; metric links on Analytics are #0048e3 with no underline.
- The light harness pages (`react.html` light sheets, `web.html`) left `targets.json`: they render the classic look. `react.html` still serves the dark pages.

## Classic Polaris (2026-10-21/22, superseded in light)

### Official tokens

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

### Measured pages

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

### Read by hand (no probe part)

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
