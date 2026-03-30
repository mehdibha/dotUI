import { useRef, useState } from "react";
import {
	BoxIcon,
	ChevronDownIcon,
	ChevronLeftIcon,
	MoonIcon,
	PaletteIcon,
	ShuffleIcon,
	SmileIcon,
	TypeIcon,
	Undo2Icon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button as AriaButton } from "react-aria-components";

import * as icons from "@dotui/registry/icons";
import { cn } from "@dotui/registry/lib/utils";
import { Button } from "@dotui/registry/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@dotui/registry/ui/card";
import { ColorSwatch } from "@dotui/registry/ui/color-swatch";
import { Combobox } from "@dotui/registry/ui/combobox";
import { Dialog, DialogContent } from "@dotui/registry/ui/dialog";
import { Input } from "@dotui/registry/ui/input";
import { ListBox, ListBoxItem } from "@dotui/registry/ui/list-box";
import { Popover } from "@dotui/registry/ui/popover";
import { SearchField } from "@dotui/registry/ui/search-field";
import { Select, SelectValue } from "@dotui/registry/ui/select";
import { TextField } from "@dotui/registry/ui/text-field";

/* -------------------------------- Types -------------------------------- */

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

const slideTransition = {
	x: { type: "tween" as const, duration: 0.35, ease: [0.32, 0.72, 0, 1] },
	opacity: { duration: 0.25 },
};

const menu = [
	{
		id: "colors" as const,
		title: "Colors",
		preview: (
			<div className="flex items-center gap-2">
				<ColorSwatch color="#FFD93D" />
				<ColorSwatch color="#6BCB77" />
				<ColorSwatch color="#4D96FF" />
				<ColorSwatch color="#A29BFE" />
			</div>
		),
	},
	{
		id: "typography" as const,
		title: "Typography",
		preview: (
			<div className="text-right">
				<p className="font-heading text-2xl">Heading</p>
				<p className="font-body">body</p>
			</div>
		),
	},
	{
		id: "icongraphy" as const,
		title: "Iconography",
		preview: (
			<div className="grid max-h-[152px] gap-0.5 overflow-hidden [grid-template-columns:repeat(auto-fill,minmax(36px,1fr))] [grid-template-rows:repeat(auto-fill,minmax(36px,1fr))] [&_svg]:size-6">
				{Object.entries(icons)
					.slice(0, 100)
					.map(([name, IconComponent]) => {
						return (
							<div key={name} className="flex items-center justify-center">
								<IconComponent />
							</div>
						);
					})}
			</div>
		),
	},
	{
		id: "radius" as const,
		title: "Radius",
		preview: <></>,
	},
	{
		id: "compactness" as const,
		title: "Compactness",
		preview: <></>,
	},
	{
		id: "components" as const,
		title: "Components",
		preview: (
			<div className="pointer-events-none grid gap-2">
				<TextField className="w-full">
					<Input />
				</TextField>
				<Button slot={null}>Button</Button>
			</div>
		),
	},
];

/* -------------------------------- Panel -------------------------------- */

export function CustomizerPanel() {
	const [stack, setStack] = useState<ViewId[]>(["home"]);
	const direction = useRef(1);

	const currentView = stack[stack.length - 1];

	function push(viewId: ViewId) {
		direction.current = 1;
		setStack((prev) => [...prev, viewId]);
	}

	function pop() {
		if (stack.length <= 1) return;
		direction.current = -1;
		setStack((prev) => prev.slice(0, -1));
	}

	return (
		<div className="relative flex w-72 flex-col rounded-xl border bg-card">
			<div className="border-b p-4">
				<AnimatePresence mode="popLayout" custom={direction.current} initial={false}>
					<div className="flex items-center gap-2">
						<Select defaultValue="preview" className="flex-1">
							<Button size="sm" className="w-full pr-2!">
								<SelectValue />
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
				</AnimatePresence>
			</div>
			{/* <AnimatePresence mode="popLayout" custom={direction.current} initial={false}>
				<motion.div
					key={currentView}
					custom={direction.current}
					variants={slideVariants}
					initial="enter"
					animate="center"
					exit="exit"
					transition={slideTransition}
					className="h-full"
				>
					{currentView === "home" ? (
						<HomeView onNavigate={push} />
					) : (
						<SubView title={viewTitles[currentView]} onBack={pop} />
					)}
				</motion.div>
			</AnimatePresence> */}
			<div className="overflow-y-auto p-4">
				<AnimatePresence mode="popLayout" custom={direction.current} initial={false}>
					<div className="flex flex-col gap-4">
						{menu.map((item) => (
							<AriaButton
								key={item.id}
								className="flex flex-col items-stretch gap-2 rounded-lg border bg-neutral p-3 text-sm transition-colors hover:bg-neutral-hover"
							>
								<div className="text-left text-fg-muted">{item.title}</div>
								<div>{item.preview}</div>
							</AriaButton>
						))}
					</div>
				</AnimatePresence>
			</div>
		</div>
	);
}
