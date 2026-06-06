# Open in Lovable

> Feasible via repo-import, not a direct launch URL. · button type **repo-import** · preset fidelity **full** (baked into generated repo) · color fidelity **partial** (OKLCH shipped; HSL variant required for Lovable agent stability)

---

## 1. User experience

The flow has three user-visible steps:

1. **User customizes their design system** on `/create?preset=<encoded>`. The `?preset` encodes their chosen colors (`ColorConfig` seeds + algorithm), density, and per-component param choices (enum styles, scalar radius/spacing tokens).

2. **dotUI generates a GitHub repo** from a server action. The repo is pre-populated with:
   - `src/globals.css` — full OKLCH theme ramps for the chosen preset + all base at-rules.
   - `src/components/ui/*` — all 60 published dotUI components, each with classes baked for the chosen preset.
   - `src/components/showcase/` — the 17 showcase card files verbatim from `www/src/components/marketing/showcase/`.
   - `src/App.tsx` — renders `<Cards />` as the home view.
   - `lovable.md` or `.lovable/rules.md` — agent-context file that instructs Lovable to preserve React Aria and OKLCH.

3. **User clicks "Open in Lovable"** → `https://lovable.dev/import?repo=<github-url>`. Lovable's GitHub import reads the repo, installs deps, and opens the project showing the showcase page as its first view.

There is no component-URL or define API from Lovable that dotUI can call directly; the GitHub import path is the only realistic integration point as of the Lovable feature set available (enterprise-gated Design Systems feature excluded).

---

## 2. Technical mechanism

### 2a. Button target

```
https://lovable.dev/import?repo=https://github.com/<dotui-org>/<generated-repo-name>
```

Lovable's GitHub import parses this and forks/imports the repo into a new Lovable project. The exact query-param name should be confirmed against Lovable's current import UI (`https://docs.lovable.dev`) but `?repo=` or `?github=` are the attested forms. The generated repo must be **public** or the Lovable user must have granted GitHub access.

### 2b. Repo generation server action

dotUI must implement a new server route, e.g. `POST /api/generate-repo?preset=<encoded>`, that:

1. Decodes `?preset=` via `decodePreset` (`www/src/modules/create/preset/codec.ts:111`).
2. Calls `emitInitItem` (`www/src/publisher/emit-theme.ts:71`) to produce the full `globals.css` content.
3. Loops over all 60 `PUBLISHABLE_NAMES` calling `publish({ publishable, preset })` (`www/src/publisher/publish.ts:119`) to get each component's resolved file content.
4. Assembles a GitHub repo via the GitHub REST API (`POST /orgs/{org}/repos` + `PUT /repos/{org}/{repo}/contents/{path}` or the Git Trees API for a single round-trip).
5. Returns the new repo URL.

The "Open in Lovable" button fires this action, waits for the URL, then navigates to `https://lovable.dev/import?repo=<url>`.

### 2c. What publishables must exist first

The publishables directory (`www/src/registry/__generated__/publishables/`) is git-ignored and only materialises after `pnpm build:registry` (`www/scripts/registry-build.ts`). The server action must run inside the deployed dotUI app where the registry has already been built, or the action triggers a build step.

---

## 3. Preset propagation

The chosen `?preset=<encoded>` is a pako-deflated, base64url-encoded `DesignSystemState`:

```
DesignSystemState { p?, t?, d?, c? }  ←  codec.ts:14-19
```

**Decode path** (server action):

```ts
import { decodePreset } from "@/modules/create/preset/codec";
// encoded = url.searchParams.get("preset")
const ds = decodePreset(encoded);
// ds.color     → ColorConfig with seeds + algorithm (e.g. accent: "#ef4444", algorithm: "oklch")
// ds.density   → "compact" | "default" | "comfortable"
// ds.componentParams → { button: { style: "outline" }, card: { style: "tasnim" }, ... }
```

**Narrowed to `PublishPreset`** for all publisher calls:

```ts
// publisher/types.ts:79-85
const preset: PublishPreset = {
  color: ds.color,
  density: ds.density,
  componentParams: ds.componentParams,
};
```

**Into theme CSS**: `emitInitItem({ baseRegistryCss, preset, encodedPreset, registryRoot })` bakes:
- `preset.color` → `resolveColorConfig(preset.color)` re-derives the OKLCH ramps; `rampsToVars(resolved.light)` / `rampsToVars(resolved.dark)` override `:root` / `.dark` in the item's `css` field (`emit-theme.ts:155-159`).
- `preset.density` → `--dotui-density` written to `:root` if non-compact (`emit-theme.ts:58-68`).
- The structured `css` / `cssVars` fields are then serialized into the generated `globals.css`.

