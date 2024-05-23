"use client";

import * as React from "react";
import {
  Tabs as AriaTabs,
  TabList as AriaTabList,
  Tab as AriaTab,
  TabPanel as AriaTabPanel,
  type TabsProps as AriaTabsProps,
  type TabListProps as AriaTabListProps,
  type TabProps as AriaTabProps,
  type TabPanelProps as AriaTabPanelProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { focusRing } from "@/lib/utils/styles";

const tabsStyles = tv({
  slots: {
    root: "",
    list: "flex items-center border-b",
    item: [
      focusRing(),
      "cursor-pointer text-fg-muted border-transparent border-b-2 selected:border-border-focus selected:text-fg -mb-px px-3 py-2 text-sm font-medium transition-[border,color]",
    ],
    panel: "p-2",
  },
});

interface TabsRootProps extends Omit<AriaTabsProps, "className"> {
  className?: string;
}
const TabsRoot = AriaTabs;

interface TabsListProps<T> extends Omit<AriaTabListProps<T>, "className"> {
  className?: string;
}
const TabsList = <T extends object>({ className, ...props }: TabsListProps<T>) => {
  const { list } = tabsStyles();
  return <AriaTabList className={list({ className })} {...props} />;
};

interface TabsItemProps extends Omit<AriaTabProps, "className"> {
  className?: string;
}
const TabsItem = React.forwardRef<React.ElementRef<typeof AriaTab>, TabsItemProps>(
  ({ className, ...props }, ref) => {
    const { item } = tabsStyles();
    return <AriaTab ref={ref} className={item({ className })} {...props} />;
  }
);
TabsItem.displayName = "TabsItem";

interface TabsPanelProps extends Omit<AriaTabPanelProps, "className"> {
  className?: string;
}
const TabsPanel = React.forwardRef<React.ElementRef<typeof AriaTabPanel>, TabsPanelProps>(
  ({ className, ...props }, ref) => {
    const { panel } = tabsStyles();
    return <AriaTabPanel ref={ref} className={panel({ className })} {...props} />;
  }
);
TabsPanel.displayName = "TabsPanel";

export type { TabsRootProps, TabsListProps, TabsItemProps, TabsPanelProps };
export { TabsRoot, TabsList, TabsItem, TabsPanel };
