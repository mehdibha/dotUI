# Open in Figma

> Summary line: **possible (custom plugin, the realistic path)** · button type **plugin** · preset fidelity **full** · color fidelity **partial** (OKLCH → sRGB hex/RGBA, lossy at out-of-sRGB hues)

Figma **cannot render React**, so the literal goal ("land in a working project that renders the showcase using themed installed components") is not achievable inside Figma. The faithful reinterpretation for a design tool is: **dynamically generate Figma Component Sets + a Variables collection from dotUI metadata + the chosen preset's tokens**, so a designer opens a Figma file whose first page is a *showcase frame* assembled from real dotUI component instances, all bound to Variables whose values are the user's preset. This is the deep design doc the user asked for: a new `figma` block on each `meta.ts`, a generator algorithm, and the OKLCH→RGB pipeline.

This is **net-new dotUI work** (no Figma path consumes a shadcn registry today). The realistic mechanism is a **Figma plugin** (Plugin API runs in the file and can create nodes + variables); the Variables REST *write* API is Enterprise-only and is documented here only as a fallback.

---

## 1. User experience

From the dotUI `/create` customizer (state lives in `?preset=<encoded>`, see `www/src/routes/_app/create.tsx:11-16`), the user clicks **"Open in Figma"**. Because a browser cannot push nodes into the Figma desktop/web canvas directly, the realistic flow is:

