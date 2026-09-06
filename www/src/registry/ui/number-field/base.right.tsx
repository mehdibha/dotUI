"use client"

import type * as React from "react"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import * as GroupPrimitive from "react-aria-components/Group"
import * as NumberFieldPrimitives from "react-aria-components/NumberField"

import { MinusIcon, PlusIcon } from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Button, type ButtonProps } from "@/registry/ui/button"
import { fieldStyles } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"

interface NumberFieldProps extends React.ComponentProps<
  typeof NumberFieldPrimitives.NumberField
> {}

const NumberField = ({ className, ...props }: NumberFieldProps) => {
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
> {}

// Steppers attached on the right. Parts are placed by slot, so the authored
// order never matters.
const NumberFieldGroup = ({ className, ...props }: NumberFieldGroupProps) => {
  return (
    <GroupPrimitive.Group
      data-slot="number-field-group"
      className={composeRenderProps(className, (className) =>
        cn(
          "flex w-fit items-stretch -space-x-px *:focus:z-2 *:[input]:z-1",
          "*:data-input:rounded-r-none",
          "*:[[slot=decrement]]:order-1 *:[[slot=decrement]]:rounded-none",
          "*:[[slot=increment]]:order-2 *:[[slot=increment]]:rounded-l-none",
          className,
        ),
      )}
      {...props}
    />
  )
}

const NumberFieldDecrement = ({ children, ...props }: ButtonProps) => {
  return (
    <Button slot="decrement" isIconOnly {...props}>
      {children ?? <MinusIcon />}
    </Button>
  )
}

const NumberFieldIncrement = ({ children, ...props }: ButtonProps) => {
  return (
    <Button slot="increment" isIconOnly {...props}>
      {children ?? <PlusIcon />}
    </Button>
  )
}

export type { NumberFieldGroupProps, NumberFieldProps }
export {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
}
