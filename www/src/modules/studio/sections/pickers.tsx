"use client"

/* Pickers — the trigger caret shared by select and combobox: chevron-down
   (Material, Spectrum, Carbon, Radix Themes, Geist) vs chevrons-up-down
   (macOS pop-up buttons, shadcn combobox); triangle carets are dead and
   "none" unattested, so two options only. Rejected: trigger shell (Inputs
   owns the field shell), clear affordance (Ant allowClear / MUI clearable =
   prop), date trigger field-vs-button (the date picker ships a shell; its
   trigger is the consumer's composition, and a button trigger would need a
   value-display API the registry doesn't have). The listbox belongs to
   Menus. */

import { ChevronDownIcon, ChevronsUpDownIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"

import { CARET_OPTIONS } from "../axes/pickers"
import { Hero } from "../hero"
import { ControlGroup, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Studio, StudioState } from "../state"
import { hoverFx, inputLook, SHELL } from "./inputs"
import { controlRadiusPx } from "./shape"

/* ------------------------------ Option glyphs ------------------------------ */

function CaretGlyph({ caret }: { caret: string }) {
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

const OPTIONS: SelectRowOption[] = CARET_OPTIONS.map((o) => ({
  ...o,
  illustration: <CaretGlyph caret={o.value} />,
}))

/* ---------------------------------- Hero ----------------------------------- */

export function PickersHero({ state }: { state: StudioState }) {
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
        <button
          type="button"
          className={cn(box, "w-40 cursor-interactive")}
          style={look.style}
        >
          <span className="flex-1 truncate text-left text-fg-muted">
            Search…
          </span>
          <Caret className="size-3.5 shrink-0 text-fg-muted" />
        </button>
      </div>
    </Hero>
  )
}

/** Collapsed-row summary: the caret glyph. */
export function pickersSummary(state: StudioState): string {
  const caret =
    CARET_OPTIONS.find((o) => o.value === state.pickerCaret)?.label ??
    state.pickerCaret
  return `${caret} caret`
}

export function PickersSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <PickersHero state={state} />
      <SelectRow
        label="Caret"
        value={state.pickerCaret}
        onChange={set("pickerCaret")}
        options={OPTIONS}
        layout="grid"
      />
    </ControlGroup>
  )
}
