import type * as ButtonPrimitives from "react-aria-components/Button";
import type * as LinkPrimitives from "react-aria-components/Link";

/**
 * A clickable element that triggers an action. Buttons communicate actions users can take
 * and allow users to interact with the page.
 */
export interface ButtonProps extends React.ComponentProps<typeof ButtonPrimitives.Button> {
	/**
	 * The visual style of the button (Vanilla CSS implementation specific).
	 * @default 'default'
	 */
	variant?: "default" | "primary" | "quiet" | "link" | "warning" | "danger";

	/**
	 * The size of the button.
	 * For an icon-only button, set `isIconOnly` rather than a dedicated size.
	 * @default "md"
	 */
	size?: "xs" | "sm" | "md" | "lg";
}

export interface LinkButtonProps extends React.ComponentProps<typeof LinkPrimitives.Link> {
	/**
	 * The visual style of the button.
	 * @default "default"
	 */
	variant?: "default" | "primary" | "quiet" | "link" | "warning" | "danger";

	/**
	 * The size of the button.
	 * For an icon-only button, set `isIconOnly` rather than a dedicated size.
	 * @default "md"
	 */
	size?: "xs" | "sm" | "md" | "lg";
}
