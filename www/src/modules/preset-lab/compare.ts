/* Reference vs preset, property by property: what `measure-preset` prints. */

import { toOklch } from "@dotui/colors"

import type { Measure, Measures, Prop } from "./probe"

export interface Row {
  part: string
  prop: Prop
  reference: string
  preset: string
  /** How far apart, in the property's unit; empty when not comparable. */
  delta: string
  ok: boolean
  /** The specimens don't show this part: a coverage gap, not a preset value. */
  missing?: boolean
}

const COLORS = new Set<Prop>(["backgroundColor", "color"])

/* What a look tolerates before it reads differently. */
const PX_TOLERANCE: Partial<Record<Prop, number>> = {
  borderRadius: 1,
  height: 2,
  paddingInline: 2,
  fontSize: 0.5,
  letterSpacing: 0.2,
}
/** Edge and ring widths: tight enough to tell a 0.5px hairline from 1px. */
const LINE_TOLERANCE = 0.25
/** ΔE in OKLab (L from 0 to 1); about one just-noticeable step. */
const COLOR_TOLERANCE = 0.02
/** Variable fonts land on in-between weights (Linear's 510). */
const WEIGHT_TOLERANCE = 30
/** Radii past this are pills, whatever the height. */
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

/** Visible shadow layers: Tailwind pads with transparent ones, and rings
 *  (spread only) count as `edge` and `ring` instead. */
const shadowLayers = (value: string) =>
  value === "none"
    ? 0
    : value
        .split(/,(?![^(]*\))/)
        .filter(
          (layer) =>
            alphaOf(/^\s*([a-z]+\([^)]*\))/.exec(layer)?.[1] ?? "") > 0 &&
            !/\)\s+0px\s+0px\s+0px\s+[\d.]+px/.test(layer),
        ).length

const firstFamily = (value: string) =>
  (value.split(",")[0] ?? "")
    .replace(/["']/g, "")
    .replace(/\s+variable$/i, "")
    .trim()
    .toLowerCase()

const signed = (n: number) =>
  `${n > 0 ? "+" : ""}${Math.round(n * 100) / 100}px`

/** `edge` is "<width>px <color>" (plus its sides when not all four, as
 *  "bottom" or "top+bottom"), `ring` "<width>px <color> <±offset>px", or
 *  "none". Same sides, width within 0.25px, offset within 1px, color as
 *  colors. */
function lineDelta(prop: "edge" | "ring", reference: string, preset: string) {
  if (reference === "none" || preset === "none") {
    const same = reference === preset
    const name = (line: string) => (line === "none" ? "none" : prop)
    return {
      delta: same ? "" : `${name(reference)} → ${name(preset)}`,
      ok: same,
    }
  }
  const parse = (line: string) => {
    const [width = "", ...rest] = line.split(" ")
    const sides = /^[a-z+]+$/.test(rest.at(-1) ?? "") ? rest.pop() : "all"
    const offset = /^[+-][\d.]+px$/.test(rest.at(-1) ?? "")
      ? rest.pop()
      : undefined
    return {
      width: Number.parseFloat(width),
      offset: offset ? Number.parseFloat(offset) : 0,
      color: rest.join(" "),
      sides,
    }
  }
  const [a, b] = [parse(reference), parse(preset)]
  const width = b.width - a.width
  const offset = b.offset - a.offset
  const color = colorDelta(a.color, b.color)
  const sidesOk = a.sides === b.sides
  const widthOk = Math.abs(width) <= LINE_TOLERANCE
  const offsetOk = Math.abs(offset) <= 1
  return {
    delta: [
      sidesOk ? "" : `${a.sides} → ${b.sides}`,
      widthOk ? "" : signed(width),
      offsetOk ? "" : `offset ${signed(offset)}`,
      color.ok ? "" : color.delta,
    ]
      .filter(Boolean)
      .join(", "),
    ok: sidesOk && widthOk && offsetOk && color.ok,
  }
}

/** A radius that rounds the whole end of its box. */
const full = (radius: number, height: string | undefined) =>
  radius >= PILL ||
  (height !== undefined && radius >= Number.parseFloat(height) / 2 - 0.5)

function diff(
  prop: Prop,
  reference: string,
  preset: string,
  parts: { reference: Measure; preset: Measure },
) {
  if (COLORS.has(prop)) return colorDelta(reference, preset)
  if (prop === "edge" || prop === "ring")
    return lineDelta(prop, reference, preset)
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
  if (
    prop === "borderRadius" &&
    full(a, parts.reference.height) &&
    full(b, parts.preset.height)
  )
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
    const specimen = preset[part]
    for (const [prop, value] of Object.entries(measure) as [Prop, string][]) {
      if (value === undefined) continue
      const ours = specimen?.[prop]
      // A prop the probe no longer reads, from an older pack.
      if (specimen && ours === undefined) continue
      if (!specimen || ours === undefined) {
        rows.push({
          part,
          prop,
          reference: value,
          preset: "—",
          delta: "",
          ok: false,
          missing: !specimen,
        })
        continue
      }
      rows.push({
        part,
        prop,
        reference: value,
        preset: ours,
        ...diff(prop, value, ours, { reference: measure, preset: specimen }),
      })
    }
  }
  return rows
}
