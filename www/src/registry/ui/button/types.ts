import type { Button as AriaButton, Link as AriaLink } from "react-aria-components";

/**
 * A clickable element that triggers an action. Buttons communicate actions users can take
 * and allow users to interact with the page.
 */
export interface ButtonProps extends React.ComponentProps<typeof AriaButton> {
	/**
	 * The visual style of the button (Vanilla CSS implementation specific).
	 * @default 'default'
	 */
	variant?: "default" | "primary" | "quiet" | "link" | "warning" | "danger";

	/**
	 * The size of the button.
	 * Use `icon-xs`, `icon-sm`, `icon`, or `icon-lg` for icon-only buttons.
	 * @default "md"
	 */
	size?: "xs" | "sm" | "md" | "lg" | "icon-xs" | "icon-sm" | "icon" | "icon-lg";
}

export interface LinkButtonProps extends React.ComponentProps<typeof AriaLink> {
	/**
	 * The visual style of the button.
	 * @default "default"
	 */
	variant?: "default" | "primary" | "quiet" | "link" | "warning" | "danger";

	/**
	 * The size of the button.
	 * Use `icon-xs`, `icon-sm`, `icon`, or `icon-lg` for icon-only buttons.
	 * @default "md"
	 */
	size?: "xs" | "sm" | "md" | "lg" | "icon-xs" | "icon-sm" | "icon" | "icon-lg";
}
