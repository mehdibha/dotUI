"use client"

/* Primary — a view over every role that paints with a source (axes/color.ts
   PRIMARY_LEAVES). Accent and Neutral write all of them; while they disagree
   it reads Custom and lists each. Each leaf has its own row on its
   component's page. Previews draw the role at glyph scale in the engine's
   own colors. */

import { CheckIcon } from "lucide-react"
import {
  ToggleButton as RacToggleButton,
  ToggleButtonGroup as RacToggleButtonGroup,
} from "react-aria-components"

import type { ModeOutput } from "@dotui/colors"

import { cn } from "@/registry/lib/utils"
import type { PrimaryColorSource } from "@/registry/theme"

import { PRIMARY_LEAVES, primaryValue, withSource } from "../axes/color"
import type { PrimaryLeaf } from "../axes/color"
import { SOURCE_OPTIONS } from "../axes/color.meta"
import { OPTIONS } from "../axes/meta"
import {
  DIAL_LABEL,
  DIAL_PRESS,
  DIAL_ROW,
  DialPopover,
  DialSelect,
  DialSeparator,
  DialTrigger,
  subline,
} from "../dial"
import type { RowMap } from "../family-page"
import { usePanelMode } from "../panel-mode"
import type { Studio } from "../state"
import { useStudio } from "../use-studio"

/* --------------------------------- Inks ---------------------------------- */

/** What a source paints, from the engine's mode: the solid fill and its
 *  label, the text ink, the focus ring, the tinted wash. */
interface Ink {
  fill: string
  on: string
  text: string
  ring: string
  wash: string
}

function inks(m: ModeOutput): Record<PrimaryColorSource, Ink> {
  const step = (palette: string, step: string) =>
    m.scales[palette]?.[step as keyof (typeof m.scales)[string]] ?? m.background
  return {
    neutral: {
      fill: step("neutral", "950"),
      on: step("neutral", "25"),
      text: step("neutral", "950"),
      ring: step("neutral", "700"),
      wash: step("neutral", "200"),
    },
    accent: {
      fill: step("accent", "700"),
      on: m.on.accent?.["700"] ?? m.background,
      text: step("accent", "900"),
      ring: step("accent", "700"),
      wash: step("accent", "100"),
    },
  }
}

/* -------------------------------- Previews -------------------------------- */

