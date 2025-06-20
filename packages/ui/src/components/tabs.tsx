"use client";

import type {
  TabListProps,
  TabPanelProps,
  TabProps,
  TabsProps,
} from "@/__registry__/components/tabs/basic";
import React from "react";
import {
  Tab as _Tab,
  TabList as _TabList,
  TabPanel as _TabPanel,
  Tabs as _Tabs,
} from "@/__registry__/components/tabs/basic";
import { createDynamicComponent } from "@/internal/create-dynamic-component";

export const Tabs = createDynamicComponent<TabsProps>("tabs", "Tabs", _Tabs, {
  motion: React.lazy(() =>
    import("@/__registry__/components/tabs/motion").then((mod) => ({
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
      import("@/__registry__/components/tabs/motion").then((mod) => ({
        default: mod.TabList,
      })),
    ),
  },
);

export const Tab = createDynamicComponent<TabProps>("tabs", "Tab", _Tab, {
  motion: React.lazy(() =>
    import("@/__registry__/components/tabs/motion").then((mod) => ({
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
      import("@/__registry__/components/tabs/motion").then((mod) => ({
        default: mod.TabPanel,
      })),
    ),
  },
);
