# The axis system — every visual decision is configurable

> Part of [The Perfect dotUI](README.md) — an end-state architecture study (2026-07-04). Constitution-conformant.

An **Axis** is the atom of configurability. Every visual decision a design system can make — the accent hue, the button's fill, whether menus are translucent, the icon library, the type scale, the export code's quote style — is one `AxisDecl`. There is no visual decision hardcoded in a component, and there is no builder control not backed by a declaration. This is the mechanization of the CLAUDE.md north star: *every visual decision is a user-configurable axis of the builder, never a hardcoded choice.* When a look cannot be reached, the missing thing is a missing axis — and because the reconstruction golden docs ([chapter 07](07-reconstructions.md)) render against the real catalog, a gap is a failing test that names the axis.

This chapter is the definitive reference for the axis layer: the `AxisDecl` schema, how axes resolve against the [dsdoc](09-dsdoc.md) and pinned [Registry Manifest](03-registry.md), how sync groups and grouped tweaks work, how the value/structural/global tier is *derived* rather than declared — and then the full axis catalog, domain by domain, complete enough that [chapter 07](07-reconstructions.md) can rebuild Material 3, Geist, Linear, an enterprise system, and shadcn from it.

Axes are declarations, not values. What the user *chose* lives in `dsdoc.selections`; what an axis *is* lives in the manifest (baseline axes) or as a `dsdoc.axes` overlay (user-declared axes). The builder ([chapter 10](10-builder.md)) is a pure projection over `manifest.axes ⊕ dsdoc.axes`; the [compiler](11-compiler.md)'s `resolve()` walks the same declarations to produce a [ResolvedSystem](11-compiler.md).

---

## 1. The `AxisDecl` schema

An axis declaration is a discriminated union on `kind`, plus a common base. It lives in `@dotui/schema`.

```typescript
type AxisDecl =
  | EnumAxis | ScalarAxis | ToggleAxis | ColorAxis | FontAxis | TokenTargetAxis

interface AxisBase {
  id: AxisId                    // permanent, readable, dotted: "button.fill", "overlays.translucent"
  kind: AxisKind                // discriminant
  label: string                 // display; renamable, never referenced
  description?: string

  scope: AxisScope              // whose value is this? (§3)
  when?: WhenPredicate          // conditional existence — ONE rule for panel visibility AND resolution (§2)
  writes: WriteTarget[]         // fan-out list of where the resolved value lands (§2)

  ui?: AxisUi                   // presentation hints; never affects resolution
  deprecated?: DeprecationNote  // vocabulary lifecycle (§7)
}

type AxisKind =
  | "enum" | "scalar" | "toggle" | "color" | "font" | "tokenTarget"

type AxisScope =
  | { level: "global" }
  | { level: "group";     group: SyncGroupId }
  | { level: "component"; component: ComponentId }
```

The five things that vary per axis:

- **`kind`** picks the value type and the generated control.
- **`scope`** picks *whose* value it is — one global value, one value shared across a sync group, or one value per component.
- **`when`** makes the axis conditional; the same predicate gates panel visibility *and* whether the axis participates in resolution — one rule, never two that can disagree.
- **`writes`** is a **list** of `WriteTarget`s. Because it is a list with per-target `when` guards, one axis fans out across many tokens, style layers, files, and font faces. Grouped tweaks are this and nothing more (§4).
- **`deprecated`** carries the axis through vocabulary evolution without ever silently dropping a user's selection.

### 1.1 The kinds

```typescript
interface EnumAxis extends AxisBase {
  kind: "enum"
  values: { id: string; label: string; description?: string }[]
  default: string               // one of values[].id
}

interface ScalarAxis extends AxisBase {
  kind: "scalar"
  tokenType: ScalarTokenType    // "radius" | "spacing" | "font-size" | "blur" | "opacity"
                                //  | "shadow" | "cursor" | "border-width" | "duration" | "number"
  default: string
  // stepped picker: a curated pool. The `utility` suffix drives Tailwind class rewriting on export.
  pool?: { value: string; label: string; utility?: string }[]
  // OR a free range (continuous slider). Exactly one of pool/range.
  range?: { min: number; max: number; step: number; unit?: string }
}

interface ToggleAxis extends AxisBase {
  kind: "toggle"
  default: boolean
  labels?: { on: string; off: string }
}

interface ColorAxis extends AxisBase {
  kind: "color"
  perCell?: boolean             // per-mode-cell values (a light seed and a dark seed)
  default: string               // hex or a token id
}

interface FontAxis extends AxisBase {
  kind: "font"
  role: "sans" | "serif" | "mono" | "display"
  default: FontValue            // { source: "system"|"google"|"local"; family; stack: string[] }
  // export self-hosts google/local fonts and emits @font-face
}

interface TokenTargetAxis extends AxisBase {
  kind: "tokenTarget"
  token: TokenId                // the semantic/contract node this axis retargets
  pool: string[]                // allowed ramps ('*' = any); mirrors the node's pool
}
```

