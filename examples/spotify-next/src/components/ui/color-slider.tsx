"use client";

import { createContext, use } from "react";
import * as ColorSliderPrimitives from "react-aria-components/ColorSlider";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import { useLocale } from "react-aria-components/I18nProvider";
import * as SliderPrimitives from "react-aria-components/Slider";
import { Provider } from "react-aria-components/slots";
import * as TextPrimitives from "react-aria-components/Text";
import { useSlotId } from "react-aria/private/utils/useId";

import { ColorThumb } from "@/components/ui/color-thumb";
import { tv, type VariantProps } from "tailwind-variants";
const colorSliderVariants = tv({
  slots: {
    root: "flex flex-col gap-2",
    output: "text-sm text-fg-muted tabular-nums",
    track:
      "relative rounded-md disabled:[background:var(--color-disabled)]! orientation-horizontal:**:data-[slot=color-thumb]:top-1/2 orientation-vertical:**:data-[slot=color-thumb]:left-1/2",
  },
  variants: {
    orientation: {
      horizontal: {
        root: "w-48",
        track: "h-6 w-full",
      },
      vertical: {
        root: "h-48 items-center",
        track: "w-6 flex-1",
      },
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

interface ColorSliderProps extends React.ComponentProps<
  typeof ColorSliderPrimitives.ColorSlider
> {}

const ChannelContext = createContext<ColorSliderProps["channel"] | null>(null);

const ColorSlider = ({ className, ...props }: ColorSliderProps) => {
  const { root } = colorSliderVariants();
  const descriptionId = useSlotId();
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
  );
};

interface ColorSliderControlProps extends React.ComponentProps<
  typeof SliderPrimitives.SliderTrack
> {}

const ColorSliderControl = ({
  className,
  style,
  ...props
}: ColorSliderControlProps) => {
  const { track } = colorSliderVariants();
  const state = use(ColorSliderPrimitives.ColorSliderStateContext);
  const channel = use(ChannelContext);
  const { direction } = useLocale();
  // The hue track previews every hue at the current saturation/brightness
  // instead of the fully saturated ramp React Aria draws by default.
  const color =
    channel === "hue" && state
      ? state.value.withChannelValue("alpha", 1)
      : null;
  return (
    <SliderPrimitives.SliderTrack
      data-slot="color-slider-control"
      className={composeRenderProps(className, (cn, { orientation }) =>
        track({ orientation, className: cn }),
      )}
      style={composeRenderProps(
        style,
        (style, { defaultStyle, orientation }) => {
          let gradient = defaultStyle?.background;
          if (color) {
            const to =
              orientation === "vertical"
                ? "top"
                : direction === "rtl"
                  ? "left"
                  : "right";
            const stops = [0, 60, 120, 180, 240, 300, 360]
              .map((hue) => color.withChannelValue("hue", hue).toString("css"))
              .join(", ");
            gradient = `linear-gradient(to ${to}, ${stops})`;
          }
          return {
            ...defaultStyle,
            ...style,
            background: `${gradient},
      repeating-conic-gradient(#e6e6e6 0% 25%, #fff 0% 50%) 50% / 16px 16px`,
          };
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
  );
};

interface ColorSliderOutputProps extends React.ComponentProps<
  typeof SliderPrimitives.SliderOutput
> {}

const ColorSliderOutput = ({ className, ...props }: ColorSliderOutputProps) => {
  const { output } = colorSliderVariants();
  return (
    <SliderPrimitives.SliderOutput
      className={composeRenderProps(className, (className) =>
        output({ className }),
      )}
      {...props}
    />
  );
};

export type {
  ColorSliderControlProps,
  ColorSliderOutputProps,
  ColorSliderProps,
};
export { ColorSlider, ColorSliderControl, ColorSliderOutput };
