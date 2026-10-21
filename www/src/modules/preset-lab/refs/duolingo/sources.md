# Duolingo

Measured 2026-10-21 from the public web app, headless Chromium at 1440×900, probe `d7653aa`. No signed-in pages yet: the sidebar, tabs, switches, menus and tooltips of the logged-in app are still to measure.

## Pages

- `/log-in`: buttons, the email field and its focus state. Follows `prefers-color-scheme`.
- `/` and `/register` (course picker): link, muted text, course cards. Both always render light.
- `/lesson`: the guest lesson, reached by walking `/register` → Spanish → Continue through onboarding (first choice on each step) → the first challenge. Measured at three stages: the challenge (page, heading, keycaps), a wrong tile selected (the Check button), and after Check (the hearts modal). Follows `prefers-color-scheme`.

The lesson pages carry `signedIn: true` only so `--pack` skips them: no sign-in is needed, but the walk is. To re-measure them, run a script that walks the flow, probes each stage with `snippet()` for that page's parts, and saves one JSON per stage and mode; then merge each with `presets:measure --pack duolingo --url "<page key>" --merge <file> --mode <mode>`.

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

- `fontFamily` is left out of every part: Duolingo Sans (`duolingo-sans`) is proprietary, and the preset uses Nunito.
- Buttons: 12px in the web UI, 16px on log-in and in lessons; labels 15px uppercase 700 with 0.8px tracking, 17px in lessons. No focus ring on buttons (`outline: none` site-wide); dotUI keeps one on purpose.
- Fields: 48px, radius 12, 2px swan edge on polar, 20px text; focus turns the border macaw, with no ring.
- Body 17px, headings 32px and 26px.
- Keycaps (lesson tile numbers): 30px tall, 2px swan edge, radius 8, hare 15px bold labels.
- Modal: radius 16, no edge or shadow, page-colored in both modes, content centered; black scrim at 30–40%.
- Course cards: radius 16, 2px swan edge and lip.
