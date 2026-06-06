# Open in StackBlitz

> Viable · button type **sandbox-define** · preset fidelity **full** · color fidelity **full**

StackBlitz's programmatic project definition API lets dotUI construct an exact in-memory file tree at button-click time — components already resolved to the chosen preset, globals.css carrying the correct OKLCH ramps, and the showcase as `App.tsx`. This is the strongest "Open in" integration available: no GitHub import lag, no default-preset fallback, no shadcn CLI network round-trip at first render.

---

## 1. User experience

1. User lands on the dotUI `/create` page and customises their design system (accent seed, density, component params).
2. They click **Open in StackBlitz**. The button fires `sdk.openProject(payload, { openFile: "src/App.tsx" })` in the same tab (or new tab via `newWindow: true`).
3. StackBlitz boots a WebContainers environment with the provided file tree. Vite starts automatically (`startScript: "dev"`). The browser tab shows the showcase cards running under the chosen theme — no install step required by the user.
4. From that point the project is fully editable: the user can modify card components, swap tokens in `globals.css`, or run `npx shadcn add @dotui/<name>?preset=<encoded>` inside the StackBlitz terminal to fetch additional components with preset fidelity preserved.

---

## 2. Technical mechanism

### Primary: `@stackblitz/sdk` — `openProject`

```ts
import sdk from "@stackblitz/sdk";

sdk.openProject(project, {
  openFile: "src/App.tsx",
  newWindow: true,
});
```

`project` is a plain JS object (`Project` type from the SDK):

```ts
interface Project {
  title: string;
  description?: string;
  template: "node";           // WebContainers: Node runtime
  files: Record<string, string>; // path → file content (strings)
  dependencies?: Record<string, string>;
  settings?: { compile?: { trigger?: "auto" | "keystroke" } };
}
```

All files are **strings embedded in the JS bundle** — they are transmitted as part of the POST payload the SDK constructs. No network call to dotUI's registry is made before StackBlitz boots; the preset is already baked into every file.

### Alternative: POST form to `https://stackblitz.com/run`

For use cases where the SDK cannot be imported (a plain `<form>`, server-side render, email links):

```html
<form method="POST" action="https://stackblitz.com/run" target="_blank">
  <input type="hidden" name="project[title]" value="dotUI Showcase" />
  <input type="hidden" name="project[template]" value="node" />
  <input type="hidden" name="project[files][package.json]" value="..." />
  <input type="hidden" name="project[files][src/App.tsx]" value="..." />
  <!-- one hidden input per file -->
  <button type="submit">Open in StackBlitz</button>
</form>
```

This is the same mechanism the SDK uses internally. It is limited by browser URL/POST-body size but works fine for the dotUI showcase payload (all files are source; no binary assets).

### Runtime environment

StackBlitz WebContainers runs a browser-native Node.js. Vite + React + Tailwind CSS v4 work without modification. The `@plugin` directives in `globals.css` (including `tailwindcss-autocontrast`) run through Vite's Tailwind v4 plugin at dev-server startup — the `--on-*` foreground variables are derived at that point from the shipped OKLCH ramps.

---

## 3. Preset propagation

The chosen preset is a `DesignSystem` object in the browser, encoded via `encodePreset` from `www/src/modules/create/preset/codec.ts:75`.

```ts
// Encoding contract (codec.ts:75-94)
// 1. diff against DEFAULTS (www/src/modules/create/preset/defaults.ts:5)
// 2. JSON.stringify the compact DesignSystemState
// 3. pako.deflateRaw(json, { level: 9 })
// 4. base64url (+ → -, / → _, strip =)
const encoded: string | undefined = encodePreset(designSystem);
```

For the StackBlitz integration, **the encoded string is only needed to construct the file tree** — it is not passed as a URL parameter to StackBlitz. Instead:

