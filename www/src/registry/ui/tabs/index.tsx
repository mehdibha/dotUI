import { Link as RouterLink } from "@tanstack/react-router";
import type { ToOptions } from "@tanstack/react-router";

import { Tab as TabPrimitive } from "./base";

import type { TabProps as BaseTabProps } from "./base";

export { TabIndicator, TabList, TabPanel, Tabs } from "./base";
export type { TabIndicatorProps, TabListProps, TabPanelProps, TabsProps } from "./base";

type TabProps = Omit<BaseTabProps, "href"> & { href?: string | ToOptions };

function Tab({ href, ...props }: TabProps) {
	// Only pass `href`/`render` for actual links: an explicit `href={undefined}`
	// still counts as a link prop to react-aria (`'href' in props`), which turns
	// every plain tab into an <a href="">.
	const hrefString = typeof href === "object" ? href.to : href;
	if (!hrefString) {
		return <TabPrimitive {...props} />;
	}
	return (
		<TabPrimitive
			href={hrefString}
			render={(domProps) => {
				// The `in` check narrows the div|anchor props union; render is only
				// passed for links, so the div branch is a type-level fallback.
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
