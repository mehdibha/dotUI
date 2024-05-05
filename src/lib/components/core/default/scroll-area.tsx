"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { tv } from "tailwind-variants";
import { cn } from "@/lib/utils/classes";

const scrollAreaVariants = tv({
  slots: {
    root: "flex flex-col h-full w-full overflow-hidden",
    viewport: "h-full w-full flex flex-col [&>*]:!block [&>*]:w-fit [&>*]:grow",
    scrollbar:
      "flex touch-none select-none flex-col data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col bg-gray-800 rounded-full m-1",
    thumb:
      "relative before:absolute before:content-[''] before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2] w-full h-full before:min-w-4 before:min-h-4 bg-gray-500 hover:bg-gray-400 transition-colors rounded-[inherit]",
  },
  variants: {
    size: {
      sm: {
        scrollbar: "data-[orientation=horizontal]:h-1 data-[orientation=vertical]:w-1",
      },
      md: {
        scrollbar: "data-[orientation=horizontal]:h-2 data-[orientation=vertical]:w-2",
      },
      lg: {
        scrollbar: "data-[orientation=horizontal]:h-3 data-[orientation=vertical]:w-3",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface ScrollAreaProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>,
      "asChild"
    >,
    Omit<React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Viewport>, "dir"> {
  orientation?: "vertical" | "horizontal" | "both";
  size?: "sm" | "md" | "lg";
}

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Viewport>,
  ScrollAreaProps
>(
  (
    {
      className,
      children,
      type,
      scrollHideDelay,
      style,
      asChild,
      orientation = "vertical",
      size,
      ...viewportProps
    },
    ref
  ) => {
    const { root, viewport, scrollbar, thumb } = scrollAreaVariants({
      size,
    });
    return (
      <ScrollAreaPrimitive.Root
        type={type}
        scrollHideDelay={scrollHideDelay}
        className={root()}
        style={style}
        asChild={asChild}
      >
        <>
          <ScrollAreaPrimitive.Viewport
            {...viewportProps}
            ref={ref}
            className={viewport({ className })}
          >
            {children}
          </ScrollAreaPrimitive.Viewport>
          {orientation !== "vertical" ? (
            <ScrollAreaPrimitive.Scrollbar
              orientation="horizontal"
              className={scrollbar()}
            >
              <ScrollAreaPrimitive.Thumb className={thumb()} />
            </ScrollAreaPrimitive.Scrollbar>
          ) : null}
          {orientation !== "horizontal" ? (
            <ScrollAreaPrimitive.Scrollbar orientation="vertical" className={scrollbar()}>
              <ScrollAreaPrimitive.Thumb className={thumb()} />
            </ScrollAreaPrimitive.Scrollbar>
          ) : null}
          {orientation === "both" ? <ScrollAreaPrimitive.Corner /> : null}
        </>
      </ScrollAreaPrimitive.Root>
    );
  }
);
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

export { ScrollArea };
