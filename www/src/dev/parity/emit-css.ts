/**
 * Dev-only: serialize a StyleX style object (the translator's output) into the
 * real CSS it resolves to. This lets the parity preview render the StyleX export
 * WITHOUT the StyleX compiler — the resolved CSS is byte-for-byte what StyleX
 * would emit as atomic rules, so a raw element carrying this class is a faithful
 * stand-in for the StyleX component. Used only by `/dev/parity`; not shipped.
 */

import type { StyleXStyle, StyleXValue } from '@/publisher/tw-to-stylex'

/** camelCase → kebab-case (custom `--props` pass through). */
function kebab(prop: string): string {
  return prop.startsWith('--')
    ? prop
    : prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
}

/**
 * Emit CSS rules for `style` scoped to `.${className}`. Nested conditions become
 * appended selectors (`[data-hovered]`, `:disabled`) or wrapping at-rules
 * (`@media …`), mirroring StyleX's own compilation.
 */
export function styleToCss(className: string, style: StyleXStyle): string {
  // key = `${atRule}|||${selectorSuffix}` → declaration list
  const rules = new Map<string, string[]>()

  const add = (
    atRule: string,
    sel: string,
    prop: string,
    value: string | number,
  ) => {
    const key = `${atRule}|||${sel}`
    const list = rules.get(key) ?? []
    list.push(`${kebab(prop)}: ${value};`)
    rules.set(key, list)
  }

  const walk = (
    prop: string,
    value: StyleXValue,
    atRule: string,
    sel: string,
  ): void => {
    if (typeof value !== 'object' || value === null) {
      add(atRule, sel, prop, value)
      return
    }
    for (const [cond, v] of Object.entries(value)) {
      if (v === undefined) continue
      if (cond === 'default') walk(prop, v, atRule, sel)
      else if (cond.startsWith('@')) walk(prop, v, cond, sel)
      else walk(prop, v, atRule, sel + cond)
    }
  }

  for (const [prop, value] of Object.entries(style)) walk(prop, value, '', '')

  const out: string[] = []
  for (const [key, decls] of rules) {
    const [atRule, sel] = key.split('|||')
    const rule = `.${className}${sel} { ${decls.join(' ')} }`
    out.push(atRule ? `${atRule} { ${rule} }` : rule)
  }
  return out.join('\n')
}