1. The button opens Figma to the **dotUI Figma plugin** (deep link `figma://` / the plugin's community page) and hands it the preset. Two concrete handoffs:
   - **Preferred:** copy a one-line command / token to the clipboard and instruct "run the dotUI plugin, paste". The plugin pulls everything from dotUI endpoints by preset.
   - **Lower-friction:** a published plugin with a "Paste dotUI link" field; the user pastes `https://dotui.com/create?preset=<encoded>` (or just the `<encoded>` string).
2. Inside Figma the plugin shows a short progress UI ("Reading dotUI registry… generating Variables… building component sets… assembling showcase"), then:
   - Creates a **Variables collection** `dotui` with modes **Light** / **Dark**, populated from the preset's resolved ramps + semantic aliases (section 5).
   - Creates one **Component Set** per dotUI component declared with a `figma` block (Button, Card, Input, Select, …), each with **variant properties** (`variant`, `size`, `state`) and fills/strokes/radii/text **bound to Variables** (section 8).
   - Assembles a **"Showcase" page** as the first/active page: a frame mirroring `www/src/components/marketing/showcase/cards.tsx` (Login form, Booking, Notifications, …) built from **instances** of those component sets, so the showcase is what the designer sees on open — themed with their preset.

What they land in: a Figma file (or the current file) where page 1 = the themed cards showcase, the component sets are reusable and variant-driven, and switching the collection's mode flips Light/Dark. "Components installed" becomes "component sets generated"; "theme in globals.css" becomes "Variables collection"; "their preset" is honored because every value is sourced from the decoded `?preset`.

---

## 2. Technical mechanism

Figma's only in-canvas write surface that a third party can ship for free is a **plugin** using the **Plugin API** (runs in a sandbox inside Figma, full read/write to nodes + the Variables API). References:

- Plugin API overview & `figma.createComponent` / `ComponentSetNode` (combine-as-variants): <https://www.figma.com/plugin-docs/api/properties/figma-createcomponent/> and <https://www.figma.com/plugin-docs/api/ComponentSetNode/>
- Variables in plugins: `figma.variables.createVariableCollection`, `createVariable`, `setValueForMode`, `setBoundVariable`: <https://www.figma.com/plugin-docs/api/figma-variables/>
- Component **properties** (variant + boolean/text/instance-swap): <https://www.figma.com/plugin-docs/api/ComponentProperties/>
- Auto layout via plugin (`layoutMode`, `itemSpacing`, `paddingLeft`…): <https://www.figma.com/plugin-docs/api/properties/nodes-layoutmode/>

**Entry point:** the plugin `main` (`code.ts`) running under `figma.*`. It fetches dotUI data over HTTPS (plugins may `fetch` with a `networkAccess.allowedDomains` manifest entry, e.g. `https://dotui.com`). The two pieces of dotUI data it needs:

1. The **registry index** + per-item `figma` metadata → tells the plugin *what* to build and *how* (anatomy, variant→property map, token bindings). This is the new payload dotUI must serve (section 7).
2. The **preset's resolved tokens** → the Variable values. Derived from the same `?preset` string via dotUI's codec + `resolveColorConfig` (section 3, 5).

The REST **Variables write** endpoints (`POST /v1/files/:key/variables`) exist but are **Enterprise-only** and write to a file you already own — unusable as a public "open in" path. Documented as fallback in section 9. Source: <https://www.figma.com/developers/api#variables>.

---

## 3. Preset propagation

The chosen preset never reaches Figma as React state; it reaches the plugin as the **same `?preset=<encoded>` string** dotUI already produces, and the plugin (or a dotUI endpoint it calls) decodes it with dotUI's existing codec.

The wire format is fixed (from `www/src/modules/create/preset/codec.ts`): `encodePreset(ds)` diffs the `DesignSystem` against `DEFAULTS` (`www/src/modules/create/preset/defaults.ts`), `JSON.stringify`s the compact `{p,t,d,c}` (`www/src/modules/create/preset/types.ts:14-19`), `pako.deflateRaw(json,{level:9})`, then URL-safe base64 (`toBase64Url`, `codec.ts:12-21`). `decodePreset` is the exact inverse and merges back over `DEFAULTS`, returning a full `DesignSystem` `{ componentParams, tokens, density, color? }`.

Two ways the plugin gets the decoded preset:

- **Plugin decodes locally (recommended).** Reimplement the contract in the plugin: base64url → `pako.inflateRaw` → `JSON.parse` → merge over a copy of dotUI's `DEFAULTS`. `pako` is already a dotUI dependency (`www/package.json:46`) and runs fine in the plugin sandbox. The only field the plugin cares about for theming is `color: ColorConfig` (seeds + algorithm + knobs); `density` selects which auto-layout sizing block to read; `componentParams` selects enum variants / scalar radii.
- **dotUI resolves server-side (simplest plugin).** The plugin calls a new endpoint `GET /r/figma/tokens?preset=<encoded>` (section 7) that runs `decodePreset` + `resolveColorConfig` and returns ready-to-bind RGB values. This keeps OKLCH→RGB math (and `colorjs.io`) on the server and out of the plugin bundle.

Critical fidelity note: the preset is the **user's chosen** state, not the default. `encodePreset` returns `undefined` when the design system equals defaults (`codec.ts:84-89`), so the button must handle "no preset" by falling back to `DEFAULT_COLOR_CONFIG` (`www/src/registry/theme/color-config.ts:72-83`) — the plugin must generate the *default* palette in that case, never an empty collection.

Also note the existing `/r/$name` route **drops `color`** from the preset (`www/src/routes/r/$name.tsx:113-121` returns only `{ density, componentParams }`); color only survives on `/r/init`. The Figma path must therefore source color from `/r/init`-style resolution or its own decode, **not** from the per-component route.

---

## 4. Components installed

"Installed components" maps to **generated Component Sets**, one per dotUI ui item that declares a `figma` block. The plugin does not consume the React `base.tsx` (Figma can't run it); it consumes the **anatomy + bindings** from the new `figma` meta plus the registry's existing structure.

How every needed component lands as a node tree:

1. **Discovery.** The plugin fetches the registry index (the `/r/registry.json` dotUI must add, section 7) and filters to items whose descriptor has `figma`. The canonical name list already exists as `registryUi` (`www/src/registry/__generated__/registry-items.ts`, 60 items) — `registry.json` is generated from it (section 7).
2. **Transitive deps.** The showcase needs composites (e.g. `Select` depends on `button, field, list-box, popover` per `www/src/registry/ui/select/meta.ts:14`; `LoginForm` uses `Card`, `TextField`/`Input`, `Button`, `Link`). The plugin must build dependencies **first** so a composite can place **instances** of its parts. Dependency order comes straight from each item's `registryDependencies` (a DAG); topologically sort it (the same names the publisher rewrites in `rewriteDeps`, `www/src/publisher/publish.ts:79-105`). For Figma the deps mean "child component instances", not file fetches.
3. **Variant params from real metadata.** Enum params already encode the variant axes the publisher uses (`alert.style`, `loader.style`, etc., `www/src/registry/types.ts:43-49`). The Button's variant matrix is authoritative in `www/src/registry/ui/button/styles.ts` (`variant`: default/primary/quiet/link/warning/danger; `size`: xs/sm/md/lg; `isIconOnly`). The `figma` block restates these as Figma component properties (section 8) so a generated set has the same variant cells.
4. **Result.** Each component becomes a `ComponentSetNode` (variants combined via `figma.combineAsVariants`), living on a "Components" page; the showcase page uses instances. This is the Figma analogue of "every needed component present under `ui/`".

---

## 5. Theme in globals.css → Figma Variables

In a code project the preset's OKLCH tokens land in `globals.css` via `emitInitItem` (`www/src/publisher/emit-theme.ts:71-128`): primitive ramps in `:root`/`.dark` and the constant `@theme inline` semantic layer in `cssVars.theme`. **Figma has no CSS** — the equivalent is a **Variables collection** with two modes. The mapping is direct and lossless in *structure*, lossy only in *color space*.

### 5a. What gets created

A collection `dotui` with modes `Light` and `Dark`, and two tiers of variables that mirror dotUI's two CSS tiers:

- **Primitive tier** — one `COLOR` variable per `--<palette>-<step>` (6 palettes × 11 steps = 66), e.g. `primitives/neutral/500`, `primitives/accent/500`. Light mode = `resolved.light`, Dark mode = `resolved.dark`. Source of the ramps: `resolveColorConfig(preset.color)` → `{ steps, light, dark }` (`www/src/registry/theme/primitives.ts:67-108`). The dark ramp is the reversed-lightness ladder dotUI already computes (`reverseRamp`, `primitives.ts:28-37`) — so Figma's dark mode matches the site exactly.
- **Semantic tier** — one variable per `--color-*` token from `DEFAULT_SEMANTICS` (`www/src/registry/theme/semantics.ts:36-124`), e.g. `semantic/bg`, `semantic/accent`, `semantic/fg-on-accent`, **aliased** to the matching primitive variable (`setBoundVariable`/alias), reproducing dotUI's `--color-bg: var(--neutral-50)` indirection. Because the semantic layer is **constant across presets**, only the primitive values change per preset — exactly dotUI's model.

### 5b. The `--on-*` (contrast foreground) problem

In code, `--on-accent-500` etc. are **not shipped**; the consumer's `tailwindcss-autocontrast` plugin derives them at build (`emit-theme.ts:152-159`). Figma has no such plugin, so the plugin must **precompute** them. dotUI already has the exact replica: `onBlackWhite(background)` (`packages/colors/src/shared/on-color.ts:88-97`), kept in lockstep with the plugin via a parity test. The Figma generator computes `--on-<palette>-<step>` per step with `onBlackWhite` and stores them as primitive variables, so `semantic/fg-on-accent` aliases a real value.

### 5c. OKLCH → RGB conversion (the hard requirement)

dotUI emits **only `oklch()` strings** (`oklchCss`, `packages/colors/src/shared/color.ts:54-60`). The Figma Plugin API `RGB`/`RGBA` takes **0..1 sRGB channels** (<https://www.figma.com/plugin-docs/api/RGB/>). So every ramp value must be converted:

```ts
// dotUI already has the seam — packages/colors/src/shared/color.ts
import { toSrgb } from "@dotui/colors/shared/color"; // toSrgb({l,c,h}|string) -> {r,g,b} in 0..1
import { gamutMap, toOklch } from "@dotui/colors";

function oklchToFigmaRGB(oklch: string): { r: number; g: number; b: number } {
  const mapped = gamutMap(toOklch(oklch)); // CSS Color 4 chroma-reduce+clip into sRGB
  return toSrgb(mapped);                   // already 0..1, exactly Figma's RGB shape
}
```

`gamutMap` first is essential: vivid OKLCH at light/dark ends sits **outside sRGB**, and Figma stores sRGB — without gamut mapping the raw clip would shift hue. This is the documented lossiness: in-gamut steps are exact; out-of-gamut steps are perceptually nudged (same nudge dotUI's own swatches use). **`toSrgb` is currently NOT exported from the package barrel** (`packages/colors/src/index.ts:39` exports `gamutMap, oklchCss, toOklch, apca, wcag2` but not `toSrgb`) — dotUI must add it (one line) or expose a `toHex`/`toFigmaRGB` helper next to `oklchCss` (section 7).

For HSL (if a swatch UI or fallback needs it) the same seam goes through `colorjs.io`'s `srgb→hsl`; centralize it behind `color.ts` rather than importing `colorjs.io` in the plugin.

### 5d. Density / radius

Density isn't a color. In code it's baked into class strings (`buttonStyles` has per-density `compact`/`default`/`comfortable` blocks, `www/src/registry/ui/button/styles.ts:40-74`). For Figma, the `figma` meta declares per-density auto-layout numbers (height/padding/gap) and the plugin reads the block for `preset.density`. Radius (`--radius-*` = `calc(base * --radius-factor)`, `www/src/registry/base/theme.css:8-17`) becomes a `FLOAT` Variable `radius/md` etc., bound to each node's `cornerRadius`, computed from the preset's `--radius-factor` if present in `tokens` (note: `tokens` currently doesn't reach the publisher, `emit-theme.ts:62-68`; the Figma path can read it directly from the decoded `DesignSystem.tokens`).

---

## 6. The showcase as first view

The portable showcase entry is `www/src/components/marketing/showcase/cards.tsx` — a masonry of 17 cards (`Booking`, `TwoFactor`, `Notifications`, `LoginForm`, …). Figma can't import that React file, so the generator builds a **declarative mirror**: a "Showcase" page (set as `figma.currentPage` so it's the open view) containing a frame per card, each card frame assembled from **instances** of the generated component sets.

Two ways to get the layout into the plugin:

- **Hand-authored showcase manifest (recommended, accurate).** dotUI ships `www/src/registry/figma/showcase.ts`: a JSON description of each card (which components, props/variant values, sample text, layout). The plugin walks it and places instances. This mirrors `cards.tsx` 1:1 and is what the user sees first. Example card descriptor for `LoginForm` (mirrors `www/src/components/marketing/showcase/login-form.tsx`):

  ```jsonc
  {
    "id": "login-form",
    "component": "card",
    "layout": { "direction": "vertical", "gap": 16, "padding": 24, "width": 320 },
    "children": [
      { "component": "text", "props": { "style": "title" }, "content": "Login to your account" },
      { "component": "text", "props": { "style": "muted" }, "content": "Enter your email below to login" },
      { "component": "text-field", "props": { "label": "Email address" } },
      { "component": "button", "props": { "variant": "primary", "size": "md" }, "content": "Continue with email" }
    ]
  }
  ```

- **Auto-derived (lossy).** Parse `cards.tsx` at build with the same `ts-morph` already used in `scripts/registry-build.ts` to emit a rough manifest, then hand-correct. Cheaper to start, but JSX→layout inference is imperfect; the hand-authored manifest is the maintainable source.

Providers/imports have no Figma analogue: there's no `ThemeProvider` — "dark mode" is the collection's Dark mode; there's no `cn`/react-aria runtime. The showcase frame simply consumes the generated sets and Variables. The result is showcase-first parity: the designer opens the file on the themed cards, exactly as the website's home (`www/src/routes/_app/index.tsx:51-53`) shows them.

---

## 7. What dotUI must build

Concrete, referencing real paths/functions:

1. **`/r/registry.json` index route** — `www/src/routes/r/registry[.]json.tsx` (literal dot). No such route exists today (confirmed: only `$name.tsx` + `init.tsx` under `www/src/routes/r/`). Import `registryBase`, `registryUi`, `registryLib`, `registryHooks` and emit the shadcn `Registry` shape (`www/src/registry/types.ts:80-82`). Needed both for shadcn MCP discovery and as the Figma plugin's component catalog. Cache headers as in `$name.tsx:27-30`.

2. **Per-item `figma` metadata in the index.** Extend each `meta.ts` with an optional `figma` block (section 8) and surface it in `registry.json` descriptors (and/or a dedicated `GET /r/figma/manifest?preset=<encoded>`). This is the *what to build* payload.

3. **`GET /r/figma/tokens?preset=<encoded>`** — a new server route that runs `decodePreset` (`www/src/modules/create/preset/codec.ts:111`) → `resolveColorConfig(ds.color ?? DEFAULT_COLOR_CONFIG)` (`www/src/registry/theme/primitives.ts:67`) → for every ramp step convert OKLCH→sRGB and compute `onBlackWhite` (`packages/colors/src/shared/on-color.ts:88`), returning:

   ```jsonc
   {
     "modes": ["light", "dark"],
     "primitives": {
       "light": { "neutral-50": {"r":0.98,"g":0.98,"b":0.98}, "accent-500": {"r":0.26,"g":0.55,"b":0.84}, "...": {} },
       "dark":  { "neutral-50": {"r":0.13,"g":0.13,"b":0.13}, "...": {} }
     },
     "on": { "light": { "accent-500": {"r":1,"g":1,"b":1} }, "dark": { "...": {} } },
     "semantic": { "bg": "neutral-50", "accent": "accent-500", "fg-on-accent": "on/accent-500", "...": "" },
     "radius": { "md": 6, "lg": 8 },
     "density": "compact"
   }
   ```

   `semantic` mirrors `DEFAULT_SEMANTICS` (`www/src/registry/theme/semantics.ts`) as primitive references → the plugin makes them aliases. This keeps `colorjs.io` server-side.

4. **Export `toSrgb` (and ideally `toFigmaRGB`/`toHex`) from `@dotui/colors`.** `toSrgb` lives in `packages/colors/src/shared/color.ts:42` but is absent from the barrel (`packages/colors/src/index.ts:39`). Add it so both the new route and any client converter share one seam.

5. **The showcase manifest** `www/src/registry/figma/showcase.ts` (section 6) describing `cards.tsx` declaratively, plus a small generator/validator test that asserts every `component` referenced exists in `registryUi`.

6. **The Figma plugin** (separate package, e.g. `packages/figma-plugin`): `manifest.json` with `networkAccess.allowedDomains: ["https://dotui.com"]`, `code.ts` (the generator, section 8), and a minimal `ui.html` with the "paste dotUI link" field. Published to the Figma Community; the "Open in Figma" button deep-links to it.

7. **The "Open in Figma" button** on `/create` (alongside the existing install command, `www/src/modules/create/install-command.tsx`): builds the deep link / clipboard payload from the current `encodePreset(designSystem)` value (`www/src/modules/create/preset/use-design-system.ts`).

---

## 8. Schema / meta.ts changes

This is the core ask. Add an **optional `figma` field** to `RegistryItem` (`www/src/registry/types.ts:69-78`), dropped from emitted shadcn JSON exactly like `group`/`params`. It is purely declarative metadata read by the plugin.

### 8a. The `figma` schema, field by field

```ts
// additions to www/src/registry/types.ts
export type FigmaTokenBinding =
  | { kind: "fill"; token: string }        // token = semantic name, e.g. "accent" / "bg" / "fg-on-accent"
  | { kind: "stroke"; token: string }
  | { kind: "text"; token: string }        // text color
  | { kind: "radius"; token: string }      // e.g. "md"  -> radius/md FLOAT var
  | { kind: "opacity"; value: number };

export interface FigmaLayer {
  /** Stable node name in the generated component. */
  name: string;
  /** "frame" => auto-layout container; "text"; "icon"; "instance" (swap-in another component set). */
  type: "frame" | "text" | "icon" | "instance";
  /** For type:"instance", the dotUI component name to place (must be in registryUi). */
  component?: string;
  /** Variable bindings applied to this layer. */
  bind?: FigmaTokenBinding[];
  /** Static fallback content for text layers / sample data. */
  content?: string;
  /** Nested layers (only meaningful for frames). */
  children?: FigmaLayer[];
  /** Which variant values hide/show this layer, e.g. only render when state="loading". */
  showWhen?: Record<string, string>;
}

/** Maps a dotUI param (or synthetic axis) to a Figma component property. */
export interface FigmaVariantMapping {
  /** Figma property name shown in the right panel. */
  property: string;
  /** "VARIANT" (1-of-N), "BOOLEAN", "TEXT", or "INSTANCE_SWAP". */
  propertyType: "VARIANT" | "BOOLEAN" | "TEXT" | "INSTANCE_SWAP";
  /** Source of values: a dotUI enum param name, or "$state"/"$size"/"$variant" synthetic axes. */
  source: string;
  /** Explicit value list (defaults to the param's `values` when source is a real enum param). */
  values?: readonly string[];
  default?: string;
}

/** Per-density auto-layout numbers (sourced from the component's density tv block). */
export interface FigmaDensitySizing {
  height?: number;        // fixed height, px
  paddingX?: number;
  paddingY?: number;
  gap?: number;           // itemSpacing
}

export interface FigmaMeta {
  /** Root auto-layout. direction -> layoutMode; padding/gap default from density unless overridden. */
  layout: {
    direction: "horizontal" | "vertical" | "none";
    align?: "min" | "center" | "max" | "space-between";
    /** Per-density sizing; keys: "compact" | "default" | "comfortable". */
    sizing?: Partial<Record<Density, FigmaDensitySizing>>;
  };
  /** The component's node tree (anatomy). */
  anatomy: FigmaLayer[];
  /** Variant axes -> Figma component properties. */
  variants: FigmaVariantMapping[];
  /** Default sample content if anatomy text layers omit `content`. */
  sample?: Record<string, string>;
  /** Whether to also generate state cells (hover/pressed/disabled) as variants. */
  states?: readonly string[]; // e.g. ["default","hover","pressed","disabled"]
}

export type RegistryItem = ShadcnRegistryItem & {
  group?: ComponentGroup | null;
  params?: Record<string, ParamDef>;
  figma?: FigmaMeta;   // NEW — declarative, dropped from emitted JSON
};
```

Field rationale, tied to dotUI internals:

- **`layout.direction` → `node.layoutMode`** (`"horizontal"|"vertical"`), `align` → `primaryAxisAlignItems`/`counterAxisAlignItems` (<https://www.figma.com/plugin-docs/api/properties/nodes-layoutmode/>). Buttons are `horizontal` + `center`.
- **`layout.sizing` per density** comes from the tv density blocks. For Button, `compact.md = "h-7 px-2 gap-1"` (`styles.ts:47`), `default.md = "h-8 px-2.5 gap-1.5"` (`styles.ts:58`), `comfortable.md = "h-9 px-2.5"` (`styles.ts:69`). The plugin picks the block for `preset.density` and sets `node.itemSpacing` (gap), `paddingLeft/Right` (px), and a fixed height.
- **`anatomy` (`FigmaLayer[]`)** is the node tree. Each `bind` entry is resolved to a **Variable alias** at generation: `kind:"fill", token:"accent"` → bind the layer's `fills[0]` to the `semantic/accent` variable (`setBoundVariable("fills", var)`); `kind:"text", token:"fg-on-accent"` → bind the text node's fill to `semantic/fg-on-accent`. The token names are exactly the `--color-*` suffixes in `DEFAULT_SEMANTICS` (`semantics.ts`), so bindings reuse dotUI's vocabulary verbatim.
- **`variants` (`FigmaVariantMapping[]`)** maps dotUI enum params to Figma variant properties. When `source` is a real enum param (e.g. `style` on Alert/Loader), `values` defaults to the param's `values`. Synthetic axes `$variant`/`$size`/`$state` cover axes that live in `styles.ts` rather than `params` (Button's `variant`/`size` are tv variants, not customizer params). `INSTANCE_SWAP` covers icon slots.
- **`states`** drives generation of interaction cells. `buttonStyles` encodes hover/pressed/disabled/pending via Tailwind state variants (`styles.ts:11-12,17-23`); Figma can't run those, so the generator materializes them as extra variant cells with the resolved hover/pressed *colors* (e.g. `bg-primary-hover` → `accent-600` via semantics).

### 8b. Concrete example — Button

Mirrors `www/src/registry/ui/button/styles.ts` exactly (6 variants × 4 sizes × icon-only, hover/pressed/disabled).

```ts
// www/src/registry/ui/button/meta.ts  (added figma block)
const buttonMeta = {
  name: "button",
  type: "registry:ui",
  group: "buttons",
  files: [{ type: "registry:ui", path: "ui/button/base.tsx", target: "ui/button.tsx" }],
  registryDependencies: ["loader", "focus-styles"],
  figma: {
    layout: {
      direction: "horizontal",
      align: "center",
      sizing: {
        compact:     { height: 28, paddingX: 8,  gap: 4 },   // h-7 px-2  gap-1   (md)
        default:     { height: 32, paddingX: 10, gap: 6 },   // h-8 px-2.5 gap-1.5
        comfortable: { height: 36, paddingX: 10, gap: 6 },   // h-9 px-2.5
      },
    },
    anatomy: [
      {
        name: "Button", type: "frame",
        bind: [{ kind: "fill", token: "neutral" }, { kind: "radius", token: "md" }],
        children: [
          { name: "Label", type: "text", content: "Button", bind: [{ kind: "text", token: "fg-on-neutral" }] },
        ],
      },
    ],
    variants: [
      // Button's variant/size are tv variants (styles.ts), exposed as synthetic axes:
      { property: "Variant", propertyType: "VARIANT", source: "$variant",
        values: ["default","primary","quiet","link","warning","danger"], default: "default" },
      { property: "Size", propertyType: "VARIANT", source: "$size",
        values: ["xs","sm","md","lg"], default: "md" },
      { property: "Icon only", propertyType: "BOOLEAN", source: "$iconOnly", default: "false" },
    ],
    states: ["default", "hover", "pressed", "disabled"],
    sample: { Label: "Button" },
  },
} satisfies RegistryItem;
```

How the generator reads this for `variant=primary`: it overrides the root frame's fill binding to `semantic/accent` and the label to `semantic/fg-on-accent` (because `styles.ts:18-19` is `bg-primary text-fg-on-primary`, and `--color-primary` maps via semantics; primary in the showcase resolves through the accent ramp). For `state=hover` it binds to `semantic/accent-hover` (`bg-primary-hover`). The cell matrix = `variant × size × iconOnly × state`.

### 8c. Concrete example — a complex component (Select)

`Select` is composite: a trigger `Button` + `ChevronDown` icon + a `Popover` containing a `ListBox` (`www/src/registry/ui/select/base.tsx`; deps `button, field, list-box, popover`, `select/meta.ts:14`). It demonstrates `instance` layers (reuse the Button/ListBox sets) and a multi-part anatomy.

```ts
// www/src/registry/ui/select/meta.ts (added figma block)
figma: {
  layout: { direction: "vertical", gap: 4, align: "min",
    sizing: { compact: { gap: 4 }, default: { gap: 6 }, comfortable: { gap: 6 } } },
  anatomy: [
    { name: "Field", type: "frame", children: [
      { name: "Label", type: "text", content: "Label", bind: [{ kind: "text", token: "fg" }] },
      // The trigger reuses the Button component set (instance swap):
      { name: "Trigger", type: "instance", component: "button",
        children: [
          { name: "Value", type: "text", content: "Select an option", bind: [{ kind: "text", token: "fg-muted" }] },
          { name: "Chevron", type: "icon", bind: [{ kind: "fill", token: "fg-muted" }] },
        ] },
      // Open state surfaces the popover + listbox as a sibling, shown only when state=open:
      { name: "Popover", type: "instance", component: "popover", showWhen: { state: "open" },
        bind: [{ kind: "fill", token: "popover" }, { kind: "radius", token: "md" }],
        children: [ { name: "Options", type: "instance", component: "list-box" } ] },
    ] },
  ],
  variants: [
    { property: "State", propertyType: "VARIANT", source: "$state",
      values: ["closed","open","disabled"], default: "closed" },
    { property: "Size", propertyType: "VARIANT", source: "$size", values: ["sm","md","lg"], default: "md" },
  ],
  states: ["default", "disabled"],
  sample: { Label: "Country", Value: "Select an option" },
},
```

Generation consequences: because `Trigger`/`Popover`/`Options` are `type:"instance"`, the plugin **requires** the `button`, `popover`, `list-box` component sets to exist first (the topological order from `registryDependencies`, section 4). `showWhen:{state:"open"}` makes the popover visible only in the `open` variant cell. `bind` tokens (`popover`, `fg-muted`, `fg`) are the same semantic names as `DEFAULT_SEMANTICS` (`color-popover`, `color-fg-muted`, …).

### 8d. The generation algorithm (plugin `code.ts`)

```text
INPUT: registry.json (filtered to items with `figma`), figma manifest, tokens payload (section 7).

1. THEME → VARIABLES
   collection = figma.variables.createVariableCollection("dotui")
   light = collection.defaultModeId; dark = collection.addMode("Dark")
   for each primitive p in tokens.primitives.light:
     v = createVariable("primitives/"+p, collection, "COLOR")
     v.setValueForMode(light, rgb(tokens.primitives.light[p]))
     v.setValueForMode(dark,  rgb(tokens.primitives.dark[p]))
   same for tokens.on -> "on/<palette>-<step>"
   for each semantic s -> primitive ref in tokens.semantic:
     v = createVariable("semantic/"+s, collection, "COLOR")
     v.setValueForMode(light, ALIAS(varByName("primitives/"+ref or "on/"+ref)))   // alias both modes
     v.setValueForMode(dark,  ALIAS(...))
   for each radius r in tokens.radius: createVariable("radius/"+r, collection, "FLOAT").setValue(both modes, px)

2. COMPONENT SETS  (topological order by registryDependencies; deps first)
   for each item with figma, in dep order:
     sizing = item.figma.layout.sizing[tokens.density]
     cells = cartesian(item.figma.variants × item.figma.states)
     for each cell:
       node = buildLayer(item.figma.anatomy[0], cell, sizing)   // recursive (step 3)
       name node "<prop1>=<val1>, <prop2>=<val2>, ..."          // Figma variant naming
     set = figma.combineAsVariants(cellNodes, componentsPage)
     register set.id under item.name (so instance layers can swap it)

3. buildLayer(layer, cell, sizing):
   switch layer.type:
     frame: n = figma.createFrame(); n.layoutMode = dir(layout); n.itemSpacing = sizing.gap
            n.paddingLeft/Right = sizing.paddingX; if sizing.height fixed-height
     text:  n = figma.createText(); n.characters = layer.content ?? sample[layer.name]
     icon:  n = placeholder vector / instance of icon set
     instance: n = instanceOf(register[layer.component]); apply cell.size if relevant
   for each bind in layer.bind:
     resolve token -> variable (variantOverride(cell) e.g. primary->accent, hover->accent-hover)
     fill   -> n.fills = [bound paint]; setBoundVariable("fills", var)
     stroke -> setBoundVariable on strokes
     text   -> setBoundVariable text fill
     radius -> setBoundVariable("topLeftRadius"... or cornerRadius) to radius var
   if layer.showWhen and !matches(cell): n.visible = false
   recurse children
   return n

4. SHOWCASE PAGE  (first/active view)
   page = figma.createPage("Showcase"); figma.currentPage = page
   root = autolayout frame (columns, gap 16) bound semantic/bg
   for each card in manifest.showcase:
     cardNode = buildCard(card)   // walks card.children, instancing component sets, setting variant props + text
     append to root
```

`variantOverride(cell)` is the one piece of dotUI-specific logic: it translates a variant cell into which semantic token a binding resolves to, reading the same intent as `styles.ts` (e.g. `$variant=primary` ⇒ root fill `accent`, label `fg-on-accent`; `state=hover` ⇒ `accent-hover`). Encoding this in the `figma` block (e.g. an optional `variantBindings: Record<axisValue, FigmaTokenBinding[]>`) keeps it data-driven rather than hardcoded per component.

---

## 9. Limitations, risks, fallbacks

- **No direct browser→canvas write.** A web button cannot inject nodes into Figma. *Fallback:* publish a Community plugin and deep-link to it with the preset on the clipboard / in a paste field (section 1). This is the standard pattern for "open in Figma" integrations.
- **OKLCH is not sRGB (color fidelity = partial).** Figma stores sRGB; OKLCH steps outside sRGB are gamut-mapped (`gamutMap`, `color.ts:48`), so the most saturated light/dark steps shift slightly. In-gamut steps are exact. There is no fix — sRGB is Figma's only color space for Variables today. Document the mapping so designers know vivid swatches are nudged.
- **Variables REST write API is Enterprise-only.** The "no plugin" path (`POST /v1/files/:key/variables`) needs an Enterprise org token and an existing file you own — not viable as a public button. *Fallback:* plugin (the primary path).
- **No interactivity / no React semantics.** Figma component sets are static; hover/pressed/disabled become **separate variant cells** with precomputed colors, not live states. Behavior (focus rings, react-aria, pending spinners) cannot be represented; only the resolved visual states.
- **Composite drift.** The `figma` anatomy is hand-authored and can drift from `base.tsx` / `styles.ts`. *Mitigation:* a CI test asserting every `figma.anatomy[].component` and `variants[].source` enum exists in `registryUi` / the item's `params`, plus the showcase manifest references only real components (section 7.5).
- **`--on-*` parity.** Figma foregrounds are precomputed with `onBlackWhite` (`on-color.ts:88`). If dotUI ever changes the autocontrast formula, the plugin must track it — the existing parity test (`www/src/registry/theme/on-color-parity.test.ts`) is the guard to extend.
- **Plugin bundle weight if decoding client-side.** Shipping `colorjs.io` into the plugin is heavy. *Mitigation:* the `/r/figma/tokens` endpoint (section 7.3) keeps OKLCH→RGB on the server; the plugin only consumes RGB.
- **`?preset` absent.** When the user hasn't customized, `encodePreset` returns `undefined` (`codec.ts:84-89`); the plugin must generate the **default** palette from `DEFAULT_COLOR_CONFIG`, not an empty file.

---

## 10. Step-by-step implementation checklist

1. **Add `/r/registry.json`** (`www/src/routes/r/registry[.]json.tsx`) emitting the shadcn `Registry` shape from `registryUi`/`registryLib`/`registryHooks`/`registryBase`. (Also unblocks shadcn MCP.)
2. **Define the `figma` schema** in `www/src/registry/types.ts` (`FigmaMeta`, `FigmaLayer`, `FigmaVariantMapping`, `FigmaDensitySizing`, `FigmaTokenBinding`); add optional `figma?` to `RegistryItem`; ensure the publisher drops it (it already drops non-shadcn fields in `www/src/publisher/publish.ts:145-158`).
3. **Author `figma` blocks** for the components the showcase needs first: `button`, `card`, `text`, `text-field`/`input`, `select`, `checkbox`, `switch`, `link`, `avatar`, `badge`, `tooltip`, `loader` — mirroring each `styles.ts`. Start with Button (section 8b) and Select (section 8c).
4. **Export `toSrgb`** from `packages/colors/src/index.ts` (and optionally add `toFigmaRGB`/`toHex` next to `oklchCss` in `packages/colors/src/shared/color.ts`).
5. **Build `GET /r/figma/tokens?preset=<encoded>`** (`www/src/routes/r/figma.tokens.tsx`): `decodePreset` → `resolveColorConfig(ds.color ?? DEFAULT_COLOR_CONFIG)` → convert ramps (`gamutMap`+`toSrgb`) + `onBlackWhite` → emit the JSON in section 7.3. Mirror `DEFAULT_SEMANTICS` into the `semantic` map.
6. **Write the showcase manifest** `www/src/registry/figma/showcase.ts` from `cards.tsx`, plus a validator test (every referenced component exists in `registryUi`).
7. **Build the Figma plugin** (`packages/figma-plugin`): `manifest.json` (`networkAccess.allowedDomains:["https://dotui.com"]`), `code.ts` implementing the algorithm in section 8d (Variables → component sets → showcase page), minimal `ui.html` (paste link / progress). Use `figma.variables.*`, `figma.combineAsVariants`, auto-layout APIs.
8. **Publish** the plugin to the Figma Community; capture its deep link / id.
9. **Add the "Open in Figma" button** on `/create` next to `install-command.tsx`, building the deep link + clipboard payload from `encodePreset(designSystem)` (handle `undefined` → default).
10. **Round-trip test:** customize a preset (custom accent + comfortable density), Open in Figma, verify (a) the collection's accent matches the site swatch within gamut, (b) Dark mode matches the reversed ramp, (c) the showcase page is the open view and component variants/sizes match `styles.ts`.
11. **CI guards:** anatomy↔registry validator (step 6), `onBlackWhite` parity (extend `on-color-parity.test.ts`), and a snapshot of `/r/figma/tokens` for the default preset.

---

## Sources

- Figma Plugin API — overview & node creation: <https://www.figma.com/plugin-docs/>
- `figma.createComponent` / Component nodes: <https://www.figma.com/plugin-docs/api/properties/figma-createcomponent/>
- `ComponentSetNode` / combine as variants: <https://www.figma.com/plugin-docs/api/ComponentSetNode/>
- Component properties (variant / boolean / instance-swap / text): <https://www.figma.com/plugin-docs/api/ComponentProperties/>
- Variables in plugins (`createVariableCollection`, `createVariable`, `setValueForMode`, aliases, `setBoundVariable`): <https://www.figma.com/plugin-docs/api/figma-variables/>
- Auto layout properties (`layoutMode`, `itemSpacing`, padding): <https://www.figma.com/plugin-docs/api/properties/nodes-layoutmode/>
- `RGB`/`RGBA` color type (0..1 sRGB channels): <https://www.figma.com/plugin-docs/api/RGB/>
- Variables REST API (Enterprise-only write): <https://www.figma.com/developers/api#variables>
- Plugin manifest `networkAccess`: <https://www.figma.com/plugin-docs/manifest/>
- OKLCH / CSS Color 4 gamut mapping background: <https://www.w3.org/TR/css-color-4/#gamut-mapping>
