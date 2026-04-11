import { type ReactNode, useMemo } from "react";
import { getRouteApi } from "@tanstack/react-router";
import { ChevronDownIcon, ChevronLeftIcon, MoonIcon, ShuffleIcon, Undo2Icon } from "lucide-react";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { Button as AriaButton } from "react-aria-components";

import { componentsData } from "@/modules/docs/components-list/components-data";
import * as icons from "@/registry/__generated__/icons";
import { Badge } from "@/registry/ui/badge";
import { Button } from "@/registry/ui/button";
import { Checkbox } from "@/registry/ui/checkbox";
import { Command } from "@/registry/ui/command";
import { Input } from "@/registry/ui/input";
import { ListBox, ListBoxItem } from "@/registry/ui/list-box";
import { Popover } from "@/registry/ui/popover";
import { SearchField } from "@/registry/ui/search-field";
import { Select, SelectValue } from "@/registry/ui/select";
import { Switch } from "@/registry/ui/switch";

import { ColorsConfig } from "./colors-config";
import { AllComponentsView, ComponentDetailView, getComponentDisplayName } from "./components-config";
import { IconographyConfig } from "./iconography-config";
import { LayoutConfig } from "./layout-config";
import { useDesignSystem } from "./preset";
import { TypographyConfig } from "./typography-config";

/* -------------------------------- Types -------------------------------- */

interface MenuItem {
	id: string;
	title: string;
	preview: ReactNode;
	config: ReactNode;
}

/* ------------------------------ Animation ------------------------------ */

const stackTransition: Transition = {
	x: { type: "tween", duration: 0.35, ease: [0.32, 0.72, 0, 1] },
};

/* --------------------------------- Menu -------------------------------- */

const menu: MenuItem[] = [
	{
		id: "colors",
		title: "Colors",
		preview: (
			<div className="flex flex-col gap-1.5">
				{[
					{
						name: "Base color",
						value: "neutral",
						className: "bg-neutral",
					},
					{
						name: "Theme",
						value: "blue",
						className: "bg-blue-500",
					},
				].map((item) => (
					<div key={item.name} className="flex items-center justify-between">
						<div className="flex flex-col items-start gap-1">
							<span className="text-[10px] text-fg-muted uppercase tracking-widest">{item.name}</span>
							<p className="font-medium">{item.value}</p>
						</div>
						<div className={`size-7 rounded-md border ${item.className}`} />
					</div>
				))}
			</div>
		),
		config: <ColorsConfig />,
	},
	{
		id: "typography",
		title: "Typography",
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
		preview: (
			<div className="pointer-events-none flex items-center gap-2">
				<Switch defaultSelected className="scale-75" />
				<Checkbox defaultSelected className="scale-90" />
				<Badge>Badge</Badge>
			</div>
		),
		config: null, // Handled by stack-based sub-navigation
	},
];

/* -------------------------------- Panel -------------------------------- */

const routeApi = getRouteApi("/_app/create");

export function CustomizerPanel() {
	const { panel, preview } = routeApi.useSearch();
	const navigate = routeApi.useNavigate();
	const { designSystem, setComponentStyle, setComponentParam } = useDesignSystem();

	const navStack = useMemo(() => (panel ? panel.split(".") : []), [panel]);

	function push(id: string) {
		navigate({ search: (prev) => ({ ...prev, panel: [...navStack, id].join(".") }) });
	}

	function pop() {
		const next = navStack.slice(0, -1);
		navigate({ search: (prev) => ({ ...prev, panel: next.length > 0 ? next.join(".") : undefined }) });
	}

	// When on a component detail, lock the preview to that component
	const activeComponent = navStack[0] === "components" && navStack.length === 2 ? navStack[1]! : null;
	const effectivePreview = activeComponent ?? preview;

	function renderStackedView(index: number) {
		const topLevel = navStack[0]!;

		if (index === 0) {
			if (topLevel === "components") {
				return (
					<>
						<ViewHeader title="Components" onBack={pop} />
						<AllComponentsView onSelect={(comp) => push(comp)} />
					</>
				);
			}
			const menuItem = menu.find((m) => m.id === topLevel);
			if (!menuItem) return null;
			return (
				<>
					<ViewHeader title={menuItem.title} onBack={pop} />
					<div className="mt-4 **:data-label:pl-1 **:data-label:text-fg-muted">{menuItem.config}</div>
				</>
			);
		}

		if (index === 1 && topLevel === "components") {
			const componentName = navStack[1]!;
			return (
				<>
					<ViewHeader title={getComponentDisplayName(componentName)} onBack={pop} />
					<ComponentDetailView
						componentName={componentName}
						selectedStyle={designSystem.componentStyles[componentName]}
						onStyleChange={setComponentStyle}
						selectedParams={designSystem.componentParams}
						onParamChange={setComponentParam}
					/>
				</>
			);
		}

		return null;
	}

	return (
		<div className="relative flex w-72 flex-col rounded-xl border bg-card">
			{/* Header */}
			<div className="relative overflow-hidden border-b p-3">
				<div className="flex w-full items-center gap-2">
					<Select
						value={effectivePreview}
						onChange={(v) => navigate({ search: (prev) => ({ ...prev, preview: v as string }) })}
						isDisabled={!!activeComponent}
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
				{/* Home — always mounted, shifts left when covered */}
				<motion.div
					initial={false}
					animate={{ x: navStack.length > 0 ? "-50%" : 0 }}
					transition={stackTransition}
					className="absolute inset-0 overflow-y-auto p-3"
				>
					<div className="flex flex-col gap-3">
						{menu.map((item) => (
							<AriaButton
								key={item.id}
								onPress={() => push(item.id)}
								className="flex flex-col items-stretch gap-2 rounded-lg border bg-neutral p-3 text-sm transition-colors hover:bg-neutral-hover"
							>
								<div className="text-left text-fg-muted">{item.title}</div>
								<div>{item.preview}</div>
							</AriaButton>
						))}
					</div>
				</motion.div>

				{/* Stacked views — each layer covers the one below */}
				<AnimatePresence initial={false}>
					{navStack.map((_, index) => {
						const isCovered = index < navStack.length - 1;
						return (
							<motion.div
								key={navStack.slice(0, index + 1).join("/")}
								initial={{ x: "100%" }}
								animate={{ x: isCovered ? "-50%" : 0 }}
								exit={{ x: "100%" }}
								transition={stackTransition}
								className="absolute inset-0 overflow-y-auto overscroll-none bg-card p-3"
							>
								{renderStackedView(index)}
							</motion.div>
						);
					})}
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

function ViewHeader({ title, onBack }: { title: string; onBack: () => void }) {
	return (
		<div className="mb-3 -ml-1 flex items-center gap-2">
			<Button variant="quiet" size="sm" onPress={onBack} aria-label="Back" className="size-6">
				<ChevronLeftIcon />
			</Button>
			<h2 className="font-medium text-sm">{title}</h2>
		</div>
	);
}
