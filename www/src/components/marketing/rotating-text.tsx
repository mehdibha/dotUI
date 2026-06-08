"use client";

/**
 * Swappable-words animation. The swap is a clean three-beat sequence — the old
 * word fully exits, the slot springs to the incoming word's width, then the new
 * word reveals — so there is never a flicker or a width snap.
 *
 * How that works (the pattern shared by the best registry components — Fancy
 * `TextRotate`, Aceternity `ContainerTextFlip` / `FlipWords`):
 *   - `AnimatePresence mode="wait"` guarantees the outgoing word finishes exiting
 *     before the incoming word mounts (no two-words-on-screen overlap).
 *   - `layout` on the wrapper springs the slot width from the old word to the new
 *     one. The new word's units are `inline-block`, so they reserve their width
 *     immediately (even at `opacity: 0`), which is what makes the width animate
 *     instead of snapping.
 *   - Each unit is `inline-block` and the row is baseline-aligned, so letters and
 *     inline logos sit exactly on the headline baseline.
 *
 * The `effect` prop only swaps the per-unit enter/exit choreography; the smooth
 * shell is identical for every option. Inline logos animate as one atomic unit.
 */

import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";

import { AnimatePresence, motion, type TargetAndTransition, type Transition, useReducedMotion } from "motion/react";

import { cn } from "@/registry/lib/utils";

export type RotatingEffect = "roll" | "blur" | "flip" | "fade";

export interface RotatingTextSegment {
	/** A run of text — split into characters. */
	text?: string;
	/** An inline logo — animated as one atomic unit, never split. */
	icon?: ReactNode;
}

export interface RotatingTextItem {
	/** Stable key for the animation. */
	id: string;
	/** Plain-text reading, joined into the accessible label. */
	text: string;
	/** Visual content, split into text / icon segments. */
	segments: RotatingTextSegment[];
}

interface RotatingTextProps {
	items: RotatingTextItem[];
	/** Which enter/exit choreography to use. */
	effect?: RotatingEffect;
	/** Time each word stays fully on screen, ms. */
	interval?: number;
	className?: string;
	/** Typography applied to the swapped word (e.g. an italic-serif accent font). */
	wordStyle?: CSSProperties;
}

const WIDTH_SPRING: Transition = { type: "spring", stiffness: 260, damping: 30 };

type StaggerFrom = "first" | "last" | "center";

interface EffectConfig {
	/** Per-unit enter states. */
	initial: TargetAndTransition;
	animate: TargetAndTransition;
	/** Per-unit exit (used unless `wordExit` is set, in which case the whole word exits). */
	exit?: TargetAndTransition;
	transition: Transition;
	staggerFrom: StaggerFrom;
	staggerStep: number;
	/** Optional whole-word exit (FlipWords-style fly-away) instead of per-unit exits. */
	wordExit?: TargetAndTransition;
}

// The genuinely-good effects, distilled from the top-ranked registry components.
const EFFECTS: Record<RotatingEffect, EffectConfig> = {
	// ReactBits / Fancy TextRotate — characters roll up from below, staggered from
	// the centre outward. The signature cinematic single-word reveal.
	roll: {
		initial: { y: "110%", opacity: 0 },
		animate: { y: "0%", opacity: 1 },
		exit: { y: "-110%", opacity: 0 },
		transition: { type: "spring", damping: 26, stiffness: 300 },
		staggerFrom: "center",
		staggerStep: 0.025,
	},
	// Aceternity ContainerTextFlip — a soft focus-pull: each unit sharpens out of a
	// blur as it fades up.
	blur: {
		initial: { opacity: 0, y: "0.28em", filter: "blur(10px)" },
		animate: { opacity: 1, y: "0em", filter: "blur(0px)" },
		exit: { opacity: 0, y: "-0.22em", filter: "blur(8px)" },
		transition: { duration: 0.44, ease: [0.22, 1, 0.36, 1] },
		staggerFrom: "first",
		staggerStep: 0.022,
	},
	// Aceternity FlipWords — letters blur-slide in; the outgoing word lifts and
	// blurs away as a whole, slightly scaled.
	flip: {
		initial: { opacity: 0, y: "0.45em", filter: "blur(8px)" },
		animate: { opacity: 1, y: "0em", filter: "blur(0px)" },
		transition: { type: "spring", stiffness: 200, damping: 22 },
		staggerFrom: "first",
		staggerStep: 0.04,
		wordExit: { opacity: 0, y: "-0.55em", filter: "blur(8px)", scale: 1.25 },
	},
	// A clean, restrained option — a small lift + fade, snappy spring.
	fade: {
		initial: { opacity: 0, y: "0.3em" },
		animate: { opacity: 1, y: "0em" },
		exit: { opacity: 0, y: "-0.3em" },
		transition: { type: "spring", damping: 30, stiffness: 350 },
		staggerFrom: "first",
		staggerStep: 0.016,
	},
};

