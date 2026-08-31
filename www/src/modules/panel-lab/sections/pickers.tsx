"use client"

/* Pickers — the shared trigger accessory language of select, combobox, date
   and time pickers. Caret: chevron-down (Material, Spectrum, Carbon, Radix
   Themes, Geist) vs chevrons-up-down (macOS pop-up buttons, shadcn combobox);
   triangle carets are dead and "none" unattested, so two options only. Date
   trigger: field shell with a trailing calendar icon-button (Material,
   Spectrum, Ant, Carbon) vs a button trigger with a leading calendar icon
   (the classic shadcn date picker) — placement and shell co-vary, one axis.
   Rejected: trigger shell input-vs-button look (Inputs owns the field shell,
   reused here; Radix ships shell variants as a prop), clear affordance (Ant
   allowClear / MUI clearable = prop). The listbox belongs to Menus. */

import { CalendarIcon, ChevronDownIcon, ChevronsUpDownIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"

import { Hero } from "../hero"
import { ControlGroup, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Lab, LabState } from "../state"
import { hoverFx, inputLook, SHELL } from "./inputs"
import { controlRadiusPx } from "./shape"

export const PICKER_DEFAULTS = {
  pickerCaret: "chevron",
  pickerDateTrigger: "field",
}

/* ------------------------------ Option glyphs ------------------------------ */

function CaretGlyph({ caret }: { caret: "chevron" | "double" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {caret === "chevron" ? (
        <path d="m6 9 6 6 6-6" />
      ) : (
        <path d="m7 15 5 5 5-5M7 9l5-5 5 5" />
      )}
    </svg>
  )
}

function DateTriggerGlyph({ trigger }: { trigger: "field" | "button" }) {
  const calendarX = trigger === "field" ? 14.5 : 4
  const dash = trigger === "field" ? "M5.5 12h5" : "M13.5 12h5"
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="1.5"
        y="5.5"
        width="21"
        height="13"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity=".4"
      />
      <path
        d={dash}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect
        x={calendarX}
        y="9"
        width="5.5"
        height="6"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d={`M${calendarX} 11.25h5.5`}
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  )
}

const CARET_OPTIONS: SelectRowOption[] = [
  {
    value: "chevron",
    label: "Chevron",
    illustration: <CaretGlyph caret="chevron" />,
  },
  {
    value: "double",
    label: "Up-down",
    illustration: <CaretGlyph caret="double" />,
  },
]

const DATE_TRIGGER_OPTIONS: SelectRowOption[] = [
  {
    value: "field",
    label: "Field",
    illustration: <DateTriggerGlyph trigger="field" />,
  },
  {
    value: "button",
    label: "Button",
    illustration: <DateTriggerGlyph trigger="button" />,
  },
]

/* ---------------------------------- Hero ----------------------------------- */

export function PickersHero({ state }: { state: LabState }) {
  const look = inputLook(state.inputStyle, controlRadiusPx(state))
  const box = cn(SHELL, "gap-2 px-2.5", look.className, hoverFx(state))
  const Caret =
    state.pickerCaret === "double" ? ChevronsUpDownIcon : ChevronDownIcon
  return (
    <Hero className="items-center py-6">
      <div className="flex w-full items-center justify-center gap-3">
        <button
          type="button"
          className={cn(box, "w-40 cursor-interactive")}
          style={look.style}
        >
          <span className="flex-1 truncate text-left text-fg">Monthly</span>
          <Caret className="size-3.5 shrink-0 text-fg-muted" />
        </button>
        {state.pickerDateTrigger === "button" ? (
          <button
            type="button"
            className={cn(box, "w-40 cursor-interactive")}
            style={look.style}
          >
            <CalendarIcon className="size-3.5 shrink-0 text-fg-muted" />
            <span className="flex-1 truncate text-left text-fg">
              Aug 12, 2026
            </span>
          </button>
        ) : (
          <div className={cn(box, "w-40 pr-1")} style={look.style}>
            <span className="flex-1 truncate text-fg">Aug 12, 2026</span>
            <button
              type="button"
              className="flex size-6 shrink-0 cursor-interactive items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-muted hover:text-fg"
            >
              <CalendarIcon className="size-3.5" />
            </button>
          </div>
        )}
      </div>
    </Hero>
  )
}

/** Collapsed-row summary: the caret glyph, and the date trigger. */
export function pickersSummary(state: LabState): string {
  const caret =
    CARET_OPTIONS.find((o) => o.value === state.pickerCaret)?.label ??
    state.pickerCaret
  const trigger =
    DATE_TRIGGER_OPTIONS.find((o) => o.value === state.pickerDateTrigger)
      ?.label ?? state.pickerDateTrigger
  return `${caret} caret · ${trigger} date trigger`
}

export function PickersSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <PickersHero state={state} />
      <SelectRow
        label="Caret"
        value={state.pickerCaret}
        onChange={set("pickerCaret")}
        options={CARET_OPTIONS}
        layout="grid"
      />
      <SelectRow
        label="Date trigger"
        value={state.pickerDateTrigger}
        onChange={set("pickerDateTrigger")}
        options={DATE_TRIGGER_OPTIONS}
        layout="grid"
      />
    </ControlGroup>
  )
}
