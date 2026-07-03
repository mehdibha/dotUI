'use client'

import * as ColorSliderPrimitives from 'react-aria-components/ColorSlider'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as SliderPrimitives from 'react-aria-components/Slider'
import { Provider } from 'react-aria-components/slots'
import * as TextPrimitives from 'react-aria-components/Text'
import { useSlotId } from 'react-aria/private/utils/useId'
import { tv } from 'tailwind-variants'

import { ColorThumb } from '@/ui/color-thumb'
const colorSliderVariants = tv({
  slots: {
    root: 'flex flex-col gap-2',
    output: 'text-sm text-fg-muted',
    track:
      'relative rounded-md disabled:[background:var(--color-disabled)]! orientation-horizontal:**:data-[slot=color-thumb]:top-1/2 orientation-vertical:**:data-[slot=color-thumb]:left-1/2',
  },
  variants: {
    orientation: {
      horizontal: {
        root: 'w-48',
        track: 'h-6 w-full',
      },
      vertical: {
        root: 'h-48 items-center',
        track: 'w-6 flex-1',
      },
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
})

interface ColorSliderProps extends React.ComponentProps<
  typeof ColorSliderPrimitives.ColorSlider
> {}

const ColorSlider = ({ className, ...props }: ColorSliderProps) => {
  const { root } = colorSliderVariants()
  const descriptionId = useSlotId()
  return (
    <Provider
      values={[
        [
          TextPrimitives.TextContext,
          { slot: 'description', id: descriptionId },
        ],
      ]}
    >
      <ColorSliderPrimitives.ColorSlider
        className={composeRenderProps(className, (cn, { orientation }) =>
          root({ orientation, className: cn }),
        )}
        aria-describedby={descriptionId}
        {...props}
      >
        {props.children ?? <ColorSliderControl />}
      </ColorSliderPrimitives.ColorSlider>
    </Provider>
  )
}

interface ColorSliderControlProps extends React.ComponentProps<
  typeof SliderPrimitives.SliderTrack
> {}

const ColorSliderControl = ({
  className,
  style,
  ...props
}: ColorSliderControlProps) => {
  const { track } = colorSliderVariants()
  return (
    <SliderPrimitives.SliderTrack
      data-slot="color-slider-control"
      className={composeRenderProps(className, (cn, { orientation }) =>
        track({ orientation, className: cn }),
      )}
      style={composeRenderProps(style, (style, { defaultStyle }) => ({
        ...defaultStyle,
        ...style,
        background: `${defaultStyle?.background},
      repeating-conic-gradient(#e6e6e6 0% 25%, #fff 0% 50%) 50% / 16px 16px`,
      }))}
      {...props}
    >
      {props.children ?? <ColorThumb />}
    </SliderPrimitives.SliderTrack>
  )
}

interface ColorSliderOutputProps extends React.ComponentProps<
  typeof SliderPrimitives.SliderOutput
> {}

const ColorSliderOutput = ({ className, ...props }: ColorSliderOutputProps) => {
  const { output } = colorSliderVariants()
  return (
    <SliderPrimitives.SliderOutput
      className={composeRenderProps(className, (className) =>
        output({ className }),
      )}
      {...props}
    />
  )
}

export type {
  ColorSliderControlProps,
  ColorSliderOutputProps,
  ColorSliderProps,
}
export { ColorSlider, ColorSliderControl, ColorSliderOutput }
