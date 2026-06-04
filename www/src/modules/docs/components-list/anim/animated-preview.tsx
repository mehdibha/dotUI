"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import { animate, useMotionValue, useReducedMotion } from "motion/react";
import { UNSAFE_PortalProvider } from "react-aria/PortalProvider";

import { cn } from "@/registry/lib/utils";

import { FakeCursor } from "./cursor";

// `contain` mode (overlays/pickers): portal overlays into the card + pin the modal's
// runtime viewport vars so it sizes to the card, like the static overlay previews.
const CONTAIN_VARS = { "--page-height": "100%", "--visual-viewport-height": "100%" } as CSSProperties;
const CONTAIN_CLASS = "[&_:has(>[data-slot=modal-viewport])]:!h-full [&_[data-slot=modal-viewport]]:!h-full";

// Thrown to unwind the animation loop when it is cancelled (hover / offscreen / unmount).
const ABORT = Symbol("preview-abort");

const SPRING = { type: "spring", stiffness: 220, damping: 26, mass: 0.9 } as const;

type Target = string | { selector: string } | { x: number; y: number } | { el: HTMLElement | null };

/** Imperative driver handed to a preview's `script`. Every method is cancellable. */
export interface Driver {
	/** Move the cursor to an element (by ref name / selector / element) or to coords. */
	moveTo: (target: Target, opts?: { anchor?: "center" | "top" | "bottom" }) => Promise<void>;
	/** Animate a press at the current position; `onDown` fires at the bottom of the press. */
	press: (onDown?: () => void) => Promise<void>;
	/** moveTo + press, the common "click this" gesture. */
	click: (target: Target, onDown?: () => void) => Promise<void>;
	/** Move to a target, dwell, optionally toggling a hovered visual via callbacks. */
	hover: (target: Target, opts?: { dwell?: number; onEnter?: () => void; onLeave?: () => void }) => Promise<void>;
	/** Type `text` into a target: each step calls `onText` with the accumulated string. */
	type: (
		target: Target,
		text: string,
		onText: (value: string) => void,
		opts?: { perChar?: number; start?: string },
	) => Promise<void>;
	/** Drag from one point to another while reporting progress 0→1 (sliders, color area). */
	drag: (
		from: Target,
		to: Target | { x: number; y: number },
		onProgress: (t: number) => void,
		opts?: { steps?: number },
	) => Promise<void>;
	/** Cancellable delay. */
	wait: (ms: number) => Promise<void>;
	/** Run a state change inline (sugar for choreographing without a press). */
	do: (fn: () => void) => Promise<void>;
	/** Move the cursor out of the card and fade it. */
	moveOff: () => Promise<void>;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

interface AnimatedPreviewProps {
	/** The looping animation. Receives a fresh, cancellable driver each iteration. */
	script: (s: Driver) => Promise<void>;
	/** Reset the component to its initial state (called before each loop + on hover takeover). */
	reset?: () => void;
	/** Render the component; `ref(name)` registers an element as a cursor target. */
	children: (ref: (name: string) => (el: HTMLElement | null) => void) => React.ReactNode;
	className?: string;
	/** Overlay/picker demos: portal overlays into the card + render client-only (SSR-safe). */
	contain?: boolean;
}

export function AnimatedPreview({ script, reset, children, className, contain = false }: AnimatedPreviewProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const refs = useRef(new Map<string, HTMLElement>());
	// `contain` demos render client-only (Select/Combobox/Menu crash React during SSR).
	const [mounted, setMounted] = useState(!contain);
	useEffect(() => setMounted(true), []);

	const x = useMotionValue(-100);
	const y = useMotionValue(-100);
	const scale = useMotionValue(1);
	const opacity = useMotionValue(0);
	const ripple = useMotionValue(0);

	const [interactive, setInteractive] = useState(false);

	// Latest props without re-subscribing the loop.
	const scriptRef = useRef(script);
	scriptRef.current = script;
	const resetRef = useRef(reset);
	resetRef.current = reset;

	const reduceMotion = useReducedMotion();
	const abortRef = useRef<AbortController | null>(null);

	const resolve = useCallback(
		(target: Target, anchor: "center" | "top" | "bottom" = "center") => {
			const c = containerRef.current;
			if (!c) return { x: 0, y: 0 };
			if (typeof target === "object" && "x" in target) return { x: target.x, y: target.y };
			let el: HTMLElement | null = null;
			if (typeof target === "string") el = refs.current.get(target) ?? null;
			else if ("selector" in target) el = c.querySelector<HTMLElement>(target.selector);
			else el = target.el;
			if (!el) return { x: x.get(), y: y.get() };
			const r = el.getBoundingClientRect();
			const cr = c.getBoundingClientRect();
			const cy = anchor === "top" ? r.top : anchor === "bottom" ? r.bottom : r.top + r.height / 2;
			// Offset so the arrow tip (not its box corner) lands on the target.
			return { x: r.left - cr.left + r.width / 2 - 4, y: cy - cr.top - 2 };
		},
		[x, y],
	);

	const makeDriver = useCallback(
		(signal: AbortSignal): Driver => {
			const guard = () => {
				if (signal.aborted) throw ABORT;
			};
			const run = async (controls: { stop: () => void; then: PromiseLike<unknown>["then"] }) => {
				const onAbort = () => controls.stop();
				signal.addEventListener("abort", onAbort, { once: true });
				try {
					await controls;
				} finally {
					signal.removeEventListener("abort", onAbort);
				}
				guard();
			};
			const moveTo: Driver["moveTo"] = async (target, opts) => {
				guard();
				if (opacity.get() < 1) await run(animate(opacity, 1, { duration: 0.2 }) as never);
				const p = resolve(target, opts?.anchor);
				await Promise.all([run(animate(x, p.x, SPRING) as never), run(animate(y, p.y, SPRING) as never)]);
			};
			const press: Driver["press"] = async (onDown) => {
				guard();
				await run(animate(scale, 0.8, { duration: 0.09 }) as never);
				ripple.set(ripple.get() + 1);
				onDown?.();
				await run(animate(scale, 1, { duration: 0.14 }) as never);
			};
			const wait: Driver["wait"] = (ms) =>
				new Promise<void>((res, rej) => {
					guard();
					const t = setTimeout(res, ms);
					signal.addEventListener(
						"abort",
						() => {
							clearTimeout(t);
							rej(ABORT);
						},
						{ once: true },
					);
				});
			const click: Driver["click"] = async (target, onDown) => {
				await moveTo(target);
				await wait(140);
				await press(onDown);
			};
			return {
				moveTo,
				press,
				wait,
				click,
				hover: async (target, opts) => {
					await moveTo(target);
					opts?.onEnter?.();
					await wait(opts?.dwell ?? 900);
					opts?.onLeave?.();
				},
				type: async (target, text, onText, opts) => {
					await moveTo(target);
					await wait(180);
					let acc = opts?.start ?? "";
					for (const ch of text) {
						acc += ch;
						guard();
						onText(acc);
						await wait(opts?.perChar ?? 80);
					}
				},
				drag: async (from, to, onProgress, opts) => {
					await moveTo(from);
					await run(animate(scale, 0.82, { duration: 0.1 }) as never);
					const start = { x: x.get(), y: y.get() };
					const fixedEnd = typeof to === "object" && "x" in to ? to : null;
					const steps = opts?.steps ?? 28;
					for (let i = 1; i <= steps; i++) {
						guard();
						const t = i / steps;
						// Update the value first so the target (e.g. a slider thumb) moves, then
						// re-resolve it so the cursor follows it precisely.
						onProgress(t);
						await wait(16);
						const end = fixedEnd ?? resolve(to as Target);
						x.set(lerp(start.x, end.x, t));
						y.set(lerp(start.y, end.y, t));
					}
					await run(animate(scale, 1, { duration: 0.12 }) as never);
				},
				do: async (fn) => {
					guard();
					fn();
				},
				moveOff: async () => {
					guard();
					const c = containerRef.current;
					const tx = c ? c.clientWidth * 0.5 : 0;
					const ty = c ? c.clientHeight + 24 : 0;
					await Promise.all([run(animate(x, tx, SPRING) as never), run(animate(y, ty, SPRING) as never)]);
					await run(animate(opacity, 0, { duration: 0.2 }) as never);
				},
			};
		},
		[opacity, resolve, ripple, scale, x, y],
	);

	const stop = useCallback(() => {
		abortRef.current?.abort();
		abortRef.current = null;
	}, []);

	const start = useCallback(() => {
		if (abortRef.current) return;
		const ac = new AbortController();
		abortRef.current = ac;
		const driver = makeDriver(ac.signal);
		(async () => {
			try {
				while (!ac.signal.aborted) {
					resetRef.current?.();
					await scriptRef.current(driver);
				}
			} catch (e) {
				if (e !== ABORT) throw e;
			}
		})();
	}, [makeDriver]);

	// Orchestrate: only animate when on-screen, tab-visible, not hovered, motion allowed.
	useEffect(() => {
		const c = containerRef.current;
		if (!c) return;
		let onScreen = false;
		const evaluate = () => {
			const should = onScreen && !document.hidden && !interactive && !reduceMotion;
			if (should) start();
			else {
				stop();
				// Whenever the loop isn't running the cursor must disappear.
				opacity.set(0);
				scale.set(1);
				// Reset to the initial state when idle (offscreen / tab hidden), but NOT on hover
				// takeover — there we hand the component to the user from its current state.
				if (!interactive) resetRef.current?.();
			}
		};
		const io = new IntersectionObserver(
			(entries) => {
				const entry = entries[0];
				if (!entry) return;
				onScreen = entry.isIntersecting;
				evaluate();
			},
			{ rootMargin: "120px" },
		);
		io.observe(c);
		const onVis = () => evaluate();
		document.addEventListener("visibilitychange", onVis);
		return () => {
			io.disconnect();
			document.removeEventListener("visibilitychange", onVis);
			stop();
		};
	}, [interactive, reduceMotion, start, stop, opacity, scale]);

	const refFor = (name: string) => (el: HTMLElement | null) => {
		if (el) refs.current.set(name, el);
		else refs.current.delete(name);
	};
	const content = mounted ? children(refFor) : null;

	return (
		<div
			ref={containerRef}
			className={cn(
				"relative isolate flex size-full items-center justify-center overflow-hidden",
				contain && CONTAIN_CLASS,
				className,
			)}
			style={contain ? CONTAIN_VARS : undefined}
			onPointerEnter={() => setInteractive(true)}
			onPointerLeave={() => setInteractive(false)}
		>
			{contain ? (
				<UNSAFE_PortalProvider getContainer={() => containerRef.current ?? document.body}>
					{content}
				</UNSAFE_PortalProvider>
			) : (
				content
			)}
			{!reduceMotion && <FakeCursor x={x} y={y} scale={scale} opacity={opacity} ripple={ripple} />}
		</div>
	);
}
