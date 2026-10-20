"use client"

import type * as React from "react"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import * as ToggleButtonPrimitives from "react-aria-components/ToggleButton"
import type { VariantProps } from "tailwind-variants"

import { createVariantsContext } from "@/registry/lib/context"

import { useStyles } from "./styles"
import type { ToggleButtonStyles } from "./styles"

// MARK: toggleButtonStyles

export { toggleButtonStyles } from "./styles"

type ToggleButtonVariants = VariantProps<ToggleButtonStyles>

// MARK: Separator

const [ToggleButtonProvider, useContextProps] = createVariantsContext<
  ToggleButtonVariants,
  React.ComponentProps<typeof ToggleButtonPrimitives.ToggleButton>,
  HTMLButtonElement
>(ToggleButtonPrimitives.ToggleButtonContext)

// MARK: Separator

interface ToggleButtonProps
  extends
    React.ComponentProps<typeof ToggleButtonPrimitives.ToggleButton>,
    ToggleButtonVariants {
  isIconOnly?: boolean
}

const ToggleButton = (localProps: ToggleButtonProps) => {
  const styles = useStyles()
  const {
    variant = "secondary",
    size,
    isIconOnly,
    className,
    children,
    ...props
  } = useContextProps(localProps)

  return (
    <ToggleButtonPrimitives.ToggleButton
      data-button=""
      data-variant={variant}
      data-icon-only={isIconOnly ? "" : undefined}
      className={composeRenderProps(className, (className) =>
        styles({
          variant,
          size,
          isIconOnly,
          className,
        }),
      )}
      {...props}
    >
      {composeRenderProps(children, (children) =>
        typeof children === "string" ? (
          <span className="truncate">{children}</span>
        ) : (
          children
        ),
      )}
    </ToggleButtonPrimitives.ToggleButton>
  )
}

// MARK: Separator

export type { ToggleButtonProps }
export { ToggleButton, ToggleButtonProvider }
