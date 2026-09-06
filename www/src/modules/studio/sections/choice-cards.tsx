"use client"

/* Choice cards — the card variant of the whole selection-control family:
   checkbox card, radio card, switch card, one treatment across all three
   (the Geist Choicebox / Cloudscape Tiles pattern; Ant Pro ships it as
   CheckCard). The control colors stay synced to the family Fill; the axes
   here are card-only. Selected is what marks the chosen card — an accent
   border, a tinted surface, or both; systems split roughly evenly. Control
   is where the real check/radio sits — leading, trailing, or hidden entirely
   so the card treatment alone carries the state (the Ant selectable-card
   school); a switch card always trails its control. */

import { cn } from "@/registry/lib/utils"

import { CONTROL_OPTIONS, SELECTED_OPTIONS } from "../axes/choice-cards"
import { Hero } from "../hero"
import { ControlGroup, SegmentedControlRow } from "../rows"
import type { Studio, StudioState } from "../state"
import { checkboxCorner, DemoCheckbox, fillOf } from "./checkbox"
import { DemoRadio } from "./radio"
import { DemoSwitch } from "./switch"

/* Selected wears the family fill's school, as the engine's selection tokens
   do: accent cards mark with the brand over the accent wash, neutral cards
   with fg over the primary wash — the same inversion the controls themselves
   use. Tint softens the edge too (the registry's default card). */
export const SELECTED = {
  accent: {
    outline: "border-accent",
    tint: "border-accent/25 bg-accent-muted",
    "outline-tint": "border-accent bg-accent-muted",
  },
  neutral: {
    outline: "border-fg",
    tint: "border-fg/25 bg-primary-muted",
    "outline-tint": "border-fg bg-primary-muted",
  },
}

/* -------------------------------- Specimen --------------------------------- */

function ChoiceCard({
  state,
  selected,
  control,
  placement = state.cardControl,
  title,
  description,
}: {
  state: StudioState
  selected?: boolean
  control: React.ReactNode
  placement?: string
  title: string
  description: string
}) {
  const school = SELECTED[state.checkFill as keyof typeof SELECTED]
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

export function ChoiceCardsHero({ state }: { state: StudioState }) {
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
        placement="end"
        title="Auto-save"
        description="Write changes as you type"
      />
    </Hero>
  )
}

/** Collapsed-row summary: the selected treatment, and the control placement. */
export function choiceCardsSummary(state: StudioState): string {
  const selected =
    SELECTED_OPTIONS.find((o) => o.value === state.cardSelected)?.label ??
    state.cardSelected
  const control =
    CONTROL_OPTIONS.find((o) => o.value === state.cardControl)?.label ??
    state.cardControl
  return `${selected} selected · ${control} control`
}

export function ChoiceCardsSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
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
