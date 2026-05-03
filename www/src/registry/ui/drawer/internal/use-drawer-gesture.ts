"use client";

import * as React from "react";

import {
	CROSS_AXIS_PRESERVE_THRESHOLD,
	DEFAULT_IGNORE_SELECTOR,
	DEFAULT_SWIPE_THRESHOLD,
	FAST_SWIPE_VELOCITY,
	MAX_RELEASE_VELOCITY_AGE_MS,
	MAX_SWIPE_RELEASE_DURATION_MS,
	MAX_SWIPE_RELEASE_SCALAR,
	MAX_SWIPE_RELEASE_VELOCITY,
	MIN_DRAG_THRESHOLD,
	MIN_RELEASE_VELOCITY_DURATION_MS,
	MIN_SWIPE_RELEASE_DURATION_MS,
	MIN_SWIPE_RELEASE_SCALAR,
	MIN_SWIPE_RELEASE_VELOCITY,
	MIN_VELOCITY_DURATION_MS,
	REVERSE_CANCEL_THRESHOLD,
} from "./constants";
import type { DrawerPlacement } from "./types";
import { findScrollableAncestor, isAtScrollEdgeForDismiss } from "./use-scrollable";

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// f(x) = sign(x) * sqrt(|x|). Ported from Base UI's applyDirectionalDamping.
const damp = (value: number) => (value >= 0 ? Math.sqrt(value) : -Math.sqrt(-value));

// Wrap setPointerCapture/releasePointerCapture. Matches Base UI's safelyChangePointerCapture
// but swallows all DOM errors — synthetic test events can throw InvalidStateError, etc.
function safePointerCapture(
	el: Element,
	pointerId: number,
	method: "setPointerCapture" | "releasePointerCapture",
) {
	const fn = (el as any)[method];
	if (typeof fn !== "function") return;
	try {
		fn.call(el, pointerId);
	} catch {
		/* not all UAs / events accept pointer capture; safe to ignore */
	}
}

export type SwipeThreshold =
	| number
	| ((ctx: { element: HTMLElement; placement: DrawerPlacement; size: number }) => number);

export interface UseDrawerGestureOptions {
	/** Element being dragged. */
	modalRef: React.RefObject<HTMLElement | null>;
	/** Backdrop element (receives `data-swiping`). */
	underlayRef: React.RefObject<HTMLElement | null>;
	/** Master switch. */
	enabled: boolean;
	/** If false, gesture tracks but never dismisses on release. */
	isDismissable: boolean;
	placement: DrawerPlacement;
	/** When true, only pointerdowns starting inside a registered handle/drag-area count. */
	swipeFromHandleOnly: boolean;
	/** Set of elements registered as drag sources by `<DrawerHandle>` / `<DrawerDragArea>`. */
	handleSources: React.RefObject<Set<HTMLElement>>;
	/** Distance threshold (px or function) past which a release dismisses. Default 40. */
	swipeThreshold?: SwipeThreshold;
	/** Selector for descendants where pointerdown should NOT start a drag. Merged with built-ins. */
	ignoreSelector?: string;
	/** Called when release decision is "dismiss". */
	onDismiss: () => void;
	/** Called on every drag frame with normalized progress 0 (rest) → 1 (fully off). */
	onProgress?: (progress: number, isSwiping: boolean) => void;
	/** Fires once per gesture, on the first activated move. */
	onSwipeStart?: (e: PointerEvent) => void;
	/** Fires on every drag frame after activation. `progress` is 0 (rest) → 1 (fully off). */
	onSwipeMove?: (info: { progress: number; movement: number }) => void;
	/** Fires once per gesture on release. */
	onSwipeEnd?: (info: { dismissed: boolean; velocity: number }) => void;
}

interface DragState {
	pointerId: number | null;
	axis: "x" | "y";
	dismissSign: 1 | -1;
	size: number;
	startX: number;
	startY: number;
	startTime: number;
	movement: number;
	/** Furthest directional movement (in dismiss direction) reached during the gesture. */
	maxDirectionalMovement: number;
	// Active = gesture has moved past the scroll-edge gate (or there was no scroll).
	active: boolean;
	// Pending = pointerdown happened inside a scrollable; waiting on first move to decide.
	pendingScrollable: Element | null;
	pendingStartDelta: number;
	// Single-deep ring buffer of the previous frame's resolved movement + time.
	// Release velocity = (current movement - prev movement) / (now - prev time)
	// when the prev sample is recent (≤ MAX_RELEASE_VELOCITY_AGE_MS).
	prevSampleMovement: number;
	prevSampleTime: number;
	// Flag set when the gesture should yield to native behavior (scroll, etc.).
	rejected: boolean;
}

