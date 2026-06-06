# Open in bolt.new

> Viable via generated GitHub repo · button type **repo-import** · preset fidelity **full** · color fidelity **full**

---

## 1. User experience

The user is on `https://dotui.com/create` with a custom preset active (e.g. an orange accent, comfortable density, card style "tasnim"). They click **"Open in bolt.new"**.

What they should land in:

1. bolt.new opens a WebContainer running the generated repo.
2. The home page immediately renders the dotUI **showcase** (`cards.tsx`) — all 17 card widgets (Booking, TwoFactor, Filters, Storage, Notifications, CookiePreferences, InviteMembers, Shortcuts, Payment, Transactions, AccountMenu, Faq, ColorEditorCard, UploadAvatar, TeamName, Feedback, LoginForm).
3. Every `ui/` component (button, card, slider, etc.) is pre-installed and styled with the chosen preset: the orange accent palette in `globals.css`, `density: comfortable` baked into component class strings, card style set to `tasnim`.
4. The user can immediately start editing — the design system is theirs, already configured.

No "run npm install", no "run shadcn add", no prompt to enter. The repo is complete before bolt ever opens it.

---

## 2. Technical mechanism

bolt.new supports opening a public GitHub repo at:

```
https://bolt.new/~/github.com/<owner>/<repo>
```

This is the deterministic path. bolt clones the repo into a WebContainer and runs the project's dev server. It does not accept a programmatic in-memory file tree via URL, and it does not have a documented API for injecting files.

Two candidate paths exist:

### Path A — Generated GitHub repo (RECOMMENDED)

dotUI generates a complete Vite + React project repo on the fly (or commits to a per-user/per-preset branch), then redirects to `https://bolt.new/~/github.com/dotui-generated/<repo-slug>`.

