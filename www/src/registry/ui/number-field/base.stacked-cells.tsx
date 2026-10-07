"use client"

import type * as React from "react"
import * as ButtonPrimitive from "react-aria-components/Button"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import * as GroupPrimitive from "react-aria-components/Group"
import * as NumberFieldPrimitives from "react-aria-components/NumberField"

import { ChevronDownIcon, ChevronUpIcon } from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { useStyles as useFieldStyles } from "@/registry/ui/field/styles"
import { Input } from "@/registry/ui/input"
import { useStyles as useInputStyles } from "@/registry/ui/input/styles"

interface NumberFieldProps extends React.ComponentProps<
  typeof NumberFieldPrimitives.NumberField
> {}

const NumberField = ({ className, ...props }: NumberFieldProps) => {
  const fieldStyles = useFieldStyles()
  return (
    <NumberFieldPrimitives.NumberField
      data-slot="number-field"
      data-field=""
      className={composeRenderProps(className, (className) =>
        fieldStyles().field({ className }),
      )}
      {...props}
    >
      {composeRenderProps(
        props.children,
        (children) =>
          children ?? (
            <NumberFieldGroup>
              <Input />
              <NumberFieldIncrement />
              <NumberFieldDecrement />
            </NumberFieldGroup>
          ),
      )}
    </NumberFieldPrimitives.NumberField>
  )
}

interface NumberFieldGroupProps extends React.ComponentProps<
  typeof GroupPrimitive.Group
> {
  size?: "sm" | "md" | "lg"
}

// A chevron column at the end; parts are placed by slot.
const NumberFieldGroup = ({
  className,
  size,
  ...props
}: NumberFieldGroupProps) => {
  const { inputGroup } = useInputStyles()()
  return (
    <GroupPrimitive.Group
      data-slot="number-field-group"
      data-input-group=""
      data-size={size}
      className={composeRenderProps(className, (className) =>
        inputGroup({
          size,
          className: cn(
            "inline-grid w-fit grid-cols-[1fr_auto] grid-rows-2 items-stretch overflow-hidden pr-0 *:data-input:row-span-2",
            "*:[[slot=decrement]]:col-start-2 *:[[slot=decrement]]:row-start-2 *:[[slot=increment]]:col-start-2 *:[[slot=increment]]:row-start-1",
            className,
          ),
        }),
      )}
      {...props}
    />
  )
}

interface NumberFieldStepperProps extends React.ComponentProps<
  typeof ButtonPrimitive.Button
> {}

const stepper =
  "flex shrink-0 cursor-interactive items-center justify-center self-stretch text-fg-muted outline-none transition-colors hover:bg-neutral-hover hover:text-fg pressed:bg-neutral-active disabled:cursor-disabled disabled:bg-transparent disabled:text-(--disabled-fg,currentColor) w-7 border-l-(length:--studio-control-stroke) *:[svg]:size-3"

const NumberFieldDecrement = ({
  className,
  children,
  ...props
}: NumberFieldStepperProps) => {
  const { divider } = useInputStyles()()
  return (
    <ButtonPrimitive.Button
      slot="decrement"
      className={composeRenderProps(className, (className) =>
        divider({
          className: cn(
            stepper,
            "border-t-(length:--studio-control-stroke)",
            className,
          ),
        }),
      )}
      {...props}
    >
      {children ?? <ChevronDownIcon />}
    </ButtonPrimitive.Button>
  )
}

const NumberFieldIncrement = ({
  className,
  children,
  ...props
}: NumberFieldStepperProps) => {
  const { divider } = useInputStyles()()
  return (
    <ButtonPrimitive.Button
      slot="increment"
      className={composeRenderProps(className, (className) =>
        divider({ className: cn(stepper, className) }),
      )}
      {...props}
    >
      {children ?? <ChevronUpIcon />}
    </ButtonPrimitive.Button>
  )
}

export type { NumberFieldGroupProps, NumberFieldProps, NumberFieldStepperProps }
export {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
}
