/**
 * Missing description.
 */
export interface BadgeProps extends React.ComponentProps<"span"> {
	/**
	 * The visual appearance of the badge.
	 * @default 'solid'
	 */
	appearance?: "solid" | "subtle";
	/**
	 * The visual style of the badge.
	 * @default 'default'
	 */
	variant?: "neutral" | "accent" | "danger" | "success" | "warning" | "info";
	/**
	 * The size of the badge.
	 * @default 'default'
	 */
	size?: "sm" | "md" | "lg";
}
