"use client";

import React from "react";
import {
	BackgroundColor as AdobeBackgroundColor,
	Color as AdobeColor,
	Theme as AdobeTheme,
} from "@adobe/leonardo-contrast-colors";
import { parseColor } from "react-aria-components";
import type { Color } from "react-aria-components";

import { createTheme } from "@dotui/colors/algorithms/leonardo";
import type { LeonardoColorspace, ContrastFormula } from "@dotui/colors/algorithms/leonardo";
import { generateScale } from "@dotui/colors/algorithms/material";
import { SCALE_STEPS } from "@dotui/colors/types";
import { ColorEditor } from "@dotui/registry/ui/color-editor";
import { ColorPicker, ColorPickerContent, ColorPickerTrigger } from "@dotui/registry/ui/color-picker";
import { ColorSwatch } from "@dotui/registry/ui/color-swatch";
import { Label } from "@dotui/registry/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@dotui/registry/ui/select";
import { Slider, SliderControl, SliderOutput } from "@dotui/registry/ui/slider";
import { Switch } from "@dotui/registry/ui/switch";
import { ToggleButton } from "@dotui/registry/ui/toggle-button";
import { ToggleButtonGroup } from "@dotui/registry/ui/toggle-button-group";

// Default ratios for 11 steps (50-950)
// WCAG2: contrast ratios 1:1 to 21:1 (max theoretical is 21:1)
const WCAG2_RATIOS = [1, 1.15, 1.3, 1.5, 2, 3, 4.5, 7, 11, 16, 21];
// WCAG3/APCA: lightness contrast values (Lc) - max is ~108 for black/white
// Lc 15 ≈ 1.5:1, Lc 30 ≈ 2:1, Lc 45 ≈ 3:1, Lc 60 ≈ 4.5:1, Lc 75 ≈ 7:1, Lc 90 ≈ 11:1
const WCAG3_RATIOS = [0, 7, 15, 25, 40, 55, 70, 80, 90, 100, 180];

// Material tones for light/dark mode
const LIGHT_TONES = [99, 95, 90, 80, 70, 60, 50, 40, 30, 20, 10]; // Default: light to dark
const DARK_TONES = [10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99]; // Reversed: dark to light

// Leonardo colorspace options
const COLORSPACE_OPTIONS: { id: LeonardoColorspace; label: string }[] = [
	{ id: "LAB", label: "LAB" },
	{ id: "LCH", label: "LCH" },
	{ id: "OKLAB", label: "OKLAB" },
	{ id: "OKLCH", label: "OKLCH" },
	{ id: "HSL", label: "HSL" },
	{ id: "HSLuv", label: "HSLuv" },
	{ id: "HSV", label: "HSV" },
	{ id: "RGB", label: "RGB" },
	{ id: "CAM02", label: "CAM02" },
	{ id: "CAM02p", label: "CAM02p" },
];

type ColorMode = "light" | "dark";

// Color scale definitions
const SCALE_NAMES = ["neutral", "accent", "success", "danger", "warning", "info"] as const;
type ScaleName = (typeof SCALE_NAMES)[number];

const DEFAULT_COLORS: Record<ScaleName, string> = {
	neutral: "#6b7280",
	accent: "#6366f1",
	success: "#22c55e",
	danger: "#ef4444",
	warning: "#f59e0b",
	info: "#3b82f6",
};

const SCALE_LABELS: Record<ScaleName, string> = {
	neutral: "Neutral",
	accent: "Accent",
	success: "Success",
	danger: "Danger",
	warning: "Warning",
	info: "Info",
};

// Types for theme output
interface ScaleValues {
	[step: string]: string;
}

interface ThemeOutput {
	background: string;
	scales: Record<ScaleName, ScaleValues>;
}

type AlgorithmId = "adobe" | "ours" | "material";

