import type { ToggleButtonGroup as AriaToggleButtonGroup } from "react-aria-components";

/**
 * A toggle button group allows a user to toggle multiple options, with single or multiple selection.
 */
export interface ToggleButtonGroupProps extends React.ComponentProps<typeof AriaToggleButtonGroup> {
	/**
	 * The visual style of the toggle buttons.
	 * @default 'default'
	 */
	variant?: "default" | "quiet";

	/**
	 * The size of the toggle buttons.
	 * @default 'md'
	 */
	size?: "sm" | "md" | "lg";
}
