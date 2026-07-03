'use client'

import { createContext, useContext, useId } from 'react'
import type * as React from 'react'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import { LabelContext } from 'react-aria-components/Label'
import { Provider, useSlottedContext } from 'react-aria-components/slots'
import * as SwitchPrimitive from 'react-aria-components/Switch'
import { useSlotId } from 'react-aria/private/utils/useId'
import { type VariantProps, tv } from 'tailwind-variants'

import { Label } from '@/ui/field'
const switchVariants = tv({
  slots: {
    root: ['flex items-center has-data-description:items-start', 'gap-2'],
    control: [
      'relative flex items-center gap-2 rounded-full focus-reset not-has-data-label:after:absolute not-has-data-label:after:-inset-x-3 not-has-data-label:after:-inset-y-2 read-only:cursor-default focus-visible:focus-ring disabled:cursor-disabled has-data-description:items-start has-data-label:rounded-lg',
      'transition-colors duration-75 has-data-label:w-full has-data-label:justify-between has-data-label:border has-data-label:p-2.5 has-data-label:selected:border-[color-mix(in_srgb,var(--color-accent)_25%,var(--color-bg))] has-data-label:selected:bg-[color-mix(in_srgb,var(--color-accent)_10%,var(--color-bg))]',
    ],
    indicator: [
      'inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-neutral p-0.5 transition-[background-color,border-color,box-shadow] duration-200',
      'selected:bg-accent',
      'read-only:cursor-default disabled:cursor-disabled disabled:border-border-disabled disabled:bg-transparent disabled:selected:border-transparent disabled:selected:bg-disabled',
    ],
    thumb: [
      'pointer-events-none block rounded-full bg-white shadow-sm transition-[background-color,margin,width] duration-200',
      'disabled:bg-fg-disabled',
    ],
  },
  variants: {
    size: {
      sm: {
        indicator: 'h-5 w-9',
        thumb: 'size-4 pressed:w-5 selected:ml-4 selected:pressed:ml-3',
      },
      md: {
        indicator: 'h-6 w-11',
        thumb: 'size-5 pressed:w-6 selected:ml-5 selected:pressed:ml-4',
      },
      lg: {
        indicator: 'h-7 w-13',
        thumb: 'size-6 pressed:w-7 selected:ml-6 selected:pressed:ml-5',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

const SwitchStyleContext = createContext<VariantProps<typeof switchVariants>>(
  {},
)
const InternalSwitchContext = createContext<
  | (SwitchPrimitive.SwitchButtonRenderProps &
      VariantProps<typeof switchVariants>)
  | null
>(null)

interface SwitchProps
  extends
    React.ComponentProps<typeof SwitchPrimitive.SwitchField>,
    VariantProps<typeof switchVariants> {}

const Switch = ({ id: idProp, size, className, ...props }: SwitchProps) => {
  const { root } = switchVariants()
  const autoId = useId()
  const id = idProp ?? autoId
  const labelId = useSlotId()

  return (
    <SwitchStyleContext.Provider value={{ size }}>
      <SwitchPrimitive.SwitchField
        data-switch=""
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
                  <SwitchControl />
                  <Label>{children}</Label>
                </>
              ) : (
                children
              )}
            </Provider>
          ) : (
            <SwitchControl />
          )
        })}
      </SwitchPrimitive.SwitchField>
    </SwitchStyleContext.Provider>
  )
}

interface SwitchControlProps
  extends
    React.ComponentProps<typeof SwitchPrimitive.SwitchButton>,
    VariantProps<typeof switchVariants> {}

const SwitchControl = ({
  className,
  size: sizeProp,
  ...props
}: SwitchControlProps) => {
  const { control } = switchVariants()
  const labelContext = useSlottedContext(LabelContext)
  const styleContext = useContext(SwitchStyleContext)
  const { id: labelId } = labelContext ?? {}
  const size = sizeProp ?? styleContext.size

  return (
    <SwitchPrimitive.SwitchButton
      data-switch-control=""
      className={composeRenderProps(className, (className) =>
        control({ size, className }),
      )}
      {...props}
    >
      {composeRenderProps(props.children, (children, renderProps) => {
        return (
          <InternalSwitchContext.Provider value={{ ...renderProps, size }}>
            <Provider
              values={[[LabelContext, { id: labelId, elementType: 'span' }]]}
            >
              {children ?? <SwitchIndicator />}
            </Provider>
          </InternalSwitchContext.Provider>
        )
      })}
    </SwitchPrimitive.SwitchButton>
  )
}

interface SwitchIndicatorProps extends React.ComponentProps<'span'> {}

const SwitchIndicator = ({ className, ...props }: SwitchIndicatorProps) => {
  const { indicator } = switchVariants()
  const ctx = useContext(InternalSwitchContext)

  if (!ctx) {
    return (
      <SwitchControl>
        <SwitchIndicator className={className} {...props} />
      </SwitchControl>
    )
  }

  return (
    <span
      data-rac=""
      data-selected={ctx.isSelected || undefined}
      data-pressed={ctx.isPressed || undefined}
      data-hovered={ctx.isHovered || undefined}
      data-focused={ctx.isFocused || undefined}
      data-focus-visible={ctx.isFocusVisible || undefined}
      data-disabled={ctx.isDisabled || undefined}
      data-readonly={ctx.isReadOnly || undefined}
      data-invalid={ctx.isInvalid || undefined}
      data-required={ctx.isRequired || undefined}
      className={indicator({ size: ctx.size, className })}
      {...props}
    >
      {props.children ?? <SwitchThumb />}
    </span>
  )
}

interface SwitchThumbProps extends React.ComponentProps<'span'> {}

const SwitchThumb = ({ className, ...props }: SwitchThumbProps) => {
  const { thumb } = switchVariants()
  const ctx = useContext(InternalSwitchContext)

  return (
    <span
      data-rac=""
      data-selected={ctx?.isSelected || undefined}
      data-pressed={ctx?.isPressed || undefined}
      data-hovered={ctx?.isHovered || undefined}
      data-focused={ctx?.isFocused || undefined}
      data-focus-visible={ctx?.isFocusVisible || undefined}
      data-disabled={ctx?.isDisabled || undefined}
      data-readonly={ctx?.isReadOnly || undefined}
      data-invalid={ctx?.isInvalid || undefined}
      data-required={ctx?.isRequired || undefined}
      className={thumb({ size: ctx?.size, className })}
      {...props}
    />
  )
}

export type {
  SwitchControlProps,
  SwitchIndicatorProps,
  SwitchProps,
  SwitchThumbProps,
}
export { Switch, SwitchControl, SwitchIndicator, SwitchThumb }
