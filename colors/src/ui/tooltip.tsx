'use client'

import type * as React from 'react'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as PopoverPrimitives from 'react-aria-components/Popover'
import * as TooltipPrimitives from 'react-aria-components/Tooltip'
import { type VariantProps, tv } from 'tailwind-variants'
const tooltipVariants = tv({
  slots: {
    content: [
      'w-fit max-w-xs origin-(--trigger-anchor-point) rounded-sm bg-tooltip px-3 py-1.5 text-center text-xs text-fg-on-tooltip forced-color-adjust-none outline-none',
      'transition-[transform,opacity,scale] duration-200 ease-out will-change-[transform,opacity,scale] [--slide-offset:--spacing(0.5)]',
      'entering:scale-95 entering:transform-(--origin) entering:opacity-0',
      'exiting:scale-95 exiting:transform-(--origin) exiting:opacity-0 exiting:duration-150',
      'placement-left:[--origin:translateX(var(--slide-offset))] placement-right:[--origin:translateX(calc(var(--slide-offset)*-1))] placement-top:[--origin:translateY(var(--slide-offset))] placement-bottom:[--origin:translateY(calc(var(--slide-offset)*-1))]',
    ],
    arrow: [
      'block [&>svg]:size-2.5 [&>svg]:fill-tooltip',
      'placement-left:[&>svg]:-rotate-90 placement-right:[&>svg]:rotate-90 placement-bottom:[&>svg]:rotate-180',
    ],
  },
})

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

interface TooltipContentProps
  extends
    React.ComponentProps<typeof TooltipPrimitives.Tooltip>,
    VariantProps<typeof tooltipVariants> {
  hideArrow?: boolean
}

function TooltipContent({
  offset = 10,
  hideArrow = false,
  className,
  ...props
}: TooltipContentProps) {
  const { content } = tooltipVariants()
  return (
    <TooltipPrimitives.Tooltip
      data-slot="tooltip"
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

interface TooltipArrowProps extends React.ComponentProps<'svg'> {}

function TooltipArrow({ className }: TooltipArrowProps) {
  const { arrow } = tooltipVariants()
  return (
    <PopoverPrimitives.OverlayArrow className={arrow({ className })}>
      <svg
        aria-hidden="true"
        data-slot="tooltip-arrow"
        width={8}
        height={8}
        viewBox="0 0 8 8"
      >
        <path d="M0 0 L4 4 L8 0" />
      </svg>
    </PopoverPrimitives.OverlayArrow>
  )
}

export type { TooltipContentProps, TooltipProps }
export { Tooltip, TooltipContent }
