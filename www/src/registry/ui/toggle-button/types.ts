import * as ToggleButtonPrimitives from "react-aria-components/ToggleButton";

/**
 * A toggle button allows a user to toggle a selection on or off, for example switching between two states or modes.
 */
export interface ToggleButtonProps extends React.ComponentProps<typeof ToggleButtonPrimitives.ToggleButton> {
	/**
	 * The visual style of the toggle button.
	 * @default 'default'
	 */
	variant?: "default" | "quiet";

	/**
	 * The size of the toggle button.
	 * Use `icon-sm`, `icon`, or `icon-lg` for icon-only buttons.
	 * @default 'md'
	 */
	size?: "sm" | "md" | "lg" | "icon-sm" | "icon" | "icon-lg";
}
