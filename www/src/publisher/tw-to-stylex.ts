/**
 * Tailwind utility → StyleX style-object translation.
 *
 * This is the parity core of the dual styling backend (see
 * `docs/research/2026-06-30-tailwind-stylex-dual-backend/`). It does NOT parse
 * arbitrary class strings as a production strategy — the publisher feeds it the
 * leaf class strings out of the flat `TvLayer` IR, where structure (slots,
 * variants, states) is already known. Each token is mapped to a `{ cssProperty:
 * value }` entry; variant prefixes (`hover:`, `data-[…]:`, `disabled:`) fold
 * into StyleX condition maps (`{ default, ':hover': … }`).
 *
 * StyleX forbids styling-at-a-distance, so any token that styles *other*
 * elements — descendant (`**:`, `*:`, `[&_svg]:`), group/peer, `has-*` — has no
 * same-element equivalent and is returned in `untranslated`. That list is not a
 * failure: it is the work-list the parity system hands to the `when.*`/refactor
 * step. `group`/`peer` *marker* tokens (which emit no CSS themselves) are
 * returned separately in `markers`.
 *
 * dotUI themes everything with CSS custom properties, so colors/radius/etc. are
 * emitted as literal `var(--color-primary)` references — identical bytes to what
 * the Tailwind backend resolves to, which is what guarantees visual parity.
 *
 * Pure data transform — request-time safe (no React, no ts-morph). Coverage is
 * deliberately a curated-but-real subset; the parity verifier's untranslated
 * report drives extending the tables. Mirror of Tailwind's resolved CSS, not a
 * reimplementation of its engine.
 */

import { DEFAULT_SEMANTICS } from '@/registry/theme'

/* --------------------------------- types --------------------------------- */

/** A StyleX value: a literal, or a condition map keyed by `default`/`:hover`/`[data-…]`/`@media`.
 *  Conditions nest (StyleX supports it), so a condition's value may itself be a condition map —
 *  that's how stacked Tailwind variants (`disabled:selected:…`, `sm:data-[…]:…`) are expressed. */
export type StyleXValue = string | number | StyleXConditions
export interface StyleXConditions {
  default?: StyleXValue
  [condition: string]: StyleXValue | undefined
}
/** camelCase CSS property → value. */
export type StyleXStyle = Record<string, StyleXValue>

export interface TranslateResult {
  style: StyleXStyle
  /** Tokens with no same-element StyleX equivalent (descendant/group/has/unknown/custom-composite). */
  untranslated: string[]
  /** Marker tokens (`group`, `group/button`, `peer`) — structural, emit no CSS. */
  markers: string[]
}

/* --------------------------- semantic color set --------------------------- */

// dotUI's semantic color vocabulary, e.g. `color-primary` → utility name
// `primary` → `var(--color-primary)`. Sourced from the registry theme so it
// can't drift from the real token set.
const SEMANTIC_COLOR_NAMES = new Set(
  Object.keys(DEFAULT_SEMANTICS)
    .filter((k) => k.startsWith('color-'))
    .map((k) => k.slice('color-'.length)),
)

/* --------------------------- composite utilities -------------------------- */

/**
 * dotUI's same-element composite utilities, defined via `@utility` in
 * `registry/base/base.css` and shipped to every consumer. They expand to
 * same-element rules but the translator can't see their definition, so rather
 * than drop them, the emitter keeps them as literal classNames — StyleX layers
 * cleanly with an external class (Astryx does the same), so e.g. the focus ring
 * survives for free. The consumer's CSS layer (which ships these) resolves them.
 */
export const PASSTHROUGH_UTILITIES = new Set([
  'focus-ring',
  'focus-reset',
  'focus-input',
  'no-highlight',
])

/** True when a token (ignoring any state prefix) is a dotUI composite utility
 *  that should be emitted verbatim as a className instead of translated. */
export function isPassthroughToken(token: string): boolean {
  const utility = token.split(':').pop() ?? token
  return PASSTHROUGH_UTILITIES.has(utility)
}

/* ------------------------------ tokenizing ------------------------------- */

/** `margin-bottom` → `marginBottom`; leaves already-camel / single words intact. */
function kebabToCamel(prop: string): string {
  return prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
}

/** Split on `sep` at bracket depth 0 (so `data-[a=b]:x` and `bg-(--v)` survive). */
function splitTopLevel(input: string, sep: string): string[] {
  const out: string[] = []
  let depth = 0
  let start = 0
  for (let i = 0; i < input.length; i++) {
    const ch = input[i]
    if (ch === '[' || ch === '(') depth++
    else if (ch === ']' || ch === ')') depth--
    else if (ch === sep && depth === 0) {
      out.push(input.slice(start, i))
      start = i + 1
    }
  }
  out.push(input.slice(start))
  return out
}

interface ParsedToken {
  prefixes: string[]
  utility: string
}

function parseToken(token: string): ParsedToken {
  const parts = splitTopLevel(token, ':')
  return {
    utility: parts[parts.length - 1] ?? '',
    prefixes: parts.slice(0, -1),
  }
}

/* ------------------------------ prefix → condition ----------------------- */

