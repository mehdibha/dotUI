# "Open in &lt;tool&gt;" — Architecture & Refactoring Report

> Scope: how dotUI should architect the **"Open in &lt;tool&gt;"** feature so that the external tool lands the user on the component **showcase** (`www/src/components/marketing/showcase/cards.tsx`) as the **first view**, with the design system **already installed** (every needed `ui/*` component present, colors/tokens/theme written into `globals.css`) and reflecting the user's **chosen preset** (`?preset=<encoded>`), not the default.
>
> All paths are absolute-relative to the repo root `/Users/mehdibenhadjali/Desktop/dotUI-open-in/`. This document is grounded in the current source; line references are to the code as it exists today.

---

## 1. Executive summary

### 1.1 The feature

Today dotUI already ships a working **"give me a preset as code"** seam: the `/create` customizer encodes the user's design system into a compressed URL param (`?preset=<encoded>`, `www/src/modules/create/preset/codec.ts`), and two server routes turn that into shadcn registry items at request time:

- `GET /r/init?preset=…` → a `registry:base` "init" item that writes the **theme** (color ramps + `@theme inline` semantic layer + plugins) into the consumer's `globals.css` and ships `cn()` (`www/src/routes/r/init.tsx`, `www/src/publisher/emit-theme.ts`).
- `GET /r/$name?preset=…` → **one component** item, fully themed (density + enum/scalar params folded into the inlined `tv()` config) (`www/src/routes/r/$name.tsx`, `www/src/publisher/publish.ts`).

The install command surfaced on `/create` is literally `npx shadcn add <host>/r/init?preset=<encoded>` (`www/src/modules/create/install-command.tsx:39-48`). **"Open in &lt;tool&gt;" is the next button next to that one** — but instead of (or in addition to) printing a CLI command, it must hand a target tool a *whole project* it can boot.

### 1.2 The core insight: **preset → full-project bundle**

The literal goal — "land in a working project that renders the **showcase** using their themed, installed components" — requires three things the current per-item routes do **not** assemble together:

1. **Every component the showcase transitively needs**, not just one (the showcase imports 32 distinct `ui/*` components — see §1.4).
2. **A `globals.css`** carrying the preset's theme (already solved by `emitInitItem`).
3. **A runnable entry** (`App.tsx` / a route) that renders `<Cards/>`, plus `package.json` + Vite/Tailwind/tsconfig config so the tool can `install && dev`.

So the central abstraction to build is a **PRESET → FULL-PROJECT BUNDLE engine**: given a `?preset=`, emit a complete in-memory **file tree** — `ui/*` components, `lib/utils.ts`, `globals.css`, the showcase sources, an `App` entry, and project scaffolding — all themed by the preset. The current `publish()` already produces one themed component file; the bundle engine is its natural generalization to **N components + theme + showcase + scaffold**, deduped and self-contained (drop all `registryDependencies`, because everything is present locally — exactly the `BUNDLED_INTO_INIT` rationale at `www/src/publisher/publish.ts:52-59`).

### 1.3 Code surface vs design surface

The tools split cleanly into two families, and the bundle engine is the backbone of the first:

| Surface | Tools | What they consume | Showcase-first means |
|---|---|---|---|
| **Code surface** | v0, StackBlitz, CodeSandbox, bolt, replit, lovable, Cursor/Claude/shadcn (MCP) | React/TS files or a shadcn registry | A real project that boots and renders `<Cards/>` |
| **Design surface** | Figma, Framer, Webflow, Paper | tokens + generated nodes (no React) | A generated file whose first page mirrors `cards.tsx`, bound to the preset's tokens |

The code surface is unlocked by **(a) a `/r/registry.json` index** (so MCP/shadcn can discover items) and **(b) the bundle engine + a `/r/bundle` export endpoint** (so sandbox/repo tools get a full project). The design surface is unlocked by a **token-export endpoint** (`OKLCH → hex/RGB`) plus per-tool generators, which the Figma deep-dive (`docs/open-in/figma.md`) already specifies in detail. Both surfaces share two "master keys": **ship `/r/registry.json`** and **expose an OKLCH→hex/RGB exporter** from `@dotui/colors`.

### 1.4 The showcase's real dependency footprint (ground truth)

`Cards` (`www/src/components/marketing/showcase/cards.tsx`) composes 17 card components, which collectively import (verified by grep across `www/src/components/marketing/showcase/`):

- **32 distinct dotUI `ui/*` components** via `@/registry/ui/*`: `accordion, avatar, badge, button, calendar, card, checkbox, checkbox-group, color-editor, disclosure, drop-zone, field, file-trigger, group, input, kbd, link, list-box, otp-field, progress-bar, radio-group, select, separator, slider, switch, table, tabs, tag-group, text-field, time-field, toggle-button, toggle-button-group`.
- **`cn`** via `@/registry/lib/utils` (17 files).
- **`lucide-react`** icons (6 files) — an npm dependency, not a registry item.
- **`@/registry/__generated__/icons`** — dotUI's internal generated icon library, used by exactly **one** card (`invite-members.tsx`). This is **app-only**, not part of any installable registry item.

