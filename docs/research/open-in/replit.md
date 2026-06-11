# Open in Replit

> Summary line: **feasible via two paths (generated-repo import or base-template agent install)** · button type **repo-import** (primary) or **copy-command** (secondary) · preset fidelity **full** · color fidelity **full** (OKLCH ramps written to globals.css by `npx shadcn add /r/init?preset=…`)

---

## 1. User experience

From the dotUI `/create` customizer — state lives in `?preset=<encoded>` via `www/src/routes/_app/create.tsx:11-16`, encoded by `encodePreset` from `www/src/modules/create/preset/codec.ts:75` — the user clicks **"Open in Replit"**.

Two practical flows exist. The primary flow is cleaner but requires dotUI to maintain a GitHub template repo:

### Primary path: GitHub import (generated-repo)

1. Clicking "Open in Replit" triggers a server action (or client-side redirect) that:
   - Calls dotUI's backend to generate (or update) a GitHub repo seeded with the user's preset.
   - Redirects the browser to `https://replit.com/github.com/<owner>/<repo>`.
2. Replit clones the repo, detects it as a Node/Vite project, and opens an IDE session with the app already runnable.
3. The user sees the showcase (`<Cards />` from `www/src/components/marketing/showcase/cards.tsx`) as the first view, with `globals.css` already containing their OKLCH ramp, and every needed dotUI component already installed under `src/components/ui/`.

### Secondary path: base template + agent install (copy-command)

1. Clicking "Open in Replit" opens a fixed public Replit template (a bare Vite + React + Tailwind v4 repo that already has `components.json` configured and `shadcn` available).
2. The button also copies a one-line command to the clipboard — the same command `InstallCommand` produces at `www/src/modules/create/install-command.tsx:39-48`:
   ```
   npx shadcn add https://dotui.com/r/init?preset=<encoded>
   ```
3. The user opens the Replit shell and pastes the command. The shadcn CLI fetches `/r/init?preset=<encoded>` (the `registry:base` item), writes the OKLCH theme into `globals.css`, installs `src/lib/utils.ts`, and bakes the `@dotui` registry alias with the preset into `components.json`. The user then adds components individually via `npx shadcn add @dotui/button` etc., or dotUI can provide a second command that adds all at once.

The primary path is better UX (zero manual commands); the secondary path requires zero dotUI backend work beyond what already exists.

---

## 2. Technical mechanism

### Replit GitHub import URL format

Replit's programmatic project-creation surface for public use is the GitHub import URL:

```
https://replit.com/github.com/<owner>/<repo>
```

Note the literal string `github.com/` embedded in the Replit URL (not `github/`). Examples:

```
https://replit.com/github.com/dotui-org/showcase-template
```

This URL causes Replit to:
- Fork/clone the repo into the user's account.
- Detect the run command from `.replit` or `package.json`.
- Present the live preview and IDE immediately.

There is no Replit API for programmatic project creation available to third parties without OAuth or a Replit Teams plan. The GitHub import URL is the practical public path.

### Runtime environment

Replit runs real Linux VMs (Nix-based). Node.js, `pnpm`, and `npx` are all available. Vite dev server starts fine. The app runs as a normal Vite + React SPA.

### shadcn CLI availability

`npx shadcn@latest` works on Replit exactly as on a developer's laptop. There is no sandbox restriction. The template repo can include shadcn in `devDependencies` so the install skips the network resolution step.

---

## 3. Preset propagation

The preset is the string produced by `encodePreset(ds)` (`www/src/modules/create/preset/codec.ts:75`). Its wire format:

1. Build the compact `DesignSystemState` `{p?,t?,d?,c?}` (`www/src/modules/create/preset/types.ts:14-19`) by diffing `DesignSystem` against `DEFAULTS` (`www/src/modules/create/preset/defaults.ts:5`).
2. `JSON.stringify` the compact state.
3. `pako.deflateRaw(json, { level: 9 })` — raw DEFLATE, no zlib header.
4. URL-safe base64 (`toBase64Url`, `codec.ts:12-21`): `btoa(String.fromCharCode(...bytes))` then `+→-`, `/→_`, strip trailing `=`.
5. `encodePreset` returns `undefined` when the design system equals defaults — the button must handle this case by omitting `?preset=` entirely.

