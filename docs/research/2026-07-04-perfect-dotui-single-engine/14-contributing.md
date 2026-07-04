# Contributor workflows
> Part of [The Perfect dotUI (single-engine)](README.md) — an end-state architecture study (2026-07-04). Constitution-conformant.

This chapter is the field manual. Every prior chapter describes a layer of the system as a finished thing; this one describes what a contributor *does* to extend that thing, step by step, with the exact files they touch, the commands they run, and the bar a reviewer holds them to. The other chapters answer "how does it work"; this one answers "how do I add to it without breaking the guarantees."

The guarantees are load-bearing and they are all mechanical. Preview equals export because one pure `resolve`/`compile` pipeline runs in both the worker and the server. The shipped `base.tsx` is the resolved `tv()` because `styles.ts` **is** the source and the compiler resolves it, not lifts it. A two-year-old **dsdoc** opens because its `lock` pins an immutable **Registry Manifest**. None of these survive a contributor who "just hardcodes a hex" where a token belongs, or "just references a primitive" from a component, or "just renames an id." So every workflow below ends in the same place: the specific CI job that fails if you got it wrong, and the review bar that catches what CI can't.

Eight recipes follow, ordered from the everyday (a new component) to the rare and consequential (a new mode dimension in the baseline). Governance policies that cut across several recipes — the axis-addition bar, id permanence, the manifest release process — are set off as **Policy** sidebars where they first bite. The worked fixtures are the ones the whole study shares: **Button** (the real `styles.ts` as authored input), **Menu** (declared highlight vars), **Loader** (file-variant).

---

## 0. The contributor's map

Every recipe lands changes in one of two places, and the distinction governs everything downstream:

- **Registry source** (`packages/registry/**`) — the product's source of truth. Components, styles, contracts, axis declarations, demos. Imports only published surfaces. Changes here become part of the next **Registry Manifest** snapshot ([§ Policy: Manifest release](#policy-manifest-release-snapshot-version-deprecate)).
- **Compiler packages** (`packages/{style,tokens,compiler,runtime,cli}/**`) — the machinery. New producers, new export targets, new codeStyle transforms live here. Changes here are versioned with the package, and the ones that widen the vocabulary the manifest speaks (a new producer id) are also a manifest concern.

```mermaid
flowchart TD
  A[Contributor change] --> B{Where?}
  B -->|new component / style / axis / token| C["packages/registry"]
  B -->|new producer / target / codeStyle| D["packages/style · tokens · compiler · runtime · cli"]
  C --> E["pnpm build:registry"]
  D --> E
  E --> F[Manifest builder folds source into a snapshot]
  F --> G["CI: preview==export · live-variants · resolution-completeness · migration · golden"]
  G -->|green| H[Merge → next manifest release]
  G -->|red| A
```

The commands recur across every recipe, so they are stated once here:

| Command | What it does | When |
|---|---|---|
| `pnpm build:registry` | Resolves `styles.ts` → shipped `tv()`, folds contracts/axes into the manifest, regenerates `__generated__` | After any registry change |
| `pnpm check` | oxlint (incl. `dotui/hardcoded-value`, import-boundary, `dotui/id-permanence`) + format check | Before every commit |
| `pnpm typecheck` | Whole-monorepo tsc | Before every commit |
| `pnpm test` | vitest — token engine, resolver, emitter, migration corpus | After touching machinery or golden docs |
| `pnpm test conformance` | `createLiveVariants(resolved)(props) === tv(emit(resolved))(props)` + computed-style diff | After any style, resolver, or emitter change |
| `pnpm build:references` | Regenerates API-reference docs from `types.ts` | After touching a `types.ts` |

---

## 1. New component

Adding a component is the most common contribution and touches the most files, but almost all of it is mechanical: scaffold, author behavior, author styles, declare the contract and axes, write demos, and register it into the manifest.

**Files you create** under `packages/registry/ui/<component>/`:

