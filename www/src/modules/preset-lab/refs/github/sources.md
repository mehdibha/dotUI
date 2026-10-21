# GitHub: sources

Primer publishes its tokens as code: [`@primer/primitives`](https://github.com/primer/primitives) 11.10.0, `dist/css/functional/themes/light.css` and `dark.css` (the "light" and "dark" themes, not the dimmed or high-contrast ones). `tokens.json` is measured; the token files were used to name what the probe read and to check it.

## 2026-10-21

All pages public and headless (`presets:measure --pack github`), 1440×900, signed out. Reference screenshots and compare sheets are in the project files under `presets/github/2026-10-21/`.

- **github.com repository pages**, light and dark through `prefers-color-scheme`: the repo home (`/mehdibha/dotUI`), its Issues list and Insights › Pulse. Signed out, github.com serves the same Primer components as the app (`data-component` attributes) with `data-a11y-link-underlines="true"`, so inline links are underlined.
  - The repo home holds the buttons (the green Code button, the secondary Go to file), the Go to file field, the UnderlineNav tabs, the README (headings, body text, links) and the branch ActionMenu (opened by its button). Tab fills are left out: the tabs sit on the header band (#f6f8fa / #010409), not a fill of their own.
  - Issues holds the NavList rows (`nav.item`, `nav.item.active`, label color from `ActionList.Item.Label`) and the page title (`heading.4`, 20/600). Pulse holds the bordered `.Box` (`card`); the README box paints nothing of its own.
  - Raw extras the parts don't carry: UnderlineNav's current tab has a 2px coral underline on `::after` (#fd8c73 / #f78166, `underlineNav-borderColor-active`); the current NavList row has a 4×24px bar 8px out from the row, r6, in #0969da / #1f6feb; link underlines sit 3.2px under the text.
- **Primer React Storybook** (`primer.style/react/storybook`), the theme set by the `globals=colorScheme:light|dark` URL global (each page's `dark` URL). Stories: Button (invisible, primary focused), TextInput, Select, Checkbox, ToggleSwitch (default and checked), TooltipV2, Dialog, KeybindingHint, Label (default and accent), RadioGroup, SegmentedControl, ProgressBar, Banner (warning) and Pagination.
  - Dialog: header and footer split by rules, 640px wide by default, a 32×32 invisible close button. Backdrop #c8d1da66 / #21283066, no blur.
  - ToggleSwitch: a 64×32 track, r6, with a 31×28 knob, r4. TooltipV2: 12px text, 4px 8px padding. KeybindingHint: a 20px chip, r6.
  - `button.focus` is a 2px outline at -2px: flush with the outer edge, so the probe reads it as the edge.
  - `input.focus` is the TextInput wrapper: Primer draws the focus on it with `:focus-within`, a 2px outline at -1px over the 1px accent border.
- **Fonts**: Primer's stack starts with "Mona Sans VF", but github.com serves no face for it, so it renders the system stack (`-apple-system`, `Segoe UI`, …). Mono: `ui-monospace`, SFMono-Regular, …
- **No date picker** in Primer React or on public pages: the dates sheet has no reference.
