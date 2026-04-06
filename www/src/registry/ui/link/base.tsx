"use client";

import { Link as AriaLink, composeRenderProps } from "react-aria-components";
import type { LinkProps as AriaLinkProps } from "react-aria-components";
import type { VariantProps } from "tailwind-variants";

import type { LinkStyles } from "./styles";
import { useStyles } from "./styles";

// MARK: linkStyles

interface LinkProps extends AriaLinkProps, VariantProps<LinkStyles> {}

const Link = ({ variant, ...props }: LinkProps) => {
	const linkStyles = useStyles();
	return (
		<AriaLink
			{...props}
			className={composeRenderProps(props.className, (className) => linkStyles({ variant, className }))}
		/>
	);
};

export type { LinkProps };
export { Link };
