"use client";

import { use } from "react";
import { useSlotId } from "@react-aria/utils";
import {
  Slider as AriaSlider,
  SliderOutput as AriaSliderOutput,
  SliderStateContext as AriaSliderStateContext,
  SliderThumb as AriaSliderThumb,
  SliderTrack as AriaSliderTrack,
  TextContext as AriaTextContext,
  composeRenderProps,
  Provider,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { fieldStyles } from "@dotui/registry/ui/field";

const sliderStyles = tv({
  slots: {
    root: fieldStyles().field(),
    track:
      "relative my-1 grow cursor-pointer rounded-full bg-neutral disabled:cursor-not-allowed disabled:bg-disabled",
    filler:
      "pointer-events-none absolute rounded-full bg-accent disabled:bg-disabled",
    thumb: [
      "size-4 rounded-full bg-white shadow-md ring-primary/30 transition-[width,height,box-shadow]",
      "dragging:size-5 dragging:ring-0 ring-accent/30 hover:ring-4",
      "top-[50%] left-[50%]",
      "focus-visible:focus-ring",
      "disabled:border disabled:border-bg disabled:bg-disabled",
    ],
    output: "text-fg-muted text-sm disabled:text-fg-disabled",
  },
  variants: {
    orientation: {
      horizontal: {
        track: "h-1.5 w-48",
        filler: "top-0 h-full",
      },
      vertical: {
        root: "items-center",
        track: "h-48 w-2",
        filler: "bottom-0 w-full",
      },
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

const { root, track, filler, thumb, output } = sliderStyles();

/* -----------------------------------------------------------------------------------------------*/

interface SliderProps extends React.ComponentProps<typeof AriaSlider> {}

const Slider = ({ className, children, ...props }: SliderProps) => {
  const descriptionId = useSlotId();
  return (
    <AriaSlider
      className={composeRenderProps(className, (cn, { orientation }) =>
        root({ className: cn, orientation }),
      )}
      aria-describedby={descriptionId}
      {...props}
    >
      {composeRenderProps(children, (children) => (
        <Provider
          values={[
            [AriaTextContext, { slot: "description", id: descriptionId }],
          ]}
        >
          {children}
        </Provider>
      ))}
    </AriaSlider>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface SliderControlProps
  extends React.ComponentProps<typeof AriaSliderTrack> {}

const SliderControl = ({ className, ...props }: SliderControlProps) => {
  return (
    <AriaSliderTrack
      data-slot="slider-track"
      data-slider-track=""
      data-slider-control=""
      className={composeRenderProps(className, (cn, { orientation }) =>
        track({ orientation, className: cn }),
      )}
      {...props}
    >
      {composeRenderProps(
        props.children,
        (children, { state }) =>
          children ?? (
            <>
              {state.values.length < 3 && <SliderFiller />}
              {state.values.map((_, i) => (
                <SliderThumb key={i} index={i} />
              ))}
            </>
          ),
      )}
    </AriaSliderTrack>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface SliderFillerProps extends React.ComponentProps<"div"> {}

const SliderFiller = ({ className, style, ...props }: SliderFillerProps) => {
  const { orientation, getThumbPercent, values, isDisabled } = use(
    AriaSliderStateContext,
  )!;

  const getFillerDimensions = (): React.CSSProperties => {
    if (values.length === 1 && orientation === "horizontal")
      return { width: `${getThumbPercent(0) * 100}%` };

    if (values.length === 1 && orientation === "vertical")
      return { height: `${getThumbPercent(0) * 100}%` };

    if (orientation === "horizontal")
      return {
        left: `${getThumbPercent(0) * 100}%`,
        width: `${Math.abs(getThumbPercent(0) - getThumbPercent(1)) * 100}%`,
      };

    return {
      bottom: `${getThumbPercent(0) * 100}%`,
      height: `${Math.abs(getThumbPercent(0) - getThumbPercent(1)) * 100}%`,
    };
  };

  return (
    <div
      data-slot="slider-filler"
      data-rac=""
      data-disabled={isDisabled || undefined}
      className={filler({ orientation, className })}
      style={{ ...style, ...getFillerDimensions() }}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface SliderThumbProps
  extends React.ComponentProps<typeof AriaSliderThumb> {}

const SliderThumb = ({ className, ...props }: SliderThumbProps) => {
  return (
    <AriaSliderThumb
      data-slot="slider-thumb"
      className={composeRenderProps(
        className,
        (className, { state: { orientation } }) =>
          thumb({ orientation, className }),
      )}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface SliderOutputProps
  extends React.ComponentProps<typeof AriaSliderOutput> {}

const SliderOutput = ({ children, className, ...props }: SliderOutputProps) => {
  return (
    <AriaSliderOutput
      data-slot="slider-output"
      className={composeRenderProps(className, (className) =>
        output({ className }),
      )}
      {...props}
    >
      {composeRenderProps(
        children,
        (children, { state }) =>
          children ??
          state.values.map((_, i) => state.getThumbValueLabel(i)).join(" - "),
      )}
    </AriaSliderOutput>
  );
};

/* -----------------------------------------------------------------------------------------------*/

export { Slider, SliderControl, SliderFiller, SliderThumb, SliderOutput };

export type {
  SliderProps,
  SliderControlProps,
  SliderFillerProps,
  SliderThumbProps,
  SliderOutputProps,
};