export default function InternalPage() {
	// Active algorithm
	const [activeAlgorithm, setActiveAlgorithm] = React.useState<AlgorithmId>("adobe");

	// Light/dark mode
	const [colorMode, setColorMode] = React.useState<ColorMode>("light");

	// Source colors for each scale
	const [colors, setColors] = React.useState<Record<ScaleName, Color>>(() => ({
		neutral: parseColor(DEFAULT_COLORS.neutral),
		accent: parseColor(DEFAULT_COLORS.accent),
		success: parseColor(DEFAULT_COLORS.success),
		danger: parseColor(DEFAULT_COLORS.danger),
		warning: parseColor(DEFAULT_COLORS.warning),
		info: parseColor(DEFAULT_COLORS.info),
	}));

	// Leonardo-specific controls
	const [lightness, setLightness] = React.useState(97);
	const [saturation, setSaturation] = React.useState(100);
	const [contrast, setContrast] = React.useState(100);
	const [formula, setFormula] = React.useState<ContrastFormula>("wcag2");
	const [colorspace, setColorspace] = React.useState<LeonardoColorspace>("LAB");
	const [smooth, setSmooth] = React.useState(false);

	// Material-specific controls
	const [contrastLevel, setContrastLevel] = React.useState(0);
	const [chromaOverride, setChromaOverride] = React.useState(50);
	const [chromaEnabled, setChromaEnabled] = React.useState(false);
	const [hueOverride, setHueOverride] = React.useState(180);
	const [hueEnabled, setHueEnabled] = React.useState(false);

	// Update lightness when mode changes (for Leonardo)
	React.useEffect(() => {
		setLightness(colorMode === "light" ? 97 : 10);
	}, [colorMode]);

	const updateColor = (name: ScaleName, color: Color) => {
		setColors((prev) => ({ ...prev, [name]: color }));
	};

	// Get hex colors
	const hexColors = React.useMemo(
		() =>
			Object.fromEntries(SCALE_NAMES.map((name) => [name, colors[name].toString("hex")])) as Record<ScaleName, string>,
		[colors],
	);

	// Background color (neutral key color for all algorithms)
	const backgroundColor = hexColors.neutral;

	// Generate Adobe Leonardo theme
	const adobeTheme = React.useMemo<ThemeOutput | null>(() => {
		try {
			// Use appropriate ratios based on formula
			const ratios = formula === "wcag3" ? WCAG3_RATIOS : WCAG2_RATIOS;

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const neutralBg = new AdobeBackgroundColor({
				name: "neutral",
				colorKeys: [hexColors.neutral],
				ratios,
				colorspace,
			} as any);

			// Include neutral as a regular color too (for the scale)
			const colorInstances = SCALE_NAMES.map(
				(name) =>
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					new AdobeColor({
						name,
						colorKeys: [hexColors[name]],
						ratios,
						colorspace,
						smooth,
					} as any),
			);

			const theme = new AdobeTheme({
				backgroundColor: neutralBg,
				colors: colorInstances,
				lightness,
				saturation,
				contrast: contrast / 100,
				output: "HEX",
				formula,
			});

			const scales: Record<ScaleName, ScaleValues> = {
				neutral: {},
				accent: {},
				success: {},
				danger: {},
				warning: {},
				info: {},
			};

			// Extract colors from theme (including neutral now)
			for (const colorResult of theme.contrastColors) {
				if ("background" in colorResult) continue;
				const scaleName = colorResult.name as ScaleName;
				if (!SCALE_NAMES.includes(scaleName)) continue;

				for (let i = 0; i < colorResult.values.length; i++) {
					const step = SCALE_STEPS[i];
					const colorValue = colorResult.values[i];
					if (step && colorValue) {
						scales[scaleName][step] = colorValue.value;
					}
				}
			}

			return {
				background: theme.contrastColors[0] && "background" in theme.contrastColors[0]
					? theme.contrastColors[0].background
					: backgroundColor,
				scales,
			};
		} catch (e) {
			console.error("Adobe Leonardo error:", e);
			return null;
		}
	}, [hexColors, lightness, saturation, contrast, backgroundColor, formula, colorspace, smooth]);

	// Generate Our Leonardo theme
	const ourTheme = React.useMemo<ThemeOutput | null>(() => {
		try {
			// Use appropriate ratios based on formula
			const ratios = formula === "wcag3" ? WCAG3_RATIOS : WCAG2_RATIOS;

			// Include all colors including neutral
			const theme = createTheme({
				colors: SCALE_NAMES.map((name) => ({
					name,
					colorKeys: [hexColors[name]],
					ratios,
					colorspace,
					smooth,
				})),
				backgroundColor: hexColors.neutral,
				lightness,
				saturation,
				contrast: contrast / 100,
				formula,
			});

			const scales: Record<ScaleName, ScaleValues> = {
				neutral: {},
				accent: {},
				success: {},
				danger: {},
				warning: {},
				info: {},
			};

			// Copy all color scales including neutral
			for (const name of SCALE_NAMES) {
				if (theme.colors[name]) {
					scales[name] = theme.colors[name];
				}
			}

			return {
				background: theme.background,
				scales,
			};
		} catch (e) {
			console.error("Our Leonardo error:", e);
			return null;
		}
	}, [hexColors, lightness, saturation, contrast, backgroundColor, formula, colorspace, smooth]);

	// Generate Material HCT scales
	const materialTheme = React.useMemo<ThemeOutput | null>(() => {
		try {
			const scales: Record<ScaleName, ScaleValues> = {
				neutral: {},
				accent: {},
				success: {},
				danger: {},
				warning: {},
				info: {},
			};

			const tones = colorMode === "light" ? LIGHT_TONES : DARK_TONES;

			for (const name of SCALE_NAMES) {
				const scale = generateScale({
					color: hexColors[name],
					contrastLevel,
					tones,
					chroma: chromaEnabled ? chromaOverride : undefined,
					hue: hueEnabled ? hueOverride : undefined,
				});
				for (const step of SCALE_STEPS) {
					scales[name][step] = scale[step];
				}
			}

			return {
				background: backgroundColor,
				scales,
			};
		} catch (e) {
			console.error("Material HCT error:", e);
			return null;
		}
	}, [hexColors, contrastLevel, backgroundColor, colorMode, chromaEnabled, chromaOverride, hueEnabled, hueOverride]);

	const isLeonardo = activeAlgorithm === "adobe" || activeAlgorithm === "ours";

	return (
		<div className="container max-w-6xl py-12">
			<div className="space-y-6">
				{/* Controls Panel */}
				<div className="space-y-4 rounded-lg border bg-bg-muted/50 p-6">
					{/* Algorithm & Mode Selectors */}
					<div className="flex flex-wrap items-start gap-6">
						<div>
							<h3 className="mb-3 font-medium text-sm">Algorithm</h3>
							<ToggleButtonGroup
								selectedKeys={[activeAlgorithm]}
								onSelectionChange={(keys) => setActiveAlgorithm([...keys].at(0) as AlgorithmId)}
								size="sm"
							>
								<ToggleButton id="adobe">Adobe Leonardo</ToggleButton>
								<ToggleButton id="ours">Our Leonardo</ToggleButton>
								<ToggleButton id="material">Material HCT</ToggleButton>
							</ToggleButtonGroup>
						</div>
						<div>
							<h3 className="mb-3 font-medium text-sm">Mode</h3>
							<ToggleButtonGroup
								selectedKeys={[colorMode]}
								onSelectionChange={(keys) => setColorMode([...keys].at(0) as ColorMode)}
								size="sm"
							>
								<ToggleButton id="light">Light</ToggleButton>
								<ToggleButton id="dark">Dark</ToggleButton>
							</ToggleButtonGroup>
						</div>
					</div>
					{/* Source Colors */}
					<div className="border-t pt-4">
						<h3 className="mb-3 font-medium text-sm">Source Colors</h3>
						<div className="flex flex-wrap gap-3">
							{SCALE_NAMES.map((name) => (
								<ColorPicker key={name} value={colors[name]} onChange={(c) => updateColor(name, c)}>
									<ColorPickerTrigger className="gap-2">
										<ColorSwatch className="size-5 rounded" />
										<span className="text-sm">{SCALE_LABELS[name]}</span>
									</ColorPickerTrigger>
									<ColorPickerContent>
										<ColorEditor />
									</ColorPickerContent>
								</ColorPicker>
							))}
						</div>
					</div>

					{/* Algorithm-specific controls */}
					{isLeonardo && (
						<div className="space-y-4 border-t pt-4">
							{/* Sliders row */}
							<div className="grid grid-cols-1 gap-4 **:data-slider-control:w-full md:grid-cols-3">
								<Slider value={lightness} onChange={(v) => setLightness(v as number)} minValue={0} maxValue={100}>
									<div className="flex w-full items-center justify-between">
										<Label>Lightness</Label>
										<SliderOutput />
									</div>
									<SliderControl />
								</Slider>

								<Slider value={saturation} onChange={(v) => setSaturation(v as number)} minValue={0} maxValue={100}>
									<div className="flex w-full items-center justify-between">
										<Label>Saturation</Label>
										<SliderOutput />
									</div>
									<SliderControl />
								</Slider>

								<Slider value={contrast} onChange={(v) => setContrast(v as number)} minValue={50} maxValue={200}>
									<div className="flex w-full items-center justify-between">
										<Label>Contrast (%)</Label>
										<SliderOutput />
									</div>
									<SliderControl />
								</Slider>
							</div>

							{/* Advanced options row */}
							<div className="flex flex-wrap items-end gap-4">
								{/* Formula */}
								<div>
									<Label className="mb-2 block text-xs">Formula</Label>
									<ToggleButtonGroup
										selectedKeys={[formula]}
										onSelectionChange={(keys) => setFormula([...keys].at(0) as ContrastFormula)}
										size="sm"
									>
										<ToggleButton id="wcag2">WCAG 2</ToggleButton>
										<ToggleButton id="wcag3">WCAG 3</ToggleButton>
									</ToggleButtonGroup>
								</div>

								{/* Colorspace */}
								<div>
									<Label className="mb-2 block text-xs">Colorspace</Label>
									<Select
										selectedKey={colorspace}
										onSelectionChange={(key) => setColorspace(key as LeonardoColorspace)}
									>
										<SelectTrigger className="w-[120px]">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{COLORSPACE_OPTIONS.map((opt) => (
												<SelectItem key={opt.id} id={opt.id}>
													{opt.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								{/* Smooth */}
								<div className="flex items-center gap-2">
									<Switch isSelected={smooth} onChange={setSmooth} size="sm" />
									<Label className="text-xs">Smooth interpolation</Label>
								</div>
							</div>
						</div>
					)}

					{activeAlgorithm === "material" && (
						<div className="space-y-4 border-t pt-4">
							{/* Main controls */}
							<div className="grid grid-cols-1 gap-4 **:data-slider-control:w-full md:grid-cols-3">
								<Slider
									value={contrastLevel}
									onChange={(v) => setContrastLevel(v as number)}
									minValue={-1}
									maxValue={1}
									step={0.1}
								>
									<div className="flex items-center justify-between">
										<Label>Contrast Level</Label>
										<SliderOutput />
									</div>
									<SliderControl />
								</Slider>

								{/* Chroma override */}
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<Switch isSelected={chromaEnabled} onChange={setChromaEnabled} size="sm" />
										<Label className="text-xs">Override Chroma</Label>
									</div>
									{chromaEnabled && (
										<Slider
											value={chromaOverride}
											onChange={(v) => setChromaOverride(v as number)}
											minValue={0}
											maxValue={150}
										>
											<div className="flex items-center justify-between">
												<Label className="text-xs">Chroma</Label>
												<SliderOutput />
											</div>
											<SliderControl />
										</Slider>
									)}
								</div>

								{/* Hue override */}
								<div className="space-y-2">
									<div className="flex items-center gap-2">
										<Switch isSelected={hueEnabled} onChange={setHueEnabled} size="sm" />
										<Label className="text-xs">Override Hue</Label>
									</div>
									{hueEnabled && (
										<Slider
											value={hueOverride}
											onChange={(v) => setHueOverride(v as number)}
											minValue={0}
											maxValue={360}
										>
											<div className="flex items-center justify-between">
												<Label className="text-xs">Hue</Label>
												<SliderOutput />
											</div>
											<SliderControl />
										</Slider>
									)}
								</div>
							</div>

							<div className="text-fg-muted text-xs">
								<strong>Contrast:</strong> -1 = Reduced | 0 = Standard | 1 = High
								{chromaEnabled && <span> &nbsp;|&nbsp; <strong>Chroma:</strong> 0-150 (colorfulness)</span>}
								{hueEnabled && <span> &nbsp;|&nbsp; <strong>Hue:</strong> 0-360°</span>}
							</div>
						</div>
					)}
				</div>

				{/* Output Display */}
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<h2 className="font-semibold">
							{activeAlgorithm === "adobe" && "Adobe Leonardo"}
							{activeAlgorithm === "ours" && "Our Leonardo"}
							{activeAlgorithm === "material" && "Material HCT"}
						</h2>
						<span className="text-fg-muted text-sm">
							{activeAlgorithm === "adobe" && "— Original contrast-colors library"}
							{activeAlgorithm === "ours" && "— Color.js-based implementation"}
							{activeAlgorithm === "material" && "— Tone-based (HCT color space)"}
						</span>
					</div>

					{activeAlgorithm === "adobe" && adobeTheme && <ThemeDisplay theme={adobeTheme} />}
					{activeAlgorithm === "ours" && ourTheme && <ThemeDisplay theme={ourTheme} />}
					{activeAlgorithm === "material" && materialTheme && <ThemeDisplay theme={materialTheme} />}
				</div>
			</div>
		</div>
	);
}

// Theme display component
function ThemeDisplay({ theme }: { theme: ThemeOutput }) {
	return (
		<div className="space-y-4">
			{/* Background */}
			<div className="flex items-center gap-3">
				<span className="w-16 text-fg-muted text-sm">Background</span>
				<div className="size-6 rounded border" style={{ backgroundColor: theme.background }} />
				<code className="font-mono text-xs">{theme.background}</code>
			</div>

			{/* Color Scales */}
			<div className="space-y-2">
				{SCALE_NAMES.map((name) => (
					<ColorScaleRow key={name} name={SCALE_LABELS[name]} scale={theme.scales[name]} />
				))}
			</div>
		</div>
	);
}

// Color scale row component
function ColorScaleRow({ name, scale }: { name: string; scale: ScaleValues }) {
	return (
		<div className="flex items-center gap-3">
			<span className="w-16 text-fg-muted text-sm">{name}</span>
			<div className="flex flex-1 gap-0.5">
				{SCALE_STEPS.map((step) => (
					<div key={step} className="group relative flex-1" title={`${step}: ${scale[step]}`}>
						<div className="aspect-square w-full rounded-sm" style={{ backgroundColor: scale[step] }} />
						<div className="-bottom-4 absolute inset-x-0 text-center font-mono text-[8px] text-fg-muted opacity-0 transition-opacity group-hover:opacity-100">
							{step}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
