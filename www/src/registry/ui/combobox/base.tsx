"use client"

import * as ComboBoxPrimitives from "react-aria-components/ComboBox"
import { composeRenderProps } from "react-aria-components/composeRenderProps"

import { cn } from "@/registry/lib/utils"
import { useStyles as useFieldStyles } from "@/registry/ui/field/styles"

interface ComboboxProps<
  T extends object,
  M extends "single" | "multiple" = "single",
> extends ComboBoxPrimitives.ComboBoxProps<T, M> {}
const Combobox = <
  T extends object,
  M extends "single" | "multiple" = "single",
>({
  menuTrigger = "focus",
  className,
  ...props
}: ComboboxProps<T, M>) => {
  const { field } = useFieldStyles()()
  return (
    <ComboBoxPrimitives.ComboBox
      data-field=""
      menuTrigger={menuTrigger}
      className={composeRenderProps(className, (className) =>
        field({
          className: cn("group/combobox", className),
        }),
      )}
      {...props}
    />
  )
}

// MARK: Separator

interface ComboboxValueProps<
  T extends object,
> extends ComboBoxPrimitives.ComboBoxValueProps<T> {}
const ComboboxValue = <T extends object>({
  className,
  ...props
}: ComboboxValueProps<T>) => {
  return (
    <ComboBoxPrimitives.ComboBoxValue
      data-combobox-value=""
      className={composeRenderProps(className, (className) =>
        cn("flex items-center gap-1", className),
      )}
      {...props}
    />
  )
}

// MARK: Separator

export type { ComboboxProps, ComboboxValueProps }
export { Combobox, ComboboxValue }