The init URL is therefore:

```ts
// mirrors www/src/modules/create/install-command.tsx:39-48
const encoded = encodePreset(designSystem); // undefined if default
const initUrl = encoded
  ? `https://dotui.com/r/init?preset=${encoded}`
  : `https://dotui.com/r/init`;
```

### Primary path: baking the preset at repo-generation time

For the generated-repo path, the server action does not redirect to a Replit URL immediately. It:

1. Decodes the preset server-side using `decodePreset(encoded)` (`codec.ts:111`).
2. Runs `npx shadcn add <initUrl>` inside a temporary Node process (or calls `emitInitItem` + `publish` directly — see section 5) to produce the full `globals.css` content and component files.
3. Commits those files into a new branch or repo (via GitHub API or `git`).
4. Redirects the user to `https://replit.com/github.com/<owner>/<generated-or-updated-repo>`.

This keeps the preset baked statically — Replit never calls a dotUI endpoint; the preset lives as literal CSS and TS source in the repo.

### Secondary path: live install

The secondary path keeps it simple: the user runs `npx shadcn add <initUrl>` in the Replit shell. The shadcn CLI fetches `/r/init?preset=<encoded>` from `www/src/routes/r/init.tsx`, which calls `decodePresetForRoute(encoded)` (`init.tsx:47-58`) and then `emitInitItem({ baseRegistryCss, preset, encodedPreset, registryRoot })` (`www/src/publisher/emit-theme.ts:71-128`). The returned `registry:base` JSON item is merged into the project's `globals.css` by the shadcn CLI.

The `?preset=` string is intentionally NOT URL-encoded again in the command — `install-command.tsx:41` concatenates it raw. The encoded string is already URL-safe base64.

---

## 4. Components installed

### What "installed" means in a target project

After `npx shadcn add https://dotui.com/r/init?preset=<encoded>` the project has:
- `src/lib/utils.ts` — the `cn()` helper (ships inline in the init item's `files[]`, `emit-theme.ts:41-47`, because shadcn's own `cn` is 4xx-gated under Tailwind v4).
- `components.json` updated with `registries["@dotui"] = "https://dotui.com/r/{name}?preset=<encoded>"` (`emit-theme.ts:130-132`). This bakes the preset so all subsequent `shadcn add @dotui/<name>` calls hit the right endpoint.

To install the full component set needed to render the showcase, shadcn add must be called for each component the showcase uses. From the transitive import graph (`showcase/cards.tsx` imports all 17 cards which collectively use 37 registry items):

```bash
npx shadcn add @dotui/accordion @dotui/avatar @dotui/badge @dotui/button \
  @dotui/calendar @dotui/card @dotui/checkbox @dotui/checkbox-group \
  @dotui/color-area @dotui/color-editor @dotui/color-field @dotui/color-slider \
  @dotui/color-thumb @dotui/disclosure @dotui/drop-zone @dotui/field \
  @dotui/file-trigger @dotui/group @dotui/input @dotui/kbd @dotui/link \
  @dotui/list-box @dotui/loader @dotui/otp-field @dotui/popover \
  @dotui/progress-bar @dotui/radio-group @dotui/select @dotui/separator \
  @dotui/slider @dotui/switch @dotui/table @dotui/tabs @dotui/tag-group \
  @dotui/text @dotui/text-field @dotui/time-field @dotui/toggle-button \
  @dotui/toggle-button-group
```

Each `@dotui/<name>` resolves via the baked `registries` alias to `/r/<name>?preset=<encoded>`. The per-component route `www/src/routes/r/$name.tsx` applies `density` and `componentParams` from the preset, rewriting Tailwind class strings and serializing the `tv()` config (`publish.ts:119-161`). Transitive deps (e.g. `button → loader → focus-styles`) are resolved as absolute URLs with the same preset appended (`rewriteDeps`, `publish.ts:79-105`), so the full graph installs with the correct preset.

### For the primary (generated-repo) path

