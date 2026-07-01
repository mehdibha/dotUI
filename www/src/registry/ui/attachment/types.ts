/**
 * A file or image attachment card. Compose `AttachmentMedia`,
 * `AttachmentContent`, `AttachmentActions`, and an optional `AttachmentTrigger`.
 */
export interface AttachmentProps extends React.ComponentProps<'div'> {
  /**
   * Layout direction — `vertical` puts the media on top (image cards).
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical'
  /**
   * @default 'md'
   */
  size?: 'sm' | 'md'
  /**
   * Upload state. `uploading` shows a progress bar; `error` flags the card.
   * @default 'idle'
   */
  state?: 'idle' | 'uploading' | 'error'
}

/**
 * The media slot — a file-type icon, or an image thumbnail.
 */
export interface AttachmentMediaProps extends React.ComponentProps<'span'> {
  /**
   * @default 'icon'
   */
  variant?: 'icon' | 'image'
}

/**
 * Wraps the attachment's title and description.
 */
export interface AttachmentContentProps extends React.ComponentProps<'div'> {}

/**
 * The attachment's primary label — typically the file name.
 */
export interface AttachmentTitleProps extends React.ComponentProps<'div'> {}

/**
 * The attachment's secondary label — type, size, or status.
 */
export interface AttachmentDescriptionProps extends React.ComponentProps<'div'> {}

/**
 * A row of action controls (remove, download…) for an attachment. Stays above
 * the full-card trigger so its buttons remain clickable.
 */
export interface AttachmentActionsProps extends React.ComponentProps<'div'> {}

/**
 * An icon action button for an attachment. Spreads `Button` props.
 */
export interface AttachmentActionProps extends React.ComponentProps<'button'> {}

/**
 * A transparent overlay that turns the whole card into one click target. Set
 * `asChild` to render it as a link.
 */
export interface AttachmentTriggerProps extends React.ComponentProps<'button'> {
  /**
   * @default false
   */
  asChild?: boolean
}

/**
 * Lays out multiple attachments in a wrapping row.
 */
export interface AttachmentGroupProps extends React.ComponentProps<'div'> {}
