"use client"

/* Number field — a per-component style being tried as a block; in /create it
   would land as a component style variant, not a family axis.

   Stepper placement: adjacent right pair (the registry today, Carbon), one
   button at each end (Polaris mobile, HeroUI), stacked chevron column
   (Spectrum, Ant, classic desktop). The field look comes from the Inputs
   section. */

import { useState } from "react"
import type { CSSProperties } from "react"
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MinusIcon,
  PlusIcon,
} from "lucide-react"

import { cn } from "@/registry/lib/utils"
import { ControlGroup, SelectRow } from "@/modules/control-lab/rows"
import type { SelectRowOption } from "@/modules/control-lab/rows"

import { Hero } from "../hero"
import type { Lab, LabState } from "../state"
import { focusFieldStyle } from "./focus"
import { BARE_INPUT, hoverFx, inputLook, SHELL } from "./inputs"
import { controlRadiusPx } from "./shape"

export const NUMBER_FIELD_DEFAULTS = {
  numberLayout: "right",
}

const NUMBER_LAYOUT_OPTIONS: SelectRowOption[] = [
  { value: "right", label: "Right" },
  { value: "split", label: "Split" },
  { value: "stacked", label: "Stacked" },
]

/** A working stepper: the shell is the field, the buttons really step, and
 *  the three placements systems disagree on swap around a live value. */
export function NumberHero({ state }: { state: LabState }) {
  const [value, setValue] = useState(12)
  const [focused, setFocused] = useState(false)
  const radius = controlRadiusPx(state)
  const look = inputLook(state.inputStyle, radius)
  const layout = state.numberLayout
  const shellStyle: CSSProperties = focused
    ? { ...look.style, ...focusFieldStyle(state) }
    : look.style

  const input = (
    <input
      type="text"
      inputMode="numeric"
      aria-label="Quantity"
      value={value}
      onChange={(e) => {
        const next = Number.parseInt(e.target.value, 10)
        setValue(Number.isNaN(next) ? 0 : next)
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={cn(
        BARE_INPUT,
        "flex-1 tabular-nums",
        layout === "split" && "text-center",
      )}
    />
  )

  const ghost = (label: string, icon: React.ReactNode, delta: number) => (
    <button
      type="button"
      aria-label={label}
      onClick={() => setValue((v) => v + delta)}
      className="flex size-6 shrink-0 cursor-interactive items-center justify-center text-fg-muted outline-none hover:bg-highlight hover:text-fg"
      style={{ borderRadius: Math.max(radius - 3, 2) }}
    >
      {icon}
    </button>
  )

  return (
    <Hero className="items-center py-5">
      {layout === "stacked" ? (
        <div
          className={cn(
            SHELL,
            "w-36 overflow-hidden pl-2.5",
            look.className,
            hoverFx(state),
          )}
          style={shellStyle}
        >
          {input}
          <span className="flex h-full w-6 shrink-0 flex-col border-l border-border-control">
            <button
              type="button"
              aria-label="Increment"
              onClick={() => setValue((v) => v + 1)}
              className="flex flex-1 cursor-interactive items-center justify-center border-b border-border-control text-fg-muted outline-none hover:bg-highlight hover:text-fg"
            >
              <ChevronUpIcon className="size-3" />
            </button>
            <button
              type="button"
              aria-label="Decrement"
              onClick={() => setValue((v) => v - 1)}
              className="flex flex-1 cursor-interactive items-center justify-center text-fg-muted outline-none hover:bg-highlight hover:text-fg"
            >
              <ChevronDownIcon className="size-3" />
            </button>
          </span>
        </div>
      ) : (
        <div
          className={cn(
            SHELL,
            "w-36 gap-1",
            layout === "split" ? "px-1" : "pr-1 pl-2.5",
            look.className,
            hoverFx(state),
          )}
          style={shellStyle}
        >
          {layout === "split" &&
            ghost("Decrement", <MinusIcon className="size-3.5" />, -1)}
          {input}
          {layout === "right" &&
            ghost("Decrement", <MinusIcon className="size-3.5" />, -1)}
          {ghost("Increment", <PlusIcon className="size-3.5" />, 1)}
        </div>
      )}
    </Hero>
  )
}

/** Collapsed-row summary: the stepper placement. */
export function numberFieldSummary(state: LabState): string {
  const layout =
    NUMBER_LAYOUT_OPTIONS.find((o) => o.value === state.numberLayout)?.label ??
    state.numberLayout
  return `${layout} steppers`
}

export function NumberFieldSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <NumberHero state={state} />
      <SelectRow
        label="Steppers"
        value={state.numberLayout}
        onChange={set("numberLayout")}
        options={NUMBER_LAYOUT_OPTIONS}
      />
    </ControlGroup>
  )
}
