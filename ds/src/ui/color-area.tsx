'use client'

import * as ColorAreaPrimitives from 'react-aria-components/ColorArea'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import { tv } from 'tailwind-variants'

import { ColorThumb } from '@/ui/color-thumb'
const colorAreaVariants = tv({
  base: [
    'block aspect-square min-w-20 rounded-md disabled:[background:var(--color-disabled)]! in-data-dialog:w-full',
    'w-48',
  ],
})

type ColorAreaProps = React.ComponentProps<typeof ColorAreaPrimitives.ColorArea>

const ColorArea = ({ className, ...props }: ColorAreaProps) => {
  const styles = colorAreaVariants
  return (
    <ColorAreaPrimitives.ColorArea
      className={composeRenderProps(className, (className) =>
        styles({ className }),
      )}
      {...props}
    >
      {props.children || <ColorThumb />}
    </ColorAreaPrimitives.ColorArea>
  )
}

export type { ColorAreaProps }
export { ColorArea }
