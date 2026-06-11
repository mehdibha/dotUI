'use client'

import { createContext, useContext, useId } from 'react'
import type * as React from 'react'
import { CheckIcon, MinusIcon } from 'lucide-react'
import * as CheckboxPrimitive from 'react-aria-components/Checkbox'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import { LabelContext } from 'react-aria-components/Label'
import { Provider, useSlottedContext } from 'react-aria-components/slots'
import { useSlotId } from 'react-aria/private/utils/useId'

import { Label } from '@/registry/ui/field'

import { useStyles } from './styles'

// MARK: checkboxStyles

const InternalCheckboxContext =
  createContext<CheckboxPrimitive.CheckboxButtonRenderProps | null>(null)

// MARK: Separator

interface CheckboxProps extends React.ComponentProps<
  typeof CheckboxPrimitive.CheckboxField
> {}

const Checkbox = ({ id: idProp, className, ...props }: CheckboxProps) => {
  const { root } = useStyles()()
  const autoId = useId()
  const id = idProp ?? autoId
  const labelId = useSlotId()

  return (
    <CheckboxPrimitive.CheckboxField
      data-checkbox=""
      id={id}
      aria-labelledby={labelId}
      className={composeRenderProps(className, (className) =>
        root({ className }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children) => {
        return children ? (
          <Provider values={[[LabelContext, { htmlFor: id, id: labelId }]]}>
            {typeof children === 'string' ? (
              <>
                <CheckboxControl />
                <Label>{children}</Label>
              </>
            ) : (
              children
            )}
          </Provider>
        ) : (
          <CheckboxControl />
        )
      })}
    </CheckboxPrimitive.CheckboxField>
  )
}

interface CheckboxControlProps extends React.ComponentProps<
  typeof CheckboxPrimitive.CheckboxButton
> {}

const CheckboxControl = ({ className, ...props }: CheckboxControlProps) => {
  const { control } = useStyles()()
  const labelContext = useSlottedContext(LabelContext)
  const { id: labelId } = labelContext ?? {}
  return (
    <CheckboxPrimitive.CheckboxButton
      data-checkbox-control=""
      className={composeRenderProps(className, (className) =>
        control({ className }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children, renderProps) => {
        return (
          <Provider
            values={[
              [InternalCheckboxContext, renderProps],
              [LabelContext, { id: labelId, elementType: 'span' }],
            ]}
          >
            {children ?? <CheckboxIndicator />}
          </Provider>
        )
      })}
    </CheckboxPrimitive.CheckboxButton>
  )
}

interface CheckboxIndicatorProps extends React.ComponentProps<'span'> {}

const CheckboxIndicator = ({ className, ...props }: CheckboxIndicatorProps) => {
  const { indicator } = useStyles()()
  const ctx = useContext(InternalCheckboxContext)
  return (
    <span
      data-rac=""
      data-selected={ctx?.isSelected || undefined}
      data-indeterminate={ctx?.isIndeterminate || undefined}
      data-pressed={ctx?.isPressed || undefined}
      data-hovered={ctx?.isHovered || undefined}
      data-focused={ctx?.isFocused || undefined}
      data-focus-visible={ctx?.isFocusVisible || undefined}
      data-disabled={ctx?.isDisabled || undefined}
      data-readonly={ctx?.isReadOnly || undefined}
      data-invalid={ctx?.isInvalid || undefined}
      data-required={ctx?.isRequired || undefined}
      className={indicator({ className })}
      {...props}
    >
      {props.children ?? (ctx?.isIndeterminate ? <MinusIcon /> : <CheckIcon />)}
    </span>
  )
}

// MARK: Separator

export type { CheckboxControlProps, CheckboxIndicatorProps, CheckboxProps }
export { Checkbox, CheckboxControl, CheckboxIndicator }
