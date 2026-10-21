# Untitled UI: sources

Untitled UI React is open source (React Aria Components + Tailwind v4), so its tokens are code. Values come from its theme CSS and from computed styles on its public docs. No sign-in was needed.

## 2026-10-21

`tokens.json` was measured headless (`presets:measure --pack untitled`, 1440×900) from the pages in `targets.json`, both themes, and re-measured the same day on probe 8eb9b12. Reference shots, compare sheets and raw measures are in the project files under `presets/untitled/2026-10-21/`.

- **untitleduico/react** at 1d410cb (2026-10-09), `styles/theme.css`: the semantic tokens behind every class the docs compute.
  - Grays are Tailwind neutral (chroma 0); the brand ramp is purple (brand-600 `#7f56d9` solid, brand-500 `#9e77ed` and brand-400 `#b692f6` focus rings, brand-700 `#6941c6` brand text, brand-50 `#f9f5ff` washes).
  - Ink runs four steps: neutral-900 values and headings, neutral-700 control labels, menu rows, badges and sidebar rows, neutral-600 supporting text, neutral-500 placeholders and unselected tabs. Dark mirrors them (50, 300, 400, 400).
  - Dark surfaces stay on the page tone (`#0a0a0a`): cards, menus, dialogs and the command palette are told apart by hairlines and shadows, not lighter fills.
  - Display type: 36px and up carry -2% tracking; 30px and below none. `heading.1`–`heading.3` in `tokens.json` are hand-entered from these tokens (36/600/-0.72px, 30/600, 24/600) with `heading.4`'s color and family.
- **untitledui.com/react/components/\***, the docs pages: their inline demos render the library's real components. Dark mode is next-themes (`localStorage.theme` → `.dark-mode`), so every page sets `"storage": "theme"`.
  - Pages share one origin and next-themes syncs the theme across tabs, so light and dark mixed until each page got its own browser context (probe 8eb9b12).
  - Buttons default to size sm: 36px, 12px padding, 14/600, r8. The primary's edge is a 1px `rgba(0,0,0,0.18)` inner ring; the focus ring is 2px brand-500 (brand-400 dark) at +2px.
  - Fields draw their box on a wrapper and their text on the `<input>`, so `input` measures the wrapper and reads its ink from the input (`ink`). On focus the wrapper draws a 2px brand-500 (brand-400 dark) inset ring under `focus-within`; it sits flush with the edge, so `input.focus` reads it as `edge`.
  - React Aria tooltips don't open on a hover: `tooltip` focuses its trigger (a `focus` step) and waits for `[role=tooltip]`.
  - The default tab is the `button-brand` type (36px, px 10, r6, 14/600): brand-50 / brand-700 when selected in light, neutral-900 / neutral-300 in dark.
  - Untitled has no segmented control: `segmented` measures the `button-border` tabs, the look the preset maps to it (a 44px neutral-50 track, r10, 1px neutral-200 ring, 4px padding; 36px chips at r6, 14/600, the selected one white with shadow-sm and no edge). Its button groups are the button-group look (`groupSeparator: shared-edge`).
  - `button.icon` is the secondary icon-only button at sm (36px). `badge.accent` is the brand pill at md. `pagination.current` is a 36px square, so its padding is skipped.
  - The calendar is the date picker in the day view's sidebar (the other demos hide it at this width). Today starts selected, so `calendar.today` selects another day first: 40px circles, days 14/400, today on neutral-50 and selected on brand-600 at 14/500.
  - Badges are the gray pill at md (24px, px 10, 14/500). Menus: r8, ring black 10%, shadow-lg; dropdown rows 36px (38 with their gaps) at 14/600, select rows 40px at 16/500.
- **untitledui.com/react/iframe/\***, the demos' preview frames: whole screens with nothing of the docs around them, used for the alert, the command palette, the modal, the sidebar, the dashboard and the page headers.
  - The default floating alert (`alert-floating-default-demo`): r12, a 1px neutral-300 edge, shadow-xs, on white / neutral-900; its ink is read from the title (14/600 neutral-700).
  - Command palette r12 with no edge and shadow-xl; rows 40px r8 at 14/500; shortcut keys 24px r4 at 14/500 on neutral-50 with a neutral-200 ring.
  - Modal r16, no edge, shadow-xl, on the page tone; the scrim is neutral-950 at 70% with a 6px blur in light, neutral-800 at 70% in dark.
  - Sidebar rows 36px r6, 14/600 neutral-700 at rest; the current row neutral-50 with neutral-800 ink.
