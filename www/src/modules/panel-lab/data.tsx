"use client"

/* Panel Lab shared data — the design-system state shape, control options and
   component clusters every panel exploration reads. Derived from the real
   builder schema (create/panel/schema.tsx + registry meta params). */

import { LoaderCircleIcon, LoaderIcon } from "lucide-react"

import { DEFAULT_BODY_FAMILY, DEFAULT_MONO_FAMILY } from "@/lib/fonts"
import {
  ComponentRow,
  MiniSegmented,
  ParamRow,
} from "@/modules/control-lab/rows"
import type {
  SegmentedRowOption,
  OptionGridItem,
} from "@/modules/control-lab/rows"

import { DetailRow } from "./patterns"

/* --------------------------------- Options -------------------------------- */

export const PRIMARY_OPTIONS = [
  { value: "neutral", label: "Neutral" },
  { value: "accent", label: "Accent" },
]

/** Draft-only (drafts/surfaces-562): overlay material for menus/popovers. */
export const OVERLAY_OPTIONS: SegmentedRowOption[] = [
  { value: "solid", label: "Solid" },
  { value: "glass", label: "Glass" },
]

export const ICON_LIBRARY_OPTIONS = [
  { value: "lucide", label: "Lucide" },
  { value: "phosphor", label: "Phosphor" },
  { value: "tabler", label: "Tabler" },
  { value: "remix", label: "Remix" },
]

export const ICON_WEIGHT_OPTIONS = [
  { value: "thin", label: "Thin" },
  { value: "light", label: "Light" },
  { value: "regular", label: "Regular" },
  { value: "bold", label: "Bold" },
  { value: "fill", label: "Fill" },
  { value: "duotone", label: "Duotone" },
]

export const DENSITY_OPTIONS = [
  { value: "compact", label: "Compact" },
  { value: "default", label: "Default" },
  { value: "comfortable", label: "Cozy" },
]

// CSS corner-shape values (progressive enhancement; unsupported → round).
export const CORNER_SHAPE_OPTIONS = [
  { value: "round", label: "Round" },
  { value: "squircle", label: "Squircle" },
  { value: "bevel", label: "Bevel" },
]

/* Shape roles — the second radius lever. The shadcn-styles study (Aug 2026)
   showed a style's shape identity is a role→rung vector over stable component
   groups; the base --radius only scales it. Rung ratios = the #575 ladder. */
