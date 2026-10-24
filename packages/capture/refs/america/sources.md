# America.gov reference pack

Measured 2026-10-23, headless, no sign-in (the site has no accounts). America.gov is the federal front door built by the National Design Studio: an Astro site with Base UI components and Tailwind v4. Type is Helvetica Now Text and Display for UI and body, Rhymes Text for headlines (both proprietary). Light is the default; a System / Light / Dark switch in the Menu sheet stores the choice in `localStorage["america:theme"]` and sets `html[data-theme]`. The "firstgov" and "retro" site styles (`html[data-site-style]`, easter eggs) are ignored.

## Tokens

From the deployed stylesheet `/_astro/base-html.D-wm9kgs.css` (light in `:root`, dark in `:root[data-theme="dark"]:not([data-site-style])`). Ink is a navy-black, `blue-900` #000c1f, and most neutrals are that ink at an alpha.

| Token                                    | Light                                             | Dark                        |
| ---------------------------------------- | ------------------------------------------------- | --------------------------- |
| `background-primary` (page)              | #ffffff                                           | #0b0d12                     |
| `background-tertiary` (tints, panels)    | `blue-700` at 5% (#0026640d)                      | #ffffff0d                   |
| `background-secondary` (hover tints)     | `blue-700` at 10%                                 | #ffffff1a                   |
| `surface-muted` (`grey-50`, bento tiles) | #f7f7f7                                           | #0f1217                     |
| `text-primary`                           | #000c1f                                           | #ffffff                     |
| `text-secondary` / `-tertiary`           | ink at 65% / 45%                                  | white at 65% / 45%          |
| `text-disabled`                          | ink at 15%                                        | #ffffff1a                   |
| `border-primary` / `-secondary`          | ink at 85% / 45%                                  | #ffffffa6 / #ffffff59       |
| `border-tertiary` / `-quaternary`        | ink at 10% / 5%                                   | white at 10% / 5%           |
| `blue-700` (primary button, checks)      | #002664                                           | #0066c5                     |
| `blue-800` (primary hover)               | #00163b                                           | #1a75d0                     |
| `blue-500` (`link`, bar fills)           | #0066c5                                           | #66aef5                     |
| `red-600` / `green-600` / `yellow-900`   | #d80007 / #007f26 / #8e5e00                       | #ff5252 / #0aa93a / #e99b00 |
| `ring` (field focus)                     | #0c0c0c                                           | #ffffff                     |
| `shadow-elevation-1`                     | `0 10px 40px #010e2414`                           | `0 10px 40px #00000026`     |
| `shadow-widget`                          | 1px `border-quaternary` ring + elevation-1        | same                        |
| Radii                                    | 4 8 12 16 20 24 32 40 48 64px, `scale-press` 0.98 | same                        |

`.squircle` boxes (cards, bento tiles, carousels) set `corner-shape: superellipse(1.3)` and scale their radius by 1.194 where supported, so a `rounded-48` tile computes 57.312px.

## Measured pages

`pnpm presets:measure --pack america` loads each page in both modes through the storage key. Every page is listed so the census covers it; the ones without parts carry no probe targets.

- `/` (home): page, the tinted "See what's ahead" link-button (`button.secondary`, 56px), the carousel's previous button (`button.icon`), the footer language select (`select.trigger`, a native select), the navy "New" pill in the fraud link (`badge.accent`), and the checked checkbox in the hero's agency-list artwork (`checkbox.checked`, fill and edge only: the artwork is scaled).
- `/about`: the Menu sheet (`menu`, its painted layer: white, 40px, a 1px quaternary ring plus three soft drop shadows) and its theme switcher (`segmented`, `.item`, `.selected`: a 36px tinted track, 28px circles, a white pill with `shadow-widget` as the indicator). They sit on a page with no plain parts because the header hides once the crop pass scrolls.
- `/faq`: the page heading (`heading.1`, 96px Rhymes), the Submit feedback dialog (`dialog`, 432px, 40px corners), its textarea (`input`, `input.focus`, `field.label`) and the chat composer's Upload PDF tooltip (`tooltip`, a 36px white pill with `shadow-widget`). `input.focus` types one letter before focusing: the empty form's Submit is disabled, so the probe's Tab lands on Base UI's focus guard, which then moves focus to Close.
- `/fraud`: the report flow's Continue (`button.primary`, 56px navy pill; the flow on this page is a non-interactive demo, so its buttons can't take focus), the "Show all" button's focus ring (`button.focus`), the section heading (`heading.2`, 64px Rhymes), a card title (`heading.4`, 18/500), the Before / Now figure (`card`, a squircle on `background-tertiary`) and its bars (`progress`, a 12px track at ink 5%, dark 8%; `progress.fill`, the `link` blue "Now" bar).
- `/privacy-policy`: a section heading (`heading.3`, Helvetica Now Display 24/400), body copy (`text`), a prose link (`link`, underlined in the paragraph's color) and the footer's Privacy policy link (`button.quiet`, a 40px ghost with 8px corners).
- `/how-it-works`: the chat composer's placeholder (`text.muted`, ink at 45%).

## Read by hand (no probe part)

From full-page shots and states in both modes (crops in the project files, `presets/america/2026-10-23/`):

- Buttons are pill-shaped at every size: 44px with 20px padding (Menu, Show all), 56px with 24px (forms, section CTAs), 64px with 36px at 18px (hero CTAs). They press to `scale(0.98)`. Disabled is the 5% tint under 15% ink.
- Icon buttons are tinted circles: 56px in the carousel, 36px for Close in sheets and dialogs, 36px ghosts in the chat composer.
- The chat composer (the "AI search box") is a white 82px pill with a 1px quaternary ring and `elevation-1`, a ghost Upload PDF and Voice input, and a navy circular Send; hero versions are larger. Answers come from `/api/chat`, which a bot check refuses headless, so only the composer and its error state were seen.
- Dialogs and the Menu sheet sit over a 20% black backdrop with a 12px blur.
- Feedback and fraud-flow textareas: 16px corners, a 1px `border-secondary` edge, 16px padding; hover darkens the edge to `border-primary`; focus turns it `ring` and adds a 1px inset ring. Option rows in the fraud flow are 64px boxes with 24px corners and a 1px tertiary edge.
- Buttons and links focus with `0 0 0 2px #fff, 0 0 0 4px #0c0c0c` in both modes, so dark shows a white 2px band around the control.
- The FAQ is a divided accordion: hairlines at ink 10%, a trailing chevron, 16/400 questions.
- The fraud figures' table: header cells 16/400 in secondary ink, 1px tertiary row rules, 24px cell padding, no frame.
- Links: prose links keep the text color with a solid underline 4px below; action and source links are `link` blue with a dotted underline 3px below.
- Checkboxes: 20px, 6px corners, a 1px `border-secondary` edge on white, navy fill with a white check when on.
- Icons are 20px filled glyphs with crisp corners and square ends, drawn like Material Symbols (attach file, mic, arrow forward, chevrons, check, info).

## Not on the site

No tabs, radios, switches, calendars, keyboard shortcuts, command palette, toggle buttons, inline alerts, app shell or sidebar navigation: those sheets are inferred from the measured parts.
