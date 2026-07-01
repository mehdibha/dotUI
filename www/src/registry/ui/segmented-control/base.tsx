'use client'

import type * as React from 'react'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as SelectionIndicatorPrimitives from 'react-aria-components/SelectionIndicator'
import * as ToggleButtonPrimitives from 'react-aria-components/ToggleButton'
import * as ToggleButtonGroupPrimitives from 'react-aria-components/ToggleButtonGroup'

import { useStyles } from './styles'

// MARK: segmentedControlStyles

// MARK: Separator

interface SegmentedControlProps extends Omit<
  React.ComponentProps<typeof ToggleButtonGroupPrimitives.ToggleButtonGroup>,
  'selectionMode'
> {}

const SegmentedControl = ({ className, ...props }: SegmentedControlProps) => {
  const { root } = useStyles()()
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

// MARK: Separator

interface SegmentedControlItemProps extends React.ComponentProps<
  typeof ToggleButtonPrimitives.ToggleButton
> {}

const SegmentedControlItem = ({
  className,
  children,
  ...props
}: SegmentedControlItemProps) => {
  const { item, indicator, itemContent } = useStyles()()
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

// MARK: Separator

export type { SegmentedControlItemProps, SegmentedControlProps }
export { SegmentedControl, SegmentedControlItem }
