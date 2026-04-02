import { type ReactNode, useRef, useState } from "react";
import { CheckIcon, ChevronDownIcon, ChevronLeftIcon, MoonIcon, ShuffleIcon, Undo2Icon } from "lucide-react";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { Button as AriaButton, DialogTrigger } from "react-aria-components";

import * as icons from "@dotui/registry/icons";
import { Badge } from "@dotui/registry/ui/badge";
import { Button } from "@dotui/registry/ui/button";
import { Checkbox } from "@dotui/registry/ui/checkbox";
import { ColorEditor } from "@dotui/registry/ui/color-editor";
import { ColorPicker } from "@dotui/registry/ui/color-picker";
import { ColorSwatch } from "@dotui/registry/ui/color-swatch";
import { Dialog, DialogContent } from "@dotui/registry/ui/dialog";
import { Label } from "@dotui/registry/ui/field";
import { Input } from "@dotui/registry/ui/input";
import { ListBox, ListBoxItem } from "@dotui/registry/ui/list-box";
import { Popover } from "@dotui/registry/ui/popover";
import { Radio, RadioGroup } from "@dotui/registry/ui/radio-group";
import { SearchField } from "@dotui/registry/ui/search-field";
import { Select, SelectTrigger, SelectValue } from "@dotui/registry/ui/select";
import { Slider, SliderControl, SliderFiller, SliderOutput, SliderThumb } from "@dotui/registry/ui/slider";
import { Switch } from "@dotui/registry/ui/switch";
import { TextField } from "@dotui/registry/ui/text-field";
import { ToggleButton } from "@dotui/registry/ui/toggle-button";
import { ToggleButtonGroup } from "@dotui/registry/ui/toggle-button-group";

/* -------------------------------- Types -------------------------------- */

interface MenuItem {
	id: string;
	title: string;
	type: "page" | "popover";
	direction?: "vertical" | "horizontal";
	preview: ReactNode;
	config: ReactNode;
}

/* ------------------------------ Animation ------------------------------ */

const slideVariants = {
	enter: (dir: number) => ({
		x: dir > 0 ? "100%" : "-100%",
		opacity: 0,
	}),
	center: { x: 0, opacity: 1 },
	exit: (dir: number) => ({
		x: dir > 0 ? "-100%" : "100%",
		opacity: 0,
	}),
};

const slideTransition: Transition = {
	x: { type: "tween", duration: 0.35, ease: [0.32, 0.72, 0, 1] },
	opacity: { duration: 0.25 },
};

/* ------------------------------- Configs ------------------------------- */

const colorPresets = [
	{ name: "Neutral", value: "neutral", colors: ["#737373", "#a3a3a3", "#d4d4d4"] },
	{ name: "Slate", value: "slate", colors: ["#475569", "#94a3b8", "#cbd5e1"] },
	{ name: "Zinc", value: "zinc", colors: ["#52525b", "#a1a1aa", "#d4d4d8"] },
	{ name: "Stone", value: "stone", colors: ["#78716c", "#a8a29e", "#d6d3d1"] },
];

const accentPresets = [
	{ name: "Blue", value: "blue", color: "#3b82f6" },
	{ name: "Violet", value: "violet", color: "#8b5cf6" },
	{ name: "Green", value: "green", color: "#22c55e" },
	{ name: "Orange", value: "orange", color: "#f97316" },
	{ name: "Rose", value: "rose", color: "#f43f5e" },
	{ name: "Cyan", value: "cyan", color: "#06b6d4" },
	{ name: "Yellow", value: "yellow", color: "#eab308" },
	{ name: "Teal", value: "teal", color: "#14b8a6" },
];

