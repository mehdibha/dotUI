"use client"

import type * as React from "react"

import { Button } from "@/registry/ui/button"

import { useStyles } from "./styles"

// MARK: attachmentStyles

// MARK: Separator

interface AttachmentProps extends React.ComponentProps<"div"> {
  state?: "idle" | "uploading" | "processing" | "error" | "done"
  size?: "xs" | "sm" | "md"
  orientation?: "horizontal" | "vertical"
}

const Attachment = ({
  className,
  state = "done",
  size = "md",
  orientation = "horizontal",
  ...props
}: AttachmentProps) => {
  const { root } = useStyles()({ size, orientation })
  return (
    <div
      data-attachment=""
      data-state={state}
      data-size={size}
      data-orientation={orientation}
      className={root({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface AttachmentMediaProps extends React.ComponentProps<"div"> {
  variant?: "icon" | "image"
}

const AttachmentMedia = ({
  className,
  variant = "icon",
  ...props
}: AttachmentMediaProps) => {
  const { media } = useStyles()({ mediaVariant: variant })
  return (
    <div
      data-attachment-media=""
      data-variant={variant}
      className={media({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface AttachmentContentProps extends React.ComponentProps<"div"> {}

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

interface AttachmentTitleProps extends React.ComponentProps<"span"> {}

const AttachmentTitle = ({ className, ...props }: AttachmentTitleProps) => {
  const { title } = useStyles()()
  return (
    <span
      data-attachment-title=""
      className={title({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface AttachmentDescriptionProps extends React.ComponentProps<"span"> {}

const AttachmentDescription = ({
  className,
  ...props
}: AttachmentDescriptionProps) => {
  const { description } = useStyles()()
  return (
    <span
      data-attachment-description=""
      className={description({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface AttachmentActionsProps extends React.ComponentProps<"div"> {}

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

const AttachmentAction = ({
  variant = "quiet",
  size = "xs",
  ...props
}: AttachmentActionProps) => {
  return (
    <Button
      data-attachment-action=""
      variant={variant}
      size={size}
      isIconOnly
      {...props}
    />
  )
}

// MARK: Separator

interface AttachmentTriggerProps extends React.ComponentProps<"button"> {}

const AttachmentTrigger = ({
  className,
  type = "button",
  ...props
}: AttachmentTriggerProps) => {
  const { trigger } = useStyles()()
  return (
    <button
      data-attachment-trigger=""
      type={type}
      className={trigger({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface AttachmentGroupProps extends React.ComponentProps<"div"> {}

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
