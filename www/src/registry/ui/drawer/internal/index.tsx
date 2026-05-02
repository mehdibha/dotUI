"use client";

import * as React from "react";
import { OverlayTriggerStateContext } from "react-aria-components/Dialog";
import * as ModalPrimitives from "react-aria-components/Modal";

import {
	DrawerContext,
	DrawerProviderContext,
	useDrawerContext,
	useVisualStateStore,
} from "./context";
import { useSwipeDismiss } from "./use-swipe-dismiss";
import { createVisualStateStore, type VisualStateStore } from "./visual-state-store";

// MARK: drawerPrimitives — unstyled, drawer-aware primitives. Style with `base.tsx`.

type DrawerPlacement = "top" | "bottom" | "left" | "right";

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

interface DrawerProps extends React.ComponentProps<typeof ModalPrimitives.Modal> {
	placement?: DrawerPlacement;
	swipeToDismiss?: boolean;
	swipeFromHandleOnly?: boolean;
	swipeThreshold?: number;
	/** Props forwarded to the underlying `<ModalOverlay>` (for backdrop styling). */
	overlayProps?: Omit<React.ComponentProps<typeof ModalPrimitives.ModalOverlay>, "children">;
}

/**
 * Root drawer primitive. Renders RAC's `ModalOverlay` + `Modal` together,
 * provides `<DrawerContext>`, syncs with the visual store, and binds the
 * pointer gesture for swipe-to-dismiss. Pass `overlayProps` to style the
 * underlay/backdrop and `className`/`style` for the modal panel itself.
 */
function Drawer({
	isDismissable = true,
	className,
	style,
	placement = "bottom",
	swipeToDismiss = true,
	swipeFromHandleOnly = false,
	swipeThreshold,
	children,
	overlayProps,
	...props
}: DrawerProps) {
	const modalRef = React.useRef<HTMLDivElement>(null);
	const underlayRef = React.useRef<HTMLDivElement>(null);
	const overlayState = React.useContext(OverlayTriggerStateContext);
	const store = useVisualStateStore();
	const handleSources = React.useRef(new Set<HTMLElement>());
	const id = React.useId();

	React.useEffect(() => {
		registerCustomProps();
	}, []);

	const registerDragSource = React.useCallback((el: HTMLElement | null) => {
		const set = handleSources.current;
		if (!el) return () => {};
		set.add(el);
		return () => {
			set.delete(el);
		};
	}, []);

	const isOpen = overlayState?.isOpen ?? false;

	// Unregister immediately on close. The parent's un-scale CSS transition is
	// the same 500ms duration as RAC's exit animation, so they run in parallel
	// and finish together (Base UI's behavior).
	React.useEffect(() => {
		if (!isOpen) return;
		return store.registerOpen(id, placement);
	}, [isOpen, placement, store, id]);

	// Set CSS vars + data-attrs consumed by Base UI's nested-drawer pattern:
	//   --nested-drawers              integer count of drawers stacked ABOVE this one
	//   --drawer-frontmost-height     measured height of the topmost (deepest) drawer
	//   data-nested-drawer-open       present when this drawer has any children above
	//   data-nested-drawer-swiping    present while the topmost child is being swiped
	// Direct DOM mutation so high-frequency child swipe updates don't re-render
	// the parent's React subtree.
	React.useEffect(() => {
		if (!isOpen) return;
		const apply = () => {
			const modal = modalRef.current;
			if (!modal) return;
			const s = store.get();
			const myIdx = s.stack.indexOf(id);
			const depthAbove = myIdx >= 0 ? s.stack.length - 1 - myIdx : 0;
			const topmostId = s.stack[s.stack.length - 1];
			// On the initial render, the ResizeObserver hasn't populated heights
			// yet — fall back to a synchronous measure of self when self is the
			// topmost. Avoids a 1-frame flicker where transform briefly translates
			// by self-height (because frontmost-height defaults to 0).
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
	}, [isOpen, store, id]);

	// Measure own height (`--drawer-height`, Base UI's name) and publish to the
	// store via ResizeObserver. Parents read this (as `--drawer-frontmost-height`)
	// to size themselves to the topmost drawer's height while nested.
	React.useEffect(() => {
		if (!isOpen) return;
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
	}, [isOpen, store, id]);

	const onProgress = React.useCallback(
		(progress: number, isSwiping: boolean) => store.setProgress(id, progress, isSwiping),
		[store, id],
	);
	const onDismiss = React.useCallback(() => overlayState?.close(), [overlayState]);

	const { attachRef } = useSwipeDismiss({
		modalRef,
		underlayRef,
		enabled: isOpen && swipeToDismiss,
		isDismissable,
		placement,
		swipeFromHandleOnly,
		handleSources,
		onDismiss,
		onProgress,
		thresholdPx: swipeThreshold,
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

	return (
		<DrawerContext.Provider value={ctxValue}>
			<ModalPrimitives.ModalOverlay
				ref={underlayRef}
				isDismissable={isDismissable}
				data-slot="drawer"
				data-placement={placement}
				{...overlayProps}
			>
				<ModalPrimitives.Modal
					ref={setModalRef}
					data-placement={placement}
					className={className}
					style={style}
					{...props}
				>
					{children}
				</ModalPrimitives.Modal>
			</ModalPrimitives.ModalOverlay>
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
