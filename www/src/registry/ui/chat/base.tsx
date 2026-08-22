"use client"

import type * as React from "react"
import { composeRenderProps } from "react-aria-components/composeRenderProps"

import { Avatar, AvatarFallback, AvatarImage } from "@/registry/ui/avatar"
import { Button } from "@/registry/ui/button"
import { TextArea } from "@/registry/ui/input"

import { useStyles } from "./styles"

// MARK: chatStyles

// MARK: Conversation

interface ConversationProps extends React.ComponentProps<"div"> {}

const Conversation = ({ className, ...props }: ConversationProps) => {
  const { conversation } = useStyles()()
  return (
    <div
      data-conversation=""
      role="log"
      className={conversation({ className })}
      {...props}
    />
  )
}

// MARK: Message

interface MessageProps extends Omit<React.ComponentProps<"div">, "role"> {
  role?: "user" | "assistant"
}

const Message = ({ className, role = "assistant", ...props }: MessageProps) => {
  const { message } = useStyles()()
  return (
    <div
      data-message=""
      data-role={role}
      className={message({ className })}
      {...props}
    />
  )
}

// MARK: MessageContent

interface MessageContentProps extends React.ComponentProps<"div"> {}

const MessageContent = ({ className, ...props }: MessageContentProps) => {
  const { messageContent } = useStyles()()
  return (
    <div
      data-message-content=""
      className={messageContent({ className })}
      {...props}
    />
  )
}

// MARK: MessageAvatar

interface MessageAvatarProps extends React.ComponentProps<typeof Avatar> {
  src?: string
  name?: string
}

const MessageAvatar = ({
  className,
  children,
  src,
  name,
  ...props
}: MessageAvatarProps) => {
  const { messageAvatar } = useStyles()()
  return (
    <Avatar
      data-message-avatar=""
      size="sm"
      className={messageAvatar({ className })}
      {...props}
    >
      {children ?? (
        <>
          <AvatarImage src={src} alt={name} />
          <AvatarFallback>{name?.slice(0, 2).toUpperCase()}</AvatarFallback>
        </>
      )}
    </Avatar>
  )
}

// MARK: PromptInput

interface PromptInputProps extends React.ComponentProps<"form"> {}

const PromptInput = ({ className, ...props }: PromptInputProps) => {
  const { promptInput } = useStyles()()
  return (
    <form
      data-prompt-input=""
      className={promptInput({ className })}
      {...props}
    />
  )
}

// MARK: PromptInputTextarea

interface PromptInputTextareaProps extends React.ComponentProps<
  typeof TextArea
> {}

const PromptInputTextarea = ({
  className,
  onKeyDown,
  ...props
}: PromptInputTextareaProps) => {
  const { promptInputTextarea } = useStyles()()
  return (
    <TextArea
      data-prompt-input-textarea=""
      onKeyDown={(e) => {
        onKeyDown?.(e)
        if (
          e.defaultPrevented ||
          e.key !== "Enter" ||
          e.shiftKey ||
          e.nativeEvent.isComposing
        )
          return
        e.preventDefault()
        e.currentTarget.form?.requestSubmit()
      }}
      className={composeRenderProps(className, (className) =>
        promptInputTextarea({ className }),
      )}
      {...props}
    />
  )
}

// MARK: PromptInputToolbar

interface PromptInputToolbarProps extends React.ComponentProps<"div"> {}

const PromptInputToolbar = ({
  className,
  ...props
}: PromptInputToolbarProps) => {
  const { promptInputToolbar } = useStyles()()
  return (
    <div
      data-prompt-input-toolbar=""
      className={promptInputToolbar({ className })}
      {...props}
    />
  )
}

// MARK: PromptInputSubmit

interface PromptInputSubmitProps extends React.ComponentProps<typeof Button> {}

const PromptInputSubmit = ({
  className,
  variant = "primary",
  ...props
}: PromptInputSubmitProps) => {
  const { promptInputSubmit } = useStyles()()
  return (
    <Button
      data-prompt-input-submit=""
      type="submit"
      variant={variant}
      className={composeRenderProps(className, (className) =>
        promptInputSubmit({ className }),
      )}
      {...props}
    />
  )
}

// MARK: Separator

export type {
  ConversationProps,
  MessageAvatarProps,
  MessageContentProps,
  MessageProps,
  PromptInputProps,
  PromptInputSubmitProps,
  PromptInputTextareaProps,
  PromptInputToolbarProps,
}
export {
  Conversation,
  Message,
  MessageAvatar,
  MessageContent,
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
}
