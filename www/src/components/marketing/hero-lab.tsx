"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

import { AnimatePresence, motion } from "motion/react";

import { AdobeIcon } from "@/components/icons/adobe";
import { ShadcnIcon } from "@/components/icons/shadcn";
import { Announcement } from "@/components/marketing/announcement";
import { cn } from "@/registry/lib/utils";
import { LinkButton } from "@/registry/ui/button";

/* ============================================================================
 * HERO LAB — TEMPORARY scaffolding.
 * Flip through hero variants live, pick the winner, then we inline it into
 * routes/_app/index.tsx and delete this file + the switcher.
 *
 *   ← / →   switch variant      1–6   jump to variant      R   replay animation
 *
 * Every variant renders only the centered column; HeroLab wraps it in the
 * standard <section className="container ..."> shell.
 * ==========================================================================*/

// ---------------------------------------------------------------------------
// Variant 1 — Months → Minutes
// ---------------------------------------------------------------------------
const MonthsToMinutesRise = {
	hidden: { opacity: 0, y: 14 },
	show: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: { delay: 0.3 + i * 0.09, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
	}),
};

function MonthsToMinutesPivot() {
	const [swapped, setSwapped] = useState(false);

	useEffect(() => {
		const id = window.setTimeout(() => setSwapped(true), 1250);
		return () => window.clearTimeout(id);
	}, []);

	// Grid sizer overlays both clauses in one cell so the row reserves the taller
	// clause's height up-front — no overlap with the subhead when the swap fires.
	return (
		<span className="grid justify-items-center">
			<span className="invisible col-start-1 row-start-1" aria-hidden="true">
				used to take <span className="font-bold italic">months</span>.
			</span>
			<AnimatePresence mode="popLayout" initial={false}>
				{!swapped ? (
					<motion.span
						key="months"
						initial={{ y: 0, opacity: 1 }}
						exit={{ y: "-115%", opacity: 0 }}
						transition={{ duration: 0.5, ease: [0.7, 0, 0.84, 0] as const }}
						className="col-start-1 row-start-1 text-fg-muted"
					>
						used to take{" "}
						<span className="relative whitespace-nowrap text-fg">
							months
							<motion.span
								aria-hidden="true"
								initial={{ scaleX: 0 }}
								animate={{ scaleX: 1 }}
								transition={{ delay: 0.6, duration: 0.45, ease: "easeInOut" }}
								style={{ originX: 0 }}
								className="pointer-events-none absolute top-1/2 left-[-0.04em] h-[0.1em] w-[1.08em] -translate-y-1/2 rounded-full bg-accent"
							/>
						</span>
						.
					</motion.span>
				) : (
					<motion.span
						key="minutes"
						initial={{ y: "115%", opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] as const }}
						className="col-start-1 row-start-1 text-fg"
					>
						now take <span className="font-bold whitespace-nowrap italic">minutes</span>.
					</motion.span>
				)}
			</AnimatePresence>
		</span>
	);
}

export function Hero_MonthsToMinutes() {
	return (
		<div className="flex flex-col items-center gap-2 text-center md:gap-3">
			<Announcement />
			<motion.h1
				custom={0}
				variants={MonthsToMinutesRise}
				initial="hidden"
				animate="show"
				className="text-4xl tracking-tighter text-balance max-lg:font-medium md:text-5xl lg:text-6xl"
			>
				<span className="block">Design systems</span>
				<MonthsToMinutesPivot />
			</motion.h1>
			<motion.p
				custom={1}
				variants={MonthsToMinutesRise}
				initial="hidden"
				animate="show"
				className="max-w-2xl text-base text-balance text-fg-muted sm:text-lg"
			>
				Craft colors, tokens, and components in the <span className="font-medium text-fg">dotUI/create</span> visual
				editor — then ship the whole thing to a real React codebase with the{" "}
				<ShadcnIcon className="inline-flex size-5 align-text-bottom" />{" "}
				<span className="font-medium text-fg">shadcn&nbsp;CLI</span>, or open it in v0, Bolt, and Codex.
			</motion.p>
			<motion.div
				custom={2}
				variants={MonthsToMinutesRise}
				initial="hidden"
				animate="show"
				className="flex w-full flex-col gap-2 pt-2 sm:w-auto sm:flex-row sm:items-center sm:gap-4"
			>
				<LinkButton href="/create" variant="primary" size="lg">
					Open the editor
				</LinkButton>
				<LinkButton href="/components" variant="default" size="lg">
					Explore components
				</LinkButton>
			</motion.div>
			<motion.p
				custom={3}
				variants={MonthsToMinutesRise}
				initial="hidden"
				animate="show"
				className="flex items-center gap-1.5 pt-1 font-mono text-xs text-fg-muted"
			>
				<AdobeIcon className="inline-flex size-3.5" />
				Accessible by default, powered by react-aria-components.
			</motion.p>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Variant 2 — Build Anything (rotating noun)
// ---------------------------------------------------------------------------
const AnySystemNouns = ["design system", "color palette", "component library", "theme"] as const;

const AnySystemShipTargets = ["v0", "Bolt", "Codex"] as const;

const AnySystemFadeUp = {
	hidden: { opacity: 0, y: 14 },
	show: (i: number) => ({
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] as const },
	}),
};

