import type * as LinkPrimitives from "react-aria-components/Link";

/**
 * A link allows a user to navigate to another page or resource within a web page or application.
 */
export interface LinkProps extends LinkPrimitives.LinkProps {
	/**
	 * The visual style of the link.
	 * @default 'accent'
	 */
	variant?: "accent" | "quiet" | "unstyled";
}
