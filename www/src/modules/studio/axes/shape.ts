/* Shape — one base length scales the whole radius ladder; a character picks
   which rung each role of component wears.

   Engine: `--radius` is the base every `--radius-*` rung derives from
   (base/theme.css). The four role vars (roles.css) point each role at a rung,
   and every component's `--studio-<c>-radius` points at a role. On publish
   the chain resolves to a plain utility per component — `rounded-md`,
   `rounded-xl` — and a role at None ships no rounded class at all. */

import type { Resolved, StudioState } from "./index"

export const SHAPE_DEFAULTS = {
  /** The base radius — the lg rung (popover · menu), in px. */
  radiusPx: 10,
  roleControl: "md",
  roleItem: "auto",
  roleSurface: "lg",
  rolePanel: "xl",
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
  { key: "rolePanel", label: "Panels", example: "dialog · card" },
  { key: "roleSurface", label: "Surfaces", example: "popover · menu" },
  { key: "roleControl", label: "Controls", example: "button · input" },
  { key: "roleItem", label: "Items", example: "menu item" },
] as const

export type ShapeRoleKey = (typeof SHAPE_ROLES)[number]["key"]
export type ShapeVector = Record<ShapeRoleKey, string>

/* Curated role vectors — the 80% path, each a family from the shadcn-styles
   study at a 10px base: Square ≈ lyra/sera, Crisp ≈ mira/vega, Standard =
   dotUI today, Soft ≈ rhea, Round ≈ luma/maia. Items default to 'auto' = one
   rung below Surfaces — true of every rounded shadcn style. */
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
    },
  },
  {
    id: "round",
    label: "Round",
    vector: {
      roleControl: "3xl",
      roleItem: "auto",
      roleSurface: "3xl",
      rolePanel: "3xl",
    },
  },
  {
    id: "pill",
    label: "Pill",
    vector: {
      roleControl: "full",
      roleItem: "auto",
      roleSurface: "lg",
      rolePanel: "xl",
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

/** A role's rung id with 'auto' resolved: Items ride one rung below Surfaces. */
export function roleRung(state: StudioState, key: ShapeRoleKey): string {
  const id = state[key]
  if (id !== "auto") return id
  const below = Math.max(0, rungIndex(state.roleSurface) - 1)
  return SHAPE_RUNGS[below]?.id ?? "none"
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
  return { tokens }
}
