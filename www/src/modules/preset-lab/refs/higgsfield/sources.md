# Higgsfield reference pack

Measured 2026-10-21 with probe `8eb9b12`: `presets:measure --pack higgsfield`, headless Chromium at 1440×900, DPR 2, dark only. No sign-in.

Higgsfield publishes no token docs. Its design system, Q, ships with every higgsfield.ai page as `--hf-*` tokens and `.q-*` component classes in four stylesheets:

- `https://assets.higgsfield.ai/tanstack/assets/2feeef17-rOu4aQ4aBDawgJec.css`: fonts and the font variables.
- `https://assets.higgsfield.ai/tanstack/assets/2feeef17-zKId3gDbV_o61ByP.css` (12 MB): the `--hf-*` tokens and most `.q-*` rules.
- `https://assets.higgsfield.ai/tanstack/assets/2feeef17-jR28g5ewL6SfHlYp.css` and `…-hMa2Ild8dwt-6F-H.css`: the remaining `.q-*` rules.

The file names are build hashes: when Higgsfield redeploys, take the new ones from any page's `<link rel="stylesheet">` tags.

The app is dark only. Its light rules cover code blocks and the separate Supercomputer builder, not the studio, so light mode is derived (see the preset). A crawl of 237 public pages (every English sitemap page plus the studio, apps, blog and creator-hub pages) under both OS schemes found no light theme: some pages set `data-theme="default-light"` under a light scheme and still render dark.

## Pages

- `q.html`: a harness that loads the four stylesheets and lays out Q's own components with Q's classes on `--hf-color-background-primary`: buttons (sm 40px: primary, secondary, tertiary, ghost, outline, brand-soft, icon; md 48px), focus, disabled, toggles, segmented tabs (`q-tabs-segmented`, default tone), underline tabs, checkbox, radio, switch, field and select, tooltip, progress, a text link (Q's `[&_a]:text-q-text-link`, the lime `--hf-color-text-link`) and modal. Its only styles of its own are layout, section labels, `.static` (which un-fixes the tooltip and modal so they sit in the page) and a script that sets the `--active-tab-*` variables Q's tab indicator reads (the app sets them from JS).
- `https://higgsfield.ai/ai/image`: the aspect-ratio dropdown (the `Auto` button), a live glass `q-dropdown-content` with `q-menu-item` rows. The page needs about 15 s to render.
- `https://higgsfield.ai/`: the header (`shell`, its nav links, the `New` badge), a model card and the section subtitle.
- `https://higgsfield.ai/pricing`: titles. `heading.1` is the promo banner's h2 (36px); the copy changes, so re-check it on a re-measure. `heading.3` is the "For teams" plan title (24px).

Q maps to the specimens this way: Q's `secondary` button is white (inverse), so `button.secondary` is Q's `tertiary` (white 10%), the gray fill the app uses beside the lime primary; `button.quiet` is `ghost`.

## Skipped properties

- `segmented.selected` compares only fill, corners, height, edge and shadow: Q's indicator is a separate span under the tab labels.
- `tab.selected` `backgroundColor` and `edge`: the selected tab is clear; its indicator is a 2px bar the probe reads as the fill.
- `menu.item` `paddingInline`: Q pads the row (8px), dotUI pads inside the item's inset.

## Cross-checks (not in the pack)

- Header nav buttons are 36px; the cookie banner's buttons 40px at 10px corners.
- The sign-up dialog: #131517 at 24px corners inside a 1px rgba(217,217,217,.04) edge, a 52px email field at 12px corners on a 1px edge, story bars 4px white 20% with a white fill.
- An older `.button` system still renders on some pages: 40px at 10px corners, 14/600, a 3px focus ring, hover at brightness 80%, disabled on #292b2c.
- Marketing CTAs are 48px at 12px corners, 16/600 (the md size); the studio's buttons stay 40px at 10px, 14/500.
- Fields across the site are 40–44px on white 5% at 10–12px corners.
- Blog prose links don't use the link token: they keep the paragraph's white 80% at 400, underlined at a 0.2em offset (`.content-html p a[href]`). Footer and header links are muted ink, no underline.
- Titles are Space Grotesk 700 uppercase everywhere, with tracking from normal to -1.2px depending on the page. Page grounds vary: #0b0b0b on marketing pages, #131416 in the studio.
- `/academy` uses `q-accordion`; `q-tabs` also come as pill and glass variants on marketing pages.
- The signature CTAs (GENERATE, Get Plus) add a gloss gradient, drop shadows and a 3px inset ledge in #829b19 to the lime fill.

## Q values worth knowing

- Page #131416 (#0f1113 on the home page); surfaces #1c1e21, #23262a, #2a2d32; glass #23262a at 75% over a 40px blur on menus, modals, cards and toasts.
- Lime #d1fe17 under #1a1a1a labels. Text #fff, secondary #828282, tertiary #626262 (live UI muted text #898a8b, header links #a8a8a8). Lines white 10% (default), 5% (subtle), 20% (strong). Scrim black 50%. Disabled at 50% opacity.
- Status: success #2eb844, warning #ffef33 (border) and #dfab01 (icon), error #fa0019.
- Radii 2, 4, 6, 8, 10, 12, 16, 20, 24px and full. Buttons 40px at 10px (sm) and 48px at 12px (md); fields, toggles, segmented track and menus 12px; menu rows, tooltips and segmented chips 8px; checkboxes 6px; modals and `q-card` 24px; the home model cards 12px inside a 16px white 5% frame.
- Inter for UI text, Space Grotesk 700 uppercase at -0.04em for titles. The body maps `--font-mono` to Space Mono (the IBM Plex Mono token is unused).
- Buttons 14/500 (sm) with 16px padding. Focus: `0 0 0 2px` page, `0 0 0 4px` lime, a 2px ring 2px out. Hover: a white 20% overlay.
- Fields 40px, white 5%, no edge, 12px padding, 14/400; hover adds white 5%; focus is a 1.5px inset lime line. Labels 12/500 white.
- Checkbox 20px with a 1.5px white 10% edge; checked lime under a dark check. Radio checked: a lime ring around a lime dot. Switch 28×16, off #5c626a, on lime, 12px white knob.
- Toggle 40px at 12px corners in secondary ink with no fill; pressed is lime 10% under lime ink.
- Segmented track 40px on white 5% inside a 1px white 10% edge; items 32px at 8px corners, 12/500 tertiary ink; the selected chip white 5% inside a subtle edge, no shadow.
- Underline tabs 52px, no padding, 8px gap, 14/500 tertiary ink (lime on hover); a 2px white indicator (lime in `q-tabs-tone-accent`) over a white 5% rule.
- Menus padded 4px, rows 36px at 8px corners, 14/500, highlight white 5%, check at the end; group labels 12/500 at white 50%.
- Tooltip inverse (white under #1a1a1a), 8px corners, 4px 6px padding, 12/500, 8px arrow.
- Modal padding 8px, title 16/600, description 14/400 in secondary ink, actions at the end, a round white 5% close button.
- Badges uppercase 10/700; the nav `New` badge is lime 20% under lime ink, 16px tall at 6px corners. Skewed gradient badges (TOP, NEW) also appear.
- Accordion rows divided by white 5% lines, chevron at the end. Toasts on glass at 16px corners, the action inverse.

## Not measured yet

The signed-in app (sidebar, project and settings menus, dialogs, toasts). It would run in Mehdi's Chrome and merge into this pack.