This footprint is the crux: the showcase sources are written against **dotUI-internal alias paths** (`@/registry/ui/*`, `@/registry/lib/utils`) and one **app-internal icon barrel**. A consumer project installs components at `@/components/ui/*` and `@/lib/utils`. **The bundle engine must rewrite these imports** and resolve the icon-library edge case (§2.3, §6.6). This is the single biggest piece of net-new logic and the reason "just zip the showcase folder" does not work.

---

## 2. The shared abstraction: a PRESET → FULL-PROJECT BUNDLE engine

### 2.1 Goal & shape

A pure function (no React, no `ts-morph` at request time — same constraint the publisher already respects, `www/src/publisher/publish.ts:6`) that maps a decoded preset to a flat file map:

```ts
// www/src/bundle/types.ts  (new)
export interface BundleFile { path: string; content: string; }        // path relative to project root
export interface ProjectBundle {
  files: BundleFile[];                 // ui/*, lib/utils.ts, globals.css, showcase/*, App, scaffold
  entry: string;                       // e.g. "src/App.tsx" — the file that renders <Cards/>
  dependencies: Record<string,string>; // npm deps for package.json (react, react-aria-components, lucide-react, …)
  meta: { preset?: string; title: string; description: string };
}

export interface BuildBundleInput {
  preset: PublishPreset;               // decoded (density + componentParams + color)
  encodedPreset?: string;              // for provenance / regenerate links
  target: BundleTarget;                // "stackblitz" | "codesandbox" | "vite" | "next" | "raw"
  aliases?: AliasScheme;               // default consumer aliases (@/components/ui, @/lib/utils)
}
```

### 2.2 How it generalizes the current per-item publisher

`publish()` (`www/src/publisher/publish.ts:119-161`) already does, **for one component**, the four steps the bundle needs per component: flatten → resolveClasses → serialize → substitute. The bundle engine **loops** that over the showcase's transitive component set and then layers theme + showcase + scaffold on top:

| Current per-item (`publish.ts`) | Bundle engine generalization |
|---|---|
| `publishables[name]()` for one `name` | Loop over the **transitive set** computed from the showcase imports + each item's `registryDependencies` (topological) |
| `selectPublishable(mod, preset)` (currently **private** in `$name.tsx:89-107`) | **Extract** to `www/src/publisher/select-publishable.ts` and reuse (handles `loader.style` file-swap) |
| `rewriteDeps()` → absolute URLs (`publish.ts:79-105`) | **Drop all** `registryDependencies` — every dep is inlined locally (extend `BUNDLED_INTO_INIT` logic to "everything") |
| Emits `files[].target` like `ui/button.tsx` | Place at the **alias-resolved** path `src/components/ui/button.tsx`; rewrite each file's `target` through the project's `aliases` |
| `emitInitItem()` → theme as shadcn `css`/`cssVars` fields (`emit-theme.ts:71`) | **Render** those structured fields into an actual `globals.css` **text** file (new emitter, §2.4) |
| No entry, no scaffold | Add `App`/route entry rendering `<Cards/>`, plus `package.json`/Vite/Tailwind/tsconfig |

The merge helpers the bundle needs for combining per-component `css`/`cssVars` already exist at build time (`mergeCss`/`mergeCssVars` in `www/scripts/registry-build.ts`) and in `emit-theme.ts` (`mergeCssVarsIntoCssRule`); a request-safe copy belongs in the bundle module.

### 2.3 The import-rewriter (the load-bearing new piece)

The showcase files (and component `base.tsx` files) import via `@/registry/...`. The bundle must rewrite to the consumer alias scheme. This is a **string/AST transform on import specifiers** — analogous to `specifierToDepName()` in `www/src/publisher/build-time/derive-registry-deps.ts:35` (which already parses `@/registry/{ui,lib,hooks}/X/...` specifiers), but here we *rewrite* rather than *classify*.

Rewrite rules:

| From | To (default aliases) | Notes |
|---|---|---|
| `@/registry/lib/utils` | `@/lib/utils` | matches init item's `aliases.utils` (`emit-theme.ts:92-98`) |
| `@/registry/ui/<name>` | `@/components/ui/<name>` | matches `aliases.ui` |
| `@/registry/hooks/<name>` | `@/hooks/<name>` | matches `aliases.hooks` |
| `lucide-react` | *(unchanged)* | add to `dependencies` |
| `@/registry/__generated__/icons` | **resolve** (see §6.6) | app-only; inline, swap, or exclude the one card |

Two viable implementations: a **build-time pre-rewrite** (transform showcase sources once during `build:registry`, store an alias-neutral copy in `__generated__/`) or a **request-time regex/specifier rewrite** (cheap, since specifiers are well-formed). The build-time path is safer (it can use `ts-morph`, already a build dep) and keeps the request handler pure; the request-time path avoids a generated artifact. Recommend **build-time pre-rewrite** into a `showcase` publishable artifact (§4.3), consistent with how component templates are pre-processed today.

