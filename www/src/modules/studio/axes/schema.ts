/* What each state key accepts. Every axis module exports a `<CHAPTER>_SCHEMA`
   keyed by its defaults, built from the same option lists and ranges its
   panel rows use; `validate()` (index.ts) checks raw state against them. */

import { toOklch } from "@dotui/colors"

import { FONT_CATALOG } from "@/lib/fonts"

export type AxisValue =
  | { type: "enum"; options: readonly { value: string }[] }
  | { type: "number"; min: number; max: number; step?: number }
  | { type: "boolean" }
  /** Any CSS color the engine parses (hex, oklch(), rgb(), named…). */
  | { type: "color" }
  /** A family from the font catalog. */
  | { type: "font" }

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
  }
}
