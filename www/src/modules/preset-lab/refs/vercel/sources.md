# Vercel: sources

Geist publishes its tokens on [vercel.com/geist/colors](https://vercel.com/geist/colors) (the scales), [vercel.com/geist/materials](https://vercel.com/geist/materials) (radii and shadows per surface) and [vercel.com/geist/typography](https://vercel.com/geist/typography) (the `text-heading-*` / `text-copy-*` / `text-button-*` classes). The docs showcases render the same components as the dashboard, so the pack measures them.

## 2026-10-21

`tokens.json` comes from `presets:measure --pack vercel`: the public Geist docs pages in `targets.json`, headless at 1440×900, light and dark through `prefers-color-scheme`. Reference screenshots and compare sheets are in the project files under `presets/vercel/2026-10-21/`. The signed-in dashboard was not measured in this pass.

- **Theme variables** (`--ds-*`, read off `:root`):
  - Neutrals: background-100 `#fff` / `#0a0a0a` (cards, fields, menus, dialogs), background-200 `#fafafa` / `#000` (the page), gray-100 `#f2f2f2` / `#1a1a1a`, gray-alpha-400 `#00000014` / `#ffffff24` (every hairline), gray-700 `#8f8f8f` (check edges, placeholders), gray-900 `#4d4d4d` / `#a1a1a1` (muted text), gray-1000 `#171717` / `#ededed` (ink).
  - Accent: blue-700 `#0072f5` in both modes for fills (switch, slider, choice cards); focus and links use `--ds-focus-color`, which is blue-700 in light and blue-900 `#52a8ff` in dark.
  - Status: red-800 `#da2f35`, amber-800 `#ff990a`. Success notes and toasts are blue, not green.
  - Focus: `--ds-focus-ring` is a 2px background ring inside a 4px focus-color ring, which the probe reads as `2px` at `+2px`. Fields use `--ds-focus-border`: a 1px edge at 34% black plus a 4px halo at 16% (51% and 24% white in dark).
  - Shadows: `--ds-shadow-menu`, `-modal` and `-tooltip` all start with the gray-alpha-400 1px ring, then small soft drops.
- **Materials page**: base radius 6px (`--geist-radius`), menus and modals 12px, tooltips 6px, fullscreen 16px.
- **Parts and how they are read**:
  - `button.*` come from the size row of /geist/button (`:nth-child` picks primary, secondary, tertiary); `button.focus` tabs to the primary.
  - `input` reads `[data-geist-input-wrapper]`, which draws the edge and fill; its 6px radius is on the wrapper while the covering `<input>` computes 0, so `borderRadius` is left out. `input.focus` is not measured: the focus border sits on the wrapper, which the probe can't focus.
  - `checkbox` is the drawn box (`input + span`); `checkbox.checked` clicks a label first. `switch.*` read the 28×14 track of /geist/toggle.
  - `tab.selected` leaves out `edge`: Geist draws a 2px bottom border on the tab itself, dotUI a separate indicator.
  - `menu` opens the first menu on /geist/menu; `tooltip` hovers the first legacy tooltip trigger. That tooltip draws 8px corners while the Materials page specifies 6px, so its `borderRadius` is left out.
  - `command.item` and `text.muted` are on hash URLs (`#item`, `#subtitle`) so each page runs one overlay step. `text.muted` is the modal subtitle.
  - `kbd` and `text.muted` leave out `fontFamily`: those docs elements set the `GeistSans` alias, which is the same font as `Geist`.
  - `badge` is the first (gray) badge on /geist/badge; `card` is `.material-base` on /geist/materials. Headings are the `text-heading-40/32/24/20` rows of /geist/typography; `text` is `text-copy-16`.
- **Not in the pack**: drawer (Geist's is a mobile bottom sheet), calendar and date fields (no docs showcase measured), nav sidebar and links (dashboard-only).