**Into component files**: for each of the 60 components, `publish({ publishable, preset })` folds density + enum param choices into the inlined `tv()` config (`flatten.ts`), rewrites scalar tokens to Tailwind suffixes (`resolve-classes.ts`), and splices the result into the `base.tsx` template via `%%TV_CONFIG%%` (`publish.ts:119-161`). These are written into `src/components/ui/<name>.tsx` in the generated repo.

**Result**: the generated repo contains zero runtime preset references — all choices are baked in at generation time.

---

## 4. Components installed

### 4a. What goes into `src/components/ui/`

Every entry in `PUBLISHABLE_NAMES` (`www/src/registry/__generated__/publishables/index.ts`) gets one file, target path taken from `meta.files[0].target` (e.g. `"ui/button.tsx"` → `src/components/ui/button.tsx`).

The loader component has two source files (`base.spinner.tsx` / `base.ring.tsx`). The `selectPublishable` logic currently inlined in `www/src/routes/r/$name.tsx:89-107` picks the right one based on `preset.componentParams["loader"]["style"]`. This function should be extracted to `www/src/publisher/publish.ts` for reuse in the repo-generation server action.

### 4b. Support files

Beyond the 60 `ui/*` files, the generated repo needs:

| File | Source |
|---|---|
| `src/lib/utils.ts` | `CN_UTILS_TS` inline in `emit-theme.ts:41-47` |
| `src/lib/context.tsx` | `www/src/registry/lib/context/index.tsx` (verbatim copy) |
| `src/lib/focus-styles.ts` | `www/src/registry/lib/focus-styles/` |
| `src/hooks/use-image-loading-status.ts` | `www/src/registry/hooks/use-image-loading-status.ts` |
| `src/registry/__generated__/icons.tsx` | OR replace `ExternalLinkIcon` with a direct lucide import |

These are the `BUNDLED_INTO_INIT` utilities plus the two `UNREGISTERED_DEP_ALLOWLIST` items (`context`, `use-image-loading-status`) that ship as raw copies rather than shadcn registry deps.

### 4c. Showcase card files

Copy all 17 files from `www/src/components/marketing/showcase/` verbatim:

```
showcase/account-menu.tsx   showcase/booking.tsx        showcase/color-editor.tsx
showcase/cookie-preferences.tsx  showcase/faq.tsx        showcase/feedback.tsx
showcase/filters.tsx         showcase/invite-members.tsx showcase/login-form.tsx
showcase/notifications.tsx  showcase/payment.tsx        showcase/shortcuts.tsx
showcase/storage.tsx         showcase/team-name.tsx      showcase/transactions.tsx
showcase/two-factor.tsx      showcase/upload-avatar.tsx
showcase/cards.tsx           ← the masonry grid container
```

These files contain only React state; no server functions, no loaders. They import from `@/registry/ui/*` and `@/registry/lib/utils`— the generated repo must configure the `@/` alias pointing at `src/`.

### 4d. `package.json` dependencies

From `emitInitItem`'s `DEFAULT_DEPENDENCIES` (`emit-theme.ts:31-39`) plus showcase transitive deps:

```json
{
  "dependencies": {
    "react-aria-components": "latest",
    "react-aria": "latest",
    "react-stately": "latest",
    "tailwind-variants": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest",
    "tw-animate-css": "latest",
    "tailwindcss-react-aria-components": "latest",
    "tailwindcss-autocontrast": "latest",
    "@internationalized/date": "latest",
    "@base-ui/react": "latest",
    "lucide-react": "latest",
    "@fontsource-variable/geist": "latest",
    "@fontsource/geist-mono": "latest"
  },
  "devDependencies": {
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "latest"
  }
}
```

`tailwindcss-autocontrast` and `tailwindcss-with` are workspace packages in the dotUI monorepo; they must be **published to npm** or bundled as vendored files in the generated repo before Lovable can install them. This is the largest infrastructure blocker (see §9).

---

## 5. Theme in globals.css

The generated `src/globals.css` is assembled from the structured `css` and `cssVars` fields produced by `emitInitItem`. The conversion from registry fields back to raw CSS is:

