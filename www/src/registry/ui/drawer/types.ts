import type * as React from 'react'
import type { Drawer as DrawerPrimitive } from '@base-ui/react/drawer'
import type { StyleRenderProps } from 'react-aria-components'

export type DrawerPlacement = 'top' | 'bottom' | 'left' | 'right'

/**
 * Shared `className`/`style` for Base UI parts: a string/object, or a function
 * that receives the part's state — matching the React Aria render-prop form.
 */
interface BaseUIRenderStyles<State> {
  /** The CSS [className](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) for the element. A function may be provided to compute the class based on component state. */
  className?: StyleRenderProps<State>['className']
  /** The inline [style](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) for the element. A function may be provided to compute the style based on component state. */
  style?: StyleRenderProps<State>['style']
}

/**
 * A React Aria compatible drawer overlay powered by Base UI's Drawer overlay
 * primitives.
 */
export interface DrawerProps extends BaseUIRenderStyles<DrawerPrimitive.Popup.State> {
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
  /** Whether outside interaction closes the drawer. @default true */
  isDismissable?: boolean
  /** Whether pressing Escape is suppressed. @default false */
  isKeyboardDismissDisabled?: boolean

  /** The content of the drawer. */
  children?: React.ReactNode
}

/** A visible drag affordance. */
export interface DrawerHandleProps extends React.ComponentProps<'div'> {}

/** An edge region that can open the drawer by swiping. */
export interface DrawerSwipeAreaProps
  extends
    Omit<DrawerPrimitive.SwipeArea.Props, 'className' | 'style' | 'render'>,
    BaseUIRenderStyles<DrawerPrimitive.SwipeArea.State> {}

/** Optional explicit visual-state scope. Most apps don't need this. */
export interface DrawerProviderProps extends DrawerPrimitive.Provider.Props {
  /** The content scoped to this drawer provider. */
  children?: React.ReactNode
}

/** Wraps page content; scales/translates while a drawer is open. */
export interface DrawerIndentProps
  extends
    Omit<DrawerPrimitive.Indent.Props, 'className' | 'style' | 'render'>,
    BaseUIRenderStyles<DrawerPrimitive.Indent.State> {}

/** The dark layer behind the indented content. */
export interface DrawerIndentBackgroundProps
  extends
    Omit<
      DrawerPrimitive.IndentBackground.Props,
      'className' | 'style' | 'render'
    >,
    BaseUIRenderStyles<DrawerPrimitive.IndentBackground.State> {}
