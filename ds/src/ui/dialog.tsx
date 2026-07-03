'use client'

import type * as React from 'react'
import { XIcon } from 'lucide-react'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'
import * as DialogPrimitive from 'react-aria-components/Dialog'
import * as TextPrimitives from 'react-aria-components/Text'
import { tv } from 'tailwind-variants'

import { Button } from '@/ui/button'
const dialogVariants = tv({
  slots: {
    content: [
      'relative flex max-h-[inherit] min-h-0 flex-col gap-4 outline-none has-data-command:p-0 [@container_(height<31.25rem)]:overflow-y-auto',
      'p-4 text-sm in-data-popover:p-2.5 in-data-popover:text-xs',
    ],
    header: [
      'flex flex-col',
      'gap-2 in-data-popover:gap-0.5 in-data-popover:text-sm',
    ],
    title: 'font-medium in-data-modal:text-base in-data-modal:leading-none',
    description: 'text-fg-muted',
    body: [
      'flex min-h-0 flex-1 flex-col gap-2 in-data-modal:[@container_(height<31.25rem)]:mx-0 in-data-modal:[@container_(height<31.25rem)]:shrink-0 in-data-modal:[@container_(height<31.25rem)]:overflow-y-visible in-data-modal:[@container_(height<31.25rem)]:px-0',
      '-mx-4 px-4 in-data-popover:-mx-2.5 in-data-popover:px-2.5',
    ],
    footer: 'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end',
    closeButton: ['absolute', 'top-2 right-2'],
  },
})

interface DialogProps extends React.ComponentProps<
  typeof DialogPrimitive.DialogTrigger
> {}

const Dialog = (props: DialogProps) => {
  return <DialogPrimitive.DialogTrigger {...props} />
}

interface DialogContentProps extends React.ComponentProps<
  typeof DialogPrimitive.Dialog
> {
  showCloseButton?: boolean
}

const DialogContent = ({
  className,
  children,
  showCloseButton = false,
  ...props
}: DialogContentProps) => {
  const { content, closeButton } = dialogVariants()
  return (
    <DialogPrimitive.Dialog
      data-slot="dialog-content"
      className={content({ className })}
      {...props}
    >
      {composeRenderProps(children, (children) => (
        <>
          {children}
          {showCloseButton && (
            <Button
              slot="close"
              variant="quiet"
              size="sm"
              isIconOnly
              aria-label="Close"
              className={closeButton()}
            >
              <XIcon />
            </Button>
          )}
        </>
      ))}
    </DialogPrimitive.Dialog>
  )
}

interface DialogHeaderProps extends React.ComponentProps<'header'> {}

const DialogHeader = ({ className, ...props }: DialogHeaderProps) => {
  const { header } = dialogVariants()
  return (
    <header
      data-slot="dialog-header"
      className={header({ className })}
      {...props}
    />
  )
}

interface DialogTitleProps extends React.ComponentProps<
  typeof DialogPrimitive.Heading
> {}

const DialogTitle = ({ className, ...props }: DialogTitleProps) => {
  const { title } = dialogVariants()
  return (
    <DialogPrimitive.Heading
      slot="title"
      data-slot="dialog-heading"
      className={title({ className })}
      {...props}
    />
  )
}

interface DialogDescriptionProps extends Omit<
  React.ComponentProps<typeof TextPrimitives.Text>,
  'slot'
> {}

const DialogDescription = ({ className, ...props }: DialogDescriptionProps) => {
  const { description } = dialogVariants()
  return (
    <TextPrimitives.Text
      data-slot="dialog-description"
      className={description({ className })}
      {...props}
    />
  )
}

interface DialogBodyProps extends React.ComponentProps<'div'> {}

const DialogBody = ({ className, ...props }: DialogBodyProps) => {
  const { body } = dialogVariants()

  return (
    <div data-slot="dialog-body" className={body({ className })} {...props} />
  )
}

type DialogInsetProps = React.ComponentProps<'div'>

const DialogInset = (props: DialogInsetProps) => {
  return <div data-slot="dialog-inset" {...props} />
}

type DialogFooterProps = React.ComponentProps<'footer'>

const DialogFooter = ({ className, ...props }: DialogFooterProps) => {
  const { footer } = dialogVariants()
  return (
    <footer
      data-slot="dialog-footer"
      className={footer({ className })}
      {...props}
    />
  )
}

export type {
  DialogBodyProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogHeaderProps,
  DialogInsetProps,
  DialogProps,
  DialogTitleProps,
}
export {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogInset,
  DialogTitle,
}
