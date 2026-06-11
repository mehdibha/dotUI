# Open in CodeSandbox

> Summary line: **implementable (Define API, single-click GET form)** · button type **sandbox-define** · preset fidelity **full** · color fidelity **full** (OKLCH ramps baked into globals.css at button-click time; no server-side step required after the parameters payload is built)

CodeSandbox supports a **Define API** that accepts a compressed, URL-encoded file tree and creates a
sandbox on-the-fly — no GitHub repo, no OAuth, no build step required. A single GET link or POST
form delivers the complete project (showcase source, all component files, themed globals.css) to the
user's browser in one click. This is the highest-fidelity "Open in" mechanism available for dotUI:
the user lands in a fully rendered, editable sandbox that shows `<Cards />` as the first view, all
components are in place under `ui/`, and the OKLCH palette from the chosen `?preset=` is written
into `globals.css`.

---

## 1. User experience

From the dotUI `/create` customizer (state lives in `?preset=<encoded>`, encoded by
`encodePreset()` in `www/src/modules/create/preset/codec.ts:75`):

1. The user tweaks colors, density, and component params on the customizer panel.
2. They click **"Open in CodeSandbox"**. The button is a plain `<a>` whose `href` is built
   client-side from the current `?preset=` value — no navigation away from dotUI, no server round-
   trip before the tab opens.
3. CodeSandbox receives the GET request, decompresses the `parameters` payload, and opens a new
   sandbox tab. The sandbox is a Vite + React + Tailwind CSS v4 project. Its `src/App.tsx` renders
   `<Cards />`. Its `src/globals.css` contains the OKLCH primitive ramps that correspond to the
   user's chosen seed colors. All 60 dotUI components are present under `src/components/ui/` with
   the user's chosen density and param variants baked in.
4. The sandbox hot-reloads immediately. The user sees the themed cards showcase — the same visual
   they were looking at on dotUI — and can begin editing.

