'use client'

import * as ColorThumbPrimitives from 'react-aria-components/ColorThumb'
import { tv } from 'tailwind-variants'
const colorThumbVariants = tv({
  base: [
    'focus-reset focus-visible:focus-ring',
    'z-30 size-6 rounded-full border-2 border-white ring-1 ring-black/40 disabled:border-border-disabled disabled:bg-disabled!',
    'group-orientation-horizontal/color-slider:top-1/2 group-orientation-vertical/color-slider:left-1/2',
  ],
})

interface ColorThumbProps extends Omit<
  ColorThumbPrimitives.ColorThumbProps,
  'className'
> {
  className?: string
}
const ColorThumb = ({ className, ...props }: ColorThumbProps) => {
  const styles = colorThumbVariants
  return (
    <ColorThumbPrimitives.ColorThumb
      data-slot="color-thumb"
      className={styles({ className })}
      {...props}
    />
  )
}

export type { ColorThumbProps }
export { ColorThumb }
