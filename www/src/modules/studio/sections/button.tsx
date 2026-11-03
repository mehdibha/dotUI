"use client"

/* Button — the pages its own page opens. Variants lists every variant, each
   opening its own page. Specimens draw in the engine's own colors. */

import { useMemo } from "react"

import { DesignSystemProvider } from "@/lib/styles"
import { useStyles as useButtonStyles } from "@/registry/ui/button/styles"
import type {
  BUTTON_SECONDARY,
  BUTTON_STYLES,
} from "@/registry/ui/button/styles"
import type { DesignSystem } from "@/modules/studio/preset/types"

import type { Effective } from "../axes"
import { VARIANT_VALUES } from "../axes/buttons"
import type { Variant } from "../axes/buttons"
import { roleRadiusPx } from "../axes/shape"
import type { Style } from "../axes/style"
import type { ChapterPage } from "../chapters"
import { DialGap, DialInfo, DialLink } from "../dial"
import { designSystemOf } from "../resolve"
import { Row } from "../row-host"
import { valueLabel } from "../use-axis"
import type { Studio } from "../use-studio"

const VARIANTS: Record<Variant, { label: string; text: string }> = {
  primary: { label: "Primary", text: "Save" },
  secondary: { label: "Secondary", text: "Cancel" },
  quiet: { label: "Quiet", text: "Edit" },
  link: { label: "Link", text: "Docs" },
  warning: { label: "Warning", text: "Archive" },
  danger: { label: "Danger", text: "Delete" },
}

const pageOf = (variant: Variant) => `button-variant-${variant}`

/** The user's design system around its children: specimens drawn by the
 *  registry's own recipes in its colors, not the panel's. */
function InSystem({
  ds,
  children,
}: {
  ds: DesignSystem
  children: React.ReactNode
}) {
  return (
    <DesignSystemProvider
      scoped
      params={ds.componentParams}
      tokens={ds.tokens}
      density="default"
      color={ds.color}
      icons={ds.icons}
    >
      {children}
    </DesignSystemProvider>
  )
}

type SpecimenState = "rest" | "hover" | "pressed" | "disabled"

const STATE_PROPS: Record<SpecimenState, Record<string, string>> = {
  rest: {},
  hover: { "data-hovered": "true" },
  pressed: { "data-hovered": "true", "data-pressed": "true" },
  disabled: { "data-disabled": "true", "aria-disabled": "true" },
}

/** A variant as the export draws it, frozen in one state. */
function Specimen({
  variant,
  state = "rest",
}: {
  variant: Variant
  state?: SpecimenState
}) {
  const styles = useButtonStyles()
  return (
    <span
      data-rac=""
      data-button=""
      {...STATE_PROPS[state]}
      className={styles({ variant, size: "xs" })}
    >
      {VARIANTS[variant].text}
    </span>
  )
}

/** The design system the preview renders, for specimens. */
const useDesignSystem = (studio: Studio) =>
  useMemo(() => designSystemOf(studio.state), [studio.state])

export const VARIANTS_PAGE: ChapterPage = {
  id: "button-variants",
  label: "Variants",
  parent: "button",
  aliases: ["Button variants"],
  Body: function VariantsPage({ studio }) {
    const ds = useDesignSystem(studio)
    return VARIANT_VALUES.map((variant) => (
      <DialLink
        key={variant}
        page={pageOf(variant)}
        label={VARIANTS[variant].label}
        value={
          <InSystem ds={ds}>
            <Specimen variant={variant} />
          </InSystem>
        }
      />
    ))
  },
}

type Recipe = keyof typeof BUTTON_STYLES
type SecondaryRecipe = keyof typeof BUTTON_SECONDARY

/** What a filled face draws besides its color. */
interface Face {
  edge: string
  shadow: string
  hover: string
  press: string
}

/* Read off the recipes in registry/ui/button/styles.ts: the primary,
   warning and danger faces of each style, then each secondary. */
const FILLED: Record<Recipe, Face> = {
  flat: { edge: "None", shadow: "None", hover: "Darker", press: "Darker" },
  "rim-light": {
    edge: "Ring, top rim",
    shadow: "Two-step drop",
    hover: "Darker",
    press: "Sink",
  },
  gloss: {
    edge: "Ring",
    shadow: "Two drops",
    hover: "Lighter",
    press: "Sheen returns",
  },
  bevel: { edge: "Bevel", shadow: "None", hover: "Darker", press: "Sink" },
  ledge: { edge: "None", shadow: "Ledge", hover: "Brighter", press: "Drop" },
}