`enum` covers named styles and library picks; `scalar` covers dimensional knobs (radius, spacing, blur, durations…) with either a stepped `pool` (radius steps, shadow tiers) or a continuous `range` (radius factor, chroma multiplier); `toggle` covers switches (translucency, motion enabled); `color` covers seeds (per-cell for independent dark seeds); `font` covers family picks per typographic role; `tokenTarget` retargets a specific [Dimensional Token Graph](05-tokens.md) node (the "which ramp does `color-primary` point at" axis).

### 1.2 `writes` — where the value lands

```typescript
type WriteTarget =
  // Write a CSS custom property in a scope; `when` names the enum/toggle value that activates it.
  | { to: "cssVar"; name: `--${string}`; scope: "root" | CellKey; value?: ValueExpr; when?: string }
  // Contribute an emitted style layer to a component slot (enum options → layers).
  | { to: "styleLayer"; component: ComponentId; slot?: string; when?: string }
  // Retarget a token graph node (the tokenTarget kind, or a fan-out toggle).
  | { to: "tokenWrite"; token: TokenId; target: SemanticTarget; when?: string }
  // Swap which source file ships (loader spinner ↔ ring).
  | { to: "fileVariant"; component: ComponentId; when?: string }
  // Register an @font-face + wire the family into a font-role variable.
  | { to: "fontFace"; role: string }
```

Every write is a *description of an effect on the ResolvedSystem*, and every write is honored identically by `resolve()` whether the caller is the live preview worker or a server export endpoint — [preview equals export by construction](11-compiler.md). A `when`-guarded write only fires for the matching selected value, which is exactly how one toggle retargets four tokens (§4).

### 1.3 `ui` — presentation hints and the rich-widget registry

```typescript
interface AxisUi {
  group?: string                // panel section: "Color", "Shape", "Elevation"…
  order?: number
  advanced?: boolean            // hidden behind the "advanced" disclosure
  control?: RichWidgetId        // opt into a bespoke widget instead of the generated one
  help?: string                 // inline hint
  icon?: string
}
```

Ninety-plus percent of axes render with the **generated** control chosen by `kind`: `enum → Select/segmented`, pooled `scalar → stepped slider`, ranged `scalar → slider`, `toggle → Switch`, `color → OKLCH picker`, `font → font picker`, `tokenTarget → token picker`. `ui.control` is the one concession: it names an entry in a small **rich-widget registry** for surfaces a schema-driven control cannot express well — the color-engine editor (seed pickers, ramp strips, live contrast readout) and the literal-ramp swatch grid. **These widgets read and write ordinary selections through the same command API — they are presentation, not a second state model.** There is no parallel state universe.

`ui` never affects resolution. Two axes with identical everything-but-`ui` resolve identically; the hint only changes how the panel draws them.

### Tradeoffs

- **One schema, many kinds, means the union is load-bearing.** Every consumer — the generated control renderer, `resolve()`, the tier classifier, the reconciler — must be total over the six kinds. Adding a seventh kind touches all of them. We accept this because the alternative (per-axis hand-written React and per-axis resolution code, the thing this replaces) is worse in every dimension: it drifts, it can't be reconstruction-tested, and it can't self-describe to agents.
- **The rich-widget escape hatch is a real hole in "the panel is generated."** A handful of axes carry bespoke UI code. We bound it hard — rich widgets still emit ordinary commands, so they cannot fork the state model — but they *are* hand-written UI that the generic path doesn't cover, and their count is a metric to watch.

---

## 2. `when` — conditional axes share one rule

An axis can be conditional on another axis's value. The predicate is authored once and consumed twice: the builder hides the control when the predicate is false, and `resolve()` skips the axis's writes when the predicate is false. They cannot disagree because there is one predicate.

```typescript
type WhenPredicate =
  | { axis: AxisId; equals: unknown }
  | { axis: AxisId; in: unknown[] }
  | { all: WhenPredicate[] }
  | { any: WhenPredicate[] }
```

Worked example — the blur-strength child of translucency. `overlays.blurStrength` exists only when `overlays.translucent` is on:

```jsonc
{
  "id": "overlays.blurStrength",
  "kind": "scalar", "tokenType": "blur",
  "label": "Overlay blur",
  "scope": { "level": "global" },
  "when": { "axis": "overlays.translucent", "equals": true },
  "default": "--blur-md",
  "pool": [
    { "value": "--blur-sm", "label": "Subtle" },
    { "value": "--blur-md", "label": "Medium" },
    { "value": "--blur-lg", "label": "Strong" }
  ],
  "writes": [{ "to": "cssVar", "name": "--overlay-blur", "scope": "root" }]
}
```

When translucency is off, the control is gone from the panel *and* `--overlay-blur` is never written — the resolved system is byte-identical to a system that never declared the axis. Turn translucency on and the child reappears with its last-held value (selections persist across the predicate flipping; only *participation* is gated).

---

## 3. Resolution precedence

Any axis, at any point where its value is needed, resolves through a fixed five-step precedence. The most-specific binding that exists wins; an absent binding means "look one level up," and the floor is never "today's code" — it is the pinned manifest's frozen default.

