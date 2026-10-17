"use client"

import * as React from "react"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import * as SliderPrimitives from "react-aria-components/Slider"
import { Provider } from "react-aria-components/slots"
import * as TextPrimitives from "react-aria-components/Text"
import { useSlotId } from "react-aria/private/utils/useId"

import { useStyles } from "./styles"

// MARK: sliderStyles

// MARK: Separator

interface SliderProps extends React.ComponentProps<
  typeof SliderPrimitives.Slider
> {}

const Slider = ({ className, children, ...props }: SliderProps) => {
  const { root } = useStyles()()
  const descriptionId = useSlotId()
  return (
    <SliderPrimitives.Slider
      data-slider=""
      data-field=""
      className={composeRenderProps(className, (cn, { orientation }) =>
        root({ className: cn, orientation }),
      )}
      aria-describedby={descriptionId}
      {...props}
    >
      {composeRenderProps(children, (children) => (
        <Provider
          values={[
            [
              TextPrimitives.TextContext,
              { slot: "description", id: descriptionId },
            ],
          ]}
        >
          {children}
        </Provider>
      ))}
    </SliderPrimitives.Slider>
  )
}

// MARK: Separator

interface SliderControlProps extends React.ComponentProps<
  typeof SliderPrimitives.SliderTrack
> {}

const SliderControl = ({
  children,
  className,
  ...props
}: SliderControlProps) => {
  const { control } = useStyles()()
  return (
    <SliderPrimitives.SliderTrack
      data-slider-control=""
      className={composeRenderProps(className, (cn, { orientation }) =>
        control({ orientation, className: cn }),
      )}
      {...props}
    >
      {composeRenderProps(
        children,
        (children, { state }) =>
          children ?? (
            <>
              <SliderTrack>
                <SliderFill />
              </SliderTrack>
              {state.values.map((_, i) => (
                <SliderThumb key={i} index={i} />
              ))}
            </>
          ),
      )}
    </SliderPrimitives.SliderTrack>
  )
}

// MARK: Separator

interface SliderTrackProps extends React.ComponentProps<"div"> {}

const SliderTrack = ({ className, ...props }: SliderTrackProps) => {
  const { track } = useStyles()()
  const state = React.useContext(SliderPrimitives.SliderStateContext)

  return (
    <div
      {...props}
      data-rac=""
      data-slider-track=""
      data-orientation={state?.orientation}
      data-disabled={state?.isDisabled || undefined}
      className={track({ orientation: state?.orientation, className })}
    />
  )
}

// MARK: Separator

interface SliderFillProps extends React.ComponentProps<
  typeof SliderPrimitives.SliderFill
> {}

const SliderFill = ({ className, ...props }: SliderFillProps) => {
  const { fill } = useStyles()()

  return (
    <SliderPrimitives.SliderFill
      data-slider-fill=""
      className={composeRenderProps(className, (className, { orientation }) =>
        fill({ orientation, className }),
      )}
      {...props}
    />
  )
}

// MARK: Separator

interface SliderThumbProps extends React.ComponentProps<
  typeof SliderPrimitives.SliderThumb
> {}

const SliderThumb = ({ className, ...props }: SliderThumbProps) => {
  const { thumb } = useStyles()()

  return (
    <SliderPrimitives.SliderThumb
      data-slider-thumb=""
      className={composeRenderProps(
        className,
        (className, { state: { orientation } }) =>
          thumb({ orientation, className }),
      )}
      {...props}
    />
  )
}

// MARK: Separator

interface SliderOutputProps extends React.ComponentProps<
  typeof SliderPrimitives.SliderOutput
> {}

const SliderOutput = ({ children, className, ...props }: SliderOutputProps) => {
  const { output } = useStyles()()
  return (
    <SliderPrimitives.SliderOutput
      data-slider-output=""
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
    </SliderPrimitives.SliderOutput>
  )
}

// MARK: Separator

export type {
  SliderControlProps,
  SliderFillProps,
  SliderOutputProps,
  SliderProps,
  SliderThumbProps,
  SliderTrackProps,
}
export {
  Slider,
  SliderControl,
  SliderFill,
  SliderOutput,
  SliderThumb,
  SliderTrack,
}
