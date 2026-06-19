import { Tab, TabList, TabPanel, Tabs } from 'www'

const panel: React.CSSProperties = { paddingTop: 12 }

export const Default = () => (
  <Tabs style={{ width: 380 }}>
    <TabList>
      <Tab id="overview">Overview</Tab>
      <Tab id="usage">Usage</Tab>
      <Tab id="settings">Settings</Tab>
    </TabList>
    <TabPanel id="overview" style={panel}>
      A high-level summary of your project and its recent activity.
    </TabPanel>
    <TabPanel id="usage" style={panel}>
      Usage metrics and quota for the current billing period.
    </TabPanel>
    <TabPanel id="settings" style={panel}>
      Manage configuration, members, and integrations.
    </TabPanel>
  </Tabs>
)

export const LineVariant = () => (
  <Tabs style={{ width: 380 }}>
    <TabList variant="line">
      <Tab id="overview">Overview</Tab>
      <Tab id="usage">Usage</Tab>
      <Tab id="settings">Settings</Tab>
    </TabList>
    <TabPanel id="overview" style={panel}>
      A high-level summary of your project and its recent activity.
    </TabPanel>
    <TabPanel id="usage" style={panel}>
      Usage metrics and quota for the current billing period.
    </TabPanel>
    <TabPanel id="settings" style={panel}>
      Manage configuration, members, and integrations.
    </TabPanel>
  </Tabs>
)
