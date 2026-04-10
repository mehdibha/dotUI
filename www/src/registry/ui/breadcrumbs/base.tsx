"use client";

import { Link as RouterLink, type ToOptions } from "@tanstack/react-router";
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

// MARK: seperator

interface BreadcrumbItemProps extends React.ComponentProps<typeof AriaBreadcrumb> {}
const BreadcrumbItem = ({ className, ...props }: BreadcrumbItemProps) => {
	const { item } = useStyles()();
	return <AriaBreadcrumb className={composeRenderProps(className, (className) => item({ className }))} {...props} />;
};

// MARK: seperator

interface BreadcrumbLinkProps extends React.ComponentProps<typeof AriaLink> {}
const BreadcrumbLink = ({ className, ...props }: BreadcrumbLinkProps) => {
	const { link } = useStyles()();
	return <AriaLink className={composeRenderProps(className, (className) => link({ className }))} {...props} />;
};

// MARK: seperator

interface BreadcrumbSeparatorProps extends React.ComponentProps<"span"> {}
const BreadcrumbSeparator = ({ children, className, ...props }: BreadcrumbSeparatorProps) => {
	const { separator } = useStyles()();
	return (
		<span data-breadcrumb-separator="" aria-hidden="true" className={separator({ className })} {...props}>
			{children ?? <ChevronRightIcon />}
		</span>
	);
};

// MARK: seperator

export type { BreadcrumbItemProps, BreadcrumbLinkProps, BreadcrumbSeparatorProps, BreadcrumbsProps };
export { BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, Breadcrumbs };
