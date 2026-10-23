# Bluesky reference pack

Measured 2026-10-23 with probe `ce94064`: `presets:measure --pack bluesky`, headless Chromium at 1440×900, DPR 2, on the logged-out web app at bsky.app.

Bluesky's design system is ALF, open source in two places, read at pinned versions:

- `bluesky-social/social-app` at `f0b2edb051d9855639a7ce3851032a6dd04b69c3`: the components (`src/components/`), the web shell (`src/view/shell/desktop/`) and the web-only CSS (`src/style.css`).
- `@bsky.app/alf` 0.1.15 on npm: `src/palette.ts` (the contrast, primary, positive and negative ramps), `src/themes.ts` (light, dark and dim) and `src/tokens.ts` (space, type, radius and weight scales).

## Light, dim and dark

Bluesky ships three themes: light, dim and dark. Dark mode defaults to dim, a navy theme built by inverting the subdued palette, so its page is `#151d28` and its ink white. Dark is the OLED option: the inverted default palette on a `#000` page. The pack's dark mode is dim, which is what a new user sees; `darkBg: 0` (OLED) would recreate dark.

The app keeps the theme in localStorage under `BSKY_STORAGE`, not `prefers-color-scheme`. Headless runs write the whole object (`colorMode` and `darkTheme`, plus the fields its schema requires) before the page loads.

## Pages

- `https://bsky.app/profile/bsky.app` (light, dim): page, primary and secondary buttons (Create account, Sign in), the profile's icon button, button focus, profile tabs, the display name, post text and links, the Trending card and its muted rows, a post's menu and its rows, the timestamp tooltip.
- `…#sign-in`: the sign-in form after clicking Sign in. Password field, username field focused, field label, the hosting-provider button (as `button.quiet`).
- `…#hosting-provider`: the hosting-provider dialog's Bluesky / Manual switcher, as `segmented`.
- `…#embed`: a post's Embed dialog, as `dialog`.

Cross-checks, not measured: the search page (its field matches the sign-in fields) and the logged-out feeds. The hosting-provider dialog drew 36px corners on the live site, which the pinned source doesn't have: its dialogs use `rounded_md` (12px), as the Embed dialog measured, so the pack keeps 12px and reads only the switcher there.

## Entered from source

These parts have no logged-out page, so their values come from the pinned components and the ALF palette, entered in `tokens.json` by hand:

- `checkbox`, `checkbox.checked`, `radio`, `radio.checked`, `switch.off`, `switch.on`: `src/components/forms/Toggle/index.tsx`. Checkbox 24px at 6px corners, radio 25px round, switch 48×28 with a 22px knob, off on contrast_200; radios carry a 12px dot.
- `alert`: `src/components/Admonition.tsx`. The page fill, 8px corners, a 1px edge in contrast_300 (info) or the status color (tip, warning, error), the icon in that color, body text in plain ink.
- `nav.item`, `nav.item.active`: `src/view/shell/desktop/LeftNav.tsx`. 52px pill rows, 18.8px labels, regular; the current item turns bold and fills its icon without changing color.

The tooltip (`a[data-tooltip]::after`, `src/style.css`) is a contrast_100 chip at 10px corners; the part reads only its fill and corners, since its box measures as its anchor.

## Skipped properties

- `tab`, `tab.selected` `backgroundColor`, `borderRadius`, `edge`, `boxShadow`: the tab's fill and corners only show on hover.
- `input` `paddingInline`: the password field leads with a lock icon.
- `heading.1`, `text`, `link`: color, size and weight only; the specimen sets the rest.
- `segmented.item` `backgroundColor`: the track paints behind it.

## Values worth knowing

- Ink `#000` / `#fff`. Muted text contrast_700 `#405168` / contrast_700 of dim `#abb8c9`; field labels and secondary labels the same.
- Primary `#006aff` (`#0f73ff` in dim, where links are `#4d97ff`). Positive `#09b35e`, negative `#e91646`, yellow `#ffc404`.
- Grays lean to the brand's hue: contrast_500 `#667b99` is OKLCH 0.58 0.053 257.
- Light: page `#fff`, fields and secondary fills contrast_50 `#eff2f6`, edges contrast_100 `#dce2ea`. Dim: page `#151d28`, menus `#1c2736`, fills `#222e3f`, edges `#2c3a4e`.
- Type: InterVariable. Scale 9.4 / 11.3 / 13.1 / 15 / 16.9 / 18.8 / 20.6 / 24.3 / 30 / 37.5. Body and post text 15px, button and label text 13.1px, display names 700.
- Radius scale 2 / 4 / 8 / 12 / 16 / 20 / 999: fields 10px, menus 8px, cards and dialogs 12px, menu rows 4px, segmented track 14px and chip 10px, buttons pills.
- Buttons 33px (small, the most used) and 44px (large, in forms and dialogs), padding 14px, 500 labels. Secondary is a contrast_50 fill with a muted label. Focus is the browser's own ring.
- Fields 44px, filled, no edge at rest; focus recolors a 1px edge to primary over a primary_25 fill, no ring.
- Profile tabs 47px, 15px 600 labels, a 3px primary bar under the label.
- Menus 8px corners, a 1px contrast_100 edge, `0 10px 15px -3px` and `0 4px 6px -4px` at black 10%; rows 36px, 13.1px 600 labels with the icon at the end.
- Dialogs 12px corners on a black 80% scrim with no blur, 10vh from the top, 24px padding, 20.6px 700 titles. In dim they share the page's fill and keep a contrast_200 edge.
- The left rail sits on the page; the right column's cards are page-colored with a contrast_100 edge.
