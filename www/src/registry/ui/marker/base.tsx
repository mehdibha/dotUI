'use client'

import * as React from 'react'

import { cn } from '@/registry/lib/utils'

import { useStyles } from './styles'

// MARK: markerStyles

// Minimal slot: merges props onto a single child so `asChild` can render an
// interactive marker (a link or button) instead of a div.
function Slot({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) {
  if (!React.isValidElement(children)) return null
  const child = children as React.ReactElement<
    React.HTMLAttributes<HTMLElement>
  >
  return React.cloneElement(child, {
    ...props,
    ...child.props,
    className: cn(className, child.props.className),
  })
}

// MARK: Separator

interface MarkerProps extends React.ComponentProps<'div'> {
  variant?: 'default' | 'border' | 'separator'
  asChild?: boolean
}

const Marker = ({ className, variant, asChild, ...props }: MarkerProps) => {
  const { root } = useStyles()()
  const Comp: React.ElementType = asChild ? Slot : 'div'
  return (
    <Comp
      data-marker=""
      data-variant={variant}
      className={root({ variant, className })}
      {...props}
    />
  )
}

// MARK: Separator

interface MarkerIconProps extends React.ComponentProps<'span'> {}

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

interface MarkerContentProps extends React.ComponentProps<'span'> {
  shimmer?: boolean
}

const MarkerContent = ({
  className,
  shimmer: withShimmer,
  ...props
}: MarkerContentProps) => {
  const { content, shimmer } = useStyles()()
  return (
    <span
      data-marker-content=""
      className={withShimmer ? shimmer({ className }) : content({ className })}
      {...props}
    />
  )
}

// MARK: Separator

export type { MarkerContentProps, MarkerIconProps, MarkerProps }
export { Marker, MarkerContent, MarkerIcon }
