import { routerLinkProps } from "@/lib/router-link"
import type { RouterHref } from "@/lib/router-link"

import { Tab as TabPrimitive } from "./base"
import type { TabProps as BaseTabProps } from "./base"

export { TabIndicator, TabList, TabPanel, Tabs } from "./base"
export type {
  TabIndicatorProps,
  TabListProps,
  TabPanelProps,
  TabsProps,
} from "./base"

type TabProps = Omit<BaseTabProps, "href"> & { href?: RouterHref }

function Tab({ href, ...props }: TabProps) {
  return <TabPrimitive {...routerLinkProps(href, "div")} {...props} />
}

export type { TabProps }
export { Tab }
