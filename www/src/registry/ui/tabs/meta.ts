import type { RegistryItem } from "@/registry/types";

const tabsMeta = {
	name: "tabs",
	type: "registry:ui",
	group: "navigation",
	defaultStyle: "default",
	styles: {
		default: {},
	},
	files: [
		{
			type: "registry:ui",
			path: "ui/tabs/base.tsx",
			target: "ui/tabs.tsx",
		},
	],
	registryDependencies: ["focus-styles"],
} satisfies RegistryItem;

export default tabsMeta;

export type TabsStyle = keyof typeof tabsMeta.styles;

export const tabsStyleNames = Object.keys(tabsMeta.styles) as TabsStyle[];

export const defaultTabsStyle = tabsMeta.defaultStyle;