function ColorsConfig() {
	return (
		<div className="flex flex-col gap-4">
			<Select className="w-full" defaultValue="material">
				<Label>Color system</Label>
				<SelectTrigger className="w-full" />
				<Popover>
					<ListBox>
						<ListBoxItem id="material">Material design</ListBoxItem>
					</ListBox>
				</Popover>
			</Select>
			<div className="grid grid-cols-2 gap-4">
				{[
					{
						name: "Base color",
						value: "#737373",
					},
					{
						name: "Accent color",
						value: "#3b82f6",
					},
					{
						name: "Success color",
						value: "#22c55e",
					},
					{
						name: "Warning color",
						value: "#f97316",
					},
					{
						name: "Danger color",
						value: "#f43f5e",
					},
				].map(({ name, value }) => (
					<ColorPicker key={name} defaultValue={value}>
						{({ color }) => (
							<>
								<div className="flex flex-col gap-2">
									<Label>{name}</Label>
									<Button className="justify-start pl-2.5">
										<ColorSwatch />
										<span className="truncate">{color.getColorName("en")}</span>
									</Button>
								</div>
								<Popover>
									<DialogContent>
										<ColorEditor />
									</DialogContent>
								</Popover>
							</>
						)}
					</ColorPicker>
				))}
			</div>
		</div>
	);
}

const fontOptions = [
	{ name: "Inter", value: "inter", className: "font-sans" },
	{ name: "Geist", value: "geist", className: "font-sans" },
	{ name: "Josefin Sans", value: "josefin", className: "font-sans" },
	{ name: "DM Sans", value: "dm-sans", className: "font-sans" },
	{ name: "Space Grotesk", value: "space-grotesk", className: "font-sans" },
	{ name: "Playfair Display", value: "playfair", className: "font-serif" },
];

function TypographyConfig() {
	const [headingFont, setHeadingFont] = useState("inter");
	const [bodyFont, setBodyFont] = useState("inter");

	return (
		<div className="flex flex-col gap-5">
			{/* Heading font */}
			<div className="flex flex-col gap-2">
				<span className="font-medium text-fg-muted text-xs">Heading font</span>
				<div className="flex flex-col gap-0.5">
					{fontOptions.map((font) => (
						<button
							key={font.value}
							type="button"
							onClick={() => setHeadingFont(font.value)}
							className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted"
						>
							<span>{font.name}</span>
							{headingFont === font.value && <CheckIcon className="size-3.5 text-primary" />}
						</button>
					))}
				</div>
			</div>

			{/* Body font */}
			<div className="flex flex-col gap-2">
				<span className="font-medium text-fg-muted text-xs">Body font</span>
				<div className="flex flex-col gap-0.5">
					{fontOptions.map((font) => (
						<button
							key={font.value}
							type="button"
							onClick={() => setBodyFont(font.value)}
							className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted"
						>
							<span>{font.name}</span>
							{bodyFont === font.value && <CheckIcon className="size-3.5 text-primary" />}
						</button>
					))}
				</div>
			</div>

			{/* Font size */}
			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<span className="font-medium text-fg-muted text-xs">Base font size</span>
					<span className="text-fg-muted text-xs">16px</span>
				</div>
				<Slider defaultValue={16} minValue={12} maxValue={20}>
					<SliderControl>
						<SliderFiller />
						<SliderThumb />
					</SliderControl>
				</Slider>
			</div>
		</div>
	);
}

const iconLibraries = [
	{ name: "Lucide", value: "lucide", description: "Clean & consistent" },
	{ name: "Remix Icons", value: "remix", description: "Neutral & versatile" },
	{ name: "Tabler Icons", value: "tabler", description: "Over 5000 icons" },
	{ name: "Huge Icons", value: "hugeicons", description: "Modern & bold" },
];

