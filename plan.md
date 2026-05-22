# dotui — shadcn CLI registry plan

Goal: make the design systems built in `/create` installable into any project via the shadcn CLI. After `shadcn init <our-url>`, the user's project is set up against the dotui registry with their preset baked in. `shadcn add @dotui/button` then installs a single self-contained `ui/button.tsx` whose tv config and tailwind classes are already resolved for that preset.

## 1. Current state

Per-component sources in [www/src/registry/ui/{name}/](www/src/registry/ui/):

- `meta.ts` — shadcn-shaped `RegistryItem` + dotui `params` (`enum` | `scalar`).
- `base.tsx` — JSX, reads `useStyles()` from `./styles`.
- `styles.ts` — `createStyles(meta, { base, density, params })` returns `{ useStyles, styles }`.
- `types.ts`, `index.tsx`, `examples.tsx`, `demos/*`.

Runtime resolution in [www/src/modules/core/styles.tsx](www/src/modules/core/styles.tsx):

- Module-scoped `enumVarsRegistry` / `scalarVarsRegistry` populated as a side effect of every `createStyles()` call.
- `DesignSystemProvider` writes selections to `:root` CSS vars.
- `useStyles()` composes `base → density[d] → params[name][value]` via `tv({ extend })`.

Preset codec in [www/src/modules/create/preset/codec.ts](www/src/modules/create/preset/codec.ts) — diffs against `DEFAULTS` → JSON → pako deflateRaw → base64url. Already roundtrips through `?preset=`.

Existing [scripts/registry-build.ts](www/scripts/registry-build.ts) only generates docs-site lazy-load indexes (`__generated__/{demos,blocks,examples,icons}.tsx`). No shadcn JSON, no `/r/*` route, no `components.json`. The `shadcn@4.7.0` devDep is unused.

The gap: the design system today only renders correctly inside the dotui app because the magic is the React provider plus a Map populated by `createStyles` side effects. Nothing emits standalone files.

## 2. Target user flow

```
1. User configures preset on /create → URL is /create?preset=<base64>
2. UI shows: `npx shadcn init https://dotui.com/r/init.json?preset=<base64>`
3. CLI fetches the init endpoint → it returns a `registry:base` item whose
   `config` block includes:
     registries: { "@dotui": "https://dotui.com/r/{name}.json?preset=<base64>" }
   plus tailwind plugins, theme cssVars, base.css utilities → written into the
   project.
4. `npx shadcn add @dotui/button` → CLI hits /r/button.json?preset=<base64>
   → server runs the publish pipeline against that preset
   → returns one inline file (ui/button.tsx) with tv config and tailwind classes
     already resolved.
