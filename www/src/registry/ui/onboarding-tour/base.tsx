'use client'

import 'driver.js/dist/driver.css'

import * as React from 'react'
import { driver } from 'driver.js'
import type { Config, Driver, DriveStep } from 'driver.js'

import { Button } from '@/registry/ui/button'

import { useStyles } from './styles'

// MARK: useOnboardingTour

type OnboardingTourOptions = Omit<Config, 'steps'>

interface OnboardingTourHandle {
  /** Build the driver instance (if needed) and start the tour from the first step. */
  start: () => void
  /** Move to the next step. No-op when the tour is not running. */
  next: () => void
  /** Move to the previous step. No-op when the tour is not running. */
  previous: () => void
  /** Stop the tour and clear the highlight overlay. */
  stop: () => void
  /** Whether the tour is currently running. */
  isActive: () => boolean
}

function useOnboardingTour(
  steps: DriveStep[],
  options?: OnboardingTourOptions,
): OnboardingTourHandle {
  const { popover } = useStyles()()
  const driverRef = React.useRef<Driver | null>(null)

  // Keep the latest steps/options without rebuilding the driver on every render.
  const stepsRef = React.useRef(steps)
  stepsRef.current = steps
  const optionsRef = React.useRef(options)
  optionsRef.current = options

  const popoverClass = popover()

  const getDriver = React.useCallback(() => {
    if (!driverRef.current) {
      driverRef.current = driver({
        showProgress: true,
        popoverClass,
        ...optionsRef.current,
        steps: stepsRef.current,
      })
    }
    return driverRef.current
  }, [popoverClass])

  // Tear down the overlay if the component unmounts mid-tour.
  React.useEffect(() => {
    return () => {
      driverRef.current?.destroy()
      driverRef.current = null
    }
  }, [])

  return React.useMemo<OnboardingTourHandle>(
    () => ({
      start: () => {
        getDriver().drive()
      },
      next: () => {
        driverRef.current?.moveNext()
      },
      previous: () => {
        driverRef.current?.movePrevious()
      },
      stop: () => {
        driverRef.current?.destroy()
      },
      isActive: () => driverRef.current?.isActive() ?? false,
    }),
    [getDriver],
  )
}

// MARK: OnboardingTour

interface OnboardingTourProps extends Omit<
  React.ComponentProps<typeof Button>,
  'onPress' | 'children'
> {
  /** The ordered steps that make up the tour. */
  steps: DriveStep[]
  /** Driver.js configuration, minus `steps`. */
  options?: OnboardingTourOptions
  /**
   * Trigger content. A function receives the tour handle so you can render a
   * custom control; a node renders inside the default `Button` trigger.
   */
  children?: React.ReactNode | ((tour: OnboardingTourHandle) => React.ReactNode)
}

function OnboardingTour({
  steps,
  options,
  children = 'Start tour',
  ...props
}: OnboardingTourProps) {
  const tour = useOnboardingTour(steps, options)

  if (typeof children === 'function') {
    return <>{children(tour)}</>
  }

  return (
    <Button data-onboarding-tour="" onPress={() => tour.start()} {...props}>
      {children}
    </Button>
  )
}

// MARK: Separator

export type { OnboardingTourHandle, OnboardingTourOptions, OnboardingTourProps }
export { OnboardingTour, useOnboardingTour }
