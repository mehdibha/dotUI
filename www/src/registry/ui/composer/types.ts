import type * as TextAreaPrimitives from "react-aria-components/TextArea"

import type { ButtonProps } from "@/registry/ui/button"

/**
 * A composer is the message input of a chat: a growing text area above a row
 * of actions, submitted with Enter or the send button.
 */
export interface ComposerProps extends Omit<
  React.ComponentProps<"form">,
  "onSubmit" | "onChange"
> {
  /** The current text (controlled). */
  value?: string
  /** The initial text (uncontrolled). @default '' */
  defaultValue?: string
  /** Handler that is called when the text changes. */
  onChange?: (value: string) => void
  /** Handler that is called with the text on submit; the text then clears. */
  onSubmit?: (value: string) => void
  /** Handler that is called when the send button is pressed as a stop button. */
  onStop?: () => void
  /**
   * The state of the reply. While `submitted` or `streaming`, submitting is
   * blocked and the send button becomes a stop button.
   * @default 'idle'
   */
  status?: "idle" | "submitted" | "streaming"
  /** Whether the composer is disabled. @default false */
  isDisabled?: boolean
}

/**
 * The text area. Enter submits on a keyboard (Shift+Enter for a new line);
 * touch keyboards keep Return for new lines.
 */
export interface ComposerTextAreaProps extends Omit<
  React.ComponentProps<typeof TextAreaPrimitives.TextArea>,
  "value" | "defaultValue" | "onChange"
> {}

/** The row of actions under the text area. */
export interface ComposerToolbarProps extends React.ComponentProps<"div"> {}

/**
 * The send button: disabled while the text is empty, a stop button while a
 * reply is in flight.
 */
export interface ComposerSubmitProps extends ButtonProps {}