**No login is required to create a CodeSandbox sandbox via the Define API.** The resulting sandbox
is anonymous (associated with the user's account if they are logged in, anonymous otherwise).

---

## 2. Technical mechanism

### 2a. The Define API

CodeSandbox exposes a **Define API** at:

```
POST https://codesandbox.io/api/v1/sandboxes/define
GET  https://codesandbox.io/api/v1/sandboxes/define?parameters=<payload>
```

The `parameters` value is the **lz-string `compressToBase64` (URL variant)** of a JSON object with shape:

```json
{
  "files": {
    "path/to/file": { "content": "<string content>" },
    "package.json":  { "content": "<stringified JSON>" }
  }
}
```

The GET form embeds the entire file tree in the URL; it works for payloads up to roughly 8 kB after
compression. Beyond that size the POST form is required (the browser can POST on navigation or via
`fetch` + redirect, or a hidden `<form method="POST">`).

References:
- Define API documentation: <https://codesandbox.io/docs/learn/sandboxes/cli-api>
- lz-string library: <https://github.com/pieroxy/lz-string>

### 2b. The lz-string encoding

lz-string's `compressToEncodedURIComponent` (also referred to as `compressToBase64` URL variant)
produces a URL-safe, ASCII-only compressed string. Install:

```bash
pnpm add lz-string
```

Encoding the file tree:

```ts
import LZString from "lz-string";

const parameters = LZString.compressToEncodedURIComponent(
  JSON.stringify({ files })
);
const url = `https://codesandbox.io/api/v1/sandboxes/define?parameters=${parameters}`;
```

### 2c. GET vs POST

| Criterion | GET | POST |
|---|---|---|
| Max size | ~8 kB compressed | unlimited |
| UX | `<a href={url}>` — zero JS required | hidden `<form>` submit or `fetch` + window.open |
| dotUI use case | viable only for a single component sandbox | required for a full 60-component sandbox |

For the full-showcase, all-components sandbox the uncompressed file tree is well over 200 kB (60
component files × ~3 kB each + globals). The POST form is the correct path:

```tsx
function openInCodeSandbox(files: Record<string, { content: string }>) {
  const parameters = LZString.compressToEncodedURIComponent(
    JSON.stringify({ files })
  );
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "https://codesandbox.io/api/v1/sandboxes/define";
  form.target = "_blank";
  const input = document.createElement("input");
  input.type = "hidden";
  input.name = "parameters";
  input.value = parameters;
  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}
```

The GET URL can still be used as a shareable permalink or for a single-component "Open in
CodeSandbox" button, since a single component + minimal boilerplate fits easily under 8 kB.

---

## 3. Preset propagation

The chosen preset is represented as the `?preset=<encoded>` search param produced by
`encodePreset(designSystem)` (`www/src/modules/create/preset/codec.ts:75`). The encoding is:

1. Diff `DesignSystem` against `DEFAULTS` (`www/src/modules/create/preset/defaults.ts:5`) →
   compact `DesignSystemState { p?, t?, d?, c? }` (`www/src/modules/create/preset/types.ts:14`).
2. `JSON.stringify` → `pako.deflateRaw(json, { level: 9 })` → URL-safe base64 (`toBase64Url`,
   `codec.ts:12`).
3. Returns `undefined` when nothing differs from defaults.

For the CodeSandbox path the preset must be **decoded at button-click time** to build the files map.
Two fields drive the output:

| Preset field | What it affects |
|---|---|
| `color: ColorConfig` | OKLCH primitive ramps in `globals.css` `:root` / `.dark` |
| `density: Density` | class strings baked into each component file via `flatten` |
| `componentParams` | per-component enum / scalar choices folded into `tv()` class strings |

All three are available from `decodePreset(encodedPreset)` (`codec.ts:111`). The decoded value is a
full `DesignSystem`; narrow it to `PublishPreset` for the publisher:

```ts
import { decodePreset } from "@/modules/create/preset/codec";
import type { PublishPreset } from "@/publisher/types";

function presetFromEncoded(encoded: string | undefined): PublishPreset {
  if (!encoded) return { density: "compact", componentParams: {} };
  const ds = decodePreset(encoded);          // codec.ts:111 — falls back to DEFAULTS on error
  return {
    color:           ds.color,
    density:         ds.density,
    componentParams: ds.componentParams,
  };
}
```

`encodePreset` returns `undefined` when the user has not changed anything. The button must handle
this: `undefined` → use `{ density: "compact", componentParams: {} }` (no color override → static
default ramps from `__generated__/base-css.ts` are used as-is).

---

## 4. Components installed

The sandbox must include every dotUI component the showcase consumes. The full transitive set (from
the showcase internals map) spans 38 registry items (listed below). Rather than making 38 network
calls to `/r/<name>?preset=<encoded>`, dotUI builds the file content server-side at click time by
calling the existing publisher functions directly.

### 4a. The set of components needed for `<Cards />`

From `www/src/components/marketing/showcase/cards.tsx` and its 17 sub-cards, the transitive
`registry/ui/*` components are:

```
accordion, avatar, badge, button, calendar, card, checkbox, checkbox-group,
color-area, color-editor, color-field, color-slider, color-thumb, disclosure,
drop-zone, field, file-trigger, group, input, kbd, link, list-box, loader,
otp-field, popover, progress-bar, radio-group, select, separator, slider,
switch, table, tabs, tag-group, text, text-field, time-field,
toggle-button, toggle-button-group
```

Plus the two lib items always bundled with the init item: `utils` and `focus-styles`.

### 4b. Building component file content from the publisher

The publisher pipeline lives entirely in `www/src/publisher/publish.ts:119` (`publish()`) and the
generated publishables in `www/src/registry/__generated__/publishables/`. After `pnpm build:registry`
each publishable is available as a dynamic import:

```ts
import { publishables, PUBLISHABLE_NAMES } from "@/registry/__generated__/publishables";
import { publish, setKnownDotuiNames, setDotuiDepResolver } from "@/publisher/publish";
import { format } from "oxfmt";

// called once at server/worker startup
setKnownDotuiNames(PUBLISHABLE_NAMES);

async function buildComponentFiles(
  names: string[],
  preset: PublishPreset,
): Promise<Record<string, { content: string }>> {
  const files: Record<string, { content: string }> = {};
  for (const name of names) {
    const loader = publishables[name];
    if (!loader) continue;
    const mod = await loader();
    // enum-with-files: loader ships base.spinner.tsx vs base.ring.tsx depending on preset
    const publishable = selectPublishable(mod, preset);   // logic from $name.tsx:89-107
    const { item, rawContent } = publish({ publishable, preset });
    let content = rawContent;
    try {
      const r = await format(publishable.meta.files?.[0]?.target ?? "ui.tsx", rawContent, {
        printWidth: 120, useTabs: true,
      });
      content = r.code;
    } catch { /* keep raw */ }
    // target = consumer path like "ui/button.tsx" → map to "src/components/ui/button.tsx"
    const target = publishable.meta.files?.[0]?.target ?? `ui/${name}.tsx`;
    files[`src/components/${target}`] = { content };
  }
  return files;
}
```

The `selectPublishable` function (private to `$name.tsx:89-107`) must be extracted to a shared
helper (see section 7). It handles the `loader` component's `style` enum (spinner vs ring).

### 4c. Target paths in the sandbox

shadcn aliases are:

| Alias | Sandbox path |
|---|---|
| `@/components/ui/` | `src/components/ui/` |
| `@/lib/` | `src/lib/` |
| `@/hooks/` | `src/hooks/` |

All component `meta.ts` files declare `target` paths relative to the consumer's `src/`. For example,
`button` → `ui/button.tsx` → sandbox path `src/components/ui/button.tsx`. Lib items ship to
`src/lib/` (e.g. `src/lib/utils.ts`).

---

## 5. Theme in globals.css

The theme is built by `emitInitItem()` (`www/src/publisher/emit-theme.ts:71`), which already exists
for the `/r/init` route. For the CodeSandbox path, call it directly and serialize its `css` and
`cssVars` fields to a `globals.css` string.

### 5a. Getting the init item

```ts
import { emitInitItem } from "@/publisher/emit-theme";
import { baseRegistryCss } from "@/registry/__generated__/base-css";

