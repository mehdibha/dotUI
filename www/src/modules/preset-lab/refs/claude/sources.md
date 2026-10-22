# Claude: sources

Anthropic publishes no design tokens as code. Values come from computed styles in the signed-in app at claude.ai, which runs on the CDS ("Claude Design System") custom properties (`--cds-*`, `html[data-theme=claude][data-mode=light|dark]`).

## 2026-10-22

`tokens.json` and `targets.json` come from the signed-in app, measured on probe 8eb9b12 with the pack's snippets and merged with `--merge`, in both modes. The raw bundles (probe results, every `--cds-*` variable per mode, fonts, a per-page inventory) and the part crops are in the project files under `presets/claude/2026-10-22/`; the full-page shots there stay private (they show chat titles, the account name and usage figures).

- **The signed-in app**, captured by Mehdi in a local Claude Code session driving a research Chrome over CDP: 1440×900 at DPR 2, the mode emulated per tab through `prefers-color-scheme` (Settings › Appearance stays on System, so nothing was changed or restored). Only UI chrome was read. 13 page keys, every one `signedIn`:
  - `/new` (sidebar, composer, tooltip, the + menu, ⌘K), `/new#composer-typed` (send button after typing one character, then cleared), `/new#model-menu`, `/new#account-menu`, `/recents` (Select mode for checkboxes; nothing was changed), `/projects`, `/artifacts`.
  - Settings is a dialog on hash routes: `#settings/general`, `account`, `billing`, `usage`, `capabilities`, and `#customize/connectors/yours` (whose Add › custom connector dialog was opened and cancelled). Privacy is `#settings/data-privacy-controls` (surveyed, no parts). A `goto` that only changes the hash can keep the previous page's content: start each settings pass from `about:blank`. Settings content renders after 3.5s or more (`settle` 5000).
  - Focus parts (`composer.focus`, `button.focus`, `input.focus`) were re-measured with an 800ms settle after Tab: claude.ai eases its ring in, and the first reads caught it mid-transition.
- **Part notes**
  - CDS buttons paint on a child layer, `.cds-btn-squish > span` (`box`), inset 0.5px, so filled buttons read 31px on a 32px button. Disabled buttons keep their fill and fade through the button's opacity, which the probe doesn't read.
  - `button.icon.quiet` is the composer's + button, a quiet icon button; the specimens' `button.icon` is the secondary one, so it's listed apart.
  - `field.label` is a settings row title ("Theme", 14/400 in full ink). claude.ai's form fields have no labels: a placeholder and help text under the field.
  - `text` is a Recents row label; it leaves out font size, since UI text is 14px while running text (chat replies) is 16px in the reading face. `text.muted` is the 12px muted label over the settings nav, so it leaves out font size too.
  - `nav.item` and `nav.item.active` leave out padding: the row pads 2px and the icon box sets the label in. `segmented.selected` is the sliding thumb (`[role=radiogroup] > div[aria-hidden] > div`), which has no padding of its own. `tab` and `tab.selected` read their pill from `::before`.
  - `input` leaves out its fill: CDS fills fields with white at 50% in light and 5% in dark (`--cds-fill-field`), so the fill shows the surface beneath, the connector dialog in the product and the page in the specimens. `kbd` leaves out its fill for the same reason (the ⌘K footer keys are clear, on the palette).
  - `select.trigger` is the Capabilities page's select, which paints nothing: text and a chevron. Menu buttons that open a menu (Group by on /artifacts) are secondary buttons (`button.menu`).
  - `progress.fill` scales a full-width pill with a transform, so its leading end stays round.
  - The ⌘K palette, its rows and Recents rows show chat titles; their crops were deleted and only their measures kept.
- **CDS variables worth knowing** (from the bundles' `vars`): radius 8px (`--cds-radius`; xs 6, sm 7, lg 10), panels 12px, the composer 14px. Ease-out `cubic-bezier(.165,.84,.44,1)` over 60ms, 120ms and 200ms. Weights 500 (medium), 580 (semibold), 600 (bold). Status: success #009300, warning #fab219, danger #d03b3b; role accent #2a78d6, pro #7161e0. Lines at 10% ink, strong lines at 20% (checkbox edges, the off switch track). Surfaces 0–2 and popover: #f9f9f7 / #fcfcfb / #fff / #fff in light, #0b0b0b / #151515 / #1a1a19 / #20201f in dark. Tooltip #0b0b0b in light, #20201f in dark. Backdrop #0006 / #00000080. Focus `inset 0 0 0 1px` page, `0 0 0 1px #2a78d6`, `0 0 6px 1px #cde2fb`. Categorical chart colors #2a78d6, #eb6834, #1baf7a, #eda100, #e87ba4, #008300, #6250d6, #e34948.
- **Fonts**: anthropic-sans (UI), anthropic-serif (page titles, the greeting, replies), anthropic-mono, and the Anthropicons icon font. `fonts` maps them to Instrument Sans, Source Serif 4 and JetBrains Mono.
- **Not on these pages**: radios, toggle buttons, pagination, calendars, alerts and toasts, an inset content panel and an h4. Those sheets are scored for coherence.

## Cross-checks

- **claude.com** (public marketing CSS): a warm gray scale (#faf9f5 … #141413), clay #d97757 / #c6613f (the logo and the send button) and `--color-switch-on` #2c84db, in anthropicSans, anthropicSerif and anthropicMono. Marketing, not the app; nothing from it goes in the pack.
- The earlier reference images in the project files (`presets/claude/legacy-refs/`) are from the Console and docs, not claude.ai.
- claude.ai sits behind a Cloudflare challenge from cloud containers (403 headless and with curl): signed-in capture runs on the user's machine.
