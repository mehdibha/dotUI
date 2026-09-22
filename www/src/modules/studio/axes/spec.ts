/* The axis catalog's shape: what each state key means in design terms, for
   readers that can't see the panel — agents driving the studio over MCP.
   Every axis module exports a `<CHAPTER>_SPEC` keyed by its defaults, so a
   key without a spec is a type error. Options reuse the module's own option
   arrays: the panel reads `value`/`label`, agents read the rest. */

import { toOklch } from "@dotui/colors"

import { FONT_CATALOG } from "@/lib/fonts"

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
  /** A family from the font catalog. */
  | { type: "font" }
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

export interface ChapterSpec<Defaults extends object = object> {
  label: string
  description: string
  axes: { [K in keyof Defaults]: AxisSpec }
  recipes?: readonly AxisRecipe[]
}

const FONT_FAMILIES = new Set(FONT_CATALOG.map((font) => font.family))

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
      return typeof value === "string" && FONT_FAMILIES.has(value)
        ? undefined
        : "expected a family from the font catalog"
    case "json":
      return value !== undefined && value !== null
        ? undefined
        : `expected ${kind.shape}`
  }
}
