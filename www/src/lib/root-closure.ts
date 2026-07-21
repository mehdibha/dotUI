/**
 * The "root closure" is the set of custom-property declarations the document
 * authors at `:root` (light) and `.dark` — the token closure scoped theming
 * clones onto a subtree so every var recomputes from the scope's own primitives
 * (see `DesignSystemProvider`'s scoped mode in `@/lib/styles`).
 *
 * Two harvesters produce it from the same compiled stylesheet:
 *   - the client walks the live CSSOM (`harvestRootClosure` in `@/lib/styles`);
 *   - the server parses the compiled CSS text with `parseRootClosure` below —
 *     wired up by the `dotui-root-closure` plugin in vite.config.ts, which swaps
 *     `./root-closure-data` for the parsed closure in server environments so
 *     scoped themes render during SSR/prerender instead of flashing in after
 *     hydration.
 *
 * Both apply the same shape rules, shared here: which selectors count as
 * root/dark, and which properties are excluded from the harvest.
 */

import { DEFAULT_SEMANTICS } from '@/registry/theme'

export interface RootClosure {
  light: string
  dark: string
}

// Simple selectors whose declarations make up the document's theme closure. `.dark` is the
// palette's dark override (it targets `<html>`, the same element as `:root`).
export const ROOT_SELECTOR_TOKENS = new Set([
  ':root',
  ':host',
  'html',
  ':where(:root)',
])
export const DARK_SELECTOR_TOKENS = new Set([
  '.dark',
  ':root.dark',
  'html.dark',
  ':where(.dark)',
])

/** A grouped selector (`:root, :host`) counts if any of its simple parts is in `tokens`. */
export function selectorIn(selectorText: string, tokens: Set<string>): boolean {
  return selectorText.split(',').some((part) => tokens.has(part.trim()))
}

// The semantic vocabulary's exact prop names. Excluded from the harvest by KEY, not by the
// `--color-` prefix: component surface vars share the prefix (`--color-area-radius`,
// `--color-swatch-picker-item-radius`) and must be harvested like any other token, or they
// stay frozen at `:root` values inside the scope.
const SEMANTIC_COLOR_PROPS = new Set(
  Object.keys(DEFAULT_SEMANTICS).map((name) => `--${name}`),
)

/**
 * Excluded from the closure: non-custom props; `--radius-factor` (rides inline
 * on the scope element so the cloned radius scale recomputes there); and the
 * semantic vocabulary (emitted from `DEFAULT_SEMANTICS` instead — it's the
 * typed source of truth, and its targets may be authored as `color-mix()`,
 * whose CSSOM read-back is unreliable).
 */
export function isHarvestedProp(prop: string): boolean {
  return (
    prop.startsWith('--') &&
    prop !== '--radius-factor' &&
    !SEMANTIC_COLOR_PROPS.has(prop)
  )
}

/** Serialize a harvested declaration map to the closure's CSS-block text. */
export function closureText(decls: Map<string, string>): string {
  return [...decls].map(([prop, value]) => `\t${prop}: ${value};`).join('\n')
}

/**
 * Harvest the root closure from raw compiled CSS text — the server-side twin of
 * the client's CSSOM walk, applying the same rules: collect the top-level
 * declarations of any `:root`/`.dark` style rule, descending grouping at-rules
 * (`@layer`, `@media`) unconditionally like the CSSOM walk does. A hand-rolled
 * single pass (comment- and string-aware) is enough here: the input is
 * machine-generated Tailwind output, and the client harvest stays the
 * authority at runtime.
 */
export function parseRootClosure(css: string): RootClosure {
  const light = new Map<string, string>()
  const dark = new Map<string, string>()
  const n = css.length
  let i = 0

  const skipComment = (): void => {
    i += 2
    while (i < n && !(css[i] === '*' && css[i + 1] === '/')) i++
    i += 2
  }
  const readString = (): string => {
    const start = i
    const quote = css[i]
    i++
    while (i < n && css[i] !== quote) i += css[i] === '\\' ? 2 : 1
    i++
    return css.slice(start, i)
  }
  const collect = (decl: string, into: Map<string, string>): void => {
    const colon = decl.indexOf(':')
    if (colon === -1) return
    const prop = decl.slice(0, colon).trim()
    if (!isHarvestedProp(prop)) return
    into.set(prop, decl.slice(colon + 1).trim())
  }

  // Parse one rule body (or, at top level, the whole sheet). `into` is set
  // inside a `:root`/`.dark` style rule — its own declarations are collected;
  // nested rules never are (matching the CSSOM walk, where a nested rule is a
  // separate CSSStyleRule whose `&`-selector isn't in the token sets).
  const parseBody = (into: Map<string, string> | null): void => {
    let buf = ''
    while (i < n) {
      const ch = css[i]
      if (ch === '/' && css[i + 1] === '*') {
        skipComment()
      } else if (ch === '"' || ch === "'") {
        buf += readString()
      } else if (ch === ';') {
        if (into) collect(buf, into)
        buf = ''
        i++
      } else if (ch === '}') {
        if (into) collect(buf, into)
        i++
        return
      } else if (ch === '{') {
        const prelude = buf.trim()
        buf = ''
        i++
        let child: Map<string, string> | null = null
        if (!prelude.startsWith('@')) {
          if (selectorIn(prelude, ROOT_SELECTOR_TOKENS)) child = light
          else if (selectorIn(prelude, DARK_SELECTOR_TOKENS)) child = dark
        }
        parseBody(child)
      } else {
        buf += ch
        i++
      }
    }
  }

  parseBody(null)
  return { light: closureText(light), dark: closureText(dark) }
}
