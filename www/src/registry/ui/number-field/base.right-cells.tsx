"use client"

import type * as React from "react"
import * as ButtonPrimitive from "react-aria-components/Button"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import * as GroupPrimitive from "react-aria-components/Group"
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
              <NumberFieldDecrement />
              <NumberFieldIncrement />
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

// Stepper cells at the end of the shell; parts are placed by slot.
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
            "w-fit overflow-hidden pr-0",
            "*:[[slot=decrement]]:order-1 *:[[slot=increment]]:order-2",
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
  "flex shrink-0 cursor-interactive items-center justify-center self-stretch text-fg-muted outline-none transition-colors hover:bg-neutral-hover hover:text-fg pressed:bg-neutral-active disabled:cursor-disabled disabled:bg-transparent disabled:text-(--disabled-fg,currentColor) w-(--input-h) *:[svg]:size-(--icon-size)"

const NumberFieldDecrement = ({
  className,
  children,
  ...props
}: NumberFieldStepperProps) => {
  return (
    <ButtonPrimitive.Button
      slot="decrement"
      className={composeRenderProps(className, (className) =>
        cn(stepper, className),
      )}
      {...props}
    >
      {children ?? <MinusIcon />}
    </ButtonPrimitive.Button>
  )
}

const NumberFieldIncrement = ({
  className,
  children,
  ...props
}: NumberFieldStepperProps) => {
  return (
    <ButtonPrimitive.Button
      slot="increment"
      className={composeRenderProps(className, (className) =>
        cn(
          stepper,
          "relative before:absolute before:top-1/2 before:left-0 before:h-(--icon-size) before:w-px before:-translate-y-1/2 before:bg-border",
          className,
        ),
      )}
      {...props}
    >
      {children ?? <PlusIcon />}
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
