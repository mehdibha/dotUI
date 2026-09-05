"use client"

/* Number field — where the steppers sit (axes/number-field.ts). The steppers
   are attached segments beside the field, as the registry ships them; the
   field look comes from the Inputs section. */

import { useState } from "react"
import type { CSSProperties } from "react"
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MinusIcon,
  PlusIcon,
} from "lucide-react"

import { cn } from "@/registry/lib/utils"

import { NUMBER_LAYOUT_OPTIONS } from "../axes/number-field"
import { Hero } from "../hero"
import { ControlGroup, SelectRow } from "../rows"
import type { Lab, LabState } from "../state"
import { focusFieldStyle } from "./focus"
import { BARE_INPUT, hoverFx, inputLook, SHELL } from "./inputs"
import { controlRadiusPx } from "./shape"

const SEGMENT =
  "flex shrink-0 cursor-interactive items-center justify-center border border-border-control bg-neutral text-fg-muted outline-none hover:bg-neutral-hover hover:text-fg"

/** A working stepper: the shell is the field, the buttons really step, and
 *  the three placements systems disagree on swap around a live value. */
export function NumberHero({ state }: { state: LabState }) {
  const [value, setValue] = useState(12)
  const [focused, setFocused] = useState(false)
  const radius = controlRadiusPx(state)
  const look = inputLook(state.inputStyle, radius)
  const layout = state.numberLayout
  const shellStyle: CSSProperties = {
    ...look.style,
    ...(focused ? focusFieldStyle(state) : {}),
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    ...(layout === "split"
      ? { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }
      : {}),
  }

  const step = (delta: number) => () => setValue((v) => v + delta)

  return (
    <Hero className="items-center py-5">
      <div className="flex items-stretch">
        {layout === "split" && (
          <button
            type="button"
            aria-label="Decrement"
            onClick={step(-1)}
            className={cn(SEGMENT, "w-8")}
            style={{
              borderTopLeftRadius: radius,
              borderBottomLeftRadius: radius,
            }}
          >
            <MinusIcon className="size-3.5" />
          </button>
        )}
        <div
          className={cn(
            SHELL,
            "z-1 w-24 px-2.5",
            layout === "split" && "-ml-px",
            look.className,
            hoverFx(state),
          )}
          style={shellStyle}
        >
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
              "tabular-nums",
              layout === "split" && "text-center",
            )}
          />
        </div>
        {layout === "stacked" ? (
          <span className="-ml-px flex w-7 flex-col">
            <button
              type="button"
              aria-label="Increment"
              onClick={step(1)}
              className={cn(SEGMENT, "flex-1")}
              style={{ borderTopRightRadius: radius }}
            >
              <ChevronUpIcon className="size-3" />
            </button>
            <button
              type="button"
              aria-label="Decrement"
              onClick={step(-1)}
              className={cn(SEGMENT, "-mt-px flex-1")}
              style={{ borderBottomRightRadius: radius }}
            >
              <ChevronDownIcon className="size-3" />
            </button>
          </span>
        ) : (
          <>
            {layout === "right" && (
              <button
                type="button"
                aria-label="Decrement"
                onClick={step(-1)}
                className={cn(SEGMENT, "-ml-px w-8")}
              >
                <MinusIcon className="size-3.5" />
              </button>
            )}
            <button
              type="button"
              aria-label="Increment"
              onClick={step(1)}
              className={cn(SEGMENT, "-ml-px w-8")}
              style={{
                borderTopRightRadius: radius,
                borderBottomRightRadius: radius,
              }}
            >
              <PlusIcon className="size-3.5" />
            </button>
          </>
        )}
      </div>
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
