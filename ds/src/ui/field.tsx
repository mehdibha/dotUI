'use client'

import type React from 'react'
import * as CheckboxPrimitives from 'react-aria-components/Checkbox'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as FieldErrorPrimitives from 'react-aria-components/FieldError'
import * as LabelPrimitives from 'react-aria-components/Label'
import { Provider } from 'react-aria-components/slots'
import * as TextPrimitives from 'react-aria-components/Text'
import { useSlotId } from 'react-aria/private/utils/useId'
import { type VariantProps, tv } from 'tailwind-variants'

import { Text } from '@/ui/text'
const fieldVariants = tv({
  slots: {
    fieldset: '',
    legend: '',
    fieldGroup: [
      'group/field-group @container/field-group flex w-full flex-col',
      'gap-5 has-data-checkbox:gap-3 has-data-radio:gap-3 has-[[data-checkbox]_[data-label]]:gap-2 has-[[data-radio]_[data-label]]:gap-2',
    ],
    field:
      'flex w-full gap-2 invalid:has-data-[slot=field-error]:**:data-[slot=description]:hidden',
    fieldContent: 'flex flex-col gap-1',
    label: [
      'inline-flex items-center gap-px leading-none select-none peer-disabled:cursor-not-allowed peer-disabled:text-fg-disabled [&_svg]:size-3',
      "in-data-required:after:ml-0.5 in-data-required:after:text-fg-danger in-data-required:after:content-['*']",
      'in-disabled:cursor-not-allowed in-disabled:text-fg-disabled',
      'in-data-invalid:text-fg-danger',
      'text-sm',
    ],
    description: [
      'text-fg-muted last:mt-0 in-data-disabled:text-fg-disabled nth-last-2:-mt-1',
      'text-sm',
    ],
    fieldError: ['text-fg-danger', 'text-sm'],
  },
  variants: {
    orientation: {
      horizontal: {
        field:
          'flex-row items-center gap-2 has-data-[slot=description]:items-start',
      },
      vertical: {
        field: 'w-full flex-col gap-2',
      },
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
})

interface FieldsetProps extends React.ComponentProps<'fieldset'> {}

function Fieldset({ className, ...props }: FieldsetProps) {
  const { fieldset } = fieldVariants()
  return (
    <fieldset
      data-slot="fieldset"
      className={fieldset({ className })}
      {...props}
    />
  )
}

interface LegendProps extends React.ComponentProps<'legend'> {}

function Legend({ className, ...props }: LegendProps) {
  const { legend } = fieldVariants()
  return (
    <legend data-slot="legend" className={legend({ className })} {...props} />
  )
}

interface FieldGroupProps extends React.ComponentProps<'div'> {}

function FieldGroup({ className, ...props }: FieldGroupProps) {
  const { fieldGroup } = fieldVariants()
  return (
    <div
      data-slot="field-group"
      className={fieldGroup({ className })}
      {...props}
    />
  )
}

interface FieldProps
  extends React.ComponentProps<'div'>, VariantProps<typeof fieldVariants> {}

const Field = ({ children, className, orientation, ...props }: FieldProps) => {
  const { field } = fieldVariants()
  const inputId = useSlotId()
  const descriptionId = useSlotId()
  return (
    <div
      data-slot="field"
      className={field({ className, orientation })}
      {...props}
    >
      <Provider
        values={[
          [
            CheckboxPrimitives.CheckboxContext,
            {
              id: inputId,
              'aria-describedby': descriptionId,
            },
          ],
          [LabelPrimitives.LabelContext, { htmlFor: inputId }],
          [
            TextPrimitives.TextContext,
            { slot: 'description', id: descriptionId },
          ],
        ]}
      >
        {children}
      </Provider>
    </div>
  )
}

interface FieldContentProps extends React.ComponentProps<'div'> {}

const FieldContent = ({ className, ...props }: FieldContentProps) => {
  const { fieldContent } = fieldVariants()
  return (
    <div
      data-slot="field-content"
      className={fieldContent({ className })}
      {...props}
    />
  )
}

interface LabelProps extends React.ComponentProps<
  typeof LabelPrimitives.Label
> {}

const Label = ({ children, className, ...props }: LabelProps) => {
  const { label } = fieldVariants()
  return (
    <LabelPrimitives.Label
      data-slot="label"
      data-label=""
      className={label({ className })}
      {...props}
    >
      {children}
    </LabelPrimitives.Label>
  )
}

interface DescriptionProps extends Omit<
  React.ComponentProps<typeof Text>,
  'slot'
> {}

const Description = ({ className, ...props }: DescriptionProps) => {
  const { description } = fieldVariants()
  return (
    <Text
      data-slot="description"
      data-description=""
      slot="description"
      className={description({ className })}
      {...props}
    />
  )
}

interface FieldErrorProps extends React.ComponentProps<
  typeof FieldErrorPrimitives.FieldError
> {}
const FieldError = ({ className, ...props }: FieldErrorProps) => {
  const { fieldError } = fieldVariants()
  return (
    <FieldErrorPrimitives.FieldError
      data-slot="field-error"
      data-field-error=""
      className={composeRenderProps(className, (className) =>
        fieldError({ className }),
      )}
      {...props}
    />
  )
}

export type {
  DescriptionProps,
  FieldContentProps,
  FieldErrorProps,
  FieldGroupProps,
  FieldProps,
  FieldsetProps,
  LabelProps,
  LegendProps,
}
export {
  Description,
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  Fieldset,
  fieldVariants,
  Label,
  Legend,
}
