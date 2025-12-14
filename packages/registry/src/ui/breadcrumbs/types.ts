import type {
  Breadcrumb as AriaBreadcrumb,
  BreadcrumbsProps as AriaBreadcrumbsProps,
  Link as AriaLink,
} from "react-aria-components";

/**
 * Breadcrumbs display a hierarchy of links to the current page or resource in an application.
 */
export interface BreadcrumbsProps<T extends object>
  extends AriaBreadcrumbsProps<T> {
  ref?: React.RefObject<HTMLOListElement>;
}

/**
 * A Breadcrumb represents an individual item in a Breadcrumbs list.
 */
export interface BreadcrumbItemProps
  extends React.ComponentProps<typeof AriaBreadcrumb> {}

/**
 * A link allows a user to navigate to another page or resource within a web page or application.
 */
export interface BreadcrumbLinkProps
  extends React.ComponentProps<typeof AriaLink> {}

export type BreadcrumbProps = BreadcrumbItemProps &
  Omit<BreadcrumbLinkProps, "children">;