```
cssVars.theme  →  @theme inline { --radius-md: calc(…); --color-bg: var(…); … }
css["@import …"]  →  @import "tw-animate-css";
css["@plugin …"]  →  @plugin "tailwindcss-react-aria-components"; etc.
css["@utility …"] →  @utility focus-ring { … }
css["@layer base"] →  @layer base { … }
css["::selection"] →  ::selection { … }
css[":root"]  →  :root { --radius-factor: 1; --neutral-50: oklch(…); … }   ← PRESET ramps
css[".dark"]  →  .dark { --neutral-50: oklch(…); … }                       ← reversed ramps
```

For a **custom color preset** (`preset.color` is set), `resolveColorConfig(preset.color)` regenerates all 6 × 11 = 66 primitive OKLCH vars and overrides the defaults. For the **default preset** (`color: undefined`), the static ramps from `www/src/registry/base/colors.css` are used as-is (already in `baseRegistryCss`).

**The `@theme inline` block is constant across all presets** — it only maps semantic tokens (`--color-bg → var(--neutral-50)`) and radius scales. Only the primitive ramps differ.

**`--on-*` vars are NOT shipped** by dotUI. They are derived by the `tailwindcss-autocontrast` plugin at the consumer's Tailwind compile time by scanning `:root` and `.dark` for `--<name>-<shade>` vars and injecting `--on-<name>-<shade>: black | white`. Lovable's build pipeline must run Tailwind v4 with this plugin enabled for `fg-on-accent` and similar tokens to resolve.

**Minimum complete `globals.css` shape**:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "@fontsource-variable/geist";
@import "@fontsource/geist-mono";

@plugin "tailwindcss-react-aria-components";
@plugin "tailwindcss-autocontrast" { cssfile: "./src/globals.css"; }
@plugin "tailwindcss-with";

@custom-variant dark (&:is(.dark *));

@utility focus-ring { … }
@utility focus-input { … }
@utility focus-reset { … }
@utility no-highlight { … }

@layer base {
  * { @apply border-border; }
  body { @apply bg-bg font-sans text-fg; }
  html { @apply font-sans; }
}

::selection { background-color: var(--accent-800); color: var(--on-accent-800); }

@theme inline {
  --radius-factor: 1;
  --radius-sm: calc(0.25rem * var(--radius-factor));
  --radius-md: calc(0.375rem * var(--radius-factor));
  /* … full radius scale … */
  --color-bg: var(--neutral-50);
  --color-accent: var(--accent-500);
  --color-fg-on-accent: var(--on-accent-500);
  /* … full semantic token map from base/theme.css … */
  --font-sans: "Geist Variable", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Geist Mono", ui-monospace, monospace;
}

/* PRESET RAMPS — generated by resolveColorConfig(preset.color) + rampsToVars() */
:root {
  --neutral-50: oklch(0.985 0 0);
  --neutral-100: oklch(0.955 0.004 264.05);
  /* … 11 neutral steps … */
  --accent-50: oklch(0.958 0.021 252.89);
  /* … 11 accent steps … */
  /* … success, warning, danger, info … */
}

.dark {
  --neutral-50: oklch(0.13 0 0);   /* reversed: light's 950 value */
  /* … reversed ramps … */
}
```

---

## 6. The showcase as first view

### 6a. `App.tsx` / entry component

The generated repo's home view renders `<Cards />` directly:

```tsx
// src/App.tsx
import "./globals.css";
import { Cards } from "./components/showcase/cards";

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

`Cards` (`cards.tsx:20-48`) is a CSS columns masonry grid (`columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4`) that renders all 17 showcase widgets inline. No routing is required; the component is pure React with local state only.

### 6b. Dark-mode provider

The showcase cards use class-based dark mode (`@custom-variant dark (&:is(.dark *))`). In Lovable's Vite+React scaffold, replace the dotUI `ThemeProvider` (which depends on TanStack Router's `ScriptOnce`) with a minimal inline script or `next-themes`:

```tsx
// minimal dark-mode bootstrap (no TanStack Router dep)
function DarkModeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function(){
            var stored = localStorage.getItem("theme");
            var isDark = stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
            document.documentElement.classList.toggle("dark", isDark);
          })();
        `,
      }}
    />
  );
}
```

### 6c. `DesignSystemProvider`

`DesignSystemProvider` from `www/src/modules/core/styles.tsx:61` is **optional** for the showcase. Its default context is `{ params: {}, tokens: {}, density: "default" }`, which gives every component its default visual variant. Since the preset choices are already baked into the component class strings (by `publish()`), the provider adds nothing for the generated repo's initial state. It can be omitted.

### 6d. Avatar image fallbacks

The showcase cards load GitHub CDN avatars (`https://github.com/mehdibha.png`, etc.) at runtime. These fall back gracefully via `AvatarFallback` when offline. No bundled image assets are needed.