- The generated repo contains: `src/globals.css` (theme with the user's preset baked in), `src/components/ui/**` (all component files with preset-resolved class strings), `src/components/marketing/showcase/**` (the 17 card widgets verbatim), `src/App.tsx` (renders `<Cards />`), full `package.json`, `vite.config.ts`, etc.
- The preset is baked at generation time — the result is a static snapshot, fully deterministic.
- bolt.new receives a plain GitHub URL, no special handling needed.

### Path B — Unofficial `?prompt=` param (NOT RECOMMENDED)

```
https://bolt.new?prompt=npx+shadcn+add+https://dotui.com/r/init?preset=<encoded>
```

This is non-deterministic. The bolt agent receives a natural-language prompt and decides how and whether to run `shadcn add`. It may produce an incorrect project structure, miss dependencies, or fail silently. It cannot guarantee the showcase is the first view. This path is undocumented and subject to breakage with no notice. **Do not rely on it.**

**Verdict: Path A (generated GitHub repo) is the only implementation that achieves full preset fidelity + guaranteed showcase as first view.**

---

## 3. Preset propagation

The preset is encoded at the dotUI customizer as:

```ts
// www/src/modules/create/preset/codec.ts:75
const encoded = encodePreset(designSystem);
// → pako.deflateRaw(JSON.stringify(compactState), { level: 9 }) → base64url
```

The compact `DesignSystemState` (`www/src/modules/create/preset/types.ts:14`) carries only diffs vs defaults:
```ts
{ p?: Record<string, Record<string, string>>;  // componentParams diff
  t?: Record<string, string>;                   // tokens diff
  d?: Density;                                  // density (omitted if "compact")
  c?: ColorConfig;                              // full color recipe (omitted if default) }
```

For the bolt.new integration, the "Open in bolt.new" button reads this encoded string from the current `?preset=` URL search param and passes it to the repo-generation server function. The server function calls `decodePreset(encoded)` to reconstruct the full `DesignSystem`, then uses that to drive generation.

The four aspects of preset fidelity and how each is achieved:

| Aspect | How achieved |
|---|---|
| Color palette (OKLCH ramps) | `resolveColorConfig(ds.color)` → `rampsToVars()` → baked into `globals.css` `:root`/`.dark` |
| Density | `publish({ publishable, preset })` with `preset.density` — `flatten.ts` merges `density[selected]` tv layer into each component's class string |
| Enum param choices (card style, loader style, etc.) | Same `publish()` call — `flatten.ts` merges `params[name][value]` tv layer; enum-with-files (loader) swaps source file |
| Scalar param choices (avatar radius, slider thumb-size, etc.) | `resolveClasses()` → `buildScalarVarMap()` rewrites e.g. `rounded-(--avatar-radius)` → `rounded-full` in the component source |

The `tokens` field (`t` in the compact state) is **not yet threaded through `PublishPreset`** — this is a documented TODO at `www/src/publisher/emit-theme.ts:62-68`. If the user has set a custom `--radius-factor` via the customizer, it will not appear in the generated `globals.css`. This is the same limitation that applies to the install-command path today.

---

## 4. Components installed

The showcase `Cards` component (`www/src/components/marketing/showcase/cards.tsx:20-48`) uses the following 38 `registry/ui` components (plus `registry/lib` utilities):

**UI components** (all 38 installed under `src/components/ui/`):
accordion, avatar, badge, button, calendar, card, checkbox, checkbox-group, color-area, color-editor, color-field, color-slider, color-thumb, disclosure, drop-zone, field, file-trigger, group, input, kbd, link, list-box, loader, otp-field, popover, progress-bar, radio-group, select, separator, slider, switch, table, tabs, tag-group, text, text-field, time-field, toggle-button, toggle-button-group

**Lib / hooks** (installed under `src/lib/` and `src/hooks/`):
- `src/lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)
- `src/lib/context.tsx` — `createContext`, `createVariantsContext`, `createScopedContext` (used by avatar, tabs, toggle-button, button)
- `src/hooks/use-image-loading-status.ts` — avatar image load state

Each component file is generated by calling the dotUI publisher:

```ts
// www/src/publisher/publish.ts:119
const { item } = publish({ publishable, preset });
// item.files[0].content = base.tsx template with %%TV_CONFIG%% replaced,
//   class strings resolved for density + enum params + scalar params
```

The `loader` component uses enum-with-files — the `style` param selects `base.spinner.tsx` or `base.ring.tsx` via `selectPublishable()` (`www/src/routes/r/$name.tsx:89-107`). The generation function must replicate this logic.

Each component file's install target comes from `meta.files[0].target` (e.g. `"ui/button.tsx"` → `src/components/ui/button.tsx`). The generated repo maps these to a Vite project with alias `@/ → src/`.

---

## 5. Theme in globals.css

The init item produced by `emitInitItem()` (`www/src/publisher/emit-theme.ts:71-128`) is the single source of truth for `globals.css` content. For the generated repo, we call this function server-side and render its output directly into `src/globals.css`.

The generated file has this structure:

```css
@import "tailwindcss";
@import "@fontsource-variable/geist";
@import "@fontsource/geist-mono";

/* From item.css — at-rules block */
@import "tw-animate-css";
@plugin "tailwindcss-react-aria-components";
@plugin "tailwindcss-autocontrast" { cssfile: "./src/globals.css"; }
@plugin "tailwindcss-with";
@custom-variant dark (&:is(.dark *));
@utility focus-ring { … }
@utility focus-reset { … }
@utility focus-input { … }
@utility focus-no-highlight { … }
@layer base { * { @apply border-border; } body { @apply bg-bg font-sans text-fg; } }
::selection { background-color: var(--accent-800); color: var(--on-accent-800); }

/* From item.cssVars.theme — constant across presets */
@theme inline {
  --radius-md: calc(0.375rem * var(--radius-factor));
  --color-bg: var(--neutral-50);
  --color-accent: var(--accent-500);
  /* … all semantic tokens … */
}

/* From item.css[":root"] — PRESET-SPECIFIC ramps */
:root {
  --radius-factor: 1;
  --neutral-50: oklch(0.985 0 0);
  /* … 66 vars (6 palettes × 11 steps) — values reflect the chosen color seeds … */
}

/* From item.css[".dark"] — reversed ramps */
.dark {
  --neutral-50: oklch(0.13 0 0);
  /* … */
}
```

The OKLCH ramp values in `:root`/`.dark` are generated by:
```ts
// www/src/registry/theme/primitives.ts:67
const resolved = resolveColorConfig(preset.color);
// resolved.light = { neutral: { "50": "oklch(…)", … }, accent: {…}, … }
// resolved.dark  = light ramps reversed (step 50↔950) per reverseRamp()
```

The `--on-*` foreground variables (`--on-accent-500`, etc.) are NOT emitted into `globals.css`. They are derived at Tailwind compile time by the `tailwindcss-autocontrast` plugin, which scans `:root`/`.dark` for `--<palette>-<step>` vars and injects `--on-<palette>-<step>: black | white` (`packages/tailwindcss-autocontrast/src/index.js:407-501`). The generated repo includes this plugin in `devDependencies` and the `@plugin` declaration handles the rest.

Note on the `cssfile` option for `tailwindcss-autocontrast`: in the generated consumer project, this must point at the consumer's actual CSS entry file — `"./src/globals.css"` (not the registry's own `./src/styles.css`). The init item emits `@plugin "tailwindcss-autocontrast"` without a `cssfile` body in the structured JSON; the repo generator should inject it with the correct path.

---

## 6. The showcase as first view

The showcase is `www/src/components/marketing/showcase/cards.tsx`. It renders all 17 card widgets inline — no routing, no loaders, all client-side state. The files to copy verbatim:

```
www/src/components/marketing/showcase/cards.tsx
www/src/components/marketing/showcase/booking.tsx
www/src/components/marketing/showcase/two-factor.tsx
www/src/components/marketing/showcase/filters.tsx
www/src/components/marketing/showcase/storage.tsx
www/src/components/marketing/showcase/notifications.tsx
www/src/components/marketing/showcase/cookie-preferences.tsx
www/src/components/marketing/showcase/invite-members.tsx
www/src/components/marketing/showcase/shortcuts.tsx
www/src/components/marketing/showcase/payment.tsx
www/src/components/marketing/showcase/transactions.tsx
www/src/components/marketing/showcase/account-menu.tsx
www/src/components/marketing/showcase/faq.tsx
www/src/components/marketing/showcase/color-editor.tsx
www/src/components/marketing/showcase/upload-avatar.tsx
www/src/components/marketing/showcase/team-name.tsx
www/src/components/marketing/showcase/feedback.tsx
www/src/components/marketing/showcase/login-form.tsx
```

The generated `src/App.tsx`:

```tsx
import "./globals.css";
import { Cards } from "./components/marketing/showcase/cards";

export default function App() {
  return (
    <div className="min-h-screen bg-bg font-sans text-fg antialiased">
      <main className="container py-12">
        <Cards />
      </main>
    </div>
  );
}
```

No `DesignSystemProvider` is required for the showcase to render correctly — the default context value (`{ params: {}, tokens: {}, density: "default" }` in `www/src/modules/core/styles.tsx`) gives every component its default visual variant. The preset is already baked into the component source files; there is no runtime customizer to wire up.

No `ThemeProvider` from `packages/starter-themes` is required either. That package depends on `@tanstack/react-router` (not present in a plain Vite project). A minimal dark-mode toggle can be provided later, or omitted — the generated project renders in light mode by default.

The showcase imports `@/registry/__generated__/icons.tsx` only for `ExternalLinkIcon` (used in `invite-members.tsx:6`). The generated repo should either copy `icons.tsx` (it is a generated file that re-exports Lucide icons) or replace the import with a direct `import { ExternalLink } from "lucide-react"`. The direct import is simpler.

---

## 7. What dotUI must build

### 7.1 A new server function: `generatePresetRepo(encodedPreset: string)`

Located at e.g. `www/src/server/generate-repo.ts`. This function:

1. Decodes the preset:
   ```ts
   const ds = decodePreset(encodedPreset);
   const preset: PublishPreset = { color: ds.color, density: ds.density, componentParams: ds.componentParams };
   ```

2. Generates the init item (theme + `globals.css` content):
   ```ts
   import { emitInitItem } from "@/publisher/emit-theme";
   import { baseRegistryCss } from "@/registry/__generated__/base-css";
   const themeItem = emitInitItem({ baseRegistryCss, preset, encodedPreset, registryRoot: "https://dotui.com" });
   ```
   Render `themeItem.css` and `themeItem.cssVars.theme` into a `globals.css` string.

3. Generates every component file:
   ```ts
   import { publishables, PUBLISHABLE_NAMES } from "@/registry/__generated__/publishables";
   import { publish, setKnownDotuiNames, setDotuiDepResolver } from "@/publisher/publish";
   import { format } from "oxfmt";

   setKnownDotuiNames(PUBLISHABLE_NAMES);
   // No dep rewriting needed — all deps are local in the generated project
   setDotuiDepResolver("", "");

   for (const name of SHOWCASE_COMPONENT_NAMES) {
     const mod = await publishables[name]();
     const publishable = selectPublishable(mod, preset);
     const { item } = publish({ publishable, preset });
     const formatted = (await format(item.files[0].target, item.files[0].content, { printWidth: 120, useTabs: true })).code;
     // write to src/components/ui/<target> in the repo
   }
   ```
   `SHOWCASE_COMPONENT_NAMES` is the list of 38 components from Section 4. `selectPublishable` is currently private in `www/src/routes/r/$name.tsx:89-107` — extract it to `www/src/publisher/publish.ts` or a shared util file.

4. Assembles the full file tree:
   - `package.json` (with all deps from Section 9)
   - `vite.config.ts`
   - `tsconfig.json`
   - `index.html`
   - `src/globals.css` (generated theme)
   - `src/main.tsx`
   - `src/App.tsx` (renders `<Cards />`)
   - `src/lib/utils.ts` (from `themeItem.files[0].content`)
   - `src/lib/context.tsx` (copy of `www/src/registry/lib/context/index.tsx`)
   - `src/hooks/use-image-loading-status.ts`
   - `src/components/ui/**` (all 38 generated component files)
   - `src/components/marketing/showcase/**` (17 card files, verbatim copies)

5. Commits or pushes the file tree to a GitHub repo under `dotui-generated/<repo-slug>` using the GitHub API (octokit or REST). The slug can be `preset-<short-hash-of-encoded>` to make repos reusable/cacheable.

6. Returns the bolt.new URL:
   ```ts
   return `https://bolt.new/~/github.com/dotui-generated/${slug}`;
   ```

### 7.2 A new route: `www/src/routes/r/generate-repo.tsx`

A TanStack Start server GET handler that accepts `?preset=<encoded>`, calls `generatePresetRepo()`, and returns a `302 Location` redirect to the bolt.new URL. The "Open in bolt.new" button navigates to this route.

### 7.3 Extract `selectPublishable` to a shared location

Currently in `www/src/routes/r/$name.tsx:89-107`. Move to `www/src/publisher/publish.ts` or a new `www/src/publisher/select-publishable.ts` so `generate-repo.ts` can import it without importing the route module.

### 7.4 A GitHub bot account or app for the generated repos

The generation function needs write access to a GitHub org/account (e.g. `dotui-generated`). Use a fine-grained GitHub PAT or a GitHub App with `contents: write` on that org. Store the token in an env var (`GITHUB_GENERATE_TOKEN`).

### 7.5 "Open in bolt.new" button in the customizer UI

In the customizer footer, alongside the existing "Copy install command" (`www/src/modules/create/install-command.tsx`), add a button component that:
- Reads `encodePreset(designSystem)` (same as `InstallCommand` does at `:40`)
- On click: opens `/r/generate-repo?preset=<encoded>` (or calls the server fn directly and opens the returned URL)
- Shows a loading spinner during repo generation

---

## 8. Schema / meta.ts changes

No `meta.ts` changes are required for the bolt.new integration. The publisher already produces all needed output from existing meta fields.

The one optional addition: if you want to **exclude** certain components from the "Open in bolt.new" bundle (e.g. WIP components), you could add a `bolt?: false` guard field to `RegistryItem` (`www/src/registry/types.ts:69-78`):

```ts
export type RegistryItem = ShadcnRegistryItem & {
  group?: ComponentGroup | null;
  params?: Record<string, ParamDef>;
  bolt?: boolean;  // opt-out field; defaults to true; set false to exclude from generated repos
};
```

This is purely optional — the simpler approach is to hardcode `SHOWCASE_COMPONENT_NAMES` (the 38 components that `cards.tsx` actually needs) as a constant in the generation code.

---

## 9. Limitations, risks, fallbacks

### GitHub repo generation latency
Writing 38+ files to GitHub via API takes 2–8 seconds depending on rate limits and network. Use a single `git/trees` + `git/commits` sequence (3 API calls total: create tree, create commit, update ref) rather than one call per file. Cache by preset hash: if a repo for `preset-<hash>` already exists, skip generation and return the bolt URL immediately.

### bolt.new startup time
bolt.new runs `npm install` inside the WebContainer on first open. With ~15 npm dependencies (react-aria-components, tailwind-variants, etc.) this takes 30–60 seconds. This is inherent to bolt's architecture and cannot be optimised from dotUI's side. Consider including a `package-lock.json` or `pnpm-lock.yaml` in the generated repo to speed up resolution.

### No `/r/registry.json` index
The bolt.new agent (if it tries to run `shadcn add` for anything) would fail to discover dotUI components via MCP because `/r/registry.json` returns 404 today. This does not affect the generated-repo path, but it means the user cannot run `shadcn add @dotui/button` from within bolt's terminal until the index route is shipped. The generated repo has all components pre-installed, so this gap does not block the feature.

### The `tokens` field is not yet threaded through `PublishPreset`
`www/src/publisher/emit-theme.ts:62-68` documents this as a TODO. A user who sets `--radius-factor` via the customizer's token editor will not see that reflected in the generated `globals.css`. The `t` key in the encoded preset round-trips correctly through the codec but `PublishPreset` (`www/src/publisher/types.ts:79-85`) does not include `tokens`. This must be fixed before `tokens`-heavy presets produce correct output.

### `tailwindcss-autocontrast` and `tailwindcss-with` are workspace packages
These are not published to npm today. The generated repo cannot install them via `package.json` unless they are first published. Options:
- Publish them before launching the feature.
- Vendor them: copy the compiled output into `src/vendor/` in the generated repo.
- Use a GitHub dependency in `package.json`: `"tailwindcss-autocontrast": "github:mehdibha/dotUI#workspace=packages/tailwindcss-autocontrast"` (requires the repo to be public and the package path to be stable).

### Generated repos are public
The GitHub repos under `dotui-generated` are public (bolt.new only supports public GitHub repos via the `~/github.com/` path). This is acceptable for preset snapshots — they contain no user data other than color seeds and style choices. Include a `LICENSE` file (MIT or similar) in every generated repo.

### `selectPublishable` extraction risk
This function is currently colocated with route logic in `www/src/routes/r/$name.tsx`. Extracting it to a shared publisher module requires verifying it has no route-level side effects (it doesn't — it is a pure function that reads `mod.publishableByPath` and `meta.params`). This is low risk.

### Fallback if GitHub API is unavailable
Return a copy-command fallback: show the `npx shadcn add https://dotui.com/r/init?preset=<encoded>` command (already implemented in `InstallCommand`, `www/src/modules/create/install-command.tsx:39-48`) so the user can still install manually.

---

## 10. Step-by-step implementation checklist

- [ ] **Extract `selectPublishable`** from `www/src/routes/r/$name.tsx:89-107` into `www/src/publisher/select-publishable.ts`. Export it. Update the route to import from the new location.

- [ ] **Define `SHOWCASE_COMPONENT_NAMES`** — a constant listing the 38 `registry/ui` names that `cards.tsx` transitively needs (see Section 4). Place it in `www/src/server/generate-repo.ts` or a shared constants file.

- [ ] **Write `generatePresetRepo(encodedPreset)`** in `www/src/server/generate-repo.ts`:
  - Call `decodePreset` → build `PublishPreset`
  - Call `emitInitItem` → render `globals.css` string (see Section 5 for format)
  - Loop `SHOWCASE_COMPONENT_NAMES`, call `publish()` for each with `selectPublishable`
  - Assemble file tree object: key = repo-relative path, value = file content string
  - Hash the preset (`sha256(encodedPreset).slice(0,12)`) → `slug = "preset-<hash>"`
  - Check if `dotui-generated/<slug>` already exists on GitHub (GET `/repos/dotui-generated/<slug>`) → if yes, return URL immediately
  - Create repo via GitHub API: `POST /orgs/dotui-generated/repos` (`{ name: slug, private: false, auto_init: false }`)
  - Push file tree in a single commit: create blob per file → create tree → create commit → update `refs/heads/main`
  - Return `https://bolt.new/~/github.com/dotui-generated/<slug>`

- [ ] **Write the server GET route** `www/src/routes/r/generate-repo.tsx`:
  - Accept `?preset=` query param
  - Call `generatePresetRepo(preset)`
  - Return `302 Location: <bolt-url>` (or `200` with JSON `{ url }` if the button handles the redirect client-side)

- [ ] **Add "Open in bolt.new" button** to the customizer UI (near `InstallCommand` in `www/src/modules/create/`):
  - Read `encodePreset(designSystem)` → build `/r/generate-repo?preset=<encoded>` URL
  - On click: `window.open(url, "_blank")` (the route redirects to bolt.new)
  - Show loading state — listen for the redirect or set a fixed timeout (the route is fast once cached)

- [ ] **Publish `tailwindcss-autocontrast` and `tailwindcss-with`** to npm under `@dotui/tailwindcss-autocontrast` etc., or vendor them into the generated repo. Update `DEFAULT_DEPENDENCIES` in `www/src/publisher/emit-theme.ts:31-39` to reference the published npm names.

- [ ] **Wire `tokens` through `PublishPreset`** — fix the TODO at `www/src/publisher/emit-theme.ts:62-68`. Add `tokens?: Record<string, string>` to `PublishPreset` (`www/src/publisher/types.ts:79`) and emit them into `:root` in `emitPresetLightVars` (`emit-theme.ts:58-69`).

- [ ] **Configure GitHub bot credentials** — add `GITHUB_GENERATE_TOKEN` env var (fine-grained PAT, `contents: write` on `dotui-generated` org) to the Vercel project.

- [ ] **Create `dotui-generated` GitHub org** (or use a bot account) and configure it as the target for generated repos.

- [ ] **Add a `LICENSE` file** to the generated repo file tree (MIT, attributed to dotUI).

- [ ] **Include `package-lock.json`** in the generated file tree to reduce bolt.new's WebContainer install time.

- [ ] **Smoke test**: generate a repo for the default preset and one custom preset; open both in bolt.new; verify the showcase renders, components render without errors, dark mode works.

---

## Sources

- bolt.new GitHub repo import format: `https://bolt.new/~/github.com/<owner>/<repo>` — observed behavior, documented in bolt community posts (no official Stackblitz docs as of June 2026)
- shadcn `registry:base` item type and `shadcn add <url>` behavior: https://ui.shadcn.com/docs/registry/registry-item-types
- shadcn cssVars.light/dark write behavior: https://ui.shadcn.com/docs/registry/faq
- Tailwind v4 `@theme inline` and `cssVars.theme` vs `cssVars.light` distinction (shadcn issue #7119): https://github.com/shadcn-ui/ui/issues/7119
- dotUI codec: `www/src/modules/create/preset/codec.ts:75-126`
- dotUI init route: `www/src/routes/r/init.tsx`
- dotUI emit-theme: `www/src/publisher/emit-theme.ts:71-170`
- dotUI showcase: `www/src/components/marketing/showcase/cards.tsx`
- dotUI publisher: `www/src/publisher/publish.ts:119-161`
- dotUI registry types: `www/src/registry/types.ts:43-78`
- autocontrast plugin: `packages/tailwindcss-autocontrast/src/index.js:407-501`
- GitHub Git Trees API: https://docs.github.com/en/rest/git/trees
