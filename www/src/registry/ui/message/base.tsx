'use client'

import type * as React from 'react'
import { FileIcon } from 'lucide-react'

import { createContext } from '@/registry/lib/context'
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/ui/avatar'

import { useStyles } from './styles'

// MARK: messageStyles

type MessageRole = 'user' | 'assistant'

const [MessageContext, useMessageContext] = createContext<{
  from: MessageRole
}>({
  name: 'Message',
  strict: false,
})

function getInitials(name?: string) {
  if (!name) return null
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return null
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts.at(-1)?.[0] ?? '') : ''
  return (first + last).toUpperCase() || null
}

// MARK: Separator

interface MessageProps extends React.ComponentProps<'div'> {
  from?: MessageRole
}

const Message = ({ className, from = 'assistant', ...props }: MessageProps) => {
  const { root } = useStyles()()
  return (
    <MessageContext value={{ from }}>
      <div
        data-message=""
        data-from={from}
        className={root({ from, className })}
        {...props}
      />
    </MessageContext>
  )
}

// MARK: Separator

interface MessageAvatarProps extends React.ComponentProps<'span'> {
  src?: string
  name?: string
}

const MessageAvatar = ({
  className,
  src,
  name,
  children,
  ...props
}: MessageAvatarProps) => {
  const { avatar } = useStyles()()
  return (
    <Avatar data-message-avatar="" className={avatar({ className })} {...props}>
      {src ? <AvatarImage src={src} alt={name} /> : null}
      <AvatarFallback>{children ?? getInitials(name)}</AvatarFallback>
    </Avatar>
  )
}

// MARK: Separator

interface MessageBodyProps extends React.ComponentProps<'div'> {}

const MessageBody = ({ className, ...props }: MessageBodyProps) => {
  const from = useMessageContext('MessageBody')?.from ?? 'assistant'
  const { body } = useStyles()()
  return (
    <div
      data-message-body=""
      className={body({ from, className })}
      {...props}
    />
  )
}

// MARK: Separator

interface MessageHeaderProps extends React.ComponentProps<'div'> {}

const MessageHeader = ({ className, ...props }: MessageHeaderProps) => {
  const { header } = useStyles()()
  return (
    <div data-message-header="" className={header({ className })} {...props} />
  )
}

// MARK: Separator

interface MessageBubbleProps extends React.ComponentProps<'div'> {
  from?: MessageRole
}

const MessageBubble = ({
  className,
  from: fromProp,
  ...props
}: MessageBubbleProps) => {
  const ctx = useMessageContext('MessageBubble')
  const from = fromProp ?? ctx?.from ?? 'assistant'
  const { bubble } = useStyles()()
  return (
    <div
      data-message-bubble=""
      data-from={from}
      className={bubble({ from, className })}
      {...props}
    />
  )
}

// MARK: Separator

interface MessageActionsProps extends React.ComponentProps<'div'> {}

const MessageActions = ({ className, ...props }: MessageActionsProps) => {
  const { actions } = useStyles()()
  return (
    <div
      data-message-actions=""
      className={actions({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface MessageGroupProps extends React.ComponentProps<'div'> {}

const MessageGroup = ({ className, ...props }: MessageGroupProps) => {
  const { group } = useStyles()()
  return (
    <div data-message-group="" className={group({ className })} {...props} />
  )
}

// MARK: Separator

interface MessageMarkerProps extends React.ComponentProps<'div'> {
  variant?: 'separator' | 'note' | 'status'
}

const MessageMarker = ({
  className,
  variant = 'separator',
  children,
  ...props
}: MessageMarkerProps) => {
  const { marker, markerLabel, shimmer } = useStyles()()
  return (
    <div
      data-message-marker=""
      data-variant={variant}
      className={marker({ variant, className })}
      {...props}
    >
      <span
        className={
          variant === 'status'
            ? shimmer({ className: 'shrink-0' })
            : markerLabel({ variant })
        }
      >
        {children}
      </span>
    </div>
  )
}

// MARK: Separator

interface MessageAttachmentProps extends React.ComponentProps<'div'> {
  name: string
  meta?: string
  src?: string
}

const MessageAttachment = ({
  className,
  name,
  meta,
  src,
  ...props
}: MessageAttachmentProps) => {
  const {
    attachment,
    attachmentMedia,
    attachmentInfo,
    attachmentName,
    attachmentMeta,
  } = useStyles()()
  return (
    <div
      data-message-attachment=""
      className={attachment({ className })}
      {...props}
    >
      <span className={attachmentMedia()}>
        {src ? <img src={src} alt={name} /> : <FileIcon />}
      </span>
      <span className={attachmentInfo()}>
        <span className={attachmentName()}>{name}</span>
        {meta ? <span className={attachmentMeta()}>{meta}</span> : null}
      </span>
    </div>
  )
}

// MARK: Separator

export type {
  MessageActionsProps,
  MessageAttachmentProps,
  MessageAvatarProps,
  MessageBodyProps,
  MessageBubbleProps,
  MessageGroupProps,
  MessageHeaderProps,
  MessageMarkerProps,
  MessageProps,
}
export {
  Message,
  MessageActions,
  MessageAttachment,
  MessageAvatar,
  MessageBody,
  MessageBubble,
  MessageGroup,
  MessageHeader,
  MessageMarker,
}
