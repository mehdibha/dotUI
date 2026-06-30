'use client'

import type { ComponentProps } from 'react'

import { useStyles } from './styles'

// MARK: CommentThread

const CommentThread = ({ className, ...props }: ComponentProps<'div'>) => {
  const { root } = useStyles()()
  return (
    <div data-comment-thread="" className={root({ className })} {...props} />
  )
}

// MARK: Comment

const Comment = ({ className, ...props }: ComponentProps<'div'>) => {
  const { comment } = useStyles()()
  return <div data-comment="" className={comment({ className })} {...props} />
}

// MARK: CommentContent

const CommentContent = ({ className, ...props }: ComponentProps<'div'>) => {
  const { content } = useStyles()()
  return (
    <div
      data-comment-content=""
      className={content({ className })}
      {...props}
    />
  )
}

// MARK: CommentHeader

const CommentHeader = ({ className, ...props }: ComponentProps<'div'>) => {
  const { header } = useStyles()()
  return (
    <div data-comment-header="" className={header({ className })} {...props} />
  )
}

// MARK: CommentAuthor

const CommentAuthor = ({ className, ...props }: ComponentProps<'span'>) => {
  const { author } = useStyles()()
  return (
    <span data-comment-author="" className={author({ className })} {...props} />
  )
}

// MARK: CommentTimestamp

const CommentTimestamp = ({ className, ...props }: ComponentProps<'span'>) => {
  const { timestamp } = useStyles()()
  return (
    <span
      data-comment-timestamp=""
      className={timestamp({ className })}
      {...props}
    />
  )
}

// MARK: CommentBody

const CommentBody = ({ className, ...props }: ComponentProps<'div'>) => {
  const { body } = useStyles()()
  return <div data-comment-body="" className={body({ className })} {...props} />
}

// MARK: CommentActions

const CommentActions = ({ className, ...props }: ComponentProps<'div'>) => {
  const { actions } = useStyles()()
  return (
    <div
      data-comment-actions=""
      className={actions({ className })}
      {...props}
    />
  )
}

// MARK: Separator

export {
  CommentThread,
  Comment,
  CommentContent,
  CommentHeader,
  CommentAuthor,
  CommentTimestamp,
  CommentBody,
  CommentActions,
}