const newDragState = (): DragState => ({
	pointerId: null,
	axis: "y",
	dismissSign: 1,
	size: 0,
	startX: 0,
	startY: 0,
	startTime: 0,
	movement: 0,
	maxDirectionalMovement: 0,
	active: false,
	pendingScrollable: null,
	pendingStartDelta: 0,
	prevSampleMovement: 0,
	prevSampleTime: 0,
	rejected: false,
});

function selectionInsideElement(el: Element | null): boolean {
	if (!el) return false;
	const sel = typeof window !== "undefined" ? window.getSelection() : null;
	if (!sel || sel.isCollapsed || !sel.rangeCount) return false;
	if (sel.toString().length === 0) return false;
	const range = sel.getRangeAt(0);
	return el.contains(range.startContainer) || el.contains(range.endContainer);
}

export function useDrawerGesture(options: UseDrawerGestureOptions) {
	const optionsRef = React.useRef(options);
	optionsRef.current = options;

	const drag = React.useRef<DragState>(newDragState());

	const writeOffset = React.useCallback((movement: number) => {
		const opts = optionsRef.current;
		const modal = opts.modalRef.current;
		if (!modal) return;
		const axis = drag.current.axis;
		const sign = drag.current.dismissSign;
		const directional = sign > 0 ? Math.max(0, movement) : Math.max(0, -movement);
		const progress = Math.min(1, directional / Math.max(1, drag.current.size));

		if (axis === "y") {
			modal.style.translate = `0 ${movement}px`;
			modal.style.setProperty("--drawer-swipe-movement-y", `${movement}px`);
			modal.style.setProperty("--drawer-swipe-movement-x", "0px");
		} else {
			modal.style.translate = `${movement}px 0`;
			modal.style.setProperty("--drawer-swipe-movement-x", `${movement}px`);
			modal.style.setProperty("--drawer-swipe-movement-y", "0px");
		}
		modal.style.setProperty("--drawer-swipe-progress", `${progress}`);
		opts.underlayRef.current?.style.setProperty("--drawer-swipe-progress", `${progress}`);
		// progress for the visual store is "openness": 1 at rest, 0 fully off.
		opts.onProgress?.(1 - progress, true);
		opts.onSwipeMove?.({ progress, movement });
	}, []);

	const finishGesture = React.useCallback((shouldDismiss: boolean) => {
		const opts = optionsRef.current;
		const modal = opts.modalRef.current;
		const underlay = opts.underlayRef.current;
		const state = drag.current;

		const velocity = computeReleaseVelocity(state);
		state.pointerId = null;
		state.active = false;
		state.pendingScrollable = null;
		state.rejected = false;
		state.maxDirectionalMovement = 0;

		if (!modal) {
			opts.onProgress?.(shouldDismiss ? 0 : 1, false);
			opts.onSwipeEnd?.({ dismissed: shouldDismiss, velocity });
			if (shouldDismiss) opts.onDismiss();
			return;
		}

		// Always wipe per-axis movement vars; they're stale after the gesture.
		modal.style.removeProperty("--drawer-swipe-movement-x");
		modal.style.removeProperty("--drawer-swipe-movement-y");
		modal.style.removeProperty("--drawer-swipe-progress");
		underlay?.style.removeProperty("--drawer-swipe-progress");
		delete modal.dataset.swipeDirection;
		delete underlay?.dataset.swipeDirection;
		delete underlay?.dataset.swiping;

		if (shouldDismiss) {
			// Velocity-scaled exit duration (base-ui parity, Sprint 1 release formula).
			// CSS reads `--drawer-swipe-strength` as a transition-duration multiplier.
			const directionalVelocity = state.dismissSign > 0 ? velocity : -velocity;
			const remaining = Math.max(1, state.size - Math.abs(state.movement));
			const strength = computeReleaseStrength(directionalVelocity, remaining);
			modal.style.setProperty("--drawer-swipe-strength", `${strength}`);
			// Hand the visual store a "closed" snapshot so Indent/IndentBackground
			// fade out alongside the drawer.
			opts.onProgress?.(0, false);
			opts.onSwipeEnd?.({ dismissed: true, velocity });
			// Mark the dismissing frame so consumers can style the swipe-out distinctly
			// from the click-outside / escape exit. Cleared by the phase-machine's
			// `data-ending-style` removal at the end of the exit animation.
			modal.dataset.swipeDismiss = "true";
			delete modal.dataset.swiping;
			opts.onDismiss();
			modal.style.translate = "";
			return;
		}

		// Spring back. Removing data-swiping re-enables the class transition,
		// then clearing inline translate animates from the dragged position
		// back to the rest position via the class.
		modal.style.removeProperty("--drawer-swipe-strength");
		delete modal.dataset.swiping;
		opts.onProgress?.(1, false);
		opts.onSwipeEnd?.({ dismissed: false, velocity });
		modal.style.translate = "";
	}, []);

	const handleMove = React.useCallback(
		(ev: PointerEvent) => {
			const state = drag.current;
			if (state.pointerId !== ev.pointerId || state.rejected) return;

			const opts = optionsRef.current;
			const placement = opts.placement;
			const axis = state.axis;
			const sign = state.dismissSign;

			const now = performance.now();
			const cur = axis === "y" ? ev.clientY : ev.clientX;
			const start = axis === "y" ? state.startY : state.startX;
			const rawDelta = cur - start;

			// Pre-activation: gate on scroll edge + axis lock + cross-axis preservation.
			if (!state.active) {
				const perpStart = axis === "y" ? state.startX : state.startY;
				const perpCur = axis === "y" ? ev.clientX : ev.clientY;
				const perpDelta = Math.abs(perpCur - perpStart);

				// Cross-axis preservation: if the user is clearly moving perpendicular
				// to our dismiss axis, yield to native (page scroll, horizontal swipe, etc.)
				// before we start translating the panel.
				if (perpDelta >= CROSS_AXIS_PRESERVE_THRESHOLD && Math.abs(rawDelta) < perpDelta) {
					state.rejected = true;
					return;
				}

				// Scroll-edge gate: if the pointerdown was inside a scrollable, we only
				// activate when the user is at the scroll edge AND moving in the
				// dismiss direction. Resolved on the first significant move.
				if (state.pendingScrollable) {
					const directional = sign > 0 ? rawDelta : -rawDelta;
					if (Math.abs(rawDelta) < 4) return; // wait for clearer intent
					const atEdge = isAtScrollEdgeForDismiss(state.pendingScrollable, axis, sign, rawDelta);
					if (!atEdge || directional <= 0) {
						state.rejected = true;
						return;
					}
					state.pendingStartDelta = rawDelta;
					state.pendingScrollable = null;
				}

				// Activation gate: dismiss axis must move by at least MIN_DRAG_THRESHOLD
				// before we commit (axis lock).
				if (Math.abs(rawDelta - state.pendingStartDelta) < MIN_DRAG_THRESHOLD) return;

				state.active = true;
				const modal = opts.modalRef.current;
				if (modal) {
					modal.dataset.swiping = "true";
					modal.dataset.swipeDirection = placement;
				}
				if (opts.underlayRef.current) {
					opts.underlayRef.current.dataset.swiping = "true";
					opts.underlayRef.current.dataset.swipeDirection = placement;
				}
				opts.onSwipeStart?.(ev);
			}

			ev.preventDefault?.();

			let movement = rawDelta - state.pendingStartDelta;
			// Damp the disallowed direction (sqrt curve, per Base UI).
			if (sign > 0 && movement < 0) movement = damp(movement);
			else if (sign < 0 && movement > 0) movement = damp(movement);

			// Track furthest directional reach for REVERSE_CANCEL_THRESHOLD.
			const directional = sign > 0 ? movement : -movement;
			if (directional > state.maxDirectionalMovement) state.maxDirectionalMovement = directional;

			// Roll the single-deep sample BEFORE writing the new movement.
			// On release we'll compare current movement to the previous sample.
			state.prevSampleMovement = state.movement;
			state.prevSampleTime = now;
			state.movement = movement;

			writeOffset(movement);
		},
		[writeOffset],
	);

	const handleUp = React.useCallback(
		(ev: PointerEvent) => {
			const state = drag.current;
			if (state.pointerId !== ev.pointerId) return;
			detachWindowListeners();

			const opts = optionsRef.current;
			const modal = opts.modalRef.current;
			if (modal && state.pointerId !== null) {
				safePointerCapture(modal, state.pointerId, "releasePointerCapture");
			}

			if (!state.active) {
				// Never started — nothing to clean up beyond state reset.
				state.pointerId = null;
				state.pendingScrollable = null;
				state.rejected = false;
				return;
			}

			const directional = state.dismissSign > 0 ? state.movement : -state.movement;
			const velocity = computeReleaseVelocity(state);
			const directionalVelocity = state.dismissSign > 0 ? velocity : -velocity;

			const threshold = resolveSwipeThreshold(opts, modal, state.size);
			const reverseCancelled =
				state.maxDirectionalMovement - directional >= REVERSE_CANCEL_THRESHOLD;
			const selectionVeto = modal ? selectionInsideElement(modal) : false;

			const shouldDismiss =
				opts.isDismissable &&
				!reverseCancelled &&
				!selectionVeto &&
				(directional > threshold || directionalVelocity > FAST_SWIPE_VELOCITY);

			finishGesture(shouldDismiss);
		},
		[finishGesture],
	);

	const handleCancel = React.useCallback(
		(ev: PointerEvent) => {
			const state = drag.current;
			if (state.pointerId !== ev.pointerId) return;
			detachWindowListeners();
			const opts = optionsRef.current;
			const modal = opts.modalRef.current;
			if (modal && state.pointerId !== null) {
				safePointerCapture(modal, state.pointerId, "releasePointerCapture");
			}
			finishGesture(false);
		},
		[finishGesture],
	);

	const detachWindowListeners = React.useCallback(() => {
		window.removeEventListener("pointermove", handleMove);
		window.removeEventListener("pointerup", handleUp);
		window.removeEventListener("pointercancel", handleCancel);
	}, [handleMove, handleUp, handleCancel]);

	// Native PointerEvent handler. Bound via addEventListener (NOT React's
	// onPointerDown prop) so events on a portaled child drawer don't bubble
	// through the React tree into a parent drawer's gesture. Mirrors Base UI's
	// addEventListener pattern in `useSwipeDismiss.ts`.
	const onPointerDown = React.useCallback(
		(e: PointerEvent) => {
			const opts = optionsRef.current;
			if (!opts.enabled) return;
			// Right-click / middle-click never starts a drag.
			if (e.button !== 0) return;
			const modal = opts.modalRef.current;
			if (!modal) return;
			const target = e.target as HTMLElement | null;
			if (!target) return;
			// Skip interactive controls — letting them receive the pointer normally.
			// Built-in selector + consumer extension. `[data-swipe-ignore]` is the
			// canonical opt-out attribute (per CSS / data-attr contract).
			const ignoreSelector = opts.ignoreSelector
				? `${DEFAULT_IGNORE_SELECTOR}, ${opts.ignoreSelector}`
				: DEFAULT_IGNORE_SELECTOR;
			if (target.closest(ignoreSelector)) return;

			if (opts.swipeFromHandleOnly) {
				let inside = false;
				for (const handle of opts.handleSources.current) {
					if (handle.contains(target)) {
						inside = true;
						break;
					}
				}
				if (!inside) return;
			}

			// Selection veto on start: if the user has live selection inside the
			// drawer, they're probably extending it — clear it so the gesture takes
			// over cleanly. (If they re-select during the drag, release will veto.)
			if (selectionInsideElement(modal)) {
				window.getSelection?.()?.removeAllRanges();
			}

			const placement = opts.placement;
			const axis: "x" | "y" = placement === "left" || placement === "right" ? "x" : "y";
			const dismissSign: 1 | -1 = placement === "bottom" || placement === "right" ? 1 : -1;
			const rect = modal.getBoundingClientRect();
			const size = axis === "y" ? rect.height : rect.width;

			const scrollable = findScrollableAncestor(target, modal, axis);

			const state = drag.current;
			state.pointerId = e.pointerId;
			state.axis = axis;
			state.dismissSign = dismissSign;
			state.size = size;
			state.startX = e.clientX;
			state.startY = e.clientY;
			state.startTime = performance.now();
			state.movement = 0;
			state.maxDirectionalMovement = 0;
			state.active = false;
			state.pendingScrollable = scrollable;
			state.pendingStartDelta = 0;
			state.prevSampleMovement = 0;
			state.prevSampleTime = state.startTime;
			state.rejected = false;

			// Pointer capture for mouse/pen so we keep getting events if the pointer leaves.
			if (e.pointerType !== "touch") {
				safePointerCapture(modal, e.pointerId, "setPointerCapture");
			}

			// Right-click anywhere during gesture cancels.
			const onContextMenu = () => {
				detachWindowListeners();
				window.removeEventListener("contextmenu", onContextMenu);
				finishGesture(false);
			};
			window.addEventListener("contextmenu", onContextMenu, { once: true });

			window.addEventListener("pointermove", handleMove, { passive: false });
			window.addEventListener("pointerup", handleUp);
			window.addEventListener("pointercancel", handleCancel);
		},
		[detachWindowListeners, finishGesture, handleCancel, handleMove, handleUp],
	);

	// Block native window scroll for the lifetime of the pointer interaction so a
	// touch can't be absorbed into a page scroll before our pointer logic decides
	// whether to take over. Mirrors Base UI's document-level capture-phase touchmove
	// preventDefault. We bail out when:
	//  - no pointer is being tracked → user isn't interacting with the drawer
	//  - the gesture was rejected (started in a not-at-edge scrollable, or
	//    crossed the perpendicular threshold) → let native scrolling proceed
	React.useEffect(() => {
		if (!options.enabled) return;
		const onTouchMove = (ev: TouchEvent) => {
			const state = drag.current;
			if (state.pointerId === null) return;
			if (state.rejected) return;
			ev.preventDefault();
		};
		document.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
		return () => {
			document.removeEventListener("touchmove", onTouchMove, { capture: true });
		};
	}, [options.enabled]);

	// Stable callback ref for the consumer's modal element. Manages the native
	// pointerdown listener so we never bind via React's synthetic event system
	// (which would bubble through the React tree into nested-drawer parents).
	const handlerRef = React.useRef(onPointerDown);
	handlerRef.current = onPointerDown;
	const stableHandler = React.useRef((e: PointerEvent) => handlerRef.current(e)).current;
	const attachedRef = React.useRef<HTMLElement | null>(null);
	const attachRef = React.useCallback(
		(el: HTMLElement | null) => {
			if (attachedRef.current && attachedRef.current !== el) {
				attachedRef.current.removeEventListener("pointerdown", stableHandler);
			}
			attachedRef.current = el;
			if (el) el.addEventListener("pointerdown", stableHandler);
		},
		[stableHandler],
	);

	return { attachRef };
}

