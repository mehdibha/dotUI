# Open in Framer

> Summary line: **feasible with significant dotUI-side build work** · button type **plugin** · preset fidelity **full** · color fidelity **partial** (OKLCH ramps converted to hex/sRGB; out-of-gamut hues clip predictably via gamut mapping)

Framer uses React code components but has its own styling model: **no Tailwind, no CSS Modules, no CSS custom-property-based theming at build time**. The dotUI source stack (React Aria Components + tailwind-variants + OKLCH CSS vars) cannot run as-is in Framer. The realistic path is a **separate, purpose-built Framer code-component library** (re-implementing dotUI's visual layer in Framer's inline-style/MotionValue idiom) plus a **preset-driven token injection** step that writes the chosen OKLCH palette as hex/rgba CSS variables into Framer's Site Settings > Custom Code > `<head>`. This document is the full design for that path.

---

## 1. User experience

From the dotUI `/create` customizer — whose state lives in `?preset=<encoded>` on `www/src/routes/_app/create.tsx:12-16` — the user clicks **"Open in Framer"**. The realistic UX is:

1. Clicking the button opens the **Framer website** at a deep-link that loads the dotUI Framer package page (e.g. `https://framer.com/m/<package-id>`). Framer packages are published as npm-compatible code-component bundles; the deep link installs the package into the open Framer project.
2. In parallel (or via a secondary step) the user is shown a **"Copy theme CSS"** snippet — a `<style>` block containing their preset's hex tokens as CSS custom properties — which they paste into Framer's **Site Settings > Custom Code > Start of `<head>`**.
3. Framer reloads the canvas. All dotUI Framer components that reference `var(--accent-500)` etc. now reflect the chosen preset palette.
4. The user drags the **dotUI Showcase** page component (a pre-built Framer component mirroring `www/src/components/marketing/showcase/cards.tsx`) onto the canvas, or it is the default landing frame of the installed package. This is the "first view".

What the user lands in: a Framer project where (a) the dotUI component library is installed as a code-component package, (b) the palette matches their chosen preset (injected as CSS variables), and (c) the default canvas page contains the showcase layout.

Limitations vs the shadcn path: preset-driven **component style choices** (density, enum params like `card.style`, `loader.style`) are not automatically applied to the Framer components — those require separate variant properties exposed on the Framer component. The theme (color palette) is fully propagated; per-component param choices are propagated only if the Framer components expose matching Framer variant controls.

---

## 2. Technical mechanism

### 2a. Why the dotUI registry/RAC source is not reusable in Framer

Framer code components must be valid React components with **no build-time dependencies** on Tailwind CSS v4 (which processes class strings and `@plugin` directives), `tailwind-variants`, or the dotUI `createStyles`/`DesignSystemProvider` runtime (`www/src/modules/core/styles.tsx`). Specifically:

- `tailwind-variants` produces `className` strings that are meaningful only when Tailwind's generated stylesheet is present. Framer has no Tailwind runtime.
- OKLCH color values (`oklch(L C H)`) are embedded in CSS custom properties and consumed by Tailwind utility classes. Framer renders inline styles; CSS `var()` references work only if the property is declared in a `<style>` tag that Framer injects (via Custom Code) — not from a generated stylesheet.
- `react-aria-components` (RAC) uses `data-[state]` attributes that hook into `tailwindcss-react-aria-components`'s `@plugin` variants. Those variants are processed at Tailwind compile time and do not exist at runtime.
- The dotUI `DesignSystemProvider` writes CSS vars to `document.documentElement` via `useLayoutEffect` (`styles.tsx:106-117`). This can be replicated inside Framer's Custom Code, but the per-component param selections (enum/scalar) would need to be re-plumbed through Framer's property controls.

The conclusion: **a separate Framer component library is required**, written using inline styles or Framer-idiomatic CSS (`MotionValue`, `style` prop, CSS custom properties referenced via `var()` in inline style objects), and referencing the preset CSS variables that are injected via Custom Code.

