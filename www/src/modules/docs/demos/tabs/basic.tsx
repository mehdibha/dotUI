import { Tab, TabList, TabPanel, Tabs } from "@/components/dynamic-ui/tabs";

export default function Demo() {
  return (
    <Tabs>
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
