import { Link as RouterLink } from "@tanstack/react-router";
import type { ToOptions } from "@tanstack/react-router";

import { Link as LinkPrimitive } from "./base";

import type { LinkProps as BaseLinkProps } from "./base";

type LinkProps = Omit<BaseLinkProps, "href"> & { href?: string | ToOptions };

function Link({ href, ...props }: LinkProps) {
	return (
		<LinkPrimitive
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

export type { LinkProps };
export { Link };
