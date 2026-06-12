import type * as FieldErrorPrimitives from 'react-aria-components/FieldError'
import type * as LabelPrimitives from 'react-aria-components/Label'

import type { Text } from '@/registry/ui/text'

/**
 * Groups a set of related fields under a common legend.
 */
export interface FieldsetProps extends React.ComponentProps<'fieldset'> {}

/**
 * The caption of a fieldset, describing its group of fields.
 */
export interface LegendProps extends React.ComponentProps<'legend'> {}

/**
 * Contains a stack of fields, applying consistent spacing between them.
 */
export interface FieldGroupProps extends React.ComponentProps<'div'> {}

/**
 * A field wraps a form control with its label, description, and error message.
 */
export interface FieldProps extends React.ComponentProps<'div'> {
  /**
   * The orientation of the field layout.
   * @default 'vertical'
   */
  orientation?: 'horizontal' | 'vertical'
}

/**
 * Contains the label and description of a field, displayed alongside its control.
 */
export interface FieldContentProps extends React.ComponentProps<'div'> {}

/**
 * The label of a field.
 */
export interface LabelProps extends React.ComponentProps<
  typeof LabelPrimitives.Label
> {}

/**
 * The description of a field. Provides a hint or additional context for the control.
 */
export interface DescriptionProps extends Omit<
  React.ComponentProps<typeof Text>,
  'slot'
> {}

/**
 * A FieldError displays validation errors for a form field.
 */
export interface FieldErrorProps extends React.ComponentProps<
  typeof FieldErrorPrimitives.FieldError
> {}