function AnySystemRotatingWord() {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const id = window.setInterval(() => {
			setIndex((prev) => (prev + 1) % AnySystemNouns.length);
		}, 2200);
		return () => window.clearInterval(id);
	}, []);

	const current = AnySystemNouns[index];

	return (
		<span className="relative inline-grid justify-items-center overflow-hidden text-center align-bottom">
			{/* Hidden sizer holds the widest word's width so the line never reflows on swap (SSR-safe). */}
			<span aria-hidden className="invisible col-start-1 row-start-1 font-bold whitespace-nowrap italic">
				component library
			</span>
			<AnimatePresence initial={false} mode="sync">
				<motion.span
					key={current}
					initial={{ y: "0.85em", opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: "-0.85em", opacity: 0 }}
					transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
					className="col-start-1 row-start-1 font-bold whitespace-nowrap italic"
				>
					{current}
				</motion.span>
			</AnimatePresence>
		</span>
	);
}

export function Hero_AnySystem() {
	const headingId = useId();

	return (
		<div className="flex flex-col items-center gap-4 text-center md:gap-5">
			<motion.div custom={0} initial="hidden" animate="show" variants={AnySystemFadeUp}>
				<Announcement />
			</motion.div>

			<motion.h1
				id={headingId}
				custom={1}
				initial="hidden"
				animate="show"
				variants={AnySystemFadeUp}
				className="max-w-4xl text-4xl leading-[1.05] tracking-tighter text-balance max-lg:font-medium md:text-5xl lg:text-6xl"
			>
				Build{" "}
				<span className="relative inline-block">
					<span className="font-josefin font-semibold">any</span>
					<span aria-hidden className="absolute -bottom-0.5 left-0 h-[0.1em] w-full rounded-full bg-accent" />
				</span>
				<br />
				<AnySystemRotatingWord />
				<br />
				<span className="text-fg-muted">in minutes.</span>
			</motion.h1>

			<motion.p
				custom={2}
				initial="hidden"
				animate="show"
				variants={AnySystemFadeUp}
				className="max-w-2xl text-base text-balance text-fg-muted sm:text-lg"
			>
				Craft colors, tokens, and components in a visual editor — instead of spending months wiring them by hand — then
				ship the whole thing straight to a real React codebase.
			</motion.p>

			<motion.div
				custom={3}
				initial="hidden"
				animate="show"
				variants={AnySystemFadeUp}
				className="flex w-full flex-col gap-2 pt-1 sm:w-auto sm:flex-row sm:items-center sm:gap-4"
			>
				<LinkButton href="/create" variant="primary" size="lg">
					Open the editor
				</LinkButton>
				<LinkButton href="/components" variant="default" size="lg">
					Explore components
				</LinkButton>
			</motion.div>

			<motion.div
				custom={4}
				initial="hidden"
				animate="show"
				variants={AnySystemFadeUp}
				className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 pt-2 font-mono text-xs text-fg-muted sm:text-sm"
			>
				<span>Ships with the</span>
				<span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-fg">
					<ShadcnIcon className="size-3.5" />
					shadcn CLI
				</span>
				<span>or open in</span>
				{AnySystemShipTargets.map((target) => (
					<span key={target} className="rounded-full bg-muted px-2.5 py-1 text-fg">
						{target}
					</span>
				))}
			</motion.div>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Variant 3 — Brand, Revealed (gradient sweep)
// ---------------------------------------------------------------------------
const BrandRevealEase = [0.16, 1, 0.3, 1] as const;

const BrandRevealContainer = {
	hidden: {},
	show: {
		transition: { staggerChildren: 0.12, delayChildren: 0.08 },
	},
};

const BrandRevealLine = {
	hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
	show: {
		opacity: 1,
		y: 0,
		filter: "blur(0px)",
		transition: { duration: 0.7, ease: BrandRevealEase },
	},
};

function BrandRevealAccentWord({ children }: { children: React.ReactNode }) {
	const [swept, setSwept] = useState(false);

	useEffect(() => {
		const id = window.setTimeout(() => setSwept(true), 650);
		return () => window.clearTimeout(id);
	}, []);

	return (
		<span className="relative inline-block font-bold whitespace-nowrap italic">
			<span className="bg-[linear-gradient(100deg,var(--color-fg)_0%,var(--color-accent)_45%,var(--color-fg)_100%)] bg-clip-text text-transparent">
				{children}
			</span>
			<motion.span
				aria-hidden="true"
				initial={{ backgroundPosition: "-150% 0%" }}
				animate={swept ? { backgroundPosition: "250% 0%" } : { backgroundPosition: "-150% 0%" }}
				transition={{ duration: 1.1, ease: BrandRevealEase }}
				className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,transparent_0%,color-mix(in_oklch,var(--color-accent)_85%,white)_50%,transparent_100%)] bg-[length:60%_100%] bg-clip-text bg-no-repeat text-transparent"
			>
				{children}
			</motion.span>
		</span>
	);
}

