"use client";

import type { Control } from "@dotui/registry/playground";

import { Tab, TabList, TabPanel, Tabs } from "../index";

interface TabsPlaygroundProps {
  orientation?: "horizontal" | "vertical";
  isDisabled?: boolean;
}

export function TabsPlayground({
  orientation = "horizontal",
  isDisabled = false,
}: TabsPlaygroundProps) {
  return (
    <Tabs orientation={orientation} isDisabled={isDisabled}>
      <TabList>
        <Tab id="overview">Overview</Tab>
        <Tab id="usage">Usage</Tab>
        <Tab id="settings">Settings</Tab>
      </TabList>
      <TabPanel id="overview">Overview content</TabPanel>
      <TabPanel id="usage">Usage content</TabPanel>
      <TabPanel id="settings">Settings content</TabPanel>
    </Tabs>
  );
}

export const tabsControls: Control[] = [
  {
    type: "enum",
    name: "orientation",
    label: "Orientation",
    options: ["horizontal", "vertical"],
    defaultValue: "horizontal",
  },
  {
    type: "boolean",
    name: "isDisabled",
    label: "Disabled",
    defaultValue: false,
  },
];

