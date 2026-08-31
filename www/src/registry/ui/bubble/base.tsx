"use client"

import type * as React from "react"

import { useStyles } from "./styles"

// MARK: bubbleStyles

// MARK: Separator

interface BubbleGroupProps extends React.ComponentProps<"div"> {}

const BubbleGroup = ({ className, ...props }: BubbleGroupProps) => {
  const { group } = useStyles()()
  return (
    <div data-bubble-group="" className={group({ className })} {...props} />
  )
}

// MARK: Separator

interface BubbleProps extends React.ComponentProps<"div"> {
  variant?:
    | "primary"
    | "neutral"
    | "muted"
    | "tinted"
    | "outline"
    | "ghost"
    | "danger"
  align?: "start" | "end"
}

const Bubble = ({
  className,
  variant = "primary",
  align = "start",
  ...props
}: BubbleProps) => {
  const { root } = useStyles()({ variant })
  return (
    <div
      data-bubble=""
      data-variant={variant}
      data-align={align}
      className={root({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface BubbleContentProps extends React.ComponentProps<"div"> {}

const BubbleContent = ({ className, ...props }: BubbleContentProps) => {
  const { content } = useStyles()()
  return (
    <div data-bubble-content="" className={content({ className })} {...props} />
  )
}

// MARK: Separator

interface BubbleReactionsProps extends React.ComponentProps<"div"> {
  side?: "top" | "bottom"
  align?: "start" | "end"
}

const BubbleReactions = ({
  className,
  side = "bottom",
  align = "end",
  ...props
}: BubbleReactionsProps) => {
  const { reactions } = useStyles()()
  return (
    <div
      data-bubble-reactions=""
      data-side={side}
      data-align={align}
      className={reactions({ className })}
      {...props}
    />
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
