# Open in shadcn CLI

> The universal substrate. One `npx shadcn add <url>?preset=…` command installs every dotUI component into the target project's `ui/` folder and writes the full OKLCH theme into `globals.css`, all reflecting the user's chosen preset. Button type: **copy-command** · Preset fidelity: **full** · Color fidelity: **full**

---

## 1. User experience

The user lands on the dotUI customizer (`/_app/create`), tweaks colors, density, and per-component
params, then sees a live-updating command in the customizer footer:

```
npx shadcn add https://dotui.com/r/init?preset=<base64url>
```

That single command, pasted into any existing Next.js / Vite / TanStack Start project that already
has a `components.json`, does the following in one shot:

1. Fetches `https://dotui.com/r/init?preset=<encoded>` — a `registry:base` item.
2. Merges its `cssVars.theme` (the `@theme inline` block with semantic tokens and radius scale) and
   its `css` (at-rules, plugins, `::selection`, `:root` / `.dark` OKLCH ramps) into the project's
   globals CSS file.
3. Writes `src/lib/utils.ts` (the `cn()` helper).
4. Installs npm dependencies: `tailwind-variants`, `clsx`, `tailwind-merge`,
   `react-aria-components`, `tailwindcss-react-aria-components`, `tw-animate-css`,
   `tailwindcss-autocontrast`.
5. Registers `@dotui` as a named registry in `components.json` so subsequent
   `npx shadcn add @dotui/<name>` calls hit the matching per-component endpoint with the
   **same preset baked in**.

After `init`, the user runs a second command — either a curated subset or the "all components"
aggregate — to install every component file into `src/components/ui/`.

For the full showcase experience (components + showcase files + theme in one command), see §7.

---

## 2. Technical mechanism

### 2a. The existing `install-command.tsx`

`www/src/modules/create/install-command.tsx:39-47` already builds and copies this command:

```ts
const encoded = encodePreset(designSystem);   // codec.ts:75
const url = encoded
  ? `${host}/r/init?preset=${encoded}`
  : `${host}/r/init`;
return `npx shadcn add ${url}`;
```

`encodePreset` (`www/src/modules/create/preset/codec.ts:75`) diffs the `DesignSystem` against
`DEFAULTS` (`www/src/modules/create/preset/defaults.ts:5`), pako-deflates (`level:9`) the compact
JSON (`DesignSystemState`), and base64url-encodes it. If nothing differs from defaults the function
returns `undefined` and the `?preset=` param is omitted.

### 2b. The `/r/init` route

`www/src/routes/r/init.tsx` is a TanStack Start server GET handler. It:

1. Reads `url.searchParams.get("preset")` (`init.tsx:27`).
2. Calls `decodePresetForRoute(encoded)` (`init.tsx:47`) which dynamically imports
   `decodePreset` from `@/modules/create/preset/codec` and narrows the result to
   `PublishPreset` (`publisher/types.ts:79`): `{ color?, density, componentParams }`.
3. Calls `emitInitItem({ baseRegistryCss, preset, encodedPreset, registryRoot })`
   (`publisher/emit-theme.ts:71`).
4. Returns `JSON.stringify(item, null, 2)` with cache headers
   `public, max-age=60, s-maxage=3600, stale-while-revalidate=86400`.

### 2c. Per-component `/r/$name` route

`www/src/routes/r/$name.tsx` handles `GET /r/button?preset=<encoded>` etc. It:

1. Looks up `publishables[name]` from `__generated__/publishables/index.ts`. Missing → 404.
2. Decodes the preset (density + componentParams only; color is dropped at `$name.tsx:117`).
3. Calls `setDotuiDepResolver(origin, "?preset=<encoded>")` so all `registryDependencies`
   emitted in the response become absolute URLs **with the same preset** (e.g.
   `https://dotui.com/r/loader?preset=…`).
4. Calls `publish({ publishable, preset })` (`publisher/publish.ts:119`) — the five-step
   pipeline (flatten → resolveClasses → serialize → substitute → assemble).
5. Runs the result through `oxfmt` (printWidth 120, useTabs).

### 2d. shadcn CLI flow end-to-end

```
User pastes:  npx shadcn add https://dotui.com/r/init?preset=<encoded>
                                │
              shadcn fetches the URL → registry:base item
                                │
              shadcn merges css/cssVars → globals.css
              shadcn writes files[]   → src/lib/utils.ts
              shadcn installs deps[]
              shadcn writes config{}  → components.json
                  └── registries["@dotui"] = "https://dotui.com/r/{name}?preset=<encoded>"
                                │
User runs:    npx shadcn add @dotui/button  (or the aggregate "all" item, see §7)
                                │
              shadcn expands @dotui/button →
                  https://dotui.com/r/button?preset=<encoded>
                                │
              /r/button response contains:
                  registryDependencies: ["https://dotui.com/r/loader?preset=<encoded>"]
                                │
              shadcn recursively fetches loader, focus-styles (dropped), utils (dropped)
```

