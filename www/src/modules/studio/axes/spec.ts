/* The axis catalog's shape: what each state key means in design terms, for
   readers that can't see the panel — agents driving the studio over MCP.
   Every axis module exports a `<CHAPTER>_SPEC` keyed by its defaults, so a
   key without a spec is a type error. Options reuse the module's own option
   arrays: the panel reads `value`/`label`, agents read the rest. */

import { toOklch } from "@dotui/colors"

import { FONT_CATALOG, type FontCategory } from "@/lib/fonts"

export interface AxisOption {
  value: string
  label: string
  /** What picking it looks like. */
  description?: string
  /** Design systems that ship this choice, as named in
   *  docs/design-system-references.md. */
  seenIn?: readonly string[]
}

export type AxisValue =
  | { type: "enum"; options: readonly AxisOption[] }
  | { type: "number"; min: number; max: number; step: number; unit?: string }
  | { type: "boolean" }
  /** Any CSS color the engine parses (hex, oklch(), rgb(), named…). */
  | { type: "color" }
  /** A family from the font catalog; `category` narrows near-miss suggestions. */
  | { type: "font"; category?: FontCategory }
  /** Structured value; `shape` describes it. */
  | { type: "json"; shape: string }

export interface AxisSpec {
  label: string
  /** What the axis controls, in design terms. */
  description: string
  value: AxisValue
  /** What the empty value (`''` or `null`) means, when it is allowed. */
  auto?: string
  /** How systems split on it and when to pick what. */
  guidance?: string
}

/** A named combination of axes — a panel shortcut like Shape's characters. */
export interface AxisRecipe {
  id: string
  label: string
  description?: string
  set: Record<string, unknown>
}

export interface ChapterSpec<
  Defaults extends object = Record<string, unknown>,
> {
  label: string
  description: string
  axes: { [K in keyof Defaults]: AxisSpec }
  recipes?: readonly AxisRecipe[]
}

const FONT_FAMILIES = new Set(FONT_CATALOG.map((font) => font.family))

function editDistance(a: string, b: string): number {
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const row = [i]
    for (let j = 1; j <= b.length; j++)
      row[j] = Math.min(
        (prev[j] ?? 0) + 1,
        (row[j - 1] ?? 0) + 1,
        (prev[j - 1] ?? 0) + (a[i - 1] === b[j - 1] ? 0 : 1),
      )
    prev = row
  }
  return prev[b.length] ?? 0
}

/** Catalog families closest to `query`: those sharing a word, else near
 *  spellings, else the most-used faces of the category. A mono query (by
 *  `category` or a "Mono"/"Code" word) only gets monospace faces. The catalog
 *  lists most-used first. */
export function nearFonts(
  query: string,
  category?: FontCategory,
  limit = 5,
): string[] {
  const needle = query.trim().toLowerCase()
  const words = needle.split(/\s+/)
  const target =
    category ??
    (words.some((word) => word === "mono" || word === "code")
      ? "mono"
      : words.includes("serif")
        ? "serif"
        : "sans-serif")
  const scored = FONT_CATALOG.filter(
    (font) => target !== "mono" || font.category === "mono",
  ).map((font) => {
    const name = font.family.toLowerCase()
    const own = name.split(/\s+/)
    return {
      family: font.family,
      shared: words.filter((word) => own.includes(word)).length,
      distance:
        editDistance(name, needle) / Math.max(name.length, needle.length),
      category: font.category,
    }
  })
  const sharing = scored.filter((font) => font.shared > 0)
  const spelled = scored.filter((font) => font.distance <= 0.34)
  const picked = sharing.length
    ? sharing.sort((a, b) => b.shared - a.shared)
    : spelled.length
      ? spelled.sort((a, b) => a.distance - b.distance)
      : scored.filter((font) => font.category === target)
  return picked.slice(0, limit).map((font) => font.family)
}

/** `undefined` when `value` fits the spec, else why not. */
export function checkAxisValue(
  spec: AxisSpec,
  value: unknown,
): string | undefined {
  if (spec.auto !== undefined && (value === "" || value === null)) return
  const kind = spec.value
  switch (kind.type) {
    case "enum":
      return kind.options.some((option) => option.value === value)
        ? undefined
        : `expected one of ${kind.options.map((o) => o.value).join(", ")}`
    case "number":
      if (typeof value !== "number" || !Number.isFinite(value))
        return "expected a number"
      if (value < kind.min || value > kind.max)
        return `expected ${kind.min}–${kind.max}`
      return
    case "boolean":
      return typeof value === "boolean" ? undefined : "expected a boolean"
    case "color":
      try {
        if (typeof value === "string") toOklch(value)
        else return "expected a CSS color string"
      } catch {
        return "expected a CSS color"
      }
      return
    case "font":
      if (typeof value === "string" && FONT_FAMILIES.has(value)) return
      return `expected a family from the font catalog, a curated set of Google variable fonts${
        typeof value === "string" && value.trim()
          ? ` — closest: ${nearFonts(value, kind.category).join(", ")}`
          : ""
      }`
    case "json":
      return value !== undefined && value !== null
        ? undefined
        : `expected ${kind.shape}`
  }
}
