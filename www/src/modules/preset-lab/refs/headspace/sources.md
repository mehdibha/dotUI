# Headspace reference pack

Measured 2026-10-23 with probe `ce94064`: `presets:measure --pack headspace`, headless Chromium at 1440×900, DPR 2, no sign-in.

Headspace publishes no token docs. Three surfaces were measured:

- **The web app** (my.headspace.com) redirects every route to sign-in, but ships its whole design system in one stylesheet: Panda CSS semantic tokens in `:root` and `.dark`, and component recipes (`.button--variant_*`, `.textField`, `.select`, `.tabGroup`, `.segmentedControl`, `.selectionChip`, `.checkbox`, `.radio`, `.toggle`, `.badge`, `.dialog`, `.drawer`, `.toast`, `.text--variant_*`, …). Read on 2026-10-23 at `https://my.headspace.com/static/js/index-CjFZB0Xe.css`. The name is a build hash: after a deploy, take the new one from the `<link rel="stylesheet">` in `https://my.headspace.com/`. Recipe defaults (segmented control `contrast: high, size: large`, badge `size: large, variant: default`, tab `size: large`, dialog `size: small`) come from the app's `dist-*.js` chunk. An older Emotion theme (`web-ui-components`) also ships in `routes-*.js`; the pack doesn't use it.
- **Sign-in** (`www.headspace.com/login`, served by auth.headspace.com): the app's text field and primary button, live.
- **Marketing pages** (www.headspace.com, Next.js): light only, legacy body ink #4b4c4d, larger headings.

The app has light and dark themes; marketing and sign-in are light only. Dark comes from the harness, which renders the shipped `.dark` tokens.

## Pages

