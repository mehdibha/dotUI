"use client"

/* Button — the pages its own page opens. Variants lists every variant, each
   opening its own page. Specimens draw with the registry's recipes in the
   user's design system. */

import { useMemo, useState } from "react"
import { PlusIcon } from "lucide-react"
import { Button as RacButton } from "react-aria-components"

import { DesignSystemProvider } from "@/lib/styles"
import { cn } from "@/registry/lib/utils"
import { useStyles as useButtonStyles } from "@/registry/ui/button/styles"
import type { DesignSystem } from "@/modules/studio/preset/types"

import type { Effective } from "../axes"
import { VARIANT_VALUES } from "../axes/buttons"
import type { Variant } from "../axes/buttons"
import { roleRadiusPx } from "../axes/shape"
import type { Style } from "../axes/style"
import type { ChapterPage } from "../chapters"
import {
  DIAL_LABEL,
  DIAL_ROW,
  DialGap,
  DialInfo,
  DialLink,
  DialSelect,
} from "../dial"
import { usePanelMode } from "../panel-mode"
import { designSystemOf } from "../resolve"
import { Row } from "../row-host"
import { valueLabel } from "../use-axis"
import type { Studio } from "../use-studio"
import { classesOf, lookOf } from "./button-look"
import type { LookProperty, Recipe, SecondaryRecipe } from "./button-look"

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

/** A variant at rest, as the export draws it. */
function Specimen({ variant }: { variant: Variant }) {
  const styles = useButtonStyles()
  return (
    <span data-button="" className={styles({ variant, size: "xs" })}>
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

const FILLED_PRESETS: Record<Recipe, string> = {
  flat: "Flat",
  "rim-light": "Rim",
  gloss: "Gloss",
  bevel: "Bevel",
  ledge: "Chunky",
}

const SECONDARY_PRESETS: Record<SecondaryRecipe, string> = {
  ...FILLED_PRESETS,
  outline: "Outline",
  raised: "Raised",
  soft: "Soft",
  tonal: "Tonal",
  solid: "Solid",
}

/** The Button param a variant's presets set, and their names. */
function presetsOf(variant: Variant) {
  if (variant === "secondary")
    return { param: "secondary", names: SECONDARY_PRESETS }
  if (variant === "primary" || variant === "warning" || variant === "danger")
    return { param: "style", names: FILLED_PRESETS }
}

/** `ds` with one Button param swapped. */
const withButton = (ds: DesignSystem, param: string, value: string) => ({
  ...ds,
  componentParams: {
    ...ds.componentParams,
    button: { ...ds.componentParams.button, [param]: value },
  },
})

/** A color property's value: its swatch in the user's system, then the
 *  value as written. */
function PropertyValue({
  property,
  ds,
}: {
  property: LookProperty
  ds: DesignSystem
}) {
  return (
    <span className="flex min-w-0 items-center gap-2" title={property.value}>
      {property.color && (
        <InSystem ds={ds}>
          <span
            className="size-3 shrink-0 rounded-full border border-fg/15"
            style={{ background: property.color }}
          />
        </InSystem>
      )}
      <span className="truncate">{property.value}</span>
    </span>
  )
}

/** Each variant's own page: a preset to start from, then the properties
 *  that draw its look, read off its classes. */
function VariantPage({
  variant,
  studio,
}: {
  variant: Variant
  studio: Studio
}) {
  const ds = useDesignSystem(studio)
  const { mode } = usePanelMode(studio.effective)
  const presets = presetsOf(variant)
  const params = ds.componentParams.button ?? {}
  // A pick previews here only: nothing is saved yet.
  const [picked, setPicked] = useState<string>()
  const preset = presets && (picked ?? params[presets.param])
  const shown = presets && preset ? withButton(ds, presets.param, preset) : ds
  const look = lookOf(
    classesOf(variant, shown.componentParams.button ?? {}),
    mode,
    ds.tokens,
  )
  return (
    <>
      {presets && preset && (
        <>
          <DialSelect
            label="Preset"
            value={preset}
            onChange={setPicked}
            options={Object.entries(presets.names).map(([value, label]) => {
              const specimen = (
                <InSystem ds={withButton(ds, presets.param, value)}>
                  <Specimen variant={variant} />
                </InSystem>
              )
              return { value, label, aside: specimen, glyph: specimen }
            })}
          />
          <DialGap />
        </>
      )}
      {look.map((property, i) => (
        <DialInfo
          key={i}
          label={property.label}
          value={<PropertyValue property={property} ds={shown} />}
        />
      ))}
      <DialGap />
      <RacButton
        isDisabled
        className={cn(DIAL_ROW, "justify-start gap-2 opacity-50")}
      >
        <PlusIcon className="size-4 shrink-0 text-fg/60" />
        <span className={DIAL_LABEL}>Add property</span>
      </RacButton>
    </>
  )
}

export const VARIANT_PAGES: ChapterPage[] = VARIANT_VALUES.map((variant) => ({
  id: pageOf(variant),
  label: VARIANTS[variant].label,
  parent: VARIANTS_PAGE.id,
  aliases: [`${VARIANTS[variant].label} button`],
  Body: ({ studio }) => <VariantPage variant={variant} studio={studio} />,
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
