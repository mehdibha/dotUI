'use client'

import {
  type ComponentProps,
  type CSSProperties,
  createContext,
  use,
} from 'react'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as ProgressBarPrimitive from 'react-aria-components/ProgressBar'
import { tv } from 'tailwind-variants'

import { fieldVariants } from '@/ui/field'

const progressBarVariants = tv({
  slots: {
    track:
      'relative flex h-[var(--progress-track-size,calc(var(--spacing)*1))] w-full items-center overflow-x-hidden rounded-[var(--progress-track-radius,9999px)] bg-muted',
    fill: 'data-indeterminate:animate-progress-indeterminate h-full w-full origin-left bg-[var(--progress-fill-color,var(--color-primary))] transition-all',
    output: 'ml-auto text-sm text-fg-muted tabular-nums',
  },
})

const ProgressBarContext =
  createContext<ProgressBarPrimitive.ProgressBarRenderProps | null>(null)
const useProgressBarContext = (componentName: string) => {
  const context = use(ProgressBarContext)
  if (!context) {
    throw new Error(`${componentName} must be used within a ProgressBar`)
  }
  return context
}

interface ProgressBarProps extends ComponentProps<
  typeof ProgressBarPrimitive.ProgressBar
> {}
const ProgressBar = ({ children, className, ...props }: ProgressBarProps) => {
  const fieldStyles = fieldVariants
  return (
    <ProgressBarPrimitive.ProgressBar
      className={composeRenderProps(className, (className) =>
        fieldStyles().field({ className }),
      )}
      {...props}
    >
      {composeRenderProps(children, (children, state) => (
        <ProgressBarContext value={state}>
          {children ?? <ProgressBarTrack />}
        </ProgressBarContext>
      ))}
    </ProgressBarPrimitive.ProgressBar>
  )
}

interface ProgressBarTrackProps extends ComponentProps<'div'> {}
type ProgressBarControlProps = ProgressBarTrackProps

const ProgressBarTrack = ({
  children,
  className,
  ...props
}: ProgressBarTrackProps) => {
  const { track } = progressBarVariants()
  return (
    <div className={track({ className })} {...props}>
      {children ?? <ProgressBarFill />}
    </div>
  )
}

interface ProgressBarFillProps extends ComponentProps<'div'> {}
const ProgressBarFill = ({
  className,
  style,
  ...props
}: ProgressBarFillProps) => {
  const { fill } = progressBarVariants()
  const { isIndeterminate, percentage } =
    useProgressBarContext('ProgressBarControl')

  return (
    <div
      data-rac=""
      data-indeterminate={isIndeterminate || undefined}
      className={fill({ className })}
      style={
        {
          transform:
            typeof percentage === 'number'
              ? `scaleX(${percentage / 100})`
              : undefined,
          ...style,
        } as CSSProperties
      }
      {...props}
    />
  )
}

interface ProgressBarOutputProps extends ComponentProps<'span'> {}
const ProgressBarOutput = ({ className, ...props }: ProgressBarOutputProps) => {
  const { output } = progressBarVariants()
  const { valueText } = useProgressBarContext('ProgressBarOutput')

  return (
    <span className={output({ className })} {...props}>
      {valueText}
    </span>
  )
}

const ProgressBarControl = ProgressBarTrack

export type {
  ProgressBarControlProps,
  ProgressBarFillProps,
  ProgressBarOutputProps,
  ProgressBarProps,
}
export {
  ProgressBar,
  ProgressBarControl,
  ProgressBarFill,
  ProgressBarOutput,
  ProgressBarTrack,
  progressBarVariants,
}
