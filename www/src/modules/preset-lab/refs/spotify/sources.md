# Spotify reference pack

Measured 2026-10-21 with probe `8eb9b12`: `presets:measure --pack spotify`, headless Chromium at 1440×900, DPR 2, both modes.

Spotify publishes no token docs. Encore, its design system, ships with the public login page (`https://accounts.spotify.com/en/login`) as two stylesheets:

- `https://accounts.scdn.co/authn-web/_next/static/css/7fcf1d993898f21f.css`: the light theme (`.encore-light-theme`), the color sets (`.encore-bright-accent-set`, …), the type scale and every `e-10830-*` component.
- `https://accounts.scdn.co/authn-web/_next/static/css/c547cd707be00fc4.css`: the dark theme (`.encore-dark-theme`), the login page's default.

The file names are build hashes: when Spotify redeploys, take the new ones from the login page's `<link>` tags.

The web player's stylesheets (`open.spotifycdn.com`) are blocked from cloud sessions, so the web player itself is not in this pack yet.

## Pages

- `encore.html`: a harness that loads both stylesheets and lays out Encore's own components with Encore's classes, in the theme that matches `prefers-color-scheme`. Its only styles of its own are layout and section labels. It covers buttons, focus, checkbox, radio, switch, field label, fields, tabs, link, banner, tags, progress, titles, body text, tooltip and popover.
- Encore leaves the text size to the caller on tabs, tags, tooltips and popovers. The harness picks an Encore type class for them, so those parts skip `fontSize`. Titles are responsive: title-large, title-medium and title-small are 48, 32 and 24px from 768px up, and 32, 24 and 20px below. So the heading parts skip `fontSize` too.
- Cross-check: the login page, measured headless in light (class swapped) and dark, reads the same page, field, text, tooltip and overlay values as the harness. Its buttons use Encore's older `legacy-button` styles, so they stay out of the pack.

- `fonts` in `tokens.json` maps Spotify Mix (`SpotifyMixUI`, and `SpotifyMixUITitle` for titles) to Figtree, the preset's stand-in: Spotify Mix is proprietary.

## Skipped properties

- `button.focus` `edge`: the green primary has no edge. dotUI's flush inset ring reads as one, so only `ring` is compared.
- `tab`, `tab.selected` `borderRadius`: Encore's tab is square, but its corners only show on a hover fill that dotUI's line tabs don't paint. Both round the focus ring (4px / 6px).
- `input` `boxShadow`: Encore draws the field edge as a 1px inset ring, which the probe already reads as `edge`.
- `tooltip`, `menu` `boxShadow`: the harness shows the bare overlay surface. The shadow comes with the web player's context menus, which aren't measured yet.

## Encore values worth knowing

- Ink #000 / #fff; muted #656565 / #b3b3b3. Page #fff / #121212, frame #f5f5f5 / #000; tooltips and overlays #fff / #1f1f1f.
- Bright accent #1ed760 under #000 labels in both themes. In light, checks, switches, radios, progress and tab bars use the essential accent #159542, and accent text is #107434.
- Control edge #818181 / #7c7c7c.
- Buttons 32 / 48 / 56px pills, 700 labels; padding 16 / 24 / 24px, tertiary 12 / 16 / 20px.
- Focus: a 2px outline in body ink at -2px; on the green primary, black at -4px.
- Fields 48px, 4px corners, 1px inset edge. The search field is a 48px pill on a tint (black 8% / white 7%), 12px padding, no edge.
- Switch 28×16 with a 12px knob in the page color; checkbox 16px at 3px corners.
- Line tabs 48px, 12px padding, no rule under the list; a 2px accent bar under the label.
- Tags 24px, 6px padding, 4px corners. The 16px square tag is the explicit-content marker. Banners 4px corners on the same #ebebeb / #2a2a2a fill as tags; the progress track is 6px on that fill, under a pill indicator.
- Dropdown rows 48px, 12px padding, 6px corners, in a 4px-padded overlay. Overlays round 8px, tooltips 6px.
- Disabled controls at 30% opacity (`--encore-opacity-disabled`). The modal backdrop is black 50%.

## Not measured yet

The signed-in web player: app shell and sidebar rows, filter chips, the search pill in place, playback and volume sliders, context menus, cards, and dialogs and their scrim. That pass runs in Mehdi's Chrome and merges into this pack.
