import { type ReactNode, useMemo } from "react";

import { getRouteApi } from "@tanstack/react-router";

import { ChevronLeftIcon, ChevronRightIcon, RotateCcwIcon, ShuffleIcon } from "lucide-react";
import { AnimatePresence, motion, type Transition } from "motion/react";
import * as ButtonPrimitives from "react-aria-components/Button";

import { DEFAULT_COLOR_CONFIG } from "@/registry/theme";
import { Button } from "@/registry/ui/button";
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip";

import type { ColorConfig } from "@/registry/theme";

import { ColorsConfig } from "./colors-config";
import {
	ComponentDetailView,
	GroupCards,
	GroupConfigView,
	getComponentDisplayName,
	getGroupDisplayName,
	isGroupId,
} from "./components-config";
import {
	CURSOR_DISABLED_VAR,
	CURSOR_INTERACTIVE_VAR,
	CursorConfig,
	DEFAULT_CURSOR_DISABLED,
	DEFAULT_CURSOR_INTERACTIVE,
} from "./cursor-config";
import { IconographyControls } from "./iconography-config";
import { InstallCommand } from "./install-command";
import { DEFAULT_RADIUS_FACTOR, DensityConfig, RADIUS_FACTOR_VAR, RadiusConfig } from "./layout-config";
import { OpenInV0 } from "./open-in-v0";
import { useDesignSystem } from "./preset";
import { SeedColorPicker } from "./seed-color-picker";
import { TypographyConfig, TypographyControls } from "./typography-config";

/* ------------------------------ Animation ------------------------------ */

const stackTransition: Transition = {
	x: { type: "tween", duration: 0.35, ease: [0.32, 0.72, 0, 1] },
};

/* ----------------------------- Drill-in views ---------------------------- */

/** Config panels reached from a section's "Customize" link. */
const CONFIG_TITLES: Record<string, string> = {
	colors: "Colors",
	typography: "Typography",
};
const CONFIG_IDS = new Set(Object.keys(CONFIG_TITLES));

/* ------------------------------ Randomize ------------------------------- */

