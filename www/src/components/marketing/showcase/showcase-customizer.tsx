"use client";

import { ArrowRightIcon, ChevronDownIcon } from "lucide-react";
import { DialogTrigger } from "react-aria-components/Dialog";

import { cn } from "@/registry/lib/utils";
import { Button, LinkButton } from "@/registry/ui/button";
import { ColorArea } from "@/registry/ui/color-area";
import { ColorField } from "@/registry/ui/color-field";
import { ColorPicker } from "@/registry/ui/color-picker";
import { ColorSlider } from "@/registry/ui/color-slider";
import { ColorSwatch } from "@/registry/ui/color-swatch";
import { ColorSwatchPicker, ColorSwatchPickerItem } from "@/registry/ui/color-swatch-picker";
import { DialogContent } from "@/registry/ui/dialog";
import { Input } from "@/registry/ui/input";
import { ListBox, ListBoxItem } from "@/registry/ui/list-box";
import { Popover } from "@/registry/ui/popover";
import { Select, SelectValue } from "@/registry/ui/select";
import { Slider, SliderControl } from "@/registry/ui/slider";
import { ToggleButton } from "@/registry/ui/toggle-button";
import { ToggleButtonGroup } from "@/registry/ui/toggle-button-group";

import type { Density } from "@/registry/types";

/**
 * A miniature, live version of the `/create` editor — a control bar that sits just
 * before the showcase grid. The controls drive a {@link DesignSystem} the parent applies
 * to the grid alone (via `DesignSystemProvider`'s `scoped` mode), re-theming the cards in
 * real time while the control bar itself stays on the site's default theme.
 *
 * As the bar narrows it folds its controls into compact popovers/selects one at a time
 * (density → radius → accent, accent last) rather than scrolling — each control renders
 * both an inline form and a collapsed form, toggled by width breakpoints.
 */

/** Accent (brand) seed presets. The first matches `DEFAULT_COLOR_CONFIG.seeds.accent`. */
export const SHOWCASE_ACCENTS = [
	{ name: "Blue", value: "#438cd6" },
	{ name: "Violet", value: "#7c5cff" },
	{ name: "Emerald", value: "#10b981" },
	{ name: "Amber", value: "#f59e0b" },
	{ name: "Rose", value: "#f43f5e" },
	{ name: "Cyan", value: "#06b6d4" },
] as const;

// Labels mirror the /create editor's density names (modules/create/layout-config.tsx)
// so the selected option keeps its name when the user clicks "Open in the editor".
const DENSITIES: ReadonlyArray<{ id: Density; label: string }> = [
	{ id: "compact", label: "Compact" },
	{ id: "default", label: "Default" },
	{ id: "comfortable", label: "Comfortable" },
];

// toString("hex") yields UPPERCASE (#438CD6); lowercase it so re-picking the default
// matches DEFAULT_ACCENT and keeps the editor link clean.
const toHex = (color: { toString: (format: "hex") => string }) => color.toString("hex").toLowerCase();

interface ShowcaseCustomizerProps {
	className?: string;
	accent: string;
	onAccentChange: (hex: string) => void;
	radius: number;
	onRadiusChange: (value: number) => void;
	density: Density;
	onDensityChange: (density: Density) => void;
	/** Deep link into the full editor, pre-seeded with the current tweaks. */
	editorHref: string;
}

export function ShowcaseCustomizer({
	className,
	accent,
	onAccentChange,
	radius,
	onRadiusChange,
	density,
	onDensityChange,
	editorHref,
}: ShowcaseCustomizerProps) {
	return (
		<div
			role="group"
			aria-label="Customize the design system"
			className={cn("flex w-full items-center justify-between gap-4", className)}
		>
			{/* Controls, grouped on the left, separated by a wide gap (no dividers/labels). */}
			<div className="flex shrink-0 items-center gap-7">
				<ControlField>
					{/* inline swatches ≥ 440px, color picker below (collapses last) */}
					<ColorSwatchPicker
						aria-label="Accent color"
						value={accent}
						onChange={(color) => onAccentChange(toHex(color))}
						className="hidden shrink-0 flex-nowrap gap-1 min-[440px]:flex"
					>
						{SHOWCASE_ACCENTS.map((swatch) => (
							<ColorSwatchPickerItem
								key={swatch.value}
								color={swatch.value}
								aria-label={swatch.name}
								className="size-5 rounded-full"
							/>
						))}
					</ColorSwatchPicker>
					<AccentPicker className="shrink-0 min-[440px]:hidden" accent={accent} onAccentChange={onAccentChange} />
				</ControlField>

				<ControlField>
					{/* inline slider ≥ 560px, popover below */}
					<div className="hidden shrink-0 items-center gap-2 min-[560px]:flex">
						<RadiusCurveIcon aria-hidden className="size-4 shrink-0 text-fg-muted" />
						<RadiusSlider radius={radius} onRadiusChange={onRadiusChange} className="w-20" />
					</div>
					<RadiusPopover className="shrink-0 min-[560px]:hidden" radius={radius} onRadiusChange={onRadiusChange} />
				</ControlField>

				<ControlField>
					{/* inline toggle ≥ 700px, select below (collapses first) */}
					<ToggleButtonGroup
						aria-label="Density"
						selectionMode="single"
						disallowEmptySelection
						size="xs"
						selectedKeys={[density]}
						onSelectionChange={(keys) => {
							const next = keys.values().next().value;
							if (typeof next === "string") onDensityChange(next as Density);
						}}
						className="hidden shrink-0 min-[700px]:flex"
					>
						{DENSITIES.map((option) => (
							<ToggleButton key={option.id} id={option.id} className="text-[11px]">
								{option.label}
							</ToggleButton>
						))}
					</ToggleButtonGroup>
					<DensitySelect className="shrink-0 min-[700px]:hidden" density={density} onDensityChange={onDensityChange} />
				</ControlField>
			</div>

			{/* Editor link — pushed to the right edge by justify-between */}
			<LinkButton
				href={editorHref}
				variant="quiet"
				size="xs"
				className="shrink-0 gap-1 whitespace-nowrap text-fg-muted hover:text-fg"
			>
				Open in editor
				<ArrowRightIcon data-icon-end="" />
			</LinkButton>
		</div>
	);
}

