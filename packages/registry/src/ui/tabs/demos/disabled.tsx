import { Tab, TabList, TabPanel, Tabs } from "@dotui/registry/ui/tabs";

export default function Demo() {
	return (
		<div className="space-y-8">
			<Tabs isDisabled>
				<TabList>
					<Tab id="overview">Overview</Tab>
					<Tab id="usage">Usage</Tab>
					<Tab id="settings">Settings</Tab>
				</TabList>
				<TabPanel id="overview">Overview content</TabPanel>
				<TabPanel id="usage">Usage content</TabPanel>
				<TabPanel id="settings">Settings content</TabPanel>
			</Tabs>
			<Tabs>
				<TabList>
					<Tab id="overview">Overview</Tab>
					<Tab id="usage">Usage</Tab>
					<Tab id="settings" isDisabled>
						Settings
					</Tab>
				</TabList>
				<TabPanel id="overview">Overview content</TabPanel>
				<TabPanel id="usage">Usage content</TabPanel>
				<TabPanel id="settings">Settings content</TabPanel>
			</Tabs>
		</div>
	);
}
