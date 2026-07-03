'use client'

import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as ToggleButtonGroupPrimitives from 'react-aria-components/ToggleButtonGroup'
import { type VariantProps, tv } from 'tailwind-variants'

import { ToggleButtonProvider } from '@/ui/toggle-button'
import type { toggleButtonVariants } from '@/ui/toggle-button'
const toggleButtonGroupVariants = tv({
  slots: {
    root: [
      'flex w-fit items-stretch',
      '*:data-button:min-w-0 *:data-button:shrink-0 *:data-button:shadow-none',
      '*:data-button:hover:z-10 *:data-button:focus-visible:z-20 *:data-button:selected:z-10 *:data-button:selected:focus-visible:z-20',
    ],
  },
  variants: {
    orientation: {
      horizontal: {
        root: 'flex-row has-data-[variant=default]:-space-x-px *:not-first:data-button:rounded-l-none *:not-last:data-button:rounded-r-none',
      },
      vertical: {
        root: 'flex-col has-data-[variant=default]:-space-y-px *:not-first:data-button:rounded-t-none *:not-last:data-button:rounded-b-none',
      },
    },
  },
})

interface ToggleButtonGroupProps
  extends
    React.ComponentProps<typeof ToggleButtonGroupPrimitives.ToggleButtonGroup>,
    VariantProps<typeof toggleButtonVariants> {}

const ToggleButtonGroup = ({
  variant,
  size,
  isIconOnly,
  orientation = 'horizontal',
  className,
  ...props
}: ToggleButtonGroupProps) => {
  const { root } = toggleButtonGroupVariants()
  return (
    <ToggleButtonProvider variant={variant} size={size} isIconOnly={isIconOnly}>
      <ToggleButtonGroupPrimitives.ToggleButtonGroup
        data-slot="toggle-button-group"
        data-toggle-button-group=""
        data-orientation={orientation}
        orientation={orientation}
        className={composeRenderProps(className, (className) =>
          root({
            orientation,
            className,
          }),
        )}
        {...props}
      />
    </ToggleButtonProvider>
  )
}

export type { ToggleButtonGroupProps }
export { ToggleButtonGroup }
