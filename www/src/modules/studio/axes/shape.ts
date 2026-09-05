/* Shape — the radius model from the shadcn-styles study (#575): a base length
   scaling the whole ladder, plus a role→rung vector where a style's shape
   identity actually lives. Corner shape is its own axis.

   Engine: `--radius` is the base every `--radius-*` rung derives from; the
   four role vars (roles.css) retarget rungs per role, and the publisher
   resolves the whole chain to plain `rounded-*` utilities on export.
   `--corner-shape` rides on every rounded box through base.css. */

import type { CSSProperties } from "react"

import type { Resolved, StudioState } from "./index"

export const SHAPE_DEFAULTS = {
  /** The base radius — the lg rung (popover · menu), in px. */
  radiusPx: 10,
  cornerShape: "round",
  roleControl: "md",
  roleItem: "auto",
  roleSurface: "lg",
  rolePanel: "xl",
}

// CSS corner-shape values (progressive enhancement; unsupported → round).
export const CORNER_SHAPE_OPTIONS = [
  { value: "round", label: "Round" },
  { value: "squircle", label: "Squircle" },
  { value: "bevel", label: "Bevel" },
]

/* Rung ratios = the #575 ladder. `token` is what a role var points at. */
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

/* Curated role vectors — the 80% path. Each maps to a family from the study
   (at a 10px base): Square ≈ lyra/sera, Crisp ≈ mira/vega, Standard = dotUI
   today (nova puts controls one rung up), Soft ≈ rhea, Round ≈ luma/maia.
   Items default to 'auto' = one rung below Surfaces — true of every rounded
   shadcn style without exception. */
export const SHAPE_CHARACTERS: Array<{
  id: string
  label: string
  vector: Record<ShapeRoleKey, string>
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

/* corner-shape is progressive enhancement — unsupported browsers render round. */
export const cornerShapeStyle = (shape: string): CSSProperties =>
  shape === "round" ? {} : ({ cornerShape: shape } as CSSProperties)

const rungIndex = (id: string) => SHAPE_RUNGS.findIndex((r) => r.id === id)

/** A role's rung id with 'auto' resolved: Items ride one rung below Surfaces —
 *  the invariant every rounded shadcn style follows. */
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

/** A role's resolved radius in px — what every other section reads. Pill
 *  clamps to a value large enough to round any control we specimen. */
export function roleRadiusPx(state: StudioState, key: ShapeRoleKey): number {
  const ratio = roleRatio(state, key)
  return ratio === Infinity ? 999 : state.radiusPx * ratio
}

export const controlRadiusPx = (state: StudioState) =>
  roleRadiusPx(state, "roleControl")

const ROLE_VARS: Record<ShapeRoleKey, string> = {
  roleControl: "--radius-control",
  roleItem: "--radius-item",
  roleSurface: "--radius-surface",
  rolePanel: "--radius-panel",
}

export const WIRED = true

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
  if (state.cornerShape !== "round")
    tokens["--corner-shape"] = state.cornerShape
  return { tokens }
}