- `globals.css` is built by calling the same `emitInitItem` logic that powers `GET /r/init?preset=<encoded>` (`www/src/publisher/emit-theme.ts:71`). The returned `{ css, cssVars }` fields are serialised to a CSS string and written directly into the StackBlitz file tree.
- Each component file under `src/ui/` is built by calling `publish({ publishable, preset })` (`www/src/publisher/publish.ts:119`) for each name in `PUBLISHABLE_NAMES`, exactly as `GET /r/<name>?preset=<encoded>` does at request time.

This means preset fidelity is **full and offline**: the user's exact OKLCH seeds, density setting, and component-param choices are baked into the files before the StackBlitz tab opens.

The encoded preset string is also written into a comment at the top of `src/globals.css` (e.g. `/* dotUI preset: <encoded> */`) so the user can reconstruct the dotUI customiser URL later:

```
https://dotui.com/create?preset=<encoded>
```

---

## 4. Components installed

All 60 registered UI items from `registryUi` (`www/src/registry/__generated__/registry-items.ts:70-129`) are installed. For the showcase specifically, the required subset is the 38 components listed in the transitive import graph of `Cards` (`www/src/components/marketing/showcase/cards.tsx`). However, shipping all 60 is simpler and costs little — each component is a single ~1–5 KB `.tsx` file.

Each file is produced by the same pipeline as `GET /r/<name>?preset=<encoded>`:

```ts
// Pseudocode — runs server-side, inside the dotUI www app
import { publishables, PUBLISHABLE_NAMES } from "@/registry/__generated__/publishables";
import { publish, setKnownDotuiNames, setDotuiDepResolver } from "@/publisher/publish";
import { format } from "oxfmt";

setKnownDotuiNames(PUBLISHABLE_NAMES);
// No dep-rewriting needed: all files ship inline, cross-component deps resolved locally
setDotuiDepResolver("", "");

const uiFiles: Record<string, string> = {};
for (const name of PUBLISHABLE_NAMES) {
  const mod = await publishables[name]();
  const publishable = selectPublishable(mod, preset); // handles loader spinner/ring swap
  const { item } = publish({ publishable, preset });
  for (const file of item.files) {
    // target is e.g. "ui/button.tsx" → install at src/components/ui/button.tsx
    const formatted = (await format(file.target, file.content, {
      printWidth: 120,
      useTabs: true,
    })).code;
    uiFiles[`src/components/${file.target}`] = formatted;
  }
}
```

The resulting entries look like:

```
src/components/ui/button.tsx
src/components/ui/card.tsx
src/components/ui/calendar.tsx
... (58 more)
src/lib/utils.ts         ← cn() helper from emitInitItem
```

The `registryDependencies` rewriting step (`publish.ts:79-105`) is not needed here because all files are already local. Items in `BUNDLED_INTO_INIT` (`focus-styles`, `theme`, `utils`) are already covered by `globals.css` and `src/lib/utils.ts`.

The **`loader` component** uses an enum-with-files param (`ui/loader/meta.ts:14-36`, values `["spinner","ring"]`). `selectPublishable` (currently private in `www/src/routes/r/$name.tsx:89-107`) reads `preset.componentParams.loader?.style` and returns the correct `publishable` from `mod.publishableByPath`. This logic must be extracted into a shared utility before the StackBlitz builder can reuse it.

---

## 5. Theme in globals.css

`globals.css` is assembled by reusing `emitInitItem` (`www/src/publisher/emit-theme.ts:71`) and serialising its structured output back to a CSS string.

### What `emitInitItem` produces (for a custom preset)

`mergePresetCssFields` (`emit-theme.ts:145-170`) takes `baseRegistryCss` (`www/src/registry/__generated__/base-css.ts`, the structured form of `registry/base/base.css` + `colors.css` + `theme.css` + `fonts.css`) and merges:

