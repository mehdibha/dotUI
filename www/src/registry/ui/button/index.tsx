import { routerLinkProps } from "@/lib/router-link"
import type { RouterHref } from "@/lib/router-link"

import { LinkButton as LinkButtonPrimitive } from "./base"
import type { LinkButtonProps as BaseLinkButtonProps } from "./base"

export { Button } from "./base"
export type { ButtonProps } from "./base"
export { buttonStyles } from "./styles"

type LinkButtonProps = Omit<BaseLinkButtonProps, "href"> & {
  href?: RouterHref
}

function LinkButton({ href, ...props }: LinkButtonProps) {
  return <LinkButtonPrimitive {...routerLinkProps(href)} {...props} />
}

export type { LinkButtonProps }
export { LinkButton }
