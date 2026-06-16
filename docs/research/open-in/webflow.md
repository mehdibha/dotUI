# Open in Webflow

> Token-export only — not a React/Tailwind target · button type **copy-command** · preset fidelity **partial** (tokens only; component classes not applicable) · color fidelity **partial** (OKLCH values exported; Webflow Designer does not parse OKLCH natively)

---

## 1. User experience

The user is on `https://dotui.com/create` with a custom preset active (e.g. a teal accent, compact density, card style "tasnim"). They click **"Copy for Webflow"**.

What they should land in:

1. A modal (or fly-out panel) appears showing a ready-to-paste CSS block — the user's **preset color tokens** expressed as a `:root { … }` rule containing every `--<palette>-<step>` primitive and every `--color-*` semantic var, all computed to static `oklch(…)` values from the chosen preset.
2. The user copies the block, opens **Webflow Site Settings → Custom Code → Head Code**, pastes it, and saves.
3. Their Webflow site now has the dotUI OKLCH ramps available as CSS custom properties. Any raw HTML embed, Custom Code block, or Webflow CMS-driven element can reference them via `var(--color-accent)`, `var(--neutral-300)`, etc.
4. A secondary **"Copy Tailwind theme"** option exports a JSON/CSS snippet for designers who also use a local Tailwind build alongside Webflow (e.g. via Webflow's Code Embed for components).

What they do NOT get: React components installed under `ui/`, shadcn-style imports, `globals.css` written into a Next.js project, or any live component code. Webflow does not execute npm installs; its Designer works with visual blocks, not source files.

**The button is therefore `copy-command` (copy-to-clipboard), not `repo-import`, `sandbox-define`, or `mcp-install`.**

---

## 2. Technical mechanism

Webflow is a **visual website builder** with a proprietary runtime. It is not a React or Tailwind project. Its architecture differs from every other "Open in" target in this repo:

- No Node.js environment at design time — there is no npm, no shadcn CLI, no `pnpm add`.
- The Designer generates CSS and HTML from its own visual model; it does not parse a `globals.css`.
- **DevLink** (Webflow's React export) goes in the opposite direction: Webflow Designer → React components. It cannot import dotUI components.
- **Webflow Code Components** (currently in beta/limited access) allow embedding custom React components via a proprietary Webflow CLI, but they require a Webflow-managed hosting environment and are not equivalent to `shadcn add`.
- Pasting a `:root { --neutral-50: oklch(…); … }` block into **Site Settings → Custom Code → Head Code** is the one universally supported path. It applies at runtime to every page and overrides nothing Webflow generates — it only adds new custom properties that Webflow's built-in color system ignores.

OKLCH support in browsers is universal as of 2023 (Chrome 111+, Safari 15.4+, Firefox 113+). Webflow's *Designer* preview may not render OKLCH swatches in its native swatch palette, but the published site renders them correctly.

---

## 3. Preset propagation

Preset propagation for Webflow bypasses the shadcn machinery entirely and goes directly through the color kernel.

### The preset encode/decode contract (summary)

The `?preset=` query parameter carried on `https://dotui.com/create?preset=<encoded>` is a URL-safe base64 of raw-DEFLATE (pako level 9) of `JSON.stringify(DesignSystemState)` — see `www/src/modules/create/preset/codec.ts:75-126`. The compact state shape:

```ts
// DesignSystemState — www/src/modules/create/preset/types.ts:14-19
{ p?: Record<string, Record<string, string>>;  // componentParams diff vs DEFAULTS
  t?: Record<string, string>;                   // tokens diff
  d?: Density;                                  // only if !== "compact"
  c?: ColorConfig;                              // full color recipe if !== DEFAULT_COLOR_CONFIG
}
```

For Webflow, only `c` (ColorConfig) matters — the color seeds and algorithm. The `p` (component params) and `d` (density) fields affect React component class strings and are meaningless to Webflow's Designer.

### Extracting the color ramps for Webflow

The server-side path already exists at `GET /r/init?preset=<encoded>` (`www/src/routes/r/init.tsx`). That endpoint calls `emitInitItem({ baseRegistryCss, preset, encodedPreset, registryRoot })` (`www/src/publisher/emit-theme.ts:71-128`), which:

1. Calls `resolveColorConfig(preset.color)` (`www/src/registry/theme/primitives.ts:67-108`) — runs the chosen algorithm (default `oklch`) over the seed hex values.
2. Calls `rampsToVars(resolved.light)` and `rampsToVars(resolved.dark)` (`emit-theme.ts:134-143`) to produce two flat maps of `--<palette>-<step> → "oklch(L C H)"` strings.
3. Writes them into `css[":root"]` and `css[".dark"]` of the `registry:base` item.

For a new Webflow-export endpoint, the dotUI team should **add a dedicated server route** (e.g. `GET /r/webflow-export?preset=<encoded>`) that reuses the same kernel path and returns a raw CSS string instead of shadcn JSON:

```ts
// www/src/routes/r/webflow-export.tsx  (new file)
import { decodePreset } from "@/modules/create/preset/codec";
import { resolveColorConfig } from "@/registry/theme";

export const ServerRoute = createServerFileRoute("/r/webflow-export").methods({
  GET: async ({ request }) => {
    const url = new URL(request.url);
    const encoded = url.searchParams.get("preset") ?? undefined;
    const preset = encoded ? decodePreset(encoded) : undefined;

    let lightVars: Record<string, string>;
    let darkVars:  Record<string, string>;

    if (preset?.color) {
      const resolved = resolveColorConfig(preset.color);
      // rampsToVars is not currently exported; inline equivalent:
      lightVars = Object.fromEntries(
        resolved.steps.flatMap(step =>
          Object.keys(resolved.light).map(palette => [
            `--${palette}-${step}`,
            resolved.light[palette][step]
          ])
        )
      );
      darkVars = Object.fromEntries(/* reversed ramps, same pattern */);
    } else {
      // fall back to static default ramps from base-css.ts
      // import { baseRegistryCss } from "@/registry/__generated__/base-css";
      lightVars = baseRegistryCss.css[":root"];
      darkVars  = baseRegistryCss.css[".dark"];
    }

    const block = buildWebflowCssBlock(lightVars, darkVars);
    return new Response(block, {
      headers: { "Content-Type": "text/css", "Cache-Control": "public, max-age=60, s-maxage=3600" }
    });
  }
});
```

`rampsToVars` is internal to `emit-theme.ts` — it iterates `resolved.light[palette][step]` pairs. The Webflow endpoint can duplicate that four-line loop rather than exporting it.

### The `:root` / `.dark` block shape

```css
/* Generated by dotUI — preset: <encoded> */
/* Paste into Webflow: Site Settings → Custom Code → Head Code  */

:root {
  --neutral-50:  oklch(0.985 0 0);
  --neutral-100: oklch(0.960 0.003 247.86);
  /* …66 primitive vars total (6 palettes × 11 steps) … */
  --accent-500:  oklch(0.596 0.152 237.18);
  /* … */

  /* Semantic layer (constant across presets — maps palette steps to role names) */
  --color-bg:              var(--neutral-50);
  --color-fg:              var(--neutral-950);
  --color-accent:          var(--accent-500);
  --color-border:          var(--neutral-200);
  /* … full DEFAULT_SEMANTICS from www/src/registry/theme/semantics.ts:36-124 … */
}

@media (prefers-color-scheme: dark) {
  :root {
    --neutral-50:  oklch(0.13 0 0);   /* reversed ramp */
    /* … */
  }
}

/* Class-based dark mode (mirrors dotUI's @custom-variant dark (&:is(.dark *)) ) */
.dark {
  --neutral-50:  oklch(0.13 0 0);
  /* … */
}
```

The semantic layer (`--color-bg`, `--color-fg`, `--color-accent`, etc.) comes from `DEFAULT_SEMANTICS` in `www/src/registry/theme/semantics.ts:36-124` and is constant — it does not change with the preset. Include it in the export so Webflow elements can use role-based names rather than raw step numbers.

The `--on-*` foreground vars (e.g. `--on-accent-500`) are **not emitted by the init pipeline** — they are derived by the `tailwindcss-autocontrast` plugin at Tailwind-compile time. For Webflow, include them statically by computing black/white via the same `onBlackWhite` logic (`packages/colors/src/shared/on-color.ts:88-97`) inside the export endpoint:

```ts
// For each palette step, determine whether black or white has higher WCAG contrast
import { onBlackWhite } from "@dotui/colors/shared/on-color";

// resolved.light[palette][step] is an oklch string
const onVars: Record<string, string> =
  Object.entries(lightVars)
    .filter(([k]) => k.match(/^--(neutral|accent|success|warning|danger|info)-\d+$/))
    .reduce((acc, [k, v]) => {
      acc[`--on-${k.slice(2)}`] = onBlackWhite(v);  // returns "black" or "white"
      return acc;
    }, {} as Record<string, string>);
```

This mirrors the plugin's `getContrastColor` exactly (parity test: `www/src/registry/theme/on-color-parity.test.ts`).

---

## 4. Components installed

**None.** This is the central limitation of the Webflow target.

Webflow is not a React project. There is no `ui/` folder, no `shadcn add`, no `components.json`. The dotUI registry exports — powered by `GET /r/$name?preset=<encoded>` (`www/src/routes/r/$name.tsx`) — produce TypeScript source files containing `tailwind-variants` configs and React Aria Components usage. None of that is usable in Webflow's Designer.

The gap is architectural, not a missing feature:

| dotUI publish step | Applicable to Webflow? |
|---|---|
| `flatten.ts` — density + enum param → tv class strings | No — tv requires a React build |
| `resolve-classes.ts` — scalar params → Tailwind suffix rewrite | No — no Tailwind build in Webflow |
| `serialize.ts` — tv config → TS literal | No |
| `emit-theme.ts` — OKLCH ramps → `:root` CSS vars | **Yes — this is the Webflow path** |
| `config.registries["@dotui"]` — preset-bound per-component URL | Not applicable |

The closest Webflow analog would be Webflow's **Code Components** (beta), which embed arbitrary React components as iframes inside the Designer. However, Code Components require a Webflow organization plan, the Webflow CLI, and a Webflow-hosted build server — they are not equivalent to simply installing files from a registry. If/when Code Components are stable and accessible, the bolt.new or StackBlitz patterns (a pre-built Vite bundle) could be adapted.

**Realistic recommendation:** Document the component gap explicitly in the Webflow export UI. The copy block installs the design tokens; it does not install components.

---

## 5. Theme in globals.css

There is no `globals.css` in a Webflow project. The analog is the **Head Code** block in Site Settings, which injects a `<style>` tag into every page's `<head>`.

The CSS block described in §3 — the `:root` rule with OKLCH primitive ramps + semantic layer + `--on-*` vars — replaces what `shadcn add https://dotui.com/r/init?preset=<encoded>` would write into `globals.css` for a React project.

**Limitations compared to a full `globals.css`:**

| globals.css feature | Webflow Head Code equivalent |
|---|---|
| `@import "tailwindcss"` | Not applicable |
| `@plugin "tailwindcss-react-aria-components"` | Not applicable |
| `@plugin "tailwindcss-autocontrast"` | Replaced by static `--on-*` vars computed server-side |
| `@utility focus-ring { … }` | Not applicable — Webflow has its own focus handling |
| `@theme inline { --radius-md: calc(…); --color-bg: var(…); }` | Replace with plain `:root` vars (no `@theme`; browsers don't parse `@theme inline`) |
| `@layer base { body { @apply bg-bg text-fg } }` | Not applicable — use Webflow's Body style |
| `--dotui-density` var | Not applicable — no tv to read it |

The `@theme inline` block must be flattened to plain `:root` custom property declarations for Webflow. The mapping is straightforward:

```css
/* @theme inline equivalent for Webflow */
:root {
  --radius-xs:  calc(0.125rem * var(--radius-factor, 1));
  --radius-sm:  calc(0.25rem  * var(--radius-factor, 1));
  --radius-md:  calc(0.375rem * var(--radius-factor, 1));
  --radius-lg:  calc(0.5rem   * var(--radius-factor, 1));
  --radius-xl:  calc(0.75rem  * var(--radius-factor, 1));
  --radius-2xl: calc(1rem     * var(--radius-factor, 1));
  --radius-full: 9999px;
  /* --color-bg, --color-fg, etc. from DEFAULT_SEMANTICS */
}
```

The semantic layer is sourced from `DEFAULT_SEMANTICS` at `www/src/registry/theme/semantics.ts:36-124` and is constant across presets.

---

## 6. The showcase as first view

The dotUI showcase (`www/src/components/marketing/showcase/cards.tsx`) is a React component tree that requires:

- React 18+
- react-aria-components (`@base-ui/react` for `otp-field`)
- tailwind-variants
- Tailwind CSS v4 (`@theme inline`, utility classes, RAC data-attribute variants)
- `tailwindcss-react-aria-components` plugin
- `tailwindcss-autocontrast` plugin
- Specific providers: `DesignSystemProvider`, a dark-mode class toggle

None of these exist in Webflow's native runtime.

**The showcase cannot be the first view in Webflow Designer.** Webflow renders its own visual blocks; it does not render arbitrary React component trees as pages.

**Best available workaround — an iframe embed:**

1. Deploy the dotUI showcase as a standalone static site (Vite build) with the user's preset baked into its `globals.css`. This is identical to the bolt.new/StackBlitz payload: a `src/App.tsx` that renders `<Cards />` wrapped in minimal providers.
2. Deploy that build to a public URL (e.g. a Vercel preview URL generated per-preset, or a static CDN path keyed by the encoded preset string).
3. The Webflow export block includes an optional `<iframe>` snippet the user can paste into a Webflow **HTML Embed** element:

```html
<!-- Paste into a Webflow HTML Embed element -->
<iframe
  src="https://dotui.com/preview/showcase?preset=<encoded>"
  style="width:100%;height:100vh;border:none;"
  title="dotUI showcase preview"
></iframe>
```

The `GET /preview/showcase?preset=<encoded>` route would serve a server-rendered or pre-built HTML page of `<Cards />` with the preset's ramps inline. This requires a new server route in `www/src/routes/preview/showcase.tsx` — see §7.

This is a preview only, not a working Webflow page. The tokens in the Head Code block (§3) do not affect the iframe; the iframe carries its own styles.

---

## 7. What dotUI must build

### 7.1 New server endpoint: `GET /r/webflow-export?preset=<encoded>`

File: `www/src/routes/r/webflow-export.tsx`

Responsibilities:
- Decode `?preset=` via `decodePreset` (`www/src/modules/create/preset/codec.ts:111`).
- If `preset.color` is set: call `resolveColorConfig(preset.color)` (`www/src/registry/theme/primitives.ts:67`); iterate `resolved.steps`, `resolved.light[palette]`, `resolved.dark[palette]` to build `lightVars` and `darkVars` maps.
- If no preset color: fall back to the static `baseRegistryCss.css[":root"]` and `baseRegistryCss.css[".dark"]` from `www/src/registry/__generated__/base-css.ts`.
- Compute `--on-*` vars using `onBlackWhite` from `packages/colors/src/shared/on-color.ts:88-97`.
- Append the semantic layer from `DEFAULT_SEMANTICS` (`www/src/registry/theme/semantics.ts:36-124`) as plain `:root` vars (not `@theme inline`).
- Append the radius scale as plain `:root` `calc()` vars (no `@theme`).
- Return `Content-Type: text/css` with standard cache headers (`public, max-age=60, s-maxage=3600, stale-while-revalidate=86400`).

### 7.2 UI: "Copy for Webflow" button on `/create`

Location: `www/src/modules/create/` — alongside the existing install command UI (`www/src/modules/create/install-command.tsx:39-48`).

Behavior:
1. Read the current encoded preset from `useDesignSystem()` (`www/src/modules/create/preset/use-design-system.ts:18`).
2. Fetch `GET /r/webflow-export?preset=<encoded>` (or generate the CSS block client-side using the same kernel — see §7.3).
3. Write the CSS string to the clipboard via `navigator.clipboard.writeText(css)`.
4. Show a toast confirming the copy.

### 7.3 (Optional) Client-side generation

The color kernel (`@dotui/colors`) is a pure JS package with no Node.js dependencies. The Webflow CSS block could be generated entirely on the client in the `/create` page:

```ts
import { createTheme } from "@dotui/colors";
import { resolveColorConfig } from "@/registry/theme";

const resolved = resolveColorConfig(designSystem.color ?? DEFAULT_COLOR_CONFIG);
// build lightVars, darkVars, onVars from resolved — same as §3
// build semanticVars from DEFAULT_SEMANTICS
// serialize to a CSS string
```

This avoids a network round-trip and works offline. The tradeoff is that `@dotui/colors` bundle cost is paid in the `/create` page bundle (it is already imported there for the live preview, so no net addition).

### 7.4 (Optional) Showcase preview route

File: `www/src/routes/preview/showcase.tsx`

A server-rendered page that:
- Decodes `?preset=`.
- Inlines the computed CSS ramps in a `<style>` tag in `<head>`.
- Renders `<Cards />` with appropriate providers.
- Can be embedded as an iframe in Webflow.

This reuses `www/src/components/marketing/showcase/cards.tsx` directly. No new component files needed.

---

## 8. Schema / meta.ts changes

No changes to `www/src/registry/types.ts` or any `ui/*/meta.ts` are required for the Webflow feature.

The Webflow export reads from:
- The preset codec (`codec.ts`) — no changes.
- The color kernel (`primitives.ts`, `palettes.ts`) — no changes.
- The semantics layer (`semantics.ts`) — read-only, no changes.
- `baseRegistryCss` (`__generated__/base-css.ts`) — read-only, no changes.
- `onBlackWhite` (`on-color.ts`) — read-only, no changes.

The `RegistryItem` type extension pattern (described in `meta.md §3`) would only be needed if the Webflow export URL were tracked per component (e.g. a `webflow?: string` field on each `meta.ts`). That is not needed for a token-only export.

If a future "Webflow Code Components" path is pursued, a `webflowComponentId?: string` field could be added as a single line in `www/src/registry/types.ts:69-78` — it would auto-propagate through `metaForRuntime`'s spread (`www/src/publisher/build-time/build-publishables.ts:334`).

---

## 9. Limitations, risks, fallbacks

### L1 — OKLCH not visible in Webflow Designer color swatches
Webflow Designer does not parse OKLCH for its native swatch panel. Colors defined in Head Code as `--neutral-500: oklch(…)` are valid CSS and render correctly in the published site, but the Designer's color picker will not show them as swatches.

**Fallback:** Add an OKLCH → hex conversion step to the export. `gamutMap` + `toSrgb` from `packages/colors/src/shared/color.ts:42-48` converts any OKLCH primitive to a hex value. The export block could include a second `:root` rule with `--neutral-500-hex: #6b7280;` alongside the OKLCH value, giving the Designer a usable swatch while keeping the OKLCH value for runtime use.

### L2 — No component parity
The 37 showcase components (accordion, avatar, badge, button, calendar, card, checkbox, color-area, color-editor, color-field, color-slider, color-thumb, disclosure, drop-zone, field, file-trigger, group, input, kbd, link, list-box, loader, otp-field, popover, progress-bar, radio-group, select, separator, slider, switch, table, tabs, tag-group, text, text-field, time-field, toggle-button, toggle-button-group — and their transitive deps) cannot be installed in Webflow. The OKLCH tokens are available but not the React component implementations.

**No full workaround exists.** A designer using Webflow must re-implement components visually in the Webflow Designer using the token values as raw CSS custom properties.

### L3 — Density and component params have no effect
The `p` (componentParams) and `d` (density) fields of the preset encode component-level class string decisions (via `flatten.ts` and `resolve-classes.ts`). These are Tailwind-variants concerns — they have no mapping to Webflow's visual model.

**Fallback:** Strip these from the Webflow export silently. Document in the UI that "component customizations apply to React projects only."

### L4 — `tailwindcss-autocontrast` plugin is not available
The `--on-*` foreground vars are normally computed at Tailwind-compile time by `packages/tailwindcss-autocontrast/src/index.js`. They are never emitted by the init pipeline (`emit-theme.ts:152-159`).

**Mitigation:** The Webflow export endpoint must compute them statically using `onBlackWhite` (see §3). This is safe — the parity test at `www/src/registry/theme/on-color-parity.test.ts` confirms `onBlackWhite` produces the same output as the plugin's `getContrastColor`.

### L5 — `tokens` field not wired
The `t` / `tokens` field of `DesignSystemState` (global CSS vars like `--radius-factor: 1.25`) is not yet threaded into the publisher output — there is an explicit TODO at `www/src/publisher/emit-theme.ts:62-68` and `PublishPreset` (`www/src/publisher/types.ts:79-85`) does not carry `tokens`. This means a user who has adjusted `--radius-factor` via the customizer will not see that change reflected in any export, including the Webflow block.

**Fallback:** Read `tokens` directly from `DesignSystem` (not `PublishPreset`) in the Webflow export endpoint, since the endpoint bypasses the publisher pipeline.

### L6 — Cache keying
The existing `/r/$name` route uses `public, max-age=60, s-maxage=3600, stale-while-revalidate=86400` headers and the encoded preset is part of the URL query string so the CDN keys on it. The new `/r/webflow-export` route should use identical headers.

---

## 10. Step-by-step implementation checklist

### Phase 1 — Backend endpoint (1–2 days)

- [ ] Create `www/src/routes/r/webflow-export.tsx` as a TanStack Start server GET handler.
- [ ] Import `decodePreset` from `@/modules/create/preset/codec`, `resolveColorConfig` from `@/registry/theme`, `onBlackWhite` from `packages/colors/src/shared/on-color`, `DEFAULT_SEMANTICS` from `@/registry/theme/semantics`, `baseRegistryCss` from `@/registry/__generated__/base-css`.
- [ ] Implement the ramp resolution: if `preset.color` present → `resolveColorConfig`; else → `baseRegistryCss.css[":root"]` / `baseRegistryCss.css[".dark"]`.
- [ ] Implement `--on-*` computation via `onBlackWhite` over every `--<palette>-<step>` key.
- [ ] Read `tokens` from the decoded `DesignSystem` (not `PublishPreset`) and include any non-default entries in the `:root` block (workaround for L5).
- [ ] Serialize the radius scale as plain `:root` `calc(var(--radius-factor, 1) * …rem)` declarations (no `@theme`).
- [ ] Serialize `DEFAULT_SEMANTICS` as plain `:root` `var(--<palette>-<step>)` declarations.
- [ ] Write the `.dark` / `@media (prefers-color-scheme: dark)` blocks for the reversed ramps.
- [ ] Add cache headers: `public, max-age=60, s-maxage=3600, stale-while-revalidate=86400`.
- [ ] Add a `Content-Disposition: inline; filename="dotui-tokens.css"` header.
- [ ] Write a unit test: default preset → output matches static `base-css.ts` ramps; custom preset → output differs only in `--accent-*` values.

### Phase 2 — UI button on `/create` (half day)

- [ ] In `www/src/modules/create/` add a `webflow-export-button.tsx` component (or extend `install-command.tsx`).
- [ ] Read `encodedPreset` from `useDesignSystem()` (`use-design-system.ts:18`).
- [ ] On click: fetch `/r/webflow-export?preset=<encoded>` → copy to clipboard via `navigator.clipboard.writeText`.
- [ ] Show a success toast and a "How to paste in Webflow" helper link.
- [ ] Add a secondary "Download .css" link (`<a href="/r/webflow-export?preset=<encoded>" download="dotui-tokens.css">`).

### Phase 3 — Optional hex fallback export (half day)

- [ ] In the endpoint, also compute `gamutMap(toOklch(v))` → `toSrgb` → hex for every primitive var.
- [ ] Emit a second `:root` block (or a CSS comment block) with `--neutral-500-hex: #…` values so Webflow's Designer can display swatches.
- [ ] Make this opt-in via `?format=hex` or a UI toggle.

### Phase 4 — Optional showcase preview iframe (1 day)

- [ ] Create `www/src/routes/preview/showcase.tsx`.
- [ ] Render `<Cards />` wrapped in providers; inline preset ramps as a `<style>` tag.
- [ ] Expose at `GET /preview/showcase?preset=<encoded>`.
- [ ] Include an `<iframe>` snippet in the Webflow export modal.

### Phase 5 — Documentation

- [ ] Add a Webflow section to `docs/open-in/README.md` (or the architecture doc).
- [ ] Document the OKLCH-swatch limitation and the hex fallback.
- [ ] Document that component params and density are silently dropped from the Webflow export.

---

## Sources

- dotUI internals: `www/src/publisher/emit-theme.ts` (ramp emission), `www/src/registry/theme/primitives.ts` (color kernel), `www/src/registry/theme/semantics.ts` (semantic layer), `www/src/modules/create/preset/codec.ts` (encode/decode), `packages/colors/src/shared/on-color.ts` (onBlackWhite), `packages/tailwindcss-autocontrast/src/index.js` (contrast parity)
- Webflow Custom Code (Head Code injection): https://university.webflow.com/lesson/custom-code-in-the-head-and-body-tags
- Webflow Code Components (beta): https://developers.webflow.com/data/docs/code-components
- Webflow DevLink (reverse direction — Webflow → React): https://university.webflow.com/lesson/devlink
- OKLCH browser support (Baseline 2023): https://caniuse.com/css-oklch
- CSS Color 4 gamut mapping: https://www.w3.org/TR/css-color-4/#css-gamut-mapping