The repo is pre-populated. All 39 component files (37 ui items + `utils` + `focus-styles` bundled into init) are committed as resolved TypeScript under `src/components/ui/`. Their content is exactly what `publish({ publishable, preset })` would emit for the user's preset: density-adjusted class strings, scalar-resolved Tailwind suffixes, enum-with-files variants (e.g. `loader` ships `base.spinner.tsx` or `base.ring.tsx` depending on `componentParams.loader.style`). The `selectPublishable` logic at `www/src/routes/r/$name.tsx:89-107` determines which file variant ships.

---

## 5. Theme in globals.css

### What `/r/init?preset=<encoded>` writes

The `emitInitItem` function (`www/src/publisher/emit-theme.ts:71-128`) returns a `registry:base` item. When shadcn processes it, the following is merged into the consumer's `globals.css`:

**At-rules (constant across presets, from `baseRegistryCss`):**
```css
@import "tw-animate-css";
@plugin "tailwindcss-react-aria-components";
@plugin "tailwindcss-autocontrast" { cssfile: "<this-file>"; }
@plugin "tailwindcss-with";
@custom-variant dark (&:is(.dark *));
@utility focus-ring { … }
@utility focus-reset { … }
@utility focus-input { … }
@utility no-highlight { … }
@layer base { * { @apply border-border } body { @apply bg-bg font-sans text-fg } html { @apply font-sans } }
::selection { background-color: var(--accent-800); color: var(--on-accent-800); }
```

**`@theme inline` block (constant, from `cssVars.theme`, `base-css.ts:179-278`):**
```css
@theme inline {
  --radius-md: calc(0.375rem * var(--radius-factor));
  --color-bg: var(--neutral-50);
  --color-accent: var(--accent-500);
  --color-fg-on-accent: var(--on-accent-500);
  /* ... all ~80 semantic color tokens + radius scale + cursors + eases */
}
```

**`:root` block (preset-specific):**
```css
:root {
  --radius-factor: 1;
  /* 6 palettes × 11 steps = 66 OKLCH primitive ramp vars for the USER'S chosen seeds */
  --neutral-50: oklch(0.985 0 0);
  --neutral-100: oklch(0.9562 0 0);
  /* ... */
  --accent-50: oklch(…);  /* derived from user's accent seed via resolveColorConfig */
  /* ... all 66 vars for neutral/accent/success/warning/danger/info */
}
```