const initItem = emitInitItem({
  baseRegistryCss,
  preset,
  encodedPreset,
  registryRoot: "https://dotui.com",
});
// initItem.css    → the structured CSS object (at-rules, :root ramps, .dark ramps)
// initItem.cssVars.theme → the @theme inline block
```

### 5b. Serializing the CSS object to a string

shadcn's own CLI serializes the structured `css` + `cssVars.theme` into a globals.css string
internally. For the CodeSandbox builder, dotUI needs a `registryItemToCss(item)` serializer. The
existing `cssToRegistryFields()` (`www/src/publisher/build-time/css-to-registry-fields.ts:30`) is
the inverse parser — write the matching forward serializer:

```ts
function registryItemToCss(item: ReturnType<typeof emitInitItem>): string {
  const lines: string[] = [];
  lines.push('@import "tailwindcss";');
  lines.push('@import "@fontsource-variable/geist";');
  lines.push('@import "@fontsource/geist-mono";');
  lines.push("");

  const { css, cssVars } = item;

  // @theme inline — the constant semantic + radius layer
  if (cssVars?.theme && Object.keys(cssVars.theme).length > 0) {
    lines.push("@theme inline {");
    for (const [k, v] of Object.entries(cssVars.theme)) {
      lines.push(`  ${k}: ${v};`);
    }
    lines.push("}");
    lines.push("");
  }

  // At-rules (imports, plugins, utilities, layers) — everything in css except :root / .dark
  if (css) {
    for (const [selector, block] of Object.entries(css)) {
      if (selector === ":root" || selector === ".dark") continue;
      lines.push(serializeCssBlock(selector, block));
      lines.push("");
    }

    // :root and .dark last — these are the preset-specific primitive ramps
    for (const sel of [":root", ".dark"]) {
      if (css[sel]) {
        lines.push(serializeCssBlock(sel, css[sel]));
        lines.push("");
      }
    }
  }

  return lines.join("\n");
}

function serializeCssBlock(selector: string, block: unknown): string {
  if (typeof block !== "object" || block === null) return `${selector} {}`;
  const lines = [`${selector} {`];
  for (const [k, v] of Object.entries(block as Record<string, string>)) {
    lines.push(`  ${k}: ${v};`);
  }
  lines.push("}");
  return lines.join("\n");
}
```

For a preset with a custom color (e.g. the user picked a red accent seed),
`emitInitItem → mergePresetCssFields` (`emit-theme.ts:145`) calls `resolveColorConfig(preset.color)`
which regenerates the OKLCH ramps and overrides `css[":root"]` and `css[".dark"]` with
`--neutral-50 … --info-950`. The serializer above faithfully writes those into `globals.css`.

### 5c. What the resulting globals.css looks like (preset example)

For a preset with `color.seeds.accent = "#e84040"` (custom red):

```css
@import "tailwindcss";
@import "@fontsource-variable/geist";
@import "@fontsource/geist-mono";

