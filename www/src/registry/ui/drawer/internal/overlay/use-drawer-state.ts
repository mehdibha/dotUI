"use client";

import * as React from "react";
import { OverlayTriggerStateContext } from "react-aria-components/Dialog";
import { useOverlayTriggerState, type OverlayTriggerState } from "react-stately";

export type DrawerPhase = "closed" | "starting" | "open" | "ending";

interface UseDrawerStateOptions {
	/** Override state. If not provided, reads `OverlayTriggerStateContext` (from RAC `<DialogTrigger>`); falls back to a private state. */
	state?: OverlayTriggerState;
	/** Element whose `transitionend` finishes the `ending` phase. */
	panelRef: React.RefObject<HTMLElement | null>;
	/** Hard cap on the `ending` phase if `transitionend` never fires. */
	exitTimeoutMs?: number;
}

interface DrawerStateValue {
	state: OverlayTriggerState;
	phase: DrawerPhase;
	isMounted: boolean;
}

/**
 * Phase machine on top of an `OverlayTriggerState`.
 *
 *   closed ── state.open()  ─▶ starting ── 2 ticks ─▶ open
 *   open   ── state.close() ─▶ ending   ── transitionend ─▶ closed (unmount)
 *
 * Two ticks (`requestAnimationFrame` with a `setTimeout` fallback for
 * background tabs / throttled environments) commit the off-screen value to
 * the DOM, then flip the data attr so the browser interpolates from there.
 *
 * `flushSync` isn't needed — we own the close path, so the trigger's state
 * flip never beats our exit animation.
 */
export function useDrawerState({
	state: stateProp,
	panelRef,
	exitTimeoutMs = 600,
}: UseDrawerStateOptions): DrawerStateValue {
	const ctxState = React.useContext(OverlayTriggerStateContext);
	const ownState = useOverlayTriggerState({});
	const state = stateProp ?? ctxState ?? ownState;

	const [phase, setPhase] = React.useState<DrawerPhase>(state.isOpen ? "open" : "closed");

	React.useEffect(() => {
		if (state.isOpen) {
			setPhase((p) => (p === "open" ? p : "starting"));
			let cancelled = false;
			const cancellers: Array<() => void> = [];
			const tick = (cb: () => void) => {
				let ran = false;
				const fire = () => {
					if (ran || cancelled) return;
					ran = true;
					cb();
				};
				const raf = requestAnimationFrame(fire);
				const timeout = window.setTimeout(fire, 32);
				cancellers.push(() => {
					cancelAnimationFrame(raf);
					clearTimeout(timeout);
					ran = true;
				});
			};
			tick(() => {
				tick(() => setPhase((p) => (p === "starting" ? "open" : p)));
			});
			return () => {
				cancelled = true;
				for (const c of cancellers) c();
			};
		}

		// Closing path. Skip if already at terminal phases.
		setPhase((p) => (p === "closed" || p === "ending" ? p : "ending"));

		const panel = panelRef.current;
		const finish = () => {
			setPhase((p) => (p === "ending" ? "closed" : p));
		};

		if (panel) {
			const onEnd = (e: TransitionEvent) => {
				if (e.target !== panel) return;
				panel.removeEventListener("transitionend", onEnd);
				finish();
			};
			panel.addEventListener("transitionend", onEnd);
			const timer = window.setTimeout(() => {
				panel.removeEventListener("transitionend", onEnd);
				finish();
			}, exitTimeoutMs);
			return () => {
				panel.removeEventListener("transitionend", onEnd);
				clearTimeout(timer);
			};
		}

		const timer = window.setTimeout(finish, exitTimeoutMs);
		return () => clearTimeout(timer);
	}, [state.isOpen, exitTimeoutMs, panelRef]);

	return {
		state,
		phase,
		isMounted: phase !== "closed",
	};
}
