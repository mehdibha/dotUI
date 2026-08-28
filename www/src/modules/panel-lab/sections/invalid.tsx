"use client"

/* Invalid — how the system flags a failed value, everywhere at once.
   Extracted from Inputs (Aug 2026): invalid is a cross-component state like
   Focus and Disabled, not a field-only knob. One axis, treatment: border
   swap only (shadcn primitive) vs danger border + message line with icon
   (Material, Spectrum, Carbon, Ant, Polaris — the icon rides the message in
   Spectrum/Polaris/Atlassian, the field slot in Material/Carbon) vs GOV.UK's
   left bar + bold message. Danger halo rejected: the Focus field recipe
   recolored — a state of that axis, not a new one. */

import { useId } from "react"
import { CircleAlertIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"
import { ControlGroup, SelectRow } from "@/modules/control-lab/rows"
import type { SelectRowOption } from "@/modules/control-lab/rows"

import { Hero } from "../hero"
import type { Lab, LabState } from "../state"
import { BARE_INPUT, inputLook, SHELL } from "./inputs"
import { controlRadiusPx } from "./shape"

export const INVALID_DEFAULTS = {
  inputError: "message",
}

function ErrorGlyph({ kind }: { kind: "border" | "message" | "bar" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      {kind === "border" && (
        <>
          <rect
            x="3.75"
            y="8"
            width="16.5"
            height="8"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-fg-danger"
          />
          <path
            d="M7 12h5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity=".35"
          />
        </>
      )}
      {kind === "message" && (
        <>
          <rect
            x="3.75"
            y="4.5"
            width="16.5"
            height="8"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-fg-danger"
          />
          <circle
            cx="5.5"
            cy="17.25"
            r="1.4"
            fill="currentColor"
            className="text-fg-danger"
          />
          <path
            d="M9 17.25h7.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="text-fg-danger"
          />
        </>
      )}
      {kind === "bar" && (
        <>
          <rect
            x="4"
            y="4.5"
            width="2"
            height="15"
            rx="1"
            fill="currentColor"
            className="text-fg-danger"
          />
          <path
            d="M9 7h7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="text-fg-danger"
          />
          <rect
            x="9"
            y="10.5"
            width="11"
            height="7"
            rx="1.5"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity=".45"
          />
        </>
      )}
    </svg>
  )
}

export const ERROR_OPTIONS: SelectRowOption[] = [
  {
    value: "border",
    label: "Border",
    illustration: <ErrorGlyph kind="border" />,
  },
  {
    value: "message",
    label: "Message",
    illustration: <ErrorGlyph kind="message" />,
  },
  { value: "bar", label: "Bar", illustration: <ErrorGlyph kind="bar" /> },
]

/** One failed field wearing the current field style and the treatment. */
export function InvalidHero({ state }: { state: LabState }) {
  const id = useId()
  const look = inputLook(state.inputStyle, controlRadiusPx(state))
  const bar = state.inputError === "bar"
  return (
    <Hero className="items-center py-5">
      <div
        className={cn(
          "flex w-48 flex-col gap-1.5",
          bar && "border-l-[3px] border-border-danger pl-2.5",
        )}
      >
        <label htmlFor={id} className="text-xs font-medium text-fg">
          Username
        </label>
        {bar && (
          <p className="text-xs font-semibold text-fg-danger">
            Username is taken
          </p>
        )}
        <div
          className={cn(
            SHELL,
            "gap-2 px-2.5",
            look.className,
            "border-border-danger",
          )}
          style={look.style}
        >
          <input
            id={id}
            type="text"
            aria-invalid
            defaultValue="mehdi"
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
    </Hero>
  )
}

/** Collapsed-row summary: the error treatment. */
export function invalidSummary(state: LabState): string {
  return (
    ERROR_OPTIONS.find((o) => o.value === state.inputError)?.label ??
    state.inputError
  )
}

export function InvalidSection({ lab }: { lab: Lab }) {
  const { state, set } = lab
  return (
    <ControlGroup>
      <InvalidHero state={state} />
      <SelectRow
        label="Treatment"
        value={state.inputError}
        onChange={set("inputError")}
        options={ERROR_OPTIONS}
        layout="grid"
      />
    </ControlGroup>
  )
}