**`.dark` block:** the reversed ramp (each palette's steps 50↔950 swapped, `reverseRamp`, `primitives.ts:28-37`).

The color ramps are generated by `resolveColorConfig(preset.color)` (`emit-theme.ts:155-159`) when `preset.color` is present, or taken from the static `baseRegistryCss` (built from `DEFAULT_COLOR_CONFIG`) otherwise. `resolveColorConfig` is at `www/src/registry/theme/primitives.ts:67-108`; it calls `@dotui/colors` kernel `createTheme` with the user's seeds and algorithm. `rampsToVars` (`emit-theme.ts:134-143`) flattens the resolved ramp to `--<palette>-<step>` OKLCH strings.

`--on-*` foreground variables are NOT emitted into the init item. The `tailwindcss-autocontrast` plugin generates them at Tailwind compile time from the `--<palette>-<step>` values in `:root`/`.dark` (`emit-theme.ts:152-159`). The template repo must therefore include a Tailwind config that loads the autocontrast plugin.

**Density:**
- `density === "compact"` (the dotUI default, `registry/types.ts:7`): nothing written to `:root`; the compact class strings are already baked into component files.
- `density !== "compact"`: `--dotui-density: <value>` is written to `:root` (`emit-theme.ts:53-69`). Note: this var is informational only; no CSS selector currently reads it. Density actually bakes into component class strings at publish time via `flatten` (`publisher/flatten.ts:148-170`) — the class strings in the installed `.tsx` files already reflect the chosen density.

### For the primary (generated-repo) path

`globals.css` is committed with the preset fully resolved. The server-side generation step calls `emitInitItem` directly, taking its `css` and `cssVars` output and serializing it into the committed `globals.css`. No runtime shadcn install is needed in the Replit session itself.

---

## 6. The showcase as first view

### What the showcase is

`Cards` (`www/src/components/marketing/showcase/cards.tsx:20-48`) renders 17 self-contained widgets in a responsive masonry grid (`columns-1 sm:columns-2 lg:columns-3 xl:columns-4`). All state is local (no loaders, no server functions, no routing). The full component list: Booking, TwoFactor, Filters, Storage, Notifications, CookiePreferences, InviteMembers, Shortcuts, Payment, Transactions, AccountMenu, Faq, ColorEditorCard, UploadAvatar, TeamName, Feedback, LoginForm.

### Showcase dependencies (what the Replit project must include)

Beyond the 37 ui registry items, the showcase needs:

**Runtime modules to copy verbatim:**
- `www/src/registry/lib/utils/index.ts` → `src/lib/utils.ts` (the `cn()` helper; already shipped by init)
- `www/src/registry/lib/context/index.tsx` → `src/lib/context.tsx` (used by avatar, tabs, toggle-button, button)
- `www/src/registry/hooks/use-image-loading-status.ts` → `src/hooks/use-image-loading-status.ts` (used by avatar)
- `www/src/modules/core/styles.tsx` → `src/modules/core/styles.tsx` (DesignSystemProvider + createStyles)

**Showcase card source files:**
All files under `www/src/components/marketing/showcase/*.tsx` — 17 cards plus `cards.tsx` itself.

**External npm packages** (must be in `package.json`):
```json
{
  "dependencies": {
    "react": "^19",
    "react-dom": "^19",
    "react-aria-components": "latest",
    "react-aria": "latest",
    "react-stately": "latest",
    "@internationalized/date": "latest",
    "@base-ui/react": "latest",
    "lucide-react": "latest",
    "tailwind-variants": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest",
    "@fontsource-variable/geist": "latest",
    "@fontsource/geist-mono": "latest",
    "tw-animate-css": "latest",
    "tailwindcss-react-aria-components": "latest"
  }
}
```

`tailwindcss-autocontrast` and `tailwindcss-with` are workspace packages in dotUI. They must be published to npm or vendored in the template repo before the "Open in Replit" path can work without manual steps. This is a hard prerequisite (see section 9).

### App.tsx / entry point

```tsx
// src/App.tsx
import "./globals.css";
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

No `DesignSystemProvider` is required for the showcase to render — the default context (`{ params: {}, tokens: {}, density: "default" }`) gives every component its default visual variant. The preset's visual effect comes entirely from the installed component files (density-baked class strings) and `globals.css` (OKLCH ramps), not from a runtime provider.

For dark-mode support, wrap with a tiny inline script or a `next-themes`-style provider that toggles `class="dark"` on `<html>`. `ThemeProvider` from `packages/starter-themes` depends on `@tanstack/react-router`'s `ScriptOnce` and should not be used in a plain Vite project.

### Path aliases

The showcase and component files use the `@/` alias rooted at `src/`. The Vite config must include:

```ts
// vite.config.ts
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

### Remote avatar images

The showcase cards load GitHub CDN avatars at runtime (e.g. `https://github.com/mehdibha.png`). Replit VMs have outbound internet access, so this works without any configuration. `AvatarFallback` handles the offline case gracefully.

---

## 7. What dotUI must build

### Minimal viable (secondary path — copy-command only)

Nothing new is required. The install command already exists (`InstallCommand` component, `www/src/modules/create/install-command.tsx`). The "Open in Replit" button on the secondary path is:

1. A link to the fixed Replit template URL.
2. A clipboard copy of `npx shadcn add https://dotui.com/r/init?preset=<encoded>`.

The template repo itself (a bare Vite + React + Tailwind v4 project with `components.json` pre-configured) is a one-time manual setup.

### Full-fidelity (primary path — generated-repo import)

**New server action** (e.g. `www/src/routes/api/open-in/replit.ts` or an API route):

```ts
// pseudocode for the generation endpoint
GET /api/open-in/replit?preset=<encoded>

1. const encodedPreset = url.searchParams.get("preset") ?? undefined;
2. const preset = encodedPreset ? decodePreset(encodedPreset) : defaultPreset();
3. // Generate globals.css
   const initItem = emitInitItem({ baseRegistryCss, preset, encodedPreset, registryRoot });
   const globalsCss = serializeInitItemToCss(initItem); // expand css/cssVars to real CSS text
4. // Generate component files for all 37 showcase-needed items
   setKnownDotuiNames(PUBLISHABLE_NAMES);
   setDotuiDepResolver(origin, encodedPreset ? `?preset=${encodedPreset}` : "");
   const componentFiles: Record<string, string> = {};
   for (const name of SHOWCASE_COMPONENT_NAMES) { // the 37-item subset
     const mod = await publishables[name]();
     const publishable = selectPublishable(mod, preset);  // handles loader enum-with-files
     const { item } = publish({ publishable, preset });
     for (const f of item.files) {
       componentFiles[`src/components/${f.target}`] = f.content;
     }
   }
5. // Commit to GitHub (or push to a preset-keyed branch of the template repo)
   await commitToGitHub({ globalsCss, componentFiles, preset: encodedPreset });
6. // Redirect
   return Response.redirect(`https://replit.com/github.com/dotui-org/showcase-template`);
```

`selectPublishable` logic is currently private in `www/src/routes/r/$name.tsx:89-107` and must be extracted to `www/src/publisher/publish.ts` or a shared utility for reuse here.

**Key functions to reuse:**
- `emitInitItem` — `www/src/publisher/emit-theme.ts:71`
- `publish` — `www/src/publisher/publish.ts:119`
- `setKnownDotuiNames` / `setDotuiDepResolver` — `www/src/publisher/publish.ts`
- `publishables` / `PUBLISHABLE_NAMES` — `www/src/registry/__generated__/publishables/index.ts` (present after `pnpm build:registry`)

**The GitHub template repo** (`dotui-org/showcase-template`) must contain:
- `package.json` with all peer deps listed in section 6.
- `vite.config.ts` with `@tailwindcss/vite` and the `@/` alias.
- `src/App.tsx` rendering `<Cards />`.
- `src/components/marketing/showcase/*.tsx` — all 17 card files + `cards.tsx`.
- `src/modules/core/styles.tsx`, `src/lib/context.tsx`, `src/hooks/use-image-loading-status.ts`.
- `src/registry/__generated__/icons.tsx` (or inline the one Lucide import `ExternalLinkIcon`).
- `.replit` file: `run = "pnpm dev --host 0.0.0.0"` (Replit requires `--host 0.0.0.0` to expose the port).
- `components.json` pre-configured for shadcn (for the secondary path).

For the primary path, `globals.css` and `src/components/ui/*.tsx` are overwritten per preset at generation time.

---

## 8. Schema / meta.ts changes

No changes to `www/src/registry/types.ts` or any `meta.ts` file are required for the Replit path.

The Replit open-in logic operates entirely on data already available:
- `encodePreset` / `decodePreset` from `www/src/modules/create/preset/codec.ts`
- `emitInitItem` from `www/src/publisher/emit-theme.ts`
- `publish` + `PUBLISHABLE_NAMES` from `www/src/publisher/publish.ts` and `__generated__/publishables`
- The 37 component names needed for the showcase (a static constant derived from `showcase/cards.tsx`'s import graph)

If a future iteration wants to serve a `/r/registry.json` index for shadcn MCP discovery (so Replit's AI agent can discover all dotUI components), add a new route `www/src/routes/r/registry[.]json.tsx` (or `registry%5B.%5Djson.tsx` for the literal dot in TanStack Start). That route imports `registryUi`, `registryLib`, `registryHooks`, `registryBase` from the generated manifests and emits the shadcn `Registry` shape:

```jsonc
{
  "name": "dotui",
  "homepage": "https://dotui.com",
  "items": [
    { "name": "button", "type": "registry:ui", "title": "Button", ... },
    ...
  ]
}
```

Per item: strip `group` and `params` (dotUI-only), omit `files[].content` (point `files[].path` at `/r/<name>`). Names come from `registry-items.ts:70-129`. This is blocked today (returns 404) and is a separate prerequisite for the shadcn MCP route — not required for the GitHub import path.

---

## 9. Limitations, risks, fallbacks

### Programmatic Replit project creation is not a public API

Replit does not expose a public REST API for creating new projects on behalf of arbitrary users. The only no-auth path is `https://replit.com/github.com/<owner>/<repo>`, which imports from a GitHub repo into the visiting user's account. A persistent generated-repo-per-preset approach would require GitHub API credentials and could result in many repos. Mitigation: use a single template repo with a preset-keyed branch, or generate the repo on-the-fly and delete it after the redirect (TTL-based cleanup).

### `tailwindcss-autocontrast` and `tailwindcss-with` are not on npm

These are workspace packages (`packages/tailwindcss-autocontrast`, `packages/tailwindcss-with`). The Replit template cannot install them via `npm install` today. Options:
- Publish both to npm (the correct long-term fix; required for any "open in" path that installs dotUI into an external project).
- Vendor the packages inline in the template repo under `src/plugins/` and reference them via relative path in the Tailwind config.
- In the interim, use the `css` field override in `emitInitItem` to inline the autocontrast output directly into `:root`/`.dark` (this is what `emitPrimitivesCss({onColors:true})` does for the live preview at `primitives.ts:130-138`). This replaces the plugin-at-build approach with statically baked `--on-*` values.

### `--on-*` variables require the autocontrast plugin at Tailwind compile time

If `tailwindcss-autocontrast` is absent, `--on-accent-500` etc. are never generated, and semantic tokens like `--color-fg-on-accent` (which point at `--on-accent-500`) resolve to empty. The workaround for the generated-repo path: call `onBlackWhite` (`packages/colors/src/shared/on-color.ts:88-97`) for each ramp step and write the `--on-*` values directly into `:root`/`.dark` at generation time, bypassing the plugin. This matches the live-preview behavior exactly (`primitives.ts:140-148`).

### `registry.json` index is absent

`/r/registry.json` returns 404 today. Replit's AI agents (or the shadcn MCP server) cannot auto-discover dotUI components without it. This only affects the secondary flow if the user expects AI-assisted component discovery; it does not affect the GitHub import path or the manual `npx shadcn add @dotui/<name>` flow.

### Branch-per-preset GitHub strategy has repo sprawl risk

A new repo (or branch) per preset means potentially thousands of repos/branches over time. Use a content-addressed branch name (e.g. `preset/<first-16-chars-of-encoded>`) and enforce a TTL cleanup job. Alternatively: generate the full file content in memory, push to a gist or ephemeral GitHub App installation, and redirect to the import URL immediately.

### Replit `--host 0.0.0.0` is mandatory

Vite's default `localhost` binding is not accessible from Replit's public URL. The template's `.replit` run command must be `pnpm dev --host 0.0.0.0`; otherwise the user sees a blank preview.

### `pako` must be available server-side for the generation endpoint

`pako` is already a dep at `www/package.json:46`. The generation endpoint runs in the same TanStack Start server, so `decodePreset` (which calls `pako.inflateRaw`) is available without any additional install.

---

## 10. Step-by-step implementation checklist

### Phase 0: prerequisites

- [ ] Publish `tailwindcss-autocontrast` to npm (or decide to inline `--on-*` values at generation time).
- [ ] Publish `tailwindcss-with` to npm (or vendor it in the template).
- [ ] Create the GitHub template repo `dotui-org/showcase-template` (see section 7 for required contents).
- [ ] Add `.replit` file to the template: `run = "pnpm dev --host 0.0.0.0"`.
- [ ] Verify `https://replit.com/github.com/dotui-org/showcase-template` opens correctly.

### Phase 1: secondary path (copy-command, zero backend work)

- [ ] Add an "Open in Replit" button to the `/create` page (next to the existing install command in `www/src/modules/create/install-command.tsx` or as a sibling component).
- [ ] The button opens the fixed template URL in a new tab: `window.open("https://replit.com/github.com/dotui-org/showcase-template")`.
- [ ] The button also copies `npx shadcn add https://dotui.com/r/init?preset=<encoded>` to the clipboard (reuse the `encodePreset(designSystem)` + `getRegistryHost()` logic already in `install-command.tsx:17-48`).
- [ ] Add a tooltip/label: "Opens the Replit template. Paste the copied command in the Replit shell to install your preset."

### Phase 2: primary path (full-fidelity generated-repo import)

- [ ] Extract `selectPublishable` from `www/src/routes/r/$name.tsx:89-107` into `www/src/publisher/publish.ts` (or a new `www/src/publisher/select-publishable.ts`) so the generation endpoint can call it.
- [ ] Write the server action at `www/src/routes/api/open-in/replit.ts` (TanStack Start API route):
  - [ ] Parse `?preset=` from the query.
  - [ ] Call `decodePreset` → `PublishPreset`.
  - [ ] Call `emitInitItem({ baseRegistryCss, preset, encodedPreset, registryRoot })` to get the init item.
  - [ ] Serialize the init item's `css` / `cssVars` to real CSS text (the reverse of `cssToRegistryFields` — write a `registryFieldsToCss` helper or use the already-serialized blocks from `baseRegistryCss` directly).
  - [ ] Loop over `SHOWCASE_COMPONENT_NAMES` (define this constant as the 37 names from the showcase's import graph): call `publishables[name]()`, `selectPublishable`, `publish`, collect `item.files`.
  - [ ] Use GitHub API (with a dotUI bot token) to commit the generated files to a branch `preset/<encoded-prefix>` of `dotui-org/showcase-template`.
  - [ ] Redirect `302` to `https://replit.com/github.com/dotui-org/showcase-template/tree/preset/<encoded-prefix>` (Replit's GitHub import URL supports branch refs via `/tree/<branch>`).
- [ ] Add TTL cleanup: a cron job or GitHub Actions workflow that deletes `preset/*` branches older than 7 days.
- [ ] Update the button from phase 1 to hit the new API route instead of opening the template directly.

### Phase 3: registry.json index (enables shadcn MCP + AI agent discovery)

- [ ] Add route `www/src/routes/r/registry[.]json.tsx` that imports `registryUi`, `registryLib`, `registryHooks`, `registryBase` and emits the shadcn `Registry` shape (see section 8).
- [ ] Verify the shadcn MCP server config works: `{ command: "npx", args: ["-y", "shadcn@latest", "registry:mcp"], env: { REGISTRY_URL: "https://dotui.com/r/registry.json" } }`.
- [ ] Update dotUI's documentation to advertise the MCP endpoint.

---

## Sources

- dotUI preset codec: `www/src/modules/create/preset/codec.ts:75-126` — `encodePreset`, `decodePreset`, pako + base64url wire format.
- dotUI install command: `www/src/modules/create/install-command.tsx:17-48` — live URL construction from preset.
- dotUI init route: `www/src/routes/r/init.tsx:22-59` — `GET /r/init?preset=` handler.
- dotUI init item emitter: `www/src/publisher/emit-theme.ts:71-170` — `emitInitItem`, color ramp merge, density var, `@dotui` registry alias.
- dotUI component publisher: `www/src/publisher/publish.ts:119-161` — `publish`, `rewriteDeps`.
- dotUI base CSS generated: `www/src/registry/__generated__/base-css.ts` — structured at-rules + semantic `@theme inline` + default ramps.
- dotUI showcase: `www/src/components/marketing/showcase/cards.tsx:20-48` — the 17-card masonry grid.
- Replit GitHub import URL format: `https://replit.com/github.com/<owner>/<repo>` — documented in Replit's "Import from GitHub" feature (https://docs.replit.com/getting-started/creating-a-repl).
- Replit `.replit` run config: https://docs.replit.com/programming-ide/configuring-repl — `run` command must bind to `0.0.0.0`.
- shadcn `registry:base` item type and `shadcn add <url>`: https://ui.shadcn.com/docs/registry/registry-item-type — describes how `registry:base` + `config.registries` is consumed.
- shadcn `config.registries` baking pattern: `emit-theme.ts:130-132` — writes `@dotui` alias with preset-baked URL into `components.json`.
- Transitive dep rewrite with preset: `www/src/publisher/publish.ts:79-105` — `rewriteDeps` + `setDotuiDepResolver`.
- `tailwindcss-autocontrast` `--on-*` generation: `packages/tailwindcss-autocontrast/src/index.js:407-501` — scans `:root`/`.dark` for `--<name>-<shade>`, injects `--on-<name>-<shade>`.
- OKLCH ramp reversal for dark mode: `www/src/registry/theme/primitives.ts:28-37` — `reverseRamp`.
- `resolveColorConfig` + `rampsToVars`: `www/src/registry/theme/primitives.ts:67-108`; `emit-theme.ts:134-143`.
- Static `--on-*` bake (live preview path, workaround for absent plugin): `www/src/registry/theme/primitives.ts:130-148`.
- `pako` dependency: `www/package.json:46` — `"pako": "^2.1.0"`.
