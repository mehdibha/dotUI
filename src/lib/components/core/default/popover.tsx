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
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { cn } from "@/lib/utils/classes";
import { Overlay, type OverlayProps } from "./overlay";

const popoverVariants = tv({
  slots: {
    popover: "p-4 outline-none max-w-72",
    title: "text-lg font-semibold",
    arrow: "",
    overlay: "",
    backdrop: "", // for mobile view only
  },
});

interface PopoverRootProps extends AriaDialogTriggerProps {
  mobileType?: "drawer" | "modal" | "popover";
  mediaQuery?: string;
}
const PopoverRoot = ({
  mobileType = "modal",
  mediaQuery = "(max-width: 768px)",
  ...props
}: PopoverRootProps) => {
  const isMobile = useMediaQuery(mediaQuery);
  return (
    <PopoverContext.Provider value={{ isMobile, mobileType }}>
      <AriaDialogTrigger {...props} />
    </PopoverContext.Provider>
  );
};

type PopoverOverlayProps = OverlayProps;
const PopoverOverlay = (props: PopoverOverlayProps) => {
  const { isMobile, mobileType } = usePopoverContext();
  return (
    <Overlay
      data-mobile={isMobile ? "true" : undefined}
      type={isMobile ? mobileType : "popover"}
      {...props}
    />
  );
};

type PopoverContentProps = AriaDialogProps;
const PopoverContent = ({ children, className, ...props }: PopoverContentProps) => {
  const { popover } = popoverVariants();
  return (
    <AriaDialog {...props} className={popover({ className })}>
      {children}
    </AriaDialog>
  );
};

type PopoverTitleProps = AriaHeadingProps;
const PopoverTitle = ({ className, ...props }: PopoverTitleProps) => {
  const { title } = popoverVariants();
  return <AriaHeading {...props} className={title({ className })} />;
};

type PopoverSlots = keyof ReturnType<typeof popoverVariants>;
type PopoverClassNames = {
  [key in PopoverSlots]?: string;
};

type PopoverProps = PopoverContentProps & {
  title?: string;
  classNames?: PopoverClassNames & { overlay?: string };
};
const Popover = ({ title, classNames, className, ...props }: PopoverProps) => {
  return (
    <PopoverOverlay
      classNames={{ overlay: classNames?.overlay, backdrop: classNames?.backdrop }}
    >
      <PopoverContent {...props} className={cn(classNames?.popover, className)}>
        {composeRenderProps(props.children, (children) => (
          <>
            {title && <PopoverTitle>{title}</PopoverTitle>}
            {children}
          </>
        ))}
      </PopoverContent>
    </PopoverOverlay>
  );
};

type PopoverContextProps = {
  isMobile: boolean;
  mobileType?: "drawer" | "modal" | "popover";
  arrow?: boolean;
};
const PopoverContext = React.createContext<PopoverContextProps | null>(null);
const usePopoverContext = () => {
  const context = React.useContext(PopoverContext);
  if (!context) {
    throw new Error("useDilaogContext must be used within a <MenuRoot />");
  }
  return context;
};

export type { PopoverRootProps, PopoverProps, PopoverContentProps, PopoverTitleProps };
export { PopoverRoot, Popover, PopoverContent, PopoverOverlay, PopoverTitle };
