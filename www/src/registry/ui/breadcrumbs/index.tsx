import { routerLinkProps } from "@/lib/router-link"
import type { RouterHref } from "@/lib/router-link"

import { BreadcrumbLink as BreadcrumbLinkPrimitive } from "./base"
import type { BreadcrumbLinkProps } from "./base"

export { BreadcrumbItem, BreadcrumbSeparator, Breadcrumbs } from "./base"
export type {
  BreadcrumbItemProps,
  BreadcrumbSeparatorProps,
  BreadcrumbsProps,
} from "./base"

export function BreadcrumbLink({
  href,
  ...props
}: Omit<BreadcrumbLinkProps, "href"> & { href?: RouterHref }) {
  return <BreadcrumbLinkPrimitive {...routerLinkProps(href)} {...props} />
}
