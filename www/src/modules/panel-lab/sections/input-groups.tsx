"use client"

/* Input groups — the Buttons→Group analog: how a prefix/suffix sits in the
   field splits the ecosystem — floating inside the shell (shadcn, Geist,
   Linear, Polaris, and the registry today) vs a boxed cell attached to the
   edge (Bootstrap input-group, Ant addonBefore/After). The registry can only
   express inside today — the boxed family is a missing axis (see issue).
   The field look comes from the Inputs section. */

import { useState } from "react"
import type { CSSProperties } from "react"
import { CopyIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"

import { Hero } from "../hero"
import { ControlGroup, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Lab, LabState } from "../state"
import { focusFieldStyle } from "./focus"
import { BARE_INPUT, hoverFx, inputLook, SHELL } from "./inputs"
import { controlRadiusPx } from "./shape"

export const INPUT_GROUP_DEFAULTS = {
  addonLayout: "inside",
  addonDivider: "hairline",
}

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

/** One group, both attachments: a text prefix and an icon-button suffix
 *  around a live input — the two addon kinds systems actually disagree on. */
export function AddonsHero({ state }: { state: LabState }) {
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
              divided && "border-r border-border-control",
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
              divided && "border-l border-border-control",
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

/** Collapsed-row summary: the addon layout, and the divider when boxed. */
export function inputGroupsSummary(state: LabState): string {
  const layout =
    ADDON_LAYOUT_OPTIONS.find((o) => o.value === state.addonLayout)?.label ??
    state.addonLayout
  if (state.addonLayout !== "boxed" || state.addonDivider === "none")
    return `${layout} addons`
  const divider =
    ADDON_DIVIDER_OPTIONS.find((o) => o.value === state.addonDivider)?.label ??
    state.addonDivider
  return `${layout} addons · ${divider} divider`
}

export function InputGroupsSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
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
  )
}
