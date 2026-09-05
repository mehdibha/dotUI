"use client"

import type React from "react"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import * as PopoverPrimitives from "react-aria-components/Popover"
import { useSlottedContext } from "react-aria-components/slots"

import { useIsMobile } from "@/registry/hooks/use-mobile"
import { Drawer, DrawerHandle } from "@/registry/ui/drawer"

import { useStyles } from "./styles"

// MARK: popoverStyles

interface PopoverProps extends React.ComponentProps<
  typeof PopoverPrimitives.Popover
> {
  showArrow?: boolean
}
function Popover({
  className,
  showArrow = true,
  placement,
  ...props
}: PopoverProps) {
  const { popover } = useStyles()()
  const context = useSlottedContext(PopoverPrimitives.PopoverContext)
  const isMobile = useIsMobile()

  // Below the mobile line, pickers and menus slide into a bottom drawer.
  // Non-modal popovers (a combobox list, a submenu) keep their anchor: the
  // page under them stays live. Render-prop children read placement and
  // entering state, which only the popover can provide.
  const isNonModal = props.isNonModal ?? context?.isNonModal
  if (isMobile && !isNonModal && typeof props.children !== "function") {
    return (
      <Drawer
        isOpen={props.isOpen}
        defaultOpen={props.defaultOpen}
        onOpenChange={props.onOpenChange}
      >
        <DrawerHandle />
        {props.children}
      </Drawer>
    )
  }

  return (
    <PopoverPrimitives.Popover
      data-popover=""
      className={composeRenderProps(className, (className) =>
        popover({ className }),
      )}
      placement={placement}
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
function PopoverArrow({ className, ...props }: PopoverArrowProps) {
  const { arrow } = useStyles()()
  return (
    <PopoverPrimitives.OverlayArrow
      data-slot="popover-arrow"
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

export type { PopoverProps }
export { Popover }
