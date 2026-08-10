"use client"

/* Inputs — the field family's axes (Select, Combobox, Textarea follow Input).
   Style is the registry's real enum (input/meta.ts); hover is the field's own
   pointer state. Focus is owned by the Focus section — specimens wear that
   recipe live when they focus. Labels always sit on top: float and
   placeholder-only failed review (a11y, systems moving away), inset is an
   InputGroup composition, not an axis.

   Addons is the Buttons→Group analog: how a prefix/suffix sits in the field
   splits the ecosystem — floating inside the shell (shadcn, Geist, Linear,
   Polaris, and the registry today) vs a boxed cell attached to the edge
   (Bootstrap input-group, Ant addonBefore/After). The registry can only
   express inside today — the boxed family is a missing axis (see issue). */

import { useId, useState } from "react"
import type { CSSProperties } from "react"
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CopyIcon,
  MinusIcon,
  PlusIcon,
} from "lucide-react"

import { cn } from "@/registry/lib/utils"
import { ControlGroup, GroupTitle, SelectRow } from "@/modules/control-lab/rows"
import type { SelectRowOption } from "@/modules/control-lab/rows"

import { Hero } from "../hero"
import type { Lab, LabState } from "../state"
import { focusFieldStyle } from "./focus"
import { controlRadiusPx } from "./shape"

