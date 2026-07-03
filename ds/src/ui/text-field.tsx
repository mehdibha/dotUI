'use client'

import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as TextFieldPrimitive from 'react-aria-components/TextField'

import { cn } from '@/lib/utils'
import { fieldVariants } from '@/ui/field'

interface TextFieldProps extends TextFieldPrimitive.TextFieldProps {}

const TextField = ({ className, ...props }: TextFieldProps) => {
  const fieldStyles = fieldVariants
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

export type { TextFieldProps }
export { TextField }
