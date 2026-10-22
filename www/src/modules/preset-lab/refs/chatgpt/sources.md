# ChatGPT

Measured 2026-10-21, headless Chromium at 1440×900, from the public Storybook of OpenAI's Apps SDK UI (`@openai/apps-sdk-ui`, the component library ChatGPT apps render in, built on ChatGPT's own tokens): <https://openai.github.io/apps-sdk-ui/>. Each story is measured light (`globals=theme:light`) and dark (`globals=theme:dark`, which sets `data-theme=dark`).

chatgpt.com answers the cloud browser with a Cloudflare challenge (403 "Just a moment…"), so the app's own parts come from a signed-in pass (see Signed-in app); the Storybook supplies the rest.

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

## Signed-in app

Measured 2026-10-21 in Mehdi's Chrome, signed in, in a 1440px window (1512px for the dark home page, after the tab was reopened). Mode came from Settings › Appearance › Mode (System, Light, Dark tiles): set to Light, then Dark, then back to System, its original value. Theme "ChatGPT", accent "Default" (the account's defaults; Appearance lists background #000000 and foreground #EDEDED for dark). Each page was measured with the `--snippet` probe run in the tab and `--merge`d per mode. UI chrome only: no chat, Account or Personalization page was opened, and chat and project rows were hidden by a local style before any crop.

- `https://chatgpt.com/` (new-chat home): `page`, `panel` (main, a 0.5px left hairline), `shell` (the left panel), `button.icon` (the composer's Dictate button; skips `backgroundColor`, it sits on the composer), `tooltip` and `kbd` (hover the sidebar toggle; its ⇧⌘S shortcut is the kbd), `menu` and `menu.item` (the sidebar's Filter chats menu, a Radix dropdown; its trigger stays clipped outside the sidebar until the section header is hovered, so the pass opened it with a pointerdown event; `menu.item` is an unchecked row).
- `https://chatgpt.com/settings/general-settings` (`#settings/General` redirects here; Settings is now a page, its nav in the app sidebar): `card` (the Language settings group), `select.trigger` (the Language picker, the same as Notifications' pickers), `nav.item` (Appearance) and `nav.item.active` (General).
- `https://chatgpt.com/settings/data-controls`: `switch.on` and `button.secondary` (a "Manage" button: the settings secondary is soft-filled with no border). Read only, nothing clicked.

Where the app parts from the library: the page is #fcfcfc light and #000 dark (library #fff and #212121) and the sidebar matches it in both; no web font loads, the stack leads with `-apple-system-body`; controls are 36px with 12px padding and weight 400; the light tooltip is inverted (#0d0d0d, weight 600, 16px radius); menus are 90% translucent with a 16px blur, a 0.5px ring and 16px radius, rows 36px at 12px radius; the switch is #3a83f7 in both modes (black in the library's light). The root variables add a theme layer shared with Codex (`--codex-base-accent`, `-surface`, `-ink`, `-contrast`).

Not measured in the app:

- `switch.off`: every switch on the account is on, and switches weren't toggled; the Storybook value stays.
- `dialog`: the one dialog without user content (theme import) was blocked as a possible settings change. `/gpts` (search input, category tabs, cards) and the pricing modal were blocked by the machine's permission check.
- `segmented`: the home Chat/Work toggle is a one-off mode toggle with its own track token, not the library's SegmentedControl; the Storybook value stays.
- The composer "+" menu is a mention list (rows on a 20px-radius panel), not the app's dropdown, and Settings › Keyboard draws shortcuts as editable pill buttons, not kbd.

## Left out

- Command palette, tabs and progress: neither the library nor the measured app pages show them.
