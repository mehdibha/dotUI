"use client"

/* Button — the pages its own page opens. Variants lists every variant, each
   opening its own page. Specimens draw in the engine's own colors. */

import { useState } from "react"

import type { ModeOutput } from "@dotui/colors"

import type { PrimaryColorSource } from "@/registry/theme"

import type { Effective } from "../axes"
import { VARIANT_VALUES } from "../axes/buttons"
import type { Variant } from "../axes/buttons"
import { CASE_OPTIONS } from "../axes/buttons.meta"
import { roleRadiusPx } from "../axes/shape"
import { LOOKS } from "../axes/style"
import type { Style } from "../axes/style"
import { LABEL_WEIGHT_OPTIONS } from "../axes/type.meta"
import type { ChapterPage } from "../chapters"
import { DialGap, DialLink, DialSelect } from "../dial"
import type { DialSelectOption } from "../dial"
import { usePanelMode } from "../panel-mode"
import { Row } from "../row-host"
import { valueLabel } from "../use-axis"
import type { Studio } from "../use-studio"
import { inks } from "./primary"

const VARIANTS: Record<Variant, { label: string; text: string }> = {
  primary: { label: "Primary", text: "Save" },
  secondary: { label: "Secondary", text: "Cancel" },
  quiet: { label: "Quiet", text: "Edit" },
  link: { label: "Link", text: "Docs" },
  warning: { label: "Warning", text: "Archive" },
  danger: { label: "Danger", text: "Delete" },
}

const pageOf = (variant: Variant) => `button-variant-${variant}`

const step = (m: ModeOutput, palette: string, name: string) =>
  m.scales[palette]?.[name as keyof (typeof m.scales)[string]] ?? m.background

/** A variant's face at rest: fill, edge, ink. */
function face(variant: Variant, state: Effective, m: ModeOutput) {
  const ink = inks(m)
  const solid = (palette: string) => ({
    background: step(m, palette, "700"),
    color: m.on[palette]?.["700"] ?? m.background,
  })
  const edge = `inset 0 0 0 1px ${step(m, "neutral", "400")}`
  const text = step(m, "neutral", "950")
  switch (variant) {
    case "primary": {
      const { fill, on } =
        ink[state.buttonColor as PrimaryColorSource] ?? ink.accent
      return { background: fill, color: on }
    }
    case "secondary": {
      const look =
        state.buttonSecondary === "as-style"
          ? LOOKS[state.style].secondary
          : state.buttonSecondary
      if (look === "soft")
        return { background: step(m, "neutral", "100"), color: text }
      if (look === "tonal")
        return { background: ink.accent.wash, color: ink.accent.text }
      if (look === "solid")
        return {
          background: step(m, "neutral", "800"),
          color: step(m, "neutral", "25"),
        }
      if (look === "outline") return { boxShadow: edge, color: text }
      if (look === "flat")
        return {
          background: step(m, "neutral", "100"),
          boxShadow: edge,
          color: text,
        }
      // A plate on an edge: raised and the closed looks' own.
      return {
        background: m.background,
        boxShadow: `${edge}, 0 1px 2px rgb(0 0 0 / 0.08)`,
        color: text,
      }
    }
    case "link":
      return {
        color: state.linkColor === "neutral" ? text : ink.accent.text,
        textDecoration:
          state.linkUnderline === "always" ? "underline" : undefined,
        paddingInline: 0,
      }
    case "warning":
    case "danger":
      return solid(variant)
    default:
      return { color: text }
  }
}

function Specimen({ variant, state }: { variant: Variant; state: Effective }) {
  const { m } = usePanelMode(state)
  return (
    <span
      className="flex h-6 shrink-0 items-center rounded-md px-2.5 text-[11px] font-semibold underline-offset-2"
      style={face(variant, state, m)}
    >
      {VARIANTS[variant].text}
    </span>
  )
}

export const VARIANTS_PAGE: ChapterPage = {
  id: "button-variants",
  label: "Variants",
  parent: "button",
  aliases: ["Button variants"],
  Body: function VariantsPage({ studio }) {
    return VARIANT_VALUES.map((variant) => (
      <DialLink
        key={variant}
        page={pageOf(variant)}
        label={VARIANTS[variant].label}
        value={<Specimen variant={variant} state={studio.effective} />}
      />
    ))
  },
}

/** Each variant's own page: empty until its rows land. */
export const VARIANT_PAGES: ChapterPage[] = VARIANT_VALUES.map((variant) => ({
  id: pageOf(variant),
  label: VARIANTS[variant].label,
  parent: VARIANTS_PAGE.id,
  aliases: [`${VARIANTS[variant].label} button`],
  Body: () => null,
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

/** A pick the page holds itself until its key is wired. */
function DraftSelect({
  label,
  initial,
  options,
}: {
  label: string
  initial: unknown
  options: DialSelectOption[]
}) {
  const [value, setValue] = useState(String(initial))
  return (
    <DialSelect
      label={label}
      value={value}
      onChange={setValue}
      options={options}
    />
  )
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
      <DraftSelect
        label="Weight"
        initial={state.labelWeight}
        options={LABEL_WEIGHT_OPTIONS}
      />
      <DraftSelect
        label="Case"
        initial={state.buttonCase}
        options={CASE_OPTIONS}
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
