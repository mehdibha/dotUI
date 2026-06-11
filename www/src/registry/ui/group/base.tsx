'use client'

import type * as React from 'react'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as GroupPrimitive from 'react-aria-components/Group'
import * as TextPrimitive from 'react-aria-components/Text'
import type { VariantProps } from 'tailwind-variants'

import { useStyles } from './styles'
import type { GroupStyles } from './styles'

// MARK: groupStyles

// MARK: Separator

interface GroupProps
  extends
    React.ComponentProps<typeof GroupPrimitive.Group>,
    VariantProps<GroupStyles> {}

const Group = ({
  orientation = 'horizontal',
  className,
  ...props
}: GroupProps) => {
  const { root } = useStyles()()
  return (
    <GroupPrimitive.Group
      data-slot="group"
      data-group=""
      className={composeRenderProps(className, (className) =>
        root({ className, orientation }),
      )}
      {...props}
    />
  )
}

// MARK: Separator

interface GroupTextProps extends React.ComponentProps<
  typeof TextPrimitive.Text
> {}

const GroupText = ({ className, ...props }: GroupTextProps) => {
  const { text } = useStyles()()
  return (
    <TextPrimitive.Text
      data-slot="text"
      data-text=""
      className={text({ className })}
      {...props}
    />
  )
}

// MARK: Separator

export type { GroupProps, GroupTextProps }
export { Group, GroupText }
