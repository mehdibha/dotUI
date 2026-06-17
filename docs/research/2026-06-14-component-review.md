---
status: Point-in-time review snapshot (2026-06-14). An independent, verified pass — one dedicated reviewer per component, every P0/P1 claim adversarially re-verified against source. Findings reflect the registry at commit a4c39a38; not kept current. Product proposals (new axes/tokens/variants) are flagged and require approval before implementation per CLAUDE.md.
---

# Component review — all 71 registry components (verified)

A component-by-component review of `www/src/registry/ui/`, each compared against its closest popular equivalents, across: API/props, composition, missing styles, wrong/suspect styles, token names & misuse, missing tokens/axes, overengineering, missing features, ambiguity, a11y, synced-group drift, RTL/logical-property coverage, and registry/publisher hygiene.

## Method & baselines

- **Scope:** every `ui/<component>/` directory (71 components), reviewed by one dedicated reviewer per component (not domain-batched), then every P0/P1 claim handed to an adversarial verifier that re-opened the cited `file:line` and tried to refute it.
- **Numbers:** 534 findings total — 11 P0, 193 P1, 330 P2. Of the high-severity claims, **201 confirmed**, **17 severity-adjusted** (mostly P1→P2), **2 refuted** (both: the claim that RAC `Select` ignores `value`/`onChange` — it does not; those are first-class `ValueBase` props). Refuted findings are excluded below.
- **Primary baselines:** React Aria Components 1.18 (the actual base — API/props/composition/states/a11y; whether the wrapper adds value, drops RAC's free a11y, or misses RAC capabilities) and shadcn/ui (class coverage, especially logical properties; `placeholder`/`readonly`/`autofill`/`file` states; density map `style-mira ≈ compact`, `style-nova ≈ default`, `style-vega ≈ comfortable`). Secondary: Base UI, Radix, Ark/Park UI, Mantine, MUI, Chakra.
- **This is findings only.** Nothing was changed. New axes/tokens/variants are product decisions — see [Product proposals](#product-proposals-need-approval).

## Executive summary

Structurally the registry is healthy: it rides RAC correctly for accessibility and state, the `createStyles` density/param model is sound, and the token vocabulary is coherent. The standout components are genuinely strong, often ahead of shadcn — the Dialog/Overlay container-agnostic split, Slider, Table (sorting/selection/DnD/resizing/virtualization), Tabs, Toast, Breadcrumbs, and Empty.

The most important result of this pass is a cluster around the registry/publisher build: it silently drops or corrupts real components. `header` (no `meta.ts`/`base.tsx`), `sidebar` (absent from the generated registry), `pagination` and `tree` (unregistered stray `basic.tsx`), and both form adapters (`meta.ts` → a nonexistent `base.tsx`) are **not installable via the CLI today**. Two more ship *broken*: `scroll-fade` hits a `scrollFadeVariants = scrollFadeVariants` TDZ self-reference in its published output, and `progress-bar` is absent from `publishables/` because `root: fieldStyles().field()` is a call expression the publisher's static extractor throws on. This is the highest-priority cluster — several documented components don't actually reach users.

Beyond that, the defects are systemic patterns, not one-offs: `types.ts`↔implementation drift that ships fictional API docs (~16 components); synced-group divergence (Button⇄ToggleButton, checkbox/radio⇄switch, ListBox⇄Menu, Popover⇄Tooltip); a `cursor-disabled`/`cursor-interactive` axis that ~6 components bypass with raw `cursor-default`/`cursor-not-allowed`/`cursor-pointer`; raw color primitives where semantic tokens exist; pervasive physical (`pl-`/`pr-`/`rounded-l-`/`ml-`) classes that break RTL; an undefined token (`text-fg-onMutedDanger`) that renders the invalid+selected checkbox/radio indicator invisible; a missing typography axis (Heading/Header/Text are unstyled passthroughs); and an incoherent Alert/Badge/Button semantic-variant system — the single biggest structural opportunity.

## Confirmed P0 bugs (verified against source)

Ships broken or non-functional. Each verified at the cited location.

| # | Component | Bug | Location |
|---|-----------|-----|----------|
| 1 | header | No `meta.ts` → `registry-build.ts:417` skips the dir; nothing ships to the CLI | `ui/header/` (only `index.tsx`), `registry-build.ts:417` |
| 2 | header | `index.tsx` is a zero-value passthrough — re-exports RAC `Header`, drops `HeaderContext`, adds nothing | `header/index.tsx:3-8` |
| 3 | sidebar | Absent from the generated registry — every other `ui/*` has an entry; `sidebar` has none → not installable | `__generated__/registry-items.ts` (no `sidebar`) |
| 4 | scroll-fade | Published output emits `const scrollFadeVariants = scrollFadeVariants` (TDZ self-reference crash) | `__generated__/publishables/scroll-fade.ts:60`, `publisher/build-time/transform-base.ts:113-114` |
| 5 | progress-bar | `root: fieldStyles().field()` is a `CallExpression` the static extractor throws on → absent from `publishables/` | `progress-bar/styles.ts:9`, `publisher/build-time/extract-config.ts:127` |
| 6 | pagination | Unregistered stray `basic.tsx` (no `meta`/`styles`/`types`); 0 matches in `registry-items.ts` | `pagination/basic.tsx` |
| 7 | pagination | `PaginationLink` destructures `className` but never passes it to `LinkButton` → Prev/Next styles dropped | `pagination/basic.tsx:75-86` |
| 8 | pagination | Raw `tv()` instead of `createStyles` — no density/params, breaks the publisher's canonical-style assumption | `pagination/basic.tsx:8,13` |
| 9 | tree | No `meta.ts` (skipped by `registry-build.ts:417`), file is `basic.tsx` not `base.tsx`, not allowlisted | `tree/basic.tsx` |
| 10 | search-field | Default children render an icon `InputGroup` + `Input` but **no clear `Button`**; CSS hides a phantom button; native cancel suppressed → field can't be cleared | `search-field/base.tsx:35,40-46` |

> Note: items 1–3 and 6–9 mean `header`, `sidebar`, `pagination`, and `tree` are **documented but uninstallable**. The two form adapters (`react-hook-form`, `tanstack-form`) are in the same state (P1 below) — `meta.ts` points at a nonexistent `base.tsx`, kept alive only by `ORPHAN_ALLOWLIST`.

## Cross-cutting themes

These are the systemic patterns the 534 findings cluster into. Each spans many components; fixing the pattern beats fixing instances.

**A. Registry / publisher build drops or corrupts real components (P0–P1).** The biggest correctness cluster. Uninstallable: `header`, `sidebar`, `pagination`, `tree`, `react-hook-form`, `tanstack-form` (and the phantom dirs `input-group`, `text-area`, which have no `base.tsx`/`meta.ts` — their components live in `ui/input`). Ship broken: `scroll-fade` (TDZ self-reference), `progress-bar` (extractor throws on `fieldStyles().field()`; also its `basic.css` is never imported so *no* progress animation runs). Several declared `registryDependencies` are missing (accordion→disclosure, date-picker→popover, tabs→context, sidebar→tooltip, combobox→tag-group) or declared-but-unused (search-field→button), and three hooks aren't registered (sidebar `use-keyboard-shortcut`, avatar `use-image-loading-status`, scroll-fade `react-aria`). Installing these ships broken imports.

**B. `types.ts` ↔ implementation drift (systemic, P1).** `types.ts` is the generated-API-reference source, so any drift ships wrong docs. Confirmed: loader (4 phantom props), menu (`variant` over-advertises success/warning/accent), calendar (`variant` dead + `CalendarHeadingProps` missing), card (`size` missing), command (`placement` phantom, `virtulized` misspelled+unimplemented, `filter` undocumented), select (`virtulized` typo + `SelectTrigger` untyped), tooltip (`color` missing), toast (`ToastProviderProps` + `type` union missing), dialog (`showCloseButton` + `DialogInsetProps` missing), modal (`ModalContentProps` vs real `ModalPanelProps`), tag-group (`size` missing), number-field (sub-parts missing), list-box (`onLoadMore` + `ListBoxLoaderProps` for a non-exported component), color-editor (`value`/`defaultValue`/`onChange` missing), color-picker (documents non-existent `ColorPickerTrigger`/`ColorPickerContent`), and heading/header/sidebar/group (no `types.ts` at all). **Recommendation:** a lint/test diffing documented props vs real exported props would catch the whole class.

**C. Synced-group divergence (P1).** Button⇄ToggleButton: cursor-token bug in both, dead `data-size` on ToggleButton, byte-identical density blocks copy-pasted across two files. checkbox/radio⇄switch: checkbox/radio select with `bg-primary`, switch with `bg-accent`; checkbox/radio freeze `--*-card-radius`, switch exposes it; switch has no `invalid:` visual while the others do; switch is missing from `field`'s gap selectors. ListBox⇄Menu: ListBox exposes `--list-box-item-radius`, Menu hardcodes `rounded-sm`; item padding/gap diverge in compact/default; indicator reposition differs. Popover⇄Tooltip: arrow prop polarity inverted (`showArrow` vs `hideArrow`), SVG dims differ, params asymmetric (Tooltip has `translucid`/`color`/radius; Popover has none). ColorThumb vs Slider thumb: ColorThumb exposes none of Slider's thumb axes.

**D. The `cursor-disabled` / `cursor-interactive` axis is bypassed (P1).** button, toggle-button, field `Label` (×2), date-field `Label`, breadcrumbs, color-swatch-picker use raw `cursor-default`/`cursor-not-allowed`; switch indicator uses `cursor-pointer` instead of `cursor-interactive`. A user-configured cursor axis silently has no effect on these.

**E. RTL / logical-property gaps (P1–P2).** Pervasive physical classes: button/toggle icon padding (`pl-`/`pr-`), toggle-button-group (`rounded-l/r-none`), switch thumb travel (`ml-`), group seams (`-space-x-px`, physical radius strip), input/input-group addon padding, calendar range rounding (`rounded-l/r-*`), menu (5 physical classes in item/indicator/highlight), breadcrumbs default chevron not mirrored. None flip under RTL — at odds with the "reproduce any design system" goal.

**F. Raw primitives where a semantic token exists (P1).** button `primary` disabled (`[--color-disabled:var(--neutral-500)]`), switch thumb (`bg-white`) and disabled thumb (an `fg-*` token used as bg), tag-group resting (`bg-(--neutral-300)`), card `tasnim` footer (`bg-neutral-900/50`, doesn't flip dark), calendar range fill (`color-mix(...)` ×3), badge subtle (`color-mix`), color-thumb (`border-white`/`ring-black/40`), alert description (`/90` opacity instead of a `-muted` token), input `lineField` (`border-fg-danger` — wrong token *category*: an fg token used as a border).

**G. Undefined / off-vocabulary token (P1).** checkbox `styles.ts:17` and radio-group `styles.ts:18` reference `text-fg-onMutedDanger` — undefined and camelCase. The invalid+selected check/dot then falls back near-white on `danger-100` → effectively invisible.

**H. A11y regressions that undo RAC's free accessibility (P1).** alert `role="alert"` for all variants (success/info should be polite `status`); badge `role="presentation"` strips status text from SRs; loader nests `role="status"` inside RAC's `role="progressbar"` (the SVG should be `aria-hidden`); icon-only buttons without `aria-label` in the high-visibility `button/examples.tsx`, combobox, color-picker, number-field, text-area demos (the copy-paste source models a violation); list-box `CheckIcon` and date-picker range separator not `aria-hidden`; context-menu has no keyboard trigger (Shift+F10/Menu key); pagination `aria-hidden` on the ellipsis silences its own `sr-only` text; tree `TreeItemContent` drops all props including `children`.

**I. Private react-aria internals shipped to users (P2, upgrade-fragility).** input, text-area, radio-group, modal, drawer import from `react-aria/private/*` paths in the *shipped* `base.tsx`. These land on CLI consumers' machines and break on any RAC internal refactor.

**J. The typography axis is missing entirely (systemic, product).** Heading/Header/Text are unstyled passthroughs with zero `styles.ts`/variants. Heading's visual size is locked to semantic `level` (changing size means breaking heading order — an a11y footgun). No scale/weight/leading/tracking/truncate anywhere. `Text` is a slot-marker whose name implies general typography (a discoverability trap). Typography is named a core builder axis in CLAUDE.md but isn't one.

**K. The Alert / Badge / (semantic) Button variant system is incoherent (P1, structural).** Different semantic sets (Button has no success/info; Alert no accent; Badge no primary), `default` vs `neutral` naming for the same neutral style, and three different ways to fake a "soft" look (Badge `color-mix`, Alert `/90` opacity + the throwaway `sousse` param, no shared `-muted` path). The biggest single structural opportunity — one shared semantic set + one `appearance` (solid/soft/outline) axis would subsume all of it.

**L. Canonical-style / inline `tv()` violations (P1–P2).** pagination, color-swatch, and checkbox-group use inline `tv()` instead of `createStyles` → no density block, and they break the publisher's one-canonical-source assumption.

**M. Forms are triple-identitied and broken (P1).** Three "form" identities (`ui/form` demos-only, react-hook-form, tanstack-form), all `meta.name:"form"`, none installable (both adapters → nonexistent `base.tsx`). tanstack-form is the most complete (full `createFormHook`, 14 adapters) but: `DatePicker` hardcodes `value={undefined}` (value dropped), `Switch` omits `isInvalid`, `SubmitButton` gates on `!isDirty` instead of `!canSubmit`, and the `error?.message` access silently fails for string validators. RHF `FormControl` leaks `isDirty`/`isTouched`/`isValidating` to RAC DOM and drops `errorMessage`.

## Product proposals (need approval)

Per CLAUDE.md, new axes/variants/tokens are product decisions. These recurred as genuine "missing axis" gaps (a baked-in look two design systems would disagree on). Listed for a decision, not implemented. Highest-leverage first.

- **Typography scale (highest leverage).** Decouple Heading `size` from semantic `level`; add weight/tracking/leading/`text-balance`; decide whether `Text` widens (size/weight/color/truncate/lineClamp, like Mantine/Chakra) or a separate body-scale component is added. Give Header/Heading a real typographic identity (theme J).
- **Unified semantic-variant + appearance system** for Alert/Badge/(semantic) Button: one shared semantic set + one `appearance` axis (solid / soft / outline), all built from `bg-{sem}`+`fg-on-{sem}` / `bg-{sem}-muted`+`fg-{sem}` / `border-border-{sem}`. Subsumes Badge's `color-mix`, Alert's `sousse` + `/90` dimming. Add `fg-{semantic}-muted` vocabulary.
- **Overlay param parity + translucency.** Give Popover the `radius` + translucency params Tooltip has; rename `translucid`→`translucent`; add a theme-aware **scrim token** (Modal/Drawer hardcode literal black). Give Drawer the Modal param set (radius / backdrop-opacity / backdrop-blur / background / size); add a Modal size axis; add Toast surface + radius params.
- **Sidebar:** mobile/responsive path (it's invisibly `hidden md:block` today), collapsible-mode enum (offcanvas/icon/none), variant enum, `--sidebar-radius`, and actually use the `border-sidebar` token.
- **Selection controls:** control-size axis for checkbox/radio (switch already has one); unfreeze `--checkbox-card-radius`/`--radio-card-radius`; switch thumb-color axis.
- **Color thumb / slider axes:** mirror Slider's thumb axes on ColorThumb (`--color-thumb-size` density-aware, radius, shadow, cursor); give color-slider track size/radius; give color-area a cursor axis. (ColorThumb powers the builder's own seed pickers.)
- **Smaller axes:** Separator label/text slot; Breadcrumbs collapse/overflow menu; Accordion contained/separated variant + radius; per-Tag semantic color; Menu item-radius (axis parity with ListBox); Tabs pill/enclosed variants + scrollable list; Pagination active-page variant; Card elevation/shadow + padding; DropZone reject/invalid state + width axis; OTP cell-separation + active caret; NumberField stepper-layout + root size; Field required-indicator style + keep-description-on-error; Kbd border/shadow; Loader size; Empty image slot; ProgressBar Meter variant; ToggleButtonGroup `SelectionIndicator` (animated segmented control).

## Priority index

**P0 (ships broken / uninstallable):** header (no meta/base, zero-value passthrough), sidebar (absent from registry), scroll-fade (TDZ crash), progress-bar (extractor break), pagination (unregistered + drops className + raw tv), tree (unregistered), search-field (no clear button).

**P1 (notable bug / gap), by component:** button (6), input (6), list-box (6), sidebar (6), switch (7), field (5), combobox (5), calendar (5), menu (5), popover (5), group (5), text-area (5), tanstack-form (5), form (9 cross-adapter), input-group (4), select (4), dialog (4), color-thumb (4), color-editor (4), card (4), link (3), number-field (3), checkbox (3), command (3), tree (3), table (3), toast (3), accordion (3), scroll-fade (3), progress-bar (3), react-hook-form (3), and ~20 more with 1–2 each. Full detail in the per-component sections.

**P2 (polish / proposals):** the 69 product proposals above, the logical-property sweep (theme E), the private-internals sweep (theme I), the inline-`tv()` migrations (theme L), and assorted demo/a11y polish.

## Suggested next steps

1. **Registry/publisher unblock (theme A) — highest priority.** Decide per orphan (header, sidebar, pagination, tree, input-group, text-area, the two form adapters): promote to a real item (`base.tsx`+`meta.ts`) or fold/delete. Fix the two publisher crashers (`scroll-fade` self-reference, `progress-bar` `fieldStyles().field()` + unimported `basic.css`). Add the missing `registryDependencies` and register the three hooks.
2. **Quick-win verified-bug PR** (no product decisions): the `text-fg-onMutedDanger` token (G), the `date-date-field` typo, the `virtulized` typo, loader phantom props, disclosure/accordion chevron rotation, accordion→disclosure dep, pagination `className`, the cursor-token bypasses (D), Button `primary` disabled primitives, dead classes (table `data-[state=selected]`, color-thumb/color-slider dead `group-orientation`, color-area `in-data-dialog:w-full`, sidebar dead `collapsible` selector).
3. **`types.ts`↔impl guard** (theme B): a test diffing documented props vs real exported component props prevents the whole doc-drift class.
4. **Logical-property sweep** (theme E) and **private-internals sweep** (theme I) as focused passes.
5. **Product-proposal triage:** decide the typography scale, the Alert/Badge/Button variant system, and the overlay-param/translucency axes (the three highest-leverage) before component-level work.

---

# Per-component detailed findings

Legend: `[P0/P1/P2 | ✓ verified | ⚠ adjusted | proposal]`. Findings without a marker are P2/not-individually-verified. Synced-group fixes should land together.

## Group A: Buttons & actions

### button — `ui/button/`
**Compared against:** RAC Button/Link 1.18, shadcn Button/Toggle · **Verdict:** Solid, correct RAC ride with an excellent pending-spinner; substantive issues are the cursor-token bypass, raw primitives in `primary` disabled, `isIconOnly` missing from types, and RTL icon padding. · **Priority:** P1
- **Wrong-style / cursor axis [P1 ✓]:** `disabled:cursor-default`/`pending:cursor-default` should use the `cursor-disabled` token — every other interactive component does; buttons silently opt out of the configurable cursor axis. `styles.ts:11-12`. Land with toggle-button.
- **Raw primitive [P1 ✓]:** `primary` disabled hardcodes `[--color-disabled:var(--neutral-500)] [--color-fg-disabled:var(--neutral-300)]`, bypassing the theme; `color-fg-primary-disabled` already exists for this. `styles.ts:19`.
- **types drift [P1 ✓]:** `isIconOnly` is implemented on both Button and LinkButton but absent from `types.ts` → omitted from generated API docs. `types.ts:8-44` vs `base.tsx:22,70`.
- **a11y [P1 ✓]:** icon-only buttons in the builder preview `examples.tsx:77` have no `aria-label` (the `shapes.tsx` demo does it right) — the copy-paste source models a violation.
- **sync-group [P1 ✓]:** ToggleButton's `data-size` is dead; the density block is byte-identical across `button`/`toggle-button` (every tweak must be applied twice). Extract a shared density config.
- **RTL [P1 ✓]:** icon-offset padding uses physical `pl-`/`pr-` across all sizes → wrong-sided in RTL. `styles.ts:48-73`. Land with toggle-button.
- **P2:** `prefix-and-suffix` demo omits `data-icon-start/end`, so the documented padding silently no-ops; `examples.tsx` omits the `warning` variant from the preview grid; the `size`/`isIconOnly` JSDoc is misleading (they're orthogonal). **Proposal:** quiet-hover intensity axis (`hover:bg-inverse/10` is baked).
- **Strengths:** correct RAC ride, layout-shift-free pending spinner, clean import hygiene, full density model, `--btn-radius`/`--btn-font-weight` axes.

### toggle-button — `ui/toggle-button/`
**Compared against:** RAC ToggleButton 1.18, shadcn Toggle · **Verdict:** Structurally sound and (unlike Button) types-accurate with all icon-only demos labelled; carries the two Button sync bugs plus dead/redundant classes. · **Priority:** P1
- **sync-group [P1 ✓]:** `disabled:cursor-default` should be `cursor-disabled` (`styles.ts:12`); density block is a verbatim copy of Button (`styles.ts:39-72`). Both must move in lockstep with Button.
- **Wrong-style:** `data-size={size}` (`base.tsx:50`) is dead — nothing reads it (contrast `data-variant`, which the group consumes). Base-level `selected:border-border-active` is redundant with the default variant's stricter form and invisible on quiet/primary (no border-width).
- **RTL:** physical `pl-`/`pr-` icon padding (`styles.ts:43-68`); quiet/primary selected border-color set with no width (silently invisible — likely intended, but dead code).
- **Strengths:** types match impl exactly; every icon-only demo passes `aria-label`; clean selected-state tokens (no primitive leak); `ToggleButtonProvider` context wiring is idiomatic.

### toggle-button-group — `ui/toggle-button-group/`
**Compared against:** RAC ToggleButtonGroup + SelectionIndicator 1.18, shadcn ToggleGroup · **Verdict:** Clean context delegation and good seam-collapsing; RTL radius gap, the inherited cursor bug, and boilerplate. · **Priority:** P1
- **RTL [P1 ✓]:** horizontal seam radius uses physical `rounded-l-none`/`rounded-r-none` → wrong corners in RTL. `styles.ts:17`. Use `rounded-s-/rounded-e-`.
- **sync-group [P1 ✓]:** children inherit ToggleButton's `disabled:cursor-default` bug.
- **Overengineering:** empty `density: {}` blocks (drop the key — `createStyles` makes density optional); redundant `data-orientation` (RAC already sets it). `orientation` lacks a `@default` JSDoc in types.
- **Proposal:** no `SelectionIndicator` support for an animated segmented-control style (Tabs already uses the API; a `// MARK: toggleGroupStyles` placeholder exists).
- **Strengths:** local-prop-over-context precedence correct; seam negative-margins scoped to bordered `default` only; types inherit the full RAC surface; every demo labels and ids children correctly.

### link — `ui/link/`
**Compared against:** RAC Link 1.18, shadcn link-variant, MUI Link · **Verdict:** Minimal and correct but severely under-built — RAC's interactive states are unused, cursor tokens absent, zero demos. The weakest in the group. · **Priority:** P1
- **Missing-style [P1 ✓]:** accent variant has `transition-colors` with no hover/pressed target (dead transition) — no `hovered:`/`pressed:` anywhere. `styles.ts:9,13`.
- **Missing-style [P1 ✓]:** no `cursor-interactive`/`disabled:cursor-disabled` — the only interactive element that opts out of the cursor axis (grep `cursor` = 0).
- **Missing-style [P1 ✓]:** no `current:`/`[data-current]` styling → `<Link isCurrent>` looks identical to resting; breaks the nav-link use case (breadcrumbs uses `current:` correctly). `styles.ts`.
- **P2:** quiet underline is always-on (no hover-reveal option); no `pressed:` state on any variant; **zero demos shipped** (undiscoverable); `index.tsx` router-bridge logic is duplicated verbatim from `button/index.tsx`. **Proposal:** `color-fg-accent-hover` token (vocab stops at `fg-accent`).
- **Strengths:** clean RAC wrap + createStyles; types match impl; focus-reset/focus-ring correct.

### file-trigger — `ui/file-trigger/`
**Compared against:** RAC FileTrigger 1.18 (shadcn has none) · **Verdict:** Correct, appropriately-thin pure passthrough; minor demo confusion + a types/base declaration split. · **Priority:** P2
- **P2:** default demo sets `allowsMultiple` but displays only `files[0]` (contradictory — drop the prop or show all); `Pressable` (bundled in the same RAC subpath for custom triggers) isn't re-exported; `FileTriggerProps` is a `type` alias in `base.tsx` but a JSDoc'd `interface` in `types.ts` → shipped consumers get the undocumented form.
- **Strengths:** correct DOM-less passthrough; clean subpath import + hygiene; accurate generated API reference (all 6 props, no hallucinations).

### kbd — `ui/kbd/`
**Compared against:** RAC Keyboard 1.18, shadcn Kbd/KbdGroup · **Verdict:** Lean and correct with valid tokens and no types drift; the one real issue is `KbdGroup` rendering a `<kbd>` around `<kbd>` children. · **Priority:** P1
- **a11y [P2 ⚠]:** `KbdGroup` renders `<kbd>` (`base.tsx:15`) wrapping per-key `<kbd>` children — implies the whole sequence is one key; shadcn uses `<span>`. (Adjusted P1→P2 — spec permits nesting, but it's pragmatically wrong.)
- **P2 / proposals:** flat appearance (no border/key-depth shadow — **proposal:** bordered/elevated axis); `font-sans` for key labels (shadcn uses `font-mono`); Kbd on the dark tooltip surface uses page-level `bg-muted`/`text-fg-muted` (**proposal:** context-aware/inverted surface). RAC hardcodes `dir=ltr` (upstream; document).
- **Strengths:** valid in-vocab tokens; clean hygiene; types aligned; correct `not-with-[size]` icon-sizing.

### Cross-cutting (Group A)
- **Button⇄ToggleButton** is the live synced group: the `cursor-default`→`cursor-disabled` token fix, the dead `data-size`, the verbatim density block, and physical icon padding are all shared — land them in one PR. **Link** is the most under-built (no interactive states, no cursor tokens, no `current:`, no demos). The `button/index.tsx`⇄`link/index.tsx` router-bridge duplication wants a shared `useRouterLinkRender` (www-side, no registry risk).

## Group B: Text fields & field infra

### field — `ui/field/`
**Compared against:** RAC Label/Text/FieldError/Group 1.18, shadcn FormField+Label, Base UI Field · **Verdict:** Solid, well-factored spine for the family; three real bugs around description-hiding, the shipped required asterisk, and the cursor axis. · **Priority:** P1
- **Wrong-style [P1 ✓]:** `invalid:has-data-[slot=field-error]:**:…:hidden` (`styles.ts:13`) is dead — `invalid:` never fires on a plain div, so the description is never hidden on error. Drop the `invalid:` prefix (or remove the rule and keep both visible, like shadcn/RAC).
- **a11y [P1 ✓]:** the a11y-safe required asterisk (`content: '*' / ''`, `styles.css:1-3`) is **not in `meta.ts` files**, so CLI users only get the SR-incorrect Tailwind `after:content-['*']` (announced "star"). Ship the CSS or consolidate onto it.
- **Token / cursor [P1 ✓]:** Label uses `peer-disabled:cursor-not-allowed`/`in-disabled:cursor-not-allowed` (`styles.ts:16,18`) — bypasses `cursor-disabled`; the `peer-disabled:` classes are also dead (no `peer` element exists). Use `cursor-(--cursor-disabled)` and drop the peer variant.
- **sync-group [P1 ✓]:** FieldGroup density gaps key off `has-data-checkbox`/`has-data-radio` but **not `has-data-switch`** → switches in a FieldGroup get the oversized generic gap. Add the switch entries.
- **P2:** required asterisk uses physical `ml-0.5` (→ `ms-`); description spacing uses brittle positional `nth-last-2:-mt-1`; `in-disabled:` vs `in-data-disabled:` inconsistency; `useSlotId` from `react-aria/private`; Field doesn't wire describedby to Switch/Radio. **Proposals:** required-indicator style axis; keep-description-on-error axis.
- **Strengths:** clean density model; correct RAC context injection; no raw primitives; types aligned.

### input — `ui/input/`
**Compared against:** RAC Input/TextArea/Group/DateInput 1.18, shadcn Input/Textarea/InputGroup · **Verdict:** Sophisticated multi-export shell with an elegant CSS-var sizing system; the family-wide missing input states, a wrong-category token, and physical padding are the substance. · **Priority:** P1
- **Missing-style [P1 ✓]:** no `placeholder:text-fg-muted`, no `readonly:`, no `autofill:` on Input/TextArea slots (`styles.ts:114-122`) — shadcn ships all three; affects every field in the family.
- **Wrong-style [P1 ✓]:** `lineField` focused+invalid border uses `border-fg-danger` — a *foreground* token (danger-800) used as a border; resting invalid correctly uses `border-border-danger`. So the border darkens on focus. `styles.ts:46,48`.
- **RTL [P1 ✓]:** addon padding + inputGroup edge-strip use physical `pl-`/`pr-` (`styles.ts:81,85,97,100`). Convert to `ps-`/`pe-`.
- **api [P1 ✓]:** ships `getEventTarget`/`useLayoutEffect` from `react-aria/private/*` in `base.tsx:11-12` — unversioned internals on CLI users.
- **P2:** transition list omits `background-color` though `disabled:bg-disabled` changes it (snap); base `inputGroup` slot bakes in combobox + date concerns (overengineering); no `file:` styling though `type=file` is accepted; `invalid:ring-danger-muted` uses a bg token as a ring; `demos/invalid.tsx` omits `isInvalid`. **Proposal:** TextArea `resize` axis + `size` prop.
- **Strengths:** DRY per-size CSS-var token system; 4 runtime-switchable styles; correct focus+invalid ring gating; SSR-safe date-segment normalization; consistent `cursor-disabled`.

### input-group — `ui/input-group/`
**Compared against:** RAC Group 1.18, shadcn InputGroup (separate InputGroupText/Addon/Button items) · **Verdict:** Phantom directory — no `base.tsx`/`meta.ts`/`types.ts`; the real components live in `ui/input`. The implementation is high quality; the folder misrepresents the architecture. · **Priority:** P1
- **registry-hygiene [P1 ✓]:** only `demos/` + `examples.tsx`; not in `registry-items.ts`; install command silently fails. Promote to a real item (`registryDependencies:['input']`) or fold into `ui/input`.
- **RTL / missing-style [P1 ✓]:** physical `pl-/pr-` addon padding; `disabled:bg-disabled` not in the transition; no placeholder styling (all inherited from `ui/input`).
- **P2:** combobox/date selectors baked into the base slot; `react-aria/private` imports; canonical demo (`demos/input-group.tsx`) uses `InputGroup` (role=group) with no `aria-label` and an unlabelled inner Input.
- **Strengths:** elegant CSS-var sizing; correct focus-detection via `has-[[data-input-control][data-focused]]`; smart click-to-focus that skips interactive descendants.

### text-field — `ui/text-field/`
**Compared against:** RAC TextField 1.18, shadcn input · **Verdict:** Deliberately thin, structurally correct; its only real gaps are inherited from `field`+`input`. · **Priority:** P1
- **Missing-style [P1 ✓]:** inherits the family-wide placeholder/readonly/autofill gap (`input/styles.ts:114-118`).
- **P2:** `group/text-field` named group is set but never consumed (dead/forward-hook); inherits field's `cursor-not-allowed` and physical `ml-0.5` asterisk; renders nothing without children (SearchField/NumberField provide defaults — family inconsistency).
- **Strengths:** clean delegation of all visual axes; clean imports; full RAC prop pass-through; demos cover the matrix with correct labelling.

### text-area — `ui/text-area/`
**Compared against:** RAC TextArea 1.18, shadcn Textarea, react-textarea-autosize, Mantine · **Verdict:** Phantom directory like input-group (`TextArea` lives in `ui/input`); the impl is competent (auto-grow) but ships the family input-state gaps. · **Priority:** P1
- **registry-hygiene [P1 ✓]:** no `base.tsx`/`meta.ts`/`types.ts`; not registered; docs `npx shadcn add @dotui/text-area` silently fails (should be `@dotui/input`).
- **Missing-style [P1 ✓]:** no `placeholder:text-fg-muted`, no `readonly:` treatment (`input/styles.ts:119-121`).
- **a11y [P1 ✓]:** components-list demo renders a bare `<TextArea placeholder>` with no `TextField`/`aria-label`; the prefix-and-suffix demo's icon-only ToggleButtons (`demos/prefix-and-suffix.tsx:47-52`) have no `aria-label`.
- **P2:** `react-aria/private` imports; no hover border (`border-hover` token unused); `ring-danger-muted` category mismatch; physical addon padding; auto-grow ignores container/font resize (no ResizeObserver); `min-h-16` not density-responsive.
- **Strengths:** correct controlled/uncontrolled auto-grow; thorough density tokens; consistent `cursor-disabled`.

### search-field — `ui/search-field/`
**Compared against:** RAC SearchField 1.18, shadcn SearchField · **Verdict:** The defining affordance — a clear button — is wired in CSS but never rendered. · **Priority:** P0
- **Missing-feature [P0 ✓]:** default children render `InputGroup → SearchIcon + Input` with **no clear `Button`**; the `empty:` show/hide CSS targets nothing and the native cancel is suppressed → the field can't be cleared. `base.tsx:35,40-46`. Add `<Button variant="quiet" isIconOnly aria-label="Clear"><XIcon/></Button>`.
- **registry-hygiene [P1 ✓]:** `button` is a phantom `registryDependency` (listed, never imported) — becomes real once the clear button lands.
- **types drift [P1 ✓]:** `placeholder` is on the impl (`base.tsx:16-19`) but absent from `types.ts`.
- **P2:** the `placeholder` prop is ignored whenever custom children are passed (every demo) — inconsistent with the family; unused `group/search-field`; no `onSubmit` demo.
- **Strengths:** clean hygiene; `data-search-field` consumed by Command; native search-UI reset; demos labelled.

### number-field — `ui/number-field/`
**Compared against:** RAC NumberField 1.18, shadcn/MUI/Mantine NumberInput · **Verdict:** Clean composable RAC wrapper; the default-children fallback has two real bugs and the sub-parts are undocumented. (The v1 "segmented Group is wrong" claim is refuted — Group is the intended canonical layout.) · **Priority:** P1
- **Wrong-style [P1 ✓]:** default children order is `Input | − | +` while every demo uses `− | Input | +`. `base.tsx:29-38`.
- **Wrong-style [P1 ✓]:** default children use raw `<Button slot="decrement">` without `isIconOnly` → oversized steppers (the named sub-parts hardcode `isIconOnly`). Use `<NumberFieldDecrement/>`/`<NumberFieldIncrement/>`.
- **types drift [P1 ✓]:** `NumberFieldDecrement`/`Increment`/`Group` are exported and used in every demo but undocumented in `types.ts`.
- **P2:** static `fieldStyles()` instead of the `useStyles()` density hook; no `data-number-field` hook. **Proposals:** root-level `size` prop (today you size three children); stepper-layout axis (side/stacked/none).
- **Strengths:** RAC i18n stepper labels; clean composable sub-parts; correct deps; labelled demos.

### otp-field — `ui/otp-field/`
**Compared against:** Base UI OTPField 1.4.1 (the base), shadcn InputOTP, Ark OTP · **Verdict:** Competent Base-UI-over-RAC bridge; the import-stability worry is refuted (`OTPFieldPreview` is Base UI's stable namespace). Real issues are `:invalid`/`:disabled` rules that can't fire on the div root. · **Priority:** P1
- **Missing-style [P1 ✓]:** `fieldStyles().field()` description-hiding uses native `:invalid` on a `role=group` div → never fires (`styles.ts:10`). Add a `data-invalid:` path (ideally fix in `field`).
- **a11y [P1 ✓]:** Label disabled styling uses `in-disabled:` (native `:disabled`) on the div root → never applies; description correctly uses `in-data-disabled:`. Fix in `field/styles.ts:16,18`.
- **P2:** dead empty `separator` slot; unused `group/otp-field`; dual aria-labelledby management (wrapper overrides Base UI — fragile); no `mask` demo. **Proposals:** cell-separation axis (segmented/connected); active-slot caret.
- **Strengths:** correct RAC prop-name alignment; clean FieldError/describedby gating; elegant `InputContext` render-prop injection; full Base-UI prop passthrough; types aligned.

### Cross-cutting (Group B)
- **`Input` is the universal control**, so its missing `placeholder`/`readonly`/`autofill` (and the `react-aria/private` imports, physical padding, omitted-bg transition) are **family-wide** — fix once in `input/styles.ts`. **Two phantom directories** (input-group, text-area) misrepresent the architecture and aren't installable. **The required-asterisk + description-hiding + cursor + describedby bugs all live in `field`** and ripple to every member — a `field` fix PR clears the most. Several unused named groups (`group/text-field`, `group/search-field`, `group/otp-field`). Default-children contract is inconsistent (TextField renders nothing; the others provide defaults).

## Group C: Boolean & range controls

### checkbox — `ui/checkbox/`
**Compared against:** RAC CheckboxField/CheckboxButton 1.18, shadcn checkbox, switch/radio (synced) · **Verdict:** Structurally sound on the RAC 1.18 compound API; one real undefined-token bug plus frozen/missing axes. · **Priority:** P1
- **Token [P1 ✓]:** `invalid:selected:text-fg-onMutedDanger` (`styles.ts:17`) — undefined, camelCase → near-invisible check on `danger-100`. Use `text-fg-on-danger`. Shared verbatim with radio.
- **Missing-token [P1 ✓]:** `--checkbox-card-radius` is consumed (`styles.ts:10`) but not exposed as a param (switch exposes `card-radius`). Unfreeze it.
- **sync-group [P1 ✓]:** selects with `bg-primary` while switch uses `bg-accent` — accidental color split across the selection group.
- **P2:** no `cursor-interactive` on the resting control (pointer comes from UA); card selected uses raw `color-mix` not `bg-primary-muted`; `disabled:indeterminate:text-fg-disabled` missing (minus icon invisible disabled+indeterminate); no FieldError demo. **Proposal:** control-size axis (box hardcoded `size-4`).
- **Strengths:** correct compound API; full data-attribute forwarding; auto `aria-labelledby`; 44px hit-area for icon-only; focus ring on the visible control.

### checkbox-group — `ui/checkbox-group/`
**Compared against:** RAC CheckboxGroup 1.x, Mantine CheckboxGroup (shadcn has none) · **Verdict:** Thin, correct RAC wrapper, but the container is inline `tv()` not `createStyles`. · **Priority:** P2
- **Overengineering / canonical [P2]:** `checkboxGroupStyles = tv({base:'flex flex-col gap-3'})` (`base.tsx:7-9`) bypasses `createStyles` → no density, invisible to the param registry/publisher. Migrate to `createStyles` with radio-group together.
- **Missing-feature [P2]:** RAC `orientation` is accepted but the container is hardcoded `flex-col` → horizontal is a silent no-op. Add `data-[orientation=horizontal]:flex-row`.
- **Strengths:** clean RAC pass-through; correct deps; thorough demos incl. cards + label/aria-label split.

### radio-group — `ui/radio-group/`
**Compared against:** RAC RadioGroup/RadioField/RadioButton 1.18, shadcn radio-group · **Verdict:** Mirrors checkbox; same undefined token, a private import, and a silently-ignored `orientation`. · **Priority:** P1
- **Wrong-style [P1 ✓]:** `text-fg-onMutedDanger` undefined-token bug (`styles.ts:18`) → invisible dot on invalid+selected. Use `text-fg-danger`. Fix with checkbox.
- **Missing-feature [P1 ✓]:** RAC `orientation` has no layout effect — container is inline `tv()` hardcoded `flex-col` (`base.tsx:18-20`); even the playground passes `orientation`. Add `data-[orientation=horizontal]:flex-row` + migrate to `createStyles`.
- **api [P2 ⚠]:** `useSlotId` from `react-aria/private` (`base.tsx:9`) — replaceable with React `useId`.
- **P2:** outer gap hardcoded (not density-aware); dead `data-slot="radio"` (field keys off `data-radio`); empty `<span/>` child in RadioIndicator (dot is `::before`). **Proposals:** card-radius axis (frozen); primary↔accent alignment; hover/pressed indicator feedback.
- **Strengths:** newer RadioField/RadioButton API; correct data-attr forwarding; density per-item gap; types aligned.

### switch — `ui/switch/`
**Compared against:** RAC SwitchField/SwitchButton 1.18, shadcn switch, checkbox/radio (synced) · **Verdict:** Most feature-rich control (3 sizes, press-stretch thumb, card-radius axis) but diverges from its sync group on four fronts and has two thumb token errors. · **Priority:** P1
- **Wrong-style [P1 ✓]:** thumb `bg-white` (`styles.ts:19`) — doesn't flip in dark mode; use `bg-bg`. Disabled thumb `disabled:bg-fg-disabled` uses a *foreground* token as a background; use `bg-disabled` (`styles.ts:20`).
- **sync-group [P1 ✓]:** selects with `bg-accent` while checkbox/radio use `bg-primary`; **no `invalid:` visual** at all (checkbox/radio have one); missing from FieldGroup density gaps (fix in `field`).
- **Token / cursor [P1 ✓]:** indicator uses raw `cursor-pointer` not `cursor-interactive` (`styles.ts:14`).
- **RTL [P1 ✓]:** thumb travel uses physical `selected:ml-*` (`styles.ts:27,31,35`) → wrong direction in RTL. Use `ms-*` (or `translate-x`).
- **P2:** dead `box-shadow` in the indicator transition; card tint raw `color-mix`; no invalid demo/typing. **Proposals:** thumb-color axis; card-radius parity (frozen on checkbox/radio).
- **Strengths:** full density + 3 sizes; self-healing indicator; types aligned; correct disabled/readonly cursor on the control.

### slider — `ui/slider/`
**Compared against:** RAC Slider suite 1.18, shadcn slider · **Verdict:** Genuinely strong — excellent axis coverage, correct RAC composition; two v1 claims (dead `top-1/2 left-1/2`, dangling `aria-describedby`) are **refuted** by source. · **Priority:** P2
- **P2:** `bar` thumb is orientation-unaware (wrong shape on vertical sliders — `styles.ts:68-73`); thumb has no disabled visual while track/fill go to `bg-disabled`. **Proposal:** ColorThumb (same group) exposes none of Slider's thumb axes.
- **Refuted:** `top-1/2`/`left-1/2` each provide cross-axis centering (RAC only inline-positions one axis per orientation); `useSlotId` resolves `aria-describedby` to `undefined` when no Description → no dangle.
- **Strengths:** thumb style/shadow/radius/size + track size/radius + fill + cursor axes, all runtime-switchable; RTL-correct fill via RAC `insetInlineStart`; 4 thumb styles; CSS vars shipped via publisher.

### Cross-cutting (Group C)
- **The selection-controls sync group has drifted on every axis:** color (checkbox/radio `primary` vs switch `accent`), the undefined `text-fg-onMutedDanger` token (checkbox+radio), `card-radius` (switch exposes, checkbox/radio freeze), invalid visual (switch lacks), the cursor axis (switch `cursor-pointer`, checkbox no `cursor-interactive`), and FieldGroup gap density (switch missing from `field`). **Two group containers** (checkbox-group, radio-group) use inline `tv()` while switch uses `createStyles` — migrate together. Slider is the cleanest in the group and a good axis-coverage model for ColorThumb.

## Group D: Pickers & date/time

### select — `ui/select/`
**Compared against:** RAC Select 1.18, shadcn/Mantine/Ark Select · **Verdict:** Solid composition reusing field/list-box/popover/button; ships two public-API bugs and gives no invalid/open feedback on the trigger. · **Priority:** P1
- **Wrong-style [P1 ✓]:** `placeholder-shown:text-fg-muted` (`base.tsx:83`) never matches — SelectValue is a `<span>`, not an input; RAC uses `[data-placeholder]`. Use `data-[placeholder]:text-fg-muted`.
- **api [P1 ✓]:** `virtulized` is a public typo (`base.tsx:109`, `types.ts:37`). Rename to `virtualized`.
- **Missing-style [P1 ✓]:** invalid state is silent on the trigger — `button/styles.ts` has no `invalid:` rules; only the label reddens. Add `in-data-invalid:border-border-danger` to SelectTrigger.
- **types drift [P1 ✓]:** `SelectTrigger` is exported but has no `SelectTriggerProps` in `types.ts`.
- **P2:** chevron doesn't rotate on open (no `in-data-open:rotate-180`); physical `ml-auto`/`text-left` (→ `ms-auto`/`text-start`); `placement` declared twice; `SelectItemDescription`/`Label` not re-exported; `isOpen`/`defaultOpen` on SelectContent conflict with RAC's Select state; controlled demo imports `Key` from the Menu namespace.
- **Strengths:** clean hygiene; correct field composition; namespaced re-exports; correct Popover(clip)+ListBox(scroll) split; virtualization built in; correct deps.

### combobox — `ui/combobox/`
**Compared against:** RAC ComboBox 1.18, shadcn Combobox, Select (group parity) · **Verdict:** Deliberately headless (only `Combobox`+`ComboboxValue`); the thin posture creates real gaps and a sharp asymmetry with Select. · **Priority:** P1
- **Missing-style [P1 ✓]:** uses static `fieldStyles()` not the density-aware `useStyles()` hook (`base.tsx:7-28`) → field layout frozen at default density. Match Select.
- **registry-hygiene [P1 ✓]:** `tag-group` missing from `registryDependencies` though 4 multi-select demos import it.
- **Missing-style [P1 ✓]:** root lacks `data-field`/`data-slot` that Select sets → can't be targeted by FieldGroup gap selectors.
- **composition [P1 ✓, proposal]:** Select ships a packaged trio; Combobox makes every usage hand-wire InputGroup+Input+Button+Popover+ListBox. Ship `ComboboxContent`/`ComboboxTrigger`.
- **a11y [P1 ✓]:** icon-only trigger Buttons lack `aria-label` in basic/uncontrolled/controlled/large-list demos.
- **P2:** invalid not reflected on the trigger; `onLoadMore` infinite-scroll never demoed; no empty-state slot/demo; duplicate `multi-select.tsx`≈`multiple.tsx`.
- **Strengths:** clean hygiene; ergonomic `ComboboxValue` render-prop; `menuTrigger:'focus'` default; correct `group/combobox` focus coupling; thorough demos.

### calendar — `ui/calendar/`
**Compared against:** RAC Calendar/RangeCalendar 1.18, shadcn v4 calendar, Mantine/MUI · **Verdict:** Strong RAC-faithful composition with clever dual-layer cell design and range-edge radius logic; a cluster of confirmed issues (dead prop, RTL, disabled hover, raw token). · **Priority:** P1
- **types drift [P1 ✓]:** `CalendarCellProps.variant` documented (`types.ts:62`) but never destructured/used (`base.tsx:227`) — dead API. Also `CalendarHeadingProps` exported but missing from `types.ts`.
- **RTL [P1 ✓]:** all 5 range-rounding classes are physical `rounded-l-/r-*` (`styles.ts:19-23`) → mirror-reversed range caps in RTL (Arabic demo exists). Use `rounded-s-/e-`.
- **Missing-style [P1 ✓]:** disabled/unavailable cells still show hover bg + `cursor-interactive` (`styles.ts:17,24,29`) → falsely interactive. Add `disabled:hover:bg-transparent`/`disabled:cursor-disabled`.
- **Raw primitive [P1 ✓]:** range fill + hover use raw `color-mix(... accent 20% ...)` ×3 instead of `bg-accent-muted`.
- **P2:** stale `select`/`text` registryDependencies; `with-dropdowns.tsx` renders literal "dropdowns" (shipped publicly); RangeCalendar invalid has no cell styling; orphaned `non-contiguous-ranges` demo. **Proposal:** wire the existing `--calendar-cell-radius/size/range-radius` CSS vars as builder params.
- **Strengths:** dual-layer cell/cellInner; range-edge adjacency logic; SSR-safe heading; consistent data-attrs; strong real-world demos.

### date-field — `ui/date-field/`
**Compared against:** RAC DateField 1.18, shadcn date-field · **Verdict:** Minimal, correct wrapper; one typo ships in published output. · **Priority:** P1
- **Wrong-style [P1 ✓]:** `date-date-field=""` (`base.tsx:24`) is a plain attribute, not `data-*` — the hook is dead and the typo ships to `publishables/date-field.ts:48`. time-field does it right.
- **Token [P1 ✓]:** inherits field's `cursor-not-allowed` Label bug (`field/styles.ts:16,18`).
- **P2:** `sizes.tsx` demo shows no size variation (size lives on `DateInput`, not passed); `label.tsx` puts `aria-label` over a visible `<Label>` (aria-label wins); `required.tsx` has no Label so the asterisk never renders; `types.ts` imports `DateValue` from the Calendar namespace.
- **Strengths:** full DateField passthrough; shared DateInput/DateSegment; excellent granularity/timezone demos; clean imports.

### date-picker — `ui/date-picker/`
**Compared against:** RAC DatePicker/DateRangePicker 1.18, shadcn date-picker · **Verdict:** Thin, correct composition delegating to field/input/calendar; a missing dep and a range-separator a11y gap. · **Priority:** P1
- **registry-hygiene [P1 ✓]:** `popover` missing from `registryDependencies` though every demo imports it → installs broken. `meta.ts:14`.
- **a11y [P1 ✓]:** the `<span>–</span>` range separator lacks `aria-hidden` across all 21 range demos → announced as "dash".
- **P2:** DateRangePicker has zero examples wired into `examples.tsx` (21 demos on disk, none surfaced); root has no `data-date-picker`/group class (siblings have one).
- **Strengths:** pure composition; full passthrough; clean imports; comprehensive range demos with correct `slot="start"/"end"`; natural field-state propagation.

### time-field — `ui/time-field/`
**Compared against:** RAC TimeField 1.18 (shadcn has none) · **Verdict:** One of the cleanest components in the registry — correct `data-time-field`, full passthrough, accurate docs. The reference for how DateField should look. · **Priority:** P2
- **P2:** `label.tsx` second example renders an empty `<TimeField aria-label>` with no `DateInput` → invisible widget; add a `DateInput`.
- **Strengths:** correct data attribute (vs date-field's typo); full RAC API; clean hygiene; types match impl exactly; best-in-group demo coverage; no raw primitives.

### Cross-cutting (Group D)
- **Trigger-consistency:** Select's Button trigger has no invalid/open affordance while the date pickers' input-shell triggers inherit invalid state — unify. **Composition asymmetry** Select (packaged) vs Combobox (headless) is the group's biggest wart. **Shared infra is healthy:** one `DateSegment` (caret/focus/placeholder unified), one Popover/ListBox surface; the only divergence is date-field's `data-` typo vs time-field's correct attribute. **Missing deps** (date-picker→popover, combobox→tag-group) and the field-inherited cursor bug recur.

## Group E: Collections & navigation

### list-box — `ui/list-box/`
**Compared against:** RAC ListBox 1.18, Menu (synced) · **Verdict:** Well-structured with good highlight-axis coverage; ships a broken `danger` variant, two a11y regressions, types drift, and Menu divergence. · **Priority:** P1
- **Wrong-style [P1 ✓]:** `danger` variant is an empty `{}` (`styles.ts:38`) — danger items render identically to default. Menu implements it; copy `data-[variant=danger]:text-fg-danger ...`.
- **a11y [P1 ✓]:** `ListBoxItemDescription` passes no `slot` (`base.tsx:125`) → resolves to `labelProps` not `descriptionProps` (announced as a second label). Add `slot="label"`/`slot="description"`. CheckIcon lacks `aria-hidden` (`base.tsx:90`).
- **types drift [P1 ✓]:** `onLoadMore` implemented but absent from `types.ts`; `ListBoxLoaderProps` documents a component that isn't exported (phantom `list-box-loader.json`).
- **sync-group [P1 ✓]:** item padding/gap diverge from Menu at compact/default density.
- **P2:** physical inset classes throughout (`pr-8`/`pl-8`/`left-2`/`left-0` → logical); accent highlight missing `focus-visible:**:text-current`; `data-standalone` computed but never consumed.
- **Strengths:** highlight CSS-var axis; context-aware standalone/embedded hover split; full RAC surface + virtualizer + async load-more; clean inter-component data-attr contract.

### menu — `ui/menu/`
**Compared against:** RAC Menu 1.18, shadcn DropdownMenu, ListBox (synced) · **Verdict:** Structurally sound; a confirmed types↔impl variant drift, RTL gaps shared with ListBox, and an indicator/description bug. · **Priority:** P1
- **types drift [P1 ✓]:** `MenuItemProps.variant` advertises `success`/`warning`/`accent` (`types.ts:29`) but impl has only `default`/`danger`. Fix the type (or implement the variants).
- **a11y [P1 ✓]:** `prefix-and-suffix` demo puts field `Label`/`Description` inside a `MenuItem` (`<label>` in `role=menuitem`; wrong `data-` attr → broken icon layout). Use `MenuItemLabel`/`MenuItemDescription`.
- **Missing-style [P1 ✓]:** selection indicator not moved to `top-2` when the item has a description (ListBox does it). 
- **RTL [P1 ✓]:** five physical classes (`pr-8`/`pl-8`/`right-2`/`left-2`/`left-0`) + `ml-auto` (`styles.ts:16,17,23,57`) → logical. Land with ListBox.
- **sync-group [P1 ✓]:** item radius hardcoded `rounded-sm` while ListBox exposes `--list-box-item-radius`. Add `--menu-item-radius`.
- **P2:** default-density spacing diverges from ListBox; phantom `text` registryDependency; `link-items.tsx` demo imports from `@/components` (www-side leak); CheckIcon `text-fg-accent` may lack contrast in accent-highlight. **Proposal:** Menu item-radius axis.
- **Strengths:** clean shipped imports; correct RAC composition; runtime highlight axis; aria-hidden icons + textValue fallback; clean separator integration.

### context-menu — `ui/context-menu/`
**Compared against:** RAC (no ContextMenu primitive — custom hook justified), shadcn/Radix ContextMenu · **Verdict:** Thoughtful custom right-click/long-press trigger reusing Menu; compositionally clean but orphaned and keyboard-inaccessible. · **Priority:** P1
- **a11y [P1 ✓]:** no keyboard trigger (Shift+F10 / Menu key); the trigger div has no `tabIndex`/`role` → unreachable for keyboard-only users (WCAG 2.1.1). `use-context-menu-trigger.ts:231-325`.
- **P2:** no `user-select:none` on the trigger (text selects during long-press); still in `ORPHAN_ALLOWLIST` (production-ready — just remove it after the a11y fix); non-unique default `aria-label="Context menu"`; redundant `triggerProps.style` re-spread.
- **Strengths:** delegates all visuals to Menu; correct virtual-anchor cursor positioning; nested-menu coordination; long-press touch support; clean hygiene; types aligned.

### command — `ui/command/`
**Compared against:** RAC Autocomplete 1.18, shadcn Command/cmdk · **Verdict:** Clean Autocomplete-over-ListBox; the `types.ts` is badly misaligned and a dead `style:3` ships to the builder. · **Priority:** P1
- **types drift [P1 ✓]:** `CommandProps` documents only `className` — the `filter` prop and all AutocompleteProps are invisible (`types.ts:9`). `CommandContentProps.placement` is phantom (ListBox has no such prop). `virtulized` is a misspelled, unimplemented prop shipped to `command-content.json`.
- **P2:** `style:3` is an empty no-op exposed in the builder (`styles.ts:34`, `meta.ts:19`); 3 of 5 demos bypass `CommandInput`/`CommandContent` aliases; no `CommandEmpty` part; `CommandContent` listbox unlabelled in dialog/playground demos.
- **Strengths:** no bespoke filtering (all from RAC); correct deep subpath import; simplified filter surface; clean hygiene; two real style paradigms with context-aware modal modifier.

### tree — `ui/tree/`
**Compared against:** RAC Tree 1.18 (shadcn/Radix/Base UI have none — a gap dotUI could own) · **Verdict:** A bare, non-functional prototype — not a product component and cannot ship in any form. · **Priority:** P0
- **registry-hygiene [P0 ✓]:** only `basic.tsx`, no `meta.ts` (→ skipped by `registry-build.ts:417`), wrong filename, not allowlisted → invisible to build/drift/integrity. Build out fully or delete (or add to ORPHAN_ALLOWLIST to make WIP intentional).
- **Missing-style [P1 ✓]:** `root`/`item`/`itemContent` slots are empty or unapplied — zero visual styling, no focus ring, states, density, cursors, or item radius.
- **Missing-feature [P1 ✓]:** `TreeSection`/`TreeHeader`/`TreeLoadMoreItem` not wrapped — no sectioned/async tree possible.
- **P2:** `TreeItemContent` drops all props incl. children (⚠ adjusted); inline `tv()` not `createStyles` (⚠); chevron/grip icons lack `aria-label`/`aria-hidden`; chevron doesn't animate on expand; no cursor tokens.
- **Strengths:** correct a11y slot-wiring scaffolding (drag/selection/chevron); clean registry imports.

### table — `ui/table/`
**Compared against:** RAC Table 1.18, shadcn table · **Verdict:** The most feature-complete collection component (sorting, selection, DnD, tree rows, resizing, async, virtualization — beats shadcn); three confirmed bugs + RTL cluster. · **Priority:** P1
- **Wrong-style [P1 ✓]:** dead `data-[state=selected]:bg-accent-muted` (`styles.ts:37`) — a shadcn-ism; RAC uses `data-selected` (already handled by `selected:` on the same line).
- **Wrong-style [P1 ✓]:** `TableVirtualizer` hardcodes `densityHeight = ...default` (`base.tsx:66`) → compact/comfortable heights dead; the `types.ts` JSDoc is false.
- **Wrong-style [P1 ✓]:** cell slot duplicates the focus-visible ring as both `focus-visible:` and `data-[focus-visible]:` — the plugin's `focus-visible:` already covers both. `styles.ts:45`.
- **P2:** physical `text-left` headers, `mr-1 -ml-1` expand button, `resizing:pl-[7px]` (→ logical); rows lack `cursor-interactive`/`disabled:cursor-disabled`; `isFocusVisibleWithin` imperative override replaceable with `data-[focus-visible-within]:`; `TableLayout` exported but undocumented; sortable-unsorted columns show no indicator; no `selected:hover:bg-accent-muted-hover`.
- **Strengths:** full RAC feature coverage in one component; thorough density; custom sticky-header virtualizer layout; logical tree-indent (`paddingInlineStart`); RTL-safe drop indicator; two clean load-more patterns.

### tabs — `ui/tabs/`
**Compared against:** RAC Tabs 1.18, shadcn v4 tabs · **Verdict:** The strongest in the group — idiomatic dual-context, best-in-group tokens, animated SelectionIndicator; three targeted fixes. · **Priority:** P1
- **registry-hygiene [P1 ✓]:** `context` lib missing from `registryDependencies` though `base.tsx:8` imports it → CLI install missing the module (sidebar/avatar share this).
- **Wrong-style [P1 ✓]:** dead `[&:has([data-tab-indicator])_>_[data-tab-default-indicator]]:hidden` (`styles.ts:14`) — targets a phantom element.
- **P2:** controlled demo imports `Key` from the Menu namespace; compact/default share `--tabs-list-height:2rem` (compact gives no height reduction); vertical `line` indicator uses physical `-right-1` (→ `-end-1`); icon-trim padding physical `pl-/pr-`; `TabPanels` (animated panels) not exposed; `href` type drift (www `ToOptions`). **Proposals:** scrollable tab list; pill/enclosed/ghost variants.
- **Strengths:** dual-context propagation; best-in-group semantic tokens; animated indicator with motion-safe guard; both disabled/aria-disabled covered; correct `data-[inert=true]:hidden`; clean imports.

### tag-group — `ui/tag-group/`
**Compared against:** RAC TagGroup 1.18, shadcn badge (synced "tags" group), list-box · **Verdict:** Functional and well-built; ships a types drift on its primary `size` API, a raw primitive, and RTL gaps. · **Priority:** P1
- **types drift [P1 ✓]:** `size` is implemented (`base.tsx:13-15`) but absent from `types.ts` → the only sizing axis is undocumented.
- **Raw primitive [P1 ✓]:** resting tag uses `bg-(--neutral-300)` (`styles.ts:16`) instead of the existing `bg-highlight`/`text-fg-on-highlight` tokens at the same step.
- **P2:** `TagProps extends VariantProps<TagGroupStyles>` is a dead type (no variants defined); physical `pr-0`/`-ml-1` in remove-button (→ logical); meta default radius `--radius-md` vs styles.css `--radius-lg` (builder≠CLI); selectable tags have no hover/pressed feedback; remove-button `rounded-none` without `overflow-hidden` (focus-ring bleed); `empty:` keys off CSS `:empty` (dead when `renderEmptyState` used → use `data-empty:`). **Proposal:** per-tag semantic color variant (badge has it).
- **Strengths:** correct RAC wrap; conditional `data-react-aria-pressable:cursor-interactive`; correct `cursor-disabled`; `--tag-radius` param; thorough density×size; genuine selected tokens.

### Cross-cutting (Group E)
- **ListBox⇄Menu is the most-drifted synced pair:** the empty `danger` variant (ListBox), missing Text slots/`aria-hidden` (ListBox), item-radius axis (Menu hardcodes), padding/gap divergence, indicator-reposition, and the identical 5-class RTL gap all need lockstep fixes. **Command/ContextMenu inherit ListBox/Menu by construction** (good) but Command's `types.ts` and ContextMenu's keyboard a11y are the live issues. **Table** is excellent but carries shadcn-isms (`data-[state=selected]`) and an RTL cluster. **Tabs** is the cleanest. **types↔impl drift** (menu variant, command props, tag-group size, listbox onLoadMore/loader) recurs across the whole group.

## Group F: Overlays

### dialog — `ui/dialog/`
**Compared against:** RAC Dialog 1.18, shadcn Dialog · **Verdict:** Genuinely strong container-agnostic primitive (adapts across modal/popover/drawer); two types-drift items and three misleading demos. · **Priority:** P1
- **types drift [P1 ✓]:** `showCloseButton` (`base.tsx:31`) and `DialogInsetProps` (exported) are both absent from `types.ts`.
- **Missing-style [P1 ✓]:** popover + drawer demos render controls (placement/offset/showArrow/swipeable) wired to state that's never forwarded to `Overlay` → dead controls that mislead copy-paste.
- **a11y [P1 ✓]:** `async-form-submission` demo calls `close()` without awaiting → `isPending` never shows (models the wrong pattern).
- **P2:** `basic.tsx` duplicates `aria-label="Title"`+`autoFocus`; close button physical `right-2/4` (→ `end-`); `DialogInset` is a styleless marker (no inset bleed); `has-data-command:p-0` reaches into Command internals; no `in-data-drawer:` body rules (Drawer sets no marker); compact header has no gap; "Dissmissable" typo.
- **Strengths:** container-agnostic `in-data-modal/popover` adaptation; correct slot/aria wiring; container-query body overflow; clean sub-part decomposition with data-slots; ScrollFade integration.

### modal — `ui/modal/`
**Compared against:** RAC Modal 1.18, shadcn Dialog, Mantine/MUI · **Verdict:** Structurally sound and well-tokenized (bg/radius/blur/opacity all CSS-var params); a name drift and a private import. · **Priority:** P1
- **types drift [P1 ✓]:** `types.ts` exports `ModalContentProps` but the component is `ModalPanel`/`ModalPanelProps` → docs describe a non-existent type. Rename to `ModalPanelProps`.
- **api [P2 ⚠]:** `useIsHidden` from `react-aria/private/collections/Hidden` ships in `base.tsx:6` (shared with drawer).
- **Missing-token [P1 ✓, proposal]:** backdrop hardcodes `bg-black/(--modal-backdrop-opacity)` — only opacity is configurable, not color; no scrim token (v1's `bg-inverse` suggestion is wrong — inverts white in dark mode).
- **P2:** compact/default share `sm:max-w-sm` (compact gives no narrowing); `muted-footer` has 3 dead empty slots + reaches into Dialog's `data-slot=dialog-footer`. **Proposal:** modal `size` axis.
- **Strengths:** clean RAC composition (overlay/panel/backdrop/viewport parts); fully tokenized surface; correct independent enter/exit durations; `data-modal` marker enables Dialog adaptation; clean imports.

### drawer — `ui/drawer/`
**Compared against:** Base UI Drawer 1.4.1 (the base), RAC bridge, shadcn Sheet, Modal (param parity) · **Verdict:** Highly capable (4 placements, velocity swipe, nested stacking, indent) but the least configurable overlay — zero params vs Modal's five — with hardcoded raw-color primitives. · **Priority:** P1
- **Missing-style [P1 ✓]:** a `DialogContent` inside a Drawer gets no `data-modal`/`data-popover`/`data-drawer` marker → all of Dialog's `in-data-*` adaptive rules go dead inside any Drawer. `base.tsx:148-153`. Add `data-drawer`.
- **api [P2 ⚠]:** ships `useIsHidden` + `ClearPressResponder` from `react-aria/private/*` (`base.tsx:7-8`).
- **Raw primitive [P2]:** `bg-black/70` backdrop, raw rgba shadow (also wrong-direction for top/left/right placements), `bg-black` indent background — none theme-aware.
- **P2:** meta deps missing react-aria/react-aria-components/react-stately; left/right placement mixes logical viewport with physical popup/swipe (RTL). **Proposals:** Modal-parity params (radius/backdrop-opacity/blur/background); scrim token.
- **Strengths:** correct RAC↔Base-UI state bridge; dual dismissal-path dedup; DismissButton SR affordance; smart initial-focus scan; correct nested-stack math; safe-area handling; velocity-adaptive transitions; types aligned.

### popover — `ui/popover/`
**Compared against:** RAC Popover/OverlayArrow 1.18, Tooltip (synced) · **Verdict:** Lean and idiomatic but ships a silent arrow bug, and its synced partner Tooltip diverges on three axes. · **Priority:** P1
- **Wrong-style [P1 ✓]:** arrow rotation classes are on the `<svg>`, not `OverlayArrow` (which carries `data-placement`) → rotation never fires; arrow always points down. `base.tsx:46-58`. Move className to `OverlayArrow` (Tooltip does it right).
- **Missing-style [P1 ✓]:** arrow path has `fill-popover` but no stroke → looks borderless against the bordered surface. Add a border-token stroke or drop-shadow.
- **sync-group [P1 ✓, proposal]:** Popover has **no params** while Tooltip exposes `radius` + translucency; `--popover-radius` exists but isn't a builder axis. Add radius + translucency params (rename `translucid`→`translucent`).
- **api [P1 ✓]:** arrow polarity inverted vs Tooltip (`showArrow` default-off vs `hideArrow` default-on).
- **P2:** SVG `width/height=12` vs `viewBox 0 0 8 8` (1.5× flash); broken `showArrow` demo control; `PopoverArrow` not exported; `data-trigger` unused.
- **Strengths:** clean hygiene; complete animation; `data-popover` composition seam; correct `--trigger-width` min-width; types accurate.

### tooltip — `ui/tooltip/`
**Compared against:** RAC Tooltip 1.18, shadcn/Radix · **Verdict:** One of the cleaner overlays (correct tokens, solid animation); a types drift, a translucid seam, and the Popover divergence. · **Priority:** P1
- **types drift [P1 ✓]:** `color`/`translucid` param (via `VariantProps`) is in `base.tsx` but `types.ts` omits `VariantProps<TooltipStyles>` → the axis is invisible in API docs.
- **Wrong-style [P1 ✓]:** translucid arrow is 100% opaque while content is 70% → visible seam. Add `[&>svg]:fill-tooltip/70`.
- **P2:** translucid vars override `--color-tooltip` with raw `var(--neutral-300)` (use `var(--color-highlight)`); `translucid` misspelling (→ `translucent`); `OverlayArrow` imported from the Popover namespace; `text-left`/`opacity-80` anti-patterns in demos. **Proposal:** Kbd-on-tooltip surface contrast.
- **sync-group [P2 ⚠]:** Popover⇄Tooltip param/arrow-polarity/SVG-dims divergence — land the pair together.
- **Strengths:** correct `bg-tooltip`/`fg-on-tooltip`; sensible 700/0 delays; full directional animation; forced-colors handling; aria-hidden arrow; clean imports.

### overlay — `ui/overlay/`
**Compared against:** RAC ModalOverlay/Popover 1.18, Base UI Drawer, shadcn useIsMobile · **Verdict:** Well-conceived responsive abstraction (one `<Overlay>` switches modal/drawer/popover by breakpoint); two real prop/timing bugs. · **Priority:** P1
- **api [P1 ✓]:** `shouldCloseOnInteractOutside` is picked from `ModalProps` and spread onto Drawer, which has no such prop → silently dropped for drawers. Forward it only for modal/popover.
- **api [P1 ✓]:** `useIsMobile` initializes `undefined`→`false` → on mobile, first paint renders the desktop type then flips to drawer (flash). Use `useSyncExternalStore` or gate until defined.
- **P2:** `isDismissable` doc is Modal-specific; inactive-type `*Props` are silently ignored (document). **Proposal:** configurable breakpoint (768px baked in).
- **Strengths:** pure composition (no styles needed); clean hygiene + correct deps; `mobileType=null` escape hatch; valid trigger-ref injection; types aligned; clear demo template.

### toast — `ui/toast/`
**Compared against:** Base UI Toast 1.4.1 (the base), shadcn, Sonner · **Verdict:** Feature-rich (6 positions, per-position swipe, stacking, variants, promise/action) and well-tokenized; a types hole, a wrong-direction exit, and surface/radius proposals. · **Priority:** P1
- **Wrong-style [P1 ✓]:** top-positioned toasts exit *downward* on timeout (generic ending transform isn't position-guarded). `styles.ts:32`. Split by `data-[position*=top/bottom]`.
- **types drift [P1 ✓]:** `ToastProviderProps` (the whole Toaster API — position/limit/timeout) absent from `types.ts`; `type` documented as `string` (loses the `ToastVariant` union) and internal `transitionStatus` leaks into docs.
- **P2:** actions `ml-2` (→ `ms-2`); `error` and `danger` are duplicate variants (collapse/document); no close button slot (keyboard users rely on Escape-while-focused). **Proposals:** dedicated `color-toast` surface token (uses `bg-card`); `--toast-radius` param (hardcoded `rounded-lg`).
- **Strengths:** comprehensive CSS-var-driven animation; correct semantic variant borders/icons; correct focus handling; free Escape dismiss; clean canonical authoring + hygiene.

### Cross-cutting (Group F)
- **Backdrop/scrim is the biggest inconsistency:** Modal (tokenized opacity + blur) vs Drawer (hardcoded `bg-black/70`, no params); both hardcode literal black (not theme-aware) — a shared **scrim token** would fix Modal, Drawer, and the indent background. **Popover⇄Tooltip** is a live synced pair: arrow bug (Popover), translucid seam (Tooltip), param asymmetry, arrow-polarity, SVG dims, and the `translucid`→`translucent` rename — land together. **Dialog's container-agnostic model is excellent** but Drawer sets no `data-*` marker, so Dialog's adaptive rules go inert inside it. **types↔impl drift** recurs (dialog showCloseButton/inset, modal name, tooltip color, toast provider/type). **Private `react-aria/private/*` imports** ship in modal + drawer.

## Group G: Color components

### color-thumb — `ui/color-thumb/`
**Compared against:** RAC ColorThumb 1.18, Slider thumb (sibling), shadcn color-slider · **Verdict:** Functional but the least-tokenized in the group — every axis Slider's thumb exposes is hardcoded, two RAC states are unstyled, and a render-prop is narrowed away. Powers the builder's own seed pickers. · **Priority:** P1
- **Missing-style [P1 ✓]:** dead `group-orientation-*/color-slider:` centering — no ancestor declares `group/color-slider` (`styles.ts:10`). The real centering is the track-side selector. Remove the dead classes.
- **Missing-style [P1 ✓]:** RAC `data-dragging`/`data-hovered` unstyled — no drag/hover feedback or cursor.
- **Missing-token [P1 ✓]:** no `cursor-interactive`/`disabled:cursor-disabled` at all (Slider thumb has both).
- **api [P1 ✓]:** wrapper re-declares `className?: string`, dropping RAC's `ClassNameOrFunction` render-prop (and mis-documenting it). Use `composeRenderProps` like color-slider.
- **P2:** raw `border-white`/`ring-black/40` primitives (⚠ proposal); `size-6` hardcoded with empty density blocks; `disabled:bg-disabled!` form differs from siblings' arbitrary form; no `transition-shadow`. **Proposal:** mirror Slider's thumb axes (`--color-thumb-size` density-aware, radius, shadow, cursor).
- **Strengths:** correct createStyles shell; focus-reset/ring; `data-slot` set; semantic disabled border; types in sync.

### color-area — `ui/color-area/`
**Compared against:** RAC ColorArea 1.18, Adobe Spectrum · **Verdict:** Thin, correct wrapper with good density scaling; a dead class and an inconsistent disabled form. · **Priority:** P1
- **Wrong-style [P1 ✓]:** `in-data-dialog:w-full` (`styles.ts:7`) is dead — nothing sets `data-dialog`; also bakes a context-layout assumption into the primitive. Remove.
- **P2:** disabled uses arbitrary `[background:var(--color-disabled)]!` instead of `bg-disabled!` (canonical form); all demos omit `aria-label` (role=group unnamed on desktop). **Proposals:** cursor axis (Slider has one); color-slider radius axis (this has one, slider hardcodes).
- **Strengths:** delegates focus/positioning/touch/gradient to RAC; correct density (w-40/48/56) + `--color-area-radius` param; children fallback; clean hygiene; styles.css seeds the var.

### color-slider — `ui/color-slider/`
**Compared against:** RAC ColorSlider 1.18, Slider (sibling), ColorSwatch · **Verdict:** Structurally sound; the dead ColorThumb branch and a missing disabled output token carry over, and it lags Slider on axes. · **Priority:** P1
- **Missing-style [P1 ✓]:** ColorThumb's `group/color-slider` branch is dead — the track never declares the group (`styles.ts:11`). Add the group to the track (and remove the redundant track selector) or remove the thumb branch.
- **Missing-style [P1 ✓]:** output lacks `disabled:text-fg-disabled` (Slider has it) — disabled value readout isn't dimmed.
- **P2:** output `text-sm` density-blind (empty density blocks); arbitrary `disabled:[background...]!` form; no cursor classes; checkerboard `#e6e6e6/#fff` differs from ColorSwatch `#CCC/white`; `label.tsx` double-labels (aria-label + `<Label>`); raw `border-white`/`ring-black/40` on thumb. **Proposal:** track size/radius axes like Slider.
- **Strengths:** Provider/descriptionId wiring; composeRenderProps orientation; clean types; default-children shorthand; correct disabled `!important` over checkerboard.

### color-field — `ui/color-field/`
**Compared against:** RAC ColorField 1.18 · **Verdict:** Correct and minimal — the bare wrapper is right (RAC wires Label/Input/Text/FieldError internally). Two demo a11y bugs. · **Priority:** P1
- **a11y [P1 ✓]:** `addons.tsx` aria-labels are swapped — "prefix" field is a suffix layout and vice versa.
- **P2:** `required.tsx`/`read-only.tsx` double-label (aria-label + `<Label>` — ⚠ adjusted); no `data-slot` (siblings have one); `orientation` hardcoded `vertical` (no horizontal/peer-label); no styles.ts (density works indirectly — accepted); `group:'inputs'` may mis-sync with text fields rather than the color suite.
- **Strengths:** correctly omits dotUI's Field Provider (RAC wires contexts); composeRenderProps; inherits field density; types inherit the real `channel`/`colorSpace` levers; correct deps.

### color-swatch — `ui/color-swatch/`
**Compared against:** RAC ColorSwatch 1.18, color-area/color-swatch-picker (pattern) · **Verdict:** Minimal and correct, but ships a real CSS-var-init bug and uses inline `tv()`. · **Priority:** P1
- **Missing-style [P1 ✓]:** no `styles.css` initializing `--color-swatch-radius` at `:root` → swatch renders **square** in any static context (ColorPicker trigger, docs, scheduler). Every other radius-param component ships the `:root` seed. `base.tsx:8`, `meta.ts:17-20`.
- **Overengineering [P1 ✓]:** inline `tv()` not `createStyles` (no styles.ts) → publisher extracts an empty config, no density. Convert.
- **P2:** checkerboard `#CCC/white` diverges from ColorSlider; no density layer (`size-5` fixed).
- **Strengths:** correct RAC wrap (role=img + localized color name handled internally); `data-slot` enables picker child-targeting; correct checkerboard technique; clean pass-through types + hygiene.

### color-swatch-picker — `ui/color-swatch-picker/`
**Compared against:** RAC ColorSwatchPicker 1.18 · **Verdict:** Well-built — proper density, clean selected animation, correct focus/disabled; a cursor-axis bypass and demo anti-patterns. (v1's "suspect disabled mix" is refuted — it's valid.) · **Priority:** P1
- **Wrong-style [P1 ✓]:** `disabled:cursor-not-allowed` (`styles.ts:12`) bypasses the `cursor-disabled` axis — the lone interactive control that hardcodes it.
- **P2:** dead `transition-shadow` (no shadow ever applied); no hover/pressed feedback or `cursor-interactive` on items; all demos omit `aria-label` (unlabelled listbox); controlled demo mixes `defaultValue`+`value`; redundant `size-full rounded-[inherit]` on the swatch child (applied by both slot selector and JSX).
- **Strengths:** clean two-slot density structure; modern `before:` scale/opacity selection animation; theme-aware selection ring tokens; correct focus handling; valid disabled `color-mix`; `--color` injected via composeRenderProps; radius param wired.

### color-picker — `ui/color-picker/`
**Compared against:** RAC ColorPicker 1.18, shadcn ColorPicker · **Verdict:** Thin but architecturally sound (context + Dialog trigger + ButtonContext swatch injection); broken docs API and the ColorEditor-nesting bug surface here. · **Priority:** P1
- **Missing-feature [P1 ✓]:** docs MDX imports `ColorPickerTrigger`/`ColorPickerContent` which don't exist (`base.tsx` exports only `ColorPicker`) → runtime import failure for anyone following Usage.
- **a11y [P1 ✓]:** playground demo nests `ColorEditor` inside `ColorPicker` → outer `value`/`onChange` silently discarded (the ColorEditor double-context defect).
- **P2:** all demo trigger Buttons miss `aria-label` (⚠); ButtonContext injection doesn't set `isIconOnly` (magic `<Button/>` trigger has wrong padding); the swatch-injection magic is undocumented; registryDependencies over-declare color-field/select and miss color-swatch-picker.
- **Strengths:** elegant `ButtonContext` DEFAULT_SLOT swatch injection; full RAC state delegation; clean Dialog composition; correct composeRenderProps; no-styles is correct; clean imports.

### color-editor — `ui/color-editor/`
**Compared against:** RAC ColorPicker/ColorArea/ColorField 1.18, shadcn · **Verdict:** Useful opinionated editor but it **re-wraps its own ColorPicker**, making it non-composable inside the dotUI ColorPicker — the group's most significant design defect. · **Priority:** P1
- **composition [P1 ✓]:** wraps `ColorPickerPrimitives.ColorPicker` internally (`base.tsx:46-50`) → shadows any outer `ColorPickerStateContext`; the builder was forced to duplicate its body inline (`colors-config.tsx:133-152`). Read the ambient context and omit the wrapper when present.
- **types drift [P1 ✓]:** `value`/`defaultValue`/`onChange` missing from `types.ts` → docs describe a plain div.
- **ambiguity [P1 ✓]:** `colorFormat` implies controlled but only seeds `useState` once (no sync). Rename to `defaultColorFormat` or add a controlled path.
- **missing-feature [P1 ✓]:** three color-picker demos nest ColorEditor in ColorPicker → demonstrate the broken controlled behavior as if canonical.
- **P2:** hardcoded `mx-auto` fights flex/grid embedding; no styles.ts (density-blind gaps); inner `ColorArea` missing `aria-label`.
- **Strengths:** correct channel-based ColorField labeling; format-switch via `getColorChannels()`; documented `h-auto` height workaround; correct deps; well-named `showAlphaChannel`/`showFormatSelector`.

### Cross-cutting (Group G)
- **ColorThumb is real but under-powered** (zero axes, hardcoded size, unstyled dragging/hovered, narrowed className) — and it powers the builder's seed pickers. **ColorPicker⇄ColorEditor overlap** is the core architectural issue: the inner-ColorPicker wrap shadows context and forced builder duplication. **Consistency leaks:** checkerboard colors differ (swatch `#CCC` vs slider `#e6e6e6`); the `disabled:bg-disabled!` vs arbitrary `[background:...]!` form is split three ways; color-swatch uses inline `tv()` and ships no `styles.css` (square radius). **Pervasive demo a11y gap:** ColorArea/ColorSwatchPicker/ColorPicker-trigger demos omit `aria-label` on role=group/listbox/icon-button. **Axis parity:** color-area has a radius axis, color-slider hardcodes `rounded-md`.

## Group H: Layout & containers

### card — `ui/card/`
**Compared against:** shadcn card v4 · **Verdict:** Solid 7-slot container with semantic tokens; a dark-mode token bug, a types drift, and a broken demo form. · **Priority:** P1
- **Raw primitive [P1 ✓]:** `tasnim` footer `bg-neutral-900/50` (`styles.ts:78`) — neutral reverses in dark mode → bright footer. Use a flip-correct token.
- **types drift [P1 ✓]:** `size` (`'sm'|'default'`) is implemented but absent from `types.ts` → undocumented.
- **Wrong-style [P1 ✓]:** `[.border-b]:pb-4` arbitrary variant generates an *ancestor-descendant* rule → never fires for self-applied `border-b` (and only matches the literal class). `styles.ts:23` etc. Use `data-bordered` / a `bordered` prop.
- **a11y [P1 ✓]:** login demo's submit `Button` sits in `CardFooter`, **outside** the `<form>` → never submits.
- **P2:** compact density is identical to default (only text size differs); registryDependencies (button/text/focus-styles) unused by base. **Proposal:** elevation/shadow + padding axes.
- **Strengths:** well-decomposed slots incl. `CardAction`; semantic tokens + `--card-radius`; smart data-attr mechanics; clean hygiene; RTL-correct `col-start-2` action.

### accordion — `ui/accordion/`
**Compared against:** RAC DisclosureGroup 1.18, shadcn/Radix accordion · **Verdict:** Thin correct wrapper with a good default/hammamet axis; two carried-over bugs + a missing `'use client'`. · **Priority:** P1
- **registry-hygiene [P1 ✓]:** no `registryDependencies: ['disclosure']` → installing accordion alone ships a non-functional wrapper (no item primitives).
- **Missing-style [P1 ✓]:** no `'use client'` directive (`base.tsx`) though it wraps a client-only RAC primitive → Next.js RSC compile error.
- **Missing-style [P1 ✓]:** inherits the disclosure chevron-no-rotation bug (expand state invisible).
- **P2:** orphaned `controlled`/`custom-trigger` demos; inherits disclosure's physical `text-left`. **Proposal:** hammamet radius scalar.
- **Strengths:** clean RAC pass-through; two genuine aesthetics via one `style` axis; correct createStyles; types accurate; clean imports.

### disclosure — `ui/disclosure/`
**Compared against:** RAC Disclosure 1.18, shadcn accordion · **Verdict:** The real workhorse behind Accordion — correct ARIA, height animation, reduced-motion; the chevron never rotates and panel padding is hardcoded. · **Priority:** P1
- **Missing-style [P1 ✓]:** chevron has `transition-transform` but no rotation class (`base.tsx:70`) → never rotates. Add `group-expanded/disclosure:rotate-180`.
- **registry-hygiene [P1 ✓]:** (with accordion) missing dep declaration — see accordion.
- **P2:** `DisclosurePanel` hardcodes `pb-3` in `base.tsx:44` (invisible to density/theming); heading level hardcoded h3 (no `level` prop); `DisclosureStateContext` not re-exported; disabled trigger uses `pointer-events-none` not `cursor-disabled`; `basic.css` defines `--ease-fluid-out` but isn't in `meta.files`.
- **Strengths:** correct `--disclosure-panel-height` animation; full ARIA disclosure pattern + `hidden=until-found`; reduced-motion; scoped `group/disclosure`; advanced-composition demo; types in sync.

### separator — `ui/separator/`
**Compared against:** RAC Separator 1.18, shadcn v4 · **Verdict:** Minimal and correct; findings are polish-level. · **Priority:** P2
- **P2:** dual targeting mechanisms — emits both `data-separator` (used by registry) and a `separator` CSS class (used only by the marketing showcase); canonicalize on `data-separator`. **Proposal:** labeled/text-divider axis (OR-dividers — MUI/Mantine ship it).
- **Strengths:** correct `bg-border` hairline; orientation-from-context; full RAC pass-through; clean hygiene; appropriately empty density.

### sidebar — `ui/sidebar/`
**Compared against:** shadcn sidebar, RAC 1.18 · **Verdict:** Ambitious shadcn port but **not installable** and incomplete — dead collapsible class, wrong border token, input-stealing shortcut, no mobile/types/demos. Strong landmark semantics, though. · **Priority:** P0
- **registry-hygiene [P0 ✓]:** absent from `__generated__/registry-items.ts` → can't be installed via CLI. Also: `tooltip` dep undeclared, `use-keyboard-shortcut` hook unregistered, no `types.ts`, no `demos/`.
- **Wrong-style [P1 ✓]:** dead `group-data-[collapsible=icon]:overflow-hidden` (root sets `data-expanded`, never `data-collapsible`); `border-r/l` uses generic `border-border` not the `border-sidebar` token.
- **a11y [P1 ✓]:** ⌘B shortcut has `ignoreInputFocus:false` → fires while typing (overrides Ctrl+B bold).
- **P2:** dead `rotate-180` on the gap spacer; SidebarItem tooltip missing `placement="right"`; dead `separator` slot. **Proposals:** mobile sheet path (`hidden md:block` just disappears); collapsible-mode enum; width/variant axes.
- **Strengths:** strong landmark/region/heading semantics (better than shadcn); elegant heading-ID wiring; `bg-sidebar` surface token; ⌘B mechanism; clean ButtonContext trigger slot.

### group — `ui/group/`
**Compared against:** RAC Group 1.18, shadcn InputGroup · **Verdict:** Genuinely useful seam-joining primitive (16 demos justify it); a missing vertical seam, RTL gaps, and a brittle positional selector. · **Priority:** P1
- **Missing-style [P1 ✓]:** vertical orientation has no `-space-y-px` seam (`styles.ts:25`) → double borders between stacked items.
- **RTL [P1 ✓]:** horizontal radius-stripping uses physical `rounded-l/r-none` and the seam uses `-space-x-px` (`styles.ts:20`). Use `rounded-s/e-none` + `-ms-px`.
- **Wrong-style [P1 ✓]:** the Select-specific `:nth-child(2)` positional selector (`styles.ts:21`) breaks when Select isn't the 2nd child + couples to Select internals.
- **types drift [P1 ✓]:** `GroupText`/`GroupTextProps` exported but absent from `types.ts`.
- **P2:** duplicate `*:[input]:z-2` alongside `*:has-[input]:z-2`; `GroupText` uses `bg-card` (adornment should be `bg-muted`/`field`); two parallel adornment mechanisms (GroupText vs Label-in-Group); unused `button` dep.
- **Strengths:** real seam-joining for mixed controls; clean imports; correct orientation handling (not forwarded to RAC); thoughtful z-index layering; `not-has-data-group` guard preserves nested radii; inherits RAC state to children.

### scroll-fade — `ui/scroll-fade/`
**Compared against:** RAC (plain div — appropriate), shadcn/Radix/Base UI ScrollArea · **Verdict:** Well-conceived CSS-mask affordance with solid RTL scroll normalization, but **ships broken** via two publisher bugs + a focus-ring gap. · **Priority:** P0
- **Missing-feature [P0 ✓]:** publisher TDZ — local var `scrollFadeStyles` collides with the variant ident → published output emits `const scrollFadeVariants = scrollFadeVariants` (ReferenceError at runtime). `publishables/scroll-fade.ts:60`. **Systemic:** also affects accordion, separator, badge, link, command (any `${name}Styles` local). Fix: rename the local to `styles` (button's pattern) or fix `transform-base`.
- **registry-hygiene [P1 ✓]:** publisher multi-file bug — `use-scroll-fade.ts` ships with base.tsx's content (the memory's `extraFiles` fix is absent here). `publish.ts:144`.
- **a11y [P1 ✓]:** `outline-none` with no compensating ring while the hook sets `tabIndex=0` on overflow → no visible keyboard focus (WCAG 2.4.7). Use `focus-visible:focus-ring`.
- **registry-hygiene [P1 ✓]:** `react-aria` (used for `mergeRefs`) undeclared in meta deps.
- **P2:** RTL horizontal mask direction inverted; `--fade-size` hardcoded (proposal: axis); `data-scrolling` set but unused + `pointerenter` false-positive.
- **Strengths:** full RTL scroll-model normalization; `CSS.registerProperty` smooth interpolation; ResizeObserver/MutationObserver recompute; passive listeners; dynamic tabIndex; rich data-attr API; both files in `meta.files`.

### pagination — `ui/pagination/`
**Compared against:** shadcn pagination v4, RAC Link, Ark/Mantine/MUI · **Verdict:** An orphaned `basic.tsx` shadcn port — no meta/styles/types, not installable; the className drop voids Prev/Next styles. · **Priority:** P0
- **registry-hygiene [P0 ✓]:** only `basic.tsx`, not in `registry-items.ts` → not installable.
- **Missing-style [P0 ✓]:** `PaginationLink` destructures `className` but never forwards it to `LinkButton` (`basic.tsx:75-86`) → Prev/Next slot styles dropped.
- **Overengineering [P0 ✓]:** raw `tv()` not `createStyles` → no density/params/publisher.
- **a11y [P1 ✓]:** `aria-hidden` on the ellipsis outer span silences its own `sr-only "More pages"`; active page (`aria-current`) has no visual differentiation (no style targets it).
- **P2:** redundant `px-2.5 sm:pl-2.5` (no-op) + physical padding; `size-9` ellipsis density-blind; purely presentational (no total/page/onChange/ellipsis logic). **Proposal:** active-page variant axis.
- **Strengths:** good a11y bones (`nav aria-label`, `aria-current`, compound parts); registry-safe imports.

### breadcrumbs — `ui/breadcrumbs/`
**Compared against:** RAC Breadcrumbs 1.18, shadcn, MUI/Ark · **Verdict:** Well-built with thoughtful router/disabled handling; a cursor primitive, RTL separator gap, and a broken docs example. · **Priority:** P1
- **RTL [P1 ✓]:** default `<ChevronRightIcon/>` separator isn't mirrored in RTL (`base.tsx:81`). Add `rtl:[&_svg]:rotate-180`.
- **Wrong-style [P1 ✓]:** the docs Next.js setup example has 3 bugs (missing `return`, dead `"href" in domProps` guard after destructure, undefined `AriaLink`). The TanStack example is correct.
- **P2:** `disabled:cursor-default` bypasses `cursor-disabled` (⚠ adjusted). **Proposal:** collapse/overflow menu (`maxItems`/`BreadcrumbEllipsis`).
- **Strengths:** best-in-group a11y (RAC `<nav><ol>`, localized label, aria-hidden separators, disabled-link→`<span>`); hover-gating by element type; correct disabled+current handling; router edge-case handling in index.tsx; collection API.

### Cross-cutting (Group H)
- **A systemic publisher bug surfaced here:** the `const ${name}Styles = useStyles()` local-variable naming collides with the publisher's variant ident, producing a TDZ self-reference in the shipped output for **scroll-fade, accordion, separator, badge, link, command** — fix the transform or rename locals to `styles` everywhere. **Registry hygiene is the dominant theme:** sidebar (unregistered + missing deps/hook/types/demos) and pagination (unregistered stray) are both P0; accordion/sidebar/group/card carry phantom or missing `registryDependencies`. **Accordion⇄Disclosure** synced model is right but shares the chevron-rotation bug and a missing dep. **RTL gaps** (group seams/radius, breadcrumbs separator, disclosure text-left) and **the cursor-disabled bypass** (breadcrumbs) recur. **Surface tokens** are uneven: Card complete, Sidebar uses the wrong border token, Group uses `bg-card` for adornments, Card `tasnim` is a raw primitive.

## Group I: Display & feedback

### alert — `ui/alert/`
**Compared against:** shadcn alert, WAI-ARIA 1.2, Mantine/Chakra · **Verdict:** Well-structured grid-based composition; the role and the per-variant dimming are the substance. · **Priority:** P1
- **a11y [P1 ✓]:** `role="alert"` hardcoded for all variants (`base.tsx:19`) → success/info/neutral over-announce (assertive). Derive `role` from variant (danger/warning → alert, else status).
- **Missing-token [P1 ✓, proposal]:** description dimming via `text-fg-danger/90` opacity (`styles.ts:53-62`) — signals missing `fg-{semantic}-muted` vocabulary; the `sousse` style already avoids it.
- **P2:** physical `has-data-alert-action:pr-3` (→ `pe-3`); `[svg~&]:col-start-2` duplicated in base + both styles. **Proposals:** accent variant (Badge has it); rename `sousse`/unify into an appearance axis. (v1's "sousse ≈ default" is overstated — it's a real bordered/dimming difference.)
- **Strengths:** pure div composition (no a11y to break); grid auto-layout for all slot combos; clean tokens; types aligned; clean hygiene.

### avatar — `ui/avatar/`
**Compared against:** shadcn/Radix Avatar, Chakra/MUI AvatarGroup · **Verdict:** Feature-rich self-built avatar (image-load state, badge, group, count); a dead class, inline `tv()`, and an unregistered hook. · **Priority:** P1
- **registry-hygiene [P1 ✓]:** `use-image-loading-status` not in `hooks/registry.ts` and not in (absent) `registryDependencies` → broken import on CLI install.
- **P2:** dead `bg-blend-color` on AvatarBadge (no-op on solid bg — ⚠); inline `tv()` not `createStyles`; physical `-space-x-2` + badge `right-0/bottom-0` (RTL); AvatarBadge/Group lack role/label for status; fallback flashes (no `delayMs`); lg fallback text small; group size doesn't propagate to child `data-size`. **Proposal:** AvatarBadge `status` variant (hardcoded `bg-primary`).
- **Strengths:** robust image-load state machine; declarative badge positioning (`with-` plugin); `ring-bg` knockout; `--avatar-radius` axis; clean imports; types aligned; group-count inherits size.

### badge — `ui/badge/`
**Compared against:** shadcn Badge, MUI Chip, Chakra/Mantine · **Verdict:** Clean appearance×variant CSS-var matrix; an a11y regression, a color-mix shortcut, and a broken neutral indirection. · **Priority:** P1
- **a11y [P1 ✓]:** `role="presentation"` (`base.tsx:21`) hides status text from SRs (wrong for "8 unread"). Remove the default.
- **Wrong-style [P1 ✓]:** `neutral` variant writes `bg-neutral` directly, bypassing the `--color`/`--fg` indirection → `appearance` is a silent no-op for neutral (subtle+neutral == solid+neutral). `styles.ts:10,12,15`.
- **Missing-token [P2 ⚠]:** subtle appearance uses raw `color-mix(... 30%/60% ...)` instead of the existing `-muted` tokens.
- **P2:** icon sizing uses `[&>svg]:size-*` not the house `**:[svg]:not-with-[size]`; misleading "Long Text" demo vs `whitespace-nowrap`; `pending.tsx` uses raw `bg-amber-500`. **Proposals:** `outline` appearance; align the Alert/Badge/Button semantic set.
- **Strengths:** one-line-to-add-a-color CSS-var matrix; `--badge-radius` param; `min-w-*` for circular counts; nested-loader icon sizing; types accurate; clean span (no dropped a11y); `w-fit shrink-0`.

### progress-bar — `ui/progress-bar/`
**Compared against:** RAC ProgressBar 1.18, shadcn progress, tw-animate-css · **Verdict:** Correct RAC wiring and a good axis model, but a compounding CSS+publisher failure makes it both non-animating and uninstallable. · **Priority:** P0
- **registry-hygiene [P0 ✓]:** `root: fieldStyles().field()` is a `CallExpression` the static extractor throws on → progress-bar absent from `publishables/` → not installable. `styles.ts:9`. (Same bug in slider, otp-field.) Inline the resolved class string.
- **Wrong-style [P1 ✓]:** `basic.css` is never imported anywhere → all indeterminate animation CSS is dead in dev + prod. Rename to `styles.css` + import.
- **Wrong-style [P1 ✓]:** `progress-pulse` keyframe is undefined and `--progress-duration` has no default → indeterminate animation invalid even if the CSS loaded.
- **api [P1 ✓]:** `ProgressBarOutput` renders `{valueText}` after `{...props}` → ignores `children` (can't render custom content). Use `children ?? valueText`.
- **P2:** output `ml-auto` (→ `ms-auto`); `ProgressBarFillProps` missing from types; `ProgressBarControl`/`Track` dual-name ambiguity. **Proposal:** Meter variant (RAC ships it).
- **Strengths:** correct RAC role/aria; composable slots + fallback chain; real axes (track-size/radius, fill-color) with resilient fallbacks; correct `data-indeterminate` + `origin-left`; track `overflow-hidden`.

### loader — `ui/loader/`
**Compared against:** RAC ProgressBar 1.18, Mantine/MUI · **Verdict:** Small and clean (spinner/ring); `types.ts` documents 4 props the impl ignores, and a nested-role a11y error. · **Priority:** P1
- **types drift [P1 ✓]:** `size`/`stroke`/`speed`/`strokeLength` documented but never implemented (base files hardcode `size-4`/`strokeWidth="4"`). Generated docs are fiction.
- **a11y [P1 ✓]:** inner SVG/icon carries `role="status"`+`aria-label` inside RAC's `role="progressbar"` wrapper → competing labels. Make the SVG `aria-hidden`.
- **P2:** no styles.ts/createStyles (bypasses the house model); no-op `cn('size-4 animate-spin')` in spinner (ring uses a plain string); `aria-label` casing inconsistency. **Proposal:** size axis (hosts patch size via descendant selectors today).
- **Strengths:** `currentColor`-based (inherits context); style param wired via `createDynamicComponent`; clean imports; overridable wrapper `aria-label`; correct `isIndeterminate` pin.

### skeleton — `ui/skeleton/`
**Compared against:** shadcn skeleton (1-liner), Mantine Skeleton · **Verdict:** Technically ambitious WAAPI-synchronized auto-skeletonization engine; powerful but heavy, with a maintainability hazard and a misleading demo. No P0/P1. · **Priority:** P2 (complexity review)
- **P2:** the ~18-entry selector union is duplicated **4×** (base.tsx + styles.ts + 3 CSS `@utility` blocks) — drift hazard; standalone shape-mode always emits `aria-busy=true` (stuck "busy" after load unless explicit `isLoading=false`); playground demo models the wrapper-around-shapes anti-pattern (never resolves to real content); unused `group/skeleton`; dual-mode behavior under-documented in types.
- **Strengths:** semantic-token shimmer; `aria-busy`+`inert`; respects reduced-motion; graceful no-JS fallback; MutationObserver sync + cleanup; `startTime=0` timeline sync; createStyles; clean imports; `content-visibility` hides replaced media.

### empty — `ui/empty/`
**Compared against:** RAC (pure layout), Mantine/MUI empty states · **Verdict:** Clean shadcn-aligned empty state with the best slot hygiene in the group; minor density + token + demo issues. · **Priority:** P2
- **composition [P1 ✓]:** `empty-projects` demo places `EmptyTitle`/`EmptyDescription` outside `EmptyHeader` → broken composition (models the wrong pattern).
- **P2:** comfortable density missing header/content gap (packs tight — opposite of intent); description link hover uses `text-primary` (a bg-category token as fg); no `role`/`aria-live` (dynamic empty unannounced); title is a `div` (no heading semantics, shadcn-parity). **Proposals:** `fg-link`/`fg-link-hover` token; `EmptyImage` slot.
- **Strengths:** all 6 parts carry `data-slot`; types aligned incl. `EmptyMedia` variant; clean tokens; density for compact/default; clean hygiene; intentional opt-in dashed border.

### drop-zone — `ui/drop-zone/`
**Compared against:** RAC DropZone 1.18, Mantine Dropzone (shadcn has none) · **Verdict:** Minimal correct wrapper; the focus treatment is a codebase outlier and it's under-built vs Mantine. · **Priority:** P1
- **a11y [P1 ✓]:** uses `focus-visible:border-border-focus` with no `focus-reset`/`focus-ring` (`styles.ts:9`) — the only interactive component that deviates from the house focus convention → risks double indicator + weak contrast.
- **P2:** basic demo has no accessible name; no transition on drop-target state; missing `disabled:cursor-disabled`; empty density blocks (`p-6`/`gap-2` fixed); `events.tsx` imports `TextDropItem` via the Tree namespace. **Proposals:** drop `w-60` fixed width (fluid default); reject/invalid drop-target state (Mantine has it).
- **Strengths:** correct RAC wrap; valid tokens; correct drop-target token pair; `slot="label"` accessible name; clean imports; types in sync.

### Cross-cutting (Group I)
- **The Alert/Badge/Button semantic-variant system is incoherent on every axis** — different semantic sets (Button no success/info, Alert no accent, Badge no primary), `default` vs `neutral` naming, and three ways to fake "soft" (Badge `color-mix`, Alert `/90` opacity + `sousse`, no shared `-muted` path). This is the group's biggest structural opportunity (proposal). **The publisher `fieldStyles().field()` extractor bug (P0)** hits progress-bar here (and slider, otp-field). **Feedback a11y regressions recur** (alert role, badge role=presentation, loader nested role, drop-zone focus). **Loader + ProgressBar share no size/animation convention** despite both being RAC ProgressBar-based. **Skeleton** is the overengineering flag for the rewrite radar.

## Group J: Typography & forms

### heading — `ui/heading/`
**Compared against:** RAC Heading 1.18, Mantine/Chakra/MUI Heading · **Verdict:** A bare, unregistered passthrough — no styles/meta/base, adds nothing over importing RAC directly. · **Priority:** P1
- **registry-hygiene [P1 ✓]:** only `index.tsx`, no `meta.ts` → skipped by `registry-build.ts:417`, not allowlisted (unintentional). Not installable. Promote or delete (two consumers import it: logo.tsx + a disclosure demo).
- **Missing-feature [P1 ✓]:** `HeadingContext` not re-exported → sidebar must import `HeadingPrimitives` directly, defeating the wrapper.
- **P2:** `HeadingProps` defined but unused in the signature; no `data-heading` attribute. **Proposal:** decouple visual `size` from semantic `level` (today changing size means breaking heading order — an a11y footgun); the core missing typography axis.
- **Strengths:** valid subpath import + `'use client'`; named `HeadingProps` alias exists.

### header — `ui/header/`
**Compared against:** RAC Header 1.18, Mantine/Chakra · **Verdict:** A degenerate stub — zero-value RAC passthrough, no meta, not built, no consumers. · **Priority:** P0
- **registry-hygiene [P0 ✓]:** no `meta.ts`/`base.tsx` → excluded from build + CLI; `index.tsx` drops `HeaderContext` and adds nothing.
- **Missing-feature [P1 ✓]:** zero internal consumers — everything imports `react-aria-components/Header` directly. The wrapper has no reason to exist.
- **P2 proposal:** no typographic axis (CLAUDE.md names typography core). **Recommendation:** delete the folder (use the RAC primitive) or give it a real landmark+typographic identity.
- **Strengths:** valid subpath import + `'use client'` (that's all).

### text — `ui/text/`
**Compared against:** RAC Text 1.18, Mantine/Chakra Text · **Verdict:** A correct, intentionally-minimal slot-marker (adds `data-text` for skeleton targeting), but its "typography" identity sets a false expectation. (v1's "23-byte styles.css" claim is refuted — no such file.) · **Priority:** P2
- **P2:** Text has no size/weight/color/truncate/lineClamp API yet the builder uses it as the typography-group body component (styled with raw Tailwind) → typography isn't a builder axis; `GroupText` duplicates the `data-text` hook instead of using Text (silent divergence); no demos/docs page; the name "Text" implies general typography (discoverability trap). **Proposals:** widen Text or add a separate `Body` component; possibly rename.
- **Strengths:** thin correct wrapper (no dropped RAC capability); `data-text` powers skeleton with zero coupling; properly registered; clean hygiene; types in sync.

### form — `ui/form/`
**Compared against:** RAC Form 1.18, shadcn Form · **Verdict:** Not a component — demos only (no meta/base/wrapper); the whole form family is WIP at the registry boundary. · **Priority:** P1
- (This entry aggregates the form-family findings; per-adapter detail is in react-hook-form and tanstack-form below.)
- **registry-hygiene [P1 ✓]:** both adapters' `meta.ts` point at a nonexistent `base.tsx` (kept alive only by `ORPHAN_ALLOWLIST`) → neither installable; both declare `name:'form'` (latent collision); `ui/form/` itself is demos-only with no RAC Form wrapper (shadcn ships a real one).
- **Confirmed adapter bugs [P1 ✓]:** tanstack Select uses `value`/`onChange` instead of `selectedKey`/`onSelectionChange` (silently uncontrolled); tanstack DatePicker hardcodes `value={undefined}`; tanstack Switch omits `isInvalid`; the `errors[0]?.message` pattern fails for string validators (TanStack `ValidationError = unknown`) → FieldError renders empty across all adapters; tanstack ColorPicker missing `onBlur`; RHF `FormControl` leaks `isDirty`/`isTouched`/`isValidating` to RAC DOM and drops `errorMessage` (no FieldError child).
- **Strengths:** tanstack-form is a broad, architecturally-correct `createFormHook` integration; clean import hygiene; ORPHAN_ALLOWLIST documents WIP intent.

### react-hook-form — `ui/react-hook-form/`
**Compared against:** RHF v7 Controller, tanstack-form (sibling), shadcn FormField · **Verdict:** A clean single `Controller` adapter (`FormControl`) but WIP/orphaned and its demo silently swallows errors. · **Priority:** P1
- **registry-hygiene [P1 ✓]:** `meta.ts` → nonexistent `base.tsx` → never ships.
- **Missing-feature [P1 ✓]:** demo never renders `FieldError` (RAC requires the slot child; `errorMessage` flows nowhere) → validation errors invisible.
- **api [P1 ✓]:** demo mixes `inputValue` + `onSelectionChange` on Combobox (typed text vs selected key) → semantically broken. Use `selectedKey`/`onSelectionChange`.
- **P2:** `fieldState` residue (`isDirty`/`isTouched`/`isValidating`) leaks to DOM (⚠ adjusted); no `types.ts`; `name:'form'` collision. **Recommendation:** consider `FormField` over `FormControl` (collides with MUI/shadcn meaning).
- **Strengths:** clean prop remapping (disabled→isInvalid, invalid→isInvalid); proper generics; correct Controller integration; ORPHAN_ALLOWLIST guard.

### tanstack-form — `ui/tanstack-form/`
**Compared against:** TanStack Form 1.32, RAC 1.18, the file's own working adapters · **Verdict:** By far the most complete integration (14 field adapters + Submit/Reset via `createFormHook`) but uninstallable and carrying several confirmed data bugs. · **Priority:** P1
- **registry-hygiene [P1 ✓]:** no `base.tsx` → uninstallable (the blocker before any other fix).
- **Wrong-style [P1 ✓]:** DatePicker hardcodes `value={undefined}` (`index.tsx:251`) → field value permanently dropped.
- **Missing-feature [P1 ✓]:** Switch omits `isInvalid` (Checkbox has it) → validation state suppressed.
- **api [P1 ✓]:** SubmitButton gates on `!isDirty` not `!canSubmit` → can't submit valid pre-filled forms, and doesn't block invalid ones.
- **api [P1 ✓]:** `errors[0]?.message` fails for string validators across 9 adapters → FieldError renders empty. Use `String(errors[0] ?? '')`.
- **P2:** Checkbox has `isInvalid` but no FieldError child; no types.ts/demos; two parallel `name:'form'` adapters. (The Select-wrong-props claim is also confirmed at the form-family level.)
- **Strengths:** correct `createFormHook` architecture; consistent value/onChange/onBlur/isInvalid binding on the non-broken adapters; Combobox uses the correct `selectedKey`/`onSelectionChange`; FieldError via composeRenderProps; clean imports; correct Reset.

### Cross-cutting (Group J)
- **The typography family is hollow:** Heading/Header are unregistered passthroughs, Text is a slot-marker, and there's no scale/weight/leading/tracking/truncate axis anywhere — typography is named a core builder axis in CLAUDE.md but isn't one. **Header should likely be deleted** (zero consumers, all internal users import the RAC primitive). **The form family is triple-identitied and entirely WIP:** `ui/form` (demos-only), react-hook-form, tanstack-form — all `name:'form'`, none installable (both adapters → nonexistent base.tsx). Pick one canonical adapter (tanstack-form is far more complete) and fix its confirmed data bugs (DatePicker value, Switch isInvalid, SubmitButton gate, string-validator error rendering) before graduating it. **Naming traps:** Heading vs Header, Text-implies-typography, FormControl vs MUI/shadcn.

