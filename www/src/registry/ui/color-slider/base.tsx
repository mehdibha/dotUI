"use client"

import { createContext, use } from "react"
import * as ColorSliderPrimitives from "react-aria-components/ColorSlider"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import { useLocale } from "react-aria-components/I18nProvider"
import * as SliderPrimitives from "react-aria-components/Slider"
import { Provider } from "react-aria-components/slots"
import * as TextPrimitives from "react-aria-components/Text"
import { useSlotId } from "react-aria/private/utils/useId"

import { ColorThumb } from "@/registry/ui/color-thumb"

import { useStyles } from "./styles"

// MARK: colorSliderStyles

// MARK: Separator

interface ColorSliderProps extends React.ComponentProps<
  typeof ColorSliderPrimitives.ColorSlider
> {}

const ChannelContext = createContext<ColorSliderProps["channel"] | null>(null)

const ColorSlider = ({ className, ...props }: ColorSliderProps) => {
  const { root } = useStyles()()
  const descriptionId = useSlotId()
  return (
    <Provider
      values={[
        [
          TextPrimitives.TextContext,
          { slot: "description", id: descriptionId },
        ],
        [ChannelContext, props.channel],
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
  style,
  ...props
}: ColorSliderControlProps) => {
  const { track } = useStyles()()
  const state = use(ColorSliderPrimitives.ColorSliderStateContext)
  const channel = use(ChannelContext)
  const { direction } = useLocale()
  // The hue track previews every hue at the current saturation/brightness
  // instead of the fully saturated ramp React Aria draws by default.
  const color =
    channel === "hue" && state ? state.value.withChannelValue("alpha", 1) : null
  return (
    <SliderPrimitives.SliderTrack
      data-slot="color-slider-control"
      className={composeRenderProps(className, (cn, { orientation }) =>
        track({ orientation, className: cn }),
      )}
      style={composeRenderProps(
        style,
        (style, { defaultStyle, orientation }) => {
          let gradient = defaultStyle?.background
          if (color) {
            const to =
              orientation === "vertical"
                ? "top"
                : direction === "rtl"
                  ? "left"
                  : "right"
            const stops = [0, 60, 120, 180, 240, 300, 360]
              .map((hue) => color.withChannelValue("hue", hue).toString("css"))
              .join(", ")
            gradient = `linear-gradient(to ${to}, ${stops})`
          }
          return {
            ...defaultStyle,
            ...style,
            background: `${gradient},
      repeating-conic-gradient(#e6e6e6 0% 25%, #fff 0% 50%) 50% / 16px 16px`,
          }
        },
      )}
      {...props}
    >
      {props.children ?? (
        <ColorThumb
          style={color ? { backgroundColor: color.toString("css") } : undefined}
        />
      )}
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
