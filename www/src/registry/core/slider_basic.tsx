"use client";

import * as React from "react";
import { useSlotId } from "@react-aria/utils";
import {
  composeRenderProps,
  Slider as AriaSlider,
  SliderOutput as AriaSliderOutput,
  SliderThumb as AriaSliderThumb,
  SliderTrack as AriaSliderTrack,
  TextContext,
  SliderStateContext,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { Description, Label } from "@/registry/core/field_basic";
import { focusRing } from "@/registry/lib/focus-styles";
import { createScopedContext } from "@/registry/lib/utils";

const sliderStyles = tv({
  slots: {
    root: "group flex flex-col gap-2",
    track:
      "bg-bg-neutral disabled:bg-bg-disabled relative grow cursor-pointer rounded-full disabled:cursor-default",
    filler:
      "group-disabled:bg-bg-disabled pointer-events-none absolute rounded-full",
    thumb: [
      focusRing(),
      "disabled:bg-bg-disabled disabled:border-bg left-[50%] top-[50%] rounded-full bg-white shadow-md transition-[width,height] disabled:border",
    ],
    valueLabel: "text-fg-muted text-sm",
  },
  variants: {
    variant: {
      accent: {
        filler: "bg-bg-accent",
      },
      primary: {
        filler: "bg-bg-primary",
      },
    },
    orientation: {
      horizontal: {
        root: "w-48",
        track: "h-2 w-full",
        filler: "top-0 h-full",
      },
      vertical: {
        root: "h-48 items-center",
        track: "w-2 flex-1",
        filler: "bottom-0 w-full",
      },
    },
    size: {
      sm: {
        thumb: "dragging:size-4 size-3",
        track: "orientation-vertical:w-1 orientation-horizontal:h-1",
      },
      md: {
        thumb: "dragging:size-5 size-4",
        track: "orientation-vertical:w-2 orientation-horizontal:h-2",
      },
      lg: {
        thumb: "dragging:size-6 size-5",
        track: "orientation-vertical:w-3 orientation-horizontal:h-3",
      },
    },
  },
  defaultVariants: {
    variant: "accent",
    size: "md",
  },
});

const { root, track, filler, thumb, valueLabel } = sliderStyles();

const [SliderProvider, useSliderContext] =
  createScopedContext<VariantProps<typeof sliderStyles>>("SliderRoot");

interface SliderProps extends Omit<SliderRootProps, "children"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  showValueLabel?: boolean;
  getValueLabel?: (value: number[]) => string;
}
const Slider = ({
  label,
  description,
  showValueLabel = true,
  getValueLabel,
  ...props
}: SliderProps) => {
  return (
    <SliderRoot {...props}>
      <div className="grid grid-cols-[1fr_auto] [grid-template-areas:'label_value']">
        {label && <Label className="[grid-area:label]">{label}</Label>}
        {showValueLabel && (
          <SliderValueLabel className="[grid-area:value]">
            {({ state }) =>
              getValueLabel ? getValueLabel(state.values) : null
            }
          </SliderValueLabel>
        )}
      </div>
      <SliderTrack>
        {({ state }) => (
          <>
            <SliderFiller />
            {state.values.map((_, i) => (
              <SliderThumb key={i} index={i} />
            ))}
          </>
        )}
      </SliderTrack>
      {description && <Description>{description}</Description>}
    </SliderRoot>
  );
};

interface SliderRootProps
  extends React.ComponentProps<typeof AriaSlider>,
    VariantProps<typeof sliderStyles> {}
const SliderRoot = ({
  children,
  className,
  variant,
  size,
  ...props
}: SliderRootProps) => {
  const descriptionId = useSlotId();
  return (
    <AriaSlider
      aria-describedby={descriptionId}
      className={composeRenderProps(className, (className, { orientation }) =>
        root({ orientation, size, className })
      )}
      {...props}
    >
      {composeRenderProps(children, (children, { orientation }) => (
        <>
          <TextContext
            value={{ slots: { description: { id: descriptionId } } }}
          >
            <SliderProvider
              variant={variant}
              orientation={orientation}
              size={size}
            >
              {children}
            </SliderProvider>
          </TextContext>
        </>
      ))}
    </AriaSlider>
  );
};

interface SliderTrackProps
  extends React.ComponentProps<typeof AriaSliderTrack> {}
const SliderTrack = ({ ...props }: SliderTrackProps) => {
  const { orientation, size } = useSliderContext("SliderTrack");
  return (
    <AriaSliderTrack
      className={composeRenderProps(props.className, (className) =>
        track({ orientation, size, className })
      )}
      {...props}
    />
  );
};

interface SliderFillerProps extends React.ComponentProps<"div"> {}
const SliderFiller = ({ className, style, ...props }: SliderFillerProps) => {
  const { variant, size } = useSliderContext("SliderTrack");
  const SliderState = React.useContext(SliderStateContext);
  if (!SliderState)
    throw new Error("SliderFiller must be used within SliderRoot");
  const { orientation, getThumbPercent, values } = SliderState;
  const dimensionStyles = getFillerDimensions(
    values,
    orientation,
    getThumbPercent
  );

  return (
    <div
      className={filler({ variant, orientation, size, className })}
      style={{ ...style, ...dimensionStyles }}
      {...props}
    />
  );
};

interface SliderThumbProps
  extends React.ComponentProps<typeof AriaSliderThumb> {}
const SliderThumb = ({ className, ...props }: SliderThumbProps) => {
  const { orientation, size } = useSliderContext("SliderThumb");
  return (
    <AriaSliderThumb
      className={composeRenderProps(className, (className) =>
        thumb({ orientation, size, className })
      )}
      {...props}
    />
  );
};

interface SliderValueLabelProps
  extends React.ComponentProps<typeof AriaSliderOutput> {}
const SliderValueLabel = ({
  children,
  className,
  ...props
}: SliderValueLabelProps) => {
  return (
    <AriaSliderOutput
      className={composeRenderProps(className, (className) =>
        valueLabel({ className })
      )}
      {...props}
    >
      {composeRenderProps(
        children,
        (children, { state }) =>
          children ??
          state.values.map((_, i) => state.getThumbValueLabel(i)).join(" - ")
      )}
    </AriaSliderOutput>
  );
};

const getFillerDimensions = (
  values: number[],
  orientation: "horizontal" | "vertical",
  getThumbPercent: (index: number) => number
): React.CSSProperties => {
  if (values.length === 1 && orientation === "horizontal")
    return { width: `${getThumbPercent(0) * 100}%` };

  if (values.length === 1 && orientation === "vertical")
    return { height: `${getThumbPercent(0) * 100}%` };

  if (orientation === "horizontal")
    return {
      left: `${getThumbPercent(0) * 100}%`,
      width: `${Math.abs(getThumbPercent(0) - getThumbPercent(1)) * 100}%`,
    };

  if (orientation === "vertical")
    return {
      bottom: `${getThumbPercent(0) * 100}%`,
      height: `${Math.abs(getThumbPercent(0) - getThumbPercent(1)) * 100}%`,
    };

  return {};
};

export {
  Slider,
  SliderRoot,
  SliderTrack,
  SliderFiller,
  SliderThumb,
  SliderValueLabel,
};
