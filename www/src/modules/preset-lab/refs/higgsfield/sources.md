# Higgsfield reference pack

Measured 2026-10-21 and 2026-10-22 with probe `8eb9b12`: `presets:measure --pack higgsfield`, headless Chromium at 1440×900, DPR 2, dark only, no sign-in. A signed-in pass on 2026-10-22 cross-checks it (see Signed in).

Higgsfield publishes no token docs. Its design system, Q, ships with every higgsfield.ai page as `--hf-*` tokens and `.q-*` component classes in four stylesheets:

- `https://assets.higgsfield.ai/tanstack/assets/1a2c0e3d-rOu4aQ4aBDawgJec.css`: fonts and the font variables.
- `https://assets.higgsfield.ai/tanstack/assets/1a2c0e3d-7obaU3v4WYgtXJbx.css` (12 MB): the `--hf-*` tokens and most `.q-*` rules.
- `https://assets.higgsfield.ai/tanstack/assets/1a2c0e3d-QqV9Wy_5xROnvFyC.css` and `…-hMa2Ild8dwt-6F-H.css`: the remaining `.q-*` rules.

The file names are build hashes: when Higgsfield redeploys, take the new ones from any page's `<link rel="stylesheet">` tags. The 2026-10-22 deploy (`1a2c0e3d-*`) measures the same on the harness as the 2026-10-21 one (`2feeef17-*`).

The app is dark only. Its light rules cover code blocks and the separate Supercomputer builder, not the studio, so light mode is derived (see the preset). A crawl of 237 public pages (every English sitemap page plus the studio, apps, blog and creator-hub pages) under both OS schemes found no light theme: some pages set `data-theme="default-light"` under a light scheme and still render dark.

## Pages

- `q.html`: a harness that loads the four stylesheets and lays out Q's own components with Q's classes on `--hf-color-background-primary`: buttons (sm 40px: primary, secondary, tertiary, ghost, outline, brand-soft, icon; md 48px), focus, disabled, toggles, segmented tabs (`q-tabs-segmented`, default tone), underline tabs, checkbox, radio, switch, field and select, tooltip, progress, a text link (Q's `[&_a]:text-q-text-link`, the lime `--hf-color-text-link`) and modal. Its only styles of its own are layout, section labels, `.static` (which un-fixes the tooltip and modal so they sit in the page) and a script that sets the `--active-tab-*` variables Q's tab indicator reads (the app sets them from JS).
- `https://higgsfield.ai/ai/image`: the aspect-ratio dropdown (`button[aria-label="Aspect ratio"]`), a live glass `q-dropdown-content` with `q-menu-item` rows; the model picker (`command`, `command.item`): a search field over grouped rows, opened from the unlabelled model button. The page needs 8 to 15 s to render.
- `https://higgsfield.ai/`: the header (`shell`, its nav links, the neutral `New` chip as `badge`), a model card and the section subtitle.
- `https://higgsfield.ai/pricing`: titles. `heading.1` is the promo banner's h2 (36px); the copy changes, so re-check it on a re-measure. `heading.3` is the "For teams" plan title (24px).

Q maps to the specimens this way: Q's `secondary` button is white (inverse), so `button.secondary` is Q's `tertiary` (white 10%), the gray fill the app uses beside the lime primary; `button.quiet` is `ghost`.

## Skipped properties

- `segmented.selected` compares only fill, corners, height, edge and shadow: Q's indicator is a separate span under the tab labels.
- `tab.selected` `backgroundColor` and `edge`: the selected tab is clear; its indicator is a 2px bar the probe reads as the fill.
- `menu.item` `paddingInline`: Q pads the row (8px), dotUI pads inside the item's inset.
- `command.item` `height`: the model picker's rows are two lines (a 16px name over a 14px description beside a 40px icon tile, 52px); dotUI's command row is one line.

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

## Signed in

On 2026-10-22 Mehdi's local session captured 21 signed-in pages in his Chrome (dark, 1440×900 at DPR 2, free plan, UI chrome only): Explore (`/`), `/ai/image` with its toolbar menus and model picker, `/ai/video` with its pickers, account settings and its Sessions, Gift, Subscription, Usage and Promo pages, the Edit profile dialog, the asset library, the public profile, pricing, and the Audio, MCP, Genjutsu, Content factory, Katana, AI Influencer, Academy and Apps pages. The raw bundles and screenshots stay in the project files.

- **Same as the pack:** `shell`, `nav.item`, `nav.item.active`, `card`, `text.muted`, `menu`, `menu.item`, `field.label`, `input.focus`, `heading.1`, `heading.3`, and `command` and `command.item` (also measured headless).
- **`badge.accent` is entered by hand** from this pass: the signed-in header's `FREE` chip on Genjutsu, lime 24% (rgb(61, 73, 20)) under #d1fe17 at 10/700 caps, 16px, 6px corners. Since the 2026-10-22 deploy the public header's chips (`New` on Genjutsu, What If, Katana and Academy) are neutral (`badge`), so no public page shows a lime chip.
- **Q classes in use:** `q-switch` (28×16, white 12px knob) on AI Influencer, `q-checkbox` (20px, 1.5px white 10% edge, 6px corners) on Sessions, `q-tabs` in segmented pill (Academy), fill (AI Influencer), underline (Content factory) and pill (MCP, the profile) forms, `q-accordion` on Academy and AI Influencer, `q-button-primary` at 40px and 10px corners, 14/500 (60 on Content factory).
- **Looks apart from Q, kept out of the pack:** the settings switches are a second, larger switch (36×24, off #5e636e); the studio's Create / Edit / Motion tabs on `/ai/video` are 36px with a 2px white underline and #a0a1a2 labels; its References / Extend Video toggle is a 48px track with 40px items at 10px corners, 14/600, no edge; the Quality trigger's focus is a 2px lime border with no offset; the Edit profile dialog is #1c1e20 at 12px with no drop, and its field sets 16px text; the library's "search by date" hint is a dark popover (#1c1e20, white text, a drop), not Q's inverse tooltip.
- **Other surfaces:** the header mega menu (`.hfnav-viewport`) is #1c1e20 at 24px inside a 1px edge with a deep drop, rows 64px at 16px corners; the avatar menu is #1c1e21 at 20px with a white 5% edge; the generate composer is #1c1e21 at 20px; settings cards are #1c1e20 at 20px; library sidebar rows are 36px at 12px corners, the current one on #1f2022.

Not measured: toasts (nothing was submitted), an on switch in settings (nothing was toggled), and the API console (`open.higgsfield.ai`, a separate app, signed out).
