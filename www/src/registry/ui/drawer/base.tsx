"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "@base-ui/react/drawer"
import { OverlayTriggerStateContext } from "react-aria-components/Dialog"
import { DismissButton } from "react-aria/Overlay"
import { useIsHidden } from "react-aria/private/collections/Hidden"
import { ClearPressResponder } from "react-aria/private/interactions/PressResponder"
import { ariaHideOutside } from "react-aria/private/overlays/ariaHideOutside"
import { useOverlay } from "react-aria/useOverlay"
import { useOverlayTriggerState } from "react-stately"

import { useStyles } from "./styles"

// MARK: drawerStyles

// MARK: Separator

type DrawerPlacement = "top" | "bottom" | "left" | "right"

const swipeDirectionMap = {
  top: "up",
  bottom: "down",
  left: "left",
  right: "right",
} satisfies Record<
  DrawerPlacement,
  DrawerPrimitive.Root.Props["swipeDirection"]
>

const DrawerPlacementContext = React.createContext<DrawerPlacement>("bottom")

type DrawerPopupRenderProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>
}

function resolveClassName<TState>(
  className: string | ((state: TState) => string | undefined) | undefined,
  state: TState,
) {
  return typeof className === "function" ? className(state) : className
}

// The popup is a presentation container: the dialog semantics belong to the
// <Dialog> rendered inside it.
function DrawerPopupElement({
  "aria-describedby": _ariaDescribedBy,
  "aria-labelledby": _ariaLabelledBy,
  role: _role,
  swiping,
  ...props
}: DrawerPopupRenderProps & { swiping: boolean }) {
  // A swipe that starts on a pressable (menu item, button) never cancels the
  // react-aria press: the content moves with the finger, so the pointer stays
  // over the target, and the drawer claims the gesture before the browser
  // would fire pointercancel. Releasing then fires onPress. Base UI arms a
  // swipe on every touchstart, so cancel in-flight presses only once the
  // finger actually drags, the way the platform does when a gesture takes over.
  React.useEffect(() => {
    if (!swiping) return
    let origin: { x: number; y: number } | undefined
    const onMove = (event: PointerEvent | TouchEvent) => {
      const point = "touches" in event ? event.touches[0] : event
      if (!point) return
      origin ??= { x: point.clientX, y: point.clientY }
      if (Math.hypot(point.clientX - origin.x, point.clientY - origin.y) < 8)
        return
      stop()
      document.dispatchEvent(new PointerEvent("pointercancel"))
    }
    const stop = () => {
      document.removeEventListener("pointermove", onMove, true)
      document.removeEventListener("touchmove", onMove, true)
    }
    document.addEventListener("pointermove", onMove, true)
    document.addEventListener("touchmove", onMove, true)
    return stop
  }, [swiping])

  return <div {...props} />
}

function getInitialFocusTarget(popupElement: HTMLDivElement | null) {
  return (
    popupElement?.querySelector<HTMLElement>(
      '[role="dialog"], [role="menu"], [role="listbox"], [role="tree"], [tabindex]',
    ) ?? true
  )
}

interface DrawerProps {
  placement?: DrawerPlacement
  isOpen?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  isDismissable?: boolean
  isKeyboardDismissDisabled?: boolean
  swipeToDismiss?: boolean
  className?: DrawerPrimitive.Popup.Props["className"]
  style?: DrawerPrimitive.Popup.Props["style"]
  children?: React.ReactNode
}

