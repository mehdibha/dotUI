"use client";

import React from "react";
import {
  Tabs as _Tabs,
  TabList as _TabList,
  Tab as _Tab,
  TabPanel as _TabPanel,
} from "@/registry/core/tabs_basic";
import type {
  TabsProps,
  TabListProps,
  TabProps,
  TabPanelProps,
} from "@/registry/core/tabs_basic";
import { createDynamicComponent } from "@/modules/themes/lib/create-dynamic-component";

export const Tabs = createDynamicComponent<TabsProps>("tabs", "Tabs", _Tabs, {
  motion: React.lazy(() =>
    import("@/registry/core/tabs_motion").then((mod) => ({
      default: mod.Tabs,
    }))
  ),
});

export const TabList = createDynamicComponent<TabListProps<object>>(
  "tabs",
  "TabList",
  _TabList,
  {
    motion: React.lazy(() =>
      import("@/registry/core/tabs_motion").then((mod) => ({
        default: mod.TabList,
      }))
    ),
  }
);

export const Tab = createDynamicComponent<TabProps>("tabs", "Tab", _Tab, {
  motion: React.lazy(() =>
    import("@/registry/core/tabs_motion").then((mod) => ({
      default: mod.Tab,
    }))
  ),
});

export const TabPanel = createDynamicComponent<TabPanelProps>(
  "tabs",
  "TabPanel",
  _TabPanel,
  {
    motion: React.lazy(() =>
      import("@/registry/core/tabs_motion").then((mod) => ({
        default: mod.TabPanel,
      }))
    ),
  }
);
