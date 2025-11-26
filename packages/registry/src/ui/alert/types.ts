export interface AlertProps extends React.ComponentProps<"div"> {
  /**
   * The visual style of the alert.
   * @default 'neutral'
   */
  variant?: "neutral" | "danger" | "warning" | "info" | "success";
}

export interface AlertTitleProps extends React.ComponentProps<"div"> {}

export interface AlertDescriptionProps extends React.ComponentProps<"div"> {}

export interface AlertActionProps extends React.ComponentProps<"div"> {}
