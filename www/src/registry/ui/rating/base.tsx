'use client'

import { useState } from 'react'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as RadioGroupPrimitive from 'react-aria-components/RadioGroup'

import { useStyles } from './styles'

// MARK: Rating

interface RatingProps extends Omit<
  RadioGroupPrimitive.RadioGroupProps,
  'value' | 'defaultValue' | 'onChange' | 'children' | 'orientation'
> {
  max?: number
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
}

const Rating = ({
  className,
  max = 5,
  value,
  defaultValue,
  onChange,
  ...props
}: RatingProps) => {
  const { root, item } = useStyles()()
  const [hovered, setHovered] = useState<number | null>(null)
  const interactive = !props.isReadOnly && !props.isDisabled
  return (
    <RadioGroupPrimitive.RadioGroup
      data-rating=""
      orientation="horizontal"
      value={value != null ? String(value) : undefined}
      defaultValue={defaultValue != null ? String(defaultValue) : undefined}
      onChange={onChange ? (next) => onChange(Number(next)) : undefined}
      className={composeRenderProps(className, (cn) => root({ className: cn }))}
      {...props}
    >
      {({ state }) => {
        const selected = state.selectedValue ? Number(state.selectedValue) : 0
        const active = hovered ?? selected
        return Array.from({ length: max }, (_, i) => {
          const ratingValue = i + 1
          return (
            <RadioGroupPrimitive.Radio
              key={ratingValue}
              value={String(ratingValue)}
              aria-label={`${ratingValue} ${ratingValue === 1 ? 'star' : 'stars'}`}
              data-active={ratingValue <= active || undefined}
              className={item()}
              onHoverStart={
                interactive ? () => setHovered(ratingValue) : undefined
              }
              onHoverEnd={interactive ? () => setHovered(null) : undefined}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.5l2.92 5.92 6.54.95-4.73 4.61 1.12 6.51L12 17.93l-5.85 3.07 1.12-6.51L2.54 9.87l6.54-.95L12 2.5z" />
              </svg>
            </RadioGroupPrimitive.Radio>
          )
        })
      }}
    </RadioGroupPrimitive.RadioGroup>
  )
}

// MARK: Separator

export type { RatingProps }
export { Rating }
