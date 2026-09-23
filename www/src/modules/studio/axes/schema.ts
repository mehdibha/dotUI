/* The shape each axis value must have. Every chapter declares one spec per
   state key next to its defaults; decode validates stored values against
   them, so resolvers only ever read values from these vocabularies. */

import { toOklch } from "@dotui/colors"

import { FONT_CATALOG } from "@/lib/fonts"

import type { ColorMode } from "./color"

export type AxisSpec =
  | { kind: "enum"; options: readonly string[] }
  | { kind: "number"; min: number; max: number; nullable?: true }
  | { kind: "boolean" }
  /** '' is Auto when `auto` is set. */
  | { kind: "color"; auto?: true }
  | { kind: "font"; auto?: true }
  /** The engine's fixed light + dark pair; only each mode's bg is stored. */
  | {
      kind: "modes"
      modes: readonly ColorMode[]
      bg: Record<ColorMode["polarity"], { min: number; max: number }>
    }

export type Schema<T> = { [K in keyof T]: AxisSpec }

export const oneOf = (options: readonly { value: string }[]): AxisSpec => ({
  kind: "enum",
  options: options.map((option) => option.value),
})

export const range = (
  { min, max }: { min: number; max: number },
  nullable?: true,
): AxisSpec => ({ kind: "number", min, max, nullable })

export const BOOLEAN: AxisSpec = { kind: "boolean" }

const FAMILIES = new Set(FONT_CATALOG.map((font) => font.family))

const inRange = (value: unknown, min: number, max: number) =>
  typeof value === "number" &&
  Number.isFinite(value) &&
  value >= min &&
  value <= max

function isColor(value: string): boolean {
  try {
    toOklch(value)
    return true
  } catch {
    return false
  }
}

/** Only a mode's bg is data; id, name and order come from the spec. Fields
 *  the model no longer has are named in `stale`. */
function parseModes(
  spec: Extract<AxisSpec, { kind: "modes" }>,
  value: unknown,
  stale: Set<string>,
): ColorMode[] | undefined {
  if (!Array.isArray(value) || value.length !== spec.modes.length) return
  const modes: ColorMode[] = []
  for (const mode of spec.modes) {
    const stored = value.filter(
      (entry) =>
        entry && typeof entry === "object" && entry.polarity === mode.polarity,
    )
    const bg = stored[0]?.bg
    const { min, max } = spec.bg[mode.polarity]
    if (stored.length !== 1 || !inRange(bg, min, max)) return
    for (const field of Object.keys(stored[0]))
      if (!(field in mode)) stale.add(field)
    modes.push({ ...mode, bg })
  }
  return modes
}

/** `value` when it satisfies `spec` (modes normalized), else `undefined`. */
export function parseAxis(
  spec: AxisSpec,
  value: unknown,
  stale: Set<string> = new Set(),
): unknown {
  switch (spec.kind) {
    case "enum":
      return typeof value === "string" && spec.options.includes(value)
        ? value
        : undefined
    case "number":
      return (spec.nullable && value === null) ||
        inRange(value, spec.min, spec.max)
        ? value
        : undefined
    case "boolean":
      return typeof value === "boolean" ? value : undefined
    case "color":
      if (typeof value !== "string") return undefined
      return (spec.auto && value === "") || isColor(value) ? value : undefined
    case "font":
      if (typeof value !== "string") return undefined
      return (spec.auto && value === "") || FAMILIES.has(value)
        ? value
        : undefined
    case "modes":
      return parseModes(spec, value, stale)
  }
}
