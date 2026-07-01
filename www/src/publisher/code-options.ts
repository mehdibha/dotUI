/**
 * `CodeOptions` — the user-configurable STYLE of the exported code.
 *
 * The design-system axes (colors, density, per-component styles…) decide what
 * the components LOOK like. `codeOptions` is the second customization layer: it
 * decides how the exported source READS, so it lands in the user's codebase
 * looking like the user wrote it, not like we generated it.
 *
 * Scope is deliberately limited to choices a code FORMATTER won't undo and that
 * the shadcn CLI doesn't already handle. Pure formatting (semicolons, quotes,
 * indentation, width, sorting…) is the consumer's Prettier/Biome job; the
 * `"use client"` directive is managed by the CLI's `rsc` flag. What's left:
 *
 *   - serialize-shape — how the resolved `tv(...)` config literal is rendered
 *     (`flattenClassArrays`): grouped arrays (one concern per line) vs. a single
 *     class string per slot/variant. A formatter reflows, but never converts
 *     `['a', 'b']` ↔ `'a b'`.
 *   - section separators — whether the file is divided into sections with
 *     comment rules (`applySectionComments`).
 *   - style engine — which styling solution the exported component uses:
 *     Tailwind utility classes via `tv(...)` (the canonical source) or Facebook
 *     StyleX style objects via `stylex.create(...)`. Both consume dotUI's CSS
 *     custom-property theme, so they're visually identical; the choice only
 *     changes which tool the user's codebase pulls in. The actual StyleX
 *     emission lives in the publisher (`emit-stylex.ts`), not here — this file
 *     only carries the user's *selection* (it must stay import-free; see below).
 *
 * Pure JS, no external imports — safe to import from anywhere: the request-time
 * route bundle, the `/create` client bundle, AND the "Open in v0" showcase
 * bundle (the create codec pulls this in transitively).
 */

import type { ClassValue, TvLayer, VariantSliceValue } from './types'

/* --------------------------------- types --------------------------------- */

/**
 * The styling solution the exported component is authored in. Both render an
 * identical component (they share dotUI's CSS-variable theme); this only
 * decides which library the consumer's project depends on.
 *   - `tailwind` → `tv(...)` + Tailwind utility classes (the canonical source).
 *   - `stylex`   → `stylex.create(...)` style objects + `stylex.props(...)`.
 */
export type StyleEngine = 'tailwind' | 'stylex'

export const STYLE_ENGINES: readonly StyleEngine[] = ['tailwind', 'stylex']

export interface CodeOptions {
  /**
   * How multi-group class values render inside the `tv(...)` config:
   *   - `true`  → an array of strings, one authored group per line (grouped).
   *   - `false` → a single space-joined string per slot/variant (compact).
   *
   * Tailwind-only; ignored when `styleEngine` is `stylex`.
   */
  classArrays: boolean
  /**
   * Divide the file into sections with comment-rule separators (placed where
   * the source carries `// MARK:` markers). When off, no separators are added.
   */
  sectionComments: boolean
  /**
   * Which styling solution the exported component uses. See `StyleEngine`.
   */
  styleEngine: StyleEngine
}

/**
 * Defaults preserve the source's authored shape (grouped class arrays) with a
 * clean, separator-free file — a sensible starting point the user can tweak.
 *
 * Kept as a complete object (every field present) so the codec can diff the
 * whole recipe against this default — an untouched config encodes to nothing.
 */
export const DEFAULT_CODE_OPTIONS: CodeOptions = {
  classArrays: true,
  sectionComments: false,
  styleEngine: 'tailwind',
}

/* ------------------------------- validation ------------------------------- */

function pickBool(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback
}

function pickStyleEngine(value: unknown, fallback: StyleEngine): StyleEngine {
  return STYLE_ENGINES.includes(value as StyleEngine)
    ? (value as StyleEngine)
    : fallback
}

/**
 * Coerce an untouched / stale / crafted preset value into a complete, valid
 * `CodeOptions`. Mirrors `sanitizeColor` in the codec: never throws, always
 * returns something the publisher can act on.
 */
