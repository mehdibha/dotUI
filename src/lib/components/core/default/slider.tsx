"use client";

import * as React from "react";
import { useSlotId } from "@react-aria/utils";
import {
  Slider as AriaSlider,
  SliderOutput as AriaSliderOutput,
  SliderThumb as AriaSliderThumb,
  SliderTrack as AriaSliderTrack,
  type SliderThumbProps as AriaSliderThumbProps,
  type SliderOutputProps as AriaSliderOutputProps,
  type SliderTrackProps as AriaSliderTrackProps,
  type SliderProps as AriaSliderProps,
  SliderStateContext,
  SliderContext,
  TextContext,
} from "react-aria-components";
import { Provider } from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "@/lib/utils/classes";
import { focusRing } from "@/lib/utils/styles";
import { Description, Label, type FieldProps } from "./field";

//TODO: Change colors

const sliderStyles = tv({
  slots: {
    root: "flex flex-col gap-2",
    trackWrapper: "relative",
    track: [
      "rounded-full bg-bg-muted",
      "grow orientation-vertical:h-full orientation-vertical:w-2 orientation-horizontal:w-full orientation-horizontal:h-2",
    ],
    filler: [
      "rounded-full bg-border-focus",
      "pointer-events-none absolute top-0 orientation-vertical:w-full orientation-vertical:bottom-0 orientation-horizontal:h-full",
    ],
    thumb: [
      focusRing(),
      "rounded-full bg-white shadow-md dragging:size-6 transition-[width,height]",
      "absolute left-[50%] top-[50%] block !-translate-x-1/2 !-translate-y-1/2",
      "disabled:pointer-events-none disabled:opacity-50",
    ],
    valueLabel: "text-fg-muted text-sm",
  },
  variants: {
    size: {
      sm: {
        thumb: "size-3",
        track: "orientation-vertical:w-1 orientation-horizontal:h-1",
      },
      md: {
        thumb: "size-4",
        track: "orientation-vertical:w-2 orientation-horizontal:h-2",
      },
      lg: {
        thumb: "size-5",
        track: "orientation-vertical:w-4 orientation-horizontal:h-5",
      },
    },
    hideThumb: {
      true: {
        track: "overflow-hidden",
        filler: "rounded-none",
      },
    },
  },
  defaultVariants: {
    size: "md",
    hideThumb: false,
  },
});

interface SliderProps extends SliderRootProps {
  label?: FieldProps["label"];
  description?: FieldProps["description"];
  showValueLabel?: boolean;
  getValueLabel?: (value: number[]) => string;
}
const Slider = React.forwardRef<React.ElementRef<typeof AriaSlider>, SliderProps>(
  ({ label, description, showValueLabel = true, getValueLabel, ...props }, ref) => (
    <SliderRoot ref={ref} {...props}>
      {({ state }) => (
        <>
          <div
            className={cn("flex items-center justify-between", {
              "justify-end": !label,
            })}
          >
            {label && <Label>{label}</Label>}
            {showValueLabel && (
              <SliderValueLabel>
                {({ state }) =>
                  getValueLabel ? <>{getValueLabel(state.values)}</> : undefined
                }
              </SliderValueLabel>
            )}
          </div>
          <SliderWrapper>
            <SliderTrack />
            <SliderTrackFiller />
            {state.values.map((_, i) => (
              <SliderThumb
                key={i}
                index={i}
                // aria-label={thumbLabels?.[i]}
              />
            ))}
          </SliderWrapper>
          {description && <Description>{description}</Description>}
        </>
      )}
    </SliderRoot>
  )
);
Slider.displayName = "Slider";

interface SliderRootProps
  extends Omit<AriaSliderProps, "className">,
    VariantProps<typeof sliderStyles> {
  className?: string;
}
const SliderRoot = React.forwardRef<React.ElementRef<typeof AriaSlider>, SliderRootProps>(
  ({ className, size, hideThumb, ...props }, ref) => {
    const { root } = sliderStyles();
    const descriptionId = useSlotId();
    return (
      <Provider
        values={[
          [SliderInternalContext, { size, hideThumb }],
          [SliderContext, { "aria-describedby": descriptionId }],
          [TextContext, { slots: { description: { id: descriptionId } } }],
        ]}
      >
        <AriaSlider ref={ref} className={root({ className })} {...props} />
      </Provider>
    );
  }
);
SliderRoot.displayName = "SliderRoot";

type SliderWrapperProps = React.HTMLAttributes<HTMLDivElement>;
const SliderWrapper = React.forwardRef<HTMLDivElement, SliderWrapperProps>(
  ({ className, ...props }, ref) => {
    const { trackWrapper } = sliderStyles();
    return <div ref={ref} className={trackWrapper
      
      
      
      ({ className })} {...props} />;
  }
);
SliderWrapper.displayName = "SliderWrapper";

interface SliderTrackProps extends Omit<AriaSliderTrackProps, "className"> {
  className?: string;
}
const SliderTrack = React.forwardRef<
  React.ElementRef<typeof AriaSliderTrack>,
  SliderTrackProps
>(({ className, ...props }, ref) => {
  const { size, hideThumb } = useSliderInternalContext();
  const { track } = sliderStyles({ size, hideThumb });
  return <AriaSliderTrack ref={ref} className={track({ className })} {...props} />;
});
SliderTrack.displayName = "SliderTrack";

type SliderTrackFillerProps = React.HTMLAttributes<HTMLDivElement>;
const SliderTrackFiller = React.forwardRef<HTMLDivElement, SliderTrackFillerProps>(
  ({ className, ...props }, ref) => {
    const { size, hideThumb } = useSliderInternalContext();
    const { orientation, getThumbPercent } = React.useContext(SliderStateContext);
    const { filler } = sliderStyles({ size, hideThumb });
    return (
      <div
        ref={ref}
        data-rac=""
        data-orientation={orientation}
        className={filler({ className })}
        {...props}
        style={{
          width:
            orientation === "horizontal" ? `${getThumbPercent(0) * 100}%` : undefined,
          height: orientation === "vertical" ? `${getThumbPercent(0) * 100}%` : undefined,
          ...props.style,
        }}
      />
    );
  }
);
SliderTrackFiller.displayName = "SliderTrackFiller";

interface SliderThumbProps extends Omit<AriaSliderThumbProps, "className"> {
  className?: string;
}
const SliderThumb = React.forwardRef<
  React.ElementRef<typeof AriaSliderThumb>,
  SliderThumbProps
>(({ className, ...props }, ref) => {
  const { size, hideThumb } = useSliderInternalContext();
  const { thumb } = sliderStyles({ size, hideThumb });
  return <AriaSliderThumb ref={ref} className={thumb({ className })} {...props} />;
});
SliderThumb.displayName = "SliderThumb";

interface SliderValueLabelProps extends Omit<AriaSliderOutputProps, "className"> {
  className?: string;
}
const SliderValueLabel = React.forwardRef<
  React.ElementRef<typeof AriaSliderOutput>,
  SliderValueLabelProps
>(({ className, ...props }, ref) => {
  const { valueLabel } = sliderStyles();
  return <AriaSliderOutput ref={ref} className={valueLabel({ className })} {...props} />;
});
SliderValueLabel.displayName = "SliderValueLabel";

const SliderInternalContext = React.createContext<VariantProps<typeof sliderStyles>>({});
const useSliderInternalContext = () => {
  return React.useContext(SliderInternalContext);
};

export { Slider };