---

## 3. Preset propagation

Preset fidelity is **full** for color, density, and per-component params. Here is precisely how
each dimension travels:

### 3a. Color

The `?preset=` value, when decoded, yields `ds.color: ColorConfig | undefined`.
`decodePresetForRoute` (`init.tsx:47-59`) passes `color` through to `PublishPreset`.
`emitInitItem` calls `mergePresetCssFields` (`emit-theme.ts:145`), which — when `preset.color` is
set — calls `resolveColorConfig(preset.color)` (`registry/theme/primitives.ts:67`) to generate
full OKLCH ramps for all six palettes (`neutral, accent, success, warning, danger, info`) in both
modes, then overwrites `:root` and `.dark` in the item's `css` field via `rampsToVars`.

The consumer's `tailwindcss-autocontrast` plugin re-derives `--on-*` foreground vars from the
shipped ramps at Tailwind build time (these are intentionally not shipped in the registry item —
`emit-theme.ts:152-159`).

Result: the user's custom seed colors appear in `globals.css` as 66 OKLCH primitive vars (6
palettes × 11 steps) for both light and dark modes.

### 3b. Density

`preset.density` propagates two ways:

- **Into component class strings**: `/r/$name` uses `density` in the `flatten` step
  (`publisher/flatten.ts`) — the merge order `base ← density[selected] ← params[name][value]`
  bakes the density tier's tv override into the shipped component source. So installing
  `@dotui/button` at density `comfortable` gives a component with the `comfortable` class
  strings hardcoded.
- **Into `:root` vars**: `emitPresetLightVars` (`emit-theme.ts:58`) writes
  `--dotui-density: <value>` to `:root` only when density ≠ `"compact"` (the default).

Note: `--dotui-density` is informational only today. No CSS selector reads it. The real effect
of density is the baked class strings.

### 3c. Per-component params (enum + scalar)

`componentParams` travel with the preset encoded in `?preset=`.

For **enum params**: `flatten` merges the selected value's tv override into the class strings.
Example: `alert.style = "sousse"` → the alert component ships with Sousse-style class lists
hardcoded.

For **scalar params**: `resolveClasses` / `buildScalarVarMap` (`publisher/resolve-classes.ts:30`)
rewrites Tailwind suffix expressions. Example: `avatar.radius = "--radius-full"` → the class
`rounded-(--avatar-radius)` is rewritten to `rounded-full` in the shipped source.

For **enum-with-files params** (only `loader`): `selectPublishable` (`$name.tsx:89`) picks the
correct base file (`base.spinner.tsx` vs `base.ring.tsx`) before publish runs.

`componentParams` are NOT written to CSS — they live entirely in the component `.tsx` source.

### 3d. Global tokens (`t` field in DesignSystemState)

`tokens` round-trip through the codec (key `t` in `DesignSystemState`) but `PublishPreset` does
not carry a `tokens` field, so they currently have **no effect on emitted output**. This is an
explicit TODO at `emit-theme.ts:62-68`. The value `--radius-factor` (the most important global
token) is unaffected today; it defaults to `1` in `:root` from `base/colors.css`.

---

## 4. Components installed

### 4a. Per-component add (current behavior)

After `shadcn init` (which writes `components.json` with the `@dotui` registry entry), the user
installs each component individually:

```bash
npx shadcn add @dotui/button
npx shadcn add @dotui/card
# etc.
```

Each command fetches `/r/<name>?preset=<encoded>`, writes the resolved `.tsx` source to
`src/components/ui/<name>.tsx`, and recursively fetches transitive deps (which arrive as absolute
URLs in `registryDependencies` — see §2c). The deps `focus-styles`, `theme`, and `utils` are
dropped (`BUNDLED_INTO_INIT`, `publish.ts:52`) because they were already installed by init.

### 4b. Full component list (60 ui items)

From `www/src/registry/__generated__/registry-items.ts:70-129`, all 60 registered UI items:

