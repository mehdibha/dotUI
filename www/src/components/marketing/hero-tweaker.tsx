"use client";

/**
 * "Hero tweaker": a floating panel to live-test hero variations — typography
 * preset, word-animation effect, one-line description, and both CTA labels.
 * Intentionally rendered on every environment for now so the hero can be tuned
 * on preview deploys, not just locally. Picks persist to localStorage. Once a
 * winning combination is locked in, bake it into the hero and delete this module.
 */

import { type CSSProperties, type ReactNode, useEffect, useState } from "react";

import { XIcon } from "lucide-react";

import { Select, SelectContent, SelectItem, SelectTrigger } from "@/registry/ui/select";

import type { RotatingEffect } from "./rotating-text";

/* ----------------------------- Typography ----------------------------- */

export interface TypographyPreset {
	id: string;
	label: string;
	/** Applied to the whole headline. */
	headline: CSSProperties;
	/** Applied to the swapped accent word (overrides the headline font). */
	accent: CSSProperties;
}

// 8 presets surveyed for elegant / modern hero headlines, plus the site default
// (Geist). All non-default fonts load from Google Fonts via `HERO_FONTS_HREF`.
export const TYPOGRAPHY_PRESETS: TypographyPreset[] = [
	{
		id: "default",
		label: "Geist (default)",
		headline: { fontWeight: 500, letterSpacing: "-0.05em" },
		accent: { fontWeight: 500, fontStyle: "normal", letterSpacing: "-0.05em" },
	},
	{
		id: "instrument-contrast",
		label: "Jakarta × Instrument Serif",
		headline: { fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontWeight: 700, letterSpacing: "-0.03em" },
		accent: {
			fontFamily: "'Instrument Serif', Georgia, serif",
			fontWeight: 400,
			fontStyle: "italic",
			letterSpacing: "0em",
		},
	},
	{
		id: "editorial-fraunces",
		label: "Fraunces (editorial)",
		headline: { fontFamily: "'Fraunces', Georgia, serif", fontWeight: 700, letterSpacing: "-0.025em" },
		accent: {
			fontFamily: "'Fraunces', Georgia, serif",
			fontWeight: 400,
			fontStyle: "italic",
			letterSpacing: "-0.01em",
		},
	},
	{
		id: "newsreader-glow",
		label: "Newsreader (warm serif)",
		headline: { fontFamily: "'Newsreader', Georgia, serif", fontWeight: 600, letterSpacing: "-0.02em" },
		accent: {
			fontFamily: "'Newsreader', Georgia, serif",
			fontWeight: 400,
			fontStyle: "italic",
			letterSpacing: "0.005em",
		},
	},
	{
		id: "dm-serif-drama",
		label: "DM Serif Display (drama)",
		headline: { fontFamily: "'DM Serif Display', Georgia, serif", fontWeight: 400, letterSpacing: "-0.015em" },
		accent: {
			fontFamily: "'DM Serif Display', Georgia, serif",
			fontWeight: 400,
			fontStyle: "italic",
			letterSpacing: "0em",
		},
	},
	{
		id: "jakarta-playfair-bridge",
		label: "Jakarta × Playfair",
		headline: { fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontWeight: 800, letterSpacing: "-0.035em" },
		accent: {
			fontFamily: "'Playfair Display', Georgia, serif",
			fontWeight: 700,
			fontStyle: "italic",
			letterSpacing: "-0.01em",
		},
	},
	{
		id: "space-grotesk-sharp",
		label: "Space Grotesk (sharp)",
		headline: { fontFamily: "'Space Grotesk', system-ui, sans-serif", fontWeight: 700, letterSpacing: "-0.04em" },
		accent: {
			fontFamily: "'Space Grotesk', system-ui, sans-serif",
			fontWeight: 300,
			fontStyle: "normal",
			letterSpacing: "0.04em",
		},
	},
	{
		id: "bricolage-expressive",
		label: "Bricolage Grotesque",
		headline: {
			fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
			fontWeight: 800,
			letterSpacing: "-0.045em",
		},
		accent: {
			fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
			fontWeight: 200,
			fontStyle: "normal",
			letterSpacing: "0.02em",
		},
	},
	{
		id: "inter-tight-precision",
		label: "Inter Tight (precision)",
		headline: { fontFamily: "'Inter Tight', system-ui, sans-serif", fontWeight: 700, letterSpacing: "-0.05em" },
		accent: {
			fontFamily: "'Inter Tight', system-ui, sans-serif",
			fontWeight: 300,
			fontStyle: "italic",
			letterSpacing: "-0.01em",
		},
	},
];

