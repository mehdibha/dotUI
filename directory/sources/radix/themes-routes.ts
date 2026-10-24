export const themesRoutes = [
	{
		label: "Overview",
		pages: [
			{
				title: "Getting started",
				slug: "themes/docs/overview/getting-started",
			},
			{ title: "Styling", slug: "themes/docs/overview/styling" },
			{ title: "Layout", slug: "themes/docs/overview/layout" },
			{ title: "Releases", slug: "themes/docs/overview/releases" },
			{ title: "Resources", slug: "themes/docs/overview/resources" },
		],
	},
	{
		label: "Theme",
		pages: [
			{ title: "Overview", slug: "themes/docs/theme/overview" },
			{ title: "Color", slug: "themes/docs/theme/color" },
			{ title: "Dark mode", slug: "themes/docs/theme/dark-mode" },
			{ title: "Typography", slug: "themes/docs/theme/typography" },
			{ title: "Spacing", slug: "themes/docs/theme/spacing" },
			{ title: "Breakpoints", slug: "themes/docs/theme/breakpoints" },
			{ title: "Radius", slug: "themes/docs/theme/radius" },
			{ title: "Shadows", slug: "themes/docs/theme/shadows" },
			{ title: "Cursors", slug: "themes/docs/theme/cursors" },
		],
	},

	{
		label: "Layout",
		pages: [
			{ title: "Box", slug: "themes/docs/components/box" },
			{ title: "Flex", slug: "themes/docs/components/flex" },
			{ title: "Grid", slug: "themes/docs/components/grid" },
			{ title: "Container", slug: "themes/docs/components/container" },
			{ title: "Section", slug: "themes/docs/components/section" },
		],
	},
	{
		label: "Typography",
		pages: [
			{ title: "Text", slug: "themes/docs/components/text" },
			{ title: "Heading", slug: "themes/docs/components/heading" },
			{ title: "Blockquote", slug: "themes/docs/components/blockquote" },
			{ title: "Code", slug: "themes/docs/components/code" },
			{ title: "Em", slug: "themes/docs/components/em" },
			{ title: "Kbd", slug: "themes/docs/components/kbd" },
			{ title: "Link", slug: "themes/docs/components/link" },
			{ title: "Quote", slug: "themes/docs/components/quote" },
			{ title: "Strong", slug: "themes/docs/components/strong" },
		],
	},

	{
		label: "Components",
		pages: [
			{ title: "Alert Dialog", slug: "themes/docs/components/alert-dialog" },
			{ title: "Aspect Ratio", slug: "themes/docs/components/aspect-ratio" },
			{ title: "Avatar", slug: "themes/docs/components/avatar" },
			{ title: "Badge", slug: "themes/docs/components/badge" },
			{ title: "Button", slug: "themes/docs/components/button" },
			{ title: "Callout", slug: "themes/docs/components/callout" },
			{ title: "Card", slug: "themes/docs/components/card" },
			{ title: "Checkbox", slug: "themes/docs/components/checkbox" },
			{
				title: "Checkbox Group",
				slug: "themes/docs/components/checkbox-group",
			},
			{
				title: "Checkbox Cards",
				slug: "themes/docs/components/checkbox-cards",
			},
			{ title: "Context Menu", slug: "themes/docs/components/context-menu" },
			{ title: "Data List", slug: "themes/docs/components/data-list" },
			{ title: "Dialog", slug: "themes/docs/components/dialog" },
			{ title: "Dropdown Menu", slug: "themes/docs/components/dropdown-menu" },
			{ title: "Hover Card", slug: "themes/docs/components/hover-card" },
			{ title: "Icon Button", slug: "themes/docs/components/icon-button" },
			{ title: "Inset", slug: "themes/docs/components/inset" },
			{ title: "Popover", slug: "themes/docs/components/popover" },
			{ title: "Progress", slug: "themes/docs/components/progress" },
			{ title: "Radio", slug: "themes/docs/components/radio" },
			{ title: "Radio Group", slug: "themes/docs/components/radio-group" },
			{ title: "Radio Cards", slug: "themes/docs/components/radio-cards" },
			{ title: "Scroll Area", slug: "themes/docs/components/scroll-area" },
			{
				title: "Segmented Control",
				slug: "themes/docs/components/segmented-control",
			},
			{ title: "Select", slug: "themes/docs/components/select" },
			{ title: "Separator", slug: "themes/docs/components/separator" },
			{ title: "Skeleton", slug: "themes/docs/components/skeleton" },
			{ title: "Slider", slug: "themes/docs/components/slider" },
			{ title: "Spinner", slug: "themes/docs/components/spinner" },
			{ title: "Switch", slug: "themes/docs/components/switch" },
			{ title: "Table", slug: "themes/docs/components/table" },
			{ title: "Tabs", slug: "themes/docs/components/tabs" },
			{ title: "Tab Nav", slug: "themes/docs/components/tab-nav" },
			{ title: "Text Area", slug: "themes/docs/components/text-area" },
			{ title: "Text Field", slug: "themes/docs/components/text-field" },
			{ title: "Tooltip", slug: "themes/docs/components/tooltip" },
		],
	},

	{
		label: "Utilities",
		pages: [
			{
				title: "Accessible Icon",
				slug: "themes/docs/components/accessible-icon",
			},
			{ title: "Portal", slug: "themes/docs/components/portal" },
			{ title: "Reset", slug: "themes/docs/components/reset" },
			{ title: "Slot", slug: "themes/docs/components/slot" },
			{ title: "Theme", slug: "themes/docs/components/theme" },
			{
				title: "Visually Hidden",
				slug: "themes/docs/components/visually-hidden",
			},
		],
	},
];

export type PageProps = {
	title: string;
	slug: string;
	deprecated?: boolean;
	preview?: boolean;
};

export type RouteProps = {
	label: string;
	pages: PageProps[];
};

export const allThemesRoutes = themesRoutes.reduce<PageProps[]>((acc, curr) => {
	return [...acc, ...curr.pages];
}, []);