```
component selection   (legal ONLY if the axis is component-scoped, or the component is detached — §5)
  → group selection    (for group-scoped axes; stored ONCE under the group id)
  → global selection   (for global-scoped axes)
  → dsdoc-declared default   (only for axes the dsdoc itself declared as an overlay)
  → pinned Registry Manifest default
```

```typescript
function resolveAxis(axis: AxisDecl, component: ComponentId | null, ctx: ResolveCtx): unknown {
  const { selections, docAxes, manifest, detached } = ctx
  if (component) {
    const componentScoped = axis.scope.level === "component"
    const isDetached = detached(axis.id, component)   // §5
    if (componentScoped || isDetached) {
      const v = selections.components?.[component]?.[axis.id]
      if (v !== undefined) return v
    }
  }
  if (axis.scope.level === "group") {
    const v = selections.groups?.[axis.scope.group]?.[axis.id]
    if (v !== undefined) return v
  }
  if (axis.scope.level === "global") {
    const v = selections.global?.[axis.id]
    if (v !== undefined) return v
  }
  const declared = docAxes[axis.id]?.default
  if (declared !== undefined) return declared
  return manifest.axes[axis.id].default    // frozen — the lock makes this unambiguous
}
```

The critical property: an **omitted selection means "the pinned manifest's default," never "whatever the current code says."** Because the [`lock`](09-dsdoc.md) pins an immutable manifest snapshot, that default is frozen data. A slider the user never touched cannot move under them when dotUI ships a new baseline — the new baseline is a *new manifest version*, and the doc still resolves against its own. This structurally kills the silent-reinterpretation failure mode.

### Tradeoffs

- **Five levels is more than most systems need, most of the time.** A doc that only sets a global accent walks the whole ladder to find one value. The cost is a few lookups per axis per resolve; resolve is cached per cell and per group, so it is negligible — and the alternative (fewer levels) loses either sync-group sharing or per-component override, both of which real reconstructions need.
- **Component selections are legal only under a detach or a component-scoped axis.** This is a validator-enforced invariant, not a convenience. It means the writer of a component selection must *also* have written a detach record; forgetting one is a validation error, not a silent no-op. The rigidity is the point — it makes divergence representable only when declared.

---

## 4. Grouped tweaks as fan-out axes

A grouped tweak — one switch that changes several things at once — is not special-cased code and not a merged patch. It is one axis whose `writes` list fans out, with `when`-guarded targets. Worked example: **translucent overlays**, the "make menus/popovers/tooltips frosted" switch.

```jsonc
{
  "id": "overlays.translucent",
  "kind": "toggle",
  "label": "Translucent overlays",
  "description": "Menus, popovers, and tooltips become frosted glass.",
  "scope": { "level": "global" },
  "default": false,
  "labels": { "on": "Translucent", "off": "Solid" },
  "writes": [
    { "to": "tokenWrite", "when": "true", "token": "color-menu",
      "target": { "mix": { "space": "oklch",
        "stops": [{ "ref": "color-bg" }, 0.82, { "value": "transparent" }] } } },
    { "to": "tokenWrite", "when": "true", "token": "color-popover",
      "target": { "mix": { "space": "oklch",
        "stops": [{ "ref": "color-bg" }, 0.82, { "value": "transparent" }] } } },
    { "to": "tokenWrite", "when": "true", "token": "color-tooltip",
      "target": { "mix": { "space": "oklch",
        "stops": [{ "ref": "color-inverse" }, 0.9, { "value": "transparent" }] } } },
    { "to": "cssVar", "when": "true", "name": "--overlay-backdrop-blur",
      "scope": "root", "value": "var(--overlay-blur)" }
  ]
}
```

Toggling it on fires all four `when: "true"` writes; toggling it off fires none, so the tokens resolve to their pinned defaults — solid surfaces. Its state is one boolean selection; its control is one generated `Switch`; export honors it through the same `resolve()` that the preview ran. And its conditional child `overlays.blurStrength` (§2) only appears while it is on.

**Why not a merged patch?** A grouped tweak *could* be a `SelectionPatch` that stamps the four token values into `selections` at edit time. We reject that: once merged, the switch's own state is ambiguous the moment the user edits any of the four written values, and un-applying needs an inverse patch. A fan-out axis resolves at resolve time — one selection, one switch, toggling off is just the other value, and the written tokens stay derived rather than duplicated. (One-shot **presets** — "start from Linear" — *are* `SelectionPatch`es, because they have no ongoing state; see [chapter 09](09-dsdoc.md).)

---

## 5. Sync groups as first-class registry objects

Related components form **sync groups** so that a style decision on one lands on all of them — Button and ToggleButton share fill, radius, size geometry, and must stay in sync. A sync group is a registry object, not PR discipline.

```typescript
// Manifest side — the group declaration.
interface SyncGroupDecl {
  id: SyncGroupId               // "button-like"
  label: string                 // "Buttons"
  members: ComponentId[]        // ["button", "toggle-button"]
  syncedAxes: AxisId[]          // ["button.fill", "shape.radius", "button.hoverEffect", ...]
}

// Document side — the only per-doc state a group carries.
interface SyncGroupState {
  detached?: Record<ComponentId, AxisId[]>   // per-member, per-axis opt-out
}
```