### 2.4 `globals.css` text emitter

`emitInitItem()` returns shadcn **structured** fields (`css` object + `cssVars.theme`); it does **not** produce a CSS string — shadcn's CLI does that merge on the consumer side. For a self-contained bundle there is no shadcn CLI, so we need a function that renders those structured fields back to CSS text. This is the **inverse** of the existing build-time parser `cssToRegistryFields()` (`www/src/publisher/build-time/css-to-registry-fields.ts:30-78`) and a sibling of the existing `emitCss()` (`www/src/registry/theme/emit-css.ts`, which already serializes the `@theme` semantic block from `DEFAULT_SEMANTICS`).

```
emitGlobalsCss(themeItem)  →  string
  @import "tailwindcss";
  @import "tw-animate-css";
  @plugin "tailwindcss-react-aria-components";
  @plugin "tailwindcss-autocontrast" { cssfile: "<this file>"; }   // ← must point at the bundle's CSS, not registry/styles.css
  @plugin "tailwindcss-with";
  @custom-variant dark (&:is(.dark *));
  @utility focus-ring { … } /* + focus-reset/input/no-highlight */
  @layer base { *{@apply border-border} body{@apply bg-bg font-sans text-fg} html{@apply font-sans} }
  ::selection { … }
  @theme inline { --radius-md: calc(... * var(--radius-factor)); --color-bg: var(--neutral-50); … }   // from cssVars.theme
  :root { --radius-factor: 1; --neutral-50: oklch(…); … }   // PRESET ramps (or default)
  .dark { --neutral-50: oklch(…); … }                       // reversed
```

Critical fix vs the registry's own sheet: in `www/src/registry/base/base.css` the autocontrast plugin's `cssfile` points at `./src/styles.css`. The bundle's `cssfile` must point at the **bundle's own** Tailwind entry CSS, or `--on-*` foregrounds won't be derived in the generated project. The structured fields drop the `@plugin` body to `{}` (`css-to-registry-fields.ts:73-77`), so the emitter re-attaches the `cssfile` option for the autocontrast plugin specifically.

### 2.5 Proposed module boundaries (under `www/src`)

```
www/src/bundle/                         ← NEW: request-safe, pure JS (no ts-morph/React)
  types.ts                  ProjectBundle, BundleFile, BuildBundleInput, BundleTarget, AliasScheme
  build-bundle.ts           buildBundle(input): ProjectBundle  — the orchestrator (§2.2)
  collect-components.ts     transitive component set from showcase imports + registryDependencies (topo sort)
  rewrite-imports.ts        @/registry/* → consumer aliases (request-time fallback; §2.3)
  emit-globals-css.ts       structured theme fields → globals.css text (§2.4)
  scaffold/                 per-target package.json / vite.config / tailwind / tsconfig / index.html templates
    vite.ts  next.ts  stackblitz.ts  codesandbox.ts
  showcase-manifest.ts      list of showcase source files + entry wiring (or import the generated artifact)

www/src/publisher/
  select-publishable.ts     ← EXTRACTED from routes/r/$name.tsx (shared by route + bundle)
  publish.ts                (unchanged core; bundle calls publish() per component)
  emit-theme.ts             emitInitItem() reused as the theme half of the bundle

www/src/routes/r/
  registry[.]json.tsx       ← NEW: shadcn Registry index (MCP + design-tool catalog)
  bundle.tsx                ← NEW: GET /r/bundle?preset=&target= → ProjectBundle JSON (sandbox tools)
  export[.]json.tsx         ← NEW (or /r/tokens): resolved tokens as hex/RGB/HSL (design tools)
```

### 2.6 How `/r/registry.json` and the export endpoint fit

- **`/r/registry.json`** is a thin read model over the four existing arrays (`registryUi` from `www/src/registry/__generated__/registry-items.ts`, `registryLib`, `registryHooks` from `www/src/registry/hooks/registry.ts`, `registryBase` from `www/src/registry/base/registry.ts`). No aggregate export exists today; the route assembles the shadcn `Registry` shape (`www/src/registry/types.ts:80-82`). It is the **discovery** surface for MCP/shadcn and the **catalog** for design-tool generators. It does **not** need the bundle engine.
- **`/r/bundle`** *is* the bundle engine over HTTP — it returns the `ProjectBundle` JSON that sandbox define-APIs (StackBlitz SDK / CodeSandbox Define API) post into their iframe, and that repo-generators write to disk.
- **`/r/export.json` (tokens)** is a sibling of `/r/init` that resolves the preset's color the same way (`resolveColorConfig`, `www/src/registry/theme/primitives.ts:67`) but returns **hex/RGB/HSL** instead of CSS — the design-tool master key (§6.1).

---

## 3. Per-mechanism architecture

The thirteen target tools cluster into five mechanism groups. For each: the **artifact** the "Open in" button produces, the **dotUI endpoints** it needs, and the **preset-fidelity** path.

