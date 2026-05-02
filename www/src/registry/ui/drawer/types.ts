import type * as ModalPrimitives from "react-aria-components/Modal";

/**
 * A drawer overlay built on react-aria-components' Modal, with drag-to-dismiss
 * gesture ported from Base UI's `<Drawer>` (velocity-aware release, sqrt
 * rubber-banding, pointer capture, scroll-edge detection).
 */
export interface DrawerProps extends React.ComponentProps<typeof ModalPrimitives.Modal> {
	/**
	 * The side of the screen where the drawer appears.
	 * @default 'bottom'
	 */
	placement?: "top" | "bottom" | "left" | "right";
	/**
	 * Whether the user can drag the drawer to dismiss it.
	 * @default true
	 */
	swipeToDismiss?: boolean;
	/**
	 * If true, only `<DrawerHandle>` / `<DrawerSwipeArea>` initiate a drag.
	 * Otherwise pointerdown anywhere on the drawer (except interactive elements
	 * and any `[data-drawer-no-drag]` subtree) starts a drag.
	 * @default false
	 */
	swipeFromHandleOnly?: boolean;
	/**
	 * Distance in pixels past which a release dismisses, regardless of velocity.
	 * Default is `max(80, drawer-size * 0.3)`.
	 */
	swipeThreshold?: number;
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
