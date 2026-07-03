'use client'

import type * as React from 'react'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as DropZonePrimitives from 'react-aria-components/DropZone'
import * as TextPrimitives from 'react-aria-components/Text'
import { tv } from 'tailwind-variants'
const dropZoneVariants = tv({
  slots: {
    dropzone:
      'flex w-60 flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 text-sm focus-visible:border-border-focus disabled:border-border-disabled disabled:text-fg-disabled drop-target:border-border-focus drop-target:bg-accent-muted',
    label: 'text-base',
  },
})

interface DropZoneProps extends React.ComponentProps<
  typeof DropZonePrimitives.DropZone
> {}
const DropZone = ({ className, ...props }: DropZoneProps) => {
  const { dropzone } = dropZoneVariants()
  return (
    <DropZonePrimitives.DropZone
      className={composeRenderProps(className, (className) =>
        dropzone({ className }),
      )}
      {...props}
    />
  )
}

interface DropZoneLabelProps extends Omit<
  React.ComponentProps<typeof TextPrimitives.Text>,
  'slot'
> {}
const DropZoneLabel = ({ className, ...props }: DropZoneLabelProps) => {
  const { label } = dropZoneVariants()
  return (
    <TextPrimitives.Text
      slot="label"
      className={label({ className })}
      {...props}
    />
  )
}

export type { DropZoneLabelProps, DropZoneProps }
export { DropZone, DropZoneLabel }
