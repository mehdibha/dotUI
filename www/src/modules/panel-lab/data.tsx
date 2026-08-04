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
  SelectRowOption,
  OptionGridItem,
} from "@/modules/control-lab/rows"

import { DetailRow } from "./patterns"

/* --------------------------------- Options -------------------------------- */

export const PRIMARY_OPTIONS = [
  { value: "neutral", label: "Neutral" },
  { value: "accent", label: "Accent" },
]

/** Overlay material for menus/popovers (Surfaces v2 + drafts/surfaces-562). */
export const OVERLAY_OPTIONS: SegmentedRowOption[] = [
  { value: "solid", label: "Solid" },
  { value: "glass", label: "Glass" },
]

/* Surface delineation recipes — the Surfaces axis (issue #590, the 7-system
   border survey). Hairline, shadow role and dark elevation are traded against
   each other in every surveyed system, so they move as one recipe, never as
   independent knobs. References: Hairline ≈ shadcn/coss, Adaptive ≈ Spectrum
   S2/Geist (shadow-only light, hairline dark), Shadow ≈ HeroUI/Astryx,
   Outline ≈ Linear (solid near-bg step + heavy shadow). */
export const SURFACE_RECIPES = [
  { id: "hairline", label: "Hairline" },
  { id: "adaptive", label: "Adaptive" },
  { id: "shadow", label: "Shadow" },
  { id: "outline", label: "Outline" },
] as const

export type SurfaceRecipeId = (typeof SURFACE_RECIPES)[number]["id"]

/** Hairline ink strength — fg alpha, the survey's observed 5–12% band. */
export const HAIRLINE_OPTIONS: SegmentedRowOption[] = [
  { value: "subtle", label: "Subtle" },
  { value: "default", label: "Default" },
  { value: "strong", label: "Strong" },
]

export const HAIRLINE_ALPHA: Record<string, number> = {
  subtle: 6,
  default: 9,
  strong: 13,
}

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

/* macOS cursor drawings — literal black/white like the real cursors, which
   never theme; the white casing keeps them readable on dark cards. Hand and
   not-allowed geometry is extracted verbatim from the system cursor PDFs
   (HIServices.framework cursors/); the default arrow ships only as a compiled
   SkyLight asset, so its path is traced from an NSCursor.arrow bitmap dump.
   Only the outer fit-to-24-box transforms are ours. */
const ARROW_PATH =
  "M5.32 5 L13 12.7 C13.45 13.15 13.4 13.5 12.95 13.7 L10.45 13.88 C10.05 13.92 9.95 14.05 10 14.35 L11.7 18.9 C11.65 19.55 9.95 19.65 9.8 18.95 L8.15 14.95 C8.05 14.6 7.85 14.55 7.65 14.75 L5.55 16.63 C5.2 16.95 5 16.85 5 16.3 V5.3 C5 4.85 5.12 4.75 5.32 5 Z"

function ArrowCursor() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <g transform="translate(1.03 -2.52) scale(1.19)">
        <path
          d={ARROW_PATH}
          fill="#fff"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d={ARROW_PATH} fill="#000" />
      </g>
    </svg>
  )
}

/* Extracted from macOS 27's cursors/macos27/pointinghand/cursor.pdf; only the
   outer translate (centering the 32-tile content in the 24 box) is ours. */
function HandCursor() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <g transform="translate(-3.15 -4.72)">
        <path
          transform="matrix(1,0,0,-1,21.4728,14.341999)"
          d="M0 0C-.396 0-.702-.125-.933-.334-1.125 .667-1.761 1.273-2.729 1.273-3.208 1.273-3.596 1.091-3.863 .795-4.175 1.526-4.787 1.95-5.631 1.95-6.068 1.95-6.429 1.808-6.705 1.58L-7.385 5.55C-7.614 6.88-8.405 7.293-9.266 7.328-10.688 7.374-11.594 6.353-11.364 4.977L-10.025-3.195C-10.362-2.811-10.695-2.467-11.089-2.121-11.949-1.376-12.981-1.147-13.795-1.823-14.632-2.5-14.667-3.578-14.025-4.518L-12.236-7.11C-10.126-10.16-8.13-12.167-4.725-12.167-.585-12.167 2.053-9.288 2.053-4.082 2.053-1.043 1.158 0 0 0"
          fill="#000"
        />
        <path
          transform="matrix(1,0,0,-1,22.4706,18.3326)"
          d="M0 0C0 2.018-.367 2.981-1.044 2.981-1.422 2.981-1.629 2.706-1.686 2.236-1.72 1.961-1.869 1.755-2.19 1.755-2.454 1.755-2.615 1.926-2.672 2.236L-2.878 3.383C-2.97 3.888-3.245 4.255-3.75 4.255-4.495 4.255-4.587 3.704-4.518 3.188L-4.438 2.557C-4.392 2.236-4.564 1.972-4.92 1.984-5.183 1.996-5.355 2.156-5.413 2.466L-5.665 3.968C-5.768 4.564-6.032 4.931-6.594 4.931-7.156 4.931-7.442 4.564-7.442 4.025-7.442 3.945-7.431 3.853-7.419 3.761L-7.259 2.684C-7.213 2.351-7.408 2.087-7.752 2.099-8.016 2.11-8.188 2.282-8.245 2.592L-9.392 9.243C-9.518 9.977-9.862 10.263-10.355 10.286-11.078 10.309-11.421 9.736-11.307 9.036L-9.724-.734C-9.656-1.169-9.896-1.433-10.229-1.422-10.401-1.422-10.527-1.342-10.676-1.158-11.479-.16-12.155 .574-12.821 1.147-13.337 1.605-13.795 1.675-14.151 1.388-14.529 1.09-14.552 .585-14.174 .035L-12.385-2.58C-10.412-5.447-8.83-7.144-5.734-7.144-2.03-7.144 0-4.736 0 0"
          fill="#fff"
        />
        <g opacity=".18" fill="#000">
          <path
            transform="matrix(1,0,0,-1,15.0625,22.3116)"
            d="M0 0-.459 3.383C-.493 3.612-.355 3.853-.08 3.887 .149 3.922 .367 3.773 .402 3.532L.849 .126C.872-.115 .757-.333 .516-.367 .253-.401 .035-.252 0 0"
          />
          <path
            transform="matrix(1,0,0,-1,17.0465,22.139801)"
            d="M0 0-.034 3.521C-.046 3.773 .126 3.956 .39 3.956 .631 3.968 .826 3.773 .826 3.521L.872-.011C.872-.264 .688-.435 .447-.435 .183-.447 .012-.252 0 0"
          />
          <path
            transform="matrix(1,0,0,-1,19.0531,22.1511)"
            d="M0 0 .367 3.417C.39 3.658 .585 3.818 .849 3.784 1.101 3.761 1.25 3.543 1.216 3.291L.849-.103C.826-.356 .642-.516 .367-.482 .092-.447-.034-.218 0 0"
          />
        </g>
      </g>
    </svg>
  )
}

