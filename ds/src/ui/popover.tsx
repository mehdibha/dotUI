'use client'

import type React from 'react'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as PopoverPrimitives from 'react-aria-components/Popover'
import { tv } from 'tailwind-variants'
const popoverVariants = tv({
  slots: {
    popover: [
      'popover z-50 min-w-[max(var(--trigger-width),--spacing(32))] origin-(--trigger-anchor-point) rounded-(--popover-radius) border bg-popover shadow-md forced-color-adjust-none outline-none',
      'transition-[transform,opacity,scale] duration-200 ease-out will-change-[transform,opacity,scale] [--slide-offset:--spacing(0.5)]',
      'entering:scale-95 entering:transform-(--origin) entering:opacity-0',
      'exiting:scale-95 exiting:transform-(--origin) exiting:opacity-0 exiting:duration-150',
      'placement-left:[--origin:translateX(var(--slide-offset))] placement-right:[--origin:translateX(calc(var(--slide-offset)*-1))] placement-top:[--origin:translateY(var(--slide-offset))] placement-bottom:[--origin:translateY(calc(var(--slide-offset)*-1))]',
    ],
    arrow: [
      'block [&>svg]:size-2.5 [&>svg]:fill-popover',
      'placement-left:[&>svg]:-rotate-90 placement-right:[&>svg]:rotate-90 placement-bottom:[&>svg]:rotate-180',
    ],
  },
})

interface PopoverProps extends React.ComponentProps<
  typeof PopoverPrimitives.Popover
> {
  showArrow?: boolean
}
function Popover({
  className,
  showArrow = false,
  placement,
  ...props
}: PopoverProps) {
  const { popover } = popoverVariants()
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

interface PopoverArrowProps extends React.ComponentProps<'svg'> {}
function PopoverArrow({ className, ...props }: PopoverArrowProps) {
  const { arrow } = popoverVariants()
  return (
    <PopoverPrimitives.OverlayArrow>
      <svg
        aria-hidden="true"
        width={12}
        height={12}
        viewBox="0 0 8 8"
        className={arrow({ className })}
        {...props}
      >
        <path d="M0 0 L4 4 L8 0" />
      </svg>
    </PopoverPrimitives.OverlayArrow>
  )
}

export type { PopoverProps }
export { Popover }
