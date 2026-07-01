'use client'

import * as React from 'react'

import { cn } from '@/registry/lib/utils'

import { useStyles } from './styles'

// MARK: bubbleStyles

type BubbleVariant =
  | 'default'
  | 'secondary'
  | 'muted'
  | 'tinted'
  | 'outline'
  | 'ghost'
  | 'destructive'

// Minimal slot: merges the wrapper's props onto a single child element so
// `asChild` can render the body as a link or button instead of a div.
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

interface BubbleProps extends React.ComponentProps<'div'> {
  variant?: BubbleVariant
  align?: 'start' | 'end'
}

const Bubble = ({ className, variant, align, ...props }: BubbleProps) => {
  const { root } = useStyles()()
  return (
    <div
      data-bubble=""
      data-variant={variant}
      data-align={align}
      className={root({ variant, align, className })}
      {...props}
    />
  )
}

// MARK: Separator

interface BubbleContentProps extends React.ComponentProps<'div'> {
  asChild?: boolean
}

const BubbleContent = ({
  className,
  asChild,
  ...props
}: BubbleContentProps) => {
  const { content } = useStyles()()
  const Comp: React.ElementType = asChild ? Slot : 'div'
  return (
    <Comp
      data-bubble-content=""
      className={content({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface BubbleReactionsProps extends React.ComponentProps<'div'> {
  side?: 'top' | 'bottom'
}

const BubbleReactions = ({
  className,
  side = 'bottom',
  ...props
}: BubbleReactionsProps) => {
  const { reactions } = useStyles()()
  return (
    <div
      data-bubble-reactions=""
      data-side={side}
      className={reactions({
        className: cn(side === 'top' && '-order-1 mt-0 mb-1', className),
      })}
      {...props}
    />
  )
}

// MARK: Separator

interface BubbleGroupProps extends React.ComponentProps<'div'> {}

const BubbleGroup = ({ className, ...props }: BubbleGroupProps) => {
  const { group } = useStyles()()
  return (
    <div data-bubble-group="" className={group({ className })} {...props} />
  )
}

// MARK: Separator

export type {
  BubbleContentProps,
  BubbleGroupProps,
  BubbleProps,
  BubbleReactionsProps,
}
export { Bubble, BubbleContent, BubbleGroup, BubbleReactions }