@theme inline {
  --radius-md: calc(0.375rem * var(--radius-factor));
  --color-bg: var(--neutral-50);
  --color-accent: var(--accent-500);
  --color-fg-on-accent: var(--on-accent-500);
  /* ... ~80 semantic tokens ... */
}

@import "tw-animate-css";
@plugin "tailwindcss-react-aria-components";
@plugin "tailwindcss-autocontrast" { cssfile: "./src/globals.css"; }
@plugin "tailwindcss-with";
@custom-variant dark (&:is(.dark *));
@utility focus-ring { /* ... */ }
@layer base { * { @apply border-border } body { @apply bg-bg font-sans text-fg } }

:root {
  --radius-factor: 1;
  --neutral-50: oklch(0.985 0 0);
  /* ... */
  --accent-50: oklch(0.971 0.019 20.4);   /* red-tinted, generated from #e84040 seed */
  --accent-500: oklch(0.538 0.224 20.4);
  /* ... 66 total ramp vars ... */
}
.dark {
  --neutral-50: oklch(0.13 0 0);          /* reversed */
  --accent-50: oklch(0.201 0.058 20.4);
  /* ... */
}
```

The `tailwindcss-autocontrast` plugin will inject `--on-accent-*` at Tailwind compile time inside
the sandbox.

### 5d. Per-component CSS

Each component's `styles.css` (e.g. `avatar/styles.css`, `slider/styles.css`) carries component-
level CSS vars (`--avatar-radius`, `--slider-*`). These are present in each component's emitted
`item.css` and `item.cssVars`. Two options:

1. **Append each component's CSS to globals.css** — call `publish()` for each component and
   concatenate `item.css` blocks into the globals.css string. Simple; one file.
2. **Import per-component CSS files separately** — write `src/components/ui/avatar.css` and import
   in `avatar.tsx`. More idiomatic; matches how shadcn delivers components.

Option 1 is simpler for the Define API approach (fewer files in the payload).

---

## 6. The showcase as first view

The showcase is `www/src/components/marketing/showcase/cards.tsx` and its 17 sibling files
(`booking.tsx`, `two-factor.tsx`, … `login-form.tsx`). They are **pure client components** — no
server functions, no loaders, all static data. They can be copied verbatim into the sandbox.

### 6a. Files to include

```
src/components/marketing/showcase/cards.tsx
src/components/marketing/showcase/booking.tsx
src/components/marketing/showcase/two-factor.tsx
src/components/marketing/showcase/filters.tsx
src/components/marketing/showcase/storage.tsx
src/components/marketing/showcase/notifications.tsx
src/components/marketing/showcase/cookie-preferences.tsx
src/components/marketing/showcase/invite-members.tsx
src/components/marketing/showcase/shortcuts.tsx
src/components/marketing/showcase/payment.tsx
src/components/marketing/showcase/transactions.tsx
src/components/marketing/showcase/account-menu.tsx
src/components/marketing/showcase/faq.tsx
src/components/marketing/showcase/color-editor.tsx
src/components/marketing/showcase/upload-avatar.tsx
src/components/marketing/showcase/team-name.tsx
src/components/marketing/showcase/feedback.tsx
src/components/marketing/showcase/login-form.tsx
```

These files import from `@/registry/ui/*`, `@/registry/lib/utils`, and `@/registry/__generated__/icons`.
In the sandbox those resolve to `src/components/ui/*`, `src/lib/utils`, and the icons file.

### 6b. `App.tsx` — the first view

```tsx
import "./globals.css";
import { Cards } from "@/components/marketing/showcase/cards";

export default function App() {
  return (
    <div className="min-h-screen bg-bg font-sans text-fg antialiased">
      <main className="container mx-auto py-12 px-4">
        <Cards />
      </main>
    </div>
  );
}
```

No `ThemeProvider` (from `packages/starter-themes`) is needed in the sandbox because that package
depends on `@tanstack/react-router`'s `ScriptOnce`. Replace with a minimal inline script that adds
the `dark` class to `<html>` if the user prefers dark mode:

```html
<!-- index.html <head> -->
<script>
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.classList.add("dark");
  }
</script>
```

`DesignSystemProvider` (`www/src/modules/core/styles.tsx:61`) can be omitted — its default context
value `{ params: {}, tokens: {}, density: "default" }` gives every component its default visual
variant, which is fine because all variant choices are already baked into the component files by the
publisher.

### 6c. Non-showcase files required

```
src/lib/utils.ts          (cn helper — shipped inline by emitInitItem.files[0])
src/lib/context.tsx       (createContext, createScopedContext — used by avatar, tabs, button)
src/hooks/use-image-loading-status.ts  (used by avatar/base.tsx)
src/registry/__generated__/icons.tsx  (ExternalLinkIcon used in invite-members.tsx)
```

`context.tsx` and `use-image-loading-status.ts` are **not registered items** today
(`UNREGISTERED_DEP_ALLOWLIST`, `scripts/registry-build.ts:464`) — they must be copied from source
into the sandbox. Their source paths:
- `www/src/registry/lib/context/index.tsx`
- `www/src/registry/hooks/use-image-loading-status.ts`
- `www/src/registry/__generated__/icons.tsx`

---

## 7. What dotUI must build

### 7a. New server endpoint: `POST /api/open-in/codesandbox`

A TanStack Start server function (or route handler) that:

1. Reads `?preset=<encoded>` (or body JSON `{ preset }` for POST).
2. Calls `decodePreset(encoded)` → `PublishPreset`.
3. Calls `emitInitItem(...)` to build the init item; serializes it to a `globals.css` string.
4. Iterates over the showcase component set (38 names); calls `publish()` for each.
5. Reads the 18 showcase source files verbatim (at build-time snapshot or from disk).
6. Reads the 3 non-registered files (`context.tsx`, `use-image-loading-status.ts`, `icons.tsx`).
7. Assembles the full `files` map (see §7b).
8. Returns `{ parameters: LZString.compressToEncodedURIComponent(JSON.stringify({ files })) }`.

The client button `fetch`es this endpoint and uses the response to POST to the Define API.

**Alternatively**, steps 1–8 can run entirely in the browser if the codec and publisher are bundled
into the client. That avoids a new server endpoint but bloats the client bundle significantly
(pako + publisher logic + all publishables). A server-side approach is strongly preferred.

### 7b. Concrete files map shape

```jsonc
{
  "files": {
    "package.json":              { "content": "..." },
    "index.html":                { "content": "..." },
    "vite.config.ts":            { "content": "..." },
    "tsconfig.json":             { "content": "..." },
    "src/main.tsx":              { "content": "..." },
    "src/App.tsx":               { "content": "..." },
    "src/globals.css":           { "content": "<serialized theme>" },

    // showcase files (verbatim copies)
    "src/components/marketing/showcase/cards.tsx":        { "content": "..." },
    "src/components/marketing/showcase/booking.tsx":      { "content": "..." },
    // ... 16 more ...

    // registry/lib (not registered — must copy)
    "src/lib/utils.ts":                                   { "content": "<cn helper>" },
    "src/lib/context.tsx":                                { "content": "..." },
    "src/hooks/use-image-loading-status.ts":              { "content": "..." },
    "src/components/ui/icons.tsx":                        { "content": "..." },

    // all 38 ui components (publisher output, preset-baked)
    "src/components/ui/button.tsx":                       { "content": "<published tv source>" },
    "src/components/ui/card.tsx":                         { "content": "..." },
    // ... 36 more ...
  }
}
```

### 7c. `selectPublishable` extraction

The helper `selectPublishable` (currently defined privately in `www/src/routes/r/$name.tsx:89-107`)
must be exported from a shared module — e.g. `www/src/publisher/select-publishable.ts` — so the
CodeSandbox builder can call it without duplicating logic. It handles the `loader` component's
`style` param (spinner vs ring file swap).

### 7d. `registryItemToCss` serializer

A new function `www/src/publisher/emit-globals-css.ts` that converts an `emitInitItem` result to a
CSS string (sketched in §5b above). This is reusable for all "Open in" targets (StackBlitz, etc.).

### 7e. Snapshot of showcase source files

The 18 showcase files and the 3 non-registered lib files must be readable at request time. Options:
1. Read them from disk at runtime (`fs.readFile`, works in a Node.js TanStack Start server).
2. Embed them as build-time string constants (generated by `registry-build.ts` or a dedicated
   `build:showcase-snapshot` step) — more portable, works in an edge runtime.

Option 2 is preferred for Vercel deployment (edge functions do not have `fs` access to source).
Add a `renderShowcaseSnapshot()` step to `scripts/registry-build.ts` that writes
`www/src/registry/__generated__/showcase-snapshot.ts` exporting `SHOWCASE_FILES: Record<string, string>`.

### 7f. `package.json` for the sandbox

```json
{
  "name":    "dotui-sandbox",
  "private": true,
  "type":    "module",
  "scripts": {
    "dev":   "vite",
    "build": "tsc && vite build"
  },
  "dependencies": {
    "react":                          "^19.0.0",
    "react-dom":                      "^19.0.0",
    "react-aria-components":          "^1.7.0",
    "react-aria":                     "^3.37.0",
    "react-stately":                  "^3.35.0",
    "@internationalized/date":        "^3.6.0",
    "@base-ui/react":                 "^1.0.0",
    "tailwind-variants":              "^0.3.0",
    "clsx":                           "^2.1.1",
    "tailwind-merge":                 "^2.5.4",
    "lucide-react":                   "^0.454.0",
    "@fontsource-variable/geist":     "^5.1.1",
    "@fontsource/geist-mono":         "^5.0.2"
  },
  "devDependencies": {
    "vite":                           "^6.0.0",
    "@vitejs/plugin-react":           "^4.3.4",
    "typescript":                     "^5.7.0",
    "tailwindcss":                    "^4.0.0",
    "@tailwindcss/vite":              "^4.0.0",
    "tw-animate-css":                 "^1.2.4",
    "tailwindcss-react-aria-components": "^2.1.1",
    "tailwindcss-autocontrast":       "^0.3.0",
    "tailwindcss-with":               "^0.1.0"
  }
}
```

Note: `tailwindcss-autocontrast` and `tailwindcss-with` are currently workspace packages. They must
be published to npm for the sandbox to install them (see §9 — Limitations).

### 7g. `vite.config.ts` for the sandbox

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

---

## 8. Schema / meta.ts changes

No changes to `RegistryItem` or any `ui/*/meta.ts` are required for the CodeSandbox path. The
publisher (`publish.ts`, `emit-theme.ts`) already exposes all the needed APIs. The only new
structural work is:

1. Extract `selectPublishable` to a shared file (§7c).
2. Add `renderShowcaseSnapshot()` to `scripts/registry-build.ts` (§7e).
3. Add `www/src/publisher/emit-globals-css.ts` (the CSS serializer, §7d).
4. Add a new TanStack Start server route `www/src/routes/api/open-in/codesandbox.tsx`.

Optionally, a future `openIn?: { codesandbox?: boolean }` field on `RegistryItem` could gate
which components are included in the sandbox bundle, but it is not required for an initial
implementation that always ships the full showcase set.

---

## 9. Limitations, risks, fallbacks

### 9a. Payload size

The full 60-component + showcase file tree, serialized and lz-string compressed, is expected to be
in the 100–400 kB range (lz-string is significantly less efficient than pako deflate). CodeSandbox
**does not document a maximum POST body size** for the Define API, but community reports suggest
limits around 5–10 MB uncompressed. The full tree is well under that. Use the POST form; do not
attempt the GET URL for the full bundle.

For a **single-component** "Open in CodeSandbox" button (one component + minimal deps + a tiny
`App.tsx`), the GET URL form works fine.

### 9b. Workspace-only npm packages

`tailwindcss-autocontrast` (`packages/tailwindcss-autocontrast`) and `tailwindcss-with`
(`packages/tailwindcss-with`) are workspace packages not yet published to npm. The sandbox
`package.json` references them by name, so npm install will fail unless they are published first.
**Blocker for the feature.** Resolution: publish both to npm under `@dotui/tailwindcss-autocontrast`
and `@dotui/tailwindcss-with` (or unprefixed) before shipping the "Open in CodeSandbox" button.

Until then, a fallback is to vendor the built plugin JS inline in `vite.config.ts` as a local
Vite plugin, but that is fragile.

### 9c. CodeSandbox sandbox lifetime

Sandboxes created via the Define API are **ephemeral** if the user is not logged in — they may be
garbage-collected. Logged-in users get the sandbox saved to their account. This is acceptable for
an "Open in" flow; document it in the UI tooltip ("Sign in to CodeSandbox to save your sandbox").

### 9d. `tailwindcss-autocontrast` `cssfile` path

In the static default, `base.css` points `@plugin "tailwindcss-autocontrast" { cssfile: "./src/styles.css"; }`.
In the sandbox it must point at `./src/globals.css`. The `registryItemToCss` serializer (§5b) must
rewrite this path when building the globals.css string.

### 9e. `ThemeProvider` / dark-mode flash

`packages/starter-themes` requires `@tanstack/react-router` and is not suitable for a plain Vite
sandbox. The inline `<script>` in `index.html` (§6b) covers the flash-of-unstyled-content on first
load. For dark-mode toggle in the sandbox, a simple `useState` + `document.documentElement.classList.toggle("dark")`
button in `App.tsx` is sufficient and has no external dep.

### 9f. `@/registry/__generated__/icons.tsx` path alias

The showcase `invite-members.tsx` imports `ExternalLinkIcon` from `@/registry/__generated__/icons`.
In the sandbox the `@/` alias points at `src/`, so the file should be placed at
`src/registry/__generated__/icons.tsx` OR the import should be rewritten to `src/components/ui/icons.tsx`
(or replaced with a direct `lucide-react` import). The simplest fix: write a tiny `icons.tsx` shim
in the sandbox at the expected alias path that just re-exports from `lucide-react`.

### 9g. Color accuracy (OKLCH in Tailwind v4)

All emitted ramp values are `oklch(L C H)` strings. Tailwind CSS v4 natively passes `oklch()`
through to the browser; no conversion is needed. The `tailwindcss-autocontrast` plugin reads
`:root`/`.dark` via culori (which speaks OKLCH) to compute `--on-*` foregrounds. There is **no
color accuracy loss** in the CodeSandbox output — the sandbox faithfully renders the same palette
the user designed.

### 9h. `@base-ui/react` sub-path import

`otp-field/base.tsx` imports from `@base-ui/react/otp-field` and `toast/base.tsx` from
`@base-ui/react/toast`. These are sub-path exports from the `@base-ui/react` package. `@base-ui/react`
must be in `package.json` at `^1.0.0` or later (which exports these paths). The sandbox `package.json`
above includes it.

---

## 10. Step-by-step implementation checklist

- [ ] **Publish workspace Tailwind plugins** (`tailwindcss-autocontrast`, `tailwindcss-with`) to npm
      before any other step (§9b blocker).

- [ ] **Extract `selectPublishable`** from `www/src/routes/r/$name.tsx:89-107` into
      `www/src/publisher/select-publishable.ts` and update the route to import from there (§7c).

- [ ] **Write `emit-globals-css.ts`** at `www/src/publisher/emit-globals-css.ts` implementing
      `registryItemToCss(item)` including the `cssfile` path rewrite for `tailwindcss-autocontrast`
      (§5b, §9d).

- [ ] **Add `renderShowcaseSnapshot()`** to `www/scripts/registry-build.ts` that reads the 18
      showcase files + `context/index.tsx` + `use-image-loading-status.ts` + `icons.tsx` at build
      time and emits `www/src/registry/__generated__/showcase-snapshot.ts` exporting
      `SHOWCASE_FILES: Record<string, string>` (§7e).

- [ ] **Run `pnpm build:registry`** to materialize `showcase-snapshot.ts` and verify the emitted
      file list.

- [ ] **Write the server route** `www/src/routes/api/open-in/codesandbox.tsx` that:
      - Accepts `GET ?preset=<encoded>` (or `POST { preset }`).
      - Decodes preset via `decodePreset`.
      - Calls `emitInitItem` + `registryItemToCss` → `globals.css` content.
      - Iterates over the 38-component showcase set; calls `publish()` + `selectPublishable()` for each.
      - Merges `SHOWCASE_FILES` into the files map.
      - Adds the boilerplate files (`package.json`, `vite.config.ts`, `tsconfig.json`,
        `index.html`, `src/main.tsx`, `src/App.tsx`).
      - Returns `{ parameters: LZString.compressToEncodedURIComponent(JSON.stringify({ files })) }`.

- [ ] **Add `lz-string`** to `www/package.json` dependencies. Verify types (`@types/lz-string`).

- [ ] **Write the client-side button component** at e.g.
      `www/src/components/marketing/open-in-codesandbox.tsx` that:
      - Reads `?preset` from the route search via `useSearch()`.
      - `fetch`es `/api/open-in/codesandbox?preset=${encoded}`.
      - On response, creates a hidden `<form method="POST">` targeting
        `https://codesandbox.io/api/v1/sandboxes/define` and submits it (§2c).
      - Shows a loading state while the server builds the payload.

