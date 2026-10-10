/* Shape — one base length scales the whole radius ladder; a character picks
   which rung each role of component wears. Stroke is the width every control
   edge draws at; tracks, whether switch, slider and progress stay round.

   Engine: `--radius` is the base every `--radius-*` rung derives from
   (base/theme.css). The role vars (roles.css) point each role at a rung —
   five picked, the rest derived — and every component's `--studio-<c>-radius`
   points at a role. On publish the chain resolves to a plain utility per
   component — `rounded-md`, `rounded-xl` — and a role at None ships no
   rounded class at all. `--studio-control-stroke` resolves the same way, to
   `border` · `border-2`. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf, range } from "./schema"
import type { ChapterSchema } from "./schema"

export const SHAPE_DEFAULTS = {
  /** The base radius — the lg rung (popover · menu), in px. */
  radiusPx: 10,
  roleControl: "md",
  roleItem: "auto",
  roleSurface: "lg",
  rolePanel: "xl",
  roleCard: "auto",
  controlStroke: "regular",
  tracks: "round",
}

/* Control edges; surfaces keep a 1px hairline unless their edge is Ledge
   (Duolingo's 2px cards). No sub-pixel option: Chromium
   draws a 0.5px border at 1px, so seams and insets would subtract the wrong
   width. */
const STROKE_PX = { regular: 1, bold: 2 }

export const STROKE_VALUES = Object.keys(STROKE_PX) as Array<
  keyof typeof STROKE_PX
>

export const strokePx = (id: string) =>
  STROKE_PX[id as keyof typeof STROKE_PX] ?? 1

export const TRACK_VALUES = ["round", "follow"] as const

/** Where the base slider runs. Square is a character, not a base of 0: at 0
 *  the exported code would still carry rounded classes reading a dead token. */
export const RADIUS_RANGE = { min: 2, max: 20, step: 0.5 }

/* The ladder (#575): every rung a ratio of the base. `token` is what a role
   var points at; None resolves to `0`, which the publisher drops. */
export const SHAPE_RUNGS = [
  { id: "none", label: "None", ratio: 0, token: "0" },
  { id: "xs", label: "xs", ratio: 0.25, token: "var(--radius-xs)" },
  { id: "sm", label: "sm", ratio: 0.5, token: "var(--radius-sm)" },
  { id: "md", label: "md", ratio: 0.75, token: "var(--radius-md)" },
  { id: "lg", label: "lg", ratio: 1, token: "var(--radius-lg)" },
  { id: "xl", label: "xl", ratio: 1.5, token: "var(--radius-xl)" },
  { id: "2xl", label: "2xl", ratio: 2, token: "var(--radius-2xl)" },
  { id: "3xl", label: "3xl", ratio: 3, token: "var(--radius-3xl)" },
  { id: "full", label: "Pill", ratio: Infinity, token: "var(--radius-full)" },
]

const RUNGS = SHAPE_RUNGS.map((rung) => rung.id)
/* Panels and cards hold multi-line content, which is never a pill. */
const BLOCK_RUNGS = RUNGS.filter((rung) => rung !== "full")

export const SHAPE_SCHEMA: ChapterSchema<typeof SHAPE_DEFAULTS> = {
  radiusPx: range(RADIUS_RANGE),
  roleControl: oneOf(RUNGS),
  roleItem: oneOf(["auto", ...RUNGS]),
  roleSurface: oneOf(RUNGS),
  rolePanel: oneOf(BLOCK_RUNGS),
  roleCard: oneOf(["auto", ...BLOCK_RUNGS]),
  controlStroke: oneOf(STROKE_VALUES),
  tracks: oneOf(TRACK_VALUES),
}

export const SHAPE_ROLES = [
  { key: "rolePanel", label: "Panels" },
  { key: "roleCard", label: "Cards" },
  { key: "roleSurface", label: "Surfaces" },
  { key: "roleControl", label: "Controls" },
  { key: "roleItem", label: "Items" },
] as const

export type ShapeRoleKey = (typeof SHAPE_ROLES)[number]["key"]
export type ShapeVector = Record<ShapeRoleKey, string>

export const rungIndex = (id: string) =>
  SHAPE_RUNGS.findIndex((rung) => rung.id === id)

const rungAt = (index: number) =>
  SHAPE_RUNGS[Math.min(Math.max(index, 0), SHAPE_RUNGS.length - 1)]!.id