export function getPreset(id: string): TypographyPreset {
	return TYPOGRAPHY_PRESETS.find((p) => p.id === id) ?? TYPOGRAPHY_PRESETS[0]!;
}

// Loads every non-default headline font in one request.
const HERO_FONTS_HREF =
	"https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,400&family=Plus+Jakarta+Sans:wght@700;800&family=Instrument+Serif:ital@1&family=Newsreader:ital,wght@0,600;1,400&family=Space+Grotesk:wght@300;700&family=Bricolage+Grotesque:opsz,wght@12..96,200;12..96,800&family=Inter+Tight:ital,wght@0,700;1,300&family=DM+Serif+Display:ital@0;1&family=Playfair+Display:ital,wght@1,700&display=swap";

let fontsInjected = false;
function ensureHeroFonts() {
	if (typeof document === "undefined" || fontsInjected) return;
	fontsInjected = true;
	const add = (attrs: Record<string, string>) => {
		const link = document.createElement("link");
		Object.entries(attrs).forEach(([k, v]) => link.setAttribute(k, v));
		document.head.appendChild(link);
	};
	add({ rel: "preconnect", href: "https://fonts.googleapis.com" });
	add({ rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" });
	add({ rel: "stylesheet", href: HERO_FONTS_HREF });
}

/* ------------------------------ Animations ----------------------------- */

export const ROTATING_EFFECTS: { id: RotatingEffect; label: string }[] = [
	{ id: "roll", label: "Roll up (center-out)" },
	{ id: "blur", label: "Blur focus-pull" },
	{ id: "flip", label: "Flip away (FlipWords)" },
	{ id: "fade", label: "Soft fade" },
];

/* -------------------------------- Copy --------------------------------- */

export const HERO_DESCRIPTIONS: string[] = [
	"Your palette, your scale, your brand — not a preset clone.",
	"Live editor, real components, zero design-token guesswork.",
	"Type, color, radius, density — all yours, all accessible.",
	"Tweak live. Every token yours. Accessible from the start.",
	"Design tokens that look like you, built in seconds.",
	"From zero to a branded component library in one session.",
	"A design system that speaks your brand, out of the box.",
	"Built in a browser, shipped to any stack you choose.",
	"Skip the presets. Configure a system that's purely yours.",
	"Accessible by default, unmistakably yours.",
];

export const PRIMARY_CTAS: string[] = [
	"Start creating",
	"Open the editor",
	"Launch the editor",
	"Create your system",
	"Try the editor",
	"Build for free",
	"Start for free",
	"Open the studio",
	"Design now",
	"Make it yours",
];

export const SECONDARY_CTAS: string[] = [
	"Browse components",
	"Explore the library",
	"Explore components",
	"View components",
	"See what's included",
	"View the library",
	"Component gallery",
	"Browse the library",
];

/* ------------------------------- State --------------------------------- */

export interface HeroTweaks {
	typography: string;
	effect: RotatingEffect;
	description: number;
	primaryCta: number;
	secondaryCta: number;
}

const DEFAULT_TWEAKS: HeroTweaks = {
	typography: "default",
	effect: "roll",
	description: 0,
	primaryCta: 0,
	secondaryCta: 0,
};

const STORAGE_KEY = "dotui-hero-tweaks";

export function useHeroTweaks() {
	const [tweaks, setTweaks] = useState<HeroTweaks>(DEFAULT_TWEAKS);

	// Restore saved picks + load the candidate fonts, once on mount (client only).
	useEffect(() => {
		ensureHeroFonts();
		try {
			const raw = window.localStorage.getItem(STORAGE_KEY);
			if (raw) setTweaks((t) => ({ ...t, ...JSON.parse(raw) }));
		} catch {
			/* ignore */
		}
	}, []);

	useEffect(() => {
		try {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tweaks));
		} catch {
			/* ignore */
		}
	}, [tweaks]);

	const update = (patch: Partial<HeroTweaks>) => setTweaks((t) => ({ ...t, ...patch }));
	return { tweaks, update };
}

