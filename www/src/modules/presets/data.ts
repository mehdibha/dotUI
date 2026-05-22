import type { DesignSystem } from "@/modules/create/preset";

/**
 * A curated design system preset shown on the explore page. The `system` field
 * is encoded at runtime via `encodePreset` and used as the `?preset=` query
 * passed to `/create`.
 */
export interface PresetDefinition {
	id: string;
	name: string;
	description: string;
	tags: string[];
	system: DesignSystem;
}

const accent = (ramp: Record<number, string>): Record<string, string> => {
	const out: Record<string, string> = {};
	for (const [shade, value] of Object.entries(ramp)) {
		out[`--accent-${shade}`] = value;
	}
	return out;
};

const baseSystem = (): DesignSystem => ({
	componentParams: {},
	tokens: {},
	density: "compact",
});

export const presets: PresetDefinition[] = [
	{
		id: "minimal",
		name: "Minimal",
		description: "Sharp edges, tight spacing, monochrome — the no-nonsense baseline.",
		tags: ["sharp", "compact", "neutral"],
		system: {
			...baseSystem(),
			tokens: {
				"--radius-factor": "0",
			},
			density: "compact",
		},
	},
	{
		id: "default",
		name: "Default",
		description: "The opinionated starting point shipped out of the box.",
		tags: ["balanced", "neutral"],
		system: {
			...baseSystem(),
			tokens: {
				"--radius-factor": "1",
			},
			density: "default",
		},
	},
	{
		id: "soft",
		name: "Soft",
		description: "Generously rounded, comfortable density, gentle sky accent.",
		tags: ["rounded", "comfortable", "sky"],
		system: {
			...baseSystem(),
			tokens: {
				"--radius-factor": "1.5",
				...accent({
					50: "hsl(204, 100%, 95%)",
					100: "hsl(204, 100%, 90%)",
					200: "hsl(204, 100%, 82%)",
					300: "hsl(204, 95%, 72%)",
					400: "hsl(204, 90%, 62%)",
					500: "hsl(204, 85%, 52%)",
					600: "hsl(204, 80%, 42%)",
					700: "hsl(204, 75%, 34%)",
					800: "hsl(204, 70%, 26%)",
					900: "hsl(204, 65%, 18%)",
					950: "hsl(204, 60%, 12%)",
				}),
			},
			density: "comfortable",
		},
	},
	{
		id: "vivid",
		name: "Vivid",
		description: "High-energy magenta accent on a rounded, pointer-driven shell.",
		tags: ["rounded", "magenta", "pointer"],
		system: {
			...baseSystem(),
			tokens: {
				"--radius-factor": "1.25",
				"--cursor-interactive": "pointer",
				...accent({
					50: "hsl(322, 100%, 95%)",
					100: "hsl(322, 100%, 88%)",
					200: "hsl(322, 95%, 80%)",
					300: "hsl(322, 90%, 70%)",
					400: "hsl(322, 85%, 60%)",
					500: "hsl(322, 80%, 50%)",
					600: "hsl(322, 78%, 42%)",
					700: "hsl(322, 76%, 34%)",
					800: "hsl(322, 74%, 26%)",
					900: "hsl(322, 70%, 18%)",
					950: "hsl(322, 65%, 12%)",
				}),
			},
			density: "default",
		},
	},
	{
		id: "brutalist",
		name: "Brutalist",
		description: "Zero radius, raw neutrals, compact spacing. Edges intact.",
		tags: ["sharp", "compact", "neutral"],
		system: {
			...baseSystem(),
			tokens: {
				"--radius-factor": "0",
				"--cursor-interactive": "default",
			},
			density: "compact",
		},
	},
	{
		id: "verdant",
		name: "Verdant",
		description: "Forest green accent paired with balanced spacing and rounded edges.",
		tags: ["green", "rounded", "default"],
		system: {
			...baseSystem(),
			tokens: {
				"--radius-factor": "1.15",
				...accent({
					50: "hsl(150, 60%, 94%)",
					100: "hsl(150, 60%, 86%)",
					200: "hsl(150, 55%, 75%)",
					300: "hsl(150, 50%, 62%)",
					400: "hsl(150, 50%, 50%)",
					500: "hsl(150, 60%, 38%)",
					600: "hsl(150, 65%, 30%)",
					700: "hsl(150, 65%, 24%)",
					800: "hsl(150, 65%, 18%)",
					900: "hsl(150, 60%, 12%)",
					950: "hsl(150, 60%, 8%)",
				}),
			},
			density: "default",
		},
	},
	{
		id: "playful",
		name: "Playful",
		description: "Pillowy radius, generous spacing, warm orange accent.",
		tags: ["rounded", "comfortable", "orange"],
		system: {
			...baseSystem(),
			tokens: {
				"--radius-factor": "2",
				"--cursor-interactive": "pointer",
				...accent({
					50: "hsl(28, 100%, 94%)",
					100: "hsl(28, 100%, 86%)",
					200: "hsl(28, 95%, 76%)",
					300: "hsl(28, 95%, 66%)",
					400: "hsl(28, 95%, 58%)",
					500: "hsl(28, 90%, 50%)",
					600: "hsl(28, 90%, 42%)",
					700: "hsl(28, 90%, 34%)",
					800: "hsl(28, 85%, 26%)",
					900: "hsl(28, 80%, 18%)",
					950: "hsl(28, 75%, 12%)",
				}),
			},
			density: "comfortable",
		},
	},
	{
		id: "corporate",
		name: "Corporate",
		description: "Conservative deep-blue accent, default radii, dependable density.",
		tags: ["blue", "default", "compact"],
		system: {
			...baseSystem(),
			tokens: {
				"--radius-factor": "0.5",
				...accent({
					50: "hsl(220, 50%, 95%)",
					100: "hsl(220, 50%, 88%)",
					200: "hsl(220, 50%, 78%)",
					300: "hsl(220, 50%, 64%)",
					400: "hsl(220, 55%, 50%)",
					500: "hsl(220, 65%, 40%)",
					600: "hsl(220, 70%, 32%)",
					700: "hsl(220, 70%, 26%)",
					800: "hsl(220, 70%, 20%)",
					900: "hsl(220, 65%, 14%)",
					950: "hsl(220, 60%, 9%)",
				}),
			},
			density: "default",
		},
	},
];

/** Subset of token keys we surface as swatches in the preset card preview. */
export const PREVIEW_SHADES = [200, 400, 500, 700, 900] as const;