- `ds.html#light` and `ds.html#dark`: a harness that loads the app stylesheet and lays out its recipes with their own classes and `data-part` anatomy, `.dark` on `<html>` for the dark theme: mLarge buttons (primary, secondary, ghost, icon-only), selection chips, the segmented control (high contrast, large), text fields, the select trigger and its popup, checkbox, radio, switch (`.toggle`), large tabs, a link, the default badge, `text--variant_*` headings and body, and a small dialog. Its only styles of its own are layout, section labels, `.static` (un-fixes the dialog and popup) and one rule hiding the checkbox and radio hover plates (`::before` at opacity 0 until hover), so the probe reads the box. In light it measures only parts no real page shows; in dark it measures every part.
- `https://www.headspace.com/login`: `input` (the 56px field, ink from its `<input>`), `input.focus` (focused through a `before` step, edge only: keyboard focus by tabbing triggers the empty-field error), `button.primary`, `button.focus` and the "Sign up for free" `link`.
- `https://www.headspace.com/`: page font, the "deeper dive" chips as `toggle` / `toggle.on` (they are the app's `selectionChip` look: a #f9f4f2 pill, ink when selected) and three headings.
- `https://www.headspace.com/app`: a `.threeCard` as `card`.
- `https://www.headspace.com/sleep`: article pagination, the current page as `pagination.current`.
- `https://www.headspace.com/subscriptions`: the plan tag as `badge.accent`.
- `https://www.headspace.com/content/meditation/youre-worthy-of-love/7976`: "Play Sample" as `button.secondary`, the media banner text, the content title as `heading.4`.

Every www.headspace.com page first clicks the OneTrust "Reject all" button (`steps`), whose banner covers the crops.

## Skipped properties

- `heading.*` `fontSize`: marketing and app headings sit on their own scales (see Values).
- `page`, `text` and `heading.4` `color` on marketing pages: their ink is the legacy #4b4c4d, not the app's foreground #2d2c2b.
- Dark `toggle` / `toggle.on` padding, size, weight and tracking: the harness chip's label inherits body text, where the app wraps it in its own text style.

## Entered by hand

- Dark `pagination.current` (#e5e7ec under #050726), `card` (#101340, the light lip kept) and `badge.accent`: no dark page shows them; values are the `.dark` tokens the matching light parts use (interactive-inverse, surface-strong).
- Dark `button.focus`: the sign-in ring (2px #0040ea, 2px out). The harness reads the browser's default outline: buttons have no focus recipe, and the global `:focus-visible` rule (`0 0 0 2px` primary) loses to the variant's box-shadow.

## Fonts

Headspace Apercu (`static.headspace.com/fonts/apercu-v1.002/`) is proprietary. `.scratch` font match against 37 Google sans (width ratio, ink ratio, glyph-mask IoU at 400 and 700): DM Sans scores best at both weights (400: width 1.05, ink 0.99, IoU 0.46; 700: 1.08, 1.02, 0.66), ahead of Geologica and Schibsted Grotesk. Utility labels use Apercu Mono uppercase; no free match is in the font catalog.

## Values worth knowing

- Warm grays (light): 100 #f9f4f2, 200 #e2ded9, 300 #c6c1b9, 400 #96938d, 500 #63605d, 600 #44423f, 700 #2d2c2b, 800 #141313. Cool grays (dark): 100 #e5e7ec, 200 #d2d5de, 300 #9da5b8, 400 #7580a3, 500 #545f82, 600 #2a2d55, 700 #101340, 800 #050726.
- Light: background and surfaces white, foreground #2d2c2b, weak #44423f, weaker #63605d, border #e2ded9, interactive-strong #f9f4f2, inverse #2d2c2b. Dark: background #050726, modal and strong surfaces #101340, border and interactive-strong #2a2d55, foreground #e5e7ec, weak #d2d5de, weaker #9da5b8.
- Primary blue-200 #0061ef, hover blue-300 #0040ea; links #0061ef / blue-100 #00a4ff. Brand orange-200 #ff7300 (the logo). Status: success #02873e, warning #ffb700, critical #e01919.
- Toasts on contrast-background: #050726 in light, #f9f4f2 in dark, 8px corners.
- Radii: small2-x 4, small-x 8, small 12, medium 16, large 24, large-x 32, pill. Fields, selects and popups 12; dialogs and drawers 24; checkboxes 4; buttons, chips, badges, segmented controls pills.
- Borders 2px (border-widths-small) on fields, checkboxes, radios, popups and dividers; accordion rules 1px.
- `shadow-default` 0 2px 0 #14131333 (#9da5b833 in dark): a 2px unblurred lip under primary buttons, switch knobs, slider thumbs and marketing cards. Popups take `shadow-overlay` 0 0 12px #14131333. Dialog backdrop #00000080, no blur.
- Buttons: pill, bold, -0.03em; xSmall 24 / small 32 (16px sides, 14px), medium 40, mLarge 48 (24px sides, 16px), large 56 (18px). Disabled at 40% opacity.
- Fields and select triggers 56px with the label inside: 16px centered, shrinking to 12px at 8px from the top, the value padded 25px from the top. Hover darkens the edge to border-stronger; focus turns it primary.
- Checkbox 16px, 2px border-stronger edge, checked primary; radio 16px, 2px border-strongest edge, checked a primary edge around an 8px primary dot. Switch 52×32, off #96938d, on primary, 24px white knob on the lip.
- Tabs: no padding, 24px apart (large), 20/700 at -0.6px in weaker ink, current in full ink over a 2px ink bar.
- Segmented control: a #f9f4f2 pill track with 4px padding, 48px segments at 16/700 (-0.48px), the current one #2d2c2b under white.
- Selection chips: 44px pills on #f9f4f2, ink when selected. Choice options: pills on #f9f4f2 (48px or 56px), a 3px border-stronger edge when selected, a 24px primary indicator.
- Badges: pills, 24px, 8px sides, 14/700 at -0.42px; the default badge is link-blue on #f9f4f2, status badges solid.
- Menus (select popups): 12px corners, a 2px border, `shadow-overlay`, 48px square rows (12px 16px padding), highlight #f9f4f2, a primary check at the end.
- Headings bold at -0.03em in the app (56/48/32/24/20px); marketing headings at -0.04em (48/30/24px).