// Same-element variant prefixes → StyleX condition keys.
//
// dotUI styles React-Aria roots (which carry `data-rac`). On those roots the
// `tailwindcss-react-aria-components` plugin compiles the unprefixed interactive
// variants to RAC DATA-ATTRIBUTE selectors — `hover:` → `[data-hovered]` (gated
// behind `@media (hover: hover)`, which RAC's JS already enforces by never setting
// data-hovered on touch), `disabled:` → `[data-disabled]` (matches even when a
// disabled RAC element renders as a non-form `<a>`/`<span>` that native `:disabled`
// can't), etc. So we key off the same data-* attributes, not native pseudo-classes,
// or the StyleX export would diverge from the Tailwind export on real RAC roots.
// (Bare `[data-…]` keys are valid StyleX conditions; an `&`-prefix would not be.)
const STATE_CONDITIONS: Record<string, string> = {
  // Interactive (RAC maps these to data-* on data-rac roots; see note above).
  hover: '[data-hovered]',
  focus: '[data-focused]',
  'focus-visible': '[data-focus-visible]',
  'focus-within': '[data-focus-within]',
  // `active:` resolves to `[data-active]` on RAC roots, which RAC never sets — so
  // it no-ops in BOTH backends (RAC uses `pressed:`/`[data-pressed]` for press).
  active: '[data-active]',
  disabled: '[data-disabled]',
  // RAC render-state booleans (the `tailwindcss-react-aria-components` plugin's
  // attribute list — all `[data-X]` on RAC roots).
  pressed: '[data-pressed]',
  hovered: '[data-hovered]',
  focused: '[data-focused]',
  selected: '[data-selected]',
  pending: '[data-pending]',
  current: '[data-current]',
  entering: '[data-entering]',
  exiting: '[data-exiting]',
  expanded: '[data-expanded]',
  open: '[data-open]',
  indeterminate: '[data-indeterminate]',
  invalid: '[data-invalid]',
  required: '[data-required]',
  unavailable: '[data-unavailable]',
  'read-only': '[data-readonly]',
  'placeholder-shown': '[data-placeholder]',
  empty: '[data-empty]',
  'outside-month': '[data-outside-month]',
  'outside-visible-range': '[data-outside-visible-range]',
  'selection-start': '[data-selection-start]',
  'selection-end': '[data-selection-end]',
  dragging: '[data-dragging]',
  'drop-target': '[data-drop-target]',
  resizing: '[data-resizing]',
  'allows-removing': '[data-allows-removing]',
  'allows-sorting': '[data-allows-sorting]',
  'allows-dragging': '[data-allows-dragging]',
  'has-submenu': '[data-has-submenu]',
  'has-child-items': '[data-has-child-items]',
}

// Native structural pseudo-classes (NOT remapped by the RAC plugin).
const NATIVE_PSEUDO: Record<string, string> = {
  first: ':first-child',
  last: ':last-child',
  only: ':only-child',
  odd: ':nth-child(odd)',
  even: ':nth-child(even)',
}

// Tailwind v4 breakpoints (rem); responsive prefixes → `@media` range conditions.
const BREAKPOINTS: Record<string, string> = {
  sm: '40rem',
  md: '48rem',
  lg: '64rem',
  xl: '80rem',
  '2xl': '96rem',
}

// RAC enum variant prefixes (`placement-bottom:` …) → the data-attribute they pin.
const ENUM_VARIANTS: Record<string, string> = {
  placement: 'placement',
  orientation: 'orientation',
  layout: 'layout',
  selection: 'selection-mode',
  sort: 'sort-direction',
  resizable: 'resizable-direction',
  type: 'type',
}