/** Each secondary: its plate, its label's ink, and the rest of its face. */
const SECONDARY: Record<
  SecondaryRecipe,
  Face & { look: string; text: string }
> = {
  flat: {
    look: "Gray on an edge",
    text: "Foreground",
    edge: "Hairline",
    shadow: "None",
    hover: "Darker",
    press: "Darker",
  },
  "rim-light": {
    look: "Plate",
    text: "Foreground",
    edge: "Hairline, bottom shade",
    shadow: "Low",
    hover: "Gray fill",
    press: "Sink",
  },
  gloss: {
    look: "Plate",
    text: "Foreground",
    edge: "Hairline",
    shadow: "Low",
    hover: "Faint tint",
    press: "None",
  },
  bevel: {
    look: "Card plate",
    text: "Foreground",
    edge: "Hairline, bottom lip",
    shadow: "None",
    hover: "Darker",
    press: "Sink",
  },
  ledge: {
    look: "Plain",
    text: "Foreground",
    edge: "Stroke",
    shadow: "Ledge",
    hover: "Darker",
    press: "Drop",
  },
  outline: {
    look: "Outline",
    text: "Foreground",
    edge: "Hairline",
    shadow: "None",
    hover: "Gray fill",
    press: "Darker",
  },
  raised: {
    look: "Card plate",
    text: "Foreground",
    edge: "Hairline",
    shadow: "Low",
    hover: "Gray fill",
    press: "Darker",
  },
  soft: {
    look: "Gray",
    text: "Foreground",
    edge: "None",
    shadow: "None",
    hover: "Darker",
    press: "Darker",
  },
  tonal: {
    look: "Brand tint",
    text: "Accent",
    edge: "None",
    shadow: "None",
    hover: "Darker",
    press: "Darker",
  },
  solid: {
    look: "Dark gray",
    text: "Inverse",
    edge: "None",
    shadow: "None",
    hover: "Lighter",
    press: "Lighter",
  },
}

const PRESS_PARAMS: Record<string, string> = { nudge: "Nudge", scale: "Scale" }

type Rows = [label: string, value: string][]

/** What a variant draws, from the resolved recipe: its look, then how it
 *  answers. */
function rowsOf(
  variant: Variant,
  params: Record<string, string>,
  state: Effective,
): { look: Rows; states: Rows } {
  const shared: Rows = [
    ["Focus", valueLabel("focusStyle", state.focusStyle)],
    ["Disabled", valueLabel("disabledTreatment", state.disabledTreatment)],
  ]
  const press = (own: string) => PRESS_PARAMS[params.press ?? ""] ?? own
  const face = (fill: string, text: string, f: Face) => ({
    look: [
      ["Fill", fill],
      ["Text", text],
      ["Edge", f.edge],
      ["Shadow", f.shadow],
    ] as Rows,
    states: [["Hover", f.hover], ["Press", press(f.press)], ...shared] as Rows,
  })
  const filled = FILLED[params.style as Recipe] ?? FILLED.flat
  switch (variant) {
    case "primary":
      return face(
        valueLabel("buttonColor", state.buttonColor),
        "On primary",
        filled,
      )
    case "warning":
      return face("Warning", "On warning", filled)
    case "danger":
      return face("Danger", "On danger", filled)
    case "secondary": {
      const look =
        SECONDARY[params.secondary as SecondaryRecipe] ?? SECONDARY.flat
      return face(look.look, look.text, look)
    }
    case "quiet":
      return {
        look: [
          ["Fill", "None"],
          ["Text", "Foreground"],
          ["Edge", "None"],
        ],
        states: [["Hover", "Gray tint"], ["Press", "Deeper tint"], ...shared],
      }
    case "link":
      return {
        look: [
          ["Text", valueLabel("linkColor", state.linkColor)],
          ["Underline", valueLabel("linkUnderline", state.linkUnderline)],
        ],
        states: [["Press", "None"], ...shared],
      }
  }
}

const STRIP: SpecimenState[] = ["rest", "hover", "pressed", "disabled"]

/** The variant in each state, over the rows that describe it. */
function StateStrip({ variant, ds }: { variant: Variant; ds: DesignSystem }) {
  return (
    <div className="grid grid-cols-4 gap-1 rounded-lg tint-5 px-2 pt-3 pb-2">
      <InSystem ds={ds}>
        {STRIP.map((state) => (
          <span key={state} className="flex flex-col items-center gap-1.5">
            <Specimen variant={variant} state={state} />
            <span className="text-[11px] text-fg/50 capitalize">{state}</span>
          </span>
        ))}
      </InSystem>
    </div>
  )
}

