'use client'

import * as React from 'react'
import { Drawer as DrawerPrimitive } from '@base-ui/react/drawer'
import { OverlayTriggerStateContext } from 'react-aria-components/Dialog'
import { DismissButton } from 'react-aria/Overlay'
import { useIsHidden } from 'react-aria/private/collections/Hidden'
import { ClearPressResponder } from 'react-aria/private/interactions/PressResponder'
import { useInteractOutside } from 'react-aria/useInteractOutside'
import { useOverlayTriggerState } from 'react-stately'
import { tv } from 'tailwind-variants'
const drawerVariants = tv({
  slots: {
    overlay:
      'fixed inset-0 isolate z-50 [--drawer-bleed:--spacing(40)] [--drawer-inset:0px] [--drawer-peek:24px]',
    backdrop:
      'absolute inset-0 bg-black/70 opacity-[calc(1-var(--drawer-swipe-progress,0))] transition-opacity duration-500 ease-fluid-out data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 data-[swiping]:duration-0',
    viewport: '@container-[size] fixed inset-0 z-10 touch-none',
    popup:
      'relative flex max-h-full min-h-0 w-full min-w-0 flex-col border bg-bg text-fg shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.35)] [transition-property:transform,box-shadow,height,background-color,margin,padding] [transition-duration:calc(500ms*var(--drawer-swipe-strength,1))] [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] will-change-[transform,height] outline-none [--drawer-scale-base:calc(max(0,1-(var(--nested-drawers,0)*0.05)))] [--drawer-scale:clamp(0,calc(var(--drawer-scale-base)+(0.05*var(--drawer-stack-progress))),1)] [--drawer-shrink:calc(1-var(--drawer-scale))] [--drawer-stack-offset:max(0px,calc((var(--nested-drawers,0)-var(--drawer-stack-progress))*var(--drawer-peek)))] [--drawer-stack-progress:clamp(0,var(--drawer-swipe-progress,0),1)] [interpolate-size:allow-keywords] data-[ending-style]:shadow-none data-[nested-drawer-open]:overflow-hidden data-[nested-drawer-swiping]:transition-none data-[starting-style]:shadow-none data-[swiping]:transition-none data-[swiping]:select-none',
    handle:
      'mx-auto my-2 shrink-0 cursor-grab touch-none rounded-full bg-fg/20 select-none active:cursor-grabbing data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-12 data-[orientation=vertical]:h-12 data-[orientation=vertical]:w-1.5',
    swipeArea: 'fixed z-50 touch-none',
    indent:
      'relative z-1 min-h-screen bg-bg transition-[transform,border-radius] duration-500 ease-fluid-out data-[active]:[transform:translate3d(0,calc(8px*(1-var(--drawer-swipe-progress,0))),0)_scale(calc(0.96+0.04*var(--drawer-swipe-progress,0)))] data-[active]:rounded-2xl data-[inactive]:[transform:translate3d(0,0,0)_scale(1)] data-[inactive]:rounded-none',
    indentBackground:
      'pointer-events-none fixed inset-0 z-0 bg-black transition-opacity duration-500 ease-fluid-out data-[active]:opacity-100 data-[inactive]:opacity-0',
  },
  variants: {
    placement: {
      top: {
        viewport: 'grid grid-rows-[auto_1fr] pb-12',
        popup:
          'row-start-1 max-h-[calc(100dvh_-_3rem)] min-h-20 w-full [transform-origin:50%_0] [transform:translateY(var(--drawer-swipe-movement-y,0px))] rounded-b-xl border-t-0 data-[ending-style]:[transform:translateY(-100%)] data-[nested-drawer-open]:[height:var(--drawer-frontmost-height,var(--drawer-height,auto))] data-[nested-drawer-open]:[transform:translateY(calc(var(--drawer-swipe-movement-y,0px)_+_var(--drawer-stack-offset)_+_(var(--drawer-shrink)_*_var(--drawer-frontmost-height,var(--drawer-height,0px)))))_scale(var(--drawer-scale))] data-[starting-style]:[transform:translateY(-100%)]',
        swipeArea: 'inset-x-0 top-0 h-8',
      },
      bottom: {
        viewport: 'grid grid-rows-[1fr_auto] overflow-visible pt-12',
        popup:
          'row-start-2 [margin-bottom:calc(0px_-_var(--drawer-bleed))] max-h-[calc(100dvh_-_3rem_+_var(--drawer-bleed))] min-h-20 w-full [transform-origin:50%_100%] [transform:translateY(var(--drawer-swipe-movement-y,0px))] rounded-t-xl border-b-0 pb-[calc(env(safe-area-inset-bottom,0px)_+_var(--drawer-bleed))] data-[ending-style]:[transform:translateY(100%)] data-[nested-drawer-open]:[height:var(--drawer-frontmost-height,var(--drawer-height,auto))] data-[nested-drawer-open]:[transform:translateY(calc(var(--drawer-swipe-movement-y,0px)_-_var(--drawer-stack-offset)_-_(var(--drawer-shrink)_*_var(--drawer-frontmost-height,var(--drawer-height,0px)))))_scale(var(--drawer-scale))] data-[starting-style]:[transform:translateY(100%)]',
        swipeArea: 'inset-x-0 bottom-0 h-8',
      },
      left: {
        viewport: 'flex justify-start pe-12',
        popup:
          'h-full max-w-[calc(100dvw_-_3rem)] min-w-20 origin-right [transform:translateX(var(--drawer-swipe-movement-x,0px))] rounded-r-xl border-l-0 data-[ending-style]:[transform:translateX(-100%)] data-[nested-drawer-open]:[transform:translateX(calc(var(--drawer-swipe-movement-x,0px)_+_var(--drawer-stack-offset)))_scale(var(--drawer-scale))] data-[starting-style]:[transform:translateX(-100%)]',
        swipeArea: 'inset-y-0 left-0 w-8',
      },
      right: {
        viewport: 'flex justify-end ps-12',
        popup:
          'h-full max-w-[calc(100dvw_-_3rem)] min-w-20 origin-left [transform:translateX(var(--drawer-swipe-movement-x,0px))] rounded-l-xl border-r-0 data-[ending-style]:[transform:translateX(100%)] data-[nested-drawer-open]:[transform:translateX(calc(var(--drawer-swipe-movement-x,0px)_-_var(--drawer-stack-offset)))_scale(var(--drawer-scale))] data-[starting-style]:[transform:translateX(100%)]',
        swipeArea: 'inset-y-0 right-0 w-8',
      },
    },
  },
  defaultVariants: {
    placement: 'bottom',
  },
})

