# Duolingo

Measured 2026-10-21 from the public web app, headless Chromium at 1440×900, and 2026-10-22 from the signed-in app in a local Chrome (1440×900, DPR 2), probe `8eb9b12`. Where the app and a public page show the same part, the pack measures the app.

## Pages

- `/log-in`: buttons, the email field and its focus state. Follows `prefers-color-scheme`.
- `/efficacy`: links, in both themes.
- `/register#lesson`, `#check` and `#hearts`: the guest lesson, reached by page `steps` that walk the onboarding from the course picker (Spanish, then one answer and Continue per screen) to the first challenge, "Which one of these is “cat”?". The tiles change between runs but the answer is always `gato`, so `#check` and `#hearts` pick the first tile without it. `#lesson` reads the page, heading, keycaps and progress track; `#check` the Check button with a wrong tile picked; `#hearts` the modal after Check. They follow `prefers-color-scheme`.

The three lesson keys are separate pages, not parts with `before` steps on one page: a reload after the walk lands the guest elsewhere, so a second walk in the same browser context fails. Each page gets its own context.

Signed in (`signedIn: true`, merged with `--merge`; the app follows `prefers-color-scheme` and sets `html[data-duo-theme]`):

- `/learn`: the sidebar (`shell`, `nav.item` Shop, `nav.item.active` Learn), the More menu and its Settings row (opened by hover), and the path's "Jump here?" callout as `tooltip` (the app has no hover tooltips; the callout skips `color`, which takes its unit's color). `menu` skips `color`: the wrapper is hare and each row sets its own ink. `nav.item` skips borderRadius: the idle row paints nothing (its hover fill is r12, like the current one). A placement drawer opens on every load and closes with Escape (the page step).
- `/settings/preferences` (lands on `/settings/account`): `switch.on` (skips backgroundColor: the track is a `linear-gradient`, which the probe reads as clear), the dark-mode `select.trigger` (painted on `::before`) and its `field.label`.
- `/profile/<id>`: the Following / Followers tabs. They skip paddingInline (only the selected tab is padded, 10px, so its underline overhangs the label) and borderRadius (neither side paints the tab box); `tab.selected` also skips `edge`, since Duolingo draws its 2px underline as the tab's border and dotUI as a separate indicator. The key keeps `<id>`: the handle never enters the pack.
- `/shop`: the right-rail card, the Streak Freeze row's "0 / 2 equipped" chip (`badge`) and its description (`text.muted`).

