# Control panel exploration

UI-only prototype of the redesigned `/create` control panel + a floating **panel lab** that restructures the panel live. Open it at **`/create?lab=true`** (the shipped `/create` is untouched). Source lives in `www/src/modules/create/panel/`.

This is milestone 1 of the build order: live binding established, macro front door + a real control slice, five switchable layouts, and the floating lab. It is deliberately a _floor to iterate on_, not the finished panel.

## The core bet: the panel is data, the lab is a view switch

Every control is one **atomic node** tagged on three independent axes — `domain` (color/type/shape/…), `tier` (primitive/semantic/component), `tempo` (macro/micro) — plus a `binding` honesty flag. A node owns only its _widget_; the chrome renders the label/description/row-layout from the metadata (`schema.tsx`, `primitives.tsx`).

Because the controls are data, the lab re-groups and re-shapes the **same** controls without touching them:

- **Navigation** (`layouts.tsx`): long-scroll · tabs · accordion · sidebar-of-sections · command-first. Materially different IA, not cosmetic.
- **Grouping**: by domain / by tier / by macro→micro — derived from the tags at runtime (`sectionsFor`).
- **Disclosure & density, header, chrome**: row layout, descriptions, macro front door, Quick/Expert, width, dock side, sticky footer, and each header slot.

The lab writes a `PanelConfig` (`config.tsx`, persisted to `localStorage`); flipping any switch genuinely re-renders the panel in a new shape. This is the instrument for finding the right IA by trying it.

## Live, not logic

The right preview consumes a `DesignSystem` object (`tokens: Record<string,string>` of CSS vars + `color` recipe + `density` + per-component `params`) via `useDesignSystem()` → `?preset=` URL → `sendToIframe`. The `DesignSystemProvider` applies `tokens` as CSS variables on the preview root.

So **`setToken('--x', v)` is a generic live channel** — every control writes real state through it, with no new plumbing. Built on `/create` (not a new route) specifically so `useDesignSystem()` and the existing live controls are reused as-is, and the **preview panel is the one I already built — not rebuilt.**

Each control shows a **binding dot** so nothing pretends to be real:

- **Live** (drives the preview today): brand/base/status colors + algorithm + gray strategy, radius factor, density, cursors, and per-component anatomy (Button/Input/Card reuse the real param editor).
- **Stub** (writes a namespaced `--ds-*` var; instantly live the moment a component reads it): typography, border width, spacing scale, elevation style family, shadow/blur, motion, focus ring, icon stroke, default mode.

## Judgment — added / cut / invented

- **Invented**: the _panel lab_ itself; the three-axis tagging that powers re-grouping; a **Quick/Expert posture** split (the prompt's central tension) — now driven from the lab (`advanced` / `showMacros`) rather than an in-panel switch, which was pulled by request; **personality presets** that each re-skin the whole system in one press; **binding dots** for honesty; the **command-first layout** doubling as the header search.
- **Added** beyond the current builder: style-family (flat/soft/3D/glass), gray strategy, status families, focus-ring, motion, elevation, spacing scale, default-mode, component anatomy surfaced as first-class.
- **Cut / deferred**: the old stack-navigation IA (replaced by the lab's switchable layouts); a full editable semantic-token graph (needs a real data model — out of scope per the brief); real font application (typography is currently a stub).

## Known gaps / next (build order 4–6)

- **Breadth**: ~28 controls across all domains so the architecture is proven end-to-end; not yet the exhaustive taxonomy. Adding one is a single entry in `schema.tsx`.
- **Wire the stubs**: fonts, spacing, elevation, motion, focus ring — each becomes live by pointing a component at its `--ds-*` var.
- **Command palette** is a search-first _layout_ + header trigger today; a ⌘K modal overlay is the natural next step.
- **A known dev-only React warning** ("state update on a component that hasn't mounted") fires during rapid re-renders; functionality is unaffected — to be traced (likely the `replace:true` navigation cadence shared with the existing builder).