function hslToHex(h: number, s: number, l: number): string {
	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = l - c / 2;
	let r = 0;
	let g = 0;
	let b = 0;
	if (h < 60) [r, g, b] = [c, x, 0];
	else if (h < 120) [r, g, b] = [x, c, 0];
	else if (h < 180) [r, g, b] = [0, c, x];
	else if (h < 240) [r, g, b] = [0, x, c];
	else if (h < 300) [r, g, b] = [x, 0, c];
	else [r, g, b] = [c, 0, x];
	const toHex = (v: number) =>
		Math.round((v + m) * 255)
			.toString(16)
			.padStart(2, "0");
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * A fresh, usable palette: a vivid accent on a near-neutral base. Status hues are left intact;
 * tuning knobs are dropped — they were calibrated for the previous seed and would skew the new one.
 */
function randomizeColors(base: ColorConfig): ColorConfig {
	const accent = hslToHex(Math.floor(Math.random() * 360), 0.62 + Math.random() * 0.28, 0.5 + Math.random() * 0.08);
	const neutral = hslToHex(Math.floor(Math.random() * 360), 0.03 + Math.random() * 0.05, 0.5);
	return { ...base, seeds: { ...base.seeds, accent, neutral }, knobs: undefined };
}

/* -------------------------------- Panel -------------------------------- */

const routeApi = getRouteApi("/_app/create");

export function CustomizerPanel() {
	const { panel } = routeApi.useSearch();
	const navigate = routeApi.useNavigate();
	const { designSystem, setComponentParam, setToken, setDensity, setColorSeed, setDesignSystem } = useDesignSystem();

	const navStack = useMemo(() => (panel ? panel.split(".") : []), [panel]);

	function push(id: string) {
		navigate({ search: (prev) => ({ ...prev, panel: [...navStack, id].join(".") }) });
	}

	function pop() {
		const next = navStack.slice(0, -1);
		navigate({ search: (prev) => ({ ...prev, panel: next.length > 0 ? next.join(".") : undefined }) });
	}

	// Opening a category's config also points the live preview at the whole group, so you edit what you see.
	function selectGroup(group: string) {
		navigate({ search: (prev) => ({ ...prev, preview: group, panel: [...navStack, group].join(".") }) });
	}

	function reset() {
		// Clear the design system (preset), pop the nav (panel), and return the preview to its
		// default — otherwise a previously selected component stays pointed at, desyncing the toolbar.
		navigate({ search: (prev) => ({ ...prev, preset: undefined, panel: undefined, preview: undefined }) });
	}

	function randomize() {
		setDesignSystem((prev) => ({ ...prev, color: randomizeColors(prev.color ?? DEFAULT_COLOR_CONFIG) }));
	}

	// Resolve global theme tokens with fallbacks to their defaults
	const radiusFactor = designSystem.tokens[RADIUS_FACTOR_VAR] ?? DEFAULT_RADIUS_FACTOR;
	const cursorInteractive = designSystem.tokens[CURSOR_INTERACTIVE_VAR] ?? DEFAULT_CURSOR_INTERACTIVE;
	const cursorDisabled = designSystem.tokens[CURSOR_DISABLED_VAR] ?? DEFAULT_CURSOR_DISABLED;
	const colorConfig = designSystem.color ?? DEFAULT_COLOR_CONFIG;
	const accentSeed = colorConfig.seeds.accent ?? DEFAULT_COLOR_CONFIG.seeds.accent;
	const neutralSeed = colorConfig.seeds.neutral ?? DEFAULT_COLOR_CONFIG.seeds.neutral;

	function renderConfig(id: string): ReactNode {
		switch (id) {
			case "colors":
				return <ColorsConfig />;
			case "typography":
				return <TypographyConfig />;
			default:
				return null;
		}
	}

	function renderStackedView(index: number) {
		const id = navStack[index];
		if (!id) return null;

		// Advanced config view. Checked FIRST: a config id ("typography") can collide with a
		// registry group id (the `text` component is group "typography"), and the config must win.
		if (CONFIG_IDS.has(id)) {
			return (
				<>
					<ViewHeader title={CONFIG_TITLES[id] ?? ""} onBack={pop} />
					<div className="mt-4 **:data-label:pl-1 **:data-label:text-fg-muted">{renderConfig(id)}</div>
				</>
			);
		}

		// Group config view — every configurable component in the category on one page.
		if (isGroupId(id)) {
			return (
				<>
					<ViewHeader title={getGroupDisplayName(id)} onBack={pop} />
					<GroupConfigView
						groupName={id}
						componentParams={designSystem.componentParams}
						onParamChange={setComponentParam}
					/>
				</>
			);
		}

		// Component detail view (any remaining id)
		return (
			<>
				<ViewHeader title={getComponentDisplayName(id)} onBack={pop} />
				<ComponentDetailView
					componentName={id}
					selectedParams={designSystem.componentParams[id] ?? {}}
					onParamChange={(paramName, value) => setComponentParam(id, paramName, value)}
				/>
			</>
		);
	}

	return (
		<div className="relative flex w-80 shrink-0 flex-col overflow-hidden rounded-xl border bg-card">
			{/* Header — h-12 to line up with the preview toolbar across the gap */}
			<div className="flex h-12 shrink-0 items-center justify-between border-b pr-2 pl-3">
				<span className="text-sm font-medium">Customize</span>
				<div className="flex items-center gap-0.5">
					<Tooltip>
						<Button size="sm" isIconOnly variant="quiet" onPress={randomize} aria-label="Randomize colors">
							<ShuffleIcon />
						</Button>
						<TooltipContent>Randomize colors</TooltipContent>
					</Tooltip>
					<Tooltip>
						<Button size="sm" isIconOnly variant="quiet" onPress={reset} aria-label="Reset to defaults">
							<RotateCcwIcon />
						</Button>
						<TooltipContent>Reset to defaults</TooltipContent>
					</Tooltip>
				</div>
			</div>

			{/* Body */}
			<div className="relative flex-1 overflow-hidden">
				{/* Home — always mounted, shifts left when covered */}
				<motion.div
					initial={false}
					animate={{ x: navStack.length > 0 ? "-50%" : 0 }}
					transition={stackTransition}
					className="absolute inset-0 scrollbar-none overflow-y-auto"
				>
					<div className="flex flex-col gap-6 p-3">
						{/* Colors — inline accent + base, full recipe behind Customize */}
						<section className="flex flex-col gap-2">
							<CategoryHeader title="Colors" onCustomize={() => push("colors")} />
							<div className="grid grid-cols-2 gap-2.5">
								<InlineField label="Accent">
									<SeedColorPicker
										aria-label="Accent color"
										value={accentSeed}
										onChange={(hex) => setColorSeed("accent", hex)}
									/>
								</InlineField>
								<InlineField label="Base">
									<SeedColorPicker
										aria-label="Base color"
										value={neutralSeed}
										onChange={(hex) => setColorSeed("neutral", hex)}
									/>
								</InlineField>
							</div>
						</section>

						{/* Typography — inline fonts, fuller panel behind Customize */}
						<section className="flex flex-col gap-2">
							<CategoryHeader title="Typography" onCustomize={() => push("typography")} />
							<TypographyControls />
						</section>

						{/* Single-control knobs — labeled like fields */}
						<InlineField label="Icon library">
							<IconographyControls />
						</InlineField>

						<RadiusConfig value={radiusFactor} onChange={(v) => setToken(RADIUS_FACTOR_VAR, v)} />

						<InlineField label="Density">
							<DensityConfig value={designSystem.density} onChange={setDensity} />
						</InlineField>

						{/* Cursor */}
						<section className="flex flex-col gap-2">
							<CategoryHeader title="Cursor" />
							<CursorConfig interactive={cursorInteractive} disabled={cursorDisabled} onChange={setToken} />
						</section>

						{/* Components — clickable category cards */}
						<section className="flex flex-col gap-2.5">
							<CategoryHeader title="Components" />
							<GroupCards onSelectGroup={(group) => selectGroup(group)} />
						</section>
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
								className="absolute inset-0 scrollbar-none overflow-y-auto overscroll-contain bg-card p-3"
							>
								{renderStackedView(index)}
							</motion.div>
						);
					})}
				</AnimatePresence>
			</div>

			{/* Footer */}
			<div className="flex shrink-0 flex-col gap-2 border-t p-3">
				<InstallCommand />
				<OpenInV0 />
			</div>
		</div>
	);
}

