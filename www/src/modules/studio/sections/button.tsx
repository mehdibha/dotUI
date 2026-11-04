"use client"

/* Button — the pages its own page opens. Variants shows every variant,
   drawn with the registry's recipes in the user's design system. */

import { useMemo } from "react"

import { DesignSystemProvider } from "@/lib/styles"
import {
  BUTTON_DENSITY,
  useStyles as useButtonStyles,
} from "@/registry/ui/button/styles"
import type { DesignSystem } from "@/modules/studio/preset/types"

import type { Effective } from "../axes"
import { VARIANT_VALUES } from "../axes/buttons"
import type { Variant } from "../axes/buttons"
import { roleRadiusPx } from "../axes/shape"
import type { Style } from "../axes/style"
import type { ChapterPage } from "../chapters"
import { DialGap, DialInfo, DialLink, DialTable } from "../dial"
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
      density={ds.density}
      color={ds.color}
      icons={ds.icons}
    >
      {children}
    </DesignSystemProvider>
  )
}

/** A variant at rest, as the export draws it. */
function Specimen({ variant, size = "xs" }: { variant: Variant; size?: Size }) {
  const styles = useButtonStyles()
  return (
    <span data-button="" className={styles({ variant, size })}>
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
    return (
      <DialTable
        rows={VARIANT_VALUES.map((variant) => ({
          label: VARIANTS[variant].label,
          value: (
            <InSystem ds={ds}>
              <Specimen variant={variant} />
            </InSystem>
          ),
        }))}
      />
    )
  },
}

type Size = keyof (typeof BUTTON_DENSITY)["default"]["variants"]["size"]

const SIZES: [Size, string][] = [
  ["xs", "XS"],
  ["sm", "SM"],
  ["md", "MD"],
  ["lg", "LG"],
]

/** A size's height at a density, read off its recipe (`h-8` → 32px). */
function heightOf(density: DesignSystem["density"], size: Size) {
  const step = BUTTON_DENSITY[density].variants.size[size].match(
    /(?:^| )h-([\d.]+)(?: |$)/,
  )?.[1]
  return step ? `${Number(step) * 4}px` : ""
}

export const SIZES_PAGE: ChapterPage = {
  id: "button-sizes",
  label: "Sizes",
  parent: "button",
  aliases: ["Button sizes"],
  Body: function SizesPage({ studio }) {
    const ds = useDesignSystem(studio)
    return (
      <DialTable
        rows={SIZES.map(([size, label]) => ({
          label,
          value: (
            <>
              <InSystem ds={ds}>
                <Specimen variant="secondary" size={size} />
              </InSystem>
              <span className="w-9 text-right tabular-nums">
                {heightOf(ds.density, size)}
              </span>
            </>
          ),
        }))}
      />
    )
  },
}

/** The Button page's rows past Variants, each opening its own page: empty
 *  until its rows land. */
const DRILLS = {
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
      <DialLink
        page={SIZES_PAGE.id}
        label={SIZES_PAGE.label}
        value={SIZES.length}
      />
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