accordion, alert, avatar, badge, breadcrumbs, button, calendar, card, checkbox, checkbox-group,
color-area, color-editor, color-field, color-picker, color-slider, color-swatch,
color-swatch-picker, color-thumb, combobox, command, date-field, date-picker, dialog, disclosure,
drawer, drop-zone, empty, field, file-trigger, group, input, kbd, link, list-box, loader, menu,
modal, number-field, otp-field, overlay, popover, progress-bar, radio-group, scroll-fade,
search-field, select, separator, skeleton, slider, switch, table, tabs, tag-group, text,
text-field, time-field, toast, toggle-button, toggle-button-group, tooltip.

Plus 2 lib items: `utils` (shipped inline by init), `focus-styles` (shipped via init CSS).
Plus 1 hook: `use-mobile`.

WIP / excluded: `context-menu`, `sidebar`, `react-hook-form`, `tanstack-form` (all in
`ORPHAN_ALLOWLIST`, `registry-build.ts:356`).

### 4c. Install path

shadcn installs each item at the `target` declared in the registry item's `files[]`. For
ui items the target is `ui/<name>.tsx`, which resolves via the `@/components/ui` alias
(from `config.aliases.ui = "@/components/ui"` in the init item) to
`src/components/ui/<name>.tsx`.

---

## 5. Theme in globals.css

`shadcn add <init-url>` merges the `registry:base` item's `css` and `cssVars` into the project's
CSS entry point. The result looks like:

```css
/* ---- merged by shadcn into globals.css ---- */
@import "tw-animate-css";
@plugin "tailwindcss-react-aria-components";
@plugin "tailwindcss-autocontrast" { cssfile: "<this-file>"; }
@plugin "tailwindcss-with";
@custom-variant dark (&:is(.dark *));
@utility focus-reset { … }
@utility focus-ring  { … }
@utility focus-input { … }
@utility no-highlight { … }
@layer base {
  * { @apply border-border; }
  body { @apply bg-bg font-sans text-fg; }
  html { @apply font-sans; }
}
::selection { background-color: var(--accent-800); color: var(--on-accent-800); }

@theme inline {
  /* constant semantic + radius layer — same across all presets */
  --radius-sm:  calc(0.125rem * var(--radius-factor));
  --radius-md:  calc(0.375rem * var(--radius-factor));
  --radius-lg:  calc(0.5rem   * var(--radius-factor));
  --radius-xl:  calc(0.75rem  * var(--radius-factor));
  --radius-2xl: calc(1rem     * var(--radius-factor));
  --radius-full: 9999px;
  --color-bg:   var(--neutral-50);
  --color-accent: var(--accent-500);
  --color-fg-on-accent: var(--on-accent-500);
  --color-border-focus: var(--accent-500);
  /* … all 100+ semantic tokens from registry/base/theme.css … */
}

/* PRESET-SPECIFIC: OKLCH primitive ramps (6 palettes × 11 steps = 66 vars each) */
:root {
  --radius-factor: 1;
  --neutral-50:  oklch(0.985 0 0);
  --neutral-100: oklch(0.945 0.005 240.14);
  /* … */
  --accent-50:   oklch(0.96 0.018 251.3);
  /* … */
  --info-950:    oklch(0.175 0.052 258.6);
  /* For a custom color preset, all 66 vars here are regenerated from the seed */
}
.dark {
  --neutral-50:  oklch(0.13 0 0);   /* reversed from light */
  /* … 65 more dark-mode primitives … */
}
/* --on-accent-500 etc. injected by tailwindcss-autocontrast at Tailwind build time */
```

The `cssVars.theme` field (→ `@theme inline`) is **constant across presets**; only the `:root` /
`.dark` primitive ramps change per preset. This is by design: the semantic layer (`--color-*`)
always points at primitive vars, and only the primitives are overridden.

Source of the `@theme inline` content: `www/src/registry/base/theme.css` (hand-authored),
typed source `www/src/registry/theme/semantics.ts:36-124`, structured form
`www/src/registry/__generated__/base-css.ts:179-278`.

Source of the at-rules / utilities: `www/src/registry/base/base.css`.

Source of the default ramps: `www/src/registry/base/colors.css` (auto-generated by
`pnpm build:registry` from `DEFAULT_COLOR_CONFIG`). For a custom preset, these are overridden at
request time by `resolveColorConfig(preset.color)` → `rampsToVars()` in `emit-theme.ts:155-159`.

---

## 6. The showcase as first view

The showcase (`www/src/components/marketing/showcase/cards.tsx`) is 17 self-contained card
widgets in a `columns-1 sm:columns-2 lg:columns-3 xl:columns-4` masonry grid. It has no server
functions, no loaders, and no routing dependencies — all state is client-side.

### What "showcase as first view" requires

