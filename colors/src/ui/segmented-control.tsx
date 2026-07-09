'use client'

import type * as React from 'react'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as SelectionIndicatorPrimitives from 'react-aria-components/SelectionIndicator'
import * as ToggleButtonPrimitives from 'react-aria-components/ToggleButton'
import * as ToggleButtonGroupPrimitives from 'react-aria-components/ToggleButtonGroup'
import { tv } from 'tailwind-variants'
const segmentedControlVariants = tv({
  slots: {
    root: 'inline-flex w-fit items-center justify-center rounded-lg bg-muted p-[3px] text-fg-muted',
    item: [
      'relative isolate inline-flex cursor-default items-center justify-center rounded-md border border-transparent font-medium whitespace-nowrap focus-reset transition-[color] select-none focus-visible:focus-ring',
      'text-fg-muted hover:text-fg selected:text-fg-on-selected',
      'disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50',
      '**:[svg]:pointer-events-none **:[svg]:shrink-0',
      'gap-1.5 px-2.5 py-1 text-sm has-data-icon-end:pr-2 has-data-icon-start:pl-2 **:[svg]:not-with-[size]:size-4',
    ],
    indicator:
      'pointer-events-none absolute inset-0 rounded-md bg-selected shadow-sm duration-150 ease-out motion-safe:transition-[translate,width,height]',
    itemContent: 'relative z-10 inline-flex items-center [gap:inherit]',
  },
})

interface SegmentedControlProps extends Omit<
  React.ComponentProps<typeof ToggleButtonGroupPrimitives.ToggleButtonGroup>,
  'selectionMode'
> {}

const SegmentedControl = ({ className, ...props }: SegmentedControlProps) => {
  const { root } = segmentedControlVariants()
  return (
    <ToggleButtonGroupPrimitives.ToggleButtonGroup
      data-slot="segmented-control"
      selectionMode="single"
      disallowEmptySelection
      className={composeRenderProps(className, (className) =>
        root({ className }),
      )}
      {...props}
    />
  )
}

interface SegmentedControlItemProps extends React.ComponentProps<
  typeof ToggleButtonPrimitives.ToggleButton
> {}

const SegmentedControlItem = ({
  className,
  children,
  ...props
}: SegmentedControlItemProps) => {
  const { item, indicator, itemContent } = segmentedControlVariants()
  return (
    <ToggleButtonPrimitives.ToggleButton
      data-slot="segmented-control-item"
      className={composeRenderProps(className, (className) =>
        item({ className }),
      )}
      {...props}
    >
      {composeRenderProps(children, (children) => (
        <>
          {/* React Aria's SelectionIndicator: it tracks the selected item and
              animates its translate/width/height, so the pill slides smoothly. */}
          <SelectionIndicatorPrimitives.SelectionIndicator
            data-segmented-control-indicator=""
            className={indicator()}
          />
          <span data-segmented-control-content="" className={itemContent()}>
            {children}
          </span>
        </>
      ))}
    </ToggleButtonPrimitives.ToggleButton>
  )
}

export type { SegmentedControlItemProps, SegmentedControlProps }
export { SegmentedControl, SegmentedControlItem }
