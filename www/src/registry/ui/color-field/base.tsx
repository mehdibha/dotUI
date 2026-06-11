'use client'

import type * as React from 'react'
import * as ColorFieldPrimitives from 'react-aria-components/ColorField'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'

import { useStyles } from '@/registry/ui/field/styles'

// MARK: colorFieldStyles

// MARK: ColorField

interface ColorFieldProps extends React.ComponentProps<
  typeof ColorFieldPrimitives.ColorField
> {}

const ColorField = ({ className, ...props }: ColorFieldProps) => {
  const fieldStyles = useStyles()
  return (
    <ColorFieldPrimitives.ColorField
      className={composeRenderProps(className, (className) =>
        fieldStyles().field({ orientation: 'vertical', className }),
      )}
      {...props}
    />
  )
}

// MARK: exports

export type { ColorFieldProps }
export { ColorField }
