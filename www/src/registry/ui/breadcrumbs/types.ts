import type * as BreadcrumbsPrimitives from "react-aria-components/Breadcrumbs";
import type * as LinkPrimitives from "react-aria-components/Link";

/**
 * Breadcrumbs display a hierarchy of links to the current page or resource in an application.
 */
export interface BreadcrumbsProps<T extends object> extends BreadcrumbsPrimitives.BreadcrumbsProps<T> {
	ref?: React.RefObject<HTMLOListElement>;
}

/**
 * A Breadcrumb represents an individual item in a Breadcrumbs list.
 */
export interface BreadcrumbItemProps extends React.ComponentProps<typeof BreadcrumbsPrimitives.Breadcrumb> {}

/**
 * A link allows a user to navigate to another page or resource within a web page or application.
 */
export interface BreadcrumbLinkProps extends React.ComponentProps<typeof LinkPrimitives.Link> {}

/**
 * A separator visually divides breadcrumb items.
 */
export interface BreadcrumbSeparatorProps extends React.ComponentProps<"span"> {}
