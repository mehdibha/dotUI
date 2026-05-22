import type * as React from "react";

import type { Drawer as DrawerPrimitive } from "@base-ui/react/drawer";

export type DrawerPlacement = "top" | "bottom" | "left" | "right";

/**
 * A React Aria compatible drawer overlay powered by Base UI's Drawer overlay
 * primitives.
 */
export interface DrawerProps {
	/**
	 * The side of the screen where the drawer appears.
	 * @default 'bottom'
	 */
	placement?: DrawerPlacement;
	isOpen?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	/**
	 * Whether the user can drag the drawer to dismiss it.
	 * @default true
	 */
	swipeToDismiss?: boolean;
	/** Whether outside interaction closes the drawer. @default true */
	isDismissable?: boolean;
	/** Whether pressing Escape is suppressed. @default false */
	isKeyboardDismissDisabled?: boolean;
	className?: DrawerPrimitive.Popup.Props["className"];
	style?: DrawerPrimitive.Popup.Props["style"];

	children?: React.ReactNode;
}

/** A visible drag affordance. */
export interface DrawerHandleProps extends React.ComponentProps<"div"> {}

/** An edge region that can open the drawer by swiping. */
export interface DrawerSwipeAreaProps extends DrawerPrimitive.SwipeArea.Props {}

/** Optional explicit visual-state scope. Most apps don't need this. */
export interface DrawerProviderProps extends DrawerPrimitive.Provider.Props {}

/** Wraps page content; scales/translates while a drawer is open. */
export interface DrawerIndentProps extends DrawerPrimitive.Indent.Props {}

/** The dark layer behind the indented content. */
export interface DrawerIndentBackgroundProps extends DrawerPrimitive.IndentBackground.Props {}
