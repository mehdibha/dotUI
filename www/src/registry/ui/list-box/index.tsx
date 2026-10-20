import { routerLinkProps } from "@/lib/router-link"
import type { RouterHref } from "@/lib/router-link"

import { ListBoxItem as ListBoxItemPrimitive } from "./base"
import type { ListBoxItemProps as BaseListBoxItemProps } from "./base"

export {
  ListBox,
  ListBoxItemDescription,
  ListBoxItemLabel,
  ListBoxSection,
  ListBoxSectionHeader,
  ListBoxVirtualizer,
} from "./base"
export type {
  ListBoxItemDescriptionProps,
  ListBoxItemLabelProps,
  ListBoxProps,
  ListBoxSectionHeaderProps,
  ListBoxSectionProps,
  ListBoxVirtualizerProps,
} from "./base"

type ListBoxItemProps<T> = Omit<BaseListBoxItemProps<T>, "href"> & {
  href?: RouterHref
}

function ListBoxItem<T extends object>({
  href,
  ...props
}: ListBoxItemProps<T>) {
  return <ListBoxItemPrimitive {...routerLinkProps(href, "div")} {...props} />
}

export type { ListBoxItemProps }
export { ListBoxItem }
