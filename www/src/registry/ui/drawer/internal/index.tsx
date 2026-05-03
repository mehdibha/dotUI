"use client";

import * as React from "react";

import {
	DrawerContext,
	DrawerProviderContext,
	useDrawerContext,
	useVisualStateStore,
} from "./context";
import { DrawerOverlay } from "./overlay/overlay";
import { useDrawerState } from "./overlay/use-drawer-state";
import type { DrawerPlacement } from "./types";
import { type SwipeThreshold, useDrawerGesture } from "./use-drawer-gesture";
import { createVisualStateStore, type VisualStateStore } from "./visual-state-store";

// MARK: drawerPrimitives — unstyled, drawer-aware primitives. Style with `base.tsx`.

// Register high-frequency CSS vars with inherits:false to cut style-recalc cost.
// Mirrors the perf trick Base UI cites from motion.dev.
let cssPropsRegistered = false;
function registerCustomProps() {
	if (cssPropsRegistered || typeof CSS === "undefined" || !("registerProperty" in CSS)) return;
	cssPropsRegistered = true;
	// `--drawer-swipe-strength` is a transition-duration multiplier — defaults to
	// 1 (full duration); flicks lower it. The other two are 0 → 1 progress vars.
	const reg = (name: string, initialValue: string) => {
		try {
			(CSS as unknown as { registerProperty: (d: object) => void }).registerProperty({
				name,
				syntax: "<number>",
				inherits: false,
				initialValue,
			});
		} catch {}
	};
	reg("--drawer-progress", "0");
	reg("--drawer-swipe-progress", "0");
	reg("--drawer-swipe-strength", "1");
	// Integer count of drawers stacked above this one (0 = topmost).
	reg("--nested-drawers", "0");
	const lengthVars = [
		"--drawer-swipe-movement-x",
		"--drawer-swipe-movement-y",
		// Per Base UI: own height + frontmost (deepest) drawer's height.
		// Used by the variable-height stacking pattern.
		"--drawer-height",
		"--drawer-frontmost-height",
	];
	for (const name of lengthVars) {
		try {
			(CSS as unknown as { registerProperty: (d: object) => void }).registerProperty({
				name,
				syntax: "<length>",
				inherits: false,
				initialValue: "0px",
			});
		} catch {}
	}
}

// MARK: Separator

interface DrawerProps extends Omit<React.ComponentProps<"div">, "children" | "onDrag"> {
	placement?: DrawerPlacement;
	swipeToDismiss?: boolean;
	swipeFromHandleOnly?: boolean;
	swipeThreshold?: SwipeThreshold;
	/** Selector for descendants where pointerdown should NOT start a drag. Merged with built-ins. */
	ignoreSelector?: string;
	isDismissable?: boolean;
	isKeyboardDismissDisabled?: boolean;
	/** Props forwarded to the underlay (backdrop) element. */
	overlayProps?: React.HTMLAttributes<HTMLDivElement>;
	/** Fires once per gesture, on the first activated move. */
	onSwipeStart?: (e: PointerEvent) => void;
	/** Fires on every drag frame after activation. */
	onSwipeMove?: (info: { progress: number; movement: number }) => void;
	/** Fires once per gesture on release. */
	onSwipeEnd?: (info: { dismissed: boolean; velocity: number }) => void;
	children?: React.ReactNode;
}

/**
 * Root drawer primitive. Owns the overlay (no RAC `<Modal>`/`<ModalOverlay>`):
 * portals via react-aria's `<Overlay>`, runs the four-phase animation machine
 * in `useDrawerState`, composes `useModalOverlay` + `useDialog` +
 * `usePreventScroll`, registers in the visual store, and binds the
 * pointer gesture for swipe-to-dismiss.
 *
 * `className`/`style` go on the panel; `overlayProps` style the backdrop.
 */
