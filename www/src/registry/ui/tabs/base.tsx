"use client";

import {
	SelectionIndicator as AriaSelectionIndicator,
	Tab as AriaTab,
	TabList as AriaTabList,
	TabPanel as AriaTabPanel,
	Tabs as AriaTabs,
	composeRenderProps,
} from "react-aria-components";
import type * as React from "react";

import { createContext } from "@/registry/lib/context";

import { useStyles } from "./styles";

// MARK: tabsStyles

// MARK: seperator

const [TabsProvider, useTabsContext] = createContext<TabsProps["orientation"]>({
	name: "TabsContext",
});

// MARK: seperator

interface TabsProps extends React.ComponentProps<typeof AriaTabs> {}

const Tabs = ({ className, ...props }: TabsProps) => {
	const { root } = useStyles()();
	return (
		<AriaTabs
			className={composeRenderProps(className, (cn, { orientation }) => root({ orientation, className: cn }))}
			{...props}
		>
			{composeRenderProps(props.children, (children, { orientation }) => (
				<TabsProvider value={orientation}>{children}</TabsProvider>
			))}
		</AriaTabs>
	);
};

// MARK: seperator

interface TabListProps extends React.ComponentProps<typeof AriaTabList> {}

const TabList = ({ className, ...props }: TabListProps) => {
	const { list } = useStyles()();
	return (
		<AriaTabList
			className={composeRenderProps(className, (cn, { orientation }) => list({ orientation, className: cn }))}
			{...props}
		/>
	);
};

// MARK: seperator

interface TabProps extends React.ComponentProps<typeof AriaTab> {}

const Tab = ({ className, ...props }: TabProps) => {
	const { tab } = useStyles()();
	return (
		<AriaTab data-tab="" className={composeRenderProps(className, (cn) => tab({ className: cn }))} {...props}>
			{composeRenderProps(props.children, (children) => (
				<>
					{children}
					<TabIndicator />
				</>
			))}
		</AriaTab>
	);
};

// MARK: seperator

interface TabIndicatorProps extends React.ComponentProps<typeof AriaSelectionIndicator> {}

const TabIndicator = ({ className, ...props }: TabIndicatorProps) => {
	const { selectionIndicator } = useStyles()();
	const orientation = useTabsContext("TabIndicator");
	return (
		<AriaSelectionIndicator
			data-tab-indicator=""
			className={composeRenderProps(className, (cn) => selectionIndicator({ orientation, className: cn }))}
			{...props}
		/>
	);
};

// MARK: seperator

interface TabPanelProps extends React.ComponentProps<typeof AriaTabPanel> {}

const TabPanel = ({ className, ...props }: TabPanelProps) => {
	const { panel } = useStyles()();
	return (
		<AriaTabPanel
			data-tab-panel
			className={composeRenderProps(className, (cn) => panel({ className: cn }))}
			{...props}
		/>
	);
};

// MARK: seperator

export type { TabIndicatorProps, TabListProps, TabPanelProps, TabProps, TabsProps };
export { Tab, TabIndicator, TabList, TabPanel, Tabs };
