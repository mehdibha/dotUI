"use client";

import {
  ColorSlider as AriaColorSlider,
  SliderOutput as AriaSliderOutput,
  SliderTrack as AriaSliderTrack,
  type ColorSliderProps as AriaColorSliderProps,
  type SliderOutputProps as AriaSliderOutputProps,
  type SliderTrackProps as AriaSliderTrackProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { cn } from "@/lib/utils/classes";
import { ColorThumb } from "./color-thumb";
import { Label } from "./field";

interface ColorSliderProps extends ColorSliderRootProps {
  label?: string;
}

const colorSliderStyles = tv({
  slots: {
    root: "grid [grid-template-areas:'label_output''track_track'] grid-cols-[1fr_auto] gap-1",
    output: "[grid-area:output] text-xs",
    track: [
      "[grid-area:track] orientation-horizontal:w-48 rounded-md orientation-horizontal:h-6 orientation-vertical:w-6 orientation-vertical:h-48",
      "relative before:absolute before:inset-0 before:z-[-1] before:bg-[repeating-conic-gradient(#e6e6e6_0%_25%,_#fff_0%_50%)] before:bg-[length:16px_16px] before:bg-center before:content-[''] before:rounded-[inherit]",
    ],
  },
});

const ColorSlider = ({ label, channel, ...props }: ColorSliderProps) => {
  return (
    <ColorSliderRoot channel={channel} {...props}>
      {({ orientation }) => (
        <>
          {label && <Label>{label}</Label>}
          {orientation === "horizontal" && <SliderOutput />}
          <SliderTrack>
            <ColorThumb
              className={cn(orientation === "horizontal" ? "top-1/2" : "left-1/2")}
            />
          </SliderTrack>
        </>
      )}
    </ColorSliderRoot>
  );
};

interface ColorSliderRootProps extends Omit<AriaColorSliderProps, "className"> {
  className?: string;
}
const ColorSliderRoot = ({ className, ...props }: ColorSliderRootProps) => {
  const { root } = colorSliderStyles();
  return <AriaColorSlider className={root({ className })} {...props} />;
};

interface SliderOutputProps extends Omit<AriaSliderOutputProps, "className"> {
  className?: string;
}
const SliderOutput = ({ className, ...props }: SliderOutputProps) => {
  const { output } = colorSliderStyles();
  return <AriaSliderOutput className={output({ className })} {...props} />;
};

interface SliderTrackProps extends Omit<AriaSliderTrackProps, "className"> {
  className?: string;
}
const SliderTrack = ({ className, ...props }: SliderTrackProps) => {
  const { track } = colorSliderStyles();
  return <AriaSliderTrack className={track({ className })} {...props} />;
};

export type { ColorSliderProps, ColorSliderRootProps };
export { ColorSlider, ColorSliderRoot };
