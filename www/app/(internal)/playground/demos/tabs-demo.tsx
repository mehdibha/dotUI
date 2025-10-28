"use client";

import { Tab, TabList, TabPanel, Tabs } from "@dotui/registry-v2/ui/tabs";

export function TabsDemo() {
  return (
    <div className="flex flex-col gap-8">
      <Tabs orientation="horizontal">
        <TabList>
          <Tab id="overview">Overview</Tab>
          <Tab id="features">Features</Tab>
          <Tab id="pricing">Pricing</Tab>
          <Tab id="docs">Documentation</Tab>
        </TabList>
        <TabPanel id="overview">overview content</TabPanel>
        <TabPanel id="features">features content</TabPanel>
        <TabPanel id="pricing">pricing content</TabPanel>
        <TabPanel id="docs">docs content</TabPanel>
      </Tabs>

      <Tabs orientation="vertical">
        <TabList>
          <Tab id="overview">Overview</Tab>
          <Tab id="features">Features</Tab>
          <Tab id="pricing">Pricing</Tab>
          <Tab id="docs">Documentation</Tab>
        </TabList>
        <TabPanel id="overview">overview content</TabPanel>
        <TabPanel id="features">features content</TabPanel>
        <TabPanel id="pricing">pricing content</TabPanel>
        <TabPanel id="docs">docs content</TabPanel>
      </Tabs>
    </div>
  );
}
