# Linear: sources

Linear publishes no design tokens as code. Values come from computed styles in the product.

## 2026-10-21

`tokens.json` and `targets.json` come from the signed-in app. Raw measures (every part, theme variables) and crops are in the project files under `presets/linear/2026-10-21/`.

- **The signed-in app**, through Claude in Chrome on Mehdi's Mac (1512×743, DPR 2), Interface theme set to Light then Dark and restored. Pages: Settings (Preferences, Profile, Security, Issue labels), My issues, the Create issue dialog (C), ⌘K and the workspace menu. Only generic controls were read; `<ws>` in `targets.json` stands for the workspace slug, and a page key's parenthesis names the interaction that opens the part.
  - Theme: runtime LCH. Light neutrals on hue 282 (shell 94.44, panel 97.94, raised 100), dark on hue 272 (shell 2.595, panel 5.52, raised 9.232, menus 12.72). The accent shifts per mode: `lch(53 52.26 286.91)` #6d78d5 in light, `lch(47.918 59.303 288.421)` #5e6ad2 in dark. Labels use a secondary ink (#303032 / #e4e5e7), values and headings the primary (#1b1b1b / #fff).
  - Most edges are a 0.5px ring on `::after` (`lch(0 0 0 / 0.088)` light, `lch(100 0 0 / 0.14)` dark) plus small drops. `tokens.json` records every hairline as `edge`, wherever Linear draws it.
  - Sizes: buttons 32px / 12px padding / 13px at the default size (28px / 12px in dialog footers), fields 32px r8, select trigger 30px r8, menu rows 32px with a 6px-inset r8 highlight, menus r12, tooltips 28px r8 at 11px, tabs 28px pill chips at 12/500, switch 30×20 with a 14px knob, checkbox 14px r3, card r10, dialog r21 at 750px, ⌘K 720px wide with 46px rows at 13/450, both 97px from the top.
  - Focus: `outline: 1px solid` accent at `0px` offset on buttons and select triggers, `-1px` on fields. The dialog scrim is black 25% (light) / 40% (dark), no blur.
  - `button.focus` is the outline on a focused pill button. `input.focus` is left out: Linear's 1px outline sits at `-1px`, over the 0.5px border, which reads as the border turning accent (`focusInputStyle: border`), while the probe compares rings.
  - `checkbox` measures the visible box (the native input is transparent); `menu.item` leaves out padding, since Linear pads the row and insets the highlight while the specimen pads inside the inset.
  - `nav.item` and `nav.item.active` take color from the label (the anchor itself computes white in dark). `heading.3` is the 24px settings title. `link`, `text` and `text.muted` leave out font size, which follows the surrounding text on both sides.

- **linear.app/login**, public, headless (`presets:measure --url`), light and dark through `prefers-color-scheme`. The login screen ships the app's own button and field components and the app's CSS variables. Its controls are the large size (44px); colors, radii and type agree with the app. The field appears after "Continue with email".
  - Secondary buttons draw their edge on `::after`: a 0.5px ring (`#00000016` light, `#ffffff22` dark) plus a small drop; hover thickens the ring to 1px.
  - Focus: `outline: 1px solid` accent at `0px` offset on buttons, `-1px` on fields (`--focus-ring-outline`).
  - Links: body ink (`#2f2f31` / `#e2e3e5`) against muted text (`#5b5c5e` / `#949597`), weight 450, no underline at rest or on hover.
  - Variables worth knowing: `--editor-surface-background` `#f8f8f9` / `#111212` (the content panel), `--bg-sidebar-color` `#efeff0` / `#09090a`, `--bg-border-color` `#e2e2e2` / `#212224`, `--focus-ring-color` `#6d78d5` / `#5e69d1`, `--font-weight-normal` 450, `--font-size-small` 13px, `--font-monospace` Berkeley Mono.
- **linear.app/docs**: app screenshots on webassets.linear.app (demo workspaces, mostly dark). Several predate the 2025 pill buttons, so they serve as reference images for layout only, not values.
- **Brand**: linear.app/brand names the primary brand color a "subtle desaturated blue"; the app's dark accent computes `#5e69d1`.
