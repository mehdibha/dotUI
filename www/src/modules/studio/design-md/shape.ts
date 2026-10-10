import { DEFAULTS } from "../axes"
import { rungIndex, SHAPE_CHARACTERS, SHAPE_RUNGS } from "../axes/shape"
import { DENSITY_TIERS } from "../axes/space"
import {
  add,
  capitalize,
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

const ROLES = ["control", "card", "surface", "panel"] as const
const ROLE_KEY = {
  control: "roleControl",
  card: "roleCard",
  surface: "roleSurface",
  panel: "rolePanel",
} as const
const ROLE_DEFAULT: Record<ShapeRole, string> = {
  control: "md",
  card: "lg",
  surface: "lg",
  panel: "xl",
}
const FIT_RUNGS = SHAPE_RUNGS.filter((rung) => Number.isFinite(rung.ratio))
const TOP_BLOCK_RUNG = "3xl"
const ratioOf = (id: string) => SHAPE_RUNGS[rungIndex(id)]?.ratio ?? 1
const rungAt = (index: number) =>
  SHAPE_RUNGS[clamp(index, 0, SHAPE_RUNGS.length - 1)]?.id ?? "none"
const rungBelow = (id: string) => rungAt(rungIndex(id) - 1)
const rungAbove = (id: string) => rungAt(rungIndex(id) + 1)

// The base and a rung per role that best fit the targets (finite px).
export function fitRadius(targets: RadiusTargets): {
  radius: number
  rungs: Partial<Record<ShapeRole, string>>
} {
  const known = ROLES.flatMap((role) => {
    const target = targets[role]
    return target === undefined ? [] : [{ role, target }]
  })
  let best = {
    cost: Infinity,
    radius: 10,
    rungs: {} as Partial<Record<ShapeRole, string>>,
  }
  for (let k = 4; k <= 40; k++) {
    const radius = k / 2
    const rungs: Partial<Record<ShapeRole, string>> = {}
    let cost = 0.01 * Math.abs(radius - 10)
    for (const { role, target } of known) {
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
const PILL_REF = /^\{rounded\.(pill|full)\}$/i

const isPill = (r: number, height?: number) =>
  r >= 999 || (height !== undefined && height > 0 && r >= height / 2)

function radiusOf(component: Component): number | undefined {
  const r = dim(component.props.rounded)
  if (r === undefined || r < 0) return
  const named =
    typeof component.raw.rounded === "string" &&
    PILL_REF.test(component.raw.rounded.trim())
  return named || isPill(r, dim(component.props.height)) ? PILL : r
}

const medianRadius = (list: Component[]) =>
  median(list.map(radiusOf).filter((r): r is number => r !== undefined))

export function mapShape(ctx: Ctx, components: Component[], fam: Families) {
  const { doc, state } = ctx
  const rounded = isRecord(doc.tokens?.rounded) ? doc.tokens.rounded : undefined
  const scaleRadius = (...names: string[]) => {
    const name = names.find((n) => dim(rounded?.[n]) !== undefined)
    const r = name === undefined ? undefined : dim(rounded?.[name])
    if (r === undefined || r < 0) return
    return /^(pill|full)$/i.test(name ?? "") || isPill(r) ? PILL : r
  }
  const fromScale = components.length === 0
  const targets: RadiusTargets = {}
  let buttonTarget: number | undefined
  if (fromScale) {
    if (!rounded) return
    targets.control = scaleRadius("md", "sm")
    targets.card = scaleRadius("lg")
  } else {
    buttonTarget = medianRadius(fam.button)
    // A pill button alone says nothing about fields: buttonRadius covers it.
    targets.control =
      medianRadius(fam.input) ??
      (buttonTarget === PILL ? undefined : buttonTarget)
    targets.card = medianRadius(fam.card)
    targets.surface = medianRadius(fam.surface)
    targets.panel = medianRadius(fam.panel)
  }
  const known = ROLES.filter((role) => targets[role] !== undefined)
  const exactness = (exact: boolean) => statusOf(exact && !fromScale)
  const note = fromScale ? " (from the rounded scale)" : ""

  let radius: number = DEFAULTS.radiusPx
  // The square vector squares every role, so it needs the controls' word too.
  if (known.includes("control") && known.every((r) => targets[r] === 0)) {
    const square = SHAPE_CHARACTERS.find((c) => c.id === "square")?.vector
    Object.assign(state, square)
    // The control row also owns the roles the file doesn't size.
    const others = Object.keys(square ?? {}).filter(
      (key) => !known.some((role) => ROLE_KEY[role] === key),
    ) as (keyof typeof state)[]
    for (const role of known)
      add(ctx, exactness(true), "shape", {
        id: `radius:${role}`,
        label: `Square ${role}s${note}`,
        keys:
          role === "control" ? [ROLE_KEY[role], ...others] : [ROLE_KEY[role]],
        value: "0px",
        result: "None",
      })
  } else if (known.length > 0) {
    const fitTargets: RadiusTargets = {}
    for (const role of known) {
      const target = targets[role]
      if (target !== PILL) fitTargets[role] = target
      else if (role === "control") {
        state.roleControl = "full"
        add(ctx, exactness(true), "shape", {
          id: "radius:control",
          label: `Pill controls${note}`,
          keys: ["roleControl"],
          value: "pill",
          result: "Pill",
        })
      } else
        add(ctx, "unmapped", "shape", {
          id: `radius:${role}`,
          label: `Pill ${role}s: blocks never take the pill rung`,
          keys: [ROLE_KEY[role]],
          value: "pill",
        })
    }

    if (Object.keys(fitTargets).length > 0) {
      const fit = fitRadius(fitTargets)
      radius = fit.radius
      state.radiusPx = radius
      add(ctx, exactness(true), "shape", {
        id: "radius:base",
        label: `Radius base${note}`,
        keys: ["radiusPx"],
        result: px(radius),
      })
      const { control, card, surface, panel } = fit.rungs
      if (control) state.roleControl = control
      if (surface) state.roleSurface = surface
      if (panel) state.rolePanel = panel
      else if (card)
        state.rolePanel =
          card === "none" || card === TOP_BLOCK_RUNG ? card : rungAbove(card)
      // Auto only when the rung below the panel is the fitted card.
      if (card)
        state.roleCard =
          card === rungBelow(state.rolePanel ?? DEFAULTS.rolePanel)
            ? "auto"
            : card
      for (const role of ROLES) {
        const rung = fit.rungs[role]
        const target = fitTargets[role]
        if (!rung || target === undefined) continue
        const fitted = radius * ratioOf(rung)
        const exact = Math.abs(fitted - target) <= 0.5
        // Without a panel target, the panel follows the card a rung up.
        const derived = role === "card" && !panel
        add(ctx, exactness(exact), "shape", {
          id: `radius:${role}`,
          label: `${capitalize(role)} radius${derived ? ", panels follow" : ""}${note}`,
          keys: derived ? ["roleCard", "rolePanel"] : [ROLE_KEY[role]],
          value: px(target),
          result: rung,
          delta: exact ? undefined : `${px(fitted)} vs ${px(target)}`,
        })
      }
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
      if (v === undefined || v <= 0 || v >= 999) continue
      if (/^(pill|full)$/i.test(name)) continue
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

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))

function normalizeUnit(unit: number): number | undefined {
  if (!(unit > 0) || !Number.isFinite(unit)) return
  let u = unit
  while (u < 3) u *= 2
  while (u > 6) u /= 2
  return round(u, 0.25)
}

// The tier and spacing unit whose md control lands nearest `height`.
export function fitDensity(
  height: number,
  scaleUnit?: number,
): { density: string; unit: number; control: number } {
  let best = { cost: Infinity, density: "default", unit: 4, control: 32 }
  for (const tier of DENSITY_TIERS) {
    for (let k = 12; k <= 24; k++) {
      const unit = k / 4
      const control = tier.control * unit
      const cost =
        Math.abs(control - height) / height +
        (scaleUnit ? Math.abs(unit - scaleUnit) / scaleUnit : 0)
      const better =
        cost < best.cost - 1e-9 ||
        (Math.abs(cost - best.cost) <= 1e-9 &&
          (Math.abs(unit - 4) < Math.abs(best.unit - 4) ||
            (Math.abs(unit - 4) === Math.abs(best.unit - 4) &&
              tier.id === "default")))
      if (better) best = { cost, density: tier.id, unit, control }
    }
  }
  return { density: best.density, unit: best.unit, control: best.control }
}

function controlHeight(fam: Families): number | undefined {
  const heights = (list: Component[]) =>
    median(
      list
        .map((c) => dim(c.props.height))
        .filter((h): h is number => h !== undefined && h > 0),
    )
  const fromInput = heights(fam.input)
  if (fromInput !== undefined) return fromInput
  const fromButton = heights(fam.button.filter((c) => !SIZE_SUFFIX.test(c.key)))
  if (fromButton !== undefined) return fromButton
  const btn = fam.button[0]
  if (!btn) return
  const padding = box(btn.props.padding)
  if (!padding || padding.top + padding.bottom <= 0) return
  const type = isRecord(btn.props.typography) ? btn.props.typography : {}
  const fontSize = dim(btn.props.fontSize ?? type.fontSize)
  if (fontSize === undefined || fontSize <= 0) return
  const lh = btn.props.lineHeight ?? type.lineHeight
  const lineHeight =
    lh === undefined
      ? fontSize * 1.2
      : typeof lh === "number" || /^\d*\.?\d+$/.test(String(lh).trim())
        ? fontSize * Number(lh)
        : (dim(lh) ?? fontSize * 1.2)
  const height =
    padding.top + padding.bottom + lineHeight + (hasBorder(btn.props) ? 2 : 0)
  return Number.isFinite(height) && height > 0 ? height : undefined
}

export function mapSpace(ctx: Ctx, fam: Families) {
  const { doc, state } = ctx
  const spacing = isRecord(doc.tokens?.spacing) ? doc.tokens.spacing : undefined
  const values = spacing
    ? Object.entries(spacing).flatMap(([name, value]) => {
        const v = dim(value)
        return v !== undefined && v > 0 ? [{ name, v }] : []
      })
    : []

  const layout = doc.sections.layout ?? ""
  const stated =
    /base (spacing )?unit[^0-9\n]{0,20}(\d+(?:\.\d+)?)px/i.exec(layout)?.[2] ??
    /(\d+)px (grid|baseline|spacing scale)/i.exec(layout)?.[1]
  let scaleUnit =
    stated === undefined ? undefined : normalizeUnit(Number(stated))
  if (scaleUnit === undefined) {
    const halves = values
      .filter(({ v }) => v <= 128)
      .map(({ v }) => Math.round(v * 2))
      .filter((h) => h > 0)
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
      ({ v }) => Math.abs(v / half - Math.round(v / half)) > 1e-6,
    )
    add(ctx, statusOf(off.length === 0), "space", {
      id: "spacing-scale",
      label: "Spacing scale on the unit's grid",
      result: `multiples of ${px(half)}`,
      delta:
        off.length === 0
          ? undefined
          : `off grid: ${off.map(({ name, v }) => `${name} ${px(v)}`).join(", ")}`,
    })
  }
}
