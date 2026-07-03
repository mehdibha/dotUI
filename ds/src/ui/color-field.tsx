'use client'

import type * as React from 'react'
import * as ColorFieldPrimitives from 'react-aria-components/ColorField'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'

import { fieldVariants } from '@/ui/field'

interface ColorFieldProps extends React.ComponentProps<
  typeof ColorFieldPrimitives.ColorField
> {}

const ColorField = ({ className, ...props }: ColorFieldProps) => {
  const fieldStyles = fieldVariants
  return (
    <ColorFieldPrimitives.ColorField
      className={composeRenderProps(className, (className) =>
        fieldStyles().field({ orientation: 'vertical', className }),
      )}
      {...props}
    />
  )
}

export type { ColorFieldProps }
export { ColorField }