/* Arrow + gray disc holding a white prohibition sign; the gradient replaces
   the asset's raster disc fill. */
function NotAllowedCursor() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <defs>
        <linearGradient
          id="cursor-na-disc"
          x1="14"
          y1="17"
          x2="14"
          y2="35"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#AEAEB1" />
          <stop offset="1" stopColor="#A7A7AB" />
        </linearGradient>
      </defs>
      <g transform="translate(1.81 -2.42) scale(0.755)">
        <circle cx="14" cy="26" r="9" fill="url(#cursor-na-disc)" />
        <path
          transform="matrix(1,0,0,-1,5.5015,3.7415009)"
          d="M0 0 8.383-8.401C9.436-9.457 8.689-11.259 7.198-11.259L3.751-11.258 1.283-13.443C.202-14.399-1.501-13.632-1.501-12.188V-.621C-1.501 .163-.554 .555 0 0"
          fill="#fff"
        />
        <path
          transform="matrix(1,0,0,-1,5,5.010601)"
          d="M0 0V-10.897C0-11.487 .697-11.801 1.139-11.41L3.874-8.989 7.674-8.99C8.284-8.99 8.59-8.253 8.159-7.821L.251 .104C.159 .197 0 .131 0 0"
          fill="#000"
        />
        <path
          transform="matrix(1,0,0,-1,14,30.498299)"
          d="M0 0C-2.484 0-4.498 2.014-4.498 4.498-4.498 6.983-2.484 8.997 0 8.997 2.484 8.997 4.498 6.983 4.498 4.498 4.498 2.014 2.484 0 0 0M0 10.498C-3.314 10.498-6 7.812-6 4.498-6 1.185-3.314-1.502 0-1.502 3.314-1.502 6 1.185 6 4.498 6 7.812 3.314 10.498 0 10.498"
          fill="#fff"
          fillRule="evenodd"
        />
        <path
          transform="matrix(1,0,0,-1,17.3781,30.621899)"
          d="M0 0-8 8-6.756 9.244 1.244 1.244Z"
          fill="#fff"
        />
      </g>
    </svg>
  )
}

/* v2: each control offers only the cursors a design system would actually
   pick for it — the desktop vs web conventions — drawn as cards. */
export const CURSOR_INTERACTIVE_OPTIONS: SelectRowOption[] = [
  { value: "default", label: "Default", illustration: <ArrowCursor /> },
  { value: "pointer", label: "Pointer", illustration: <HandCursor /> },
]

export const CURSOR_DISABLED_OPTIONS: SelectRowOption[] = [
  { value: "default", label: "Default", illustration: <ArrowCursor /> },
  {
    value: "not-allowed",
    label: "Not allowed",
    illustration: <NotAllowedCursor />,
  },
]

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
  // Surfaces (v2) — the delineation axis (issue #590). Defaults are the
  // study's recommended direction, not today's solid neutral-400.
  surfaceDelineation: "hairline",
  surfaceHairline: "default",
  surfaceDarkElevate: true,
  overlayMaterial: "solid",
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
/** v2: Surfaces absorbs shadows (the recipe and the shadow family are one
 *  decision) and the overlay material; the Cursor section keeps the cursors. */
export const SURFACE_KEYS_V2: (keyof LabState)[] = [
  "surfaceDelineation",
  "surfaceHairline",
  "surfaceDarkElevate",
  "shadows",
  "overlayMaterial",
]
export const EFFECT_KEYS_V2: (keyof LabState)[] = [
  "cursorInteractive",
  "cursorDisabled",
]
/* v2: the Components section splits into per-family sections, each owning the
   keys its synced group reads. Buttons and Inputs first; more follow. */
export const BUTTON_KEYS_V2: (keyof LabState)[] = [
  "buttonStyle",
  "buttonRadius",
  "buttonHover",
]
export const INPUT_KEYS_V2: (keyof LabState)[] = ["inputStyle"]
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
