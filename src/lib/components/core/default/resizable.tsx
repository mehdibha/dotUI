"use client";

import React from "react";
import * as ResizablePrimitive from "react-resizable-panels";
import type {
  ImperativePanelHandle,
  ImperativePanelGroupHandle,
} from "react-resizable-panels";
import { cn } from "@/lib/utils/classes";

const ResizableGroup = React.forwardRef<
  React.ElementRef<typeof ResizablePrimitive.PanelGroup>,
  React.ComponentPropsWithoutRef<typeof ResizablePrimitive.PanelGroup>
>(({ className, ...props }, ref) => (
  <ResizablePrimitive.PanelGroup
    ref={ref}
    className={cn(
      "flex h-full w-full flex-row overflow-hidden data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  />
));
ResizableGroup.displayName = "ResizableGroup";

const ResizablePanel = ResizablePrimitive.Panel;

const ResizableHandle = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean;
}) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      "relative flex flex-[0_0_1px] items-stretch justify-stretch bg-border transition-colors data-[resize-handle-state=drag]:bg-border-active",
      className
    )}
    {...props}
  />
);

export {
  ResizableGroup,
  ResizablePanel,
  ResizableHandle,
  ImperativePanelHandle,
  ImperativePanelGroupHandle as ImperativeGroupHandle,
};
