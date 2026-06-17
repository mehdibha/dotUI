# Proposal: wire the Typography, Iconography, and synced-group axes in /create

> Status: PROPOSAL — awaiting decision. 2026-06-13. Companion to [the website UI/UX review](./2026-06-13-website-uiux-review.md) (findings #6, #7, #8, #10). These are product-axis changes, so per CLAUDE.md they're proposed here rather than slipped into a fix PR.

## Why this is a separate decision

The UI/UX review found three builder surfaces that *look* functional but aren't wired, and one that's misleading if exposed as-is. Fixing them means adding real state to the design system (new axes) and deciding behavior — both product decisions, not polish. The accessibility/responsive fixes shipped separately; this is the part that needs your call first.

Current state, verified in code:

- **Typography** (`typography-config.tsx`) — `FontPicker` is a `<Select defaultValue="geist">` with ~1000 Google Fonts but **no `onSelectionChange`, no `selectedKey`, no connection to `useDesignSystem`**. Choosing a font does nothing. Font names render in the default UI font (no `style={{fontFamily}}`), and `loadFont`/`loadFontFull` (`use-google-font-loader.ts`) are never called from the builder. The default key `"geist"` doesn't match the list item `"Geist"`.
- **Iconography** (`iconography-config.tsx`) — `RadioGroup defaultValue="lucide"` with no `value`/`onChange`/state. Each library has a description ("Clean & consistent"…) that's never rendered. The home card hardcodes "Lucide icons".
- **Synced groups (#10)** — `GroupDetailView` ("Components in this group share the same visual style") is unreachable (no control navigates to a group), AND `setComponentParam` keys params per-component (`use-design-system.ts:37`), so the editor does **not** actually sync a group. Exposing the view today would assert a behavior that doesn't exist — which is why it was *not* shipped in the fix PR.

There's no font/icon field anywhere in `preset/types.ts` or `defaults.ts`, and the URL codec + publisher don't know about them.

## What needs deciding

### A. Typography axis

1. **Granularity** — one font for everything, or separate **heading** + **body** (+ maybe **mono**)? The preview card already shows Heading/Body separately, suggesting two. Recommendation: heading + body, mono later.
2. **Font source** — Google Fonts only (matches the current picker + `og.tsx` loader), or also "system" / custom? Recommendation: Google Fonts + a "System UI" option, others later.
3. **Token shape** — store as `--font-heading` / `--font-body` CSS vars in `designSystem.tokens` (reuses the existing token plumbing + codec), or a dedicated `typography` field on the preset? Recommendation: dedicated `typography: { heading, body }` field — fonts aren't CSS-var tokens today and need a font-loading side effect the token path doesn't model.
4. **Export** — the publisher must emit the `@fontsource`/Google import (or `next/font` equivalent) and set the vars in the shipped theme CSS. This is the largest piece and touches `publisher/` (slated for rewrite — coordinate).

Proposed implementation once decided:
- Add `typography` to `DesignSystem` (`preset/types.ts`, `defaults.ts`) + codec round-trip (`preset/codec.ts`).
- `FontPicker`: controlled `selectedKey` + `onSelectionChange` → `setTypography`; render each `ListBoxItem` in its own face (lazy `loadFont` on visible items); `loadFontFull` on selection; fix the default id.
- Apply `--font-heading`/`--font-body` in `DesignSystemProvider` and forward to the preview iframe (same postMessage path as tokens).
- Publisher: emit font imports + theme vars.

### B. Iconography axis

1. **Does export swap icons?** The publisher already "swaps icons" per CLAUDE.md. Confirm a chosen library (Lucide / Remix / Tabler / Huge) actually re-maps the shipped `__generated__/icons` set, or whether this is preview-only for now.
2. **Preview fidelity** — show the selected library's glyphs in the home card + previews, not a hardcoded Lucide row.

Proposed: add `iconLibrary` to the preset; controlled `RadioGroup`; render the `description` (the data already exists); reflect the selection in the home card and, if the publisher supports it, in the live preview.

### C. Synced-group editing (#10)

The real question: **should editing one component in a group write the shared params to all members?**

- **Option 1 — true sync:** `setComponentParam` on a grouped component writes the same param to every group member (Button + ToggleButton). Then `GroupDetailView` becomes truthful and we expose groups in the panel home (group entries → group view → member list). Matches the CLAUDE.md north star ("must stay in sync").
- **Option 2 — group as the unit:** store params once per *group*, not per component; members read the group's params. Cleaner data model, bigger refactor of `componentParams` + publisher.
- **Option 3 — drop it:** remove the dead `GroupDetailView` until the model is built. Lowest effort, but walks back a stated product principle.

Recommendation: **Option 1** (least disruptive to the current per-component store — write-through to members on edit), then surface groups in the panel home. Defer Option 2 to the publisher rewrite if the data model gets revisited.

## Sequencing

1. Decide A.1–A.4, B.1, and C (this doc).
2. Land the preset/codec additions (typography, iconLibrary) — small, mechanical.
3. Wire the controls + preview (no publisher yet) so the builder previews correctly.
4. Publisher emission (typography fonts, icon swap) — coordinate with the planned publisher rewrite so we don't deepen the old code.

Steps 2–3 are previewable and low-risk once the model is chosen; step 4 is the heavy, publisher-coupled part.
