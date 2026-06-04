# Component Playground: Architecture Review & Rewrite Proposal

> Scope: the interactive `<InteractiveDemo>` system under `www/src/modules/docs/interactive-demo/` plus its build-time rehype pass and the 47 hand-written `playground.tsx` wrappers. All file:line references are against `main` at the time of writing.

---

## 1. TL;DR

- **The core problem is a single load-bearing hack.** Code generation works by calling a React component _as a plain function_ — `PlaygroundFn(propsForCode)` at `interactive-demo.tsx:105-109` — to harvest its returned element tree, then stringifying that tree with a 494-LOC hand-rolled serializer (`element-to-code.ts`). This voids the Rules of Hooks, breaks on Fragments/`memo`/context, and depends on `fn.name`/`displayName` surviving minification (`element-to-code.ts:383`). It is correct today _only_ because all 47 wrappers were hand-tuned to stay inside its envelope.

- **A single prop is declared in up to four places.** Real component type → generated reference JSON (`src/modules/references/generated/<name>.json`) → flat `*PlaygroundProps` interface (47 files, ~1256 LOC) → MDX `controls={[...]}` array. Only #2 is actually trusted for inference; #3 and #4 are pure drift surface that nothing validates.

- **The repo already contains the right pattern, sitting next to the wrong one.** The non-interactive `<Demo>` path (`transformer.ts`) reads the real `.tsx` from disk and transforms it with **ts-morph** — source-of-truth-preserving, no import map, no component-as-function call. And `src/registry/ui/select/demos/basic.tsx` is _already_ a parameterized, source-consumed twin of `select/demos/playground.tsx`, conditional `<Label>` and all. **43 of 47** playgrounds already have such a `basic.tsx`/`default.tsx` twin.

- **Recommended direction: make the interactive playground a thin prop-overlay on the static `<Demo>` pipeline.** One real demo file per component is the single source for _preview, controls, and code_. The live preview renders it as a normal React component (hooks-safe). The displayed code is the file's own source, AST-overlaid with the current non-default control values via ts-morph and formatted with **oxfmt** at build time. Imports come straight from the file's own `import` statements. This deletes `element-to-code.ts`, the 137-entry `COMPONENT_IMPORT_MAP`, the bespoke ESTree parser, the function-call hack, and the 47 flat interfaces — net **negative** LOC.

- **It ships incrementally and safely.** The rehype pass already cleanly separates `processDemoNode` / `processInteractiveDemoNode` and injects via a `component={...}` attribute, so a feature-flagged parallel path is structurally trivial. Migrate component-by-component up a difficulty ladder behind golden-output characterization tests; the old path stays live until the last conversion.

