"use client";

import React from "react";

import type {
  TabListProps,
  TabPanelProps,
  TabProps,
  TabsProps,
} from "../registry/components/tabs/basic";
import { createDynamicComponent } from "../internal/create-dynamic-component";
import {
  Tab as _Tab,
  TabList as _TabList,
  TabPanel as _TabPanel,
  Tabs as _Tabs,
} from "../registry/components/tabs/basic";

export const Tabs = createDynamicComponent<TabsProps>("tabs", "Tabs", _Tabs, {
  motion: React.lazy(() =>
    import("../registry/components/tabs/motion").then((mod) => ({
      default: mod.Tabs,
    })),
  ),
});

export const TabList = createDynamicComponent<TabListProps<object>>(
  "tabs",
  "TabList",
  _TabList,
  {
    motion: React.lazy(() =>
      import("../registry/components/tabs/motion").then((mod) => ({
        default: mod.TabList,
      })),
    ),
  },
);

export const Tab = createDynamicComponent<TabProps>("tabs", "Tab", _Tab, {
  motion: React.lazy(() =>
    import("../registry/components/tabs/motion").then((mod) => ({
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
      import("../registry/components/tabs/motion").then((mod) => ({
        default: mod.TabPanel,
      })),
    ),
  },
);

export type { TabsProps, TabListProps, TabProps, TabPanelProps };
