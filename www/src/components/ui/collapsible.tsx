"use client";

import React from "react";
import { cn } from "@/registry/lib/utils";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

const CollapsibleRoot = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.CollapsibleContent>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent>
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.CollapsibleContent
    ref={ref}
    className={cn(
      "data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden duration-75",
      className,
    )}
    {...props}
  />
));

CollapsibleContent.displayName = "CollapsibleContent";

export {
  CollapsibleRoot,
  CollapsibleRoot as Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
};
