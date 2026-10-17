"use client"

import * as React from "react"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import { LabelContext } from "react-aria-components/Label"
import { Provider, useSlottedContext } from "react-aria-components/slots"
import * as SwitchPrimitives from "react-aria-components/Switch"
import { useSlotId } from "react-aria/private/utils/useId"
import type { VariantProps } from "tailwind-variants"

import { Label } from "@/registry/ui/field"

import { useStyles } from "./styles"
import type { SwitchStyles } from "./styles"

// MARK: switchStyles

const SwitchStyleContext = React.createContext<VariantProps<SwitchStyles>>({})
const InternalSwitchContext = React.createContext<
  (SwitchPrimitives.SwitchButtonRenderProps & VariantProps<SwitchStyles>) | null
>(null)

// MARK: Separator

interface SwitchProps
  extends
    React.ComponentProps<typeof SwitchPrimitives.SwitchField>,
    VariantProps<SwitchStyles> {}

const Switch = ({ id: idProp, size, className, ...props }: SwitchProps) => {
  const { root } = useStyles()()
  const autoId = React.useId()
  const id = idProp ?? autoId
  const labelId = useSlotId()

  return (
    <SwitchStyleContext.Provider value={{ size }}>
      <SwitchPrimitives.SwitchField
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
              {typeof children === "string" ? (
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
      </SwitchPrimitives.SwitchField>
    </SwitchStyleContext.Provider>
  )
}

// MARK: Separator

interface SwitchControlProps
  extends
    React.ComponentProps<typeof SwitchPrimitives.SwitchButton>,
    VariantProps<SwitchStyles> {}

const SwitchControl = ({
  className,
  size: sizeProp,
  ...props
}: SwitchControlProps) => {
  const { control } = useStyles()()
  const labelContext = useSlottedContext(LabelContext)
  const styleContext = React.useContext(SwitchStyleContext)
  const { id: labelId } = labelContext ?? {}
  const size = sizeProp ?? styleContext.size

  return (
    <SwitchPrimitives.SwitchButton
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
              values={[[LabelContext, { id: labelId, elementType: "span" }]]}
            >
              {children ?? <SwitchIndicator />}
            </Provider>
          </InternalSwitchContext.Provider>
        )
      })}
    </SwitchPrimitives.SwitchButton>
  )
}

// MARK: Separator

interface SwitchIndicatorProps extends React.ComponentProps<"span"> {}

const SwitchIndicator = ({ className, ...props }: SwitchIndicatorProps) => {
  const { indicator } = useStyles()()
  const ctx = React.useContext(InternalSwitchContext)

  if (!ctx) {
    return (
      <SwitchControl>
        <SwitchIndicator className={className} {...props} />
      </SwitchControl>
    )
  }

  return (
    <span
      data-switch-indicator=""
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

// MARK: Separator

interface SwitchThumbProps extends React.ComponentProps<"span"> {}

const SwitchThumb = ({ className, ...props }: SwitchThumbProps) => {
  const { thumb } = useStyles()()
  const ctx = React.useContext(InternalSwitchContext)

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

// MARK: Separator

export type {
  SwitchControlProps,
  SwitchIndicatorProps,
  SwitchProps,
  SwitchThumbProps,
}
export { Switch, SwitchControl, SwitchIndicator, SwitchThumb }
