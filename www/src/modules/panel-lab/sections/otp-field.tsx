"use client"

/* OTP field — a per-component style being tried as a block; in /create it
   would land as a component style variant, not a family axis.

   Cells: separate boxes (the registry today, iOS), one attached group with
   dividers (shadcn), a bare dash per digit (Material-ish minimal). The field
   look comes from the Inputs section. */

import { cn } from "@/registry/lib/utils"
import { ControlGroup, SelectRow } from "@/modules/control-lab/rows"
import type { SelectRowOption } from "@/modules/control-lab/rows"

import { Hero } from "../hero"
import type { Lab, LabState } from "../state"
import { inputLook } from "./inputs"
import { controlRadiusPx } from "./shape"

export const OTP_FIELD_DEFAULTS = {
  otpStyle: "boxes",
}

const OTP_STYLE_OPTIONS: SelectRowOption[] = [
  { value: "boxes", label: "Boxes" },
  { value: "group", label: "Group" },
  { value: "underline", label: "Underline" },
]

/** Three digits and a caret: cells wear the field style boxed, fused into one
 *  group, or reduced to a dash per digit. */
export function OtpHero({ state }: { state: LabState }) {
  const look = inputLook(state.inputStyle, controlRadiusPx(state))
  const style = state.otpStyle
  const digits = ["3", "9", "4", null]
  const glyph = (digit: string | null) =>
    digit ?? <span className="inline-block h-4 w-px animate-pulse bg-fg" />
  const cell =
    "flex h-9 w-8 items-center justify-center font-mono text-sm text-fg tabular-nums"

  return (
    <Hero className="items-center py-5">
      {style === "group" ? (
        <div
          className={cn(
            "flex divide-x divide-border-control overflow-hidden",
            look.className,
          )}
          style={look.style}
        >
          {digits.map((digit, i) => (
            <span key={i} className={cell}>
              {glyph(digit)}
            </span>
          ))}
        </div>
      ) : (
        <div className="flex gap-2">
          {digits.map((digit, i) =>
            style === "underline" ? (
              <span
                key={i}
                className={cn(cell, "border-b-2 border-border-control")}
              >
                {glyph(digit)}
              </span>
            ) : (
              <span
                key={i}
                className={cn(cell, look.className)}
                style={look.style}
              >
                {glyph(digit)}
              </span>
            ),
          )}
        </div>
      )}
    </Hero>
  )
}

/** Collapsed-row summary: the cell treatment. */
export function otpFieldSummary(state: LabState): string {
  const style =
    OTP_STYLE_OPTIONS.find((o) => o.value === state.otpStyle)?.label ??
    state.otpStyle
  return state.otpStyle === "boxes" ? style : `${style} cells`
}

export function OtpFieldSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <OtpHero state={state} />
      <SelectRow
        label="Cells"
        value={state.otpStyle}
        onChange={set("otpStyle")}
        options={OTP_STYLE_OPTIONS}
      />
    </ControlGroup>
  )
}