export const SHAPE_RUNGS = [
  { id: "none", label: "None", ratio: 0 },
  { id: "xs", label: "xs", ratio: 0.25 },
  { id: "sm", label: "sm", ratio: 0.5 },
  { id: "md", label: "md", ratio: 0.75 },
  { id: "lg", label: "lg", ratio: 1 },
  { id: "xl", label: "xl", ratio: 1.5 },
  { id: "2xl", label: "2xl", ratio: 2 },
  { id: "3xl", label: "3xl", ratio: 3 },
  { id: "full", label: "Pill", ratio: Infinity },
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

export const CURSOR_OPTIONS = [
  "default",
  "pointer",
  "not-allowed",
  "wait",
  "progress",
  "text",
  "grab",
].map((c) => ({ value: c, label: c }))

/* Shadow family presets — one decision that sets the overlay, card and control
   shadows together, previewed as actual shadowed tiles. */
function ShadowTile({ boxShadow }: { boxShadow?: string }) {
  return (
    <span
      className="h-9 w-full max-w-14 rounded-md bg-highlight"
      style={boxShadow ? { boxShadow } : undefined}
    />
  )
}

export const SHADOW_OPTIONS: OptionGridItem[] = [
  { id: "none", label: "None", preview: <ShadowTile /> },
  {
    id: "crisp",
    label: "Crisp",
    preview: <ShadowTile boxShadow="0 1px 2px rgb(0 0 0 / 0.5)" />,
  },
  {
    id: "soft",
    label: "Soft",
    preview: <ShadowTile boxShadow="0 6px 16px -4px rgb(0 0 0 / 0.5)" />,
  },
  {
    id: "floating",
    label: "Floating",
    preview: <ShadowTile boxShadow="0 14px 32px -6px rgb(0 0 0 / 0.65)" />,
  },
]

/* Mini specimens for the component style grids — the real components at
   their default size (density default, size md), as spans: a button can't
   nest in the card's toggle button. */
function MiniButton({ className }: { className: string }) {
  return (
    <span
      className={`flex h-8 items-center rounded-(--btn-radius) px-2.5 text-sm font-medium ${className}`}
    >
      Button
    </span>
  )
}

function MiniInput({ className }: { className: string }) {
  return (
    <span
      className={`flex h-8 w-full min-w-0 items-center px-2.5 text-sm text-fg-muted ${className}`}
    >
      Value
    </span>
  )
}

export const BUTTON_STYLES: OptionGridItem[] = [
  {
    id: "solid",
    label: "Solid",
    preview: <MiniButton className="bg-primary text-fg-on-primary" />,
  },
  {
    id: "soft",
    label: "Soft",
    preview: <MiniButton className="bg-neutral text-fg-on-neutral" />,
  },
  {
    id: "outline",
    label: "Outline",
    preview: <MiniButton className="border border-border-field text-fg" />,
  },
  { id: "quiet", label: "Quiet", preview: <MiniButton className="text-fg" /> },
]

/* Real enum: outline | line | filled-line-bottom | filled (input/meta.ts). */
export const INPUT_STYLES: OptionGridItem[] = [
  {
    id: "outline",
    label: "Outline",
    preview: (
      <MiniInput className="rounded-(--input-radius) border border-border-field bg-field" />
    ),
  },
  {
    id: "line",
    label: "Line",
    preview: <MiniInput className="border-b border-border-field" />,
  },
  {
    id: "filled-line-bottom",
    label: "Filled line",
    preview: (
      <MiniInput className="rounded-t-(--input-radius) border-b border-border-field bg-neutral" />
    ),
  },
  {
    id: "filled",
    label: "Filled",
    preview: <MiniInput className="rounded-(--input-radius) bg-neutral" />,
  },
]

/* Real enum: default | tasnim (card/meta.ts). */
export const CARD_STYLES: OptionGridItem[] = [
  {
    id: "default",
    label: "Default",
    preview: <span className="h-9 w-16 rounded-md border border-border" />,
  },
  {
    id: "tasnim",
    label: "Tasnim",
    preview: (
      <span className="h-9 w-16 rounded-md bg-muted shadow-[0_6px_16px_rgb(0_0_0/0.45)]" />
    ),
  },
]

/* Real enum: spinner | ring (loader/meta.ts). */
export const LOADER_STYLES: OptionGridItem[] = [
  {
    id: "spinner",
    label: "Spinner",
    preview: <LoaderIcon className="size-5 text-fg-muted" />,
  },
  {
    id: "ring",
    label: "Ring",
    preview: <LoaderCircleIcon className="size-5 text-fg-muted" />,
  },
]

export const RADIUS_PARAM_OPTIONS: SegmentedRowOption[] = [
  { value: "auto", label: "Auto" },
  { value: "sharp", label: "Sharp" },
  { value: "round", label: "Round" },
  { value: "pill", label: "Pill" },
]

export const HOVER_PARAM_OPTIONS: SegmentedRowOption[] = [
  { value: "none", label: "None" },
  { value: "dim", label: "Dim" },
  { value: "lift", label: "Lift" },
]

export const TOKEN_RADIUS_OPTIONS: SegmentedRowOption[] = [
  { value: "sharp", label: "Sharp" },
  { value: "sm", label: "Sm" },
  { value: "md", label: "Md" },
  { value: "lg", label: "Lg" },
]

export const BLUR_OPTIONS: SegmentedRowOption[] = [
  { value: "none", label: "None" },
  { value: "sm", label: "Sm" },
  { value: "md", label: "Md" },
]

export const BACKDROP_OPTIONS: SegmentedRowOption[] = [
  { value: "20", label: "20%" },
  { value: "40", label: "40%" },
  { value: "60", label: "60%" },
]

export const ACCENT_POOL = [
  "#635BFF",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#F97316",
  "#10B981",
]

export function labelOf(
  options: { value: string; label: React.ReactNode }[],
  value: string,
): React.ReactNode {
  return options.find((o) => o.value === value)?.label ?? value
}

/* ---------------------------------- Modes ---------------------------------- */

/**
 * A color mode — one named scheme in the user's set (1..n), not a light/dark
 * boolean. A mode is the same seeds resolved under different conditions:
 * polarity (ramp direction + prefers-color-scheme bucket), background
 * lightness, and a contrast level. Working color section only; v1 keeps the
 * fixed light/dark pair.
 */
export interface LabMode {
  id: string
  name: string
  polarity: "light" | "dark"
  /** Background L*; 0 on a dark mode = OLED black. */
  bg: number
  contrast: "default" | "high"
}

const DEFAULT_MODES: LabMode[] = [
  {
    id: "light",
    name: "Light",
    polarity: "light",
    bg: 99,
    contrast: "default",
  },
  { id: "dark", name: "Dark", polarity: "dark", bg: 2, contrast: "default" },
]

/* ---------------------------------- State ---------------------------------- */

export const DEFAULTS = {
  // Color — the engine-true section. Mirrors ColorConfig: '' on a seed means
  // Auto (absent from the config), 0 on a border means unmeasured.
  brand: "#635BFF",
  primary: "neutral",
  graySeed: "",
  successSeed: "",
  warningSeed: "",
  dangerSeed: "",
  infoSeed: "",
  selectionSeed: "",
  bgLight: 99,
  bgDark: 2,
  vividness: 1,
  hueShift: 1,
  grayTintAmount: 1,
  preserveSeed: false,
  guarantees: "default",
  borderContrast: false,
  border400: 0,
  border500: 0,
  border600: 0,
  // Color modes (working section) — the user-defined scheme set. Edits must
  // replace the array (never mutate) so reference-diffing sees them.
  modes: DEFAULT_MODES,
  defaultMode: "light",
  // Draft-only state (see drafts/) — keys the open section PRs introduced.
  // Drafts on the same section are alternatives, so where two chose the same
  // name for different things the numeric one is suffixed (headingTrackingEm).
  overlayMaterial: "solid",
  headingWeight: "600",
  headingTracking: "normal",
  headingTrackingEm: 0,
  baseSize: 16,
  typeScale: "1.25",
  typeBase: 16,
  typeRatio: "1.2",
  bodyLeading: 1.5,
  iconStrokeAuto: true,
  iconScale: 1,
  // Typography
  headingFont: DEFAULT_BODY_FAMILY,
  bodyFont: DEFAULT_BODY_FAMILY,
  monoFont: DEFAULT_MONO_FAMILY,
  // Icons
  iconLibrary: "lucide",
  iconStroke: 2,
  iconWeight: "regular",
  // Shape
  radius: 1,
  // v2: the #575 model — radius is a length (the base, = a card's radius) —
  // plus the role vector from the shadcn study (Standard = dotUI today).
  radiusPx: 10,
  cornerShape: "round",
  roleControl: "md",
  roleItem: "auto",
  roleSurface: "lg",
  rolePanel: "xl",
  density: "default",
  // Effects
  shadows: "soft",
  cursorInteractive: "default",
  cursorDisabled: "not-allowed",
  // Components (real registry params where they exist)
  buttonStyle: "solid",
  buttonRadius: "auto",
  buttonHover: "dim",
  inputStyle: "outline",
  checkboxRadius: "sm",
  cardStyle: "default",
  badgeRadius: "md",
  modalStyle: "default",
  modalBlur: "sm",
  modalBackdrop: "40",
  modalRadius: "lg",
  tooltipSurface: "default",
  tooltipRadius: "sm",
  menuHighlight: "subtle",
  loaderStyle: "spinner",
}

export type LabState = typeof DEFAULTS

export interface Lab {
  state: LabState
  set: <K extends keyof LabState>(key: K) => (value: LabState[K]) => void
  section: (keys: (keyof LabState)[]) => {
    modified: boolean
    onReset: () => void
  }
}

export const COLOR_KEYS: (keyof LabState)[] = [
  "brand",
  "primary",
  "graySeed",
  "successSeed",
  "warningSeed",
  "dangerSeed",
  "infoSeed",
  "selectionSeed",
  "bgLight",
  "bgDark",
  "vividness",
  "hueShift",
  "grayTintAmount",
  "preserveSeed",
  "guarantees",
  "borderContrast",
  "border400",
  "border500",
  "border600",
]
/** The working color section's slice: v1's keys minus the fixed light/dark
 *  backgrounds, plus the mode set. */
export const WORKING_COLOR_KEYS: (keyof LabState)[] = [
  "brand",
  "primary",
  "graySeed",
  "successSeed",
  "warningSeed",
  "dangerSeed",
  "infoSeed",
  "selectionSeed",
  "modes",
  "defaultMode",
  "vividness",
  "hueShift",
  "grayTintAmount",
  "preserveSeed",
  "guarantees",
  "borderContrast",
  "border400",
  "border500",
  "border600",
]
export const TYPE_KEYS: (keyof LabState)[] = [
  "headingFont",
  "bodyFont",
  "monoFont",
]
export const ICON_KEYS: (keyof LabState)[] = [
  "iconLibrary",
  "iconStroke",
  "iconWeight",
]
export const SHAPE_KEYS: (keyof LabState)[] = ["radius", "density"]
export const SHAPE_KEYS_V2: (keyof LabState)[] = [
  "radiusPx",
  "cornerShape",
  "roleControl",
  "roleItem",
  "roleSurface",
  "rolePanel",
]
export const SPACE_KEYS_V2: (keyof LabState)[] = ["density"]
export const EFFECT_KEYS: (keyof LabState)[] = [
  "shadows",
  "cursorInteractive",
  "cursorDisabled",
]
export const COMPONENT_KEYS: (keyof LabState)[] = [
  "buttonStyle",
  "buttonRadius",
  "buttonHover",
  "inputStyle",
  "checkboxRadius",
  "cardStyle",
  "badgeRadius",
  "modalStyle",
  "modalBlur",
  "modalBackdrop",
  "modalRadius",
  "tooltipSurface",
  "tooltipRadius",
  "menuHighlight",
  "loaderStyle",
]

/* ------------------------------- Components -------------------------------- */

export interface ComponentEntry {
  name: string
  render: (lab: Lab) => React.ReactNode
}

export interface Cluster {
  label: string
  caption?: string
  items: ComponentEntry[]
}

export const CLUSTERS: Cluster[] = [
  {
    label: "Buttons",
    caption: "Styles apply to the synced group — Toggle Button follows Button.",
    items: [
      {
        name: "Button",
        render: (lab) => (
          <ComponentRow
            name="Button"
            value={lab.state.buttonStyle}
            onChange={lab.set("buttonStyle")}
            options={BUTTON_STYLES}
          >
            <ParamRow label="Radius">
              <MiniSegmented
                ariaLabel="Button radius"
                value={lab.state.buttonRadius}
                onChange={lab.set("buttonRadius")}
                options={RADIUS_PARAM_OPTIONS}
              />
            </ParamRow>
            <ParamRow label="Hover">
              <MiniSegmented
                ariaLabel="Button hover effect"
                value={lab.state.buttonHover}
                onChange={lab.set("buttonHover")}
                options={HOVER_PARAM_OPTIONS}
              />
            </ParamRow>
          </ComponentRow>
        ),
      },
    ],
  },
  {
    label: "Forms",
    items: [
      {
        name: "Input",
        render: (lab) => (
          <ComponentRow
            name="Input"
            value={lab.state.inputStyle}
            onChange={lab.set("inputStyle")}
            options={INPUT_STYLES}
          />
        ),
      },
      {
        name: "Checkbox",
        render: (lab) => (
          <DetailRow
            id="Checkbox"
            label="Checkbox"
            summary={labelOf(TOKEN_RADIUS_OPTIONS, lab.state.checkboxRadius)}
          >
            <ParamRow label="Radius">
              <MiniSegmented
                ariaLabel="Checkbox radius"
                value={lab.state.checkboxRadius}
                onChange={lab.set("checkboxRadius")}
                options={TOKEN_RADIUS_OPTIONS}
              />
            </ParamRow>
          </DetailRow>
        ),
      },
    ],
  },
  {
    label: "Surfaces",
    items: [
      {
        name: "Card",
        render: (lab) => (
          <ComponentRow
            name="Card"
            value={lab.state.cardStyle}
            onChange={lab.set("cardStyle")}
            options={CARD_STYLES}
          />
        ),
      },
      {
        name: "Badge",
        render: (lab) => (
          <DetailRow
            id="Badge"
            label="Badge"
            summary={labelOf(TOKEN_RADIUS_OPTIONS, lab.state.badgeRadius)}
          >
            <ParamRow label="Radius">
              <MiniSegmented
                ariaLabel="Badge radius"
                value={lab.state.badgeRadius}
                onChange={lab.set("badgeRadius")}
                options={TOKEN_RADIUS_OPTIONS}
              />
            </ParamRow>
          </DetailRow>
        ),
      },
    ],
  },
  {
    label: "Overlays",
    items: [
      {
        name: "Modal",
        render: (lab) => (
          <DetailRow
            id="Modal"
            label="Modal"
            summary={lab.state.modalStyle === "default" ? "Default" : "Muted"}
          >
            <ParamRow label="Style">
              <MiniSegmented
                ariaLabel="Modal style"
                value={lab.state.modalStyle}
                onChange={lab.set("modalStyle")}
                options={[
                  { value: "default", label: "Default" },
                  { value: "muted-footer", label: "Muted footer" },
                ]}
              />
            </ParamRow>
            <ParamRow label="Backdrop blur">
              <MiniSegmented
                ariaLabel="Modal backdrop blur"
                value={lab.state.modalBlur}
                onChange={lab.set("modalBlur")}
                options={BLUR_OPTIONS}
              />
            </ParamRow>
            <ParamRow label="Backdrop opacity">
              <MiniSegmented
                ariaLabel="Modal backdrop opacity"
                value={lab.state.modalBackdrop}
                onChange={lab.set("modalBackdrop")}
                options={BACKDROP_OPTIONS}
              />
            </ParamRow>
            <ParamRow label="Radius">
              <MiniSegmented
                ariaLabel="Modal radius"
                value={lab.state.modalRadius}
                onChange={lab.set("modalRadius")}
                options={TOKEN_RADIUS_OPTIONS}
              />
            </ParamRow>
          </DetailRow>
        ),
      },
      {
        name: "Tooltip",
        render: (lab) => (
          <DetailRow
            id="Tooltip"
            label="Tooltip"
            summary={
              lab.state.tooltipSurface === "default" ? "Default" : "Translucid"
            }
          >
            <ParamRow label="Surface">
              <MiniSegmented
                ariaLabel="Tooltip surface"
                value={lab.state.tooltipSurface}
                onChange={lab.set("tooltipSurface")}
                options={[
                  { value: "default", label: "Default" },
                  { value: "translucid", label: "Translucid" },
                ]}
              />
            </ParamRow>
            <ParamRow label="Radius">
              <MiniSegmented
                ariaLabel="Tooltip radius"
                value={lab.state.tooltipRadius}
                onChange={lab.set("tooltipRadius")}
                options={TOKEN_RADIUS_OPTIONS}
              />
            </ParamRow>
          </DetailRow>
        ),
      },
    ],
  },
  {
    label: "Menus & lists",
    items: [
      {
        name: "Menu",
        render: (lab) => (
          <DetailRow
            id="Menu"
            label="Menu"
            summary={lab.state.menuHighlight === "subtle" ? "Subtle" : "Accent"}
          >
            <ParamRow label="Highlight">
              <MiniSegmented
                ariaLabel="Menu highlight"
                value={lab.state.menuHighlight}
                onChange={lab.set("menuHighlight")}
                options={[
                  { value: "subtle", label: "Subtle" },
                  { value: "accent", label: "Accent" },
                ]}
              />
            </ParamRow>
          </DetailRow>
        ),
      },
    ],
  },
  {
    label: "Feedback",
    items: [
      {
        name: "Loader",
        render: (lab) => (
          <ComponentRow
            name="Loader"
            value={lab.state.loaderStyle}
            onChange={lab.set("loaderStyle")}
            options={LOADER_STYLES}
          />
        ),
      },
    ],
  },
]
