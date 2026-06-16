/**
 * `CodeOptions` — the user-configurable STYLE of the exported code.
 *
 * The design-system axes (colors, density, per-component styles…) decide what
 * the components LOOK like. `codeOptions` is the second customization layer: it
 * decides how the exported source READS, so it lands in the user's codebase
 * looking like the user wrote it, not like we generated it.
 *
 * Scope is deliberately limited to choices a code FORMATTER won't undo. Pure
 * formatting (semicolons, quotes, indentation, line width, trailing commas,
 * import/class sorting…) is intentionally NOT here: the consumer runs Prettier
 * or Biome with their own rules before committing, so any formatting we pick is
 * immediately overwritten — offering it as an option is noise. What survives a
 * formatter pass, and so is worth controlling:
 *
 *   - serialize-shape — how the resolved `tv(...)` config literal is rendered
 *     (`flattenClassArrays`): grouped arrays (one concern per line) vs. a single
 *     class string per slot/variant. A formatter reflows, but never converts
 *     `['a', 'b']` ↔ `'a b'`.
 *   - comment / directive transforms — add/strip text a formatter preserves:
 *     the `// MARK:` section comments (`stripSectionComments`), the
 *     `"use client"` directive (`stripUseClient`), a banner/license header
 *     (`applyFileHeader`).
 *
 * Pure JS, no external imports — safe to import from anywhere: the request-time
 * route bundle, the `/create` client bundle, AND the "Open in v0" showcase
 * bundle (the create codec pulls this in transitively).
 */

import type { ClassValue, TvLayer, VariantSliceValue } from './types'

/* --------------------------------- types --------------------------------- */

export interface CodeOptions {
  /**
   * How multi-group class values render inside the `tv(...)` config:
   *   - `true`  → an array of strings, one authored group per line (grouped).
   *   - `false` → a single space-joined string per slot/variant (compact).
   */
  classArrays: boolean
  /** Keep or strip the leading `"use client"` directive (RSC vs SPA/Vite). */
  useClient: 'keep' | 'strip'
  /** Keep the `// MARK:` section/separator comments from the source. */
  sectionComments: boolean
  /**
   * A banner/license comment prepended to every exported file. Plain text
   * (one entry per line); rendered as a JSDoc block. Empty string = none.
   */
  fileHeader: string
}

/**
 * Defaults preserve the source's authored shape (grouped class arrays, no
 * `// MARK:` pragmas leaking to the consumer, the directive kept) — a clean
 * starting point the user can tweak.
 *
 * Kept as a complete object (every field present) so the codec can diff the
 * whole recipe against this default — an untouched config encodes to nothing.
 */
export const DEFAULT_CODE_OPTIONS: CodeOptions = {
  classArrays: true,
  useClient: 'keep',
  sectionComments: false,
  fileHeader: '',
}

/* ------------------------------- validation ------------------------------- */

const USE_CLIENT = new Set<CodeOptions['useClient']>(['keep', 'strip'])

function pickEnum<T extends string>(
  value: unknown,
  allowed: Set<T>,
  fallback: T,
): T {
  return typeof value === 'string' && allowed.has(value as T)
    ? (value as T)
    : fallback
}

function pickBool(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback
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
    useClient: pickEnum(raw.useClient, USE_CLIENT, d.useClient),
    sectionComments: pickBool(raw.sectionComments, d.sectionComments),
    fileHeader:
      typeof raw.fileHeader === 'string' ? raw.fileHeader : d.fileHeader,
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

/* ----------------------------- text edits ----------------------------- */

/**
 * Strip the source's `// MARK:` section/separator comments (an Xcode authoring
 * convention) from emitted code. Leftover blank runs are collapsed; the
 * formatter normalises the rest.
 */
export function stripSectionComments(source: string): string {
  return source
    .replace(/^[ \t]*\/\/ MARK:.*$\n?/gm, '')
    .replace(/\n{3,}/g, '\n\n')
}

/**
 * Strip a leading `"use client"` / `'use client'` directive (with optional
 * semicolon) from the head of the file. For SPA/Vite consumers who don't want
 * stray RSC directives.
 */
export function stripUseClient(source: string): string {
  return source.replace(/^\s*['"]use client['"];?[ \t]*\r?\n+/, '')
}

/**
 * Prepend a banner/license comment as a JSDoc block at the top of the file
 * (above any `"use client"` directive — comments before a directive are legal).
 * Applied after formatting so the formatter doesn't reflow the banner.
 */
export function applyFileHeader(source: string, header: string): string {
  const trimmed = header.trim()
  if (trimmed === '') return source
  const body = trimmed
    .split('\n')
    .map((line) => ` * ${line}`.trimEnd())
    .join('\n')
  return `/**\n${body}\n */\n\n${source}`
}
