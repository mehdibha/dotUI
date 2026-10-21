"use client"

import type * as React from "react"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import * as PopoverPrimitives from "react-aria-components/Popover"
import { useSlottedContext } from "react-aria-components/slots"

import { useIsMobile } from "@/registry/hooks/use-mobile"
import { Sheet, SheetHandle } from "@/registry/ui/sheet"

import { useStyles } from "./styles"

// MARK: popoverStyles

interface PopoverProps extends React.ComponentProps<
  typeof PopoverPrimitives.Popover
> {
  showArrow?: boolean
}
const Popover = ({ className, showArrow = false, ...props }: PopoverProps) => {
  const { popover } = useStyles()()
  const context = useSlottedContext(PopoverPrimitives.PopoverContext)
  const isMobile = useIsMobile()

  const isNonModal = props.isNonModal ?? context?.isNonModal
  const isSubmenu = context?.trigger === "SubmenuTrigger"
  // Render-prop children read placement and entering state, which only the popover can provide.
  if (
    isMobile &&
    (!isNonModal || isSubmenu) &&
    typeof props.children !== "function"
  ) {
    return (
      <Sheet
        isOpen={props.isOpen}
        defaultOpen={props.defaultOpen}
        onOpenChange={props.onOpenChange}
      >
        <SheetHandle />
        {props.children}
      </Sheet>
    )
  }

  return (
    <PopoverPrimitives.Popover
      data-popover=""
      className={composeRenderProps(className, (className) =>
        popover({ className }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children) => (
        <>
          {children}
          {showArrow && <PopoverArrow />}
        </>
      ))}
    </PopoverPrimitives.Popover>
  )
}

interface PopoverArrowProps extends React.ComponentProps<"svg"> {}
const PopoverArrow = ({ className, ...props }: PopoverArrowProps) => {
  const { arrow } = useStyles()()
  return (
    <PopoverPrimitives.OverlayArrow
      data-popover-arrow=""
      className={arrow({ className })}
    >
      <svg
        aria-hidden="true"
        width={12}
        height={12}
        viewBox="0 0 8 8"
        {...props}
      >
        <path d="M0 0 L4 4 L8 0" />
      </svg>
    </PopoverPrimitives.OverlayArrow>
  )
}

// MARK: Separator

export type { PopoverProps }
export { Popover }
