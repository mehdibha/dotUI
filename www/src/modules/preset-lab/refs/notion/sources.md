# Notion: sources

Notion publishes no design tokens as code. Values come from computed styles in the product.

## 2026-10-21: public pages

Public pages, measured headless with probe 8eb9b12 (`presets:measure --pack notion`), light and dark through `prefers-color-scheme`, at 1440×900. Crops, compare sheets and the measure diffs are in the project files under `presets/notion/2026-10-21/`.

- **Published template pages on notion.site**: the app's own page renderer, read-only. They ship the app's components, theme and type for everything a visitor can see: the top bar, the sidebar, database views, view tabs, menus, tooltips and the search palette.
  - [Habit tracker](https://notion.notion.site/Habit-tracker-6c74e120b02742b99e3cbcc2f6aa7814) (Notion's own template): buttons, view tabs, board-card checkboxes, the page title, the More actions menu, the Filter tooltip, the search palette (Search in the top bar), the sidebar (Lock sidebar open) and the button focus ring.
  - [Advanced To-Do List](https://fancy-dirt-12c.notion.site/Advanced-To-Do-List-1951f851a8d2802da70cecf6f3c8741f): h2 and h3 blocks, body text, and select tags on gallery cards.
  - [Student Planner](https://notion-templates.notion.site/Student-Planner-b2ef466611c24bff840e0261bbe09e1c): a checked to-do box.
- **notion.so/login**, public. It ignores `prefers-color-scheme`, so it is measured in light only (`"mode": "light"`). It is the marketing face (Inter, a 40px r8 field with a small drop), so `input` keeps only its fill and edge.

Cross-checks, no longer in `targets.json` because the signed-in app owns their parts:

- [The Habit tracker with a habit in center peek](https://notion.notion.site/Habit-tracker-6c74e120b02742b99e3cbcc2f6aa7814?p=400efdeead058118956eeb6ff4af160f&pm=c) (`pm=c`; wait for `.notion-peek-renderer .notion-scroller`): the same r12 panel as the app's Settings dialog, with a softer drop (`0 8px 12px` and `0 2px 6px` at 2.7%). With `pm=s` the item opens in side peek, Notion's drawer: docked right, full height, square, 720px in a 1440 window, no backdrop. The probe has no drawer part, so it is compared from screenshots only.
- The Habit tracker's board cards (#252525 in dark, a #2b2b2a ring), cookie-settings switches (off track #d3d1cd / #5e5f5f) and top-bar More actions button (28px r4). The app draws cards at #202020, the off track at #dbdad6 / #4e4f4f and icon buttons at r6.
- [Thesis & Dissertation Planner](https://elemental-accordion-08e.notion.site/Thesis-Dissertation-Planner-cb6edf44cfc582acb707017e69c2ca1b): links bolded by the template's author (600), and a table view for the Display sheet (screenshots only: the probe has no table part).
- [Events Calendar](https://notion.notion.site/986388bef53c485a8ad1efe1022a650d?v=4757818278d74a99a8a40fa12d906ab8): the calendar view's today marker, a 24px #e56458 circle with white text, as in the app's date picker.

## 2026-10-22: signed-in app

`https://app.notion.com/` (`signedIn`), measured by Mehdi in a local Chrome over CDP at 1440×900, DPR 2, light and dark through emulated `prefers-color-scheme` (Appearance stays "Use system setting"; nothing in the account changed). Parts were measured on a private probe page built for the pass (H1–H3 blocks, a paragraph with a link, two to-dos, an @Tomorrow mention, a callout, a toggle, and an inline database with a Select, a Date and a Checkbox property in Table, Board and Calendar views, the board opening pages in center peek), then the page was moved to Trash. Readings were merged with `--merge --mode light|dark` per page key. Crops (UI chrome and the probe page's own content only) and the raw bundles are in the project files under `presets/notion/2026-10-22/`; full-page shots stay private.

- `https://app.notion.com/`: `dialog` (Settings & members, behind the workspace switcher), `select.trigger` (Preferences › Appearance), `switch.on` and `switch.off` (Preferences), `calendar.day`, `calendar.today` and `calendar.selected` (the @-date picker, react-day-picker 8), `alert` (a callout), `heading.4`, `link`, `button.icon` (the top bar's ⋯) and `kbd` (the sidebar search's ⌘K chip).
- `https://app.notion.com/#board-view`: `card`, on the probe database's Board view.

Measured in the app but kept from the public pages: `command` and `tooltip` read the same; `nav.item`, `nav.item.active`, `menu.item` and `command.item` read wrappers (16px, no inset); `button.secondary` was a 24px small button ("Manage in Calendar"), not a standard one; the Share invite field's probe read its inner wrapper (24px, no edge), so `input` stays the login field; `checkbox` read a to-do block, and `badge` a table cell (below).

Theme as measured: page #fff / #191919, ink #2c2c2b / #f0efed, muted #7d7a75 / #ada9a3, sidebar #f9f8f7 / #202020, blue `#2783de` (the marketing blue is #0075de), red #e56458. Controls are 28px r6 at 14px (primary 14/500, quiet 14/400), icon buttons 28px r6, select triggers 28px r6 at 14/500 with an 8px inset, menus and cards r10 (dark cards #202020, menus #252525), dialogs r12 under `0 24px 48px` at 24% plus `0 4px 12px` at 14% over rgb(15,15,15) at 60% / 80%, the search palette r20 with r12 rows and no backdrop, checkboxes 14px r3 (to-do blocks 16px at r1.5 with a 1.5px ink border, #383836 / #e6e5e3), switches 30×18 with a 14px knob, tags 18px r4 at 12/400 on cards (20px at 14/400, 8px inset, in tables), date picker days 28px r6 at 14/400 with today a 24px circle, callouts r10 with no edge on #f9f8f7 / #383836, the ⌘K chip 18px r4 on rgba(42,28,0,.07). Table view: no frame, 36px header (14/400 muted) and 36px rows plus a 1px rule, a 1px rule between columns. Toggle blocks: a filled caret and a 16/400 title.

## Mapping notes

- Edges are 1px rings in box-shadow (`rgba(42,28,0,.07)` on menus, cards and dialogs, about #f0efed on white), which `edge` reads. On the board the card's ring reads #eae8e5.
- `button.secondary` is a button block, which a published page renders at 40% opacity (read-only); the probe reads the block's own colors, so its edge and ink stand, but not its size.
- `button.focus`: Notion draws a transparent 2px outline (a forced-colors fallback) under a box-shadow stack: a 2px page-colored gap, the 2px #2383e2 ring, then a 2px halo (white 25% in light, the page color in dark). The probe reads the outermost ring, the halo, which doesn't show against the page, so the visible ring was merged by hand after each `--pack` run: `{ "button.focus": { "edge": "none", "ring": "2px rgb(35, 131, 226) +2px" } }` with `--merge` in both modes.
- `checkbox` skips its fill: the board card's box is clear over the card in dark, the specimen's sits on the page.
- `command.item` skips its fill: Notion highlights the first result, the specimen's rows rest.
- `nav.item` and `nav.item.active` read the sidebar row (`data-inp-target=sidebar-page-item`) with the label as `ink`.
- `text.muted` keeps only its color: the search palette's "Pages" section label (12/500).
- `link` is the probe page's own link: the text's weight (400) and ink, underlined (`linkColor: neutral`, `linkUnderline: always`).
- `button.icon` skips its edge: the specimen's icon button is the outline one, Notion's ⋯ is quiet.
- `kbd` skips its label (`color`, `paddingInline`, type): the chip's `ink` fell back to the outer span (14px, not the chip's 11px).
- `calendar.day` in dark reads the date picker's #252525 popover through the clear cell; the specimen's calendar sits on the page.
- `input.focus` is left out: the login field draws a 1px inset ring plus a 1px outer ring in blue, against the specimen's 2px border. The app's invite field opens focused with a blue border (screenshot only).
- Notion's editor strips `data-probe-part` from contenteditable blocks, so headings, text, the link and the callout have no crops; their measures stand.
- Re-running `--pack notion` keeps the signed-in parts (no public page owns them). After it, merge the focus ring again.