### 3a. Component-URL (v0)

**Mechanism.** Vercel v0 accepts an "Open in v0" deep link that points at a **shadcn registry item URL**; v0 fetches the item and opens it in a chat/canvas. This is the closest fit to what dotUI already serves.

- **Artifact:** a button linking to `https://v0.dev/chat/api/open?url=<host>/r/<item>?preset=<encoded>` (or v0's current open-in URL form), where `<item>` is ideally a **single bundle item** that contains the whole showcase + theme + all components inline (so v0 opens *the showcase*, not one component).
- **dotUI needs:**
  - A **bundle-as-registry-item** endpoint — a `registry:block`-style item whose `files[]` are the entire showcase + all 32 components + `lib/utils.ts`, and whose `css`/`cssVars` carry the theme. This is the bundle engine's output reshaped into a single shadcn item (reuse `emitInitItem` for the theme half, loop `publish()` for the files half — exactly the "mega bundle" recipe).
  - `registryDependencies` **dropped** (everything inlined), so v0 never needs to follow URLs.
- **Preset fidelity: full** for code; the one caveat is v0's CSS handling (§6.2).

### 3b. Sandbox define-API (StackBlitz SDK + CodeSandbox Define API) — the dynamic-preset unlock

**Mechanism.** Both StackBlitz (`sdk.openProject({files})` / the `/run` POST form) and CodeSandbox (the **Define API**: a `parameters` payload, optionally LZ-compressed, POSTed to `https://codesandbox.io/api/v1/sandboxes/define`) accept an **arbitrary in-memory file tree** and boot it. This is where the **full preset travels with zero registry round-trips** — the bundle engine's output maps 1:1 onto their `files` parameter.

- **Artifact:** the "Open in StackBlitz/CodeSandbox" button posts the `ProjectBundle.files` (plus `package.json`) via the SDK/Define form. For StackBlitz, a hidden `<form>` to `https://stackblitz.com/run` or `StackBlitzSDK.openProject({ files, template: 'node' })`. For CodeSandbox, a `POST .../sandboxes/define` with `parameters` (use their `getParameters()` LZ-string helper to stay under URL limits).
- **dotUI needs:** **`GET /r/bundle?preset=&target=stackblitz|codesandbox`** returning the `ProjectBundle`. The client fetches it, then hands `files` to the SDK. (Alternatively, dotUI computes the Define `parameters` server-side and returns a ready POST body.)
- **Preset fidelity: full.** This is the **highest-fidelity, lowest-tool-cooperation path** — the project is exactly what the bundle engine emits, including the preset's `globals.css` and themed components. **Best early target** because it exercises the whole bundle engine end-to-end and proves "showcase-first + themed + installed" with no third-party schema.

### 3c. Repo-based (bolt / replit / lovable) — generated-repo strategy

**Mechanism.** These tools import a **Git repo or a project archive** (bolt.new can open `https://bolt.new/~/github.com/<owner>/<repo>` or accept a project import; Replit imports from GitHub or a zip; Lovable imports a GitHub repo). They expect a *complete, conventional* project, not a registry.

- **Artifact:** the bundle engine's `ProjectBundle`, materialized as a real project layout (Vite + React + Tailwind v4 + the rewritten showcase + themed `globals.css`). Two delivery options:
  1. **Ephemeral repo:** a small service (or GitHub App) writes the bundle to a throwaway repo, then the button deep-links the tool at that repo URL. Highest compatibility, most infra.
  2. **Archive/import URL:** if the tool accepts a zip/tar or a project-import URL, serve `GET /r/bundle?...&format=zip` and deep-link.
- **dotUI needs:** the same **`/r/bundle`** endpoint, plus a **`vite` target** scaffold (`scaffold/vite.ts`: `package.json`, `vite.config.ts`, `tsconfig.json` with the `@/*` path alias, `index.html`, `src/main.tsx` mounting `<App/>` that renders `<Cards/>`, `src/globals.css`). Optionally a thin repo-publisher service (out of the dotUI app's request path).
- **Preset fidelity: full** for code; effort is dominated by the **repo/archive delivery** infra, not the bundle (which is shared with §3b).

### 3d. MCP (Cursor / Claude / shadcn) — registry.json + base/all item

**Mechanism.** The shadcn MCP server (and editor MCP integrations) discover components via a **registry index** and install them via `shadcn add`. "Open in" here means: the user's editor/agent can pull dotUI's themed components by name. The showcase-first framing becomes "the agent can scaffold the showcase because every piece is discoverable and installable with the preset baked in."

- **Artifact:** an MCP/registry configuration the user adds (`components.json` `registries["@dotui"]` → `<host>/r/{name}?preset=<encoded>`, which `emitInitItem` already emits at `emit-theme.ts:99-101`), **plus** the new index so discovery works.
- **dotUI needs:**
  - **`/r/registry.json`** — the index (today: **404**; this is the single most-cited missing piece across mechanisms). Without it, MCP cannot list items.
  - A **"showcase" aggregate item** registered in the index (e.g. `name: "showcase"`, the same bundle-as-item from §3a) so an agent can `shadcn add @dotui/showcase` and get the full first-view in one shot. Its `registryDependencies` can stay as URLs (let shadcn follow them) **or** be inlined; for an agent flow, inlining is more robust.
- **Preset fidelity: full** — the preset rides in `registries["@dotui"]`'s `?preset=` and in each per-item URL (`$name.tsx:51`). Color only survives on `/r/init` and the (new) bundle/showcase item, **not** on `/r/$name` (which drops `color`, `$name.tsx:113-121`); the index/showcase path must source color from the init/bundle resolution.

### 3e. Design-tool generation (Figma / Framer / Webflow / Paper) — token export + generators

**Mechanism.** None of these run React or consume a shadcn registry. "Open in" = **generate native artifacts** (Figma Variables + Component Sets; Framer code/Smart Components; Webflow variables/components; Paper styles) from **(a) the preset's resolved tokens** and **(b) per-tool component metadata**. The showcase becomes a generated **first page/frame** mirroring `cards.tsx` declaratively. The Figma deep-dive (`docs/open-in/figma.md`) is the reference design for this whole group.

- **Artifact:** a tool-specific generator (a Figma **plugin**; for Framer/Webflow, a code-component package or an API push where the platform allows) that the button deep-links, handing over the `?preset=` string.
- **dotUI needs (shared across the group):**
  - **`GET /r/export.json?preset=` (tokens)** — `decodePreset` → `resolveColorConfig(ds.color ?? DEFAULT_COLOR_CONFIG)` → per-step **OKLCH→sRGB hex/RGB(+HSL)** and `onBlackWhite` foregrounds, plus the semantic→primitive map mirroring `DEFAULT_SEMANTICS` (`www/src/registry/theme/semantics.ts`). (Figma's variant is `/r/figma/tokens` returning Figma `{r,g,b}` 0..1.)
  - **`/r/registry.json`** as the component catalog.
  - **Per-item design metadata** on `meta.ts` (the `figma` block; generalizable to other tools — §4) describing anatomy, variant→property mapping, and token bindings.
  - **A showcase manifest** (`www/src/registry/figma/showcase.ts`, generalizable to `www/src/registry/design/showcase.ts`) declaratively mirroring `cards.tsx`.
  - **`toSrgb` / `toHex` exported from `@dotui/colors`** (today only `gamutMap, oklchCss, toOklch, apca, wcag2` are barrel-exported; `toSrgb` lives in `packages/colors/src/shared/color.ts:42` but isn't exported).
- **Preset fidelity:** structure full, **color partial** (OKLCH→sRGB is lossy at out-of-gamut steps; `gamutMap` nudges them — see §6.1 and `figma.md` §5c).

---

## 4. `meta.ts` schema evolution

### 4.1 Today

`RegistryItem` (`www/src/registry/types.ts:69-78`) = shadcn item + two dotUI-only fields, both **dropped from emitted JSON** at publish (`publish.ts:145-158`):

```ts
export type RegistryItem = ShadcnRegistryItem & {
  group?: ComponentGroup | null;
  params?: Record<string, ParamDef>;   // EnumParamDef | ScalarParamDef
};
```

### 4.2 Consolidated proposal

Add **two** optional, declarative, publish-dropped fields. `figma` is taken verbatim from `docs/open-in/figma.md` §8a; a `showcase` hint helps the code-bundle entry, and the design metadata is namespaced so it can grow to Framer/Webflow without per-tool churn.

```ts
// www/src/registry/types.ts (additions)

// --- design-tool metadata (Figma first; see docs/open-in/figma.md §8) ---
export type FigmaTokenBinding =
  | { kind: "fill"; token: string } | { kind: "stroke"; token: string }
  | { kind: "text"; token: string } | { kind: "radius"; token: string }
  | { kind: "opacity"; value: number };
export interface FigmaLayer {
  name: string; type: "frame" | "text" | "icon" | "instance";
  component?: string; bind?: FigmaTokenBinding[]; content?: string;
  children?: FigmaLayer[]; showWhen?: Record<string, string>;
}
export interface FigmaVariantMapping {
  property: string; propertyType: "VARIANT" | "BOOLEAN" | "TEXT" | "INSTANCE_SWAP";
  source: string; values?: readonly string[]; default?: string;
}
export interface FigmaDensitySizing { height?: number; paddingX?: number; paddingY?: number; gap?: number; }
export interface FigmaMeta {
  layout: { direction: "horizontal" | "vertical" | "none"; align?: "min"|"center"|"max"|"space-between";
            sizing?: Partial<Record<Density, FigmaDensitySizing>>; };
  anatomy: FigmaLayer[];
  variants: FigmaVariantMapping[];
  /** Optional data-driven variant→token overrides (e.g. primary ⇒ fill accent). */
  variantBindings?: Record<string, FigmaTokenBinding[]>;
  sample?: Record<string, string>;
  states?: readonly string[];
}

export type RegistryItem = ShadcnRegistryItem & {
  group?: ComponentGroup | null;
  params?: Record<string, ParamDef>;
  figma?: FigmaMeta;        // NEW — design-tool generation metadata
};
```

Rationale highlights (full detail in `figma.md` §8): `figma.layout.sizing` per density is sourced from each component's `styles.ts` density blocks; `bind.token` names reuse the `--color-*` suffixes from `DEFAULT_SEMANTICS` verbatim; `variants` map dotUI enum params (and synthetic `$variant`/`$size`/`$state` axes) to Figma component properties. Keeping `variantBindings` data-driven avoids hardcoding per-component intent in the generator.

> **Note on a `showcase` hint:** rather than add a third field that most items would leave empty, the code-bundle entry is better driven by a **single hand-authored showcase manifest** (§4.3) than by per-item flags. So no `bundle?`/`showcase?` field is proposed on `RegistryItem`; the showcase wiring lives in one place.

### 4.3 How `registry-build` consumes them

`www/scripts/registry-build.ts` (`pnpm build:registry`) already reads each `ui/<name>/meta.ts` and emits `__generated__/registry-items.ts` + per-component publishables + `__generated__/base-css.ts`. The schema additions require:

1. **No change to publishables emission** — `figma` is dotUI-only and rides along on `meta` (the runtime side already carries `params`/`group`; `figma` is the same), and is dropped from emitted shadcn JSON by `publish.ts` automatically (it only copies a known field whitelist, `publish.ts:145-156`).
2. **Surface `figma` in `registry.json`** — the new index route reads `registryUi` etc. and includes `figma` in each descriptor (or strips it for a lightweight index and serves it from a dedicated `/r/figma/manifest`).
3. **New build step: showcase pre-rewrite + manifest validation** — add to `registry-build`:
   - Read the showcase sources under `www/src/components/marketing/showcase/`, rewrite `@/registry/*` specifiers to consumer aliases (using the `ts-morph` already imported by the build), and emit `__generated__/showcase-bundle.ts` (the alias-neutral file map + entry wiring) for the bundle engine to consume at request time.
   - Validate the showcase manifest: every component referenced exists in `registryUi`; resolve the `lucide-react` and `@/registry/__generated__/icons` edges (§6.6).
   - For the design path, validate every `figma.anatomy[].component` / `variants[].source` against `registryUi` / the item's `params` (the CI guard `figma.md` §9 calls for).

The integrity-check pattern already exists in `registry-build` (scope drift, allowlist, registryDeps drift, unique names) — the showcase/figma validators slot in as additional throwing checks.

---

## 5. The refactor list (ordered, concrete)

Ordered so each step unblocks the next; each is a discrete PR.

1. **Extract `selectPublishable`** from `www/src/routes/r/$name.tsx:89-107` into `www/src/publisher/select-publishable.ts`; import it in the route and the bundle engine. (Pure move; the enum-with-files/`loader` logic must be reused, not duplicated.)
2. **Export `toSrgb` (add `toHex`, `toHsl`) from `@dotui/colors`** — `packages/colors/src/shared/color.ts:42` already has `toSrgb`; add it (and `toHex = round(toSrgb)→#rrggbb`) to the barrel `packages/colors/src/index.ts`. Master key for every design tool and any swatch UI.
3. **Add `/r/registry.json`** — `www/src/routes/r/registry[.]json.tsx`, assembling the shadcn `Registry` shape from `registryBase`/`registryUi`/`registryLib`/`registryHooks`. Reuse the cache headers from `$name.tsx:27-30`. Unblocks MCP **and** design-tool catalogs. (Today: 404.)
4. **New bundle module `www/src/bundle/`** — `types.ts`, `collect-components.ts` (transitive set from showcase imports + `registryDependencies`, topo-sorted), `rewrite-imports.ts`, `emit-globals-css.ts` (inverse of `css-to-registry-fields.ts`; reuse `emit-css.ts` for the `@theme` block), `build-bundle.ts` (orchestrator looping `publish()` + `emitInitItem()`), and `scaffold/*` templates per target.
5. **Build-script additions** (`www/scripts/registry-build.ts`) — emit `__generated__/showcase-bundle.ts` (alias-rewritten showcase file map + entry) and add the showcase/figma validators (§4.3).
6. **Add `/r/bundle`** — `www/src/routes/r/bundle.tsx`: decode preset (reuse the `decodePresetForRoute` helper pattern already duplicated in both routes — **extract it** to `www/src/publisher/decode-preset-for-route.ts` while here), call `buildBundle`, return `ProjectBundle` JSON (optionally `?format=zip`). Run emitted `.tsx` through `oxfmt` like `$name.tsx:62-76`.
7. **Add a "showcase" aggregate item** (bundle-as-single-shadcn-item) for v0 and MCP — either a dedicated route `/r/showcase` or a special `name` handled in `$name.tsx`; theme via `emitInitItem`, files via the bundle engine, `registryDependencies` dropped.
8. **Preset codec: thread `tokens` → theme** — `emit-theme.ts:62-68` documents that global `tokens` (e.g. `--radius-factor`) round-trip in the URL but are **not** written to `:root`. `PublishPreset` (`www/src/publisher/types.ts:79-85`) lacks `tokens`. Add `tokens?` to `PublishPreset`, thread it from both routes' decoders, and have `emitInitItem`/`emitGlobalsCss` write them to `:root`. (Otherwise radius-factor presets silently no-op in bundles.)
9. **`meta.ts` schema** — land the `figma` types (§4.2) in `www/src/registry/types.ts`; confirm `publish.ts` drops them (it does, by whitelist).
10. **Author `figma` blocks** for the showcase-critical components (`button, card, text, text-field/input, select, checkbox, switch, link, avatar, badge, tooltip, loader`), per `figma.md` §8b/§8c.
11. **Design-tool token endpoints** — `/r/export.json` (hex/RGB/HSL) and Figma's `/r/figma/tokens` (`{r,g,b}` 0..1), both reusing `resolveColorConfig` + the new `toHex`/`toSrgb` + `onBlackWhite`.
12. **"Open in" buttons on `/create`** — next to `install-command.tsx` (`www/src/modules/create/install-command.tsx`), built from the current `encodePreset(designSystem)` value (`www/src/modules/create/preset/use-design-system.ts`); per-tool deep-link/SDK wiring. Handle `encodePreset → undefined` (no customization) by falling back to default everywhere.

**What to extract/share (summary):** `selectPublishable`, `decodePresetForRoute`, and CSS-merge helpers move into shared modules; `toSrgb`/`toHex` move into the colors barrel; the bundle engine becomes the shared core for v0 / sandbox / repo / showcase-item; `resolveColorConfig` + on-color stay the single color source for both `globals.css` and design-token export.

---

## 6. Risks & cross-cutting concerns

### 6.1 OKLCH everywhere → need hex/HSL/RGB export
dotUI emits **only `oklch()`** strings (`packages/colors/src/shared/color.ts:54`). Code targets are fine (browsers read OKLCH), but **every design tool and any swatch/color-input UI needs sRGB**. The seam exists (`toSrgb`, `gamutMap`) but `toSrgb` isn't barrel-exported. **Color fidelity is inherently partial** for design tools: vivid OKLCH steps sit outside sRGB and get `gamutMap`'d (hue-preserving nudge), so the most saturated light/dark steps shift slightly; in-gamut steps are exact. There is no fix — sRGB is the tools' only space. Document the nudge.

### 6.2 v0 / shadcn CSS handling (cssVars stripping)
shadcn-family tools historically normalize/strip parts of a registry item's CSS, and v0's importer may not faithfully carry every `@plugin`/`@utility`/`@layer` block or the `oklch()` `:root` ramps. The bundle-as-item path mitigates this by shipping a **literal `globals.css` file** (in `files[]`) rather than relying solely on structured `css`/`cssVars` merge — the tool then just writes the file. Verify per tool; the autocontrast `cssfile` self-reference (§2.4) is the most fragile line.

### 6.3 MCP's hard dependency on `/r/registry.json`
The entire MCP/shadcn discovery path is blocked until the index route exists (today 404). It is low-effort and unblocks two mechanism groups (MCP **and** design-tool catalogs), so it should be **P0**.

### 6.4 Preset URL-length limits
The encoded preset is compact (pako-deflate + base64url, `codec.ts`) and round-trips fine in `/r/*` query strings. But **sandbox define-APIs encode the entire project into a URL/POST** (CodeSandbox Define API is famous for this). The bundle is large; do **not** put the bundle in a URL — POST it (StackBlitz SDK `openProject`, CodeSandbox `getParameters()` LZ + POST). The `?preset=` stays small and is the only thing safe to put in deep links; the **bundle is always fetched/POSTed, never URL-encoded**. Also handle the encoder returning `undefined` when the design system equals defaults (`codec.ts:84-89`).

### 6.5 Tier-gating
"Open in &lt;tool&gt;" is a natural premium surface. The bundle/export endpoints should be gate-aware (e.g. auth check in the route before `buildBundle`), and the customizer button should reflect entitlement. Keep gating in the **route layer**, not the bundle engine (which stays pure) — mirrors how the routes already own preset-decode/format concerns and the engine stays side-effect-free.

### 6.6 The internal icon-library edge (`@/registry/__generated__/icons`)
One showcase card (`invite-members.tsx`) imports dotUI's generated icon barrel, which is **app-only** and not an installable registry item. Three options, in order of preference: **(a)** swap that card's icons to `lucide-react` (already a bundle dep) so the showcase is fully portable; **(b)** inline the specific icon components into the bundle; **(c)** exclude that single card from the bundled showcase. The build-time showcase validator (§4.3) should **fail loudly** if an un-resolvable app-only import appears, so this can't silently break a generated project. Likewise `lucide-react` must be added to `ProjectBundle.dependencies`.

### 6.7 Showcase ↔ source drift
The showcase is hand-authored React; the bundle rewrites it. If a card adds a new `@/registry/*` import, the transitive set and rewriter must keep up. Mitigate with the build-time validator (every showcase import resolves to a known registry item or an allowlisted npm dep) and a snapshot test of `/r/bundle` for the default preset. The same drift risk applies to `figma` anatomy vs `styles.ts` (covered by `figma.md` §9 guards).

### 6.8 `color` dropped on `/r/$name`
`$name.tsx:113-121` returns only `{ density, componentParams }` — **color is intentionally dropped** per-component (color lives in `globals.css`, not in component files). The bundle engine sources color from the **theme half** (`emitInitItem` / `resolveColorConfig`), not from per-component publish — so this is correct as-is, but anyone wiring a new path must not assume `/r/$name` carries color.

---

## 7. Phased roadmap

Sequenced by **leverage ÷ effort**, with the `/r/registry.json` index and the bundle engine as the early unlocks (they are shared infrastructure for almost everything downstream).

| Phase | Deliverable | Tools unlocked | Why here | Effort |
|---|---|---|---|---|
| **P0** | `/r/registry.json` index (§5.3) + extract `selectPublishable`/`decodePresetForRoute` + export `toSrgb`/`toHex` (§5.1–5.2) | **MCP** (Cursor/Claude/shadcn discovery); prerequisite for design catalogs | Lowest effort, highest fan-out; 404 today blocks MCP; the colors export is a 1-line master key | S |
| **P1** | **Bundle engine** `www/src/bundle/*` + `globals.css` emitter + import-rewriter + build-time showcase pre-rewrite/validator (§5.4–5.5) | (foundation — no tool yet) | The core abstraction everything code-side depends on; build it once, reuse 4× | L |
| **P2** | **`/r/bundle`** + StackBlitz SDK & CodeSandbox Define buttons (§3b, §5.6) | **StackBlitz, CodeSandbox** | Highest fidelity, least tool cooperation; proves "showcase-first + themed + installed" end-to-end | M |
| **P3** | **Showcase aggregate item** + **Open in v0** (§3a, §5.7) + MCP `@dotui/showcase` | **v0**, richer **MCP** | Reuses P1/P2; v0 just needs a single registry item URL | M |
| **P4** | **`vite` scaffold target** + repo/archive delivery (ephemeral repo or zip) + bolt/replit/lovable buttons (§3c) | **bolt, replit, lovable** | Bundle is shared with P2; effort is delivery infra, not codegen | L |
| **P5** | **`/r/export.json` tokens** (hex/RGB/HSL) + `figma` schema land + author `figma` blocks (§4, §5.9–5.11) | foundation for design tools | Token endpoint + schema are shared by all design tools | M |
| **P6** | **Figma plugin** (`packages/figma-plugin`) + `/r/figma/tokens` + showcase manifest + Open-in-Figma button | **Figma** | Per `docs/open-in/figma.md`; net-new published plugin | XL |
| **P7** | **Framer / Webflow / Paper** generators (reuse P5 export + per-tool metadata) | **Framer, Webflow, Paper** | Each is its own generator; lowest leverage, most per-tool work | XL each |

**Cross-cutting, fold into the relevant phase:** thread `tokens → :root` (P1, §5.8); tier-gating in route layer (P2 onward, §6.5); preset-`undefined` fallback everywhere (P0 onward); per-tool CSS-fidelity verification (P2/P3, §6.2).

---

## Appendix — key file index

- Showcase entry & footprint: `www/src/components/marketing/showcase/cards.tsx`; sources under the same dir (alias surface in §1.4).
- Per-item publisher (generalize): `www/src/publisher/publish.ts:119`; `selectPublishable` to extract: `www/src/routes/r/$name.tsx:89`.
- Theme emitter (reuse as bundle theme half): `www/src/publisher/emit-theme.ts:71`; routes `www/src/routes/r/init.tsx`, `www/src/routes/r/$name.tsx`.
- CSS structured↔text: parser `www/src/publisher/build-time/css-to-registry-fields.ts:30`; semantic block emitter `www/src/registry/theme/emit-css.ts`.
- Color resolution & seam: `www/src/registry/theme/primitives.ts:67`; `packages/colors/src/shared/color.ts:42,54`; barrel `packages/colors/src/index.ts`.
- Preset codec / defaults / types: `www/src/modules/create/preset/codec.ts:75,111`; `www/src/modules/create/preset/defaults.ts`; `www/src/modules/create/preset/types.ts`.
- Registry arrays (index source): `www/src/registry/__generated__/registry-items.ts`; `www/src/registry/hooks/registry.ts`; `www/src/registry/base/registry.ts`.
- Registry/meta types (schema target): `www/src/registry/types.ts:69`.
- Build entry: `www/scripts/registry-build.ts` (`pnpm build:registry`, `www/package.json:10`).
- Install-command precedent (button home): `www/src/modules/create/install-command.tsx:39`.
- Design-tool deep-dive: `docs/open-in/figma.md`.
