'use client'

import * as ColorSliderPrimitives from 'react-aria-components/ColorSlider'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as SliderPrimitives from 'react-aria-components/Slider'
import { Provider } from 'react-aria-components/slots'
import * as TextPrimitives from 'react-aria-components/Text'
import { useSlotId } from 'react-aria/private/utils/useId'

import { ColorThumb } from '@/registry/ui/color-thumb'

import { useStyles } from './styles'

// MARK: colorSliderStyles

// MARK: Separator

interface ColorSliderProps extends React.ComponentProps<
  typeof ColorSliderPrimitives.ColorSlider
> {}

const ColorSlider = ({ className, ...props }: ColorSliderProps) => {
  const { root } = useStyles()()
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

// MARK: Separator

interface ColorSliderControlProps extends React.ComponentProps<
  typeof SliderPrimitives.SliderTrack
> {}

const ColorSliderControl = ({
  className,
  ...props
}: ColorSliderControlProps) => {
  const { track } = useStyles()()
  return (
    <SliderPrimitives.SliderTrack
      data-slot="color-slider-control"
      className={composeRenderProps(className, (cn, { orientation }) =>
        track({ orientation, className: cn }),
      )}
      {...props}
    >
      {props.children ?? <ColorThumb />}
    </SliderPrimitives.SliderTrack>
  )
}

// MARK: Separator

interface ColorSliderOutputProps extends React.ComponentProps<
  typeof SliderPrimitives.SliderOutput
> {}

const ColorSliderOutput = ({ className, ...props }: ColorSliderOutputProps) => {
  const { output } = useStyles()()
  return (
    <SliderPrimitives.SliderOutput
      className={composeRenderProps(className, (className) =>
        output({ className }),
      )}
      {...props}
    />
  )
}

// MARK: Separator

export type {
  ColorSliderControlProps,
  ColorSliderOutputProps,
  ColorSliderProps,
}
export { ColorSlider, ColorSliderControl, ColorSliderOutput }
