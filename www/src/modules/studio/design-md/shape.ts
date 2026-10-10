/* Shape and space: the radius ladder fitted to the components' radii, the
   density tier and spacing unit fitted to their control height. */

import { DEFAULTS } from "../axes"
import { rungIndex, SHAPE_CHARACTERS, SHAPE_RUNGS } from "../axes/shape"
import { DENSITY_TIERS } from "../axes/space"
import {
  add,
  clamp,
  hasBorder,
  px,
  round,
  SIZE_SUFFIX,
  statusOf,
} from "./context"
import type { Component, Ctx, Families } from "./context"
import { box, dim, isRecord, kebab, median } from "./parse"

export interface RadiusTargets {
  control?: number
  card?: number
  surface?: number
  panel?: number
}

type ShapeRole = keyof RadiusTargets

const ROLE_DEFAULT: Record<ShapeRole, string> = {
  control: "md",
  card: "lg",
  surface: "lg",
  panel: "xl",
}
const FIT_RUNGS = SHAPE_RUNGS.filter((rung) => Number.isFinite(rung.ratio))
const ratioOf = (id: string) => SHAPE_RUNGS[rungIndex(id)]!.ratio
const rungAt = (index: number) =>
  SHAPE_RUNGS[clamp(index, 0, SHAPE_RUNGS.length - 1)]!.id
const rungBelow = (id: string) => rungAt(rungIndex(id) - 1)
const rungAbove = (id: string) => rungAt(rungIndex(id) + 1)

/** The base and a rung per role that best fit the targets (finite px). */
export function fitRadius(targets: RadiusTargets): {
  radius: number
  rungs: Partial<Record<ShapeRole, string>>
} {
  const roles = (Object.keys(targets) as ShapeRole[]).filter(
    (role) => targets[role] !== undefined,
  )
  let best = {
    cost: Infinity,
    radius: 10,
    rungs: {} as Partial<Record<ShapeRole, string>>,
  }
  for (let k = 4; k <= 40; k++) {
    const radius = k / 2
    const rungs: Partial<Record<ShapeRole, string>> = {}
    let cost = 0.01 * Math.abs(radius - 10)
    for (const role of roles) {
      const target = targets[role]!
      let pick = { id: "", cost: Infinity }
      for (const rung of FIT_RUNGS) {
        const c =
          Math.abs(radius * rung.ratio - target) +
          (rung.id === ROLE_DEFAULT[role] ? 0 : 0.25)
        if (c < pick.cost) pick = { id: rung.id, cost: c }
      }
      rungs[role] = pick.id
      cost += pick.cost
    }
    if (cost < best.cost - 1e-9) best = { cost, radius, rungs }
  }
  return { radius: best.radius, rungs: best.rungs }
}

const PILL = Infinity

function radiusOf(component: Component): number | undefined {
  const r = dim(component.props.rounded)
  if (r === undefined) return
  const height = dim(component.props.height)
  return r >= 999 || (height !== undefined && r >= height / 2) ? PILL : r
}

const medianRadius = (list: Component[]) =>
  median(list.map(radiusOf).filter((r): r is number => r !== undefined))

