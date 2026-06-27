'use client'

import { Tab, TabList, TabPanel, Tabs } from '@/registry/ui/tabs'

import { useStepAutoplay } from '../autoplay'

const KEYS = ['overview', 'usage', 'settings']

export function TabsDemo() {
  const { index } = useStepAutoplay(KEYS.length, { dwell: 1300 })
  return (
    <Tabs selectedKey={KEYS[index]} onSelectionChange={() => {}}>
      <TabList>
        <Tab id="overview">Overview</Tab>
        <Tab id="usage">Usage</Tab>
        <Tab id="settings">Settings</Tab>
      </TabList>
      <TabPanel id="overview">Overview content</TabPanel>
      <TabPanel id="usage">Usage content</TabPanel>
      <TabPanel id="settings">Settings content</TabPanel>
    </Tabs>
  )
}
