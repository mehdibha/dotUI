'use client'

import type React from 'react'
import * as ColorSwatchPickerPrimitives from 'react-aria-components/ColorSwatchPicker'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import { tv } from 'tailwind-variants'

import { ColorSwatch } from '@/ui/color-swatch'
const colorSwatchPickerVariants = tv({
  slots: {
    root: ['flex flex-wrap', 'gap-1'],
    item: [
      'relative rounded-md transition-shadow focus:z-10 *:data-[slot=color-swatch]:size-full *:data-[slot=color-swatch]:rounded-[inherit]',
      'focus-reset focus-visible:focus-ring',
      'disabled:cursor-not-allowed disabled:*:data-[slot=color-swatch]:[background:color-mix(in_oklab,var(--color-disabled)_90%,var(--color))]!',
      "before:absolute before:inset-0 before:scale-90 before:rounded-[inherit] before:bg-bg before:opacity-0 before:outline-2 before:outline-inverse before:transition-[opacity,scale] before:duration-100 before:content-[''] selected:before:scale-100 selected:before:opacity-100",
      'size-8',
    ],
  },
})

interface ColorSwatchPickerProps extends React.ComponentProps<
  typeof ColorSwatchPickerPrimitives.ColorSwatchPicker
> {}

const ColorSwatchPicker = ({ className, ...props }: ColorSwatchPickerProps) => {
  const { root } = colorSwatchPickerVariants()
  return (
    <ColorSwatchPickerPrimitives.ColorSwatchPicker
      className={composeRenderProps(className, (className) =>
        root({ className }),
      )}
      {...props}
    />
  )
}

interface ColorSwatchPickerItemProps extends React.ComponentProps<
  typeof ColorSwatchPickerPrimitives.ColorSwatchPickerItem
> {}
const ColorSwatchPickerItem = ({
  className,
  style,
  ...props
}: ColorSwatchPickerItemProps) => {
  const { item } = colorSwatchPickerVariants()
  return (
    <ColorSwatchPickerPrimitives.ColorSwatchPickerItem
      className={composeRenderProps(className, (className) =>
        item({ className }),
      )}
      style={composeRenderProps(
        style,
        (style, { color }) =>
          ({
            '--color': color.toString(),
            ...style,
          }) as React.CSSProperties,
      )}
      {...props}
    >
      <ColorSwatch className="size-full rounded-[inherit]" />
    </ColorSwatchPickerPrimitives.ColorSwatchPickerItem>
  )
}

const CompoundColorSwatchPicker = Object.assign(ColorSwatchPicker, {
  Item: ColorSwatchPickerItem,
})

export type { ColorSwatchPickerItemProps, ColorSwatchPickerProps }
export { ColorSwatchPickerItem, CompoundColorSwatchPicker as ColorSwatchPicker }
