/**
 * Missing description.
 */
export interface BadgeProps extends React.ComponentProps<"span"> {
	/**
	 * The visual style of the badge.
	 * @default 'default'
	 */
	variant?: "default" | "primary" | "danger" | "success" | "warning" | "info";
	/**
	 * The size of the badge.
	 * @default 'default'
	 */
	size?: "sm" | "md" | "lg";
}
