# Notion: sources

Notion publishes no design tokens as code. Values come from computed styles in the product.

## 2026-10-21

`tokens.json` comes from public pages, measured headless with probe 8eb9b12 (`presets:measure --pack notion`), light and dark through `prefers-color-scheme`, at 1440×900. The signed-in app is not measured yet. Crops, compare sheets and the measure diffs are in the project files under `presets/notion/2026-10-21/`.

- **Published template pages on notion.site**: the app's own page renderer, read-only. They ship the app's components, theme and type for everything a visitor can see: the top bar, the sidebar, database views, view tabs, menus, tooltips and the search palette.
  - [Habit tracker](https://notion.notion.site/Habit-tracker-6c74e120b02742b99e3cbcc2f6aa7814) (Notion's own template): buttons, view tabs, board cards and their checkboxes, the page title, the More actions menu, the Filter tooltip, the search palette (Search in the top bar), the sidebar (Lock sidebar open), the cookie-settings switches, the top bar's More actions icon button and the button focus ring.
  - [The same template with a habit opened in center peek](https://notion.notion.site/Habit-tracker-6c74e120b02742b99e3cbcc2f6aa7814?p=400efdeead058118956eeb6ff4af160f&pm=c) (`pm=c`): `dialog`. With `pm=s` the item opens in side peek, Notion's drawer; the probe has no drawer part, so it was compared from screenshots only.
  - [Advanced To-Do List](https://fancy-dirt-12c.notion.site/Advanced-To-Do-List-1951f851a8d2802da70cecf6f3c8741f): h2 and h3 blocks, body text, and select tags on gallery cards.
  - [Student Planner](https://notion-templates.notion.site/Student-Planner-b2ef466611c24bff840e0261bbe09e1c): a checked to-do box.
  - [Thesis & Dissertation Planner](https://elemental-accordion-08e.notion.site/Thesis-Dissertation-Planner-cb6edf44cfc582acb707017e69c2ca1b): inline links, and a table view for the Display sheet (screenshots only: the probe has no table part).
  - [Events Calendar](https://notion.notion.site/986388bef53c485a8ad1efe1022a650d?v=4757818278d74a99a8a40fa12d906ab8): the calendar view's today marker, a 24px #e56458 circle with white text. `calendar.today` keeps fill and radius: the view is a month grid, not a date picker, so its size doesn't compare.
- **notion.so/login**, public. It ignores `prefers-color-scheme`, so it is measured in light only (`"mode": "light"`). It is the marketing face (Inter, a 40px r8 field with a small drop), so `input` keeps only its fill and edge; the app's own fields are not on any public page.

Theme as measured: page #fff / #191919, ink #2c2c2b / #f0efed, muted #7d7a75 / #ada9a3, sidebar #f9f8f7 / #202020, blue `#2783de` (the marketing blue is #0075de), red #e56458. Controls are 28px r6 at 14px (primary 14/500, quiet 14/400), menus and cards r10, the search palette r20 with r12 rows, checkboxes 14px r3 (16px on to-do blocks), switches 30×18 with a 14px knob, tags 18px r4 at 12/400, icon buttons 28px r4. Table view: no frame, 36px header (14/400 muted) and 36px rows plus a 1px rule, a 1px rule between columns. Toggle blocks: a filled caret and a 16/400 title. Center peek: 960×756 at r12 over rgb(15,15,15) at 60% / 80%. Side peek: docked right, full height, square, 720px in a 1440 window, no backdrop.

Mapping notes:

- Edges are 1px rings in box-shadow (`rgba(42,28,0,.07)` on menus and cards, about #f0efed on white), which `edge` reads.
- `button.secondary` is a button block, which a published page renders at 40% opacity (read-only); the probe reads the block's own colors, so its edge and ink stand, but not its size.
- `button.focus`: Notion draws a transparent 2px outline (a forced-colors fallback) under a box-shadow stack: a 2px page-colored gap, the 2px #2383e2 ring, then a 2px halo (white 25% in light, the page color in dark). The probe reads the outermost ring, the halo, which doesn't show against the page, so the visible ring was merged by hand after each `--pack` run: `{ "button.focus": { "edge": "none", "ring": "2px rgb(35, 131, 226) +2px" } }` with `--merge` in both modes.
- `switch.on` and `switch.off` are the cookie-settings switches (More actions › Cookie settings; the fourth switch toggled off, then the pointer moved to a description so the track reads at rest).
- `checkbox` skips its fill: the board card's box is clear over the #252525 card in dark, the specimen's sits on the page.
- `command.item` skips its fill: Notion highlights the first result, the specimen's rows rest.
- `nav.item` and `nav.item.active` read the sidebar row (`data-inp-target=sidebar-page-item`) with the label as `ink`.
- `text.muted` and `link` keep only their color. The muted sample is the search palette's "Pages" section label (12/500). The links on the Thesis page are bolded by its author (600); in Notion's own Habit tracker template a link takes the text's weight (400), its ink at 70% opacity, underlined (`linkColor: neutral`, `linkUnderline: always`).
- `button.icon` skips its edge: the specimen's icon button is the outline one, Notion's More actions button is quiet.
- `dialog` waits for the peek to render (`steps`). In light its ring is black-tinted at 7%, which the probe composites over the scrim (#6a6967); the specimen draws an opaque hairline.
- `input.focus` is left out: the login field draws a 1px inset ring plus a 1px outer ring in blue, against the specimen's 2px border; the two sides draw it in different places.

Signed-in (`https://app.notion.com/`, `signedIn` in `targets.json`): the Settings dialog, its Appearance select, the Share invite field, the ⌘P palette and the date picker on a scratch page's `@tomorrow` mention. Theme: Settings › Preferences › Appearance, restored after. Its selectors are unverified until the first signed-in run.

Not measured (needs the signed-in app): in-app fields and selects, the Settings dialog, the date picker, the ⌘P backdrop in the app, Settings segmented controls and the in-app secondary button size.
