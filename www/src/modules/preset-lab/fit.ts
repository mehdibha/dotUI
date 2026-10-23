/* Fit: the studio state closest to a reference, searched over the axes the
   specimens render. `scripts/fit-preset.ts` renders each candidate; this
   file holds what needs no browser: the score, the candidates per key, the
   sensitivity map's shape, and the residual rows filed as gaps. Color and
   font keys are left out: the color engine is queued for a rewrite, and
   fonts are picked from the catalog with their stand-ins by hand. */

import { compareMeasures, type Row } from "./compare"
import { type Gap, LOOKS, lookOf } from "./looks"
import type { Measures, ReferenceTokens } from "./probe"

type Mode = "light" | "dark"
export type Measured = Partial<Record<Mode, Measures>>

/* How far past "ok" still earns partial credit, per unit (px, weight, ΔE):
   a row closer to the reference scores lower even before it turns ok. */
const SCALE = { px: 8, weight: 200, color: 0.1 } as const

const scaleOf = (prop: string) =>
  prop === "fontWeight"
    ? SCALE.weight
    : prop === "backgroundColor" || prop === "color"
      ? SCALE.color
      : SCALE.px

/** One row's cost: 0 when ok, 1 to 2 when off, by how far. Rows the
 *  specimens don't show cost nothing: they are coverage, not fit. */
export const cost = (row: Row) =>
  row.ok || row.missing
    ? 0
    : 1 + Math.min(1, (row.distance ?? scaleOf(row.prop)) / scaleOf(row.prop))

export interface Score {
  score: number
  off: number
  rows: (Row & { mode: Mode })[]
}

export function score(reference: ReferenceTokens, measured: Measured): Score {
  const rows = (["light", "dark"] as const).flatMap((mode) =>
    reference[mode]
      ? compareMeasures(
          reference[mode],
          measured[mode] ?? {},
          reference.fonts,
        ).map((row) => ({ ...row, mode }))
      : [],
  )
  return {
    score: rows.reduce((sum, row) => sum + cost(row), 0),
    off: rows.filter((row) => !row.ok && !row.missing).length,
    rows,
  }
}

export type Value = string | number | boolean | null
export interface Axis {
  value:
    | { type: "enum"; values: readonly string[] }
    | { type: "number"; min: number; max: number; step?: number }
    | { type: "boolean" }
    | { type: "color" }
    | { type: "font" }
  auto?: true
}

/** The values a key can take besides its current one: every option and
 *  follow id of an enum, the other boolean, and for a number every step
 *  (`near` narrows it to a few steps either side of the current value). */
export function optionsOf(
  axis: Axis,
  current: Value,
  follows: readonly string[] = [],
  near?: number,
): Value[] {
  const { value } = axis
  if (value.type === "enum")
    return [...value.values, ...follows].filter((option) => option !== current)
  if (value.type === "boolean") return [!current]
  if (value.type !== "number") return []
  const step = value.step ?? 1
  const steps: number[] = []
  for (let n = value.min; n <= value.max + 1e-9; n += step)
    steps.push(Math.round(n * 1000) / 1000)
  const at = typeof current === "number" ? current : value.min
  return steps.filter(
    (n) => n !== current && (near === undefined || Math.abs(n - at) <= near * step),
  )
}

/** For each key and option, the rows it changed when set alone on Origin:
 *  `"<mode> <part> <prop>"`. A candidate whose rows miss every off row is
 *  not rendered. */
export interface SensitivityMap {
  probe: string
  /** The registry and studio version it was rendered with. */
  build: string
  keys: Record<string, Record<string, string[]>>
}

export const rowId = (row: { mode: Mode; part: string; prop: string }) =>
  `${row.mode} ${row.part} ${row.prop}`

/** The rows two readings disagree on. */
export function changedRows(before: Measured, after: Measured): string[] {
  const out: string[] = []
  for (const mode of ["light", "dark"] as const)
    for (const [part, measure] of Object.entries(after[mode] ?? {}))
      for (const [prop, value] of Object.entries(measure ?? {}))
        if (before[mode]?.[part]?.[prop as keyof typeof measure] !== value)
          out.push(`${mode} ${part} ${prop}`)
  return out
}

/** The residual off rows after a fit, filed under the narrowest look that
 *  claims them, as gaps.json entries; rows no look claims come back apart. */
export function residualGaps(rows: Score["rows"], probe: string) {
  const byLook = new Map<string, NonNullable<Gap["rows"]>>()
  const unfiled: Score["rows"] = []
  for (const row of rows) {
    if (row.ok || row.missing) continue
    const look = lookOf(row.part, row.prop)
    if (!look) {
      unfiled.push(row)
      continue
    }
    byLook.set(look, [
      ...(byLook.get(look) ?? []),
      {
        mode: row.mode,
        part: row.part,
        prop: row.prop,
        reference: row.reference,
        preset: row.preset,
      },
    ])
  }
  const gaps: Gap[] = [...byLook].map(([look, rows]) => ({
    look: look as Gap["look"],
    title: `${LOOKS[look as Gap["look"]].label}: off after the fit`,
    source: `fit ${probe}`,
    rows,
  }))
  return { gaps, unfiled }
}