function BrandRevealShipChip({ children }: { children: React.ReactNode }) {
	return (
		<span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2.5 py-1 text-sm font-medium text-fg">
			{children}
		</span>
	);
}

export function Hero_BrandReveal() {
	const titleId = useId();

	return (
		<motion.div
			variants={BrandRevealContainer}
			initial="hidden"
			animate="show"
			className="flex flex-col items-center gap-2 text-center md:gap-3"
		>
			<motion.div variants={BrandRevealLine}>
				<Announcement />
			</motion.div>

			<h1
				aria-labelledby={titleId}
				className="text-3xl tracking-tighter text-balance max-lg:font-medium md:text-4xl lg:text-5xl"
			>
				<span id={titleId} className="sr-only">
					Craft a design system that looks like your brand in minutes, then ship it to real React.
				</span>
				<motion.span aria-hidden="true" variants={BrandRevealLine} className="block">
					Craft a design system that
				</motion.span>
				<motion.span aria-hidden="true" variants={BrandRevealLine} className="block">
					looks like your brand in <BrandRevealAccentWord>minutes</BrandRevealAccentWord>.
				</motion.span>
				<motion.span
					aria-hidden="true"
					variants={BrandRevealLine}
					className="mt-1 block font-mono text-xl font-normal tracking-tight text-fg-muted md:text-2xl lg:text-3xl"
				>
					Then ship it to real React.
				</motion.span>
			</h1>

			<motion.p variants={BrandRevealLine} className="max-w-2xl text-base text-balance text-fg-muted sm:text-lg">
				Design colors, tokens, and components in a visual editor, not a spec doc that takes months. Install with the{" "}
				<ShadcnIcon className="inline-flex size-4 align-[-2px]" />{" "}
				<span className="font-medium text-fg">shadcn&nbsp;CLI</span>, or open it straight in v0, Bolt, and Codex.
			</motion.p>

			<motion.div variants={BrandRevealLine} className="flex flex-wrap items-center justify-center gap-2 pt-1">
				<BrandRevealShipChip>
					<AdobeIcon className="size-3.5" /> Accessible by default
				</BrandRevealShipChip>
				<BrandRevealShipChip>
					<span className="size-1.5 rounded-full bg-accent" /> Your brand, end to end
				</BrandRevealShipChip>
				<BrandRevealShipChip>
					<ShadcnIcon className="size-3.5" /> Yours to own
				</BrandRevealShipChip>
			</motion.div>

			<motion.div
				variants={BrandRevealLine}
				className="flex w-full flex-col gap-2 pt-2 sm:w-auto sm:flex-row sm:items-center sm:gap-4"
			>
				<LinkButton href="/create" variant="primary" size="lg">
					Open the editor
				</LinkButton>
				<LinkButton href="/components" variant="default" size="lg">
					Explore components
				</LinkButton>
			</motion.div>
		</motion.div>
	);
}