1. **Component files present** under `src/components/ui/` — 37 distinct ui items are consumed
   by the cards (accordion, avatar, badge, button, calendar, card, checkbox, checkbox-group,
   color-area, color-editor, color-field, color-slider, color-thumb, disclosure, drop-zone, field,
   file-trigger, group, input, kbd, link, list-box, loader, otp-field, popover, progress-bar,
   radio-group, select, separator, slider, switch, table, tabs, tag-group, text, text-field,
   time-field, toggle-button, toggle-button-group).

2. **Theme in globals.css** — already achieved by the `init` command (§5).

3. **Showcase source files** — `www/src/components/marketing/showcase/*.tsx` (18 files) must
   be present in the target project, verbatim or via the registry.

4. **Providers** — a dark-mode class toggle on `<html>` (the `class="dark"` pattern shadcn uses)
   and optionally `DesignSystemProvider` for live param customization. The showcase renders
   correctly with defaults even without `DesignSystemProvider`.

5. **Fonts** — `@fontsource-variable/geist` and `@fontsource/geist-mono` (installed as npm deps
   or via CDN; the registry item's `dependencies[]` should list them).

6. **Runtime aliases** — all imports use `@/` rooted at `src/`. shadcn writes the aliases into
   `components.json`; the target project's bundler must honor them.

### Why the showcase files must be a registry item

The shadcn CLI installs only what is declared in registry items. The showcase files live under
`www/src/components/marketing/showcase/` and are not currently in any registry item. To deliver
them via `shadcn add`, they must be added to a new registry item or bundled into the "all"
aggregate described in §7.

---

## 7. What dotUI must build

### 7a. The `/r/registry.json` index (required for shadcn MCP)

No index route exists today (`/r/registry.json` returns 404). For shadcn MCP discovery the
config is `{ command:'npx', args:['-y','shadcn@latest','registry:mcp'], env:{ REGISTRY_URL: 'https://dotui.com/r/registry.json' } }`.

Add a new route `www/src/routes/r/registry[.]json.tsx`:

```ts
// www/src/routes/r/registry[.]json.tsx
import { createFileRoute } from "@tanstack/react-router";
import { registryUi, registryLib } from "@/registry/__generated__/registry-items";
import { registryBase } from "@/registry/base/registry";
import { registryHooks } from "@/registry/hooks/registry";

export const Route = createFileRoute("/r/registry[.]json")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const items = [
          // lightweight descriptors: name, type, title?, description?
          // strip group/params/files.content; point consumers at /r/<name>
          ...registryUi.map((item) => ({
            name: item.name,
            type: item.type,
            ...(item.title       ? { title:       item.title       } : {}),
            ...(item.description ? { description: item.description } : {}),
          })),
          ...registryLib.map((item) => ({ name: item.name, type: item.type })),
          ...registryHooks.map((item) => ({ name: item.name, type: item.type })),
          ...registryBase.map((item) => ({ name: item.name, type: item.type })),
        ];
        const registry = { name: "dotui", homepage: origin, items };
        return new Response(JSON.stringify(registry, null, 2), {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
          },
        });
      },
    },
  },
});
```

Note: TanStack Start route files use `[.]` to escape literal dots in filenames.

### 7b. The "all components" aggregate item — the key deliverable

The central problem: installing all 60 components one by one is impractical for "open in one
command". The solution is a single aggregate `registry:base` item served at `/r/all?preset=<encoded>`
that bundles every component file inline, the full theme, and the showcase files.

**Shape of the item:**

```jsonc
{
  "name": "dotui-all",
  "type": "registry:base",
  "extends": "none",
  "dependencies": [
    /* DEFAULT_DEPENDENCIES from emit-theme.ts:31 */
    "tailwind-variants", "clsx", "tailwind-merge",
    "react-aria-components", "tailwindcss-react-aria-components",
    "tw-animate-css", "tailwindcss-autocontrast",
    /* additional deps needed by 60 components */
    "react-aria", "react-stately",
    "@base-ui/react",
    "@internationalized/date",
    "lucide-react",
    "@fontsource-variable/geist",
    "@fontsource/geist-mono"
  ],
  "registryDependencies": [],  /* everything is inline — no external deps needed */
  "css":     { /* full theme css — identical to /r/init output */ },
  "cssVars": { "theme": { /* full @theme inline block */ } },
  "files": [
    /* lib/utils.ts — the cn() helper */
    { "type": "registry:lib", "path": "lib/utils.ts", "target": "src/lib/utils.ts", "content": "…" },
    /* all 60 component .tsx files */
    { "type": "registry:ui", "path": "ui/button/base.tsx", "target": "ui/button.tsx", "content": "/* resolved */" },
    /* … 59 more component files … */
    /* showcase card files */
    { "type": "registry:component", "path": "components/marketing/showcase/cards.tsx",
      "target": "components/showcase/cards.tsx", "content": "/* verbatim */" },
    /* … 17 more showcase files … */
    /* main page file */
    { "type": "registry:page", "path": "app/showcase-page.tsx",
      "target": "app/page.tsx", "content": "/* imports <Cards /> */" }
  ],
  "config": {
    "style": "default",
    "tailwind": { "cssVariables": true },
    "aliases": {
      "components": "@/components", "ui": "@/components/ui",
      "utils": "@/lib/utils",      "lib": "@/lib", "hooks": "@/hooks"
    },
    "registries": { "@dotui": "https://dotui.com/r/{name}?preset=<encodedPreset>" }
  }
}
```

All `registryDependencies` are intentionally empty because every file is inline. The consumer
needs nothing from `components.json` registries to render the showcase.

**The install command becomes:**

```bash
npx shadcn add "https://dotui.com/r/all?preset=<encoded>"
```

### 7c. New route `www/src/routes/r/all.tsx`

```ts
// www/src/routes/r/all.tsx
import { createFileRoute } from "@tanstack/react-router";
import { emitInitItem } from "@/publisher/emit-theme";
import { baseRegistryCss } from "@/registry/__generated__/base-css";
import { publishables, PUBLISHABLE_NAMES } from "@/registry/__generated__/publishables";
import { publish, setKnownDotuiNames, setDotuiDepResolver } from "@/publisher/publish";
import { format } from "oxfmt";
// showcase source files (raw strings imported via ?raw or read at build time):
import * as showcaseFiles from "@/components/marketing/showcase/__registry__";

setKnownDotuiNames(PUBLISHABLE_NAMES);

export const Route = createFileRoute("/r/all")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const encodedPreset = url.searchParams.get("preset") ?? undefined;
        const preset = encodedPreset
          ? await decodePresetForRoute(encodedPreset)
          : { density: "compact", componentParams: {} };

        const origin = `${url.protocol}//${url.host}`;
        // For the all-bundle, dep rewriting is irrelevant (no registryDependencies emitted),
        // but prime it anyway so the publish() pipeline doesn't error.
        setDotuiDepResolver(origin, "");

        // 1. Theme half (identical to /r/init)
        const themeItem = emitInitItem({
          baseRegistryCss, preset, encodedPreset,
          registryRoot: origin,
        });

        // 2. Component files half
        const componentFiles = [];
        for (const name of PUBLISHABLE_NAMES) {
          const mod = await publishables[name]();
          const publishable = selectPublishable(mod, preset);   // same logic as $name.tsx:89
          const { item, rawContent } = publish({ publishable, preset });
          let content = rawContent;
          try {
            const r = await format(publishable.meta.files?.[0]?.target ?? "ui.tsx", rawContent, {
              printWidth: 120, useTabs: true,
            });
            content = r.code;
          } catch { /* use raw */ }
          for (const f of (item.files ?? [])) {
            componentFiles.push({ ...f, content, registryDependencies: undefined });
          }
        }

        // 3. Showcase files (pre-read strings)
        const showcaseItems = buildShowcaseFiles(showcaseFiles);

        // 4. Assemble the aggregate item
        const allItem = {
          ...themeItem,
          name: "dotui-all",
          files: [
            ...(themeItem.files ?? []),
            ...componentFiles,
            ...showcaseItems,
          ],
          registryDependencies: [],
          dependencies: [
            ...(themeItem.dependencies ?? []),
            "react-aria", "react-stately", "@base-ui/react",
            "@internationalized/date", "lucide-react",
            "@fontsource-variable/geist", "@fontsource/geist-mono",
          ],
        };

        return new Response(JSON.stringify(allItem, null, 2), {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=3600",
          },
        });
      },
    },
  },
});
```

The `selectPublishable` helper from `$name.tsx:89-107` needs to be extracted into
`publisher/select-publishable.ts` and imported by both `$name.tsx` and `all.tsx`.

### 7d. Showcase files as registry entries

The 18 showcase files (`www/src/components/marketing/showcase/*.tsx`) need to be declared in a
new registry descriptor so the `all.tsx` route can read them. Simplest approach: a static map in
`www/src/components/marketing/showcase/__registry__.ts`:

```ts
// www/src/components/marketing/showcase/__registry__.ts
// Vite raw imports — each value is the file's string content
export { default as cards } from "./cards.tsx?raw";
export { default as booking } from "./booking.tsx?raw";
// … all 18 files …
```

Or, for the server route, read them via `fs.readFileSync` at request time from the source tree
(only works in dev/SSR; use `?raw` imports for the Vite build).

The target path for each showcase file in the consumer project:

| Source | Consumer target |
|---|---|
| `cards.tsx` | `src/components/showcase/cards.tsx` |
| `booking.tsx` | `src/components/showcase/booking.tsx` |
| … | … |

The consumer's `src/app/page.tsx` (or equivalent) renders `<Cards />`:

```tsx
// src/app/page.tsx — generated by the "all" item
import { Cards } from "@/components/showcase/cards";

export default function Page() {
  return (
    <main className="min-h-screen bg-bg py-12">
      <div className="container">
        <Cards />
      </div>
    </main>
  );
}
```

This file is shipped as a `registry:page` type in the `all` item's `files[]`.

### 7e. Adjusting showcase imports

The showcase files currently import from `@/registry/ui/*`, `@/registry/lib/*`,
`@/modules/core/styles`, and `@/registry/__generated__/icons`. In the consumer project, the
installed paths are `@/components/ui/*`, `@/lib/utils`, and `lucide-react`.

Options:

1. **Path rewrite at publish time**: add a transform step in `all.tsx` that rewrites
   `@/registry/ui/` → `@/components/ui/`, `@/registry/lib/utils` → `@/lib/utils`, and
   `@/registry/__generated__/icons` → `lucide-react` in every showcase file string before
   embedding it in the registry item. This is the cleanest approach.

2. **Pre-rewritten source**: maintain a separate `showcase-standalone/` directory with
   consumer-ready imports. Higher maintenance cost.

3. **Alias delegation**: ship a `components.json` alias `"showcase": "@/components/showcase"`
   and keep the `@/registry/` imports, relying on the consumer to set up matching aliases.
   Fragile — only works if the consumer's bundler and `tsconfig.json` are set up correctly.

Option 1 is recommended. The rewrite is purely mechanical (string replace on known import paths)
and can be implemented in ~20 lines alongside the `all.tsx` route.

---

## 8. Schema / meta.ts changes

### 8a. No changes required for core behavior

The existing `RegistryItem` type (`www/src/registry/types.ts:69`), the codec
(`www/src/modules/create/preset/codec.ts`), `emitInitItem` (`emit-theme.ts:71`), and the
`/r/$name` route all work today without schema changes.

### 8b. Optional: a `showcaseFiles` field on meta.ts

If you want the build step to drive showcase inclusion (rather than the `__registry__.ts` map),
add an optional field to `RegistryItem`:

```ts
// www/src/registry/types.ts
export type RegistryItem = ShadcnRegistryItem & {
  group?: ComponentGroup | null;
  params?: Record<string, ParamDef>;
  showcaseFile?: string;   // source path of the showcase card for this component group
};
```

One line change. `registry-build.ts` ignores unknown fields (they flow through `metaForRuntime`'s
spread, `build-publishables.ts:334`). Only `all.tsx` reads it — no integrity guard needed.

### 8c. `tokens` wiring (optional but valuable)

`PublishPreset` (`publisher/types.ts:79`) does not carry `tokens`. The TODO at `emit-theme.ts:62-68`
describes threading `preset.tokens` into the `:root` block of the init item. This would let
`--radius-factor` (and future global tokens) propagate correctly. Until then, radius-factor
customizations from the `t`-key of the encoded preset are silently dropped.

To wire it: extend `PublishPreset` with `tokens?: Record<string, string>`, thread it through
`decodePresetForRoute` in both `init.tsx` and `all.tsx`, and in `emitPresetLightVars` spread
`preset.tokens` into the `:root` vars object.

### 8d. `registry.json` shape

The `/r/registry.json` response uses `Registry` from `www/src/registry/types.ts:80`:

```ts
export type Registry = Omit<ShadcnRegistry, "items"> & {
  items: RegistryItem[];
};
```

For the index endpoint, `RegistryItem` entries need only `name`, `type`, and optionally `title` /
`description`. Full `files`, `params`, `group`, `css`, `cssVars` should be omitted to keep the
index lightweight.

---

## 9. Limitations, risks, fallbacks

### 9a. Response size of the "all" bundle

60 component files × ~5–20 KB each = roughly 300–1 200 KB of uncompressed JSON. With Brotli or
gzip compression from the CDN this is typically 60–150 KB on the wire — acceptable for a one-time
install command. Add a lower cache TTL (`max-age=60, s-maxage=300`) compared to per-component
endpoints (`s-maxage=3600`) to allow faster invalidation after a dotUI release.

### 9b. `tailwindcss-autocontrast` cssfile path

The init item ships `@plugin "tailwindcss-autocontrast" { cssfile: "./src/styles.css"; }` (from
`base.css`). In the consumer project this must point at the project's Tailwind entry CSS file.
The path `./src/styles.css` is correct for a standard Next.js app dir layout but may be wrong
for Vite projects (often `./src/index.css`). shadcn detects the CSS entry from `tailwind.config`
or `components.json`; the `config.tailwind` block in the init item deliberately omits `css` to
let shadcn auto-detect. If the path is wrong, `--on-*` foreground vars will not be injected at
Tailwind build time, causing invisible text on colored backgrounds.

Mitigation: document that after `shadcn add <init-url>` the user must verify the `cssfile` path
in their globals CSS matches their actual CSS entry point.

### 9c. `registry:mcp` subcommand availability

The shadcn MCP server requires `npx shadcn@latest registry:mcp` and a `/r/registry.json` index.
As of early 2026 the `registry:mcp` subcommand may require the canary build
(`npx shadcn@canary registry:mcp`). Check the shadcn changelog before documenting MCP support.
The registry.json index (§7a) is a prerequisite regardless.

### 9d. Showcase import path rewriting correctness

The mechanical import rewrite (§7e option 1) must handle:
- `@/registry/ui/<name>` → `@/components/ui/<name>`
- `@/registry/ui/<name>/index` → `@/components/ui/<name>`
- `@/registry/lib/utils` → `@/lib/utils`
- `@/registry/lib/context` → shipped inline in the all-bundle (context is not a registered item
  today; it is in `ORPHAN_ALLOWLIST`)
- `@/registry/__generated__/icons` → `lucide-react` (only `ExternalLinkIcon` is needed by the
  showcase, `invite-members.tsx:6`)
- `@/modules/core/styles` → shipped inline or re-exported

The `context` lib (`registry/lib/context/index.tsx`) is an `UNREGISTERED_DEP_ALLOWLIST` item
(`registry-build.ts:464`) — it does not have a `/r/context` endpoint. It must be bundled inline
in the `all` item's `files[]` alongside the component files.

### 9e. `tokens` field not yet propagated

As noted in §3d, `--radius-factor` and other global tokens customized in the create page are
silently dropped by the publisher. Until `tokens` is threaded into `PublishPreset`, any user who
has adjusted the radius factor will get the default (`1`) in the installed project. This is the
highest-priority gap for full preset fidelity.

### 9f. No `shadcn init` equivalent yet

`install-command.tsx` currently emits `npx shadcn add <url>` (not `npx shadcn init <url>`).
The comment at `install-command.tsx:43-46` explains why: `shadcn add` works on any project that
already has a `components.json`, merging theme fields and installing files. `shadcn init` starts
a new project from scratch and may prompt interactively. The `add` invocation is correct for the
"already have a project, install dotUI into it" flow. For the "brand new project" flow, the user
should run `npx shadcn init` first (to generate `components.json`), then `npx shadcn add <url>`.

---

## 10. Step-by-step implementation checklist

### Phase 1 — registry.json index (unblocks MCP)

- [ ] Add route `www/src/routes/r/registry[.]json.tsx` that imports `registryUi`, `registryLib`,
      `registryHooks`, `registryBase` and returns the lightweight `Registry` JSON (§7a).
- [ ] Verify: `curl https://dotui.com/r/registry.json | jq '.items | length'` returns 64
      (60 ui + 2 lib + 1 hook + 1 base).

### Phase 2 — extract `selectPublishable`

- [ ] Move the `selectPublishable` function from `www/src/routes/r/$name.tsx:89-107` to
      `www/src/publisher/select-publishable.ts` and export it.
- [ ] Import it back in `$name.tsx`. No behavior change.

### Phase 3 — wire `tokens` into `PublishPreset`

- [ ] Extend `PublishPreset` (`publisher/types.ts:79`) with `tokens?: Record<string, string>`.
- [ ] Thread it through `decodePresetForRoute` in `init.tsx:47` and the future `all.tsx`.
- [ ] In `emitPresetLightVars` (`emit-theme.ts:58`), spread `preset.tokens ?? {}` into the
      returned vars object.
- [ ] Verify: encode a preset with `--radius-factor: 1.5`, run `shadcn add`, confirm `:root`
      in globals.css contains `--radius-factor: 1.5`.

### Phase 4 — showcase files registry map

- [ ] Create `www/src/components/marketing/showcase/__registry__.ts` with raw `?raw` imports
      of all 18 showcase files (or use `fs.readFileSync` in the SSR route).
- [ ] Define target paths for each file (e.g. `cards.tsx` → `components/showcase/cards.tsx`).

### Phase 5 — `/r/all` route

- [ ] Create `www/src/routes/r/all.tsx`:
  - Decode `?preset=` (same as `init.tsx`).
  - Call `emitInitItem` for the theme half.
  - Loop `PUBLISHABLE_NAMES`, call `publish()` for each, collect formatted file objects.
  - Apply import path rewrite to showcase files (§7e option 1).
  - Assemble the aggregate item (§7b) with all files, merged deps, empty
    `registryDependencies`.
  - Return `JSON.stringify(item, null, 2)` with appropriate cache headers.
- [ ] Add a "page" file (`src/app/page.tsx` or equivalent) to the aggregate item's `files[]`
      that imports and renders `<Cards />`.

### Phase 6 — update `install-command.tsx`

- [ ] Add a second command variant for "install everything + showcase":
  ```ts
  const fullCommand = `npx shadcn add ${host}/r/all?preset=${encoded}`;
  ```
- [ ] Surface it in the customizer UI alongside the existing `init` command — or replace the
      existing command depending on UX decision.

### Phase 7 — testing

- [ ] Create a fresh Next.js 15 app dir project.
- [ ] Run `npx shadcn add "https://dotui.com/r/all?preset=<custom-encoded>"`.
- [ ] Verify: `src/components/ui/` contains all 60 `.tsx` files.
- [ ] Verify: `globals.css` contains the custom OKLCH ramps (not defaults) in `:root`.
- [ ] Verify: `src/app/page.tsx` renders `<Cards />` and the page loads with the correct theme.
- [ ] Verify: `components.json` contains `registries["@dotui"]` with the correct preset URL.
- [ ] Run `npx shadcn add @dotui/button` in the same project — it should already be installed
      (shadcn skips installed items) but if overwrite is chosen, the button should arrive
      with the correct preset-baked classes.

---

## Sources

- `www/src/modules/create/install-command.tsx` — live command generation (`:17-48`)
- `www/src/modules/create/preset/codec.ts` — `encodePreset` (`:75`), `decodePreset` (`:111`)
- `www/src/modules/create/preset/types.ts` — `DesignSystem` (`:24`), `DesignSystemState` (`:14`)
- `www/src/modules/create/preset/defaults.ts` — `DEFAULTS` (`:5`)
- `www/src/publisher/emit-theme.ts` — `emitInitItem` (`:71`), `mergePresetCssFields` (`:145`)
- `www/src/publisher/publish.ts` — `publish` (`:119`), `rewriteDeps` (`:79`), `BUNDLED_INTO_INIT` (`:52`)
- `www/src/publisher/types.ts` — `PublishPreset` (`:79`), `Publishable` (`:61`)
- `www/src/publisher/flatten.ts` — density + enum merge pipeline
- `www/src/publisher/resolve-classes.ts` — scalar param rewriting (`:30`)
- `www/src/routes/r/init.tsx` — GET handler (`:22-59`)
- `www/src/routes/r/$name.tsx` — GET handler + `selectPublishable` (`:32-121`)
- `www/src/registry/types.ts` — `RegistryItem`, `Density`, `ParamDef` (`:7-83`)
- `www/src/registry/theme/primitives.ts` — `resolveColorConfig` (`:67`), `reverseRamp` (`:28`)
- `www/src/registry/theme/color-config.ts` — `DEFAULT_COLOR_CONFIG` (`:72`), `ColorConfig` (`:58`)
- `www/src/registry/theme/semantics.ts` — `DEFAULT_SEMANTICS` (`:36`)
- `www/src/registry/__generated__/base-css.ts` — structured base CSS (whole file)
- `www/src/registry/__generated__/registry-items.ts` — `registryUi` (`:69-130`)
- `www/src/registry/base/base.css`, `colors.css`, `theme.css` — source of globals CSS content
- `www/src/components/marketing/showcase/cards.tsx` — `<Cards />` component (`:20-48`)
- `www/scripts/registry-build.ts` — `ORPHAN_ALLOWLIST` (`:356`), `BUNDLED_INTO_INIT` (`:454`)
- `packages/tailwindcss-autocontrast/src/index.js` — `getContrastColor` (`:339`)
- shadcn registry docs: https://ui.shadcn.com/docs/registry
- shadcn registry:base type: https://ui.shadcn.com/docs/registry/registry-item-type
- pako: https://github.com/nodeca/pako
