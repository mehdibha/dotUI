# System overview — how the perfect dotUI fits together
> Part of [The Perfect dotUI (single-engine)](README.md) — an end-state architecture study (2026-07-04). Constitution-conformant.

dotUI is a design-system builder. A user opens [dotui.org/create](https://dotui.org/create), composes a complete design system — colors, typography, icons, density, radius, per-component styles, code style — previews every change live on real React Aria components, and exports code they own: into their codebase via the shadcn CLI, straight into v0, Bolt, Lovable, a zip, DTCG/Figma, or an agent. There is exactly **one** style engine, and it is first-class: idiomatic Tailwind v4 (`tv()` + utility strings).

This chapter is the map. It names every load-bearing artifact, shows the two pure functions that connect them, and walks three end-to-end narratives — a contributor authoring a component, a user building a system, a user exporting and updating a year later. Every later chapter is a zoom into one region of this map. Read this first; follow the cross-links for depth.

---

## 1. The one-paragraph shape, expanded

A design system is a **dsdoc** — one versioned JSON document, pinned to an immutable **Registry Manifest** snapshot. Two pure functions turn that document into everything: a **resolver**, `resolve(manifest, dsdoc) → ResolvedSystem`, and a **compiler**, `compile(resolved, target) → output`. Both live in `@dotui/compiler` and run **byte-identically** in a browser worker (the builder's live preview) and on the server (every export endpoint). That single fact — one resolve path, one compile path, two execution sites — is why **preview equals export by construction**, not by a parity test chasing two diverging programs.

Component styles are authored the way contributors already think: Tailwind utility strings in the registry's `styles.ts`. The style compiler **resolves** those strings — named-style params, density, scalar vars, declared var-writes — into the shipped `tv()` config; it does **not** lift them into a JSON intermediate representation. That resolved config, **`ResolvedComponentStyles`**, is a concrete `tv()` structure per sync group, ready for the single `tv()` emitter. Every value the styles reference flows through the **Dimensional Token Graph**: three layers (primitive → semantic → component-contract), stable ids, mode dimensions × cells, pluggable per-cell producers. The graph serializes to CSS custom properties and DTCG.

The builder is a *generated* UI over **Axis** declarations — no per-axis React. Every edit is a **Command** in an op-log store, classified by a pure function into **value / structural / global** tiers; the value tier is pure CSS-variable writes, which is what lets a hue drag hold 60fps over a full component showcase. The live preview mounts the real shipped component files inside a **DesignScope**. Distribution is one resolved system, many packagings.

### 1.1 The named artifacts, in one table

| Artifact | Canonical name | What it is | Owner | Home package |
|---|---|---|---|---|
| The user's design system | **dsdoc** (`Dsdoc`) | versioned JSON, media type `application/vnd.dotui.dsdoc+json`, file `*.dotui.json` | the user | `@dotui/schema` |
| dotUI's pinned vocabulary | **Registry Manifest** (`manifest`) | immutable, content-addressed snapshot (`2028.03.01-a3f`) of every axis, component, token baseline | dotUI | `@dotui/registry` |
| The resolved component styles | **ResolvedComponentStyles** | per sync-group; a concrete `tv()` config — params resolved, density folded, scalars resolved, var-writes preserved | computed | `@dotui/style` |
| The token model | **Dimensional Token Graph** (`TokenGraph`) | three layers, mode dimensions × cells, pluggable producers | dotUI baseline ⊕ user overlay | `@dotui/tokens` |
| Resolver output | **ResolvedSystem** | per-cell token values (symbolic), per-group `ResolvedComponentStyles`, file picks, codeStyle | computed | `@dotui/compiler` |
| Configurable knob | **Axis** (`AxisDecl`) | typed declaration; scope global/group/component; `writes` list | manifest or dsdoc overlay | `@dotui/schema` |
| Builder edit primitive | **Command** | op-log entry; tier value/structural/global derived from the axis | in-session | `@dotui/runtime` |
| Preview provider | **DesignScope** | scoped-inline; three adopted stylesheets | in-session | `@dotui/runtime` |
| Consumer-repo pin | **`dotui.lock.json`** | doc id/version, manifest pin, pristine file hashes, codeStyle | the consumer repo | `dotui` (CLI) |

The two pure functions bind them:

```ts
// @dotui/compiler
function resolve(manifest: Manifest, dsdoc: Dsdoc): ResolvedSystem
function compile(resolved: ResolvedSystem, target: Target): Output
```

Everything else — the builder, the CLI, the MCP server, the Figma plugin, the docs demos — is a caller of one or both.

### 1.2 Architecture map

```mermaid
flowchart TB
  subgraph authoring["AUTHORING — contributors, @dotui/registry"]
    STY["styles.ts<br/>(Tailwind utility strings, tv()-shaped)"]
    CON["defineContract() / surface()<br/>(component token declarations)"]
    AX["AxisDecl[]<br/>(axis declarations)"]
    STY -->|resolve, not lift| MF
    CON --> MF
    AX --> MF["Registry Manifest<br/>(immutable snapshot 2028.03.01-a3f)"]
  end

  subgraph doc["THE DOCUMENT"]
    MF -.pins baseline.-> DOC["dsdoc<br/>tokens overlay · axes · components<br/>selections · codeStyle · lock"]
  end

  subgraph compiler["@dotui/compiler — PURE, ISOMORPHIC"]
    DOC --> RES["resolve(manifest, dsdoc)"]
    MF --> RES
    RES --> RS["ResolvedSystem<br/>per-cell tokens · ResolvedComponentStyles · file picks"]
    RS --> COMP["compile(resolved, target)"]
    TG["Dimensional Token Graph<br/>(@dotui/tokens)"] --- RES
    EMIT["tv() emitter<br/>(@dotui/style)"] --- COMP
  end

  subgraph exec["EXECUTION SITES — same bytes"]
    COMP -->|target: preview| PREV["Style Worker → DesignScope<br/>(builder live preview)"]
    COMP -->|target: export| EXP["/r/* endpoints<br/>shadcn · v0 · bolt · zip · DTCG · MCP"]
  end

  BLD["Builder /create<br/>Command op-log · generated panel"] -->|edits| DOC
  BLD --- PREV
```

The spine is vertical: authoring produces the manifest; the manifest pins the document; the two pure functions turn the document into a `ResolvedSystem` and then into output; the output is realized at two execution sites that are guaranteed identical because they run the same compiled `compile`. The builder is a side actor that mutates the document and watches the preview site. There is one emitter path, not two — the single-engine choice collapses the whole cross-engine limb of this diagram.

---

## 2. The artifacts in detail

### 2.1 The dsdoc

The dsdoc is the only thing the user owns and edits. Its top level (canonical):

```ts
interface Dsdoc {
  $schema: "https://dotui.org/schema/dsdoc/v1.json"
  dsdoc: 1                       // integer SCHEMA major → pure migration ladder
  meta: DsdocMeta                // id (ULID, minted once), name, slug, content version, owner, forkedFrom?
  lock: RegistryLock             // { registry, manifest, manifestHash, components? } — the pin
  tokens: TokenGraphOverlay      // added/changed dimensions, ramps, nodes over the baseline graph
  axes?: Record<AxisId, AxisDecl>        // USER-declared axes (baseline axes live in the manifest)
  components?: Record<ComponentId, ComponentDelta>  // user overrides — raw Tailwind class-string deltas
  syncGroups?: Record<SyncGroupId, SyncGroupState>  // detach records: { detached?: Record<ComponentId, AxisId[]> }
  presets?: Record<PresetId, SelectionPatch>       // one-shot apply bundles
  selections: Selections         // what was chosen (the tiny, diffable part)
  codeStyle: CodeStyle           // the style of the exported code itself
}
```

There is no `engine` field: a single engine is implied, so the schema never asks the user to pick one. Three version numbers live here and are **never confused**:

- `dsdoc` — the *schema major*. Bumped by dotUI; drives a pure, numbered migration ladder with a per-version fixture corpus. A two-year-old document migrates loudly, never silently resets.
- `meta.version` — the *content* version of the user's system, bumped on publish.
- `lock.manifest` — the *vocabulary* version: which frozen manifest snapshot the document's referents resolve against.

The **declaration-vs-selection split** is the reason a share is tiny. Declarations (manifest axes + document overlays) describe *what can be chosen and how it renders*; `selections` records *what was chosen*. A system that only nudged the accent hue and the radius encodes to a handful of bytes. Canonical form sorts keys and omits defaults — and omission is unambiguous *because the lock pins the baseline*: an omitted value means "the pinned manifest's value," never "whatever today's code says." That single rule kills the entire class of silent-reinterpretation bugs. Full lifecycle in [The dsdoc](09-dsdoc.md).

### 2.2 The Registry Manifest

The manifest is dotUI's artifact; users never edit it. Each published snapshot is immutable and content-addressed (`2028.03.01-a3f`), kept forever npm-style, and served at `/r/manifest/<version>`. It carries every axis declaration, every sync group's `ResolvedComponentStyles` source, the baseline Dimensional Token Graph (~76 semantic tokens, 2 dimensions: `scheme`, `contrast`), the icon map, and the codeStyle option declarations.

Because the manifest is *frozen data* rather than *live code*, opening an old document is deterministic: its axes, its defaults, its style layers are exactly what they were the day it was authored. Upgrading the pin is an explicit, reviewable act — `reconcile(doc, newManifest)` produces a diff (renames auto-remap, merges fold, removals snap to a declared fallback with a warning), never a silent drift. See [The registry](03-registry.md).

### 2.3 ResolvedComponentStyles

Contributors author Tailwind strings in `styles.ts`, and the style compiler **resolves** them into `ResolvedComponentStyles` — a concrete `tv()` config per sync group. This is the resolve-not-lift model: there is no engine-neutral JSON intermediate, no slot-normalization pass, no closed authoring whitelist. Resolution reduces the authored source to what the single `tv()` emitter ships:

```ts
interface ResolvedComponentStyles {
  component: string              // 'button'
  syncGroup?: string             // Button ⇄ ToggleButton share ONE config
  tv: TvConfig                   // { base, slots, variants, compoundVariants, defaultVariants }
  componentVars?: ComponentVarDecl[]   // --btn-radius, typed default, param link
  declaredVars?: DeclaredVar[]         // var-writes a named style performs (menu.highlight) — carried verbatim
}
```

`TvConfig` is exactly the shape `tv()` consumes — base class strings, per-slot strings, variant maps, compound variants. Named-style **params** have already been resolved against the user's selections into concrete variant entries (no delta layers remain downstream, so forking / diffing / export all operate on complete configs). Density has been folded — either baked into classes or shipped as a `data-density` axis. Scalar and component vars (`--btn-radius`, radius factor) are resolved per axis selection.

What makes this load-bearing without an intermediate representation:

- **Resolution completeness (no strip step).** Named-style `vars` blocks and inline `[--x:var(--y)]` writes are carried into `declaredVars` and into the shipped output verbatim. There is no publish step that *could* drop them — which is exactly why the `menu.highlight = accent` export bug is structurally impossible (see decision **N2**). A "resolved output contains every referenced var" test guards it.
- **Hardcoded-value discipline** — a design-meaningful literal (`bg-[#635bff]`, `rounded-[7px]`) with an available token draws a **warning with a token hint**; component mechanics (`p-0`, hairlines, `top-1/2`, `-translate-x-1/2`) stay plain values. This is a lint over authored strings — a warning a contributor can justify — not a totality gate that blocks the build. CLAUDE.md's hardcoded-value rule, enforced as a lint.

The [edge rule](05-tokens.md) on token references still holds: a decl may reference **component-contract nodes** or **semantic nodes** — never primitives. Full treatment in [Styles](04-styles.md).

### 2.4 The Dimensional Token Graph

Every value flows through one graph. Three layers, enforced as edge rules on every edit:

```
primitive  (ramps + free primitives)   — a primitive may reference only primitives
   ↓
semantic   (user-space vocabulary,     — a semantic may reference primitives or semantics
            the shipped ~76 tokens)
   ↓
component  (per sync-group contract,    — a component may reference semantics or components
            system-owned, retargetable)
```

Modes are **dimensions**, not a flat list. The default system ships `scheme: [light*, dark]` and `contrast: [normal*, hc]`. Their Cartesian product is the **mode cube**; a concrete combination is a **cell** with a key like `'scheme:dark&contrast:hc'`. Every node's `values` are cell-keyed; resolution is "most-constrained key wins, ties by `dimensionPriority`." One `contrast:hc` override on `color-border` fixes every scheme at once — that composition is exactly why a flat mode list loses.

Ramps generate through **producers** (`oklch` default, `tailwind`, `contrast`, `material`, `fixed`, plus an open registry), each configured per cell. Dark is a real independently-derived dark (the `oklch` producer is `isDark`-aware), never a ramp reversal — ramp reversal exists nowhere. Verification derives contrast pairings *structurally* from the graph (`surface()` creates `pairsWith` edges) and checks WCAG2 + APCA per reachable cell. See [The Dimensional Token Graph](05-tokens.md).

### 2.5 Axes

Every visual decision is an **Axis**. Nothing about the look is a hardcoded choice.

```ts
type AxisDecl = EnumAxis | ScalarAxis | ToggleAxis | ColorAxis | FontAxis | TokenTargetAxis
interface AxisBase {
  id: AxisId                     // permanent, readable: "button.fill", "overlays.translucent"
  label: string; description?: string
  scope: { level: "global" } | { level: "group"; group } | { level: "component"; component }
  when?: { axis: AxisId; equals: unknown }     // shared by panel visibility AND resolution
  writes: WriteTarget[]          // a LIST → one axis can fan out across many tokens/components
}
```

Axes live in the manifest (baseline) or as document overlays (user-declared). The manifest declares the full set — elevation family, focus-ring style, motion, type scale, spacing scale, border width, icon library (a real axis: resolution swaps the icon import map at publish), fonts (self-hosted at export), hover effect, translucency (a fan-out toggle), the scheme/contrast dimensions, shadows. Component axes are synthesized from named-style params and contract declarations, but exposure is curated — internal mechanics vars never become axes. Full catalog in [The axis system](06-axes.md).

### 2.6 Commands, tiers, and DesignScope

In-session editing is a **Command** op-log — last-writer-wins per cell, with a sync/presence seam but not a full CRDT. Every command is classified into one of three tiers by a pure function of the axis it targets:

| Tier | Axis targets… | Mechanism | React renders |
|---|---|---|---|
| **value** | token value, producer seed/knob, scalar var, mode flip | worker recomputes → batched `setProperty` | none |
| **structural** | which classes apply: enum style, density, default variant, group param; fileVariant | worker re-resolves affected components → live style-module swap | affected only |
| **global** | the token/utility universe: add/rename token, add mode/dimension, custom style | worker full recompile → atomic three-sheet replace | scoped |

The preview is a scoped-inline **DesignScope**: the same React tree as the panel, mounting the *real* registry `base.tsx` files whose `./styles` import resolves to live style modules. Three adopted stylesheets (`themeSheet`, `utilitiesSheet`, `runtimeVarsSheet`) carry the emitted CSS; value-tier drags are inline `setProperty` writes on the scope root. The `createLiveVariants` shim behind that `./styles` import is the single fidelity seam — the only place preview and export code differ. See [The builder](10-builder.md).

---

## 3. Narrative A — a contributor authors Button, and it lands in a manifest snapshot

A dotUI contributor adds or revises the Button component. This is the authoring flow: source in, manifest snapshot out.

**1. Author the Tailwind strings.** The contributor writes `packages/registry/ui/button/styles.ts` exactly as they do today — `defineComponentStyles(meta, {…})` over utility strings, with `sizes()` for the density × size geometry table. The real fixture is the reference:

```ts
export const buttonStyles = defineComponentStyles(meta, {
  base: {
    base: [
      'group/button relative inline-flex shrink-0 cursor-interactive items-center justify-center rounded-(--btn-radius) bg-clip-padding font-(--btn-font-weight) whitespace-nowrap transition-[background-color,border-color,color,box-shadow] select-none',
      'focus-reset focus-visible:focus-ring',
      '**:[svg]:pointer-events-none **:[svg]:shrink-0',
      'pending:cursor-default pending:border-border-disabled pending:bg-disabled pending:text-transparent',
      'pending:**:not-data-[slot=spinner]:opacity-0',
      'disabled:cursor-default disabled:border-border-disabled disabled:bg-disabled disabled:text-fg-disabled',
    ],
    variants: {
      variant: {
        default: 'border bg-neutral text-fg-on-neutral hover:border-border-hover hover:bg-neutral-hover pressed:border-border-active pressed:bg-neutral-active',
        primary: 'bg-primary text-fg-on-primary [--color-disabled:var(--neutral-500)] hover:bg-primary-hover pressed:bg-primary-active disabled:border-0 pending:border-0',
        quiet: 'bg-transparent text-fg hover:bg-inverse/10 pressed:bg-inverse/20',
        // link / warning / danger …
      },
      isIconOnly: { true: 'p-0' },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  },
  density: sizes({
    compact: { xs: { h: 5, px: 2, radius: 'sm', text: '0.625rem', icon: 2.5, iconPad: 1.5 }, /* … */ },
    default: { md: { h: 8, px: 2.5, gap: 1.5, icon: 3.5, iconPad: 2 }, /* … */ },
    comfortable: { /* … */ },
  }),
})
```

Everything Tailwind is legal here — `:has()`, `**:[svg]`, `peer-*`, descendant and sibling combinators, arbitrary selectors and values. There is no whitelist ceiling and no portability constraint on the authored CSS; the `**:[svg]` icon-sizing sugar and the `pending:` descendant-hide are shipped as-authored, not re-homed. With a single engine there is no selectorless target to force normalization, so the authored strings *are* the output.

Alongside it, the contributor declares Button's component-contract tokens once, terse — `defineContract('button-like', { radius: scalar(...), variants: { default: surface({...}), primary: surface({...}) }, disabled: surface({...}) })`. `surface()` expands to the `btn-bg-primary` / `btn-fg-primary` (with a structural `pairsWith` edge) / hover / active / line siblings. ToggleButton declares `owner: 'button-like'` and shares every node — the sync group is one set of nodes, so a Button style change *is* a ToggleButton change, landed together.

**2. Lint the authored source.** Two lints run over the strings. The **hardcoded-value** lint warns on a design-meaningful literal where a token exists (`bg-[#635bff]` → hint `bg-primary`) and stays silent on mechanics (`p-0`, `top-1/2`). It is a warning a contributor can justify, not a gate. The **id-permanence** and import-boundary lints run in the same pass. The `[--color-disabled:var(--neutral-500)]` var-write is captured as a `declaredVar`, never stripped. See [Testing & invariants](13-testing.md).

**3. Resolve.** `pnpm build:registry` runs the style compiler: extract + evaluate pure helpers (fragment sharing between Button and ToggleButton falls out and inlines), resolve `params` named-style deltas against defaults into a concrete `tv()` config, fold density into the selected tier (or a `data-density` axis), resolve scalar / component vars per axis, and carry declared var-writes through verbatim. Named styles resolve to complete configs. The result is `ResolvedComponentStyles` — the shipped `tv()` shape, not a JSON IR:

```ts
{
  component: "button",
  syncGroup: "button-like",
  tv: {
    base: "group/button relative inline-flex shrink-0 … rounded-(--btn-radius) …",
    variants: {
      variant: {
        default: "border bg-neutral text-fg-on-neutral hover:bg-neutral-hover pressed:bg-neutral-active",
        primary: "bg-primary text-fg-on-primary [--color-disabled:var(--neutral-500)] hover:bg-primary-hover pressed:bg-primary-active",
        // …
      },
      size: { md: "h-8 px-2.5 gap-1.5 **:[svg]:size-3.5" /* density folded */ },
      isIconOnly: { true: "p-0" },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
  componentVars: [{ name: "--btn-radius", type: "radius", default: { token: "radius.md" }, param: "radius" }],
  declaredVars: [{ name: "--color-disabled", value: { token: "neutral.500" }, when: { variant: "primary" } }],
}
```

**4. Resolution self-check.** The compiler proves resolution loses nothing: the no-strip test asserts the shipped `tv()` contains every declared var-write and scalar the source referenced (the guard on the old `menu.highlight` bug). Resolve determinism asserts `resolve` is pure — identical `(manifest, dsdoc)` → byte-identical `ResolvedSystem`, and the worker's incremental edits converge to the same state as a cold resolve. There is no cross-engine matrix to render and diff — with one engine, the class strings the emitter ships *are* the class strings the preview shows.

**5. Snapshot the manifest.** The resolved styles, the generated component-contract nodes (merged into the baseline Token Graph), the axis declarations, and the codeStyle option declarations are assembled into a new **Registry Manifest** snapshot — content-addressed, immutable, published to `/r/manifest/<version>`. This snapshot is now a permanent handle: every dsdoc authored against it resolves identically forever. Contributor workflow in full: [Contributing](14-contributing.md).

```mermaid
flowchart LR
  A["styles.ts<br/>+ defineContract()"] -->|hardcoded-value + id lints| B{"lints<br/>clean?"}
  B -->|warnings to justify| A
  B -->|yes| C["resolve params · density · vars"]
  C --> D["ResolvedComponentStyles<br/>(concrete tv() config)"]
  D --> E{"no-strip +<br/>resolve-determinism +<br/>contrast verify"}
  E -->|fail| A
  E -->|pass| F["Registry Manifest snapshot<br/>(immutable, /r/manifest/v)"]
```

---

## 4. Narrative B — a user builds a system at /create

A user lands on `/create` and forks the default document. Four edits, all previewing live.

**Open the doc.** The builder loads the default dsdoc, calls `resolve(manifest, dsdoc)` once in the Style Worker to produce a `ResolvedSystem`, then `compile(resolved, {kind:'preview'})` to produce the initial `PreviewOutput` (three CSS strings). The DesignScope adopts them; the showcase mounts the real `base.tsx` files. Cold start is instant: the default document's `PreviewOutput` is baked at build time and byte-equals a fresh server compile (a CI invariant), so there is no unstyled frame. There is no cold-start engine question here — the preview executes Tailwind, the only engine, with no proxy or precomputed-atomic-layer machinery to warm up. The generated panel walks `manifest.axes ⊕ doc.axes` and renders one control per kind — no per-axis React was written.

**Drag a hue.** The user drags the accent seed. This is a **value-tier** command — the axis targets a producer seed. The trace:

```
pointermove (120Hz) → rAF-coalesced → postMessage {producer.setSeed} (~200 bytes)   <0.2ms main
  Style Worker: run oklch producer for the ONE accent ramp, per cell (~11 steps)    1–4ms OFF-main
  ← VarOp[] (~22 entries: --accent-50…950, --on-accent-*)
main: root.style.setProperty(k,v) ×22                                               <0.3ms
browser: var-only invalidation (flat static sheets, no re-match) + paint            ~8ms
                                              main-thread total ≈ 12ms < 16.6ms
```

Zero React renders, zero sheet swaps, one pending value-edit per key as backpressure. Every `bg-primary`, every menu highlight, every accent-referencing custom style repaints through `var()` re-substitution because the token indirection was preserved — never resolved to a literal in the shipped config.

**Pick a named style.** The user opens the Button family editor and sets `button.fill = solid` (or a curated named style). This is a **structural-tier** command — it changes which classes apply. The worker re-resolves *only the Button group's* config (the named-style delta resolves to a complete `tv()` config), swaps the live style module's class map, and `replaceSync`s the affected sheet. Because Button and ToggleButton share one config via `owner: 'button-like'`, the fan-out applies to both simultaneously — the family view shows them in sync. If the user later wants ToggleButton square while Button stays rounded, they **detach** that one axis: the validator permits a component-scoped selection only when a matching `detached` record exists, so divergence is representable *only when declared*.

**Add a dim mode.** The user adds a `dim` option to the `scheme` dimension. This is a **global-tier** command — it changes the mode cube. The worker re-runs the token producers for the new cells (`dim·normal`, `dim·hc`), re-emits `themeSheet` with new cell-gated blocks, and `replaceSync`s it (~15ms, one click). Verification walks the new cells; if `btn-fg-default ↔ btn-bg-default` fails APCA in `dim·hc`, the verifier *proposes* a cell-scoped graph edit (append an override key to that failing cell only) — propose, don't impose. The user accepts; only that one cell changes. Switching the preview to show `dim` is then a value-tier `setAttribute` on the scope root — instant, zero recompute.

Throughout, the persisted artifact is always the canonical dsdoc. The op-log is the in-session editing substrate; each command is invertible (undo/redo is O(1), a drag coalesces to one entry). An anonymous user's system travels as a `#doc=` fragment URL; on overflow it falls back to a server short-link or a `.dotui.json` download. Full walkthrough: [The builder](10-builder.md).

```mermaid
sequenceDiagram
  participant U as User
  participant P as Panel (generated)
  participant S as DocStore (op-log)
  participant W as Style Worker
  participant D as DesignScope
  U->>P: drag accent hue
  P->>S: Command{producer.setSeed}
  S->>W: classify → value tier (tiny edit)
  W->>W: run oklch producer, accent ramp × cells
  W-->>D: VarOp[] (~22 setProperty)
  D-->>U: repaint, ~12ms, zero React renders
  U->>P: button.fill = solid
  P->>S: Command{component.setParam}
  S->>W: classify → structural tier
  W->>W: re-resolve Button group config (fan-out to ToggleButton)
  W-->>D: swap live style module + runtimeVarsSheet
  U->>P: add scheme option "dim"
  P->>S: Command{dimension.addOption}
  S->>W: classify → global tier
  W->>W: producers × new cells + verify (propose fix)
  W-->>D: replaceSync themeSheet
```

---

## 5. Narrative C — export to Tailwind, then update a year later

The user is done. They export the dsdoc to their codebase, then update a year later.

**Export to a Tailwind project via the shadcn CLI.** The user runs `npx shadcn init https://dotui.org/r/init?doc=<id>`. The server route calls the *identical* `compile(resolve(manifest, dsdoc), {kind:'export', codeStyle})`. The `tv()` emitter serializes `ResolvedComponentStyles` into an idiomatic `tv()` config — byte-comparable to a hand-authored file, including the `**:[svg]:size-3.5` icon rule and the `has-data-icon-end:pr-2` relation carried straight through from the source. `codeStyle` AST transforms apply the user's taste (arrow vs declaration, one-line-per-variant, comment density) as passes over the emitted `tv()` structure — section boundaries come from the `tv()` shape (base / slots / variants / compounds), never from `// MARK:` regex. The token graph emits to `theme.css` — every cell, every added token. **Flatten-on-export** means a contract node still pointing at its default target emits the idiomatic semantic utility (`bg-primary`); only retargeted nodes emit the var form. The class strings in `button.tsx` are character-for-character what the preview DOM showed. `init` writes `dotui.lock.json` into the repo — doc id/version, manifest pin, `codeStyle`, and a pristine content hash per file.

Because the exported file *is* the resolved `tv()` — no compiler sits between the source and what ships — the shadcn-diff workflow is a literal string diff: a contributor comparing dotUI's Button against shadcn's is comparing two `tv()` files directly, with nothing to translate in between.

**Update a year later.** The user runs `npx dotui update`. The CLI runs a pure `plan(lock, doc, manifest)`. First it upgrades the lock through `reconcile` against the newer manifest, surfacing a reviewable changes list ("Sousse renamed to Tunis — no action"; "new axis `hover-effect` available"). Then, per file: a file whose current hash matches the pristine hash in the lock is overwritten cleanly with the user's `codeStyle`; a file the user hand-edited gets a 3-way merge against the pristine baseline with conflict markers (optionally AI-assisted). `--dry-run` is trustworthy because `plan` is pure. Nothing clobbers; nothing silently drifts — the two-year-old dsdoc opens against its frozen manifest and exports the system it always described. Full distribution surface — v0, Bolt, Lovable, zip, DTCG/Figma, MCP — in [Distribution](12-distribution.md).

```mermaid
flowchart TB
  DOC["dsdoc + lock (pinned manifest)"] --> R["resolve(manifest, dsdoc)"]
  R --> RS["ResolvedSystem"]
  RS --> CT["compile(export, codeStyle)"]
  CT --> TW["button.tsx (tv()) + theme.css<br/>+ dotui.lock.json (pristine hashes)"]
  TW -->|npx dotui update, 1 year later| PLAN["plan(lock, doc, newManifest)"]
  PLAN --> RC["reconcile → reviewable diff"]
  PLAN --> OV["pristine match → clean overwrite"]
  PLAN --> MG["edited → 3-way merge"]
```

---

## 6. The core invariants and where each is enforced

The architecture rests on a handful of invariants. Each has a single, named enforcement site — the whole point is that fidelity is *structural*, proven once, not re-checked ad hoc.

| Invariant | Statement | Enforced by / where |
|---|---|---|
| **preview == export** | The class string on a preview DOM node is byte-identical to the class string in the exported file. | One `compile()` in `@dotui/compiler`, run in the worker and the `/r/*` routes. Not a test — a shared code path. Guarded by the cold-start byte-compare (baked default `PreviewOutput` byte-equals a fresh server compile) and the live-variants conformance test. |
| **live-variants conformance** | `createLiveVariants(resolved)(props) === tv(emit(resolved))(props)`, plus a computed-style sample diff. | Property test + sample diff in `@dotui/runtime`. With no IR and no cross-engine gate, this shim is the **only** place preview and export code differ — it is the single load-bearing fidelity seam. |
| **resolution completeness** | The shipped output contains every declared var-write and scalar the source referenced (no strip step). | The no-strip test in `@dotui/style`; named-style `vars` resolve into `declaredVars` and ship verbatim. Guards the old `menu.highlight` bug (decision **N2**). |
| **token edge rules** | primitive→primitive only; semantic→{primitive,semantic}; component→{semantic,component}; component decls reference contract or semantic nodes, never primitives. | `applyEdit` in `@dotui/tokens` rejects any layer violation at edit time; a rejected edit never mutates state, so the preview never sees an inconsistent graph. Registry lints enforce it on `styles.ts`. |
| **pinned manifest** | An omitted value in a dsdoc means "the pinned manifest's default," never "today's code." | The `lock` + canonical form in `@dotui/schema`; `resolve()` reads defaults from the frozen snapshot. Lock upgrades go through `reconcile()` with a reviewable diff. |
| **cascade ≡ resolution** | The emitted CSS cascade reproduces the graph's cell resolution exactly. | Property tests over random graphs/cubes; paired media+attr selectors ordered by ascending specificity. |
| **id permanence** | Every node/axis/value id is a permanent handle; labels rename freely, references use ids. | Registry `id-permanence` lint; renamed emissions ship a deprecation alias for one major version. |
| **sync integrity** | A component-scoped selection of a synced axis exists iff a matching `detach` record exists. | The dsdoc validator in `@dotui/schema`. |
| **codeStyle is AST-equivalent** | Every codeStyle transform is AST-equivalent modulo formatting. | CI invariant over emitter output; transforms are AST passes over the `tv()` structure, never regex or `// MARK:` anchors. |

The dependency is layered: `preview == export` rests on the compiler being pure and isomorphic; that in turn rests on the **live-variants conformance** seam (so the one place they differ stays honest), on `token edge rules` (so resolution is deterministic), and on `pinned manifest` (so `resolve` has stable defaults). The testing chapter catalogs the full suite: [Testing & invariants](13-testing.md).

---

## 7. Why this shape

A few shape-level choices are best understood by contrast — the honest alternatives are argued in full in the [Decision log](00-decision-log.md).

**Why resolve `styles.ts` instead of lifting it into an IR?** With a single engine, an engine-neutral intermediate has no second consumer; its only independent benefits — stable-id targeting, engine-neutral deltas — do not repay a full lift/normalize compiler plus a JSON round-trip. So the publisher-successor *resolves* the authored strings (params, density, named-style deltas, scalar vars, declared var-writes) into the shipped `tv()`. Contributors author Tailwind; the shipped `base.tsx` *is* the resolved `tv()`; arbitrary Tailwind (`:has()`, `peer-*`, descendant) is first-class rather than something a normalizer must re-home.

**Why not one flat mode list?** High-contrast and brand sub-themes must compose with *every* scheme. A list forces `brand-light`, `brand-dark`, `brand-dark-hc`… by hand. Dimensions give `dark·hc` and `acme·dark` for free from independent deltas, and the verifier proves the composition per cell.

**Why not an iframe preview?** The realm boundary is the root cause of the perf cliff — structured-clone defeats identity caches, so every slider tick re-runs the kernel. Scoped-inline `DesignScope` (proven by today's docs `scoped` mode) shares the store and context, so a hue drag is var-only. Iframes are kept exactly where isolation is genuinely wanted: device-width frames and third-party embeds.

**Why pin an immutable manifest instead of diffing against live defaults?** Diffing against live defaults is the documented longevity bug: a renamed default silently reinterprets every stored system, and a decode failure silently discards it. An immutable, content-addressed snapshot makes an omitted value unambiguous and makes a two-year-old link resolve to exactly what it meant.

### Tradeoffs this architecture accepts

- **A compiler defect blasts wide.** One pure `compile()` and one resolver serve preview, every export target, and docs. A bug in the token resolver or the emitter corrupts every consumer at once — a larger blast radius than a mis-authored class string. The mitigation is the invariant suite (§6): property tests over random graphs, live-variants conformance, cold-start byte-compare, cascade ≡ resolution. The bet is that a small, heavily-tested pure core is safer than hand-synced output.
- **Stable-id targeting is given up.** With no IR, codeStyle transforms and override/diff handles key off the `tv()` structure (base / slot / variant / compound) plus named-style ids, not a set of stable rule-ids. That is a real loss the two-engine variant paid an entire lift+whitelist apparatus to keep; here it does not repay its cost.
- **Immutable manifests are a permanent storage liability.** "Published means permanent" means dotUI can never delete a snapshot a document might pin, and must serve `/r/manifest/<v>` for arbitrarily old versions. Accepted with a hot-serve window plus a cold-storage tier.
- **The builder client carries real payload.** Registry data (~200KB gz) plus the static Tailwind utility layer (~40KB) plus lazy WASM Tailwind for novel classes ship per session, and the client must stay version-locked with the server compiler (a content-hash handshake closes the skew). Accepted for the fidelity guarantee.
- **3-way merge on hand-edited files is genuinely hard.** Formatter divergence can produce noisy conflicts. The pristine-hash baseline makes untouched files clean; edited files fall to conflict markers or optional AI-assisted merge. The mechanism is sound; the experience on formatter-divergent files is the residual risk.

---

## 8. Reading order from here

- Build vs. run mental model: [The compiler](11-compiler.md) is the precise definition of `resolve` and `compile`; read it right after this chapter.
- The three authoring surfaces: [The registry](03-registry.md) (item anatomy), [Styles](04-styles.md) (resolve-not-lift and the `tv()` emitter), [The Dimensional Token Graph](05-tokens.md) (tokens, modes, producers, contrast).
- The configuration surface: [The axis system](06-axes.md) and [Density & sizing](08-density-sizing.md).
- The document and the app: [The dsdoc](09-dsdoc.md) and [The builder](10-builder.md).
- Proof and process: [Proof by reconstruction](07-reconstructions.md) (Material 3, Geist, Linear, enterprise, shadcn), [Distribution](12-distribution.md), [Testing & invariants](13-testing.md), [Contributing](14-contributing.md), and the [Decision log](00-decision-log.md).

The through-line to carry into all of them: **two artifacts (dsdoc, Registry Manifest), two pure functions (resolve, compile), one execution guarantee (worker == server).** Everything else is detail hung on that frame.
