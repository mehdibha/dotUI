# Spotify reference pack

Measured 2026-10-21 with probe `8eb9b12`: `presets:measure --pack spotify`, headless Chromium at 1440×900, DPR 2.

Spotify publishes no token docs. Every Spotify surface a user sees is dark: the web player, login, sign-up, support and Premium pages all render dark whatever `prefers-color-scheme` says. The light theme exists only in Encore, Spotify's design system, which ships with the login page as two stylesheets:

- `https://accounts.scdn.co/authn-web/_next/static/css/7fcf1d993898f21f.css`: the light theme (`.encore-light-theme`), the color sets (`.encore-bright-accent-set`, …), the type scale and every `e-10830-*` component.
- `https://accounts.scdn.co/authn-web/_next/static/css/c547cd707be00fc4.css`: the dark theme (`.encore-dark-theme`), the login page's default.

The file names are build hashes: when Spotify redeploys, take the new ones from the login page's `<link>` tags.

So dark comes from the real pages and light from Encore's own light theme.

## Pages

- `https://accounts.spotify.com/en/login` (dark): page, buttons, button focus, field, field label, title, muted text, inline link.
- `https://open.spotify.com/` (dark, logged out): the app frame and main panel, shelf titles, the search field's shortcut keys (shown on hover), the Home button's tooltip, and the language dialog (the sidebar's "English" button).
- `https://open.spotify.com/album/4m2880jivSbbyEGAKfITCa` (dark): the context menu from a track row's "More options" button.
- `https://open.spotify.com/artist/4tZwfgrHOc3mvqYlEYSvVi` (dark): the discography filter chips, as `toggle` and `toggle.on`.
- `https://open.spotify.com/#signed-in` (dark, signed in): Library rows in the sidebar, as `nav.item`. Measured in Mehdi's Chrome and merged; the logged-out sidebar has no rows.
- `https://open.spotify.com/preferences` (dark, signed in): the Settings switches, as `switch.on` and `switch.off`.
- `https://www.spotify.com/account/overview` (dark, signed in): the Account group, as `card`.
- `https://www.spotify.com/account/profile` (dark, signed in): the profile form's select, as `select.trigger`.
- `encore.html` (light): a harness that loads both stylesheets and lays out Encore's components with Encore's classes, in the theme that matches `prefers-color-scheme`. Its only styles of its own are layout and section labels.
- `encore.html#dark` (dark): the same harness, for the parts no real page shows: checkbox, radio, tabs, tags, banner, progress, field focus and body text.

The login page and the web player use Encore's `legacy-button` (padding 32px at 48px, an outline focus ring), not the newer `e-10830-button` the harness also lays out. The harness measures the shipped legacy buttons, copied with the login page's classes; the newer ones stay on the page unmeasured. The same goes for overlays: the web player's tooltip and context menu are its own #282828 surface at 4px, not Encore's popover and tooltip (#1f1f1f at 8 / 6px), so `menu` and `tooltip` have no light reference.

- Encore leaves the text size to the caller on tabs and tags. The harness picks an Encore type class for them, so those parts skip `fontSize`. Titles are responsive: title-large, title-medium and title-small are 48, 32 and 24px from 768px up, and 32, 24 and 20px below, so the harness headings skip `fontSize` too.
- Fills at or under 10% alpha aren't read, and chips paint on an inner span, so `toggle` targets the span.
- `fonts` in `tokens.json` maps Spotify Mix (`SpotifyMixUI`, and `SpotifyMixUITitle` for titles) to Figtree, the preset's stand-in: Spotify Mix is proprietary.

## Skipped properties

- `button.focus` `edge`: the green primary has no edge.
- `button.secondary` `paddingInline` on the login page: its buttons carry a leading logo.
- `tab`, `tab.selected` `borderRadius`: Encore's tab is square, but its corners only show on a hover fill that dotUI's line tabs don't paint. Both round the focus ring (4px / 6px).
- `input`, `select.trigger` `boxShadow`: Encore draws the field edge as a 1px inset ring, which the probe already reads as `edge`.
- `text.muted` `fontSize`: the specimen sets its size; Spotify's muted lines are 16, 14 or 12px by context.
- `link` `color`: the login page's inline link takes its muted paragraph's color.
- `menu`, `dialog` `color`: rows and titles set their own ink.
- `kbd` `backgroundColor`: the keys sit clear on the search field's fill.
- `nav.item` `height`: Library rows are 64px around a 48px cover.

## Values worth knowing

- Ink #000 / #fff; muted #656565 / #b3b3b3. Page #fff / #121212, frame #f5f5f5 / #000. Containers #1f1f1f (the sidebar's prompt cards); tooltips, menus and dialogs #282828.
- Bright accent #1ed760 under #000 labels in both themes. In light, checks, radios, progress and tab bars use the essential accent #159542, and accent text is #107434. The Settings switch is on #1db954 in dark, the older brand green.
- Control edge #818181 / #7c7c7c.
- Buttons 32 / 48 / 56px pills, 700 labels, padding 16 / 32px. Focus is a 2px outline 2px outside, in body ink.
- Fields 48px, 4px corners, 1px inset edge. The search field is a 48px pill on #1f1f1f, no edge; its shortcut keys are 26px, 16/400, a 1px #7c7c7c outline with a 1px #121212 drop.
- The shipped Settings switch is about 42×24 with a 20px white knob, #1db954 on and #535353 off. Encore's own switch is 28×16 with a 12px knob in the page color; no page we measured ships it, so the pack doesn't read it. Checkbox 16px at 3px corners.
- Line tabs 48px, 12px padding, no rule under the list; a 2px accent bar under the label.
- Filter chips 32px pills, 12px padding, 14/400, on white 10%; selected chips white with black ink.
- Tags 24px, 6px padding, 4px corners. The 16px square tag is the explicit-content marker. Banners 4px corners on the same #ebebeb / #2a2a2a fill as tags; the progress track is 6px on that fill, under a pill indicator. The playback bar is 4px on white 30%, filled white 70%.
- Context menus #282828 at 4px, 4px padding, shadow `0 16px 24px rgb(0 0 0 / .3), 0 6px 8px rgb(0 0 0 / .2)`; rows 40px, 12px padding, 2px corners, 14/400. Tooltips the same surface, 28px, 8px padding, 14/400.
- The language dialog is #282828 at 8px with no shadow, on a 70% black scrim.
- Account cards are white 10% (#2a2a2a on the page) at 5px, no shadow. Home cards have no fill or shadow at rest, 6px corners. Library rows 64px, 8px padding, 6px corners, titles 16/400 white over 14/400 #b3b3b3.
- Titles on the login page are 48/800; shelf titles 24/700.
- Disabled controls at 30% opacity (`--encore-opacity-disabled`).

## Signed in

The signed-in pages were captured on 2026-10-22 in Mehdi's own Chrome session and merged with `--merge`; a cloud run skips them. The account pages (www.spotify.com/account) render dark too now, whatever the color scheme, so there is no signed-in light reading. The capture also measured parts the pack keeps from other pages:

- The profile form's input, label, checkbox, field focus and green button read the same as the login page and the harness.
- Settings row labels are 14/400 #b3b3b3; the profile form's are 14/700 white, like the login page's. The Settings title is 32/700, the login title 48/800. The pack keeps the login page's.
- The account site's own "Profile" dropdown is a white masthead menu (3px, `0 0 30px rgb(0 0 0 / .2)`), not Encore: the pack keeps the web player's context menu.
- The language select in Settings is a native `<select>` on #2a2a2a, 32px; its list is drawn by the OS.
