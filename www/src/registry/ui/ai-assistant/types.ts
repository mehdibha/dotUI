import type * as React from 'react'

/**
 * The container for an AI assistant chat experience. Lays out a scrollable
 * message log and an input as a vertical column inside a card surface.
 */
export interface AIAssistantProps extends React.ComponentProps<'div'> {}

/**
 * The scrollable region that holds the conversation. Announces new content to
 * assistive technology via an `aria-live` log region.
 */
export interface AIAssistantMessagesProps extends React.ComponentProps<'div'> {}

/**
 * A single message in the conversation. The `role` aligns the bubble and, for
 * the assistant, renders an avatar alongside it.
 */
export interface AIAssistantMessageProps extends React.ComponentProps<'div'> {
  /**
   * Who sent the message. `user` aligns the bubble to the end with the primary
   * color; `assistant` aligns to the start with a muted bubble and an avatar.
   */
  role: 'user' | 'assistant'
}

/**
 * The avatar shown next to an assistant message. Falls back to a bot icon (or a
 * custom node) when no image is provided or the image fails to load.
 */
export interface AIAssistantMessageAvatarProps extends React.ComponentProps<'span'> {
  /**
   * The URL of the avatar image.
   */
  src?: string
  /**
   * Alternative text for the avatar image.
   */
  alt?: string
  /**
   * Content shown when no image is available. Defaults to a bot icon.
   */
  fallback?: React.ReactNode
}

/**
 * The composer at the bottom of the assistant. Renders an auto-growing textarea
 * and a send button; submits on Enter (Shift+Enter inserts a newline).
 */
export interface AIAssistantInputProps extends Omit<
  React.ComponentProps<'form'>,
  'onSubmit'
> {
  /**
   * The controlled value of the textarea.
   */
  value: string
  /**
   * Called when the textarea value changes.
   */
  onValueChange: (value: string) => void
  /**
   * Called with the trimmed message when the user submits a non-empty value.
   */
  onSend: (value: string) => void
  /**
   * Placeholder text shown in the textarea.
   * @default 'Send a message...'
   */
  placeholder?: string
  /**
   * Accessible label for the textarea.
   * @default 'Message'
   */
  'aria-label'?: string
  /**
   * Disables the textarea and send button.
   */
  isDisabled?: boolean
}
