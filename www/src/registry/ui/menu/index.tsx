import { routerLinkProps } from "@/lib/router-link"
import type { RouterHref } from "@/lib/router-link"

import { MenuItem as MenuItemPrimitive } from "./base"
import type { MenuItemProps as BaseMenuItemProps } from "./base"

export {
  Menu,
  MenuContent,
  MenuItemDescription,
  MenuItemLabel,
  MenuSection,
  MenuSectionHeader,
  MenuSub,
} from "./base"
export type {
  MenuContentProps,
  MenuItemDescriptionProps,
  MenuItemLabelProps,
  MenuProps,
  MenuSectionHeaderProps,
  MenuSectionProps,
  MenuSubProps,
} from "./base"

type MenuItemProps<T> = Omit<BaseMenuItemProps<T>, "href"> & {
  href?: RouterHref
}

function MenuItem<T extends object>({ href, ...props }: MenuItemProps<T>) {
  return <MenuItemPrimitive {...routerLinkProps(href, "div")} {...props} />
}

export type { MenuItemProps }
export { MenuItem }
