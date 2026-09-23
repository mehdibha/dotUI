"use client"

import * as ComboBoxPrimitive from "react-aria-components/ComboBox"
import { composeRenderProps } from "react-aria-components/composeRenderProps"

import { ChevronDownIcon } from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import type { ButtonProps } from "@/registry/ui/button"
import { fieldStyles } from "@/registry/ui/field"

/* -----------------------------------------------------------------------------------------------*/

interface ComboboxProps<
  T extends object,
  M extends "single" | "multiple" = "single",
> extends ComboBoxPrimitive.ComboBoxProps<T, M> {}
const Combobox = <
  T extends object,
  M extends "single" | "multiple" = "single",
>({
  menuTrigger = "focus",
  className,
  ...props
}: ComboboxProps<T, M>) => {
  return (
    <ComboBoxPrimitive.ComboBox
      data-field=""
      menuTrigger={menuTrigger}
      className={composeRenderProps(className, (className) =>
        fieldStyles().field({
          className: cn("group/combobox", className),
        }),
      )}
      {...props}
    />
  )
}

/* -----------------------------------------------------------------------------------------------*/

interface ComboboxValueProps<
  T extends object,
> extends ComboBoxPrimitive.ComboBoxValueProps<T> {}
const ComboboxValue = <T extends object>({
  className,
  ...props
}: ComboboxValueProps<T>) => {
  return (
    <ComboBoxPrimitive.ComboBoxValue
      data-combobox-value=""
      className={composeRenderProps(className, (c) =>
        cn("flex items-center gap-1", c),
      )}
      {...props}
    />
  )
}

/* -----------------------------------------------------------------------------------------------*/

interface ComboboxTriggerProps extends Omit<ButtonProps, "children"> {}
const ComboboxTrigger = (props: ComboboxTriggerProps) => {
  return (
    <Button variant="quiet" isIconOnly {...props}>
      <ChevronDownIcon />
    </Button>
  )
}

export type { ComboboxProps, ComboboxTriggerProps }
export { Combobox, ComboboxTrigger, ComboboxValue }
