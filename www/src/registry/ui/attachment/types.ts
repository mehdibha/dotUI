import type { Button } from "@/registry/ui/button"

/**
 * A file attached to a message or a composer — an icon or image preview, a
 * name, metadata, and actions, with upload states.
 */
export interface AttachmentProps extends React.ComponentProps<"div"> {
  /**
   * Where the file is in its lifecycle. `idle` renders a dashed outline,
   * `uploading` and `processing` pulse the title, `error` renders the danger
   * treatment.
   * @default 'done'
   */
  state?: "idle" | "uploading" | "processing" | "error" | "done"

  /**
   * The size of the attachment.
   * @default 'md'
   */
  size?: "xs" | "sm" | "md"

  /**
   * The layout direction — `horizontal` puts the media beside the content,
   * `vertical` stacks the media above it.
   * @default 'horizontal'
   */
  orientation?: "horizontal" | "vertical"
}

/**
 * The attachment's visual — a file-type icon or an image thumbnail.
 */
export interface AttachmentMediaProps extends React.ComponentProps<"div"> {
  /**
   * What the media holds: an `icon` on a muted square, or an `image`
   * thumbnail cropped to the square.
   * @default 'icon'
   */
  variant?: "icon" | "image"
}

/**
 * The attachment's text column — title and description.
 */
export interface AttachmentContentProps extends React.ComponentProps<"div"> {}

/**
 * The file name. Truncates, and pulses while the file uploads or processes.
 */
export interface AttachmentTitleProps extends React.ComponentProps<"span"> {}

/**
 * Metadata under the title — file size, type, or an error message.
 */
export interface AttachmentDescriptionProps extends React.ComponentProps<"span"> {}

/**
 * The attachment's action row — remove, retry, download.
 */
export interface AttachmentActionsProps extends React.ComponentProps<"div"> {}

/**
 * A single icon action. Renders a quiet, icon-only button.
 */
export interface AttachmentActionProps extends React.ComponentProps<
  typeof Button
> {}

/**
 * An invisible button stretched over the attachment, making the whole card
 * clickable while the actions stay independently pressable.
 */
export interface AttachmentTriggerProps extends React.ComponentProps<"button"> {}

/**
 * A horizontally scrolling row of attachments with snap points.
 */
export interface AttachmentGroupProps extends React.ComponentProps<"div"> {}
