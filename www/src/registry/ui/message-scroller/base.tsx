"use client"

import type * as React from "react"
import {
  MessageScroller as MessageScrollerPrimitive,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
} from "@shadcn/react/message-scroller"

import { ArrowDownIcon } from "@/registry/icons"
import { useStyles as useButtonStyles } from "@/registry/ui/button/styles"

import { useStyles } from "./styles"

// MARK: messageScrollerStyles

// MARK: Separator

interface MessageScrollerProviderProps extends React.ComponentProps<
  typeof MessageScrollerPrimitive.Provider
> {}

const MessageScrollerProvider = (props: MessageScrollerProviderProps) => {
  return <MessageScrollerPrimitive.Provider {...props} />
}

// MARK: Separator

interface MessageScrollerProps extends React.ComponentProps<
  typeof MessageScrollerPrimitive.Root
> {}

const MessageScroller = ({ className, ...props }: MessageScrollerProps) => {
  const { root } = useStyles()()
  return (
    <MessageScrollerPrimitive.Root
      data-message-scroller=""
      className={root({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface MessageScrollerViewportProps extends React.ComponentProps<
  typeof MessageScrollerPrimitive.Viewport
> {}

const MessageScrollerViewport = ({
  className,
  ...props
}: MessageScrollerViewportProps) => {
  const { viewport } = useStyles()()
  return (
    <MessageScrollerPrimitive.Viewport
      data-message-scroller-viewport=""
      className={viewport({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface MessageScrollerContentProps extends React.ComponentProps<
  typeof MessageScrollerPrimitive.Content
> {}

const MessageScrollerContent = ({
  className,
  ...props
}: MessageScrollerContentProps) => {
  const { content } = useStyles()()
  return (
    <MessageScrollerPrimitive.Content
      data-message-scroller-content=""
      className={content({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface MessageScrollerItemProps extends React.ComponentProps<
  typeof MessageScrollerPrimitive.Item
> {}

const MessageScrollerItem = ({
  className,
  scrollAnchor = false,
  ...props
}: MessageScrollerItemProps) => {
  const { item } = useStyles()()
  return (
    <MessageScrollerPrimitive.Item
      data-message-scroller-item=""
      scrollAnchor={scrollAnchor}
      className={item({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface MessageScrollerButtonProps extends React.ComponentProps<
  typeof MessageScrollerPrimitive.Button
> {}

const MessageScrollerButton = ({
  className,
  children,
  direction = "end",
  ...props
}: MessageScrollerButtonProps) => {
  const { button } = useStyles()()
  const buttonStyles = useButtonStyles()
  return (
    <MessageScrollerPrimitive.Button
      data-message-scroller-button=""
      data-button=""
      data-icon-only=""
      data-direction={direction}
      direction={direction}
      className={buttonStyles({
        variant: "secondary",
        size: "sm",
        isIconOnly: true,
        className: button({ className }),
      })}
      {...props}
    >
      {children ?? (
        <>
          <ArrowDownIcon />
          <span className="sr-only">
            {direction === "end" ? "Scroll to end" : "Scroll to start"}
          </span>
        </>
      )}
    </MessageScrollerPrimitive.Button>
  )
}

// MARK: Separator

export type {
  MessageScrollerButtonProps,
  MessageScrollerContentProps,
  MessageScrollerItemProps,
  MessageScrollerProps,
  MessageScrollerProviderProps,
  MessageScrollerViewportProps,
}
export {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
}
