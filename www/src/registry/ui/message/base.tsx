'use client'

import type * as React from 'react'

import { createContext } from '@/registry/lib/context'

import { useStyles } from './styles'

// MARK: messageStyles

const [MessageContext, useMessageContext] = createContext<{
  align: 'start' | 'end'
}>({
  name: 'Message',
  strict: false,
})

// MARK: Separator

interface MessageProps extends React.ComponentProps<'div'> {
  align?: 'start' | 'end'
}

const Message = ({ className, align = 'start', ...props }: MessageProps) => {
  const { root } = useStyles()()
  return (
    <MessageContext value={{ align }}>
      <div
        data-message=""
        data-align={align}
        className={root({ align, className })}
        {...props}
      />
    </MessageContext>
  )
}

// MARK: Separator

interface MessageAvatarProps extends React.ComponentProps<'div'> {}

const MessageAvatar = ({ className, ...props }: MessageAvatarProps) => {
  const { avatar } = useStyles()()
  return (
    <div data-message-avatar="" className={avatar({ className })} {...props} />
  )
}

// MARK: Separator

interface MessageContentProps extends React.ComponentProps<'div'> {}

const MessageContent = ({ className, ...props }: MessageContentProps) => {
  const align = useMessageContext('MessageContent')?.align ?? 'start'
  const { content } = useStyles()()
  return (
    <div
      data-message-content=""
      className={content({ align, className })}
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

interface MessageFooterProps extends React.ComponentProps<'div'> {}

const MessageFooter = ({ className, ...props }: MessageFooterProps) => {
  const { footer } = useStyles()()
  return (
    <div data-message-footer="" className={footer({ className })} {...props} />
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

export type {
  MessageAvatarProps,
  MessageContentProps,
  MessageFooterProps,
  MessageGroupProps,
  MessageHeaderProps,
  MessageProps,
}
export {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
}
