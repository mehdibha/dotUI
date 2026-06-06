# Open in Cursor

> **Feasible with two complementary buttons** · button type `mcp-install` (primary) + `copy-command` (secondary, one-shot showcase install) · preset fidelity **full** (both paths) · color fidelity **full** (OKLCH ramps baked into `/r/init` CSS)

---

## 1. User experience

The user has configured a dotUI design system on the `/create` page — chosen an accent color,
density, and per-component style variants — and wants to open that exact design system in Cursor
and start editing real code with their themed components already installed.

The recommended UX exposes **two buttons side by side**:

| Button | Label | Action |
|---|---|---|
| Primary | "Open in Cursor" (MCP install) | Installs the dotUI registry as an MCP server in Cursor so the agent can browse + add components on demand |
| Secondary | "Copy install command" | Copies `npx shadcn add <url>` for a one-shot, showcase-preinstalled project |

**Flow for the MCP install button:**

1. User clicks "Open in Cursor" — browser navigates to the `cursor://` deep-link URI.
2. Cursor opens and shows a prompt: "Install MCP server dotUI-registry?" with the server config pre-filled.
3. User confirms. Cursor now has the MCP server and its agent can call `shadcn registry:mcp` to discover and add any dotUI component with the user's preset baked in.

**Flow for the copy-command button (showcase-preinstalled):**

1. User copies the command shown (e.g. `npx shadcn add https://dotui.com/r/init?preset=<encoded>`).
2. User creates a new project (Vite + React or Next.js), then pastes and runs the command.
3. The command installs the full theme + `src/lib/utils.ts` and writes the preset's OKLCH ramps into `globals.css`. The user then pastes the showcase files (or runs per-component adds).
4. User opens the project folder in Cursor: `cursor <project-dir>`.

Neither path opens a sandboxed URL; Cursor does not have a "remote repo import" flow. The
showcase-preinstalled UX relies on the user first bootstrapping a local project.

---

## 2. Technical mechanism

### 2a. MCP install deep-link

Cursor supports a deep-link URI scheme for MCP server installation:

```
cursor://anysphere.cursor-deeplink/mcp/install?name=<NAME>&config=<BASE64>
```

