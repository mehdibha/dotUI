/**
 * Descendant / at-a-distance → scoped companion CSS.
 *
 * StyleX forbids styling other elements, so the tokens the translator returns in
 * `untranslated` (`**:[svg]:size-4`, `has-data-icon-end:pr-1.5`,
 * `pending:**:data-[slot=spinner]:text-fg-muted`, `[&_svg]:…`, sibling `~`) have
 * no `stylex.create` form. Rather than leave them unrendered, we emit them as a
 * small **scoped CSS** block keyed by a generated scope class the emitter also
 * puts on the element. The component then renders identically under StyleX
 * (atomic classes for same-element styles + this companion sheet for the rest) —
 * the documented escape hatch, and consistent with Astryx shipping prebuilt CSS.
 *
 * Each token becomes `.<scope><scope-conditions><combinator><descendant> { … }`:
 *   - state/`data-[…]` prefixes BEFORE a `**`/`*` marker qualify the scope element;
 *   - `**` → descendant (` `), `*` → child (` > `), `[&_x]`/`[&>x]`/`[&~x]` explicit;
 *   - `[svg]` element filters and prefixes AFTER the marker qualify the descendant;
 *   - `has-*` → `:has(…)` on the scope; `~`/sibling → sibling combinators.
 * The leaf utility is translated by the same `translateUtility` the StyleX path
 * uses, so values stay at parity. Pure data transform — request-time safe.
 */

import { translateUtility } from './tw-to-stylex'
import type { StyleXStyle } from './tw-to-stylex'

export interface DescendantCssResult {
  /** The generated CSS (empty when nothing was handled). */
  css: string
  /** Tokens rendered into `css`. */
  handled: string[]
  /** Tokens still not expressible (kept on the PARITY-TODO list). */
  unhandled: string[]
}

/* --------------------------------- helpers -------------------------------- */

function kebab(prop: string): string {
  return prop.startsWith('--')
    ? prop
    : prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
}

function declsOf(style: StyleXStyle): string | null {
  const parts: string[] = []
  for (const [prop, value] of Object.entries(style)) {
    // Descendant leaves are single utilities → flat values only.
    if (typeof value === 'object') return null
    parts.push(`${kebab(prop)}: ${value};`)
  }
  return parts.length > 0 ? parts.join(' ') : null
}

/** Split a token into its `:`-separated prefixes + final utility (bracket-aware). */
function parts(token: string): { prefixes: string[]; utility: string } {
  const out: string[] = []
  let depth = 0
  let start = 0
  for (let i = 0; i < token.length; i++) {
    const ch = token[i]
    if (ch === '[' || ch === '(') depth++
    else if (ch === ']' || ch === ')') depth--
    else if (ch === ':' && depth === 0) {
      out.push(token.slice(start, i))
      start = i + 1
    }
  }
  out.push(token.slice(start))
  return { prefixes: out.slice(0, -1), utility: out[out.length - 1] ?? '' }
}

// Same-element data-attribute condition for a prefix (mirrors the translator).
function attrFor(prefix: string): string | null {
  const named: Record<string, string> = {
    hover: '[data-hovered]',
    focus: '[data-focused]',
    focused: '[data-focused]',
    'focus-visible': '[data-focus-visible]',
    'focus-within': '[data-focus-within]',
    active: '[data-active]',
    pressed: '[data-pressed]',
    disabled: '[data-disabled]',
    selected: '[data-selected]',
    pending: '[data-pending]',
    current: '[data-current]',
    entering: '[data-entering]',
    exiting: '[data-exiting]',
    expanded: '[data-expanded]',
    open: '[data-open]',
    indeterminate: '[data-indeterminate]',
    invalid: '[data-invalid]',
    'outside-month': '[data-outside-month]',
  }
  if (prefix in named) return named[prefix]!
  const arb = /^data-\[(.+)\]$/.exec(prefix)
  if (arb) {
    const inner = arb[1]!
    const m = /^([a-z0-9-]+)([*^$~|]?=)(.+)$/.exec(inner)
    return m
      ? `[data-${m[1]}${m[2]}"${m[3]!.replace(/^["']|["']$/g, '')}"]`
      : `[data-${inner}]`
  }
  const short = /^data-([a-z][a-z0-9-]*)$/.exec(prefix)
  return short ? `[data-${short[1]}]` : null
}

interface Parsed {
  ancestor: string // prepended ancestor/sibling selector (`.group\/x[data-y] `)
  scope: string // suffixes on the scope element (`[data-pending]`, `:has(…)`)
  descendant: string // combinator + descendant selector (`  svg`, ` > svg`)
}

/** `group-<cond>[/name]` / `peer-<cond>[/name]` → the marker's ancestor/sibling selector. */
function markerSelector(marker: string, inner: string): string | null {
  let name = ''
  const slash = inner.lastIndexOf('/')
  if (slash !== -1 && !inner.slice(slash).includes(']')) {
    name = inner.slice(slash + 1)
    inner = inner.slice(0, slash)
  }
  const cond = attrFor(inner)
  if (!cond) return null
  const sel = `.${marker}${name ? `\\/${name}` : ''}${cond}`
  return marker === 'peer' ? `${sel} ~ ` : `${sel} `
}