### 2b. Framer code-component delivery

Framer supports **code components** distributed as npm packages. The recommended path for a reusable component library is:

1. Publish a package (e.g. `@dotui/framer`) to npm or a private registry.
2. Users install it in Framer via **Packages > Add package** → npm package name, or via a Framer-hosted deep link (`https://framer.com/m/<package-id>` if the package is submitted to the Framer Marketplace).
3. Components appear in the left panel under the package name and can be dragged onto the canvas.

Each component in `@dotui/framer` must:
- Reference CSS custom properties (`var(--accent-500)`, `var(--neutral-50)`, etc.) in its `style` props — these resolve against the injected `<style>` block.
- Expose **Framer Property Controls** (`addPropertyControls`, `ControlType`) for the equivalent of dotUI's enum params (e.g. `style: "default" | "tasnim"` for `card`, `thumb-style: "solid" | "outline" | "bar" | "faceted"` for `slider`).
- NOT import `tailwind-variants`, `react-aria-components`, or any Tailwind-dependent utility.

### 2c. Button type: plugin vs deep link vs copy-command

The "Open in Framer" button is best implemented as a **two-part action** on the dotUI `/create` page:

- Part 1: a **package deep link** (opens `https://framer.com/m/<package-id>` or a Framer-hosted page with an "Add to Project" button). Button type: `component-url` (an external URL the browser opens). No Framer plugin API is invoked.
- Part 2: a **copy-command** — a "Copy theme CSS" button that copies the preset's hex token block to the clipboard for pasting into Framer's Custom Code. This is the mechanism for preset color propagation (see section 3).

There is no Framer API that allows a third-party website to inject CSS or install packages programmatically. The split (deep link for components + clipboard copy for tokens) is the correct realistic mechanism.

---

## 3. Preset propagation

### 3a. The encoding source

The preset string is produced by `encodePreset(ds: DesignSystem): string | undefined` in `www/src/modules/create/preset/codec.ts:75`. The wire format is:

```
base64url( deflateRaw( JSON.stringify( DesignSystemState ), level=9 ) )
```

where `DesignSystemState` = `{ p?, t?, d?, c? }` (only fields differing from defaults). The color recipe lives in `c?: ColorConfig` — `{ algorithm, seeds: { neutral, accent, success, warning, danger, info }, knobs? }`.

### 3b. Decoding and resolving to hex

The dotUI server at `GET /r/init?preset=<encoded>` calls `resolveColorConfig(preset.color)` (`www/src/publisher/emit-theme.ts:156`), which invokes:

1. `resolveColorConfig` (`www/src/registry/theme/primitives.ts:67-108`) — calls `@dotui/colors`'s `createTheme` with the seeds/algorithm/knobs.
2. Returns `ResolvedPalettes { steps, light, dark }` where each palette is a `Record<step, oklch(L C H)>` string.

For Framer, the OKLCH values must be converted to hex. The conversion seam is `packages/colors/src/shared/color.ts`:
- `gamutMap(oklch): Oklch` — maps out-of-sRGB values into gamut (CSS Color 4 chroma reduction).
- `toSrgb(oklch): {r,g,b}` (channels 0..1).
- Hex: `#${[r,g,b].map(c => Math.round(c*255).toString(16).padStart(2,'0')).join('')}`.

There is no exported `toHex` function today; a new helper should be added to the `@dotui/colors` package (or to `packages/colors/src/shared/color.ts:54+`) and exported via the barrel at `packages/colors/src/index.ts:39`.

### 3c. The "Copy theme CSS" output

The dotUI server (or a new API route, see section 7) produces a CSS block:

```css
/* dotUI preset — generated from ?preset=<encoded> */
:root {
  --neutral-50: #fafafa;
  --neutral-100: #f4f4f5;
  /* ... 11 steps × 6 palettes = 66 vars */
  --accent-50: #eff6ff;
  --accent-500: #3b82f6;
  --accent-950: #172554;
  /* success, warning, danger, info palettes ... */

  /* Semantic aliases — constant across presets */
  --dotui-bg: var(--neutral-50);
  --dotui-accent: var(--accent-500);
  --dotui-radius-factor: 1;
  /* ... */
}
.dark {
  --neutral-50: #0a0a0a;
  /* reversed ramps ... */
}
```

The Framer components reference `var(--accent-500)` etc. directly. The `.dark` block works with Framer's dark-mode mechanism when the class `dark` is on `<html>` (Framer's dark mode toggle adds this class).

### 3d. Where density and component params land

Framer components that mirror dotUI's enum params expose those as **Framer Property Controls** (`ControlType.Enum`). The chosen preset value (`DesignSystem.componentParams["card"]["style"]`, decoded from the `p` field of `DesignSystemState`) is not injected as a CSS variable — it is a component-level prop. The "Copy theme CSS" step cannot propagate these. Options:

- The dotUI "Open in Framer" button generates a **preset summary JSON** that the user pastes into the Framer component's property panel (manual, not ideal).
- A Framer plugin (future) reads the preset URL from the clipboard and sets default property values on newly-placed instances.
- Document the gap clearly for the user: color fidelity is full; component variant fidelity is partial (manual).

---

## 4. Components installed

### 4a. What "installed" means in Framer

In Framer, components are not installed by running a CLI command. They come from a **code-component package** added via Packages. Once `@dotui/framer` is added to the project, all exported components are available in the left panel.

### 4b. Which dotUI components the Showcase needs

The `Cards` component (`www/src/components/marketing/showcase/cards.tsx:20-48`) consumes 37 registry UI items from `www/src/registry/ui/*/` (full list in the showcase internals map). The `@dotui/framer` package must include Framer-native reimplementations of at minimum:

accordion, avatar, badge, button, calendar, card, checkbox, checkbox-group, color-area, color-editor, color-field, color-slider, color-thumb, disclosure, drop-zone, field, file-trigger, group, input, kbd, link, list-box, loader, otp-field, popover, progress-bar, radio-group, select, separator, slider, switch, table, tabs, tag-group, text, text-field, time-field, toggle-button, toggle-button-group.

That is 39 components — a large but bounded set. Priority order for a first release: components used by the most showcase cards (button, card, input, field, avatar, separator, select, text-field, badge, list-box).

### 4c. Dependency mapping

The dotUI source components depend on:
- `react-aria-components` — **not available in Framer**. Replace with Framer's own interaction model (`useTap`, `useHover`) or basic browser event handlers. Accessibility (ARIA roles, focus management) must be rebuilt manually.
- `@base-ui/react/otp-field` (otp-field) — may work in Framer if it has no CSS module dependencies; test individually.
- `@internationalized/date` (calendar, booking) — pure JS, works in Framer.
- `lucide-react` — works in Framer (pure React SVG).
- `tailwind-variants` — NOT used in `@dotui/framer`. Replace with plain style objects or a variant utility that produces inline style maps.

### 4d. The `@dotui/framer` package structure

```
packages/framer/
  src/
    components/
      button.tsx
      card.tsx
      input.tsx
      # ... one file per component
    theme.ts          # exports resolvePresetTokens(encodedPreset) → hex CSS vars string
    showcase/
      cards.tsx       # the showcase grid, using @dotui/framer components
      booking.tsx
      # ... mirrors www/src/components/marketing/showcase/*.tsx
  package.json        # name: "@dotui/framer"; peerDeps: react, react-dom, lucide-react, @internationalized/date
```

---

## 5. Theme in globals.css

Framer has no `globals.css` file. The equivalent mechanism is **Site Settings > Custom Code > Start of `<head>`**, which accepts a raw HTML block including `<style>` tags. This is where the preset token block (section 3c) is injected.

The `@dotui/framer` components must therefore:

1. Reference only `var(--<palette>-<step>)` custom properties in their `style` props.
2. NOT hardcode colors inline.
3. Provide fallback values in case the Custom Code block is not present:
   ```tsx
   style={{ backgroundColor: 'var(--accent-500, #438cd6)' }}
   ```
   The fallback value `#438cd6` is the default `accent` seed from `DEFAULT_COLOR_CONFIG` (`www/src/registry/theme/color-config.ts:72-83`).

The semantic layer (`--color-bg`, `--color-accent`, etc. from `www/src/registry/base/theme.css`) can optionally be included in the injected `<style>` block as well, so Framer components can reference semantic names rather than primitive steps. This makes them more resilient to palette changes:

```css
:root {
  /* primitives — preset-specific */
  --neutral-50: #fafafa; /* ... */
  --accent-500: #3b82f6; /* ... */

  /* semantics — constant structure, resolved via primitives */
  --dotui-color-bg: var(--neutral-50);
  --dotui-color-accent: var(--accent-500);
  --dotui-color-fg: var(--neutral-950);
  --dotui-color-border: var(--neutral-200);
  /* ... mirroring www/src/registry/base/theme.css */
}
```

Note: use a `--dotui-` prefix for semantic aliases in the Framer layer to avoid colliding with any other CSS variable conventions in the user's Framer project.

---

## 6. The showcase as first view

### 6a. In the Framer package

The `@dotui/framer` package exports a top-level **`Showcase`** component (mirroring `www/src/components/marketing/showcase/cards.tsx`) that renders the same masonry grid:

```tsx
// packages/framer/src/showcase/cards.tsx
import { Booking } from "./booking";
import { TwoFactor } from "./two-factor";
// ... all 17 cards

export function Cards(props: React.CSSProperties & { className?: string }) {
  return (
    <div style={{
      columns: "4",
      gap: "1rem",
      // no Tailwind — explicit inline styles
      ...props
    }}>
      <Booking />
      <TwoFactor />
      {/* ... 17 cards in same order as cards.tsx:29-46 */}
    </div>
  );
}
```

The masonry layout (`columns-1 sm:columns-2 lg:columns-3 xl:columns-4` from `cards.tsx:25`) must be replicated with inline styles or a `@media`-query `<style>` block — no Tailwind.

### 6b. The "first view" guarantee

When the user clicks "Open in Framer" via the package deep link:
- The package installs into the open Framer project.
- The `@dotui/framer` package's **featured/default component** (set in the Framer Marketplace manifest) is `Cards` — the showcase grid.
- The user drags `Cards` onto the canvas, or it is placed on a starter template page.

There is no Framer API to automatically create a page and place components on it when a package is installed. The closest mechanism is a **Framer Template** (a `.framer` file exported from the Framer desktop app) that has the showcase pre-placed. The "Open in Framer" button could link to `https://framer.com/projects/new?template=<template-id>` which opens a new project from the template — but that template would contain a snapshot of the default preset, not the user's chosen one.

Best realistic approach:
1. The package deep link installs the code-component package.
2. A starter template `.framer` file is published with the `Cards` component pre-placed and CSS variable references in place.
3. The user pastes their Custom Code theme block from the "Copy theme CSS" step.
4. Document this 3-step flow explicitly in the UI.

---

## 7. What dotUI must build

### 7a. New server endpoint: `GET /r/framer-theme?preset=<encoded>`

Returns a CSS text string (not a shadcn JSON item) — the full hex token block for injection into Framer Custom Code.

Location: `www/src/routes/r/framer-theme.tsx` (new TanStack Start server GET handler).