function Drawer({
  children,
  className,
  defaultOpen,
  isDismissable = true,
  isKeyboardDismissDisabled = false,
  isOpen,
  onOpenChange,
  placement = "bottom",
  swipeToDismiss = true,
  style,
}: DrawerProps) {
  const isHidden = useIsHidden()
  const { backdrop, overlay, popup, viewport } = useStyles()()
  const popupRef = React.useRef<HTMLDivElement>(null)
  const [layer, setLayer] = React.useState<HTMLDivElement | null>(null)
  const contextState = React.useContext(OverlayTriggerStateContext)
  const localState = useOverlayTriggerState({
    isOpen,
    defaultOpen,
    onOpenChange,
  })
  const state =
    isOpen !== undefined || defaultOpen !== undefined || !contextState
      ? localState
      : contextState

  // Joins react-aria's overlay stack, so a tap outside dismisses only the
  // topmost layer (a nested drawer, a popover opened inside).
  useOverlay(
    { isOpen: state.isOpen, isDismissable, onClose: state.close },
    popupRef,
  )

  // And its hiding, as its popovers do: opened from a modal, the drawer isn't
  // made inert by it, and makes what's under it inert instead.
  React.useEffect(() => {
    if (state.isOpen && layer)
      return ariaHideOutside([layer], { shouldUseInert: true })
  }, [state.isOpen, layer])

  if (isHidden) {
    return <>{children}</>
  }

  return (
    <DrawerPlacementContext.Provider value={placement}>
      <DrawerPrimitive.Root
        open={state.isOpen}
        disablePointerDismissal
        onOpenChange={(nextOpen, eventDetails) => {
          if (
            !nextOpen &&
            isKeyboardDismissDisabled &&
            eventDetails.reason === "escape-key"
          ) {
            eventDetails.cancel()
            return
          }
          if (!nextOpen && !swipeToDismiss && eventDetails.reason === "swipe") {
            eventDetails.cancel()
            return
          }
          if (nextOpen) state.open()
          else state.close()
        }}
        swipeDirection={swipeDirectionMap[placement]}
      >
        {/* Keyboard-aware focus/scroll handling: publishes --drawer-keyboard-inset
            on the viewport while the software keyboard is open. */}
        <DrawerPrimitive.VirtualKeyboardProvider>
          <DrawerPrimitive.Portal>
            <ClearPressResponder>
              <div ref={setLayer} className={overlay()}>
                <DrawerPrimitive.Backdrop className={backdrop()} />
                <DrawerPrimitive.Viewport className={viewport({ placement })}>
                  <DrawerPrimitive.Popup
                    data-drawer=""
                    data-base-ui-swipe-ignore={swipeToDismiss ? undefined : ""}
                    initialFocus={() => getInitialFocusTarget(popupRef.current)}
                    className={(state) =>
                      popup({
                        placement,
                        className: resolveClassName(className, state),
                      })
                    }
                    render={(renderProps, { swiping }) => (
                      <DrawerPopupElement {...renderProps} swiping={swiping} />
                    )}
                    ref={popupRef}
                    style={style}
                  >
                    <OverlayTriggerStateContext.Provider value={state}>
                      {isDismissable && (
                        <DismissButton onDismiss={state.close} />
                      )}
                      {children}
                      {isDismissable && (
                        <DismissButton onDismiss={state.close} />
                      )}
                    </OverlayTriggerStateContext.Provider>
                  </DrawerPrimitive.Popup>
                </DrawerPrimitive.Viewport>
              </div>
            </ClearPressResponder>
          </DrawerPrimitive.Portal>
        </DrawerPrimitive.VirtualKeyboardProvider>
      </DrawerPrimitive.Root>
    </DrawerPlacementContext.Provider>
  )
}

// MARK: Separator

interface DrawerHandleProps extends React.ComponentProps<"div"> {}

function DrawerHandle({ className, ...props }: DrawerHandleProps) {
  const { handle } = useStyles()()
  const placement = React.useContext(DrawerPlacementContext)
  const orientation =
    placement === "top" || placement === "bottom" ? "horizontal" : "vertical"

  return (
    <div
      role="presentation"
      aria-hidden="true"
      data-orientation={orientation}
      data-placement={placement}
      data-slot="drawer-handle"
      className={handle({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface DrawerSwipeAreaProps extends DrawerPrimitive.SwipeArea.Props {}

function DrawerSwipeArea({ className, ...props }: DrawerSwipeAreaProps) {
  const { swipeArea } = useStyles()()
  const placement = React.useContext(DrawerPlacementContext)

  return (
    <DrawerPrimitive.SwipeArea
      className={(state) =>
        swipeArea({ placement, className: resolveClassName(className, state) })
      }
      data-slot="drawer-swipe-area"
      {...props}
    />
  )
}

// MARK: Separator

interface DrawerProviderProps extends DrawerPrimitive.Provider.Props {}

function DrawerProvider(props: DrawerProviderProps) {
  return <DrawerPrimitive.Provider {...props} />
}

// MARK: Separator

interface DrawerIndentProps extends DrawerPrimitive.Indent.Props {}

function DrawerIndent({ className, ...props }: DrawerIndentProps) {
  const { indent } = useStyles()()
  return (
    <DrawerPrimitive.Indent
      className={(state) =>
        indent({ className: resolveClassName(className, state) })
      }
      {...props}
    />
  )
}

// MARK: Separator

interface DrawerIndentBackgroundProps
  extends DrawerPrimitive.IndentBackground.Props {}

function DrawerIndentBackground({
  className,
  ...props
}: DrawerIndentBackgroundProps) {
  const { indentBackground } = useStyles()()
  return (
    <DrawerPrimitive.IndentBackground
      className={(state) =>
        indentBackground({ className: resolveClassName(className, state) })
      }
      {...props}
    />
  )
}

export type {
  DrawerHandleProps,
  DrawerIndentBackgroundProps,
  DrawerIndentProps,
  DrawerProps,
  DrawerProviderProps,
  DrawerSwipeAreaProps,
}
export {
  Drawer,
  DrawerHandle,
  DrawerIndent,
  DrawerIndentBackground,
  DrawerProvider,
  DrawerSwipeArea,
}
