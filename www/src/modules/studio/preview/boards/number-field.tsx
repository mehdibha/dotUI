"use client"

import { cn } from "@/registry/lib/utils"
import { Input } from "@/registry/ui/input"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
} from "@/registry/ui/number-field"
import type {
  NumberFieldGroupProps,
  NumberFieldProps,
} from "@/registry/ui/number-field"

import { Board, BoardSection, Specimen } from "./board"

/** Sized by its value, so the steppers keep their room at every height. */
function Stepper({
  size,
  className,
  ...props
}: Omit<NumberFieldProps, "children" | "className"> & {
  size?: NumberFieldGroupProps["size"]
  className?: string
}) {
  return (
    <NumberField
      aria-label="Quantity"
      defaultValue={1024}
      className={cn("w-fit", className)}
      {...props}
    >
      <NumberFieldGroup size={size}>
        <NumberFieldDecrement />
        <Input className="w-[5.5em]" />
        <NumberFieldIncrement />
      </NumberFieldGroup>
    </NumberField>
  )
}

const SIZES = [
  { size: "sm", label: "Small" },
  { size: "md", label: "Medium" },
  { size: "lg", label: "Large" },
] as const

const STATES = [
  { label: "Disabled", props: { isDisabled: true } },
  { label: "Read-only", props: { isReadOnly: true } },
  { label: "Invalid", props: { isInvalid: true } },
]

// Sizes and States share one grid, so their specimens line up.
const GRID =
  "grid w-full grid-cols-1 items-end gap-x-5 gap-y-6 @xl/section:grid-cols-3"

export default function NumberFieldBoard() {
  return (
    <Board id="number-field">
      <BoardSection title="Steppers">
        <Stepper className="zoom-[1.5] lg:zoom-[2]" />
      </BoardSection>
      <BoardSection title="Sizes">
        <div className={GRID}>
          {SIZES.map(({ size, label }) => (
            <Specimen key={size} label={label}>
              <Stepper size={size} />
            </Specimen>
          ))}
        </div>
      </BoardSection>
      <BoardSection title="States">
        <div className={GRID}>
          {STATES.map(({ label, props }) => (
            <Specimen key={label} label={label}>
              <Stepper {...props} />
            </Specimen>
          ))}
        </div>
      </BoardSection>
    </Board>
  )
}
