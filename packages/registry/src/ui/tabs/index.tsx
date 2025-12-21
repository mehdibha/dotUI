"use client";

import { createDynamicComponent } from "@dotui/core/react/dynamic-component";

import * as Default from "./basic";
import type { TabListProps, TabPanelProps, TabProps, TabsProps } from "./types";

export const Tabs = createDynamicComponent<TabsProps>("tabs", "Tabs", Default.Tabs, {
	// Future variants will be added here
});

export const TabList = createDynamicComponent<TabListProps>("tabs", "TabList", Default.TabList, {
	// Future variants will be added here
});

export const Tab = createDynamicComponent<TabProps>("tabs", "Tab", Default.Tab, {
	// Future variants will be added here
});

export const TabPanel = createDynamicComponent<TabPanelProps>("tabs", "TabPanel", Default.TabPanel, {
	// Future variants will be added here
});

export type { TabsProps, TabListProps, TabProps, TabPanelProps };
