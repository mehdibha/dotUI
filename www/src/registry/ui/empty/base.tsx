import type * as React from 'react'
import type { VariantProps } from 'tailwind-variants'

import { useStyles } from './styles'
import type { EmptyStyles } from './styles'

// MARK: emptyStyles

// MARK: Separator

interface EmptyProps extends React.ComponentProps<'div'> {}

const Empty = ({ className, ...props }: EmptyProps) => {
  const { base } = useStyles()()
  return <div data-slot="empty" className={base({ className })} {...props} />
}

// MARK: Separator

interface EmptyHeaderProps extends React.ComponentProps<'div'> {}

const EmptyHeader = ({ className, ...props }: EmptyHeaderProps) => {
  const { header } = useStyles()()
  return (
    <div
      data-slot="empty-header"
      className={header({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface EmptyTitleProps extends React.ComponentProps<'div'> {}

const EmptyTitle = ({ className, ...props }: EmptyTitleProps) => {
  const { title } = useStyles()()
  return (
    <div data-slot="empty-title" className={title({ className })} {...props} />
  )
}

// MARK: Separator

interface EmptyDescriptionProps extends React.ComponentProps<'div'> {}

const EmptyDescription = ({ className, ...props }: EmptyDescriptionProps) => {
  const { description } = useStyles()()
  return (
    <div
      data-slot="empty-description"
      className={description({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface EmptyContentProps extends React.ComponentProps<'div'> {}

const EmptyContent = ({ className, ...props }: EmptyContentProps) => {
  const { content } = useStyles()()
  return (
    <div
      data-slot="empty-content"
      className={content({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface EmptyMediaProps
  extends React.ComponentProps<'div'>, VariantProps<EmptyStyles> {}
const EmptyMedia = ({ variant, className, ...props }: EmptyMediaProps) => {
  const { media } = useStyles()()
  return (
    <div
      data-slot="empty-media"
      className={media({ variant, className })}
      {...props}
    />
  )
}

// MARK: Separator

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
