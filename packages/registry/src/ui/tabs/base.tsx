"use client";

import {
	SelectionIndicator as AriaSelectionIndicator,
	Tab as AriaTab,
	TabList as AriaTabList,
	TabPanel as AriaTabPanel,
	Tabs as AriaTabs,
	composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type * as React from "react";

import { createContext } from "@dotui/registry/lib/context";

const tabsStyles = tv({
	slots: {
		root: "flex flex-col gap-2",
		list: "flex",
		tab: "relative cursor-default p-2 selected:text-fg text-fg-muted text-sm transition-colors hover:text-fg [&:has([data-tab-indicator])_>_[data-tab-default-indicator]]:hidden",
		selectionIndicator: [
			"absolute rounded-full bg-accent duration-150 ease-out motion-safe:transition-[translate,width,height]",
		],
		panel: "",
	},
	variants: {
		orientation: {
			horizontal: {
				root: "flex-col",
				list: "flex-row border-b",
				selectionIndicator: "bottom-0 left-0 h-0.5 w-full translate-y-px",
			},
			vertical: {
				root: "flex-row",
				list: "flex-col border-r",
				selectionIndicator: "right-0 bottom-0 h-full w-0.5",
			},
		},
	},
});

const { root, list, tab, selectionIndicator, panel } = tabsStyles();

/* -----------------------------------------------------------------------------------------------*/

const [TabsProvider, useTabsContext] = createContext<TabsProps["orientation"]>({
	name: "TabsContext",
});

/* -----------------------------------------------------------------------------------------------*/

interface TabsProps extends React.ComponentProps<typeof AriaTabs> {}

const Tabs = ({ className, ...props }: TabsProps) => {
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

/* -----------------------------------------------------------------------------------------------*/

interface TabListProps extends React.ComponentProps<typeof AriaTabList> {}

const TabList = ({ className, ...props }: TabListProps) => {
	return (
		<AriaTabList
			className={composeRenderProps(className, (cn, { orientation }) => list({ orientation, className: cn }))}
			{...props}
		/>
	);
};

/* -----------------------------------------------------------------------------------------------*/

interface TabProps extends React.ComponentProps<typeof AriaTab> {}

const Tab = ({ className, ...props }: TabProps) => {
	return (
		<AriaTab className={composeRenderProps(className, (cn) => tab({ className: cn }))} {...props}>
			{composeRenderProps(props.children, (children) => (
				<>
					{children}
					<TabIndicator />
				</>
			))}
		</AriaTab>
	);
};

/* -----------------------------------------------------------------------------------------------*/

interface TabIndicatorProps extends React.ComponentProps<typeof AriaSelectionIndicator> {}

const TabIndicator = ({ className, ...props }: TabIndicatorProps) => {
	const orientation = useTabsContext("TabIndicator");
	return (
		<AriaSelectionIndicator
			data-tab-indicator=""
			className={composeRenderProps(className, (cn) => selectionIndicator({ orientation, className: cn }))}
			{...props}
		/>
	);
};

/* -----------------------------------------------------------------------------------------------*/

interface TabPanelProps extends React.ComponentProps<typeof AriaTabPanel> {}

const TabPanel = ({ className, ...props }: TabPanelProps) => {
	return (
		<AriaTabPanel
			data-tab-panel
			className={composeRenderProps(className, (cn) => panel({ className: cn }))}
			{...props}
		/>
	);
};

/* -----------------------------------------------------------------------------------------------*/

export { Tabs, TabList, Tab, TabPanel, TabIndicator };
export type { TabsProps, TabListProps, TabProps, TabPanelProps, TabIndicatorProps };