- `<NAME>` — display name for the MCP server (shown in Cursor's MCP panel), e.g. `dotUI-registry`.
- `<BASE64>` — `btoa(JSON.stringify(serverConfig))`, where `serverConfig` is the standard MCP
  server descriptor Cursor accepts. **This is plain base64, not base64url and not pako-compressed.**

The server config for the shadcn registry MCP server:

```json
{
  "command": "npx",
  "args": ["-y", "shadcn@latest", "registry:mcp"],
  "env": {
    "REGISTRY_URL": "https://dotui.com/r/registry.json"
  }
}
```

Encoded:

```js
const serverConfig = {
  command: "npx",
  args: ["-y", "shadcn@latest", "registry:mcp"],
  env: { REGISTRY_URL: "https://dotui.com/r/registry.json" }
};
const config = btoa(JSON.stringify(serverConfig));
const url = `cursor://anysphere.cursor-deeplink/mcp/install?name=dotUI-registry&config=${config}`;
```

Render as an `<a href={url}>` anchor. On GitHub, wrap it in a Shields badge:

```markdown
[![Open in Cursor](https://img.shields.io/badge/Open%20in-Cursor-000?logo=cursor)](cursor://anysphere.cursor-deeplink/mcp/install?name=dotUI-registry&config=BASE64HERE)
```

**Critical prerequisite:** The `REGISTRY_URL` must point at a live `/r/registry.json` endpoint.
That route does not exist today in dotUI — it returns 404. Building it is the blocking task for
this feature (see §7).

### 2b. One-shot init command (showcase-preinstalled path)

The install command is already computed by `InstallCommand` in
`www/src/modules/create/install-command.tsx:39-48`:

```ts
const encoded = encodePreset(designSystem);  // codec.ts:75
const url = encoded
  ? `${host}/r/init?preset=${encoded}`
  : `${host}/r/init`;
return `npx shadcn add ${url}`;
```

This is the same command shown in the customizer panel today. For the "Open in Cursor" feature,
the secondary button copies this command. The preset (`encoded`) is a URL-safe base64 string of
pako-deflated compact JSON — the full wire format is described in §3.

---

## 3. Preset propagation

### Wire format

The `?preset=` value is produced by `encodePreset` (`www/src/modules/create/preset/codec.ts:75`):

1. Build a `DesignSystemState` compact object, diffed against `DEFAULTS`
   (`www/src/modules/create/preset/defaults.ts:5`):
   - `p`: per-component param overrides (only values that differ from `DEFAULTS.componentParams`)
   - `t`: global token overrides (only values that differ from `DEFAULTS.tokens` = `{}`)
   - `d`: density string, only when `!== "compact"` (dotUI default is `compact`)
   - `c`: full `ColorConfig` object, only when it differs from `DEFAULT_COLOR_CONFIG`
     (`www/src/registry/theme/color-config.ts:72`)
2. `JSON.stringify(compactState)` — e.g. `{"c":{"algorithm":"oklch","seeds":{"neutral":"#1a1a2e","accent":"#e94560"}}}`
3. `pako.deflateRaw(json, { level: 9 })` — raw DEFLATE, no zlib header
4. `btoa(String.fromCharCode(...bytes))` then `+→-`, `/→_`, strip trailing `=` (URL-safe base64)

Decode is the exact inverse, merging back over `DEFAULTS` (`codec.ts:111`); any corrupt input
returns `DEFAULTS` (total fallback).

### How the preset flows through each path

**MCP path** — the `REGISTRY_URL` (`/r/registry.json`) carries no preset. Preset fidelity on the
MCP path is achieved via the `config.registries["@dotui"]` field that `/r/init?preset=<encoded>`
bakes into `components.json` (`www/src/publisher/emit-theme.ts:130-132`). Once the user runs the
init command once, every subsequent `shadcn add @dotui/<name>` (whether invoked by the agent via
MCP or manually) hits `/r/<name>?preset=<encoded>` with the user's exact preset. The MCP server
discovers names from the registry index but fetches content from the preset-baked URL.

**One-shot init path** — the preset is embedded directly in the init URL:

```
https://dotui.com/r/init?preset=<encoded>
```

The route handler (`www/src/routes/r/init.tsx:27-55`) calls `decodePreset(encodedPreset)` and
threads `color`, `density`, and `componentParams` into `emitInitItem`. The returned `registry:base`
item then contains:

- OKLCH ramps for the chosen color (if `preset.color` present) overriding `:root`/`.dark`
- `--dotui-density` in `:root` (if density != `"compact"`)
- `config.registries["@dotui"]` set to `"<root>/r/{name}?preset=<encoded>"` so every subsequent
  per-component `shadcn add` inherits the same preset

---

## 4. Components installed

### Via MCP (on-demand)

After the MCP server is installed in Cursor, the agent can call `shadcn add @dotui/<name>` for any
of the 60 registered UI items (full list in `www/src/registry/__generated__/registry-items.ts:70-129`).

Each per-component request hits `/r/<name>?preset=<encoded>` where the publisher
(`www/src/publisher/publish.ts:119-161`) runs the full preset pipeline:
- **Density flattening** (`flatten.ts:148`): merges `base ← density[selected] ← params[name][value]` tv layers, baking density into class strings
- **Scalar param rewriting** (`resolve-classes.ts:30`): rewrites e.g. `rounded-(--alert-radius)` → `rounded-md` when `alert.radius = "--radius-md"`
- **Enum-with-files swap** (`$name.tsx:89-107`): picks the correct source file for multi-variant items (today only `loader` uses this: `style="spinner"` → `base.spinner.tsx`, `style="ring"` → `base.ring.tsx`)
- **Transitive deps** (`publish.ts:79-105`): `registryDependencies` in the emitted JSON are rewritten to absolute URLs with the same `?preset=<encoded>` appended so recursive fetches preserve the preset

Components install to their declared `target` paths (e.g. `ui/button.tsx`, `ui/card.tsx`); the
alias `@/components/ui` maps to the standard shadcn-CLI install location.

### Via one-shot init (showcase path)

Running `npx shadcn add <init-url>` alone installs only the theme + `src/lib/utils.ts`. To install
all showcase components, follow with per-component adds. The showcase
(`www/src/components/marketing/showcase/cards.tsx`) uses 37 distinct UI modules; the minimal set to
render `<Cards />` is:

accordion, avatar, badge, button, calendar, card, checkbox, checkbox-group, color-area, color-editor,
color-field, color-slider, color-thumb, disclosure, drop-zone, field, file-trigger, group, input, kbd,
link, list-box, loader, otp-field, popover, progress-bar, radio-group, select, separator, slider,
switch, table, tabs, tag-group, text, text-field, time-field, toggle-button, toggle-button-group

One-liner to install all showcase components after the init:

```bash
npx shadcn add \
  https://dotui.com/r/accordion?preset=ENCODED \
  https://dotui.com/r/avatar?preset=ENCODED \
  https://dotui.com/r/badge?preset=ENCODED \
  https://dotui.com/r/button?preset=ENCODED \
  https://dotui.com/r/calendar?preset=ENCODED \
  https://dotui.com/r/card?preset=ENCODED \
  https://dotui.com/r/checkbox?preset=ENCODED \
  https://dotui.com/r/checkbox-group?preset=ENCODED \
  https://dotui.com/r/color-area?preset=ENCODED \
  https://dotui.com/r/color-editor?preset=ENCODED \
  https://dotui.com/r/color-field?preset=ENCODED \
  https://dotui.com/r/color-slider?preset=ENCODED \
  https://dotui.com/r/color-thumb?preset=ENCODED \
  https://dotui.com/r/disclosure?preset=ENCODED \
  https://dotui.com/r/drop-zone?preset=ENCODED \
  https://dotui.com/r/field?preset=ENCODED \
  https://dotui.com/r/file-trigger?preset=ENCODED \
  https://dotui.com/r/group?preset=ENCODED \
  https://dotui.com/r/input?preset=ENCODED \
  https://dotui.com/r/kbd?preset=ENCODED \
  https://dotui.com/r/link?preset=ENCODED \
  https://dotui.com/r/list-box?preset=ENCODED \
  https://dotui.com/r/loader?preset=ENCODED \
  https://dotui.com/r/otp-field?preset=ENCODED \
  https://dotui.com/r/popover?preset=ENCODED \
  https://dotui.com/r/progress-bar?preset=ENCODED \
  https://dotui.com/r/radio-group?preset=ENCODED \
  https://dotui.com/r/select?preset=ENCODED \
  https://dotui.com/r/separator?preset=ENCODED \
  https://dotui.com/r/slider?preset=ENCODED \
  https://dotui.com/r/switch?preset=ENCODED \
  https://dotui.com/r/table?preset=ENCODED \
  https://dotui.com/r/tabs?preset=ENCODED \
  https://dotui.com/r/tag-group?preset=ENCODED \
  https://dotui.com/r/text?preset=ENCODED \
  https://dotui.com/r/text-field?preset=ENCODED \
  https://dotui.com/r/time-field?preset=ENCODED \
  https://dotui.com/r/toggle-button?preset=ENCODED \
  https://dotui.com/r/toggle-button-group?preset=ENCODED
```

Replace `ENCODED` with the actual encoded preset string from `encodePreset(designSystem)`.
`shadcn add` follows `registryDependencies` recursively, so installing `button` automatically
pulls `loader` and `focus-styles` (bundled via init). The transitive rewrite in `publish.ts:83-104`
ensures every recursive fetch carries the same preset.

---

## 5. Theme in globals.css

`npx shadcn add <init-url>` merges the `registry:base` item produced by
`emitInitItem` (`www/src/publisher/emit-theme.ts:71`) into the consumer's Tailwind CSS entry file.
The resulting file contains, in order:

```css
/* 1. Imports and plugins — from base/base.css, constant across presets */
@import "tailwindcss";
@import "tw-animate-css";
@plugin "tailwindcss-react-aria-components";
@plugin "tailwindcss-autocontrast" { cssfile: "<this-file>"; }
@plugin "tailwindcss-with";
@custom-variant dark (&:is(.dark *));

/* 2. Utility blocks — from base/base.css, constant */
@utility focus-ring { … }
@utility focus-input { … }
@utility focus-reset { … }
@utility no-highlight { … }

/* 3. Layer base resets — constant */
@layer base {
  * { @apply border-border; }
  body { @apply bg-bg font-sans text-fg; }
  html { @apply font-sans; }
}

/* 4. @theme inline — semantic color tokens + radius scale, from base/theme.css, CONSTANT across presets */
@theme inline {
  --radius-md: calc(0.375rem * var(--radius-factor));
  --color-bg: var(--neutral-50);
  --color-accent: var(--accent-500);
  --color-fg-on-accent: var(--on-accent-500);
  /* ... all ~80 semantic tokens ... */
}

/* 5. :root — PRESET-SPECIFIC OKLCH primitive ramps */
:root {
  --radius-factor: 1;
  --neutral-50: oklch(0.985 0 0);   /* ← user's chosen neutral seed, OKLCH-generated */
  --neutral-100: oklch(0.953 0 0);
  /* ... --neutral-* through --info-* (6 palettes × 11 steps = 66 vars) ... */
  --accent-50: oklch(0.96 0.012 242.44);   /* ← user's chosen accent seed */
  /* ... */
  /* --dotui-density: comfortable;  ← only if density != "compact" */
}

/* 6. .dark — reversed ramps (same palettes, 50↔950 lightness swap) */
.dark {
  --neutral-50: oklch(0.13 0 0);
  /* ... */
}
/* --on-accent-500 etc. are NOT emitted here — tailwindcss-autocontrast injects them at build */
```

The `@theme inline` block (section 4) is identical for every preset — it contains semantic
indirections only (`--color-accent: var(--accent-500)`, etc.). Only sections 5 and 6 change per
preset; `mergePresetCssFields` in `emit-theme.ts:145-170` handles this: when `preset.color` is
present it calls `resolveColorConfig(preset.color)` then `rampsToVars(resolved.light/dark)` to
override those 66 vars per palette. When `preset.color` is absent, the static default ramps from
`__generated__/base-css.ts` are used unchanged.

**Component-level CSS** (e.g. `--avatar-radius`, `@utility`-based skeleton animation) is emitted
per-component — each `npx shadcn add @dotui/<name>` call merges the component's `css`/`cssVars`
fields from its `/r/<name>?preset=<encoded>` response.

---

## 6. The showcase as first view

The showcase `<Cards />` is not a route or page that Cursor can directly navigate to — it lives at
`www/src/components/marketing/showcase/cards.tsx` as a React component. To make it the first view
in the user's project:

### Option A: copy showcase files into the generated project

The showcase card files are plain React components (no server functions, no loaders, no routing).
They can be copied verbatim from `www/src/components/marketing/showcase/*.tsx` into the user's
project. dotUI must expose them for download — options:

1. **Ship them as a registry item** — add a new `registry:page` (or `registry:component`) item
   pointing at the showcase directory, fetchable via `npx shadcn add <url>`. The showcase files
   themselves reference `@/registry/ui/*` imports that align with the shadcn-installed paths only
   if the aliases are configured.
2. **GitHub raw download** — link to the raw files on the main branch. Simpler but no preset
   substitution.
3. **Generated zip / template repo** — a new `/r/showcase.zip?preset=<encoded>` endpoint (see §7)
   that bundles init + all showcase components + card files + a stub `App.tsx`.

### Option B: document a one-step scaffold

Until a showcase registry item or zip endpoint exists, the secondary button's copy-command output
can include instructions:

```
# 1. Create project (example: Vite + React + TS)
pnpm create vite my-dotui-app --template react-ts
cd my-dotui-app

# 2. Install dotUI theme + all showcase components
npx shadcn init
npx shadcn add https://dotui.com/r/init?preset=ENCODED
npx shadcn add https://dotui.com/r/button?preset=ENCODED ...  (all 39 above)

# 3. Copy showcase card files from dotUI source
#    https://github.com/mehdibha/dotUI/tree/main/www/src/components/marketing/showcase/
#    Place them at: src/components/marketing/showcase/

# 4. Replace src/App.tsx with:
#    import { Cards } from "@/components/marketing/showcase/cards";
#    export default function App() { return <div className="p-8"><Cards /></div>; }

# 5. Open in Cursor
cursor my-dotui-app
```

The showcase requires these additional context files that are NOT installed by `shadcn add`:
- `src/registry/lib/context/index.tsx` (`createContext`, `createVariantsContext`, `createScopedContext`)
- `src/registry/hooks/use-image-loading-status.ts` (used by `avatar/base.tsx`)
- `src/registry/__generated__/icons.tsx` (only `ExternalLinkIcon`; can be replaced with `import { ExternalLink } from "lucide-react"` directly)
- `src/modules/core/styles.tsx` (`DesignSystemProvider`, `createStyles`)

These are internal dotUI runtime files not yet shipped as separate registry items. They must be
copied manually or added to a future registry item.

### Provider wrapping

The showcase needs a dark-mode class toggle (`class="dark"` on `<html>`). dotUI's own
`ThemeProvider` from `packages/starter-themes` depends on `@tanstack/react-router`'s `ScriptOnce`
and is not suited for arbitrary projects. Replace it with `next-themes` or any provider that
toggles the `dark` class on `<html>`:

```tsx
// App.tsx (minimal, Vite)
import { Cards } from "@/components/marketing/showcase/cards";

export default function App() {
  // DesignSystemProvider is optional — omit it for defaults
  return (
    <div className="min-h-screen bg-bg font-sans text-fg antialiased">
      <main className="p-8">
        <Cards />
      </main>
    </div>
  );
}
```

---

## 7. What dotUI must build

### Blocker 1 — `/r/registry.json` index route (required for MCP)

The shadcn `registry:mcp` subcommand needs a standard registry index at the `REGISTRY_URL`. Today
`/r/registry.json` returns 404. A new TanStack Start server GET handler must be added:

**File:** `www/src/routes/r/registry[.]json.tsx` (the `[.]` escapes the literal dot in file-based routing)

**Shape to emit** (`www/src/registry/types.ts:80-82` — `Registry` = `{ name, homepage, items[] }`):

```json
{
  "name": "dotui",
  "homepage": "https://dotui.com",
  "items": [
    { "name": "accordion",  "type": "registry:ui",  "title": "Accordion",  "description": "..." },
    { "name": "alert",      "type": "registry:ui",  "title": "Alert",      "description": "..." },
    ...
  ]
}
```

The data is all available: `registryUi` + `registryLib` + `registryHooks` + `registryBase` from
`www/src/registry/__generated__/registry-items.ts`. Strip `group`, `params`, `files[].content`
(they don't belong in the index). The index does NOT need a preset — it is just a discovery
manifest; the preset is wired per-item via the init step's `config.registries["@dotui"]`.

**Cache headers:** follow the existing pattern from `$name.tsx:27-30`:
`public, max-age=60, s-maxage=3600, stale-while-revalidate=86400`.

### Blocker 2 — verify `shadcn registry:mcp` subcommand availability

The `registry:mcp` subcommand was introduced in a shadcn canary/next build. Verify the exact
version before shipping the button:

```bash
npx shadcn@latest registry:mcp --help
# if unknown command, try:
npx shadcn@canary registry:mcp --help
```

Update the `args` array in the server config (`"shadcn@latest"` vs `"shadcn@canary"`) accordingly.

### Optional — showcase registry item or zip endpoint

For the "showcase as first view" goal without requiring manual file copies:

**Option A — registry:page item** for the showcase directory. Add a new item in
`www/src/registry/` (e.g. `showcase/meta.ts`):

```ts
{
  name: "showcase",
  type: "registry:page",   // or "registry:component" — depends on shadcn schema version
  files: [
    { type: "registry:page", path: "components/marketing/showcase/cards.tsx",   target: "components/showcase/cards.tsx" },
    { type: "registry:page", path: "components/marketing/showcase/booking.tsx", target: "components/showcase/booking.tsx" },
    // ... all 17 card files ...
  ],
  registryDependencies: [/* all 39 components above */],
}
```

Expose at `/r/showcase?preset=<encoded>`. Because the showcase imports `@/registry/ui/*` paths,
the shadcn aliases in `components.json` must map `@/registry/ui/button` → `@/components/ui/button`
etc. — this may require alias remapping in the emitted files. Significant work; evaluate whether
it is in scope.

**Option B — zip endpoint.** A new route `/r/showcase.zip?preset=<encoded>` that streams a zip
containing: `globals.css` (from `emitInitItem`), all 39 component files (from `publish()`), the
showcase card files, a stub `App.tsx`, `package.json`, and `vite.config.ts`. This is fully
self-contained and requires no shadcn CLI on the consumer side, but it bypasses the `shadcn add`
merge step for `globals.css` and must do the CSS merge server-side.

### Non-blocking enhancements

- **`tokens` round-trip through init**: `emit-theme.ts:62-68` documents the TODO — global tokens
  (e.g. `--radius-factor` override) are not yet written to `:root`. Wire `preset.tokens` into
  `emitPresetLightVars` and expand `PublishPreset` (`www/src/publisher/types.ts:79`) to carry `tokens`.
- **Showcase context files as registry items**: extract `lib/context`, `hooks/use-image-loading-status`,
  `modules/core/styles.tsx` as registered items so `shadcn add @dotui/showcase` can pull everything
  transitively without manual copies.

---

## 8. Schema / meta.ts changes

No changes to `RegistryItem` (`www/src/registry/types.ts:69`) are required for either button.

If a showcase registry item is implemented (Option A above), add it to the registry with any of
the existing `type` values supported by the shadcn schema. The build glob
(`scripts/registry-build.ts:370`) will auto-discover a new `showcase/meta.ts` under
`www/src/registry/`. Integrity guards only check `name` uniqueness, declared `registryDependencies`,
and `files` — a showcase item with all its deps declared will pass.

---

## 9. Limitations, risks, fallbacks

| Issue | Impact | Fallback |
|---|---|---|
| `/r/registry.json` does not exist today | MCP button is fully blocked | Build the index route first (§7 Blocker 1) |
| `registry:mcp` subcommand may require shadcn canary | MCP server install fails silently | Pin the working version in `args`; show version in tooltip |
| `cursor://` deep-link only works if Cursor is installed | Click does nothing on machines without Cursor | Add `title` attribute: "Requires Cursor desktop app" |
| `cursor://` deep-link does not open a specific file or folder | User lands in Cursor without the project open | Pair with the copy-command button for project setup |
| MCP install alone does NOT pre-install components | User must run `shadcn add` commands manually or via agent | Document this clearly; the copy-command button handles it |
| `tokens` not wired through init | `--radius-factor` overrides in user preset are lost | Acceptable gap; plain color + density + component params all work |
| Showcase context files not in registry | `<Cards />` fails to compile without manual copies | Document the 4 extra files; or land §7 Optional before launch |
| GitHub avatar CDN images in showcase | May fail in offline/restricted environments | `AvatarFallback` already handles missing images gracefully |
| `DesignSystemProvider` from `starter-themes` depends on TanStack Router | Not portable to plain Vite/Next.js | Replace with `next-themes` or an inline `<script>` for dark mode |
| Color `fixed` algorithm stripped by `sanitizeColor` | A preset with `algorithm:"fixed"` falls back to default colors | Codec fallback is intentional; document it |

---

## 10. Step-by-step implementation checklist

### Phase 0 — Prerequisite (blocks MCP path)

- [ ] **Create `/r/registry.json` route**
  - File: `www/src/routes/r/registry[.]json.tsx`
  - Import `registryUi`, `registryLib`, `registryHooks`, `registryBase` from their re-export barrels
  - Emit `{ name: "dotui", homepage: "https://dotui.com", items: [...] }` stripping `group`, `params`, `files`
  - Add the same `Cache-Control` headers as `$name.tsx:27-30`
  - Verify: `curl https://dotui.com/r/registry.json | jq '.items | length'` should return 63+

### Phase 1 — MCP install button

- [ ] Verify `shadcn@latest registry:mcp` works (or determine the correct pinned version)
- [ ] Build the server config JSON and base64-encode it:

```ts
const serverConfig = {
  command: "npx",
  args: ["-y", "shadcn@latest", "registry:mcp"],   // pin version if needed
  env: { REGISTRY_URL: "https://dotui.com/r/registry.json" }
};
const configB64 = btoa(JSON.stringify(serverConfig));
const deeplinkUrl = `cursor://anysphere.cursor-deeplink/mcp/install?name=dotUI-registry&config=${configB64}`;
```

- [ ] Add an `OpenInCursor` button component (e.g. `www/src/components/marketing/open-in-cursor.tsx`):
  - Renders an `<a href={deeplinkUrl}>` with the Cursor icon
  - No preset param needed in the deep-link URL (preset lives in the per-item URLs baked by init)
  - Add `title="Requires Cursor desktop app"` for discoverability
- [ ] Place button in the customizer panel (`www/src/modules/create/`) next to the existing `InstallCommand`
- [ ] Manual test: click button on a machine with Cursor installed; confirm MCP panel shows the server

### Phase 2 — Copy-command button (secondary, showcase-preinstalled)

The `InstallCommand` component (`www/src/modules/create/install-command.tsx`) already computes
`npx shadcn add <init-url?preset=encoded>`. The secondary button is essentially a styled version
of this that also includes the per-component add commands for the full showcase set.

- [ ] Create a `CopyShowcaseInstallCommand` component that builds a multi-line script:

```ts
function buildShowcaseScript(host: string, encoded: string | undefined): string {
  const presetSuffix = encoded ? `?preset=${encoded}` : "";
  const initUrl = `${host}/r/init${presetSuffix}`;
  const componentUrls = SHOWCASE_COMPONENT_NAMES.map(
    (name) => `  ${host}/r/${name}${presetSuffix} \\`
  ).join("\n");
  return [
    `npx shadcn add ${initUrl}`,
    `npx shadcn add \\`,
    componentUrls,
  ].join("\n");
}

const SHOWCASE_COMPONENT_NAMES = [
  "accordion","avatar","badge","button","calendar","card","checkbox","checkbox-group",
  "color-area","color-editor","color-field","color-slider","color-thumb","disclosure",
  "drop-zone","field","file-trigger","group","input","kbd","link","list-box","loader",
  "otp-field","popover","progress-bar","radio-group","select","separator","slider",
  "switch","table","tabs","tag-group","text","text-field","time-field",
  "toggle-button","toggle-button-group"
];
```

- [ ] The button copies this script and shows a tooltip: "Installs all showcase components with your preset"

### Phase 3 — Documentation

- [ ] In the README / `/docs/open-in-cursor` page, explain:
  - The MCP button installs an agent tool; it does not pre-install components
  - Run the copy-command script in a new project first, then `cursor <dir>` to open it
  - The 4 internal files that must be copied manually until they become registry items:
    `src/registry/lib/context/index.tsx`, `src/registry/hooks/use-image-loading-status.ts`,
    `src/registry/__generated__/icons.tsx`, `src/modules/core/styles.tsx`

### Phase 4 — Optional polish

- [ ] Wire `tokens` through init (`emit-theme.ts:62-68` TODO) so `--radius-factor` overrides land in `:root`
- [ ] Extract `lib/context`, `hooks/use-image-loading-status`, and `modules/core/styles.tsx` as registered
      items, so `shadcn add @dotui/context` and `@dotui/use-image-loading-status` work
- [ ] Evaluate shipping a `showcase` registry item (§7 Option A) so a single
      `npx shadcn add https://dotui.com/r/showcase?preset=<encoded>` installs everything

---

## Sources

- Cursor MCP install deep-link: `cursor://anysphere.cursor-deeplink/mcp/install?name=...&config=...`
  documented in Cursor's changelog and the shadcn registry docs (verify current version at
  https://cursor.com/changelog and https://ui.shadcn.com/docs/registry/registry-json)
- shadcn registry MCP server command: `npx shadcn registry:mcp` with `REGISTRY_URL` env var;
  see https://ui.shadcn.com/docs/registry/registry-json for the registry index shape
- shadcn `registry:base` item and `cssVars.light/.dark` merge behaviour: https://ui.shadcn.com/docs/registry/registry-json
- dotUI preset codec: `www/src/modules/create/preset/codec.ts:75-126` (pako deflate + base64url)
- dotUI init route: `www/src/routes/r/init.tsx` + `www/src/publisher/emit-theme.ts:71-170`
- dotUI per-component route: `www/src/routes/r/$name.tsx` + `www/src/publisher/publish.ts:119-161`
- dotUI install command (live): `www/src/modules/create/install-command.tsx:39-48`
- Showcase component list: `www/src/components/marketing/showcase/cards.tsx`
- Registry item types: `www/src/registry/types.ts:43-78`
- Tailwind v4 cssVars limitation (shadcn issue #7119): colors must be in `cssVars.light/.dark`,
  not `cssVars.theme` only, for shadcn CLI to write them to globals.css
