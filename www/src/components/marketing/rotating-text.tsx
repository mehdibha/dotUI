"use client";

/**
 * Swappable-words animation. The whole destination swaps as one subtle unit — it
 * eases out (shrinks slightly + blurs) and the next eases in (grows from slightly
 * small while sharpening from a blur). `mode="wait"` keeps the two from overlapping,
 * and the slot springs to the incoming word's measured width so the line never snaps
 * — the old word leaves, the space adapts, then the new word appears.
 */

import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";

import { AnimatePresence, motion, type Transition, useReducedMotion } from "motion/react";

import { cn } from "@/registry/lib/utils";

export interface RotatingTextSegment {
	/** A run of text. */
	text?: string;
	/** An inline logo / wordmark. */
	icon?: ReactNode;
}

export interface RotatingTextItem {
	/** Stable key for the animation. */
	id: string;
	/** Plain-text reading, joined into the accessible label. */
	text: string;
	/** Visual content (text and/or a logo). */
	segments: RotatingTextSegment[];
}

interface RotatingTextProps {
	items: RotatingTextItem[];
	/** Time each word stays fully on screen, ms. */
	interval?: number;
	className?: string;
	/** Typography applied to the swapped word. */
	wordStyle?: CSSProperties;
	/** Static, non-animated lead-in shown before the swapping word (e.g. "to"). */
	prefix?: ReactNode;
}

const WIDTH_SPRING: Transition = { type: "spring", stiffness: 260, damping: 30 };

function Segments({ item }: { item: RotatingTextItem }) {
	return (
		<>
			{/* Zero-width baseline anchor: gives icon-only words (a logo with no text) a real
			    text baseline, so the slot sits at the same height as text words — no line jump. */}
			<span aria-hidden="true" className="inline-block w-0">
				{"​"}
			</span>
			{item.segments.map((seg, i) =>
				seg.icon ? (
					<span key={i} className="mr-[0.18em] inline-flex items-center">
						{seg.icon}
					</span>
				) : (
					<span key={i}>{seg.text}</span>
				),
			)}
		</>
	);
}

export function RotatingText({ items, interval = 2800, className, wordStyle, prefix }: RotatingTextProps) {
	const [index, setIndex] = useState(0);
	const reduceMotion = useReducedMotion();

	useEffect(() => {
		if (items.length <= 1) return;
		const id = window.setInterval(() => setIndex((i) => (i + 1) % items.length), interval);
		return () => window.clearInterval(id);
	}, [items.length, interval]);

	// Measure the incoming word's natural width from the invisible sizer, then animate
	// the slot to it — animating the real `width` (not a scale transform) keeps the
	// surrounding text from snapping. `wordStyle` is a dep so a font change re-measures.
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

	const variants = reduceMotion
		? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
		: {
				initial: { opacity: 0, scale: 0.96, filter: "blur(5px)" },
				animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
				exit: { opacity: 0, scale: 0.96, filter: "blur(5px)" },
			};

	return (
		<span className={cn("relative inline-flex items-baseline align-baseline text-fg", className)}>
			<span className="sr-only">{items.map((it) => it.text).join(", ")}</span>
			{prefix != null && (
				<span aria-hidden="true" style={wordStyle} className="pr-[0.22em] whitespace-nowrap">
					{prefix}
				</span>
			)}
			<motion.span
				aria-hidden="true"
				// Cap the slot to one line so a taller logo spills out visually (overflow-visible)
				// rather than growing the headline's line height on an icon word.
				className="inline-grid h-[1em] items-baseline overflow-visible"
				animate={width != null ? { width } : undefined}
				transition={{ width: WIDTH_SPRING }}
			>
				{/* Sizer: invisibly holds the current word so the slot keeps a baseline + a
				    measurable width through the swap, and never collapses between words. */}
				<span
					ref={sizerRef}
					style={wordStyle}
					className="invisible col-start-1 row-start-1 inline-flex items-baseline justify-self-start whitespace-nowrap"
				>
					<Segments item={active} />
				</span>
				{/* Visible word: swapped sequentially over the sizer (mode="wait"). */}
				<span className="col-start-1 row-start-1 inline-flex items-baseline justify-self-start whitespace-nowrap">
					<AnimatePresence mode="wait" initial={false}>
						<motion.span
							key={active.id}
							initial={variants.initial}
							animate={variants.animate}
							exit={variants.exit}
							transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
							style={{ ...wordStyle, transformOrigin: "0% 60%" }}
							className="inline-flex items-baseline whitespace-nowrap"
						>
							<Segments item={active} />
						</motion.span>
					</AnimatePresence>
				</span>
			</motion.span>
		</span>
	);
}