function Drawer({
	isDismissable = true,
	isKeyboardDismissDisabled,
	className,
	style,
	placement = "bottom",
	swipeToDismiss = true,
	swipeFromHandleOnly = false,
	swipeThreshold,
	ignoreSelector,
	onSwipeStart,
	onSwipeMove,
	onSwipeEnd,
	children,
	overlayProps,
}: DrawerProps) {
	const modalRef = React.useRef<HTMLDivElement>(null);
	const underlayRef = React.useRef<HTMLDivElement>(null);
	const store = useVisualStateStore();
	const handleSources = React.useRef(new Set<HTMLElement>());
	const id = React.useId();

	React.useEffect(() => {
		registerCustomProps();
	}, []);

	const { state, phase, isMounted } = useDrawerState({ panelRef: modalRef });

	const registerDragSource = React.useCallback((el: HTMLElement | null) => {
		const set = handleSources.current;
		if (!el) return () => {};
		set.add(el);
		return () => {
			set.delete(el);
		};
	}, []);

	// Register in the visual store while mounted (covers entering + open + ending
	// phases) so `--drawer-frontmost-height` and `--nested-drawers` don't snap
	// during the exit animation.
	React.useEffect(() => {
		if (!isMounted) return;
		return store.registerOpen(id, placement);
	}, [isMounted, placement, store, id]);

	// Set CSS vars + data-attrs consumed by Base UI's nested-drawer pattern:
	//   --nested-drawers              integer count of drawers stacked ABOVE this one
	//   --drawer-frontmost-height     measured height of the topmost (deepest) drawer
	//   data-nested-drawer-open       present when this drawer has any children above
	//   data-nested-drawer-swiping    present while the topmost child is being swiped
	// Direct DOM mutation so high-frequency child swipe updates don't re-render
	// the parent's React subtree.
	React.useEffect(() => {
		if (!isMounted) return;
		const apply = () => {
			const modal = modalRef.current;
			if (!modal) return;
			const s = store.get();
			const myIdx = s.stack.indexOf(id);
			const depthAbove = myIdx >= 0 ? s.stack.length - 1 - myIdx : 0;
			const topmostId = s.stack[s.stack.length - 1];
			let frontmostHeight = 0;
			if (topmostId) {
				const stored = s.heights[topmostId];
				if (stored !== undefined) frontmostHeight = stored;
				else if (topmostId === id) frontmostHeight = modal.getBoundingClientRect().height;
			}

			if (depthAbove > 0) modal.dataset.nestedDrawerOpen = "true";
			else delete modal.dataset.nestedDrawerOpen;
			if (depthAbove > 0 && s.isSwiping) modal.dataset.nestedDrawerSwiping = "true";
			else delete modal.dataset.nestedDrawerSwiping;
			modal.style.setProperty("--nested-drawers", `${depthAbove}`);
			modal.style.setProperty("--drawer-frontmost-height", `${frontmostHeight}px`);
		};
		apply();
		return store.subscribe(apply);
	}, [isMounted, store, id]);

	// Measure own height (`--drawer-height`) and publish via ResizeObserver.
	React.useEffect(() => {
		if (!isMounted) return;
		const modal = modalRef.current;
		if (!modal) return;
		const update = (h: number) => {
			modal.style.setProperty("--drawer-height", `${h}px`);
			store.setHeight(id, h);
		};
		update(modal.getBoundingClientRect().height);
		const ro = new ResizeObserver((entries) => {
			for (const entry of entries) update(entry.contentRect.height);
		});
		ro.observe(modal);
		return () => ro.disconnect();
	}, [isMounted, store, id]);

	const onProgress = React.useCallback(
		(progress: number, isSwiping: boolean) => store.setProgress(id, progress, isSwiping),
		[store, id],
	);
	const onDismiss = React.useCallback(() => state.close(), [state]);

	const { attachRef } = useDrawerGesture({
		modalRef,
		underlayRef,
		enabled: phase === "open" && swipeToDismiss,
		isDismissable,
		placement,
		swipeFromHandleOnly,
		handleSources,
		swipeThreshold,
		ignoreSelector,
		onDismiss,
		onProgress,
		onSwipeStart,
		onSwipeMove,
		onSwipeEnd,
	});

	// Combined ref: keep modalRef.current in sync AND bind the native pointerdown
	// listener via attachRef. Native listeners don't traverse React portals, so a
	// pointerdown on a child drawer never reaches a parent's gesture.
	// Also set --drawer-height immediately on attach so the transform formula has
	// a real value before any useEffect (apply / ResizeObserver) runs — prevents
	// a 1-frame flicker on the entering animation.
	const setModalRef = React.useCallback(
		(el: HTMLDivElement | null) => {
			modalRef.current = el;
			attachRef(el);
			if (el) {
				const h = el.getBoundingClientRect().height;
				if (h > 0) el.style.setProperty("--drawer-height", `${h}px`);
			}
		},
		[attachRef],
	);

	const ctxValue = React.useMemo(
		() => ({ placement, swipeToDismiss, registerDragSource }),
		[placement, swipeToDismiss, registerDragSource],
	);

	if (!isMounted) return null;

	return (
		<DrawerContext.Provider value={ctxValue}>
			<DrawerOverlay
				state={state}
				phase={phase}
				isDismissable={isDismissable}
				isKeyboardDismissDisabled={isKeyboardDismissDisabled}
				placement={placement}
				panelRef={modalRef}
				setPanelRef={setModalRef}
				underlayRef={underlayRef}
				className={className}
				style={style}
				underlayProps={overlayProps}
			>
				{children}
			</DrawerOverlay>
		</DrawerContext.Provider>
	);
}

