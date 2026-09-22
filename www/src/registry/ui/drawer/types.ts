import type * as React from "react"
import type { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"

export type DrawerPlacement = "top" | "bottom" | "left" | "right"

/**
 * A React Aria compatible drawer overlay powered by Base UI's Drawer overlay
 * primitives.
 */
export interface DrawerProps {
  /**
   * The side of the screen where the drawer appears.
   * @default 'bottom'
   */
  placement?: DrawerPlacement
  /** Whether the drawer is open. */
  isOpen?: boolean
  /**
   * Whether the drawer is open by default.
   * @default false
   */
  defaultOpen?: boolean
  /** Handler that is called when the drawer's open state changes. */
  onOpenChange?: (open: boolean) => void
  /**
   * Whether the user can drag the drawer to dismiss it.
   * @default true
   */
  swipeToDismiss?: boolean
  /**
   * Heights the drawer rests at: fractions of the viewport (0–1), pixels, or
   * `px`/`rem` strings. Bottom and top drawers only.
   */
  snapPoints?: DrawerPrimitive.Root.Props["snapPoints"]
  /** The active snap point (controlled). */
  snapPoint?: DrawerPrimitive.Root.Props["snapPoint"]
  /** The snap point the drawer opens at (uncontrolled). */
  defaultSnapPoint?: DrawerPrimitive.Root.Props["defaultSnapPoint"]
  /** Handler that is called when the drawer settles on a snap point. */
  onSnapPointChange?: DrawerPrimitive.Root.Props["onSnapPointChange"]
  /** Whether outside interaction closes the drawer. @default true */
  isDismissable?: boolean
  /** Whether pressing Escape is suppressed. @default false */
  isKeyboardDismissDisabled?: boolean
  className?: DrawerPrimitive.Popup.Props["className"]
  style?: DrawerPrimitive.Popup.Props["style"]

  /** The content of the drawer. */
  children?: React.ReactNode
}

/** A visible drag affordance. */
export interface DrawerHandleProps extends React.ComponentProps<"div"> {}

/** An edge region that can open the drawer by swiping. */
export interface DrawerSwipeAreaProps extends DrawerPrimitive.SwipeArea.Props {}

/** Optional explicit visual-state scope. Most apps don't need this. */
export interface DrawerProviderProps extends DrawerPrimitive.Provider.Props {}

/** Wraps page content; scales/translates while a drawer is open. */
export interface DrawerIndentProps extends DrawerPrimitive.Indent.Props {
  /**
   * How the page moves while a drawer is open: scale back behind a sheet, or
   * slide aside by `--drawer-indent-push` for a side menu. Set that variable
   * where both the page and the drawer (portaled) read it, e.g. `:root`.
   * @default 'scale'
   */
  effect?: "scale" | "push"
}

/** The dark layer behind the indented content. */
export interface DrawerIndentBackgroundProps
  extends DrawerPrimitive.IndentBackground.Props {}