/* ------------------------------ Home pieces ----------------------------- */

/** Prominent category title (Colors, Typography, …) with an optional "Customize" link. */
function CategoryHeader({ title, onCustomize }: { title: string; onCustomize?: () => void }) {
	return (
		<div className="flex items-center justify-between">
			<h3 className="text-sm font-medium text-fg">{title}</h3>
			{onCustomize && (
				<ButtonPrimitives.Button
					onPress={onCustomize}
					aria-label={`Customize ${title.toLowerCase()}`}
					className="flex items-center gap-0.5 rounded text-xs text-fg-muted transition-colors outline-none hover:text-fg focus-visible:ring-2 focus-visible:ring-border-focus"
				>
					Customize
					<ChevronRightIcon className="size-3" />
				</ButtonPrimitives.Button>
			)}
		</div>
	);
}

/** Uniform field with a muted sub-label (Accent, Base, …). */
function InlineField({ label, children }: { label: string; children: ReactNode }) {
	return (
		<div className="flex flex-col gap-1.5">
			<span className="text-xs font-medium text-fg-muted">{label}</span>
			{children}
		</div>
	);
}

function ViewHeader({ title, onBack }: { title: string; onBack: () => void }) {
	return (
		<div className="mb-3 -ml-1 flex items-center gap-2">
			<Button variant="quiet" size="sm" isIconOnly onPress={onBack} aria-label="Back" className="size-6">
				<ChevronLeftIcon />
			</Button>
			<h2 className="text-sm font-medium">{title}</h2>
		</div>
	);
}
