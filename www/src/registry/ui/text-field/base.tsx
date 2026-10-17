"use client"

import { composeRenderProps } from "react-aria-components/composeRenderProps"
import * as TextFieldPrimitives from "react-aria-components/TextField"

import { cn } from "@/registry/lib/utils"
import { useStyles as useFieldStyles } from "@/registry/ui/field/styles"

// MARK: textFieldStyles

// MARK: Separator

interface TextFieldProps extends TextFieldPrimitives.TextFieldProps {}

const TextField = ({ className, ...props }: TextFieldProps) => {
  const { field } = useFieldStyles()()
  return (
    <TextFieldPrimitives.TextField
      data-field=""
      data-textfield=""
      data-text-field=""
      className={composeRenderProps(className, (className) =>
        field({ className: cn("group/text-field", className) }),
      )}
      {...props}
    />
  )
}

// MARK: Separator

export type { TextFieldProps }
export { TextField }
