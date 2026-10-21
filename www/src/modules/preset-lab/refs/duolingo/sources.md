# Duolingo

Measured 2026-10-21 from the public web app, headless Chromium at 1440×900, probe `8eb9b12`. No signed-in pages yet: the sidebar, tabs, switches, menus and tooltips of the logged-in app are still to measure.

## Pages

- `/log-in`: buttons, the email field and its focus state. Follows `prefers-color-scheme`.
- `/` and `/register` (course picker): link, muted text, course cards. Both always render light.
- `/register#lesson`, `#check` and `#hearts`: the guest lesson, reached by page `steps` that walk the onboarding from the course picker (Spanish, then one answer and Continue per screen) to the first challenge, "Which one of these is “cat”?". The tiles change between runs but the answer is always `gato`, so `#check` and `#hearts` pick the first tile without it. `#lesson` reads the page, heading, keycaps and progress track; `#check` the Check button with a wrong tile picked; `#hearts` the modal after Check. They follow `prefers-color-scheme`.

The three lesson keys are separate pages, not parts with `before` steps on one page: a reload after the walk lands the guest elsewhere, so a second walk in the same browser context fails. Each page gets its own context.

## Palette, as measured

| Name       | Light     | Dark      | Where                              |
| ---------- | --------- | --------- | ---------------------------------- |
| owl        | `#58cc02` | `#93d333` | Primary buttons, progress          |
| owl lip    | `#58a700` | `#79b933` | 4px bottom shadow of primary       |
| macaw      | `#1cb0f6` | `#49c0f8` | Links, focused field border, picks |
| page       | `#ffffff` | `#131f24` | Page, modal                        |
| polar      | `#f7f7f7` | `#202f36` | Field fill                         |
| swan       | `#e5e5e5` | `#37464f` | Every 2px edge and lip             |
| eel        | `#4b4b4b` | `#f1f7fb` | Button and field text              |
| headings   | `#3c3c3c` | `#f1f7fb` | Headings, body                     |
| wolf       | `#777777` |           | Muted text                         |
| hare       | `#afafaf` | `#52656d` | Keycap labels                      |
| cardinal   | `#ff4b4b` |           | Danger                             |
| wrong band | `#ffdfe0` |           | Wrong-answer sheet, `#ea2b2b` ink  |

Dark mode shifts the brand (owl and macaw get lighter) and tints the neutrals slate; light neutrals are pure gray.

## Notes

- `fonts` maps `duolingo-sans` to Nunito: Duolingo Sans is proprietary. The lesson's `page` skips `fontFamily`, since the painted ancestor it reads sets no font (Duolingo sets it on components).
- The course card skips `color`: the card itself is black by default and its labels set their own ink.
- Buttons: 12px in the web UI, 16px on log-in and in lessons; labels 15px uppercase 700 with 0.8px tracking, 17px in lessons. No focus ring on buttons (`outline: none` site-wide); dotUI keeps one on purpose.
- Fields: 48px, radius 12, 2px swan edge on polar, 20px text; focus turns the border macaw, with no ring.
- Body 17px, headings 32px and 26px.
- Progress track: 16px, fully rounded, in swan (#e5e5e5 / #37464f), the edge gray rather than a muted fill.
- Keycaps (lesson tile numbers): 30px tall, 2px swan edge, radius 8, hare 15px bold labels.
- Modal: radius 16, no edge or shadow, page-colored in both modes, content centered; black scrim at 30–40%.
- Course cards: radius 16, 2px swan edge and lip.