- **One graft from the runner-up neutralizes the only real risk.** For the handful of branchy/derived demos (the `text-field` nested ternary, `progress-bar`'s `value={isIndeterminate ? undefined : value}`), add an explicit opt-in marker so the build never has to _guess_ a conditional, plus a build-time lint that **fails loudly** when a controllable JSX attribute can't be statically resolved. This converts the current silent-drop smell into a hard failure.

---

## 2. How it works today

Two halves split by the build/runtime boundary, with serialized JSON crossing it.

```
AUTHORING                          src/registry/ui/<name>/demos/playground.tsx
  content/docs/.../select.mdx        ┌──────────────────────────────────────┐
  <InteractiveDemo                    │ interface SelectPlaygroundProps {... } │  ← flat interface
    name="select"                     │ export function SelectPlayground(p){    │    re-declares prop TYPES
    controls={["isDisabled",          │   return <Select {...}>…compound…</…>  │    (dup of the JSON)
      {name:"label", type:"string"}]} │ }                                       │
  />                                  └──────────────────────────────────────┘
        │                                            ▲
        │  (build, rehype-transform.ts)              │ bundler resolves import
        ▼                                            │
┌─────────────────────────────────────────────┐     │
│ BUILD TIME (Node)                            │     │
│ 1. extractControlsAttribute → parseControl-  │     │   src/modules/references/generated/<name>.json
│    Element  (rehype-transform.ts:375-433)    │     │   { props: { isDisabled: {type, typeAst,
│    HAND-PARSES the controls ESTree.          │─────┼─►  default, description, required }, … } }
│    Only Literal + 1-level ObjectExpression.  │     │           │ (loadApiReference)
│ 2. buildControlsFromReference  ◄─────────────┼─────┼───────────┘   ← the ONLY source actually trusted
│    (process-controls.ts) infers control kind │     │
│    from typeAst, default from prop.default.  │     │
│ 3. enrichControlsForSerialization → shiki-   │     │
│    highlight type/default to HTML strings.   │     │
│ 4. inject  component={SelectPlayground}      │     │
│            controls={JSON.parse("[…]")}      │     │
└───────────────────┬─────────────────────────┘     │
                    │  SerializableControl[]  (HTML strings only — JSON-safe)
                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│ RUNTIME (browser)  interactive-demo.tsx                              │
│   values  ← getDefaultValue(control)            (L205-227, 2nd copy  │
│                                                  of default logic)    │
│   propsWithIcons  = {…values, icon-name→createElement(Icon)}  ──► PREVIEW
│   previewElement  = createElement(Playground, propsWithIcons)  ──► real React render
│                                                                       │
│   propsForCode    = only props where !isEqual(value, default)        │
│   renderedElement = PlaygroundFn(propsForCode)   ◄── ★ THE HACK ★    │
│                     (calls the component as a plain function)         │
│   codeOutput      = elementToCode(renderedElement)   (element-to-code.ts)
│                     • getComponentName via fn.name/displayName        │
│                     • getImportPath via 137-entry COMPONENT_IMPORT_MAP│
│                       + endsWith("Icon") / PascalCase→kebab guessing  │
│                     • hand-rolled pretty-printer, magic numbers       │
└─────────────────────────────────────────────────────────────────────┘
```

Meanwhile, the **non-interactive** `<Demo>`/`<Example>` path (`processDemoNode` → `transformer.ts`) does the _right_ thing in the same rehype pass: reads the real `.tsx`, extracts the return JSX with ts-morph, rewrites `@/registry/ui/` → `@/components/ui/` (`transformer.ts:153`), shiki-highlights, and never executes a component. Two code-display mechanisms, one good and one glue.

---

## 3. Problems

Severity-ranked. Every row was confirmed against the source.

| #   | Problem                                                                                                 | Where                                                                                                                | Why it's fragile                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Impact                                                                                                                                                                                             |
| --- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Component invoked as a plain function** to harvest its JSX tree                                       | `interactive-demo.tsx:105-109`                                                                                       | Bypasses React entirely. Any hook (`useId`/`useState`) throws "Invalid hook call"; `memo`/`forwardRef` make `type` an object, not a function → `PlaygroundFn(props)` throws; `useContext` returns the _provider default_, silently diverging code from preview; a Fragment/array root → `getComponentName` returns `"Unknown"`.                                                                                                                                                | **Critical.** The entire codegen feature rests on this. 44 of 47 wrappers carry `"use client"` yet are misused as pure functions. One new author using a hook breaks the panel with no diagnostic. |
| 2   | **Component identity from `fn.name`/`displayName`** drives both the emitted tag _and_ the import lookup | `element-to-code.ts:377-392`                                                                                         | Production build is `vite build` (minified). dotUI components are authored as `export function Button(...)` with no `displayName`, so under minification they become `t`/`e`. `getImportPath` then misses the map, heuristics misfire, and you get `<t />` with `import { t } from "@/components/ui/t"`.                                                                                                                                                                       | **Critical.** Correct only in dev mode. React Aria primitives _do_ set `displayName` while dotUI wrappers don't, so the failure is uneven and component-specific.                                  |
| 3   | **137-entry hand-maintained `COMPONENT_IMPORT_MAP`**, already stale                                     | `element-to-code.ts:25-261, 457-481`                                                                                 | Duplicates registry knowledge that already exists (`meta.ts` `files[].target` + barrel exports). Confirmed mis-mappings: `TableContainer` not in map → kebabs to `@/components/ui/table-container` (lives in `table`); `Disclosure*` → three wrong paths instead of one `disclosure`; `TextArea`/`DateInput` pointed at `input`. Misses fall to `endsWith("Icon")` / `/^[A-Z][a-z]+[A-Z]/` guessing that matches _real_ components (`DateField`, `TextField`, `ColorPicker`…). | **High.** Every new compound component is one missing entry away from a `lucide-react` import. Nothing checks the map.                                                                             |
| 4   | **Code can disagree with the preview** (wrong default selected _and_ hidden)                            | `process-controls.ts:110`; `interactive-demo.tsx:80`                                                                 | When a prop has no documented `default`, the enum default becomes `stringLiterals[0]` — but the reference JSON lists union members **alphabetically** (`type-to-ast.ts` `sortUnionElements`). So the preview initializes to the alphabetically-first variant (e.g. `variant="danger"`), and `propsForCode` then _suppresses_ that value from the code because it equals the computed default.                                                                                  | **High.** The copied snippet does not reproduce what the user sees. Alert renders a red `danger` alert while the panel shows a bare `<Alert>`.                                                     |
| 5   | **Hand-rolled ESTree controls parser**                                                                  | `rehype-transform.ts:375-433`                                                                                        | `parseControlElement` understands only `Literal` and one-level `ObjectExpression`. Silently drops, with no warning: negative numbers (`UnaryExpression`, so `defaultValue:-5` → `0`), nested objects, identifiers (`defaultValue: MY_DEFAULT`), template literals, array spreads. `button.mdx`'s authored `fallback={…}` is read by _nothing_.                                                                                                                                 | **High.** Authoring surface looks richer than it is; invalid inputs vanish instead of erroring.                                                                                                    |
| 6   | **Hand-rolled JSX pretty-printer with magic numbers**, lossy on non-primitives                          | `element-to-code.ts:394-439`                                                                                         | Inline-vs-multiline keyed on `propsStr.length > 60`; children inlined if `totalChildLength < 50`. Object/array props go through `JSON.stringify` → `style={{"color":"red"}}`; function props dropped (`L411`); element-valued props dropped (`L414`); a `data-tsd-*` blocklist (`L398`) defends against dev-injected attributes that leak _because_ the tree is harvested from live elements.                                                                                  | **High.** Re-implements (badly) what the repo already does with ts-morph + oxfmt. Date/CalendarDate values serialize to ISO strings, not constructor calls.                                        |
| 7   | **Four sources of truth per prop**, joined only by string-name matching                                 | `playground.tsx` ×47, `*.mdx`, `<name>.json`                                                                         | The flat `*PlaygroundProps` interface (`button/demos/playground.tsx:12-20`) and the 104 inline `defaultValue:` literals across MDX restate what the JSON already holds. Linked to the JSON purely by `reference.props[propName]`. Nothing validates agreement.                                                                                                                                                                                                                 | **High.** Rename a prop or change a union and the demo silently renders stale controls or throws at build. ~1256 LOC of duplication.                                                               |
| 8   | **Default + equality logic forked** across build and runtime                                            | `process-controls.ts:300-320` vs `interactive-demo.tsx:205-227`                                                      | Build-time `parseDefaultValue` and runtime `getDefaultValue` independently derive defaults; `isEqual` is reference-only (`a === b`), so any array/object/`Date` control value never collapses to its default and is always emitted, violating the "hide defaults" contract.                                                                                                                                                                                                    | **Medium.** The two can disagree about what counts as default; non-primitive controls always print.                                                                                                |
| 9   | **Icons special-cased in 4+ disjoint sites**                                                            | `interactive-demo.tsx:54-71, 83-90`; `controls.tsx:217-250`; `process-controls.ts:273-278`; `element-to-code.ts:464` | `availableIcons` map, `createElement` for preview, a _second_ `createElement` for code, a build-time icon branch, the picker widget, and an import heuristic. The icon is the only control whose runtime value (a string name) differs in type from the rendered prop (a `ReactNode`).                                                                                                                                                                                         | **Medium.** Every control touchpoint grows an `if (icon)` branch.                                                                                                                                  |
| 10  | **Zero test coverage** over the subsystem                                                               | entire `interactive-demo/`, `rehype-transform.ts`                                                                    | 5 test files in the repo, none touching codegen. No golden-file test, no minified-name test, no preview-vs-code sync test.                                                                                                                                                                                                                                                                                                                                                     | **Medium.** Every fragility above is an unguarded latent regression; a rewrite cannot even be validated for parity without first adding characterization tests.                                    |

---

## 4. What "good" looks like

The external survey is unambiguous: dotUI hand-rolled two pieces that best-in-class systems solve with off-the-shelf parts, and the _better_ of two valid models already lives in this repo.

- **Derive controls from the type system, not a restated interface (Storybook `argTypes`).** Storybook auto-infers `argTypes` from component types via `react-docgen` / `react-docgen-typescript`; manual `argTypes` only _override_ the inferred ones. dotUI already has the superior input: `typescript-api-extractor` emits a structured `typeAst` per prop (the same engine Base UI uses). The lesson: infer from **one** structured representation. Delete the `inferFromTypeString` regex fallback (`process-controls.ts:161-207`) and treat a missing `typeAst` as a hard error.

- **Generate code from source AST, not from a live element tree.** Storybook's "Show code" does call the render fn with current args — but then serializes with the battle-tested `react-element-to-jsx-string`, never a bespoke printer. The stronger move, which several reference systems take, is to **never execute anything**: React Aria's own docs (`parcel-transformer-mdx-docs`), Ariakit (`__examples__/<name>/index.tsx` linked via `data-playground`), and shadcn/Park UI (`fs.readFileSync` the real file verbatim) all treat **one real example file** as the single source compiled into _both_ a rendered preview and displayed source. This is exactly what dotUI's own `transformer.ts` already does for `<Demo>`.

- **Format with a real formatter, not magic numbers.** The repo ships **oxfmt** (monorepo-root `node_modules/.bin/oxfmt`) and `ts-morph` is already a dependency used in `transformer.ts`. Every heuristic in `element-to-code.ts` (boolean shorthand, wrap-at-60, indentation, default-hiding) is a first-class concern of an AST + formatter pipeline.

- **Resolve imports from the registry / the file itself, not a hand map.** `meta.ts` already declares `name` → `files[].target`; the canonical `@/registry → @/components` rewrite already exists as `REGISTRY_PATH_REWRITES` in `transform-base.ts:48-53`. An unknown component should **error**, never emit a fabricated path.

- **Reject runtime-evaluation engines.** Sandpack (hosted iframe bundler) and react-live (Sucrase + `eval` against a manual `scope` with no import resolution) are the wrong fit for a static Vite + fumadocs-mdx, copy-paste-registry model. The shown code would not map to real importable paths. Keep it **build-time-generated**.

- **Keep Shiki.** Build-time Shiki highlighting (`process-controls.ts:390`, `github-light`/`github-dark`) is already consensus best-in-class. The HTML-string-across-the-JSON-boundary trick for contextual help is correct and must be preserved.

---

## 5. Recommended architecture

**Name: SourceFirst Playground.** One real, runnable demo file per component is the single source of truth for preview, controls, and code. This is the _DemoOverlay_ spine (judges' migration-safety + ergonomics winner) with the _$control overlay_ engine's safety grafts (judges' robustness winner). Both winning lenses converge on it.

### Operating principle

```
                 ┌──────────────────────────────────────────────┐
                 │  src/registry/ui/<name>/demos/playground.tsx  │
                 │  a NORMAL runnable component, no flat interface│
                 └──────────────────────────────────────────────┘
                       │ rendered live (React)        │ read as source text
                       ▼                              ▼
                   PREVIEW                          CODE (collapsed + full)
            createElement(Demo, values)     ts-morph overlay of non-default
            hooks/context/memo all legal    values + oxfmt + import rewrite
```

The demo file takes its controllable props as ordinary typed params with literal defaults — _exactly the shape `select/demos/basic.tsx` already has today_. Param **types** come from the component's own type (zero restatement); param **defaults** are the authoritative control defaults (this is the graft that fixes Problem #4 at the root — the default is read from the literal the user actually sees, not the alphabetized union).

### Build time (inside the existing rehype pass)

For each `<InteractiveDemo name="select" controls={["isDisabled", {name:"label", type:"string"}]} />`:

1. **Resolve + parse the demo file once** with the singleton ts-morph `Project` already used by `transformer.ts`. Locate the exported `Demo` and its root JSX (reuse `findExportFunction`/`getFunctionBody`).
2. **Derive controls.** `controls` is now a _selection_ list ("which props to surface" + demo-only pseudo-props), not a redefinition. For each named real prop, read `reference.props[prop]` and infer the kind **solely from `typeAst`**. The real default is read from the demo file's param signature (`{ isDisabled = false }`) with `prop.default` as fallback. `inferFromTypeString` and the runtime `getDefaultValue`/`isEqual` are deleted.
3. **Replace the bespoke ESTree parser.** The MDX `controls` expression's `estree` is already attached by the compiler — serialize it back to source (`astring` or a ts-morph round-trip) and `new Function("return (…)")`-evaluate it at build time. This natively handles negatives, nested objects, arrays, identifiers. Anything that throws **fails the build loudly**.
4. **Enrich + emit.** Shiki-highlight each control's type/default to HTML (unchanged). Run the source-overlay once on the _default_ instance to produce a serializable **code template with typed holes** — the formatted canonical source where each control's value position is a marked hole keyed by control name + value-kind, and each conditional sub-element is a named region with its default-drop pre-computed. Inject `component={SelectPlayground}` + `controls={…}` + `codeTemplate={…}`. A broken demo logs and is skipped (graceful), as today.

> **Why a template-with-holes, not live AST at runtime?** ts-morph is too heavy for the browser, and oxfmt is a **Node-only CLI** — there is no sound browser formatting pass (this is the factual error that sank the rejected proposal). So _all_ AST + formatting work happens at build; the runtime does pure, formatter-free string assembly over pre-formatted fragments. Each fragment is captured **with its surrounding whitespace/indentation** so a hole that flips a tag multiline stays coherent; block-level (conditional/child) controls splice as whole lines.

### Runtime (browser)

- **Preview:** `previewElement = createElement(DemoComponent, currentValues)` — a real React render of a real component. Hooks, context, `memo`, `forwardRef`, Fragments, `.map`, conditional slots all work. The function-call hack is gone because code no longer comes from calling the component.
- **Collapsed code:** walk the `codeTemplate`, fill each hole with its current value via trivial JSX-literal rules (boolean shorthand, quote strings, brace numbers), and **drop** any hole whose value equals its (single, serialized) default — dragging in its pre-marked attribute span. Output = the root JSX subtree.
- **Full code:** collapsed JSX + the surviving imports + `export function Demo() { return (…) }`. Imports come from the demo file's _own_ `import` declarations, tree-shaken to surviving symbols and path-rewritten via the shared `REGISTRY_PATH_REWRITES`. **No import map.** An unknown symbol is impossible because it came from a real import.

### How each hard case is handled

| Hard case                                                                                               | Today                                                                                          | SourceFirst                                                                                                                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Icons** (`button` prefix/suffix, `toggle-button` `<PinIcon className="rotate-45">`)                   | `availableIcons` → `createElement` → recover `fn.name` → guess import (4+ sites)               | The demo imports the concrete icon; the control's value is a symbol name resolved against the file's _own_ imports. Preview renders the real icon; code emits `<MailIcon />` with the file's real import. Icon-level `className`/`data-*` survive because they're literal JSX. |
| **children/text** (`badge`, `button` label)                                                             | props-vs-children split in the serializer                                                      | Authored as element body; a `children` pseudo-prop swaps the body text. No special case — the node already knows children are children.                                                                                                                                        |
| **Compound subtree** (~25 wrappers: Select/Tabs/Table/Command)                                          | reproduced by walking a harvested element array; sub-component imports need the 137-entry map  | Reproduced **verbatim** because code _is_ the source. Sub-component imports (`field`/`group`/`input`) are literally in the file → the entire reason the map existed evaporates.                                                                                                |
| **Conditional slot** `{label && <Label/>}`                                                              | "works" only because the function-call collapses the branch and `serializeNode` drops `false`  | The slot is a named region in the template; toggling the control includes/excludes it in **both** preview (real render) and code. For the simple `{x && <El/>}` / single-ternary idiom, the build resolves it by substituting the literal.                                     |
| **Two-branch ternary** (`text-field`: `hasIcons ? <InputGroup> : <Input/>`)                             | survives by accident (single-rooted)                                                           | **Explicit graft:** author marks the controllable spot (`$.switch`/`$.expr`) so the build records _both_ branch spans rather than constant-folding arbitrary JS it might get wrong. Caps the worst case at "author writes one marker," not "build emits subtly-wrong code."    |
| **Nested-target prop** (`tooltip` placement on `TooltipContent`, `dialog` `isDismissable` on `Overlay`) | only works because a hand wrapper routes the prop; auto-inference keyed on the root can't know | The control declares an explicit `target` (a `data-control-target` marker on the inner node), **validated at build** — the target must resolve to a real injectable attribute or the build fails.                                                                              |
| **Trigger + overlay** (`Dialog`/`Modal`/`Drawer`/`Popover`)                                             | near-identical literal trees duplicated inside the serializer's concerns                       | Plain JSX in each file, emitted verbatim. Near-identical families stay near-identical _files_ — now genuinely the shown code.                                                                                                                                                  |
| **`.map()` children** (`accordion`)                                                                     | harvested array → emits 3 expanded `<Disclosure>` blocks, **loses** the `items` const          | Code _is_ the source → shows the real `const items = […]` + `{items.map(…)}`. Strictly more faithful.                                                                                                                                                                          |
| **Derived props** (`progress-bar` `value={isIndeterminate ? undefined : value}`)                        | naive "spread control onto root" can't express it                                              | Derivation is literal in source. Preview runs it; code substitutes the control literal so the emitted attribute is the derived value. Branchy ones use the explicit-marker graft.                                                                                              |
| **Range / variants** (`date-picker/demos/range/`, `calendar`'s two exports)                             | parallel dir + a multi-export file; the glob miscounts                                         | Each variant is its own demo file (`demos/range-playground.tsx`); the MDX names it: `<InteractiveDemo name="date-picker" file="range-playground" />`. "One file = one playground" becomes true.                                                                                |
| **Structural defaults** (`avatar` `src`/`alt`, `defaultValue="#ff0000"`)                                | a hidden second "what shows in code" path                                                      | Literal attributes in the file → always emitted, correctly, single-sourced.                                                                                                                                                                                                    |

### Target file layout

```
www/src/modules/docs/
  codegen/
    source-overlay.ts        NEW  ts-morph: parse demo → find root JSX → overlay
                                  control values → drop defaults → rewrite paths
                                  (shared REGISTRY_PATH_REWRITES) → oxfmt → emit
                                  surviving imports + code-template-with-holes
    code-template.ts         NEW  tiny shared types + formatter-free CLIENT renderer
                                  for the template (replaces elementToCode/PreviewCode)
    symbol-index.ts          NEW  build-time symbol→importPath index from registry
                                  barrels + meta.ts (fallback/validator; primary path
                                  takes imports straight from the demo file)
    __tests__/source-overlay.spec.ts  NEW  golden: (source + values) → exact string
  interactive-demo/
    interactive-demo.tsx     SLIMMED  preview = real render; code = render the
                                  template against values; delete the function-call
                                  hack, getDefaultValue, isEqual
    controls.tsx             KEPT  control widgets + contextual-help popover unchanged
    process-controls.ts      TRIMMED  typeAst-only inference; default from param sig;
                                  keep shiki enrichment; delete inferFromTypeString
    element-to-code.ts       DELETED
  mdx-plugins/
    rehype-transform.ts      CHANGED  processInteractiveDemoNode calls source-overlay;
                                  real estree-eval for the controls value; inject
                                  codeTemplate. Delete parseControlElement.
    transformer.ts           CONVERGED (Phase 5)  point <Demo> at the same overlay
                                  + oxfmt + rewrite so the two displays can't drift
  ...
src/registry/publisher/build-time/transform-base.ts   EXPORT REGISTRY_PATH_REWRITES
                                  / rewriteImportPath (Phase-0 no-op; consumed by both)
src/registry/ui/<name>/demos/playground.tsx  ×47  → real runnable demos, no interface
```

### What gets DELETED

- `element-to-code.ts` — the entire 494-LOC serializer: `serializeElement`/`serializeProps` magic-number printer, `getComponentName` via `fn.name`, the 137-entry `COMPONENT_IMPORT_MAP`, `getImportPath` guessing, `buildImports`' dead `@dotui` sort branch, the `data-tsd-` blocklist.
- The function-call hack (`interactive-demo.tsx:105-109`) and the entire bug class it spawns.
- `getDefaultValue` + `isEqual` (`interactive-demo.tsx:205-227`) — defaults computed once at build, carried in the control; equality on serialized primitives.
- `inferFromTypeString` (`process-controls.ts:161-207`) — the strictly-weaker second inference path.
- `parseControlElement` / `extractControlsAttribute` (`rehype-transform.ts:375-433`) — replaced by real estree evaluation.
- 47 flat `*PlaygroundProps` interfaces (~1256 LOC) — demos keep composition only, never prop-type restatement.
- 104 inline `defaultValue:` literals across the MDX files.
- The structural divergence between `<Demo>` and `<InteractiveDemo>` — they share one generator after Phase 5.

---

## 6. Authoring before/after

**Before** — two artifacts, four sources of truth:

```tsx
// content/docs/components/select.mdx
<InteractiveDemo name="select" controls={["isDisabled", { name: "label", type: "string", defaultValue: "Country" }]} />;

// src/registry/ui/select/demos/playground.tsx  — a SECOND file restating prop TYPES
("use client");
interface SelectPlaygroundProps {
	// ← dup of select.json
	label?: string;
	placeholder?: string;
	isDisabled?: boolean;
	isInvalid?: boolean;
}
export function SelectPlayground({
	label = "Country",
	placeholder = "Select a country",
	...props
}: SelectPlaygroundProps) {
	return (
		<Select placeholder={placeholder} {...props}>
			{label && <Label>{label}</Label>}
			<SelectTrigger />
			<SelectContent>
				<SelectItem id="us">United States</SelectItem>
				<SelectItem id="uk">United Kingdom</SelectItem>
			</SelectContent>
		</Select>
	);
}
// Code shown in docs = SelectPlayground CALLED as a function, tree walked & stringified.
```

**After** — the MDX names props; the playground is an ordinary runnable demo (≈ the `basic.tsx` that already exists), no interface, types from JSON, default from the source the user sees:

```tsx
// content/docs/components/select.mdx  — surface preserved; types/defaults NOT restated
<InteractiveDemo name="select" controls={["isDisabled", { name: "label", type: "string" }]} />;

// src/registry/ui/select/demos/playground.tsx  — real demo, the ONLY per-component artifact
import { Label } from "@/registry/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/registry/ui/select";

export default function Demo({ label = "Country", isDisabled = false } = {}) {
	// ← default lives HERE
	return (
		<Select isDisabled={isDisabled}>
			{label && <Label>{label}</Label>}
			<SelectTrigger />
			<SelectContent>
				<SelectItem id="us">United States</SelectItem>
				<SelectItem id="uk">United Kingdom</SelectItem>
			</SelectContent>
		</Select>
	);
}
```

What the author **no longer writes**: the `*PlaygroundProps` interface (types come from `select.json`), `defaultValue` types in MDX (defaults read from the param signature), and never a `COMPONENT_IMPORT_MAP` entry. The same file now _also_ works as a static `<Demo>`. Generated code for `isDisabled={true}, label=""` is the file's own source overlaid + oxfmt-formatted — guaranteed to match the preview because both derive from one file.

For the **branchy minority** only, the explicit marker keeps the build honest:

```tsx
// text-field — the build must not guess this ternary
export default function Demo({ hasIcons = false } = {}) {
	return $.switch("hasIcons", {
		true: (
			<InputGroup>
				<MailIcon />
				<Input />
			</InputGroup>
		),
		false: <Input />,
	});
}
```

---

## 7. Alternatives considered

- **Keep the wrapper, just swap the serializer for `react-element-to-jsx-string`.** The cheapest high-value win, and a real improvement over the hand-printer. But it _retains_ the function-call hack (still breaks on hooks/context/memo) and still depends on `fn.name` under minification for the tag and import. It treats the symptom (the printer) not the disease (harvesting from a live element tree). Worth doing only as an interim if a full migration stalls.

- **Marker-on-the-real-component + auto-derive every primitive prop** (the "Recipe" proposal). Clean to author (one comment marker), but auto-exposing _every_ primitive prop leaks `aria-*`/`data-*`/handlers into the controls, and its conditional-slot recognition is the least specified of the candidates. Its fatal flaw: it claimed an _optional client-side oxfmt pass_, but oxfmt ships only as a Node CLI — that runtime path cannot exist. Grafted the good parts (explicit marker, validated `target`, optional `controls="auto"` restricted to authored non-handler primitives); rejected the package.

- **`$`-marker overlay everywhere** (the robustness-lens winner). Strictly the safest engine — every controllable spot is statically marked and lint-enforceable. But marking _every_ attribute on all 47 components is the heaviest authoring tax and the furthest departure from the idiom authors already write, and the shown source becomes a stripped derivative rather than the on-disk file. Adopted its _engine_ (build-time AST harvest + pure span-splice runtime + node-level binding + fail-loud lint) and its branchy-case markers, but applied selectively rather than universally.

- **Runtime evaluation (Sandpack / react-live).** Rejected on architecture: hosted iframe bundler / `eval` against a manual scope with no import resolution. Incompatible with static SSG and the copy-paste-registry ethos; the shown code wouldn't map to real import paths.

- **`fs.readFileSync` verbatim (shadcn/Park UI).** The most drift-free, but static — no live controls. It's the reference point that proves "source is truth," not a drop-in, since the stated goal is interactive controls that update the source live.

---

## 8. Migration plan

The rehype pass already branches cleanly (`processDemoNode` / `processInteractiveDemoNode`) and injects via `component={...}`, so old and new coexist behind a per-`<InteractiveDemo>` flag (e.g. `engine="source"`). Nothing is big-bang.

- **PR 1 — Phase 0: safety net + hoist (no behavior change).**
  Export `REGISTRY_PATH_REWRITES`/`rewriteImportPath` from `transform-base.ts`; have `transformer.ts:153` consume it (delete its private regex). Add the golden-output **characterization harness**: snapshot today's collapsed + full code for all ~48 demos. This is the parity oracle — the subsystem currently has **zero** tests.

- **PR 2 — Phase 1: the engine, flagged off.**
  Land `source-overlay.ts` (ts-morph overlay + build-time oxfmt), `code-template.ts` (formatter-free client renderer), `symbol-index.ts`, and unit tests for the template renderer with hand-written templates (golden strings, no browser). Wire the build/runtime contract. Switch nothing yet.

- **PR 3 — Phase 2: prove it on one component (`button` or `separator`).**
  Convert one demo to the real-runnable shape, flip its flag, diff against its Phase-0 golden. This is also where Problem #4 gets fixed for free (default now sourced from the param literal).

- **PR 4…N — Phase 3: climb the difficulty ladder, codemod-assisted.**
  A codemod bootstraps each `playground.tsx` from its existing `basic.tsx`/`default.tsx` twin — **43 of 47 already have one** — adding a default export and parameterizing. Order: flat single-root → children/text → compound (`select`, `switch`) → conditional (`text-field`, with the `$.switch` marker) → nested-target (`tooltip`) → trigger+overlay (`dialog`) → `.map` (`accordion`) → variants (`calendar`/`date-picker` range). Each component flips its flag only once its golden matches. The ~30 mechanical cases are near-automatic; the ~17 compound/derived ones are hand-migrated (mostly copy of existing JSX + a marker).

- **PR N+1 — Phase 4: delete the old path.**
  Remove `element-to-code.ts`, `COMPONENT_IMPORT_MAP`, the function-call hack, `getDefaultValue`/`isEqual`, `inferFromTypeString`, `parseControlElement`, the flat interfaces, and the `engine` flag.

- **PR N+2 — Phase 5: converge `<Demo>`.**
  Point `transformer.ts` at the same `source-overlay` + oxfmt + rewrite so the two code-display mechanisms physically share one generator and can never drift again. Add the CI guard: every demo's imports must resolve through the rewrite, so a renamed export **fails the build** instead of emitting a fabricated path.

---

## 9. Risks & effort

**Effort: L (large), net-negative LOC.** New code is concentrated and bounded: `source-overlay.ts` (~200-300 LOC, heavily reusing `transformer.ts` helpers), `code-template.ts` (~80 LOC client + types), `symbol-index.ts` (~60 LOC) — against ~750 LOC deleted (`element-to-code.ts` 494 + the map + the parser + the dup default logic) plus the ~1256 LOC of flat interfaces shrinking sharply. The bulk of the _work_ is the ~48 demo conversions, but 43 have a twin to bootstrap from, and the whole thing ships incrementally behind a flag with golden tests, so risk per step is small. The single hard nucleus is the build-time overlay + template-with-holes — an M-sized subtask inside the L.

**Honest risks:**

- **Line-wrapping stability across hole fills.** A control value that changes line length could, in principle, want a different wrap than the build-time format. _Mitigation:_ capture each fragment with its surrounding whitespace and splice block-level controls as whole lines; format the template at the widest realistic value so wrapping is stable. This is the deliberate tradeoff for not shipping a formatter to the browser (which is impossible anyway — oxfmt is Node-only). For prop demos this is a non-issue in practice.

- **Constant-folding arbitrary author JS for conditionals.** Robustly resolving `{cond && <El/>}` for _any_ author expression is the riskiest part. _Mitigation:_ constrain the auto-handled idiom to the patterns already in use (`{x && <El/>}`, simple ternary) and **fail loudly** on anything outside it; the branchy minority uses the explicit `$.switch`/`$.expr` marker so the build records both spans rather than guessing. The grafted lint makes this a CI guarantee, not a documented hope.

- **Nested-target `target` is a new concept** authors must set for ~8 components. It replaces an _impossibility_ (today nested props only work because a hand wrapper routes them) with an explicit, build-validated field.

- **Authoring discipline:** demo files must keep controllable props as top-level params with literal defaults and a statically-analyzable return. Documented contract; the existing `basic.tsx` files prove it's the natural shape.

- **Build-time `new Function` eval of the MDX controls expression.** Safe — it's the author's own repo content at build time, never user input — but worth noting it's a new (small) capability.

**The payoff is disproportionate to the risk:** the four headline fragilities (function-call hack, minified-name import resolution, the silently-dropping ESTree parser, the preview-vs-code default divergence) are _structurally eliminated_, not patched — and the two code-display mechanisms collapse into one. The hardest new code is a single pure, browser-free, golden-testable function over build-emitted strings.
