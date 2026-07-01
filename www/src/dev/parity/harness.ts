/**
 * Dev-only: build the Button parity matrix. For each variant it resolves the
 * exact Tailwind class string the component ships (base + variant + size, from
 * the publisher's own flatten) and — from that SAME string — the StyleX
 * translation's resolved CSS. Rendering a raw button with the Tailwind classes
 * next to one carrying the StyleX-derived class (same theme, same DOM, same
 * data-attributes) is a faithful side-by-side of the two backends. Only used by
 * `/dev/parity`.
 */

import { publishable } from '@/registry/__generated__/publishables/button'
import type { RegistryItem } from '@/registry/types'
import { emitDescendantCss } from '@/publisher/descendant-css'
import { flatten } from '@/publisher/flatten'
import { isPassthroughToken, translateClasses } from '@/publisher/tw-to-stylex'
import type { StylesConfig } from '@/publisher/types'

import { styleToCss } from './emit-css'

/** Scope class the companion descendant CSS keys off (mirrors the emitter). */
export const SCOPE = 'dotui-button'

type ClassVal = string | string[] | null | undefined | false

function join(v: ClassVal): string {
  if (!v) return ''
  return Array.isArray(v) ? v.filter(Boolean).join(' ') : v
}

const flat = flatten({
  stylesConfig: publishable.stylesConfig as unknown as StylesConfig,
  meta: publishable.meta as unknown as RegistryItem,
  density: 'default',
  paramSelections: {},
})

function twClassFor(variant: string, size: string): string {
  const v = flat.variants as
    | Record<string, Record<string, ClassVal>>
    | undefined
  return [join(flat.base), join(v?.variant?.[variant]), join(v?.size?.[size])]
    .filter(Boolean)
    .join(' ')
}

export interface Cell {
  variant: string
  tw: string
  sxClass: string
  /** dotUI composite classes the emitter re-attaches verbatim (focus-ring, …). */
  passthrough: string
  /** Genuine descendant tokens StyleX can't express (affect children only). */
  untranslated: string[]
}

export interface Matrix {
  cells: Cell[]
  css: string
}

export function buildButtonMatrix(variants: string[], size = 'md'): Matrix {
  const cells: Cell[] = []
  const cssParts: string[] = []
  for (const variant of variants) {
    const tw = twClassFor(variant, size)
    const { style, untranslated } = translateClasses(tw)
    const sxClass = `sx-${variant}-${size}`
    cssParts.push(styleToCss(sxClass, style))
    // The emitter re-attaches dotUI composite utilities as literal classNames
    // (they resolve via the shipped base.css) — mirror that so the proxy matches.
    const passthrough = untranslated.filter(isPassthroughToken).join(' ')
    const rest = untranslated.filter((t) => !isPassthroughToken(t))
    // Descendant styling (`**:[svg]`, `has-data-icon-*`) renders via the emitter's
    // scoped companion CSS; the sx proxy carries the same SCOPE class + that CSS.
    const { css: descCss } = emitDescendantCss(SCOPE, rest)
    if (descCss) cssParts.push(descCss)
    cells.push({ variant, tw, sxClass, passthrough, untranslated: rest })
  }
  // The companion CSS is identical across variants (all in base); emit it once.
  return { cells, css: [...new Set(cssParts)].join('\n') }
}
