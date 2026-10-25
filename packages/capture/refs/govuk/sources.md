# GOV.UK: sources

GOV.UK publishes its styles as code: [`govuk-frontend`](https://github.com/alphagov/govuk-frontend) 6.6.0 on npm, the version the Design System site serves. Live gov.uk serves 6.1.0 with the same v6 palette (text #0b0c0c, secondary text #484949, borders #cecece, light grey #f3f3f3, button green #0f7a52, link #1a65a6, brand blue #1d70b8, focus #ffdd00). `tokens.json` is measured; the package's `dist/govuk/settings/_colours-*.scss`, `helpers/_typography.scss` and component SCSS were used to name what the probe read and to check it.

## 2026-10-23

All pages public and headless (`presets:measure --pack govuk`), 1440×900, signed out, light only (see "No dark mode"). Reference screenshots, crops and compare sheets are in the project files under `presets/govuk/2026-10-23/`.

- **Wide pass first**: 40 live pages (the home page, search, browse, 6 guides and smart answers, organisations, bank holidays, foreign travel advice, the service manual, statistics, sign-in, and transactional services on DVLA vehicle enquiry, HM Passport Office, HMRC and GOV.UK One Login) plus 138 Design System component examples, each with a full-page shot and a computed-style survey of every GOV.UK element (about 14,000 rows). Every service runs on govuk-frontend: the same components, palette and type everywhere. DVLA vehicle enquiry is still on the v5 palette (#00703c buttons, #1d70b8 links, #b1b4b6 borders), so it isn't the reference.
- **Live gov.uk pages** carry the parts a real citizen sees:
  - `check-uk-visa/y` (a smart answer question): the green Continue button and a native select.
  - `calculate-your-holiday-entitlement/y`: radios. The radio box is the label's `::before` (40px, 2px #0b0c0c edge, round); the 20px dot is the `::after`. The checked read clicks the label, then the heading, so the input doesn't keep focus (focus thickens the edge to 4px).
  - `bank-holidays`: the tabs. Unselected tabs are #f3f3f3 plates, 45px, 20px inline padding; the selected one is a white 56px folder tab in a 1px #cecece top, right and left edge, stepping 1px onto the panel's edge. Tab labels are underlined links in #0b0c0c at 400.
  - `universal-credit` and `foreign-travel-advice/france/entry-requirements`: the page title (48/700), govspeak body copy (19/400), h2 (24/700), h3 (19/700) and links (#1a65a6, 400, underlined).
- **Design System examples** (`design-system.service.gov.uk/components/<component>/<example>/index.html`) for parts no live page shows on its own: the secondary and focused buttons, the address fieldset (inputs and labels at 19/400), hint text, checkboxes, tags (default and grey), pagination, the notification banner and the summary card.
  - Buttons stand on a 2px lip: `box-shadow: 0 2px 0 #083d29` under the green, `#858686` under the secondary's #f3f3f3 plate. The secondary has no edge. Pressed, the button drops 2px and the lip goes.
  - Focus is a yellow fill, not a ring: a focused button turns #ffdd00 with #0b0c0c text, its lip turned black (`box-shadow: 0 2px 0 #0b0c0c`), so `button.focus` reads no ring. Links do the same. Fields keep their 2px black edge, thicken it to 4px with an inset shadow, and add a 3px #ffdd00 outline; checkboxes and radios do it with a 4px edge plus a 3px yellow shadow.
  - Checkboxes: a 40px clear box in a 2px #0b0c0c edge; checked draws a black tick on the clear box, no fill.
  - Tags: 30px, r1, 19/400, no case change since v5. Default #d2e2f1 under #0f385c; grey #cecece under #0b0c0c.
  - Pagination: the current page is #1a65a6 under white 700 numerals, 45px, 15px inline padding.
  - Notification banner: a 5px #1d70b8 frame, its title on a #1d70b8 band, over a white body. The error summary is the same shape in #ca3535. Inset text is a 10px #cecece left rule.
  - Summary card: a 1px #cecece edge with a #f3f3f3 title band, no shadow.
  - Disabled buttons sit at 50% opacity. govuk-frontend sets no transitions or animations on any component.
- **Fonts**: GDS Transport is licensed for gov.uk only, so `tokens.json` maps it to Arimo in `fonts`: Arimo is metric-compatible with Arial, GOV.UK's own fallback stack (`"GDS Transport", arial, sans-serif`).
- **No dark mode**: all 40 live pages were shot under `prefers-color-scheme: dark` too, and 39 were pixel-identical to light. The passport service page differed by rendering noise only (both bodies white). govuk-frontend has no dark palette or theme switch, so the preset's dark is derived on #0b0c0c, the text black.
- **No menus, dialogs, drawers, command palette or calendar**: GOV.UK has no dropdown menu or modal (the date input is three plain fields), so those sheets have no reference and are scored for coherence.