- [ ] **Fix the `@/registry/__generated__/icons` alias** in the sandbox by writing a shim at
      `src/registry/__generated__/icons.tsx` (or rewrite the import in the showcase snapshot at
      build time) that re-exports `ExternalLinkIcon` from `lucide-react` (§9f).

- [ ] **Fix `tailwindcss-autocontrast` cssfile path** in the emitted globals.css: the serializer
      should emit `cssfile: "./src/globals.css"` not the registry's `"./src/styles.css"` (§9d).

- [ ] **Write `src/main.tsx`** content:
      ```tsx
      import { StrictMode } from "react";
      import { createRoot } from "react-dom/client";
      import App from "./App";
      createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
      ```

- [ ] **Write `index.html`** content including the dark-mode inline script (§6b).

- [ ] **Test end-to-end** with a default preset (no `?preset=` → static ramps) and with a custom
      accent color preset, verifying:
      - [ ] `globals.css` contains the expected OKLCH ramps.
      - [ ] All 38 component files are present in the sandbox.
      - [ ] `<Cards />` renders without console errors in the sandbox.
      - [ ] `tailwindcss-autocontrast` injects `--on-accent-*` at compile time inside the sandbox.

- [ ] **(Optional) Add a single-component GET URL form** for per-component "Open in CodeSandbox"
      buttons on the component docs pages — these are small enough for the GET form (§2c).

