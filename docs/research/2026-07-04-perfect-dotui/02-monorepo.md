# Monorepo & package architecture
> Part of [The Perfect dotUI](README.md) — an end-state architecture study (2026-07-04). Constitution-conformant.

The perfect dotUI is a single pnpm workspace of seven engine-neutral packages plus one application. The engine lives in the packages; the application is a thin shell that imports it. Every guarantee the product makes — preview equals export, one design system in many packagings, docs that open two years from now — rests on one structural fact: **the design engine has no idea a web app exists.** `resolve()` and `compile()` are pure functions over data. The registry is data. The application calls them and serves the result.

This chapter fixes the layout, the public API surface of every package, the dependency graph (a DAG, enforced), the boundary rules and how CI enforces them, the build pipeline, and the exact mapping from every location in the pre-perfect repo to its home here.

---

## 1. The layout

```
dotui/
├── apps/
│   └── web/                        # dotui.org — builder (/create), docs, /r/* registry, /api/*, MCP server
├── packages/
│   ├── schema/                     # @dotui/schema
│   ├── tokens/                     # @dotui/tokens
│   ├── style/                      # @dotui/style
│   ├── compiler/                   # @dotui/compiler
│   ├── registry/                   # @dotui/registry   ← THE product source
│   ├── runtime/                    # @dotui/runtime
│   └── cli/                        # dotui             ← the published CLI binary
├── tooling/
│   ├── ts-config/                  # @dotui/ts-config — shared tsconfig bases
│   └── eslint-config/              # @dotui/eslint-config — the boundary lint rules
├── docs/                           # repo docs (this study lives here) — not the site
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

`pnpm-workspace.yaml` globs `apps/*`, `packages/*`, and `tooling/*`. There is exactly one application. Everything a user's design system is made of — components, their styles, the token vocabulary, the axes, the resolver, the emitters — lives under `packages/` and ships to npm (or would; several are `private` and consumed only by `apps/web`, but they are structured as if published, which is what keeps the boundaries honest).

The naming is deliberate. The application is `apps/web`, not `www` — it is one app among a family that could grow (a Figma plugin host, a desktop CLI companion) without renaming the first one. The seven packages are each one concern, each a noun a contributor can hold in their head.

### The complete file tree

The whole workspace, expanded. The one shape to internalize: every `packages/registry/ui/<c>/` item folder is the same eight files plus `demos/` — `button/` is shown in full; the other ~72 components are identical in structure. `manifest/` sits *beside* `registry/src/`, never inside it (committed artifact, not source); tests live *with* the package they prove.

```
dotui/
├── apps/
│   └── web/                                  # dotui.org — the only application; a thin shell over the packages
│       ├── src/
│       │   ├── routes/                        # TanStack Start file routes
│       │   │   ├── __root.tsx
│       │   │   ├── index.tsx                  # marketing home
│       │   │   ├── create.tsx                 # the builder route
│       │   │   ├── r/                          # registry endpoints — call compile()
│       │   │   │   ├── manifest.$version.ts
│       │   │   │   ├── registry.$name.ts
│       │   │   │   ├── init.ts
│       │   │   │   ├── styles.$name.ts
│       │   │   │   └── bundle.$target.ts       # v0 / Bolt / Lovable
│       │   │   ├── api/
│       │   │   │   ├── share.ts
│       │   │   │   ├── compile.ts
│       │   │   │   └── og.tsx
│       │   │   ├── llms.txt.ts
│       │   │   └── sitemap.xml.ts
│       │   ├── builder/                        # the /create UI — five regions
│       │   │   ├── Builder.tsx
│       │   │   ├── TopBar.tsx
│       │   │   ├── Panel/                       # generated from AxisDecl[]
│       │   │   │   ├── Panel.tsx
│       │   │   │   ├── AxisControl.tsx
│       │   │   │   ├── ColorSection.tsx
│       │   │   │   └── ComponentsSection.tsx
│       │   │   ├── Stage/
│       │   │   │   ├── Stage.tsx
│       │   │   │   ├── ViewSwitcher.tsx
│       │   │   │   └── DeviceFrame.tsx
│       │   │   ├── Inspector/
│       │   │   │   ├── Inspector.tsx
│       │   │   │   └── ContrastReadout.tsx
│       │   │   ├── AiDock/
│       │   │   │   ├── AiDock.tsx
│       │   │   │   └── importScreenshot.ts      # → { commands, unmapped }
│       │   │   ├── state/                       # op-log · Command dispatch
│       │   │   │   ├── store.ts
│       │   │   │   ├── commands.ts
│       │   │   │   ├── opLog.ts
│       │   │   │   └── useDoc.ts
│       │   │   └── export/
│       │   │       ├── ExportDialog.tsx
│       │   │       └── CodeStyleTab.tsx
│       │   ├── docs/                            # fumadocs content + components
│       │   ├── mcp/                             # agent-native access
│       │   │   ├── server.ts
│       │   │   └── tools.ts                     # compose · edit · export
│       │   ├── render-harness/                  # DOM seam for parity + golden-dsdoc tests
│       │   │   └── renderMatrix.tsx
│       │   ├── fixtures/
│       │   │   └── default-preview.json         # cold-start PreviewOutput
│       │   ├── router.tsx
│       │   ├── routeTree.gen.ts                 # generated
│       │   └── styles.css
│       ├── tests/
│       │   ├── parity.test.ts                   # tw = stylex = preview
│       │   ├── golden-dsdocs.test.ts
│       │   └── cold-start.test.ts
│       ├── app.config.ts
│       ├── vite.config.ts
│       ├── package.json
│       └── tsconfig.json
├── packages/                                  # the engine — publishable, app-unaware
│   ├── schema/                                # @dotui/schema — taproot · zod only
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── dsdoc.ts
│   │   │   ├── manifest.ts
│   │   │   ├── axis.ts
│   │   │   ├── code-style.ts
│   │   │   ├── lock.ts
│   │   │   ├── validate.ts
│   │   │   ├── canonicalize.ts                 # sorted keys → content hash
│   │   │   ├── reconcile.ts
│   │   │   ├── migrate/
│   │   │   │   ├── index.ts
│   │   │   │   └── ladder.ts                    # the frozen migration ladder
│   │   │   └── json-schema/
│   │   │       ├── dsdoc.schema.json
│   │   │       └── manifest.schema.json
│   │   ├── tests/
│   │   │   ├── migrate.test.ts
│   │   │   └── migration-corpus/*.dsdoc.json
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── tokens/                                # @dotui/tokens — Dimensional Token Graph · subsumes @dotui/colors
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── graph.ts
│   │   │   ├── resolve-graph.ts
│   │   │   ├── merge-overlay.ts
│   │   │   ├── apply-edit.ts                    # edge-rule invariants
│   │   │   ├── contract.ts                      # defineContract · surface · scalar
│   │   │   ├── semantics.ts                     # 76-token baseline vocabulary
│   │   │   ├── producers/                       # open registry
│   │   │   │   ├── index.ts
│   │   │   │   ├── oklch.ts
│   │   │   │   ├── tailwind.ts
│   │   │   │   ├── contrast.ts
│   │   │   │   ├── material.ts
│   │   │   │   └── fixed.ts
│   │   │   ├── verify/
│   │   │   │   ├── index.ts
│   │   │   │   ├── wcag2.ts
│   │   │   │   ├── apca.ts
│   │   │   │   └── nudge.ts
│   │   │   └── emit/
│   │   │       ├── css.ts
│   │   │       ├── stylex.ts
│   │   │       └── dtcg.ts
│   │   ├── tests/
│   │   │   ├── cascade-resolution.test.ts
│   │   │   └── contrast-matrix.test.ts
│   │   ├── package.json                         # sideEffects:false
│   │   └── tsconfig.json
│   ├── style/                                 # @dotui/style — Style Contract · lift · two emitters
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── contract.ts                      # StyleContract types
│   │   │   ├── lint.ts                          # dotui/style-subset = lift dry-run
│   │   │   ├── lift.ts
│   │   │   ├── normalize.ts                     # owned-slot re-homing
│   │   │   ├── subset/
│   │   │   │   ├── prop-keys.ts                 # closed PropKey catalog
│   │   │   │   └── state-vocab.ts               # dual-bound states
│   │   │   ├── emitters/
│   │   │   │   ├── tailwind.ts                  # tv()
│   │   │   │   └── stylex.ts                    # stylex.create
│   │   │   └── authoring/
│   │   │       ├── define-component-styles.ts
│   │   │       └── sizes.ts                     # density × size table
│   │   ├── tests/
│   │   │   ├── catalog-completeness.test.ts
│   │   │   └── round-trip.test.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── compiler/                              # @dotui/compiler — resolve() + compile()
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── resolve.ts
│   │   │   ├── compile.ts
│   │   │   ├── resolved-system.ts
│   │   │   ├── targets/
│   │   │   │   ├── preview.ts
│   │   │   │   ├── export.ts
│   │   │   │   ├── tokens.ts
│   │   │   │   └── static-embed.ts
│   │   │   └── code-style/
│   │   │       └── apply-ast.ts                 # codeStyle AST transforms
│   │   ├── tests/
│   │   │   └── code-style-equivalence.test.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── registry/                              # @dotui/registry — THE product source
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── build-manifest.ts               # lifts source → RegistryManifest
│   │   │   ├── sync-groups.ts
│   │   │   ├── axes/                            # system-level AxisDecls
│   │   │   │   ├── color.ts
│   │   │   │   ├── typography.ts
│   │   │   │   ├── shape.ts
│   │   │   │   ├── elevation.ts
│   │   │   │   └── overlays.ts                  # translucent fan-out
│   │   │   ├── icons/
│   │   │   │   ├── index.ts
│   │   │   │   └── map.ts                       # cross-library import table
│   │   │   ├── lib/
│   │   │   │   ├── cn.ts
│   │   │   │   └── focus-styles.ts
│   │   │   ├── hooks/
│   │   │   │   ├── use-media-query.ts
│   │   │   │   └── use-controlled-state.ts
│   │   │   ├── base/                            # style/base init payload
│   │   │   │   ├── base.css
│   │   │   │   └── init.ts
│   │   │   └── ui/                              # ~72 items — every one this same shape
│   │   │       ├── button/
│   │   │       │   ├── base.tsx                 # RAC behavior + slots
│   │   │       │   ├── styles.ts                # Tailwind strings · sizes()
│   │   │       │   ├── contract.ts              # surface() · scalar()
│   │   │       │   ├── axes.ts                  # button.fill · hoverEffect
│   │   │       │   ├── meta.ts
│   │   │       │   ├── types.ts                 # → API reference
│   │   │       │   ├── index.tsx               # site wrapper — never shipped
│   │   │       │   ├── examples.tsx
│   │   │       │   └── demos/
│   │   │       │       ├── default.tsx
│   │   │       │       └── variants.tsx
│   │   │       ├── toggle-button/               # synced with button — identical shape
│   │   │       ├── menu/  listbox/  select/  combobox/  dialog/  popover/
│   │   │       ├── tooltip/  calendar/  date-picker/  table/  tabs/
│   │   │       ├── color-picker/  checkbox/  …
│   │   │       └── (…~58 more — each the same 8 files + demos/)
│   │   ├── manifest/                            # committed build artifact — src never imports it
│   │   │   ├── 2028.03.01-a3f.json              # immutable, content-addressed
│   │   │   └── latest.json
│   │   ├── tests/
│   │   │   └── lints.corpus.test.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── runtime/                               # @dotui/runtime — live-preview substrate
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── design-scope.tsx                 # scoped-inline provider
│   │   │   ├── create-live-variants.ts          # live twin of tv()
│   │   │   ├── adopted-sheets.ts
│   │   │   └── worker/
│   │   │       ├── client.ts
│   │   │       ├── worker.ts                    # runs resolve/compile
│   │   │       └── protocol.ts                  # VarOp · StyleTree · sheets
│   │   ├── tests/
│   │   │   └── live-variants-conformance.test.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── cli/                                   # dotui — the published binary · schema + HTTP only
│       ├── src/
│       │   ├── bin.ts
│       │   ├── init.ts
│       │   ├── add.ts
│       │   ├── update.ts
│       │   ├── plan.ts                          # clean · 3-way merge
│       │   ├── lock.ts                          # dotui.lock.json
│       │   └── http.ts
│       ├── tests/
│       │   └── plan.test.ts
│       ├── package.json                         # bin: dotui
│       └── tsconfig.json
├── tooling/
│   ├── ts-config/                             # @dotui/ts-config
│   │   ├── base.json
│   │   └── package.json
│   └── eslint-config/                         # @dotui/eslint-config — the dotui/* boundary lints
│       ├── src/rules/
│       │   ├── style-subset.ts
│       │   ├── import-boundaries.ts
│       │   ├── id-permanence.ts
│       │   ├── contract-integrity.ts
│       │   └── owned-slot.ts
│       └── package.json
├── docs/                                      # repo docs (this study) — not the site
│   └── research/
├── .dependency-cruiser.jsonc                  # the DAG, enforced
├── .oxlintrc.json
├── pnpm-workspace.yaml                        # apps/* · packages/* · tooling/*
├── turbo.json
├── package.json
└── tsconfig.json
```

---

## 2. The seven packages

Each subsection gives the package's job, its **public API surface** (the exports a sibling actually imports — signatures, not prose), and its dependencies. Types cited here are defined in full in their owning chapters; this chapter fixes *where they live and who exports them*.

### `@dotui/schema` — the shapes and the ladder

The vocabulary of documents. Every type that crosses a package boundary as serialized JSON is defined here: the **dsdoc**, the **Registry Manifest**, `AxisDecl`, `CodeStyle`, `RegistryLock`. Schema owns the JSON Schemas, the canonical-form serializer, the `validate()` gate, and the **migration ladder** — the frozen, versioned functions that carry a `dsdoc: 1` document forward one schema major at a time.

```ts
// @dotui/schema
export interface Dsdoc {
  $schema: string
  dsdoc: 1                       // schema major — drives the migration ladder
  meta: DsdocMeta                // id (ULID), name, slug, version, owner, forkedFrom?, timestamps, license
  lock: RegistryLock             // { registry, manifest, manifestHash, components? }
  engine: 'tailwind' | 'stylex'
  tokens: TokenGraphOverlay      // added/changed dimensions, ramps, nodes over the pinned baseline
  axes?: Record<AxisId, AxisDecl>              // user-declared axes (overlay over manifest axes)
  components?: Record<ComponentId, ComponentDelta>   // lifted Style-Contract deltas, NOT class strings
  syncGroups?: Record<string, SyncGroupState>
  presets?: Record<string, SelectionPatch>
  selections: Selections
  codeStyle: CodeStyle
}

export interface RegistryManifest {
  manifest: string               // '2028.03.01-a3f' — content-addressed, immutable
  manifestHash: string
  registry: string               // 'dotui.org'
  components: ManifestComponent[]                  // roster: id, group, syncGroup, axes
  tokens: TokenGraph             // the baseline Dimensional Token Graph
  axes: Record<AxisId, AxisDecl> // every baseline axis, keyed by id
  syncGroups: SyncGroupDecl[]
  contracts: Record<SyncGroupId, ContractNodes>    // per-sync-group component-contract nodes + pairsWith edges
  styleLayers: Record<SyncGroupId, StyleContract>  // lifted Style Contracts, engine-neutral — the committed IR
  codeStyle: CodeStyleDecl[]     // the codeStyle option declarations
  icons: IconMap                 // cross-library import maps
}

export const CURRENT_DSDOC_VERSION = 1

export function validate(doc: unknown): Result<Dsdoc, ValidationError[]>
export function canonicalize(doc: Dsdoc): string          // sorted keys, defaults omitted, → content hash
export function hash(doc: Dsdoc): string                  // identity of a version
export function migrate(doc: unknown): Dsdoc              // runs the ladder to CURRENT_DSDOC_VERSION
export function reconcile(doc: Dsdoc, next: RegistryManifest): ReconcileReport   // deprecation diff
```

`@dotui/schema` depends on nothing but `zod` (and its own generated JSON Schemas). It is the taproot: every other package imports its types, and it imports none of theirs. This is what makes the ladder trustworthy — a migration function can only touch shapes schema itself defines, so a schema-major bump is a self-contained, fixture-tested unit.

### `@dotui/tokens` — the Dimensional Token Graph

The token model and its machinery. Three layers as edge rules (primitive → semantic → component-contract), **mode dimensions × cells**, pluggable **producers**, verification, and the serializers to CSS custom properties / StyleX vars / DTCG. `@dotui/colors` is subsumed here — the OKLCH/Tailwind/contrast/material producers plus the WCAG2/APCA verify pass are this package's kernel.

```ts
// @dotui/tokens
export interface TokenGraph {
  nodes: Record<TokenId, TokenNode>          // permanent readable ids: 'color-primary', 'btn-bg-primary'
  dimensions: Record<DimensionId, ModeDimension>
  ramps: Record<RampId, RampSpec>
}
export interface ModeDimension {
  id: string
  options: string[]
  defaultOption: string
  binding: 'media' | 'class' | 'data'
}
export interface RampSpec {
  steps: string[]                             // 50..950 | 1..12 | Material tones — per ramp
  producer: { id: string; config: Record<CellKey, ProducerConfig> }
}

export interface Producer {                    // the open producer registry entry
  id: string
  produce(spec: RampSpec, cell: CellKey, ctx: ProduceCtx): OklchRamp
}
export const producers: Record<string, Producer>   // 'oklch'(default) | 'tailwind' | 'contrast' | 'material' | 'fixed' | …
export function registerProducer(p: Producer): void

export function resolveGraph(graph: TokenGraph): ResolvedGraph         // symbolic per-cell values, ramps materialized+cached
export function mergeOverlay(base: TokenGraph, overlay: TokenGraphOverlay): TokenGraph
export function applyEdit(graph: TokenGraph, edit: GraphEdit): TokenGraph   // invariant-checked

// component-contract authoring (consumed by the registry's manifest build):
export function defineContract(owner: SyncGroupId, spec: ContractSpec): ContractNodes
export function surface(spec: SurfaceSpec): SurfaceDecl    // mints bg/fg/hover/active siblings + the pairsWith edge
export function scalar(spec: ScalarSpec): ScalarDecl       // one component var: typed default, optional axis link

export function verify(graph: ResolvedGraph, level: 'report' | 'autofix' | 'strict'): VerifyReport
// pairings from contract pairsWith + on-values + declared pairs; WCAG2+APCA; hc cells higher targets;
// autofix = PROPOSED cell-scoped GraphEdits, never silent output correction

export const emit: {
  css(g: ResolvedGraph): string               // @theme + :root + per-cell delta blocks, paired selectors
  stylex(g: ResolvedGraph): string            // defineVars + createTheme per option delta
  dtcg(g: ResolvedGraph): DtcgDocument        // dimension→collection, option→mode, id in $extensions.dotui.id
}
export function fromDtcg(doc: DtcgDocument): TokenGraphOverlay
```

Depends on `@dotui/schema` (for `TokenGraphOverlay`, `CellKey`, shared ids) and the color-math libraries (`colorjs.io`, `@material/material-color-utilities`). Nothing about a component or a stylesheet leaks in — tokens produce *values*, addressed by *ids*, keyed by *cells*. What consumes those values is not tokens' concern.

### `@dotui/style` — the Style Contract and two emitters

The style engine, minus resolution. Style owns: the **utility-subset lint** (`dotui/style-subset`, which *is* the lowering pass in dry-run mode), the **lift/normalize** pass (Tailwind utility strings → `StyleContract`), the Contract schema and its migrations, the `EngineEmitter` interface, and the two concrete emitters (Tailwind `tv()` and StyleX `stylex.create`).

```ts
// @dotui/style
export interface StyleContract {
  ir: 1
  component: string                             // 'button'
  syncGroup?: string                            // one Contract per sync group — Button ⇄ ToggleButton share it
  slots: SlotMeta[]
  dimensions: Dimension[]                       // variant | size | boolean | density (role: 'density')
  states: StateDecl[]                           // dual-bound: one vocabulary, a Tailwind AND a StyleX binding
  rules: Rule[]                                 // owned-slot invariant holds
  componentVars?: ComponentVarDecl[]            // --btn-radius etc: typed default, optional axis link
  declaredVars?: DeclaredVar[]                  // menu.highlight var-writes, exported in both engines
}
export interface Rule { slot: string; when: { dims?: Record<string, string>; states?: string[] }; decls: Decl[] }
export interface Decl { prop: PropKey; value: TokenValue | 'unset' }
export type TokenValue =
  | { token: string }                           // 'radius.md' → var(--radius-md) in BOTH engines
  | { semantic: string }                        // 'primary-hover' — decls reference {componentVar}/{semantic}, NEVER a primitive
  | { componentVar: string }                    // '--btn-radius' — a component-contract node handle
  | { literal: string; type: TokenType }        // component mechanics only: hairlines, hit areas
  | { calc: string }
  | { mix: MixValue }                           // bg-inverse/10
export interface StateDecl {
  id: string
  kind: 'css-pseudo' | 'rac-render' | 'rac-data' | 'relation' | 'context' | 'media'
  tw: { variant: string }                       // how Tailwind selects it
  sx: StyleXStateBinding                        // pseudo | renderProp | attrSelector | runtimeBool | media
}

export function lint(source: string): LintDiagnostic[]                  // dotui/style-subset
export function lift(source: ComponentStyles): StyleContract            // Tailwind → Contract, normalized
export function normalize(c: StyleContract): StyleContract              // re-home cross-node sugar, dual-bind relations
export function migrateContract(c: unknown): StyleContract

export interface EngineEmitter {
  engine: 'tailwind' | 'stylex'
  emit(contract: ResolvedContract, codeStyle: CodeStyle): RegistryFile[]
}
export const emitters: Record<'tailwind' | 'stylex', EngineEmitter>

// authoring helpers, evaluated + inlined at lift time (fragment sharing):
export function defineComponentStyles<M, B>(meta: M, config: CreateStylesConfig<M, B>): ComponentStyles
export function sizes(table: DensitySizeTable): SizeDimension          // THE canonical density×size authoring form
```

Depends on `@dotui/schema` (`CodeStyle`, ids) and `@dotui/tokens` (a `TokenValue` references graph ids; the lift pass resolves `bg-primary` → `{ semantic: 'primary' }` against the token vocabulary). Style knows nothing about *how* a design system is chosen — it turns authored strings into an IR and turns a resolved IR into files. The catalog-completeness test lives here: both emitters must be total over the `PropKey × TokenValue × StateDecl` vocabulary, proven in this package's test suite.

> **Why `sizes()` is mandatory, not sugar.** The Button fixture hand-authors three full density layers — `compact`, `default`, `comfortable` — each a size ladder (`h-5 px-2 …` / `h-6 px-2 …` / `h-7 px-2.5 …`). Left as free-form `tv` overrides, those ladders drift, duplicate across sync-group members, and can't be diffed against shadcn's `style-mira`/`style-nova`/`style-vega` mapping. `sizes()` makes density × size one declared table the lint understands, the emitter can bake or ship as a `data-density` axis, and review can check for completeness. New components author geometry through `sizes()`; ad-hoc per-density ladders don't pass review.

### `@dotui/compiler` — resolve and compile

The two-stage pure pipeline. This is the package that runs byte-identically in a browser worker and on the server — the single fact from which *preview equals export* follows.

```ts
// @dotui/compiler
export function resolve(manifest: RegistryManifest, doc: Dsdoc): ResolvedSystem
export function compile(resolved: ResolvedSystem, target: CompileTarget): CompileOutput

export interface ResolvedSystem {
  cells: Record<CellKey, Record<TokenId, ResolvedValue>>   // symbolic per-cell token values
  contracts: Record<string, ResolvedContract>              // per-group resolved Style Contracts
  files: FilePick[]                                         // which base file per component (enum file-swap)
  codeStyle: CodeStyle
  engine: 'tailwind' | 'stylex'
}

export type CompileTarget =
  | { kind: 'preview'; engine: Engine; scope?: string }
  | { kind: 'export'; engine: Engine; codeStyle: CodeStyle }
  | { kind: 'tokens'; format: 'dtcg' }
  | { kind: 'static-embed'; view: PreviewView }

export type CompileOutput =
  | PreviewOutput                    // { themeCss, utilitiesCss, runtimeVarsCss }
  | RegistryFile[]                   // export
  | DtcgDocument                     // tokens
  | { html: string; css: string }    // static-embed
```

`resolve()` is: validate → migrate → token-graph merge (baseline ⊕ overlay) → ramp materialization (producer × cell, cached) → axis resolution (precedence + sync fan-out + detach) → per-group Contract resolution (named-style deltas → complete Contracts; user deltas applied; scalar/param bindings resolved) → `ResolvedSystem`. `compile()` dispatches on `target.kind`, using `@dotui/style`'s emitters for the two code targets and `@dotui/tokens`' emitters for CSS/StyleX/DTCG, then applies `codeStyle` as **AST transforms** over emitter output.

Compiler depends on `@dotui/schema`, `@dotui/tokens`, and `@dotui/style`. It does **not** depend on `@dotui/registry` — the manifest and dsdoc it receives are *data*, passed in by the caller. This inversion is the whole game: the compiler is a function of `(manifest, doc)`, and `apps/web` is responsible for having loaded the manifest (built from the registry) and the doc (from a URL fragment or the database). The compiler could resolve a manifest that describes components it has never seen the source of.

### `@dotui/registry` — the product source

The components and everything that describes them: React Aria `base.tsx` files, `styles.ts` (authored Tailwind utility strings via `defineComponentStyles`), the per-group `defineContract()`/`surface()`/`scalar()` declarations, the `AxisDecl`s each component contributes, sync-group membership, demos, the icon name-map, and the **manifest builder** that lifts all of it into a `RegistryManifest`.

```ts
// @dotui/registry
export const components: Record<string, ComponentSource>   // { base, styles, contract, axes, meta, demos, examples }
export const syncGroups: SyncGroupDecl[]                    // Button ⇄ ToggleButton, Menu ⇄ ListBox, …
export const iconMap: Record<IconName, Record<IconLibrary, string>>

export function buildManifest(opts: BuildManifestOpts): RegistryManifest
// lifts every styles.ts → StyleContract (via @dotui/style), generates per-group contracts (via @dotui/tokens
// defineContract), collects axes, content-addresses the result → an immutable versioned manifest
```

**Registry is a package, not app code — and this is the load-bearing decision of the whole layout.** Three reasons, each a hard requirement rather than a preference:

1. **Engine-neutral by construction.** A registry item is data plus RAC component source. It imports only from `@dotui/{style,tokens,runtime}` published surfaces, React Aria, relative paths, and published npm packages. It cannot import `apps/web`'s router, its fumadocs, its `@/components`, or anything else app-shaped — because in a separate package, those imports do not resolve and the boundary lint fails the build. In the pre-perfect repo, `styles.ts` imported `@/lib/styles` and `examples.tsx` imported `@/modules/create/preview`; the "registry imports only registry" rule held only for `base.tsx` and only by convention. Here it is a package boundary, checked by tooling.

2. **The manifest is built *from* it, not *alongside* it.** `buildManifest()` is the registry's public function. The manifest — the thing every export and every preview resolves against — is a pure derivation of the registry source. There is no second source of truth: no hand-maintained `registry-items.ts` that can drift, no meta duplicated in three places behind drift guards. Lift the source, content-address the output, freeze it.

3. **The application is a consumer like any other.** `apps/web` imports `@dotui/registry` to build the manifest it serves and to mount `base.tsx` files in the live preview. A future Figma plugin host would import the same package the same way. Nothing about the registry knows or cares that a web app is its first consumer. That is the definition of "the engine has no idea a web app exists," applied to the product's own components.

The publisher — the pre-perfect `www/src/publisher/`, a string-template `tv()` compiler with one `%%TV_CONFIG%%` hole per file — does not exist as a thing. Its job (turn source into installable files) is `@dotui/compiler`'s `compile(resolved, { kind: 'export' })`, and it operates on the lifted Style Contract via real emitters, not on regex over templates. The registry stays *source*; the transform is a separate, pure package.

### `@dotui/runtime` — the live preview substrate

The browser-side machinery that makes the builder's preview a live view of the resolved system: `DesignScope` (the scoped-inline preview provider), `createLiveVariants` (the live style modules that `base.tsx`'s `./styles` import resolves to inside the builder), and the worker-protocol client.

```ts
// @dotui/runtime
export function DesignScope(props: DesignScopeProps): JSX.Element
// scoped-inline provider; three adopted stylesheets: themeSheet, utilitiesSheet, runtimeVarsSheet;
// RAC portal redirection via UNSAFE_PortalProvider; containment

export function createLiveVariants(contract: ResolvedContract): LiveVariants
// the live twin of a compiled tv() — CI invariant:
//   createLiveVariants(x)(props) === tv(emitFiles(x))(props)   (+ computed-style sample diff)

export interface WorkerClient {
  send(cmd: Command): void          // tiny classified edits, never whole-doc clones
  onOutput(cb: (o: WorkerOutput) => void): void   // VarOp[] | StyleTree | sheets
}
export function createWorkerClient(opts: WorkerClientOpts): WorkerClient
```

Runtime depends on `@dotui/compiler` (the worker runs `resolve`/`compile`), `@dotui/style` (`ResolvedContract`, `createLiveVariants` mirrors emitter output), `@dotui/tokens` (var ops), React, and React Aria. It is the *only* package other than `apps/web` that imports React DOM concerns — it is where "runs in a browser" is allowed to matter. The compiler stays pure; runtime wraps it in a worker and a provider.

### `dotui` (`@dotui/cli`) — the consumer-side binary

The published CLI a user runs in their own repo: `init`, `add`, `update`, `export`. It wraps shadcn-compatible flows and owns `dotui.lock.json` and the `plan()` that drives `npx dotui update`.

```ts
// dotui — the bin
export function init(opts: InitOpts): Promise<void>          // writes dotui.lock.json + config.registries['@dotui']
export function add(items: string[], opts: AddOpts): Promise<void>
export function update(opts: UpdateOpts): Promise<UpdateResult>
export function plan(lock: DotuiLock, doc: Dsdoc, manifest: RegistryManifest): UpdatePlan
// clean overwrite (pristine hash match) | 3-way merge with conflict markers | AI-assisted merge

export interface DotuiLock {                                  // dotui.lock.json
  doc: { id: string; version: string }
  manifest: string                                            // pinned manifest version
  engine: 'tailwind' | 'stylex'
  files: Record<string, string>                               // pristine file hashes
  codeStyle: CodeStyle
}
```

The CLI depends on `@dotui/schema` (the lock and dsdoc shapes) and talks to `apps/web`'s `/r/*` endpoints over HTTP for the actual compiled files — it does not import the compiler or the registry. It is a *client* of the distribution surface, which keeps the published binary small and means a user's `npx dotui update` never pulls the engine onto their machine.

---

## 3. The dependency graph

```mermaid
graph TD
  schema["@dotui/schema"]
  tokens["@dotui/tokens"]
  style["@dotui/style"]
  compiler["@dotui/compiler"]
  registry["@dotui/registry"]
  runtime["@dotui/runtime"]
  cli["dotui (@dotui/cli)"]
  web["apps/web"]

  tokens --> schema
  style --> schema
  style --> tokens
  compiler --> schema
  compiler --> tokens
  compiler --> style
  registry --> schema
  registry --> tokens
  registry --> style
  registry --> runtime
  runtime --> schema
  runtime --> tokens
  runtime --> style
  runtime --> compiler
  cli --> schema

  web --> schema
  web --> tokens
  web --> style
  web --> compiler
  web --> registry
  web --> runtime
```

It is a DAG, and it is enforced (§4). Reading the layers bottom-up:

- **`schema`** is the taproot — depends on nothing internal.
- **`tokens`** and **`style`** sit on `schema`; `style` also sits on `tokens` (a Contract decl references token ids). There is no edge back — `tokens` never imports `style`.
- **`compiler`** sits on `schema`, `tokens`, `style`. It is the join point for the pure pipeline.
- **`registry`** sits on `schema`, `tokens`, `style`, `runtime` — it authors components that import `runtime`'s `createLiveVariants` and `DesignScope` seams. Crucially, **registry does not depend on `compiler`**: the manifest is built by lifting source (a `style` + `tokens` concern), and *resolving* that manifest is the compiler's job, called by the app.
- **`runtime`** sits on `schema`, `tokens`, `style`, `compiler` — the worker inside runtime runs the compiler.
- **`cli`** sits on `schema` alone — everything else it needs comes over HTTP.
- **`apps/web`** sits on everything. Nothing sits on `apps/web`.

The one edge worth defending is `registry → runtime`. It looks like it risks a cycle (`runtime → compiler`, and one might expect `compiler → registry`), but no such back-edge exists: the compiler takes the manifest as *data*, never imports the registry package. So `registry → runtime → compiler` terminates, and `registry`'s manifest builder reaches `style`/`tokens` directly. No cycle.

---

## 4. Boundaries and how they are enforced

The boundaries above are not documentation — they are checked three ways, and a violation fails the build, not a review comment.

### 4.1 `package.json` `exports` fields (the coarse gate)

Every package declares an explicit `exports` map and nothing outside it is importable. A sibling can reach `@dotui/tokens` but not `@dotui/tokens/src/internal/nudge`. This is what makes a "public API surface" a real surface: the signatures in §2 are the *whole* importable set; the rest is private by the module resolver.

```jsonc
// packages/tokens/package.json
{
  "name": "@dotui/tokens",
  "type": "module",
  "sideEffects": false,
  "exports": {
    ".": "./src/index.ts",
    "./producers": "./src/producers/index.ts",
    "./verify": "./src/verify/index.ts"
  }
}
```

`sideEffects: false` on the leaf packages (`schema`, `tokens`, `style`) is load-bearing for the builder: it lets the bundler tree-shake the worker payload down to the producers and emitters a given engine actually uses. (The pre-perfect `createStyles` registered CSS-var bindings via *import-time module side effects* into module-scoped `Map`s — a load-order coupling that made the param system un-enumerable without importing every component. The perfect packages have no import-time side effects; the registry is data you read, not modules you must load in order.)

### 4.2 Dependency-cruiser (the graph gate)

A single `depcruise` config, run in CI, encodes the DAG as forbidden-edge rules. It is the authority on §3:

```jsonc
// .dependency-cruiser.jsonc (root)
{
  "forbidden": [
    { "name": "no-app-imports",
      "comment": "Nothing may import from apps/web.",
      "from": { "pathNot": "^apps/web" },
      "to": { "path": "^apps/web" } },

    { "name": "registry-no-compiler",
      "comment": "registry builds a manifest; it never resolves one.",
      "from": { "path": "^packages/registry" },
      "to": { "path": "^packages/compiler" } },

    { "name": "registry-neutral-imports",
      "comment": "registry may import only @dotui/{schema,tokens,style,runtime}, react-aria, relative, published npm.",
      "from": { "path": "^packages/registry" },
      "to": { "pathNot": "^(packages/(schema|tokens|style|runtime|registry)|node_modules)" } },

    { "name": "tokens-no-style",
      "from": { "path": "^packages/tokens" },
      "to":   { "path": "^packages/style" } },

    { "name": "no-cycles",
      "from": {}, "to": { "circular": true } }
  ]
}
```

`no-app-imports` and `registry-neutral-imports` are the two that guarantee the registry could be extracted and published untouched. `no-cycles` is a blanket over the whole DAG.

### 4.3 The `dotui/*` registry lints (the semantic gate)

`@dotui/eslint-config` ships the rules that check *inside* the registry, where a bare import graph can't see the problem:

| Lint rule | Checks | Fails when |
|---|---|---|
| `dotui/style-subset` | `styles.ts` uses only the closed utility whitelist | an unliftable utility appears — this rule **is** the compiler's lowering pass in dry-run: lints clean ⇒ compiles |
| `dotui/import-boundaries` | registry files import only the allowed surfaces | a `www`-shaped or `apps/web` import leaks in |
| `dotui/id-permanence` | token/contract ids are stable readable handles | an id is renamed instead of aliased, or minted as an opaque ULID |
| `dotui/contract-integrity` | every enum axis declared in `meta` has slices; every scalar has a bound var | a declared axis has no style backing (the pre-perfect gap between `meta.params` and `createStyles`) |
| `dotui/owned-slot` | no rule describes another node's properties | a cross-node selector survives normalization instead of being re-homed |

These run in `pnpm check` locally and in CI. Between the three gates — `exports` (what's importable), dependency-cruiser (who imports whom), and the `dotui/*` lints (whether the source is liftable and self-consistent) — the boundaries hold structurally. There is no boundary that rests only on a contributor remembering it.

### Tradeoffs

- **Seven packages is more ceremony than one app.** A change that spans `style` and `compiler` touches two `package.json`s, two test suites, and the graph config. The payoff — extractable registry, byte-identical worker/server compile, a taproot schema — is worth it only because those guarantees are the product; for a system without "preview equals export" as a hard promise, this would be over-engineering.
- **`sideEffects: false` + no import-time registration** means the param/axis system must be *read* from data, not *discovered* by importing modules. That is strictly better for testability and tree-shaking, but it forbids the convenient pattern of "import the component and its styles self-register," which is why the registry is structured as an explicit `components` record rather than a folder scanned at runtime.
- **Boundary lints have upkeep.** `dotui/style-subset` must stay in lockstep with `@dotui/style`'s lift pass (they are the same logic in two modes). Drift between them is the one way the "lints clean ⇒ compiles" invariant could break, so they live in the same package and share a test corpus.

---

## 5. The build pipeline

### 5.1 Turbo task graph

`turbo.json` declares the task DAG; the package dependency DAG (§3) drives `^build` ordering automatically.

```jsonc
// turbo.json
{
  "$schema": "https://turborepo.org/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".output/**", ".vercel/output/**"]
    },
    "manifest": {                          // registry → RegistryManifest snapshot
      "dependsOn": ["^build"],
      "outputs": ["packages/registry/manifest/**"]
    },
    "typecheck": { "dependsOn": ["^build"] },
    "test":      { "dependsOn": ["^build"] },
    "lint":      {},
    "clean":     { "cache": false }
  }
}
```

`^build` means "build every dependency first." Because the graph is a DAG, Turbo produces a valid topological order with no configuration beyond the package deps: `schema` builds, then `tokens`/`style`, then `compiler`, then `registry`/`runtime`, then `apps/web`. `apps/web`'s `build` transitively depends on `registry`'s `manifest` task, so the manifest is always fresh before the app compiles routes that serve it.

### 5.2 What builds what

```mermaid
graph LR
  src["registry source<br/>styles.ts · base.tsx · contracts · axes"]
  lift["@dotui/style lift<br/>+ @dotui/tokens defineContract"]
  manifest["RegistryManifest<br/>(content-addressed, committed)"]
  worker["worker payload<br/>(compiler + producers + emitters)"]
  app["apps/web build<br/>routes, /r/*, /create"]

  src --> lift --> manifest
  manifest --> app
  worker --> app
  src -.mounts base.tsx.-> app
```

The `manifest` task runs `buildManifest()` from `@dotui/registry`: it lifts every `styles.ts` into a `StyleContract`, generates the per-sync-group contracts, collects axes, and content-addresses the whole into a versioned immutable snapshot. That snapshot is committed.

### 5.3 Committed vs generated

The distinction the pre-perfect repo blurred — generated `__generated__/publishables` living *inside* the product source, flagged "known-wrong" — is drawn sharply here.

| Artifact | Committed? | Produced by | Diffed in CI |
|---|---|---|---|
| `RegistryManifest` snapshot | **Yes** — it is the immutable pin every doc references | `manifest` task | manifest-drift job: rebuild, diff |
| Style Contracts (per group) | **Yes** — build artifact, part of the manifest | `@dotui/style` lift | via manifest drift |
| JSON Schemas (`@dotui/schema`) | **Yes** — the published contract with consumers | schema build | schema-drift job |
| API reference JSON (from `types.ts`) | **Yes** — feeds docs | references builder | references-drift job |
| `dist/**` per package | No — `.gitignore` | `build` | — |
| `PreviewOutput` / compiled files | No — computed per request/session | `compile()` at runtime | cold-start parity test |
| Publisher `publishables/*` | **Does not exist** | — | — |

The rule: **anything a *consumer* pins to is committed (manifest, schemas); anything *derived per request* is computed live** (compiled files, preview output). Nothing generated is committed *into* `packages/registry/`'s source tree — the manifest lands in `packages/registry/manifest/`, a sibling directory the source never imports. The registry source stays exactly what it claims to be: components and their descriptions.

### 5.4 The cold-start guarantee

One committed artifact is not in the table because it is a *test fixture, not a source*: the baked default `PreviewOutput`. The builder's cold start (a fresh `/create` with the default doc) must render before the worker has compiled anything, so a default `PreviewOutput` ships with the app. The **cold-start parity test** re-compiles the default doc on the server and asserts byte-equality with the shipped fixture. If they diverge, the build fails — the fixture can never silently rot, because it is checked against the one function that would have produced it.

### Tradeoffs

- **Committing the manifest costs churn.** Every registry change that alters the lifted output produces a manifest diff in the PR. That is the price of the manifest being a *pinned, content-addressed artifact* rather than a live computation — and it is the same trade shadcn-style registries and lockfiles make. The manifest-drift job turns "did you forget to rebuild" into a red check instead of a broken deploy.
- **Turbo caching hinges on honest `outputs`.** A task that writes outside its declared `outputs` silently poisons the cache. The task list is deliberately small and each `outputs` glob is exact.

---

## 6. Where tests live

Tests live *with the thing they test*. There is no central test package; each package owns its invariants (see also the testing chapter, [13-testing.md](13-testing.md)).

| Invariant (from the canonical list) | Home package | Shape |
|---|---|---|
| Catalog completeness (both emitters total) | `@dotui/style` | property test over `PropKey × TokenValue × StateDecl` |
| Round-trip: Tailwind → Contract → Tailwind semantic identity | `@dotui/style` | golden class-order test |
| Parity CI: computed-style diff, full matrix, both engines | `@dotui/style` + `apps/web` (render harness) | visual/computed diff |
| Cascade ≡ resolution | `@dotui/tokens` | property test over random graphs/cubes |
| Contrast matrix: every pairing × every reachable cell | `@dotui/tokens` | exhaustive per-cell WCAG2/APCA |
| Live-variants conformance (the one preview seam) | `@dotui/runtime` | property test + computed-style sample diff |
| Cold-start parity | `apps/web` | byte-equality vs fresh server compile |
| Migration corpus (per schema version) | `@dotui/schema` | frozen fixtures, ladder replay |
| Golden reference dsdocs (material3/geist/linear/enterprise/shadcn) | `apps/web` | validate + visual-regression; a reconstruction gap = a failing test naming the missing axis |
| `codeStyle` AST-equivalence | `@dotui/compiler` | every transform AST-equal modulo formatting |
| Registry lints (style-subset, boundaries, id-permanence, contract-integrity) | `@dotui/eslint-config` (rule tests) + registry (corpus) | rule unit tests + `pnpm check` |

The colocation matters for the same reason the packages are split: a `@dotui/tokens` contributor can run `pnpm --filter=@dotui/tokens test` and get the full contrast/cascade proof for their change without booting the app. `vitest` runs the leaf-package suites; the render-dependent suites (parity, golden dsdocs, cold-start) run under `apps/web` where a DOM is available. The pre-perfect world tested essentially one package (`packages/colors`) — here every package carries its own proof, because every package *is* an independently meaningful unit.

---

## 7. Relocation map: every pre-perfect location → its home here

This is the exact relocation table from the pre-perfect repo to the layout above. It is a map of *where responsibilities move*, stated in the present tense of the end state — the left column names a thing that, in the perfect layout, has become the right column.

| Pre-perfect location | Perfect home | What changed |
|---|---|---|
| `www/` (the whole app) | `apps/web/` | renamed; thinned to a shell over the packages |
| `www/src/registry/ui/<c>/base.tsx` | `packages/registry` → `components[c].base` | unchanged source; now in an engine-neutral package with enforced imports |
| `www/src/registry/ui/<c>/styles.ts` | `packages/registry` → `components[c].styles` | `import '@/lib/styles'` becomes `import { defineComponentStyles, sizes } from '@dotui/style'` — a package import, not a www alias |
| `www/src/registry/ui/<c>/meta.ts` params | `AxisDecl[]` in `packages/registry` + baseline in the manifest | `EnumParamDef`/`ScalarParamDef` generalize into `AxisDecl` (enum/scalar/toggle/color/font/tokenTarget) |
| `www/src/lib/styles.tsx` (`createStyles`, `useStyles`, `DesignSystemProvider`) | split: authoring → `@dotui/style` (`defineComponentStyles`); live provider → `@dotui/runtime` (`DesignScope`, `createLiveVariants`) | the one file that was *outside* the registry but *was* its engine is dissolved into two packages; no import-time side-effect registries |
| `www/src/publisher/**` (build-time + request-time) | **gone**; job absorbed by `@dotui/compiler` `compile(_, { kind: 'export' })` + `@dotui/style` emitters | the `%%TV_CONFIG%%` string-template compiler is replaced by real Contract emitters + `codeStyle` AST transforms |
| `www/src/publisher/code-options.ts` (`CodeOptions`: 2 booleans) | `CodeStyle` in `@dotui/schema`; transforms in `@dotui/compiler` | two booleans become the full `codeStyle` AST-transform surface |
| `www/src/registry/__generated__/publishables/*` | **gone** | no committed generated artifacts inside registry source |
| `www/src/registry/__generated__/registry-items.ts` (hand-derived manifest) | `packages/registry/manifest/` via `buildManifest()` | one derivation, content-addressed; no meta duplicated three places |
| `www/src/registry/theme/**` (`DEFAULT_SEMANTICS`, `ColorConfig`, emitters) | `@dotui/tokens` (semantic layer, producers, emitters) | the closed 76-token vocabulary becomes the shipped baseline of the open Dimensional Token Graph |
| `www/src/registry/base/{theme,colors,base}.css` | `@dotui/tokens` `emit.css()` output + manifest baseline | hand-authored `@theme` CSS that had to stay in sync with the TS source is now *emitted* from the graph |
| `packages/colors` (`@dotui/colors`) | subsumed into `@dotui/tokens` (producers + verify kernel) | the OKLCH/tailwind/contrast/material producers and WCAG2/APCA verify become the token package's kernel |
| `www/src/registry/icons/**` (no-op `createIcon`, unwired) | `@dotui/registry` `iconMap` + resolver-driven import swap at compile | the facade becomes a real axis: resolution swaps the icon import map |
| `www/src/modules/create/**` (builder, preset, codec) | `apps/web` (builder UI) + `@dotui/schema` (dsdoc, canonical form, codec) | `DesignSystem` preset (string-keyed, un-versioned) becomes the versioned `Dsdoc`; the fragile diff-against-runtime-defaults codec becomes canonical-form + content hash |
| `www/src/modules/create/preset/{types,defaults,codec}.ts` | `@dotui/schema` `Dsdoc`, `canonicalize`, migration ladder | silent-fallback-on-decode-error is replaced by loud typed migration errors + a fixture corpus |
| `www/src/routes/r/*` (registry endpoints) | `apps/web/src/routes/r/*` | unchanged role; now they call `compile()` instead of `publish()` |
| `www/scripts/registry-build.ts` | `@dotui/registry` `buildManifest` + a thin `turbo` task | the ad-hoc build script becomes a package function with a declared task |
| `www/scripts/build-showcase-bundle.ts` (regex closure, `themeStub`) | `@dotui/compiler` `compile(_, { kind: 'export' })` → `/r/bundle` target profiles | the regex import-scanner and hand-pinned `themeStub` are replaced by a resolved-system compile with per-target packaging |
| `packages/ts-config` | `tooling/ts-config` (`@dotui/ts-config`) | moved under `tooling/`; unchanged role |
| `.oxlintrc.json` (no import-boundary rules) | `@dotui/eslint-config` (`dotui/*` rules) + `.dependency-cruiser.jsonc` | boundaries move from convention to enforced tooling |

The through-line: **three pre-perfect facts dissolve.** (1) The registry was app code that leaked app imports — it becomes a package the lint forbids leaking into. (2) The styling engine lived *outside* the registry in `www/src/lib/styles.tsx` while being the registry's whole runtime — it splits cleanly into authoring (`@dotui/style`) and live-preview (`@dotui/runtime`). (3) The publisher was a string-template `tv()` compiler that could never grow a second engine — it becomes `@dotui/compiler` over a lifted, engine-neutral Contract with two real emitters.

---

## 8. What the layout buys, stated plainly

- **The registry is extractable.** `packages/registry` imports only `@dotui/{schema,tokens,style,runtime}`, React Aria, and published npm. Delete `apps/web` and it still builds. That is the operational meaning of "engine-neutral," and it is what lets a Figma host or a second app consume the same components.
- **Preview equals export by construction.** `@dotui/compiler` is one pure function set, run in `@dotui/runtime`'s worker and in `apps/web`'s `/r/*` routes. The cold-start parity test guarantees the two agree byte-for-byte.
- **No source of truth is duplicated.** The manifest is *derived* from the registry and *committed* as a pin; the token CSS is *emitted* from the graph, not hand-kept-in-sync; the dsdoc is the single document, not a preset plus three shadow copies.
- **Every boundary is a build failure, not a review note.** `exports` fields, dependency-cruiser, and the `dotui/*` lints together mean the DAG in §3 and the neutrality of the registry are checked mechanically. A contributor cannot accidentally couple the compiler to the registry or leak an app import into a component.

### Tradeoffs, honestly

- **The `apps/web` → everything edge is wide.** The app depends on all seven packages, so a leaf-package version bump ripples through the app's typecheck. This is the correct direction (dependencies point *toward* stability) but it does mean the app is never insulated from engine churn — which is fine, because the app is *supposed* to track the engine.
- **Colocated tests can't share render infrastructure trivially.** The parity and golden-dsdoc suites need a DOM and live under `apps/web`, physically separated from the `@dotui/style` emitters they exercise. The seam is the render harness `apps/web` exposes; keeping that harness thin is ongoing discipline, not a solved problem.
- **`dotui/style-subset` and the lift pass are the same logic twice.** They must not drift, so they share a package and a corpus — but "must not drift" is a maintenance obligation the layout creates, not eliminates. It is accepted because the alternative (a lint that approves source the compiler then rejects) is strictly worse.

---

*Next: [The registry — item anatomy, kinds, and authoring rules](03-registry.md) drills into `@dotui/registry`'s item structure; [Styles — the Style Contract and two engines](04-styles.md) into `@dotui/style`; [The compiler](11-compiler.md) into `@dotui/compiler`'s `resolve`/`compile`.*
