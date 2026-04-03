import type { LinkProps as AriaLinkProps } from "react-aria-components";

/**
 * A link allows a user to navigate to another page or resource within a web page or application.
 */
export interface LinkProps extends AriaLinkProps {
	/**
	 * The visual style of the link.
	 * @default 'accent'
	 */
	variant?: "accent" | "quiet" | "unstyled";
}