```ts
// www/src/routes/r/framer-theme.tsx (pseudocode)
import { decodePreset } from "@/modules/create/preset/codec";
import { resolveColorConfig } from "@/registry/theme";
import { gamutMap, toSrgb } from "@dotui/colors";
import { PALETTE_ORDER } from "@/registry/theme/palettes";

export const ServerRoute = createServerFileRoute("/r/framer-theme").methods({
  GET: async ({ request }) => {
    const url = new URL(request.url);
    const encoded = url.searchParams.get("preset") ?? "";
    const ds = encoded ? decodePreset(encoded) : null;
    const color = ds?.color ?? undefined;

    let lightVars: Record<string, string> = {};
    let darkVars: Record<string, string> = {};

    if (color) {
      const resolved = resolveColorConfig(color);
      // resolved.light and resolved.dark are Record<palette, Record<step, oklchString>>
      lightVars = rampsToHex(resolved.light);
      darkVars  = rampsToHex(resolved.dark);
    } else {
      // fall back to static base/colors.css vars (default palette)
      // read from baseRegistryCss or a cached import of @/registry/__generated__/base-css
    }

    const css = buildFramerCssBlock(lightVars, darkVars);
    return new Response(css, {
      headers: {
        "Content-Type": "text/css",
        "Cache-Control": "public, max-age=60, s-maxage=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  },
});
```

`rampsToHex` converts each OKLCH string to hex:

```ts
function oklchToHex(oklchStr: string): string {
  const oklch = toOklch(oklchStr);        // packages/colors/src/shared/color.ts:36
  const mapped = gamutMap(oklch);         // color.ts:48
  const { r, g, b } = toSrgb(mapped);    // color.ts:42
  return "#" + [r, g, b]
    .map(c => Math.round(c * 255).toString(16).padStart(2, "0"))
    .join("");
}
```

### 7b. New `toHex` helper in `@dotui/colors`

Add to `packages/colors/src/shared/color.ts` (after `oklchCss` at line ~54):

```ts
/** Convert any CSS color string to a gamut-mapped sRGB hex string (#rrggbb). */
export function toHex(input: string): string {
  const mapped = gamutMap(toOklch(input));
  const { r, g, b } = toSrgb(mapped);
  return "#" + [r, g, b].map(c => Math.round(c * 255).toString(16).padStart(2, "0")).join("");
}
```

Export via `packages/colors/src/index.ts:39+`.

### 7c. New "Open in Framer" button on `/create`

In `www/src/modules/create/install-command.tsx` (or a new `open-in-framer.tsx` component):

```tsx
// Derives encoded preset from useDesignSystem()
const framerThemeUrl = `https://dotui.com/r/framer-theme?preset=${encodedPreset ?? ""}`;
const packageDeepLink = `https://framer.com/m/<package-id>`;

