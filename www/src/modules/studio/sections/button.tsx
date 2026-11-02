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
import { SEPARATOR_OPTIONS } from "../axes/button-groups.meta"
import { VARIANT_VALUES, variantKey } from "../axes/buttons"
import type { Variant } from "../axes/buttons"
import {
  CASE_OPTIONS,
  PRESS_OPTIONS,
  RADIUS_OPTIONS,
} from "../axes/buttons.meta"
import { LOOKS } from "../axes/style"
import { SELECTED_OPTIONS } from "../axes/toggles.meta"
import { LABEL_WEIGHT_OPTIONS } from "../axes/type.meta"
import type { ChapterPage } from "../chapters"
import {
  DIAL_LABEL,
  DIAL_PRESS,
  DIAL_ROW,
  DialGap,
  DialLink,
  DialPopover,
  DialSegmented,
  DialSelect,
  DialTrigger,
} from "../dial"
import { usePanelMode } from "../panel-mode"
import { Row } from "../row-host"
import { PanelNav } from "../rows"
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

const HOVER_OPTIONS = [
  {
    value: "as-style",
    label: "As style",
    description: "The Style's own hover",
  },
  {
    value: "darken",
    label: "Darken",
    description: "Steps a shade darker",
    credits: ["shadcn", "Primer", "Radix"],
  },
  {
    value: "lighten",
    label: "Lighten",
    description: "Steps a shade lighter",
    credits: ["Linear", "Ant Design"],
  },
]

const labelOf = (
  options: readonly { value: string; label: string }[],
  value: string,
) => options.find((option) => option.value === value)?.label ?? value

/** Weight and case, one row: both set how a label reads. */
function LabelRow({ initial }: { initial: Effective }) {
  const [weight, setWeight] = useState(String(initial.labelWeight))
  const [letterCase, setCase] = useState(String(initial.buttonCase))
  return (
    <DialTrigger
      label="Label"
      value={
        <span className="truncate">
          {labelOf(LABEL_WEIGHT_OPTIONS, weight)}
          {letterCase === "uppercase" && " · Uppercase"}
        </span>
      }
    >
      <DialPopover className="w-80">
        <DialSegmented
          label="Weight"
          value={weight}
          onChange={setWeight}
          options={LABEL_WEIGHT_OPTIONS}
        />
        <DialSegmented
          label="Case"
          value={letterCase}
          onChange={setCase}
          options={CASE_OPTIONS}
        />
      </DialPopover>
    </DialTrigger>
  )
}

/** A pick the page holds itself. */
function DraftSelect({
  label,
  initial,
  options,
}: {
  label: string
  initial: unknown
  options: React.ComponentProps<typeof DialSelect>["options"]
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

/** The Button page. Design only: the rows past Variants hold their picks
 *  locally until their keys are wired. */
export function ButtonPage({ studio }: { studio: Studio }) {
  const state = studio.effective
  return (
    <>
      <Row axis="style" label="Style" />
      <DialLink
        page={VARIANTS_PAGE.id}
        label={VARIANTS_PAGE.label}
        value={<VariantsPreview state={state} />}
      />
      <DialGap />
      <DraftSelect
        label="Corners"
        initial={state.buttonRadius}
        options={RADIUS_OPTIONS}
      />
      <LabelRow initial={state} />
      <DialGap />
      <DraftSelect label="Hover" initial="as-style" options={HOVER_OPTIONS} />
      <DraftSelect
        label="Press"
        initial={state.buttonPress}
        options={PRESS_OPTIONS}
      />
      <Row axis="buttonMotion" label="Motion" />
      <DialGap />
      <DraftSelect
        label="Toggled"
        initial={state.toggleSelected}
        options={SELECTED_OPTIONS}
      />
      <DraftSelect
        label="Group seam"
        initial={state.groupSeparator}
        options={SEPARATOR_OPTIONS}
      />
    </>
  )
}
