import type { ComponentProps } from 'react'

/**
 * A comment thread — a composable display block for discussions. Compose
 * `Comment`s (each an `Avatar` + `CommentContent`) inside; nest a
 * `CommentThread` within a comment for indented replies.
 */
export interface CommentThreadProps extends ComponentProps<'div'> {}

/** A single comment row: an avatar followed by its `CommentContent`. */
export interface CommentProps extends ComponentProps<'div'> {}