/** Build the ancestor/scope/descendant selector for a token, or null if unsupported. */
function selectorFor(prefixes: string[]): Parsed | null {
  let ancestor = ''
  let scope = ''
  let descendant = ''
  let inDescendant = false

  for (const p of prefixes) {
    // Descendant / child markers.
    if (p === '**') {
      descendant += ' '
      inDescendant = true
      continue
    }
    if (p === '*') {
      descendant += ' > '
      inDescendant = true
      continue
    }
    // Arbitrary `[&_x]` / `[&>x]` / `[&~x]` selectors.
    const amp = /^\[&([ _>~+])(.+)\]$/.exec(p)
    if (amp) {
      const comb = amp[1] === '_' ? ' ' : ` ${amp[1]} `
      descendant += comb + amp[2]
      inDescendant = true
      continue
    }
    // `has-*` → `:has(…)` on the scope (not a descendant step).
    const hasArb = /^has-\[(.+)\]$/.exec(p)
    if (hasArb) {
      scope += `:has(${hasArb[1]!.replace(/_/g, ' ')})`
      continue
    }
    const hasData = /^has-data-([a-z][a-z0-9-]*)$/.exec(p)
    if (hasData) {
      scope += `:has([data-${hasData[1]}])`
      continue
    }
    // An element filter inside a descendant: `[svg]`, or element + attribute
    // selector `[button[slot=remove]]` → `button[slot="remove"]`.
    const tag = /^\[([a-z][a-z0-9]*(?:\[[^\]]*\])*)\]$/.exec(p)
    if (tag) {
      if (!inDescendant) return null
      descendant += tag[1]!.replace(/\[([a-z-]+)=([^\]"']+)\]/g, '[$1="$2"]')
      continue
    }
    // Native structural pseudo-classes (`first`, `last`, …) on scope or descendant.
    const pseudo: Record<string, string> = {
      first: ':first-child',
      last: ':last-child',
      only: ':only-child',
      empty: ':empty',
    }
    if (p in pseudo) {
      if (inDescendant) descendant += pseudo[p]!
      else scope += pseudo[p]!
      continue
    }
    // `not-*` → `:not(<inner>)` filter (inner is a same-element condition).
    const not = /^not-(.+)$/.exec(p)
    if (not) {
      const inner = attrFor(not[1]!)
      // `not-in-*` / `not-with-*` (ancestor / custom-plugin) → drop the filter
      // (a conservative widening, not a wrong selector).
      const target = inDescendant ? 'descendant' : 'scope'
      const frag = inner ? `:not(${inner})` : ''
      if (target === 'scope') scope += frag
      else descendant += frag
      continue
    }
    // A same-element state / data-attribute condition.
    const attr = attrFor(p)
    if (attr) {
      if (inDescendant) descendant += attr
      else scope += attr
      continue
    }
    // Ancestor markers: `group-<cond>[/name]`, `peer-<cond>[/name]` → the marked
    // parent/sibling prepended; `in-<data|[sel]>` → any matching ancestor.
    const grp = /^(group|peer)-(.+)$/.exec(p)
    if (grp) {
      const sel = markerSelector(grp[1]!, grp[2]!)
      if (!sel) return null
      ancestor = sel + ancestor
      continue
    }
    const inV = /^in-(.+)$/.exec(p)
    if (inV) {
      const data = /^data-([a-z][a-z0-9-]*)$/.exec(inV[1]!)
      if (data) {
        ancestor = `[data-${data[1]}] ` + ancestor
        continue
      }
      return null // arbitrary `in-[…]` selectors are too varied to render safely
    }
    // Custom-plugin (`with-*`) and anything else has no scoped-CSS form here —
    // bail so the token stays on PARITY-TODO.
    return null
  }

  if (ancestor === '' && !inDescendant && scope === '') return null
  return { ancestor, scope, descendant }
}

/* ---------------------------------- entry --------------------------------- */

/**
 * Emit scoped companion CSS for a component's untranslated descendant tokens.
 * `scope` is the class the emitter also applies to the element.
 */
export function emitDescendantCss(
  scope: string,
  tokens: readonly string[],
): DescendantCssResult {
  const handled: string[] = []
  const unhandled: string[] = []
  const rules: string[] = []

  for (const token of tokens) {
    const { prefixes, utility } = parts(token)
    const sel = selectorFor(prefixes)
    if (!sel) {
      unhandled.push(token)
      continue
    }
    // The leaf may itself carry an `!important` marker; strip it (see translator).
    const style = translateUtility(utility.replace(/^!|!$/g, ''))
    const decls = style && declsOf(style)
    if (!decls) {
      unhandled.push(token)
      continue
    }
    rules.push(
      `${sel.ancestor}.${scope}${sel.scope}${sel.descendant} { ${decls} }`,
    )
    handled.push(token)
  }

  return { css: rules.join('\n'), handled, unhandled }
}
