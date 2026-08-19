"use client"

/* Choice cards — the card variant of the whole selection-control family:
   checkbox card, radio card, switch card, one treatment across all three
   (the Geist Choicebox / Cloudscape Tiles pattern; Ant Pro ships it as
   CheckCard). The control colors stay synced to the family Fill; the axes
   here are card-only. Selected is what marks the chosen card — an accent
   border, a tinted surface, or both; systems split roughly evenly. Control
   is where the real check/radio/switch sits — leading, trailing, or hidden
   entirely so the card treatment alone carries the state (the Ant
   selectable-card school). */

import { cn } from "@/registry/lib/utils"
import { ControlGroup, SegmentedControlRow } from "@/modules/control-lab/rows"

import { Hero } from "../hero"
import type { Lab, LabState } from "../state"
import { checkboxCorner, DemoCheckbox, fillOf } from "./checkbox"
import { DemoRadio } from "./radio"
import { DemoSwitch } from "./switch"

export const CHOICE_CARD_DEFAULTS = {
  cardSelected: "outline",
  cardControl: "start",
}

/* Selected wears the family fill's school: accent cards mark with the brand,
   neutral cards with fg — the same inversion the controls themselves use. */
export const SELECTED = {
  accent: {
    outline: "border-accent",
    tint: "border-border/60 bg-accent/8",
    "outline-tint": "border-accent bg-accent/8",
  },
  neutral: {
    outline: "border-fg",
    tint: "border-border/60 bg-fg/8",
    "outline-tint": "border-fg bg-fg/8",
  },
}

/* --------------------------------- Options --------------------------------- */

const SELECTED_OPTIONS = [
  { value: "outline", label: "Outline" },
  { value: "tint", label: "Tint" },
  { value: "outline-tint", label: "Both" },
]

const CONTROL_OPTIONS = [
  { value: "start", label: "Start" },
  { value: "end", label: "End" },
  { value: "hidden", label: "Hidden" },
]

/* -------------------------------- Specimen --------------------------------- */

function ChoiceCard({
  state,
  selected,
  control,
  title,
  description,
}: {
  state: LabState
  selected?: boolean
  control: React.ReactNode
  title: string
  description: string
}) {
  const school = SELECTED[state.checkFill as keyof typeof SELECTED]
  const placement = state.cardControl
  return (
    <label
      className={cn(
        "flex items-start gap-2.5 rounded-lg border bg-card p-3",
        selected
          ? school[state.cardSelected as keyof typeof school]
          : "border-border/60",
      )}
    >
      {placement === "start" && <span className="mt-0.5">{control}</span>}
      <span className="flex flex-1 flex-col gap-0.5">
        <span className="text-[0.8125rem] font-medium text-fg">{title}</span>
        <span className="text-xs text-fg-muted">{description}</span>
      </span>
      {placement === "end" && <span className="mt-0.5">{control}</span>}
    </label>
  )
}

/* ---------------------------------- Hero ----------------------------------- */

export function ChoiceCardsHero({ state }: { state: LabState }) {
  const fill = fillOf(state)
  const corner = checkboxCorner(state)
  return (
    <Hero>
      <div className="grid grid-cols-2 gap-2">
        <ChoiceCard
          state={state}
          selected
          control={<DemoRadio selected fill={fill} />}
          title="Hobby"
          description="Personal projects"
        />
        <ChoiceCard
          state={state}
          control={<DemoRadio fill={fill} />}
          title="Pro"
          description="Team features"
        />
      </div>
      <ChoiceCard
        state={state}
        selected
        control={<DemoCheckbox checked fill={fill} corner={corner} />}
        title="Email alerts"
        description="Send a daily summary"
      />
      <ChoiceCard
        state={state}
        selected
        control={<DemoSwitch fill={fill} />}
        title="Auto-save"
        description="Write changes as you type"
      />
    </Hero>
  )
}

/** Collapsed-row summary: the selected treatment, and the control placement. */
export function choiceCardsSummary(state: LabState): string {
  const selected =
    SELECTED_OPTIONS.find((o) => o.value === state.cardSelected)?.label ??
    state.cardSelected
  const control =
    CONTROL_OPTIONS.find((o) => o.value === state.cardControl)?.label ??
    state.cardControl
  return `${selected} selected · ${control} control`
}

export function ChoiceCardsSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <ChoiceCardsHero state={state} />
      <SegmentedControlRow
        label="Selected"
        value={state.cardSelected}
        onChange={set("cardSelected")}
        options={SELECTED_OPTIONS}
      />
      <SegmentedControlRow
        label="Control"
        value={state.cardControl}
        onChange={set("cardControl")}
        options={CONTROL_OPTIONS}
      />
    </ControlGroup>
  )
}
