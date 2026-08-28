/**
 * A scrollable list of chat messages.
 */
export interface ConversationProps extends React.ComponentProps<"div"> {}

/**
 * A single turn in a conversation. Lays out the avatar and the content, and
 * exposes the role its children style against.
 */
export interface MessageProps extends Omit<
  React.ComponentProps<"div">,
  "role"
> {
  /**
   * Who sent the message. `user` renders a contained bubble aligned to the end
   * of the row, `assistant` renders plain full-width content.
   * @default 'assistant'
   */
  role?: "user" | "assistant"
}

/**
 * The body of a message — text, or any rich content the message carries.
 */
export interface MessageContentProps extends React.ComponentProps<"div"> {}

/**
 * The avatar of the message sender.
 */
export interface MessageAvatarProps extends React.ComponentProps<"span"> {
  /**
   * The size of the avatar.
   * @default 'sm'
   */
  size?: "sm" | "md" | "lg"

  /** Image source for the sender's avatar. */
  src?: string

  /** Sender name, used as the image alt text and as the fallback initials. */
  name?: string
}

/**
 * The composer users type their message into. Renders a form, so a submit
 * button — or pressing Enter in the textarea — submits it.
 */
export interface PromptInputProps extends React.ComponentProps<"form"> {}

/**
 * The auto-growing textarea of the composer. Enter submits the surrounding
 * form, Shift+Enter inserts a newline.
 */
export interface PromptInputTextareaProps extends React.ComponentProps<"textarea"> {}

/**
 * The row of actions below the textarea, such as attachments or the submit
 * button.
 */
export interface PromptInputToolbarProps extends React.ComponentProps<"div"> {}

/**
 * The button that submits the composer.
 */
export interface PromptInputSubmitProps extends React.ComponentProps<"button"> {
  /**
   * The visual style of the button.
   * @default 'primary'
   */
  variant?: "primary" | "secondary" | "quiet" | "link" | "warning" | "danger"

  /**
   * The size of the button.
   * @default 'md'
   */
  size?: "xs" | "sm" | "md" | "lg"
}
