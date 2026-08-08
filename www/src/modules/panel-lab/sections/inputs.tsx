"use client"

/* Inputs — the field style, a family decision rather than one component's, so
   the hero shows a real input next to a select trigger wearing the same look.
   Real enum: outline | line | filled-line-bottom | filled (input/meta.ts). */

import type { CSSProperties } from "react"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"
import {
  MiniInput,
  OptionGridRow,
  SPECIMEN_FIELD,
} from "@/modules/control-lab/rows"
import type { OptionGridItem } from "@/modules/control-lab/rows"

import { Hero } from "../hero"
import type { Lab, LabState } from "../state"
import { controlRadiusPx } from "./shape"

export const INPUT_DEFAULTS = {
  inputStyle: "outline",
}

const STYLE_OPTIONS: OptionGridItem[] = [
  {
    id: "outline",
    label: "Outline",
    preview: (
      <MiniInput className="rounded-(--input-radius) border border-border-field bg-field" />
    ),
  },
  {
    id: "line",
    label: "Line",
    preview: <MiniInput className="border-b border-border-field" />,
  },
  {
    id: "filled-line-bottom",
    label: "Filled line",
    preview: (
      <MiniInput className="rounded-t-(--input-radius) border-b border-border-field bg-neutral" />
    ),
  },
  {
    id: "filled",
    label: "Filled",
    preview: <MiniInput className="rounded-(--input-radius) bg-neutral" />,
  },
]

/** Style → what the field paints. Radius only where the style rounds. */
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
      return { className: "bg-neutral", style: { borderRadius: radius } }
    default:
      return {
        className: "border border-border-field bg-field",
        style: { borderRadius: radius },
      }
  }
}

const FIELD = cn(
  SPECIMEN_FIELD,
  "gap-2 transition-colors outline-none focus-visible:focus-ring",
)

function InputsHero({ state }: { state: LabState }) {
  const look = inputLook(state.inputStyle, controlRadiusPx(state))

  return (
    <Hero>
      <label className="flex flex-col gap-1">
        <span className="text-xs font-medium text-fg">Email</span>
        <input
          type="text"
          placeholder="you@example.com"
          className={cn(FIELD, look.className, "placeholder:text-fg-muted")}
          style={look.style}
        />
      </label>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-fg">Role</span>
        <button
          type="button"
          className={cn(FIELD, look.className, "cursor-interactive")}
          style={look.style}
        >
          <span className="flex-1 truncate text-left text-fg">
            Product designer
          </span>
          <ChevronDownIcon className="size-3.5 shrink-0 text-fg-muted" />
        </button>
      </div>
    </Hero>
  )
}

export function InputsSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <>
      <InputsHero state={state} />
      <OptionGridRow
        label="Style"
        value={state.inputStyle}
        onChange={set("inputStyle")}
        options={STYLE_OPTIONS}
      />
    </>
  )
}
