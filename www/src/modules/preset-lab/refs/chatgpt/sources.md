# ChatGPT

Measured 2026-10-21, headless Chromium at 1440×900, from the public Storybook of OpenAI's Apps SDK UI (`@openai/apps-sdk-ui`, the component library ChatGPT apps render in, built on ChatGPT's own tokens): <https://openai.github.io/apps-sdk-ui/>. Each story is measured light (`globals=theme:light`) and dark (`globals=theme:dark`, which sets `data-theme=dark`).

chatgpt.com answers the cloud browser with a Cloudflare challenge (403 "Just a moment…"), so the app's own parts come from a signed-in pass (see Signed-in app); the Storybook supplies the parts the app doesn't show.

## Tokens

Read from `@openai/apps-sdk-ui@0.2.2` on unpkg (`dist/es/styles/variables-primitive.css`, `variables-semantic.css`, `variables-components.css`) and the component CSS modules (Button, Input, Checkbox, Switch, RadioGroup, SegmentedControl, Menu, Popover, Tooltip, Badge, Alert, Calendar, Slider, TextLink, SelectControl):

- Grays carry no hue: gray-1000 #0d0d0d ink, #ededed and #f9f9f9 fills, #212121 dark page, #181818 dark sidebar (`color-surface-secondary`).
- blue-400 #0285ff is the accent: focus rings in dark, links in dark, the info tone and the dark-mode switch. Light mode uses blue-500 #0169cc for rings and links.
- Status seeds: green #00a240, orange #e25507, red #e02e2a.
- Component defaults from the JS: Button `pill = true`, `size = "md"`, `variant = "solid"`, pressed paint scales to .97 (.98 for large); Tooltip `compact = false` (the surface tooltip; compact is a gray-700 chip); Select `dropdownIconType = "dropdown"` (an up/down caret); Alert defaults to outline; Calendar weekdays "Su Mo", today marked by a 3px dot; the spinner is an open arc. Disabled buttons fill at alpha-05 with gray-400 text; disabled fields fade to 0.5.

## Parts

All in `targets.json`. Signed-in pages are the truth wherever they show a part; the Storybook keeps the parts the app doesn't show (fields, checks, radios, the neutral badge, links, dates, `heading.2`). The library styles through hashed CSS-module classes, so its targets match on `[class*=_Name_]`.

- `input` is the outline field's container, its text read off the input; `paddingInline` is skipped (the container pads the slot, not the input). `input`, `checkbox` and `radio` skip `backgroundColor`: they're clear, so they read the Storybook's own page (#212121 in dark), not the app's #000.
- `calendar.*` are measured in the DatePicker popover; `calendar.day` and `calendar.today` skip `backgroundColor`, which is the popover's, not a day's. The selected day is picked by clicking 15.
- `field.label` is the Slider's label, the only labelled field in the stories.
- `heading.2` (`heading-xl`) skips `fontSize`: the typography story sets its own sizes.

## Hand entries

