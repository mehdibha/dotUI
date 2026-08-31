"use client"

import type * as React from "react"

import { useStyles } from "./styles"

// MARK: markerStyles

// MARK: Separator

interface MarkerProps extends React.ComponentProps<"div"> {
  variant?: "default" | "separator" | "border"
}

const Marker = ({ className, variant = "default", ...props }: MarkerProps) => {
  const { root } = useStyles()({ variant })
  return (
    <div
      data-marker=""
      data-variant={variant}
      className={root({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface MarkerIconProps extends React.ComponentProps<"span"> {}

const MarkerIcon = ({ className, ...props }: MarkerIconProps) => {
  const { icon } = useStyles()()
  return (
    <span
      data-marker-icon=""
      aria-hidden="true"
      className={icon({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface MarkerContentProps extends React.ComponentProps<"span"> {}

const MarkerContent = ({ className, ...props }: MarkerContentProps) => {
  const { content } = useStyles()()
  return (
    <span
      data-marker-content=""
      className={content({ className })}
      {...props}
    />
  )
}

// MARK: Separator

export type { MarkerContentProps, MarkerIconProps, MarkerProps }
export { Marker, MarkerContent, MarkerIcon }
