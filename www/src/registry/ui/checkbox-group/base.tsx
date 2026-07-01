'use client'

import * as CheckboxGroupPrimitives from 'react-aria-components/CheckboxGroup'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'

import { useStyles } from './styles'

const CheckboxGroup = ({
  className,
  ...props
}: CheckboxGroupPrimitives.CheckboxGroupProps) => {
  const styles = useStyles()
  return (
    <CheckboxGroupPrimitives.CheckboxGroup
      className={composeRenderProps(className, (className) =>
        styles({ className }),
      )}
      {...props}
    />
  )
}

type CheckboxGroupProps = CheckboxGroupPrimitives.CheckboxGroupProps

export type { CheckboxGroupProps }
export { CheckboxGroup }
