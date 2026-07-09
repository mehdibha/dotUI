import type * as React from 'react'
import { type VariantProps, tv } from 'tailwind-variants'
const emptyVariants = tv({
  slots: {
    base: [
      'flex w-full min-w-0 flex-1 flex-col items-center justify-center text-center text-balance',
      'border-dashed',
      'gap-4 rounded-xl p-6',
    ],
    header: ['flex max-w-sm flex-col items-center', 'gap-2'],
    title: ['text-lg font-medium tracking-tight', 'text-base'],
    description: [
      'text-sm/relaxed text-fg-muted [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
      'text-sm/relaxed',
    ],
    content: [
      'flex w-full max-w-sm min-w-0 flex-col items-center text-balance',
      'gap-2.5 text-sm',
    ],
    media: [
      'flex shrink-0 items-center justify-center **:[svg]:pointer-events-none **:[svg]:shrink-0',
      'mb-2',
    ],
  },
  variants: {
    variant: {
      default: {
        media: 'bg-transparent',
      },
      icon: {
        media: [
          'rounded-md bg-muted text-fg',
          'size-9 **:[svg]:not-with-[size]:size-5',
        ],
      },
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

interface EmptyProps extends React.ComponentProps<'div'> {}

const Empty = ({ className, ...props }: EmptyProps) => {
  const { base } = emptyVariants()
  return <div data-slot="empty" className={base({ className })} {...props} />
}

interface EmptyHeaderProps extends React.ComponentProps<'div'> {}

const EmptyHeader = ({ className, ...props }: EmptyHeaderProps) => {
  const { header } = emptyVariants()
  return (
    <div
      data-slot="empty-header"
      className={header({ className })}
      {...props}
    />
  )
}

interface EmptyTitleProps extends React.ComponentProps<'div'> {}

const EmptyTitle = ({ className, ...props }: EmptyTitleProps) => {
  const { title } = emptyVariants()
  return (
    <div data-slot="empty-title" className={title({ className })} {...props} />
  )
}

interface EmptyDescriptionProps extends React.ComponentProps<'div'> {}

const EmptyDescription = ({ className, ...props }: EmptyDescriptionProps) => {
  const { description } = emptyVariants()
  return (
    <div
      data-slot="empty-description"
      className={description({ className })}
      {...props}
    />
  )
}

interface EmptyContentProps extends React.ComponentProps<'div'> {}

const EmptyContent = ({ className, ...props }: EmptyContentProps) => {
  const { content } = emptyVariants()
  return (
    <div
      data-slot="empty-content"
      className={content({ className })}
      {...props}
    />
  )
}

interface EmptyMediaProps
  extends React.ComponentProps<'div'>, VariantProps<typeof emptyVariants> {}
const EmptyMedia = ({ variant, className, ...props }: EmptyMediaProps) => {
  const { media } = emptyVariants()
  return (
    <div
      data-slot="empty-media"
      className={media({ variant, className })}
      {...props}
    />
  )
}

export type {
  EmptyContentProps,
  EmptyDescriptionProps,
  EmptyHeaderProps,
  EmptyMediaProps,
  EmptyProps,
  EmptyTitleProps,
}
export {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
}
