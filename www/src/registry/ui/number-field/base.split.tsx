"use client"

import type * as React from "react"
import * as ButtonPrimitives from "react-aria-components/Button"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import * as GroupPrimitives from "react-aria-components/Group"
import * as NumberFieldPrimitives from "react-aria-components/NumberField"

import { MinusIcon, PlusIcon } from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { useStyles as useFieldStyles } from "@/registry/ui/field/styles"
import { Input } from "@/registry/ui/input"
import { useStyles as useInputStyles } from "@/registry/ui/input/styles"

interface NumberFieldProps extends React.ComponentProps<
  typeof NumberFieldPrimitives.NumberField
> {}

const NumberField = ({ className, ...props }: NumberFieldProps) => {
  const { field } = useFieldStyles()()
  return (
    <NumberFieldPrimitives.NumberField
      data-slot="number-field"
      data-field=""
      className={composeRenderProps(className, (className) =>
        field({ className }),
      )}
      {...props}
    >
      {composeRenderProps(
        props.children,
        (children) =>
          children ?? (
            <NumberFieldGroup>
              <NumberFieldDecrement />
              <Input />
              <NumberFieldIncrement />
            </NumberFieldGroup>
          ),
      )}
    </NumberFieldPrimitives.NumberField>
  )
}

// MARK: Separator

interface NumberFieldGroupProps extends React.ComponentProps<
  typeof GroupPrimitives.Group
> {
  size?: "sm" | "md" | "lg"
}

// Minus at the start, plus at the end; parts are placed by slot.
const NumberFieldGroup = ({
  className,
  size,
  ...props
}: NumberFieldGroupProps) => {
  const { inputGroup } = useInputStyles()()
  return (
    <GroupPrimitives.Group
      data-slot="number-field-group"
      data-input-group=""
      data-size={size}
      className={composeRenderProps(className, (className) =>
        inputGroup({
          size,
          className: cn(
            "w-fit overflow-hidden px-0 *:data-input:text-center",
            "*:[[slot=decrement]]:-order-1 *:[[slot=increment]]:order-1",
            className,
          ),
        }),
      )}
      {...props}
    />
  )
}

interface NumberFieldStepperProps extends React.ComponentProps<
  typeof ButtonPrimitives.Button
> {}

const stepper =
  "flex shrink-0 cursor-interactive items-center justify-center self-stretch text-fg-muted outline-none transition-colors hover:bg-neutral-hover hover:text-fg pressed:bg-neutral-active disabled:cursor-disabled disabled:bg-transparent disabled:text-(--disabled-fg,currentColor) w-(--input-h) *:[svg]:size-(--icon-size)"

// MARK: Separator

const NumberFieldDecrement = ({
  className,
  children,
  ...props
}: NumberFieldStepperProps) => {
  const { divider } = useInputStyles()()
  return (
    <ButtonPrimitives.Button
      slot="decrement"
      className={composeRenderProps(className, (className) =>
        divider({
          className: cn(
            stepper,
            "border-r-(length:--studio-control-stroke)",
            className,
          ),
        }),
      )}
      {...props}
    >
      {children ?? <MinusIcon />}
    </ButtonPrimitives.Button>
  )
}

// MARK: Separator

const NumberFieldIncrement = ({
  className,
  children,
  ...props
}: NumberFieldStepperProps) => {
  const { divider } = useInputStyles()()
  return (
    <ButtonPrimitives.Button
      slot="increment"
      className={composeRenderProps(className, (className) =>
        divider({
          className: cn(
            stepper,
            "border-l-(length:--studio-control-stroke)",
            className,
          ),
        }),
      )}
      {...props}
    >
      {children ?? <PlusIcon />}
    </ButtonPrimitives.Button>
  )
}

// MARK: Separator

export type { NumberFieldGroupProps, NumberFieldProps, NumberFieldStepperProps }
export {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
}