- **Static at-rules**: `@import "tw-animate-css"`, `@plugin "tailwindcss-react-aria-components"`, `@plugin "tailwindcss-autocontrast" { cssfile: "./src/globals.css" }`, `@plugin "tailwindcss-with"`, `@custom-variant dark (&:is(.dark *))`, `@utility focus-ring/focus-reset/focus-input/no-highlight`, `@layer base` resets, `::selection` rule. These are constant across presets.
- **`css[":root"]`**: `--radius-factor: 1` plus the **full light OKLCH ramp** (6 palettes × 11 steps = 66 vars). When `preset.color` is set, `resolveColorConfig(preset.color)` (`www/src/registry/theme/primitives.ts:67`) regenerates the ramps and overrides these entries via `rampsToVars(resolved.light)` (`emit-theme.ts:135-143`). `--dotui-density: <density>` is added when density ≠ `"compact"`.
- **`css[".dark"]`**: the reversed dark ramp (each palette's step-50 gets step-950's oklch value, etc.) via `rampsToVars(resolved.dark)` (`emit-theme.ts:158`; reversal in `primitives.ts:28-37`).
- **`cssVars.theme`**: the constant semantic `@theme inline` block — `--radius-*` (calc with `--radius-factor`), `--color-bg`, `--color-accent`, `--color-fg-on-accent`, all 80+ semantic tokens from `www/src/registry/base/theme.css`. Never changes per preset.

### Serialising the structured fields to a CSS string

`emitInitItem` returns a `RegistryItem` with `{ css, cssVars }` in shadcn's structured format (as produced by `cssToRegistryFields`, `www/src/publisher/build-time/css-to-registry-fields.ts:30`). Shadcn's own CLI converts these back to a CSS string when it writes `globals.css`. For the StackBlitz builder, a small serialiser is needed:

```ts
function registryItemToCss(item: RegistryItem): string {
  const parts: string[] = ["@import 'tailwindcss';"];
  // cssVars.theme → @theme inline { ... }
  if (item.cssVars?.theme) {
    const themeDecls = Object.entries(item.cssVars.theme)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join("\n");
    parts.push(`@theme inline {\n${themeDecls}\n}`);
  }
  // css keys → at-rules and selectors
  if (item.css) {
    for (const [selector, body] of Object.entries(item.css)) {
      if (typeof body === "object" && body !== null) {
        const decls = Object.entries(body as Record<string, string>)
          .map(([k, v]) => `  ${k}: ${v};`)
          .join("\n");
        parts.push(`${selector} {\n${decls}\n}`);
      } else if (typeof body === "string") {
        parts.push(body);
      }
    }
  }
  return parts.join("\n\n");
}
```

The `tailwindcss-autocontrast` plugin's `cssfile` option must point at the same `globals.css` so it finds the `:root`/`.dark` ramp vars to derive `--on-*` foregrounds. In the StackBlitz project this is `./src/globals.css`.

### The autocontrast gap

`--on-accent-500`, `--on-neutral-200`, etc. are **not shipped in the init item** — they are derived at Tailwind compile time by `tailwindcss-autocontrast` scanning `:root`/`.dark` for `--<palette>-<step>` vars. In StackBlitz, Vite runs the Tailwind plugin when the dev server starts, so `--on-*` are injected correctly into the compiled CSS. The showcase will render correctly after Vite's first transform pass.

---

## 6. The showcase as first view

`App.tsx` in the generated project renders `<Cards />` directly. The `Cards` component (`www/src/components/marketing/showcase/cards.tsx:20-48`) is the masonry grid of 17 showcase widgets.

Because the showcase files import from `@/components/ui/*`, `@/registry/lib/utils`, and `@/registry/__generated__/icons`, the StackBlitz project must replicate these paths under `src/`. The path alias `@/ → src/` is configured in `vite.config.ts`.

The showcase card files (`www/src/components/marketing/showcase/*.tsx`) are copied verbatim — they contain no server functions, no TanStack Router loaders, and no SSR dependencies. All state is local React state. The only runtime network calls are to GitHub CDN for avatar images (`https://github.com/mehdibha.png` etc.), which degrade gracefully via `AvatarFallback`.

`ThemeProvider` from `packages/starter-themes` depends on `@tanstack/react-router`'s `ScriptOnce`. In the StackBlitz project, replace it with a minimal inline dark-mode script:

