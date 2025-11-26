import type {
  Breadcrumb as AriaBreadcrumb,
  BreadcrumbsProps as AriaBreadcrumbsProps,
  Link as AriaLink,
} from "react-aria-components";

export interface BreadcrumbsProps<T extends object>
  extends AriaBreadcrumbsProps<T> {
  ref?: React.RefObject<HTMLOListElement>;
}

export interface BreadcrumbItemProps
  extends React.ComponentProps<typeof AriaBreadcrumb> {}

export interface BreadcrumbLinkProps
  extends React.ComponentProps<typeof AriaLink> {}

export type BreadcrumbProps = BreadcrumbItemProps &
  Omit<BreadcrumbLinkProps, "children">;

