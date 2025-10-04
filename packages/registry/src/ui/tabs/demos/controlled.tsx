"use client";

import React from "react";
import type { Key } from "react-aria-components";

import { Tab, TabList, TabPanel, Tabs } from "@dotui/registry/ui/tabs";

export default function Demo() {
  const [selectedTab, setSelectedTab] = React.useState<Key>("overview");
  return (
    <div className="flex flex-col items-center gap-6">
      <Tabs selectedKey={selectedTab} onSelectionChange={setSelectedTab}>
        <TabList>
          <Tab id="overview">Overview</Tab>
          <Tab id="usage">Usage</Tab>
          <Tab id="settings">Settings</Tab>
        </TabList>
        <TabPanel id="overview">Overview content</TabPanel>
        <TabPanel id="usage">Usage content</TabPanel>
        <TabPanel id="settings">Settings content</TabPanel>
      </Tabs>
      <p className="text-sm text-fg-muted">
        Selected tab: <span className="font-bold text-fg">{selectedTab}</span>
      </p>
    </div>
  );
}
