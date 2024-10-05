"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { type VariantProps, tv } from "tailwind-variants";

const scrollAreaStyles = tv({
  slots: {
    root: "flex h-full w-full flex-col overflow-hidden",
    viewport: "flex h-full w-full flex-col [&>*]:!block [&>*]:w-fit [&>*]:grow",
    scrollbar:
      "my-0 flex touch-none select-none flex-col rounded-full bg-gray-800 data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col", // TODO: remove my-0, it was my-1
    thumb:
      "before:-translate-y-1/2] relative h-full w-full rounded-[inherit] bg-gray-500 transition-colors before:absolute before:left-1/2 before:top-1/2 before:min-h-4 before:min-w-4 before:-translate-x-1/2 before:content-[''] hover:bg-gray-400",
  },
  variants: {
    size: {
      sm: {
        scrollbar:
          "data-[orientation=horizontal]:h-1 data-[orientation=vertical]:w-1",
      },
      md: {
        scrollbar:
          "data-[orientation=horizontal]:h-2 data-[orientation=vertical]:w-2",
      },
      lg: {
        scrollbar:
          "data-[orientation=horizontal]:h-3 data-[orientation=vertical]:w-3",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface ScrollAreaProps
  extends ScrollAreaRootProps,
    Omit<ScrollAreaViewPortProps, "dir">,
    VariantProps<typeof scrollAreaStyles> {
  scrollbars?: "vertical" | "horizontal" | "both";
}

const ScrollArea = React.forwardRef<
  HTMLDivElement,
  ScrollAreaProps & { containerClassName?: string }
>(
  (
    {
      children,
      scrollbars = "vertical",
      size,
      asChild,
      type,
      scrollHideDelay = 0,
      dir,
      containerClassName,
      ...viewportProps
    },
    ref
  ) => {
    return (
      <ScrollAreaRoot
        asChild={asChild}
        scrollHideDelay={scrollHideDelay}
        dir={dir}
        type={type}
        className={containerClassName}
      >
        <ScrollAreaViewPort ref={ref} {...viewportProps}>
          {children}
        </ScrollAreaViewPort>
        {scrollbars !== "vertical" && (
          <ScrollAreaScrollbar orientation="horizontal" size={size} />
        )}
        {scrollbars !== "horizontal" && (
          <ScrollAreaScrollbar orientation="vertical" size={size} />
        )}
        {scrollbars === "both" && <ScrollAreaCorner />}
      </ScrollAreaRoot>
    );
  }
);

ScrollArea.displayName = "ScrollArea";

type ScrollAreaRootProps = ScrollAreaPrimitive.ScrollAreaProps;
const ScrollAreaRoot = ({ className, ...props }: ScrollAreaRootProps) => {
  const { root } = scrollAreaStyles();
  return (
    <ScrollAreaPrimitive.Root className={root({ className })} {...props} />
  );
};

type ScrollAreaViewPortProps = ScrollAreaPrimitive.ScrollAreaViewportProps;
const ScrollAreaViewPort = React.forwardRef<
  HTMLDivElement,
  ScrollAreaViewPortProps
>(({ className, ...props }, ref) => {
  const { viewport } = scrollAreaStyles();
  return (
    <ScrollAreaPrimitive.Viewport
      ref={ref}
      className={viewport({ className })}
      {...props}
    />
  );
});
ScrollAreaViewPort.displayName = "ScrollAreaViewPort";

interface ScrollAreaScrollbarProps
  extends ScrollAreaPrimitive.ScrollAreaScrollbarProps,
    VariantProps<typeof scrollAreaStyles> {}
const ScrollAreaScrollbar = ({
  className,
  size,
  ...props
}: ScrollAreaScrollbarProps) => {
  const { scrollbar, thumb } = scrollAreaStyles({ size });
  return (
    <ScrollAreaPrimitive.Scrollbar
      className={scrollbar({ className })}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb className={thumb()} />
    </ScrollAreaPrimitive.Scrollbar>
  );
};

const ScrollAreaCorner = ScrollAreaPrimitive.Corner;

export type {
  ScrollAreaProps,
  ScrollAreaRootProps,
  ScrollAreaViewPortProps,
  ScrollAreaScrollbarProps,
};
export {
  ScrollArea,
  ScrollAreaRoot,
  ScrollAreaViewPort,
  ScrollAreaScrollbar,
  ScrollAreaCorner,
};
