"use client"

import type * as React from "react"
import { composeRenderProps } from "react-aria-components/composeRenderProps"

import { Avatar, AvatarFallback, AvatarImage } from "@/registry/ui/avatar"
import { Button } from "@/registry/ui/button"
import { InputGroup, InputGroupAddon, TextArea } from "@/registry/ui/input"

import { useStyles } from "./styles"

// MARK: chatStyles

// MARK: Separator

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

// MARK: Separator

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

// MARK: Separator

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

// MARK: Separator

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

// MARK: Separator

interface PromptInputProps extends React.ComponentProps<"form"> {}

const PromptInput = ({ className, children, ...props }: PromptInputProps) => {
  const { promptInput } = useStyles()()
  return (
    <form
      data-prompt-input=""
      className={promptInput({ className })}
      {...props}
    >
      <InputGroup>{children}</InputGroup>
    </form>
  )
}

// MARK: Separator

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

// MARK: Separator

interface PromptInputToolbarProps extends React.ComponentProps<"div"> {}

const PromptInputToolbar = ({
  className,
  ...props
}: PromptInputToolbarProps) => {
  const { promptInputToolbar } = useStyles()()
  return (
    <InputGroupAddon
      data-prompt-input-toolbar=""
      className={promptInputToolbar({ className })}
      {...props}
    />
  )
}

// MARK: Separator

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
