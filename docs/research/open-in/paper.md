# Open in Paper (paper.design)

> Summary line: **lowest fidelity of the set; agent-mediated only today** · button type **none** (no native import; agent-driven clipboard/command flow) · preset fidelity **partial** (token values injected as inline styles; component semantics absent) · color fidelity **partial** (OKLCH ramps resolved to inline CSS; no utility class system)

paper.design is an AI-first canvas tool built around an MCP server that exposes two write primitives: set styles on the canvas and write HTML markup. It does not speak React, Tailwind, shadcn registries, or npm packages. As of June 2026, themes and shadcn registry support are listed as roadmap items ("coming soon") on Paper's site — they are not shipped. The realistic integration path today is **agent-mediated**: an AI agent (Claude, Cursor, etc.) reads the user's dotUI preset, resolves it to flat token values, and calls Paper's MCP tools to paint an approximation of the showcase with inline styles. Set expectations plainly: the result is a styled flat-div layout, not a working React component tree. No component semantics, no Tailwind utilities, no interactive states, no RAC aria wiring.

---

## 1. User experience

**Today (agent-mediated path)**

From the dotUI `/create` customizer (URL state: `?preset=<encoded>`, route `www/src/routes/_app/create.tsx:12-16`), the user clicks **"Open in Paper"**. Because Paper has no URL import protocol and no registry hook, the flow is:

1. dotUI copies a command (or JSON blob) to the clipboard describing the showcase layout + resolved preset tokens.
2. The user opens Paper, activates an AI agent inside Paper (or uses Paper's MCP server from an external agent like Claude Code), and pastes / runs the command.
3. The agent calls Paper's MCP tools — `set_styles` (to write the preset's OKLCH-derived hex tokens as Paper canvas styles) and `write_html` (to paint a flat div tree approximating the showcase card grid) — producing a low-fidelity visual on the Paper canvas.

What the user lands in: a Paper canvas showing a static layout of colored divs and text labels representing the 17 showcase cards. Colors match the user's preset (accent, neutrals, status palettes). No interactivity, no variant logic, no component install. This is the honest ceiling for Paper today.

**Future (when Paper ships themes/shadcn support)**

Once Paper ships a shadcn registry import or a theme-import command, the flow can be upgraded to a button that opens Paper with the dotUI init URL baked in (section 10 covers the revisit plan). Until then, the agent-mediated path below is the only viable option.

---

## 2. Technical mechanism

Paper's current external-integration surface is its **MCP server**. The server config (as documented on paper.design) is:

```json
{
  "command": "npx",
  "args": ["-y", "paper-design-mcp@latest"],
  "env": {}
}
```

The MCP exposes (at minimum) two write tools relevant here:

- `write_html` — accepts an HTML string with inline styles; Paper renders it as flat div nodes on the canvas.
- `set_styles` — sets global canvas-level style variables (color tokens, font sizes, spacing).

There is no `install_registry`, no `import_components`, no `run_shadcn` tool. Paper's canvas is **not** a React render tree. The agent produces markup; Paper displays it.

The integration therefore has three parts:

1. **Resolve the preset to flat values** (server-side, in dotUI).
2. **Serialize the showcase as HTML with inline styles** (agent-generated from dotUI's card structure).
3. **Call Paper MCP tools** to push styles + markup onto the canvas.

dotUI must build a new server endpoint that performs step 1 + step 2 and returns a payload the agent can consume.

---

## 3. Preset propagation

The user's preset (`?preset=<encoded>`) must be decoded and resolved before any data reaches Paper. The full decode path:

```
?preset=<base64url> 
  → fromBase64Url() + inflateRaw() + JSON.parse()  [codec.ts:111-126]
  → DesignSystemState { p?, t?, d?, c? }
  → fromCompact() → DesignSystem { componentParams, tokens, density, color? }
  → if color present: resolveColorConfig(color)    [primitives.ts:67-108]
      → createTheme() → { steps, light, dark }     [@dotui/colors kernel]
      → light: { neutral: oklch[], accent: oklch[], success[], warning[], danger[], info[] }
      → dark:  same palettes, lightness reversed   [reverseRamp, primitives.ts:28-37]
```

For Paper's needs, the OKLCH strings must be converted to hex (Paper's MCP tools accept CSS color values; it is safest to use sRGB hex or `oklch()` literals and rely on Paper's rendering engine to handle OKLCH — but for maximum compatibility, convert to hex).

The conversion seam is `packages/colors/src/shared/color.ts`:

```ts
// gamutMap clips out-of-sRGB vivid OKLCH colors; toSrgb returns {r,g,b} in 0..1
import { gamutMap, toSrgb } from "@dotui/colors/shared/color";

function oklchToHex(oklchStr: string): string {
  // oklchStr e.g. "oklch(0.6543 0.1892 256.12)"
  const [l, c, h] = oklchStr.replace("oklch(","").replace(")","").split(" ").map(Number);
  const mapped = gamutMap({ l, c, h });
  const { r, g, b } = toSrgb(mapped);
  const toHex = (v: number) => Math.round(v * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
```

The result is a flat token map:

```ts
// Produced once per preset, for all 6 palettes × 11 steps = 66 light + 66 dark vars
const lightTokens: Record<string, string> = {}; // "--neutral-50": "#f9f9f9", ...
const darkTokens: Record<string, string> = {};

for (const [palette, steps] of Object.entries(resolved.light)) {
  for (let i = 0; i < resolved.steps.length; i++) {
    lightTokens[`--${palette}-${resolved.steps[i]}`] = oklchToHex(steps[i]);
  }
}
// same for dark using resolved.dark
```

Additionally, the semantic `--color-*` layer (from `www/src/registry/base/theme.css` / `www/src/registry/theme/semantics.ts:36-124`) can be derived by substituting the palette step references into the semantic aliases. Key mappings needed to paint the showcase (from `DEFAULT_SEMANTICS`):

```
--color-bg        → --neutral-50  (light) / --neutral-950 (dark)
--color-fg        → --neutral-950 (light) / --neutral-50  (dark)
--color-border    → --neutral-200 (light) / --neutral-800 (dark)
--color-accent    → --accent-500
--color-card      → --neutral-100 (light) / --neutral-900 (dark)
--color-muted     → --neutral-100 (light) / --neutral-900 (dark)
--color-fg-muted  → --neutral-500
```

Density (`compact | default | comfortable`) affects Tailwind class suffix selection inside component TVs but has no analog in Paper's flat-div model. It can be noted as a label in the Paper canvas header but cannot be rendered structurally.

**What is NOT propagated:** per-component `componentParams` (e.g. `alert.style = "sousse"`, `card.style = "tasnim"`). These drive `tv()` class selection in `publisher/flatten.ts:148-170` and `publisher/resolve-classes.ts`. Paper receives no component tree, so param choices are invisible. The best approximation is a text annotation on the canvas listing the non-default params.

---

## 4. Components installed

**Paper: none.** Paper has no concept of installing components into a project's `ui/` folder. The canvas holds markup, not a file system.

The agent-mediated path can paint a visual representation of the 17 showcase cards from `www/src/components/marketing/showcase/cards.tsx` using HTML divs with inline styles. The 37 registry UI components the cards depend on (accordion, avatar, badge, button, calendar, card, checkbox, color-area, color-editor, color-field, color-slider, color-thumb, combobox, disclosure, drop-zone, field, file-trigger, group, input, kbd, link, list-box, loader, otp-field, popover, progress-bar, radio-group, select, separator, slider, switch, table, tabs, tag-group, text, text-field, time-field, toggle-button, toggle-button-group) are **not installed anywhere** — they are painted as visual approximations.

When Paper ships shadcn/component support, the install path will be:

```
npx shadcn add <dotui-init-url>?preset=<encoded>
```

where `<dotui-init-url>` = `https://dotui.com/r/init` (the `registry:base` item produced by `emitInitItem` in `www/src/publisher/emit-theme.ts:71-128`). That URL delivers every dotUI dependency, the `cn()` helper, and the `config.registries["@dotui"]` baked with the encoded preset so subsequent `shadcn add @dotui/<name>` calls hit per-component endpoints with the correct preset. But Paper is not there yet.

---

## 5. Theme in globals.css

**Paper: no globals.css.** Paper does not have a Tailwind project or a CSS entry file.

The theme is approximated via Paper's `set_styles` MCP tool. The agent calls it with the resolved flat token map (section 3) as CSS custom property assignments. This gives Paper's canvas a color system, but it is cosmetic — Paper does not run a Tailwind build, does not process `@theme inline` blocks, and does not invoke `tailwindcss-autocontrast` to derive `--on-*` foreground values.

For the agent-mediated path, `--on-*` foregrounds are derived using the same `onBlackWhite` heuristic the autocontrast plugin uses (WCAG relative luminance, black or white pick) from `packages/colors/src/shared/on-color.ts:88-97`. This is the deliberate replica of `tailwindcss-autocontrast`'s `getContrastColor` kept in lockstep by `www/src/registry/theme/on-color-parity.spec.ts`. The result is adequate for painting foreground text on colored cards.

What the `set_styles` call looks like:

```json
{
  "tool": "set_styles",
  "arguments": {
    "styles": {
      "--neutral-50":  "#f9f9f9",
      "--neutral-100": "#f2f2f2",
      "--accent-500":  "#438cd6",
      "--color-bg":    "#f9f9f9",
      "--color-fg":    "#0a0a0a",
      "--color-accent":"#438cd6",
      "--color-card":  "#f2f2f2",
      "--color-border":"#e5e5e5"
    }
  }
}
```

The full init-item equivalent (what `https://dotui.com/r/init?preset=<encoded>` would write to a real `globals.css` via shadcn) includes:
- `@import "tw-animate-css"` — not applicable in Paper
- `@plugin "tailwindcss-react-aria-components"` — not applicable in Paper
- `@plugin "tailwindcss-autocontrast" { cssfile: ... }` — not applicable in Paper
- `@theme inline` semantic layer — approximated via `set_styles`
- `:root { --neutral-50: ...; ... }` / `.dark { ... }` — approximated via `set_styles` (light values only; dark is unavailable in Paper's current model)

---

## 6. The showcase as first view

`www/src/components/marketing/showcase/cards.tsx:20-48` renders a `columns-1 sm:columns-2 lg:columns-3 xl:columns-4` masonry grid of 17 self-contained card widgets. The agent must translate this into HTML markup that Paper's `write_html` tool can accept.

The translation rules:

| React pattern | Paper HTML approximation |
|---|---|
| `<Card>` with `cn("bg-card border-border rounded-lg p-4")` | `<div style="background:var(--color-card); border:1px solid var(--color-border); border-radius:8px; padding:16px">` |
| `<Button>` (accent variant) | `<button style="background:var(--color-accent); color:var(--on-accent-500); border-radius:6px; padding:8px 16px; font-size:14px">` |
| `<Avatar>` | `<img style="border-radius:50%; width:32px; height:32px">` + fallback `<span style="background:var(--color-muted)">` |
| `<Badge>` | `<span style="background:var(--color-accent); color:var(--on-accent-500); border-radius:4px; padding:2px 8px; font-size:12px">` |
| `<Separator>` | `<hr style="border:none; border-top:1px solid var(--color-border)">` |
| `<ProgressBar>` | `<div style="height:8px; background:var(--color-muted); border-radius:4px"><div style="width:{value}%; height:100%; background:var(--color-accent)"></div></div>` |
| `<Tabs>` | `<div>` row of tab labels + active underline in accent color |
| `<Switch>` checked | `<div style="width:36px; height:20px; background:var(--color-accent); border-radius:10px; ...">` |
| Lucide icons | `<svg>` pass-through (inline the icon path from lucide's source) |
| `@fontsource-variable/geist` | `font-family: "Geist Variable", system-ui, sans-serif` inline on the root `<div>` |

The agent-generated HTML output is a single `<div>` with a 4-column CSS grid (or flex-wrap) containing 17 card sub-trees, each approximating one of: Booking, TwoFactor, Filters, Storage, Notifications, CookiePreferences, InviteMembers, Shortcuts, Payment, Transactions, AccountMenu, Faq, ColorEditorCard, UploadAvatar, TeamName, Feedback, LoginForm.

Remote avatar images (`https://github.com/mehdibha.png`, `https://github.com/shadcn.png`, etc.) can be included as `<img src="...">` tags — they are publicly accessible and Paper renders remote images.

The inline SVG sign-in icons in `login-form.tsx` (Google, X, GitHub) can be embedded verbatim in the HTML string.

**Key constraint:** the masonry layout (`columns-*` CSS multi-column) must be replaced with a flat CSS grid or flex-wrap since Paper does not run Tailwind. Use:

```html
<div style="display:grid; grid-template-columns:repeat(4,1fr); gap:16px; padding:32px; background:var(--color-bg); font-family:'Geist Variable',system-ui,sans-serif">
  <!-- 17 card divs -->
</div>
```

---

## 7. What dotUI must build

For the agent-mediated path, dotUI needs one new server endpoint and one button component:

### 7a. New endpoint: `GET /r/paper?preset=<encoded>`

Route file: `www/src/routes/r/paper.tsx` (new, following the pattern of `www/src/routes/r/init.tsx`).

Responsibilities:
1. Decode `?preset=` via `decodePreset` from `www/src/modules/create/preset/codec.ts:111`.
2. Resolve color ramps: `resolveColorConfig(preset.color)` from `www/src/registry/theme/primitives.ts:67` (falls back to default ramps if `color` is absent).
3. Convert all 66 light + 66 dark OKLCH values to hex via `gamutMap` + `toSrgb` from `packages/colors/src/shared/color.ts:42-60`.
4. Build the semantic flat-token map by substituting primitive hex values into the `DEFAULT_SEMANTICS` step references (`www/src/registry/theme/semantics.ts:36-124`).
5. Derive `--on-*` foregrounds using `onBlackWhite` from `packages/colors/src/shared/on-color.ts:88-97`.
6. Return a JSON payload:

```json
{
  "preset": "<encoded>",
  "density": "compact",
  "tokens": {
    "light": {
      "--neutral-50": "#f9f9f9",
      "--accent-500": "#438cd6",
      "--color-bg": "#f9f9f9",
      "--color-fg": "#0a0a0a",
      "--on-accent-500": "#ffffff"
    },
    "dark": { ... }
  },
  "componentParams": {
    "card": { "style": "default" },
    "alert": { "style": "default" }
  },
  "mcpInstructions": {
    "set_styles": { ... },
    "write_html": "<div style=...><!-- showcase HTML --></div>"
  }
}
```

The `mcpInstructions` block is optional but useful: it pre-serializes the exact tool calls so a dumb copy-paste workflow also works (user pastes the `write_html` value into Paper's own AI chat).

### 7b. New button in the install panel

In `www/src/modules/create/install-command.tsx` (the panel that already renders the `npx shadcn add ...` command), add an "Open in Paper" row. Since no URL protocol exists, the button:
- Fetches `/r/paper?preset=<encoded>` (or constructs the payload client-side using the codec).
- Copies the `mcpInstructions.write_html` string to the clipboard.
- Shows a tooltip: "Copied showcase HTML. In Paper, open the AI assistant and paste — it will call Paper's MCP tools to paint the showcase with your theme."

No `openUrl` / `window.open` needed. The button type is `copy-command`.

### 7c. Agent prompt template

For users running Claude Code or Cursor with Paper's MCP configured, dotUI can expose an agent prompt at `GET /r/paper-prompt?preset=<encoded>` that returns a plain-text instruction:

```
You have Paper's MCP server available. Do the following:

1. Call set_styles with these tokens (light mode):
   --neutral-50: #f9f9f9
   --accent-500: #438cd6
   --color-bg: #f9f9f9
   --color-fg: #0a0a0a
   [... full list ...]

2. Call write_html with the following markup:
   <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:16px; background:#f9f9f9; font-family:'Geist Variable',system-ui,sans-serif; padding:32px">
     [... 17 card divs ...]
   </div>
```

This prompt can be copied from the dotUI UI and pasted into any agent that has Paper's MCP connected.

---

## 8. Schema / meta.ts changes

Unlike the Figma path (which requires a `figma` field on every `meta.ts`), the Paper path requires **no meta.ts changes**. The agent-mediated flow does not consume component anatomy metadata — it only needs the resolved token map and a static HTML template of the showcase.

However, if Paper ships component support in the future, a `paper` field on `RegistryItem` could carry a Paper component ID or style template:

```ts
// www/src/registry/types.ts (hypothetical future addition)
export type RegistryItem = ShadcnRegistryItem & {
  group?: ComponentGroup | null;
  params?: Record<string, ParamDef>;
  figma?: string;
  paper?: string; // Paper component ID or template key, e.g. "button-primary"
};
```

Adding this field is one line in `www/src/registry/types.ts:69-78` (the intersection type). It becomes inert until code reads it, and propagates automatically into internal publishable meta via the `{ ...rest }` spread in `www/src/publisher/build-time/build-publishables.ts:334` (`metaForRuntime`).

**For today's agent-mediated path: no meta.ts changes are required.**

---

## 9. Limitations, risks, fallbacks

### Fidelity ceiling (structural)

Paper's `write_html` produces flat div nodes. dotUI's showcase components use:
- **React Aria Components** for all interactive states (`data-focused`, `data-hovered`, `data-selected`, `data-disabled`) — invisible in a static HTML snapshot.
- **`tailwind-variants`** for slot-based class composition — the HTML approximation must inline equivalent styles by hand.
- **`tailwindcss-autocontrast`** for `--on-*` foreground derivation at Tailwind build time — must be pre-computed server-side (section 3).
- **`tailwindcss-react-aria-components`** for `data-[...]` variants — not applicable.
- **`tailwindcss-with`** for `with-[...]` container variants — not applicable.

The resulting Paper canvas is a **wireframe approximation**, not a runnable component tree. Do not promise designers that the Paper canvas is the "same" as the dotUI showcase.

### OKLCH gamut risk

dotUI emits `oklch()` strings. High-chroma OKLCH colors (especially vivid accent hues at mid-lightness) may lie outside the sRGB gamut. `gamutMap` from `packages/colors/src/shared/color.ts:48` uses the CSS Color 4 chroma-reduction method to clip them to sRGB before hex conversion. This is lossy at vivid hues — the Paper hex will be less saturated than the browser-rendered OKLCH. Document this in the button tooltip.

### Paper MCP API surface (unstable)

Paper's MCP server is undocumented beyond what Paper's own AI agent uses. Tool names (`set_styles`, `write_html`) and argument shapes may change without notice. Build the `/r/paper` endpoint to return the resolved token map and showcase HTML as data fields, not pre-serialized MCP calls — this way the agent can adapt to Paper's current API shape without a dotUI deployment.

### Dark mode

Paper (as of June 2026) does not expose a canvas-level dark/light mode switch via MCP. The agent-mediated path delivers light-mode tokens only. Dark ramps are included in the `/r/paper` response payload so an agent can inject a `.dark` override if Paper's API gains mode support.

### No /r/registry.json index (existing limitation)

dotUI currently has no `/r/registry.json` index route (it returns 404). This is a known gap noted in the ground-truth facts. The Paper integration does not depend on this index — it uses the `/r/paper` endpoint directly — so this is not a blocker. But when the shadcn MCP discovery path becomes relevant (if Paper ships shadcn import), the registry.json index must be built. The implementation would be a new route `www/src/routes/r/registry[.]json.tsx` importing `registryUi`, `registryLib`, `registryHooks`, `registryBase` from `www/src/registry/__generated__/registry-items.ts` and emitting the shadcn `Registry` shape (`{ name: "dotui", homepage: "...", items: [...] }`).

### Preset round-trip correctness

The `/r/paper` endpoint decodes the preset exactly as `/r/init` does (`decodePreset`, `codec.ts:111-126`), with the same fallback to `defaultPreset()` on any malformed input. The `tokens` field of `DesignSystem` (global CSS vars set via `setToken`) is not yet wired into the publisher's `PublishPreset` (documented TODO at `emit-theme.ts:62-68`) — this means user-set `--radius-factor` overrides, for example, are silently dropped. The Paper path inherits this limitation.

### Paper themes roadmap

Paper's public roadmap mentions "themes" and "shadcn" as forthcoming features. When they ship, revisit: (a) whether Paper can consume a `registry:base` item from `https://dotui.com/r/init?preset=<encoded>` directly (shadcn CLI integration), and (b) whether Paper exposes a URL protocol (`paper://import?registry=...`) or deeplink that enables a real button-type `component-url` or `mcp-install` flow. Until then, the agent-mediated path is the only option.

---

## 10. Step-by-step implementation checklist

### Phase 0: resolve + serialize (server-side, no UI)

- [ ] **Create `www/src/routes/r/paper.tsx`** as a TanStack Start server GET handler, mirroring the structure of `www/src/routes/r/init.tsx:22-59`.
  - Read `url.searchParams.get("preset")`, decode via `decodePreset` (`www/src/modules/create/preset/codec.ts:111`), fall back to `defaultPreset()`.
  - If `preset.color` is defined, call `resolveColorConfig(preset.color)` (`www/src/registry/theme/primitives.ts:67`); otherwise use the static ramps from `baseRegistryCss` (`www/src/registry/__generated__/base-css.ts`).
  - Convert all ramp OKLCH strings to hex using `gamutMap` + `toSrgb` from `packages/colors/src/shared/color.ts:42-60` (implement `oklchToHex` as a small utility in `www/src/publisher/`).
  - Derive `--on-*` using `onBlackWhite` from `packages/colors/src/shared/on-color.ts:88-97`.
  - Build the semantic alias map by substituting resolved hex values into `DEFAULT_SEMANTICS` step references (`www/src/registry/theme/semantics.ts:36-124`).
  - Return JSON: `{ preset, density, tokens: { light, dark }, componentParams, showcaseHtml }` with cache headers matching the `/r/$name` pattern (`www/src/routes/r/$name.tsx:27-30`).

- [ ] **Implement `buildShowcaseHtml(tokens)`** in `www/src/publisher/paper-showcase.ts` (new file). This function takes the resolved light token map and returns the HTML string approximation of the 17 showcase cards from `www/src/components/marketing/showcase/cards.tsx:20-48`. Use hardcoded layout values (the card content is static data). Include remote avatar `<img>` tags using the GitHub CDN URLs embedded in the showcase files.

### Phase 1: UI button

- [ ] **Add "Open in Paper" button** to the install panel in `www/src/modules/create/install-command.tsx`.
  - On click: fetch `GET /r/paper?preset=<encoded>` (or construct payload in-browser).
  - Extract `showcaseHtml` and copy to clipboard.
  - Show tooltip: "HTML copied. Open Paper, activate the AI assistant, and paste to paint the showcase with your theme."
  - Button type: `copy-command` (no URL open).

- [ ] **Run `pnpm exec oxfmt`** on every touched file before pushing (MEMORY: `reference_oxfmt_import_order.md` — CI `pnpm check` enforces import order via oxfmt).

### Phase 2: agent prompt endpoint (optional)

- [ ] **Create `www/src/routes/r/paper-prompt.tsx`** returning a plain-text instruction string for agents that have Paper's MCP configured. Include the `set_styles` token list and the `write_html` markup as plain text.

### Phase 3: revisit triggers (when Paper ships themes/shadcn)

- [ ] Watch Paper's changelog for a registry import feature or URL deeplink protocol.
- [ ] When available: replace the `copy-command` button with a `mcp-install` or `component-url` button that opens Paper directly with `https://dotui.com/r/init?preset=<encoded>` as the registry root.
- [ ] If Paper ships component semantics: add `paper?: string` to `RegistryItem` (`www/src/registry/types.ts:69-78`) and populate it in each `ui/*/meta.ts` with the matching Paper component ID.
- [ ] If Paper ships a shadcn MCP discovery path: build the `/r/registry.json` index route (new `www/src/routes/r/registry[.]json.tsx`, imports from `__generated__/registry-items.ts`) so Paper's MCP can discover all dotUI items.

---

## Sources

- Paper MCP server: <https://paper.design> (MCP integration docs, "coming soon" themes/shadcn as of June 2026)
- dotUI preset codec: `www/src/modules/create/preset/codec.ts:75-126`
- dotUI init item emission: `www/src/publisher/emit-theme.ts:71-128`
- OKLCH color seam: `packages/colors/src/shared/color.ts:36-81`
- on-black/white heuristic (autocontrast parity): `packages/colors/src/shared/on-color.ts:88-97`; parity test `www/src/registry/theme/on-color-parity.spec.ts`
- Showcase card list: `www/src/components/marketing/showcase/cards.tsx:20-48`
- Semantic token vocabulary: `www/src/registry/theme/semantics.ts:36-124`
- RegistryItem type (where to add `paper` field): `www/src/registry/types.ts:69-78`
- metaForRuntime spread (auto-propagation of new fields): `www/src/publisher/build-time/build-publishables.ts:334`
- shadcn registry MCP config shape: <https://ui.shadcn.com/docs/registry/mcp> (requires `/r/registry.json` index, currently 404 on dotUI)
- tailwindcss-autocontrast plugin (on-* derivation): `packages/tailwindcss-autocontrast/src/index.js:339-351`
- tokens TODO (not yet wired into PublishPreset): `www/src/publisher/emit-theme.ts:62-68`
