# The Guardian reference pack

Measured 2026-10-23, headless at 1440px, no sign-in; re-measured 2026-10-26 on probe ce94064 with no change in the product. The Guardian's web front end is DCR (dotcom-rendering); its components come from Source, the Guardian's open-source design system. Light is the default; web dark mode is real but behind an opt-in (below). Articles and fronts restyle per pillar (news red, opinion orange, sport blue, culture brown, lifestyle pink): the pack measures news and neutral pages, and the pillar accents are a ledger look.

## Official sources

- [`@guardian/source`](https://www.npmjs.com/package/@guardian/source) 14.0.0: `foundations` (palette, typography, sizes) and `react-components` (Button, TextInput, Select, Checkbox, Radio, ChoiceCard, Link, Label, user feedback). Themes read in `dist/react-components/*/theme.js`.
- [`@guardian/source-development-kitchen`](https://www.npmjs.com/package/@guardian/source-development-kitchen) 30.0.0: ToggleSwitch, Tabs, InfoSummary / ErrorSummary.
- DCR palette: `dotcom-rendering/src/paletteDeclarations.ts` at [`dffaae3`](https://github.com/guardian/dotcom-rendering/tree/dffaae3074e5f6c49cfb17bc2e3c05d60c23c013), one light and one dark value per role, emitted as custom properties on every page (`--article-background`, `--button-background-primary`, …).
- Storybooks (Chromatic, public): Source `main--5e933197d94d9c002275a15e.chromatic.com`, Source development kitchen `main--664e157241c2ba0925660bce.chromatic.com`. They render the published components; their parts are light only.

| Source token                                                                    | Value                                           | Used for                                 |
| ------------------------------------------------------------------------------- | ----------------------------------------------- | ---------------------------------------- |
| `brand[400]`                                                                    | #052962                                         | Primary button, masthead, gateway titles |
| `brand[500]` / `focus[400]`                                                     | #0077B6                                         | Checks, radios, Source links, focus halo |
| `brand[800]`                                                                    | #C1D8FC                                         | Secondary button fill                    |
| `brandAlt[400]`                                                                 | #FFE500                                         | Reader-revenue buttons ("Support us")    |
| `neutral[7]` / `[46]` / `[86]`                                                  | #121212 / #707070 / #DCDCDC                     | Text, field edges, rules                 |
| `error[400]` / `success[400]`                                                   | #C70000 / #22874D                               | Status                                   |
| `news[400]` / `opinion[400]` / `sport[400]` / `culture[400]` / `lifestyle[400]` | #C70000 / #E05E00 / #0077B6 / #866D50 / #BB3B80 | Pillar accents                           |

DCR dark roles (light → dark): article background #FFFFFF → #1A1A1A, article text #121212 → #DCDCDC, article link #C70000 → #DCDCDC (underline #DCDCDC → #707070), primary button #052962 → #DCDCDC under #052962 text, section borders #DCDCDC → #333333.

## Dark mode

DCR ships dark mode for web behind an A/B test that is on at 0% audience (`webx-dark-mode-web` in `ab-testing/config/abTests.ts` at the SHA above). Its public opt-in, `https://www.theguardian.com/ab-tests/opt-in/webx-dark-mode-web:enable`, sets the cookie `gu_force_test_groups=webx-dark-mode-web:enable`; with it, `prefers-color-scheme: dark` turns the site dark. The pack's theguardian.com pages carry that cookie (`cookies` in `targets.json`). The site labels it "a work-in-progress": the masthead and its edition menu stay navy and white in dark, and a few reader-revenue banners keep light fills.

- The gateway (profile.theguardian.com) follows `prefers-color-scheme` without the cookie: black page (#000000), black fields on a #999999 edge, white primary button.
- support.theguardian.com and manage.theguardian.com ignore the dark preference: light only.

## Measured pages

- Article (Florida, US news): page, `heading.1` (headline, GH Guardian Headline 34/500), `text` (body, Guardian Text Egyptian 17/400), `text.muted` (caption), `link` (body link), `badge` (keyword tag pill at the foot). `#menu`: the edition picker under the masthead, light only since it stays white in dark.
- Article (France, world news): `heading.3` (onward container title, 24/700) and `heading.4` (card headline, 20/500).
- `/podcasts`: `tab` / `tab.selected`, the Most viewed tabs (a 4px top bar on the current tab, no fill).
- Gateway sign-in: `heading.2` (page title, 28/700), `field.label`, `input`, `input.focus`, `button.primary` (Continue with email), `button.secondary` (Continue with Google, the tertiary priority), `button.focus`.
- Football tables: `select.trigger`, the competition picker.
- support.theguardian.com/uk/contribute, light only: `segmented` (Monthly / Annual), `badge.accent` (Recommended).
- Source Storybook, light only: `checkbox`, `checkbox.checked` (CheckboxGroup), `radio`, `radio.checked` (RadioGroup), `button.quiet` (subdued priority), `button.icon` (icon-only, small).
- Kitchen Storybook, light only: `switch.off` / `switch.on` (ToggleSwitch), `alert` (InfoSummary).

## Probe notes

- theguardian.com pages open under a Sourcepoint consent banner fixed over the page; `hide` removes `[id^=sp_message_container]` after a 3000ms settle, so crops show the parts.
- Source radios paint their fill on a pseudo-element the probe reads as #707070 or blue: both radio parts skip `backgroundColor` (the box is clear on white in the Storybook).
- `button.icon` is the small icon-only button: its fill and edge follow the priority the story picks, so only its size and corners are compared.
- `checkbox`: the default CheckboxGroup story renders one box checked; the part clicks it off, then hovers the legend to clear the hover edge.
- `segmented` is the contribution picker on the support site: Monthly and Annual on a navy band, the current one a white 12px chip. It is the only segmented control the product shows, so it stands for one, light only.
- `tab` / `tab.selected` hover the Most viewed heading first, so the tabs render; their inline padding comes from the list's grid and is skipped.

## Fonts

GH Guardian Headline, Guardian Text Egyptian and Guardian Text Sans are proprietary. Stand-ins, picked side by side on the same text at the product's sizes: Newsreader (headline: high contrast, narrow), Literata (Egyptian: slab-leaning text serif), Hanken Grotesk (Text Sans: humanist, open apertures). `tokens.json` maps them in `fonts`.

## Cross-checks (not in targets.json)

35 pages crawled in both modes on 2026-10-23 (fronts: international, UK, sport, culture, lifestyle, opinion; articles: news, opinion, review, lifestyle, sport, culture; three live blogs; gallery, audio, video, cartoon; tag pages; football tables, fixtures, results; crosswords; newsletters; podcasts; gateway sign-in, register, reset; support contribute and subscribe; help centre). Full-page shots in project files `presets/guardian/2026-10-23/pages/`.

- Buttons are Source pills everywhere: 44px default, 36px small (article Share, newsletter "Sign up for our email"), 24px x-small (masthead "Support us", tag Sign up), 17/700 Guardian Text Sans (14/700 at x-small), padded 20px (16 small, 12 x-small).
- Fields are 44px, 4px corners, 1px #707070 (#999999 on the dark gateway), 17px text; the football select and the article newsletter field match the gateway field.
- Links: gateway and support links are #0077B6 at 700 (#DCDCDC in dark); article body links take the pillar color at 400 under a 1px #DCDCDC rule.
- Cards on fronts have no fill, edge or corner: a 1px #BABABA top rule and the headline. Newsletter cards are #F6F6F6 tiles, square.
- Headings: article headlines are GH Guardian Headline 500 at 34px (28px on features), container titles 700 at 24px, card headlines 500 at 14–34px by slot.
