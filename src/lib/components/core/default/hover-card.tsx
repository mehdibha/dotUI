"use client";

import * as React from "react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import { cn } from "@/lib/utils/classes";

const HoverCardRoot = HoverCardPrimitive.Root;

const HoverCardTrigger = HoverCardPrimitive.Trigger;

const HoverCardPortal = HoverCardPrimitive.Portal;

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName;

interface HoverCardProps
  extends React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Portal>,
    Omit<
      React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>,
      "asChild" | "content"
    > {
  content: React.ReactNode;
}

const HoverCard = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  HoverCardProps
>(
  (
    {
      content,
      children,
      defaultOpen,
      open,
      onOpenChange,
      openDelay,
      closeDelay,
      forceMount,
      container,
      ...hoverCardContentProps
    },
    ref
  ) => (
    <HoverCardRoot
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      openDelay={openDelay}
      closeDelay={closeDelay}
    >
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardPortal forceMount={forceMount} container={container}>
        <HoverCardContent ref={ref} {...hoverCardContentProps}>
          {content}
        </HoverCardContent>
      </HoverCardPortal>
    </HoverCardRoot>
  )
);
HoverCard.displayName = "HoverCard";

export {
  HoverCard,
  HoverCardRoot,
  HoverCardTrigger,
  HoverCardPortal,
  HoverCardContent,
};