- `button.focus`: the ring is an outline on the button's `::after`, which the probe doesn't read (it reads the element's own outline). Entered from the CSS: `2px solid var(--color-ring)`, offset 2px, light #0169cc, dark #0285ff.

## Signed-in app

Measured 2026-10-22 in Mehdi's Chrome, signed in on the Free plan, at 1440×900 (DPR 2), by a local capture session: each page's parts read with the `--snippet` probe and `--merge`d per mode. Light and dark were emulated per tab through `prefers-color-scheme` (`html[data-theme]` follows it); the account's Mode stayed System, so nothing was changed or restored. Theme "ChatGPT", accent "Black", background #FCFCFC. UI chrome only: no chat, Account or Personalization page was opened, no switch or option clicked, and crops showing chat titles or the profile name were deleted. The bundles' account and user ids were replaced before they left the machine.

- `https://chatgpt.com/` (new-chat home): `page`, `panel` (main, a 0.5px left hairline), `shell` (the left panel), `nav.item` (the Tasks row) and `nav.item.active` (New chat), `button.icon` (the composer's Dictate button; skips `backgroundColor`, it sits on the composer), `button.quiet` (the header's Upgrade, a ghost button; skips `color`, a promo blue), `tooltip` and `kbd` (hover the sidebar toggle; its ⇧⌘S shortcut is the kbd, which skips `backgroundColor` and `color`: it sits on the dark tooltip), `menu` and `menu.item` (the sidebar's Filter chats menu, a Radix dropdown, from the 2026-10-21 pass: its trigger only shows when the Recents header is hovered and opens on pointerdown, not on a click).
- `https://chatgpt.com/#shortcuts` (⌘/ opens the Keyboard shortcuts dialog): `dialog` and `heading.4` (its 16/600 title).
- `https://chatgpt.com/gpts`: `tab` and `tab.selected` (the category tabs), `alert` (the "GPTs will be retired" banner) and `heading.3` (the 24/500 page title).
- `https://chatgpt.com/#pricing`: `button.primary` (Upgrade to Go; skips `height` and `paddingInline`, a 44px CTA where the app's buttons are 36px, and `edge`, a 1px #0b0b0b line on the #0d0d0d fill), `badge.accent` (RECOMMENDED) and `heading.1` (the 36/600 title).
- `https://chatgpt.com/settings/general-settings`: `card` (the Language group), `select.trigger` (the Language picker), `text` and `text.muted` (a row's label and description; `text` skips `fontSize` and `fontWeight`, a 14/500 label where body copy is 16/400, and `text.muted` skips `fontSize`).
- `https://chatgpt.com/settings/data-controls`: `switch.on` (the painted span inside the clear `[role=switch]`) and `button.secondary` (a "Manage" button: soft-filled with no border).
- `https://chatgpt.com/settings/appearance`, with the Advanced disclosure opened: `segmented`, `segmented.item` and `segmented.selected` (Reduce motion: System, On, Off) and `switch.off`.

Where the app parts from the library: the page is #fcfcfc light and #000 dark (library #fff and #212121) and the sidebar matches it in both; no web font loads, the stack leads with `-apple-system-body` (Apple's system face at the body text style, so `fonts` maps it to `-apple-system`); controls are 36px with 12px padding and weight 400; the ink button is #0d0d0d in light and white in dark (library #181818 / #f3f3f3); the light tooltip is inverted (#0d0d0d, weight 600, 16px radius); menus are 90% translucent with a 16px blur, a 0.5px ring and 16px radius, rows 36px at 12px radius; the switch is #3a83f7 in both modes and 20px tall; the segmented control has no track, 24px items at 400 and a flat gray chip (#e3e3e3 / #181818) where the library draws a white raised thumb on a #ededed well; badges are pills; the alert is a 24px-radius banner with a hairline and a faint drop. The root variables add a theme layer shared with Codex (`--codex-base-accent`, `-surface`, `-ink`, `-contrast`).

Read but left out of the pack (no specimen part, or not the product's usual part):

- The composer (a 52px pill, 26px radius, #fff / #1b1b1b) and its "+" list: a 20px-radius panel with a 1px edge and no shadow, opaque (#fff / #303030), rows 36px at 12px radius with 8px padding, the highlighted row #f2f2f2 / #454545. It is a mention list, not the app's dropdown, so `menu` keeps the Radix menu.
- Other buttons: the send button (a 36px ink circle), the sidebar's outlined Upgrade (28px, 12/500, a 1px #d9d9d9 / #424242 edge), Upgrade to Plus (#3a83f7, 44px), the current plan's disabled button (opacity 0.4) and Delete all (a soft red pill, #f9e7e6 under #e02e2a, #1a0b0a under #ff6764 in dark).
- Fields: the GPT search field is a 44px pill at 16px (#fff / #1b1b1b, a 1px #d9d9d9 / #484848 edge) whose focus changes nothing; the UI font size field is 28px at 6px corners (#fff / #303030). Both are filled, unlike the library's clear outline field, which stays the `input` reference.
- Cards: the pricing columns are 24px-radius cards with a `0 4px 8px` 5% drop and a 1px #e2e2e2 / #424242 edge, #fcfcfc / #212121; the Plus column adds a white-to-blue gradient and a 1.5px accent edge. GPT cards are 16px rows with no edge. `card` keeps the settings group.
- The settings page title (24/400), and the shortcuts dialog's shortcut buttons (36px ghost pills, not keycaps).
- The dialog overlay is black at 13% in both modes, no blur.

Not measured in the app: the Chat/Work toggle on the home page and the pricing Personal/Business toggle (one-off segmented controls), the Contrast slider, and any checkbox, radio or date picker (the app shows none on these pages).

## Left out

- Command palette and progress: neither the library nor the measured app pages show them.
