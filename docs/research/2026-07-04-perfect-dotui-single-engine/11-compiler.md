# The compiler — resolve, compile, and the export pipeline
> Part of [The Perfect dotUI (single-engine)](README.md) — an end-state architecture study (2026-07-04). Constitution-conformant.

The compiler is the single program that turns a design system into every artifact dotUI produces. A live preview frame during a hue drag, the `button.tsx` a user installs through the shadcn CLI, the DTCG token file a Figma plugin reads, the static HTML fragment embedded in a blog post — all four come out of the same two pure functions, `resolve` and `compile`, from `@dotui/compiler`. There is exactly one implementation of "apply this design system to this component," and it runs byte-identically in a browser worker (the builder's live preview) and in the `/r/*` server routes (every export endpoint). Preview equals export by construction, not by a test that chases parity after the fact.

This is the chapter the old `www/src/publisher` never had. That publisher was two half-pipelines — a build-time ts-morph extractor and a request-time string-template splicer — hardwired to `tailwind-variants`, with a single `%%TV_CONFIG%%` hole per file and an accretion of hardcoded allowlists, module-level mutable dep state configured per request, and a bespoke CSS parser. Its structural failure modes are the negative space this chapter is designed around: enum `vars` (menu.highlight) previewed but were stripped on export; global tokens (the radius-factor slider) previewed but were dropped in `registry-preset.ts` and never reached any `/r/*` route; density and named-style choices were baked into strings by a merge that mirrored `tv()` semantics *by hand* in `flatten.ts`, so any drift between the runtime `createStyles` and the publisher `flatten` was a silent preview/export divergence. The compiler removes each of those as a *representable* state.

```
                         ┌──────────────────────────── @dotui/compiler ────────────────────────────┐
  manifest (pinned) ─┐   │                                                                          │
                     ├──▶│  resolve(manifest, dsdoc) ─────────────────────────▶ ResolvedSystem      │
  dsdoc ─────────────┘   │    validate · migrate · graph-merge · ramp-materialize ·                 │
                         │    axis-resolve (sync fan-out + detach) · style-resolve                   │
                         │                                       │                                   │
                         │                                       ▼                                   │
                         │  compile(resolved, target) ──────────────────────────────────────────┐   │
                         │    preview   ▶ PreviewOutput { themeCss, utilitiesCss, runtimeVarsCss }│   │
                         │    export       ▶ RegistryFile[]  (tv() emitter + codeStyle AST xfm)   │   │
                         │    tokens       ▶ DTCG JSON                                            │   │
                         │    static-embed ▶ HTML fragment + CSS                                  │   │
                         └───────────────────────────────────────────────────────────────────────┘   │
                         └──────────────────────────────────────────────────────────────────────────┘
        runs in:  browser Style Worker (preview)   ·   /r/*, /api/* server routes (export)
        handshake: version content hash — version skew is refused, never silently served
```

The split is deliberate and load-bearing. `resolve` is the expensive, cache-rich stage that turns a document plus a vocabulary into a fully-materialized `ResolvedSystem` — every token value computed per cell, every sync group's styles resolved to a complete `tv()` config, every axis selection applied with sync fan-out and detach honored. `compile` is a family of thin, pure projections of that `ResolvedSystem` onto a target. Splitting there means the builder resolves once per edit and compiles many times (the four preview views, the export preview modal, the DTCG panel) off one resolved value, and it means `resolve` owns all the design-system semantics while `compile` owns only serialization and packaging.

---

## 1. `resolve` — from document to `ResolvedSystem`

`resolve(manifest, dsdoc): ResolvedSystem` is a pure function of two inputs: the immutable [Registry Manifest](03-registry.md) the dsdoc is pinned to, and the [dsdoc](09-dsdoc.md) itself. It has no ambient dependencies — no `Date.now`, no filesystem read, no network. Given the same two inputs it returns the same `ResolvedSystem`, on the server and in the worker, forever. That purity is what the version handshake (§6) protects and what every determinism rule (§7) enforces.

It runs in six stages. Each stage's output is the next stage's input; each is independently cacheable on the identity of its inputs (§5).

```mermaid
flowchart TD
  A[dsdoc + manifest] --> B[1. validate]
  B -->|typed diagnostics| B
  B --> C[2. migrate]
  C --> D[3. graph merge<br/>baseline ⊕ overlay]
  D --> E[4. ramp materialization<br/>producer × cell · cached]
  E --> F[5. axis resolution<br/>precedence · sync fan-out · detach]
  F --> G[6. style resolution<br/>named-style deltas → complete tv() configs<br/>density fold · scalar bindings · declared var-writes]
  G --> H[ResolvedSystem]
```

### Stage 1 — validate

`validate(dsdoc, manifest)` is the same function [`@dotui/schema`](02-monorepo.md) exposes to agents and to the builder's edit path. It runs before anything else and it is total: it returns either a valid, typed dsdoc or a list of typed diagnostics with source spans (§8). It checks structural schema conformance (does this match the `Dsdoc` JSON Schema at this `dsdoc:` version), referential integrity (every token reference resolves to a node id that exists in the merged graph; every axis selection names a real option; every `detached` record names a real sync-group member), and the manifest-relative invariants (a component delta targets a `tv()` section the pinned manifest actually declares; a mode dimension does not exceed the soft caps). A dsdoc that fails validation never proceeds to migration — resolving an invalid document is not a defined operation, and the diagnostics are the product's error surface, shared identically by the builder, the CLI, and the MCP `validate` tool.

Validation is where the old publisher's silent-fallback behavior is inverted. `decodePreset` used to catch any parse error and return `DEFAULTS`, silently discarding a user's system. Here, a malformed document is a loud, typed, spanned failure — never a reinterpretation.

### Stage 2 — migrate

The `dsdoc:` field is a schema major version. If the document's `dsdoc:` is older than the resolver's, `migrate` runs the pure migration ladder — a chain of `v(n) → v(n+1)` functions, each total over its input version, each covered by a frozen fixture corpus (invariant #8 in the [testing chapter](13-testing.md)). Migrations fail loudly on any id they cannot map rather than dropping it. This is *schema* migration — the shape of the document — and it is distinct from *manifest* reconciliation, which the [dsdoc chapter](09-dsdoc.md) owns: a two-year-old document opens against its own frozen manifest without any migration at all, and `reconcile(doc, newManifest)` is a separate, explicitly-invoked, reviewable operation. `resolve` never reconciles implicitly; it resolves against whatever manifest the `lock` pins.

Three version numbers stay unconfused throughout the compiler: `dsdoc` (schema major → this migration ladder), `meta.version` (content semver, opaque to `resolve`), and `lock.manifest` (the vocabulary snapshot, an input to `resolve`).

### Stage 3 — graph merge

The [Dimensional Token Graph](05-tokens.md) that `resolve` operates on is `baseline ⊕ overlay`: the pinned manifest ships a baseline graph (the ~76 shipped semantic tokens, the default ramps, the two default mode dimensions `scheme` and `contrast`), and the dsdoc's `tokens: TokenGraphOverlay` section carries the user's additions and changes — added dimensions, added or retargeted ramps, added or renamed nodes, retargeted semantic references.

Merge is a structural graph operation keyed on node id. An overlay node with an id present in the baseline *replaces* that node's mutable fields (target, name, ramp producer config) while preserving its identity and its structural edges. An overlay node with a new id *adds* a node. The baseline's system-owned component-contract nodes (generated per [sync group](06-axes.md) from `defineContract()`) can be *retargeted* by an overlay but never deleted or renamed — that invariant is enforced here, and a violation is a validation diagnostic caught in stage 1. The output is one merged `TokenGraph`: layers (primitive → semantic → component-contract) as edge rules, mode dimensions with their options and bindings, ramps with their producer specs. No values are computed yet — merge is purely structural. This is where the old system had *nothing*: the semantic layer was a static `base/theme.css` file shipped verbatim, so adding a semantic token or a mode was simply not representable.

### Stage 4 — ramp materialization

Now values get computed. For every `RampSpec` in the merged graph, and for every reachable [cell](05-tokens.md) (a concrete combination of mode-dimension options, e.g. `scheme:dark&contrast:hc`), `resolve` runs the ramp's producer with that cell's config:

```ts
// per (ramp, cell): materialize once, cache on (rampSpecHash, cellKey)
producer.run(rampSpec.steps, rampSpec.producer.config[cellKey] ?? rampSpec.producer.config['']) 
  → Record<Step, OklchValue>
```

Producers are the pluggable kernel: `oklch` (default, isDark-aware — it *derives* a real dark ramp for the `scheme:dark` cell rather than reversing the light ramp), `tailwind`, `contrast` (raises WCAG/APCA targets toward AAA for `contrast:hc` cells — this is how high-contrast composes with every scheme), `material` (HCT), `fixed` (hand-authored ramps per cell — the paste-my-palette flow), and the open producer registry. The materialized value is symbolic-friendly: a step's OKLCH triple, ready to be emitted as a CSS custom property or a DTCG token, but not yet stringified.

Materialization is the single most cache-sensitive operation in the compiler. During a hue drag, exactly one ramp changes (the accent ramp), across the reachable cells for that ramp (typically light + dark, times any contrast options that don't override the seed). The cache is keyed on `(rampSpecHash, cellKey)`, so every *other* ramp's materialized values survive the edit untouched — the neutral ramp, the success ramp, the semantic aliases that point at unchanged ramps. A hue drag recomputes ~2–4 cells of one 11-step ramp (§5), which is what keeps the value tier under the frame budget in the [builder](10-builder.md). The old iframe re-ran the whole color kernel per slider tick because `structuredClone` across the realm boundary defeated its identity caches; the worker holds the `ResolvedSystem` and receives only the changed seed, so the cache is never invalidated wholesale.

### Stage 5 — axis resolution

With tokens materialized, `resolve` applies the [axis](06-axes.md) selections. Every axis has a scope (global / group / component) and a resolution precedence, applied per axis:

```
component selection (iff detached or the axis is component-scoped)
  → group selection
    → global selection
      → doc-declared default
        → pinned-manifest default
```

**Sync fan-out.** A sync group (Button ⇄ ToggleButton ⇄ LinkButton) stores its shared selections *once* under the group id. Resolution fans a group selection out to every member: setting the group's `variant` default to `primary` resolves `primary` for Button *and* ToggleButton *and* LinkButton in one pass. The old system's Button/ToggleButton sync was PR discipline — a human remembered to change both files. Here it is a structural fan-out that cannot be forgotten, because divergence is not representable without an explicit detach.

**Detach.** A member diverges from its group on a specific axis only through an explicit `detached` record in the dsdoc (validator-enforced in stage 1). When resolving axis A for member M, `resolve` checks whether M has a detached record for A; if so, the component-scoped selection wins and the group selection is skipped for that axis only. Detach is per-member, per-axis — ToggleButton can detach its `radius` while keeping the group's `variant` and `hoverEffect`. This is the "detachable structural sync groups" ruling: sync is the default, divergence is deliberate and localized.

**Fan-out axes** (grouped tweaks) resolve here too. A `WriteTarget[]` axis like "translucent overlays" fans one selection across several writes — retargeting the menu surface token, the popover surface token, and a backdrop-blur scalar in one selection, with per-value `when` predicates deciding which writes fire. The old system had no representation for a grouped tweak; each was a hand-coded batch in the customizer.

The output of stage 5 is: per-cell resolved token values (still symbolic), and, for each component, the fully-resolved set of axis selections (which named style, which density, which scalar bindings, which file variant).

### Stage 6 — style resolution

The last stage turns resolved selections into complete [`tv()` configs](04-styles.md) per sync group. The manifest ships each component's authored styles with its named-style deltas — a named style like `button.style = 'brand-cta'` is authored as a DRY delta over the base, but `resolve` materializes it into a *complete* `tv()` config before anything downstream reads it. This is the resolution that replaces the old build-time lift: `styles.ts` is not lifted into a JSON intermediate representation; it is *resolved* into the concrete `tv()` config that ships. Five things happen:

1. **Evaluate pure helpers / fragments.** Shared fragments across a sync group evaluate and inline, so the resolved config is self-contained.

2. **Named-style deltas → complete `tv()` config.** The selected named style's delta layers over the base config (base ← density-pin ← named-style delta), producing a complete, self-contained `tv()` config with every section present. Fork, diff, and export all operate on complete configs; the delta is an authoring convenience the resolver erases.

3. **Fold density.** The `sizes()` density × size table folds into the selected tier — baked into classes under `codeStyle.density: 'baked'` (default), or carried as a `data-density` attribute axis under `'runtime'` (§4.3).

4. **Resolve scalar / param bindings.** Component vars (`--btn-radius`, `--btn-font-weight`) resolve to their bound targets from the axis selections. If the user bound Button's radius axis to `radius.lg`, `--btn-radius` resolves to `{ token: 'radius.lg' }`. Whether that becomes an idiomatic `rounded-lg` class or a `var()` reference is a *compile*-time decision governed by `codeStyle.tokenIndirection` (§4.3) — `resolve` only records the resolved binding.

5. **Preserve declared var-writes.** Named-style `vars` blocks and inline `[--x:var(--y)]` writes are carried through verbatim. There is **no strip step** in this stage — this is precisely why the `menu.highlight = accent` export bug is structurally impossible (decision **N2**, §2.1). The user override deltas from the dsdoc's `components` section are applied here too: they are raw Tailwind class strings, layered over the resolved named-style config as-is, no edit-time totality check to pass.

The result is a `ResolvedSystem`: the complete, fully-materialized value from which every target compiles.

### The `ResolvedSystem` schema

```ts
interface ResolvedSystem {
  version: number                              // content hash (§6) — client/server handshake

  // Token graph, resolved: symbolic values per cell, dimensions carried for emission.
  tokens: {
    dimensions: ResolvedDimension[]            // scheme/contrast/brand… with options, binding, priority
    cells: CellKey[]                           // every reachable cell, canonically ordered
    nodes: Record<NodeId, ResolvedTokenNode>   // primitive / semantic / component-contract, by permanent id
  }

  // Per-sync-group resolved styles: a concrete tv() config (complete, not deltas).
  styles: Record<SyncGroupId, ResolvedComponentStyles>

  // Per-component resolution results.
  components: Record<ComponentId, {
    group: SyncGroupId                         // which resolved styles to read
    fileVariant: string                        // which base.tsx ships (loader: 'ring' → base.ring.tsx)
    scalarBindings: Record<string, ScalarBinding> // resolved component-var bindings ({ '--btn-radius': {token:'radius.lg'} })
    density: DensityTier                        // resolved density selection
  }>

  codeStyle: CodeStyle                          // carried through; consumed only by export compile targets
  meta: { docId: string; docVersion: string; manifest: string }  // provenance, not resolution input
}

interface ResolvedTokenNode {
  id: NodeId                                    // permanent readable id (color-primary, btn-bg-primary)
  name: string                                  // emitted var name + display label (renamable; = id initially)
  layer: 'primitive' | 'semantic' | 'contract'
  values: Record<CellKey, SymbolicValue>        // '' base required; per-cell deltas; SymbolicValue = oklch | ref | on | alpha | mix | calc | literal
  pairsWith?: NodeId[]                           // structural edges for contrast verification
}
```

Two properties of this schema carry the whole downstream design. First, **token values are symbolic, never stringified** — a semantic node holds `{ ref: 'accent', step: 500 }` or an OKLCH triple, not `"oklch(0.64 0.13 251)"` and never `"var(--color-primary)"`. Stringification is an emitter concern, so the same resolved value emits as a CSS custom property or a DTCG `$value` from one source. Second, **`ResolvedComponentStyles` is a concrete `tv()` config, not a JSON "Contract"** — a resolved sync group is a normalized `tv()` config (base / slots / variants / compounds), already Tailwind, ready for the emitter. There is no engine-neutral intermediate to privilege one engine over another because there is only one engine.

### Tradeoffs (`resolve`)

- **Resolution is not incremental *within* a stage.** The cache is keyed on node identity across stages (§5), so a hue drag skips re-materializing unchanged ramps — but a structural edit that changes the merged graph's shape (add a mode dimension) re-runs stages 3–6 for the affected subgraph. The design accepts full re-resolution of a subgraph over the complexity of a fine-grained incremental graph engine, because structural edits are click-frequency, not drag-frequency, and the [builder](10-builder.md)'s tier classification routes them accordingly.
- **The `ResolvedSystem` is large.** A full system with 4 dimensions, 24 cells, ~76 semantic tokens, and ~72 components' resolved `tv()` configs is a substantial object. The worker holds one, and the server allocates one per export request. The design accepts this memory cost in exchange for making `compile` a set of cheap projections; the alternative (streaming resolution lazily per target) would reintroduce the two-half-pipeline structure the whole design exists to delete.
- **Symbolic token values defer all unit decisions to emit time.** A calc expression or an OKLCH mix is carried as a small AST, not a computed string. This is what makes DTCG fall out for free, but it means the emitter must implement the full `SymbolicValue` vocabulary — the resolution-completeness test ([13-testing.md](13-testing.md)) exists precisely to prove the shipped output contains every declared var-write and scalar the source referenced, so a new `SymbolicValue` shape cannot ship half-rendered.

---

## 2. `compile` — one `ResolvedSystem`, four targets

`compile(resolved, target): Output` is a pure projection. It reads a `ResolvedSystem` and a target descriptor and produces exactly one kind of output. It performs no resolution — every design-system decision was already made in `resolve` — so `compile` is fast, and every target sees identically-resolved values. This is the structural guarantee that a preview frame and an exported file agree: they are two projections of one `ResolvedSystem`, not two programs.

```ts
type Target =
  | { kind: 'preview'; scope?: string }
  | { kind: 'export'; codeStyle: CodeStyle }
  | { kind: 'tokens'; format: 'dtcg' }
  | { kind: 'static-embed'; view: PreviewView }

function compile(resolved: ResolvedSystem, target: Target): CompileOutput
```

There is **one style output path**. Everything upstream — resolve, graph merge, ramp materialization, axis resolution, style resolution — produces Tailwind: the resolved sync-group styles are already a `tv()` config. `compile` reads that config; it does not choose between renderers. (The two-engine sibling study routed this through a two-emitter dispatch; with a single engine there is nothing to dispatch on, so that machinery is absent.)

### 2.1 `preview` → `PreviewOutput` (three sheets)

The preview target emits three CSS strings, adopted by the [builder](10-builder.md)'s `DesignScope` via `adoptedStyleSheets`:

```ts
interface PreviewOutput {
  themeCss: string        // the token graph as custom properties: :root block + per-cell delta blocks
  utilitiesCss: string    // the Tailwind utility layer
  runtimeVarsCss: string  // component enum vars (menu.highlight), scoped
}
```

The split is not cosmetic; it is the invalidation boundary that makes the builder fast. `themeCss` holds the token graph — a `:root` block plus one delta block per non-base cell, each gated by its mode dimension's binding (a `@media` query for a `media`-bound option, a `[data-scheme=dark]`-style data-attr/class selector for an attribute-bound one), emitted in ascending specificity so the cascade reproduces the graph's most-constrained-key-wins resolution. Switching mode is a single `setAttribute` on the scope root — a value-tier edit that swaps which delta block wins, with zero recompile. `utilitiesCss` is the Tailwind utility layer: the static precomputed utility layer (~40KB for the curated class universe) plus any incrementally-compiled novel utilities from user-defined tokens. It is replaced only on a new-utility event. `runtimeVarsCss` holds the component enum vars — the `menu.highlight = accent` case that sets `--color-highlight: var(--accent-500)` — scoped to the component. This is the exact field the old publisher *dropped*: `flatten`'s `stripVars` deleted enum `vars` and nothing re-emitted them, so the published menu diverged from the preview. Here it is a first-class output field that the *export* target also emits (§2.2), so preview and export cannot diverge on it. This is decision **N2** made concrete: because style resolution never strips a declared var-write (stage 6, step 5), there is no publish step that *could* lose it — a "resolved output includes every referenced var" test replaces the old guard.

A value-tier drag doesn't rewrite any of these sheets — it is an inline `setProperty` on the scope root, overriding the token custom property directly. The sheets are rewritten only when the token *set* changes shape, which is a structural or global edit.

### 2.2 `export` → `RegistryFile[]` (tv() emitter + codeStyle)

The export target produces the files a user installs: component sources, the theme stylesheet, the utility library. It runs in two steps, both pure.

First, the **`tv()` emitter** walks the resolved styles and the resolved token graph to produce idiomatic source: `tv()` literals whose class strings are *character-for-character* what the preview DOM rendered — same resolved values, same class order, so `bg-primary` in the preview is `bg-primary` in the file. The declared var-writes and the resolved scalar bindings flow through the *same* `ResolvedSystem` fields the preview read: the resolved styles' var-writes become emitted component CSS, scalar bindings become resolved classes or `var()` references per `tokenIndirection`. The axes the old exporter silently dropped — enum vars, global tokens, the radius-factor scalar — export with fidelity because they are in the `ResolvedSystem` and every target reads the same value.

Second, **codeStyle AST transforms** (§4) reshape the emitter's output to match the user's codebase conventions — arrow functions vs declarations, `tv()` class arrays vs one line per slot, import grouping, section comments. These are typed AST transforms over the emitter's parsed output, with section boundaries derived from the `tv()` structure (base / slots / variants / compounds) — never regex over strings and never the old `// MARK:` in-band comment protocol. Every transform is AST-equivalent modulo formatting (CI invariant #10, [13-testing.md](13-testing.md)).

The output is a `RegistryFile[]` — a target-agnostic list of `{ path, target, content, type }`. Per-target *packaging* (shadcn item JSON, v0 bundle, zip) happens downstream in [distribution](12-distribution.md); `compile`'s job ends at the files.

### 2.3 `tokens` → DTCG JSON

The tokens target serializes the resolved token graph to [DTCG](12-distribution.md) — the format Figma and other tools consume. Each mode dimension becomes a DTCG collection, each option becomes a mode, each node becomes a variable, and node ids ride in `$extensions.dotui.id` so a round-trip preserves identity. Because the token values in the `ResolvedSystem` are symbolic (§1), the DTCG backend emits `$value` and `$type` directly from the symbolic form — no re-parsing of emitted CSS, which is what the old system would have had to do (it had no DTCG path at all). This target reads *only* `resolved.tokens`; it ignores styles and codeStyle entirely, because DTCG has no concept of component styles.

### 2.4 `static-embed` → HTML fragment + CSS

The static-embed target runs `compile` for a preview `view` and emits a self-contained HTML fragment plus its CSS — no JavaScript required to render, CSP-safe, cacheable. It is the packaging for blog posts, PR comments, and og-images. Internally it composes the `preview` target's three sheets with a server-rendered DOM of the chosen view (single / family / showcase / style-guide) over the real `base.tsx` components. Because it shares the `preview` code path, a static embed is pixel-identical to the live preview of the same document — the same structural guarantee, extended to a JS-free artifact.

### The compile-target catalog

| Target | Input read from `ResolvedSystem` | Output | Primary consumers |
|---|---|---|---|
| `preview` | tokens (all cells) · styles · components | `PreviewOutput` (themeCss, utilitiesCss, runtimeVarsCss) | builder DesignScope · docs demos · live embeds |
| `export` | styles · components · tokens · codeStyle | `RegistryFile[]` (sources + theme + lib) | shadcn CLI · v0/Bolt/Lovable bundles · zip · export preview modal |
| `tokens` | tokens only | DTCG JSON | Figma plugin · `/api/tokens.dtcg.json` · design-tool import |
| `static-embed` | same as preview, one view | HTML fragment + CSS | blog embeds · PR comments · og-images |

### Tradeoffs (`compile`)

- **Four targets share `resolve` but each re-walks the resolved value.** `compile('export')` and `compile('preview')` both traverse every resolved `tv()` config; they don't share a partial result. The design accepts this re-walk because each traversal is cheap object/string work over an already-resolved value (sub-millisecond per component), and sharing an intermediate would couple two targets that must stay independently correct.
- **`preview` and `export` must produce byte-identical *class strings* while producing different *wrappers*.** The preview wraps utility definitions the class strings reference; export wraps the class strings in a `tv()` literal. The invariant that the strings themselves are identical is exactly the live-variants conformance test (§3, [13-testing.md](13-testing.md)) — the one seam where a bug could reintroduce divergence, so it gets a property test *and* computed-style sample diffs, not trust.

---

## 3. One style output path — the `tv()` emitter

With a single engine, the compiler has **one style output path**, not a dispatch between renderers. Everything upstream — resolve, graph merge, ramp materialization, axis resolution, style resolution — produces a resolved `tv()` config, and the emitter's job is to serialize that config into idiomatic source and preview sheets. There is no interface to select an implementation behind, because there is nothing to select.

```ts
// The one class/props-producing function — the seam that makes preview == export.
function slotStyles(styles: ResolvedComponentStyles, resolved: ResolvedSystem): SlotStyleMap

function emitPreview(resolved: ResolvedSystem, scope?: string): PreviewOutput
function emitExport(resolved: ResolvedSystem, codeStyle: CodeStyle): RegistryFile[]
function emitTokens(resolved: ResolvedSystem): { themeArtifact: string }  // CSS custom props
```

`slotStyles` is the single function preview and export share. Both consume the same resolved `tv()` config and the same symbolic token values, so a preview DOM and an exported file are guaranteed to carry the same class strings — the geometry (spacing, radius, OKLCH color) is identical because every value was resolved before the emitter ran.

**What the emitter does.** It prints the resolved `tv()` config as an idiomatic, compact `tv()` literal — the same shape a contributor would hand-author in `styles.ts`. Authored Tailwind flows straight through: `:has()`, `**:[svg]`, `peer-*`, descendant combinators, container queries, arbitrary selectors are all first-class in the output because they were first-class in the source and there was never a normalization pass that had to re-collapse them. It emits `themeCss` as `@theme` semantics plus `:root` plus per-cell delta blocks with paired selectors. It honors `tokenIndirection`: where a node still points at its default target, it emits the idiomatic semantic utility (`bg-primary`); where a node is retargeted, it emits the `var()` form. And it emits the declared var-writes (the menu.highlight case) verbatim, so the shipped output ships them.

The old publisher's template hole *was* a `tv()` call — `const <name>Variants = tv(%%TV_CONFIG%%)` with a forced `tailwind-variants` import and a hand-mirrored merge in `flatten.ts` that could drift from the runtime `createStyles`. Here the emitter and the preview share `slotStyles`, so there are not two merge implementations to keep in sync — there is one, and the live-variants conformance test (§5) is the single guarantee that what you see is what you own.

### Tradeoffs (emitter)

- **`slotStyles` is the largest correctness blast radius in the compiler.** A bug in it corrupts *both* preview and export at once, because they share that one function. The design accepts this concentration deliberately: one shared function with one conformance suite is safer than two hand-kept-in-sync code paths, which is exactly the runtime-`createStyles`-vs-publisher-`flatten` drift the old system lived with.
- **Idiomatic re-printing is not free.** Emitting a compact, hand-authored-looking `tv()` literal (rather than a mechanical dump of the resolved config) is real printer work. The design pays it because the whole product promise is that the exported file reads like the user's own code — a config that looks machine-generated fails the "code you own" test even when it is byte-correct.

---

## 4. `codeStyle` — typed AST transforms

`codeStyle` is the second customization layer: not what the design system *looks like*, but what the exported *code* reads like. The old publisher's entire `codeStyle` axis was two booleans (`classArrays`, `sectionComments`) implemented as string surgery — `flattenClassArrays` space-joined arrays, `applySectionComments` regex-resolved `// MARK:` markers. Here `codeStyle` is a typed schema, and every option is an AST transform over the emitter's parsed output. The invariant (CI #10) is that every transform is AST-equivalent to the canonical source modulo formatting: a transform may reshape declarations and reorder imports, but it can never change program semantics. Section boundaries derive from the `tv()` structure (base / slots / variants / compounds), never from `// MARK:` regex.

### 4.1 The full `CodeStyle` schema

```ts
interface CodeStyle {
  // Formatting (delegated to the printer; these are the printer's config, not transforms)
  format: {
    printWidth: number                         // 80
    semicolons: boolean
    quotes: 'single' | 'double'
    trailingComma: 'none' | 'es5' | 'all'
  }

  // Declaration shape
  functions: 'arrow' | 'declaration'           // export const Button = (p) => …  vs  export function Button(p) …

  // tv() style
  tv: {
    classArrays: boolean                       // grouped string[] per concern  vs  one joined string per slot/variant
    oneLinePerVariant: boolean                 // each variant value on its own line  vs  compact
  }

  // Cross-cutting
  comments: { sectionSeparators: boolean; density: 'none' | 'terse' | 'full' }
  imports: { style: 'named' | 'namespace'; sortOrder: 'source' | 'alpha'; groupBlankLines: boolean }
  layout: { styleLocation: 'inline' | 'sidecar'; barrelExports: boolean }

  // Token & density resolution (the two decisions that change emitted values, not just shape)
  tokenIndirection: 'flatten' | 'preserve'     // bg-primary (default) vs bg-[var(--color-primary)]
  density: 'baked' | 'runtime'                 // fold selected tier into classes vs ship data-density axis
}
```

Two of these — `tokenIndirection` and `density` — are special: they change the *values* emitted, not just their formatting, so they are resolved in the emitter, not applied as a post-hoc AST transform.

`tokenIndirection: 'flatten'` (default) makes a node that still points at its default target emit the idiomatic semantic utility (`bg-primary`, `rounded-lg`); `'preserve'` makes every token reference emit its `var()` form (`bg-[var(--color-primary)]`), which a user wanting maximally-explicit indirection can opt into. A *retargeted* node always emits the `var()` form regardless, because there is no idiomatic utility for a user-invented target.

`density: 'baked'` (default) folds the selected density tier into the emitted classes exactly as the old system did — `h-8` for default Button, `h-7` for compact — so the shipped file has no density dimension. `density: 'runtime'` ships the density dimension as a `data-density` attribute axis, emitting all three tiers guarded by `[data-density]` selectors so the consumer can switch density in their own app. Both are supported because density is a `sizes()` table dimension ([04-styles.md](04-styles.md)), folded at resolution time, not a build-time-only decision.

### 4.2 What each transform does to output

| Option | Effect on emitted source |
|---|---|
| `functions: 'declaration'` | rewrites `export const Button = (props) => {…}` to `export function Button(props) {…}` on the wrapper AST |
| `tv.classArrays: false` | joins each grouped `string[]` in a `tv()` slot into one space-separated string |
| `tv.oneLinePerVariant: true` | prints each variant value on its own line instead of compacting |
| `comments.sectionSeparators: true` | inserts section-separator comments derived from the `tv()` structure (never `// MARK:` anchors) |
| `imports.sortOrder: 'alpha'` | reorders import specifiers alphabetically within groups |
| `layout.styleLocation: 'sidecar'` | moves the styles out of the component file into a sibling `<name>.styles.ts` |

### 4.3 The same Button under two `codeStyle`s

Take Button's resolved `primary` variant. Under the default `codeStyle` (`arrow`, `classArrays: true`, `flatten`, `baked`, default density), the emitter produces:

```tsx
const buttonVariants = tv({
  base: [
    'group/button relative inline-flex shrink-0 cursor-interactive items-center justify-center',
    'rounded-lg bg-clip-padding font-(--btn-font-weight) whitespace-nowrap select-none',
    'transition-[background-color,border-color,color,box-shadow]',
    'focus-reset focus-visible:focus-ring',
  ],
  variants: {
    variant: {
      primary: 'bg-primary text-fg-on-primary hover:bg-primary-hover pressed:bg-primary-active',
      // …
    },
  },
})

export const Button = (props: ButtonProps) => { /* … */ }
```

Under a codeStyle of `{ functions: 'declaration', tv: { classArrays: false }, tokenIndirection: 'preserve' }`, the *same resolved Button* emits:

```tsx
const buttonVariants = tv({
  base: 'group/button relative inline-flex shrink-0 cursor-interactive items-center justify-center rounded-[var(--radius-lg)] bg-clip-padding font-[var(--btn-font-weight)] whitespace-nowrap select-none transition-[background-color,border-color,color,box-shadow] focus-reset focus-visible:focus-ring',
  variants: {
    variant: {
      primary: 'bg-[var(--color-primary)] text-[var(--color-fg-on-primary)] hover:bg-[var(--color-primary-hover)] pressed:bg-[var(--color-primary-active)]',
      // …
    },
  },
})

export function Button(props: ButtonProps) { /* … */ }
```

Same component, same resolved geometry and color, two different code shapes — and both are AST-equivalent to the canonical emitter output modulo the token-indirection and formatting choices. The exported design system reads like the user's codebase, not dotUI's.

### Tradeoffs (`codeStyle`)

- **`tokenIndirection` and `density` break the "formatting-only" purity of `codeStyle`.** They change emitted values, so they live in the emitter, not in the post-emit AST-transform pass, and the AST-equivalence invariant explicitly exempts them. The design accepts a two-tier `codeStyle` (value-affecting knobs resolved in the emitter, shape-only knobs applied as transforms) because folding density into classes and flattening token indirection are genuine product requirements that a purely-cosmetic transform layer could not express.
- **AST transforms are more machinery than string surgery.** Parsing the emitter's output, transforming a real AST, and re-printing is heavier than the old `space-join` and `regex-replace` passes. The design accepts the cost because the alternative is exactly the fragile `// MARK:` regex protocol the old system used — an in-band comment convention that broke the moment a class string happened to contain the marker text. Deriving section boundaries from the `tv()` structure instead of an in-band anchor is what makes the transforms robust.

---

## 5. Incrementality and caching

The compiler is fast because it caches aggressively, and it caches correctly because every cache is keyed on the *identity* of the node whose value it holds. Node identity is stable across edits (permanent readable ids, [05-tokens.md](05-tokens.md); stable named-style ids + `tv()` section paths, [04-styles.md](04-styles.md)), so a cache entry survives every edit that doesn't touch its node.

**What invalidates what.** The rule is: an edit invalidates exactly the cache entries whose keyed identity it changed, and their dependents.

| Edit | Invalidates | Survives untouched |
|---|---|---|
| Drag accent hue (seed change) | accent ramp's materialized cells (~2–4) | every other ramp, all resolved styles, all axis resolutions |
| Retarget a semantic token | that node's resolved value | all ramps, all resolved styles, all other tokens |
| Switch mode (light→dark) | *nothing* — `setAttribute`, cascade picks the delta block | the entire `ResolvedSystem` |
| Set `menu.highlight = accent` | menu's style resolution + runtimeVars | every other component, all tokens |
| Change Button's radius axis | Button group's resolved styles (scalar rebind) + ToggleButton, LinkButton (fan-out) | non-member components, all tokens |
| Add a mode dimension | stages 3–6 for the affected subgraph | resolved styles not referencing the new dimension |
| Define a custom named style | that component group's resolved styles + incremental novel-utility compile | all tokens, all other components |

The two most-hit caches are ramp materialization (keyed `(rampSpecHash, cellKey)`) and style resolution (keyed `(syncGroupId, resolvedSelectionsHash)`). During a hue drag, the style cache is *entirely* untouched — no component's resolved selections changed — so `resolve` skips stage 6 completely and `compile('preview')` re-emits only `themeCss`. During a named-style change, exactly one group's resolved styles invalidate and the ramp cache is untouched.

The [builder](10-builder.md)'s tier classification is the operational face of this table: a **value**-tier edit hits only the token caches and emits via `setProperty`; a **structural**-tier edit invalidates one group's resolved styles; a **global**-tier edit re-runs the graph merge. The tier is derived from what the axis's command targets, so the invalidation and the tier agree by construction — a value edit *cannot* be misclassified as touching resolved styles, because if it touched them the classifier would have called it structural.

### Tradeoffs (caching)

- **The cache keys are content hashes, not object identity.** Keying on `rampSpecHash` rather than the ramp object's reference means the worker and the server compute the *same* key for the same content — which is required for the two to agree — but it means every cache lookup hashes its input. The design accepts the hash cost because reference identity is meaningless across the worker/server boundary, and content-addressing is what lets a server export reuse a hash a previous request warmed.
- **Structural edits pay a subgraph re-resolution.** There is no per-node incremental graph solver; adding a dimension re-runs stages 3–6 for everything reachable from the change. The design accepts this because structural edits are click-frequency and the subgraph is bounded by the soft caps (4 dimensions, 24 cells), so the worst case is milliseconds, not a frame.

---

## 6. Worker/server isomorphism

`resolve` and `compile` are one bundle, deployed once, run in two places. The browser Style Worker imports it to power the live preview; the `/r/*` and `/api/*` server routes import it to power every export. There is no second implementation, so the preview and the export cannot be different programs — the failure the old system had structurally (twin pipelines: the runtime `createStyles` for preview, the publisher `flatten` for export, each half-doing the other's job) is not representable.

**The version handshake.** The compiler bundle carries a content hash — its `version` — computed over (the compiler code + the manifest baseline + the static utility layer). The client bundle and the server routes deploy from the same artifact, so in the steady state they share a version. When a client is stale — it loaded the builder, then the server deployed a new compiler while the tab stayed open — the version hashes diverge. The `ResolvedSystem` a stale client computes carries its `version`; when that client requests an export, the server compares versions and, on mismatch, **refuses** and returns a redirect-refresh signal rather than serving bytes a newer compiler would produce differently. A stale client never silently previews one thing and exports another. This closes the version-skew risk explicitly: preview equals export is guaranteed only when preview and export ran the same compiler, and the handshake enforces exactly that.

**Why one bundle and not two synchronized ones.** The alternative — a browser-optimized preview compiler and a server-optimized export compiler kept in sync — is precisely the drift surface the design deletes. One bundle costs a slightly larger client payload (the worker ships the full `resolve`/`compile`, not a preview subset) and demands that the compiler be free of server-only and browser-only dependencies (no Node built-ins, no DOM). The design accepts both costs: the payload is bounded (the manifest baseline plus the compiler, lazy-loaded into the worker), and the dependency discipline is the same purity the determinism rules (§7) already require.

### Tradeoffs (isomorphism)

- **The client ships the full compiler.** A builder session downloads `resolve` + `compile` + the emitter plus the manifest baseline. This is larger than shipping a thin preview renderer. The design accepts it because the payload is the price of the structural preview==export guarantee, and it is bounded and cacheable.
- **Every dependency must be isomorphic.** No stage may reach for a Node built-in or a DOM API. This forecloses some conveniences (a server-only fast hash, a DOM-based CSS parser) and forces isomorphic equivalents. The design accepts the constraint because a single non-isomorphic dependency would fork the bundle and reopen the drift the whole design closes.

---

## 7. Determinism rules

Because `resolve` and `compile` run in two realms and must produce byte-identical output, determinism is not a nicety — it is a correctness requirement enforced by lint and CI.

- **No ambient time or randomness.** No `Date.now()`, no `Math.random()`, no locale-dependent formatting inside the compiler. Provenance timestamps live in `ResolvedSystem.meta` and are *inputs*, never read during resolution or emission. A lint rule forbids these calls in `@dotui/compiler`, `@dotui/style`, and `@dotui/tokens`.
- **Stable ordering everywhere.** Cells are emitted in a canonical order (dimension priority, then option order). Token nodes iterate by id, not by insertion. `tv()` sections emit in normalized order. Object key iteration is never relied on for output order; every collection that reaches output is sorted by a stable key first.
- **Canonical class order.** The emitter emits utilities in a canonical order, so `bg-primary text-fg-on-primary` is never `text-fg-on-primary bg-primary` from one realm and the other. The order is a fixed function of the resolved `tv()` config's structure, not of authoring order.
- **Content-hash identity.** The dsdoc's canonical form (sorted keys, defaults omitted) has a content hash as its identity, and every intermediate cache key is a content hash. Two realms computing over the same content compute the same hashes, so their caches agree and their outputs agree.
- **Deterministic formatting.** The final printer (oxfmt) runs with a fixed config derived from `codeStyle.format`, and a formatting failure is a *typed error*, never a silent fall-through to unformatted content (the old route silently kept raw content on an oxfmt throw — invariant #10 forbids that swallow).

Determinism is what makes the cold-start parity test possible: the baked default `PreviewOutput` shipped with the builder must byte-equal a fresh server compile of the default document (invariant #1). If any stage were non-deterministic, that test could not pass, so the test is also the determinism guard.

---

## 8. Error taxonomy — typed diagnostics with source spans

Every failure the compiler can produce is a typed diagnostic, not a thrown string or a silent fallback. Diagnostics carry a machine code, a human message, and — where the failure traces to authored source — a source span. The same `validate()` that gates the builder's edit path and the CLI's `add`/`update` also produces these, so an agent editing a dsdoc through the MCP `validate` tool gets identical diagnostics to a human in the builder.

```ts
type Diagnostic = {
  code: DiagnosticCode                          // machine-stable
  severity: 'error' | 'warning'
  message: string                               // human-readable
  span?: SourceSpan                             // file, line, column — when the failure is source-traceable
  fix?: ProposedEdit                             // a machine-applicable graph edit or style delta, when one exists
}
```

The taxonomy groups by stage:

| Stage | Diagnostic family | Example |
|---|---|---|
| validate | `SCHEMA_*` | `SCHEMA_UNKNOWN_FIELD` — dsdoc has a field the schema version doesn't define |
| validate | `REF_*` | `REF_DANGLING_TOKEN` — a component delta references a token id no node declares |
| validate | `AXIS_*` | `AXIS_UNKNOWN_OPTION` — a selection names an option the axis doesn't offer |
| validate | `SYNC_*` | `SYNC_ORPHAN_DETACH` — a `detached` record names a non-member |
| migrate | `MIGRATE_UNMAPPED_ID` | a migration ladder hit an id it cannot map — loud, never dropped |
| graph merge | `GRAPH_CONTRACT_DELETE` | an overlay tried to delete a system-owned contract node |
| ramp | `RAMP_PRODUCER_UNKNOWN` | a `RampSpec` names a producer not in the registry |
| verify | `CONTRAST_BELOW_TARGET` | a derived pairing fails WCAG/APCA in a reachable cell — carries a `fix` (proposed cell-scoped graph edit) |
| style resolution | `STYLE_HARDCODED_VALUE` | a design-meaningful literal (`bg-[#635bff]`) hit the hardcoded-value lint — a warning with a token hint, not a build gate |
| emit/format | `FORMAT_FAILED` | the printer threw — a typed error, never a silent raw-content fallback |

Two properties matter. First, **`validate` is shared, not duplicated** — the builder does not have its own validation logic that could drift from the CLI's or the agent's; there is one `validate` in `@dotui/schema`, and the compiler calls it as stage 1. Second, **contrast diagnostics carry proposed fixes, never silent corrections** — a `CONTRAST_BELOW_TARGET` diagnostic includes a `fix` that is a cell-scoped graph edit the user (or `--accept-fixes` on a headless export) can apply, but the compiler never silently corrects output ([05-tokens.md](05-tokens.md)'s propose-don't-impose ruling).

Note what is *not* here: there is no `STYLE_INEXPRESSIBLE` diagnostic. Because component styles are Tailwind and a user override is raw Tailwind, there is no whitelist ceiling a construct can exceed — arbitrary `:has()`, `peer-*`, and descendant selectors are legal source, not errors. The only style diagnostic is the hardcoded-value lint, and it is a *warning a contributor can justify*, never a totality gate that blocks the build.

### Tradeoffs (diagnostics)

- **Spans depend on the tooling retaining source offsets.** A source span on a `STYLE_HARDCODED_VALUE` warning is only as precise as the offsets the parser preserved. The design invests in span-carrying (so a flagged class points at its exact character range) and accepts that graph-level diagnostics (a dangling token ref) point at a node id rather than a source range, because the dsdoc is JSON with no authored source to span into.

---

## 9. Worked example — Geist Button, edit to export

The [dsdoc chapter](09-dsdoc.md)'s worked document is Geist. Follow one axis through the whole compiler: a user forks the base doc, drags the accent hue, sets `menu.highlight = accent`, then exports.

**Fork + resolve.** The forked dsdoc pins the current manifest. `resolve` runs: validate passes, no migration (same `dsdoc:` major), graph merge folds the empty overlay over the baseline (still ~76 semantic tokens, `scheme` + `contrast` dimensions), ramp materialization computes every ramp for the two default cells (`scheme:light`, `scheme:dark`) — accent, neutral, success, warning, danger, info — axis resolution applies the base defaults, style resolution produces complete `tv()` configs for all ~72 components. The `ResolvedSystem` is warm.

**Drag the accent hue.** The builder classifies this as a **value**-tier edit (it targets a ramp seed). It sends the changed seed to the worker, which re-`resolve`s incrementally: only the accent ramp's `(accent, scheme:light)` and `(accent, scheme:dark)` cache entries invalidate; every other ramp and every resolved style survive. Stage 6 is skipped entirely — no component's resolved selections changed. `compile('preview')` re-emits only `themeCss`; the ~22 changed custom properties (`--accent-50`…`--accent-950`, the `--on-accent-*` foregrounds) land as inline `setProperty` writes on the scope root. Every `bg-primary` in the showcase, and the menu's highlight, repaint via `var()` re-substitution. Zero React renders, zero sheet swaps — the 60fps trace.

**Set `menu.highlight = accent`.** A **structural**-tier edit. `resolve` re-runs stage 6 for the menu group only (<1ms); the resolved menu styles now carry a `vars` block writing `--color-highlight: var(--accent-500)` and `--color-fg-on-highlight: var(--on-accent-500)`. `compile('preview')` emits these into `runtimeVarsCss`, `replaceSync`'d atomically. This is the exact field the old publisher dropped on export; here it is a `ResolvedSystem` field that style resolution never strips, so the next step cannot lose it.

**Export.** The user runs `npx shadcn init https://dotui.org/r/init?doc=<id>`. The `/r/*` server route calls the *identical* `compile(resolved, { kind: 'export', codeStyle })` — but first checks the version: the client that produced the doc ran the same compiler the server runs, so the handshake passes. The `tv()` emitter walks the resolved styles: Button's `primary` variant emits `bg-primary` (flatten, still-default target), the accent-derived color rides in the `theme.css` custom properties (both cells), and the menu's var-writes emit into the shipped menu CSS. codeStyle AST transforms shape the output to the user's conventions. The resulting `RegistryFile[]` carries class strings *character-for-character identical* to what the preview DOM showed — including the resolved `--color-highlight` the old system silently diverged on. Nothing previews that doesn't export. And because the styles were resolved, not lifted through a JSON intermediate, the shadcn-diff workflow a user runs against this file is a literal string diff with zero compiler in between.

**Same document, other targets.** `compile(resolved, { kind: 'tokens', format: 'dtcg' })` serializes the same resolved token graph — including the dragged accent — to DTCG for the Figma plugin. `compile(resolved, { kind: 'static-embed', view: 'showcase' })` produces a JS-free HTML fragment of the showcase, pixel-identical to the live preview, for a PR comment. Four artifacts, one `ResolvedSystem`, one compiler.

---

## 10. How this chapter's pieces meet the rest of the system

- The **`ResolvedSystem`** is the interface every other chapter compiles from: the [builder](10-builder.md) holds one in its worker; [distribution](12-distribution.md) packages `compile`'s `RegistryFile[]` per target; the [testing chapter](13-testing.md)'s cold-start, live-variants, and cascade-equivalence invariants all assert properties of `resolve`/`compile` output.
- **`resolve`'s stages** consume the [Dimensional Token Graph](05-tokens.md) (stages 3–4), the [axis system](06-axes.md) (stage 5), and the [component styles](04-styles.md) (stage 6) — this chapter is where those three models become one materialized value.
- **`validate`** is [`@dotui/schema`](02-monorepo.md)'s, shared with the [dsdoc](09-dsdoc.md) edit path, the [CLI](12-distribution.md), and the MCP agent tools — one validator, one diagnostic taxonomy.
- **The `tv()` emitter** realizes the single-engine promise: styles are Tailwind end to end, resolved not lifted, so there is one style output path and the live-variants conformance test is the single fidelity seam.

The compiler is the smallest possible surface that could satisfy the whole system: two pure functions, one resolved value between them, one bundle in two realms, one validator, one style output path. Every failure mode of the old publisher — dropped enum vars, dropped global tokens, hand-mirrored merge semantics, silent preset fallback, per-request mutable dep state — is a state this design cannot represent, because the value that flows through it is complete, symbolic, and identical on both sides of the worker/server line.