export const INPUT_DEFAULTS = {
  inputStyle: "outline",
  inputHover: "none",
  addonLayout: "inside",
  addonDivider: "hairline",
  numberLayout: "right",
  otpStyle: "boxes",
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

const ADDON_LAYOUT_OPTIONS: SelectRowOption[] = [
  { value: "inside", label: "Inside" },
  { value: "boxed", label: "Boxed" },
]

/* Bootstrap and Ant always divide the cell from the input; a few designs let
   the cell fill run into the field, so the hairline is a choice, not a given. */
const ADDON_DIVIDER_OPTIONS: SelectRowOption[] = [
  { value: "hairline", label: "Hairline" },
  { value: "none", label: "None" },
]

/* Number and OTP are per-component styles being tried as blocks — in /create
   they'd land as component style variants, not family axes.

   Stepper placement: adjacent right pair (the registry today, Carbon), one
   button at each end (Polaris mobile, HeroUI), stacked chevron column
   (Spectrum, Ant, classic desktop). */
const NUMBER_LAYOUT_OPTIONS: SelectRowOption[] = [
  { value: "right", label: "Right" },
  { value: "split", label: "Split" },
  { value: "stacked", label: "Stacked" },
]

/* OTP cells: separate boxes (the registry today, iOS), one attached group
   with dividers (shadcn), a bare dash per digit (Material-ish minimal). */
const OTP_STYLE_OPTIONS: SelectRowOption[] = [
  { value: "boxes", label: "Boxes" },
  { value: "group", label: "Group" },
  { value: "underline", label: "Underline" },
]

/** Style → what the field shell paints. Radius only where the style rounds;
 *  filled keeps a transparent border so focus and hover can swap it in. */
function inputLook(
  styleId: string,
  radius: number,
): { className: string; style: CSSProperties } {
  switch (styleId) {
    case "line":
      return { className: "border-b border-border-field", style: {} }
    case "filled-line-bottom":
      return {
        className: "border-b border-border-field bg-neutral",
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
        className: "border border-border-field bg-field",
        style: { borderRadius: radius },
      }
  }
}

function hoverFx(state: LabState): string {
  switch (state.inputHover) {
    case "border":
      return "hover:not-focus-within:border-border-hover"
    case "tint":
      return "hover:not-focus-within:bg-neutral-hover"
    default:
      return ""
  }
}

const SHELL =
  "flex h-8 w-full min-w-0 items-center text-[0.8125rem] transition-[background-color,border-color,box-shadow] duration-150 outline-none"

const BARE_INPUT =
  "h-full w-full min-w-0 bg-transparent text-fg outline-none placeholder:text-fg-muted"

const LABEL = "text-xs font-medium text-fg"

/** Live specimens — label, control, help — focusing with the Focus section's
 *  field recipe, the way the buttons hero hovers and presses for real. */
function FieldHero({ state }: { state: LabState }) {
  const id = useId()
  const [focused, setFocused] = useState<"email" | "role" | null>(null)
  const look = inputLook(state.inputStyle, controlRadiusPx(state))
  const box = cn(SHELL, "gap-2 px-2.5", look.className, hoverFx(state))
  const boxStyle = (specimen: "email" | "role"): CSSProperties =>
    focused === specimen
      ? { ...look.style, ...focusFieldStyle(state) }
      : look.style

  return (
    <Hero className="items-center py-5">
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
    </Hero>
  )
}

/** One group, both attachments: a text prefix and an icon-button suffix
 *  around a live input — the two addon kinds systems actually disagree on. */
function AddonsHero({ state }: { state: LabState }) {
  const [focused, setFocused] = useState(false)
  const radius = controlRadiusPx(state)
  const look = inputLook(state.inputStyle, radius)
  const boxed = state.addonLayout === "boxed"
  const divided = boxed && state.addonDivider === "hairline"
  const shell = cn(
    SHELL,
    "w-64",
    boxed ? "overflow-hidden" : "gap-2 px-2.5",
    look.className,
    hoverFx(state),
  )
  const shellStyle: CSSProperties = focused
    ? { ...look.style, ...focusFieldStyle(state) }
    : look.style

  const input = (
    <input
      type="text"
      placeholder="dotui.org"
      aria-label="Domain"
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={cn(BARE_INPUT, "flex-1", boxed && "px-2.5")}
    />
  )

  return (
    <Hero className="items-center py-5">
      {boxed ? (
        <div className={shell} style={shellStyle}>
          <span
            className={cn(
              "flex h-full shrink-0 items-center bg-neutral px-2.5 text-fg-muted",
              divided && "border-r border-border-field",
            )}
          >
            https://
          </span>
          {input}
          <button
            type="button"
            aria-label="Copy"
            className={cn(
              "flex h-full shrink-0 cursor-interactive items-center bg-neutral px-2.5 text-fg-muted outline-none hover:bg-neutral-hover hover:text-fg",
              divided && "border-l border-border-field",
            )}
          >
            <CopyIcon className="size-3.5" />
          </button>
        </div>
      ) : (
        <div className={shell} style={shellStyle}>
          <span className="shrink-0 text-fg-muted">https://</span>
          {input}
          <button
            type="button"
            aria-label="Copy"
            className="flex size-6 shrink-0 cursor-interactive items-center justify-center text-fg-muted outline-none hover:bg-highlight hover:text-fg"
            style={{ borderRadius: Math.max(radius - 3, 2) }}
          >
            <CopyIcon className="size-3.5" />
          </button>
        </div>
      )}
    </Hero>
  )
}

/** A working stepper: the shell is the field, the buttons really step, and
 *  the three placements systems disagree on swap around a live value. */
function NumberHero({ state }: { state: LabState }) {
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
          <span className="flex h-full w-6 shrink-0 flex-col border-l border-border-field">
            <button
              type="button"
              aria-label="Increment"
              onClick={() => setValue((v) => v + 1)}
              className="flex flex-1 cursor-interactive items-center justify-center border-b border-border-field text-fg-muted outline-none hover:bg-highlight hover:text-fg"
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

/** Three digits and a caret: cells wear the field style boxed, fused into one
 *  group, or reduced to a dash per digit. */
function OtpHero({ state }: { state: LabState }) {
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
            "flex divide-x divide-border-field overflow-hidden",
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
                className={cn(cell, "border-b-2 border-border-field")}
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

export function InputsSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <>
      <GroupTitle>Field</GroupTitle>
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
      <GroupTitle>Addons</GroupTitle>
      <ControlGroup>
        <AddonsHero state={state} />
        <SelectRow
          label="Layout"
          value={state.addonLayout}
          onChange={set("addonLayout")}
          options={ADDON_LAYOUT_OPTIONS}
        />
        {state.addonLayout === "boxed" && (
          <SelectRow
            label="Divider"
            value={state.addonDivider}
            onChange={set("addonDivider")}
            options={ADDON_DIVIDER_OPTIONS}
          />
        )}
      </ControlGroup>
      <GroupTitle>Number</GroupTitle>
      <ControlGroup>
        <NumberHero state={state} />
        <SelectRow
          label="Steppers"
          value={state.numberLayout}
          onChange={set("numberLayout")}
          options={NUMBER_LAYOUT_OPTIONS}
        />
      </ControlGroup>
      <GroupTitle>OTP</GroupTitle>
      <ControlGroup>
        <OtpHero state={state} />
        <SelectRow
          label="Cells"
          value={state.otpStyle}
          onChange={set("otpStyle")}
          options={OTP_STYLE_OPTIONS}
        />
      </ControlGroup>
    </>
  )
}