export function mapShape(ctx: Ctx, components: Component[], fam: Families) {
  const { doc, state } = ctx
  const rounded = isRecord(doc.tokens?.rounded) ? doc.tokens.rounded : undefined
  const fromScale = components.length === 0
  const targets: RadiusTargets = {}
  let buttonTarget: number | undefined
  if (fromScale) {
    if (!rounded) return
    const control = dim(rounded.md) ?? dim(rounded.sm)
    const card = dim(rounded.lg)
    if (control !== undefined) targets.control = control >= 999 ? PILL : control
    if (card !== undefined) targets.card = card
  } else {
    buttonTarget = medianRadius(fam.button)
    targets.control = medianRadius(fam.input) ?? buttonTarget
    targets.card = medianRadius(fam.card)
    targets.surface = medianRadius(fam.surface)
    targets.panel = medianRadius(fam.panel)
  }
  const known = (Object.keys(targets) as ShapeRole[]).filter(
    (role) => targets[role] !== undefined,
  )
  const exactness = (exact: boolean) => statusOf(exact && !fromScale)
  const sourceLabel = fromScale ? " (from the rounded scale)" : ""
  const ROLE_KEY = {
    control: "roleControl",
    card: "roleCard",
    surface: "roleSurface",
    panel: "rolePanel",
  } as const

  let radius: number = DEFAULTS.radiusPx
  if (known.length > 0 && known.every((role) => targets[role] === 0)) {
    const square = SHAPE_CHARACTERS.find((c) => c.id === "square")!.vector
    Object.assign(state, square)
    for (const role of known)
      add(ctx, exactness(true), "shape", {
        id: `radius:${role}`,
        label: `Square ${role}s${sourceLabel}`,
        keys: [ROLE_KEY[role]],
        value: "0px",
        result: "None",
      })
  } else if (known.length > 0) {
    const pillControl = targets.control === PILL
    const fitTargets = { ...targets }
    if (pillControl) delete fitTargets.control
    if (fitTargets.card === PILL) delete fitTargets.card
    if (fitTargets.surface === PILL) delete fitTargets.surface
    if (fitTargets.panel === PILL) delete fitTargets.panel
    const fit = fitRadius(fitTargets)
    radius = fit.radius
    state.radiusPx = radius
    add(ctx, exactness(true), "shape", {
      id: "radius:base",
      label: `Radius base${sourceLabel}`,
      keys: ["radiusPx"],
      result: px(radius),
    })
    if (pillControl) {
      state.roleControl = "full"
      add(ctx, exactness(true), "shape", {
        id: "radius:control",
        label: `Pill controls${sourceLabel}`,
        keys: ["roleControl"],
        value: "pill",
        result: "Pill",
      })
    } else if (fit.rungs.control) state.roleControl = fit.rungs.control
    if (fit.rungs.surface) state.roleSurface = fit.rungs.surface
    const card = fit.rungs.card
    if (fit.rungs.panel) {
      state.rolePanel = fit.rungs.panel
      if (card)
        state.roleCard = card === rungBelow(fit.rungs.panel) ? "auto" : card
    } else if (card) {
      state.rolePanel =
        card === "none"
          ? "none"
          : rungIndex(rungAbove(card)) > rungIndex("3xl")
            ? "3xl"
            : rungAbove(card)
      state.roleCard = "auto"
    }
    for (const role of ["control", "card", "surface", "panel"] as const) {
      const rung = fit.rungs[role]
      const target = fitTargets[role]
      if (!rung || target === undefined) continue
      const fitted = radius * ratioOf(rung)
      const exact = Math.abs(fitted - target) <= 0.5
      add(ctx, exactness(exact), "shape", {
        id: `radius:${role}`,
        label: `${role[0]!.toUpperCase()}${role.slice(1)} radius${sourceLabel}`,
        keys: [ROLE_KEY[role]],
        value: px(target),
        result: rung,
        delta: exact ? undefined : `${px(fitted)} vs ${px(target)}`,
      })
    }
  }

  if (buttonTarget !== undefined) {
    const control = state.roleControl ?? DEFAULTS.roleControl
    const value =
      buttonTarget === PILL && control !== "full"
        ? "pill"
        : buttonTarget === 0 && control !== "none"
          ? "sharp"
          : undefined
    if (value) {
      state.buttonRadius = value
      add(ctx, "mapped", "shape", {
        id: "button-radius",
        label: "Buttons keep their own radius",
        keys: ["buttonRadius"],
        value: buttonTarget === PILL ? "pill" : "0px",
        result: value,
      })
    }
  }

  if (rounded) {
    const ladder = [0.25, 0.5, 0.75, 1, 1.5, 2, 3].map((r) => r * radius)
    for (const [name, value] of Object.entries(rounded)) {
      const v = dim(value)
      if (v === undefined || v === 0 || v >= 999) continue
      if (ladder.every((rung) => Math.abs(rung - v) > 1))
        add(ctx, "unmapped", "shape", {
          id: `radius-token:${kebab(name)}`,
          label: `rounded.${name} is off the generated ladder`,
          source: `rounded.${name}`,
          value: px(v),
        })
    }
  }
}

/* ---------------------------------- space --------------------------------- */

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))

function normalizeUnit(unit: number) {
  let u = unit
  while (u < 3) u *= 2
  while (u > 6) u /= 2
  return round(u, 0.25)
}

/** The tier and spacing unit whose md control lands nearest `height`. */
export function fitDensity(
  height: number,
  scaleUnit?: number,
): { density: string; unit: number; control: number } {
  let best:
    | { cost: number; density: string; unit: number; control: number }
    | undefined
  for (const tier of DENSITY_TIERS) {
    for (let k = 12; k <= 24; k++) {
      const unit = k / 4
      const control = tier.control * unit
      const cost =
        Math.abs(control - height) / height +
        (scaleUnit ? Math.abs(unit - scaleUnit) / scaleUnit : 0)
      const better =
        !best ||
        cost < best.cost - 1e-9 ||
        (Math.abs(cost - best.cost) <= 1e-9 &&
          (Math.abs(unit - 4) < Math.abs(best.unit - 4) ||
            (Math.abs(unit - 4) === Math.abs(best.unit - 4) &&
              tier.id === "default")))
      if (better) best = { cost, density: tier.id, unit, control }
    }
  }
  return { density: best!.density, unit: best!.unit, control: best!.control }
}

