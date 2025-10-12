"use client";

import { Tabs } from "@dotui/registry-v2/ui/tabs";

export function TabsDemo() {
  return (
    <div className="flex flex-col gap-8">
      <Tabs orientation="horizontal">
        <Tabs.List>
          <Tabs.Tab id="overview">Overview</Tabs.Tab>
          <Tabs.Tab id="features">Features</Tabs.Tab>
          <Tabs.Tab id="pricing">Pricing</Tabs.Tab>
          <Tabs.Tab id="docs">Documentation</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel id="overview">overview content</Tabs.Panel>
        <Tabs.Panel id="features">features content</Tabs.Panel>
        <Tabs.Panel id="pricing">pricing content</Tabs.Panel>
        <Tabs.Panel id="docs">docs content</Tabs.Panel>
      </Tabs>

      <Tabs orientation="vertical">
        <Tabs.List>
          <Tabs.Tab id="overview">Overview</Tabs.Tab>
          <Tabs.Tab id="features">Features</Tabs.Tab>
          <Tabs.Tab id="pricing">Pricing</Tabs.Tab>
          <Tabs.Tab id="docs">Documentation</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel id="overview">overview content</Tabs.Panel>
        <Tabs.Panel id="features">features content</Tabs.Panel>
        <Tabs.Panel id="pricing">pricing content</Tabs.Panel>
        <Tabs.Panel id="docs">docs content</Tabs.Panel>
      </Tabs>
    </div>
  );
}
