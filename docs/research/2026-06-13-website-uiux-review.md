# Website UI/UX review — dotui.org (www/)

> Status: point-in-time assessment, 2026-06-13. Snapshot — not kept current.
> Method: 15 surface/dimension reviewers + per-finding adversarial verification (multi-agent), plus live in-browser inspection (preview server at 1440×900 and 375×812, dark + light) and direct source verification of every High+ finding. A wave of API rate-limiting killed the verifiers for the docs/header/components/responsive/theming surfaces and the accessibility reviewer mid-run; those findings were re-verified by hand against source for this report. Severities reflect the verifiers' corrections (most were downgraded from the reviewers' first pass).

## Overall verdict

The site is genuinely well-built and design-literate. The token system is clean, dark/light theming works, the docs reading experience is solid, the OKLCH color engine and the URL-codec-backed shareable builder state are impressive, and a lot of small things are done right (no-flash theme script, font preloading + metric-adjusted fallbacks, dual SVG favicon, reduced-motion handling on the rotating headline, sticky scroll-spy TOC, package-manager-synced code tabs).

The problems cluster in three places:

1. **The /create builder is the product, and it is the least finished surface.** It is unusable on mobile, two of its headline axes (Typography, Iconography) are non-functional stubs, the live preview is decoupled from the config panel, the synced-group concept never appears in the UI, and several header controls are dead.
2. **Site-chrome accessibility gaps** — no active nav state, no skip link, missing `<main>` landmark off the homepage, several unlabeled icon-only buttons, and an invisible keyboard focus trap in the homepage showcase.
3. **Docs/content responsive + polish gaps** — the on-this-page TOC disappears below 1280px, markdown tables overflow, external links lack `rel=noopener` and can crash the renderer.

None of this is structural rot; it's an uneven finish line. The fixes below are mostly small and local.

---

## CRITICAL

### 1. The /create builder is unusable on mobile
`www/src/routes/_app/create.tsx:98-112`
The shell is a hard `flex-row` with a fixed `w-72` (288px) `shrink-0` panel and a `flex-1` iframe, with **no breakpoint anywhere**. Measured live at 375px: the panel takes the full width and the preview iframe collapses to **15px wide** (724px tall). The builder is the product's core surface and its whole pitch is "preview every change live" — yet on a phone there is effectively no preview. Unlike the docs route, which uses `md:` breakpoints, `create.tsx` has zero responsive logic and no "best viewed on desktop" degradation either.
**Fix:** Stack to `flex-col` below `md`, or make the panel a collapsible drawer/sheet with the preview full-width and a toggle. At minimum show a graceful small-screen state instead of a 15px sliver.

---

## HIGH

### Accessibility / site chrome

