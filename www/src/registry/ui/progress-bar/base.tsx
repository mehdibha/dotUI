"use client"

import * as React from "react"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import * as ProgressBarPrimitives from "react-aria-components/ProgressBar"

import { useStyles } from "./styles"

const ProgressBarContext =
  React.createContext<ProgressBarPrimitives.ProgressBarRenderProps | null>(null)
const useProgressBarContext = (componentName: string) => {
  const context = React.use(ProgressBarContext)
  if (!context) {
    throw new Error(`${componentName} must be used within a ProgressBar`)
  }
  return context
}

// MARK: Separator

interface ProgressBarProps extends React.ComponentProps<
  typeof ProgressBarPrimitives.ProgressBar
> {}
const ProgressBar = ({ children, className, ...props }: ProgressBarProps) => {
  const { root } = useStyles()()
  return (
    <ProgressBarPrimitives.ProgressBar
      data-field=""
      className={composeRenderProps(className, (className) =>
        root({ className }),
      )}
      {...props}
    >
      {composeRenderProps(children, (children, state) => (
        <ProgressBarContext value={state}>
          {children ?? <ProgressBarTrack />}
        </ProgressBarContext>
      ))}
    </ProgressBarPrimitives.ProgressBar>
  )
}

// MARK: Separator

interface ProgressBarTrackProps extends React.ComponentProps<"div"> {}
type ProgressBarControlProps = ProgressBarTrackProps

const ProgressBarTrack = ({
  children,
  className,
  ...props
}: ProgressBarTrackProps) => {
  const { track } = useStyles()()
  return (
    <div className={track({ className })} {...props}>
      {children ?? <ProgressBarFill />}
    </div>
  )
}

// MARK: Separator

interface ProgressBarFillProps extends React.ComponentProps<"div"> {}
const ProgressBarFill = ({
  className,
  style,
  ...props
}: ProgressBarFillProps) => {
  const { fill } = useStyles()()
  const { isIndeterminate, percentage } =
    useProgressBarContext("ProgressBarControl")

  return (
    <div
      data-rac=""
      data-indeterminate={isIndeterminate || undefined}
      className={fill({ className })}
      style={{
        width: typeof percentage === "number" ? `${percentage}%` : undefined,
        ...style,
      }}
      {...props}
    />
  )
}

// MARK: Separator

interface ProgressBarOutputProps extends React.ComponentProps<"span"> {}
const ProgressBarOutput = ({ className, ...props }: ProgressBarOutputProps) => {
  const { output } = useStyles()()
  const { valueText } = useProgressBarContext("ProgressBarOutput")

  return (
    <span className={output({ className })} {...props}>
      {valueText}
    </span>
  )
}

// MARK: Separator

const ProgressBarControl = ProgressBarTrack

// MARK: Separator

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
}
