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
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { focusRing } from "@/registry/ui/default/lib/focus-styles";

const tabsStyles = tv({
  slots: {
    root: "orientation-vertical:flex-row flex flex-col",
    list: "orientation-horizontal:overflow-x-auto orientation-horizontal:whitespace-nowrap orientation-horizontal:items-center orientation-horizontal:border-b orientation-vertical:flex-col orientation-vertical:border-r orientation-horizontal:[&_[role=tab]]:border-b-[3px] orientation-vertical:[&_[role=tab]]:border-r-[3px] flex",
    tab: [
      "text-fg-muted selected:border-border-focus selected:text-fg disabled:text-fg-disabled disabled:selected:border-border-disabled -mb-px cursor-pointer border-transparent px-2 py-2 text-center text-sm font-medium outline-hidden transition-colors disabled:cursor-default",
      "focus-visible:[&>span]:border-border-focus [&>span]:rounded-md [&>span]:border-2 [&>span]:border-transparent [&>span]:px-1.5 [&>span]:py-1",
    ],
    panel: [focusRing(), "rounded"],
  },
});

interface TabsProps extends Omit<AriaTabsProps, "className"> {
  className?: string;
}
const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, ...props }, ref) => {
    const { root } = tabsStyles();
    return <AriaTabs ref={ref} className={root({ className })} {...props} />;
  }
);
Tabs.displayName = "Tabs";

interface TabListProps<T> extends Omit<AriaTabListProps<T>, "className"> {
  className?: string;
}
const TabList = React.forwardRef<HTMLDivElement, TabListProps<any>>(
  <T extends object>(
    { className, ...props }: TabListProps<T>,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const { list } = tabsStyles();
    return (
      <AriaTabList
        ref={ref}
        {...props}
        className={list({ className })}
        style={{ scrollbarWidth: "none" }}
      />
    );
  }
);
TabList.displayName = "TabList";

interface TabProps extends Omit<AriaTabProps, "className"> {
  className?: string;
}
const Tab = React.forwardRef<HTMLDivElement, TabProps>(
  ({ className, ...props }, ref) => {
    const { tab } = tabsStyles();
    return (
      <AriaTab ref={ref} className={tab({ className })} {...props}>
        {composeRenderProps(props.children, (children) => (
          <span>{children}</span>
        ))}
      </AriaTab>
    );
  }
);
Tab.displayName = "Tab";

interface TabPanelProps extends Omit<AriaTabPanelProps, "className"> {
  className?: string;
}
const TabPanel = React.forwardRef<HTMLDivElement, TabPanelProps>(
  ({ className, ...props }, ref) => {
    const { panel } = tabsStyles();
    return (
      <AriaTabPanel ref={ref} className={panel({ className })} {...props} />
    );
  }
);
TabPanel.displayName = "TabPanel";

export type { TabsProps, TabListProps, TabProps, TabPanelProps };
export { Tabs, TabList, Tab, TabPanel };