A synced axis's selection is stored **once**, under the group id, in `selections.groups[groupId]`. There is no per-member slot for a synced axis, so Button and ToggleButton *cannot* drift by accident — divergence is unrepresentable in the data model. The validator enforces two invariants: every `syncedAxes` entry appears in each member's applicable axes, and a component-scoped selection of a synced axis exists **iff** a matching `detached` record exists.

The **escape hatch** is per-member, per-axis **detach**. Real systems occasionally want "mostly synced, one intentional exception." Worked session:

Step 1 — the user sets radius on the Buttons group header. One write:

```jsonc
"selections": { "groups": { "button-like": { "shape.radius": "--radius-sm" } } }
```

Both Button and ToggleButton now render with `--radius-sm` — there is no second slot to keep in sync. The panel shows the radius control **once**, at the group header.

Step 2 — the user wants ToggleButton square while Button stays rounded. The builder writes two coupled records:

```jsonc
"syncGroups": { "button-like": { "detached": { "toggle-button": ["shape.radius"] } } },
"selections":  { "components": { "toggle-button": { "shape.radius": "0" } } }
```

Now resolution for `toggle-button`'s radius finds the component selection (legal — a detach record exists), while `button` still resolves via the group. The panel shows a "detached" chip on ToggleButton's radius; re-syncing is one click that deletes *both* records. A component selection for a synced axis with **no** matching detach record is a validation error — the exception is representable only when declared.

### Tradeoffs

- **Storing synced selections once is a hard constraint that occasionally chafes.** A member cannot quietly hold its own value "just for now"; it must detach, which writes two records. This is deliberate friction: the accidental-drift failure it prevents (Button and ToggleButton diverging because someone edited one file) is exactly the bug the model exists to make impossible.
- **Detach doubles the storage for the exceptional axis** (a detach record plus a component selection) and adds a validator rule that both must co-exist. The upside is that every divergence is auditable — a reviewer reading the doc sees exactly which member opted out of which axis and why the chip is there.

---

## 6. Tier classification is derived, never declared

Every builder edit is a [Command](10-builder.md) classified into one of three tiers — **value**, **structural**, **global** — that decide how the preview worker applies it. The tier is **derived from what the axis's writes target**, never hand-declared on the axis. This is a Constitution invariant: `tier derived from the axis schema, never hand-declared`.

```typescript
function tierOf(axis: AxisDecl): "value" | "structural" | "global" {
  const w = axis.writes
  // GLOBAL: shape changes to the graph or engine — re-emit sheets.
  if (axis.kind === "tokenTarget" && addsOrRenamesNode(axis)) return "global"
  if (isEngineOrDimensionAxis(axis)) return "global"
  // STRUCTURAL: style-layer swaps, file swaps, density tier, variant defaults — swap a rule block.
  if (w.some((t) => t.to === "styleLayer" || t.to === "fileVariant")) return "structural"
  if (axis.id === "space.density" || isVariantDefaultAxis(axis)) return "structural"
  // VALUE: pure CSS-variable / token-target / producer-config writes — inline setProperty, 60fps.
  return "value"
}
```

The mapping the Constitution fixes:

| Tier | What the axis writes | Preview mechanism |
|---|---|---|
| **value** | token / producer config / scalar / mode-flip (`cssVar`, `tokenWrite`, producer knobs) | inline `setProperty` on the scope root — zero React renders, rAF-coalesced, 60fps hue drags |
| **structural** | enum style, density, variant default, `fileVariant` (`styleLayer`, `fileVariant`) | swap a rule block / re-pick a file — one `<style>` swap |
| **global** | add/rename token, add mode or dimension, custom style, engine switch | re-emit sheets — full recompile in the worker |

The consequence: an axis author never thinks about performance. They declare `kind`, `scope`, and `writes`; the tier — and therefore whether dragging the control is a 60fps variable write or a rule swap — falls out mechanically. A hue drag on a color seed is `value` because seeds write producer config; picking `button.fill = quiet` is `structural` because it writes a style layer; adding a `midnight` scheme option is `global` because it changes the token graph's shape.

---

## 7. Deprecation — axes evolve without silent loss

Axes live in immutable manifest snapshots, so an axis never changes under a pinned doc. When the manifest evolves and a doc's `lock` is upgraded (an explicit, reviewed [`reconcile()`](09-dsdoc.md)), a `deprecated` note carries every retired axis to a typed replacement:

```typescript
type DeprecationNote =
  | { kind: "rename"; to: AxisId }                          // auto-remap the id
  | { kind: "mergeValue"; into: AxisId; valueMap: Record<string, string> }
  | { kind: "removed"; fallback: unknown; reason: string }  // snap to fallback, warned
```

No selection is ever silently dropped. A renamed axis auto-remaps its stored value; a merged axis folds via `valueMap`; a removed axis snaps to a declared fallback and surfaces a warning in the reconcile diff. The user reviews the `{ changes[], blocked[] }` report before anything changes.

---