| File | Ships? | You author |
|---|---|---|
| `base.tsx` | yes (transformed) | RAC template + the `./styles` seam |
| `styles.ts` | no (resolved) | `defineComponentStyles` with `sizes()` |
| `contract.ts` | no (folded into manifest) | `defineContract`/`surface`/`scalar` token nodes |
| `axes.ts` | no (folded into manifest) | per-component axis declarations |
| `meta.ts` | no (drives everything) | kind, files, deps, group, sync group |
| `types.ts` | no (drives docs) | prop interfaces |
| `index.tsx` | no (site-only) | www-side wrapper (router links) |
| `demos/*.tsx` | no | one docs demo per file |
| `examples.tsx` | no | `/create` preview grid entries |

### 1.1 Scaffold

```bash
pnpm registry:new switch --group inputs --sync-group field-like
```

The generator writes the folder with the nine files stubbed, `meta.ts` pre-filled, and `base.tsx` carrying the template skeleton. It does not invent styles or a contract — those are design decisions, not scaffolding.

### 1.2 The behavior template — idiomatic RAC, one style seam

`base.tsx` is plain React Aria Components plus a single style-application line. Two conventions carry over from [Registry §2](03-registry.md) and [Styles §3](04-styles.md), but note what is **no longer forced**: relation slots do **not** have to be explicit props. With a single engine there is no portability constraint on authored CSS, so `:has()` reads a trailing icon straight from free-form children — an explicit `suffix` prop is a component-design choice you may still make for API clarity, not a styling requirement.

1. **Every rendered slot carries `data-slot`.** Slots are targeted by attribute in the emitted CSS and in the `tv()` slot map — `data-slot="track" | "thumb" | "content"` are the anchors.
2. **The `./styles` import is the one fidelity seam.** `useStyles` is `createLiveVariants(resolved)` in preview and `tv(emit(resolved))` at export; the [conformance test](13-testing.md) is what proves the two agree.

```tsx
'use client'
import * as SwitchPrimitive from 'react-aria-components/Switch'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import type { VariantProps } from '@dotui/style'
import { switchStyles, useStyles } from './styles'

type SwitchVariants = VariantProps<typeof switchStyles>

export function Switch({ size = 'md', children, ...props }: SwitchProps) {
  const styles = useStyles(switchStyles, { size })
  return (
    <SwitchPrimitive.Switch {...props}>
      {composeRenderProps(children, (rendered) => (
        <>
          <span data-slot="track" {...styles.track()}>
            <span data-slot="thumb" {...styles.thumb()} />
          </span>
          <span data-slot="content">{rendered}</span>
        </>
      ))}
    </SwitchPrimitive.Switch>
  )
}
```

The `{...styles.track()}` seam spreads a `className`. The wrapper-level `codeStyle` (arrow vs declaration, file layout) applies over this one template.

### 1.3 `styles.ts` — `defineComponentStyles` + `sizes()`

Author Tailwind strings — everything Tailwind is legal: `:has()`, `peer-*`, descendant combinators, container queries, arbitrary values. Density × size geometry goes through `sizes()` — this is the **canonical way**, not optional sugar. A reviewer rejects ad-hoc per-density ladders (three hand-written `variants.size` blocks) on sight; see [Density & sizing §](08-density-sizing.md).

```ts
import { defineComponentStyles, sizes } from '@dotui/style'
import switchMeta from './meta'

export const switchStyles = defineComponentStyles(switchMeta, {
  slots: ['track', 'thumb', 'content'],
  track: {
    base: 'inline-flex shrink-0 items-center rounded-full bg-(--switch-off) transition-colors selected:bg-(--switch-on) focus-visible:focus-ring disabled:bg-disabled',
  },
  thumb: {
    base: 'rounded-full bg-(--switch-thumb) transition-transform selected:translate-x-(--switch-travel)',
  },
  sizes: sizes({
    // one table; resolution folds it into the selected density tier
    default:     { sm: { trackW: 7, trackH: 4, thumb: 3 }, md: { trackW: 9, trackH: 5, thumb: 4 }, lg: {/*…*/} },
    compact:     { sm: {/*…*/}, md: { trackW: 8, trackH: 4.5, thumb: 3.5 }, lg: {/*…*/} },
    comfortable: { sm: {/*…*/}, md: { trackW: 10, trackH: 6, thumb: 5 }, lg: {/*…*/} },
  }),
})
```

