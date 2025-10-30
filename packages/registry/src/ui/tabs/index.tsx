"use client";

import React from "react";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";

import type { TabListProps, TabPanelProps, TabProps, TabsProps } from "./basic";
import {
  Tab as _Tab,
  TabList as _TabList,
  TabPanel as _TabPanel,
  Tabs as _Tabs,
} from "./basic";

export const Tabs = createDynamicComponent<TabsProps>("tabs", "Tabs", _Tabs, {
  // Future variants will be added here
});

export const TabList = <T extends object = object>(props: TabListProps<T>) => {
  const Component = createDynamicComponent<TabListProps<T>>(
    "tabs",
    "TabList",
    _TabList,
    {
      // Future variants will be added here
    },
  );

  return <Component {...props} />;
};

export const Tab = createDynamicComponent<TabProps>("tabs", "Tab", _Tab, {
  // Future variants will be added here
});

export const TabPanel = createDynamicComponent<TabPanelProps>(
  "tabs",
  "TabPanel",
  _TabPanel,
  {
    // Future variants will be added here
  },
);

export type { TabsProps, TabListProps, TabProps, TabPanelProps };
