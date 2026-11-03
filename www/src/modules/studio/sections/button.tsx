"use client"

/* Button — the pages its own page opens. Variants lists the variants the
   system keeps: each opens its own page, any can go and come back. Specimens
   draw in the engine's own colors. */

import { useContext, useState } from "react"
import { ChevronRightIcon, CircleMinusIcon, PlusIcon } from "lucide-react"
import {
  OverlayTriggerStateContext,
  Button as RacButton,
} from "react-aria-components"

import type { ModeOutput } from "@dotui/colors"

import { cn } from "@/registry/lib/utils"
import type { PrimaryColorSource } from "@/registry/theme"

import type { Effective } from "../axes"
import { VARIANT_VALUES, variantKey } from "../axes/buttons"
import type { Variant } from "../axes/buttons"
import { CASE_OPTIONS } from "../axes/buttons.meta"
import { roleRadiusPx } from "../axes/shape"
import { LOOKS } from "../axes/style"
import type { Style } from "../axes/style"
import { LABEL_WEIGHT_OPTIONS } from "../axes/type.meta"
import type { ChapterPage } from "../chapters"
import {
  DIAL_LABEL,
  DIAL_PRESS,
  DIAL_ROW,
  DialGap,
  DialLink,
  DialPopover,
  DialSelect,
  DialTrigger,
} from "../dial"
import type { DialSelectOption } from "../dial"
import { usePanelMode } from "../panel-mode"
import { Row } from "../row-host"
import { PanelNav } from "../rows"
import { valueLabel } from "../use-axis"
import type { Studio } from "../use-studio"
import { inks } from "./primary"
import { CursorPreview, DisabledPreview, FocusPreview } from "./states"

const VARIANTS: Record<Variant, { label: string; text: string }> = {
  primary: { label: "Primary", text: "Save" },
  secondary: { label: "Secondary", text: "Cancel" },
  quiet: { label: "Quiet", text: "Edit" },
  link: { label: "Link", text: "Docs" },
  warning: { label: "Warning", text: "Archive" },
  danger: { label: "Danger", text: "Delete" },
}

const pageOf = (variant: Variant) => `button-variant-${variant}`

const kept = (state: Effective) =>
  VARIANT_VALUES.filter((variant) => state[variantKey(variant)])

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

/** The Button page's value for Variants: how many it keeps, and their fills. */
export function VariantsPreview({ state }: { state: Effective }) {
  const { m } = usePanelMode(state)
  const variants = kept(state)
  return (
    <span className="flex items-center gap-2">
      <span className="flex items-center gap-1">
        {variants
          .filter((variant) => variant !== "link" && variant !== "quiet")
          .map((variant) => (
            <span
              key={variant}
              className="h-3 w-4 rounded-[3px]"
              style={face(variant, state, m)}
            />
          ))}
      </span>
      {variants.length}
    </span>
  )
}

/** A kept variant: opens its page; the minus removes it. */
function VariantRow({
  variant,
  studio,
  removable,
}: {
  variant: Variant
  studio: Studio
  removable: boolean
}) {
  const open = useContext(PanelNav)
  const { label } = VARIANTS[variant]
  return (
    <div
      data-page-link={pageOf(variant)}
      className={cn(DIAL_ROW, "relative pr-2 pl-1.5")}
    >
      <RacButton
        aria-label={label}
        onPress={() => open(pageOf(variant))}
        className={cn(DIAL_PRESS, "absolute inset-0 rounded-[inherit]")}
      />
      <span className="relative flex min-w-0 items-center gap-1">
        <RacButton
          aria-label={`Remove ${label}`}
          isDisabled={!removable}
          onPress={() => studio.set(variantKey(variant))(false)}
          className="grid size-6 shrink-0 cursor-interactive place-items-center rounded-md text-fg/35 outline-none hover:text-fg/70 focus-visible:focus-ring disabled:cursor-disabled disabled:opacity-40"
        >
          <CircleMinusIcon className="size-3.5" />
        </RacButton>
        <span className={cn(DIAL_LABEL, "pointer-events-none")}>{label}</span>
      </span>
      <span className="pointer-events-none relative flex items-center gap-2">
        <Specimen variant={variant} state={studio.effective} />
        <ChevronRightIcon className="size-4 shrink-0 text-fg/40" />
      </span>
    </div>
  )
}

/** A removed variant, in the Add menu: picking it brings it back. */
function AddItem({ variant, studio }: { variant: Variant; studio: Studio }) {
  const overlay = useContext(OverlayTriggerStateContext)
  return (
    <RacButton
      onPress={() => {
        studio.set(variantKey(variant))(true)
        overlay?.close()
      }}
      className={cn(DIAL_ROW, DIAL_PRESS)}
    >
      <span className={DIAL_LABEL}>{VARIANTS[variant].label}</span>
      <Specimen variant={variant} state={studio.effective} />
    </RacButton>
  )
}

export const VARIANTS_PAGE: ChapterPage = {
  id: "button-variants",
  label: "Variants",
  parent: "button",
  owners: VARIANT_VALUES.map(variantKey),
  aliases: ["Button variants"],
  Body: function VariantsPage({ studio }) {
    const variants = kept(studio.effective)
    const removed = VARIANT_VALUES.filter((v) => !variants.includes(v))
    return (
      <>
        {variants.map((variant) => (
          <VariantRow
            key={variant}
            variant={variant}
            studio={studio}
            removable={variants.length > 1}
          />
        ))}
        {removed.length > 0 && (
          <DialTrigger
            label="Add variant"
            value={<PlusIcon className="size-4 text-fg/50" />}
          >
            <DialPopover className="w-60">
              {removed.map((variant) => (
                <AddItem key={variant} variant={variant} studio={studio} />
              ))}
            </DialPopover>
          </DialTrigger>
        )}
      </>
    )
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

/** The size scale, smallest to largest. */
function SizesPreview() {
  return (
    <span className="flex items-end gap-0.5">
      {["h-2", "h-2.5", "h-3", "h-3.5"].map((height) => (
        <span
          key={height}
          className={cn("w-2 rounded-[2px] bg-fg/35", height)}
        />
      ))}
    </span>
  )
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
        value={<VariantsPreview state={state} />}
      />
      <Drill id="sizes" value={<SizesPreview />} />
      <DialGap />
      <Drill id="radius" value={radiusLabel(state)} />
      <Drill id="shadow" value={SHADOWS[state.style]} />
      <DraftSelect
        key="weight"
        label="Weight"
        initial={state.labelWeight}
        options={LABEL_WEIGHT_OPTIONS}
      />
      <DraftSelect
        key="case"
        label="Case"
        initial={state.buttonCase}
        options={CASE_OPTIONS}
      />
      <DialLink
        page="cursor"
        label="Cursor"
        value={<CursorPreview state={state} />}
      />
      <DialGap />
      <Drill id="hover" value={HOVERS[state.style]} />
      <Drill
        id="press"
        value={
          state.buttonPress === "as-style"
            ? PRESSES[state.style]
            : valueLabel("buttonPress", state.buttonPress)
        }
      />
      <Drill id="focus" value={<FocusPreview state={state} />} />
      <Drill id="disabled" value={<DisabledPreview state={state} />} />
      <Drill
        id="pending"
        value={valueLabel("spinnerStyle", state.spinnerStyle)}
      />
    </>
  )
}