// ---------------------------------------------------------------------------
// Variant 4 — Ship to Code (editor → destinations flow)
// ---------------------------------------------------------------------------
const ShipToCodeMotionLink = motion.create(LinkButton);

const ShipToCodeDestinations = [
	{
		id: "shadcn",
		label: "shadcn CLI",
		sub: "npx shadcn add",
		glyph: <ShadcnIcon className="size-4" />,
	},
	{
		id: "v0",
		label: "v0",
		sub: "open in v0",
		glyph: <span className="text-[13px] leading-none font-bold tracking-tight">v0</span>,
	},
	{
		id: "bolt",
		label: "Bolt",
		sub: "open in Bolt",
		glyph: (
			<svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
				<path d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13z" fill="currentColor" />
			</svg>
		),
	},
	{
		id: "codex",
		label: "Codex",
		sub: "open in Codex",
		glyph: (
			<svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 stroke-current" fill="none">
				<path d="M9 8.5 5 12l4 3.5M15 8.5l4 3.5-4 3.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		),
	},
];

function ShipToCodeChip({
	destination,
	index,
}: {
	destination: (typeof ShipToCodeDestinations)[number];
	index: number;
}) {
	return (
		<motion.li
			initial={{ opacity: 0, y: 14, scale: 0.94 }}
			whileInView={{ opacity: 1, y: 0, scale: 1 }}
			viewport={{ once: true, margin: "-40px" }}
			transition={{
				delay: 0.5 + index * 0.12,
				duration: 0.5,
				ease: [0.22, 1, 0.36, 1],
			}}
			className="group relative flex items-center gap-2.5 rounded-full border border-border bg-bg/80 py-2 pr-4 pl-2.5 shadow-sm backdrop-blur-sm"
		>
			<span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-fg">
				{destination.glyph}
			</span>
			<span className="flex flex-col items-start leading-none">
				<span className="text-sm font-medium text-fg">{destination.label}</span>
				<span className="mt-0.5 font-mono text-[11px] text-fg-muted">{destination.sub}</span>
			</span>
		</motion.li>
	);
}

function ShipToCodeFlow() {
	return (
		<div className="mt-6 flex w-full max-w-3xl flex-col items-center gap-4 sm:mt-8 sm:flex-row sm:items-stretch sm:gap-0">
			{/* Editor node */}
			<motion.div
				initial={{ opacity: 0, x: -16 }}
				whileInView={{ opacity: 1, x: 0 }}
				viewport={{ once: true, margin: "-40px" }}
				transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
				className="relative flex shrink-0 items-center gap-3 rounded-2xl border border-border bg-bg/80 px-4 py-3 shadow-sm backdrop-blur-sm"
			>
				<span className="flex size-9 items-center justify-center rounded-xl bg-primary text-fg-on-primary">
					<AdobeIcon className="size-5" />
				</span>
				<span className="flex flex-col items-start leading-none">
					<span className="text-sm font-semibold text-fg">dotUI/create</span>
					<span className="mt-1 font-mono text-[11px] text-fg-muted">visual editor</span>
				</span>
				<span className="ml-1 flex items-center gap-1" aria-hidden="true">
					<span className="size-2.5 rounded-full bg-accent" />
					<span className="size-2.5 rounded-full bg-muted" />
					<span className="size-2.5 rounded-full bg-neutral" />
				</span>
			</motion.div>

			{/* Connector */}
			<div className="relative flex h-8 w-px items-center justify-center sm:h-auto sm:w-20 sm:flex-1">
				<svg
					aria-hidden="true"
					viewBox="0 0 100 20"
					preserveAspectRatio="none"
					className="h-full w-full text-fg-muted max-sm:rotate-90"
				>
					<motion.line
						x1="2"
						y1="10"
						x2="98"
						y2="10"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeDasharray="4 4"
						strokeLinecap="round"
						initial={{ pathLength: 0, opacity: 0 }}
						whileInView={{ pathLength: 1, opacity: 0.6 }}
						viewport={{ once: true, margin: "-40px" }}
						transition={{ delay: 0.35, duration: 0.55, ease: "easeInOut" }}
					/>
				</svg>
				<motion.span
					initial={{ opacity: 0, scale: 0 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true, margin: "-40px" }}
					transition={{ delay: 0.5, duration: 0.3 }}
					className="absolute flex size-6 items-center justify-center rounded-full border border-border bg-bg text-fg shadow-sm"
				>
					<svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5 stroke-current" fill="none">
						<path d="M5 12h14M13 6l6 6-6 6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</motion.span>
			</div>

			{/* Destination chips */}
			<ul className="grid shrink-0 grid-cols-2 gap-2 sm:gap-2.5">
				{ShipToCodeDestinations.map((destination, index) => (
					<ShipToCodeChip key={destination.id} destination={destination} index={index} />
				))}
			</ul>
		</div>
	);
}

export function Hero_ShipToCode() {
	return (
		<div className="flex flex-col items-center gap-2 text-center md:gap-3">
			<Announcement />
			<h1 className="text-3xl tracking-tighter text-balance max-lg:font-medium md:text-4xl lg:text-5xl">
				Design a whole system in minutes,
				<br className="hidden sm:block" /> then <span className="font-bold italic">ship it</span> to your codebase.
			</h1>
			<p className="max-w-2xl text-base text-balance text-fg-muted sm:text-lg">
				Craft your colors, tokens, and components in a visual editor — what used to take months. Then install it with
				the <span className="font-medium text-fg">shadcn CLI</span> or open it straight in v0, Bolt, and Codex.
			</p>

			<ShipToCodeFlow />

			<div className="flex w-full flex-col gap-2 pt-2 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
				<ShipToCodeMotionLink
					href="/create"
					variant="primary"
					size="lg"
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3, duration: 0.4 }}
				>
					Open the editor
				</ShipToCodeMotionLink>
				<ShipToCodeMotionLink
					href="/components"
					variant="default"
					size="lg"
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4, duration: 0.4 }}
				>
					Explore components
				</ShipToCodeMotionLink>
			</div>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Variant 5 — Bold & Minimal (Josefin display, word-by-word blur-up)
