import { useCallback, useSyncExternalStore } from "react";

import { Tab, TabList, TabPanel, Tabs } from "@dotui/registry/ui/tabs";
import type { TabListProps, TabPanelProps, TabProps, TabsProps } from "@dotui/registry/ui/tabs";

type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

const STORAGE_KEY = "dotui-package-manager";
const DEFAULT_VALUE: PackageManager = "pnpm";

const listeners = new Set<() => void>();

function getSnapshot(): PackageManager {
	if (typeof window === "undefined") return DEFAULT_VALUE;
	return (localStorage.getItem(STORAGE_KEY) as PackageManager) || DEFAULT_VALUE;
}

function getServerSnapshot(): PackageManager {
	return DEFAULT_VALUE;
}

function subscribe(callback: () => void) {
	listeners.add(callback);

	const handleStorage = (e: StorageEvent) => {
		if (e.key === STORAGE_KEY) callback();
	};
	window.addEventListener("storage", handleStorage);

	return () => {
		listeners.delete(callback);
		window.removeEventListener("storage", handleStorage);
	};
}

function setPackageManager(value: PackageManager) {
	localStorage.setItem(STORAGE_KEY, value);
	listeners.forEach((listener) => {
		listener();
	});
}

function usePackageManager() {
	const packageManager = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
	const set = useCallback((value: PackageManager) => setPackageManager(value), []);
	return [packageManager, set] as const;
}

export function CodeBlockTabs({
	groupId,
	defaultValue,
	children,
	...props
}: Omit<TabsProps, "defaultSelectedKey"> & { groupId?: string; defaultValue?: string }) {
	const [packageManager, setPackageManager] = usePackageManager();

	return (
		<Tabs
			className="mt-4 gap-0"
			defaultSelectedKey={defaultValue}
			{...props}
			{...(groupId
				? {
						selectedKey: packageManager,
						onSelectionChange: (key) => setPackageManager(key as PackageManager),
					}
				: {})}
		>
			{children}
		</Tabs>
	);
}

export function CodeBlockTabsList(props: TabListProps) {
	return <TabList className="rounded-t-md border bg-muted" {...props} />;
}

export function CodeBlockTabsTrigger({ value, ...props }: Omit<TabProps, "id"> & { value?: string }) {
	return <Tab className="px-3" id={value} {...props} />;
}

export function CodeBlockTab({ value, ...props }: Omit<TabPanelProps, "id"> & { value?: string }) {
	return (
		<TabPanel
			id={value}
			className="*:[figure]:mx-0 *:[figure]:mt-0 *:[figure]:rounded-t-none *:[figure]:border-t-0"
			{...props}
		/>
	);
}