export function sanitizeCodeOptions(input: unknown): CodeOptions {
  if (typeof input !== 'object' || input === null) {
    return { ...DEFAULT_CODE_OPTIONS }
  }
  const raw = input as Partial<Record<keyof CodeOptions, unknown>>
  const d = DEFAULT_CODE_OPTIONS
  return {
    classArrays: pickBool(raw.classArrays, d.classArrays),
    sectionComments: pickBool(raw.sectionComments, d.sectionComments),
    styleEngine: pickStyleEngine(raw.styleEngine, d.styleEngine),
  }
}

/* --------------------------- serialize-shape ----------------------------- */

function joinClassValue(value: ClassValue): ClassValue {
  if (!Array.isArray(value)) return value
  const parts: string[] = []
  for (const part of value) {
    if (typeof part === 'string' && part !== '') parts.push(part)
  }
  if (parts.length === 0) return undefined
  if (parts.length === 1) return parts[0]
  return parts.join(' ')
}

function joinVariantSlice(value: VariantSliceValue): VariantSliceValue {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const out: Record<string, ClassValue> = {}
    for (const [slot, slotValue] of Object.entries(value)) {
      out[slot] = joinClassValue(slotValue)
    }
    return out
  }
  return joinClassValue(value as ClassValue)
}

/**
 * Collapse every grouped class array in a flat tv layer into a single
 * space-joined string. Used when `classArrays` is off so each slot/variant
 * renders as one line. No-op shape-wise when values are already strings.
 */
export function flattenClassArrays(layer: TvLayer): TvLayer {
  const out: TvLayer = {}

  if (layer.base !== undefined) out.base = joinClassValue(layer.base)

  if (layer.slots) {
    const slots: Record<string, ClassValue> = {}
    for (const [k, v] of Object.entries(layer.slots)) {
      slots[k] = joinClassValue(v)
    }
    out.slots = slots
  }

  if (layer.variants) {
    const variants: NonNullable<TvLayer['variants']> = {}
    for (const [variantName, values] of Object.entries(layer.variants)) {
      const valuesOut: Record<string, VariantSliceValue> = {}
      for (const [valueName, slice] of Object.entries(values)) {
        valuesOut[valueName] = joinVariantSlice(slice)
      }
      variants[variantName] = valuesOut
    }
    out.variants = variants
  }

  if (layer.defaultVariants) out.defaultVariants = layer.defaultVariants

  if (layer.compoundVariants) {
    out.compoundVariants = layer.compoundVariants.map((cv) => {
      const result: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(cv)) {
        result[k] =
          k === 'class' || k === 'className'
            ? joinClassValue(v as ClassValue)
            : v
      }
      return result
    })
  }

  return out
}

/* --------------------------- section separators -------------------------- */

/** A blank section-divider comment rule (≈ 80 cols). */
const SEPARATOR =
  '/* -------------------------------------------------------------------------- */'

// `// MARK: <name>Styles` only tells the publisher where to inject the resolved
// `tv()` config — purely internal, never shown to the user.
const STYLES_MARK_RE =
  /^[ \t]*\/\/ MARK:[ \t]*[A-Za-z0-9_$]*Styles[ \t]*\r?\n?/gm
// Every other `// MARK:` marks where a section separator belongs.
const SECTION_MARK_LINE_RE = /^[ \t]*\/\/ MARK:.*$/gm
const SECTION_MARK_BLOCK_RE = /^[ \t]*\/\/ MARK:.*$\r?\n?/gm

/**
 * Resolve the source's `// MARK:` markers. The `…Styles` marker is always
 * dropped (it's an internal injection point). The rest become real
 * comment-rule separators when `enabled`, or are dropped when not. Leftover
 * blank runs are collapsed; the formatter normalises the rest.
 */
export function applySectionComments(source: string, enabled: boolean): string {
  let out = source.replace(STYLES_MARK_RE, '')
  out = enabled
    ? out.replace(SECTION_MARK_LINE_RE, SEPARATOR)
    : out.replace(SECTION_MARK_BLOCK_RE, '')
  return out.replace(/\n{3,}/g, '\n\n')
}