function controlHeight(fam: Families): number | undefined {
  const heights = (list: Component[]) =>
    median(
      list
        .map((c) => dim(c.props.height))
        .filter((h): h is number => h !== undefined),
    )
  const fromInput = heights(fam.input)
  if (fromInput !== undefined) return fromInput
  const fromButton = heights(fam.button.filter((c) => !SIZE_SUFFIX.test(c.key)))
  if (fromButton !== undefined) return fromButton
  const btn = fam.button[0]
  if (!btn) return
  const padding = box(btn.props.padding)
  if (!padding || padding.top + padding.bottom === 0) return
  const type = isRecord(btn.props.typography) ? btn.props.typography : {}
  const fontSize = dim(btn.props.fontSize ?? type.fontSize)
  if (fontSize === undefined) return
  const lh = btn.props.lineHeight ?? type.lineHeight
  const lineHeight =
    lh === undefined
      ? fontSize * 1.2
      : typeof lh === "number" || /^\d*\.?\d+$/.test(String(lh).trim())
        ? fontSize * Number(lh)
        : (dim(lh) ?? fontSize * 1.2)
  return (
    padding.top + padding.bottom + lineHeight + (hasBorder(btn.props) ? 2 : 0)
  )
}

export function mapSpace(ctx: Ctx, fam: Families) {
  const { doc, state } = ctx
  const spacing = isRecord(doc.tokens?.spacing) ? doc.tokens.spacing : undefined
  const values = spacing
    ? Object.entries(spacing)
        .map(([name, value]) => [name, dim(value)] as const)
        .filter(
          (e): e is readonly [string, number] => e[1] !== undefined && e[1] > 0,
        )
    : []

  const layout = doc.sections.layout ?? ""
  const stated =
    /base (spacing )?unit[^0-9\n]{0,20}(\d+(?:\.\d+)?)px/i.exec(layout)?.[2] ??
    /(\d+)px (grid|baseline|spacing scale)/i.exec(layout)?.[1]
  let scaleUnit: number | undefined
  if (stated) scaleUnit = normalizeUnit(Number(stated))
  else {
    const halves = values
      .filter(([, v]) => v <= 128)
      .map(([, v]) => Math.round(v * 2))
    if (halves.length > 0) scaleUnit = normalizeUnit(halves.reduce(gcd) / 2)
  }

  const height = controlHeight(fam)
  let unit = scaleUnit
  if (height !== undefined) {
    const fit = fitDensity(height, scaleUnit)
    unit = fit.unit
    state.density = fit.density
    state.spacingUnit = fit.unit
    const exact = Math.abs(fit.control - height) <= 1
    add(ctx, statusOf(exact), "space", {
      id: "density",
      label: "Density from the control height",
      keys: ["density"],
      value: px(height),
      result: `${fit.density} · ${px(fit.control)} controls`,
      delta: exact ? undefined : `${px(fit.control)} vs ${px(height)}`,
    })
  } else if (scaleUnit !== undefined) state.spacingUnit = scaleUnit

  if (unit !== undefined)
    add(ctx, statusOf(unit === scaleUnit), "space", {
      id: "spacing-unit",
      label:
        scaleUnit === undefined
          ? "Spacing unit fitted to the control height"
          : "Spacing unit from the file's scale",
      keys: ["spacingUnit"],
      value: scaleUnit === undefined ? undefined : px(scaleUnit),
      result: px(unit),
      delta:
        unit === scaleUnit || scaleUnit === undefined
          ? undefined
          : `${px(unit)} vs ${px(scaleUnit)}`,
    })

  if (values.length > 0) {
    const half = (unit ?? DEFAULTS.spacingUnit) / 2
    const off = values.filter(
      ([, v]) => Math.abs(v / half - Math.round(v / half)) > 1e-6,
    )
    add(ctx, statusOf(off.length === 0), "space", {
      id: "spacing-scale",
      label: "Spacing scale on the unit's grid",
      result: `multiples of ${px(half)}`,
      delta:
        off.length === 0
          ? undefined
          : `off grid: ${off.map(([n, v]) => `${n} ${px(v)}`).join(", ")}`,
    })
  }
}
