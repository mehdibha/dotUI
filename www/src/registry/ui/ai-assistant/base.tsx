'use client'

import * as React from 'react'
import { ArrowUpIcon, BotIcon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/ui/avatar'
import { Button } from '@/registry/ui/button'
import { TextArea } from '@/registry/ui/input'
import { TextField } from '@/registry/ui/text-field'

import { useStyles } from './styles'

// MARK: AIAssistant

type Role = 'user' | 'assistant'

interface AIAssistantProps extends React.ComponentProps<'div'> {}

function AIAssistant({ className, ...props }: AIAssistantProps) {
  const { root } = useStyles()()
  return <div data-ai-assistant="" className={root({ className })} {...props} />
}

// MARK: AIAssistantMessages

interface AIAssistantMessagesProps extends React.ComponentProps<'div'> {}

function AIAssistantMessages({
  className,
  ...props
}: AIAssistantMessagesProps) {
  const { messages } = useStyles()()
  return (
    <div
      data-ai-assistant-messages=""
      role="log"
      aria-live="polite"
      className={messages({ className })}
      {...props}
    />
  )
}

// MARK: AIAssistantMessage

interface AIAssistantMessageProps extends React.ComponentProps<'div'> {
  role: Role
}

function AIAssistantMessage({
  role,
  className,
  children,
  ...props
}: AIAssistantMessageProps) {
  const { message, avatar, bubble } = useStyles()()
  return (
    <div
      data-ai-assistant-message=""
      data-role={role}
      className={message({ className })}
      {...props}
    >
      {role === 'assistant' && (
        <Avatar size="sm" className={avatar()}>
          <AvatarFallback>
            <BotIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
      )}
      <div data-role={role} className={bubble()}>
        {children}
      </div>
    </div>
  )
}

// MARK: AIAssistantMessageAvatar

interface AIAssistantMessageAvatarProps extends React.ComponentProps<'span'> {
  src?: string
  alt?: string
  fallback?: React.ReactNode
}

function AIAssistantMessageAvatar({
  src,
  alt,
  fallback,
  className,
  ...props
}: AIAssistantMessageAvatarProps) {
  const { avatar } = useStyles()()
  return (
    <Avatar size="sm" className={avatar({ className })} {...props}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>
        {fallback ?? <BotIcon className="size-4" />}
      </AvatarFallback>
    </Avatar>
  )
}

// MARK: AIAssistantInput

interface AIAssistantInputProps extends Omit<
  React.ComponentProps<'form'>,
  'onSubmit'
> {
  /** The controlled value of the textarea. */
  value: string
  /** Called when the textarea value changes. */
  onValueChange: (value: string) => void
  /** Called with the trimmed message when the user submits a non-empty value. */
  onSend: (value: string) => void
  /** Placeholder text shown in the textarea. */
  placeholder?: string
  /** Accessible label for the textarea. */
  'aria-label'?: string
  /** Disables the textarea and send button. */
  isDisabled?: boolean
}

function AIAssistantInput({
  value,
  onValueChange,
  onSend,
  placeholder = 'Send a message...',
  'aria-label': ariaLabel = 'Message',
  isDisabled,
  className,
  ...props
}: AIAssistantInputProps) {
  const { input, field } = useStyles()()

  const submit = () => {
    const trimmed = value.trim()
    if (trimmed.length === 0) return
    onSend(trimmed)
  }

  return (
    <form
      data-ai-assistant-input=""
      className={input({ className })}
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
      {...props}
    >
      <TextField
        aria-label={ariaLabel}
        value={value}
        onChange={onValueChange}
        isDisabled={isDisabled}
        className={field()}
      >
        <TextArea
          placeholder={placeholder}
          rows={1}
          className="max-h-32"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              submit()
            }
          }}
        />
      </TextField>
      <Button
        type="submit"
        variant="primary"
        isIconOnly
        aria-label="Send message"
        isDisabled={isDisabled || value.trim().length === 0}
        className={cn('rounded-(--ai-assistant-radius)')}
      >
        <ArrowUpIcon />
      </Button>
    </form>
  )
}

// MARK: exports

export type {
  AIAssistantInputProps,
  AIAssistantMessageAvatarProps,
  AIAssistantMessageProps,
  AIAssistantMessagesProps,
  AIAssistantProps,
}
export {
  AIAssistant,
  AIAssistantInput,
  AIAssistantMessage,
  AIAssistantMessageAvatar,
  AIAssistantMessages,
}