// ---------------------------------------------------------------------------
const BoldMinimalWords = [
	{ text: "Design", accent: false },
	{ text: "systems,", accent: false },
	{ text: "solved.", accent: true },
];

function BoldMinimalWord({ text, accent, index }: { text: string; accent: boolean; index: number }) {
	return (
		<motion.span
			// inline-block is needed for the y/blur transform, but it swallows whitespace
			// between words — so space them with a trailing margin instead of a text space.
			className={cn("inline-block", index < BoldMinimalWords.length - 1 && "mr-[0.25em]", accent && "text-fg italic")}
			initial={{ opacity: 0, y: "0.35em", filter: "blur(12px)" }}
			animate={{ opacity: 1, y: "0em", filter: "blur(0px)" }}
			transition={{ duration: 0.7, delay: 0.15 + index * 0.13, ease: [0.16, 1, 0.3, 1] }}
		>
			{text}
		</motion.span>
	);
}

const BoldMinimalChips: { label: string; node: React.ReactNode }[] = [
	{ label: "shadcn CLI", node: <ShadcnIcon className="size-4" /> },
	{ label: "v0", node: null },
	{ label: "Bolt", node: null },
	{ label: "Codex", node: null },
];

export function Hero_BoldMinimal() {
	return (
		<div className="flex flex-col items-center gap-5 text-center md:gap-6">
			<motion.div
				initial={{ opacity: 0, y: 8 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: "easeOut" }}
			>
				<Announcement />
			</motion.div>

			<h1
				className="font-josefin text-5xl leading-[0.95] font-bold tracking-tighter text-balance text-fg sm:text-6xl md:text-7xl lg:text-8xl"
				aria-label="Design systems, solved."
			>
				<span aria-hidden="true" className="inline">
					{BoldMinimalWords.map((w, i) => (
						<BoldMinimalWord key={w.text} text={w.text} accent={w.accent} index={i} />
					))}
				</span>
			</h1>

			<motion.p
				className="max-w-2xl text-base text-balance text-fg-muted sm:text-lg"
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.65, ease: "easeOut" }}
			>
				Craft a whole design system &mdash; colors, tokens, components &mdash; in a visual editor in{" "}
				<span className="font-medium text-fg">minutes, not months</span>. Then ship it to a real React codebase.
			</motion.p>

			<motion.div
				className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-xs text-fg-muted sm:text-sm"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.6, delay: 0.85, ease: "easeOut" }}
			>
				<span className="text-fg-muted/70">Install via</span>
				{BoldMinimalChips.map((chip, i) => (
					<span key={chip.label} className="flex items-center gap-1.5">
						<span className="flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 font-mono text-fg">
							{chip.node}
							{chip.label}
						</span>
						{i < BoldMinimalChips.length - 1 ? (
							<span aria-hidden="true" className="text-fg-muted/40">
								/
							</span>
						) : null}
					</span>
				))}
			</motion.div>

			<motion.div
				className="flex w-full flex-col gap-2 pt-2 sm:w-auto sm:flex-row sm:items-center sm:gap-4"
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.95, ease: "easeOut" }}
			>
				<LinkButton href="/create" variant="primary" size="lg">
					Open the editor
				</LinkButton>
				<LinkButton href="/components" variant="default" size="lg">
					Explore components
				</LinkButton>
			</motion.div>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Variant 6 — Design it, Ship it (two-beat wipe + live editor mock)
