import type * as React from "react";

import type { DrawerPlacement } from "./internal/types";
import type { SwipeThreshold } from "./internal/use-drawer-gesture";

/**
 * A drawer overlay built on react-aria hooks, with drag-to-dismiss gesture
 * ported from Base UI's `<Drawer>` (velocity-aware release, sqrt
 * rubber-banding, pointer capture, scroll-edge detection, axis lock,
 * cross-axis scroll preservation, reverse-cancel, selection veto).
 */
export interface DrawerProps extends Omit<React.ComponentProps<"div">, "children" | "onDrag"> {
	/**
	 * The side of the screen where the drawer appears.
	 * @default 'bottom'
	 */
	placement?: DrawerPlacement;
	/**
	 * Whether the user can drag the drawer to dismiss it.
	 * @default true
	 */
	swipeToDismiss?: boolean;
	/**
	 * If true, only `<DrawerHandle>` / `<DrawerDragArea>` initiate a drag.
	 * Otherwise pointerdown anywhere on the drawer (except interactive elements
	 * and any `[data-swipe-ignore]` subtree) starts a drag.
	 * @default false
	 */
	swipeFromHandleOnly?: boolean;
	/**
	 * Distance threshold (px) past which a release dismisses, regardless of
	 * velocity. Accepts a function form for size-aware thresholds.
	 * @default 40
	 */
	swipeThreshold?: SwipeThreshold;
	/**
	 * Selector for descendants where pointerdown should NOT start a drag.
	 * Merged with the built-in interactive-elements selector. Use this to
	 * extend; use `[data-swipe-ignore]` on individual elements as the
	 * canonical opt-out.
	 */
	ignoreSelector?: string;
	/** Whether outside-press / Escape close the drawer. @default true */
	isDismissable?: boolean;
	/** Whether pressing Escape is suppressed. @default false */
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

/** A visible drag affordance. Registers itself as a drag source. */
export interface DrawerHandleProps extends React.ComponentProps<"div"> {}

/** Invisible drag region for opting in custom areas under `swipeFromHandleOnly`. */
export interface DrawerSwipeAreaProps extends React.ComponentProps<"div"> {}

/** Optional explicit visual-state scope. Most apps don't need this. */
export interface DrawerProviderProps {
	children?: React.ReactNode;
}

/** Wraps page content; scales/translates while a drawer is open. */
export interface DrawerIndentProps extends React.ComponentProps<"div"> {}

/** The dark layer behind the indented content. */
export interface DrawerIndentBackgroundProps extends React.ComponentProps<"div"> {}
