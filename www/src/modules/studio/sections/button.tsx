"use client"

/* Button — the pages its own page opens. Variants shows every variant,
   drawn with the registry's recipes in the user's design system. */

import { useEffect, useMemo, useRef, useState } from "react"
import { ChevronDownIcon } from "lucide-react"
import {
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  Button as RacButton,
} from "react-aria-components"

import { DesignSystemProvider } from "@/lib/styles"
import { cn } from "@/registry/lib/utils"
import { EXPAND } from "@/registry/ui/accordion/styles"
import {
  BUTTON_DENSITY,
  useStyles as useButtonStyles,
} from "@/registry/ui/button/styles"
import type { DesignSystem } from "@/modules/studio/preset/types"

import type { Effective } from "../axes"
import { VARIANT_VALUES } from "../axes/buttons"
import type { Variant } from "../axes/buttons"
import { roleRadiusPx, roleRung, SHAPE_RUNGS } from "../axes/shape"
import type { Style } from "../axes/style"
import type { ChapterPage } from "../chapters"
import {
  DIAL_LABEL,
  DialGap,
  DialInfo,
  DialLink,
  DialSlider,
  DialTable,
} from "../dial"
import { pushPopoverFocus } from "../focus"
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

/** A spacing step in px: Tailwind's `N` is N × 4px. */
const px = (step: string | undefined) =>
  step === undefined ? undefined : Number(step) * 4

const FONT_PX: Record<string, number> = { xs: 12, sm: 14, base: 16, lg: 18 }

/** A size's measures at a density, read off its recipe and the density's
 *  base: `h-8 px-2.5 gap-1.5 text-sm`, the svg size rule. */
function measuresOf(density: DesignSystem["density"], size: Size) {
  const { base, variants } = BUTTON_DENSITY[density]
  const classes = ` ${variants.size[size]} ${base} `
  const read = (pattern: RegExp) => classes.match(pattern)?.[1]
  const font = read(/ text-(xs|sm|base|lg|\[[\d.]+rem\])[ /]/)
  return {
    height: px(read(/ h-([\d.]+) /)) ?? 0,
    padding: px(read(/ px-([\d.]+) /)) ?? 0,
    gap: px(read(/ gap-([\d.]+) /)) ?? 0,
    icon: px(read(/\[svg\]:not-with-\[size\]:size-([\d.]+) /)) ?? 16,
    font: font?.startsWith("[")
      ? Number(font.slice(1, -4)) * 16
      : (FONT_PX[font ?? "sm"] ?? 14),
  }
}

/** The corner a size draws: XS sits a rung under the controls'. */
function cornerOf(state: Effective, size: Size) {
  if (state.buttonRadius === "pill") return Infinity
  const rung = roleRung(state, "roleControl")
  const index = SHAPE_RUNGS.findIndex(({ id }) => id === rung)
  const step =
    size !== "xs" || rung === "none" || rung === "full"
      ? index
      : Math.max(
          index - 1,
          SHAPE_RUNGS.findIndex(({ id }) => id === "xs"),
        )
  return state.radiusPx * (SHAPE_RUNGS[step]?.ratio ?? 1)
}

const pxLabel = (value: number) =>
  value === Infinity ? "Pill" : `${Math.round(value * 10) / 10}px`

/** A tweak to see how it handles: it moves, but nothing reads it yet. */
function DraftTweak({
  label,
  value,
  max,
}: {
  label: string
  value: number
  max: number
}) {
  const [draft, setDraft] = useState(Math.min(value, max))
  return (
    <DialSlider
      label={label}
      value={draft}
      onChange={setDraft}
      minValue={0}
      maxValue={max}
      step={0.5}
      format={pxLabel}
    />
  )
}

/** One size: its height on the row, its tweaks under it while open. */
function SizeItem({
  size,
  label,
  ds,
  state,
}: {
  size: Size
  label: string
  ds: DesignSystem
  state: Effective
}) {
  const m = measuresOf(ds.density, size)
  return (
    <Disclosure
      id={size}
      data-axis={`size-${size}`}
      // Its rows sit a step above it, as rows sit above the panel.
      className="group rounded-[10px] tint-5 [--panel-surface:color-mix(in_oklab,var(--color-fg)_5%,var(--color-card))]"
    >
      <RacButton
        slot="trigger"
        className="flex h-9 w-full cursor-interactive items-center justify-between gap-3 rounded-[10px] pr-2 pl-3 text-left outline-none hover:bg-fg/4 focus-visible:focus-ring"
      >
        <span className={DIAL_LABEL}>{label}</span>
        <span className="flex items-center gap-2 text-[13px] font-medium text-fg/60">
          {pxLabel(m.height)}
          <ChevronDownIcon
            className={cn(
              EXPAND,
              "size-4 shrink-0 text-fg/40 transition-transform group-data-expanded:rotate-180",
            )}
          />
        </span>
      </RacButton>
      <DisclosurePanel
        className={cn(
          EXPAND,
          "h-(--disclosure-panel-height) overflow-clip motion-safe:transition-[height]",
        )}
      >
        <div className="flex flex-col gap-1 px-1 pt-1 pb-1">
          <DraftTweak label="Height" value={m.height} max={64} />
          <DraftTweak label="Padding" value={m.padding} max={32} />
          <DraftTweak label="Icon gap" value={m.gap} max={16} />
          <DraftTweak label="Icon size" value={m.icon} max={32} />
          <DraftTweak label="Font size" value={m.font} max={24} />
          <DraftTweak label="Radius" value={cornerOf(state, size)} max={24} />
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}

export const SIZES_PAGE: ChapterPage = {
  id: "button-sizes",
  label: "Sizes",
  parent: "button",
  aliases: ["Button sizes"],
  Body: function SizesPage({ studio }) {
    const ds = useDesignSystem(studio)
    const [open, setOpen] = useState<Size | null>("md")
    const group = useRef<HTMLDivElement>(null)
    // The open size is what the preview's anatomy shows.
    useEffect(() => {
      const item =
        open && group.current?.querySelector(`[data-axis="size-${open}"]`)
      return item ? pushPopoverFocus(item, false) : undefined
    }, [open])
    return (
      <DisclosureGroup
        ref={group}
        expandedKeys={open ? [open] : []}
        onExpandedChange={(keys) => {
          const [next] = [...keys]
          setOpen((next as Size | undefined) ?? null)
        }}
        className="flex flex-col gap-1.5"
      >
        {SIZES.map(([size, label]) => (
          <SizeItem
            key={size}
            size={size}
            label={label}
            ds={ds}
            state={studio.effective}
          />
        ))}
      </DisclosureGroup>
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