// ---------------------------------------------------------------------------
const EditorFirstWipe = ({
	children,
	delay,
	className,
}: {
	children: React.ReactNode;
	delay: number;
	className?: string;
}) => (
	<span className={cn("relative inline-block overflow-hidden pb-[0.08em] align-bottom", className)}>
		<motion.span
			className="inline-block"
			initial={{ clipPath: "inset(0 100% 0 0)", y: "0.14em" }}
			animate={{ clipPath: "inset(0 0% 0 0)", y: 0 }}
			transition={{ delay, duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
		>
			{children}
		</motion.span>
	</span>
);

const EditorFirstDestinations = ["shadcn CLI", "v0", "Bolt", "Codex"];

const EditorFirstSwatches = ["bg-primary", "bg-accent", "bg-neutral", "bg-muted"];

const EditorFirstEditorMock = () => {
	const [active, setActive] = useState(0);

	useEffect(() => {
		const id = window.setInterval(() => {
			setActive((i) => (i + 1) % EditorFirstSwatches.length);
		}, 1600);
		return () => window.clearInterval(id);
	}, []);

	return (
		<div className="relative w-full overflow-hidden rounded-xl border border-border bg-bg text-left shadow-sm">
			<div className="flex items-center gap-2 border-b border-border bg-muted/40 px-3 py-2">
				<span className="size-2.5 rounded-full bg-neutral" />
				<span className="size-2.5 rounded-full bg-neutral" />
				<span className="size-2.5 rounded-full bg-neutral" />
				<span className="ml-2 font-mono text-xs text-fg-muted">dotUI/create</span>
			</div>
			<div className="grid grid-cols-[1fr_1.4fr]">
				<div className="flex flex-col gap-3 border-r border-border p-4">
					<span className="font-mono text-[10px] tracking-wider text-fg-muted uppercase">Tokens</span>
					<div className="flex gap-1.5">
						{EditorFirstSwatches.map((s, i) => (
							<motion.span
								key={s}
								className={cn("size-6 rounded-md", s)}
								animate={{ scale: active === i ? 1.14 : 1 }}
								style={{
									outlineStyle: "solid",
									outlineColor: "var(--color-fg)",
									outlineWidth: active === i ? 2 : 0,
									outlineOffset: 2,
								}}
								transition={{ duration: 0.3 }}
							/>
						))}
					</div>
					<div className="mt-1 flex flex-col gap-1.5">
						<div className="h-1.5 w-3/4 rounded-full bg-muted" />
						<div className="h-1.5 w-1/2 rounded-full bg-muted" />
						<div className="h-1.5 w-2/3 rounded-full bg-muted" />
					</div>
				</div>
				<div className="flex flex-col items-start justify-center gap-3 p-4">
					<motion.span
						key={active}
						className={cn(
							"rounded-md px-3 py-1.5 text-sm font-medium",
							active === 1 ? "bg-accent text-fg-on-primary" : "bg-primary text-fg-on-primary",
						)}
						animate={{ y: [0, -2, 0] }}
						transition={{ duration: 0.4 }}
					>
						Button
					</motion.span>
					<div className="flex w-full flex-col gap-1.5">
						<div className="h-2 w-full rounded-full bg-muted" />
						<div className="h-2 w-4/5 rounded-full bg-muted" />
					</div>
				</div>
			</div>
		</div>
	);
};

export function Hero_EditorFirst() {
	const headingId = useId();
	const [shipped, setShipped] = useState(false);
	const reduceRef = useRef(false);

	useEffect(() => {
		reduceRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const t = window.setTimeout(() => setShipped(true), reduceRef.current ? 0 : 1500);
		return () => window.clearTimeout(t);
	}, []);

	return (
		<div className="flex flex-col items-center gap-2 text-center md:gap-3" aria-labelledby={headingId}>
			<Announcement />
			<h1
				id={headingId}
				className="font-josefin text-4xl leading-[0.95] tracking-tighter text-balance md:text-6xl lg:text-7xl"
			>
				<EditorFirstWipe delay={0.05} className="text-fg">
					Design it visually.
				</EditorFirstWipe>
				<br />
				<EditorFirstWipe delay={0.62} className="text-fg-muted">
					Ship it as <span className="font-bold text-fg italic">code</span>.
				</EditorFirstWipe>
			</h1>

			<motion.p
				className="max-w-2xl text-base text-balance text-fg-muted sm:text-lg"
				initial={{ opacity: 0, y: 8 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 1.25, duration: 0.5 }}
			>
				Craft a whole design system — colors, tokens, components — in a visual editor in{" "}
				<span className="font-medium text-fg">minutes, not months</span>. Then ship it to real React code with the{" "}
				<ShadcnIcon className="inline-flex size-4 align-text-bottom" />{" "}
				<span className="font-medium text-fg">shadcn CLI</span>, or open it in v0, Bolt, and Codex.
			</motion.p>

			<motion.div
				className="flex w-full flex-col gap-2 pt-2 sm:w-auto sm:flex-row sm:items-center sm:gap-4"
				initial={{ opacity: 0, y: 8 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 1.45, duration: 0.5 }}
			>
				<LinkButton href="/create" variant="primary" size="lg">
					Open the editor
				</LinkButton>
				<LinkButton href="/components" variant="default" size="lg">
					Explore components
				</LinkButton>
			</motion.div>

			<motion.div
				className="mt-6 flex w-full max-w-xl flex-col items-center gap-3"
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.95, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
			>
				<EditorFirstEditorMock />
				<motion.div
					className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-mono text-[11px] text-fg-muted"
					initial={{ opacity: 0, y: 6 }}
					animate={shipped ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
					transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
				>
					<span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1">
						<span className="opacity-70">ships to</span>
						{EditorFirstDestinations.map((label, i) => (
							<span key={label} className="inline-flex items-center gap-2">
								{i > 0 && <span aria-hidden className="size-1 rounded-full bg-neutral" />}
								<span className="text-fg">{label}</span>
							</span>
						))}
					</span>
				</motion.div>
			</motion.div>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Switcher
// ---------------------------------------------------------------------------
type HeroVariant = {
	id: string;
	title: string;
	blurb: string;
	Component: () => React.ReactNode;
};

const HERO_VARIANTS: HeroVariant[] = [
	{
		id: "months-to-minutes",
		title: "Months → Minutes",
		blurb: "Strike-through 'months' swaps to 'minutes'",
		Component: Hero_MonthsToMinutes,
	},
	{
		id: "any-system",
		title: "Build Anything",
		blurb: "Rotating noun: design system → palette → …",
		Component: Hero_AnySystem,
	},
	{
		id: "brand-reveal",
		title: "Brand, Revealed",
		blurb: "Line reveal + gradient sweep on 'minutes'",
		Component: Hero_BrandReveal,
	},
	{
		id: "ship-to-code",
		title: "Ship to Code",
		blurb: "Editor → shadcn/v0/Bolt/Codex flow",
		Component: Hero_ShipToCode,
	},
	{
		id: "bold-minimal",
		title: "Bold & Minimal",
		blurb: "Josefin display, word-by-word blur-up",
		Component: Hero_BoldMinimal,
	},
	{
		id: "editor-first",
		title: "Design it, Ship it",
		blurb: "Two-beat wipe + live editor mock",
		Component: Hero_EditorFirst,
	},
];

const HERO_STORAGE_KEY = "dotui:hero-variant";

export function HeroLab() {
	const [index, setIndex] = useState(0);
	const [nonce, setNonce] = useState(0);

	// Restore the last pick on the client only (keeps SSR markup deterministic).
	useEffect(() => {
		const saved = window.localStorage.getItem(HERO_STORAGE_KEY);
		if (!saved) return;
		const i = HERO_VARIANTS.findIndex((v) => v.id === saved);
		if (i >= 0) setIndex(i);
	}, []);

	const go = useCallback((next: number) => {
		const count = HERO_VARIANTS.length;
		const i = ((next % count) + count) % count;
		setIndex(i);
		setNonce((n) => n + 1);
		const chosen = HERO_VARIANTS[i];
		if (chosen) window.localStorage.setItem(HERO_STORAGE_KEY, chosen.id);
	}, []);

	const replay = useCallback(() => setNonce((n) => n + 1), []);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			const el = e.target as HTMLElement | null;
			if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) return;
			if (e.key === "ArrowRight") go(index + 1);
			else if (e.key === "ArrowLeft") go(index - 1);
			else if (e.key === "r" || e.key === "R") replay();
			else if (/^[1-9]$/.test(e.key)) {
				const i = Number(e.key) - 1;
				if (i < HERO_VARIANTS.length) go(i);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [index, go, replay]);

	const active = HERO_VARIANTS[index];
	if (!active) return null; // index is always in range; this just satisfies the type checker
	const Active = active.Component;

	return (
		<>
			<section className="container flex flex-col pt-6 sm:pt-10 md:pt-18">
				<Active key={`${active.id}-${nonce}`} />
			</section>

			{/* DEV-ONLY variant switcher */}
			<div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 print:hidden">
				<div
					className="flex items-center gap-1 rounded-full border border-border bg-bg/90 p-1.5 shadow-lg backdrop-blur-md"
					title={active.blurb}
				>
					<button
						type="button"
						onClick={() => go(index - 1)}
						aria-label="Previous hero variant"
						className="flex size-8 items-center justify-center rounded-full text-lg text-fg-muted transition-colors hover:bg-muted hover:text-fg"
					>
						‹
					</button>

					<div className="flex min-w-[12.5rem] flex-col items-center px-2 leading-tight">
						<span className="text-xs font-medium text-fg">
							{index + 1}/{HERO_VARIANTS.length} · {active.title}
						</span>
						<span className="font-mono text-[10px] text-fg-muted">← → · 1–{HERO_VARIANTS.length} · R replay</span>
					</div>

					<div className="mr-1 flex items-center gap-1">
						{HERO_VARIANTS.map((v, i) => (
							<button
								type="button"
								key={v.id}
								onClick={() => go(i)}
								aria-label={`Hero variant ${i + 1}: ${v.title}`}
								aria-current={i === index}
								className={cn(
									"size-2 rounded-full transition-colors",
									i === index ? "bg-accent" : "bg-fg/20 hover:bg-fg/40",
								)}
							/>
						))}
					</div>

					<button
						type="button"
						onClick={() => go(index + 1)}
						aria-label="Next hero variant"
						className="flex size-8 items-center justify-center rounded-full text-lg text-fg-muted transition-colors hover:bg-muted hover:text-fg"
					>
						›
					</button>
				</div>
			</div>
		</>
	);
}
