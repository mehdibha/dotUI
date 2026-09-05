"use client"

import type * as React from "react"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import * as GroupPrimitive from "react-aria-components/Group"
import * as NumberFieldPrimitives from "react-aria-components/NumberField"

import { ChevronDownIcon, ChevronUpIcon } from "@/registry/icons"
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
> {}

// A stacked chevron column on the right: the input spans both grid rows and
// each stepper takes one. Parts are placed by slot, so the authored order
// never matters.
const NumberFieldGroup = ({ className, ...props }: NumberFieldGroupProps) => {
  return (
    <GroupPrimitive.Group
      data-slot="number-field-group"
      className={composeRenderProps(className, (className) =>
        cn(
          "inline-grid w-fit grid-cols-[1fr_auto] grid-rows-2 *:focus:z-2 *:[input]:z-1",
          "*:data-input:row-span-2 *:data-input:rounded-r-none",
          "*:[[slot=increment]]:col-start-2 *:[[slot=increment]]:row-start-1 *:[[slot=increment]]:-ml-px *:[[slot=increment]]:h-auto *:[[slot=increment]]:min-h-0 *:[[slot=increment]]:w-7 *:[[slot=increment]]:rounded-l-none *:[[slot=increment]]:rounded-b-none *:[[slot=increment]]:px-0",
          "*:[[slot=decrement]]:col-start-2 *:[[slot=decrement]]:row-start-2 *:[[slot=decrement]]:-mt-px *:[[slot=decrement]]:-ml-px *:[[slot=decrement]]:h-auto *:[[slot=decrement]]:min-h-0 *:[[slot=decrement]]:w-7 *:[[slot=decrement]]:rounded-t-none *:[[slot=decrement]]:rounded-l-none *:[[slot=decrement]]:px-0",
          className,
        ),
      )}
      {...props}
    />
  )
}

const NumberFieldDecrement = ({ children, ...props }: ButtonProps) => {
  return (
    <Button slot="decrement" {...props}>
      {children ?? <ChevronDownIcon className="size-3" />}
    </Button>
  )
}

const NumberFieldIncrement = ({ children, ...props }: ButtonProps) => {
  return (
    <Button slot="increment" {...props}>
      {children ?? <ChevronUpIcon className="size-3" />}
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
