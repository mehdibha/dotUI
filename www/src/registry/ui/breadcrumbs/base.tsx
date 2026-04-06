"use client";

import { ChevronRightIcon } from "lucide-react";
import {
	Breadcrumb as AriaBreadcrumb,
	Breadcrumbs as AriaBreadcrumbs,
	Link as AriaLink,
	composeRenderProps,
} from "react-aria-components";
import type { BreadcrumbsProps as AriaBreadcrumbsProps } from "react-aria-components";

import { useStyles } from "./styles";

// MARK: breadcrumbsStyles

interface BreadcrumbsProps<T extends object> extends AriaBreadcrumbsProps<T> {
	ref?: React.RefObject<HTMLOListElement>;
}
const Breadcrumbs = <T extends object>({ className, ...props }: BreadcrumbsProps<T>) => {
	const { root } = useStyles()();
	return <AriaBreadcrumbs className={root({ className })} {...props} />;
};

type BreadcrumbProps = BreadcrumbItemProps & Omit<BreadcrumbLinkProps, "children">;
const Breadcrumb = ({ ref, children, ...props }: BreadcrumbProps) => {
	return (
		<BreadcrumbItem ref={ref} {...props}>
			{composeRenderProps(children, (children, { isCurrent }) => (
				<>
					<BreadcrumbLink {...props}>{children}</BreadcrumbLink>
					{!isCurrent && <ChevronRightIcon />}
				</>
			))}
		</BreadcrumbItem>
	);
};

interface BreadcrumbItemProps extends React.ComponentProps<typeof AriaBreadcrumb> {}
const BreadcrumbItem = ({ className, ...props }: BreadcrumbItemProps) => {
	const { item } = useStyles()();
	return <AriaBreadcrumb className={composeRenderProps(className, (className) => item({ className }))} {...props} />;
};

interface BreadcrumbLinkProps extends React.ComponentProps<typeof AriaLink> {}
const BreadcrumbLink = ({ className, ...props }: BreadcrumbLinkProps) => {
	const { link } = useStyles()();
	return <AriaLink className={composeRenderProps(className, (className) => link({ className }))} {...props} />;
};

export type { BreadcrumbItemProps, BreadcrumbLinkProps, BreadcrumbProps, BreadcrumbsProps };
export { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Breadcrumbs };