```

Supported natively by shadcn's `registryConfigItemSchema` (`{ url, params, headers }`) and the `registry:base` item type (carries a `config` block on first init).

## 3. The publish pipeline

**Two-phase: heavy AST work at build, cheap string ops per request.** `ts-morph` wraps the TypeScript compiler (~10MB install, ~200ms cold instantiation); doing it per request on serverless eats cold-start budget. The source files don't change between requests — only the preset does — so the AST work belongs at build.

### Build-time (extends `pnpm build:registry`)

For each component, run `ts-morph` against `base.tsx` + `styles.ts`:

1. Strip `import { useStyles } from "./styles"` and any `<Name>Styles` type import.
2. Insert `import { tv } from "tailwind-variants"`.
3. Replace `useStyles()` invocations with a `<name>Variants` reference. Handle both call shapes — `const styles = useStyles()` and `const { root, title } = useStyles()()`.
4. Replace `VariantProps<XStyles>` → `VariantProps<typeof <name>Variants>`.
5. Insert a top-level `const <name>Variants = tv(%%TV_CONFIG%%);` placeholder.
6. Read `styles.ts`, extract the config object passed to `createStyles(meta, ...)` as a serializable literal.

Emit to `www/src/registry/__generated__/publishables/<name>.ts`:

```ts
export const publishable = {
  template: "...stripped base.tsx with %%TV_CONFIG%% placeholder...",
  stylesConfig: { base: {...}, density: {...}, params: {...} },  // plain JSON
  meta: { name, type, files, registryDependencies, ... },
};
```

For enum-with-files (loader): emit one publishable variant per source file (`<name>.spinner.ts`, `<name>.ring.ts`); pick at request time.

Build catches transform errors before deploy. Per-request path never loads `ts-morph`.

### Request-time (per `/r/<name>.json` hit) — pure JS

1. **Flatten.** Deep-merge `stylesConfig.base` ← `density[d]` ← `params[name][value]` in declaration order. Result: one flat `{ base, slots?, variants, defaultVariants, compoundVariants }`.
2. **Resolve scalar params.** Walk every class string. For `<utility>-(--<cssVar>)` where `--<cssVar>` is owned by a scalar param in `meta.params`, look up the preset's value (fallback `def.default`), map via the token table (`--radius-md` → `md`, `0` → `none`), rewrite `rounded-(--btn-radius)` → `rounded-md`. The token table is the single source of truth for both the customizer's picker and the publisher.
3. **Pick the source variant** for enum-with-files using the existing [resolve-files.ts](www/src/registry/resolve-files.ts) logic, fed the preset's `componentParams[name]`.
4. **Serialize.** Stringify the flat config to a TS object literal (light cleanup for unquoted keys, array shorthand).
5. **Substitute.** `template.replace("%%TV_CONFIG%%", literal)`.
6. **Format.** Run through `oxfmt` (already a dep, already fast).
7. **Assemble** the shadcn item:

```ts
{
  name, type, title, description,
  dependencies, registryDependencies,    // straight from meta
  files: [{ path: "ui/button.tsx", type, target, content: formatted }],
  // params, group, density: DROPPED — dev-time concerns only
}
```

## 4. The `registry:base` (init) item

A separate endpoint `/r/init.json` returns:

```ts
{
  name: "dotui",
  type: "registry:base",
  config: {
    style: "default",
    tailwind: { css: "src/styles.css", baseColor: "neutral", cssVariables: true },
    aliases: {
      components: "@/components", ui: "@/components/ui",
      utils: "@/lib/utils", lib: "@/lib", hooks: "@/hooks",
    },
    registries: {
      "@dotui": {
        url: "https://dotui.com/r/{name}.json",
        params: { preset: "<encoded>" },
      },
    },
  },
  dependencies: [...current registryBase.dependencies],
  cssVars: { theme: { /* all radius/color tokens baked from preset */ } },
  css: { /* @plugin lines, @utility focus-ring, skeleton utilities from base.css */ },
  registryDependencies: ["utils", "focus-styles"],
}
```

The preset's **global** values land here (`--radius-factor`, `--cursor-interactive`, color palette).
The preset's **per-component** values live inline in each component's classes (Step B) — no install-time CSS vars needed for those.

## 5. Routes to add (TanStack Start)

| Route                          | Purpose                                                                                                           |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `routes/r/init[.]json.tsx`     | reads `?preset=`, returns `registry:base` JSON                                                                    |
| `routes/r/$name[.]json.tsx`    | reads `?preset=` + `name`, loads `publishables/<name>.ts`, runs the request-time pipeline, returns component JSON |
| `routes/r/registry[.]json.tsx` | namespace index for shadcn discovery (optional)                                                                   |

TanStack server functions or route loaders returning `Response` with `application/json`. All request-time work is pure JS — no `ts-morph` import in the route bundle. Cache key = preset string; prerender for the default preset.

## 6. Required refactors

| #   | Refactor                                                                                                                                                                                                                                 | Why                                                                                                                                                            |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Split `createStyles` so its config object is exportable as a plain value (return a `flatten(preset) => flatConfig` alongside `useStyles`, or move config into `styles.config.ts` co-located with each component).                        | Publisher can't depend on React and can't rely on the Map-based module side effects of `createStyles` for every component on every request. Needs a pure path. |
| 2   | Move `Density` type from `@/modules/create/preset/types` into `@/registry/types`.                                                                                                                                                        | Publisher should not import from create-page UI module.                                                                                                        |
| 3   | Move param option pools (radius/spacing/blur/shadow/cursor) out of [components-config.tsx](www/src/modules/create/components-config.tsx) lines 94–145 into `@/registry/publisher/token-map.ts`.                                          | Customizer picker and build-time class rewriter must share one mapping.                                                                                        |
| 4   | Adopt one canonical `useStyles()` call shape across base files. Today some do `const styles = useStyles()` then `styles({...})`, others `const { root } = useStyles()()`. Either standardize or make the ts-morph transform handle both. | Step C needs deterministic anchors.                                                                                                                            |
| 5   | Extract [base.css](www/src/registry/base/base.css) utilities (`focus-ring`, `skeleton--shimmer`, etc.) into a structured source so they can be emitted into the `registry:base` `css` field.                                             | shadcn's `css` field is keyed by selector, not free-form CSS — need an emitter.                                                                                |
| 6   | Add a `registry:theme` item (or fold into base) carrying `cssVars.theme` derived from [tokens.ts](www/src/registry/base/tokens.ts) + the preset's `tokens` map.                                                                          | Consumers need the CSS var declarations or `bg-neutral` etc. won't resolve.                                                                                    |
| 7   | Each component's `meta.ts` gains optional `title` / `description`.                                                                                                                                                                       | Surfaces in `shadcn add` lists.                                                                                                                                |
| 8   | `params: { animation: { shimmer: { slots: { root: "skeleton--shimmer" } } } }` (Skeleton) — values reference CSS utilities defined in base.css. Keep those utilities in the base item so resolved classes still have meaning.            | Covered by #5.                                                                                                                                                 |

## 7. New modules

```
www/src/registry/publisher/
  token-map.ts          # --radius-md → "md", etc. (shared with customizer)
  build/                # build-time only — depends on ts-morph
    transform-base.ts   # strip useStyles, insert tv-config placeholder
    extract-config.ts   # read stylesConfig from styles.ts as a JSON literal
    build-publishables.ts  # orchestrator, called from scripts/registry-build.ts
  flatten.ts            # base + density + enum-overrides → flat tv config (pure)
  resolve-classes.ts    # rewrite "rounded-(--btn-radius)" → "rounded-md" (pure)
  serialize.ts          # flat tv config → TS object-literal string (pure)
  emit-theme.ts         # preset → registry:base cssVars + css (pure)
  publish.ts            # request-time orchestrator: template + preset → ShadcnRegistryItem
