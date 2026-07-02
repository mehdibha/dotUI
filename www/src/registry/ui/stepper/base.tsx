'use client'

import { createContext, useContext } from 'react'
import type { ComponentProps } from 'react'
import { CheckIcon } from 'lucide-react'

import { useStyles } from './styles'

// MARK: Context

type StepStatus = 'completed' | 'active' | 'inactive'

const StepperContext = createContext<{ activeStep: number }>({ activeStep: 0 })
const StepperItemContext = createContext<{ step: number; status: StepStatus }>({
  step: 0,
  status: 'inactive',
})

// MARK: Stepper

interface StepperProps extends ComponentProps<'div'> {
  activeStep?: number
}

const Stepper = ({ activeStep = 0, className, ...props }: StepperProps) => {
  const { root } = useStyles()()
  return (
    <StepperContext.Provider value={{ activeStep }}>
      <div data-stepper="" className={root({ className })} {...props} />
    </StepperContext.Provider>
  )
}

// MARK: StepperItem

interface StepperItemProps extends ComponentProps<'div'> {
  step: number
}

const StepperItem = ({ step, className, ...props }: StepperItemProps) => {
  const { activeStep } = useContext(StepperContext)
  const { item } = useStyles()()
  const status: StepStatus =
    step < activeStep
      ? 'completed'
      : step === activeStep
        ? 'active'
        : 'inactive'
  return (
    <StepperItemContext.Provider value={{ step, status }}>
      <div
        data-stepper-item=""
        data-status={status}
        className={item({ className })}
        {...props}
      />
    </StepperItemContext.Provider>
  )
}

// MARK: StepperIndicator

const StepperIndicator = ({
  className,
  children,
  ...props
}: ComponentProps<'div'>) => {
  const { indicator } = useStyles()()
  const { step, status } = useContext(StepperItemContext)
  return (
    <div
      data-stepper-indicator=""
      data-status={status}
      className={indicator({ className })}
      {...props}
    >
      {children ??
        (status === 'completed' ? <CheckIcon /> : <span>{step + 1}</span>)}
    </div>
  )
}

// MARK: StepperSeparator

const StepperSeparator = ({ className, ...props }: ComponentProps<'div'>) => {
  const { separator } = useStyles()()
  const { status } = useContext(StepperItemContext)
  return (
    <div
      data-stepper-separator=""
      data-status={status}
      aria-hidden="true"
      className={separator({ className })}
      {...props}
    />
  )
}

// MARK: StepperTitle

const StepperTitle = ({ className, ...props }: ComponentProps<'div'>) => {
  const { title } = useStyles()()
  const { status } = useContext(StepperItemContext)
  return (
    <div
      data-stepper-title=""
      data-status={status}
      className={title({ className })}
      {...props}
    />
  )
}

// MARK: StepperDescription

const StepperDescription = ({ className, ...props }: ComponentProps<'div'>) => {
  const { description } = useStyles()()
  return (
    <div
      data-stepper-description=""
      className={description({ className })}
      {...props}
    />
  )
}

// MARK: Separator

export type { StepperProps, StepperItemProps }
export {
  Stepper,
  StepperItem,
  StepperIndicator,
  StepperSeparator,
  StepperTitle,
  StepperDescription,
}
