"use client";

import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as SelectionIndicatorPrimitives from "react-aria-components/SelectionIndicator";
import * as TabsPrimitives from "react-aria-components/Tabs";
import type * as React from "react";

import { createContext } from "@/registry/lib/context";

import { useStyles } from "./styles";

// MARK: tabsStyles

// MARK: seperator

const [TabsProvider, useTabsContext] = createContext<TabsProps["orientation"]>({
	name: "TabsContext",
});

// MARK: seperator

interface TabsProps extends React.ComponentProps<typeof TabsPrimitives.Tabs> {}

const Tabs = ({ className, ...props }: TabsProps) => {
	const { root } = useStyles()();
	return (
		<TabsPrimitives.Tabs
			className={composeRenderProps(className, (cn, { orientation }) => root({ orientation, className: cn }))}
			{...props}
		>
			{composeRenderProps(props.children, (children, { orientation }) => (
				<TabsProvider value={orientation}>{children}</TabsProvider>
			))}
		</TabsPrimitives.Tabs>
	);
};

// MARK: seperator

interface TabListProps extends React.ComponentProps<typeof TabsPrimitives.TabList> {}

const TabList = ({ className, ...props }: TabListProps) => {
	const { list } = useStyles()();
	return (
		<TabsPrimitives.TabList
			className={composeRenderProps(className, (cn, { orientation }) => list({ orientation, className: cn }))}
			{...props}
		/>
	);
};

// MARK: seperator

interface TabProps extends React.ComponentProps<typeof TabsPrimitives.Tab> {}

const Tab = ({ className, ...props }: TabProps) => {
	const { tab } = useStyles()();
	return (
		<TabsPrimitives.Tab data-tab="" className={composeRenderProps(className, (cn) => tab({ className: cn }))} {...props}>
			{composeRenderProps(props.children, (children) => (
				<>
					{children}
					<TabIndicator />
				</>
			))}
		</TabsPrimitives.Tab>
	);
};

// MARK: seperator

interface TabIndicatorProps extends React.ComponentProps<typeof SelectionIndicatorPrimitives.SelectionIndicator> {}

const TabIndicator = ({ className, ...props }: TabIndicatorProps) => {
	const { selectionIndicator } = useStyles()();
	const orientation = useTabsContext("TabIndicator");
	return (
		<SelectionIndicatorPrimitives.SelectionIndicator
			data-tab-indicator=""
			className={composeRenderProps(className, (cn) => selectionIndicator({ orientation, className: cn }))}
			{...props}
		/>
	);
};

// MARK: seperator

interface TabPanelProps extends React.ComponentProps<typeof TabsPrimitives.TabPanel> {}

const TabPanel = ({ className, ...props }: TabPanelProps) => {
	const { panel } = useStyles()();
	return (
		<TabsPrimitives.TabPanel
			data-tab-panel
			className={composeRenderProps(className, (cn) => panel({ className: cn }))}
			{...props}
		/>
	);
};

// MARK: seperator

export type { TabIndicatorProps, TabListProps, TabPanelProps, TabProps, TabsProps };
export { Tab, TabIndicator, TabList, TabPanel, Tabs };
