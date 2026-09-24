/* Shape — one base length scales the whole radius ladder; a character picks
   which rung each role of component wears.

   Engine: `--radius` is the base every `--radius-*` rung derives from
   (base/theme.css). The four role vars (roles.css) point each role at a rung,
   and every component's `--studio-<c>-radius` points at a role. On publish
   the chain resolves to a plain utility per component — `rounded-md`,
   `rounded-xl` — and a role at None ships no rounded class at all. */

import type { Resolved, StudioState } from "./index"
import type { AxisSpec, ChapterSpec } from "./spec"

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
   study at a 10px base: Square ≈ lyra/sera, Crisp ≈ vega, Standard ≈ mira,
   Soft ≈ rhea, Round ≈ luma/maia. Items default to 'auto' = one rung below
   Surfaces — true of every rounded shadcn style. */
export const SHAPE_CHARACTERS: Array<{
  id: string
  label: string
  description: string
  vector: ShapeVector
}> = [
  {
    id: "square",
    label: "Square",
    description:
      "Every corner square — Carbon buttons, or Radix Themes at radius none.",
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
    description:
      "Controls and surfaces on the md rung, panels on xl: tight corners with rounder dialogs.",
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
    description:
      "Controls md, surfaces lg, panels xl — each container one step rounder than what it holds.",
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
    description:
      "Controls, surfaces and panels all on 2xl: large, even rounding.",
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
    description:
      "Controls, surfaces and panels all on 3xl: at the default base, " +
      "controls round into capsules and cards get very soft corners.",
    vector: {
      roleControl: "3xl",
      roleItem: "auto",
      roleSurface: "2xl",
      rolePanel: "3xl",
    },
  },
  {
    id: "pill",
    label: "Pill",
    description:
      "Capsule controls over rounded surfaces and panels — Radix Themes at radius full.",
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

const rungBelow = (id: string) =>
  SHAPE_RUNGS[Math.max(0, rungIndex(id) - 1)]?.id ?? "none"

/** A role's rung id with 'auto' resolved: Items ride one rung below Surfaces. */
export function roleRung(state: StudioState, key: ShapeRoleKey): string {
  const id = state[key]
  return id === "auto" ? rungBelow(state.roleSurface) : id
}

/* Radii that follow Controls without being a role of their own: small
   controls step one rung down, details (checkbox, kbd) cap at sm, and pills
   (badge, slider) go square with square controls — as lyra/sera do. */
function derivedRungs(state: StudioState): Record<string, string> {
  const control = roleRung(state, "roleControl")
  return {
    "--studio-radius-control-sm": rungBelow(control),
    "--studio-radius-detail":
      rungIndex(control) < rungIndex("sm") ? control : "sm",
    "--studio-radius-pill": control === "none" ? "none" : "full",
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

const RUNG_OPTIONS = SHAPE_RUNGS.map(({ id, label, ratio }) => ({
  value: id,
  label,
  description:
    ratio === 0
      ? "Square corners."
      : ratio === Infinity
        ? "Fully rounded ends — a capsule."
        : `${ratio}× the base radius.`,
}))

const role = (label: string, wears: string, guidance: string): AxisSpec => ({
  label,
  description: `Which rung of the radius ladder ${wears} wear.`,
  value: { type: "enum", options: RUNG_OPTIONS },
  guidance,
})

export const SHAPE_SPEC = {
  label: "Shape",
  description:
    "Corner radius. One base length scales a ladder of rungs (xs … 3xl, " +
    "pill); four roles pick a rung each, so nested corners stay concentric.",
  axes: {
    radiusPx: {
      label: "Base radius",
      description:
        "The lg rung in px — popovers and menus at the Standard character. " +
        "Every other rung is a ratio of it.",
      value: { type: "number", unit: "px", ...RADIUS_RANGE },
      guidance:
        "Checked defaults: Fluent 2 4px, Ant Design and Primer 6px, HeroUI " +
        "and Mantine 8px, shadcn/ui 10px. HeroUI derives the same xs–4xl " +
        "ratio ladder from one --radius. 6–8px reads crisp and tool-like, " +
        "12px+ soft and consumer. Go square with the roles, not with a low " +
        "base.",
    },
    rolePanel: role(
      "Panels",
      "dialogs, cards and sheets",
      "Checked dialogs: Radix Themes 12px, shadcn/ui 14px, Spectrum 2 16px, " +
        "HeroUI 24px, Material 3 28px. In the four where menus were also " +
        "measured, dialogs are rounder than menus.",
    ),
    roleSurface: role(
      "Surfaces",
      "popovers, menus and toasts",
      "Checked menus and popovers: Material 3 and Fluent 2 4px, Radix " +
        "Themes 8px, shadcn/ui and Spectrum 2 10px, Primer 12px.",
    ),
    roleControl: role(
      "Controls",
      "buttons, inputs, selects and toggles",
      "Systems split three ways: square (Carbon), a small radius (Fluent 2 " +
        "4px, Primer 6px, Mantine 8px, shadcn/ui 10px), or capsules " +
        "(Spectrum 2, Material 3, HeroUI). Material 3 pairs pill buttons " +
        "with 4px menus, so controls can sit above surfaces on the ladder.",
    ),
    roleItem: {
      ...role(
        "Items",
        "menu items, list rows and options",
        "In shadcn/ui and Radix Themes a menu item sits below its menu's " +
          "radius (shadcn/ui one rung, Radix Themes half the radius), so " +
          "the item's corner nests inside the menu's padding. Auto keeps " +
          "that relation when Surfaces changes.",
      ),
      value: {
        type: "enum",
        options: [
          {
            value: "auto",
            label: "Auto",
            description:
              "One rung below Surfaces, so an item nests concentrically in " +
              "its menu.",
          },
          ...RUNG_OPTIONS,
        ],
      },
    },
  },
  recipes: SHAPE_CHARACTERS.map(({ id, label, description, vector }) => ({
    id,
    label,
    description,
    set: vector,
  })),
} satisfies ChapterSpec<typeof SHAPE_DEFAULTS>
