"use client";

import { Tab, TabList, TabPanel, Tabs, type TabsProps } from "@/registry/ui/tabs";

export default function Demo({ orientation = "horizontal", isDisabled = false }: TabsProps = {}) {
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
