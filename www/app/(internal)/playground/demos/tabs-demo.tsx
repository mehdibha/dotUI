"use client";

import { Tab, TabList, TabPanel, Tabs } from "@dotui/registry-v2/ui/tabs";

export function TabsDemo() {
  return (
    <div className="flex flex-col gap-8">
      <Tabs>
        <TabList>
          <Tab id="overview">Overview</Tab>
          <Tab id="features">Features</Tab>
          <Tab id="pricing">Pricing</Tab>
          <Tab id="docs">Documentation</Tab>
        </TabList>
        <TabPanel id="overview">
          <div className="py-4">
            <h3 className="mb-2 text-lg font-medium">Overview</h3>
            <p className="text-sm text-fg-muted">
              This is the overview section with important information about the
              product.
            </p>
          </div>
        </TabPanel>
        <TabPanel id="features">
          <div className="py-4">
            <h3 className="mb-2 text-lg font-medium">Features</h3>
            <p className="text-sm text-fg-muted">
              Explore all the amazing features available in this product.
            </p>
          </div>
        </TabPanel>
        <TabPanel id="pricing">
          <div className="py-4">
            <h3 className="mb-2 text-lg font-medium">Pricing</h3>
            <p className="text-sm text-fg-muted">
              Check out our competitive pricing plans.
            </p>
          </div>
        </TabPanel>
        <TabPanel id="docs">
          <div className="py-4">
            <h3 className="mb-2 text-lg font-medium">Documentation</h3>
            <p className="text-sm text-fg-muted">
              Read the comprehensive documentation to get started.
            </p>
          </div>
        </TabPanel>
      </Tabs>

      <Tabs variant="solid">
        <TabList>
          <Tab id="account">Account</Tab>
          <Tab id="security">Security</Tab>
          <Tab id="notifications">Notifications</Tab>
        </TabList>
        <TabPanel id="account">Account settings content</TabPanel>
        <TabPanel id="security">Security settings content</TabPanel>
        <TabPanel id="notifications">Notification preferences</TabPanel>
      </Tabs>

      <Tabs color="primary" variant="underline">
        <TabList>
          <Tab id="all">All</Tab>
          <Tab id="active">Active</Tab>
          <Tab id="completed">Completed</Tab>
        </TabList>
        <TabPanel id="all">All items</TabPanel>
        <TabPanel id="active">Active items</TabPanel>
        <TabPanel id="completed">Completed items</TabPanel>
      </Tabs>

      <Tabs orientation="vertical">
        <TabList>
          <Tab id="general">General</Tab>
          <Tab id="advanced">Advanced</Tab>
          <Tab id="danger">Danger Zone</Tab>
        </TabList>
        <TabPanel id="general">General settings</TabPanel>
        <TabPanel id="advanced">Advanced configuration</TabPanel>
        <TabPanel id="danger">Dangerous actions</TabPanel>
      </Tabs>
    </div>
  );
}