```tsx
// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./globals.css";
import App from "./App";

// Class-based dark mode: dotUI uses `@custom-variant dark (&:is(.dark *))`
// Toggle by adding/removing class="dark" on <html>.
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
document.documentElement.classList.toggle("dark", prefersDark);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

```tsx
// src/App.tsx
import { Cards } from "./components/marketing/showcase/cards";

export default function App() {
  return (
    <div className="min-h-screen bg-bg font-sans text-fg antialiased">
      <main className="p-8">
        <Cards />
      </main>
    </div>
  );
}
```

`DesignSystemProvider` (`www/src/modules/core/styles.tsx:61`) is **not needed** in the StackBlitz project. The provider's only runtime job is to write CSS vars to `document.documentElement` reflecting the active preset selection. In the StackBlitz project the preset is already baked into every component's `tv()` class strings (by `publish`/`flatten`) and into `globals.css`. The default context value (`{ params: {}, tokens: {}, density: "default" }`) is sufficient.

---

## 7. What dotUI must build

### 7.1 New server route: `GET /r/stackblitz?preset=<encoded>`

This endpoint is the core new piece. It runs entirely server-side inside the dotUI www app, reuses existing publisher infrastructure, and returns a JSON payload the client-side `openProject` call consumes.

```ts
// www/src/routes/r/stackblitz.tsx (new file)
import { createFileRoute } from "@tanstack/react-router";
import { emitInitItem } from "@/publisher/emit-theme";
import { baseRegistryCss } from "@/registry/__generated__/base-css";
import { publishables, PUBLISHABLE_NAMES } from "@/registry/__generated__/publishables";
import { publish, setKnownDotuiNames } from "@/publisher/publish";
import { showcaseFiles } from "@/registry/__generated__/showcase-bundle"; // see §7.3
import { buildStackBlitzProject } from "@/modules/open-in/stackblitz";

