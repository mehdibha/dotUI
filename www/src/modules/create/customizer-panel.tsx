import { type ReactNode, useRef, useState } from "react";
import { ChevronDownIcon, ChevronLeftIcon, MoonIcon, ShuffleIcon, Undo2Icon } from "lucide-react";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { Button as AriaButton, DialogTrigger } from "react-aria-components";

import * as icons from "@dotui/registry/icons";
import { Button } from "@dotui/registry/ui/button";
import { ColorSwatch } from "@dotui/registry/ui/color-swatch";
import { Input } from "@dotui/registry/ui/input";
import { ListBox, ListBoxItem } from "@dotui/registry/ui/list-box";
import { Popover } from "@dotui/registry/ui/popover";
import { SearchField } from "@dotui/registry/ui/search-field";
import { Select, SelectValue } from "@dotui/registry/ui/select";
import { TextField } from "@dotui/registry/ui/text-field";

/* -------------------------------- Types -------------------------------- */

interface MenuItem {
	id: string;
	title: string;
	type: "page" | "popover";
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

/* --------------------------------- Menu -------------------------------- */

const menu: MenuItem[] = [
	{
		id: "colors",
		title: "Colors",
		type: "page",
		preview: (
			<div className="flex items-center gap-2">
				<ColorSwatch color="#FFD93D" />
				<ColorSwatch color="#6BCB77" />
				<ColorSwatch color="#4D96FF" />
				<ColorSwatch color="#A29BFE" />
			</div>
		),
		config: null,
	},
	{
		id: "typography",
		title: "Typography",
		type: "page",
		preview: (
			<div className="text-right">
				<p className="font-heading text-2xl">Heading</p>
				<p className="font-body">body</p>
			</div>
		),
		config: null,
	},
	{
		id: "icongraphy",
		title: "Iconography",
		type: "page",
		preview: (
			<div className="grid max-h-[152px] gap-0.5 overflow-hidden [grid-template-columns:repeat(auto-fill,minmax(36px,1fr))] [grid-template-rows:repeat(auto-fill,minmax(36px,1fr))] [&_svg]:size-6">
				{Object.entries(icons)
					.slice(0, 100)
					.map(([name, IconComponent]) => (
						<div key={name} className="flex items-center justify-center">
							<IconComponent />
						</div>
					))}
			</div>
		),
		config: null,
	},
	{
		id: "radius",
		title: "Radius",
		type: "popover",
		preview: <></>,
		config: null,
	},
	{
		id: "compactness",
		title: "Compactness",
		type: "popover",
		preview: <></>,
		config: null,
	},
	{
		id: "components",
		title: "Components",
		type: "page",
		preview: (
			<></>
		),
		config: null,
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
			<div className="relative overflow-hidden border-b p-4">
				<AnimatePresence mode="popLayout" custom={direction.current} initial={false}>
					<motion.div
						key={viewKey}
						custom={direction.current}
						variants={slideVariants}
						initial="enter"
						animate="center"
						exit="exit"
						transition={slideTransition}
					>
						{activePage ? (
							<div className="flex items-center gap-2">
								<Button variant="quiet" size="sm" onPress={pop} aria-label="Back">
									<ChevronLeftIcon />
								</Button>
								<h2 className="font-semibold text-sm">{activePage.title}</h2>
							</div>
						) : (
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
						)}
					</motion.div>
				</AnimatePresence>
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
						className="h-full overflow-y-auto p-4"
					>
						{activePage ? (
							<div>{activePage.config}</div>
						) : (
							<div className="flex flex-col gap-4">
								{menu.map((item) =>
									item.type === "popover" ? (
										<DialogTrigger key={item.id}>
											<AriaButton className="flex flex-col items-stretch gap-2 rounded-lg border bg-neutral p-3 text-sm transition-colors hover:bg-neutral-hover">
												<div className="text-left text-fg-muted">{item.title}</div>
												<div>{item.preview}</div>
											</AriaButton>
											<Popover>
												<div className="p-3">{item.config}</div>
											</Popover>
										</DialogTrigger>
									) : (
										<AriaButton
											key={item.id}
											onPress={() => push(item.id)}
											className="flex flex-col items-stretch gap-2 rounded-lg border bg-neutral p-3 text-sm transition-colors hover:bg-neutral-hover"
										>
											<div className="text-left text-fg-muted">{item.title}</div>
											<div>{item.preview}</div>
										</AriaButton>
									),
								)}
							</div>
						)}
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
}