// Prefixes that style some OTHER element (or a custom plugin we can't resolve):
// descendant (`**`/`*`/`[&…]`), group/peer, has, the `in`/`with` plugins, and
// arbitrary class-presence / tag selectors (`[.border-b]`, `[svg~&]`).
const DESCENDANT_PREFIX_RE =
  /^(\*\*|\*|group(\/|-|$)|peer(\/|-|$)|has-|in-|not-in-|with-|not-with-|\[&|\[\.|\[[a-z])/

type Condition =
  | { kind: 'condition'; key: string }
  | { kind: 'descendant' }
  | { kind: 'unknown' }

function classifyPrefix(prefix: string): Condition {
  if (DESCENDANT_PREFIX_RE.test(prefix)) return { kind: 'descendant' }
  if (prefix in STATE_CONDITIONS)
    return { kind: 'condition', key: STATE_CONDITIONS[prefix]! }
  if (prefix in NATIVE_PSEUDO)
    return { kind: 'condition', key: NATIVE_PSEUDO[prefix]! }

  // Responsive: `sm:`…`2xl:` → min-width; `max-sm:`… → max-width range queries.
  if (prefix in BREAKPOINTS)
    return {
      kind: 'condition',
      key: `@media (width >= ${BREAKPOINTS[prefix]})`,
    }
  const maxBp = /^max-(sm|md|lg|xl|2xl)$/.exec(prefix)
  if (maxBp)
    return {
      kind: 'condition',
      key: `@media (width < ${BREAKPOINTS[maxBp[1]!]})`,
    }
  if (prefix === 'motion-safe')
    return {
      kind: 'condition',
      key: '@media (prefers-reduced-motion: no-preference)',
    }
  if (prefix === 'motion-reduce')
    return {
      kind: 'condition',
      key: '@media (prefers-reduced-motion: reduce)',
    }

  // `nth-2:` / `nth-last-2:` → `:nth-child(n)` / `:nth-last-child(n)`.
  const nth = /^nth(-last)?-(\d+|odd|even|\[.+\])$/.exec(prefix)
  if (nth)
    return {
      kind: 'condition',
      key: `:nth${nth[1] ? '-last' : ''}-child(${nth[2]!.replace(/^\[|\]$/g, '')})`,
    }

  // `supports-[…]:` → `@supports`.
  const supports = /^supports-\[(.+)\]$/.exec(prefix)
  if (supports)
    return {
      kind: 'condition',
      key: `@supports (${supports[1]!.replace(/_/g, ' ')})`,
    }

  // `[@container_(height<31.25rem)]:` → `@container` query.
  const containerQ = /^\[?@container(?:\/[a-z0-9-]+)?[ _]\((.+)\)\]?$/.exec(
    prefix,
  )
  if (containerQ)
    return {
      kind: 'condition',
      key: `@container (${containerQ[1]!.replace(/_/g, ' ')})`,
    }

  // `data-[key=value]:` / `data-[key]:` — same-element attribute selectors
  // (incl. substring/prefix operators like `data-[position*=bottom]`).
  const dataArb = /^data-\[(.+)\]$/.exec(prefix)
  if (dataArb) {
    const inner = dataArb[1]!
    const m = /^([a-z0-9-]+)([*^$~|]?=)(.+)$/.exec(inner)
    if (m)
      return {
        kind: 'condition',
        key: `[data-${m[1]}${m[2]}"${m[3]!.replace(/^["']|["']$/g, '')}"]`,
      }
    return { kind: 'condition', key: `[data-${inner}]` }
  }
  // `not-data-[…]:` / `not-data-foo:` / `not-<state>:` → `:not(<same-element selector>)`.
  const not = /^not-(.+)$/.exec(prefix)
  if (not) {
    const inner = classifyPrefix(not[1]!)
    return inner.kind === 'condition' && !inner.key.startsWith('@')
      ? { kind: 'condition', key: `:not(${inner.key})` }
      : { kind: 'descendant' }
  }
  // `data-foo:` shorthand → `[data-foo]`.
  const dataShort = /^data-([a-z][a-z0-9-]*)$/.exec(prefix)
  if (dataShort) return { kind: 'condition', key: `[data-${dataShort[1]}]` }

  // RAC enum variants: `placement-bottom:` → `[data-placement="bottom"]`.
  const dash = prefix.indexOf('-')
  if (dash !== -1 && prefix.slice(0, dash) in ENUM_VARIANTS)
    return {
      kind: 'condition',
      key: `[data-${ENUM_VARIANTS[prefix.slice(0, dash)]}="${prefix.slice(dash + 1)}"]`,
    }

  // `aria-[k=v]:` → `[aria-k="v"]`; `aria-disabled:` → `[aria-disabled="true"]`.
  const ariaArb = /^aria-\[(.+)\]$/.exec(prefix)
  if (ariaArb) {
    const inner = ariaArb[1]!
    const eq = inner.indexOf('=')
    return {
      kind: 'condition',
      key:
        eq === -1
          ? `[aria-${inner}]`
          : `[aria-${inner.slice(0, eq)}="${inner.slice(eq + 1).replace(/^["']|["']$/g, '')}"]`,
    }
  }
  const ariaBool = /^aria-([a-z][a-z-]*)$/.exec(prefix)
  if (ariaBool)
    return { kind: 'condition', key: `[aria-${ariaBool[1]}="true"]` }

  return { kind: 'unknown' }
}

/* ------------------------------ value helpers ---------------------------- */

const RADIUS_SIZES = new Set(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'])
const TEXT_SIZES = new Set([
  'xs',
  'sm',
  'base',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
])
const FONT_WEIGHTS: Record<string, number> = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
}
const CURSOR_VARS = new Set(['interactive', 'disabled'])
// Tailwind v4's named leadings are theme vars (`--leading-snug` …) EXCEPT
// `leading-none`, which is the literal `1` (no var exists for it).
const LEADING_NAMES = new Set(['tight', 'snug', 'normal', 'relaxed', 'loose'])

/** Resolve a Tailwind line-height value (`relaxed`, `none`, `6`, `[1.5]`). */
function leading(value: string): string {
  if (value === 'none') return '1'
  if (LEADING_NAMES.has(value)) return `var(--leading-${value})`
  const arb = arbitrary(value)
  if (arb !== undefined) return arb
  if (/^\d+(\.\d+)?$/.test(value)) return `calc(var(--spacing) * ${value})`
  return value
}

/** Tailwind spacing scale → `calc(var(--spacing) * n)` (density-aware via --spacing). */
function spacing(value: string): string | undefined {
  if (value === '0') return '0'
  if (value === 'px') return '1px'
  const arb = arbitrary(value)
  if (arb !== undefined) return arb
  if (/^\d+(\.\d+)?$/.test(value)) return `calc(var(--spacing) * ${value})`
  return undefined
}

/** Expand Tailwind v4's `--spacing(N)` theme function and `_`-escaped spaces. */
function cssLiteral(value: string): string {
  return value
    .replace(/--spacing\((\d+(?:\.\d+)?)\)/g, 'calc(var(--spacing) * $1)')
    .replace(/_/g, ' ')
}

/** Resolve a Tailwind arbitrary value `[v]` or var shorthand `(--v)`; else undefined. */
function arbitrary(value: string): string | undefined {
  const brack = /^\[(.+)\]$/.exec(value)
  if (brack) return cssLiteral(brack[1]!)
  const paren = /^\((--[a-z0-9-]+)\)$/i.exec(value)
  if (paren) return `var(${paren[1]})`
  return undefined
}

/** Resolve a color token to a value, honoring `/<opacity>` modifiers. */
function color(token: string): string | undefined {
  const [name, opacity] = splitTopLevel(token, '/') as [string, string?]
  let base: string | undefined
  if (name === 'transparent') base = 'transparent'
  else if (name === 'current') base = 'currentColor'
  else if (name === 'inherit') base = 'inherit'
  else {
    const arb = arbitrary(name)
    if (arb !== undefined) base = arb
    else if (SEMANTIC_COLOR_NAMES.has(name)) base = `var(--color-${name})`
    // black/white + palette ramps (`neutral-900`) use Tailwind's `--color-*`
    // names — the same vars the Tailwind backend resolves to, so parity holds.
    else if (
      name === 'black' ||
      name === 'white' ||
      /^[a-z]+-\d{2,3}$/.test(name)
    )
      base = `var(--color-${name})`
  }
  if (base === undefined) return undefined
  if (opacity === undefined) return base
  // Tailwind v4 opacity modifier compiles to color-mix(in oklab, <c> N%, transparent).
  return `color-mix(in oklab, ${base} ${opacity}%, transparent)`
}

/* ------------------------------ utility table ---------------------------- */

// Exact-match keyword utilities → fixed declarations.
const KEYWORDS: Record<string, StyleXStyle> = {
  relative: { position: 'relative' },
  absolute: { position: 'absolute' },
  fixed: { position: 'fixed' },
  flex: { display: 'flex' },
  'inline-flex': { display: 'inline-flex' },
  block: { display: 'block' },
  'inline-block': { display: 'inline-block' },
  grid: { display: 'grid' },
  hidden: { display: 'none' },
  'flex-col': { flexDirection: 'column' },
  'flex-row': { flexDirection: 'row' },
  'flex-col-reverse': { flexDirection: 'column-reverse' },
  'flex-row-reverse': { flexDirection: 'row-reverse' },
  'flex-wrap': { flexWrap: 'wrap' },
  'flex-nowrap': { flexWrap: 'nowrap' },
  'flex-1': { flexGrow: 1, flexShrink: 1, flexBasis: '0%' },
  'flex-auto': { flexGrow: 1, flexShrink: 1, flexBasis: 'auto' },
  'flex-none': { flexGrow: 0, flexShrink: 0, flexBasis: 'auto' },
  grow: { flexGrow: 1 },
  shrink: { flexShrink: 1 },
  'shrink-0': { flexShrink: 0 },
  'grow-0': { flexGrow: 0 },
  'items-center': { alignItems: 'center' },
  'items-start': { alignItems: 'flex-start' },
  'items-end': { alignItems: 'flex-end' },
  'items-stretch': { alignItems: 'stretch' },
  'items-baseline': { alignItems: 'baseline' },
  'justify-center': { justifyContent: 'center' },
  'justify-start': { justifyContent: 'flex-start' },
  'justify-end': { justifyContent: 'flex-end' },
  'justify-around': { justifyContent: 'space-around' },
  'justify-evenly': { justifyContent: 'space-evenly' },
  'justify-between': { justifyContent: 'space-between' },
  'whitespace-nowrap': { whiteSpace: 'nowrap' },
  'select-none': { userSelect: 'none' },
  'bg-clip-padding': { backgroundClip: 'padding-box' },
  'pointer-events-none': { pointerEvents: 'none' },
  'outline-none': { outlineStyle: 'none' },
  underline: { textDecorationLine: 'underline' },
  truncate: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  border: { borderStyle: 'solid', borderWidth: '1px' },
  'border-0': { borderWidth: '0' },
  // Display / layout.
  'inline-grid': { display: 'inline-grid' },
  inline: { display: 'inline' },
  contents: { display: 'contents' },
  sticky: { position: 'sticky' },
  isolate: { isolation: 'isolate' },
  'box-border': { boxSizing: 'border-box' },
  'box-content': { boxSizing: 'content-box' },
  'overflow-hidden': { overflow: 'hidden' },
  'overflow-auto': { overflow: 'auto' },
  'overflow-visible': { overflow: 'visible' },
  'overflow-clip': { overflow: 'clip' },
  'overflow-scroll': { overflow: 'scroll' },
  'overflow-x-auto': { overflowX: 'auto' },
  'overflow-y-auto': { overflowY: 'auto' },
  'overflow-x-hidden': { overflowX: 'hidden' },
  'overflow-y-hidden': { overflowY: 'hidden' },
  'mx-auto': { marginInline: 'auto' },
  'my-auto': { marginBlock: 'auto' },
  // Alignment.
  'place-content-center': { placeContent: 'center' },
  'place-items-center': { placeItems: 'center' },
  'self-start': { alignSelf: 'flex-start' },
  'self-end': { alignSelf: 'flex-end' },
  'self-center': { alignSelf: 'center' },
  'self-stretch': { alignSelf: 'stretch' },
  'justify-self-start': { justifySelf: 'start' },
  'justify-self-end': { justifySelf: 'end' },
  'justify-self-center': { justifySelf: 'center' },
  'justify-items-center': { justifyItems: 'center' },
  // Grid flow / auto tracks.
  'grid-flow-col': { gridAutoFlow: 'column' },
  'grid-flow-row': { gridAutoFlow: 'row' },
  'auto-rows-min': { gridAutoRows: 'min-content' },
  'auto-rows-max': { gridAutoRows: 'max-content' },
  'auto-rows-fr': { gridAutoRows: 'minmax(0, 1fr)' },
  'auto-cols-min': { gridAutoColumns: 'min-content' },
  'auto-cols-max': { gridAutoColumns: 'max-content' },
  // Sizing keywords.
  'min-h-screen': { minHeight: '100vh' },
  'min-h-svh': { minHeight: '100svh' },
  'min-h-dvh': { minHeight: '100dvh' },
  'min-h-full': { minHeight: '100%' },
  'min-h-0': { minHeight: '0' },
  'min-w-0': { minWidth: '0' },
  'min-w-full': { minWidth: '100%' },
  // Typography.
  'text-center': { textAlign: 'center' },
  'text-left': { textAlign: 'left' },
  'text-right': { textAlign: 'right' },
  'text-justify': { textAlign: 'justify' },
  'text-balance': { textWrap: 'balance' },
  'text-nowrap': { textWrap: 'nowrap' },
  'text-wrap': { textWrap: 'wrap' },
  'wrap-break-word': { overflowWrap: 'break-word' },
  'wrap-normal': { overflowWrap: 'normal' },
  'wrap-anywhere': { overflowWrap: 'anywhere' },
  'break-words': { overflowWrap: 'break-word' },
  'break-all': { wordBreak: 'break-all' },
  'tabular-nums': { fontVariantNumeric: 'tabular-nums' },
  italic: { fontStyle: 'italic' },
  'not-italic': { fontStyle: 'normal' },
  uppercase: { textTransform: 'uppercase' },
  lowercase: { textTransform: 'lowercase' },
  capitalize: { textTransform: 'capitalize' },
  'normal-case': { textTransform: 'none' },
  'line-through': { textDecorationLine: 'line-through' },
  'no-underline': { textDecorationLine: 'none' },
  'whitespace-normal': { whiteSpace: 'normal' },
  'whitespace-pre': { whiteSpace: 'pre' },
  'whitespace-pre-line': { whiteSpace: 'pre-line' },
  'whitespace-pre-wrap': { whiteSpace: 'pre-wrap' },
  // Borders / object / vertical-align / misc.
  'border-dashed': { borderStyle: 'dashed' },
  'border-solid': { borderStyle: 'solid' },
  'border-dotted': { borderStyle: 'dotted' },
  'border-none': { borderStyle: 'none' },
  'object-cover': { objectFit: 'cover' },
  'object-contain': { objectFit: 'contain' },
  'object-fill': { objectFit: 'fill' },
  'object-none': { objectFit: 'none' },
  'align-middle': { verticalAlign: 'middle' },
  'align-top': { verticalAlign: 'top' },
  'align-bottom': { verticalAlign: 'bottom' },
  'align-baseline': { verticalAlign: 'baseline' },
  'pointer-events-auto': { pointerEvents: 'auto' },
  'touch-none': { touchAction: 'none' },
  'touch-auto': { touchAction: 'auto' },
  'forced-color-adjust-none': { forcedColorAdjust: 'none' },
  'forced-color-adjust-auto': { forcedColorAdjust: 'auto' },
  'shadow-none': { boxShadow: 'none' },
  'outline-hidden': { outlineStyle: 'none' },
  'will-change-auto': { willChange: 'auto' },
  'bg-clip-content': { backgroundClip: 'content-box' },
  'bg-clip-text': { backgroundClip: 'text' },
  'bg-blend-color': { backgroundBlendMode: 'color' },
}

/* CSS properties whose value is safe to negate for `-<util>` forms. */
const NEGATABLE_PROP = /^(margin|top|right|bottom|left|inset|outlineOffset)/

/** Resolve an inset/position value (`0`, `2`, `1/2`, `full`, `auto`, `[…]`, `(--v)`). */
function insetValue(value: string): string | undefined {
  if (value === 'auto') return 'auto'
  if (value === 'full') return '100%'
  if (value === 'px') return '1px'
  const frac = /^(\d+)\/(\d+)$/.exec(value)
  if (frac) return `calc(${frac[1]} / ${frac[2]} * 100%)`
  return spacing(value)
}

/** Resolve a border-radius value (`''`→md, `none`, `full`, scale, `(--v)`/`[…]`). */
function radiusValue(value: string): string | undefined {
  if (value === '') return 'var(--radius-md)'
  if (value === 'none') return '0'
  if (value === 'full') return 'calc(infinity * 1px)'
  if (RADIUS_SIZES.has(value)) return `var(--radius-${value})`
  return arbitrary(value)
}

const ROUNDED_SIDES: Record<string, string[]> = {
  t: ['borderTopLeftRadius', 'borderTopRightRadius'],
  b: ['borderBottomLeftRadius', 'borderBottomRightRadius'],
  l: ['borderTopLeftRadius', 'borderBottomLeftRadius'],
  r: ['borderTopRightRadius', 'borderBottomRightRadius'],
  tl: ['borderTopLeftRadius'],
  tr: ['borderTopRightRadius'],
  bl: ['borderBottomLeftRadius'],
  br: ['borderBottomRightRadius'],
}

const BORDER_SIDES: Record<string, { w: string; s: string }> = {
  t: { w: 'borderTopWidth', s: 'borderTopStyle' },
  r: { w: 'borderRightWidth', s: 'borderRightStyle' },
  b: { w: 'borderBottomWidth', s: 'borderBottomStyle' },
  l: { w: 'borderLeftWidth', s: 'borderLeftStyle' },
}

const SHADOW_SIZES = new Set([
  '2xs',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  'shine',
])
const CONTAINER_SIZES = new Set([
  '3xs',
  '2xs',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
  '7xl',
])

/** Tailwind v4 transform utilities (`translate`/`scale`/`rotate`) → the matching
 *  CSS property + `--tw-*` var, so multiple axes compose instead of clobbering. */
function parseTransform(util: string): StyleXStyle | null {
  const tr = /^(-?)translate-([xyz])-(.+)$/.exec(util)
  if (tr) {
    const base = insetValue(tr[3]!)
    if (base === undefined) return null
    const v = tr[1] === '-' && base !== '0' ? `calc(${base} * -1)` : base
    return {
      [`--tw-translate-${tr[2]}`]: v,
      translate:
        'var(--tw-translate-x, 0) var(--tw-translate-y, 0) var(--tw-translate-z, 0)',
    }
  }
  const sc = /^scale-(\d+|\[.+\]|\(.+\))$/.exec(util)
  if (sc) {
    const arb = arbitrary(sc[1]!)
    if (arb !== undefined) return { scale: arb }
    return /^\d+$/.test(sc[1]!) ? { scale: `${Number(sc[1]) / 100}` } : null
  }
  const ro = /^(-?)rotate-(\d+|\[.+\]|\(.+\))$/.exec(util)
  if (ro) {
    const arb = arbitrary(ro[2]!)
    const v = arb ?? (/^\d+$/.test(ro[2]!) ? `${ro[2]}deg` : null)
    return v === null ? null : { rotate: ro[1] === '-' ? `-${v}` : v }
  }
  return null
}

/**
 * Translate one same-element utility into a `StyleXStyle`, or return `null` if
 * it has no known mapping (caller records it as untranslated).
 */
export function translateUtility(util: string): StyleXStyle | null {
  if (util in KEYWORDS) return { ...KEYWORDS[util]! }

  // `@container` context utilities: `@container/name` / `@container-[size]`.
  if (util.startsWith('@container')) {
    const named = /^@container\/(.+)$/.exec(util)
    if (named) return { containerType: 'inline-size', containerName: named[1]! }
    const typed = /^@container-\[(.+)\]$/.exec(util)
    if (typed) return { containerType: typed[1]! }
    if (util === '@container') return { containerType: 'inline-size' }
  }

  // Arbitrary property: a custom prop (`[--color-disabled:var(--neutral-500)]`)
  // or any CSS declaration (`[transform:translateY(2px)]`, `[margin-bottom:calc(…)]`).
  // Tailwind's arbitrary-property syntax is the exact CSS declaration, so it maps
  // 1:1 to StyleX (custom props keep their `--name`; standard props camelCase).
  const arbProp = /^\[([^:[\]]+):(.+)\]$/.exec(util)
  if (arbProp) {
    const prop = arbProp[1]!
    const value = cssLiteral(arbProp[2]!)
    return { [prop.startsWith('--') ? prop : kebabToCamel(prop)]: value }
  }

  // Transforms (`translate-x-2`, `-translate-y-1/2`, `scale-95`) use Tailwind v4's
  // `translate`/`scale` properties + `--tw-*` vars so the axes compose (a later
  // `translate-y-*` doesn't clobber `translate-x-*`).
  const transform = parseTransform(util)
  if (transform) return transform

  // Negative utilities (`-mx-2`, `-ml-1`, `-top-2`, `-inset-1`): translate the
  // positive form and negate its value, restricted to the spacing-valued families
  // safe to negate (margins + insets).
  if (util.startsWith('-')) {
    const inner = translateUtility(util.slice(1))
    if (!inner) return null
    const out: StyleXStyle = {}
    for (const [k, v] of Object.entries(inner)) {
      if (!NEGATABLE_PROP.test(k) || typeof v !== 'string') return null
      out[k] = v === '0' ? '0' : `calc(${v} * -1)`
    }
    return out
  }

  const dash = util.indexOf('-')
  const prefix = dash === -1 ? util : util.slice(0, dash)
  const rest = dash === -1 ? '' : util.slice(dash + 1)

  switch (prefix) {
    case 'bg': {
      const c = color(rest)
      return c === undefined ? null : { backgroundColor: c }
    }
    case 'border': {
      // border-<n> width, border-<side>[-<n>], else color. (border styles like
      // `border-dashed` and the bare `border` are exact-match KEYWORDS above.)
      if (/^\d+$/.test(rest))
        return { borderStyle: 'solid', borderWidth: `${rest}px` }
      const side = /^([trbl])(?:-(\d+))?$/.exec(rest)
      if (side && BORDER_SIDES[side[1]!]) {
        const { w, s } = BORDER_SIDES[side[1]!]!
        return {
          [s]: 'solid',
          [w]: side[2] !== undefined ? `${side[2]}px` : '1px',
        }
      }
      const c = color(rest)
      return c === undefined ? null : { borderColor: c }
    }
    case 'text': {
      // `text-<size>` and `text-<size>/<leading>` (font-size + line-height).
      // Split the leading modifier off first — but only treat `/` as a leading
      // modifier when the head is a real text size; otherwise `/` is a color
      // opacity modifier (`text-primary/50`), handled by color() below.
      const slash = rest.indexOf('/')
      const head = slash === -1 ? rest : rest.slice(0, slash)
      if (TEXT_SIZES.has(head)) {
        return {
          fontSize: `var(--text-${head})`,
          lineHeight:
            slash === -1
              ? `var(--text-${head}--line-height)`
              : leading(rest.slice(slash + 1)),
        }
      }
      const arb = arbitrary(rest)
      if (arb !== undefined && /^-?[\d.]/.test(arb)) return { fontSize: arb }
      const c = color(rest)
      return c === undefined ? null : { color: c }
    }
    case 'rounded': {
      // Per-corner / per-side: `rounded-t-xl`, `rounded-b-(--card-radius)`, `rounded-tl-md`.
      // (`rounded-full` → `calc(infinity * 1px)`; `--radius-full` exists nowhere.)
      const side = /^(tl|tr|bl|br|[trbl])-(.+)$/.exec(rest)
      if (side && ROUNDED_SIDES[side[1]!]) {
        const val = radiusValue(side[2]!)
        if (val === undefined) return null
        const out: StyleXStyle = {}
        for (const p of ROUNDED_SIDES[side[1]!]!) out[p] = val
        return out
      }
      const val = radiusValue(rest)
      return val === undefined ? null : { borderRadius: val }
    }
    case 'font': {
      if (rest in FONT_WEIGHTS) return { fontWeight: FONT_WEIGHTS[rest]! }
      if (/^(sans|serif|mono|heading|display)$/.test(rest))
        return { fontFamily: `var(--font-${rest})` }
      const arb = arbitrary(rest)
      return arb === undefined ? null : { fontWeight: arb }
    }
    case 'leading':
      return { lineHeight: leading(rest) }
    case 'tracking': {
      const arb = arbitrary(rest)
      return { letterSpacing: arb ?? `var(--tracking-${rest})` }
    }
    case 'cursor':
      return CURSOR_VARS.has(rest)
        ? { cursor: `var(--cursor-${rest})` }
        : { cursor: rest }
    case 'opacity': {
      const arb = arbitrary(rest)
      if (arb !== undefined) return { opacity: arb }
      return /^\d+$/.test(rest) ? { opacity: Number(rest) / 100 } : null
    }
    case 'underline':
      if (rest.startsWith('offset-')) {
        const v = rest.slice('offset-'.length)
        const arb = arbitrary(v)
        if (arb !== undefined) return { textUnderlineOffset: arb }
        return /^\d+$/.test(v) ? { textUnderlineOffset: `${v}px` } : null
      }
      return null
    case 'transition': {
      const arb = arbitrary(rest)
      const props = arb !== undefined ? arb.replace(/,/g, ', ') : undefined
      return {
        transitionProperty: props ?? 'all',
        transitionTimingFunction:
          'var(--default-transition-timing-function, cubic-bezier(0.4, 0, 0.2, 1))',
        transitionDuration: 'var(--default-transition-duration, 150ms)',
      }
    }
    // Spacing & sizing. `p`/`m` emit the inline+block logical longhands (not the
    // `padding`/`margin` shorthand) so a later `px-*`/`p-0` overrides per-property
    // — StyleX merges per CSS property, mirroring tailwind-merge's shorthand logic.
    case 'p':
      return sizeDecl(['paddingInline', 'paddingBlock'], rest)
    case 'px':
      return sizeDecl(['paddingInline'], rest)
    case 'py':
      return sizeDecl(['paddingBlock'], rest)
    case 'pt':
      return sizeDecl(['paddingTop'], rest)
    case 'pr':
      return sizeDecl(['paddingRight'], rest)
    case 'pb':
      return sizeDecl(['paddingBottom'], rest)
    case 'pl':
      return sizeDecl(['paddingLeft'], rest)
    case 'ps':
      return sizeDecl(['paddingInlineStart'], rest)
    case 'pe':
      return sizeDecl(['paddingInlineEnd'], rest)
    case 'm':
      return sizeDecl(['marginInline', 'marginBlock'], rest)
    case 'mx':
      return sizeDecl(['marginInline'], rest)
    case 'my':
      return sizeDecl(['marginBlock'], rest)
    case 'mt':
      return sizeDecl(['marginTop'], rest)
    case 'mr':
      return sizeDecl(['marginRight'], rest)
    case 'mb':
      return sizeDecl(['marginBottom'], rest)
    case 'ml':
      return sizeDecl(['marginLeft'], rest)
    case 'ms':
      return sizeDecl(['marginInlineStart'], rest)
    case 'me':
      return sizeDecl(['marginInlineEnd'], rest)
    case 'gap':
      return rest.startsWith('x-')
        ? sizeDecl(['columnGap'], rest.slice(2))
        : rest.startsWith('y-')
          ? sizeDecl(['rowGap'], rest.slice(2))
          : sizeDecl(['gap'], rest)
    case 'h':
      return dimension('height', rest)
    case 'w':
      return dimension('width', rest)
    case 'size':
      return dimension2(['width', 'height'], rest)
    case 'min':
      return rest.startsWith('h-')
        ? dimension('minHeight', rest.slice(2))
        : rest.startsWith('w-')
          ? dimension('minWidth', rest.slice(2))
          : null
    case 'max':
      if (rest.startsWith('w-')) {
        const v = rest.slice(2)
        if (v === 'none') return { maxWidth: 'none' }
        // `max-w-sm` etc. resolve to Tailwind v4's container scale.
        if (CONTAINER_SIZES.has(v)) return { maxWidth: `var(--container-${v})` }
        return dimension('maxWidth', v)
      }
      return rest.startsWith('h-')
        ? dimension('maxHeight', rest.slice(2))
        : null
    // Position offsets (`top-0`, `right-2`, `inset-0`, `inset-x-0`). Negatives via
    // the `-` wrapper above; `inset` props are in NEGATABLE_PROP.
    case 'top':
      return decl('top', insetValue(rest))
    case 'right':
      return decl('right', insetValue(rest))
    case 'bottom':
      return decl('bottom', insetValue(rest))
    case 'left':
      return decl('left', insetValue(rest))
    case 'start':
      return decl('insetInlineStart', insetValue(rest))
    case 'end':
      return decl('insetInlineEnd', insetValue(rest))
    case 'inset':
      return rest.startsWith('x-')
        ? decl('insetInline', insetValue(rest.slice(2)))
        : rest.startsWith('y-')
          ? decl('insetBlock', insetValue(rest.slice(2)))
          : decl('inset', insetValue(rest))
    case 'z': {
      const arb = arbitrary(rest)
      if (arb !== undefined) return { zIndex: arb }
      if (rest === 'auto') return { zIndex: 'auto' }
      return /^\d+$/.test(rest) ? { zIndex: Number(rest) } : null
    }
    case 'shadow': {
      if (SHADOW_SIZES.has(rest)) return { boxShadow: `var(--shadow-${rest})` }
      const arb = arbitrary(rest)
      return arb === undefined ? null : { boxShadow: arb }
    }
    case 'ring': {
      // Approximate Tailwind's ring as a single box-shadow ring (no offset/compose).
      if (rest === '' || /^\d+$/.test(rest))
        return {
          boxShadow: `0 0 0 ${rest === '' ? 1 : rest}px var(--tw-ring-color, currentcolor)`,
        }
      const c = color(rest)
      return c === undefined ? null : { '--tw-ring-color': c }
    }
    case 'grid':
      if (rest.startsWith('cols-'))
        return gridTrack('gridTemplateColumns', rest.slice(5))
      if (rest.startsWith('rows-'))
        return gridTrack('gridTemplateRows', rest.slice(5))
      return null
    case 'col':
      if (rest.startsWith('start-'))
        return decl('gridColumnStart', lineValue(rest.slice(6)))
      if (rest.startsWith('end-'))
        return decl('gridColumnEnd', lineValue(rest.slice(4)))
      if (rest.startsWith('span-'))
        return spanValue('gridColumn', rest.slice(5))
      return null
    case 'row':
      if (rest.startsWith('start-'))
        return decl('gridRowStart', lineValue(rest.slice(6)))
      if (rest.startsWith('end-'))
        return decl('gridRowEnd', lineValue(rest.slice(4)))
      if (rest.startsWith('span-')) return spanValue('gridRow', rest.slice(5))
      return null
    case 'duration': {
      const arb = arbitrary(rest)
      if (arb !== undefined) return { transitionDuration: arb }
      return /^\d+$/.test(rest) ? { transitionDuration: `${rest}ms` } : null
    }
    case 'ease': {
      const arb = arbitrary(rest)
      return { transitionTimingFunction: arb ?? `var(--ease-${rest})` }
    }
    case 'aspect':
      if (rest === 'square') return { aspectRatio: '1 / 1' }
      if (rest === 'video') return { aspectRatio: '16 / 9' }
      if (rest === 'auto') return { aspectRatio: 'auto' }
      return decl('aspectRatio', arbitrary(rest)?.replace('/', ' / '))
    case 'scroll': {
      // scroll-mt-10 / scroll-pt-8 / scroll-my-1 → scroll-margin/padding longhands.
      const m = /^(m|p)([trbl]|[xy])?-(.+)$/.exec(rest)
      if (!m) return null
      const props = scrollProps(m[1]!, m[2])
      return props ? sizeDecl(props, m[3]!) : null
    }
    case 'backdrop':
      if (rest === 'blur') return { backdropFilter: 'blur(var(--blur))' }
      if (rest.startsWith('blur-')) {
        const v = rest.slice(5)
        const arb = arbitrary(v)
        return { backdropFilter: `blur(${arb ?? `var(--blur-${v})`})` }
      }
      return null
    case 'will': {
      const arb = arbitrary(rest.replace(/^change-/, ''))
      return arb === undefined ? null : { willChange: arb.replace(/,/g, ', ') }
    }
    case 'outline': {
      // `outline-hidden`/`outline-none` are KEYWORDS; here: widths, offsets, colors.
      if (/^\d+$/.test(rest))
        return { outlineStyle: 'solid', outlineWidth: `${rest}px` }
      if (rest.startsWith('offset-')) {
        const v = rest.slice(7)
        const arb = arbitrary(v)
        return decl(
          'outlineOffset',
          arb ?? (/^\d+$/.test(v) ? `${v}px` : undefined),
        )
      }
      const c = color(rest)
      return c === undefined ? null : { outlineColor: c }
    }
    case 'origin': {
      const arb = arbitrary(rest)
      return { transformOrigin: arb ?? rest.replace(/-/g, ' ') }
    }
    case 'transform': {
      if (rest === 'none') return { transform: 'none' }
      return decl('transform', arbitrary(rest))
    }
    default:
      return null
  }
}

/** A single-prop declaration, or `null` when the value didn't resolve. */
function decl(prop: string, value: string | undefined): StyleXStyle | null {
  return value === undefined ? null : { [prop]: value }
}

/** `grid-cols-7` → repeat(7, …); arbitrary `[1fr_auto]` → the literal track list. */
function gridTrack(prop: string, value: string): StyleXStyle | null {
  if (/^\d+$/.test(value)) return { [prop]: `repeat(${value}, minmax(0, 1fr))` }
  if (value === 'none') return { [prop]: 'none' }
  return decl(prop, arbitrary(value))
}

/** A grid line position (`2`, `auto`, `[…]`). */
function lineValue(value: string): string | undefined {
  if (value === 'auto') return 'auto'
  return /^-?\d+$/.test(value) ? value : arbitrary(value)
}

/** `col-span-2` → `span 2 / span 2`. */
function spanValue(prop: string, value: string): StyleXStyle | null {
  if (value === 'full') return { [prop]: '1 / -1' }
  return /^\d+$/.test(value)
    ? { [prop]: `span ${value} / span ${value}` }
    : null
}

const SCROLL_SIDES: Record<string, string> = {
  t: 'Top',
  r: 'Right',
  b: 'Bottom',
  l: 'Left',
  x: 'Inline',
  y: 'Block',
}
/** scroll-margin/padding longhand prop names for a side suffix. */
function scrollProps(kind: string, side: string | undefined): string[] | null {
  const base = kind === 'm' ? 'scrollMargin' : 'scrollPadding'
  if (!side) return [base]
  const s = SCROLL_SIDES[side]
  if (!s) return null
  return s === 'Inline' || s === 'Block' ? [`${base}${s}`] : [`${base}${s}`]
}

function sizeDecl(props: string[], value: string): StyleXStyle | null {
  const v = spacing(value)
  if (v === undefined) return null
  const out: StyleXStyle = {}
  for (const p of props) out[p] = v
  return out
}

const DIM_KEYWORDS: Record<string, string> = {
  full: '100%',
  auto: 'auto',
  fit: 'fit-content',
  min: 'min-content',
  max: 'max-content',
  px: '1px',
}
function dimension(prop: string, value: string): StyleXStyle | null {
  if (value in DIM_KEYWORDS) return { [prop]: DIM_KEYWORDS[value]! }
  const v = spacing(value)
  return v === undefined ? null : { [prop]: v }
}
function dimension2(props: string[], value: string): StyleXStyle | null {
  const single = dimension(props[0]!, value)
  if (!single) return null
  const v = single[props[0]!]!
  const out: StyleXStyle = {}
  for (const p of props) out[p] = v
  return out
}

/* ------------------------------ merge + entry ---------------------------- */

/**
 * Set `prop`'s value under a (possibly empty, possibly nested) condition path.
 * Empty path = a plain value (last-wins, preserving any existing conditions'
 * default). A multi-element path nests condition maps — `disabled:selected:x`
 * becomes `{ '[data-disabled]': { '[data-selected]': x } }`, which StyleX
 * compiles to a `.cls[data-disabled][data-selected]` rule (AND semantics).
 */
function mergeInto(
  style: StyleXStyle,
  prop: string,
  value: string | number,
  conditions: string[],
): void {
  if (conditions.length === 0) {
    const existing = style[prop]
    if (isConditions(existing)) existing.default = value
    else style[prop] = value
    return
  }
  let node = ensureConditions(style, prop)
  for (let i = 0; i < conditions.length - 1; i++) {
    const key = conditions[i]!
    const child = node[key]
    if (isConditions(child)) {
      node = child
    } else {
      const next: StyleXConditions = {}
      if (child !== undefined) next.default = child
      node[key] = next
      node = next
    }
  }
  node[conditions[conditions.length - 1]!] = value
}

/** Coerce `style[prop]` into a conditions object, preserving a scalar as `default`. */
function ensureConditions(style: StyleXStyle, prop: string): StyleXConditions {
  const existing = style[prop]
  if (isConditions(existing)) return existing
  const map: StyleXConditions = {}
  if (existing !== undefined) map.default = existing
  style[prop] = map
  return map
}

function isConditions(v: StyleXValue | undefined): v is StyleXConditions {
  return typeof v === 'object' && v !== null
}

/** At-rules (`@media`/`@supports`/`@container`) nest OUTSIDE pseudo/attr
 *  conditions in StyleX, so move them to the front of the path. */
function orderConditions(conditions: string[]): string[] {
  if (conditions.length < 2) return conditions
  const at = conditions.filter((c) => c.startsWith('@'))
  return at.length === 0
    ? conditions
    : [...at, ...conditions.filter((c) => !c.startsWith('@'))]
}

/**
 * Translate a Tailwind class string (one IR leaf) into a StyleX style object,
 * plus the lists of untranslated tokens and group/peer markers.
 */
export function translateClasses(input: string | undefined): TranslateResult {
  const style: StyleXStyle = {}
  const untranslated: string[] = []
  const markers: string[] = []
  if (!input) return { style, untranslated, markers }

  for (const token of input.split(/\s+/).filter(Boolean)) {
    // Marker tokens (`group`, `group/button`, `peer`, `peer/x`) emit no CSS.
    if (/^(group|peer)(\/.+)?$/.test(token)) {
      markers.push(token)
      continue
    }

    const { prefixes, utility } = parseToken(token)

    // Classify prefixes — any descendant/unknown prefix disqualifies the token.
    const conditions: string[] = []
    let blocked = false
    for (const p of prefixes) {
      const c = classifyPrefix(p)
      if (c.kind === 'condition') conditions.push(c.key)
      else {
        blocked = true
        break
      }
    }
    if (blocked) {
      untranslated.push(token)
      continue
    }

    // Strip a Tailwind `!important` marker (`bg-disabled!` / `!bg-disabled`).
    // StyleX has no `!important`; its atomic ordering handles precedence, so we
    // translate the value and accept the (minor, inherent) loss of importance.
    const bare = utility.replace(/^!|!$/g, '')

    const decl = translateUtility(bare)
    if (decl === null) {
      untranslated.push(token)
      continue
    }

    // Apply under the (possibly stacked) condition path. `@media`/`@supports`/
    // `@container` conditions sort outermost so they wrap the pseudo/attr ones,
    // matching how Tailwind nests them.
    const ordered = orderConditions(conditions)
    for (const [prop, value] of Object.entries(decl)) {
      mergeInto(style, prop, value as string | number, ordered)
    }
  }

  return { style, untranslated, markers }
}
