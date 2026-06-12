/**
 * An alert displays a short, important message that attracts the user's
 * attention without interrupting their task.
 */
export interface AlertProps extends React.ComponentProps<'div'> {
  /**
   * The visual style of the alert.
   * @default 'neutral'
   */
  variant?: 'neutral' | 'danger' | 'warning' | 'info' | 'success'
}

/**
 * The title of the alert.
 */
export interface AlertTitleProps extends React.ComponentProps<'div'> {}

/**
 * The description of the alert.
 */
export interface AlertDescriptionProps extends React.ComponentProps<'div'> {}

/**
 * Contains actions such as buttons, displayed at the end of the alert.
 */
export interface AlertActionProps extends React.ComponentProps<'div'> {}