function computeReleaseVelocity(state: DragState): number {
	// Base UI pattern: prefer release velocity computed from the last frame interval
	// (current movement vs the previous sample) when that sample is fresh enough,
	// else fall back to average velocity over the whole gesture.
	const now = performance.now();
	const ageMs = now - state.prevSampleTime;
	if (state.prevSampleTime > 0 && ageMs <= MAX_RELEASE_VELOCITY_AGE_MS) {
		const sampleDuration = Math.max(ageMs, MIN_RELEASE_VELOCITY_DURATION_MS);
		const recentDelta = state.movement - state.prevSampleMovement;
		return recentDelta / sampleDuration;
	}
	const totalDuration = Math.max(now - state.startTime, MIN_VELOCITY_DURATION_MS);
	return state.movement / totalDuration;
}

/**
 * Sprint 1 release-strength formula (base-ui parity).
 *
 *   v   = clamp(velocity, MIN_VELOCITY, MAX_VELOCITY)
 *   dur = clamp(remaining / v, MIN_DURATION, MAX_DURATION)
 *   norm = (dur - MIN_DURATION) / (MAX_DURATION - MIN_DURATION)
 *   scalar = clamp(MIN_SCALAR + norm*(MAX_SCALAR - MIN_SCALAR), MIN_SCALAR, MAX_SCALAR)
 *
 * `--drawer-swipe-strength` multiplies the CSS transition duration. A strong
 * flick yields a smaller scalar (faster exit); a gentle release approaches 1
 * (full duration).
 */
