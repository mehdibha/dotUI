"use client";

import React from "react";

import { createDynamicComponent } from "@dotui/registry/__internal__/helpers/create-dynamic-component";

import {
  Tab as _Tab,
  TabList as _TabList,
  TabPanel as _TabPanel,
  Tabs as _Tabs,
} from "./basic";
import type { TabListProps, TabPanelProps, TabProps, TabsProps } from "./basic";

export const Tabs = createDynamicComponent<TabsProps>("tabs", "Tabs", _Tabs, {
  motion: React.lazy(() =>
    import("./motion").then((mod) => ({
      default: mod.Tabs,
    })),
  ),
});

export const TabList = <T extends object = object>(props: TabListProps<T>) => {
  const Component = createDynamicComponent<TabListProps<T>>(
    "tabs",
    "TabList",
    _TabList,
    {
      motion: React.lazy(() =>
        import("./motion").then((mod) => ({
          default: mod.TabList,
        })),
      ),
    },
  );

  return <Component {...props} />;
};

export const Tab = createDynamicComponent<TabProps>("tabs", "Tab", _Tab, {
  motion: React.lazy(() =>
    import("./motion").then((mod) => ({
      default: mod.Tab,
    })),
  ),
});

export const TabPanel = createDynamicComponent<TabPanelProps>(
  "tabs",
  "TabPanel",
  _TabPanel,
  {
    motion: React.lazy(() =>
      import("./motion").then((mod) => ({
        default: mod.TabPanel,
      })),
    ),
  },
);

export type { TabsProps, TabListProps, TabProps, TabPanelProps };
