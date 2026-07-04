# The builder — /create end to end
> Part of [The Perfect dotUI](README.md) — an end-state architecture study (2026-07-04). Constitution-conformant.

The builder is the surface where a user turns a blank fork into a shippable design system without writing a line of code, and watches every decision land on real components as they make it. It is one React root. It reads [Axis](06-axes.md) declarations from a pinned [Registry Manifest](03-registry.md) and renders its entire control surface from them. It mutates exactly one thing — a [dsdoc](09-dsdoc.md) — and only ever through a [Command](09-dsdoc.md#11-the-in-session-command-op-log). It previews by running the same [`resolve`/`compile`](11-compiler.md) pipeline that every export endpoint runs, in a worker, against the real registry `base.tsx` files. Preview equals export because there is no second program.

This chapter is the whole of `/create`: the information architecture, the generated panel, the command store, the Style Worker protocol, the DesignScope preview mechanism, the update-tier pipeline with its frame budgets, cold start, engine switch, docs and embed reuse, the complete user journeys, and AI assist.

---

## 1. The layout — regions of /create

`/create` is a single TanStack Start route (`apps/web`, `ssr: false` for the editing shell) with five named regions. There is exactly one panel — no `?lab=true` fork, no parallel schema. Everything below reads the same store and the same [`AxisDecl`](06-axes.md) set.

```
┌──────────────────────────────────── /create ─────────────────────────────────────────┐
│ TopBar   ⌘K search · system name · Light/Dark/HC mode · engine · Share · Export       │
├───────────────┬───────────────────────────────────────────────────┬───────────────────┤
│               │                                                   │                   │
│  PANEL        │                  STAGE                            │  INSPECTOR        │
│  (left rail)  │  ┌─ ViewSwitcher ── ModeSwitcher ── DeviceFrame ─┐│  (contextual,     │
│               │  │  single · family · showcase · style-guide      ││   right rail)     │
│  Domain nav   │  │  ─────────────────────────────────────────────││                   │
│  Colors       │  │                                                ││  selected node's  │
│  Typography   │  │        <DesignScope>                           ││  axes, expanded   │
│  Shape        │  │          real base.tsx + live style modules    ││  (macro + micro)  │
│  Space        │  │        </DesignScope>                          ││                   │
│  Elevation    │  │                                                ││  contrast readout │
│  Motion       │  │                                                ││  detach chips     │
│  Icons        │  └────────────────────────────────────────────────┘│                   │
│  Modes        │                                                    │                   │
│  Components ▸ │                    AI DOCK  (collapsible, bottom)   │                   │
│  Code         │  "make the buttons softer"  ·  paste palette/img    │                   │
└───────────────┴───────────────────────────────────────────────────┴───────────────────┘
```

- **TopBar** — global-scope actions that aren't design decisions: ⌘K command search, the editable system name, the Light/Dark/HC **mode switcher** (a value-tier `setAttribute` on the scope root — never a recompile), the **engine toggle** (`tailwind` | `stylex`), Share (mint a link / short-link / download `.dotui.json`), and Export (opens the distribution sheet, [chapter 12](12-distribution.md)).

- **Panel** (left rail) — the generated control surface, organized by **domain** (`color`, `typography`, `shape`, `space`, `elevation`, `motion`, `icon`, `mode`, `component`, `code`). Each domain section is macro-first: the two or three axes that reshape the system land at the top; the long tail sits behind an **Advanced** disclosure (`ui.advanced`). Clicking **Components** opens a scrollable list of the ~72 UI components; clicking one opens its **family editor** (§2.4).

- **Stage** (center) — the live preview. A **ViewSwitcher** picks `single` / `family` / `showcase` / `style-guide`; a **ModeSwitcher** picks the previewed cell (Light / Dark / HC, or any user-added cell); a **DeviceFrame** control picks full-width, tablet (768), or phone (390). Full-width and tablet render in the inline `DesignScope`; the phone/device frame swaps to the iframe route (§6.2). The stage mounts the exact `base.tsx` files a user exports.

- **Inspector** (right rail, contextual) — when a node is focused (a component in the panel, or a hover-to-edit target in the stage), the inspector expands that node's full axis set: its macro axes plus every micro axis, its contrast readout for color decisions, and its **detach chips** for synced axes. The inspector is where you go deep; the panel is where you steer.

- **AI dock** (bottom, collapsible) — a natural-language command emitter over the same `Command` API (§9). Type an instruction or paste a palette/screenshot/DTCG file; the AI stages a branch you preview live and Apply or Discard.

**Progressive disclosure is a property of the schema, not the layout.** `ui.group` clusters controls; `ui.order` sorts them; `ui.advanced` hides them behind disclosure; `tempo: 'macro' | 'micro'` (an `AxisDecl` hint) decides panel-vs-inspector placement. Reorganizing the IA is editing axis metadata in the manifest, not moving React.

### Tradeoffs

- **One panel means no escape valve for "just this one weird control."** A surface a schema-driven control can't express (the OKLCH color editor, the ramp grid) must be registered as a **rich widget** (§2.3) — it can't be hand-dropped into the panel as a one-off. This is deliberate: the moment a bespoke control exists outside the schema, it drifts from search, AI vocabulary, and tier classification. The cost is that adding a genuinely new kind of interaction is a manifest change plus a widget registration, not a five-minute JSX edit.
- **Contextual inspector adds a focus model.** "What am I editing?" is now stateful. Hover-to-edit and click-to-focus have to be unambiguous or the inspector feels like it jumps around. We accept a small selection-state machine to buy the depth.

---

## 2. The generated panel — AxisSchema → controls

### 2.1 One declaration drives four things

Every control in the panel is a projection of an [`AxisDecl`](06-axes.md). The same declaration drives the **control**, the **⌘K search index**, the **AI vocabulary**, and the **tier classification** (§4). There is no per-axis React and no hand-wired setter.

```ts
// the AxisDecl (full schema in 06-axes.md) as the panel consumes it —
// manifest fields plus the two builder-derived accessors (read / toCommand)
interface AxisDecl {
  id: AxisId                       // permanent, readable: 'button.fill', 'shape.radius'
  kind: 'enum' | 'scalar' | 'toggle' | 'color' | 'font' | 'tokenTarget'
  label: string
  domain: Domain                   // color | typography | shape | space | …
  scope: { level: 'global' }
       | { level: 'group'; group: SyncGroupId }
       | { level: 'component'; component: ComponentId }
  when?: { axis: AxisId; equals: unknown }     // one rule for panel visibility AND resolution
  writes: WriteTarget[]                         // where the resolved value lands (fan-out)
  ui?: { group?: string; order?: number; advanced?: boolean; tempo?: 'macro' | 'micro'; control?: string }
  keywords?: string[]; aiHint?: string
  read: (doc: Dsdoc) => unknown                 // current value for this doc
  toCommand: (value: unknown) => Command        // MUST return a real Command — a stub is a type error
}
```

The load-bearing constraint is `toCommand`. Its type signature forbids a control that does nothing: a control whose `toCommand` returns `undefined` or `never` fails to compile. Today's ~15 "stub" controls that wrote unconsumed `--ds-*` vars are unrepresentable — a control either emits a real command that flows through the resolver, or it does not exist.

`read` and `toCommand` are the only glue. A generic `<AxisControl decl={decl} value={decl.read(doc)} onChange={v => dispatch(decl.toCommand(v))} />` renders the entire panel by switching on `kind`:

| `kind` | Generated control | Notes |
|---|---|---|
| `enum` | Select / segmented control | values from the axis; ≤4 values → segmented, else Select |
| `scalar` | Stepped slider over `pool`, or continuous slider over `range` | pooled = radius/blur/opacity/shadow; continuous = radius factor 0–2 |
| `toggle` | Switch | fan-out axes (translucency) are one switch (§2.5) |
| `color` | Rich widget: OKLCH picker + per-cell tabs | `ui.control: 'color-engine'` |
| `font` | Font picker (family + weight), self-hosted on export | swaps `fontFace` write |
| `tokenTarget` | Token picker (retarget a component var to a semantic node) | e.g. `menu.highlight → color-accent` |

### 2.2 Component axes are synthesized, exposure is curated

Component axes are synthesized from the [Style Contract](04-styles.md) declarations of a sync group (`defineContract()` / `surface()` / `scalar()` in `styles.ts`) — a single source, so there is no drift between a meta default, a `:root` var, and a token map. But **exposure is curated**: an internal mechanic var (a hairline width, a hit-area inset) is not an axis unless the contract marks it exposed. The generated panel never auto-surfaces every `--component-*` var; the project's own "component mechanics stay plain values" rule holds at the axis boundary.

### 2.3 The rich-widget registry

Two surfaces defeat a pure schema-driven control, and both are registered via `ui.control`:

- **`color-engine`** — the OKLCH color engine editor: per-palette seed pickers, live ramp strips generated from the selected [producer](05-tokens.md), a contrast readout (WCAG2 / APCA against every reachable [cell](05-tokens.md#4-modes-are-dimensions)), and a per-cell tab strip (author `dark` and `hc` independently). It writes ordinary `tokens`/`selections` commands — it is presentation over the same state, not a second state model.
- **`ramp-grid`** — the literal-ramp swatch grid for `producer: 'fixed'`: paste Geist's hand-tuned grays cell by cell. Each swatch edit is one `RampSpec` write.

A rich widget receives `{ decl, doc, dispatch }` and is bound by the constraint that it may only mutate the doc through `dispatch(Command[])`. It cannot reach around the store.

### 2.4 The family editor

Opening a component in the panel opens its **sync group** (family) editor, not a lone component. Button, ToggleButton, and LinkButton share a [sync group](06-axes.md#5-sync-groups-as-first-class-registry-objects); their synced axes render **once** at the group header. Editing `button.fill` at the header restyles every member in the same command — the [selection is stored once under the group id](09-dsdoc.md), so divergence is unrepresentable by accident.

The **detach chip** is the escape hatch. To make ToggleButton square while the rest of the family stays rounded, the user clicks "detach radius on ToggleButton"; the builder writes a `detach` record *and* a component-scoped selection in one command. The chip appears next to that member; re-sync is one click (delete both records). The validator enforces that a component-scoped value for a synced axis exists **iff** a detach record does.

### 2.5 Grouped tweaks as fan-out axes

A grouped tweak — "translucent menus, popovers, and tooltips" — is one `toggle` axis whose `writes` is a **list** with per-value `when`:

```ts
{
  id: 'overlays.translucent', kind: 'toggle', label: 'Translucent overlays',
  scope: { level: 'global' }, ui: { group: 'elevation', tempo: 'macro' },
  writes: [
    { to: 'tokenWrite', token: 'color-menu',    target: { mix: { space: 'oklab', stops: [{ ref: 'neutral-50' }, 0.85, { value: 'transparent' }] } }, when: 'on' },
    { to: 'tokenWrite', token: 'color-popover',  target: { /* … */ }, when: 'on' },
    { to: 'cssVar', name: '--menu-backdrop-blur', value: '12px', scope: 'root', when: 'on' },
  ],
}
```

One generated switch. Toggling off is just the other value — no inverse patch, no ambiguity when a written token is later hand-edited. A **one-shot preset** (a "personality" or "start from Linear") is different: it is a `SelectionPatch` applied once at edit time as a `batch` command, because it has no ongoing state.

### Tradeoffs

- **The `toCommand` guarantee costs authoring flexibility.** Because a control must produce a real command, a genuinely new axis needs a corresponding `WriteTarget` and resolver support before it can render — you can't prototype a control that "does nothing yet." That is the point (stub controls are the disease), but it means the panel can never run ahead of the resolver.
- **Synthesized component axes depend on contract discipline.** If a contributor exposes a mechanic var they shouldn't, it becomes a user-facing axis. The curation lives in the contract, so a sloppy contract leaks a bad axis. CI lints for exposure, but the judgment is human.

---

## 3. The command store — op-log, invertible, coalescing, branchable

Nothing mutates the dsdoc except a `Command`. The panel, the rich widgets, the AI dock, the paste-import flow, and preset galleries are **all command emitters over the identical API**. This is the single mutation seam.

```ts
type Command =
  | { t: 'palette.setSeed';   id: PaletteId; seed: string }
  | { t: 'palette.setKnob';   id: PaletteId; knob: string; value: unknown }
  | { t: 'ramp.setStep';      id: PaletteId; cell: CellKey; step: string; value: string } // fixed producer
  | { t: 'token.add';         node: SemanticToken }
  | { t: 'token.rename';      id: TokenId; name: string }        // renames emitted var; id is permanent
  | { t: 'token.retarget';    id: TokenId; cell: CellKey; target: SemanticTarget }
  | { t: 'mode.addDimension'; dim: ModeDimension }
  | { t: 'mode.addOption';    dim: DimId; option: string }
  | { t: 'axis.set';          axis: AxisId; scope: SelectionScope; value: unknown }  // panel writes
  | { t: 'group.detach';      group: SyncGroupId; component: ComponentId; axis: AxisId }
  | { t: 'component.override'; component: ComponentId; delta: StyleContractDelta }    // custom style
  | { t: 'engine.set';        engine: 'tailwind' | 'stylex' }
  | { t: 'codeStyle.set';     patch: Partial<CodeStyle> }
  | { t: 'batch';             label: string; cmds: Command[] }   // one undo step
```

### 3.1 Invertibility, coalescing, batches

The store is an **op-log** ([per the decision log](00-decision-log.md), a custom LWW-cell command log with a sync/presence seam — not a full CRDT). Each command is **invertible**: applying it produces both the forward patch and its inverse, so undo/redo is O(1) — no doc snapshots.

- **Coalescing**: consecutive value-commands targeting the same `(node, key)` cell collapse into one undo entry. A hue drag is a stream of `palette.setSeed` ops on the same palette; the whole drag start→end is **one** undo step. This generalizes today's ad-hoc shuffle batching into a store property.
- **`batch`**: an explicit one-undo-step group — an AI turn, a preset apply, the shuffle (accent + radius + density in one step), a detach (detach record + component selection together).
- **LWW cells**: commands are last-writer-wins on independent `(node, key)` cells. Two edits to different cells never conflict; two edits to the same cell resolve by order.

### 3.2 Branches, named systems, server sync, presence

- **Branches** are op-log forks. The AI stages proposals on a throwaway branch (§9); the user previews it live and merges (as one undo step) or discards.
- **Named systems** are dsdoc ids on the server. Sharing is a link to an id, not an 8KB compressed query param — no URL ceiling, no unversioned-diff fragility. The anonymous flow keeps a `#doc=` fragment for tiny docs and falls back to a server short-link or a `.dotui.json` download on overflow ([chapter 09](09-dsdoc.md)).
- **Server sync** is `POST/GET /api/systems`: append-only immutable versions, dedup by content hash, fork with `forkedFrom`, history / restore / visual-diff.
- **Presence** is a channel over the same log. Because commands are LWW on independent cells and the branch primitive already exists, multiplayer is a channel wiring on the day-one seam — the store is **presence-ready** by construction, not rearchitected later.

The persisted artifact is always the canonical dsdoc; the op-log is the in-session editing representation.

### Tradeoffs

- **The op-log is heavier than a URL string for a single-user session.** A one-off "tweak the accent and leave" pays for an infrastructure a solo doodle doesn't need. We accept it because the URL-diff model's silent-reinterpretation bug and URL-length ceiling are worse, and because the sync seam has to exist from day one or presence is a rewrite.
- **LWW is not full CRDT merge.** Two users editing the *same* cell lose one edit (last writer wins) rather than merging. For design-system editing — where cells are semantically independent (accent seed vs. button radius) — this is almost always right, and it is dramatically simpler than Yjs/Loro. Genuinely concurrent edits to one cell are the accepted cost.

---

## 4. The tier pipeline — commands classified, cost bounded

Every command is classified into exactly one tier, and the classification is a **pure function of the axis-schema node the command targets** — never hand-declared per command. This is what makes misclassification impossible and every new axis correctly classified for free.

```ts
function classify(cmd: Command, manifest: Manifest): 'value' | 'structural' | 'global' {
  // derived from what the command's WriteTarget touches:
  // token value / producer knob / scalar var / mode-flip  → 'value'
  // enum style / density / default variant / fileVariant   → 'structural'
  // add/rename token · add mode/dimension · custom style ·  → 'global'
  //   engine switch
}
```

| Tier | Command targets… | Mechanism | Cost | React render |
|---|---|---|---|---|
| **value** | a token value, palette seed/knob, scalar var, mode/cell switch | worker producer (if palette) → batched `setProperty`; mode = one `setAttribute('data-scheme')` | ≤1 frame | none |
| **structural** | which classes apply: enum style, density, default variant, group axis; `fileVariant` enums | worker refolds *only affected components* → live style module swaps its class map; fileVariant → scoped keyed remount | <1–3ms | affected components only |
| **global** | the token/utility universe or the engine: add/rename token, add mode/dimension, custom style, engine switch | worker full recompile (+ incremental Tailwind WASM if new utilities) → atomic three-sheet replace | ~5–20ms, click-frequency | scoped |

The value tier is the whole game for 60fps: a value-tier command writes CSS custom properties and **nothing else** — no sheet rewrite, no React render, no class recomputation. `bg-primary` is always `background-color: var(--color-primary)`; dragging a hue changes the *value* of `--color-primary`, never *which utility exists*.

### 4.1 The 60fps trace — hue drag over a full showcase

```
pointermove (120Hz) → rAF-coalesced → postMessage {palette.setSeed} (~200 bytes)   <0.2ms main
  Style Worker: producer for the ONE changed ramp, per reachable cell (~11 steps)   1–4ms OFF-main
  ← postMessage VarOp[] (~22 entries: --accent-50…950, --on-accent-*)
main: for (k,v) of ops  scopeRoot.style.setProperty(k, v)   ×22                     <0.3ms
browser: var-only invalidation (flat static sheets, no selector re-match) + paint   3–8ms + 2–4ms
                                                        main-thread total ≈ 12ms < 16.6ms
```

Why it holds where an iframe+postMessage architecture collapses: the worker **holds the ResolvedSystem** and receives only tiny classified edits — no whole-doc structured-clone per tick, so value-keyed producer caches survive across frames. **Backpressure**: the worker keeps *one pending value-edit per key*, dropping superseded mid-drag frames; structural and global edits are never dropped.

### 4.2 The hue-drag frame budget

The 16.6ms budget, itemized, for the worst realistic case (one accent palette, three reachable cells — Light, Dark, HC — over a showcase of ~120 component instances all reading accent vars):

| Step | Where | Budget | Notes |
|---|---|---|---|
| rAF coalesce + postMessage out | main | <0.2ms | ~200-byte message, one per frame |
| producer run (1 ramp × 3 cells × 11 steps) | worker | 1–4ms | off main thread; per-ramp incremental, caches survive |
| postMessage in (VarOp[]) | main | <0.2ms | ~22 small strings (`--accent-50…950`, `--on-accent-*` for the active cell) |
| `setProperty` writes | main | <0.5ms | ~22 writes on the single scope root |
| style invalidation (var-only) | browser | 3–8ms | flat static sheets → no selector re-match |
| paint / composite | browser | 2–4ms | proportional to on-screen area, not component count |
| **main-thread total** | | **≈ 12ms** | **headroom under 16.6ms** |

Zero React renders. Zero sheet swaps. Zero class recomputation. The only per-frame main-thread work is ~22 `setProperty` calls and the browser's own var invalidation.

### Tradeoffs

- **Producer cost is real, off-thread but not free.** A knob that forces *every* palette to recompute (a global chroma mode change, not a single-hue drag) does more worker work per frame; on a low-end device a huge showcase reading all six palettes could approach budget. The mitigation is per-ramp incremental recompute and one-pending-per-key backpressure; the hard cap is the [soft limit of 4 dimensions / 24 cells](05-tokens.md).
- **Structural edits render components.** Density and enum-style changes are keypress-frequency, not drag-frequency, so a few-ms refold of affected components is well within budget. But a change that touches every component (a global density flip) is the most expensive structural edit — a full refold. We accept it because density is [hand-authored geometry tables](08-density-sizing.md), not a scale factor, and the fidelity is worth the refold.

---

## 5. The Style Worker protocol

The Style Worker is where the compiler lives on the client. It boots with the bundled compiler + manifest snapshot, holds the `ResolvedSystem`, and speaks a small message protocol.

### 5.1 What it holds

```ts
// worker-resident state
{
  manifest: Manifest,             // pinned snapshot, bundled at build
  resolved: ResolvedSystem,       // current fully-resolved system (per-cell token values, per-group Contracts)
  producerCache: Map<CacheKey, Ramp>,   // per (palette, cell, knobs) — survives across value edits
  utilitiesSheet: string,         // static precomputed utility layer (~40KB) + incrementally appended novel classes
  engine: 'tailwind' | 'stylex',
}
```

### 5.2 Message types

```ts
// main → worker
type ToWorker =
  | { t: 'init'; doc: Dsdoc }                          // boot: resolve the whole doc once
  | { t: 'edit'; cmd: Command; tier: Tier; seq: number } // one classified command
  | { t: 'warm'; view: ViewId }                        // pre-resolve a view's component set
  | { t: 'compileExport'; codeStyle: CodeStyle }       // preview the export output offline

// worker → main
type FromWorker =
  | { t: 'boot'; version: string }                     // content hash of (compiler + manifest + utility layer)
  | { t: 'varOps'; seq: number; ops: VarOp[] }         // value tier: [--accent-500, oklch(…)] pairs
  | { t: 'styleTrees'; seq: number; components: Record<ComponentId, StyleTree> } // structural tier
  | { t: 'sheets'; seq: number; output: PreviewOutput } // global tier: themeCss / utilitiesCss / runtimeVarsCss
  | { t: 'exportFiles'; files: RegistryFile[] }        // the offline export preview
```

- **`init`** resolves the whole doc once; the worker returns the full `PreviewOutput` (three sheets).
- **`edit`** carries one classified command and a monotonically increasing `seq`. The response type matches the tier: value → `varOps`, structural → `styleTrees`, global → `sheets`.
- **`warm`** pre-resolves a view's component set before the user switches to it — the payload-budget answer for lazy hydration.
- **`compileExport`** runs `compile(resolved, { kind: 'export', engine, codeStyle })` in the worker so the code-style modal previews the *actual served bytes*, instantly, offline.

### 5.3 Backpressure and ordering

The worker tracks `seq`. For **value-tier** edits it keeps only the latest pending edit per `(node, key)` cell — mid-drag frames that are already superseded are dropped, so a 120Hz drag never queues 120 producer runs. **Structural and global** edits are never dropped and never reordered relative to each other. The main thread ignores a `varOps` message whose `seq` is older than the last applied structural/global commit (a late value frame can't stomp a newer structural swap).

### Tradeoffs

- **The worker must stay in lockstep with the server compiler.** `boot.version` is a content hash of (compiler + manifest + utility layer); the client bundle and the `/r/*` routes deploy from the same artifact. A stale client is caught by a version handshake and refreshed — the client/server skew risk is closed explicitly, but it is a coupling: you cannot ship a compiler fix to the server without shipping the same worker.
- **The worker holds a full ResolvedSystem in memory.** For a large doc with many custom overrides this is real memory. The `warm` protocol lets the component set hydrate per view rather than all-at-once, but the token graph and manifest are always resident.

---

## 6. DesignScope — the preview mechanism

The preview renders **in the same React tree as the panel**, inside `<DesignScope>`. No iframe in the editing loop. This is what buys hover-to-edit, AI selection highlighting, and the death of the postMessage identity barrier.

### 6.1 Internals — scoped closure from the queryable graph

`DesignScope` establishes a scoped style boundary with four mechanisms:

1. **Three adopted stylesheets** on the scope, via `adoptedStyleSheets`:
   - **`themeSheet`** — the [Dimensional Token Graph](05-tokens.md) as CSS custom properties, one block per cell gated by data-attributes (`[data-scheme=dark]`, `[data-contrast=hc]`). Switching a mode is one `setAttribute` — value tier, zero recompile. Adding a cell is a global-tier re-emit of this one sheet.
   - **`utilitiesSheet`** — the engine layer: the static precomputed utility rules, appended incrementally on new-utility events, replaced only on engine switch.
   - **`runtimeVarsSheet`** — component contract vars (`menu.highlight`), replaced atomically (`replaceSync`) on structural edits in the same microtask as the React commit → one consistent paint, no FOUC.

2. **Scoped closure from the queryable graph — no CSSOM scraping.** The scope's token variables come **directly from the resolved `TokenGraph`**, emitted under `[data-dotui-scope=<hash>]` selectors. Because the worker owns a queryable resolved graph, the scope closure is *generated*, not *harvested* from `document.styleSheets`. There is no reading the page's computed `:root` custom properties, no CSSOM walk, no cache of scraped declarations. This is the decisive difference from a scrape-the-root approach: the scope is a projection of data the compiler already holds.

3. **Portal redirection** — React Aria overlay portals (menus, popovers, tooltips) are redirected into a scope-marked container via `UNSAFE_PortalProvider`, so an overlay rendered through a portal still inherits the scope's tokens and utilities rather than the app's.

4. **Containment** — `contain: layout style` (and `paint` where safe) on the scope root bounds layout/paint invalidation to the preview subtree, so a value-tier var write repaints the showcase, not the whole builder chrome.

### 6.2 Views and device frames

The stage mounts the **canonical registry `base.tsx` sources** — the exact files a user exports. The one deliberate seam is behind the import boundary that already exists: in preview, `./styles` resolves to a **live style module**:

```ts
export const buttonVariants = createLiveVariants('button')
// tv-signature-compatible callable over a subscribable class map fed by the worker.
// Structural edit → worker sends new StyleTree → swap map → notify → only Button re-renders.
// INVARIANT (CI): createLiveVariants('button')(props) === tv(emitFiles('button', …).config)(props)
//   PLUS computed-style sample diffs — the one preview seam is property-tested AND rendered-and-diffed.
```

**Four views**, all plain React over the same compiled system — switching views never recompiles:

- **single** — one component, its full variant × size × state matrix.
- **family** — a sync group side by side (Button ⇄ ToggleButton ⇄ LinkButton), for verifying sync.
- **showcase** — composed pages: forms, cards, menus, a settings layout — the "does the whole thing hang together" view.
- **style-guide** — the ramps, the contrast matrix, the type scale, the token table — the system documenting itself.

**Device frames** are the one place the iframe returns. Registry authoring **mandates container queries**, so components reflow inside a fixed-width inline scope for tablet/full-width. But a component using *viewport* media queries won't reflow in a fixed-width container — so the **phone/device frame uses the iframe route** `/embed/:docId/:view`, which gives a true viewport. Both mechanisms exist, each where it is right ([arbiter ruling](00-decision-log.md)).

### 6.3 Cold start — baked PreviewOutput

The default doc's full `PreviewOutput` is **baked at dotUI build time** and adopted instantly on load. The worker boots (~30–80ms), resolves the user's doc, and swaps atomically. There is no unstyled frame, ever. A CI invariant asserts the baked default `PreviewOutput` **byte-equals a fresh server compile** of the default doc — cold start and export are the same bytes.

### 6.4 Engine switch

Switching engine is a **global-tier** edit: the worker re-runs `compile` with the [StyleX emitter](04-styles.md) over the same resolved system, generates atomic rules (deterministic JS hash-and-emit, no WASM), the three sheets swap atomically, and one scoped re-render lands. The button is pixel-identical because the fold and every resolved value were computed *before* the emitter ran — the emitter is the last step. A static precomputed atomic layer for the base doc keeps StyleX cold start on par with Tailwind's.

### 6.5 Docs-page preview reuse

Every docs demo mounts `<DesignScope>` fed by the reader's stored doc. The worker compiles it once per page; sheets are scoped by `[data-dotui-scope=…]` and refcounted across demos on the page. **Same compiler, same components** — the docs are a standing proof of fidelity, and the reader browses the library styled as *their* system.

### 6.6 Embeds — two tiers

- **Live embed** — `/embed/:docId/:view`: an iframe route running the identical worker + compiler; loads the doc once by id, self-contained afterward. This is also the device-frame mechanism (§6.2).
- **Static embed** — the server runs `compile(resolved, { kind: 'static-embed', view })` once and emits a cacheable HTML fragment + static CSS: **no JS required to render**, CSP-safe, perfect for blog posts, PR comments, and og-images.

### Tradeoffs

- **Scoped-inline trades hard isolation for speed and context.** A badly-behaved showcase component or a user-defined token colliding with an app var could in principle leak across the scope boundary in a way an iframe would contain. Containment + scoped selectors + portal redirection mitigate it, but getting portal/overlay redirection right for every RAC component is ongoing rigor. We keep the iframe for genuine isolation (device frames, third-party embeds) and accept the closure approach in the editing loop because the identity barrier is the root of the perf cliff.
- **The live-style-module shim is the one fidelity seam.** The whole "preview equals export" claim rests on `createLiveVariants(x)(props) === tv(exportedConfig)(props)`. It is not trusted — it is property-tested across every `base.tsx` pattern (slotless, slotted, compound variants) *and* computed-style-diffed on a sample matrix. But it is a shim, and any `base.tsx` that reaches around the `./styles` import breaks the guarantee. The import-boundary lint is load-bearing.

---

## 7. The complete user journeys

### 7.1 Blank start

A user opens `/create` with no doc. They fork the **default dsdoc** (never a diff against code-derived defaults — [defaults are frozen data in the pinned manifest](09-dsdoc.md)). The baked cold-start `PreviewOutput` paints the default system instantly; the worker boots and confirms.

1. **Colors.** They open the color editor (rich widget). They drag the accent hue — value tier, the §4.1 trace, 60fps over the showcase. Every `bg-primary`, the menu highlight, and any accent-referencing custom style repaint via `var()` re-substitution. Zero React renders. Undo afterward is one coalesced entry.
2. **Shape.** They set the radius factor — a continuous scalar, value tier: one `setProperty('--radius-factor', …)`, and every `rounded-(--btn-radius)` chain (which is `calc(var(--radius-factor) × …)`) recomputes. No recompile.
3. **Density.** They pick `comfortable` — structural tier: the worker refolds all components against the [comfortable geometry table](08-density-sizing.md) (~2–3ms), swaps live style modules, one paint.
4. **Components.** They open Buttons (the family editor), set `button.fill: quiet` at the group header — restyles Button and ToggleButton together (structural), the family view confirms sync.
5. **Export.** The footer shows `npx shadcn init https://dotui.org/r/init?doc=<id>`; the code-style modal previews the real `button.tsx` by calling `compileExport` in the worker — instant, offline, provably the served bytes.

### 7.2 Import my brand

Three import paths, all landing as commands in a fresh (or forked) doc — [chapter 12](12-distribution.md) owns the endpoints; here is the builder-side flow.

- **Paste a palette.** The user pastes hex ramps (or a flat list of brand hexes) into the AI dock or the ramp-grid widget. Flat hexes → the color editor seeds the generative producer per palette; full ramps → the `fixed` producer's literal-ramp cells, cell by cell. Each edit is a `ramp.setStep` / `palette.setSeed` command; the whole paste is one `batch`. The [contrast verifier](05-tokens.md#8-verification-per-cell-structural-propose-dont-impose) runs incrementally and flags any pairing below target.
- **Paste a screenshot.** The user drops a screenshot of a product UI. Vision extraction (§9) returns `{ commands, confidence, unmapped }`. The `commands` are staged on a branch; the user previews the extracted accent, radius, density, and button fill live. `unmapped` ("gradient buttons — no axis covers this") is surfaced as a note (§9).
- **Paste DTCG.** The user pastes a W3C DTCG tokens file. The [`@dotui/tokens` DTCG deserializer](05-tokens.md) maps it onto the token graph: dimension → collection, node → variable, ids from `$extensions.dotui.id`. The result is a `batch` of `token.add` / `token.retarget` commands. Modes in the DTCG file become mode dimensions.

### 7.3 Refine

With a system in place, the user drives the panel: enum styles per component, per-component radius, the translucency fan-out switch, a custom named style for the primary button (a `component.override` — global tier, the incremental Tailwind pass compiles any novel utility). The family editor keeps synced groups in step; detach chips handle the one intentional exception.

### 7.4 Verify contrast

The style-guide view shows the contrast matrix: every derived pairing ([from contract `pairsWith`, `on`-values, and declared semantic pairs](05-tokens.md)) against every reachable cell, WCAG2 + APCA, with HC cells held to higher targets. A failing pairing surfaces a **proposed cell-scoped graph edit** (never silent output correction) — the user accepts the fix as a command or overrides it. Verification is incremental on edit, full-matrix at export.

### 7.5 Export

The user opens the distribution sheet. Every target reads one `ResolvedSystem` through the same `compile`: shadcn CLI (`/r/init` + `/r/<item>?doc=…`), v0 / Bolt / Lovable bundles, plain zip, DTCG / Figma, MCP / agents. The shadcn init writes `dotui.lock.json` (doc id/version, manifest pin, engine, pristine file hashes, codeStyle) so `npx dotui update` later runs a pure `plan()` — clean overwrite for untouched files, 3-way merge for edited ones. Nothing previews that doesn't export, because the export path *is* the preview path.

---

## 8. Worked micro-example — Button + Menu, five edits

Fixtures are the real registry files: `@dotui/registry`'s `button/styles.ts` (density × size geometry tables, `rounded-(--btn-radius)`, `font-(--btn-font-weight)`, the `**:[svg]:not-with-[size]` icon-size selectors, `pending:`/`disabled:` states) and Menu (highlight contract vars).

1. **Add an HC cell.** ⌘K → "high contrast" → `{ t: 'mode.addOption', dim: 'contrast', option: 'hc' }`. Global tier: the worker resolves every ramp/token for the `contrast:hc` cell (the `contrast` producer raises targets toward AAA), re-emits `themeSheet` with a new `[data-contrast=hc]` block, `replaceSync`. ~15ms, one click. The mode switcher now offers HC; switching to it is `setAttribute('data-contrast','hc')` — value tier.
2. **Set `menu.highlight = accent`.** `axis.set` on the menu's highlight tokenTarget → structural tier → worker refolds *menu only* (<1ms), returns menu's `StyleTree` + `runtimeVarsSheet` now carrying `--color-highlight: var(--accent-500); --color-fg-on-highlight: var(--on-accent-500)`. One consistent paint. **This exact contract var also drives export** — the axis that a preview-only architecture silently drops cannot diverge here.
3. **Define a custom Button style `brand-cta`** with a novel utility (`backdrop-saturate-150`). `component.override` → global tier: the fold includes the user's Contract delta; the worker's incremental Tailwind pass compiles the one novel utility (~5ms) and appends it to `utilitiesSheet`; family fan-out restyles ToggleButton in the same commit. The family view shows both in sync.
4. **Drag the accent hue.** Value tier, the §4.1 trace: rAF-coalesced seed ops → producer (accent ramp only, per cell) → ~22 `setProperty` writes/frame. `bg-primary`, the menu's `--color-highlight`, and `brand-cta`'s accent refs all repaint via `var()` re-substitution. ~12ms/frame, zero React renders. Undo is one coalesced entry.
5. **Switch engine to StyleX.** Global tier: same resolved system, StyleX emitter, atomic rules generated in-worker, three sheets swap, one scoped re-render. The button is pixel-identical — the fold and every resolved value were computed before the emitter ran.

---

## 9. AI assist

The AI's action space is `dispatch(Command[])` — the **identical seam the panel uses**. AI edits are undoable, presence-visible, and previewed through the same tiers at the same speed. The AI is a first-class driver, not a suggestion bolt-on.

### 9.1 The command emitter

- **Context**: the `AxisDecl[]` (with `aiHint`s) + the materialized doc. The AI knows exactly what is changeable and how to change it — the schema is its vocabulary. It cannot invent a mutation the schema doesn't declare.
- **Staged branches**: a proposal is dispatched to a **throwaway op-log branch** (§3.2). The user sees before/after live in the preview and Applies (branch merges as one `batch` undo step) or Discards.
- **Self-verification**: because `compile()` is pure and in the worker, the AI **compiles its own proposal** before presenting it — it runs the [contrast verifier](05-tokens.md) over the resolved graph and inspects the export files, so it can catch a below-target pairing or a broken override *before* the user ever sees it.

```
user: "make the buttons softer"
  AI reads AxisSchema (aiHints) + doc
  → stages on branch b:  { t:'batch', label:'Soften buttons', cmds:[
        { t:'axis.set', axis:'shape.radius', scope:{group:'button-like'}, value:'--radius-lg' },
        { t:'axis.set', axis:'button.hoverEffect', scope:{group:'button-like'}, value:'lift' } ] }
  worker compiles branch b · AI runs contrast check · preview shows before/after
  user Applies → branch merges as one undo step
```

### 9.2 Screenshot import and the unmapped-axis signal

Screenshot-to-theme is vision extraction → `{ commands, confidence, unmapped }`:

```ts
interface ScreenshotImport {
  commands: Command[]              // staged on a branch, previewed live
  confidence: Record<AxisId, number>  // per-axis extraction confidence
  unmapped: { observation: string; note: string }[]  // looks with no covering axis
}
```

`unmapped` is the **missing-axis product signal**. "Gradient buttons — no axis covers this" is not a failure to swallow; it is instrumented feedback that the axis set has a gap. The [north star's "flag the missing axis" discipline](../../../CLAUDE.md) is automated: every screenshot import that can't be fully mapped tells the team precisely which visual decision needs a new axis. `confidence` drives the refine loop — low-confidence axes (elevation, motion, which vision is genuinely weak at) are flagged for the user to confirm rather than applied silently.

### Tradeoffs

- **Vision confidence is inherently soft.** The extractor is reliably right on accent, radius, and density; it is unreliable on elevation, motion, and subtle type. The `confidence` map and the staged-branch preview mean the user catches mistakes before Apply, but the import-then-refine loop leans on the user's eye — an unattended import is not trustworthy.
- **The AI can only reach what the schema declares.** This is the safety (it can't emit an unrepresentable mutation) *and* the ceiling: a look the axis set doesn't cover is unreachable by the AI exactly as it is unreachable by the panel. That is correct — but it means the AI's power grows only when the axis set does, which is the `unmapped` signal's whole point.
