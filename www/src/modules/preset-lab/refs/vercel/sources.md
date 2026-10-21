# Vercel: sources

Geist publishes its tokens on [vercel.com/geist/colors](https://vercel.com/geist/colors) (the scales), [vercel.com/geist/materials](https://vercel.com/geist/materials) (radii and shadows per surface) and [vercel.com/geist/typography](https://vercel.com/geist/typography) (the `text-heading-*` / `text-copy-*` / `text-button-*` classes). The docs showcases render the same components as the dashboard, so the pack measures them.

## 2026-10-21

`tokens.json` comes from `presets:measure --pack vercel`: the public Geist docs pages in `targets.json`, headless at 1440×900, light and dark through `prefers-color-scheme`. Re-measured the same day on probe 8eb9b12, which added the radio, segmented, progress, alert, field label, icon button and field focus parts. Reference screenshots, crops and compare sheets are in the project files under `presets/vercel/2026-10-21/`. The signed-in dashboard was not measured.

- **Theme variables** (`--ds-*`, read off `:root`):
  - Neutrals: background-100 `#fff` / `#0a0a0a` (cards, fields, menus, dialogs), background-200 `#fafafa` / `#000` (the page), gray-100 `#f2f2f2` / `#1a1a1a`, gray-alpha-400 `#00000014` / `#ffffff24` (every hairline), gray-700 `#8f8f8f` (check edges, placeholders), gray-900 `#4d4d4d` / `#a1a1a1` (muted text), gray-1000 `#171717` / `#ededed` (ink). Field values use `--geist-foreground`, pure `#000` / `#fff`.
  - Accent: blue-700 `#0072f5` in both modes for fills (switch, slider, choice cards); focus and links use `--ds-focus-color`, which is blue-700 in light and blue-900 `#52a8ff` in dark.
  - Status: red-800 `#da2f35`, amber-800 `#ff990a`. Success notes and toasts are blue, not green.
  - Focus: `--ds-focus-ring` is a 2px background ring inside a 4px focus-color ring, which the probe reads as `2px` at `+2px`. Fields use `--ds-focus-border`: a 1px edge at 34% black plus a 4px halo at 16% (51% and 24% white in dark), which the probe reads as the edge plus `3px` at `+1px`.
  - Shadows: `--ds-shadow-menu`, `-modal` and `-tooltip` all start with the gray-alpha-400 1px ring, then small soft drops; menus and cards add a background-200 1px ring under it, so their edge shows a step darker than a bare hairline.
- **Materials page**: base radius 6px (`--geist-radius`), menus and modals 12px, tooltips 6px, fullscreen 16px.
- **Parts and how they are read**:
  - `button.*` come from the size row of /geist/button (`:nth-child` picks primary, secondary, tertiary); `button.focus` tabs to the primary. The docs show icon-only buttons only as primaries, so `button.icon` reads just the 36px square's radius and height.
  - `input` and `input.focus` read `[data-geist-input-wrapper]`, which draws the edge and the focus border, with `ink` on the input. The covering input computes 0px corners and the wrapper no padding, so `borderRadius` and `paddingInline` are left out. `field.label` is the 13px label above a field.
  - `checkbox`, `radio` and the `switch.*` track are the drawn boxes after their hidden inputs; `checkbox.checked` clicks a label first. `segmented.*` are the first Geist Switch (Source / Output) on /geist/switch: its unselected item is clear, so its `borderRadius` is left out.
  - `tab.selected` leaves out `edge`: Geist draws a 2px bottom border on the tab itself, dotUI a separate indicator. Clear tabs leave out `borderRadius`.
  - `button.quiet`, the tabs and `alert` (the default Note) are clear and sit on the docs' example cards (background-100), not the page, so their `backgroundColor` is left out.
  - `menu`, `menu.item` and `command.*` open the first demo on their page; `tooltip` hovers the first legacy tooltip trigger. That tooltip draws 8px corners while the Materials page specifies 6px, and wraps to two lines, so its `borderRadius` and `height` are left out. `text.muted` is the modal subtitle.
  - `progress` is the default bar (10px, 6px corners). Its fill is a `::-webkit-progress-value` the probe can't read, so `progress.fill` is entered by hand from the bar's classes: gray-1000 with 6px corners.
  - `badge` is the first (gray) badge on /geist/badge; `card` is `.material-base` on /geist/materials, which sets no text color, so `color` is left out. Headings are the `text-heading-40/32/24/20` rows of /geist/typography, with `fontSize` and `letterSpacing` left out on the first two (the specimens set 36px and 30px); `text` is `text-copy-16`, which takes the docs' color.
  - Some docs elements set the `GeistSans` alias, the same font as `Geist`: `fonts` maps it.
- **Not in the pack**: drawer (Geist's is a mobile bottom sheet), calendar (/geist/calendar fails to load headless), toggle buttons and pagination numbers (Geist has neither), nav sidebar and links (dashboard-only).