/* ------------------------------- Panel --------------------------------- */

function Field({
	label,
	value,
	onChange,
	options,
}: {
	label: string;
	value: string;
	onChange: (v: string) => void;
	options: { id: string; label: ReactNode }[];
}) {
	return (
		<div className="flex flex-col gap-1">
			<span className="font-mono text-[10px] tracking-wide text-fg-muted uppercase">{label}</span>
			<Select aria-label={label} value={value} onChange={(k) => onChange(String(k))} className="w-full">
				<SelectTrigger className="h-8 text-xs" />
				<SelectContent className="max-w-72">
					{options.map((o) => (
						<SelectItem key={o.id} id={o.id} textValue={typeof o.label === "string" ? o.label : o.id}>
							{o.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}

export function HeroTweaker({ tweaks, update }: { tweaks: HeroTweaks; update: (patch: Partial<HeroTweaks>) => void }) {
	const [open, setOpen] = useState(true);

	if (!open) {
		return (
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="fixed right-4 bottom-4 z-50 rounded-full border bg-bg/90 px-3 py-1.5 font-mono text-xs text-fg-muted shadow-lg backdrop-blur transition-colors hover:text-fg"
			>
				Tweak hero
			</button>
		);
	}

	return (
		<div className="fixed right-4 bottom-4 z-50 w-72 max-w-[calc(100vw-2rem)] rounded-xl border bg-bg/95 p-3 shadow-xl backdrop-blur">
			<div className="mb-3 flex items-center justify-between">
				<span className="font-mono text-xs font-medium text-fg">Hero tweaker</span>
				<button
					type="button"
					aria-label="Close tweaker"
					onClick={() => setOpen(false)}
					className="rounded-md p-1 text-fg-muted transition-colors hover:bg-neutral-hover hover:text-fg"
				>
					<XIcon className="size-3.5" />
				</button>
			</div>
			<div className="flex flex-col gap-2.5">
				<Field
					label="Typography"
					value={tweaks.typography}
					onChange={(v) => update({ typography: v })}
					options={TYPOGRAPHY_PRESETS.map((p) => ({ id: p.id, label: p.label }))}
				/>
				<Field
					label="Word animation"
					value={tweaks.effect}
					onChange={(v) => update({ effect: v as RotatingEffect })}
					options={ROTATING_EFFECTS}
				/>
				<Field
					label="Description"
					value={String(tweaks.description)}
					onChange={(v) => update({ description: Number(v) })}
					options={HERO_DESCRIPTIONS.map((d, i) => ({ id: String(i), label: d }))}
				/>
				<Field
					label="Primary CTA"
					value={String(tweaks.primaryCta)}
					onChange={(v) => update({ primaryCta: Number(v) })}
					options={PRIMARY_CTAS.map((d, i) => ({ id: String(i), label: d }))}
				/>
				<Field
					label="Secondary CTA"
					value={String(tweaks.secondaryCta)}
					onChange={(v) => update({ secondaryCta: Number(v) })}
					options={SECONDARY_CTAS.map((d, i) => ({ id: String(i), label: d }))}
				/>
			</div>
		</div>
	);
}
