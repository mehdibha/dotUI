"use client"

import type * as React from "react"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import * as PopoverPrimitives from "react-aria-components/Popover"
import * as TooltipPrimitives from "react-aria-components/Tooltip"

import { useStyles } from "./styles"

// MARK: tooltipStyles

// MARK: Separator
interface TooltipProps extends React.ComponentProps<
  typeof TooltipPrimitives.TooltipTrigger
> {}

const Tooltip = ({ delay = 700, closeDelay = 0, ...props }: TooltipProps) => (
  <TooltipPrimitives.TooltipTrigger
    delay={delay}
    closeDelay={closeDelay}
    {...props}
  />
)

// MARK: Separator

interface TooltipContentProps extends React.ComponentProps<
  typeof TooltipPrimitives.Tooltip
> {
  hideArrow?: boolean
}

const TooltipContent = ({
  offset = 10,
  hideArrow = false,
  className,
  ...props
}: TooltipContentProps) => {
  const { content } = useStyles()()
  return (
    <TooltipPrimitives.Tooltip
      data-tooltip=""
      offset={offset}
      className={composeRenderProps(className, (className) =>
        content({ className }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children) => (
        <>
          {children}
          {!hideArrow && <TooltipArrow />}
        </>
      ))}
    </TooltipPrimitives.Tooltip>
  )
}

// MARK: Separator

const TooltipArrow = () => {
  const { arrow } = useStyles()()
  return (
    <PopoverPrimitives.OverlayArrow className={arrow()}>
      <svg
        aria-hidden="true"
        data-tooltip-arrow=""
        width={8}
        height={8}
        viewBox="0 0 8 8"
      >
        <path d="M0 0 L4 4 L8 0" />
      </svg>
    </PopoverPrimitives.OverlayArrow>
  )
}

// MARK: Separator

export type { TooltipContentProps, TooltipProps }
export { Tooltip, TooltipContent }