// Two-part UI:
// 1. "Open in Framer" → opens packageDeepLink
// 2. "Copy theme CSS" → fetches framerThemeUrl and writes to clipboard
```

### 7d. New `packages/framer/` workspace package

Structure described in section 4d. Key constraints:
- Zero Tailwind imports.
- Zero `react-aria-components` imports. Use native HTML semantics + ARIA attributes.
- Style via inline `style={{ color: 'var(--accent-500, #438cd6)' }}` — CSS custom property with hex fallback.
- Expose Framer Property Controls for each dotUI enum param (`ControlType.Enum`).
- Export `Cards` (the showcase) as the default/featured component.

### 7e. New `figma`-style field on `meta.ts` for Framer mapping (optional)

A `framer?: { componentId?: string; variants?: Record<string, string[]> }` field can be added to `RegistryItem` in `www/src/registry/types.ts:69-78` — one line addition — to carry Framer-specific metadata (e.g. the Framer Marketplace component ID for deep linking to a specific component). This is inert in the registry build (`registry-build.ts` spreads `{ ...rest }` in `metaForRuntime` at `build-publishables.ts:334`).

---

## 8. Schema / meta.ts changes

### 8a. `RegistryItem` extension (optional)

```ts
// www/src/registry/types.ts
export type RegistryItem = ShadcnRegistryItem & {
  group?: ComponentGroup | null;
  params?: Record<string, ParamDef>;
  framer?: {
    /** Framer Marketplace component ID for deep-linking. */
    componentId?: string;
    /** Maps dotUI enum param values to Framer variant names if they differ. */
    variantMap?: Record<string, Record<string, string>>;
  };
};
```

This is a single-line addition, safe to add as it is inert in the build. It does not affect the emitted shadcn registry JSON (`publish.ts` drops unknown fields relative to the shadcn item schema).

### 8b. No change to the codec

The preset encoding/decoding in `www/src/modules/create/preset/codec.ts` is unchanged. The Framer theme endpoint decodes the same `?preset=<encoded>` string that every other `/r/*` endpoint uses.

### 8c. No change to `/r/init` or `/r/$name`

Those routes continue to serve the shadcn registry. The `/r/framer-theme` route is additive.

---

## 9. Limitations, risks, fallbacks

### 9a. OKLCH → hex is lossy at wide-gamut hues

The kernel (`packages/colors/src/producers/oklch.ts`) generates ramps that may include out-of-sRGB-gamut values at vivid mid-tones. `gamutMap` in `packages/colors/src/shared/color.ts:48` applies CSS Color 4 chroma reduction before converting to hex, so the result is the closest in-gamut color. For neutral and muted palettes the loss is imperceptible; for vivid `accent` colors at steps 400–600 it may be visible. Document this in the UI.

### 9b. No automatic showcase placement

Framer has no API for a third-party site to create pages or place components. The showcase-as-first-view is achieved only via a pre-published Framer template. If the user starts from a blank project, they must drag `Cards` manually.

### 9c. RAC accessibility features are lost

React Aria Components (`react-aria-components`) provides keyboard navigation, focus management, and ARIA role wiring. The Framer reimplementations in `@dotui/framer` will have basic keyboard and ARIA support at best. Not a blocker for the showcase demo use case but important to document for production use.

### 9d. Component parity maintenance burden

Every time a dotUI component (`www/src/registry/ui/*/base.tsx`) is updated, the corresponding `@dotui/framer` component must be manually updated. This is a significant ongoing maintenance cost. Consider automating a "style diff" check as part of CI.

### 9e. Framer package publishing gating

Submitting to the Framer Marketplace requires approval. During development, the deep-link mechanism is `https://framer.com/m/<package-id>` which requires a published (even draft) Framer package. The fallback during development is to distribute `@dotui/framer` as an npm package and document the manual import path in Framer.

### 9f. Custom Code persistence

Framer's Custom Code block is per-project. If the user changes their dotUI preset, they must repeat the "Copy theme CSS" and re-paste step. There is no webhook or live sync mechanism. Acknowledge this limitation in the UI copy.

### 9g. Density and component params are not auto-applied

As noted in section 3d, the `componentParams` from the preset (e.g. `card.style = "tasnim"`, `loader.style = "ring"`) cannot be automatically applied to Framer component instances. They must be set manually via property controls. Fallback: provide a preset summary panel in the "Open in Framer" flow that lists "Your chosen options: card style = tasnim, loader = ring, …" so the user can replicate them manually.

---

## 10. Step-by-step implementation checklist

**Phase 0: Infrastructure**

- [ ] Add `toHex(input: string): string` to `packages/colors/src/shared/color.ts` (after `oklchCss` at line ~54) using `gamutMap` + `toSrgb`.
- [ ] Export `toHex` via `packages/colors/src/index.ts`.
- [ ] Add `framer?: { componentId?: string; variantMap?: ... }` to `RegistryItem` in `www/src/registry/types.ts:69`.

**Phase 1: Server endpoint**

- [ ] Create `www/src/routes/r/framer-theme.tsx` — TanStack Start GET handler that accepts `?preset=<encoded>`, calls `decodePreset` (same pattern as `www/src/routes/r/init.tsx:47-58`), calls `resolveColorConfig`, converts ramps to hex via `toHex`, and returns a CSS string.
- [ ] For the default preset (no `?preset` param), serve the static ramps from `www/src/registry/__generated__/base-css.ts`'s `:root`/`.dark` entries converted to hex.
- [ ] Add cache headers matching the pattern in `www/src/routes/r/$name.tsx:27-30`.
- [ ] Add a `GET /r/framer-tokens.json?preset=<encoded>` variant returning the same data as JSON (`{ light: {}, dark: {} }`) for programmatic consumption.

