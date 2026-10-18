import { routerLinkProps } from "@/lib/router-link"
import type { RouterHref } from "@/lib/router-link"

import { Link as LinkPrimitive } from "./base"
import type { LinkProps as BaseLinkProps } from "./base"

type LinkProps = Omit<BaseLinkProps, "href"> & { href?: RouterHref }

function Link({ href, ...props }: LinkProps) {
  return <LinkPrimitive {...routerLinkProps(href)} {...props} />
}

export type { LinkProps }
export { Link }
