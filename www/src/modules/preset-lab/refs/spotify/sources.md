# Spotify reference pack

Measured 2026-10-21 with probe `227b008`, headless Chromium at 1440×900, DPR 2.

Spotify publishes no token docs. Encore, its design system, ships with the public login page, in both themes:

- `https://accounts.scdn.co/authn-web/_next/static/css/7fcf1d993898f21f.css`: tokens (`.encore-dark-theme`, `.encore-light-theme`, color sets such as `.encore-bright-accent-set`), the type scale and every `e-10830-*` component.
- `https://accounts.scdn.co/authn-web/_next/static/css/c547cd707be00fc4.css`: the login page's own layout.

The web player's stylesheets (`open.spotifycdn.com`) are blocked from cloud sessions, so the web player itself is not in this pack yet.

## Pages

- `https://accounts.spotify.com/en/login`: measured headless, dark only (the page renders Encore's dark theme whatever the color scheme).
- `… (Encore light theme)`: the same page with `encore-dark-theme` swapped for `encore-light-theme` on `<html>`, measured with the snippet and merged. Marked `signedIn` only so `--pack` leaves it to `--merge`.
- `… (Encore board)`: Encore's own classes on a board rendered with the login page's stylesheets, once per theme, measured with the snippet and merged. Focus states use Encore's `data-focus-visible`. Where Encore leaves the text size to the caller (tabs, tags, tooltips, popovers), the board picks an Encore type class, so those parts skip `fontSize`.

## Skipped properties

- `button.secondary` comes from the login page's outlined legacy button: Encore's `secondary-bordered` draws its hairline as an outline, which the probe doesn't read as an edge. Both are a 1px #7c7c7c / #818181 edge.
- `input.focus` `edge`: Encore's 2px inset focus ring covers its 1px edge, while dotUI recolors the edge under the ring. Both show a 2px ink frame.
- `checkbox.checked` `edge`: Encore draws the check mark as the bottom and left border of a rotated box, which the probe reads as an edge.
- `tab`, `tab.selected` `borderRadius`: Encore's square tab only shows its corners on a hover fill that dotUI's line tabs don't paint; both round the focus ring (4px / 6px).
- `heading.1`, `heading.3` `fontSize`: Encore's title sizes are responsive (title-medium 24px below the desktop breakpoint, 32px above).

## Encore values worth knowing

- Ink #000 / #fff; muted #656565 / #b3b3b3. Page #fff / #121212, frame #f5f5f5 / #000, elevated #1f1f1f.
- Bright accent #1ed760 under #000 labels in both themes; essential accent #159542 in light (checks, switches, radios, tab bars), #107434 as text.
- Control edge #818181 / #7c7c7c; dividers #292929 in dark.
- Buttons 32 / 48 / 56px, pills, 700 labels; padding 16 / 24 / 24, tertiary 12 / 16 / 20.
- Focus: a 2px outline in body ink at -2px; on the green primary, black at -4px.
- Fields 48px, 4px corners, 1px inset edge. The search field is a 48px pill on a tint (black 8% / white 7%), 12px padding, no edge.
- Switch 28×16 with a 12px knob in the page color; checkbox 16px at 3px corners.
- Line tabs 48px, 12px padding, a 2px accent bar under the label.
- Tags 16px (medium) and 24px (large) at 4px corners.
- Disabled controls at 30% opacity (`--encore-opacity-disabled`).

## Not measured yet

The signed-in web player: app shell and sidebar rows, filter chips, the search pill in place, playback and volume sliders, context menus, cards and dialogs (the scrim strength included). That pass runs in Mehdi's Chrome and merges into this pack.
