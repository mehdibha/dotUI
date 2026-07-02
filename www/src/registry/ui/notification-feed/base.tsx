'use client'

import type { ComponentProps } from 'react'

import { useStyles } from './styles'

// MARK: NotificationFeed

const NotificationFeed = ({ className, ...props }: ComponentProps<'div'>) => {
  const { root } = useStyles()()
  return (
    <div
      data-notification-feed=""
      role="feed"
      className={root({ className })}
      {...props}
    />
  )
}

// MARK: Notification

interface NotificationProps extends ComponentProps<'div'> {
  unread?: boolean
}

const Notification = ({ unread, className, ...props }: NotificationProps) => {
  const { item } = useStyles()()
  return (
    <div
      data-notification=""
      data-unread={unread || undefined}
      className={item({ className })}
      {...props}
    />
  )
}

// MARK: NotificationContent

const NotificationContent = ({
  className,
  ...props
}: ComponentProps<'div'>) => {
  const { content } = useStyles()()
  return (
    <div
      data-notification-content=""
      className={content({ className })}
      {...props}
    />
  )
}

// MARK: NotificationTitle

const NotificationTitle = ({ className, ...props }: ComponentProps<'div'>) => {
  const { title } = useStyles()()
  return (
    <div
      data-notification-title=""
      className={title({ className })}
      {...props}
    />
  )
}

// MARK: NotificationDescription

const NotificationDescription = ({
  className,
  ...props
}: ComponentProps<'div'>) => {
  const { description } = useStyles()()
  return (
    <div
      data-notification-description=""
      className={description({ className })}
      {...props}
    />
  )
}

// MARK: NotificationTime

const NotificationTime = ({ className, ...props }: ComponentProps<'span'>) => {
  const { time } = useStyles()()
  return (
    <span
      data-notification-time=""
      className={time({ className })}
      {...props}
    />
  )
}

// MARK: NotificationActions

const NotificationActions = ({
  className,
  ...props
}: ComponentProps<'div'>) => {
  const { actions } = useStyles()()
  return (
    <div
      data-notification-actions=""
      className={actions({ className })}
      {...props}
    />
  )
}

// MARK: Separator

export type { NotificationProps }
export {
  NotificationFeed,
  Notification,
  NotificationContent,
  NotificationTitle,
  NotificationDescription,
  NotificationTime,
  NotificationActions,
}
