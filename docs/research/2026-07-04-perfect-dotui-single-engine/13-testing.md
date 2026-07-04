# Testing & invariants
> Part of [The Perfect dotUI (single-engine)](README.md) — an end-state architecture study (2026-07-04). Constitution-conformant.

Every other chapter makes a promise. [Styles](04-styles.md) promises that a button renders identically in the live preview and in the exported Tailwind file. [Tokens](05-tokens.md) promises that a `dark·hc` cell is legible by construction. [The builder](10-builder.md) promises a hue drag holds 60fps over a full showcase. [The compiler](11-compiler.md) promises `preview` and `export` are the same bytes because they are the same function. [Distribution](12-distribution.md) promises that a two-year-old [dsdoc](09-dsdoc.md) opens against its frozen [Registry Manifest](03-registry.md) and exports the system it always described.

This chapter is where those promises become failing builds. A promise that isn't a test is a wish, and dotUI has no wishes — it has **eight invariants**, each protecting exactly one of those claims, each with a mechanism, a corpus, a gate it runs at, and a defined failure. The design is arranged so that *most* fidelity is structural — the same `compile()` runs in both realms, the same `resolve()` produces preview and export — and the test suites exist to catch the narrow seams the structure can't close on its own: the one preview shim, the migration ladder that must never be edited, the reconstruction gap that names a missing axis.

The register of this chapter is operational. For each invariant: **what property it protects**, **the mechanism** (golden file, property test, computed-style render diff, fixture corpus, visual regression, byte compare), **an example failure it catches** (with real fixture values), and **where it runs** — one of five gates:

| Gate | Runs | Speed budget | Blocks |
|---|---|---|---|
| **pre-commit** | oxlint + oxfmt + registry lints, staged files only | < 2s | the commit |
| **registry build** | `pnpm build:registry` → style resolution, resolution-completeness | < 30s | `__generated__` drift, unmergeable PR |
| **PR CI** | everything above + live-variants, cascade≡resolution, migration corpus, codeStyle | < 8min | merge |
| **release gate** | full visual-regression on the golden five, perf benchmark, byte-parity, full-matrix contrast | < 25min | publishing a Manifest |
| **strict export** | per-request contrast on the actual dsdoc | < 500ms | a single user's export |

The last gate is different in kind: it runs in production, per export request, on a document the test authors never saw. It is the one place the invariants meet an adversary — an arbitrary user system — and it must fail *that user*, with a machine-readable report, not the build.

---

## 0. The map of invariants

```mermaid
flowchart TB
  subgraph AUTHOR["Authoring — pre-commit + registry build"]
    L1["#6 Registry lints<br/>hardcoded-value · boundaries · id permanence · sizes() mandatory"]
    L3["#3 Resolution completeness<br/>every declared var-write & scalar survives to the shipped tv()"]
  end
  subgraph FIDELITY["Fidelity — PR CI"]
    F1["#1 Preview == export byte-compare<br/>baked default byte-equals server compile"]
    F2["#2 Live-variants conformance<br/>property test + sampled computed-style diff"]
    F8["#8 codeStyle AST-equivalence"]
  end
  subgraph GRAPH["Graph & modes — PR CI + strict export"]
    G6["#7 Resolve determinism<br/>pure resolve; incremental ≡ cold"]
    G7["#4 Contrast matrix<br/>every pairing × every reachable cell → strict gate"]
  end
  subgraph LONGEVITY["Longevity — PR CI + release gate"]
    V8["#5 Manifest longevity / reconcile<br/>frozen migrations × captured real docs per schema version"]
  end
  L1 --> L3 --> F1
  F1 --> F2 --> G7 --> G6 --> F8 --> V8
```

