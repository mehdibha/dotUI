# GitHub: sources

Primer publishes its tokens as code: [`@primer/primitives`](https://github.com/primer/primitives) 11.10.0, `dist/css/functional/themes/light.css` and `dark.css` (the "light" and "dark" themes, not the dimmed or high-contrast ones). `tokens.json` is measured; the token files were used to name what the probe read and to check it.

## 2026-10-21

All pages public and headless (`presets:measure --pack github`), 1440×900, signed out. Reference screenshots and compare sheets are in the project files under `presets/github/2026-10-21/`.

- **github.com repository pages**, light and dark through `prefers-color-scheme`: the repo home (`/mehdibha/dotUI`), its Issues list and Insights › Pulse, the Pull requests list for the search overlay, and repository search results for `pagination.current`. Signed out, github.com serves the same Primer components as the app (`data-component` attributes) with `data-a11y-link-underlines="true"`, so inline links are underlined.
  - The repo home holds the buttons (the green Code button, the secondary Go to file), the Go to file field, the UnderlineNav tabs, the README (headings, body text, links) and the branch ActionMenu (opened by its button). Tab fills are left out: the tabs sit on the header band (#f6f8fa / #010409), not a fill of their own.
  - The "Search or jump to" dialog (opened from the header on Pull requests) is GitHub's command palette, the same dialog signed in: `command` is the dialog, r12 under the overlay shadow, and `command.item` its 33px suggestion rows. Its backdrop dims the page, so the light ring composites darker (#e2e7ec) than the branch menu's (#f3f5f7).
  - Search results hold the product's Pagination: the current page is a 32px #0969da / #1f6feb square with the number at 14/400. The Storybook story renders it at 16px, so it isn't the reference.
  - Issues holds the NavList rows (`nav.item`, `nav.item.active`, label color from `ActionList.Item.Label`) and the page title (`heading.4`, 20/600). Pulse holds the bordered `.Box` (`card`); the README box paints nothing of its own.
  - Raw extras the parts don't carry: UnderlineNav's current tab has a 2px coral underline on `::after` (#fd8c73 / #f78166, `underlineNav-borderColor-active`); the current NavList row has a 4×24px bar 8px out from the row, r6, in #0969da / #1f6feb; link underlines sit 3.2px under the text.
- **Primer React Storybook** (`primer.style/react/storybook`), the theme set by the `globals=colorScheme:light|dark` URL global (each page's `dark` URL). Stories: Button (invisible, primary focused), TextInput, Select, Checkbox, ToggleSwitch (default and checked), TooltipV2, Dialog, KeybindingHint, Label (default and accent), RadioGroup, SegmentedControl, ProgressBar and Banner (warning).
  - Dialog: header and footer split by rules, 640px wide by default, a 32×32 invisible close button. Backdrop #c8d1da66 / #21283066, no blur.
  - SegmentedControl paints the selected knob on the control's `::before` (white in a #d1d9e0 edge, 30px plus its border), so `segmented.selected` reads that box with the selected label as its ink.
  - RadioGroup: Primer draws the checked radio as a 4px #0969da border around the white center, so `radio.checked` compares only its shape; the fill and edge would read the ring as the edge.
  - Banner: the warning story is the reference, and the specimen's first alert is neutral, so `alert` leaves out the fill and edge and compares the shape and ink.
  - ProgressBar: `progress.fill` is the success item of the half-filled story; the track clips it, so the item itself has no radius.
  - ToggleSwitch: a 64×32 track, r6, with a 31×28 knob, r4. TooltipV2: 12px text, 4px 8px padding. KeybindingHint: a 20px chip, r6.
  - `button.focus` is a 2px outline at -2px: flush with the outer edge, so the probe reads it as the edge.
  - `input.focus` is the TextInput wrapper: Primer draws the focus on it with `:focus-within`, a 2px outline at -1px over the 1px accent border.
- **Fonts**: Primer's stack starts with "Mona Sans VF", but github.com serves no face for it, so it renders the system stack (`-apple-system`, `Segoe UI`, …). `tokens.json` maps "Mona Sans VF" to `-apple-system` in `fonts`. Mono: `ui-monospace`, SFMono-Regular, …
- **No date picker** in Primer React or on public pages: the dates sheet has no reference.

## 2026-10-21, wide pass (public, both themes)

27 public github.com pages, signed out, headless at 1440 wide in light and dark: the repo (home, tree, file, commits, branches, tags), issues (list, detail, labels, milestones), pull requests (list, conversation, files, commits), Actions, releases, discussions, Pulse, contributors, the profile and its repositories, Explore, a topic, Trending, repository search, Marketplace and the login page. Full-page screenshots, a census of every Primer component's computed styles per mode, and the `--bgColor-*` / `--fgColor-*` / `--borderColor-*` variables as the page resolves them are in the project files under `presets/github/2026-10-21/pages/`. The census agrees with `tokens.json` on the shared parts: SegmentedControl on the issues and pulls lists, Flash on the issue page, Labels, TextInput, buttons and NavList. Product-only looks it adds: topic tags filled #ddf4ff / #388bfd1a with accent text, gray-filled Counters (#818b981f / #656c7633), and small 28px 12/500 buttons for most toolbar actions.

## 2026-10-21, signed in (cross-check)

Mehdi's Chrome, signed in, dark (the account follows the system theme, which was dark), 1512×743. Computed styles of UI chrome only, nothing merged: every reading matched `tokens.json` within tolerance, so the public pages stay the truth.

- New issue form: the title TextInput (#0d1117 in a #3d444d edge, 32px, r6, the inset drop; on focus a #1f6feb edge plus a 2px outline at -1px), the 14/600 label, the green primary (#238636 in a 15% white edge) and the secondary button (#212830 in #3d444d).
- Settings › Appearance: native selects styled like TextInput (32px, r6, #3d444d). Its sidebar is the older class-based ActionList: rows rest in full ink, the current row on #656c7633 with the 4×24 #1f6feb bar, but at 400 where NavList's current row is 600. The theme radios are native OS radios, so the Storybook RadioGroup stays the reference.
- ⌘K opens nothing on a repo page; the header's quick-search dialog is the same "Search or jump to" dialog as signed out (#010409, r12, backdrop #21283066). The account menu is an anchored overlay, 256px, like the branch menu.
