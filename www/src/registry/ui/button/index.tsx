import { Link as RouterLink } from "@tanstack/react-router";
import type { ToOptions } from "@tanstack/react-router";

import { LinkButton as LinkButtonPrimitive } from "./base";

import type { LinkButtonProps as BaseLinkButtonProps } from "./base";

export { Button } from "./base";
export type { ButtonProps } from "./base";
export { buttonStyles, useStyles as useButtonStyles } from "./styles";

type LinkButtonProps = Omit<BaseLinkButtonProps, "href"> & { href?: string | ToOptions };

function LinkButton({ href, ...props }: LinkButtonProps) {
	return (
		<LinkButtonPrimitive
			href={href == null ? undefined : typeof href === "object" ? href.to : href}
			render={(domProps) => {
				if (!("href" in domProps)) {
					return <span {...domProps} />;
				}
				if (typeof href === "object") {
					return <RouterLink {...href} {...domProps} />;
				}
				return <a {...domProps} />;
			}}
			{...props}
		/>
	);
}

export type { LinkButtonProps };
export { LinkButton };
