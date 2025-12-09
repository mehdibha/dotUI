"use client";

import { Tab, TabList, TabPanel, Tabs } from "@dotui/registry/ui/tabs";
import type { TabListProps, TabPanelProps, TabProps, TabsProps } from "@dotui/registry/ui/tabs";

import { usePreferences } from "@/modules/preferences/preferences-atom";

export const CodeBlockTabs = ({ groupId, ...props }: TabsProps & { groupId?: string }) => {
	const { packageManager, setPackageManager } = usePreferences();

	return (
		<Tabs
			className="mt-4 gap-0"
			{...props}
			{...(groupId
				? {
						selectedKey: packageManager,
						onSelectionChange: (key) => setPackageManager(key as "npm" | "yarn" | "pnpm" | "bun"),
					}
				: {})}
		/>
	);
};
export const CodeBlockTabsList = (props: TabListProps) => (
	<TabList className="rounded-t-md border bg-muted" {...props} />
);

export const CodeBlockTabsTrigger = (props: TabProps) => <Tab className="px-3" {...props} />;

export const CodeBlockTab = (props: TabPanelProps) => (
	<TabPanel className="*:[figure]:mx-0 *:[figure]:mt-0 *:[figure]:rounded-t-none *:[figure]:border-t-0" {...props} />
);