const infoRows = (rows: Rows) =>
  rows.map(([label, value]) => (
    <DialInfo key={label} label={label} value={value} />
  ))

/** Each variant's own page: what it draws, read-only. */
export const VARIANT_PAGES: ChapterPage[] = VARIANT_VALUES.map((variant) => ({
  id: pageOf(variant),
  label: VARIANTS[variant].label,
  parent: VARIANTS_PAGE.id,
  aliases: [`${VARIANTS[variant].label} button`],
  Body: function VariantPage({ studio }) {
    const ds = useDesignSystem(studio)
    const { look, states } = rowsOf(
      variant,
      ds.componentParams.button ?? {},
      studio.effective,
    )
    return (
      <>
        <StateStrip variant={variant} ds={ds} />
        <DialGap />
        {infoRows(look)}
        <DialGap />
        {infoRows(states)}
      </>
    )
  },
}))

/** The Button page's rows past Variants, each opening its own page: empty
 *  until its rows land. */
const DRILLS = {
  sizes: "Sizes",
  radius: "Radius",
  shadow: "Shadow",
  hover: "Hover",
  press: "Press",
  focus: "Focus",
  disabled: "Disabled",
  pending: "Pending",
} as const

export const BUTTON_PAGES: ChapterPage[] = Object.entries(DRILLS).map(
  ([id, label]) => ({
    id: `button-${id}`,
    label,
    parent: "button",
    aliases: [`Button ${label.toLowerCase()}`],
    Body: () => null,
  }),
)

function Drill({
  id,
  value,
}: {
  id: keyof typeof DRILLS
  value: React.ReactNode
}) {
  return <DialLink page={`button-${id}`} label={DRILLS[id]} value={value} />
}

/* Rows name what the system draws, never "As style": a Style's own hover,
   press and shadow are read out as the concrete look. */
const HOVERS: Record<Style, string> = {
  flat: "Darken",
  borderless: "Darken",
  rim: "Darken",
  gloss: "Lighten",
  bevel: "Darken",
  chunky: "Lighten",
}

const PRESSES: Record<Style, string> = {
  flat: "Fill",
  borderless: "Fill",
  rim: "Sink",
  gloss: "Fill",
  bevel: "Sink",
  chunky: "Drop",
}

const SHADOWS: Record<Style, string> = {
  flat: "None",
  borderless: "None",
  rim: "Low",
  gloss: "Low",
  bevel: "None",
  chunky: "Ledge",
}

/** Pill, or the controls' corner in pixels. */
function radiusLabel(state: Effective) {
  const px = roleRadiusPx(state, "roleControl")
  return state.buttonRadius === "pill" || px >= 999
    ? "Pill"
    : `${Math.round(px * 10) / 10}px`
}

/** The Button page. Design only: past Style and Variants, rows open empty
 *  pages or hold their picks locally for now. */
export function ButtonPage({ studio }: { studio: Studio }) {
  const state = studio.effective
  return (
    <>
      <Row axis="style" label="Style" />
      <DialGap />
      <DialLink
        page={VARIANTS_PAGE.id}
        label={VARIANTS_PAGE.label}
        value={VARIANT_VALUES.length}
      />
      <Drill id="sizes" value={4} />
      <DialGap />
      <Drill id="radius" value={radiusLabel(state)} />
      <Drill id="shadow" value={SHADOWS[state.style]} />
      <DialInfo
        label="Weight"
        value={valueLabel("labelWeight", state.labelWeight)}
      />
      <DialInfo
        label="Case"
        value={valueLabel("buttonCase", state.buttonCase)}
      />
      <DialGap />
      <DialLink
        page="cursor"
        label="Cursor"
        value={
          <span className="capitalize">
            {valueLabel("cursorControls", state.cursorControls)}
          </span>
        }
      />
      <Drill id="hover" value={HOVERS[state.style]} />
      <Drill
        id="press"
        value={
          state.buttonPress === "as-style"
            ? PRESSES[state.style]
            : valueLabel("buttonPress", state.buttonPress)
        }
      />
      <Drill id="focus" value={valueLabel("focusStyle", state.focusStyle)} />
      <Drill
        id="disabled"
        value={valueLabel("disabledTreatment", state.disabledTreatment)}
      />
      <Drill
        id="pending"
        value={valueLabel("spinnerStyle", state.spinnerStyle)}
      />
    </>
  )
}
