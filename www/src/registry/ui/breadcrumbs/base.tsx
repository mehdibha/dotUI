"use client";

import { Link as RouterLink, type ToOptions } from "@tanstack/react-router";
import { ChevronRightIcon } from "lucide-react";
import * as BreadcrumbsPrimitives from "react-aria-components/Breadcrumbs";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as LinkPrimitives from "react-aria-components/Link";


import { useStyles } from "./styles";

// MARK: breadcrumbsStyles

interface BreadcrumbsProps<T extends object> extends BreadcrumbsPrimitives.BreadcrumbsProps<T> {
	ref?: React.RefObject<HTMLOListElement>;
}
const Breadcrumbs = <T extends object>({ className, ...props }: BreadcrumbsProps<T>) => {
	const { root } = useStyles()();
	return <BreadcrumbsPrimitives.Breadcrumbs className={root({ className })} {...props} />;
};

// MARK: seperator

interface BreadcrumbItemProps extends React.ComponentProps<typeof BreadcrumbsPrimitives.Breadcrumb> {}
const BreadcrumbItem = ({ className, ...props }: BreadcrumbItemProps) => {
	const { item } = useStyles()();
	return <BreadcrumbsPrimitives.Breadcrumb className={composeRenderProps(className, (className) => item({ className }))} {...props} />;
};

// MARK: seperator

interface BreadcrumbLinkProps extends React.ComponentProps<typeof LinkPrimitives.Link> {}
const BreadcrumbLink = ({ className, ...props }: BreadcrumbLinkProps) => {
	const { link } = useStyles()();
	return <LinkPrimitives.Link className={composeRenderProps(className, (className) => link({ className }))} {...props} />;
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
