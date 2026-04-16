import { type ReactNode, useMemo } from "react";
import { getRouteApi } from "@tanstack/react-router";
import {
	ChevronDownIcon,
	ChevronLeftIcon,
	MoonIcon,
	MousePointer2Icon,
	ShuffleIcon,
	Undo2Icon,
} from "lucide-react";
import { AnimatePresence, motion, type Transition } from "motion/react";
import * as ButtonPrimitives from "react-aria-components/Button";

import { componentsData } from "@/modules/docs/components-list/components-data";
import * as icons from "@/registry/__generated__/icons";
import { Button } from "@/registry/ui/button";
import { Command } from "@/registry/ui/command";
import { Input } from "@/registry/ui/input";
import { ListBox, ListBoxItem } from "@/registry/ui/list-box";
import { Popover } from "@/registry/ui/popover";
import { SearchField } from "@/registry/ui/search-field";
import { Select, SelectValue } from "@/registry/ui/select";

import { ColorsConfig } from "./colors-config";
import { AllComponentsView, ComponentDetailView, getComponentDisplayName } from "./components-config";
import {
	CURSOR_DISABLED_VAR,
	CURSOR_INTERACTIVE_VAR,
	CursorConfig,
	DEFAULT_CURSOR_DISABLED,
	DEFAULT_CURSOR_INTERACTIVE,
} from "./cursor-config";
import { IconographyConfig } from "./iconography-config";
import {
	DEFAULT_RADIUS_FACTOR,
	DensityConfig,
	RADIUS_FACTOR_VAR,
	RadiusConfig,
} from "./layout-config";
import { useDesignSystem } from "./preset";
import { TypographyConfig } from "./typography-config";

/* -------------------------------- Types -------------------------------- */

interface MenuItem {
	id: string;
	title: string;
	preview: ReactNode | "dynamic";
	config: ReactNode | "dynamic";
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
		id: "radius",
		title: "Radius",
		preview: "dynamic",
		config: "dynamic",
	},
	{
		id: "density",
		title: "Density",
		preview: "dynamic",
		config: "dynamic",
	},
	{
		id: "cursor",
		title: "Cursor",
		preview: "dynamic",
		config: "dynamic",
	},
];

export const MENU_IDS = new Set(menu.map((m) => m.id));
const menuIds = MENU_IDS;

/* -------------------------------- Panel -------------------------------- */

const routeApi = getRouteApi("/_app/create");