The ordering is not arbitrary — it is the pipeline order, and CI runs it that way because each stage presupposes the last. A lint failure (#6) means `styles.ts` can't even be resolved, so live-variants (#2) is meaningless until it's green. Resolution completeness (#3) is the precondition that *makes* fidelity provable: if a declared var-write is stripped on the way to the shipped `tv()`, no downstream render diff is testing the system the source described. So the cheap, structural checks gate the expensive, rendered ones, and a red build points at the earliest broken stage.

With a single engine there is no cross-engine matrix to prove agreement over — there is one emission, not two. The two-engine sibling study paid for a full render-matrix agreement suite and a vocabulary-totality gate to keep two emitters interchangeable; neither exists here, because there is nothing to hold in agreement. What remains is the one seam where preview and export code genuinely differ — the live-variants shim — plus the structural byte-compare that pins them together at t=0.

---

## 1. Preview == export byte-compare — the baked default equals a fresh compile

**Property protected.** The load-bearing promise of the whole compiler: `preview` and `export` are the same bytes because they are the same [`compile()`](11-compiler.md). The builder adopts a **baked default `PreviewOutput`** at startup so there's never an unstyled frame while the worker boots. That baked artifact must be byte-identical to what the server's `compile()` produces for the default dsdoc — otherwise the first frame the user sees is subtly wrong until the worker swaps it, and "preview equals export" has a hole exactly at t=0.

**Mechanism — byte compare.** At release-gate build, `compile(resolve(manifest, defaultDsdoc), { kind: 'preview' })` is run fresh on the server, producing `{ themeCss, utilitiesCss, runtimeVarsCss }` plus the resolved `tv()` config for each sync group. Each string is byte-compared against the committed baked default the builder ships (`packages/runtime/baked/default.preview.json`). Byte-equal, not semantically-equal: the baked artifact is *the same function's output*, so any difference is a staleness bug, and byte comparison catches it with zero tolerance. Because there is one engine, there is no second target to re-run this against — the single emission is the whole comparison surface.

**Example failure it catches.** A contributor changes Button's default radius token from `radius.md` to `radius.sm` in the Manifest baseline but doesn't rebuild the baked default. The fresh compile emits `--btn-radius: var(--radius-sm)`; the baked default still says `--radius-md`:

```
FAIL preview==export · themeCss
  fresh:  "--btn-radius: var(--radius-sm);"
  baked:  "--btn-radius: var(--radius-md);"
  → baked default is stale. Rebuild packages/runtime/baked/ and commit.
```

**Where it runs.** Release gate, and locally on `pnpm build:registry` when the baked artifact is a tracked `__generated__` file, so drift is caught in the same registry-drift job that guards the rest of `__generated__`.

---

## 2. Live-variants conformance — the one preview seam

**Property protected.** The builder preview mounts the *real* registry `base.tsx` files, whose `./styles` import resolves to a live style module (`createLiveVariants`) instead of the exported `tv()` call. This is the [single deliberate seam](10-builder.md) between "what you preview" and "what you export." The invariant: `createLiveVariants(x)(props)` produces exactly the class string that `tv(emit(resolved))(props)` produces, for every component pattern and every prop combination. With no engine-neutral IR between preview and export, and no cross-engine matrix to cross-check them, **this shim is the only place preview and export code differ** — so it is the single guarantee of "what you see is what you own." It is the load-bearing fidelity invariant of the whole study.

**Mechanism — property test *plus* sampled computed-style diff** (the constitution's explicit "both" ruling). Two layers:

1. **Property test (class identity).** For randomized `props` — generated with `fast-check` over each component's variant/size/boolean domains plus `className` overrides — assert string equality:
   ```ts
   fc.assert(fc.property(arbProps('button'), (props) =>
     createLiveVariants('button')(props) === tv(exportedButtonConfig)(props)
   ))
   ```
   Run per `base.tsx` shape: slotless (Button), slotted (`useStyles()()` — Menu with its 6 slots), and compound-variant-bearing. This is fast (no DOM, thousands of cases) and it catches the *structural* drift — a slot the shim forgot, a compound variant it resolves in a different order, a `className` merge that `tv()` does with `tailwind-merge` but the shim doesn't.

2. **Sampled computed-style diff.** String identity proves the *class list* matches; it does not prove the live module and the exported code, mounted as real components, *render* the same. A curated sample matrix per component (default cell, one hovered, one pressed, one slotted-with-icon) is rendered twice — live module vs. exported `tv()` — into the same DOM host under the same resolved [`ResolvedSystem`](11-compiler.md), and `getComputedStyle`-diffed over a curated property set (`backgroundColor`, `color`, `borderColor`, `borderRadius`, `paddingInlineStart/End`, `blockSize`, `gap`, `boxShadow`, `outline*`, and the slot-scoped `--*` custom properties). States are driven, not faked: `pressed` via `page.mouse.down()` held on the target, `focus-visible` via keyboard `Tab`, `disabled` via props, `hover` via `page.hover()`. This closes the gap where the shim returns the right string but wires it to the wrong slot element.

**Why both.** The property test is cheap and exhaustive over props but blind to mounting. The computed-style sample is expensive and narrow but catches mounting. Neither alone is sufficient: a shim that returns correct strings but attaches them to a stale DOM ref passes the property test and fails the sample; a shim that renders correctly for the sampled cells but mis-merges an un-sampled `className` passes the sample and fails the property test.

**Example failure it catches.** `createLiveVariants` for Menu must be signature-compatible with the slotted `useStyles()()` pattern. If the shim's slot resolver returned the `item` slot's classes for both `item` and `itemLabel` (an off-by-one in the slot map), the property test fires:

```
FAIL live-variants · menu · slot=itemLabel · props={size:'md'}
  live:  "text-sm gap-2 px-2 py-1 **:[svg]:not-with-[size]:size-4"   (item's classes)
  tv():  ""                                                          (itemLabel is empty)
```

**Where it runs.** PR CI. The shim is load-bearing for the entire fidelity argument — it gets a conformance suite, not trust.

---

## 3. Resolution completeness — no-strip, every declared var survives

**Property protected.** Style resolution turns `styles.ts` into the shipped `tv()` config by resolving named-style param deltas, folding density, resolving scalar/component vars, and **preserving declared CSS-var writes verbatim**. The invariant: the shipped output contains every declared var-write and every scalar the source referenced. This is the structural guarantee behind decision **N2** — the old `menu.highlight = accent` export bug is impossible not because a test happens to catch it, but because there is *no strip step* in resolution that could drop the var. This test proves the no-strip property holds as resolution changes.

**Mechanism — enumeration over the resolved config.** A pure build-time test, no DOM. For each component it walks the authored `styles.ts` and collects every referenced identifier: named-style `vars` blocks (`{ '--color-highlight': 'var(--accent-500)' }`), inline `[--x:var(--y)]` writes, and every scalar/component var (`--btn-radius`, radius factor). It then walks the resolved `tv()` config the compiler produced and asserts each referenced write is present, in the correct `tv()` section (base / slot / variant / compound). It's a totality check over a finite set — sub-second, structural.

**Example failure it catches.** Menu's `highlight = accent` param declares:

```ts
// menu/styles.ts — the real fixture
accent: { vars: { '--color-highlight': 'var(--accent-500)', '--color-fg-on-highlight': 'var(--on-accent-500)' } }
```

If a resolution stage dropped a declared `vars` entry on its way into the shipped `tv()` — the exact class of bug decision N2 makes structurally impossible — the shipped config for the `item` slot would carry `focus:bg-highlight` with no `--color-highlight` write to back it, so the class resolves to an unset custom property at runtime. Resolution completeness reports it at build time, before any render:

```
FAIL resolution-completeness · menu · param=highlight=accent
  source declares declaredVar '--color-highlight' (menu/styles.ts:41)
  resolved tv() config for slot 'item': absent
  → a declared var-write was dropped during resolution. There is no strip step; this is a resolution bug.
```

Because declared var-writes are carried into the shipped output verbatim, this bug is normally structurally impossible; resolution completeness is the proof that it stays impossible when the resolver changes.

**Where it runs.** Registry build (sub-second, part of `pnpm build:registry`), re-asserted in PR CI.

---

## 4. The contrast matrix — every pairing, every reachable cell, and the strict gate

**Property protected.** A design system cannot ship an illegible primary button. The [tokens chapter](05-tokens.md) derives contrast pairings *structurally* — from contract `pairsWith` edges (created by `surface()`), from `on`-values, and from declared semantic pairs — and verifies each in *every reachable cell*, holding `hc` cells to higher targets. This invariant has two faces: a **test** (the verifier is correct) and a **gate** (a real export in `strict` mode is blocked until every pair passes).

**Mechanism — two layers.**

1. **Verifier correctness (PR CI).** Golden-file tests over hand-constructed graphs with *known* contrast outcomes: a pair known to pass AA at 4.6:1, a pair known to fail APCA Lc 45, a `hc` cell where a pair passes normal targets but fails the boosted target. Assert `verifyGraph` classifies each exactly. This proves the WCAG2 and APCA math, the target-boosting for `contrastBoost` cells, and the `alpha`/`mix` composite handling (a `bg-inverse/10` over a resolved surface is verified against the *composited* color, not the token). The verifier is incremental in the builder (touched pairings × affected cells) and full-matrix at export — a golden test asserts the incremental result equals the full-matrix result for the same edit, so the fast path can't diverge from the slow path.

2. **The strict export gate (production, per request).** When a user exports with `verification: 'strict'`, `resolve()` runs the full-matrix verification on *their* graph. If any pairing fails in any reachable cell, the export is **blocked** and returns a machine-readable report — not a build failure, a *user-facing* one:
   ```jsonc
   { "status": "blocked", "mode": "strict",
     "failures": [
       { "pair": ["btn-fg-default", "btn-bg-default"], "cell": "scheme:dim&contrast:hc",
         "metric": "APCA", "value": 38, "target": 60,
         "proposedFix": { "op": "setValue", "node": "btn-fg-default",
           "cell": "scheme:dim&contrast:hc", "value": { "kind": "on", "of": "p:neutral-300" } } } ] }
   ```
   The fix is a **proposed, cell-scoped graph edit** — never a silent output correction (that would break source↔preview↔export equivalence). Headless callers (CI pipelines, agents) pass `--accept-fixes` to apply the proposed cell-scoped edits and emit a new Manifest-pinned dsdoc; interactive callers see the proposal and accept it in the builder. Either way the failing base value is never mutated — only a new, more-specific cell key is appended.

**Example failure it catches.** The worked "add a `dim` scheme" flow from the [tokens chapter](05-tokens.md): after adding the `dim` option, `btn-fg-default ↔ btn-bg-default` passes in `dim·normal` but fails APCA in `dim·hc` (the `hc` target is boosted toward AAA, and the dim surface is too close to the on-color). Strict export blocks; the proposed fix appends `{ cell: 'scheme:dim&contrast:hc', value: on(p:neutral-300) }`; accepting it makes only that cell change; re-export passes. The base value and every other cell are untouched — the fix cannot regress `dim·normal` or `light·hc`.

**Where it runs.** Verifier correctness: PR CI (golden) + release gate (full-matrix over the golden five). The gate itself: strict export, per request, in production.

---

## 5. Manifest longevity / reconcile — frozen migrations, captured real documents

**Property protected.** A [dsdoc](09-dsdoc.md) carries three version numbers; the one this protects is `dsdoc` — the *schema major*. When dotUI ships `dsdoc: 2`, every stored `dsdoc: 1` document must migrate through a pure `up()` function to the new shape, losslessly, forever. A migration, once shipped, is **frozen** — it can never be edited, because editing it retroactively changes how already-migrated documents were interpreted. The catastrophic failure this guards against: a subtly-wrong migration that produces a *structurally valid but semantically wrong* document — validation passes, the user's system is silently corrupted, and it surfaces months later as "my primary color changed." A two-year-old dsdoc must open against its frozen Manifest and export the system it always described.

**Mechanism — a fixture corpus, frozen per schema version.** For every schema version there is a directory of captured *real* documents — not synthetic minimal cases, but actual dsdocs pulled (with consent, anonymized) from stored user systems, chosen to cover the shapes that exist in the wild: literal-ramp systems, systems with user-added dimensions, systems with raw class-string `ComponentOverride` deltas, systems near the soft-cap, systems with detached sync groups.

```
packages/schema/migration-corpus/
├── v1/
│   ├── geist.dotui.json                 # the worked Geist doc, frozen at dsdoc:1
│   ├── real-0042.dotui.json             # captured: 4 dimensions, fixed neutral ramp
│   ├── real-0117.dotui.json             # captured: detached toggle-button, custom tokens
│   └── expected/                        # each doc's canonical form AFTER up() to v2, frozen
│       ├── geist.dotui.json
│       └── …
├── v2/ …
```

Each `vN` doc has a frozen `expected/` counterpart: its exact canonical form after migrating to `vN+1`. The test loads every `vN` doc, runs the frozen migration ladder to HEAD, and byte-compares against the frozen expected output. Because both the migration *and* the expected output are frozen, a change to the migration code that alters *any* historical document's outcome fails loudly — you literally cannot edit a shipped migration without a test going red and telling you which real document you'd have corrupted.

When `dsdoc: 3` ships, the `v1/expected/` files are *regenerated to v3* and re-frozen — but the regeneration is itself reviewed: the diff between "v1 doc migrated to v2 then v3" must be inspectable, and a surprising change in a two-major-version-old document is a red flag caught in review.

**Example failure it catches.** `dsdoc: 1 → 2` renames the token category `"dimension"` to `"space"`. A naive migration does a blind string replace and also rewrites a *user's custom token* literally named `dimension` in its `description`. The frozen `real-0042` document had exactly such a description; its expected v2 output preserves the description verbatim:

```
FAIL migration-corpus · v1/real-0042 → v2
  path: tokens.tokens["radius-factor"].description
  expected: "the base dimension multiplier"
  actual:   "the base space multiplier"
  → migration mutated a description string; category rename must target the `category` field only
```

**Migrations are total-or-loud.** A document that reaches an unmapped id or an un-migratable shape does not fall back to defaults (today's silent-reset bug, structurally deleted) — it throws a *typed* error naming the section, the rule, and the specific id. A corpus fixture that is *meant* to be rejected (a genuinely corrupt input) asserts the exact error type and message. Silent data loss is not a failure mode the system has; it's a test. `reconcile` — the pass that re-pins an old dsdoc against a newer Manifest — is exercised by the same corpus: each fixture is reconciled against its frozen Manifest and the result byte-compared.

**Where it runs.** PR CI (fast — pure functions, byte compares) and release gate (the full corpus, including the largest captured documents).

---

## 6. Registry lints — the authoring guardrails

**Property protected.** The [registry](03-registry.md) is the product's source of truth and must stay clean and resolvable. A small set of lints protect distinct properties, all at pre-commit and registry build so a violation never even reaches the more expensive suites. These are the cheapest, earliest gates — a lint failure means `styles.ts` can't be resolved, so nothing downstream is meaningful.

| Lint | Property | Fails when | Example (real fixture) |
|---|---|---|---|
| **`dotui/no-hardcoded-design-values`** | The "would two design systems disagree?" test | A design value (color, radius, shadow, density-affected spacing) is a literal instead of a token | `bg-[#635bff]` when `bg-primary` exists → warning with the token hint; `rounded-[7px]` on a component root |
| **`dotui/import-boundaries`** | Registry items import only from `@dotui/{style,tokens,runtime}`, relative paths, and published packages | A www-side import leaks in | `import { RouterLink } from '@/components'` inside a `base.tsx` |
| **`dotui/id-permanence`** | Published token/axis/component ids are never removed or reused | A committed id disappears or its slug is reassigned to a different node | `btn-bg-primary` deleted without a deprecation alias |
| **`dotui/sizes-mandatory`** | Every component's `styles.ts` declares a `sizes()` geometry table | A component ships geometry inline instead of through the density × size table | a button with `h-9 px-4` hardcoded on `base` instead of in `sizes()` |

**The hardcoded-value lint is a warning with a hint, not a totality gate.** Because there is no closed authoring whitelist — everything Tailwind is legal (`:has()`, `peer-*`, descendant combinators, arbitrary selectors, container queries) — the only style discipline that remains is CLAUDE.md's "would two design systems disagree on it?" It does not ban all literals: component *mechanics* (`border`, `p-0`, `top-1/2`, hairlines, `**:[svg]:shrink-0`) are allowlisted, because those are internal layout, not design decisions. A design-meaningful literal (`bg-[#635bff]`, `rounded-[7px]`) gets a **warning with a token hint** a contributor can justify — not a build-blocking gate. A radius would disagree between two systems; a `shrink-0` wouldn't. A genuinely new mechanic that isn't allowlisted warns *with a prompt to justify it as mechanics or tokenize it* — the contributor is never left guessing.

**Example failure it catches.** A contributor copies a shadcn button class verbatim including a hardcoded focus ring color:

```
WARN dotui/no-hardcoded-design-values · button/styles.ts:9
  'focus-visible:ring-[#3b82f6]' hardcodes a design color
  → an available token covers this: use `focus-visible:focus-ring` (writes --color-focus-ring)
  If no token covers the look, flag the missing axis — do not invent a literal.
```

**Where it runs.** Pre-commit (staged files, sub-second) and registry build (whole registry). The pre-commit run is the first line: it's the fastest feedback and it keeps `main` resolvable at every commit.

---

## 7. Resolve determinism & cascade ≡ resolution — two machines, one value

**Property protected.** Two properties share this section because both are "an independent machine reproduces `resolve()`'s answer." First, **resolve determinism**: `resolve` is pure, so identical `(manifest, dsdoc)` produces byte-identical `ResolvedSystem`, and the builder worker's incremental edits converge to the same state as a cold resolve. Second, **cascade ≡ resolution**: the [Dimensional Token Graph](05-tokens.md) resolves a node in a cell by a precise rule — *most-constrained cell key wins, ties by `dimensionPriority`* — and the emitted CSS reproduces that resolution through an *entirely different mechanism*: paired media/attribute selectors ordered by ascending specificity, so the browser's cascade lands on the same value the resolver computed. If the topological resolver in TypeScript and the CSS cascade in the browser disagree, the preview is right and the export is wrong (or vice versa) — and the disagreement is silent, because both "work," they just work differently.

**Mechanism — determinism byte-compare + property test over random graphs and cubes.**

1. **Determinism.** Run `resolve(manifest, dsdoc)` twice, byte-compare the `ResolvedSystem`. Then replay the builder worker's classified-edit path from cold to the same target state and assert the incremental result byte-equals the cold resolve — this proves the worker's `setProperty`/patch fast path converges to the canonical answer.

2. **Cascade ≡ resolution** (the heaviest property test in the suite, because the failure mode is combinatorial and adversarial ordering is the classic bug):
   - Generate a random valid `TokenGraph`: random ramps, random semantic nodes with random `ref`/`on`/`alpha`/`mix`/`calc` values, random cell-keyed overrides across a random **mode cube** (up to the soft-cap 4 dimensions / 24 cells).
   - Compute the *oracle*: `resolve(graph)` in TypeScript, giving the expected value of every node in every reachable cell.
   - Emit the CSS (`@theme` + `:root` + paired per-cell delta blocks).
   - For every reachable cell, load the emitted CSS in a headless browser, force that cell (`data-scheme`/`data-contrast`/… on the root — the exact mechanism the builder uses to preview a cell), and read the computed value of every emitted custom property.
   - Assert `browserValue === oracleValue` for every (node, cell).

**Why random graphs, not fixtures.** A fixture graph tests the shapes the author imagined. The cascade-order bug lives in the shape the author *didn't* imagine — a compound cell `scheme:dark&contrast:hc` whose delta block emits at lower specificity than a plain `contrast:hc` block, so the browser picks the wrong one. Random generation with cube overrides is the only way to reach the adversarial ordering.

**Example failure it catches.** The generator produces `color-border` with `{ '': neutral-300, 'contrast:hc': neutral-500, 'scheme:dark': neutral-700 }` and forces `dark·hc`. The resolver's oracle says `contrast:hc` wins (higher `dimensionPriority` than `scheme`) → `neutral-500` *of the dark-generated ramp*. If the emitter ordered the `[data-contrast="hc"]` block *before* the `[data-scheme="dark"]` block (wrong — equal specificity, source order decides, and `dark` would then win), the browser computes `neutral-700`:

```
FAIL cascade≡resolution · node=color-border · cell=scheme:dark&contrast:hc
  oracle (resolver):  var(--neutral-500)   [contrast:hc wins by dimensionPriority]
  browser (cascade):  var(--neutral-700)   [scheme:dark block emitted last, wins by source order]
  → delta-block emission order violates ascending-specificity contract for compound cells
```

This is the single most important token-layer test: the [tokens chapter](05-tokens.md) rests its "delta emission reproduces resolution exactly" claim entirely on the paired-selector emitter being provably correct, and this is the proof.

**Where it runs.** PR CI (a bounded number of generated graphs per run, seeded for reproducibility) and release gate (a much larger generated corpus, longer budget). A shrunk counterexample is printed on failure so the offending graph is minimal and debuggable.

---

## 8. codeStyle AST-equivalence — the ownership layer never changes behavior

**Property protected.** [`codeStyle`](11-compiler.md) shapes the *appearance* of exported code — arrow vs. declaration functions, `tv()` class arrays vs. one-line, section comments, import order, token indirection flatten vs. preserve, density baked vs. runtime. Every one of these is an AST transform over the `tv()` emitter's output. The invariant: **every `codeStyle` transform is AST-equivalent modulo formatting to the canonical emitter output.** Changing how the code *looks* must never change what it *does*.

**Mechanism — parse-back AST comparison.** For each component and each `codeStyle` option (and a sampled matrix of option *combinations*), emit the file, then parse both the canonical-`codeStyle` output and the transformed output back to ASTs, strip formatting-only nodes (whitespace, comment nodes for the `comments` axis, statement order for the `imports.sortOrder` axis), and compare the normalized ASTs for structural equality. The transforms operate on typed ASTs — section boundaries derive from the `tv()` structure (base / slots / variants / compounds), never from `// MARK:` regex — so the test is checking that a real AST transform preserved semantics.

Two transforms need more than AST equality:

- **`tokenIndirection: flatten | preserve`** changes emitted *values* (`bg-primary` vs. `bg-(--btn-bg-primary)`). AST equality alone would flag these as different. The test instead asserts the two emissions *resolve to the same computed styles* — a small computed-style diff, reusing #2's harness — because flatten and preserve are the same decision expressed two ways.
- **`density: baked | runtime`** changes the shipped class set (folded vs. `data-density` axis). The test asserts that for each density tier, the baked output and the runtime output *at that tier* compute identical styles.

**Guarantee: oxfmt/format is never silently swallowed.** The final emitted file is run through `oxfmt`; the test asserts the formatter is idempotent on the output (`oxfmt(oxfmt(x)) === oxfmt(x)`) and that a formatting failure surfaces as an error, not a silently-unformatted file.

**Example failure it catches.** The `functions: 'declaration'` transform, converting an arrow component to a function declaration, accidentally drops the `displayName` assignment (`Button.displayName = 'Button'`) that the arrow form carried as a trailing statement:

```
FAIL codeStyle-ast · button · functions=declaration
  canonical AST has ExpressionStatement: Button.displayName = "Button"
  transformed AST: missing
  → transform is not AST-equivalent: a statement was dropped, not just reformatted
```

**Where it runs.** PR CI. The transforms are pure and fast; the computed-style sub-checks for `tokenIndirection`/`density` add a small browser cost.

---

## 9. Golden reference dsdocs — reconstruction as a visual-regression test

**Property protected.** The [north star](07-reconstructions.md): the builder is flexible enough to recreate almost any design system. Five maintained reference dsdocs — **Material 3**, **Geist**, **Linear**, **classic enterprise**, and **shadcn** — are the proof. This makes the proof *continuous*: the golden five are validated, published, and visual-regression-tested every build, and **a reconstruction gap is a failing test that names the missing axis**. This is where "flag the missing axis; don't invent a token" stops being a discipline and becomes a red build. (It sits alongside the eight invariants as a product-thesis guard rather than a fidelity seam, but it runs on the same gates.)

**Mechanism — three-part, per golden doc.**

1. **Validate + resolve.** Each golden dsdoc is loaded through the migration ladder, validated against the [JSON Schema](09-dsdoc.md), and resolved against its pinned Manifest. A resolve error (an unmapped token, a broken `ref`, a sync invariant violation) fails here — the reconstruction is not even well-formed.

2. **Render + visual-regression.** A canonical showcase (buttons, menus, inputs, cards, the type scale, the contrast readout) is rendered under each resolved system in a headless browser and screenshot-diffed against a committed golden image, per scheme and per contrast cell. Visual regression *is* the right tool here — the thing under test is a *look*, and a pixel diff against "what Material 3 is supposed to look like" is exactly the assertion. Thresholded (a small per-pixel tolerance for antialiasing) with a diff image surfaced on failure.

3. **Reconstruction-gap detection.** Each golden doc carries a `reconstructionTargets` manifest: the specific looks it is *supposed* to achieve (Geist's flat black button, Material 3's tonal fill and pill radius, Linear's translucent overlays + hover-lift, enterprise's zero-radius outline). The test asserts each target is reachable *through an axis or overlay*, not through a raw class-string override. If a target can only be hit by hand-editing raw classes with no covering axis, the test fails and names the gap:

```
FAIL golden · linear · reconstruction-target "command-palette-blur"
  target look: translucent command palette with 20px backdrop blur
  no axis writes `--menu-backdrop-blur`; overlays.blurStrength caps at 12px
  → MISSING AXIS: backdrop-blur strength for overlay surfaces (proposed: extend overlays.blurStrength range)
  This is not a test bug. Add the axis to the Manifest or the target is not reconstructable.
```

That failure is the mechanized form of the CLAUDE.md rule. It doesn't tell you to hardcode `blur-[20px]`; it tells you an axis is missing and the north star is not met until it exists.

**Example failure it catches (visual).** A change to the `oklch` producer's dark-derivation shifts Material 3's dark-scheme surface tone. The Geist and shadcn goldens are unaffected (Geist uses a `fixed` neutral ramp; shadcn its own), but Material 3's dark showcase screenshot diffs against its golden:

```
FAIL golden · material3 · showcase · cell=scheme:dark
  visual diff 3.1% > threshold 0.5%  (surface tone shifted, diff image attached)
  regressions: card.background, menu.background, popover.background
```

Whether that's a regression or an intended improvement is a human call — but it's a *surfaced* call, with a diff image, not a silent drift. Accepting it means re-committing the golden image in the same PR, which is a reviewed act.

**The golden five are also the shared fixtures.** Geist is *the* worked dsdoc across every chapter — the [config-axes worked example](09-dsdoc.md), the reconstruction, and this golden. Reusing one document as fixture everywhere means a change that breaks Geist breaks it visibly in the chapter examples, the reconstruction test, and the migration corpus at once.

**Where it runs.** Release gate (full visual regression — it's the slowest suite, and a Manifest publish is exactly the moment reconstruction must hold). Reconstruction-gap detection (parts 1 and 3, no screenshots) also runs in PR CI, so a PR that removes an axis a golden depends on fails before merge.

---

## 10. Unit-test layout and the fixture strategy

The eight invariants (plus the golden-reconstruction guard) are the *integration* spine. Beneath them, each package carries unit tests scoped to its own kernel, and one shared fixture strategy runs through all of them.

**Per-package unit tests.**

| Package | What its unit tests cover | Notable coverage |
|---|---|---|
| `@dotui/schema` | Canonical form idempotence, `validate()` against the JSON Schema, each migration `up()` in isolation, `reconcile` | `canonicalize(canonicalize(x)) === canonicalize(x)`; every migration is total on its version's fixtures |
| `@dotui/tokens` | Each producer (`oklch`, `tailwind`, `contrast`, `material`, `fixed`), graph edits + invariants (Tarjan cycle, layer-violation, dup-slug, contract-integrity), `verify` (WCAG2/APCA math, nudge), DTCG (de)serializer round-trip | producer determinism (same config + cell → same ramp); `applyEdit` rejects without mutating |
| `@dotui/style` | Style resolution (param / named-style / density / scalar / declared-var passes), the `tv()` emitter, the `codeStyle` AST transforms, the hardcoded-value lint — all as pure functions | each resolution pass has a golden input/output pair |
| `@dotui/compiler` | `resolve()` stages (validate → migrate → graph merge → ramp materialization → axis resolution → style resolution), each `compile()` target | resolve is deterministic; precedence + sync fan-out + detach |
| `@dotui/runtime` | `DesignScope` scoping/containment, `createLiveVariants` slot resolution, worker protocol serialization | (its cross-package guarantee is #2) |
| `@dotui/cli` | `plan()` — clean overwrite on pristine-hash match, 3-way merge on edited files | pristine hash detection; conflict-marker output |

The heaviest unit suite belongs to `@dotui/tokens` — the producer and verify tests — because the color math is where a silent numeric bug does the most damage and a rendered test wouldn't localize it. `@dotui/style` is deliberately small: with one engine it owns resolution, one emitter, the AST transforms, and one lint — no lift/normalize pass, no second emitter, no intermediate schema to migrate.

**The shared fixture strategy.** Fixtures are shared *by design*, not by accident, so a change that breaks a fixture breaks it in every suite that uses it — the blast radius is visible.

- **Button** — the shared component fixture for *authored input*: today's real `styles.ts`, with its `pending:**:not-data-[slot=spinner]` complement expansion, `[--color-disabled:var(--neutral-500)]` var-writes, `not-with-[size]` icon guards, and `sizes()` density table. Every style-layer suite (resolution, the emitter, live-variants, codeStyle) runs on Button. It is the worst case that exercises every resolution pass at once.
- **Menu** — the shared fixture for *slotted components and declared var-writes*: 6 slots, the `highlight` param with its `--color-highlight`/`--color-fg-on-highlight` vars. It is the fixture that proves the menu.highlight export bug stays dead — every suite that could regress it (resolution-completeness #3, live-variants #2, codeStyle #8) touches Menu.
- **Geist** — the worked *dsdoc*: the reconstruction, the golden (#9), the migration corpus anchor (#5), the config-axes worked example. One document, four roles.
- **The golden five** — the reconstruction set (#9), doubling as the largest realistic `resolve()` inputs for compiler unit tests.

Because Button and Menu are the *real* registry files (not simplified test doubles), the fixtures can never drift from the product — they *are* the product. A contributor who changes Button's styles updates the same file every style test reads.

---

## 11. Performance regression — the frame-budget benchmark

The 60fps promise is a number, and a number needs a regression test, because performance rots silently — a well-meaning refactor that adds one whole-doc clone per edit doesn't fail any correctness test, it just makes the hue drag stutter, and nobody notices until a user does.

**The benchmark — the hue drag, measured.** The canonical worst case from the [builder chapter](10-builder.md): dragging the accent hue over a full showcase (3 menus ≈ 40 items, buttons, inputs, cards). The benchmark drives the exact [value-tier](06-axes.md) path in a headless browser:

1. Mount the showcase under a `DesignScope`, warm the worker.
2. Fire a scripted sequence of `palette.setSeed` commands at 120Hz for 2 seconds (rAF-coalesced, as in production).
3. Measure, per frame: main-thread time (command dispatch → `setProperty` writes → the browser's `requestAnimationFrame` callback returning), the count of `setProperty` calls, and — the assertions that matter — **zero React commits** and **zero stylesheet swaps** during the drag.

**Assertions.**

```
assert p95(mainThreadFrameMs) < 16.6      // the frame budget
assert reactCommitCount === 0             // value tier never re-renders
assert sheetSwapCount === 0               // value tier is inline setProperty only
assert setPropertyCount ≤ 24 per frame    // one ramp's worth of vars, per the constitution's ~22
```

The `reactCommitCount === 0` and `sheetSwapCount === 0` assertions are the important ones: they don't measure speed, they measure *architecture*. A regression that reintroduces a React render on the hot path (the classic identity-cache-defeat bug) fails them *even on a fast CI machine where the frame budget still passes* — the benchmark catches the architectural regression before it becomes a perf regression on a slow user device. Wall-clock time is the noisy assertion (widened tolerance, machine-normalized); the render/swap counts are the exact ones.

Because the preview executes Tailwind — the only engine — there is no cold-start engine-boot cost, no proxy, and no precomputed atomic layer to warm; the benchmark measures the `setProperty` hot path directly, with nothing to amortize away first.

**Example failure it catches.** A refactor of the worker protocol starts sending the whole `ResolvedSystem` back on every value edit instead of a `VarOp[]` delta, and the main thread does a React `setState` to store it:

```
FAIL perf · hue-drag · reactCommitCount
  expected: 0 commits during 2s drag
  actual:   238 commits  (one per coalesced frame)
  → value-tier edit triggered a React render. The worker must return VarOp[] deltas, not whole-doc snapshots.
```

**Where it runs.** Release gate (machine-normalized, so the wall-clock assertion is stable), with the count-based assertions (`reactCommitCount`, `sheetSwapCount`, `setPropertyCount`) also runnable in PR CI because they're machine-independent.

---

## 12. What a red build tells a contributor — the error-quality bar

A test suite is only as good as the failure it prints. dotUI holds every invariant to an **error-quality bar**: a failing test must name the property violated, show the concrete disagreement, and point at the fix or the missing axis. A red build is a diagnosis, not a riddle.

The bar, stated as rules every suite obeys:

1. **Name the invariant.** The failure header says which of the eight (or which lint) fired — `FAIL cascade≡resolution`, not `assertion failed`.
2. **Show both sides, concretely.** Never "values differ" — always `oracle: var(--neutral-500)` vs. `browser: var(--neutral-700)`, with the exact node and cell. A live-variants failure shows the slot, the live class string, and the exported `tv()` string.
3. **Localize to source.** A lint points at `button/styles.ts:9`; a resolution-completeness failure names the slot and declared var; a migration failure names the JSON path (`tokens.tokens["radius-factor"].description`).
4. **Point at the fix, or name the missing axis.** This is the highest rule. `no-hardcoded-design-values` names the covering token (`use focus-visible:focus-ring`). A reconstruction gap names the missing axis and *explicitly says it is not a test bug* — "Add the axis to the Manifest or the target is not reconstructable." A contrast failure ships the proposed cell-scoped graph edit. The contributor is never left to reverse-engineer the intent.
5. **Reproduce deterministically.** Property tests print the seed and the *shrunk* counterexample — the minimal graph or props that fail — so "flaky random test" is never an excuse; the failure is a fixed, minimal, checked-in-able case.

The reconstruction-gap failure is the emblem of the whole chapter. When a golden dsdoc can't reach a target look, the build doesn't say "test failed" and it doesn't quietly let someone hardcode `blur-[20px]`. It says: *this look is not reachable through any axis; here is the missing axis; the north star is not met until it exists.* That is the CLAUDE.md discipline — "flag the missing axis; don't invent a token" — turned from a code-review admonition into a machine that stops the release. The tests don't just protect the code; they protect the *product thesis*.

---

## Tradeoffs

The testing architecture buys its guarantees at real, stated cost.

- **Fidelity rests on one seam, not a matrix.** With a single engine there is no cross-engine render matrix to prove agreement over, so the whole fidelity argument concentrates on the live-variants shim (#2) plus the byte-compare (#1). That is dramatically less CI machinery — no ~30k-cell render matrix, no waiver ledger to curate — but it means the shim is *the* load-bearing artifact: if its conformance suite is weak, nothing else catches a preview-vs-export drift. The mitigation is that the suite is deliberately two-layered (property test *and* computed-style sample) precisely because it is the only guard.

- **The golden images are maintenance the team must actually do.** Visual regression fails on *intended* improvements exactly as loudly as on regressions; every deliberate look change re-commits golden screenshots, and a lazy "just accept all the goldens" habit would hollow out the suite. The guardrail is that accepting a golden is a reviewed diff in the same PR — but the review has to be real.

- **Frozen migrations are a permanent, append-only liability.** Every schema major adds a migration that can never be edited and a fixture corpus that lives forever. The corpus must be curated (real captured documents, consented and anonymized) and re-frozen (`expected/` regenerated) on every subsequent major — that regeneration is reviewed, but it is ongoing work with no end date, the price of "a two-year-old document opens correctly."

- **Random-graph property tests trade determinism for coverage.** #7 (cascade≡resolution) and #2 (live-variants) find the shapes nobody imagined precisely because they're random — but a random test that fails only on seed 0x8F3A is a worse debugging experience than a fixture until the shrinker does its job. The design leans hard on `fast-check`'s shrinking and on printing the seed; a suite where shrinking is weak would surface huge counterexamples. The mitigation (seeded runs, checked-in shrunk counterexamples promoted to fixtures) works only if the team promotes them.

- **The strict-export gate runs in production, per request, on an adversary.** Full-matrix contrast verification on an arbitrary user graph inside a 500ms export budget is the one suite that can't be pre-computed. Incremental verification keeps the *builder* interactive, but the *export* pays for a full walk, and a pathological system (4 dimensions, 24 cells, hundreds of pairings) is near the budget. The soft-caps (4 dimensions / 24 cells) exist partly to keep this gate tractable — they are a product constraint that a testing cost helped set.

- **Byte-parity is unforgiving by design (#1), and that's a feature with a cost.** A baked default that byte-differs from a fresh compile fails with zero tolerance — which is correct (it's the same function's output) but means every Manifest baseline change that touches the default doc requires a baked-artifact rebuild, and a forgotten rebuild is a red release gate rather than a silent wrong first frame. The cost is discipline; the alternative (tolerant comparison) would let real drift through.

The through-line: dotUI spends most of its fidelity *structurally* — one compiler, one emission, one resolver — so the test suites are narrow and targeted rather than a brute-force everything-diff. The eight invariants each guard one seam the structure can't close on its own, and the cost is concentrated in exactly the two places rendering is unavoidable: the live-variants sample and the golden images. Everything else — resolution completeness, cascade≡resolution, migration corpus, codeStyle, the lints — is fast, pure, and structural, which is why they gate the cheap early stages and the rendered suites gate the expensive late ones.
