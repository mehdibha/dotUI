'use client'

import type React from 'react'
import * as FormPrimitives from 'react-aria-components/Form'

import { cn } from '@/registry/lib/utils'

// MARK: Form

interface FormProps extends React.ComponentProps<typeof FormPrimitives.Form> {}

const Form = ({ className, ...props }: FormProps) => {
  return (
    <FormPrimitives.Form
      data-slot="form"
      className={cn('flex flex-col gap-4', className)}
      {...props}
    />
  )
}

// MARK: exports

export type { FormProps }
export { Form }