**2. Homepage showcase cards stay keyboard-focusable while invisible (focus trap)**
`www/src/components/marketing/showcase/cards.tsx:116-141` (mask container + real grid)
The real, fully-interactive `CardsGrid` is faded to transparent by a bottom `mask-image` and layered under the "Built on modern tools" row, but it is never made `inert`. Dozens of controls that render invisible ("Upgrade plan", "Mark all as read", the All/Unread/Read tabs, etc.) remain in the tab order — a keyboard user's focus ring lands on nothing. The skeleton rails are correctly `inert + aria-hidden`; the real grid is not.
**Fix:** Wrap the real `CardsGrid` in `inert aria-hidden="true"` (it's a visual demo, not functional UI), matching `SkeletonRail`.

**3. Desktop nav has no active/current state**
`www/src/components/layout/header.tsx:60-69`
Docs / Components / Create are plain `text-fg-muted hover:text-fg` links with no `useLocation`-driven active styling — users never see which section they're in. This is inconsistent with the docs sidebar, which *does* highlight the active page (`docs-sidebar.tsx:25,59`).
**Fix:** Use TanStack Router's `activeProps`/`useLocation` to mark the current section (and set `aria-current="page"`).

**4. Mobile search trigger has no accessible name**
`www/src/components/layout/header.tsx:73-82`
On mobile the trigger collapses to `<SearchIcon class="md:hidden" />` with the "Search docs..." label `max-md:hidden`, and the `Button` has no `aria-label` — so on phones it announces as an unnamed button.
**Fix:** Add `aria-label="Search"` to the trigger (or a visually-hidden label).

**5. No skip-to-content link, and no `<main>` landmark off the homepage**
`www/src/routes/__root.tsx:179-193`, `www/src/routes/_app/route.tsx:40-45`
`RootDocument` renders children directly with no skip link, and only the homepage wraps content in `<main>` — `/docs` and `/create` render into plain `<div>`s, so most pages expose no `main` landmark.
**Fix:** Add a skip-to-content link in the root, and wrap each route's primary content (or the `_app` `<Outlet />`) in a `<main id="content">`.

### /create builder

**6. Typography font picker is a non-functional stub**
`www/src/modules/create/typography-config.tsx:24-63` (no font state in `preset/types.ts`/`defaults.ts`)
`FontPicker` renders a `<Select defaultValue="geist">` with hundreds of fonts but has **no `onSelectionChange`, no `selectedKey`, and no connection to `useDesignSystem`** — choosing a font does nothing (not stored, not previewed, not exported). The default key `"geist"` doesn't even match a list item (`"Geist"`), so the trigger opens blank.
**Fix:** Add heading/body font tokens to the preset and wire `selectedKey`/`onSelectionChange`; fix the default id. Until wired, don't present it as working.

**7. Selected font never loads and names aren't shown in their own typeface**
`www/src/hooks/use-google-font-loader.ts:24-40`, `www/src/modules/create/typography-config.tsx:37-58`
`loadFont`/`loadFontFull` exist but are never called from the builder (only `routes/og.tsx` loads fonts, server-side), and `ListBoxItem`s render the font name as plain text with no `style={{ fontFamily }}` — so ~1000 options all appear in the default UI font. You can't see what a font looks like before picking it.
**Fix:** Lazy-load + style visible items in their own typeface; `loadFontFull` on selection.

**8. Iconography selector is unwired and its descriptions are dead data**
`www/src/modules/create/iconography-config.tsx:16-32`
The `RadioGroup` has `defaultValue="lucide"` but no `value`/`onChange` and no state connection — selecting Remix/Tabler/Huge does nothing. Each library defines a description ("Clean & consistent", "Over 5000 icons"…) that is never rendered, and the home card hardcodes "Lucide icons" (`customizer-panel.tsx:117`).
**Fix:** Wire controlled value/onChange to state; render the descriptions; reflect the selected library in the preview card.

**9. Editing a component's params doesn't switch the live preview to it**
`www/src/routes/_app/create.tsx:31,47,52-56,107` + `components-config.tsx`
The iframe is keyed/sourced on the `preview` search param, while the config panel is driven by the independent `panel` param. Editing Button's variant while the default "Cards" preview is showing produces **no visible change** — the opposite of "preview every change live."
**Fix:** When the user opens a component in the panel, switch the preview to a view that contains it (or sync `preview` to the panel selection).

**10. The synced-group view is unreachable; groups are never communicated**
`www/src/modules/create/components-config.tsx:430-468` (GroupDetailView) vs `:90-121` (AllComponentsView)
`GroupDetailView` and its "Components in this group share the same visual style" copy only render when a group id is in the URL, but `AllComponentsView` only ever calls `onSelect(comp.name)` for individual components. The flat list never navigates to a group, so the central synced-group concept (Button ⇄ ToggleButton) is effectively dead code in the UI.
**Fix:** Surface groups in the panel (group rows that open `GroupDetailView`), or show the synced-style messaging on the member components.

**11. Navigable panel cards have no keyboard focus indicator**
`www/src/modules/create/components-config.tsx:81-82` (`cardClass`)
The component-list cards are `react-aria-components/Button`s styled with `cardClass`, which has hover styling but no `focus-visible` treatment — keyboard navigation through the list has no reliable visible focus.
**Fix:** Add a `data-focus-visible:`/`focus-visible:` ring to `cardClass`.

**12. The export footer has no label or heading**
`www/src/modules/create/customizer-panel.tsx` (footer region), `install-command.tsx:70-81`
The payoff of the whole builder — the install command + "Open in v0" — sits in an unlabeled footer. The install command renders a bare `npx shadcn init <url>` with just a copy icon and no microcopy, so there's no signal "this is how you ship your system."
**Fix:** Add a short section heading/label ("Install your design system" / "Copy to install").

**13. "Open in v0" anchor is unlabeled for screen readers**
`www/src/modules/create/open-in-v0.tsx:54-63`
The `<a>` contains the text "Open in " followed by `<V0Icon>` (no accessible text), so its accessible name is just "Open in". (Also: the host fallback is hardcoded `https://dotui.com` while the product domain in CLAUDE.md is dotui.**org**, and the localhost guard `origin === 'http://localhost'` never matches `http://localhost:4444` — so the v0 deeplink is broken in dev/self-host. Verify the domain.)
**Fix:** Add `aria-label="Open in v0"`; reconcile the registry-host domain and broaden the localhost guard.

### Docs

**14. The on-this-page TOC disappears below 1280px with no fallback**
`www/src/modules/docs/toc.tsx:42` (`max-xl:hidden`)
The right-hand TOC is hidden below `xl`. Between 768–1280px the left sidebar is present but there's no in-page section navigation; the "On this page" heading is also commented out (`toc.tsx:47-50`).
**Fix:** Provide a collapsible TOC (e.g. a "On this page" disclosure above the content) on `< xl`, and restore the heading.

**15. The sidebar never scrolls the active link into view**
`www/src/modules/docs/docs-sidebar.tsx:7-45`
The sidebar `<nav>` is `overflow-y-auto` and highlights the active item, but has no `scrollIntoView` effect. In the ~60-item flat Components list, the active page can sit far off-screen on load.
**Fix:** On mount/route change, scroll the active link into view.

**16. The "copy page" dropdown trigger has no accessible name**
`www/src/modules/docs/docs-copy-page.tsx:99-101`
The chevron menu trigger is `<Button isIconOnly><ChevronDownIcon/></Button>` with no `aria-label`. (The main "Copy page" button is fine.)
**Fix:** Add `aria-label="More copy options"`.

**17. Markdown tables render unstyled and overflow the prose column**
`www/src/modules/docs/mdx-components.tsx` (no `table`/`thead`/`tr`/`th`/`td` overrides)
There are no table component overrides, so any markdown table (e.g. in `form.mdx`) renders with browser defaults and overflows `max-w-3xl` with no horizontal scroll wrapper.
**Fix:** Add styled `table`/`th`/`td` overrides wrapped in an `overflow-x-auto` container.

**18. External links lack `rel=noopener` and the link renderer crashes on a missing href**
`www/src/modules/docs/mdx-components.tsx:84-101`
`const isInternal = href.startsWith('/')` throws if `href` is undefined (autolink/empty link), and external links get `target="_blank"` with **no `rel="noopener noreferrer"`**.
**Fix:** Guard `href` (default `''`/early return) and add `rel="noopener noreferrer"` for external targets.

**19. The Example overlay trigger is unlabeled**
`www/src/modules/docs/example.tsx`
The button that opens the live example modal has no accessible name.
**Fix:** Add an `aria-label` describing what it opens.

**20. Interactive demos have no "reset to defaults"**
`www/src/modules/docs/interactive-demo/controls.tsx`, `interactive-demo.tsx`
After experimenting with the prop controls there's no way back to the defaults.
**Fix:** Add a "Reset" action that restores `control-defaults`.

**21. Collapsed API-reference rows clip long type strings with no cue**
`www/src/modules/docs/reference.tsx`
Long union/type strings are hard-clipped in the collapsed row with no ellipsis or affordance; on mobile the Default column is also dropped, forcing a per-row expand to see any default.
**Fix:** Add ellipsis + a clear expand affordance; keep defaults reachable on mobile.

### Components catalog

**22. No search or filter across ~50 components**
`www/src/modules/docs/components-list/components-grid.tsx`
The catalog (`/docs/components`, with `/components` 301-redirecting to it) renders category grids with no search/filter — finding a component means scrolling or using the sidebar.
**Fix:** Add a filter/search input (you already ship Command/Combobox).

**23. The preview tile isn't a link, and interactive demos hijack clicks**
`www/src/modules/docs/components-list/component-card.tsx:45-67`
Only the small name text below each card is a link; the large preview tile renders a live `<Demo/>`. Clicking the obvious tile for Modal/Drawer/Popover/Menu/Select/Combobox/Tooltip fires the component's behavior instead of navigating — an affordance mismatch.
**Fix:** Make the whole card navigate (wrap in a link, with the demo `pointer-events-none` or `inert`), or add a clear "View docs" overlay.

### Theming / SEO / global states

**24. 404 and error screens don't vertically center**
`www/src/routes/_app/route.tsx:41`
The `_app` wrapper is a plain `<div>` (only sets `--header-height`) — not a flex/min-height column — so a not-found/error component relying on `flex-1`/centering has no height context and sits cramped at the top under the header.
**Fix:** Make the layout wrapper a `min-h-[calc(100vh-var(--header-height))] flex flex-col` so error/empty states can center.

**25. `/playground` (dev scratch page) is in the sitemap and indexable**
`www/src/routes/sitemap[.]xml.tsx:22` (`STATIC_PATHS = ['/', '/create', '/playground']`)
The lorem-ipsum dev playground is advertised in the public sitemap.
**Fix:** Drop `/playground` from `STATIC_PATHS` (and ideally `noindex` the route).

---

## MEDIUM

### /create
- **Shuffle and Undo header buttons are dead controls** — `customizer-panel.tsx:404-406` and `:415-417` render styled, focusable buttons with no `onPress` and no `aria-label`. A working "reset to default" doesn't exist anywhere despite the codec making it trivial (`setDesignSystem(DEFAULTS)` clears the preset). **Fix:** implement or remove both; if kept, add `aria-label`s; wire Undo to reset and disable it when already at default.
- **No loading state while the preview iframe boots** — `create.tsx:105-111`. On entry and on every preview switch (`key={effectivePreview}`) the user sees a blank bordered box until the lazy bundle + postMessage handshake complete. **Fix:** show a skeleton until the existing `{type:'preview-ready'}` message fires.
- **Contrast report + ramp preview are hardcoded to light mode** — `color-contrast.tsx:19`, `colors-config.tsx:175` read only `resolved.light`. Toggle the preview to dark and the contrast verdict + ramps still describe light. **Fix:** thread `previewMode` and index `resolved[previewMode]`, or show both modes side by side.
- **"Fail" contrast is color-only and offers no fix** — `color-contrast.tsx:22,25-38`. `verify({suggestFix:false})` discards the computed suggestion; fail vs pass differs mainly by a red badge. **Fix:** add a non-color cue (icon) and a "make text darker/lighter" hint.
- **Color knobs use raw color-science jargon** — `color-knobs.tsx:30-55,151-201` ("Min chroma 0.11", "Off (array-driven)", "Vivid (gamut cusp)"). **Fix:** outcome-oriented labels + one-line helper text; "Off (array-driven)" → "Automatic".
- **Density vs Iconography radios look like different products** — `layout-config.tsx:75-95` vs `iconography-config.tsx:19-30` use opposite idioms and even different selected-state colors. **Fix:** lean on the built-in `has-data-label:` card variant in `radio-group/styles.ts` for both.
- **Cursor/Radius captions use raw `<span>`s** bypassing the panel's `[data-label]` styling — `cursor-config.tsx:40,47`, `layout-config.tsx:31`. **Fix:** use the registry `<Label>` / a shared caption component.
- **Preview never shows interaction states** (disabled/loading/hover/error) despite those being configurable axes; **component list is an unsearchable single column** in the 288px pane; **examples grid is locked to one column**, wasting width.

### Header / nav
- **GitHub link is icon-only but omits the `isIconOnly` variant** — `header.tsx:83-92` — so its padding/width don't match the adjacent search/theme buttons.
- **Keyboard hint hardcodes the Mac ⌘ glyph** (`header.tsx:80`) — Windows/Linux users see ⌘ K though their shortcut is Ctrl.
- **The persistent mobile header has no logo/home affordance** — `header.tsx:59` hides the `Logo` with `max-md:hidden`, leaving no way back to home from the mobile header.

### Docs
- **Prev/next page titles are hidden behind hover tooltips** (`docs-pager.tsx`) — invisible on touch.
- **"Copy page" gives only a silent icon swap** — `docs-copy-page.tsx:95-96` — no text change, no live-region announcement.
- **Per-component status (pending / in review / done)** is populated in `components-data.ts` but never surfaced, so users get no production-readiness signal.

### Theming / SEO
- **Some site-chrome paints with raw Tailwind palette instead of theme tokens** (e.g. the create contrast badge `neutral-100`, near-white in dark mode; docs body text) — bypasses the OKLCH engine.
- **No `meta theme-color`** (`__root.tsx:34-53`); the manifest `theme_color` is a mismatched mid-gray.
- **`/create` has no per-route title/OG** (`create.tsx:22-28`) — the flagship route inherits the generic marketing title.
- **No route pending UI** for cold docs navigations.

### Landing
- **Live-customizer controls have sub-target tap sizes on mobile** — `showcase-customizer.tsx:171-309` — 24–32px targets on the headline "preview it live" interaction. **Fix:** bump to ~36–44px on the collapsed layout.
- **AskAi suggestion chips look clickable but do nothing** — `ask-ai.tsx:45-55` use `cursor-interactive` on non-interactive `Badge`s. **Fix:** drop `cursor-interactive`.
- **Long dark band between the showcase fade and "Built on modern tools" on common laptop heights** — `index.tsx:121` (`-mt-[380px]`) + `cards.tsx:116` mask. The transition is deliberately tuned (and the verifier showed the *hard* void is ~140px, not a full viewport), but live at 720–800px viewport heights the scroll passes through a long near-black stretch that reads as the page having ended. Worth a second look on a real laptop; consider shortening the masked tail or pulling the next section up further.

---

## LOW / polish

- **Footer** (`footer.tsx`): it's a non-semantic `<div>` not `<footer>` (no `contentinfo` landmark); it renders only on the homepage (not in `_app/route.tsx`, so absent on /docs); it surfaces none of the configured GitHub/Discord/X links; and the attribution link has no "opens in new tab" hint. Cheap wins: make it a `<footer>`, add the Discord/GitHub links from `siteConfig.links`.
- **Announcement pill** (`announcement.tsx`) links to /create (same as the primary CTA) and restates the rotating-headline content — no actual news. Repoint it or reword it as a value prop.
- **Rotating headline** never pauses on hover/focus (minor; reduced-motion already handled).
- **AA vs AAA contrast badges are visually identical** (`color-contrast.tsx:33-37`) — the numeric ratio beside them already carries finer info, so this is minor.
- **Ramp step values are only reachable via native `title` tooltips** (`colors-config.tsx:181,188`) — keyboard/touch-inaccessible secondary affordance.
- **Radius slider has no semantic endpoints** (`layout-config.tsx:36-45`) — bare 0–2× multiplier; add Sharp↔Round captions (note: named *preset stops* would be a product-axis change — propose first).
- **Preview-mode (light/dark) toggle isn't persisted in the shareable URL** (`create.tsx:35`) — a system tuned in dark opens in the recipient's light.
- **Install-command copy fails silently** (`install-command.tsx:56-64`) — matches the site-wide `use-copy-to-clipboard.ts` convention; a `ToastProvider` is already mounted if you want a global fallback.
- **Param descriptions render at `text-fg-muted/60`** (`components-config.tsx:212,277,330,414`) — low contrast for genuinely useful guidance.
- **Doc images are capped at `max-w-md`** regardless of context (`mdx-components.tsx:119`); **inline code can overflow** on long unbreakable tokens.
- **Header is fully transparent until scrolled** — controls float over content at the very top.
- **OG image route renders an empty card when `title` is missing** (`og.tsx`).

---

## Excluded as false positives (for transparency)

The adversarial verifiers rejected these as taste/standard-pattern with no clear user harm — I agree:

1. **Hero subhead hardcoded `<br>`** (`index.tsx:92`) — separates two distinct sentences; conventional, no demonstrated breakage.
2. **"Built on modern tools" logos at 0.6 opacity + grayscale** (`index.tsx:164`) — the canonical "trusted by" logo-row treatment (Stripe/Vercel/Linear), with hover reveal + tooltips.
3. The original "near-full-viewport black void" claim's *magnitude* was overstated (the hard void is ~140px); kept above as a nuanced Medium because live viewport heights still show a long dark band.

---

## Suggested priority order

1. **/create on mobile** (#1) — the product's core surface is broken on phones.
2. **The unfinished builder axes** (#6–#13) — Typography/Iconography stubs, preview decoupling, dead groups/controls, unlabeled export. These undercut the core promise.
3. **Chrome accessibility quick wins** (#2–#5, #16, #18, #19) — mostly one-line `inert`/`aria-label`/`rel`/skip-link fixes with broad impact.
4. **Docs responsive** (#14, #15, #17) — tablet TOC, sidebar scroll, table overflow.
5. **Catalog navigation** (#22, #23) and **SEO/states** (#24, #25), then the Medium/Low polish.

Note: several "add a named option/preset/axis" ideas (radius presets, font axis, new semantic states) are product-axis decisions — per repo convention, propose before implementing.
