"use client";

import { ColorThumb } from "@/components/dynamic-ui/color-thumb";
import { Label } from "@/components/dynamic-ui/field";
import {
  ColorSlider as AriaColorSlider,
  SliderOutput as AriaSliderOutput,
  SliderTrack as AriaSliderTrack,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const colorSliderStyles = tv({
  slots: {
    root: "group flex flex-col gap-2",
    output: "text-fg-muted text-sm",
    track:
      "disabled:[background:var(--color-bg-disabled)]! relative rounded-md before:absolute before:inset-0 before:z-[-1] before:rounded-[inherit] before:bg-[repeating-conic-gradient(#e6e6e6_0%_25%,_#fff_0%_50%)] before:bg-[length:16px_16px] before:bg-center before:content-['']",
    thumb: "",
  },
  variants: {
    orientation: {
      horizontal: {
        root: "w-48",
        track: "h-6 w-full",
        thumb: "top-1/2",
      },
      vertical: {
        root: "h-48 items-center",
        track: "w-6 flex-1",
        thumb: "left-1/2",
      },
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

const { root, track, thumb, output } = colorSliderStyles();

interface ColorSliderProps extends ColorSliderRootProps {
  showValueLabel?: boolean;
  label?: string;
}
const ColorSlider = ({
  label,
  channel,
  showValueLabel = false,
  ...props
}: ColorSliderProps) => {
  return (
    <ColorSliderRoot channel={channel} {...props}>
      {(label || showValueLabel) && (
        <div className="grid grid-cols-[1fr_auto] [grid-template-areas:'label_value']">
          {label && <Label className="[grid-area:label]">{label}</Label>}
          {showValueLabel && (
            <ColorSliderOutput className="[grid-area:value]" />
          )}
        </div>
      )}
      <ColorSliderControl />
    </ColorSliderRoot>
  );
};

interface ColorSliderRootProps
  extends React.ComponentProps<typeof AriaColorSlider> {}
const ColorSliderRoot = ({ className, ...props }: ColorSliderRootProps) => {
  return (
    <AriaColorSlider
      className={composeRenderProps(className, (className, { orientation }) =>
        root({ orientation, className })
      )}
      {...props}
    />
  );
};

interface ColorSliderControlProps
  extends React.ComponentProps<typeof AriaSliderTrack> {}
const ColorSliderControl = ({
  className,
  ...props
}: ColorSliderControlProps) => {
  return (
    <AriaSliderTrack
      className={composeRenderProps(className, (className, { orientation }) =>
        track({ orientation, className })
      )}
      {...props}
    >
      {({ orientation }) => <ColorThumb className={thumb({ orientation })} />}
    </AriaSliderTrack>
  );
};

interface ColorSliderOutputProps
  extends React.ComponentProps<typeof AriaSliderOutput> {}
const ColorSliderOutput = ({ className, ...props }: ColorSliderOutputProps) => {
  return (
    <AriaSliderOutput
      className={composeRenderProps(className, (className) =>
        output({ className })
      )}
      {...props}
    />
  );
};

export type {
  ColorSliderProps,
  ColorSliderRootProps,
  ColorSliderControlProps,
  ColorSliderOutputProps,
};
export { ColorSlider, ColorSliderRoot, ColorSliderOutput, ColorSliderControl };
