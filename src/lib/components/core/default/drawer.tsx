"use client";

import React from "react";
import {
  DialogTrigger as AriaDialogTrigger,
  Dialog as AriaDialog,
  Heading as AriaHeading,
  composeRenderProps,
  type DialogProps as AriaDialogProps,
  type DialogTriggerProps as AriaDialogTriggerProps,
  type HeadingProps as AriaHeadingProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { cn } from "@/lib/utils/classes";
import {
  DrawerOverlay as DrawerOverlayBase,
  type DrawerOverlayProps as DrawerOverlayBaseProps,
} from "./overlay";

const drawerVariants = tv({
  slots: {
    overlay: "",
    backdrop: "",
    content: "outline-none rounded-[inherit] p-4",
    title: "text-lg font-semibold",
  },
});

type DrawerRootProps = AriaDialogTriggerProps;
const DrawerRoot = (props: DrawerRootProps) => {
  return <AriaDialogTrigger {...props} />;
};

type DrawerOverlayProps = DrawerOverlayBaseProps;
const DrawerOverlay = (props: DrawerOverlayProps) => {
  return <DrawerOverlayBase {...props} />;
};

type DrawerContentProps = AriaDialogProps;
const DrawerContent = ({ children, className, ...props }: DrawerContentProps) => {
  const { content } = drawerVariants();
  return (
    <AriaDialog {...props} className={content({ className })}>
      {children}
    </AriaDialog>
  );
};

type DrawerTitleProps = AriaHeadingProps;
const DrawerTitle = ({ className, ...props }: DrawerTitleProps) => {
  const { title } = drawerVariants();
  return <AriaHeading {...props} className={title({ className })} />;
};

type DrawerSlots = keyof ReturnType<typeof drawerVariants>;
type DrawerClassNames = {
  [key in DrawerSlots]?: string;
};

type DrawerProps = DrawerContentProps & {
  title?: string;
  classNames?: DrawerClassNames & { overlay?: string };
};
const Drawer = ({ title, classNames, className, ...props }: DrawerProps) => {
  return (
    <DrawerOverlay
      classNames={{ overlay: classNames?.overlay, backdrop: classNames?.backdrop }}
    >
      <DrawerContent {...props} className={cn(classNames?.content, className)}>
        {composeRenderProps(props.children, (children) => (
          <>
            {title && <DrawerTitle>{title}</DrawerTitle>}
            {children}
          </>
        ))}
      </DrawerContent>
    </DrawerOverlay>
  );
};

export type { DrawerRootProps, DrawerProps, DrawerContentProps, DrawerTitleProps };
export { DrawerRoot, Drawer, DrawerContent, DrawerOverlay, DrawerTitle };
