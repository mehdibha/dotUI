"use client"

import type * as React from "react"
import * as ButtonPrimitives from "react-aria-components/Button"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import * as GroupPrimitives from "react-aria-components/Group"
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
  const { field } = useFieldStyles()()
  return (
    <NumberFieldPrimitives.NumberField
      data-number-field=""
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
              <Input />
              <NumberFieldIncrement />
              <NumberFieldDecrement />
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

// Two inset segments stacked at the end; parts are placed by slot.
const NumberFieldGroup = ({
  className,
  size,
  ...props
}: NumberFieldGroupProps) => {
  const { inputGroup } = useInputStyles()()
  return (
    <GroupPrimitives.Group
      data-number-field-group=""
      data-input-group=""
      data-size={size}
      className={composeRenderProps(className, (className) =>
        inputGroup({
          size,
          className: cn(
            "inline-grid w-fit grid-cols-[1fr_auto] grid-rows-2 items-stretch gap-x-1 gap-y-px py-1 pr-1 *:data-input:row-span-2",
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
  typeof ButtonPrimitives.Button
> {}

const stepper =
  "flex w-5 shrink-0 cursor-interactive items-center justify-center rounded-(--studio-radius-detail) text-fg-muted outline-none transition-colors hover:bg-neutral-hover hover:text-fg pressed:bg-neutral-active disabled:cursor-disabled disabled:bg-(--disabled-bg,var(--color-neutral)) disabled:text-(--disabled-fg,currentColor) *:[svg]:size-3"

// MARK: Separator

const NumberFieldDecrement = ({
  className,
  children,
  ...props
}: NumberFieldStepperProps) => {
  const { chip } = useInputStyles()()
  return (
    <ButtonPrimitives.Button
      slot="decrement"
      className={composeRenderProps(className, (className) =>
        chip({ className: cn(stepper, className) }),
      )}
      {...props}
    >
      {children ?? <ChevronDownIcon />}
    </ButtonPrimitives.Button>
  )
}

// MARK: Separator

const NumberFieldIncrement = ({
  className,
  children,
  ...props
}: NumberFieldStepperProps) => {
  const { chip } = useInputStyles()()
  return (
    <ButtonPrimitives.Button
      slot="increment"
      className={composeRenderProps(className, (className) =>
        chip({ className: cn(stepper, className) }),
      )}
      {...props}
    >
      {children ?? <ChevronUpIcon />}
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
