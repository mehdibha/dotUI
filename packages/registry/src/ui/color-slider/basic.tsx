"use client";

import { useSlotId } from "@react-aria/utils";
import {
  ColorSlider as AriaColorSlider,
  SliderOutput as AriaSliderOutput,
  SliderTrack as AriaSliderTrack,
  composeRenderProps,
  Provider,
  TextContext,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { ColorThumb } from "@dotui/registry/ui/color-thumb";

const colorSliderStyles = tv({
  slots: {
    root: "flex flex-col gap-2",
    output: "text-fg-muted text-sm",
    track:
      "relative rounded-md before:absolute before:inset-0 before:z-[-1] before:rounded-[inherit] before:bg-[repeating-conic-gradient(#e6e6e6_0%_25%,#fff_0%_50%)] before:bg-center before:bg-size-[16px_16px] before:content-[''] orientation-horizontal:**:data-[slot=color-thumb]:top-1/2 orientation-vertical:**:data-[slot=color-thumb]:left-1/2 disabled:[background:var(--color-disabled)]!",
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

const { root, track, output } = colorSliderStyles();

/* -----------------------------------------------------------------------------------------------*/

interface ColorSliderProps
  extends React.ComponentProps<typeof AriaColorSlider> {}

const ColorSlider = ({ className, ...props }: ColorSliderProps) => {
  const descriptionId = useSlotId();
  return (
    <Provider
      values={[[TextContext, { slot: "description", id: descriptionId }]]}
    >
      <AriaColorSlider
        className={composeRenderProps(className, (cn, { orientation }) =>
          root({ orientation, className: cn }),
        )}
        aria-describedby={descriptionId}
        {...props}
      >
        {props.children ?? <ColorSliderControl />}
      </AriaColorSlider>
    </Provider>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface ColorSliderControlProps
  extends React.ComponentProps<typeof AriaSliderTrack> {}

const ColorSliderControl = ({
  className,
  ...props
}: ColorSliderControlProps) => {
  return (
    <AriaSliderTrack
      data-slot="color-slider-control"
      className={composeRenderProps(className, (cn, { orientation }) =>
        track({ orientation, className: cn }),
      )}
      {...props}
    >
      {props.children ?? <ColorThumb />}
    </AriaSliderTrack>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface ColorSliderOutputProps
  extends React.ComponentProps<typeof AriaSliderOutput> {}

const ColorSliderOutput = ({ className, ...props }: ColorSliderOutputProps) => {
  return (
    <AriaSliderOutput
      className={composeRenderProps(className, (className) =>
        output({ className }),
      )}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

export { ColorSlider, ColorSliderControl, ColorSliderOutput };

export type {
  ColorSliderProps,
  ColorSliderControlProps,
  ColorSliderOutputProps,
};
