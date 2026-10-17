"use client"

import type * as React from "react"
import * as ColorFieldPrimitives from "react-aria-components/ColorField"
import { composeRenderProps } from "react-aria-components/composeRenderProps"

import { useStyles as useFieldStyles } from "@/registry/ui/field/styles"

// MARK: colorFieldStyles

// MARK: Separator

interface ColorFieldProps extends React.ComponentProps<
  typeof ColorFieldPrimitives.ColorField
> {}

const ColorField = ({ className, ...props }: ColorFieldProps) => {
  const { field } = useFieldStyles()()
  return (
    <ColorFieldPrimitives.ColorField
      data-field=""
      className={composeRenderProps(className, (className) =>
        field({ orientation: "vertical", className }),
      )}
      {...props}
    />
  )
}

// MARK: Separator

export type { ColorFieldProps }
export { ColorField }
