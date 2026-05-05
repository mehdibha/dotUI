import type { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";
import type * as React from "react";

export type DrawerPlacement = "top" | "bottom" | "left" | "right";

/**
 * A React Aria compatible drawer overlay powered by Base UI's Drawer overlay
 * primitives.
 */
export interface DrawerProps
	extends Omit<
		DrawerPrimitive.Root.Props,
		"children" | "defaultOpen" | "disablePointerDismissal" | "onOpenChange" | "open" | "swipeDirection"
	> {
	/**
	 * The side of the screen where the drawer appears.
	 * @default 'bottom'
	 */
	placement?: DrawerPlacement;
	open?: boolean;
	isOpen?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	/**
	 * Whether the user can drag the drawer to dismiss it.
	 * @default true
	 */
	swipeToDismiss?: boolean;
	swipeDirection?: DrawerPrimitive.Root.Props["swipeDirection"];
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
	swipeThreshold?: number;
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
	overlayProps?: DrawerPrimitive.Backdrop.Props;
	portalProps?: DrawerPrimitive.Portal.Props;
	viewportProps?: DrawerPrimitive.Viewport.Props;
	popupProps?: DrawerPrimitive.Popup.Props;

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

/** An edge region that can open the drawer by swiping. */
export interface DrawerSwipeAreaProps extends DrawerPrimitive.SwipeArea.Props {}

/** Optional explicit visual-state scope. Most apps don't need this. */
export interface DrawerProviderProps extends DrawerPrimitive.Provider.Props {}

/** Wraps page content; scales/translates while a drawer is open. */
export interface DrawerIndentProps extends DrawerPrimitive.Indent.Props {}

/** The dark layer behind the indented content. */
export interface DrawerIndentBackgroundProps extends DrawerPrimitive.IndentBackground.Props {}
