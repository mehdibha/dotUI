'use client'

import * as React from 'react'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'

import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'

import { useStyles } from './styles'

// MARK: attachmentStyles

// Minimal slot: merges props onto a single child so `asChild` can render the
// trigger as a link instead of a button.
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

interface AttachmentProps extends React.ComponentProps<'div'> {
  orientation?: 'horizontal' | 'vertical'
  size?: 'sm' | 'md'
  state?: 'idle' | 'uploading' | 'error'
}

const Attachment = ({
  className,
  orientation,
  size,
  state,
  ...props
}: AttachmentProps) => {
  const { root } = useStyles()()
  return (
    <div
      data-attachment=""
      data-state={state}
      className={root({ orientation, size, state, className })}
      {...props}
    />
  )
}

// MARK: Separator

interface AttachmentMediaProps extends React.ComponentProps<'span'> {
  variant?: 'icon' | 'image'
}

const AttachmentMedia = ({
  className,
  variant = 'icon',
  ...props
}: AttachmentMediaProps) => {
  const { media } = useStyles()()
  return (
    <span
      data-attachment-media=""
      data-variant={variant}
      className={media({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface AttachmentContentProps extends React.ComponentProps<'div'> {}

const AttachmentContent = ({ className, ...props }: AttachmentContentProps) => {
  const { content } = useStyles()()
  return (
    <div
      data-attachment-content=""
      className={content({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface AttachmentTitleProps extends React.ComponentProps<'div'> {}

const AttachmentTitle = ({ className, ...props }: AttachmentTitleProps) => {
  const { title } = useStyles()()
  return (
    <div data-attachment-title="" className={title({ className })} {...props} />
  )
}

// MARK: Separator

interface AttachmentDescriptionProps extends React.ComponentProps<'div'> {}

const AttachmentDescription = ({
  className,
  ...props
}: AttachmentDescriptionProps) => {
  const { description } = useStyles()()
  return (
    <div
      data-attachment-description=""
      className={description({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface AttachmentActionsProps extends React.ComponentProps<'div'> {}

const AttachmentActions = ({ className, ...props }: AttachmentActionsProps) => {
  const { actions } = useStyles()()
  return (
    <div
      data-attachment-actions=""
      className={actions({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface AttachmentActionProps extends React.ComponentProps<typeof Button> {}

const AttachmentAction = ({ className, ...props }: AttachmentActionProps) => {
  const { action } = useStyles()()
  return (
    <Button
      data-attachment-action=""
      variant="quiet"
      size="sm"
      isIconOnly
      className={composeRenderProps(className, (cn) =>
        action({ className: cn }),
      )}
      {...props}
    />
  )
}

// MARK: Separator

interface AttachmentTriggerProps extends React.ComponentProps<'button'> {
  asChild?: boolean
}

const AttachmentTrigger = ({
  className,
  asChild,
  ...props
}: AttachmentTriggerProps) => {
  const { trigger } = useStyles()()
  const Comp: React.ElementType = asChild ? Slot : 'button'
  return (
    <Comp
      data-attachment-trigger=""
      className={trigger({ className })}
      {...(asChild ? {} : { type: 'button' })}
      {...props}
    />
  )
}

// MARK: Separator

interface AttachmentGroupProps extends React.ComponentProps<'div'> {}

const AttachmentGroup = ({ className, ...props }: AttachmentGroupProps) => {
  const { group } = useStyles()()
  return (
    <div data-attachment-group="" className={group({ className })} {...props} />
  )
}

// MARK: Separator

export type {
  AttachmentActionProps,
  AttachmentActionsProps,
  AttachmentContentProps,
  AttachmentDescriptionProps,
  AttachmentGroupProps,
  AttachmentMediaProps,
  AttachmentProps,
  AttachmentTitleProps,
  AttachmentTriggerProps,
}
export {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
}