const rungBelow = (id: string) => rungAt(rungIndex(id) - 1)
const rungAbove = (id: string) => rungAt(rungIndex(id) + 1)
const minRung = (a: string, b: string) => (rungIndex(a) <= rungIndex(b) ? a : b)
const atLeast = (id: string, floor: string) => rungIndex(id) >= rungIndex(floor)

/** A role's rung id with 'auto' resolved: items sit one rung below the
 *  surface they nest in, cards one rung below panels. */
export function roleRung(state: Effective, key: ShapeRoleKey): string {
  const id = state[key]
  if (id !== "auto") return id
  return rungBelow(key === "roleItem" ? state.roleSurface : state.rolePanel)
}

/* Radii that follow the roles without being picked:
   - control-sm: one rung below controls, never square while they're rounded.
   - detail: capped at sm and at control-sm.
   - pill: square with square controls.
   - track: full, or the detail rung when tracks follow corners.
   - field / container / inline-item: multi-line, so never a pill. */
function derivedRungs(state: Effective): Record<string, string> {
  const control = roleRung(state, "roleControl")
  const item = roleRung(state, "roleItem")
  const surface = roleRung(state, "roleSurface")
  const controlSm =
    control === "full" || control === "none"
      ? control
      : rungAt(Math.max(rungIndex(rungBelow(control)), rungIndex("xs")))
  const upTo = (id: string, cap: string) =>
    id === "none" || atLeast(id, cap) ? id : minRung(rungAbove(id), cap)
  const block = (id: string) => minRung(id, "3xl")
  const detail = minRung(minRung(control, "sm"), controlSm)
  return {
    "--studio-radius-control-sm": controlSm,
    "--studio-radius-detail": detail,
    "--studio-radius-pill": control === "none" ? "none" : "full",
    "--studio-radius-track": state.tracks === "follow" ? detail : "full",
    "--studio-radius-field": block(minRung(control, surface)),
    "--studio-radius-container": block(upTo(surface, "lg")),
    "--studio-radius-inline-item": block(upTo(item, "md")),
  }
}

/** A role's ratio of the base. */
export function roleRatio(state: Effective, key: ShapeRoleKey): number {
  return SHAPE_RUNGS[rungIndex(roleRung(state, key))]?.ratio ?? 1
}

/** A role's resolved radius in px. Pill clamps to a value large enough to
 *  round any control we specimen. */
export function roleRadiusPx(state: Effective, key: ShapeRoleKey): number {
  const ratio = roleRatio(state, key)
  return ratio === Infinity ? 999 : state.radiusPx * ratio
}

export const ROLE_VARS: Record<ShapeRoleKey, string> = {
  roleControl: "--studio-radius-control",
  roleItem: "--studio-radius-item",
  roleSurface: "--studio-radius-surface",
  rolePanel: "--studio-radius-panel",
  roleCard: "--studio-radius-card",
}

/** Every role var's token: the five picked roles, then the derived rungs. */
export function shapeVars(state: Effective): Record<string, string> {
  const rungs: Record<string, string> = {}
  for (const role of SHAPE_ROLES)
    rungs[ROLE_VARS[role.key]] = roleRung(state, role.key)
  Object.assign(rungs, derivedRungs(state))
  return Object.fromEntries(
    Object.entries(rungs).map(([name, rung]) => [
      name,
      SHAPE_RUNGS[rungIndex(rung)]?.token ?? "0",
    ]),
  )
}

export function resolveShape(state: Effective): Resolved {
  const tokens: Record<string, string> = {}
  if (state.radiusPx !== SHAPE_DEFAULTS.radiusPx)
    tokens["--radius"] = `${state.radiusPx / 16}rem`
  const defaults = shapeVars(SHAPE_DEFAULTS as Effective)
  for (const [name, token] of Object.entries(shapeVars(state)))
    if (token !== defaults[name]) tokens[name] = token
  if (state.controlStroke !== SHAPE_DEFAULTS.controlStroke)
    tokens["--studio-control-stroke"] = `${strokePx(state.controlStroke)}px`
  return { tokens }
}

export const chapter = defineChapter({
  id: "shape",
  defaults: SHAPE_DEFAULTS,
  schema: SHAPE_SCHEMA,
  resolve: resolveShape,
})
