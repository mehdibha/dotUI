# Tailwind ↔ StyleX dual styling backend

> Status: design + working, adversarially-hardened proof-of-concept (Button). Set as a `/goal` on 2026-06-30 (branch `claude/friendly-shockley-158a55`).
> This folder: `README.md` (architecture + rollout, this file), `astryx-stylex-briefing.md` (the verified StyleX/Astryx API briefing), and `parity-audit-snapshot.md` (the registry-wide coverage audit — the rollout sizing).
>
> Decision (2026-06-30, empirically verified): bare `[data-*]` attribute selectors **are** valid StyleX condition keys (compiled against `@stylexjs/babel-plugin@0.19.0`), so the RAC data-attribute states the dual backend depends on are expressible. The PoC was then hardened against an adversarial review (26 agents) — see "Verification & hardening" below.

## The ask

Let a dotUI user export every component in **either TailwindCSS or Facebook StyleX**, chosen in **code options**, with exact visual parity — and build **a system so AI can produce and verify that parity** between the two backends. Inspiration: [`facebook/astryx`](https://github.com/facebook/astryx) (Meta's design system, open-sourced ~2026-06-27), whose theming/distribution model is nearly identical to dotUI's.

This is a second axis of the existing two-layer customization model (CLAUDE.md): the design-system axes decide what components *look like*; `codeOptions` decides how the exported code *reads*. "Which styling library" is squarely a `codeOptions` concern — "the exported design system should read like the user's codebase, not ours."

## Why dotUI is unusually well-suited to this

Two facts make a second backend tractable rather than a rewrite:

1. **The styling pipeline already has a backend-agnostic seam.** Components author styles in `styles.ts` via `createStyles()` → `tv()`. At publish time the publisher *does not* ship `styles.ts`; it lowers everything to a **flat intermediate representation** — `TvLayer` (`{ base, slots, variants, defaultVariants, compoundVariants }`, class-string leaves) produced by `publisher/flatten.ts` — and `serialize.ts` renders that IR into a `tv(...)` literal. **The IR is the branch point**: a StyleX emitter consumes the same IR and renders a `stylex.create(...)` module instead. We add a sibling to `serialize.ts`, not a parallel component tree.

2. **Theming is 100% CSS custom properties.** The OKLCH engine emits `:root { --color-primary: … }` / `.dark { … }`, and the `DesignSystemProvider` writes per-design-system overrides to `:root`. Tailwind classes reference these vars (`bg-primary` → `var(--color-primary)`, `rounded-(--btn-radius)`). **StyleX consumes the exact same vars by literal `var(--color-primary)` reference.** Consequence: **color, dark mode, radius, density, and every other themed value work in StyleX for free** — the translator only maps *utility → CSS property*; it never resolves the theme. This is also exactly Astryx's model (theming = CSS-custom-property overrides, no component forking), which is why Astryx is the right reference.

## The core decision: translate the model, not the strings

The naive approach — regex-rewrite Tailwind class strings into StyleX — is wrong, and `nmn/tw-to-stylex` (by StyleX's own creator) documents why: `cn(...)` merges, dynamic/interpolated utilities, and duplicate-`create` emission all break it. We **emit both targets from dotUI's structured style model**:

- The **flat IR** supplies the *structure*: which slots exist, which variant axes, which values, default variants, compound conditions. This is already clean, typed data — no parsing.
- A **utility→property map** (`tw-to-stylex.ts`) supplies the *leaf translation*: each Tailwind utility token → `{ cssProperty: value }`, with variant prefixes (`hover:`, `data-[…]:`, `md:`) folded into StyleX condition maps. `tw-to-stylex` is the **mapping oracle** (how `px-4` becomes `paddingInline`, etc.), not a runtime dependency.

So the StyleX backend is: `IR → (per leaf: translate utilities) → StyleX namespaces → stylex.create literal → assemble component`.

## StyleX target shape (mirrors Astryx's Button)

```tsx
import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  base: {
    position: "relative",
    display: "inline-flex",
    // ... folded conditions: pseudo-classes nest INSIDE a property
    backgroundColor: { default: "var(--color-neutral)", ":hover": "var(--color-neutral-hover)" },
  },
});
const variants = stylex.create({
  default: { /* … */ },
  primary: { backgroundColor: { default: "var(--color-primary)", ":hover": "var(--color-primary-hover)" }, color: "var(--color-fg-on-primary)" },
  // one namespace per variant value
});
const sizes = stylex.create({ xs: {/*…*/}, sm: {/*…*/}, md: {/*…*/}, lg: {/*…*/} });

// application: ordered merge, consumer style passed LAST so "last wins" lets them override anything
<ButtonPrimitive.Button
  {...stylex.props(styles.base, variants[variant], sizes[size], isIconOnly && styles.iconOnly)}
/>
```

Key StyleX facts the emitter encodes (full detail in `astryx-stylex-briefing.md`):

- **Pseudo-classes** (`:hover`, `:active`, `:focus-visible`, `:disabled`) nest inside a property as `{ default, ':hover': … }`. **Pseudo-elements** (`::before`, `::placeholder`) are *top-level namespace keys* whose value is a full style object — a different shape, an explicit branch in the emitter.
- **`@media`** are condition keys alongside `default`; conditions nest (media inside pseudo) with an inner `default`.
- **Merge = "last argument to `stylex.props` wins"**, deterministic across files (atomic classes). Variant precedence = argument order. There is no `!important`.
- **Variants**: namespace-per-value + bracket-select (`variants[variant]`) + ordered merge. Types via `keyof typeof sizes`. No `compoundVariants` sugar — compound conditions become extra `cond && styles.x` arguments or compound-keyed namespaces.
- **Applying styles**: `stylex.props(...)` returns `{ className, style }`. Because dotUI's theming is all *static* `var()` references (no StyleX dynamic styles), `style` is empty, so `stylex.props(...).className` is a plain string that composes cleanly with React Aria's `className`-as-function render props. Nothing is lost. (Genuinely runtime values — e.g. a dragged size — would use StyleX's dynamic function form and produce an inline `style`; dotUI has very few of these, flagged per-component during rollout.)

## The hard wall: StyleX forbids "styling at a distance"

StyleX bans descendant/child/sibling/arbitrary selectors by design. dotUI leans on them heavily. Every such usage must be classified:

| Class of usage (Tailwind) | StyleX strategy | Cost |
|---|---|---|
| Same element: static utils, `hover:`/`active:`/`disabled:`/`focus-visible:`, `data-[state=…]:`, `md:`, `::before` | Direct: property value / condition key / top-level pseudo-element key | Trivial — mechanical |
| Arbitrary value / var (`h-[3px]`, `bg-(--x)`, `rounded-(--btn-radius)`) | Literal value / `'var(--x)'` (escape hatch; ESLint-warned) | Trivial |
| Logical (`ps-4`, `ms-2`, `start-0`) | `paddingInlineStart`, `marginInlineStart`, `insetInlineStart` (StyleX is logical-first) | Trivial |
| **`group-*` / `peer-*` / group-data** | `stylex.when.ancestor('[data-state="open"]')` + `stylex.defaultMarker()`/`defineMarker()` on the parent — emitter must own **both** ends | Hard; some variants `:has()`-gated |
| **`**:[svg]`, `*:` child, `[&_svg]:`, `space-x-*`, `divide-*`** | No equivalent. Refactor: give the child its own class (slot), or use `gap` | Hardest — per-component design |
| **`has-[…]`** | `stylex.when.descendant(...)` — relies on `:has()` | Hard + browser-gated |

So **exact parity is mechanical for the same-element subset, requires marker plumbing for group/ancestor cases, and requires per-component refactoring for genuine descendant selectors.** The translator returns, for every class string, the set of tokens it could **not** translate. That report is not a failure — it is the **work list the parity system hands to AI**.

## The parity system (the centerpiece of the goal)

"A system so AI can make exact parity" = generation + verification, in a loop:

1. **Generate** (mechanical): `tw-to-stylex` + `emit-stylex` produce the StyleX backend from the IR for the translatable subset, and emit explicit `// PARITY-TODO:` markers for every untranslated token (descendant/group/has). AI (or a human) resolves each marker using the strategy table above — `when.*` plumbing or a slot refactor.
2. **Verify** (independent, browser-based): render the component under **both** backends inside one `DesignSystemProvider` (identical `--color-*`/radius/density vars), walk the **variant × state matrix** (each variant value × {idle, hover, focus-visible, pressed, disabled, pending} × density × light/dark), and `getComputedStyle` the rendered node (and key descendants). Diff the computed values. Any divergence is a parity bug with an exact (variant, state, property, tailwind-value, stylex-value) tuple. This is the signal AI iterates against until green. (Computed-style diff, not screenshots, is the source of truth — robust to anti-aliasing and headless GPU quirks; see the headless-verification memory.)
3. **Guard** (CI): the matrix diff runs per component in CI so a Tailwind-source edit that isn't mirrored into StyleX fails loudly — parity can't silently rot.

The verifier is backend-agnostic by construction: it only needs two React trees and the same provider. It is the durable asset — the translator/emitter can be rewritten and the verifier still certifies the result.

### Coverage auditing (built, runnable now)

`publisher/parity.ts` is the static half of the system: `analyzeParity(stylesConfig)` runs the translator over **every** class leaf across all of a component's layers and buckets the untranslated remainder by resolution strategy (`marker` / `composite` / `pseudo` / `ancestor` / `has` / `descendant` / `unknown`). That turns "71 components, unknown effort" into a sized plan and hands AI the exact per-token to-do list. Run over the whole registry it produces `parity-audit-snapshot.md`:

> **66 components — 26 reach exact parity now, 4 need a mechanical translator/emitter extension, 5 need `when.*` marker plumbing, 31 need a per-component descendant refactor.** ~290 distinct uncovered same-element utilities remain to map (the `unknown` bucket — the table-growing work-list). Snapshot, not kept current; regenerate as the translator grows.

This audit is what sizes the goal honestly: the system + the trivial bucket work today; the descendant bucket is the real multi-week effort.

## Token strategy: consume, don't redefine

dotUI keeps the OKLCH engine emitting plain `:root { --color-* }` CSS (unchanged). The StyleX export references `'var(--color-primary)'` directly. We deliberately **do not** route tokens through `stylex.defineVars`, because the theme is generated dynamically per design system and shared across both backends — a static `defineVars` group would fork the source of truth. Trade-off: suppressible `@stylexjs/eslint-plugin` warnings on the `var()` escape hatch, and no StyleX type-safety on those vars. If first-class StyleX tokens are later wanted, mirror the engine output into a generated `tokens.stylex.ts` using **stable `--`-prefixed `defineVars` keys** (Astryx-style) so both exports share identical custom-property names. Documented; not needed for parity.

## Consumer build burden (a product decision to surface)

This is the one genuine asymmetry between the backends, and the user should decide it:

- **Authoring mode** — ship real StyleX source; the consumer adds the StyleX bundler plugin (Babel/PostCSS/Vite-unplugin). Honest "code you own," but more setup than Tailwind users have today.
- **Astryx/precompiled mode** — ship prebuilt atomic CSS + thin components; the consumer needs no plugin. Less "code you own," matches Astryx exactly.

Recommendation: authoring mode for the shadcn-CLI export (consistent with "code you own"), with the StyleX plugin added to the init bundle's setup; revisit precompiled mode for "Open in v0"/Bolt targets where a build step is friction. **Flagged for the user.**

## Proof-of-concept in this branch

- `codeOptions.styleEngine: 'tailwind' | 'stylex'` — added to `publisher/code-options.ts` (default `tailwind`), sanitized, surfaced in the `/create` "Code style" modal (`code-options/controls.tsx`), persisted through the codec automatically.
- `publisher/tw-to-stylex.ts` — the translation engine (utility→property map + variant-prefix folding + untranslated-token report). Covers Button's vocabulary + a broad core; table-driven for extension.
- `publisher/emit-stylex.ts` — IR → `stylex.create` namespaces → assembled StyleX component; wired into `publish()` behind the axis (covered components emit StyleX; uncovered ones keep Tailwind so the route is never broken).
- `publisher/parity.ts` — the coverage analyzer/auditor (above).
- `publish()` declares `@stylexjs/stylex` as a dependency on the emitted item, so `shadcn add` installs it.
- Tests prove Button's translation + emission, the RAC-state mapping, composite passthrough, and pin the parity contract.

## Verification & hardening (2026-06-30)

The PoC was driven through an adversarial find→verify review (26 agents over 6 correctness lenses) plus a dedicated empirical StyleX probe. What changed as a result:

- **States key off React-Aria data attributes, not native pseudo-classes.** dotUI styles RAC roots (which carry `data-rac`); the `tailwindcss-react-aria-components` plugin compiles unprefixed `hover:`/`disabled:`/`focus-visible:` to RAC `[data-hovered]`/`[data-disabled]`/`[data-focus-visible]` selectors on those roots. The translator now emits the same — keeping `:hover`/`:disabled` would diverge on touch (sticky hover) and on non-form RAC roots (a disabled `<a>` carries `data-disabled` but never matches `:disabled`). Empirically confirmed bare `[data-*]` keys are valid StyleX conditions (`@stylexjs/babel-plugin@0.19.0`); an `&`-prefixed key is **not** — never emit `&[data-*]`.
- **dotUI composite utilities pass through as literal classNames.** `focus-ring`/`focus-reset`/`focus-input` are same-element `@utility`s shipped in `base.css`; StyleX layers cleanly with an external class, so the emitter keeps them (restoring the focus ring) instead of dropping them to the TODO list.
- **Translator coverage fixes** caught by the audit's `unknown` bucket: `rounded-full` → `calc(infinity * 1px)` (no `--radius-full` var exists; Tailwind emits the literal, so a `var(--radius-full)` would be an invalid 0-radius); `leading-*` + the `text-<size>/<leading>` modifier; arbitrary CSS properties (`[transform:…]`); `p`/`m` as inline+block logical longhands so a later `px-*`/`p-0` overrides per-property like `tailwind-merge`; negative margins.
- **Rejected finding (recorded):** a reviewer claimed a variant's `default` for a property would drop base's conditional (`:disabled`) styling for that property under `stylex.props`. Refuted — StyleX merges per *(property, condition)* atomic class, so base's `[data-disabled]` value coexists with a variant's `default`/`[data-hovered]`. No change made; the merge is correct.

### Still open / known limits

- **The var contract.** dotUI's `theme.css`/`base.css` are authored in Tailwind v4 (`@theme`, `@utility`), so `--spacing`/`--text-*`/`--color-*`/`--radius-*` all come from the Tailwind theme layer. The StyleX components consume those `var()`s, so the realistic model is **StyleX component files layered over dotUI's (Tailwind-authored) theme + utility CSS** — not "no Tailwind at all." Going fully Tailwind-free would mean emitting a plain-CSS theme. Product decision (see below).
- **Scope gating.** The emitter handles the flat, single-resolver shape (Button, ToggleButton…). Slotted + compound-variant components return `handled: false` and keep Tailwind output, so the route is never broken — they're the rollout.

## Rollout plan (per-component, after the system lands)

1. **Audit** — done and automated: `analyzeParity` buckets every component (see `parity-audit-snapshot.md`). Re-run it to track progress; the `unknown` bucket is the translator's to-do list.
2. **Extend the utility table** until the trivial bucket is fully covered (the verifier's untranslated report drives this).
3. **Port marker-plumbing components**: emit `when.*` + markers on both the styled element and its parent.
4. **Refactor descendant components**: lift `**:[svg]`/child rules into real slots/`gap` so both backends can express them — this is a change to the *canonical* Tailwind source too (it stays the single source; the refactor is backend-neutral and improves the Tailwind output as well).
5. **Synced groups stay synced** (Button ⇄ ToggleButton): port a group together.
6. **Wire the matrix verifier into CI** as each component goes green.

## Open questions for the user (product decisions)

1. **Theme layer for StyleX consumers.** Keep Tailwind installed purely for dotUI's theme/utility CSS (which defines `--spacing`/`--text-*`/`--color-*` and the composite `@utility`s) and ship StyleX *component* files on top — simplest, works today, mild "Tailwind + StyleX" oddity — **or** generate a plain-CSS theme so StyleX consumers need no Tailwind at all (more work, cleaner story). Recommendation: ship-on-Tailwind-theme first; add the plain-CSS theme when "fully Tailwind-free" is demanded.
2. **Authoring vs precompiled** consumer mode (StyleX bundler plugin in the consumer's project, vs Astryx-style prebuilt atomic CSS). Recommendation: authoring mode for the CLI export; precompiled for "Open in v0"/Bolt where a build step is friction.
3. **Reach:** StyleX a peer choice everywhere (CLI + v0 + Bolt…) or CLI-first to start?
4. **ESLint** `var()`-escape-hatch + `[data-*]`-key warnings (`@stylexjs/eslint-plugin`): ship a recommended config snippet, or mirror tokens into `defineVars`?
