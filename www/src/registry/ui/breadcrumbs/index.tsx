import { Link as RouterLink } from "@tanstack/react-router";
import type { ToOptions } from "@tanstack/react-router";

import { BreadcrumbLink as BreadcrumbLinkPrimitive } from "./base";

import type { BreadcrumbLinkProps } from "./base";

export { BreadcrumbItem, BreadcrumbSeparator, Breadcrumbs } from "./base";
export type { BreadcrumbItemProps, BreadcrumbSeparatorProps, BreadcrumbsProps } from "./base";

export function BreadcrumbLink({ href, ...props }: Omit<BreadcrumbLinkProps, "href"> & { href?: string | ToOptions }) {
	return (
		<BreadcrumbLinkPrimitive
			href={typeof href === "object" ? href.to : href}
			render={({ ref, ...domProps }) => {
				if (typeof href === "object") {
					return <RouterLink ref={ref as React.Ref<HTMLAnchorElement>} {...href} {...domProps} />;
				}
				if (typeof href === "string") {
					return <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} {...domProps} />;
				}
				return <span ref={ref} {...domProps} />;
			}}
			{...props}
		/>
	);
}