export const Route = createFileRoute("/r/stackblitz")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const encodedPreset = url.searchParams.get("preset") ?? undefined;
        const preset = encodedPreset
          ? await decodePresetForRoute(encodedPreset)
          : { density: "compact", componentParams: {} };

        setKnownDotuiNames(PUBLISHABLE_NAMES);
        const project = await buildStackBlitzProject({
          preset, encodedPreset, publishables, PUBLISHABLE_NAMES,
          baseRegistryCss, showcaseFiles,
        });

        return new Response(JSON.stringify(project), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
```

### 7.2 New module: `www/src/modules/open-in/stackblitz.ts`

```ts
// www/src/modules/open-in/stackblitz.ts
import { emitInitItem } from "@/publisher/emit-theme";
import { publish } from "@/publisher/publish";
import { format } from "oxfmt";
import type { PublishPreset } from "@/publisher/types";
import type { RegistryItem } from "@/registry/types";

export async function buildStackBlitzProject(opts: {
  preset: PublishPreset;
  encodedPreset: string | undefined;
  publishables: Record<string, () => Promise<{ publishable: Publishable; publishableByPath?: Record<string, Publishable> }>>;
  PUBLISHABLE_NAMES: string[];
  baseRegistryCss: Pick<RegistryItem, "css" | "cssVars">;
  showcaseFiles: Record<string, string>;  // path → content, pre-read at build time
}): Promise<StackBlitzProject> {
  const { preset, encodedPreset, publishables, PUBLISHABLE_NAMES, baseRegistryCss, showcaseFiles } = opts;

  // 1. Globals CSS
  const initItem = emitInitItem({
    baseRegistryCss,
    preset,
    encodedPreset,
    registryRoot: "https://dotui.com",
  });
  const globalsCss = registryItemToCss(initItem, encodedPreset);

  // 2. Component files
  const uiFiles: Record<string, string> = {};
  for (const name of PUBLISHABLE_NAMES) {
    const mod = await publishables[name]();
    const publishable = selectPublishableForPreset(mod, preset, name);
    const { item } = publish({ publishable, preset });
    for (const file of item.files) {
      const result = await format(file.target, file.content, { printWidth: 120, useTabs: true });
      uiFiles[`src/components/${file.target}`] = result.code;
    }
  }

  // 3. Support files
  const libUtils = initItem.files?.find((f) => f.target === "src/lib/utils.ts");

  return {
    title: "dotUI Showcase",
    description: "dotUI component showcase — customised design system",
    template: "node",
    files: {
      "package.json":        PACKAGE_JSON,
      "vite.config.ts":      VITE_CONFIG,
      "tsconfig.json":       TSCONFIG,
      "index.html":          INDEX_HTML,
      "src/main.tsx":        MAIN_TSX,
      "src/App.tsx":         APP_TSX,
      "src/globals.css":     globalsCss,
      "src/lib/utils.ts":    libUtils?.content ?? CN_UTILS_TS,
      "src/registry/lib/context/index.tsx": CONTEXT_LIB,        // see §7.3
      "src/registry/hooks/use-image-loading-status.ts": USE_IMAGE_HOOK,
      "src/registry/__generated__/icons.tsx": ICONS_GENERATED,
      "src/modules/core/styles.tsx": DESIGN_SYSTEM_RUNTIME,      // stripped-down (see §7.3)
      ...uiFiles,
      ...showcaseFiles,   // src/components/marketing/showcase/*.tsx
    },
  };
}
```

### 7.3 Pre-bundled showcase source

The showcase card files (`www/src/components/marketing/showcase/*.tsx`) are **static source files** — they don't change per preset. They should be read once at build time and emitted as `www/src/registry/__generated__/showcase-bundle.ts` (a `Record<string, string>` mapping path → file content), so the server route does not do filesystem I/O per request.

Add a step to `scripts/registry-build.ts` (after the existing publishables build):

```ts
// scripts/registry-build.ts (addition)
async function buildShowcaseBundle() {
  const files = await glob("src/components/marketing/showcase/*.tsx", { cwd: WWW_SRC });
  const entries = await Promise.all(
    files.map(async (f) => [
      f.replace("src/", "src/"),   // keep full relative path as key
      await readFile(path.join(WWW_SRC, f), "utf-8"),
    ])
  );
  const src = `export const showcaseFiles: Record<string, string> = ${JSON.stringify(Object.fromEntries(entries), null, 2)};\n`;
  await writeFile(path.join(WWW_SRC, "registry/__generated__/showcase-bundle.ts"), src);
}
```

### 7.4 `selectPublishable` extraction

`selectPublishable` is currently private in `www/src/routes/r/$name.tsx:89-107`. It must be extracted to `www/src/publisher/select-publishable.ts` and exported so both the route handler and the StackBlitz builder can call it.

### 7.5 Client-side button

```tsx
// www/src/modules/create/open-in-stackblitz.tsx (new file)
import sdk from "@stackblitz/sdk";
import { useDesignSystem } from "./preset";
import { encodePreset } from "./preset/codec";

export function OpenInStackBlitzButton() {
  const { designSystem } = useDesignSystem();

  async function handleClick() {
    const encoded = encodePreset(designSystem);
    const qs = encoded ? `?preset=${encoded}` : "";
    const host = typeof window !== "undefined" ? window.location.origin : "https://dotui.com";
    // Fetch the pre-built project definition from the server
    const resp = await fetch(`${host}/r/stackblitz${qs}`);
    const project = await resp.json();
    sdk.openProject(project, { openFile: "src/App.tsx", newWindow: true });
  }

  return (
    <button onClick={handleClick}>
      Open in StackBlitz
    </button>
  );
}
```

The `fetch` + `sdk.openProject` pattern keeps the heavy publisher work on the server. If a fully client-side approach is preferred (e.g. to avoid the extra network round-trip), the builder can be rewritten to run in the browser — but it requires shipping the codec, pako, and publishables loader to the client bundle, which is a larger footprint.

---

## 8. Schema / meta.ts changes

No `meta.ts` changes are required. The StackBlitz builder reuses the same `PublishPreset` shape (`www/src/publisher/types.ts:79-85`) and the same `publish` / `emitInitItem` pipeline.

If dotUI later wants to annotate which components are "showcase-required" (for generating a minimal bundle), an optional `showcaseRequired?: boolean` field can be added to `RegistryItem` (`www/src/registry/types.ts:69-78`) — one line, inert until read. `metaForRuntime` (`www/src/publisher/build-time/build-publishables.ts:334`) spreads `...rest`, so it propagates automatically to the generated publishable meta literal.

No changes to the shadcn registry JSON shape are needed.

---

## 9. Limitations, risks, fallbacks

### Bundle size

The complete file tree (60 component files + showcase cards + globals.css + support files) is roughly 300–600 KB of uncompressed text. This is well within StackBlitz's limits (the SDK POST is gzip-compressed). No concern in practice.

### `publishables` must be built

`www/src/registry/__generated__/publishables/` is generated by `pnpm build:registry` and is git-ignored. The server route `/r/stackblitz` imports from it, so it must exist in the deployed bundle. The existing Vercel build already runs `build:registry`; no change needed for production. Local dev requires `pnpm build:registry` first (same requirement as the existing `/r/$name` and `/r/init` routes).

### `selectPublishable` is currently private

Until it is extracted (§7.4), the StackBlitz builder cannot correctly handle the `loader` component's spinner/ring file swap. A short-term workaround is to hardcode `spinner` as the default loader style (always ship `base.spinner.tsx`) when no `componentParams.loader.style` is set.

### `tokens` field is not yet wired into emitted CSS

`www/src/publisher/emit-theme.ts:62-68` has an explicit TODO: the `tokens` key of `DesignSystem` (e.g. `--radius-factor`) is not yet threaded through `PublishPreset` to `:root`. This is a dotUI-wide limitation, not specific to StackBlitz. When it is fixed (Phase: "tokens in PublishPreset"), the StackBlitz builder inherits it for free because it calls `emitInitItem`.

### `DesignSystemProvider` / runtime CSS-var writes

The StackBlitz project ships without a live `DesignSystemProvider`. If the user edits a component's `tv()` call directly in StackBlitz, scalar param CSS vars (e.g. `--alert-radius: var(--radius-md)`) will not be set by the provider. Workaround: inline the scalar var declarations in `globals.css` during build. For each component with scalar params, iterate `meta.params` and emit `--<cssVar>: <resolvedValue>` into `:root` (using the same `resolveCssValue` logic from `www/src/modules/core/styles.tsx:49`).

### `tailwindcss-autocontrast` path

The `cssfile` option in `@plugin "tailwindcss-autocontrast"` must point at the project's own Tailwind entry file. In the StackBlitz project this is `./src/globals.css`. The `base.css` source has `./src/styles.css` — this must be adjusted in the serialiser.

### No live preset editing in StackBlitz

The StackBlitz project is a static snapshot. If the user wants to change the accent color, they must return to `dotui.com/create`, update the preset, and click Open in StackBlitz again. Alternatively, they can edit the OKLCH ramps directly in `globals.css`. An advanced enhancement would be to include a small `setPreset(encoded)` utility in the generated project that accepts a new preset string and regenerates `globals.css` + component files via the dotUI registry endpoints — but this is out of scope for v1.

### `@base-ui/react` dependency

`otp-field/base.tsx` imports from `@base-ui/react/otp-field` and `toast/base.tsx` from `@base-ui/react/toast`. Both must be in `package.json`. The toast component is not used in the showcase cards but ships as part of the full component bundle.

---

## 10. Step-by-step implementation checklist

- [ ] **Extract `selectPublishable`** from `www/src/routes/r/$name.tsx:89-107` into `www/src/publisher/select-publishable.ts` and export it. Update the route to import from the new location.
- [ ] **Add showcase bundle generator** to `scripts/registry-build.ts`: glob `www/src/components/marketing/showcase/*.tsx`, emit `www/src/registry/__generated__/showcase-bundle.ts`.
- [ ] **Write `registryItemToCss` serialiser** in `www/src/modules/open-in/stackblitz.ts`. Handle `cssVars.theme` → `@theme inline`, `css` keys → at-rules and `:root`/`.dark`/selector blocks. Adjust `tailwindcss-autocontrast` `cssfile` option to `./src/globals.css`.
- [ ] **Write scalar-var emitter**: for each component with `kind:"scalar"` params, emit `--<cssVar>: <resolvedDefault>` into `:root` in `globals.css` (so the showcase renders correctly without `DesignSystemProvider`).
- [ ] **Write `buildStackBlitzProject`** in `www/src/modules/open-in/stackblitz.ts` following the shape in §7.2. Include all static file templates (`PACKAGE_JSON`, `VITE_CONFIG`, `INDEX_HTML`, etc.).
- [ ] **Write the static file templates** (see §10a below).
- [ ] **Add server route** `www/src/routes/r/stackblitz.tsx` (GET handler, decode preset, call builder, return JSON).
- [ ] **Add client button** `www/src/modules/create/open-in-stackblitz.tsx`. Wire into the customiser panel alongside the install command (`www/src/modules/create/install-command.tsx`).
- [ ] **Add `@stackblitz/sdk`** to `www/package.json` dependencies.
- [ ] **Test locally**: `pnpm build:registry && pnpm dev`, navigate to `/create`, open a custom preset, click the button.
- [ ] **Verify in StackBlitz**: confirm `vite dev` boots, the showcase renders with the correct accent color and density, `--on-*` vars are present after Tailwind compile.

### 10a. Static file templates

```json
// PACKAGE_JSON (template)
{
  "name": "dotui-showcase",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-aria-components": "^1.4.0",
    "react-aria": "^3.36.0",
    "react-stately": "^3.34.0",
    "tailwind-variants": "^0.3.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.4",
    "lucide-react": "^0.469.0",
    "@internationalized/date": "^3.6.0",
    "@base-ui/react": "^1.0.0",
    "@fontsource-variable/geist": "^5.1.1",
    "@fontsource/geist-mono": "^5.0.3",
    "tailwindcss": "^4.0.0",
    "tw-animate-css": "^1.3.0",
    "tailwindcss-react-aria-components": "^2.1.0",
    "tailwindcss-autocontrast": "^1.0.0",
    "tailwindcss-with": "^1.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "@tailwindcss/vite": "^4.0.0",
    "typescript": "~5.7.2",
    "vite": "^6.0.5"
  }
}
```

```ts
// VITE_CONFIG
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
```

```html
<!-- INDEX_HTML -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>dotUI Showcase</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

The `tailwindcss-autocontrast` and `tailwindcss-with` package names in `package.json` must match their published npm names. Verify versions at publish time against the workspace `packages/` versions.

---

## Sources

- StackBlitz SDK `openProject` API: https://developer.stackblitz.com/platform/api/javascript-sdk-options
- StackBlitz POST form mechanism: https://developer.stackblitz.com/platform/api/post-api
- StackBlitz WebContainers Vite + React support: https://developer.stackblitz.com/guides/user-guide/importing-projects
- shadcn `registry:base` item type and `shadcn add` merge behaviour: https://ui.shadcn.com/docs/registry/registry-item-types
- shadcn `cssVars.light/dark` writing behaviour (Tailwind v4, issue #7119): https://github.com/shadcn-ui/ui/issues/7119
- dotUI codec: `www/src/modules/create/preset/codec.ts:75` (`encodePreset`), `codec.ts:111` (`decodePreset`)
- dotUI init item builder: `www/src/publisher/emit-theme.ts:71` (`emitInitItem`), `emit-theme.ts:145` (`mergePresetCssFields`)
- dotUI component publisher: `www/src/publisher/publish.ts:119` (`publish`), `publish.ts:79` (`rewriteDeps`)
- dotUI init route: `www/src/routes/r/init.tsx:22`
- dotUI per-component route: `www/src/routes/r/$name.tsx:35`
- dotUI showcase entry: `www/src/components/marketing/showcase/cards.tsx:20`
- dotUI base CSS structured output: `www/src/registry/__generated__/base-css.ts`
- dotUI color resolution kernel: `www/src/registry/theme/primitives.ts:67` (`resolveColorConfig`)
- pako (DEFLATE compression): https://nodeca.github.io/pako/
