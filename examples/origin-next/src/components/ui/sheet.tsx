"use client";

import * as React from "react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as SheetPrimitives from "react-aria-components/Sheet";
import { useIsHidden } from "react-aria/private/collections/Hidden";
import { tv } from "tailwind-variants";

const sheetVariants = tv({
  slots: {
    overlay:
      "isolate z-50 **:data-sheet-scroll:[overflow-anchor:none] supports-[-webkit-touch-callout:none]:min-h-[calc(100dvh+100lvh-100svh+58px)] exiting:pointer-events-none",
    backdrop:
      "data-[stack-index=0]:bg-scrim data-[stack-index=0]:backdrop-blur-sm",
    sheet:
      "relative box-content flex min-h-0 min-w-0 flex-col text-fg outline-none [--surface-bg:var(--color-popover)] overflow-clip border border-(--overlay-border) bg-popover shadow-(--shadow-modal,0_-8px_24px_-12px_rgba(0,0,0,0.35))",
    content:
      "flex min-h-0 flex-1 flex-col overflow-hidden overscroll-auto pb-(--sheet-scroll-padding-y) outline-none in-data-expanded:overflow-y-auto [:where(&_*)]:overscroll-auto",
    handle:
      "mx-auto my-2 shrink-0 rounded-full bg-fg/20 orientation-horizontal:h-1.5 orientation-horizontal:w-12 orientation-vertical:h-12 orientation-vertical:w-1.5",
  },
  variants: {
    position: {
      top: {
        sheet:
          "max-h-[calc(100dvh-3rem)] w-full origin-bottom rounded-b-xl border-t-0 [--sheet-stack-offset:0_1rem]",
        content: "pt-[env(safe-area-inset-top,0px)]",
      },
      bottom: {
        sheet:
          "max-h-[calc(100dvh-3rem)] w-full origin-top rounded-t-xl border-b-0 [--sheet-stack-offset:0_-1rem]",
        content:
          "pb-[calc(env(safe-area-inset-bottom,0px)+var(--sheet-scroll-padding-y))]",
      },
      left: {
        sheet:
          "h-full w-3/4 origin-right rounded-r-xl border-l-0 [--sheet-stack-offset:-1rem_0] sm:max-w-sm",
        content:
          "pb-[calc(env(safe-area-inset-bottom,0px)+var(--sheet-scroll-padding-y))]",
      },
      right: {
        sheet:
          "h-full w-3/4 origin-left rounded-l-xl border-r-0 [--sheet-stack-offset:1rem_0] sm:max-w-sm",
        content:
          "pb-[calc(env(safe-area-inset-bottom,0px)+var(--sheet-scroll-padding-y))]",
      },
      center: {
        sheet:
          "max-h-[calc(100dvh-3rem)] w-[calc(100%-2rem)] max-w-lg rounded-xl [--sheet-stack-offset:0_-1rem]",
      },
    },
  },
  defaultVariants: {
    position: "bottom",
  },
});

const { overlay, backdrop, sheet, content, handle } = sheetVariants();

/* -------------------------------------------------------------------------- */

type SwipeAxis = "x" | "y";

const SheetAxisContext = React.createContext<SwipeAxis>("y");

interface SheetProps
  extends
    Omit<SheetPrimitives.SheetOverlayProps, "className" | "style" | "children">,
    Pick<SheetPrimitives.SheetProps, "className" | "style"> {
  children?: React.ReactNode;
}

const Sheet = ({ children, className, style, ...props }: SheetProps) => {
  const isHidden = useIsHidden();
  if (isHidden) {
    return <>{children}</>;
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
              : "y";
          const viewport = axis === "y" ? "100dvh" : "100dvw";
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
          );
        }}
      </SheetPrimitives.Sheet>
    </SheetPrimitives.SheetOverlay>
  );
};

/* -------------------------------------------------------------------------- */

interface SheetHandleProps extends React.ComponentProps<"div"> {}

const SheetHandle = ({ className, ...props }: SheetHandleProps) => {
  const axis = React.useContext(SheetAxisContext);

  return (
    <div
      aria-hidden="true"
      data-orientation={axis === "y" ? "horizontal" : "vertical"}
      data-sheet-handle=""
      className={handle({ className })}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

export type { SheetHandleProps, SheetProps };
export { Sheet, SheetHandle };
