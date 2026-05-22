import type * as ToggleButtonPrimitives from "react-aria-components/ToggleButton";

/**
 * A toggle button allows a user to toggle a selection on or off, for example switching between two states or modes.
 */
export interface ToggleButtonProps extends React.ComponentProps<typeof ToggleButtonPrimitives.ToggleButton> {
	/**
	 * The visual style of the toggle button.
	 * @default 'default'
	 */
	variant?: "default" | "primary" | "quiet";

	/**
	 * The size of the toggle button.
	 * @default 'md'
	 */
	size?: "xs" | "sm" | "md" | "lg";

	/**
	 * Whether the toggle button only contains an icon.
	 */
	isIconOnly?: boolean;
}
