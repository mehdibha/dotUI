'use client'

import { useContext } from 'react'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as SliderPrimitive from 'react-aria-components/Slider'
import { Provider } from 'react-aria-components/slots'
import * as TextPrimitives from 'react-aria-components/Text'
import { useSlotId } from 'react-aria/private/utils/useId'
import { tv } from 'tailwind-variants'

import { fieldVariants } from '@/ui/field'

const sliderVariants = tv({
  slots: {
    root: fieldVariants().field(),
    control:
      'relative flex grow cursor-(--slider-cursor) touch-none items-center select-none disabled:cursor-disabled',
    track:
      'pointer-events-none relative grow overflow-hidden rounded-(--slider-track-radius) bg-neutral disabled:bg-disabled',
    fill: 'pointer-events-none bg-(--slider-fill-color) disabled:bg-disabled',
    thumb: [
      'top-1/2 left-1/2 grid cursor-(--slider-cursor) place-items-center rounded-(--slider-thumb-radius) shadow-(--slider-thumb-shadow) focus-reset transition-shadow focus-visible:focus-ring disabled:cursor-disabled dragging:cursor-(--slider-dragging-cursor)',
      'size-(--slider-thumb-size) border-0 bg-fg',
    ],
    output: ['text-fg-muted disabled:text-fg-disabled', 'text-sm'],
  },
  variants: {
    orientation: {
      horizontal: {
        control: '-my-2 w-full py-2',
        track: 'h-(--slider-size) w-full',
      },
      vertical: {
        root: 'items-center',
        control: '-mx-2 h-48 flex-col px-2',
        track: 'h-full w-(--slider-size)',
      },
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
})

interface SliderProps extends React.ComponentProps<
  typeof SliderPrimitive.Slider
> {}

const Slider = ({ className, children, ...props }: SliderProps) => {
  const { root } = sliderVariants()
  const descriptionId = useSlotId()
  return (
    <SliderPrimitive.Slider
      data-slider=""
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
              { slot: 'description', id: descriptionId },
            ],
          ]}
        >
          {children}
        </Provider>
      ))}
    </SliderPrimitive.Slider>
  )
}

interface SliderControlProps extends React.ComponentProps<
  typeof SliderPrimitive.SliderTrack
> {}

const SliderControl = ({
  children,
  className,
  ...props
}: SliderControlProps) => {
  const { control } = sliderVariants()
  return (
    <SliderPrimitive.SliderTrack
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
    </SliderPrimitive.SliderTrack>
  )
}

interface SliderTrackProps extends React.ComponentProps<'div'> {}

const SliderTrack = ({ className, ...props }: SliderTrackProps) => {
  const { track } = sliderVariants()
  const state = useContext(SliderPrimitive.SliderStateContext)

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

interface SliderFillProps extends React.ComponentProps<
  typeof SliderPrimitive.SliderFill
> {}

const SliderFill = ({ className, ...props }: SliderFillProps) => {
  const { fill } = sliderVariants()

  return (
    <SliderPrimitive.SliderFill
      data-slider-fill=""
      className={composeRenderProps(className, (className, { orientation }) =>
        fill({ orientation, className }),
      )}
      {...props}
    />
  )
}

interface SliderThumbProps extends React.ComponentProps<
  typeof SliderPrimitive.SliderThumb
> {}

const SliderThumb = ({ className, ...props }: SliderThumbProps) => {
  const { thumb } = sliderVariants()

  return (
    <SliderPrimitive.SliderThumb
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

interface SliderOutputProps extends React.ComponentProps<
  typeof SliderPrimitive.SliderOutput
> {}

const SliderOutput = ({ children, className, ...props }: SliderOutputProps) => {
  const { output } = sliderVariants()
  return (
    <SliderPrimitive.SliderOutput
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
          state.values.map((_, i) => state.getThumbValueLabel(i)).join(' - '),
      )}
    </SliderPrimitive.SliderOutput>
  )
}

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
  sliderVariants,
  SliderTrack,
}
