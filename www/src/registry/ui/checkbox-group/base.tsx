"use client"

import * as CheckboxGroupPrimitives from "react-aria-components/CheckboxGroup"
import { composeRenderProps } from "react-aria-components/composeRenderProps"

import { useStyles } from "./styles"

// MARK: checkboxGroupStyles

const CheckboxGroup = ({
  className,
  ...props
}: CheckboxGroupPrimitives.CheckboxGroupProps) => {
  const styles = useStyles()
  return (
    <CheckboxGroupPrimitives.CheckboxGroup
      data-field=""
      className={composeRenderProps(className, (className) =>
        styles({ className }),
      )}
      {...props}
    />
  )
}

type CheckboxGroupProps = CheckboxGroupPrimitives.CheckboxGroupProps

// MARK: Separator

export type { CheckboxGroupProps }
export { CheckboxGroup }
