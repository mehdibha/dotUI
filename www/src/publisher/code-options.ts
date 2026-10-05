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
 *
 * Pure JS, no external imports — safe to import from the request-time route
 * bundle and the /studio client bundle alike.
 */

import type { ClassValue, TvLayer, VariantSliceValue } from "./types"

/* --------------------------------- types --------------------------------- */

export interface CodeOptions {
  /**
   * How multi-group class values render inside the `tv(...)` config:
   *   - `true`  → an array of strings, one authored group per line (grouped).
   *   - `false` → a single space-joined string per slot/variant (compact).
   */
  classArrays: boolean
  /**
   * Divide the file into sections with comment-rule separators (placed where
   * the source carries `// MARK:` markers). When off, no separators are added.
   */
  sectionComments: boolean
}

/**
 * Defaults ship one class string per slot/variant (the shadcn convention) with
 * comment-rule section separators; grouped arrays and a separator-free file
 * are opt-ins.
 */
export const DEFAULT_CODE_OPTIONS: CodeOptions = {
  classArrays: false,
  sectionComments: true,
}

/* --------------------------------- flags --------------------------------- */

/** The `?code=` vocabulary: one flag per non-default choice. */
const FLAGS = {
  arrays: { classArrays: true },
  "no-sections": { sectionComments: false },
} satisfies Record<string, Partial<CodeOptions>>

type Flag = keyof typeof FLAGS

export const CODE_FLAGS = Object.keys(FLAGS) as Flag[]

/** `"arrays,no-sections"` → options; `undefined` for an unknown or repeated flag. */
export function parseCodeFlags(value: string): CodeOptions | undefined {
  const flags = value.split(",")
  if (new Set(flags).size !== flags.length) return undefined
  let options = DEFAULT_CODE_OPTIONS
  for (const flag of flags) {
    if (!Object.hasOwn(FLAGS, flag)) return undefined
    options = { ...options, ...FLAGS[flag as Flag] }
  }
  return options
}

/** The options as flags, `""` for the defaults. */
export function codeFlags(options: CodeOptions): string {
  return CODE_FLAGS.filter((flag) =>
    Object.entries(FLAGS[flag]).every(
      ([key, value]) => options[key as keyof CodeOptions] === value,
    ),
  ).join(",")
}

/* --------------------------- serialize-shape ----------------------------- */

function joinClassValue(value: ClassValue): ClassValue {
  if (!Array.isArray(value)) return value
  const parts: string[] = []
  for (const part of value) {
    if (typeof part === "string" && part !== "") parts.push(part)
  }
  if (parts.length === 0) return undefined
  if (parts.length === 1) return parts[0]
  return parts.join(" ")
}

function joinVariantSlice(value: VariantSliceValue): VariantSliceValue {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
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
    const variants: NonNullable<TvLayer["variants"]> = {}
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
          k === "class" || k === "className"
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
  "/* -------------------------------------------------------------------------- */"

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
  let out = source.replace(STYLES_MARK_RE, "")
  out = enabled
    ? out.replace(SECTION_MARK_LINE_RE, SEPARATOR)
    : out.replace(SECTION_MARK_BLOCK_RE, "")
  return out.replace(/\n{3,}/g, "\n\n")
}
