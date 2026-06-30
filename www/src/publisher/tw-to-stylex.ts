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

/** A StyleX value: a literal, or a condition map keyed by `default`/`:hover`/`[data-…]`/`@media`. */
export type StyleXValue = string | number | StyleXConditions
export interface StyleXConditions {
  default?: string | number
  [condition: string]: string | number | undefined
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
  hover: '[data-hovered]',
  focus: '[data-focused]',
  'focus-visible': '[data-focus-visible]',
  'focus-within': '[data-focus-within]',
  // `active:` resolves to `[data-active]` on RAC roots, which RAC never sets — so
  // it no-ops in BOTH backends (RAC uses `pressed:`/`[data-pressed]` for press).
  active: '[data-active]',
  disabled: '[data-disabled]',
  // RAC render-state attributes that have no native-pseudo alias in the plugin.
  pressed: '[data-pressed]',
  hovered: '[data-hovered]',
  focused: '[data-focused]',
  selected: '[data-selected]',
  pending: '[data-pending]',
  current: '[data-current]',
}

// Prefixes that style some OTHER element — no same-element StyleX form.
const DESCENDANT_PREFIX_RE =
  /^(\*\*|\*|group(\/|-|$)|peer(\/|-|$)|has-|in-|not-|\[&)/

type Condition =
  | { kind: 'condition'; key: string }
  | { kind: 'descendant' }
  | { kind: 'unknown' }

function classifyPrefix(prefix: string): Condition {
  if (DESCENDANT_PREFIX_RE.test(prefix)) return { kind: 'descendant' }
  if (prefix in STATE_CONDITIONS)
    return { kind: 'condition', key: STATE_CONDITIONS[prefix]! }
  // `data-[key=value]:` / `data-[key]:` — same-element attribute selectors.
  const dataArb = /^data-\[(.+)\]$/.exec(prefix)
  if (dataArb) {
    const inner = dataArb[1]!
    const eq = inner.indexOf('=')
    const key = eq === -1 ? inner : inner.slice(0, eq)
    const val =
      eq === -1 ? undefined : inner.slice(eq + 1).replace(/^["']|["']$/g, '')
    return {
      kind: 'condition',
      key: val === undefined ? `[data-${key}]` : `[data-${key}="${val}"]`,
    }
  }
  // `data-foo:` shorthand → `[data-foo]` (dotUI custom variants on the element).
  const dataShort = /^data-([a-z][a-z0-9-]*)$/.exec(prefix)
  if (dataShort) return { kind: 'condition', key: `[data-${dataShort[1]}]` }
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

/** Resolve a Tailwind arbitrary value `[v]` or var shorthand `(--v)`; else undefined. */
function arbitrary(value: string): string | undefined {
  const brack = /^\[(.+)\]$/.exec(value)
  if (brack) return brack[1]!.replace(/_/g, ' ')
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
  'shrink-0': { flexShrink: 0 },
  'grow-0': { flexGrow: 0 },
  'items-center': { alignItems: 'center' },
  'items-start': { alignItems: 'flex-start' },
  'justify-center': { justifyContent: 'center' },
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
}

/**
 * Translate one same-element utility into a `StyleXStyle`, or return `null` if
 * it has no known mapping (caller records it as untranslated).
 */
export function translateUtility(util: string): StyleXStyle | null {
  if (util in KEYWORDS) return { ...KEYWORDS[util]! }

  // Arbitrary property: a custom prop (`[--color-disabled:var(--neutral-500)]`)
  // or any CSS declaration (`[transform:translateY(2px)]`, `[margin-bottom:calc(…)]`).
  // Tailwind's arbitrary-property syntax is the exact CSS declaration, so it maps
  // 1:1 to StyleX (custom props keep their `--name`; standard props camelCase).
  const arbProp = /^\[([^:[\]]+):(.+)\]$/.exec(util)
  if (arbProp) {
    const prop = arbProp[1]!
    const value = arbProp[2]!.replace(/_/g, ' ')
    return { [prop.startsWith('--') ? prop : kebabToCamel(prop)]: value }
  }

  // Negative utilities (`-mx-2`, `-ml-1`): translate the positive form and negate
  // its value. Restricted to margins — the only negatable family dotUI uses that
  // the table covers (negative insets/translate are uncovered, not mis-negated).
  if (util.startsWith('-')) {
    const inner = translateUtility(util.slice(1))
    if (!inner) return null
    const out: StyleXStyle = {}
    for (const [k, v] of Object.entries(inner)) {
      if (!k.startsWith('margin') || typeof v !== 'string') return null
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
      if (rest === '') return { borderRadius: 'var(--radius-md)' }
      if (rest === 'none') return { borderRadius: '0' }
      // `--radius-full` exists in neither Tailwind's theme nor dotUI's; Tailwind's
      // own `rounded-full` emits this literal, so parity needs the literal too.
      if (rest === 'full') return { borderRadius: 'calc(infinity * 1px)' }
      if (RADIUS_SIZES.has(rest))
        return { borderRadius: `var(--radius-${rest})` }
      const arb = arbitrary(rest)
      return arb === undefined ? null : { borderRadius: arb }
    }
    case 'font': {
      if (rest in FONT_WEIGHTS) return { fontWeight: FONT_WEIGHTS[rest]! }
      const arb = arbitrary(rest)
      return arb === undefined ? null : { fontWeight: arb }
    }
    case 'leading':
      return { lineHeight: leading(rest) }
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
      return rest.startsWith('h-')
        ? dimension('maxHeight', rest.slice(2))
        : rest.startsWith('w-')
          ? dimension('maxWidth', rest.slice(2))
          : null
    default:
      return null
  }
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

function mergeInto(
  style: StyleXStyle,
  prop: string,
  value: string | number,
  condition: string | undefined,
): void {
  if (condition === undefined) {
    // Plain value: last-wins, but preserve any existing conditions' default.
    const existing = style[prop]
    if (isConditions(existing)) existing.default = value
    else style[prop] = value
    return
  }
  const existing = style[prop]
  if (isConditions(existing)) {
    existing[condition] = value
  } else {
    const map: StyleXConditions = { [condition]: value }
    if (existing !== undefined) map.default = existing as string | number
    style[prop] = map
  }
}

function isConditions(v: StyleXValue | undefined): v is StyleXConditions {
  return typeof v === 'object' && v !== null
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

    const decl = translateUtility(utility)
    if (decl === null) {
      untranslated.push(token)
      continue
    }

    // Single same-element condition is applied directly; nested conditions
    // (2+ stacked states) are left for the parity step — flag them.
    if (conditions.length > 1) {
      untranslated.push(token)
      continue
    }
    const condition = conditions[0]
    for (const [prop, value] of Object.entries(decl)) {
      mergeInto(style, prop, value as string | number, condition)
    }
  }

  return { style, untranslated, markers }
}
