'use client'

import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as TextFieldPrimitive from 'react-aria-components/TextField'

import { cn } from '@/registry/lib/utils'
import { useStyles } from '@/registry/ui/field/styles'

// MARK: textFieldStyles

// MARK: TextField

interface TextFieldProps extends TextFieldPrimitive.TextFieldProps {}

const TextField = ({ className, ...props }: TextFieldProps) => {
  const fieldStyles = useStyles()
  return (
    <TextFieldPrimitive.TextField
      data-field=""
      data-textfield=""
      data-slot="text-field"
      className={composeRenderProps(className, (className) =>
        fieldStyles().field({ className: cn('group/text-field', className) }),
      )}
      {...props}
    />
  )
}

// MARK: exports

export type { TextFieldProps }
export { TextField }