Also opened signed in, nothing kept: `/quests` (its progress bar is yellow and capped by a chest icon, and the 0/10 fill is hidden; the lesson's green bar stays the reference) and `/leaderboard`. Full-page shots of the account stay private, in project files only.

Survey, 2026-10-21 19:20: 19 public pages screenshotted in both themes (project files, `presets/duolingo/2026-10-21/public/`). `/courses`, `/efficacy`, `/help`, `/guidelines`, `/mobile`, `/math`, `/chess` and `/forgot_password` follow the theme, like log-in and the lesson; the home, `/register`, course, `/super`, `/gift` and `/business` pages stay light. Nothing else there maps to a part: `/courses`' "I speak" picker is a text trigger, not a field; `/help`'s FAQ boxes are 2px swan, radius 16, like the course cards; `/math` and `/chess` use macaw for their primary buttons.

Guest sign-up can fail on Duolingo's side (`POST /2023-05-23/users` 500, "Upload to Auth Failed"; 19:10 to at least 19:40 that day, fine again by 21:40). The lesson walk then stalls after the course pick: retry later.

## Palette, as measured

| Name       | Light     | Dark      | Where                                                       |
| ---------- | --------- | --------- | ----------------------------------------------------------- |
| owl        | `#58cc02` | `#93d333` | Primary buttons, progress                                   |
| owl lip    | `#58a700` | `#79b933` | 4px bottom shadow of primary                                |
| macaw      | `#1cb0f6` | `#49c0f8` | Links, focused field border, picks, current nav row and tab |
| macaw tint | `#ddf4ff` | `#202f36` | Current nav row fill                                        |
| macaw line | `#84d8ff` | `#3f85a7` | Current nav row edge                                        |
| page       | `#ffffff` | `#131f24` | Page, modal                                                 |
| polar      | `#f7f7f7` | `#202f36` | Field fill                                                  |
| swan       | `#e5e5e5` | `#37464f` | Every 2px edge and lip                                      |
| eel        | `#4b4b4b` | `#f1f7fb` | Button and field text                                       |
| headings   | `#3c3c3c` | `#f1f7fb` | Headings, body                                              |
| wolf       | `#777777` | `#dce6ec` | Muted text, idle nav and menu rows, select value            |
| hare       | `#afafaf` | `#52656d` | Keycap and badge labels                                     |
| bee        | `#ffc800` | `#ffc700` | Quest progress                                              |
| cardinal   | `#ff4b4b` |           | Danger                                                      |
| wrong band | `#ffdfe0` |           | Wrong-answer sheet, `#ea2b2b` ink                           |

Dark mode shifts the brand (owl and macaw get lighter) and tints the neutrals slate; light neutrals are pure gray.

## Notes

- `fonts` maps `duolingo-sans` to Nunito: Duolingo Sans is proprietary. The lesson's `page` skips `fontFamily`, since the painted ancestor it reads sets no font (Duolingo sets it on components).
- Buttons: 12px in the web UI, 16px on log-in and in lessons; labels 15px uppercase 700 with 0.8px tracking, 17px in lessons. No focus ring on buttons (`outline: none` site-wide); dotUI keeps one on purpose.
- Fields: 48px, radius 12, 2px swan edge on polar, 20px text; focus turns the border macaw, with no ring.
- Body 17px, headings 32px and 26px.
- Line tabs. App (profile): 16/700 uppercase, 0.8px tracking, 34px; idle #999999 / #dce6ec, current macaw with a 2px macaw border across the padded tab, over the list's 2px swan rule. Marketing (efficacy bar): 15/700, 1px tracking, idle hare, a 4px macaw bar as wide as the label (`::after`).
- Sidebar: white / #131f24 with a 2px swan right edge. Rows 52px, 12px corners, 15/700 uppercase labels with 0.8px tracking; idle wolf (#777777) / #dce6ec; the current row macaw on #ddf4ff inside a 2px #84d8ff edge (dark: #49c0f8 on #202f36 inside #3f85a7); hover #f7f7f7 / #202f36. The probe reads no edge on nav rows.
- More menu: page-colored, 2px swan edge, radius 15, no shadow; full-width 40px rows at 15/700 uppercase in wolf, 20px in.
- Callouts ("Jump here?", "Start"): page fill, 2px swan edge, radius 10, 17/700, 45px.
- Switch (on): a 56×24 track, macaw over swan (`linear-gradient`), with a 30×32 page-colored thumb in a 2px macaw edge and a 4px bottom lip. No off switch was reachable without changing a setting.
- Select (settings): 48px, 2px swan edge with a 2px lip, radius 12, value 15/700 uppercase in wolf with 0.8px tracking, 12px in; labels above it 20/700.
- Badge chip (shop): a 25px pill on swan (#e5e5e5 / #37464f), 15/700 uppercase hare label, untracked.
- Progress track: 16px, fully rounded, in swan (#e5e5e5 / #37464f), the edge gray rather than a muted fill.
- Keycaps (lesson tile numbers): 30px tall, 2px swan edge, radius 8, hare 15px bold labels.
- Modal: radius 16, no edge or shadow, page-colored in both modes, content centered; black scrim at 30–40%.
- Cards (shop rail, course tiles, help FAQ): radius 16, 2px swan edge, 18px padding.
- Dark mode doesn't dim body copy: the shop's descriptions are #dce6ec, the nav and menu ink.