www/src/registry/__generated__/publishables/
  <name>.ts             # generated: { template, stylesConfig, meta }
www/src/routes/r/
  init[.]json.tsx       # /r/init.json
  $name[.]json.tsx      # /r/{name}.json
```

Only `publisher/build/**` imports `ts-morph`. The route bundle imports only `publisher/{flatten,resolve-classes,serialize,publish,emit-theme}.ts` plus the generated publishables.

## 8. Decisions (default calls)

- **Single-file output**: emit `ui/button.tsx` with inline `tv` config. No `styles.ts`, no `useStyles`, no `DesignSystemProvider` shipped.
- **Resolve density at build, not runtime**: chosen density's classes are folded into base. Consumer's button has no concept of density.
- **Resolve scalar params at build**: `rounded-(--btn-radius)` → literal `rounded-md`. Consumer's CSS has no `--btn-radius`.
- **Enum params with same shape**: flatten into base (`alert.style="sousse"` → merged in).
- **Enum params that swap files**: pick the right `base.*.tsx` source (loader).
- **Global theme (radius factor, palette, cursors)**: ship as `cssVars` on the base item. Consumer gets one CSS block, no Provider.
- **`tv({ extend })` chain**: collapse into a flat `tv(...)` call at build for clean emitted code.
- **Stale presets**: if a preset references a now-removed param value, fall back to that param's `default`.
- **CLI namespace name**: `@dotui`.

## 9. Order of work

1. Refactors #1–3 — separate config from runtime, move `Density`, extract token map. Unblocks the publisher without changing behavior.
2. Pure request-time core: `flatten.ts` + `resolve-classes.ts` + `serialize.ts`. Hand-write a button publishable fixture and unit-test the full request-time pipeline end-to-end against it.
3. Build-time AST passes: `transform-base.ts` + `extract-config.ts`, wired into [scripts/registry-build.ts](www/scripts/registry-build.ts) to emit `__generated__/publishables/`. Riskiest piece — validate on button (non-slot), alert (slots), skeleton (slots + enum-merge), loader (enum-file-swap). Treat a clean publishable build as a CI gate.
4. `emit-theme.ts` and the `registry:base` item.
5. Wire routes `/r/init.json` + `/r/$name.json`.
6. Add the "copy install command" UI to the create page.
7. End-to-end: `shadcn init` against the deployed URL in a scratch repo, then `shadcn add @dotui/button`. Render in a Next.js app, eyeball diffs vs the dotui preview.

## 10. Open questions

- Do we want a single canonical `useStyles()` shape (refactor #4 as a real change) or have the ts-morph pass support both forms? Standardizing is cleaner but touches every base file.
- Should `/r/init.json` and `/r/$name.json` be prerendered for the empty preset (likely the most common path) and rendered on-demand only when a preset is present?
- Granularity of the preset in URLs: today's compressed base64 is fine for most browsers but `shadcn`'s URL params get passed through verbatim. Confirm there's no length issue with large presets.
