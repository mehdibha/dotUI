import { Tabs, TabList, TabPanel, Tab } from "@/components/dynamic-core/tabs";

export default function Demo() {
  return (
    <Tabs orientation="vertical" className="[&_[role=tabpanel]]:w-36">
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
