/* What each state key accepts. Every axis module exports a `<CHAPTER>_SCHEMA`
   keyed by its defaults, built from the same option lists and ranges its
   panel rows use; `validate()` (index.ts) checks raw state against them. */

import { toOklch } from "@dotui/colors"

import { FONT_CATALOG } from "@/lib/fonts"

import { isMotionValue } from "./motion"

export type AxisValue =
  | { type: "enum"; options: readonly { value: string }[] }
  | { type: "number"; min: number; max: number; step?: number }
  | { type: "boolean" }
  /** Any CSS color the engine parses (hex, oklch(), rgb(), named…). */
  | { type: "color" }
  /** A family from the font catalog. */
  | { type: "font" }
  /** A component's motion (motion.ts); an entrance also names its pattern. */
  | {
      type: "motion"
      kind: "entrance" | "state-change" | "loop"
      patterns?: readonly { value: string }[]
    }

export interface AxisSchema {
  value: AxisValue
  /** The empty value ('' on strings, null on numbers) is allowed: Auto. */
  auto?: true
}

export type ChapterSchema<Defaults> = { [K in keyof Defaults]: AxisSchema }

export const oneOf = (options: readonly { value: string }[]): AxisSchema => ({
  value: { type: "enum", options },
})

export const range = (bounds: {
  min: number
  max: number
  step?: number
}): AxisSchema => ({ value: { type: "number", ...bounds } })

export const BOOLEAN: AxisSchema = { value: { type: "boolean" } }
export const COLOR: AxisSchema = { value: { type: "color" } }
export const FONT: AxisSchema = { value: { type: "font" } }

export const entrance = (
  patterns: readonly { value: string }[],
): AxisSchema => ({ value: { type: "motion", kind: "entrance", patterns } })
export const STATE_CHANGE: AxisSchema = {
  value: { type: "motion", kind: "state-change" },
}
export const LOOP: AxisSchema = { value: { type: "motion", kind: "loop" } }

export const auto = (schema: AxisSchema): AxisSchema => ({
  ...schema,
  auto: true,
})

const FONT_FAMILIES = new Set(FONT_CATALOG.map((font) => font.family))

/** `undefined` when `value` fits the schema, else why not. */
export function checkAxisValue(
  schema: AxisSchema,
  value: unknown,
): string | undefined {
  const kind = schema.value
  if (schema.auto && value === (kind.type === "number" ? null : "")) return
  switch (kind.type) {
    case "enum":
      return kind.options.some((option) => option.value === value)
        ? undefined
        : `expected one of ${kind.options.map((o) => o.value).join(", ")}`
    case "number":
      if (typeof value !== "number" || !Number.isFinite(value))
        return "expected a number"
      return value < kind.min || value > kind.max
        ? `expected ${kind.min}–${kind.max}`
        : undefined
    case "boolean":
      return typeof value === "boolean" ? undefined : "expected a boolean"
    case "color":
      if (typeof value !== "string") return "expected a CSS color"
      try {
        toOklch(value)
        return
      } catch {
        return "expected a CSS color"
      }
    case "font":
      return typeof value === "string" && FONT_FAMILIES.has(value)
        ? undefined
        : "expected a family from the font catalog"
    case "motion":
      return isMotionValue(kind.kind, value, kind.patterns)
        ? undefined
        : `expected a motion ${kind.kind}`
  }
}

/** Deep equality over axis values; motion values are plain objects. */
export function sameValue(a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (typeof a !== "object" || typeof b !== "object" || !a || !b) return false
  const ka = Object.keys(a)
  const kb = Object.keys(b)
  return (
    ka.length === kb.length &&
    ka.every((k) =>
      sameValue(
        (a as Record<string, unknown>)[k],
        (b as Record<string, unknown>)[k],
      ),
    )
  )
}
