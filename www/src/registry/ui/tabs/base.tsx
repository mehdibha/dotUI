"use client";

import type * as React from "react";

import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as SelectionIndicatorPrimitives from "react-aria-components/SelectionIndicator";
import * as TabsPrimitives from "react-aria-components/Tabs";

import { createContext } from "@/registry/lib/context";

import { useStyles } from "./styles";

// MARK: tabsStyles

type TabsVariant = "default" | "line";

// MARK: Separator

const [TabsProvider, useTabsContext] = createContext<TabsProps["orientation"]>({
	name: "TabsContext",
});

const [TabListProvider, useTabListContext] = createContext<TabsVariant>({
	name: "TabListContext",
});

// MARK: Separator

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

// MARK: Separator

interface TabListProps extends React.ComponentProps<typeof TabsPrimitives.TabList> {
	variant?: TabsVariant;
}

const TabList = ({ className, variant = "default", ...props }: TabListProps) => {
	const { list } = useStyles()();
	return (
		<TabListProvider value={variant}>
			<TabsPrimitives.TabList
				className={composeRenderProps(className, (cn, { orientation }) =>
					list({ orientation, variant, className: cn }),
				)}
				{...props}
			/>
		</TabListProvider>
	);
};

// MARK: Separator

interface TabProps extends React.ComponentProps<typeof TabsPrimitives.Tab> {}

const Tab = ({ className, ...props }: TabProps) => {
	const { tab } = useStyles()();
	const orientation = useTabsContext("Tab");
	const variant = useTabListContext("Tab");
	return (
		<TabsPrimitives.Tab
			data-tab=""
			className={composeRenderProps(className, (cn) => tab({ orientation, variant, className: cn }))}
			{...props}
		>
			{composeRenderProps(props.children, (children) => (
				<>
					<TabIndicator />
					<span data-tab-content="" className="relative z-10 inline-flex items-center [gap:inherit]">
						{children}
					</span>
				</>
			))}
		</TabsPrimitives.Tab>
	);
};

// MARK: Separator

interface TabIndicatorProps extends React.ComponentProps<typeof SelectionIndicatorPrimitives.SelectionIndicator> {}

const TabIndicator = ({ className, ...props }: TabIndicatorProps) => {
	const { selectionIndicator } = useStyles()();
	const orientation = useTabsContext("TabIndicator");
	const variant = useTabListContext("TabIndicator");
	return (
		<SelectionIndicatorPrimitives.SelectionIndicator
			data-tab-indicator=""
			data-orientation={orientation}
			className={composeRenderProps(className, (cn) => selectionIndicator({ orientation, variant, className: cn }))}
			{...props}
		/>
	);
};

// MARK: Separator

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

// MARK: Separator

export type { TabIndicatorProps, TabListProps, TabPanelProps, TabProps, TabsProps };
export { Tab, TabIndicator, TabList, TabPanel, Tabs };
