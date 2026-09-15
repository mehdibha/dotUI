"use client"

/* Invalid — how the system flags a failed value, everywhere at once.
   Extracted from Inputs (Aug 2026): invalid is a cross-component state like
   Focus and Disabled, not a field-only knob. One axis, treatment: danger
   border with a plain message (shadcn, dotUI today) vs danger border +
   message line with icon (Material, Spectrum, Carbon, Ant, Polaris — the
   icon rides the message in Spectrum/Polaris/Atlassian, the field slot in
   Material/Carbon) vs GOV.UK's left bar + bold message. Danger halo
   rejected: the Focus field recipe recolored — a state of that axis, not a
   new one. */

import { ERROR_OPTIONS } from "../axes/invalid"
import { ControlGroup, SelectRow } from "../rows"
import type { SelectRowOption } from "../rows"
import type { Studio, StudioState } from "../state"

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

const ERROR_ROW_OPTIONS: SelectRowOption[] = ERROR_OPTIONS.map((o) => ({
  ...o,
  illustration: <ErrorGlyph kind={o.value as "border" | "message" | "bar"} />,
}))

/** Collapsed-row summary: the error treatment. */
export function invalidSummary(state: StudioState): string {
  return (
    ERROR_OPTIONS.find((o) => o.value === state.inputError)?.label ??
    state.inputError
  )
}

export function InvalidSection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <ControlGroup>
      <SelectRow
        label="Treatment"
        value={state.inputError}
        onChange={set("inputError")}
        options={ERROR_ROW_OPTIONS}
        layout="grid"
      />
    </ControlGroup>
  )
}