## 8. The full axis catalog

Everything below is a manifest baseline axis unless marked otherwise. Ids are permanent and dotted by domain. `default` values reference real [Dimensional Token Graph](05-tokens.md) nodes and the real [Button fixture](04-styles.md). This catalog is sized so [chapter 07](07-reconstructions.md) can rebuild all five golden systems; where a reconstruction needs a look this catalog cannot reach, that is the failing-test signal, not a license to hardcode.

Numbers to keep consistent across chapters: ~76 shipped semantic tokens, 2 shipped mode dimensions (scheme, contrast), 3 density tiers, ~72 UI components, default ramp steps `50..950` (11 steps), soft caps of 4 dimensions / 24 reachable cells.

### 8.1 Color system

Color is the densest domain: the ramp/producer machinery is authored through the color-engine rich widget (`ui.control: "color-engine"`), but every knob is a real axis with a real write into the [token graph](05-tokens.md). Producers live in `@dotui/tokens` (`oklch`, `tailwind`, `contrast`, `material`, `fixed`, plus the open registry).

| Axis id | kind | scope | values / range | default | writes |
|---|---|---|---|---|---|
| `color.producer` | enum | global | `oklch` · `tailwind` · `contrast` · `material` · `fixed` | `oklch` | producer id on every ramp (via `tokenWrite` producer config) |
| `color.seed.neutral` | color | global | hex | `#808080` | neutral `RampSpec` producer seed |
| `color.seed.accent` | color | global | hex | `#438cd6` | accent ramp seed → `color-primary` family |
| `color.seed.success` | color | global | hex | `#3d9a50` | success ramp seed |
| `color.seed.warning` | color | global | hex | `#d97706` | warning ramp seed |
| `color.seed.danger` | color | global | hex | `#dc2626` | danger ramp seed |
| `color.seed.info` | color | global | hex | `#438cd6` | info ramp seed |
| `color.seed.accent@dark` | color | global (per-cell) | hex | *unset (auto dark)* | accent producer config under `scheme:dark` — independent dark seed |
| `color.steps` | scalar (pool) | global | `50..950` (11) · Radix `1..12` · Material tones | `50..950` | `RampSpec.steps` for all ramps |
| `color.knob.chromaMult` | scalar (range) | global | `0`–`2`, step `0.05` | `1` | `oklch`/`material` chroma multiplier |
| `color.knob.minChroma` | scalar (range) | global | `0`–`0.1`, step `0.005` | `0` | `oklch` chroma floor |
| `color.knob.hueTorsion` | scalar (range) | global | `-30`–`30`, step `1` | `0` | `oklch` per-step hue shift |
| `color.knob.chromaMode` | enum | global | `consistent` · `max` | `consistent` | `oklch` chroma strategy |
| `color.knob.preserveSeedAt` | enum | global | one of `color.steps` | `500` | step at which the seed is pinned |
| `color.knob.formula` | enum | global | `wcag2` · `apca` | `apca` | contrast target formula for `on-*` derivation |
| `color.knob.saturation` | scalar (range) | global | `0`–`100` | `100` | `tailwind` producer saturation |
| `color.knob.ratios` | scalar (range list) | global | array | producer default | `contrast` producer target ratios |
| `color.knob.tones` | scalar (range list) | global | array | Material tones | `material` (HCT) tone list |
| `color.brandRamp.*` *(overlay)* | color | global | hex | — | user-added `RampSpec` (e.g. `brand-secondary`) |
| `color.token.primary` | tokenTarget | global | pool `['neutral','accent','*']` | `neutral-950` (light) / `neutral-50` (dark) | retarget `color-primary` node |
| `color.token.*` | tokenTarget | global | per-node pool | node baseline | retarget any semantic node (`color-bg`, `color-muted`, `color-selected`, chart slots…) |
| `color.chart.1..5` | color | global | hex or `var(--<palette>-500)` | palette-derived | `color-chart-1..5` semantic nodes |
| `color.contrast.enforcement` | enum | global | `report` · `autofix` · `strict` | `report` | verification gate (not a visual write; drives export blocking) |

The `fixed` producer is first-class — pasting Geist's hand-tuned grays is `color.producer = fixed` plus a literal ramp per cell, authored in the ramp swatch grid. Dark is *never* ramp reversal; the `oklch` producer auto-derives a real dark from one seed (`isDark`-aware), and `color.seed.accent@dark` refines it only if the user wants an independent dark accent.

### 8.2 Typography

