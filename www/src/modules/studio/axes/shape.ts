/* Shape — one base length scales the whole radius ladder; a character picks
   which rung each role of component wears.

   Engine: `--radius` is the base every `--radius-*` rung derives from
   (base/theme.css). The role vars (roles.css) point each role at a rung —
   five picked, the rest derived — and every component's `--studio-<c>-radius`
   points at a role. On publish the chain resolves to a plain utility per
   component — `rounded-md`, `rounded-xl` — and a role at None ships no
   rounded class at all. */

import type { Resolved, StudioState } from "./index"

export const SHAPE_DEFAULTS = {
  /** The base radius — the lg rung (popover · menu), in px. */
  radiusPx: 10,
  roleControl: "md",
  roleItem: "auto",
  roleSurface: "lg",
  rolePanel: "xl",
  roleCard: "auto",
}

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

export const SHAPE_ROLES = [
  { key: "rolePanel", label: "Panels", example: "dialog · drawer" },
  { key: "roleCard", label: "Cards", example: "card · bubble" },
  { key: "roleSurface", label: "Surfaces", example: "popover · menu" },
  { key: "roleControl", label: "Controls", example: "button · input" },
  { key: "roleItem", label: "Items", example: "menu item" },
] as const

export type ShapeRoleKey = (typeof SHAPE_ROLES)[number]["key"]
export type ShapeVector = Record<ShapeRoleKey, string>

/* Curated role vectors, one per shadcn/create style at a 10px base, each
   rung the nearest to that style's px: Square = lyra, Crisp = vega,
   Standard = mira, Gentle = nova, Soft = rhea, Round = luma. Items and cards
   default to 'auto' (see roleRung). */
export const SHAPE_CHARACTERS: Array<{
  id: string
  label: string
  vector: ShapeVector
}> = [
  {
    id: "square",
    label: "Square",
    vector: {
      roleControl: "none",
      roleItem: "none",
      roleSurface: "none",
      rolePanel: "none",
      roleCard: "auto",
    },
  },
  {
    id: "crisp",
    label: "Crisp",
    vector: {
      roleControl: "md",
      roleItem: "auto",
      roleSurface: "md",
      rolePanel: "xl",
      roleCard: "auto",
    },
  },
  {
    id: "standard",
    label: "Standard",
    vector: {
      roleControl: "md",
      roleItem: "auto",
      roleSurface: "lg",
      rolePanel: "xl",
      roleCard: "auto",
    },
  },
  {
    id: "gentle",
    label: "Gentle",
    vector: {
      roleControl: "lg",
      roleItem: "auto",
      roleSurface: "lg",
      rolePanel: "xl",
      roleCard: "auto",
    },
  },
  {
    id: "soft",
    label: "Soft",
    vector: {
      roleControl: "2xl",
      roleItem: "auto",
      roleSurface: "2xl",
      rolePanel: "2xl",
      roleCard: "auto",
    },
  },
  {
    id: "round",
    label: "Round",
    vector: {
      roleControl: "3xl",
      // luma's items (18px) and menus (22px) both land on 2xl.
      roleItem: "2xl",
      roleSurface: "2xl",
      rolePanel: "3xl",
      roleCard: "auto",
    },
  },
]

export const rungIndex = (id: string) =>
  SHAPE_RUNGS.findIndex((rung) => rung.id === id)

/** The character whose vector matches the roles, or undefined when custom. */
export function activeCharacter(state: StudioState): string | undefined {
  return SHAPE_CHARACTERS.find((character) =>
    SHAPE_ROLES.every(({ key }) => character.vector[key] === state[key]),
  )?.id
}

const rungAt = (index: number) =>
  SHAPE_RUNGS[Math.min(Math.max(index, 0), SHAPE_RUNGS.length - 1)]!.id
const rungBelow = (id: string) => rungAt(rungIndex(id) - 1)
const rungAbove = (id: string) => rungAt(rungIndex(id) + 1)
const minRung = (a: string, b: string) => (rungIndex(a) <= rungIndex(b) ? a : b)
const atLeast = (id: string, floor: string) => rungIndex(id) >= rungIndex(floor)