---

## Sources

- CodeSandbox Define API: <https://codesandbox.io/docs/learn/sandboxes/cli-api>
- lz-string (`compressToEncodedURIComponent`): <https://github.com/pieroxy/lz-string>
- Preset codec (encode/decode, pako deflate, base64url): `www/src/modules/create/preset/codec.ts:12-126`
- `encodePreset` live usage: `www/src/modules/create/install-command.tsx:39-48`
- `/r/init` route: `www/src/routes/r/init.tsx:22-59`
- `/r/$name` route + `selectPublishable`: `www/src/routes/r/$name.tsx:32-121`
- `emitInitItem` + `mergePresetCssFields` + `rampsToVars`: `www/src/publisher/emit-theme.ts:71-170`
- `baseRegistryCss` (static structured CSS): `www/src/registry/__generated__/base-css.ts`
- Publisher pipeline (`publish`, `flatten`, `resolveClasses`, `serialize`): `www/src/publisher/publish.ts:119-161`
- Showcase cards + transitive component set: `www/src/components/marketing/showcase/cards.tsx:20-48`
- Non-registered lib files: `www/src/registry/lib/context/index.tsx`, `www/src/registry/hooks/use-image-loading-status.ts`, `www/src/registry/__generated__/icons.tsx`
- `cssToRegistryFields` (inverse CSS parser, reference for forward serializer): `www/src/publisher/build-time/css-to-registry-fields.ts:30`
- `tailwindcss-autocontrast` plugin (cssfile option, culori parsing): `packages/tailwindcss-autocontrast/src/index.js:233-501`
- `BUNDLED_INTO_INIT` (which deps are dropped from component registryDependencies): `www/src/publisher/publish.ts:52-59`
- `DEFAULT_DEPENDENCIES` for init item: `www/src/publisher/emit-theme.ts:31-39`