function computeReleaseStrength(directionalVelocity: number, remaining: number): number {
	if (directionalVelocity <= 0) return MAX_SWIPE_RELEASE_SCALAR;
	const v = clamp(
		directionalVelocity,
		MIN_SWIPE_RELEASE_VELOCITY,
		MAX_SWIPE_RELEASE_VELOCITY,
	);
	const dur = clamp(
		remaining / v,
		MIN_SWIPE_RELEASE_DURATION_MS,
		MAX_SWIPE_RELEASE_DURATION_MS,
	);
	const norm =
		(dur - MIN_SWIPE_RELEASE_DURATION_MS) /
		(MAX_SWIPE_RELEASE_DURATION_MS - MIN_SWIPE_RELEASE_DURATION_MS);
	return clamp(
		MIN_SWIPE_RELEASE_SCALAR + norm * (MAX_SWIPE_RELEASE_SCALAR - MIN_SWIPE_RELEASE_SCALAR),
		MIN_SWIPE_RELEASE_SCALAR,
		MAX_SWIPE_RELEASE_SCALAR,
	);
}

function resolveSwipeThreshold(
	opts: UseDrawerGestureOptions,
	element: HTMLElement | null,
	size: number,
): number {
	if (typeof opts.swipeThreshold === "function") {
		if (!element) return DEFAULT_SWIPE_THRESHOLD;
		return opts.swipeThreshold({ element, placement: opts.placement, size });
	}
	if (typeof opts.swipeThreshold === "number") return opts.swipeThreshold;
	return DEFAULT_SWIPE_THRESHOLD;
}
