/* Reference vs preset, property by property: what `measure-preset` prints. */

import { toOklch } from "@dotui/colors"

import type { Measures, Prop } from "./probe"

export interface Row {
  part: string
  prop: Prop
  reference: string
  preset: string
  /** How far apart, in the property's unit; empty when not comparable. */
  delta: string
  ok: boolean
}

const COLORS = new Set<Prop>(["backgroundColor", "color", "borderColor"])

/* What a look tolerates before it reads differently. */
const PX_TOLERANCE: Partial<Record<Prop, number>> = {
  borderWidth: 0.5,
  borderRadius: 1,
  height: 2,
  paddingInline: 2,
  fontSize: 0.5,
  letterSpacing: 0.2,
}
/** ΔE in OKLab (L from 0 to 1); about one just-noticeable step. */
const COLOR_TOLERANCE = 0.02
/** Variable fonts land on in-between weights (Linear's 510). */
const WEIGHT_TOLERANCE = 30
/** Radii past this are pills. */
const PILL = 999

/** A computed color's alpha: `rgba(…, a)`, `oklch(… / a)`, else 1. */
function alphaOf(value: string) {
  if (value === "transparent") return 0
  const match = /(?:,|\/)\s*([\d.]+)(%?)\s*\)$/.exec(value)
  if (!match || (value.startsWith("rgb(") && !value.includes("/"))) return 1
  return Number(match[1]) / (match[2] ? 100 : 1)
}

function colorDelta(a: string, b: string) {
  const [alphaA, alphaB] = [alphaOf(a), alphaOf(b)]
  if (alphaA === 0 || alphaB === 0 || Math.abs(alphaA - alphaB) > 0.1) {
    const same = alphaA === alphaB
    return { delta: same ? "" : `alpha ${alphaA} → ${alphaB}`, ok: same }
  }
  const lab = (color: string) => {
    const { l, c, h } = toOklch(color)
    const rad = (h * Math.PI) / 180
    return { l, a: c * Math.cos(rad), b: c * Math.sin(rad) }
  }
  const [x, y] = [lab(a), lab(b)]
  const delta = Math.hypot(x.l - y.l, x.a - y.a, x.b - y.b)
  return { delta: `ΔE ${delta.toFixed(3)}`, ok: delta <= COLOR_TOLERANCE }
}

/** Visible shadow layers: Tailwind pads with transparent ones. */
const shadowLayers = (value: string) =>
  value === "none"
    ? 0
    : value
        .split(/,(?![^(]*\))/)
        .filter(
          (layer) =>
            alphaOf(/^\s*([a-z]+\([^)]*\))/.exec(layer)?.[1] ?? "") > 0,
        ).length

const firstFamily = (value: string) =>
  (value.split(",")[0] ?? "")
    .replace(/["']/g, "")
    .replace(/\s+variable$/i, "")
    .trim()
    .toLowerCase()

function diff(prop: Prop, reference: string, preset: string) {
  if (COLORS.has(prop)) return colorDelta(reference, preset)
  if (prop === "fontFamily") {
    const ok = firstFamily(reference) === firstFamily(preset)
    return { delta: "", ok }
  }
  if (prop === "boxShadow") {
    const [a, b] = [shadowLayers(reference), shadowLayers(preset)]
    return { delta: a === b ? "" : `${a} → ${b} layers`, ok: a > 0 === b > 0 }
  }
  const number = (value: string) =>
    value === "normal" ? 0 : Number.parseFloat(value)
  const [a, b] = [number(reference), number(preset)]
  if (Number.isNaN(a) || Number.isNaN(b)) return { delta: "", ok: false }
  if (prop === "borderRadius" && a >= PILL && b >= PILL)
    return { delta: "", ok: true }
  const delta = b - a
  const tolerance =
    prop === "fontWeight" ? WEIGHT_TOLERANCE : (PX_TOLERANCE[prop] ?? 0)
  const unit = prop === "fontWeight" ? "" : "px"
  return {
    delta: `${delta > 0 ? "+" : ""}${Math.round(delta * 10) / 10}${unit}`,
    ok: Math.abs(delta) <= tolerance,
  }
}

/** Every property the reference measured, against the preset's value. */
export function compareMeasures(reference: Measures, preset: Measures): Row[] {
  const rows: Row[] = []
  for (const [part, measure] of Object.entries(reference)) {
    if (!measure) continue
    for (const [prop, value] of Object.entries(measure) as [Prop, string][]) {
      const ours = preset[part]?.[prop]
      if (value === undefined) continue
      if (ours === undefined) {
        rows.push({
          part,
          prop,
          reference: value,
          preset: "—",
          delta: "",
          ok: false,
        })
        continue
      }
      rows.push({
        part,
        prop,
        reference: value,
        preset: ours,
        ...diff(prop, value, ours),
      })
    }
  }
  return rows
}