// MARK: Separator

interface DrawerHandleProps extends React.ComponentProps<"div"> {}

/** Visible drag affordance. Registers itself as a drag source. */
function DrawerHandle({ children, ...props }: DrawerHandleProps) {
	const { registerDragSource, placement } = useDrawerContext();
	const ref = React.useRef<HTMLDivElement>(null);
	React.useEffect(() => registerDragSource(ref.current), [registerDragSource]);
	const isHorizontal = placement === "top" || placement === "bottom";
	return (
		<div
			ref={ref}
			role="presentation"
			aria-hidden="true"
			data-orientation={isHorizontal ? "horizontal" : "vertical"}
			data-placement={placement}
			{...props}
		>
			{children}
		</div>
	);
}

// MARK: Separator

interface DrawerSwipeAreaProps extends React.ComponentProps<"div"> {}

/** Invisible drag region for opting in custom areas under `swipeFromHandleOnly`. */
function DrawerSwipeArea({ children, ...props }: DrawerSwipeAreaProps) {
	const { registerDragSource } = useDrawerContext();
	const ref = React.useRef<HTMLDivElement>(null);
	React.useEffect(() => registerDragSource(ref.current), [registerDragSource]);
	return (
		<div ref={ref} {...props}>
			{children}
		</div>
	);
}

// MARK: Separator

interface DrawerProviderProps {
	children?: React.ReactNode;
}

/** Optional explicit visual-state scope. Most apps don't need this. */
function DrawerProvider({ children }: DrawerProviderProps) {
	const [store] = React.useState<VisualStateStore>(() => createVisualStateStore());
	return <DrawerProviderContext.Provider value={store}>{children}</DrawerProviderContext.Provider>;
}

// MARK: Separator

interface DrawerIndentProps extends React.ComponentProps<"div"> {}

/**
 * Wraps page content. While a drawer is open or being swiped, this element gets
 * `--drawer-progress` (0 → 1) and `data-swiping` written via direct DOM mutation
 * so user CSS can scale/translate the page in lockstep with the gesture.
 */
function DrawerIndent({ children, ...props }: DrawerIndentProps) {
	const store = useVisualStateStore();
	const ref = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		const apply = () => {
			const el = ref.current;
			if (!el) return;
			const s = store.get();
			el.style.setProperty("--drawer-progress", `${s.progress}`);
			if (s.isSwiping) el.dataset.swiping = "true";
			else delete el.dataset.swiping;
			if (s.placement) el.dataset.placement = s.placement;
			else delete el.dataset.placement;
		};
		apply();
		return store.subscribe(apply);
	}, [store]);

	return (
		<div ref={ref} {...props}>
			{children}
		</div>
	);
}

// MARK: Separator

interface DrawerIndentBackgroundProps extends React.ComponentProps<"div"> {}

/** The dark layer behind the indented page. Render once at the app root. */
function DrawerIndentBackground(props: DrawerIndentBackgroundProps) {
	const store = useVisualStateStore();
	const ref = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		const apply = () => {
			const el = ref.current;
			if (!el) return;
			const s = store.get();
			el.style.setProperty("--drawer-progress", `${s.progress}`);
			if (s.isSwiping) el.dataset.swiping = "true";
			else delete el.dataset.swiping;
		};
		apply();
		return store.subscribe(apply);
	}, [store]);

	return <div ref={ref} aria-hidden="true" {...props} />;
}

export type {
	DrawerHandleProps,
	DrawerIndentBackgroundProps,
	DrawerIndentProps,
	DrawerProps,
	DrawerProviderProps,
	DrawerSwipeAreaProps,
};
export { Drawer, DrawerHandle, DrawerIndent, DrawerIndentBackground, DrawerProvider, DrawerSwipeArea };
