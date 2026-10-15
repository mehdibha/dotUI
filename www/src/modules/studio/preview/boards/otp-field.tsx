"use client"

import { Input } from "@/registry/ui/input"
import { useStyles as useInputStyles } from "@/registry/ui/input/styles"
import {
  OTPField,
  OTPFieldGroup,
  OTPFieldSeparator,
} from "@/registry/ui/otp-field"
import { useStyles as useOTPStyles } from "@/registry/ui/otp-field/styles"

import { Board, BoardSection, Specimen, stateProps } from "./board"

const SEPARATOR = "px-2 text-fg-muted"

/** A code half typed, its next cell focused; frozen, since a live one can't hold focus. */
function Typing() {
  const { root, group } = useOTPStyles()()
  const { input } = useInputStyles()()
  const cell = (index: number) => (
    <input
      key={index}
      data-input=""
      aria-label={`Digit ${index + 1}`}
      value={"482"[index] ?? ""}
      readOnly
      tabIndex={-1}
      {...(index === 3
        ? { ...stateProps("focus"), "data-focused": "true" }
        : stateProps("rest"))}
      className={input()}
    />
  )
  return (
    <div
      inert
      data-otp-field=""
      className={root({ className: "w-fit sm:[zoom:1.5] lg:[zoom:2]" })}
    >
      <div className="flex items-center">
        <div className={group()}>{[0, 1, 2].map(cell)}</div>
        <span className={SEPARATOR}>-</span>
        <div className={group()}>{[3, 4, 5].map(cell)}</div>
      </div>
    </div>
  )
}

function Cells({ from }: { from: number }) {
  return (
    <OTPFieldGroup>
      {[0, 1, 2].map((i) => (
        <Input key={i} aria-label={`Digit ${from + i}`} />
      ))}
    </OTPFieldGroup>
  )
}

const STATES = [
  { label: "Invalid", props: { isInvalid: true } },
  { label: "Disabled", props: { isDisabled: true } },
]

export default function OTPFieldBoard() {
  return (
    <Board id="otp-field">
      <BoardSection title="Cells">
        <Typing />
      </BoardSection>
      <BoardSection title="States">
        <div className="grid w-full grid-cols-1 gap-x-5 gap-y-6 @xl/section:grid-cols-2">
          {STATES.map(({ label, props }) => (
            <Specimen key={label} label={label}>
              <OTPField
                aria-label="Verification code"
                length={6}
                defaultValue="482913"
                className="w-fit"
                {...props}
              >
                <div className="flex items-center">
                  <Cells from={1} />
                  <OTPFieldSeparator className={SEPARATOR}>-</OTPFieldSeparator>
                  <Cells from={4} />
                </div>
              </OTPField>
            </Specimen>
          ))}
        </div>
      </BoardSection>
    </Board>
  )
}
