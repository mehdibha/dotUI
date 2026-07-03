import type * as React from 'react'
import { type VariantProps, tv } from 'tailwind-variants'
const alertVariants = tv({
  slots: {
    root: [
      'relative grid w-full items-start px-4 py-3',
      'rounded-lg',
      'has-data-alert-action:grid-cols-[1fr_auto] has-data-alert-action:pr-3 has-data-alert-title:has-data-alert-description:gap-y-0.5 has-[>svg]:grid-cols-[--spacing(4)_1fr] has-[>svg]:gap-x-3 has-[>svg]:has-data-alert-action:grid-cols-[--spacing(4)_1fr_auto]',
      '*:[svg]:size-4 *:[svg]:translate-y-0.5 *:[svg]:text-current',
      'border bg-card text-sm',
    ],
    title: ['[svg~&]:col-start-2', 'font-medium tracking-tight'],
    description: [
      '[svg~&]:col-start-2',
      'text-fg-muted **:[p]:leading-relaxed [svg~&]:col-start-2',
    ],
    action:
      'flex gap-1 max-sm:col-start-2 max-sm:mt-2 sm:row-start-1 sm:row-end-3 sm:[[data-alert-title]~&]:col-start-2 sm:[svg~&]:col-start-2 sm:[svg~[data-alert-description]~&]:col-start-3 sm:[svg~[data-alert-title]~&]:col-start-3',
  },
  variants: {
    variant: {
      neutral: {
        root: 'text-fg',
      },
      danger: {
        root: 'text-fg-danger *:data-alert-description:text-fg-danger/90',
      },
      warning: {
        root: 'text-fg-warning *:data-alert-description:text-fg-warning/90',
      },
      info: {
        root: 'text-fg-info *:data-alert-description:text-fg-info/90',
      },
      success: {
        root: 'text-fg-success *:data-alert-description:text-fg-success/90',
      },
    },
  },
  defaultVariants: {
    variant: 'neutral',
  },
})

interface AlertProps
  extends React.ComponentProps<'div'>, VariantProps<typeof alertVariants> {}

function Alert({ className, variant, ...props }: AlertProps) {
  const { root } = alertVariants()
  return (
    <div
      data-alert=""
      role="alert"
      className={root({ variant, className })}
      {...props}
    />
  )
}

interface AlertTitleProps extends React.ComponentProps<'div'> {}

function AlertTitle({ className, ...props }: AlertTitleProps) {
  const { title } = alertVariants()
  return <div data-alert-title="" className={title({ className })} {...props} />
}

interface AlertDescriptionProps extends React.ComponentProps<'div'> {}

function AlertDescription({ className, ...props }: AlertDescriptionProps) {
  const { description } = alertVariants()
  return (
    <div
      data-alert-description=""
      className={description({ className })}
      {...props}
    />
  )
}

interface AlertActionProps extends React.ComponentProps<'div'> {}

function AlertAction({ className, ...props }: AlertActionProps) {
  const { action } = alertVariants()
  return (
    <div data-alert-action="" className={action({ className })} {...props} />
  )
}

export type {
  AlertActionProps,
  AlertDescriptionProps,
  AlertProps,
  AlertTitleProps,
}
export { Alert, AlertAction, AlertDescription, AlertTitle }
