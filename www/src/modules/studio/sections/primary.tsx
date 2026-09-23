"use client"

/* Primary — the Color chapter's view over every role that paints with a
   source (axes/color.ts PRIMARY_LEAVES). Two cards write all of them; a
   folder below holds a row per leaf, and while the leaves disagree no card
   is selected. Each preview is the role at glyph scale in the engine's own
   colors, so a choice reads before it lands. */

import { useState } from "react"
import {
  ToggleButton as RacToggleButton,
  ToggleButtonGroup as RacToggleButtonGroup,
} from "react-aria-components"

import type { ModeOutput } from "@dotui/colors"

import { cn } from "@/registry/lib/utils"
import type { PrimaryColorSource } from "@/registry/theme"

import {
  PRIMARY_LEAVES,
  primaryValue,
  SOURCE_OPTIONS,
  withSource,
} from "../axes/color"
import type { PrimaryLeaf } from "../axes/color"
import {
  DIAL_LABEL,
  DIAL_ROW,
  DialFolder,
  DialPopover,
  DialTrigger,
  SegmentedGroup,
} from "../dial"
import type { Studio } from "../state"

const LEAF_LABELS: Record<PrimaryLeaf, string> = {
  buttonColor: "Buttons",
  checkboxColor: "Checkbox",
  radioColor: "Radio",
  switchColor: "Switch",
  selectionColor: "Selection",
  sliderColor: "Slider",
  tabsColor: "Tabs",
  linkColor: "Links",
  focusColor: "Focus ring",
}

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
      Button
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

const CARDS: { id: PrimaryColorSource; label: string }[] = [
  { id: "neutral", label: "Neutral" },
  { id: "accent", label: "Accent" },
]

function CardStrip({ ink }: { ink: Ink }) {
  return (
    <span className="flex items-center gap-1.5">
      <CheckboxGlyph ink={ink} />
      <SwitchGlyph ink={ink} />
      <ButtonGlyph ink={ink} />
    </span>
  )
}

function leavesSummary(state: Studio["state"]) {
  const neutral = PRIMARY_LEAVES.filter((l) => state[l] === "neutral").length
  if (neutral === 0) return "All accent"
  if (neutral === PRIMARY_LEAVES.length) return "All neutral"
  return `${neutral} neutral · ${PRIMARY_LEAVES.length - neutral} accent`
}

/** Mounted with the popover, so the folder opens on mixed leaves each time. */
function PrimaryPanel({
  studio,
  ink,
}: {
  studio: Studio
  ink: Record<PrimaryColorSource, Ink>
}) {
  const { state, set, setState } = studio
  const primary = primaryValue(state)
  const [open, setOpen] = useState(primary === "mixed")
  return (
    <>
      <RacToggleButtonGroup
        aria-label="Primary"
        selectionMode="single"
        selectedKeys={primary === "mixed" ? [] : [primary]}
        onSelectionChange={(keys) => {
          const next = keys.values().next().value
          if (next)
            setState({
              ...state,
              ...withSource(PRIMARY_LEAVES, next as PrimaryColorSource),
            })
        }}
        className="grid grid-cols-2 gap-1.5"
      >
        {CARDS.map((card) => (
          <RacToggleButton
            key={card.id}
            id={card.id}
            className="group/card flex cursor-interactive flex-col gap-2.5 rounded-lg tint-5 p-2.5 text-left focus-reset transition-colors hover:tint-10 focus-visible:focus-ring selected:tint-10 selected:inset-ring-1 selected:inset-ring-fg/25"
          >
            <span className="flex items-center gap-2">
              <span className="size-3 rounded-full border border-fg/30 transition-[border-width] group-selected/card:border-4 group-selected/card:border-fg" />
              <span className="text-[13px] font-medium text-fg/85">
                {card.label}
              </span>
            </span>
            <CardStrip ink={ink[card.id]} />
          </RacToggleButton>
        ))}
      </RacToggleButtonGroup>
      <DialFolder
        title="Per control"
        value={leavesSummary(state)}
        open={open}
        onOpenChange={setOpen}
        modified={primary === "mixed"}
      >
        {PRIMARY_LEAVES.map((leaf) => {
          const Glyph = GLYPHS[leaf]
          const source = state[leaf] as PrimaryColorSource
          return (
            <div key={leaf} className={cn(DIAL_ROW, "gap-2 pr-1.5")}>
              <span className={cn(DIAL_LABEL, "w-[72px]")}>
                {LEAF_LABELS[leaf]}
              </span>
              <span className="flex min-w-0 flex-1 items-center">
                <Glyph ink={ink[source]} />
              </span>
              <SegmentedGroup
                label={`${LEAF_LABELS[leaf]} color`}
                value={source}
                onChange={set(leaf)}
                options={SOURCE_OPTIONS}
              />
            </div>
          )
        })}
      </DialFolder>
    </>
  )
}

export function PrimaryRow({ studio, m }: { studio: Studio; m: ModeOutput }) {
  const ink = inks(m)
  const primary = primaryValue(studio.state)
  const label =
    primary === "mixed" ? "Mixed" : primary === "accent" ? "Accent" : "Neutral"
  return (
    <DialTrigger
      label="Primary"
      chevron={false}
      value={
        <>
          {label}
          <SourceSwatch value={primary} ink={ink} />
        </>
      }
    >
      <DialPopover className="w-[352px]">
        <PrimaryPanel studio={studio} ink={ink} />
      </DialPopover>
    </DialTrigger>
  )
}
