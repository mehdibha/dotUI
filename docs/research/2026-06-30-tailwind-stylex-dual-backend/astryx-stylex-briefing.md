# StyleX + Astryx API briefing

> Verified 2026-06-30 against stylexjs.com docs, `facebook/stylex`, the Meta Engineering blog, the real `facebook/astryx` source, and `nmn/tw-to-stylex`. Uncertainties flagged inline. This is the reference the dual-backend design ([README.md](./README.md)) rests on.

## 0. The one architectural fact

StyleX **forbids descendant/sibling/arbitrary selectors by design** ("no styling at a distance"): every style on an element must come from class names *on that element*. StyleX 0.16+ adds a *controlled* escape hatch (`stylex.when.*` + markers), three of whose variants depend on `:has()`. Everything in Tailwind that styles *other* elements (`group-*`, `peer-*`, `*:`, `[&_svg]:`, `has-*`) has **no 1:1 equivalent** and must be re-expressed via CSS vars, `stylex.when.*`, or by giving the styled element its own class.

## 1. Core API a generator must emit

- **`stylex.create({ name: {...} })`** — named *namespaces*, each a style object. Keys are **camelCase** CSS props; values are strings / unitless numbers (→ px for lengths) / `null` (unset) / condition-objects / helper-call results.
- **Pseudo-classes** nest **inside a property**: `backgroundColor: { default: 'x', ':hover': 'y', ':active': 'z' }`.
- **Pseudo-elements** are **top-level namespace keys** with a full style-object value: `'::placeholder': { color: '#999' }`. (Different shape from pseudo-classes — explicit emitter branch.)
- **`@media` / `@supports`** are condition keys alongside `default`; conditions **nest** with an inner `default`: `color: { default: 'black', ':hover': { default: 'blue', '@media (hover:hover)': 'darkblue' } }`.
- **`stylex.props(...styles)`** → `{ className, style }` for React; falsy args skipped; **last applied wins** (deterministic, atomic classes — stronger than CSS cascade). `stylex.attrs(...)` → `{ class, style }` for non-React.
- **Variants** (idiomatic, confirmed from Astryx Button): one `stylex.create` namespace per value, bracket-select `variants[variant]` / `sizes[size]`, ordered merge in one `stylex.props(...)`; consumer override prop passed **last**. Types via `keyof typeof sizes`. No `cva`/`compoundVariants` sugar — emit boolean `cond && styles.x` args or compound-keyed namespaces.
- **CSS variables**: consume externally-defined vars as values — `color: 'var(--color-primary)'` — and/or write custom props via `--`-prefixed keys — `'--x': 'value'`. This is an **escape hatch** → `@stylexjs/eslint-plugin` warns (suppressible). Alternatively `stylex.defineVars` (must live in `*.stylex.ts`, used by reference, supports stable `--`-prefixed names) + `stylex.createTheme` (theming = override a defineVars group; last theme wins; unset → default). *Flag: copy the exact `--var`-as-key syntax from the live `using-variables` docs page before relying on it — the capability + ESLint caveat are confirmed by two fetches and Astryx source, but the verbatim code block didn't render.*
- **Dynamic styles** (runtime-only values): namespace value is a function returning an object literal — `bar: (h) => ({ height: h })` — compiles to a static atomic class + inline `style` writing a CSS var. Use sparingly.
- **Helpers**: `stylex.firstThatWorks(a,b,c)` for fallbacks; `stylex.keyframes(...)` for animations (no inline `@keyframes`). No `!important`.
- **Build**: StyleX is a **compiler** — `stylex.create` must be compiled away (`@stylexjs/babel-plugin`; bundler plugins for Webpack/Rollup/Next/Vite-unplugin/PostCSS; 0.17 added broader `unplugin`). No runtime authoring mode. Astryx ships **precompiled atomic CSS + a thin runtime so consumers need no plugin** — the "export product" model.

## 2. `facebook/astryx` — the reference

Real and current: Meta's 8-year internal design system (13k+ apps), open-sourced ~2026-06-27 (astryx.atmeta.com, ~1.6k stars). Packages `@astryxdesign/*`: `core` (components + theme + utils), `cli` (scaffold/codemods/eject/MCP server), `build` (StyleX plugins), `theme-*` (10 themes). Source = one folder per component (`Button/Button.tsx`, `.test.tsx`, `.doc.mjs`, `index.ts`) + `theme/tokens.stylex.ts` (`defineVars` groups) + `naming.ts`.

Loot worth copying:
1. Token groups as `defineVars` files accessed with **custom `--`-prefixed keys** (`sizeVars['--size-element-md']`) → stable, human-readable custom-property names.
2. Variant expression = namespace-per-value + bracket-select + ordered merge (the README's Button shape).
3. Types derived from style maps (`keyof typeof sizeStyles`).
4. Consumer override = `xstyle` passed last to `stylex.props`; also explicitly allows `className` override (Tailwind/CSS-modules/plain CSS) layered on atomic StyleX — no lock-in.
5. **Theming = CSS-custom-property overrides only**, shipped as prebuilt CSS so consumers need no build plugin. ← the model dotUI already matches.

*Flag: Astryx `tokens.stylex.ts` internals inferred from Button's import sites; read that file directly before finalizing a token emitter.*

## 3. Tailwind ↔ StyleX translation

- **One tool exists: `nmn/tw-to-stylex`** (by StyleX creator Naman Goel; early, MIT). Use as a **mapping oracle** (how `px-4` → `paddingInline`), not a runtime dep. Its own TODOs are exactly the hard cases: `cn(...)` merges, dynamic/interpolated utilities, duplicate `create` emission.
- **Hardness map** (full table in README §"hard wall"): static utils / arbitrary values / `var()` / logical props / same-element pseudo / `@media` / same-element `data-[…]` = **easy**. `dark:` = `@media (prefers-color-scheme)` or theme — but **dotUI flips dark via `.dark` + CSS vars, so the StyleX export needs no `dark:` handling at all**. `group-*`/`peer-*` = `stylex.when.ancestor(...)` + markers (**hard**, generator owns both ends). `*:`/`[&_svg]:`/`space-x`/`divide` = **no equivalent**, refactor. `has-*` = `when.descendant` (**hard**, `:has()`-gated).
- **`stylex.when.*` (0.16+)**: `when.ancestor/descendant/anySibling/siblingBefore/siblingAfter` as condition keys, paired with `stylex.defaultMarker()` (one global) or `stylex.defineMarker()` (named, ≈ Tailwind named groups) on the observed element. Bidirectional + explicit — a class-string rewrite can't produce it. `descendant`/sibling variants need `:has()`.

## Sources

stylexjs.com/docs/learn (defining-styles, props, defining/using/creating-variables, defineConsts, when, thinking-in-stylex, descendant-styles recipe, installation, babel-plugin) · github.com/facebook/stylex · engineering.fb.com 2025-11-11 (StyleX at scale) · github.com/facebook/astryx + astryx.atmeta.com · github.com/nmn/tw-to-stylex · StyleX v0.16 / v0.17.1 release notes.