type DrawerPlacement = 'top' | 'bottom' | 'left' | 'right'

const swipeDirectionMap = {
  top: 'up',
  bottom: 'down',
  left: 'left',
  right: 'right',
} satisfies Record<
  DrawerPlacement,
  DrawerPrimitive.Root.Props['swipeDirection']
>

const DrawerPlacementContext = React.createContext<DrawerPlacement>('bottom')

type DrawerPopupRenderProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>
}

function resolveClassName<TState>(
  className: string | ((state: TState) => string | undefined) | undefined,
  state: TState,
) {
  return typeof className === 'function' ? className(state) : className
}

function stripPopupDialogProps(props: DrawerPopupRenderProps) {
  const {
    'aria-describedby': _ariaDescribedBy,
    'aria-labelledby': _ariaLabelledBy,
    role: _role,
    ...presentationProps
  } = props

  return presentationProps
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
  className?: DrawerPrimitive.Popup.Props['className']
  style?: DrawerPrimitive.Popup.Props['style']
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
  placement = 'bottom',
  swipeToDismiss = true,
  style,
}: DrawerProps) {
  const isHidden = useIsHidden()
  const { backdrop, overlay, popup, viewport } = drawerVariants()
  const popupRef = React.useRef<HTMLDivElement>(null)
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

  useInteractOutside({
    ref: popupRef,
    isDisabled: !state.isOpen || !isDismissable,
    onInteractOutside: () => state.close(),
  })

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
            eventDetails.reason === 'escape-key'
          ) {
            eventDetails.cancel()
            return
          }
          if (!nextOpen && !swipeToDismiss && eventDetails.reason === 'swipe') {
            eventDetails.cancel()
            return
          }
          if (nextOpen) state.open()
          else state.close()
        }}
        swipeDirection={swipeDirectionMap[placement]}
      >
        <DrawerPrimitive.Portal>
          <ClearPressResponder>
            <div className={overlay()}>
              <DrawerPrimitive.Backdrop className={backdrop()} />
              <DrawerPrimitive.Viewport className={viewport({ placement })}>
                <DrawerPrimitive.Popup
                  data-base-ui-swipe-ignore={swipeToDismiss ? undefined : ''}
                  initialFocus={() => getInitialFocusTarget(popupRef.current)}
                  className={(state) =>
                    popup({
                      placement,
                      className: resolveClassName(className, state),
                    })
                  }
                  render={(renderProps) => {
                    const presentationProps = stripPopupDialogProps(renderProps)

                    return <div {...presentationProps} />
                  }}
                  ref={popupRef}
                  style={style}
                >
                  <OverlayTriggerStateContext.Provider value={state}>
                    {isDismissable && <DismissButton onDismiss={state.close} />}
                    {children}
                    {isDismissable && <DismissButton onDismiss={state.close} />}
                  </OverlayTriggerStateContext.Provider>
                </DrawerPrimitive.Popup>
              </DrawerPrimitive.Viewport>
            </div>
          </ClearPressResponder>
        </DrawerPrimitive.Portal>
      </DrawerPrimitive.Root>
    </DrawerPlacementContext.Provider>
  )
}

interface DrawerHandleProps extends React.ComponentProps<'div'> {}

function DrawerHandle({ className, ...props }: DrawerHandleProps) {
  const { handle } = drawerVariants()
  const placement = React.useContext(DrawerPlacementContext)
  const orientation =
    placement === 'top' || placement === 'bottom' ? 'horizontal' : 'vertical'

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

interface DrawerSwipeAreaProps extends DrawerPrimitive.SwipeArea.Props {}

function DrawerSwipeArea({ className, ...props }: DrawerSwipeAreaProps) {
  const { swipeArea } = drawerVariants()
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

interface DrawerProviderProps extends DrawerPrimitive.Provider.Props {}

function DrawerProvider(props: DrawerProviderProps) {
  return <DrawerPrimitive.Provider {...props} />
}

interface DrawerIndentProps extends DrawerPrimitive.Indent.Props {}

function DrawerIndent({ className, ...props }: DrawerIndentProps) {
  const { indent } = drawerVariants()
  return (
    <DrawerPrimitive.Indent
      className={(state) =>
        indent({ className: resolveClassName(className, state) })
      }
      {...props}
    />
  )
}

interface DrawerIndentBackgroundProps
  extends DrawerPrimitive.IndentBackground.Props {}

function DrawerIndentBackground({
  className,
  ...props
}: DrawerIndentBackgroundProps) {
  const { indentBackground } = drawerVariants()
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
