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

import { ColorThumb } from "@dotui/registry-v2/ui/color-thumb";
import { Label } from "@dotui/registry-v2/ui/field";

const colorSliderStyles = tv({
  slots: {
    root: "flex flex-col gap-2",
    output: "text-sm text-fg-muted",
    track:
      "relative rounded-md before:absolute before:inset-0 before:z-[-1] before:rounded-[inherit] before:bg-[repeating-conic-gradient(#e6e6e6_0%_25%,_#fff_0%_50%)] before:bg-[length:16px_16px] before:bg-center before:content-[''] disabled:[background:var(--color-disabled)]! orientation-horizontal:[&_[data-slot=color-thumb]]:top-1/2 orientation-vertical:[&_[data-slot=color-thumb]]:left-1/2",
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
      />
    </Provider>
  );
};

/* -----------------------------------------------------------------------------------------------*/

const ColorSliderControl = (props: ColorSliderTrackProps) => {
  return (
    <ColorSliderTrack {...props}>
      <ColorThumb />
    </ColorSliderTrack>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface ColorSliderTrackProps
  extends React.ComponentProps<typeof AriaSliderTrack> {}

const ColorSliderTrack = ({ className, ...props }: ColorSliderTrackProps) => {
  return (
    <AriaSliderTrack
      data-slot="color-slider-track"
      className={composeRenderProps(className, (cn, { orientation }) =>
        track({ orientation, className: cn }),
      )}
      {...props}
    />
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

const CompoundColorSlider = Object.assign(ColorSlider, {
  Label,
  Control: ColorSliderControl,
  Track: ColorSliderTrack,
  Thumb: ColorThumb,
  Output: ColorSliderOutput,
});

export {
  CompoundColorSlider as ColorSlider,
  ColorSliderOutput,
  ColorSliderControl,
};

export type { ColorSliderProps, ColorSliderTrackProps, ColorSliderOutputProps };