/* --------------------------------- Collapsed forms --------------------------------- */

function RadiusSlider({
	radius,
	onRadiusChange,
	className,
}: {
	radius: number;
	onRadiusChange: (value: number) => void;
	className?: string;
}) {
	return (
		<Slider
			aria-label="Radius scale factor"
			value={radius}
			minValue={0}
			maxValue={1.5}
			step={0.1}
			formatOptions={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
			onChange={(value) => onRadiusChange(value as number)}
			className={className}
		>
			<SliderControl />
		</Slider>
	);
}

/** Collapsed radius: a value button that opens the slider in a popover. */
function RadiusPopover({
	className,
	radius,
	onRadiusChange,
}: {
	className?: string;
	radius: number;
	onRadiusChange: (value: number) => void;
}) {
	return (
		<div className={className}>
			<DialogTrigger>
				<Button size="xs" aria-label="Radius scale factor" className="gap-1 tabular-nums">
					{radius.toFixed(1)}×
				</Button>
				<Popover className="w-56 p-3">
					<DialogContent className="flex flex-col gap-2">
						<div className="flex items-center justify-between">
							<span className="text-[10px] tracking-widest text-fg-muted uppercase">Radius</span>
							<span className="text-[10px] font-medium text-fg-muted tabular-nums">{radius.toFixed(1)}×</span>
						</div>
						<RadiusSlider radius={radius} onRadiusChange={onRadiusChange} className="w-full" />
					</DialogContent>
				</Popover>
			</DialogTrigger>
		</div>
	);
}

/** Collapsed density: a Select dropdown. */
function DensitySelect({
	className,
	density,
	onDensityChange,
}: {
	className?: string;
	density: Density;
	onDensityChange: (density: Density) => void;
}) {
	return (
		<div className={className}>
			<Select aria-label="Density" selectedKey={density} onSelectionChange={(key) => onDensityChange(key as Density)}>
				<Button size="xs" className="gap-1">
					<SelectValue className="text-[11px]" />
					<ChevronDownIcon data-icon-end="" />
				</Button>
				<Popover>
					<ListBox>
						{DENSITIES.map((option) => (
							<ListBoxItem key={option.id} id={option.id}>
								{option.label}
							</ListBoxItem>
						))}
					</ListBox>
				</Popover>
			</Select>
		</div>
	);
}

/** Collapsed accent: a swatch button that opens a full color picker in a popover. */
function AccentPicker({
	className,
	accent,
	onAccentChange,
}: {
	className?: string;
	accent: string;
	onAccentChange: (hex: string) => void;
}) {
	return (
		<div className={className}>
			<ColorPicker value={accent} onChange={(color) => onAccentChange(toHex(color))}>
				<Button isIconOnly aria-label="Accent color" className="size-7 rounded-full p-0">
					<ColorSwatch className="size-5 rounded-full border-0" />
				</Button>
				<Popover className="p-3">
					<DialogContent className="flex w-56 flex-col gap-2">
						<div className="flex gap-2">
							<ColorArea colorSpace="hsb" xChannel="saturation" yChannel="brightness" className="flex-1" />
							{/* h-auto self-stretch: match the ColorArea's height at any density/width. */}
							<ColorSlider orientation="vertical" colorSpace="hsb" channel="hue" className="h-auto self-stretch" />
						</div>
						<ColorField aria-label="Hex value" className="w-full">
							<Input size="sm" className="w-full" />
						</ColorField>
					</DialogContent>
				</Popover>
			</ColorPicker>
		</div>
	);
}

// Wraps a control for consistent vertical alignment within the bar.
function ControlField({ children }: { children: React.ReactNode }) {
	return <div className="flex items-center self-stretch">{children}</div>;
}

// A rounded top-left corner — the universal "border radius" glyph design tools use,
// standing in for the word "Radius" next to the slider.
function RadiusCurveIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			{...props}
		>
			<path d="M4 20V10a6 6 0 0 1 6-6h10" />
		</svg>
	);
}
