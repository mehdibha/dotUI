export interface ComponentInfo {
	name: string;
	slug: string;
	href: string;
	scale?: number;
	iframe?: boolean;
}

export interface ComponentCategory {
	title: string;
	slug: string;
	components: ComponentInfo[];
}

export const componentsData: ComponentCategory[] = [
	{
		title: "Buttons",
		slug: "buttons",
		components: [
			{ name: "Button", slug: "button", href: "/docs/components/button", scale: 1 },
			{ name: "ToggleButton", slug: "toggle-button", href: "/docs/components/toggle-button", scale: 1 },
			{ name: "ToggleButtonGroup", slug: "toggle-button-group", href: "/docs/components/toggle-button-group", scale: 1 },
			{ name: "FileTrigger", slug: "file-trigger", href: "/docs/components/file-trigger", scale: 1 },
			{ name: "Group", slug: "group", href: "/docs/components/group", scale: 0.9 },
		],
	},
	{
		title: "Inputs, controls and form",
		slug: "inputs",
		components: [
			{ name: "Input", slug: "input", href: "/docs/components/input" },
			{ name: "TextArea", slug: "text-area", href: "/docs/components/text-area" },
			{ name: "InputGroup", slug: "input-group", href: "/docs/components/input-group" },
			{ name: "TextField", slug: "text-field", href: "/docs/components/text-field" },
			{ name: "SearchField", slug: "search-field", href: "/docs/components/search-field" },
			{ name: "NumberField", slug: "number-field", href: "/docs/components/number-field" },
			{ name: "Checkbox", slug: "checkbox", href: "/docs/components/checkbox" },
			{ name: "RadioGroup", slug: "radio-group", href: "/docs/components/radio-group" },
			{ name: "Switch", slug: "switch", href: "/docs/components/switch" },
			{ name: "Slider", slug: "slider", href: "/docs/components/slider" },
			{ name: "Field", slug: "field", href: "/docs/components/field" },
			{ name: "Form", slug: "form", href: "/docs/components/form" },
		],
	},
	{
		title: "Pickers",
		slug: "pickers",
		components: [
			{ name: "Menu", slug: "menu", href: "/docs/components/menu", scale: 0.65, iframe: true },
			{ name: "Combobox", slug: "combobox", href: "/docs/components/combobox", scale: 0.7, iframe: true },
			{ name: "Select", slug: "select", href: "/docs/components/select", scale: 0.7, iframe: true },
		],
	},
	{
		title: "Dates",
		slug: "dates",
		components: [
			{ name: "Calendar", slug: "calendar", href: "/docs/components/calendar", scale: 0.5 },
			{ name: "DateField", slug: "date-field", href: "/docs/components/date-field", scale: 0.7 },
			{ name: "DatePicker", slug: "date-picker", href: "/docs/components/date-picker", scale: 0.4 },
			{ name: "TimeField", slug: "time-field", href: "/docs/components/time-field", scale: 0.7 },
		],
	},
	{
		title: "Feedback",
		slug: "feedback",
		components: [
			{ name: "Alert", slug: "alert", href: "/docs/components/alert", scale: 0.5 },
			{ name: "ProgressBar", slug: "progress-bar", href: "/docs/components/progress-bar", scale: 0.7 },
			{ name: "Toast", slug: "toast", href: "/docs/components/toast", scale: 0.6 },
			{ name: "Loader", slug: "loader", href: "/docs/components/loader", scale: 1 },
			{ name: "Skeleton", slug: "skeleton", href: "/docs/components/skeleton", scale: 0.4 },
		],
	},
	{
		title: "Collections",
		slug: "collections",
		components: [
			{ name: "ListBox", slug: "list-box", href: "/docs/components/list-box" },
			{ name: "TagGroup", slug: "tag-group", href: "/docs/components/tag-group" },
		],
	},
	{
		title: "Navigation",
		slug: "navigation",
		components: [
			{ name: "Link", slug: "link", href: "/docs/components/link", scale: 1 },
			{ name: "Tabs", slug: "tabs", href: "/docs/components/tabs" },
			{ name: "Breadcrumbs", slug: "breadcrumbs", href: "/docs/components/breadcrumbs", scale: 0.6 },
			{ name: "Command", slug: "command", href: "/docs/components/command", scale: 0.7 },
		],
	},
	{
		title: "Data display",
		slug: "data-display",
		components: [
			{ name: "Accordion", slug: "accordion", href: "/docs/components/accordion", scale: 0.6 },
			{ name: "Avatar", slug: "avatar", href: "/docs/components/avatar", scale: 0.7 },
			{ name: "Kbd", slug: "kbd", href: "/docs/components/kbd", scale: 1 },
			{ name: "Badge", slug: "badge", href: "/docs/components/badge" },
			{ name: "Table", slug: "table", href: "/docs/components/table", scale: 0.25 },
			{ name: "Card", slug: "card", href: "/docs/components/card", scale: 0.3 },
			{ name: "Separator", slug: "separator", href: "/docs/components/separator" },
			{ name: "Empty", slug: "empty", href: "/docs/components/empty", scale: 0.5 },
		],
	},
	{
		title: "Colors",
		slug: "colors",
		components: [
			{ name: "ColorArea", slug: "color-area", href: "/docs/components/color-area", scale: 0.5 },
			{ name: "ColorField", slug: "color-field", href: "/docs/components/color-field" },
			{ name: "ColorPicker", slug: "color-picker", href: "/docs/components/color-picker", scale: 0.7 },
			{ name: "ColorSlider", slug: "color-slider", href: "/docs/components/color-slider" },
			{ name: "ColorSwatchPicker", slug: "color-swatch-picker", href: "/docs/components/color-swatch-picker" },
		],
	},
	{
		title: "Overlays",
		slug: "overlays",
		components: [
			{ name: "Dialog", slug: "dialog", href: "/docs/components/dialog", iframe: true },
			{ name: "Modal", slug: "modal", href: "/docs/components/modal", scale: 0.6, iframe: true },
			{ name: "Popover", slug: "popover", href: "/docs/components/popover", iframe: true },
			{ name: "Drawer", slug: "drawer", href: "/docs/components/drawer", iframe: true },
			{ name: "Tooltip", slug: "tooltip", href: "/docs/components/tooltip", iframe: true },
		],
	},
];

export const tocData = componentsData.map((category) => ({
	title: category.title,
	url: `#${category.slug}`,
	depth: 2,
}));
