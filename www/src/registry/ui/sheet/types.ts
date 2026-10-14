import type * as React from "react"
import type * as SheetPrimitives from "react-aria-components/Sheet"

/**
 * A sheet is a swipeable overlay that slides in from an edge of the viewport.
 */
export interface SheetProps
  extends
    Omit<SheetPrimitives.SheetOverlayProps, "className" | "style" | "children">,
    Pick<SheetPrimitives.SheetProps, "className" | "style"> {
  /** The content of the sheet: a dialog, a menu, a listbox… */
  children?: React.ReactNode
}

/** A visible swipe affordance. */
export interface SheetHandleProps extends React.ComponentProps<"div"> {}
