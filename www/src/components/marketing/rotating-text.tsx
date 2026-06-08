"use client";

import { type ReactNode, useEffect, useState } from "react";

import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";

import { cn } from "@/registry/lib/utils";

export interface RotatingTextSegment {
	/** A run of text — animated one character at a time. */
	text?: string;
	/** An inline logo — animated as a single unit alongside the letters. */
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
	/** Time each word stays fully on screen, ms. */
	interval?: number;
	className?: string;
}

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

// One animated unit per character / per icon. Spaces become non-breaking so they
// keep their advance width while fading in.
interface Unit {
	key: string;
	icon?: ReactNode;
	char?: string;
}
function toUnits(segments: RotatingTextSegment[]): Unit[] {
	const units: Unit[] = [];
	segments.forEach((seg, si) => {
		if (seg.icon) {
			units.push({ key: `i${si}`, icon: seg.icon });
		} else if (seg.text) {
			[...seg.text].forEach((ch, ci) => units.push({ key: `t${si}.${ci}`, char: ch === " " ? " " : ch }));
		}
	});
	return units;
}

/**
 * Swappable-words animation. Each word is revealed letter by letter: every
 * character (and inline logo) rises a touch, sharpens out of a soft blur, and
 * fades in on a small stagger, while the outgoing word lifts away as a whole. The
 * slot animates its width to hug the current word. That per-letter cascade is what
 * gives it the fluid, premium feel of a marketing headline rather than a hard swap.
 *
 * Cycling is decorative — give the surrounding heading a static `aria-label`. A
 * visually-hidden full reading is included for standalone use.
 */
export function RotatingText({ items, interval = 2600, className }: RotatingTextProps) {
	const [index, setIndex] = useState(0);
	const reduceMotion = useReducedMotion();

	useEffect(() => {
		if (items.length <= 1) return;
		const id = window.setInterval(() => {
			setIndex((i) => (i + 1) % items.length);
		}, interval);
		return () => window.clearInterval(id);
	}, [items.length, interval]);

	const active = items[index] ?? items[0];
	if (!active) return null;

	// The container orchestrates the per-letter stagger on enter; on exit it lifts
	// the whole word away as one block (letters have no `exit`, so they ride along).
	const container: Variants = reduceMotion
		? { hidden: {}, visible: {}, exit: { opacity: 0, transition: { duration: 0.15 } } }
		: {
				hidden: {},
				visible: { transition: { staggerChildren: 0.026 } },
				exit: { opacity: 0, y: "-0.4em", filter: "blur(4px)", transition: { duration: 0.32, ease: "easeIn" } },
			};

	const unit: Variants = reduceMotion
		? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.2 } } }
		: {
				hidden: { opacity: 0, y: "0.55em", filter: "blur(5px)" },
				visible: { opacity: 1, y: "0em", filter: "blur(0px)", transition: { duration: 0.5, ease: EASE_OUT } },
			};

	return (
		<span className={cn("relative inline-flex align-bottom text-fg-accent", className)}>
			<span className="sr-only">{items.map((it) => it.text).join(", ")}</span>
			<motion.span
				aria-hidden="true"
				layout={!reduceMotion}
				transition={{ layout: { type: "spring", stiffness: 220, damping: 26 } }}
				className="inline-flex pb-[0.14em]"
			>
				<AnimatePresence mode="popLayout" initial={false}>
					<motion.span
						key={active.id}
						variants={container}
						initial="hidden"
						animate="visible"
						exit="exit"
						className="inline-flex items-center whitespace-nowrap"
					>
						{toUnits(active.segments).map((u) => (
							<motion.span
								key={u.key}
								variants={unit}
								className={u.icon ? "mx-[0.18em] inline-flex items-center" : "inline-block"}
							>
								{u.icon ?? u.char}
							</motion.span>
						))}
					</motion.span>
				</AnimatePresence>
			</motion.span>
		</span>
	);
}
