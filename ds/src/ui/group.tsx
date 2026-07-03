'use client'

import type * as React from 'react'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as GroupPrimitive from 'react-aria-components/Group'
import * as TextPrimitive from 'react-aria-components/Text'
import { type VariantProps, tv } from 'tailwind-variants'
const groupVariants = tv({
  slots: {
    root: [
      'flex w-fit items-stretch',
      'has-data-[slot=group]:gap-2',
      '*:hover:z-1 *:focus:z-3 *:focus-visible:z-3 *:has-[input]:z-2 *:[input]:z-2',
      '*:data-label:shrink-0 *:data-label:rounded-md *:data-label:border *:data-label:bg-card *:data-label:px-4',
    ],
    text: 'flex items-center gap-2 rounded-md border bg-card px-4 text-sm font-medium shadow-xs **:[svg]:pointer-events-none **:[svg]:not-with-[size]:size-4',
  },
  variants: {
    orientation: {
      horizontal: {
        root: [
          '-space-x-px not-has-data-group:*:not-first:rounded-l-none not-has-data-group:*:not-last:rounded-r-none',
          'not-has-data-group:*:not-last:data-select:*:data-button:rounded-r-none not-has-data-group:*:not-[:nth-child(2)]:data-select:*:data-button:rounded-l-none',
        ],
      },
      vertical: {
        root: 'flex-col not-has-data-group:*:not-first:rounded-t-none not-has-data-group:*:not-last:rounded-b-none',
      },
    },
  },
})

interface GroupProps
  extends
    React.ComponentProps<typeof GroupPrimitive.Group>,
    VariantProps<typeof groupVariants> {}

const Group = ({
  orientation = 'horizontal',
  className,
  ...props
}: GroupProps) => {
  const { root } = groupVariants()
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

interface GroupTextProps extends React.ComponentProps<
  typeof TextPrimitive.Text
> {}

const GroupText = ({ className, ...props }: GroupTextProps) => {
  const { text } = groupVariants()
  return (
    <TextPrimitive.Text
      data-slot="text"
      data-text=""
      className={text({ className })}
      {...props}
    />
  )
}

export type { GroupProps, GroupTextProps }
export { Group, GroupText }