**Phase 2: `@dotui/framer` package skeleton**

- [ ] Create `packages/framer/` workspace package with `package.json` (`name: "@dotui/framer"`, `peerDependencies: { react, react-dom }`).
- [ ] Implement a `theme.ts` exporting `resolvePresetTokensToHex(encodedPreset: string): Promise<{ light: Record<string,string>, dark: Record<string,string> }>` that fetches `/r/framer-tokens.json?preset=…` (or re-implements conversion locally via `@dotui/colors`).
- [ ] Implement the 10 highest-priority components (button, card, input, field, avatar, separator, select, text-field, badge, list-box) using inline styles and `var(--<palette>-<step>, <hex-fallback>)`.
- [ ] For each component with dotUI enum params, expose a `ControlType.Enum` Framer property control.
- [ ] Implement the `Cards` showcase grid component in `packages/framer/src/showcase/cards.tsx` using the above components, mirroring `www/src/components/marketing/showcase/cards.tsx:20-48`.
- [ ] Implement remaining showcase card components iteratively until all 17 cards render.

**Phase 3: Framer package publishing**

- [ ] Publish `@dotui/framer` to npm.
- [ ] Submit to Framer Marketplace (or use a Framer Community file with code-component imports).
- [ ] Obtain the Framer deep-link URL (`https://framer.com/m/<package-id>`).

**Phase 4: dotUI UI integration**

- [ ] Add "Open in Framer" button to the `/create` page (near the existing install command in `www/src/modules/create/install-command.tsx`).
  - Sub-button 1: "Open in Framer" → `window.open(framerDeepLink)`.
  - Sub-button 2: "Copy theme CSS" → `fetch('/r/framer-theme?preset=...')` then `navigator.clipboard.writeText(css)`.
- [ ] Show a callout explaining the 3-step flow: (1) install package, (2) paste theme CSS into Site Settings, (3) drag `Cards` onto canvas.
- [ ] Optionally show a collapsible "Your preset summary" listing the non-default `componentParams` values the user must apply manually.

**Phase 5: Template (optional, for first-view guarantee)**

- [ ] Create a Framer template `.framer` file with the `Cards` component pre-placed and CSS variable references in place.
- [ ] Publish the template to the Framer Marketplace or as a remixable Community file.
- [ ] Update the "Open in Framer" button to point to `https://framer.com/projects/new?template=<template-id>` instead of (or in addition to) the package deep link.

**Phase 6: Documentation and gaps**

- [ ] Document OKLCH→hex color loss at vivid hues.
- [ ] Document that density and component params are not auto-applied and must be set manually.
- [ ] Document the Custom Code re-paste requirement when the preset changes.

---

## Sources

- dotUI preset codec: `www/src/modules/create/preset/codec.ts:75-126`
- dotUI preset types: `www/src/modules/create/preset/types.ts:14-41`
- dotUI color resolution: `www/src/registry/theme/primitives.ts:67-108`
- OKLCH→sRGB conversion seam: `packages/colors/src/shared/color.ts:36-81`
- Init item assembly (template for `/r/framer-theme`): `www/src/publisher/emit-theme.ts:71-128`
- Registry item type (for `framer?` field): `www/src/registry/types.ts:69-78`
- Showcase component list: `www/src/components/marketing/showcase/cards.tsx:20-48`
- Framer code components documentation: https://www.framer.com/developers/code-components/introduction
- Framer Property Controls: https://www.framer.com/developers/code-components/property-controls
- Framer Marketplace publishing: https://www.framer.com/marketplace/
- Framer Custom Code (Site Settings): https://www.framer.com/academy/lessons/custom-code
- CSS Color 4 gamut mapping (used by `gamutMap`): https://www.w3.org/TR/css-color-4/#css-gamut-mapping
