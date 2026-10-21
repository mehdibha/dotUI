"use client"

import * as React from "react"
import { composeRenderProps } from "react-aria-components/composeRenderProps"
import * as SheetPrimitives from "react-aria-components/Sheet"
import { useIsHidden } from "react-aria/private/collections/Hidden"

import { useStyles } from "./styles"

// MARK: sheetStyles

// MARK: Separator

type SwipeAxis = "x" | "y"

const SheetAxisContext = React.createContext<SwipeAxis>("y")

interface SheetProps
  extends
    Omit<SheetPrimitives.SheetOverlayProps, "className" | "style" | "children">,
    Pick<SheetPrimitives.SheetProps, "className" | "style"> {
  children?: React.ReactNode
}

const Sheet = ({ children, className, style, ...props }: SheetProps) => {
  const isHidden = useIsHidden()
  const { overlay, backdrop, sheet, content } = useStyles()()

  if (isHidden) {
    return <>{children}</>
  }

  return (
    <SheetPrimitives.SheetOverlay className={overlay()} {...props}>
      <SheetPrimitives.SheetBackdrop
        swipeAnimation="sheet-backdrop"
        swipeAnimationRange={
          props.snapPoints ? { start: props.snapPoints.length - 1 } : undefined
        }
        className={backdrop()}
      />
      <SheetPrimitives.Sheet
        data-sheet=""
        overscrollPadding
        stackAnimation="sheet-stack"
        className={composeRenderProps(className, (className, { position }) =>
          sheet({ position, className }),
        )}
        style={style}
      >
        {({ position, stackIndex, swipeDirection }) => {
          const axis =
            swipeDirection === "left" ||
            swipeDirection === "right" ||
            swipeDirection === "horizontal"
              ? "x"
              : "y"
          const viewport = axis === "y" ? "100dvh" : "100dvw"
          return (
            <div
              data-sheet-content=""
              className={content({ position })}
              style={{
                viewTimelineName: `--sheet-timeline-${stackIndex}`,
                viewTimelineAxis: axis,
                viewTimelineInset:
                  swipeDirection === "top" || swipeDirection === "left"
                    ? `${viewport} 0`
                    : `0 ${viewport}`,
              }}
            >
              <SheetAxisContext.Provider value={axis}>
                {children}
              </SheetAxisContext.Provider>
            </div>
          )
        }}
      </SheetPrimitives.Sheet>
    </SheetPrimitives.SheetOverlay>
  )
}

// MARK: Separator

interface SheetHandleProps extends React.ComponentProps<"div"> {}

const SheetHandle = ({ className, ...props }: SheetHandleProps) => {
  const { handle } = useStyles()()
  const axis = React.useContext(SheetAxisContext)

  return (
    <div
      aria-hidden="true"
      data-orientation={axis === "y" ? "horizontal" : "vertical"}
      data-sheet-handle=""
      className={handle({ className })}
      {...props}
    />
  )
}

// MARK: Separator

export type { SheetHandleProps, SheetProps }
export { Sheet, SheetHandle }
