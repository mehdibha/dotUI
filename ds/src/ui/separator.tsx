'use client'

import type React from 'react'
import * as SeparatorPrimitives from 'react-aria-components/Separator'
import { useSlottedContext } from 'react-aria-components/slots'
import { tv } from 'tailwind-variants'
const separatorVariants = tv({
  base: 'separator shrink-0 border-0 bg-border',
  variants: {
    orientation: {
      horizontal: 'h-px w-full',
      vertical: 'h-full w-px',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
})

interface SeparatorProps extends React.ComponentProps<
  typeof SeparatorPrimitives.Separator
> {}

const Separator = ({ orientation, className, ...props }: SeparatorProps) => {
  const styles = separatorVariants
  const ctx = useSlottedContext(SeparatorPrimitives.SeparatorContext)

  return (
    <SeparatorPrimitives.Separator
      data-separator=""
      orientation={orientation}
      className={styles({
        orientation: orientation ?? ctx?.orientation,
        className,
      })}
      {...props}
    />
  )
}

export type { SeparatorProps }
export { Separator }