| Axis id | kind | scope | values / range | default | writes |
|---|---|---|---|---|---|
| `type.family.sans` | font (`sans`) | global | system · google · local | Geist Sans | `--font-sans` + `@font-face` (self-hosted on export) |
| `type.family.serif` | font (`serif`) | global | system · google · local | system serif | `--font-serif` + `@font-face` |
| `type.family.mono` | font (`mono`) | global | system · google · local | Geist Mono | `--font-mono` + `@font-face` |
| `type.family.display` | font (`display`) | global | system · google · local | *= sans* | `--font-display` + `@font-face` |
| `type.baseSize` | scalar (range) | global | `14`–`18`px, step `0.5` | `16` | `--font-size-base` |
| `type.scale` | enum | global | `minor-second 1.067` · `major-second 1.125` · `minor-third 1.2` · `major-third 1.25` · `perfect-fourth 1.333` | `major-second 1.125` | `--type-scale-ratio` → the type-scale `calc()` chain |
| `type.weight.normal` | scalar (pool) | global | `300`–`500` | `400` | `--font-weight-normal` |
| `type.weight.medium` | scalar (pool) | global | `500`–`600` | `500` | `--font-weight-medium` |
| `type.weight.bold` | scalar (pool) | global | `600`–`800` | `700` | `--font-weight-bold` |
| `type.letterSpacing` | scalar (range) | global | `-0.05`–`0.05`em | `0` | `--letter-spacing` |

Font roles map to typographic roles, not to a fixed family — a system that sets `type.family.sans = Inter` self-hosts Inter on export and rewires `--font-sans`. The type scale is a ratio driving a `calc()` chain of size steps, so changing it re-derives every heading/body size token at once.

### 8.3 Shape (radius)

| Axis id | kind | scope | values / range | default | writes |
|---|---|---|---|---|---|
| `shape.radiusFactor` | scalar (range) | global | `0`–`2`, step `0.05` | `1` | `--radius-factor` (multiplies every radius token) |
| `shape.radius` | scalar (pool) | group / component | `none 0` · `sm` · `md` · `lg` · `xl` · `2xl` · `full` | per-group | `--<group>-radius` (e.g. `--btn-radius`); pool `utility` suffix rewrites `rounded-(--btn-radius)` → `rounded-md` on export |

`shape.radiusFactor` is a single global multiplier that scales the whole radius scale (Geist's `0.83`, enterprise's `0`); `shape.radius` is per-group so Buttons can be `md` while Cards are `lg`. Because `shape.radius` lives on sync groups, setting it on the Buttons group hits Button and ToggleButton together (§5).

### 8.4 Space (spacing & density)