function IconographyConfig() {
	const [selectedLib, setSelectedLib] = useState("lucide");

	return (
		<div className="flex flex-col gap-5">
			{/* Library picker */}
			<div className="flex flex-col gap-2">
				<span className="font-medium text-fg-muted text-xs">Icon library</span>
				<div className="flex flex-col gap-1">
					{iconLibraries.map((lib) => (
						<button
							key={lib.value}
							type="button"
							onClick={() => setSelectedLib(lib.value)}
							className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 text-left transition-colors hover:bg-muted ${
								selectedLib === lib.value ? "border-primary bg-primary/5" : ""
							}`}
						>
							<div>
								<div className="font-medium text-sm">{lib.name}</div>
								<div className="text-fg-muted text-xs">{lib.description}</div>
							</div>
							{selectedLib === lib.value && <CheckIcon className="size-4 text-primary" />}
						</button>
					))}
				</div>
			</div>

			{/* Icon preview grid */}
			<div className="flex flex-col gap-2">
				<span className="font-medium text-fg-muted text-xs">Preview</span>
				<div className="grid grid-cols-6 gap-1 rounded-lg border p-2 [&_svg]:size-4">
					{Object.entries(icons)
						.slice(0, 24)
						.map(([name, IconComponent]) => (
							<div
								key={name}
								className="flex items-center justify-center rounded-md p-1.5 text-fg-muted hover:bg-muted hover:text-fg"
							>
								<IconComponent />
							</div>
						))}
				</div>
			</div>
		</div>
	);
}

function RadiusConfig() {
	return (
		<div className="flex flex-col gap-3 p-3">
			<span className="font-medium text-fg-muted text-xs">Border radius</span>
			<div className="flex items-center gap-2">
				{[
					{ label: "None", value: "none", className: "rounded-none" },
					{ label: "SM", value: "sm", className: "rounded-sm" },
					{ label: "MD", value: "md", className: "rounded-md" },
					{ label: "LG", value: "lg", className: "rounded-lg" },
					{ label: "XL", value: "xl", className: "rounded-xl" },
				].map((opt) => (
					<button
						key={opt.value}
						type="button"
						className="flex cursor-pointer flex-col items-center gap-1.5 rounded-md p-1.5 transition-colors hover:bg-muted"
					>
						<div className={`size-8 border-2 border-fg-muted/40 ${opt.className}`} />
						<span className="text-[10px] text-fg-muted">{opt.label}</span>
					</button>
				))}
			</div>
		</div>
	);
}

function CompactnessConfig() {
	return (
		<div className="flex flex-col gap-3 p-3">
			<span className="font-medium text-fg-muted text-xs">Spacing</span>
			<ToggleButtonGroup defaultSelectedKeys={["default"]} selectionMode="single">
				<ToggleButton id="compact" size="sm">
					Compact
				</ToggleButton>
				<ToggleButton id="default" size="sm">
					Default
				</ToggleButton>
				<ToggleButton id="spacious" size="sm">
					Spacious
				</ToggleButton>
			</ToggleButtonGroup>
		</div>
	);
}

function ComponentsConfig() {
	return (
		<div className="flex flex-col gap-5">
			{/* Button style */}
			<div className="flex flex-col gap-2">
				<span className="font-medium text-fg-muted text-xs">Button style</span>
				<Select defaultSelectedKey="default">
					<Button size="sm" className="w-full">
						<SelectValue />
						<ChevronDownIcon />
					</Button>
					<Popover>
						<ListBox>
							<ListBoxItem id="default">Default</ListBoxItem>
							<ListBoxItem id="rounded">Rounded</ListBoxItem>
							<ListBoxItem id="sharp">Sharp</ListBoxItem>
							<ListBoxItem id="pill">Pill</ListBoxItem>
						</ListBox>
					</Popover>
				</Select>
			</div>

			{/* Input style */}
			<div className="flex flex-col gap-2">
				<span className="font-medium text-fg-muted text-xs">Input style</span>
				<Select defaultSelectedKey="outline">
					<Button size="sm" className="w-full">
						<SelectValue />
						<ChevronDownIcon />
					</Button>
					<Popover>
						<ListBox>
							<ListBoxItem id="outline">Outline</ListBoxItem>
							<ListBoxItem id="filled">Filled</ListBoxItem>
							<ListBoxItem id="underline">Underline</ListBoxItem>
						</ListBox>
					</Popover>
				</Select>
			</div>

			{/* Toggle style */}
			<div className="flex flex-col gap-2">
				<span className="font-medium text-fg-muted text-xs">Toggle style</span>
				<Select defaultSelectedKey="default">
					<Button size="sm" className="w-full">
						<SelectValue />
						<ChevronDownIcon />
					</Button>
					<Popover>
						<ListBox>
							<ListBoxItem id="default">Default</ListBoxItem>
							<ListBoxItem id="ios">iOS</ListBoxItem>
							<ListBoxItem id="material">Material</ListBoxItem>
						</ListBox>
					</Popover>
				</Select>
			</div>

			{/* Preview */}
			<div className="flex flex-col gap-2">
				<span className="font-medium text-fg-muted text-xs">Preview</span>
				<div className="flex flex-col gap-3 rounded-lg border p-3">
					<TextField className="w-full">
						<Input placeholder="Input field" />
					</TextField>
					<div className="flex items-center gap-2">
						<Button slot={null} size="sm" variant="primary">
							Primary
						</Button>
						<Button slot={null} size="sm">
							Default
						</Button>
						<Button slot={null} size="sm" variant="quiet">
							Quiet
						</Button>
					</div>
					<div className="flex items-center gap-3">
						<Switch defaultSelected />
						<Checkbox defaultSelected />
					</div>
				</div>
			</div>
		</div>
	);
}

/* --------------------------------- Menu -------------------------------- */

const menu: MenuItem[] = [
	{
		id: "colors",
		title: "Colors",
		type: "page",
		preview: (
			<div className="flex flex-col gap-1.5">
				<div className="flex items-center gap-1 *:size-5 *:rounded-full *:border">
					<div className="bg-neutral" />
					<div className="bg-primary" />
					<div className="bg-success" />
					<div className="bg-warning" />
					<div className="bg-danger" />
					<div className="bg-info" />
				</div>
			</div>
		),
		config: <ColorsConfig />,
	},
	{
		id: "typography",
		title: "Typography",
		type: "page",
		preview: (
			<div className="flex flex-col gap-1.5">
				<div className="flex items-center justify-between">
					<span className="text-[10px] text-fg-muted uppercase tracking-widest">Heading</span>
					<p className="font-heading text-2xl leading-none tracking-tight">Ag</p>
				</div>
				<div className="flex items-center justify-between">
					<span className="text-[10px] text-fg-muted uppercase tracking-widest">Body</span>
					<p className="font-body text-base leading-none">Ag</p>
				</div>
			</div>
		),
		config: <TypographyConfig />,
	},
	{
		id: "icongraphy",
		title: "Iconography",
		type: "page",
		preview: (
			<div className="flex items-center gap-2 overflow-hidden text-fg-muted [&_svg]:size-4 [&_svg]:shrink-0">
				{Object.entries(icons)
					.slice(0, 20)
					.map(([name, IconComponent]) => (
						<IconComponent key={name} />
					))}
			</div>
		),
		config: <IconographyConfig />,
	},
	{
		id: "radius",
		title: "Radius",
		type: "popover",
		direction: "horizontal",
		preview: <div className="size-4 rounded-tr-lg border-fg-muted/60 border-t-2 border-r-2" />,
		config: <RadiusConfig />,
	},
	{
		id: "compactness",
		title: "Compactness",
		type: "popover",
		preview: (
			<div className="flex max-h-12 gap-2 overflow-hidden">
				<div className="flex min-w-0 flex-1 flex-col gap-1 rounded border border-fg-muted/20 p-1.5">
					<div className="h-1.5 w-2/3 rounded-sm bg-fg-muted/30" />
					<div className="h-1.5 w-1/3 rounded-sm bg-fg-muted/15" />
					<div className="h-6 w-full rounded-sm bg-fg-muted/10" />
				</div>
				<div className="flex min-w-0 flex-1 flex-col gap-1 rounded border border-fg-muted/20 p-1.5">
					<div className="h-1.5 w-2/3 rounded-sm bg-fg-muted/30" />
					<div className="h-1.5 w-1/3 rounded-sm bg-fg-muted/15" />
					<div className="h-6 w-full rounded-sm bg-fg-muted/10" />
				</div>
			</div>
		),
		config: <CompactnessConfig />,
	},
	{
		id: "components",
		title: "Components",
		type: "page",
		preview: (
			<div className="pointer-events-none flex items-center gap-2">
				<Switch defaultSelected className="scale-75" />
				<Checkbox defaultSelected className="scale-90" />
				<Badge>Badge</Badge>
			</div>
		),
		config: <ComponentsConfig />,
	},
];

/* -------------------------------- Panel -------------------------------- */

export function CustomizerPanel() {
	const [activePageId, setActivePageId] = useState<string | null>(null);
	const direction = useRef(1);

	const activePage = activePageId ? menu.find((m) => m.id === activePageId) : null;

	function push(id: string) {
		direction.current = 1;
		setActivePageId(id);
	}

	function pop() {
		direction.current = -1;
		setActivePageId(null);
	}

	const viewKey = activePageId ?? "home";

	return (
		<div className="relative flex w-72 flex-col rounded-xl border bg-card">
			{/* Header */}
			<div className="relative overflow-hidden border-b p-3">
				<div className="flex w-full items-center gap-2">
					<Select defaultValue="preview" className="min-w-0 flex-1">
						<Button size="sm" className="w-full pr-2!">
							<SelectValue className="truncate" />
							<ChevronDownIcon />
						</Button>
						<Popover>
							<SearchField autoFocus className="m-2">
								<Input />
							</SearchField>
							<ListBox>
								<ListBoxItem id="preview">Preview</ListBoxItem>
								<ListBoxItem id="accordion">Accordion</ListBoxItem>
								<ListBoxItem id="button">Button</ListBoxItem>
								<ListBoxItem id="checkbox">Checkbox</ListBoxItem>
								<ListBoxItem id="checkbox-group">Checkbox Group</ListBoxItem>
								<ListBoxItem id="date-field">Date Field</ListBoxItem>
								<ListBoxItem id="date-picker">Date Picker</ListBoxItem>
								<ListBoxItem id="date-range-picker">Date Range Picker</ListBoxItem>
								<ListBoxItem id="dropdown">Dropdown</ListBoxItem>
								<ListBoxItem id="dropdown-menu">Dropdown Menu</ListBoxItem>
							</ListBox>
						</Popover>
					</Select>
					<Button size="sm">
						<ShuffleIcon />
					</Button>
					<Button size="sm">
						<MoonIcon />
					</Button>
					<Button size="sm">
						<Undo2Icon />
					</Button>
				</div>
			</div>

			{/* Body */}
			<div className="relative flex-1 overflow-hidden">
				<AnimatePresence mode="popLayout" custom={direction.current} initial={false}>
					<motion.div
						key={viewKey}
						custom={direction.current}
						variants={slideVariants}
						initial="enter"
						animate="center"
						exit="exit"
						transition={slideTransition}
						className="h-full overflow-y-auto p-3"
					>
						{activePage ? (
							<div>
								<div className="mb-3 -ml-1 flex items-center gap-2">
									<Button variant="quiet" size="sm" onPress={pop} aria-label="Back" className="size-6">
										<ChevronLeftIcon />
									</Button>
									<h2 className="font-medium text-sm">{activePage.title}</h2>
								</div>
								<div className="**:data-label:pl-1 **:data-label:text-fg-muted">{activePage.config}</div>
							</div>
						) : (
							<div className="flex flex-col gap-3">
								{menu.map((item) => {
									const isHorizontal = item.direction === "horizontal";
									const cardClass = isHorizontal
										? "flex flex-row items-center justify-between rounded-lg border bg-neutral p-3 text-sm transition-colors hover:bg-neutral-hover"
										: "flex flex-col items-stretch gap-2 rounded-lg border bg-neutral p-3 text-sm transition-colors hover:bg-neutral-hover";

									return item.type === "popover" ? (
										<Dialog key={item.id}>
											<AriaButton className={cardClass}>
												<div className="text-left text-fg-muted">{item.title}</div>
												<div>{item.preview}</div>
											</AriaButton>
											<Popover placement="right top">
												<DialogContent>{item.config}</DialogContent>
											</Popover>
										</Dialog>
									) : (
										<AriaButton key={item.id} onPress={() => push(item.id)} className={cardClass}>
											<div className="text-left text-fg-muted">{item.title}</div>
											<div>{item.preview}</div>
										</AriaButton>
									);
								})}
							</div>
						)}
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
}
