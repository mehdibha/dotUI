"use client";

import * as React from "react";
import { flushSync } from "react-dom";

import {
	FAST_SWIPE_VELOCITY,
	MAX_RELEASE_STRENGTH,
	MAX_RELEASE_VELOCITY_AGE_MS,
	MIN_RELEASE_STRENGTH,
	MIN_RELEASE_VELOCITY_DURATION_MS,
	MIN_VELOCITY_DURATION_MS,
	SPRING_BACK_MS,
} from "./constants";
import { findScrollableAncestor, isAtScrollEdgeForDismiss } from "./use-scrollable";

type Placement = "top" | "bottom" | "left" | "right";

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

export interface UseSwipeDismissOptions {
	/** Element being dragged. */
	modalRef: React.RefObject<HTMLElement | null>;
	/** Backdrop element (receives `data-swiping`). */
	underlayRef: React.RefObject<HTMLElement | null>;
	/** Master switch. */
	enabled: boolean;
	/** If false, gesture tracks but never dismisses on release. */
	isDismissable: boolean;
	placement: Placement;
	/** When true, only pointerdowns starting inside a registered handle/swipe-area count. */
	swipeFromHandleOnly: boolean;
	/** Set of elements registered as drag sources by `<DrawerHandle>` / `<DrawerSwipeArea>`. */
	handleSources: React.MutableRefObject<Set<HTMLElement>>;
	/** Called when release decision is "dismiss". */
	onDismiss: () => void;
	/** Called on every drag frame with normalized progress 0 (rest) → 1 (fully off). */
	onProgress?: (progress: number, isSwiping: boolean) => void;
	/** Distance threshold (px) past which a release dismisses. */
	thresholdPx?: number;
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
	// Active = gesture has moved past the scroll-edge gate (or there was no scroll).
	active: boolean;
	// Pending = pointerdown happened inside a scrollable; waiting on first move to decide.
	pendingScrollable: Element | null;
	pendingStartDelta: number;
	// Single-deep "ring buffer" for release velocity, like Base UI.
	// Single-deep ring buffer of the previous frame's resolved movement + time.
	// Release velocity = (current movement - prev movement) / (now - prev time)
	// when the prev sample is recent (≤ MAX_RELEASE_VELOCITY_AGE_MS).
	prevSampleMovement: number;
	prevSampleTime: number;
	// Flag set on first non-handle pointerdown if swipeFromHandleOnly excludes it.
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
	active: false,
	pendingScrollable: null,
	pendingStartDelta: 0,
	prevSampleMovement: 0,
	prevSampleTime: 0,
	rejected: false,
});

export function useSwipeDismiss(options: UseSwipeDismissOptions) {
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
	}, []);

	const finishGesture = React.useCallback((shouldDismiss: boolean) => {
		const opts = optionsRef.current;
		const modal = opts.modalRef.current;
		const underlay = opts.underlayRef.current;
		drag.current.pointerId = null;
		drag.current.active = false;
		drag.current.pendingScrollable = null;
		drag.current.rejected = false;

		if (!modal) {
			opts.onProgress?.(shouldDismiss ? 0 : 1, false);
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
			// Velocity-scaled exit duration. CSS reads `--drawer-swipe-strength`
			// (defaults to 1) and multiplies its 500ms transition by it, so a
			// fast flick exits in ~50ms while a gentle release uses the full 500ms.
			const v = computeReleaseVelocity(drag.current);
			const directionalVelocity = drag.current.dismissSign > 0 ? v : -v;
			const remaining = Math.max(1, drag.current.size - Math.abs(drag.current.movement));
			const strength =
				directionalVelocity > 0
					? Math.max(
							MIN_RELEASE_STRENGTH,
							Math.min(MAX_RELEASE_STRENGTH, remaining / (directionalVelocity * SPRING_BACK_MS)),
						)
					: 1;
			modal.style.setProperty("--drawer-swipe-strength", `${strength}`);
			// Hand the visual store a "closed" snapshot so Indent/IndentBackground
			// fade out alongside the drawer.
			opts.onProgress?.(0, false);
			// flushSync the close so RAC commits `data-exiting` synchronously,
			// THEN clear inline translate. The browser interpolates from the
			// drag-position to the class-defined off-screen value (no jump).
			delete modal.dataset.swiping;
			flushSync(() => opts.onDismiss());
			modal.style.translate = "";
			return;
		}

		// Spring back. Removing data-swiping re-enables the class transition,
		// then clearing inline translate animates from the dragged position
		// back to the rest position via the class.
		modal.style.removeProperty("--drawer-swipe-strength");
		delete modal.dataset.swiping;
		opts.onProgress?.(1, false);
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

			// Resolve the pending-scrollable gate on first significant move.
			if (!state.active) {
				if (state.pendingScrollable) {
					const directional = sign > 0 ? rawDelta : -rawDelta;
					if (Math.abs(rawDelta) < 4) return; // wait for clearer intent
					const atEdge = isAtScrollEdgeForDismiss(
						state.pendingScrollable,
						axis,
						sign,
						rawDelta,
					);
					if (!atEdge || directional <= 0) {
						state.rejected = true;
						return;
					}
					state.pendingStartDelta = rawDelta;
					state.pendingScrollable = null;
				}
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
			}

			ev.preventDefault?.();

			let movement = rawDelta - state.pendingStartDelta;
			// Damp the disallowed direction (sqrt curve, per Base UI).
			if (sign > 0 && movement < 0) movement = damp(movement);
			else if (sign < 0 && movement > 0) movement = damp(movement);

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
				return;
			}

			const directional = state.dismissSign > 0 ? state.movement : -state.movement;
			const velocity = computeReleaseVelocity(state);
			const directionalVelocity = state.dismissSign > 0 ? velocity : -velocity;

			const threshold = opts.thresholdPx ?? Math.max(80, state.size * 0.3);
			const shouldDismiss =
				opts.isDismissable &&
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
			// Mirrors Base UI's "no drag from interactive descendants" guard.
			if (
				target.closest(
					"button, a, input, textarea, select, [role='button'], [role='link'], [role='checkbox'], [role='switch'], [role='tab'], [role='menuitem'], [role='option'], [role='radio'], [role='slider'], [contenteditable='true'], [data-drawer-no-drag]",
				)
			)
				return;
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
	//  - the gesture was rejected (started in a not-at-edge scrollable) → let
	//    native scrolling proceed inside the drawer's content
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