| Axis id | kind | scope | values / range | default | writes |
|---|---|---|---|---|---|
| `space.baseUnit` | scalar (range) | global | `0.2`–`0.3`rem, step `0.01` | `0.25` | `--spacing` base (Tailwind's spacing unit) |
| `space.scale` | enum | global | `tight` · `default` · `airy` | `default` | spacing-scale multiplier on gap/padding tokens |
| `space.density` | enum | global | `compact` · `default` · `comfortable` | `default` | selects the density layer in every component's `sizes()` geometry table |

**Density is not a scale factor** — it is a hand-authored geometry table per component, authored via the `sizes()` helper and selected as a whole (`compact` ≈ `style-mira`, `default` ≈ `style-nova`, `comfortable` ≈ `style-vega`; see [chapter 08](08-density-sizing.md)). It is `structural` tier: switching density swaps the density rule block. On export, `codeStyle.density` decides whether the selected tier is `baked` into classes or shipped as a runtime `data-density` axis.

### 8.5 Elevation

| Axis id | kind | scope | values / range | default | writes |
|---|---|---|---|---|---|
| `elevation.family` | enum | global | `flat` · `borders` · `soft` · `depth` · `glass` | `soft` | shadow token family + border-presence layer across cards/popovers/menus |
| `elevation.intensity` | scalar (range) | global | `0`–`2`, step `0.1` | `1` | shadow alpha/spread multiplier on the shadow tokens |
| `elevation.shadow` | scalar (pool) | component | `none` · `sm` · `md` · `lg` · `xl` · `2xl` · `shine` | per-component | `--<component>-shadow` |

The elevation **family** is the single switch that recreates a system's depth language: `flat` (no shadow, no border), `borders` (hairline borders, no shadow — Linear/Geist flat look), `soft` (subtle diffuse shadows — the shadcn default), `depth` (Material-style layered elevation), `glass` (translucent + blur, pairs with `overlays.translucent`). It fans out across every elevated surface's shadow and border tokens.

### 8.6 Motion

| Axis id | kind | scope | values / range | default | writes |
|---|---|---|---|---|---|
| `motion.enabled` | toggle | global | on / off | on | gates transition-duration tokens to `0` when off; respects `prefers-reduced-motion` |
| `motion.duration` | enum | global | `instant` · `fast 120ms` · `default 200ms` · `slow 320ms` | `default 200ms` | `--duration-base` |
| `motion.easing` | enum | global | `linear` · `ease-out` · `ease-in-out` · `spring` | `ease-out` | `--ease-base` (cubic-bezier) |

### 8.7 Interaction

| Axis id | kind | scope | values / range | default | writes |
|---|---|---|---|---|---|
| `interaction.cursor.interactive` | scalar (`cursor`) | global | `default` · `pointer` · `wait` · `progress` · `help` · `crosshair` · `grab` | `pointer` | `--cursor-interactive` |
| `interaction.cursor.disabled` | scalar (`cursor`) | global | `not-allowed` · `default` · `wait` | `not-allowed` | `--cursor-disabled` |
| `interaction.focusRing.style` | enum | global | `ring` · `outline` · `underline` · `inset` | `ring` | focus-ring style layer (shared `focus-styles` file) |
| `interaction.focusRing.width` | scalar (`border-width`) | global | `1`–`4`px | `2` | `--focus-ring-width` |
| `interaction.focusRing.offset` | scalar (range) | global | `0`–`4`px | `2` | `--focus-ring-offset` |
| `interaction.hoverEffect` | enum | group | `none` · `tint` · `lift` · `glow` | `tint` | hover style layer on the group's components |

`interaction.hoverEffect` is group-scoped so Button ⇄ ToggleButton share it. Linear's "hover-lift" is `lift`; a flat system is `none`.

### 8.8 Iconography

| Axis id | kind | scope | values / range | default | writes |
|---|---|---|---|---|---|
| `icon.library` | enum | global | `lucide` · `remix` · `tabler` · `hugeicons` · `phosphor` | `lucide` | **swaps the icon import map at publish** (a real resolution effect, not a no-op) |
| `icon.stroke` | scalar (range) | global | `1`–`2.5`, step `0.25` | `1.5` | `--icon-stroke-width` |

`icon.library` is a genuine axis: `resolve()` picks the icon import map for the chosen library, and export rewrites every icon import accordingly. It is not a build-time constant.

### 8.9 Components — per-group named styles and per-group axes

Component axes are **synthesized from the group's [Style Contract](04-styles.md) declarations**, but **exposure is curated** — internal mechanics vars never become axes; only the curated 20%-that-covers-80% named styles and knobs surface. All style axes on a group are sync-group-scoped (they hit every member).

The curated named styles per major group (`button.fill`, `alert.style`, etc. are `enum` axes; each is `structural` tier because it contributes a style layer):

| Group / axis id | members | kind | named values | default | writes |
|---|---|---|---|---|---|
| `button.fill` | button, toggle-button | enum | `default` (outline) · `primary` (solid) · `quiet` · `link` · `warning` · `danger` | `default` | `styleLayer` on the group's `root` slot |
| `button.hoverEffect` | button, toggle-button | enum | `none` · `tint` · `lift` · `glow` | `tint` | hover style layer (shared with `interaction.hoverEffect` semantics) |
| `field.style` | input, textarea, number-field, search-field, select, combobox | enum | `outline` · `filled` · `underline` · `ghost` | `outline` | field surface + border style layer |
| `field.labelPlacement` | (same field group) | enum | `top` · `inline` · `floating` | `top` | label layout style layer |
| `overlay.style` | menu, popover, tooltip, dialog, combobox-list | enum | `solid` · `translucent` · `elevated` | `solid` | overlay surface style layer (composes with `overlays.translucent`) |
| `overlay.radius` | (same overlay group) | scalar (pool) | radius pool | `lg` | `--<overlay>-radius` |
| `alert.style` | alert, callout | enum | `default` · `soft` · `outline` · `sousse` | `default` | alert surface style layer |
| `alert.radius` | alert, callout | scalar (pool) | radius pool | `lg` | `--alert-radius` |
| `badge.style` | badge, tag, chip | enum | `solid` · `soft` · `outline` · `dot` | `soft` | badge surface style layer |
| `badge.shape` | badge, tag, chip | enum | `rounded` · `pill` · `square` | `rounded` | badge radius style layer |
| `card.style` | card, panel | enum | `elevated` · `outline` · `filled` · `ghost` | `outline` | card surface + border style layer |
| `card.radius` | card, panel | scalar (pool) | radius pool | `xl` | `--card-radius` |
| `toggle.style` | switch, checkbox, radio | enum | `default` · `solid` · `soft` | `default` | control surface style layer |
| `tabs.style` | tabs, segmented-control | enum | `underline` · `pill` · `enclosed` | `underline` | tab-list + tab style layer |
| `loader.style` | loader, spinner | enum | `spinner` · `ring` · `dots` | `spinner` | **`fileVariant`** — swaps the shipped source file (`base.spinner.tsx` ↔ `base.ring.tsx`) |
| `avatar.shape` | avatar, avatar-group | enum | `circle` · `rounded` · `square` | `circle` | avatar radius style layer |

Per-group scalar axes (radius, shadow, per-component color retargets) are synthesized from each group's contract `scalar()` and `surface()` nodes; the table shows the curated exposed ones. The full ~72-component set follows the same pattern — each component belongs to a group, each group exposes a small curated set of `enum` named styles plus radius/shadow scalars; nothing internal (hit areas, hairlines, spinner geometry) is exposed.

### 8.10 Modes (dimensions)

Modes are [token-graph dimensions](05-tokens.md), edited through their own dsdoc section, but the *dimension add/remove* is an axis-shaped decision (`global` tier — it changes the graph's shape).

| Axis id | kind | scope | values | default | writes |
|---|---|---|---|---|---|
| `mode.scheme` | enum | global | dimension options `light` · `dark` (+ user-added `midnight`, `dim`…) | `light` | scheme dimension option set + `binding: media\|class` |
| `mode.contrast` | enum | global | `normal` · `hc` | `normal` | contrast dimension option set + `contrastBoost` |
| `mode.brand.*` *(overlay)* | enum | global | user option ids | — | user-added `brand` dimension |

Adding a `midnight` scheme option or an `hc` contrast option is one dimension edit; every token resolves in the new cell immediately, and the user overrides only the cells that genuinely diverge (§3 of [chapter 05](05-tokens.md)). Soft caps: 4 dimensions / 24 reachable cells.

### 8.11 Code style

`codeStyle` axes shape the *exported code*, not the rendered look. They are `global` tier (they change emitted files, not the preview surface) and are AST transforms over emitter output — never regex over comment anchors (see [chapter 11](11-compiler.md)).

| Axis id | kind | scope | values / range | default | writes |
|---|---|---|---|---|---|
| `code.format.printWidth` | scalar (range) | global | `60`–`120` | `80` | formatter print width |
| `code.format.semicolons` | toggle | global | on / off | on | semicolons |
| `code.format.quotes` | enum | global | `single` · `double` | `double` | quote style |
| `code.format.trailingComma` | enum | global | `none` · `es5` · `all` | `all` | trailing commas |
| `code.functions` | enum | global | `arrow` · `declaration` | `declaration` | function form |
| `code.tv.classArrays` | toggle | global | on / off | on | `tv()` values as grouped arrays vs one string |
| `code.tv.oneLinePerVariant` | toggle | global | on / off | off | one line per variant/slot |
| `code.comments.sectionSeparators` | toggle | global | on / off | off | section separator comments |
| `code.comments.density` | enum | global | `none` · `minimal` · `verbose` | `minimal` | comment density |
| `code.imports.style` | enum | global | `named` · `namespace` | `named` | import style |
| `code.imports.sortOrder` | enum | global | `builtin-first` · `alpha` | `builtin-first` | import sort order |
| `code.imports.groupBlankLines` | toggle | global | on / off | on | blank lines between import groups |
| `code.layout.styleLocation` | enum | global | `inline` · `sibling-styles-file` | `inline` | where the style definition lives |
| `code.layout.barrelExports` | toggle | global | on / off | off | barrel `index.ts` exports |
| `code.tokenIndirection` | enum | global | `flatten` · `preserve` | `flatten` | flatten default-target contract nodes to semantic utilities vs keep the var form |
| `code.density` | enum | global | `baked` · `runtime` | `baked` | fold the density tier into classes vs ship a `data-density` axis |

### 8.12 Engine

| Axis id | kind | scope | values | default | writes |
|---|---|---|---|---|---|
| `engine` | enum | global | `tailwind` · `stylex` | `tailwind` | selects the `EngineEmitter`; the preview *executes* the selected engine |

`engine` is `global` tier — it changes which emitter runs and re-emits everything. Both engines resolve the same [token graph](05-tokens.md) vars, so the choice is a serializer choice, not a design choice; the [preview runs the selected engine](10-builder.md), so a StyleX doc previews real StyleX.

### Tradeoffs

- **The catalog is large and its completeness is the reconstruction guarantee's foundation.** Every axis here is a maintenance surface: a control, a resolution path, a reconciliation entry, a golden-doc dependency. We accept the breadth because coverage *is* the product — an axis that "would two design systems disagree on it?" answers yes must exist, and the reconstruction tests fail loudly if one is missing. The discipline against bloat is the inverse test: mechanics (hit areas, hairlines) get no axis.
- **Curated exposure of component axes is a judgment call, not a rule the type system enforces.** "The 20% that covers 80%" is chosen per group by contributors; a genuinely-needed named style that wasn't curated is reachable only through the advanced `ComponentOverride` surface ([chapter 04](04-styles.md)), which is heavier. This is the honest cost of not auto-exposing every contract node as an axis — which would drown the panel in internal mechanics knobs.
- **`color.contrast.enforcement` is an axis that doesn't write a visual value** — it gates export. It lives in the catalog because it's a user-configurable decision, but it breaks the tidy "every axis writes a look" framing. We keep it here rather than inventing a separate config surface, at the cost of that small conceptual seam.

---

## 9. How the pieces compose

A single hue drag on `color.seed.accent` is a `value`-tier command; the worker re-runs the accent producer for each cell, writes ~22 CSS variables via `setProperty`, and the whole showcase updates at 60fps with zero React renders. Picking `button.fill = quiet` is `structural`; the worker swaps one rule block. Adding a `midnight` scheme is `global`; the worker re-emits the theme sheet. Every one of these edits is the *same* `AxisDecl` machinery — a kind, a scope, a writes list — and every one resolves identically in the export pipeline, because [preview and export share one `resolve()`](11-compiler.md).

The axis system is the reason the [builder](10-builder.md) has no per-axis React, the reason a two-year-old [dsdoc](09-dsdoc.md) opens with untouched sliders exactly where they were, the reason [agents can discover every knob](12-distribution.md) from the served manifest, and the reason [chapter 07](07-reconstructions.md) can prove — by rendering, not asserting — that Material 3, Geist, Linear, an enterprise system, and shadcn are all reachable configurations of one builder.