/** A role's rung id with 'auto' resolved. Items ride one rung below
 *  Surfaces; cards ride Panels, one rung lower when controls sit below
 *  surfaces (mira) — true of every shadcn style. */
export function roleRung(state: StudioState, key: ShapeRoleKey): string {
  const id = state[key]
  if (id !== "auto") return id
  if (key === "roleItem") return rungBelow(state.roleSurface)
  const panel = state.rolePanel
  return rungIndex(state.roleControl) < rungIndex(state.roleSurface)
    ? rungBelow(panel)
    : panel
}

/* Radii that follow the roles without being picked:
   - control-sm: xs buttons step one rung down only when controls are ≤ lg
     under ≥ lg surfaces (mira, nova); vega and the rounder styles don't.
   - detail: checkbox, date segment — capped at sm.
   - small: kbd, tags — sm, or the control rung (≤ 2xl) once controls are
     big enough that shadcn turns them into pills.
   - pill: badge, slider, progress — square with square controls.
   - field: multi-line fields, choice cards, toast, blocks — never rounder
     than controls or surfaces.
   - container: in-page containers (alert, tabs list) — one rung above
     surfaces, up to lg.
   - inline-item: in-page items (tab, sidebar item, tooltip) — one rung
     above items, up to md. */
function derivedRungs(state: StudioState): Record<string, string> {
  const control = roleRung(state, "roleControl")
  const item = roleRung(state, "roleItem")
  const surface = roleRung(state, "roleSurface")
  const detail = minRung(control, "sm")
  const upTo = (id: string, cap: string) =>
    id === "none" || atLeast(id, cap) ? id : minRung(rungAbove(id), cap)
  return {
    "--studio-radius-control-sm":
      control !== "none" && !atLeast(control, "xl") && atLeast(surface, "lg")
        ? rungBelow(control)
        : control,
    "--studio-radius-detail": detail,
    "--studio-radius-small": atLeast(control, "2xl")
      ? minRung(control, "2xl")
      : detail,
    "--studio-radius-pill": control === "none" ? "none" : "full",
    "--studio-radius-field": minRung(control, surface),
    "--studio-radius-container": upTo(surface, "lg"),
    "--studio-radius-inline-item": upTo(item, "md"),
  }
}

/** A role's ratio of the base. */
export function roleRatio(state: StudioState, key: ShapeRoleKey): number {
  return SHAPE_RUNGS[rungIndex(roleRung(state, key))]?.ratio ?? 1
}

/** A role's resolved radius in px. Pill clamps to a value large enough to
 *  round any control we specimen. */
export function roleRadiusPx(state: StudioState, key: ShapeRoleKey): number {
  const ratio = roleRatio(state, key)
  return ratio === Infinity ? 999 : state.radiusPx * ratio
}

const ROLE_VARS: Record<ShapeRoleKey, string> = {
  roleControl: "--studio-radius-control",
  roleItem: "--studio-radius-item",
  roleSurface: "--studio-radius-surface",
  rolePanel: "--studio-radius-panel",
  roleCard: "--studio-radius-card",
}

export function resolveShape(state: StudioState): Resolved {
  const tokens: Record<string, string> = {}
  if (state.radiusPx !== SHAPE_DEFAULTS.radiusPx)
    tokens["--radius"] = `${state.radiusPx / 16}rem`
  for (const role of SHAPE_ROLES) {
    const rung = roleRung(state, role.key)
    const defaultRung = roleRung(SHAPE_DEFAULTS as StudioState, role.key)
    if (rung !== defaultRung)
      tokens[ROLE_VARS[role.key]] =
        SHAPE_RUNGS[rungIndex(rung)]?.token ?? "var(--radius-md)"
  }
  const defaults = derivedRungs(SHAPE_DEFAULTS as StudioState)
  for (const [name, rung] of Object.entries(derivedRungs(state))) {
    if (rung !== defaults[name])
      tokens[name] = SHAPE_RUNGS[rungIndex(rung)]?.token ?? "0"
  }
  return { tokens }
}
