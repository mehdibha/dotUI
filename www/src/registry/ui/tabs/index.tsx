import { Link as RouterLink } from "@tanstack/react-router";
import type { ToOptions } from "@tanstack/react-router";

import { Tab as TabPrimitive } from "./base";

import type { TabProps as BaseTabProps } from "./base";

export { TabIndicator, TabList, TabPanel, Tabs } from "./base";
export type { TabIndicatorProps, TabListProps, TabPanelProps, TabsProps } from "./base";

type TabProps = Omit<BaseTabProps, "href"> & { href?: string | ToOptions };

function Tab({ href, ...props }: TabProps) {
	return (
		<TabPrimitive
			href={href == null ? undefined : typeof href === "object" ? href.to : href}
			render={(domProps) => {
				if (!("href" in domProps)) {
					return <div {...domProps} />;
				}
				if (typeof href === "object") {
					return <RouterLink {...href} {...domProps} />;
				}
				return <a {...domProps} />;
			}}
			{...props}
		/>
	);
}

export type { TabProps };
export { Tab };
