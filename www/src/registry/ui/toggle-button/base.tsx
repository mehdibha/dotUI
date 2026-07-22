'use client'

import type * as React from 'react'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as ToggleButtonPrimitive from 'react-aria-components/ToggleButton'
import type { VariantProps } from 'tailwind-variants'

import { createVariantsContext } from '@/registry/lib/context'

import { useStyles } from './styles'
import type { ToggleButtonStyles } from './styles'

// MARK: toggleButtonStyles

export { toggleButtonStyles } from './styles'

type ToggleButtonVariants = VariantProps<ToggleButtonStyles>

// MARK: Separator

const [ToggleButtonProvider, useContextProps] = createVariantsContext<
  ToggleButtonVariants,
  React.ComponentProps<typeof ToggleButtonPrimitive.ToggleButton>,
  HTMLButtonElement
>(ToggleButtonPrimitive.ToggleButtonContext)

// MARK: Separator

interface ToggleButtonProps
  extends
    React.ComponentProps<typeof ToggleButtonPrimitive.ToggleButton>,
    ToggleButtonVariants {
  isIconOnly?: boolean
}

const ToggleButton = (localProps: ToggleButtonProps) => {
  const styles = useStyles()
  const {
    variant = 'default',
    size = 'md',
    isIconOnly,
    className,
    children,
    ...props
  } = useContextProps(localProps)

  return (
    <ToggleButtonPrimitive.ToggleButton
      data-button=""
      data-toggle-button=""
      data-variant={variant}
      data-size={size}
      data-icon-only={isIconOnly ? '' : undefined}
      className={composeRenderProps(className, (cn) =>
        styles({
          variant,
          size,
          isIconOnly,
          className: cn,
        }),
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
    </ToggleButtonPrimitive.ToggleButton>
  )
}

// MARK: Separator

export type { ToggleButtonProps }
export { ToggleButton, ToggleButtonProvider }
