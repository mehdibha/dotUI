import type { LinkProps as AriaLinkProps } from "react-aria-components";

export interface LinkProps extends AriaLinkProps {
  /**
   * The visual style of the link.
   * @default 'accent'
   */
  variant?: "accent" | "quiet" | "unstyled";
}

