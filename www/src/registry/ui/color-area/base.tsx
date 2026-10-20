"use client"

import type * as React from "react"
import * as ColorAreaPrimitives from "react-aria-components/ColorArea"
import { composeRenderProps } from "react-aria-components/composeRenderProps"

import { ColorThumb } from "@/registry/ui/color-thumb"

import { useStyles } from "./styles"

// MARK: colorAreaStyles

type ColorAreaProps = React.ComponentProps<typeof ColorAreaPrimitives.ColorArea>

const ColorArea = ({ className, ...props }: ColorAreaProps) => {
  const styles = useStyles()
  return (
    <ColorAreaPrimitives.ColorArea
      className={composeRenderProps(className, (className) =>
        styles({ className }),
      )}
      {...props}
    >
      {props.children || <ColorThumb />}
    </ColorAreaPrimitives.ColorArea>
  )
}

// MARK: Separator

export type { ColorAreaProps }
export { ColorArea }
