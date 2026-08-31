"use client"

/* Inputs — the field family's axes (Select, Combobox, Textarea follow Input).
   Style is the registry's real enum (input/meta.ts); hover is the field's own
   pointer state. Focus is owned by the Focus section — specimens wear that
   recipe live when they focus. Labels always sit on top: float and
   placeholder-only failed review (a11y, systems moving away), inset is an
   InputGroup composition, not an axis.

   Error treatment moved to the Invalid section (a cross-component state, with
   Focus and Disabled); the hero's failed specimen still wears it live.

   This section owns the field look: Input groups, Number field, and OTP field
   reuse inputLook and the shell constants so every field wears the same skin. */

import { useId, useState } from "react"
import type { CSSProperties } from "react"
import { ChevronDownIcon, CircleAlertIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"
import { ControlGroup, SelectRow } from "@/modules/control-lab/rows"
import type { SelectRowOption } from "@/modules/control-lab/rows"

import { Hero } from "../hero"
import type { Lab, LabState } from "../state"
import { focusFieldStyle } from "./focus"
import { controlRadiusPx } from "./shape"

export const INPUT_DEFAULTS = {
  inputStyle: "outline",
  inputHover: "none",
}

const STYLE_OPTIONS: SelectRowOption[] = [
  { value: "outline", label: "Outline" },
  { value: "line", label: "Line" },
  { value: "filled-line-bottom", label: "Filled line" },
  { value: "filled", label: "Filled" },
]

/* Hover: shadcn and Geist ship none (the default here, matching the
   registry), Spectrum and Ant darken the border, Linear tints the fill. */
const HOVER_OPTIONS: SelectRowOption[] = [
  { value: "none", label: "None" },
  { value: "border", label: "Border" },
  { value: "tint", label: "Tint" },
]

/** Style → what the field shell paints. Radius only where the style rounds;
 *  filled keeps a transparent border so focus and hover can swap it in. */
export function inputLook(
  styleId: string,
  radius: number,
): { className: string; style: CSSProperties } {
  switch (styleId) {
    case "line":
      return { className: "border-b border-border-control", style: {} }
    case "filled-line-bottom":
      return {
        className: "border-b border-border-control bg-neutral",
        style: {
          borderTopLeftRadius: radius,
          borderTopRightRadius: radius,
        },
      }
    case "filled":
      return {
        className: "border border-transparent bg-neutral",
        style: { borderRadius: radius },
      }
    default:
      return {
        className: "border border-border-control bg-field",
        style: { borderRadius: radius },
      }
  }
}

export function hoverFx(state: LabState): string {
  switch (state.inputHover) {
    case "border":
      return "hover:not-focus-within:border-neutral-600"
    case "tint":
      return "hover:not-focus-within:bg-neutral-hover"
    default:
      return ""
  }
}

export const SHELL =
  "flex h-8 w-full min-w-0 items-center text-[0.8125rem] transition-[background-color,border-color,box-shadow] duration-150 outline-none"

export const BARE_INPUT =
  "h-full w-full min-w-0 bg-transparent text-fg outline-none placeholder:text-fg-muted"

const LABEL = "text-xs font-medium text-fg"

type Specimen = "email" | "role" | "username" | "notes"

/** Live specimens — label, control, help — focusing with the Focus section's
 *  field recipe, the way the buttons hero hovers and presses for real. */
export function FieldHero({ state }: { state: LabState }) {
  const id = useId()
  const [focused, setFocused] = useState<Specimen | null>(null)
  const look = inputLook(state.inputStyle, controlRadiusPx(state))
  const box = cn(SHELL, "gap-2 px-2.5", look.className, hoverFx(state))
  const boxStyle = (specimen: Specimen): CSSProperties =>
    focused === specimen
      ? { ...look.style, ...focusFieldStyle(state) }
      : look.style
  const bar = state.inputError === "bar"

  return (
    <Hero className="items-center gap-3 py-5">
      <div className="flex w-full items-start justify-center gap-3">
        <div className="flex w-48 flex-col gap-1.5">
          <label htmlFor={id} className={LABEL}>
            Email
          </label>
          <div className={box} style={boxStyle("email")}>
            <input
              id={id}
              type="text"
              placeholder="you@example.com"
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              className={BARE_INPUT}
            />
          </div>
          <p className="text-xs text-fg-muted">Used for the receipt.</p>
        </div>
        <div className="flex w-48 flex-col gap-1.5">
          <span className={LABEL}>Role</span>
          <button
            type="button"
            onFocus={() => setFocused("role")}
            onBlur={() => setFocused(null)}
            className={cn(box, "cursor-interactive text-left")}
            style={boxStyle("role")}
          >
            <span className="flex-1 truncate text-fg">Product designer</span>
            <ChevronDownIcon className="size-3.5 shrink-0 text-fg-muted" />
          </button>
        </div>
      </div>
      <div className="flex w-full items-start justify-center gap-3">
        <div
          className={cn(
            "flex w-48 flex-col gap-1.5",
            bar && "border-l-[3px] border-border-danger pl-2.5",
          )}
        >
          <label htmlFor={`${id}-user`} className={LABEL}>
            Username
          </label>
          {bar && (
            <p className="text-xs font-semibold text-fg-danger">
              Username is taken
            </p>
          )}
          <div
            className={cn(box, "border-border-danger")}
            style={boxStyle("username")}
          >
            <input
              id={`${id}-user`}
              type="text"
              aria-invalid
              defaultValue="mehdi"
              onFocus={() => setFocused("username")}
              onBlur={() => setFocused(null)}
              className={BARE_INPUT}
            />
          </div>
          {state.inputError === "message" && (
            <p className="flex items-center gap-1 text-xs text-fg-danger">
              <CircleAlertIcon className="size-3 shrink-0" />
              Username is taken
            </p>
          )}
        </div>
        <div className="flex w-48 flex-col gap-1.5">
          <label htmlFor={`${id}-notes`} className={LABEL}>
            Notes
          </label>
          <textarea
            id={`${id}-notes`}
            rows={2}
            placeholder="Anything we should know?"
            onFocus={() => setFocused("notes")}
            onBlur={() => setFocused(null)}
            className={cn(
              "w-full resize-none px-2.5 py-1.5 text-[0.8125rem] text-fg transition-[background-color,border-color,box-shadow] duration-150 outline-none placeholder:text-fg-muted",
              look.className,
              hoverFx(state),
            )}
            style={boxStyle("notes")}
          />
        </div>
      </div>
    </Hero>
  )
}

/** Collapsed-row summary: the field style, and the hover feel when it has
 *  one. */
export function inputsSummary(state: LabState): string {
  const style =
    STYLE_OPTIONS.find((o) => o.value === state.inputStyle)?.label ??
    state.inputStyle
  const hover = HOVER_OPTIONS.find((o) => o.value === state.inputHover)?.label
  return state.inputHover === "none" ? style : `${style} · ${hover} hover`
}

export function InputsSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <FieldHero state={state} />
      <SelectRow
        label="Style"
        value={state.inputStyle}
        onChange={set("inputStyle")}
        options={STYLE_OPTIONS}
      />
      <SelectRow
        label="Hover"
        value={state.inputHover}
        onChange={set("inputHover")}
        options={HOVER_OPTIONS}
      />
    </ControlGroup>
  )
}