function Check({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-2.5"
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function ButtonGlyph({ ink }: { ink: Ink }) {
  return (
    <span
      className="flex h-5 items-center rounded-md px-2 text-[10.5px] font-semibold"
      style={{ background: ink.fill, color: ink.on }}
    >
      Save
    </span>
  )
}

function CheckboxGlyph({ ink }: { ink: Ink }) {
  return (
    <span
      className="grid size-4 place-items-center rounded-[4px]"
      style={{ background: ink.fill }}
    >
      <Check color={ink.on} />
    </span>
  )
}

function RadioGlyph({ ink }: { ink: Ink }) {
  return (
    <span
      className="size-4 rounded-full border-[5px]"
      style={{ borderColor: ink.fill, background: ink.on }}
    />
  )
}

function SwitchGlyph({ ink }: { ink: Ink }) {
  return (
    <span
      className="flex h-4 w-7 items-center justify-end rounded-full p-0.5"
      style={{ background: ink.fill }}
    >
      <span className="size-3 rounded-full" style={{ background: ink.on }} />
    </span>
  )
}

function SelectionGlyph({ ink }: { ink: Ink }) {
  return (
    <span
      className="flex h-5 items-center gap-1 rounded-md px-1.5 text-[10.5px] font-medium"
      style={{ background: ink.fill, color: ink.on }}
    >
      <Check color={ink.on} />
      Item
    </span>
  )
}

function SliderGlyph({ ink }: { ink: Ink }) {
  return (
    <span className="flex h-1 w-14 items-center rounded-full bg-fg/15">
      <span
        className="flex h-1 w-8 items-center justify-end rounded-full"
        style={{ background: ink.fill }}
      >
        <span
          className="-mr-1.5 size-3 rounded-full ring-2 ring-bg"
          style={{ background: ink.fill }}
        />
      </span>
    </span>
  )
}

function TabsGlyph({ ink }: { ink: Ink }) {
  return (
    <span className="flex gap-2.5 text-[10.5px] font-medium">
      <span
        className="border-b-2 pb-px"
        style={{ color: ink.text, borderColor: ink.fill }}
      >
        Tab
      </span>
      <span className="border-b-2 border-transparent pb-px text-fg/50">
        Tab
      </span>
    </span>
  )
}

function LinkGlyph({ ink }: { ink: Ink }) {
  return (
    <span
      className="text-[11px] font-medium underline underline-offset-2"
      style={{ color: ink.text }}
    >
      Learn more
    </span>
  )
}

function FocusGlyph({ ink }: { ink: Ink }) {
  return (
    <span
      className="h-4 w-8 rounded-[5px] bg-fg/10 ring-2 ring-offset-1 ring-offset-bg"
      style={{ ["--tw-ring-color" as string]: ink.ring }}
    />
  )
}

const GLYPHS: Record<PrimaryLeaf, (props: { ink: Ink }) => React.ReactNode> = {
  buttonColor: ButtonGlyph,
  checkboxColor: CheckboxGlyph,
  radioColor: RadioGlyph,
  switchColor: SwitchGlyph,
  selectionColor: SelectionGlyph,
  sliderColor: SliderGlyph,
  tabsColor: TabsGlyph,
  linkColor: LinkGlyph,
  focusColor: FocusGlyph,
}

/** The trigger's swatch: one source, or both halves when they disagree. */
function SourceSwatch({
  value,
  ink,
}: {
  value: PrimaryColorSource | "mixed"
  ink: Record<PrimaryColorSource, Ink>
}) {
  if (value !== "mixed")
    return (
      <span
        className="size-4 rounded-full border border-fg/15"
        style={{ background: ink[value].fill }}
      />
    )
  return (
    <span className="flex size-4 overflow-hidden rounded-full border border-fg/15">
      <span className="h-full w-1/2" style={{ background: ink.neutral.fill }} />
      <span className="h-full w-1/2" style={{ background: ink.accent.fill }} />
    </span>
  )
}

/* ---------------------------------- Row ----------------------------------- */

/** Accent first, wherever a Primary source is picked. */
const inOrder = <T extends { value: string }>(options: readonly T[]) =>
  ["accent", "neutral"].flatMap((id) => options.filter((o) => o.value === id))

const CHOICES = inOrder(SOURCE_OPTIONS)

function ChoiceStrip({ ink }: { ink: Ink }) {
  return (
    <span className="flex items-center gap-1.5">
      <CheckboxGlyph ink={ink} />
      <SwitchGlyph ink={ink} />
      <ButtonGlyph ink={ink} />
    </span>
  )
}

const LEAF_LABELS: Record<PrimaryLeaf, string> = {
  buttonColor: "Button",
  checkboxColor: "Checkbox",
  radioColor: "Radio",
  switchColor: "Switch",
  selectionColor: "Selected fill",
  sliderColor: "Slider",
  tabsColor: "Tabs",
  linkColor: "Link",
  focusColor: "Focus ring",
}

/** Where each leaf stands while they disagree; each is set on its own page. */
function LeafList({
  state,
  ink,
}: {
  state: Studio["state"]
  ink: Record<PrimaryColorSource, Ink>
}) {
  return (
    <dl className="flex flex-col px-3 py-1 text-[13px] font-medium">
      {PRIMARY_LEAVES.map((leaf) => {
        const source = state[leaf] as PrimaryColorSource
        return (
          <div key={leaf} className="flex h-7 items-center justify-between">
            <dt className="text-fg/85">{LEAF_LABELS[leaf]}</dt>
            <dd className="flex items-center gap-2 text-fg/60">
              {source === "accent" ? "Accent" : "Neutral"}
              <SourceSwatch value={source} ink={ink} />
            </dd>
          </div>
        )
      })}
    </dl>
  )
}

function PrimaryPanel({
  studio,
  ink,
}: {
  studio: Studio
  ink: Record<PrimaryColorSource, Ink>
}) {
  const { state, setState } = studio
  const primary = primaryValue(state)
  return (
    <>
      <RacToggleButtonGroup
        aria-label="Primary"
        selectionMode="single"
        disallowEmptySelection
        selectedKeys={primary === "mixed" ? [] : [primary]}
        onSelectionChange={(keys) => {
          const next = keys.values().next().value
          if (next)
            setState({
              ...state,
              ...withSource(PRIMARY_LEAVES, next as PrimaryColorSource),
            })
        }}
        className="flex flex-col gap-1.5"
      >
        {CHOICES.map((choice) => (
          <RacToggleButton
            key={choice.value}
            id={choice.value}
            className={cn(
              DIAL_ROW,
              DIAL_PRESS,
              "h-auto min-h-9 py-2 selected:tint-10",
            )}
          >
            {({ isSelected }) => (
              <>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className={DIAL_LABEL}>{choice.label}</span>
                  <span className="text-xs leading-snug text-fg/55">
                    {subline(choice)}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <ChoiceStrip ink={ink[choice.value as PrimaryColorSource]} />
                  <CheckIcon
                    className={cn(
                      "size-4 shrink-0 text-fg",
                      !isSelected && "invisible",
                    )}
                  />
                </span>
              </>
            )}
          </RacToggleButton>
        ))}
      </RacToggleButtonGroup>
      {primary === "mixed" && (
        <>
          <DialSeparator />
          <LeafList state={state} ink={ink} />
        </>
      )}
    </>
  )
}

export function PrimaryRow() {
  const studio = useStudio()
  const ink = inks(usePanelMode().m)
  const primary = primaryValue(studio.state)
  const label =
    primary === "mixed" ? "Custom" : primary === "accent" ? "Accent" : "Neutral"
  return (
    <DialTrigger
      label="Primary"
      swatch
      value={
        <>
          {label}
          <SourceSwatch value={primary} ink={ink} />
        </>
      }
    >
      <DialPopover className="w-72">
        <PrimaryPanel studio={studio} ink={ink} />
      </DialPopover>
    </DialTrigger>
  )
}

/** One leaf on its own source; its component's page hosts it. */
const leafRow = (leaf: PrimaryLeaf) =>
  function LeafRow() {
    const ink = inks(usePanelMode().m)
    const Glyph = GLYPHS[leaf]
    return (
      <DialSelect
        axis={leaf}
        label="Color"
        options={inOrder(OPTIONS[leaf] ?? SOURCE_OPTIONS).map((option) => {
          const id = option.value as PrimaryColorSource
          return {
            ...option,
            preview: <Glyph ink={ink[id]} />,
            glyph: <SourceSwatch value={id} ink={ink} />,
          }
        })}
      />
    )
  }

export const ROWS: RowMap = Object.fromEntries(
  PRIMARY_LEAVES.map((leaf) => [leaf, leafRow(leaf)]),
)
