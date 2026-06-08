"use client";

import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";

import { AnimatePresence, motion, type Transition, useReducedMotion, type Variants } from "motion/react";

import { cn } from "@/registry/lib/utils";

export type RotatingEffect =
	| "word-slide-roll"
	| "blur-fade-flip"
	| "letter-rise-blur"
	| "odometer-flip"
	| "letter-scramble";

export interface RotatingTextSegment {
	/** A run of text — split into characters by the per-letter effects. */
	text?: string;
	/** An inline logo — always animated as one atomic unit, never split. */
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
	/** Which swap animation to use. */
	effect?: RotatingEffect;
	/** Time each word stays fully on screen, ms. */
	interval?: number;
	className?: string;
	/** Typography applied to the swapped word (e.g. an italic-serif accent font). */
	wordStyle?: CSSProperties;
}

const SPRING: Transition = { type: "spring", stiffness: 220, damping: 26 };
const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Flatten an item's segments into atomic units: one per character, one per icon.
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
			[...seg.text].forEach((ch, ci) => units.push({ id: `t${si}.${ci}`, char: ch }));
		}
	});
	return units;
}

// Render an item's raw segments inline (used by the whole-word effects). Spacing
// around a logo comes from its own horizontal margin.
function Segments({ item }: { item: RotatingTextItem }) {
	return (
		<>
			{item.segments.map((seg, i) =>
				seg.icon ? (
					<span key={i} className="mx-[0.18em] inline-flex items-center">
						{seg.icon}
					</span>
				) : (
					<span key={i}>{seg.text}</span>
				),
			)}
		</>
	);
}

function useCycle(length: number, interval: number) {
	const [index, setIndex] = useState(0);
	useEffect(() => {
		if (length <= 1) return;
		const id = window.setInterval(() => setIndex((i) => (i + 1) % length), interval);
		return () => window.clearInterval(id);
	}, [length, interval]);
	return index;
}

/* -------------------------------- Effects -------------------------------- */

// 1 & 2 — whole-word swaps (slide-roll, blur-fade-flip). Differ only by variants.
function WholeWord({
	item,
	variants,
	transition,
	clip,
	wordStyle,
}: {
	item: RotatingTextItem;
	variants: Variants;
	transition: Transition;
	clip: boolean;
	wordStyle?: CSSProperties;
}) {
	return (
		<motion.span
			layout
			transition={{ layout: SPRING }}
			className={cn("inline-flex pb-[0.16em]", clip ? "overflow-hidden" : "overflow-visible")}
		>
			<AnimatePresence mode="popLayout" initial={false}>
				<motion.span
					key={item.id}
					variants={variants}
					initial="initial"
					animate="animate"
					exit="exit"
					transition={transition}
					style={wordStyle}
					className="inline-flex items-center whitespace-nowrap"
				>
					<Segments item={item} />
				</motion.span>
			</AnimatePresence>
		</motion.span>
	);
}

// 3 — per-letter rise + de-blur cascade. Letters stagger in; the word lifts away on exit.
function LetterRiseBlur({ item, wordStyle }: { item: RotatingTextItem; wordStyle?: CSSProperties }) {
	const container: Variants = {
		hidden: {},
		visible: { transition: { staggerChildren: 0.028 } },
		exit: { opacity: 0, y: "-0.4em", filter: "blur(4px)", transition: { duration: 0.32, ease: "easeIn" } },
	};
	const unit: Variants = {
		hidden: { opacity: 0, y: "0.55em", filter: "blur(6px)" },
		visible: { opacity: 1, y: "0em", filter: "blur(0px)", transition: { duration: 0.5, ease: EXPO } },
	};
	return (
		<motion.span layout transition={{ layout: SPRING }} className="inline-flex pb-[0.16em]">
			<AnimatePresence mode="popLayout" initial={false}>
				<motion.span
					key={item.id}
					variants={container}
					initial="hidden"
					animate="visible"
					exit="exit"
					style={wordStyle}
					className="inline-flex items-center whitespace-nowrap"
				>
					{toUnits(item.segments).map((u) => (
						<motion.span
							key={u.id}
							variants={unit}
							className={u.icon ? "mx-[0.18em] inline-flex items-center" : "inline-block"}
						>
							{u.icon ?? u.char}
						</motion.span>
					))}
				</motion.span>
			</AnimatePresence>
		</motion.span>
	);
}

// 4 — odometer: each character position rolls vertically (old up, new from below).
function Odometer({ item, wordStyle }: { item: RotatingTextItem; wordStyle?: CSSProperties }) {
	const units = toUnits(item.segments);
	return (
		<motion.span
			layout
			transition={{ layout: SPRING }}
			style={wordStyle}
			className="inline-flex items-center pb-[0.16em] whitespace-nowrap"
		>
			{units.map((u, i) => (
				<span
					key={i}
					className={cn("relative inline-flex h-[1.1em] items-center overflow-hidden", u.icon && "mx-[0.18em]")}
				>
					<AnimatePresence mode="popLayout" initial={false}>
						<motion.span
							key={u.icon ? `icon-${item.id}` : (u.char ?? "")}
							initial={{ y: "115%" }}
							animate={{ y: "0%" }}
							exit={{ y: "-115%" }}
							transition={{ duration: 0.3, ease: EXPO, delay: i * 0.04 }}
							className="inline-flex items-center"
						>
							{u.icon ?? u.char}
						</motion.span>
					</AnimatePresence>
				</span>
			))}
		</motion.span>
	);
}