Compare against the shadcn equivalent before you finish. Their `style-mira/nova/vega` map to `compact/default/comfortable`; classes live in both `styles/style-<name>.css` and the component base file — check both or you will "discover" missing classes that are simply in the other file.

### 1.4 `contract.ts` — the token-contract nodes

The component references **only** component-contract nodes (`--switch-on`, `--switch-thumb`, `--switch-travel`) or semantic nodes — **never primitives** ([Tokens §3](05-tokens.md), Constitution §3/§4 edge rule). `defineContract`/`surface`/`scalar` generate the nodes; `surface()` creates the structural `pairsWith` edges that power contrast verification.

```ts
import { defineContract, surface, scalar, ref, calc } from '@dotui/tokens'

export default defineContract('switch', {   // owner 'switch'; sync group members share these nodes
  on:    surface({ bg: ref('color-primary') }),       // → c:switch-on, pairsWith the thumb-on pair
  off:   surface({ bg: ref('color-neutral') }),
  thumb: scalar('color', ref('color-bg')),
  travel: scalar('dimension', calc('trackW - thumb - 2')),
})
```

Every contract node ships with a base value, so nothing the component consumes can dangle. Users retarget these nodes; they never delete or rename them — contract evolution is a manifest-version concern ([§ Policy: Manifest release](#policy-manifest-release-snapshot-version-deprecate)).

### 1.5 `axes.ts` — the per-component axes

Component axes are synthesized from contract declarations, but **exposure is curated** — no auto-axis for internal mechanics. Declare the axes a *user* should see; a synced axis belongs to the group, not the member ([Axes §1, §5](06-axes.md)).

```ts
import { defineAxes } from '@dotui/registry/axes'

export default defineAxes('switch', {
  // 'thumbShape' is component-scoped; 'radius' and 'hoverEffect' come from the field-like sync group
})
```

If your component's look needs a knob no axis covers, **stop** — that is a new-axis proposal ([Recipe 3](#3-new-axis)), not a same-PR addition. Slipping an axis into a component PR is a specifically-prohibited move (Constitution §12, CLAUDE.md).

### 1.6 Demos, docs, references

Write `demos/*.tsx` (one component per file), fill `examples.tsx` for the `/create` grid, and complete `types.ts`. Then:

```bash
pnpm build:references   # regenerates modules/references/generated from types.ts — commit the full-run output
```

Documented props come from `types.ts`, not `base.tsx`. Commit the full-run output; scoped `-f` runs can flip union-member order.

### 1.7 Resolution and manifest inclusion

```bash
pnpm build:registry   # resolves styles.ts → Switch's shipped tv(); folds contract + axes into the manifest
pnpm test conformance # createLiveVariants == tv(emit(resolved)) across variant × size × density × state
pnpm check && pnpm typecheck && pnpm test
```

`build:registry` is what actually adds the component to the product: the manifest builder reads `meta.ts`, resolves `styles.ts` into a concrete `tv()` config, folds `contract.ts` and `axes.ts` into the baseline graph and axis catalog, and emits the resolved `tv()` into `__generated__`. Commit the regenerated `__generated__/*` — CI's registry-drift job diffs exactly those files.

**Review bar (new component):**
- `styles.ts` uses `sizes()`; no hand-authored density ladders; no un-tokenized design values (a `bg-[#…]` on a color family is a `dotui/hardcoded-value` warning carrying the token hint).
- Every slot has `data-slot`.
- `contract.ts` references only semantic/contract nodes; `surface()` pairs exist for every rendered fg-on-bg.
- No new axis smuggled in.
- Conformance is green for the new component; the shipped `tv()` byte-matches the baked default the builder ships.
- `__generated__` and `build:references` output are committed and drift-clean.

---

## 2. New named style for an existing group

A named style is a curated variant of a component's look — "outline" buttons, "translucent" menus — authored as a **delta** over the group's base config and resolved to a *complete* `tv()` config before anything downstream reads it. Because Button ⇄ ToggleButton are a sync group, a named style is authored **once** and applies to both.

### 2.1 Author the delta

Named styles are role-safe override bundles: retargets (contract nodes → semantic nodes, never primitives) plus optional style-slice overrides. Author them where the group's styles live:

```ts
// packages/registry/ui/button/styles.ts — a new value on the `variant`-adjacent `styleFamily` axis
export const buttonNamedStyles = defineNamedStyles('button', {
  outline: {
    retargets: {
      'btn-bg-default': ref('color-transparent'),
      'btn-line-default': ref('color-border'),
    },
    slices: { root: 'border bg-transparent hover:bg-inverse/5 pressed:bg-inverse/10' },
  },
})
```

The delta is an authoring convenience. At `resolve` time the compiler applies it over the base config and produces a **complete** `tv()` config for the `outline` value — forking, diffing, LLM generation, and export all operate on complete configs; the delta never leaks downstream (Constitution §3, [Styles §4](04-styles.md) named-style resolution).

### 2.2 Cross-system portability check

The decisive property: a dotUI-curated named style must render correctly through **any user's graph**. Because retargets point at semantic nodes and resolve against the user's token graph, an "outline" style styled with `color-border` picks up *their* border color, in *their* modes, verified in *their* reachable cells. The check is mechanical:

```bash
pnpm build:registry
pnpm test conformance -- --style outline    # live-variants == emitted tv() on the named style
pnpm test golden -- --style outline         # renders 'outline' through all five golden dsdocs
```

The golden run is the portability proof: if `outline` references a token that doesn't exist in one of the golden graphs, or produces a failing contrast pair in a golden system's dark·hc cell, that is a failing test — not a runtime surprise in a user's export.

**Review bar (new named style):**
- Delta retargets reference semantic nodes only (edge rule); no raw primitives, no literal hexes.
- Sync group: the style is authored once under the group id; both members render it.
- `pnpm test golden` passes for the new style across all five reference systems — proven, not asserted.
- Contrast pairs (from `surface()` `pairsWith`) verified in every reachable cell of the golden systems.

---

## 3. New axis

Every visual decision is a user-configurable axis — but **adding an axis is a product decision**, not an engineering one. This is the highest-friction everyday workflow by design.

### Policy: Axis-addition bar (propose-and-approve)

> Before writing any code, the axis is **proposed and approved**. The bar is one question, from CLAUDE.md and the Constitution: **would two design systems disagree on it?** If Material and Linear would render the decision differently, it is an axis. If it is component mechanics — an internal hairline, a hit-area, a layout gap that no design system would tweak — it is a plain value and must **not** be tokenized or exposed. A missing look with no covering axis is flagged as a *missing axis* (a product signal), never patched with an invented token.
>
> Proposal lives in a GitHub issue on `mehdibha/dotUI` (Constitution §12; CLAUDE.md tracks PRDs there). It states: the visual decision, the two+ systems that disagree, the axis `kind` and `scope`, the `writes` targets, and the default (which must equal the current look so nothing moves for existing docs). Approval, then implementation. Slipping an axis into an unrelated component PR is prohibited.

### 3.1 Declare the axis

Once approved, the axis is a declaration in the manifest baseline (or, for a power-user overlay, in a dsdoc). Same object either way; the builder renders it identically ([Axes §1](06-axes.md)). For a global elevation-family axis:

```ts
// packages/registry/axes/elevation.ts
export const elevationFamily: AxisDecl = {
  id: 'elevation.family',            // permanent, readable — never renamed (see id-permanence policy)
  kind: 'enum',
  label: 'Elevation',
  scope: { level: 'global' },
  values: [
    { id: 'shadow', label: 'Shadows' },
    { id: 'flat-border', label: 'Flat + border' },
    { id: 'tonal', label: 'Tonal fill' },
  ],
  default: 'shadow',                 // == current look; existing docs are unaffected
  writes: [
    { to: 'tokenWrite', token: 'shadow-md', target: { value: 'none' }, when: 'flat-border' },
    { to: 'styleLayer', component: 'card', when: 'flat-border' },
    // …fan-out across every surface component
  ],
}
```

### 3.2 Wire the writes and pick the tier

`writes` is a list — one axis fans out across many tokens/components. The **tier** is *derived* from what the writes target, never hand-declared ([Axes §6](06-axes.md), Constitution §6):

| Axis targets | Derived tier | Preview cost |
|---|---|---|
| token/producer/scalar/mode-flip | **value** | CSS-variable write, 60fps |
| enum style/density/variant default/fileVariant | **structural** | one style-tree swap |
| add/rename token, add mode, custom style | **global** | recompile |

An `enum` axis writing `styleLayer` is **structural**; a `scalar` writing `cssVar` is **value**. If you wrote the tier by hand, that is a review reject — the classifier owns it.

### 3.3 Golden-doc updates

An axis exists to widen reconstruction coverage. Update the golden dsdocs that need it and add the reconstruction assertion ([Reconstructions §](07-reconstructions.md), [Testing §](13-testing.md)):

```bash
pnpm build:registry
pnpm test golden          # the five reference systems now exercise elevation.family
```

If a golden system was previously *unreconstructable* for want of this axis, its failing test now passes — that closed gap is the axis's justification made mechanical.

**Review bar (new axis):**
- Linked approval issue clearing the "two design systems disagree" bar.
- `default` equals the current look; no existing dsdoc changes resolved output.
- Tier is derived, not declared; `when` predicates are shared between panel visibility and resolution.
- Panel control is generated (no hand-written React — a `toCommand` that returns a stub is a type error, [Builder §](10-builder.md)).
- Golden docs updated; a previously-missing reconstruction now renders.
- `id` is readable and permanent.

---

## 4. New token or semantic-vocabulary change

Changing the baseline token vocabulary — adding a semantic token, retargeting a default, deprecating one — is **baseline evolution**. It ships in a manifest version and every stored dsdoc that pins an older manifest is unaffected until its owner explicitly reconciles.

### 4.1 Add a semantic node

Baseline semantics live in the registry's committed baseline graph. Add a `SemanticNode` with a permanent readable id and a base value:

```ts
// packages/registry/manifest/baseline/semantics.ts
{
  id: 'color-info',                 // permanent id; label renames freely
  layer: 'semantic',
  category: 'background',
  values: {
    '': { kind: 'ref', to: 'blue-500' },
    'scheme:dark': { kind: 'ref', to: 'blue-400' },
  },
  pairsWith: 'color-fg-on-info',    // seeds a verification pair
}
```

Adding a node is a **minor** manifest bump: it ships with a sensible default, appears in every compatible picker, and cannot break an older doc (older docs don't reference it). The baseline is ~76 semantic tokens; a genuine gap in that vocabulary is what this recipe is for.

### 4.2 Deprecation and reconcile implications

Renaming or removing is a **major** manifest bump and requires a `DeprecationNote` so `reconcile(doc, newManifest)` can produce a reviewable diff instead of silent loss ([dsdoc §8.2](09-dsdoc.md), Constitution §5):

```ts
{ id: 'color-accent', deprecated: { kind: 'rename', to: 'color-primary' } }   // reconcile auto-remaps
{ id: 'color-legacy-panel', deprecated: { kind: 'merge', into: 'color-card' } }
{ id: 'color-gone', deprecated: { kind: 'removed', fallback: { kind: 'ref', to: 'color-neutral' } } }
```

`reconcile` applies the table: `rename` → auto id-remap; `merge` → fold; `removed` → snap to the declared fallback with a warning. Every drop is a surfaced change in the returned `{ doc, changes[], blocked[] }` — a stored system never silently degrades. Emitted var names for a rename ship a deprecation alias for one major version so long-lived consumer repos don't get a churned utility name overnight.

### 4.3 Verify

```bash
pnpm build:registry
pnpm test           # contrast matrix picks up the new pair; migration corpus proves reconcile
pnpm test golden    # golden docs still resolve; a shadcn-token-name doc still round-trips
```

**Review bar (token change):**
- New node has a permanent readable id and a base (`''`) value; edge rule holds (semantic references primitives/semantics only).
- Rename/removal carries a `DeprecationNote`; nothing is hard-deleted (id permanence).
- Contrast pairs declared where the token is a surface/fg.
- Migration corpus + golden docs green; `reconcile` produces a reviewable diff, never a silent reset.

---

## 5. New producer

A producer generates a color ramp for a cell — `oklch` (default), `tailwind`, `contrast`, `material` (HCT), `fixed` (paste-a-palette). The registry is open; adding one (say `hsluv`) is a `packages/tokens` change plus registration.

### 5.1 Implement the `Producer` interface

```ts
interface Producer<C> {
  id: string
  schema: ZodType<C>                                   // config validated at edit time
  produce(config: C, ctx: CellCtx): {                  // per (ramp, cell)
    scale: Record<string, string>                      // step → color
    on: Record<string, string>                         // step → autocontrast fg
  }
}
interface CellCtx {
  cell: Cell; isDark: boolean; contrastBoost: number   // from mode-option roles
  steps: readonly string[]; surface: string            // resolved bg for this cell
}
```

The **per-cell contract** is the whole point: `produce` is called once per reachable cell with that cell's `isDark`/`contrastBoost`/`surface`. Dark is not ramp reversal (which exists nowhere) — an `isDark` producer derives a *real* dark. High-contrast is not a separate producer — `contrastBoost → 1` raises targets toward AAA inside the same producer, which is how `hc` composes with every scheme.

```ts
export const hsluv: Producer<HsluvConfig> = {
  id: 'hsluv',
  schema: HsluvConfigSchema,
  produce(config, ctx) {
    const anchorL = ctx.isDark ? config.darkAnchor : config.lightAnchor
    const targetBoost = 1 + ctx.contrastBoost * 0.3   // hc pushes toward AAA in-producer
    const scale = buildScale(config.hue, config.sat, anchorL, ctx.steps, targetBoost)
    return { scale, on: deriveOnColors(scale, ctx.surface) }
  },
}
```

### 5.2 Register and verify

```ts
// packages/tokens/producers/index.ts
registerProducer(hsluv)
```

Verification hooks are not optional. A producer is only correct if:

```bash
pnpm test producers -- --producer hsluv
```

...passes the producer conformance suite: it must produce a legible ramp in **every reachable cell** (base, dark, hc, dark·hc), its `on` colors must clear the contrast targets the verifier holds each cell to, and — because the builder re-runs *this* code in-browser whenever a seed changes — it must be a pure function of `(config, ctx)` with no ambient state.

**Review bar (new producer):**
- `id` registered; `schema` validates config at edit time (a bad seed is a rejected `applyEdit`, not a broken export).
- `produce` is pure and per-cell; honors `isDark` (real dark, not reversal) and `contrastBoost` (in-producer AAA push).
- Conformance suite green across all reachable cells; `on`-colors clear targets.
- DTCG note: generative recipes freeze to `fixed` on Figma re-import — documented, not silently lossy.

---

## 6. New export target

A target is a packaging of one resolved system — v0, Bolt, Lovable, a zip, a Figma DTCG file. The compiler already produces `RegistryFile[]`, DTCG, and static embeds; a target is a **profile** over that output plus bundle verification.

### 6.1 Write a target profile

```ts
// packages/compiler/targets/lovable.ts
export const lovableTarget: TargetProfile = {
  id: 'lovable',
  label: 'Lovable',
  framework: 'remix',
  themeDelivery: 'real-files',            // host strips registry css/cssVars → theme ships as project files
  dependencyResolution: 'inline-closure', // host can't follow registryDependencies
  deps: { pin: 'exact' },                 // exact versions, no ranges
  layout: {
    themeCss: 'app/globals.css',
    entry: 'app/routes/_index.tsx',
    componentsDir: 'app/components/ui',
    importStyle: 'relative',
  },
  autocontrast: 'bake',                   // host can't run the plugin → bake on-* foregrounds
}
```

The profile declares the host's constraints as data ([Distribution §4](12-distribution.md) is the schema's home). It does not re-implement compilation — the one bundle emitter runs `compile(resolved, { kind: 'export', codeStyle })` and packages the output per the profile. Served at `/r/bundle?doc=…&target=lovable` (Constitution §9).

### 6.2 Bundle verification

A target ships only when its bundle is proven installable and faithful:

```bash
pnpm test targets -- --target lovable
```

The suite: the bundle honors every declared constraint (theme delivered per `themeDelivery`, deps pinned per `deps.pin`, layout correct); it installs into a scratch host project; and the installed result renders **byte-identically to the same doc's preview** (the isomorphic-pipeline guarantee — same `resolve`/`compile`, so preview equals this target's export).

**Review bar (new target):**
- Profile is data over `compile`; no bespoke re-compilation.
- Constraints declared and verified; deps pinned; theme/token CSS delivered per `themeDelivery`.
- Installed bundle renders byte-equal to the doc's preview.

---

## 7. New mode dimension option in the baseline

The baseline ships two mode dimensions: `scheme: [light*, dark]` and `contrast: [normal*, hc]`. Adding a baseline option (an OLED-black `midnight` under `scheme`, or a `dim` scheme) is a token-graph change plus verification across the newly reachable cells.

### 7.1 Add the option

```ts
// packages/registry/manifest/baseline/dimensions.ts — the scheme dimension
{
  id: 'scheme',
  options: [
    { id: 'light', role: {} },
    { id: 'dark', role: { isDark: true } },
    { id: 'midnight', role: { isDark: true }, surface: 'color-bg' },  // new
  ],
  defaultOption: 'light',
  binding: { kind: 'class' },
}
```

Adding an option is guarded like any graph edit. Every token resolves in `midnight·*` immediately by falling through to less-constrained keys; you override only the cells that genuinely diverge (the neutral ramp's `scheme:midnight` producer config, surface lightness ≈ 0.10). `contrast:hc` composes onto `midnight` for free — the composition is the reason modes are dimensions and not a flat list (Constitution §4).

### 7.2 Verify the new cells

The soft cap is 4 dimensions / 24 reachable cells; a new option grows the cube, so verification must walk it:

```bash
pnpm build:registry
pnpm test contrast     # verifies every derived pairing × every NEWLY reachable cell (midnight·normal, midnight·hc)
pnpm test golden       # golden docs that opt into midnight resolve and pass strict export
```

A failing pair in `midnight·hc` produces a **proposed, cell-scoped** autofix — an override key on that cell only, never a mutation of the base value, never silent output correction. In headless strict export the run blocks with a machine-readable report; `--accept-fixes` applies the cell-scoped fixes and emits a manifest.

**Review bar (new mode dimension option):**
- Option added with correct `role` (`isDark`, `contrastBoost`, `surface`); base values fall through, overrides only where cells diverge.
- New cells stay within the soft cap; UI guidance if approaching it.
- Contrast verified in every newly reachable cell; failures propose cell-scoped fixes, not silent corrections.
- Golden docs that use the option pass strict export; DTCG gains the mode in the right collection.

---

## Policy sidebars

### Policy: id permanence

> Every referent — axis, axis value, token, mode, component, sync group, contract node, named style — has a **permanent readable id** minted from its initial slug (`color-primary`, `btn-bg-primary`, `elevation.family`). Ids are the handles stored dsdocs reference; a rename of the id is a stored-document break.
>
> - **Never rename or reuse an id.** A display `name`/`label` renames freely (it drives emitted var names and UI labels, initialized equal to the id). References use ids, never labels.
> - The `dotui/id-permanence` lint (part of `pnpm check`) fails a PR that removes or reuses a published id. Removal goes through a `DeprecationNote`, not a delete.
> - A renamed emission ships a deprecation alias for one major version so consumer utility names don't churn overnight.
>
> This is the discipline that makes readable ids as safe as opaque ULIDs while keeping documents human-diffable — the guarantee is the discipline plus the lint, not opacity.

### Policy: Manifest release (snapshot, version, deprecate)

> A **Registry Manifest** snapshot is the release unit. Publishing one is the mechanism by which every registry-source change above reaches users, and it is immutable and permanent once published (npm-shaped: published means permanent).
>
> - **Snapshot.** `pnpm build:registry` folds the current registry source — every resolved component `tv()`, every contract node, every axis, the baseline token graph, code-style option declarations — into a content-addressed snapshot (`2028.03.01-a3f`), served forever at `/r/manifest/<version>`.
> - **Version.** Additive changes (new component, new axis with a current-look default, new semantic token) are a **minor** bump — no stored doc changes resolved output. Breaking changes (rename/remove a contract node, remove an axis value, id-space refactor) are a **major** bump carrying a full **deprecation table**.
> - **Deprecate.** The deprecation table is what `reconcile(doc, newManifest)` reads to produce a reviewable diff on an explicit lock upgrade: `rename → auto-remap`, `merge → fold`, `removed → declared fallback + warning`, `new → resolve to default + flag`. No value ever degrades silently; a two-year-old dsdoc opens against its *own* frozen manifest and only moves when its owner reconciles.
> - **Retain.** Snapshots are never deleted. A hot-serve window keeps recent versions fast; older ones move to a cold-storage tier but stay resolvable.

---

## The one review question, restated

Every recipe reduces to the same test, applied at the right layer:

- A **value** decision (color, radius, shadow, density-affected spacing) flows through a token or contract node — `bg-primary`, not `bg-[#635bff]`.
- A **mechanics** decision (hairline, hit-area, internal gap) stays a plain value — no token, no axis.
- A **new knob** two design systems would disagree on is an **axis** — proposed, approved, defaulted to the current look.
- A **look with no covering axis** is a **flagged missing axis** — a product signal, never an invented token.

CI enforces the rest: `dotui/hardcoded-value` (design literals warned with a token hint), import boundaries (registry cleanliness), `dotui/id-permanence` (stored-doc safety), the conformance test (preview == export through the single fidelity seam), resolution completeness (every declared var-write ships — the Menu highlight bug is structurally impossible), the migration corpus (docs open forever), and the golden five (reconstruction is proven, not asserted). A green pipeline is the claim that a contribution kept every guarantee the architecture makes.

Note the absence: there is no engine-parity gate here, because there is one engine. Where the two-engine study spent a whole recipe and a catalog-completeness suite proving a second emitter total over an engine-neutral vocabulary, this study spends nothing — the shipped `tv()` *is* the styles, resolved not lifted, so there is no second consumer to keep in lockstep and no vocabulary ceiling to be total over.

---

## Tradeoffs this chapter accepts honestly

- **The friction is front-loaded and real.** Adding an axis requires a product proposal and approval before a line of code; adding a producer requires conformance across every reachable cell; every style change requires the conformance test to stay green. This is deliberate — the guarantees are only as strong as the weakest merged contribution — but it makes dotUI a slower place to contribute than a copy-paste component library, and the bar can feel heavy for a small change.
- **Machinery blast radius.** Because one resolver feeds everything — CSS, DTCG, preview, verification — a bug a contributor introduces in the token resolver or a shared style helper corrupts every export at once. The conformance and contrast tests are the guardrail, but the surface a contributor can break with one wrong table entry is larger than a single mis-authored class string in a hand-styled library. (This is the single-source-of-truth risk the token chapter accepts on purpose.)
- **Manifest permanence is a standing cost.** "Published means permanent" means the registry never deletes a snapshot a document might pin. The retention tiering keeps it affordable, but it is a growing operational liability that a mutable-defaults system would not carry — the price paid so a two-year-old dsdoc opens exactly as authored.
- **Stable-id targeting is gone.** codeStyle transforms and override diffs key off `tv()` structure (base / slot / variant / compound) + named-style ids, not stable rule-ids over an IR. A large refactor of a component's `tv()` shape can move where an override anchors; the id-permanence lint covers named-style ids and tokens, but section-path anchoring is inherently more fragile than an opaque rule-id would have been. This is the honest cost of resolving rather than lifting.
- **Golden-doc maintenance never ends.** The five reference systems must be updated whenever an axis or token that touches them lands, and their visual-regression baselines re-approved. This is the cost of proving reconstruction by rendering rather than asserting by metadata — cheaper than shipping a system that *claims* to reconstruct Material 3 and doesn't, but a real recurring tax on every contributor whose change reaches a golden system.
