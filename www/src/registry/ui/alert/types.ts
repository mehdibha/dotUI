/**
 * Missing description.
 */
export interface AlertProps extends React.ComponentProps<"div"> {
	/**
	 * The visual style of the alert.
	 * @default 'neutral'
	 */
	variant?: "neutral" | "danger" | "warning" | "info" | "success";
}

/**
 * Missing description.
 */
export interface AlertTitleProps extends React.ComponentProps<"div"> {}

/**
 * Missing description.
 */
export interface AlertDescriptionProps extends React.ComponentProps<"div"> {}

/**
 * Missing description.
 */
export interface AlertActionProps extends React.ComponentProps<"div"> {}
