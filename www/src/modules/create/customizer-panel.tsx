import { type ReactNode, useRef, useState } from "react";
import { ChevronDownIcon, ChevronLeftIcon, MoonIcon, ShuffleIcon, Undo2Icon } from "lucide-react";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { Button as AriaButton } from "react-aria-components";

import * as icons from "@/registry/__generated__/icons";
import { Badge } from "@/registry/ui/badge";
import { Button } from "@/registry/ui/button";
import { Checkbox } from "@/registry/ui/checkbox";
import { Command } from "@/registry/ui/command";
import { Dialog, DialogContent } from "@/registry/ui/dialog";
import { Input } from "@/registry/ui/input";
import { ListBox, ListBoxItem } from "@/registry/ui/list-box";
import { Popover } from "@/registry/ui/popover";
import { SearchField } from "@/registry/ui/search-field";
import { Select, SelectValue } from "@/registry/ui/select";
import { Switch } from "@/registry/ui/switch";

import { componentsData } from "@/modules/docs/components-list/components-data";

import { ColorsConfig } from "./colors-config";
import { ComponentsConfig } from "./components-config";
import { IconographyConfig } from "./iconography-config";
import { LayoutConfig } from "./layout-config";
import { TypographyConfig } from "./typography-config";

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
					<div className="flex flex-col items-start gap-1">
						<span className="text-[10px] text-fg-muted uppercase tracking-widest">Heading</span>
						<p className="font-medium">Geist</p>
					</div>
					<p className="font-heading text-2xl leading-none tracking-tight">Ag</p>
				</div>
				<div className="flex items-center justify-between">
					<div className="flex flex-col items-start gap-1">
						<span className="text-[10px] text-fg-muted uppercase tracking-widest">Body</span>
						<p className="font-medium">Geist</p>
					</div>
					<p className="font-body text-base leading-none">Ag</p>
				</div>
			</div>
		),
		config: <TypographyConfig />,
	},
	{
		id: "iconography",
		title: "Icon Library",
		type: "page",
		preview: (
			<div className="-mt-1 flex flex-col items-start gap-1">
				<p className="font-medium">Lucide icons</p>
				<div className="mt-2 flex w-full items-center gap-2 overflow-hidden text-fg-muted [&_svg]:size-4 [&_svg]:shrink-0">
					{Object.entries(icons)
						.slice(0, 20)
						.map(([name, IconComponent]) => (
							<IconComponent key={name} />
						))}
				</div>
			</div>
		),
		config: <IconographyConfig />,
	},
	{
		id: "layout",
		title: "Layout",
		type: "page",
		preview: (
			<div className="flex flex-col gap-1.5">
				<div className="grid grid-cols-2 gap-1">
					<div className="flex flex-col items-start gap-1">
						<span className="text-[10px] text-fg-muted uppercase tracking-widest">Spacing</span>
						<p className="font-medium">Compact</p>
					</div>
					<div className="flex flex-col items-start gap-1">
						<span className="text-[10px] text-fg-muted uppercase tracking-widest">Radius</span>
						<p className="font-medium">Small</p>
					</div>
				</div>
				{/* Mini card preview */}
				<div className="mt-2 flex w-full flex-col gap-2 rounded-sm border border-border p-2.5">
					<div className="h-2 w-2/3 rounded-sm bg-fg/15" />
					<div className="h-1.5 w-full rounded-sm bg-fg-muted/10" />
					<div className="flex items-center gap-1.5">
						<div className="h-5 flex-1 rounded-sm bg-primary/20" />
						<div className="h-5 flex-1 rounded-sm border border-border" />
					</div>
				</div>
			</div>
		),
		config: <LayoutConfig />,
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

interface CustomizerPanelProps {
	selectedComponent: string;
	onComponentChange: (component: string) => void;
}

export function CustomizerPanel({ selectedComponent, onComponentChange }: CustomizerPanelProps) {
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
					<Select
						value={selectedComponent}
						onChange={(key) => onComponentChange(key as string)}
						className="min-w-0 flex-1"
					>
						<Button size="sm" className="w-full pr-2!">
							<SelectValue className="truncate" />
							<ChevronDownIcon />
						</Button>
						<Popover>
							<Command>
								<SearchField autoFocus className="m-2">
									<Input />
								</SearchField>
								<ListBox>
									{componentsData
										.flatMap((category) => category.components)
										.sort((a, b) => a.name.localeCompare(b.name))
										.map((comp) => (
											<ListBoxItem key={comp.slug} id={comp.slug}>
												{comp.name}
											</ListBoxItem>
										))}
								</ListBox>
							</Command>
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
								<div className="mt-4 **:data-label:pl-1 **:data-label:text-fg-muted">{activePage.config}</div>
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

			{/* Footer */}
			<div className="flex flex-col gap-2 border-t p-3">
				<Button variant="quiet" size="sm" className="w-full text-fg-muted">
					--preset https://dotui.org/p/b2D0wqNxTs
				</Button>
				<Button variant="primary" size="sm" className="w-full">
					Create project
				</Button>
			</div>
		</div>
	);
}