export function CustomizerPanel() {
	const { panel, preview } = routeApi.useSearch();
	const navigate = routeApi.useNavigate();
	const { designSystem, setComponentStyle, setComponentParam, setDensity } = useDesignSystem();

	const navStack = useMemo(() => (panel ? panel.split(".") : []), [panel]);

	function push(id: string) {
		navigate({ search: (prev) => ({ ...prev, panel: [...navStack, id].join(".") }) });
	}

	function pop() {
		const next = navStack.slice(0, -1);
		navigate({ search: (prev) => ({ ...prev, panel: next.length > 0 ? next.join(".") : undefined }) });
	}

	// Resolve param values with fallbacks to their defaults
	const radiusFactor = designSystem.componentParams[RADIUS_FACTOR_VAR] ?? DEFAULT_RADIUS_FACTOR;
	const cursorInteractive =
		designSystem.componentParams[CURSOR_INTERACTIVE_VAR] ?? DEFAULT_CURSOR_INTERACTIVE;
	const cursorDisabled =
		designSystem.componentParams[CURSOR_DISABLED_VAR] ?? DEFAULT_CURSOR_DISABLED;

	// When viewing a component (navStack is a single, non-menu id), lock the preview
	const activeComponent =
		navStack.length === 1 && !menuIds.has(navStack[0]!) ? navStack[0]! : null;
	const effectivePreview = activeComponent ?? preview;

	function renderDynamicPreview(id: string): ReactNode {
		if (id === "radius") {
			const parsed = Number.parseFloat(radiusFactor);
			const numeric = Number.isFinite(parsed) ? parsed : 1;
			return (
				<div className="-mt-1 flex items-center justify-between">
					<div className="flex flex-col items-start gap-1">
						<span className="text-[10px] text-fg-muted uppercase tracking-widest">Factor</span>
						<p className="font-medium tabular-nums">{numeric.toFixed(2)}x</p>
					</div>
					<div
						className="size-7 border"
						style={{ borderRadius: `calc(0.5rem * ${numeric})` }}
					/>
				</div>
			);
		}
		if (id === "density") {
			const gapPx =
				designSystem.density === "compact"
					? 2
					: designSystem.density === "default"
						? 4
						: 7;
			return (
				<div className="-mt-1 flex items-center justify-between">
					<div className="flex flex-col items-start gap-1">
						<span className="text-[10px] text-fg-muted uppercase tracking-widest">Mode</span>
						<p className="font-medium capitalize">{designSystem.density}</p>
					</div>
					<div className="flex flex-col items-end" style={{ gap: `${gapPx}px` }}>
						<div className="h-[2px] w-7 rounded-full bg-fg-muted" />
						<div className="h-[2px] w-7 rounded-full bg-fg-muted" />
						<div className="h-[2px] w-7 rounded-full bg-fg-muted" />
					</div>
				</div>
			);
		}
		if (id === "cursor") {
			return (
				<div className="flex flex-col gap-1.5 text-left">
					<div className="flex items-center justify-between">
						<div className="flex flex-col items-start gap-1">
							<span className="text-[10px] text-fg-muted uppercase tracking-widest">
								Interactive
							</span>
							<p className="font-medium">{cursorInteractive}</p>
						</div>
						<div
							className="flex size-7 items-center justify-center rounded-md border text-fg-muted"
							style={{ cursor: cursorInteractive }}
						>
							<MousePointer2Icon className="size-3.5" />
						</div>
					</div>
					<div className="flex items-center justify-between">
						<div className="flex flex-col items-start gap-1">
							<span className="text-[10px] text-fg-muted uppercase tracking-widest">
								Disabled
							</span>
							<p className="font-medium">{cursorDisabled}</p>
						</div>
						<div
							className="flex size-7 items-center justify-center rounded-md border text-fg-muted"
							style={{ cursor: cursorDisabled }}
						>
							<MousePointer2Icon className="size-3.5" />
						</div>
					</div>
				</div>
			);
		}
		return null;
	}

	function renderDynamicConfig(id: string): ReactNode {
		if (id === "radius") {
			return (
				<RadiusConfig
					value={radiusFactor}
					onChange={(v) => setComponentParam(RADIUS_FACTOR_VAR, v)}
				/>
			);
		}
		if (id === "density") {
			return <DensityConfig value={designSystem.density} onChange={setDensity} />;
		}
		if (id === "cursor") {
			return (
				<CursorConfig
					interactive={cursorInteractive}
					disabled={cursorDisabled}
					onChange={setComponentParam}
				/>
			);
		}
		return null;
	}

	function renderStackedView(index: number) {
		const topLevel = navStack[0]!;

		if (index !== 0) return null;

		// Component detail view (top-level component slug)
		if (!menuIds.has(topLevel)) {
			return (
				<>
					<ViewHeader title={getComponentDisplayName(topLevel)} onBack={pop} />
					<ComponentDetailView
						componentName={topLevel}
						selectedStyle={designSystem.componentStyles[topLevel]}
						onStyleChange={setComponentStyle}
						selectedParams={designSystem.componentParams}
						onParamChange={setComponentParam}
					/>
				</>
			);
		}

		const menuItem = menu.find((m) => m.id === topLevel);
		if (!menuItem) return null;

		const configNode = menuItem.config === "dynamic" ? renderDynamicConfig(topLevel) : menuItem.config;

		return (
			<>
				<ViewHeader title={menuItem.title} onBack={pop} />
				<div className="mt-4 **:data-label:pl-1 **:data-label:text-fg-muted">{configNode}</div>
			</>
		);
	}

	return (
		<div className="relative flex w-72 flex-col rounded-xl border bg-card">
			{/* Header */}
			<div className="relative overflow-hidden border-b p-2">
				<div className="flex w-full items-center gap-2">
					<Select
						value={effectivePreview}
						onChange={(v) => navigate({ search: (prev) => ({ ...prev, preview: v as string }) })}
						isDisabled={!!activeComponent}
						className="min-w-0 flex-1"
					>
						<Button size="sm" className="w-full">
							<SelectValue className="truncate" />
							<ChevronDownIcon data-icon-end="" />
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
					<Button size="icon-sm">
						<ShuffleIcon />
					</Button>
					<Button size="icon-sm">
						<MoonIcon />
					</Button>
					<Button size="icon-sm">
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
							<ButtonPrimitives.Button
								key={item.id}
								onPress={() => push(item.id)}
								className="flex flex-col items-stretch gap-2 rounded-lg border bg-neutral p-3 text-sm transition-colors hover:bg-neutral-hover"
							>
								<div className="text-left text-fg-muted">{item.title}</div>
								<div className="text-left">
									{item.preview === "dynamic" ? renderDynamicPreview(item.id) : item.preview}
								</div>
							</ButtonPrimitives.Button>
						))}

						{/* All components directly accessible from home */}
						<div className="mt-2 flex flex-col gap-2">
							<div className="px-1 text-[10px] text-fg-muted uppercase tracking-widest">
								Components
							</div>
							<AllComponentsView onSelect={(comp) => push(comp)} />
						</div>
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
			<Button variant="quiet" size="icon-sm" onPress={onBack} aria-label="Back" className="size-6">
				<ChevronLeftIcon />
			</Button>
			<h2 className="font-medium text-sm">{title}</h2>
		</div>
	);
}
