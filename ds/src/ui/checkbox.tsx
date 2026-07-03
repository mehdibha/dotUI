'use client'

import { createContext, useContext, useId } from 'react'
import type * as React from 'react'
import { CheckIcon, MinusIcon } from 'lucide-react'
import * as CheckboxPrimitive from 'react-aria-components/Checkbox'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import { LabelContext } from 'react-aria-components/Label'
import { Provider, useSlottedContext } from 'react-aria-components/slots'
import { useSlotId } from 'react-aria/private/utils/useId'
import { tv } from 'tailwind-variants'

import { Label } from '@/ui/field'
const checkboxVariants = tv({
  slots: {
    root: ['flex items-center has-data-description:items-start', 'gap-2'],
    control: [
      'relative flex items-center gap-2 rounded-sm focus-reset not-has-data-label:after:absolute not-has-data-label:after:-inset-x-3 not-has-data-label:after:-inset-y-2 read-only:cursor-default focus-visible:focus-ring disabled:cursor-disabled has-data-description:items-start has-data-label:rounded-(--checkbox-card-radius)',
      'transition-colors duration-75 has-data-label:w-full has-data-label:border has-data-label:p-2.5 has-data-label:selected:border-[color-mix(in_srgb,var(--color-primary)_25%,var(--color-bg))] has-data-label:selected:bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--color-bg))]',
    ],
    indicator: [
      'grid size-4 shrink-0 place-content-center rounded-sm border border-border-control bg-transparent text-transparent transition-[background-color,border-color,box-shadow,color] duration-75 *:[svg]:size-3',
      'selected:border-transparent selected:bg-primary selected:text-fg-on-primary',
      'disabled:border-border-disabled disabled:indeterminate:bg-disabled disabled:selected:bg-disabled disabled:selected:text-fg-disabled',
      'invalid:selected:text-fg-onMutedDanger invalid:border-border-danger invalid:selected:bg-danger-muted',
      'indeterminate:border-transparent indeterminate:bg-primary indeterminate:text-fg-on-primary',
    ],
  },
})

const InternalCheckboxContext =
  createContext<CheckboxPrimitive.CheckboxButtonRenderProps | null>(null)

interface CheckboxProps extends React.ComponentProps<
  typeof CheckboxPrimitive.CheckboxField
> {}

const Checkbox = ({ id: idProp, className, ...props }: CheckboxProps) => {
  const { root } = checkboxVariants()
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
  const { control } = checkboxVariants()
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
  const { indicator } = checkboxVariants()
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

export type { CheckboxControlProps, CheckboxIndicatorProps, CheckboxProps }
export { Checkbox, CheckboxControl, CheckboxIndicator }
