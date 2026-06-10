import { Link as RouterLink } from "@tanstack/react-router";
import type { ToOptions } from "@tanstack/react-router";

import { Link as LinkPrimitive } from "./base";

import type { LinkProps as BaseLinkProps } from "./base";

type LinkProps = Omit<BaseLinkProps, "href"> & { href?: string | ToOptions };

function Link({ href, ...props }: LinkProps) {
	// Only pass `href`/`render` for actual links: an explicit `href={undefined}`
	// still counts as a link prop to react-aria (`'href' in props`), which turns
	// a plain link into an <a href="">.
	const hrefString = typeof href === "object" ? href.to : href;
	if (!hrefString) {
		return <LinkPrimitive {...props} />;
	}
	// react-aria renders a disabled Link as a <span> natively; skip the custom
	// render so the expected element type matches.
	if (props.isDisabled) {
		return <LinkPrimitive href={hrefString} {...props} />;
	}
	return (
		<LinkPrimitive
			href={hrefString}
			render={(domProps) => {
				// The `in` check narrows the span|anchor props union; render is only
				// passed for links, so the span branch is a type-level fallback.
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