// 5 — scramble: text decodes from noise characters, locking left-to-right. Icons stay put.
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function ScrambleText({ text }: { text: string }) {
	const [display, setDisplay] = useState(text);
	const frame = useRef(0);
	useEffect(() => {
		const chars = [...text];
		let pos = 0;
		// Vary the noise per tick without Math.random (which is fine here) — keep it
		// deterministic-ish by walking the charset so SSR/first paint is stable.
		const pick = () => SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)] ?? "•";
		const id = window.setInterval(() => {
			frame.current += 1;
			setDisplay(chars.map((c, i) => (i < pos / 3 ? c : c === " " ? " " : pick())).join(""));
			pos += 1;
			if (pos >= chars.length * 3) {
				window.clearInterval(id);
				setDisplay(text);
			}
		}, 45);
		return () => window.clearInterval(id);
	}, [text]);
	return <span className="whitespace-pre">{display}</span>;
}

function Scramble({ item, wordStyle }: { item: RotatingTextItem; wordStyle?: CSSProperties }) {
	return (
		<motion.span
			key={item.id}
			initial={{ opacity: 0.5 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.15 }}
			style={wordStyle}
			className="inline-flex items-center pb-[0.16em] whitespace-nowrap"
		>
			{item.segments.map((seg, i) =>
				seg.icon ? (
					<span key={i} className="mx-[0.18em] inline-flex items-center">
						{seg.icon}
					</span>
				) : (
					<ScrambleText key={i} text={seg.text ?? ""} />
				),
			)}
		</motion.span>
	);
}

/* ------------------------------ Component ------------------------------ */

/**
 * Swappable-words animation with multiple selectable effects, surveyed from popular
 * registries (Magic UI, Aceternity, motion-primitives, react-bits, fancy components):
 *
 * - `word-slide-roll`  — whole word slides up + fades (motion-primitives Text Loop)
 * - `blur-fade-flip`   — whole word blurs out / focuses in (Aceternity Flip Words)
 * - `letter-rise-blur` — letters cascade in from a blur (react-bits Blur Text)
 * - `odometer-flip`    — characters roll vertically like a ticker board (fancy Letter Swap)
 * - `letter-scramble`  — text decodes from noise, locking left-to-right (Magic UI Hyper Text)
 *
 * Inline logos are always animated as one atomic unit. The cycling is decorative —
 * give the surrounding heading a static `aria-label`; a hidden full reading is included.
 */
export function RotatingText({
	items,
	effect = "letter-rise-blur",
	interval = 2600,
	className,
	wordStyle,
}: RotatingTextProps) {
	const index = useCycle(items.length, interval);
	const reduceMotion = useReducedMotion();
	const active = items[index] ?? items[0];
	if (!active) return null;

	let body: ReactNode;
	if (reduceMotion) {
		// Honour reduced-motion with a plain crossfade regardless of effect.
		body = (
			<span className="inline-flex pb-[0.16em]">
				<AnimatePresence mode="popLayout" initial={false}>
					<motion.span
						key={active.id}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						style={wordStyle}
						className="inline-flex items-center whitespace-nowrap"
					>
						<Segments item={active} />
					</motion.span>
				</AnimatePresence>
			</span>
		);
	} else if (effect === "word-slide-roll") {
		body = (
			<WholeWord
				item={active}
				clip
				variants={{
					initial: { opacity: 0, y: "0.7em" },
					animate: { opacity: 1, y: "0em" },
					exit: { opacity: 0, y: "-0.7em" },
				}}
				transition={{ duration: 0.4, ease: EXPO }}
				wordStyle={wordStyle}
			/>
		);
	} else if (effect === "blur-fade-flip") {
		body = (
			<WholeWord
				item={active}
				clip={false}
				variants={{
					initial: { opacity: 0, y: "0.5em", filter: "blur(10px)" },
					animate: { opacity: 1, y: "0em", filter: "blur(0px)" },
					exit: { opacity: 0, y: "-0.4em", filter: "blur(8px)" },
				}}
				transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
				wordStyle={wordStyle}
			/>
		);
	} else if (effect === "odometer-flip") {
		body = <Odometer item={active} wordStyle={wordStyle} />;
	} else if (effect === "letter-scramble") {
		body = <Scramble item={active} wordStyle={wordStyle} />;
	} else {
		body = <LetterRiseBlur item={active} wordStyle={wordStyle} />;
	}

	return (
		<span className={cn("relative inline-flex align-bottom text-fg-accent", className)}>
			<span className="sr-only">{items.map((it) => it.text).join(", ")}</span>
			<span aria-hidden="true" className="inline-flex">
				{body}
			</span>
		</span>
	);
}
