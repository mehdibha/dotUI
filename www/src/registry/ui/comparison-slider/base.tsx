'use client'

import { useContext } from 'react'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as SliderPrimitive from 'react-aria-components/Slider'

import { useStyles } from './styles'

// MARK: ComparisonSlider

interface ComparisonSliderProps extends Omit<
  React.ComponentProps<typeof SliderPrimitive.Slider>,
  'children'
> {
  children: React.ReactNode
  reveal: React.ReactNode
  handle?: React.ReactNode
}

const ComparisonSlider = ({
  className,
  children,
  reveal,
  handle,
  ...props
}: ComparisonSliderProps) => {
  const { root } = useStyles()()
  return (
    <SliderPrimitive.Slider
      data-comparison-slider=""
      minValue={0}
      maxValue={100}
      defaultValue={50}
      className={composeRenderProps(className, (cn) => root({ className: cn }))}
      {...props}
    >
      <ComparisonSliderLayers reveal={reveal} handle={handle}>
        {children}
      </ComparisonSliderLayers>
    </SliderPrimitive.Slider>
  )
}

// MARK: Separator

interface ComparisonSliderLayersProps {
  children: React.ReactNode
  reveal: React.ReactNode
  handle?: React.ReactNode
}

const ComparisonSliderLayers = ({
  children,
  reveal,
  handle,
}: ComparisonSliderLayersProps) => {
  const { after, before, control, divider, thumb } = useStyles()()
  const state = useContext(SliderPrimitive.SliderStateContext)
  const percent = (state?.getThumbPercent(0) ?? 0.5) * 100
  return (
    <>
      <div data-comparison-slider-after="" className={after()}>
        {children}
      </div>
      <div
        data-comparison-slider-before=""
        className={before()}
        style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}
      >
        {reveal}
      </div>
      <SliderPrimitive.SliderTrack
        data-comparison-slider-control=""
        className={control()}
      >
        <div
          data-comparison-slider-divider=""
          aria-hidden="true"
          className={divider()}
          style={{ insetInlineStart: `${percent}%` }}
        />
        <SliderPrimitive.SliderThumb
          data-comparison-slider-thumb=""
          className={thumb()}
        >
          {handle ?? (
            <svg
              viewBox="0 0 24 24"
              className="size-1/2"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 7-5 5 5 5" />
              <path d="m15 7 5 5-5 5" />
            </svg>
          )}
        </SliderPrimitive.SliderThumb>
      </SliderPrimitive.SliderTrack>
    </>
  )
}

// MARK: Separator

export type { ComparisonSliderProps }
export { ComparisonSlider }
