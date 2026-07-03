'use client'

import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as DateFieldPrimitive from 'react-aria-components/DateField'

import { cn } from '@/lib/utils'
import { fieldVariants } from '@/ui/field'

interface DateFieldProps<
  T extends DateFieldPrimitive.DateValue,
> extends DateFieldPrimitive.DateFieldProps<T> {}

const DateField = <T extends DateFieldPrimitive.DateValue>({
  className,
  ...props
}: DateFieldProps<T>) => {
  const fieldStyles = fieldVariants
  return (
    <DateFieldPrimitive.DateField
      date-date-field=""
      className={composeRenderProps(className, (className) =>
        fieldStyles().field({ className: cn('group/date-field', className) }),
      )}
      {...props}
    />
  )
}

export type { DateFieldProps }
export { DateField }