---

## 7. What dotUI must build

### 7a. Repo-generation server action

New file: `www/src/routes/api/generate-repo.ts` (TanStack Start server function or server handler).

Steps:
1. Parse and validate `?preset=` → `decodePreset` → `PublishPreset`.
2. Call `emitInitItem` for theme CSS fields.
3. Serialize `css` + `cssVars` fields to raw CSS string (implement a `registryFieldsToCss(fields)` utility — the inverse of `cssToRegistryFields` in `www/src/publisher/build-time/css-to-registry-fields.ts`).
4. Loop `PUBLISHABLE_NAMES`, call `publish({ publishable, preset })` per component, collect `{ target, content }` pairs.
5. Collect support files (context, focus-styles, use-image-loading-status, icons).
6. Copy showcase card files verbatim (embed them at build time via `import.meta.glob` or template strings).
7. Generate `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`.
8. Generate `.lovable/rules.md` (agent-context file, §7b).
9. Create GitHub repo via REST API, commit all files via the Git Trees API in one request.
10. Return repo URL.

### 7b. Agent-context / rules file

Create `.lovable/rules.md` (or `AGENTS.md`) in the generated repo. This is the primary mitigation for Lovable's HSL-overwrite and React-Aria refactor behaviours:

```markdown
# dotUI Design System — Agent Rules

## Do not modify these files
- `src/globals.css` — the full OKLCH theme; modifying it breaks the color system.
- `src/components/ui/**` — installed dotUI components. Do not refactor them.
- `src/lib/utils.ts`, `src/lib/context.tsx` — core helpers.

## Color system
This project uses **OKLCH** color variables (`--neutral-50 … --neutral-950`, `--accent-50 … --accent-950`, etc.).
- Do NOT convert OKLCH values to HSL or hex. Lovable's editor may suggest HSL — reject these suggestions.
- Do NOT add new `hsl()` or `#hex` color literals. Reference semantic tokens (`bg-bg`, `text-fg`, `bg-accent`, etc.) via Tailwind utilities instead.
- The `--on-*` variables (e.g. `--on-accent-500`) are derived at build time by the `tailwindcss-autocontrast` plugin from the OKLCH ramps. Never set them manually.

## UI components
- All UI components in `src/components/ui/` use **React Aria Components** (`react-aria-components`).
- Do NOT replace them with Radix UI, Shadcn UI, or any other component library.
- Do NOT add `@radix-ui/*` dependencies.
- When adding new interactive elements, use `react-aria-components` primitives and style them with Tailwind following the same patterns in `src/components/ui/`.

## Styling
- Use Tailwind utility classes. All semantic color tokens are available as utilities: `bg-bg`, `text-fg`, `bg-accent`, `text-fg-on-accent`, `border-border`, etc.
- `bg-bg` = page background, `text-fg` = body text, `bg-accent` = primary brand color.
- Dark mode is class-based: `.dark` on `<html>`. Do not use `prefers-color-scheme` media queries.
```

### 7c. HSL variant file (defensive fallback)

Because Lovable's agent tends to overwrite OKLCH values with HSL on its own edits, dotUI should also generate an `hsl-theme.css` containing HSL equivalents of the preset's ramps:

```
:root {
  --neutral-50-hsl: 0 0% 98.5%;
  --accent-500-hsl: 210 65% 52%;
  …
}
```

This is generated from `resolveColorConfig(preset.color)` → `rampsToVars()` → OKLCH → `toSrgb()` → HSL conversion (`packages/colors/src/shared/color.ts:42`). The OKLCH primary file remains canonical; this file is a read-only reference the agent can use if it insists on HSL, rather than letting it hallucinate values.

### 7d. `vite.config.ts` template

```ts
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

---

## 8. Schema / meta.ts changes

No changes to any `www/src/registry/ui/*/meta.ts` or `www/src/registry/types.ts` are required for this feature. The repo-generation action is entirely a new server route that consumes existing publisher APIs.

**Optional addition** (`types.ts:69-78`): a `lovable?: { rules?: string }` field on `RegistryItem` could carry per-component agent guidance that the repo-generation action aggregates into the `.lovable/rules.md` file. Adding the field takes one line in the intersection type and is inert unless explicitly read:

```ts
export type RegistryItem = ShadcnRegistryItem & {
  group?: ComponentGroup | null;
  params?: Record<string, ParamDef>;
  lovable?: { rules?: string }; // optional per-component agent guidance
};
```

This is low-priority; the single top-level rules file (§7b) is sufficient.

---

## 9. Limitations, risks, fallbacks

### 9a. OKLCH → HSL overwrite (primary Lovable risk)

Lovable's AI agent is trained on HSL-heavy codebases and will tend to convert `oklch(…)` values to `hsl(…)` on any edit that touches `globals.css` or adds new color usage. Mitigations, in order of effectiveness:

1. **`.lovable/rules.md`** with explicit "do not convert OKLCH" instructions (§7b). Rules files are read by Lovable's agent before generating edits.
2. **HSL companion file** `hsl-theme.css` (§7c) gives the agent correct HSL values to use if it refuses OKLCH, preventing value hallucination.
3. **Semantic utilities only** in showcase cards — cards use `bg-bg`, `text-fg`, `bg-accent`, not raw OKLCH vars. The agent sees no OKLCH in application code; only `globals.css` is exposed.
4. **Acceptance**: for users who only want Lovable to build new pages (not modify the design system), OKLCH overwrite in `globals.css` is acceptable — the design system still renders correctly until they run `npx shadcn add <dotui-init-url>` again to restore it.

### 9b. React Aria → Radix refactor (secondary Lovable risk)

Lovable's agent has a strong prior toward Radix UI (Shadcn's default stack). It will suggest replacing RAC components with Radix equivalents when asked to "improve" or "refactor" a component.

1. **Rules file** explicitly names `react-aria-components` as the required library and bans `@radix-ui/*` deps.
2. **Do-not-touch paths** listed in rules (all of `src/components/ui/**`).
3. **Structural separation**: showcase cards import from `@/components/ui/` not from `react-aria-components` directly, so the agent sees a higher-level abstraction layer and is less likely to drill down.

### 9c. Workspace packages not on npm

`tailwindcss-autocontrast` and `tailwindcss-with` are in `packages/` in the monorepo and not yet published to npm. Without them:
- `tailwindcss-autocontrast`: `--on-*` vars are never injected → `text-fg-on-accent` etc. render as transparent. **Fallback**: inline pre-computed `--on-*` vars into the generated `:root` / `.dark` using `onBlackWhite` from `packages/colors/src/shared/on-color.ts:88-97` during repo generation (the `emitPrimitivesCss({onColors:true})` path at `primitives.ts:130-138` shows this pattern).
- `tailwindcss-with`: removes `with-[...]` container variants. Most showcase cards do not use it; impact is low. **Fallback**: drop it from the generated `globals.css`'s `@plugin` line.

**Resolution**: publish both packages to npm as part of the Open-in Lovable launch.

### 9d. No live `?preset` sync

Once the repo is generated, there is no live sync between the dotUI customizer and the Lovable project. The preset is baked in. To change the theme, the user must re-generate. This is expected — note it in the dotUI UI as "Your design system is baked in. Re-generate to apply a new preset."

### 9e. GitHub repo quota / naming

Each "Open in Lovable" click creates a new GitHub repo. dotUI must either:
- Use a per-user repo (requires OAuth, reuses/updates the same repo), or
- Create a fresh repo with a unique timestamped name under a dotUI org.

The simplest v1: org repo `dotui-<random-6-char>`, public. Long-term: user OAuth → personal repo.

### 9f. No shadcn MCP / registry.json index

The generated Lovable project does not use the shadcn CLI workflow (no `components.json`, no MCP). The `/r/registry.json` 404 is irrelevant for this integration. All components are pre-installed as source files; no shadcn install commands run in Lovable.

### 9g. Lovable's "Design Systems" feature

Lovable has a bidirectional GitHub sync and an enterprise-gated "Design Systems" feature. The repo-import path used here is the **free tier** entry point and does not require enterprise access. The enterprise Design Systems feature (which would allow a more native token integration) is out of scope.

---

## 10. Step-by-step implementation checklist

**Phase 1: Infrastructure**

- [ ] Publish `tailwindcss-autocontrast` and `tailwindcss-with` to npm from `packages/`.
- [ ] Extract `selectPublishable` (currently at `www/src/routes/r/$name.tsx:89-107`) into `www/src/publisher/publish.ts` as an exported function.
- [ ] Implement `registryFieldsToCss(fields: RegistryCssFields): string` in `www/src/publisher/emit-theme.ts` — converts the structured `css` + `cssVars` fields back to raw CSS text for writing to a file.
- [ ] Pre-compute and inline `--on-*` vars as fallback: add `inlineOnColors: boolean` option to `mergePresetCssFields` (`emit-theme.ts:145`) that calls `onBlackWhite` (`packages/colors/src/shared/on-color.ts:88`) on each ramp step and writes `--on-<palette>-<step>` into `:root` / `.dark`. Enable this for repo generation.

**Phase 2: Repo-generation server action**

- [ ] Create `www/src/routes/api/generate-repo.ts` (TanStack Start server handler, `POST`).
- [ ] Implement showcase-file embedding: use `import.meta.glob("../../components/marketing/showcase/*.tsx", { eager: true, query: "?raw" })` to get file contents as strings at build time.
- [ ] Implement `buildRepoFiles(preset, encodedPreset): Record<filePath, string>` that assembles the full file tree (globals.css, ui/*, showcase/*, support files, package.json, vite.config.ts, App.tsx).
- [ ] Generate `.lovable/rules.md` content from template (§7b).
- [ ] Generate `hsl-theme.css` using `resolveColorConfig` → `toSrgb` → HSL conversion.
- [ ] Implement GitHub repo creation via `POST /orgs/dotui-dev/repos` (REST API, server-side GitHub token).
- [ ] Implement file commit via `POST /repos/dotui-dev/{repo}/git/trees` + `POST /repos/dotui-dev/{repo}/git/commits` + `PATCH /repos/dotui-dev/{repo}/git/refs/heads/main` (single round-trip for all files).
- [ ] Return `{ repoUrl: "https://github.com/dotui-dev/<name>" }`.

**Phase 3: UI button**

- [ ] Add "Open in Lovable" button to the customizer panel (`www/src/modules/create/` UI area), next to the existing install command in `www/src/modules/create/install-command.tsx`.
- [ ] On click: call `POST /api/generate-repo?preset=<encoded>`, show spinner, on success `window.open("https://lovable.dev/import?repo=" + repoUrl)`.
- [ ] Handle errors: rate limit, GitHub API failure → toast with fallback copy-command.

**Phase 4: Validation**

- [ ] Test with default preset: no `?preset=` → default OKLCH ramps in `globals.css`.
- [ ] Test with custom accent seed `#ef4444`: verify `:root` contains `--accent-50 … --accent-950` with red-shifted OKLCH values.
- [ ] Test loader `style: "ring"` preset: verify `src/components/ui/loader.tsx` contains the ring template (not spinner).
- [ ] Test Lovable import: generated repo imports correctly, first view shows the showcase cards.
- [ ] Test agent rules: instruct the Lovable agent to "improve the color scheme" and verify it respects OKLCH, does not replace with Radix.

---

## Sources

- dotUI preset codec: `www/src/modules/create/preset/codec.ts` — `encodePreset` (`:75`), `decodePreset` (`:111`)
- dotUI init item builder: `www/src/publisher/emit-theme.ts` — `emitInitItem` (`:71`), `mergePresetCssFields` (`:145`), `rampsToVars` (`:135`)
- dotUI init route: `www/src/routes/r/init.tsx` — `decodePresetForRoute` (`:47`)
- dotUI color resolution: `www/src/registry/theme/primitives.ts` — `resolveColorConfig` (`:67`)
- dotUI on-color fallback: `packages/colors/src/shared/on-color.ts` — `onBlackWhite` (`:88`)
- dotUI install command: `www/src/modules/create/install-command.tsx:39-48`
- dotUI showcase grid: `www/src/components/marketing/showcase/cards.tsx:20-48`
- dotUI component publisher: `www/src/publisher/publish.ts:119-161`
- dotUI publish preset type: `www/src/publisher/types.ts:79-85`
- Lovable GitHub import: `https://docs.lovable.dev` (import path; verify `?repo=` param name before shipping)
- Lovable agent behavior (HSL overwrite, Radix refactor prior): ground-truth facts provided in task specification
- shadcn registry:base type: `https://ui.shadcn.com/docs/registry/registry-item-type`
- tailwindcss-autocontrast (on-color plugin): `packages/tailwindcss-autocontrast/src/index.js:407-501`
