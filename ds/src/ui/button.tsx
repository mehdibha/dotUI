'use client'

import type * as React from 'react'
import * as ButtonPrimitive from 'react-aria-components/Button'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as LinkPrimitive from 'react-aria-components/Link'
import { type VariantProps, tv } from 'tailwind-variants'

import { Loader } from '@/ui/loader'
const buttonVariants = tv({
  base: [
    'group/button relative inline-flex shrink-0 cursor-interactive items-center justify-center rounded-(--btn-radius) bg-clip-padding font-(--btn-font-weight) whitespace-nowrap transition-[background-color,border-color,color,box-shadow] select-none',
    'focus-reset focus-visible:focus-ring',
    '**:[svg]:pointer-events-none **:[svg]:shrink-0',
    'pending:cursor-default pending:border-border-disabled pending:bg-disabled pending:text-transparent pending:**:not-data-[slot=spinner]:not-in-data-[slot=spinner]:opacity-0 pending:**:data-[slot=spinner]:text-fg-muted',
    'disabled:cursor-default disabled:border-border-disabled disabled:bg-disabled disabled:text-fg-disabled',
    'gap-1 text-xs/relaxed',
  ],
  variants: {
    variant: {
      default:
        'border bg-neutral text-fg-on-neutral hover:border-border-hover hover:bg-neutral-hover pressed:border-border-active pressed:bg-neutral-active',
      primary:
        'bg-primary text-fg-on-primary [--color-disabled:var(--neutral-500)] [--color-fg-disabled:var(--neutral-300)] hover:bg-primary-hover disabled:border-0 pending:border-0 pressed:bg-primary-active',
      quiet: 'bg-transparent text-fg hover:bg-inverse/10 pressed:bg-inverse/20',
      link: 'text-fg underline-offset-4 hover:underline',
      warning:
        'bg-warning text-fg-on-warning hover:bg-warning-hover pressed:bg-warning-active',
      danger:
        'bg-danger text-fg-on-danger hover:bg-danger-hover pressed:bg-danger-active',
    },
    size: {
      xs: 'h-5 rounded-sm px-2 text-[0.625rem] has-data-icon-end:pr-1.5 has-data-icon-start:pl-1.5 data-icon-only:size-5 **:[svg]:not-with-[size]:size-2.5',
      sm: 'h-6 px-2 has-data-icon-end:pr-1.5 has-data-icon-start:pl-1.5 data-icon-only:size-6 **:[svg]:not-with-[size]:size-3',
      md: 'h-7 px-2 has-data-icon-end:pr-1.5 has-data-icon-start:pl-1.5 data-icon-only:size-7 **:[svg]:not-with-[size]:size-3.5',
      lg: 'h-8 px-2.5 has-data-icon-end:pr-2 has-data-icon-start:pl-2 data-icon-only:size-8 **:[svg]:not-with-[size]:size-4',
    },
    isIconOnly: {
      true: 'p-0',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
})

type ButtonVariants = VariantProps<typeof buttonVariants>

interface ButtonProps
  extends React.ComponentProps<typeof ButtonPrimitive.Button>, ButtonVariants {
  isIconOnly?: boolean
}

const Button = ({
  variant,
  size,
  isIconOnly,
  className,
  children,
  ...props
}: ButtonProps) => {
  const styles = buttonVariants

  const renderChildren = composeRenderProps(
    children,
    (children, { isPending }) => (
      <>
        {isPending && (
          <Loader
            data-slot="spinner"
            aria-label="loading"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        )}
        {typeof children === 'string' ? (
          <span className="truncate">{children}</span>
        ) : (
          children
        )}
      </>
    ),
  )

  return (
    <ButtonPrimitive.Button
      data-button=""
      data-icon-only={isIconOnly ? '' : undefined}
      className={composeRenderProps(className, (cn) =>
        styles({ variant, size, isIconOnly, className: cn }),
      )}
      {...props}
      // Only wrap provided children: passing a render function when `children`
      // is undefined would override context-injected children (e.g. the
      // ColorPicker trigger's default swatch) in RAC's context merge.
      children={children === undefined ? undefined : renderChildren}
    />
  )
}

interface LinkButtonProps
  extends
    React.ComponentProps<typeof LinkPrimitive.Link>,
    VariantProps<typeof buttonVariants> {
  isIconOnly?: boolean
}

const LinkButton = ({
  variant,
  size,
  isIconOnly,
  className,
  children,
  ...props
}: LinkButtonProps) => {
  const styles = buttonVariants

  return (
    <LinkPrimitive.Link
      data-button=""
      data-icon-only={isIconOnly ? '' : undefined}
      className={composeRenderProps(className, (cn) =>
        styles({ variant, size, isIconOnly, className: cn }),
      )}
      {...props}
    >
      {composeRenderProps(children, (children) => (
        <>
          {typeof children === 'string' ? (
            <span className="truncate">{children}</span>
          ) : (
            children
          )}
        </>
      ))}
    </LinkPrimitive.Link>
  )
}

export type { ButtonProps, LinkButtonProps }
export { Button, buttonVariants, LinkButton }
