# ChatGPT

Measured 2026-10-21, headless Chromium at 1440×900, from the public Storybook of OpenAI's Apps SDK UI (`@openai/apps-sdk-ui`, the component library ChatGPT apps render in, built on ChatGPT's own tokens): <https://openai.github.io/apps-sdk-ui/>. Each story is measured light (`globals=theme:light`) and dark (`globals=theme:dark`, which sets `data-theme=dark`); the dark page is #212121, as in ChatGPT.

chatgpt.com itself answers the cloud browser with a Cloudflare challenge (403 "Just a moment…"), so nothing here comes from the app. A signed-in pass in the user's Chrome would cross-check the sidebar, composer and menus.

## Tokens

Read from `@openai/apps-sdk-ui@0.2.2` on unpkg (`dist/es/styles/variables-primitive.css`, `variables-semantic.css`, `variables-components.css`) and the component CSS modules (Button, Input, Checkbox, Switch, RadioGroup, SegmentedControl, Menu, Popover, Tooltip, Badge, Alert, Calendar, Slider, TextLink, SelectControl):

- Grays carry no hue: gray-1000 #0d0d0d ink, #ededed and #f9f9f9 fills, #212121 dark page, #181818 dark sidebar (`color-surface-secondary`).
- blue-400 #0285ff is the accent: focus rings in dark, links in dark, the info tone and the dark-mode switch. Light mode uses blue-500 #0169cc for rings and links.
- Status seeds: green #00a240, orange #e25507, red #e02e2a.
- Component defaults from the JS: Button `pill = true`, `size = "md"`, `variant = "solid"`, pressed paint scales to .97 (.98 for large); Tooltip `compact = false` (the surface tooltip; compact is a gray-700 chip); Select `dropdownIconType = "dropdown"` (an up/down caret); Alert defaults to outline; Calendar weekdays "Su Mo", today marked by a 3px dot; the spinner is an open arc. Disabled buttons fill at alpha-05 with gray-400 text; disabled fields fade to 0.5.

## Parts

All in `targets.json`. The library styles through hashed CSS-module classes, so targets match on `[class*=_Name_]`. Buttons and select triggers paint their box on `::before` (`box: "::before"`).

- `button.quiet` skips `backgroundColor`: the ghost button's hover layer sits at opacity 0 on `::before`, which the probe reads as paint.
- `segmented.item` skips `backgroundColor` and `height` for the same hidden hover layer; `segmented.selected` is the sliding thumb.
- `input` is the outline field's container, its text read off the input; `paddingInline` is skipped (the container pads the slot, not the input).
- `calendar.*` are measured in the DatePicker popover; `calendar.day` and `calendar.today` skip `backgroundColor`, which is the popover's, not a day's. The selected day is picked by clicking 15.
- `field.label` is the Slider's label, the only labelled field in the stories.
- `heading.2` (`heading-xl`) skips `fontSize`, `text.muted` skips it too: the typography stories set their own sizes.

## Hand entries

- `button.focus`: the ring is an outline on the button's `::after`, which the probe doesn't read (it reads the element's own outline). Entered from the CSS: `2px solid var(--color-ring)`, offset 2px, light #0169cc, dark #0285ff.
- `shell`: no sidebar in the library; ChatGPT's sidebar is `color-surface-secondary`, #f9f9f9 light, #181818 dark.

## Left out

- `button.icon`: the story turns `pill` off; the default icon button is round, like the preset's.
- Dialog, command palette, tabs, navigation rows, card, kbd and progress: the library has no component for them.