interface Unit {
	id: string;
	icon?: ReactNode;
	char?: string;
}
function toUnits(segments: RotatingTextSegment[]): Unit[] {
	const units: Unit[] = [];
	segments.forEach((seg, si) => {
		if (seg.icon) {
			units.push({ id: `i${si}`, icon: seg.icon });
		} else if (seg.text) {
			// Non-breaking spaces so a space unit keeps its width as an inline-block.
			[...seg.text].forEach((ch, ci) => units.push({ id: `t${si}.${ci}`, char: ch === " " ? " " : ch }));
		}
	});
	return units;
}

function staggerDelay(i: number, total: number, from: StaggerFrom, step: number): number {
	if (from === "last") return (total - 1 - i) * step;
	if (from === "center") return Math.abs(Math.floor(total / 2) - i) * step;
	return i * step;
}

export function RotatingText({ items, effect = "roll", interval = 2800, className, wordStyle }: RotatingTextProps) {
	const [index, setIndex] = useState(0);
	const reduceMotion = useReducedMotion();

	useEffect(() => {
		if (items.length <= 1) return;
		const id = window.setInterval(() => setIndex((i) => (i + 1) % items.length), interval);
		return () => window.clearInterval(id);
	}, [items.length, interval]);

	// Measure the incoming word's natural width from an invisible sizer, then animate
	// the slot to it (the ContainerTextFlip pattern). Animating the real `width`
	// property — rather than a `layout` scale transform — keeps the letters crisp and
	// the surrounding text from snapping. `wordStyle` is a dep so a font change re-measures.
	const sizerRef = useRef<HTMLSpanElement | null>(null);
	const [width, setWidth] = useState<number | undefined>(undefined);
	useEffect(() => {
		const el = sizerRef.current;
		if (!el) return;
		const next = Math.round(el.scrollWidth);
		setWidth((prev) => (prev === next ? prev : next));
	}, [index, wordStyle]);

	const active = items[index] ?? items[0];
	if (!active) return null;

	// Fall back to `roll` if a stale / unknown effect id is passed (e.g. an old value
	// restored from localStorage after the effect set changed).
	const cfg = EFFECTS[effect] ?? EFFECTS.roll;
	const units = toUnits(active.segments);
	const total = units.length;
	const hasWordExit = !reduceMotion && !!cfg.wordExit;

	return (
		<span className={cn("relative inline-flex align-baseline text-fg-accent", className)}>
			<span className="sr-only">{items.map((it) => it.text).join(", ")}</span>
			<motion.span
				aria-hidden="true"
				className="inline-grid items-baseline"
				animate={width != null ? { width } : undefined}
				transition={{ width: WIDTH_SPRING }}
			>
				{/* Sizer: invisibly holds the current word so the slot keeps a baseline and a
				    measurable width through the swap, and never collapses between words. */}
				<span
					ref={sizerRef}
					style={wordStyle}
					className="invisible col-start-1 row-start-1 inline-flex items-baseline justify-self-start whitespace-nowrap"
				>
					{units.map((u) => (
						<span key={u.id} className={u.icon ? "mx-[0.18em] inline-flex items-center" : "inline-block"}>
							{u.icon ?? u.char}
						</span>
					))}
				</span>
				{/* Visible word: swapped sequentially over the sizer (mode="wait"). */}
				<span className="col-start-1 row-start-1 inline-flex items-baseline justify-self-start whitespace-nowrap">
					<AnimatePresence mode="wait" initial={false}>
						<motion.span
							key={active.id}
							style={wordStyle}
							className="inline-flex items-baseline whitespace-nowrap"
							exit={hasWordExit ? { ...cfg.wordExit, transition: { duration: 0.32, ease: "easeIn" } } : undefined}
						>
							{units.map((u, i) => (
								<motion.span
									key={u.id}
									initial={reduceMotion ? { opacity: 0 } : cfg.initial}
									animate={reduceMotion ? { opacity: 1 } : cfg.animate}
									exit={reduceMotion ? { opacity: 0 } : hasWordExit ? undefined : cfg.exit}
									transition={
										reduceMotion
											? { duration: 0.2 }
											: { ...cfg.transition, delay: staggerDelay(i, total, cfg.staggerFrom, cfg.staggerStep) }
									}
									className={u.icon ? "mx-[0.18em] inline-flex items-center" : "inline-block"}
								>
									{u.icon ?? u.char}
								</motion.span>
							))}
						</motion.span>
					</AnimatePresence>
				</span>
			</motion.span>
		</span>
	);
}
