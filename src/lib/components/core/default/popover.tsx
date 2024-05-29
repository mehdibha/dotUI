"use client";

import * as React from "react";
import { useSlotId } from "@react-aria/utils";
import {
  composeRenderProps,
  DialogContext as AriaDialogContext,
  DialogTrigger as AriaDialogTrigger,
  Dialog as AriaDialog,
  Heading as AriaHeading,
  Text as AriaText,
  type DialogProps as AriaDialogProps,
  type DialogTriggerProps as AriaDialogTriggerProps,
  type HeadingProps as AriaHeadingProps,
  type TextProps as AriaTextProps,
  TextContext,
} from "react-aria-components";
import { Provider } from "react-aria-components";
import { tv } from "tailwind-variants";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { Overlay, type OverlayProps } from "./overlay";

const popoverStyles = tv({
  slots: {
    overlay: "",
    backdrop: "",
    content: "outline-none rounded-[inherit] p-2 sm:p-4",
    header: "mb-4",
    title: "text-lg font-semibold",
    description: "text-sm text-fg-muted",
    body: "space-y-4",
    footer: "flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4",
    inset: "-mx-3 sm:-mx-6",
  },
});

interface PopoverRootProps extends Omit<AriaDialogTriggerProps, "children"> {
  children: React.ReactNode | (({ isMobile }: { isMobile: boolean }) => React.ReactNode);
  mobileType?: "drawer" | "modal";
  mediaQuery?: string;
}
const PopoverRoot = ({
  children,
  mobileType = "drawer",
  mediaQuery = "(max-width: 768px)",
  ...props
}: PopoverRootProps) => {
  const descriptionId = useSlotId();
  const isMobile = useMediaQuery(mediaQuery);
  return (
    <Provider
      values={[
        [PopoverContext, { isMobile, mobileType }],
        [AriaDialogContext, { "aria-describedby": descriptionId }],
        [TextContext, { slots: { description: { id: descriptionId } } }],
      ]}
    >
      <AriaDialogTrigger {...props}>
        {typeof children === "function" ? children({ isMobile }) : children}
      </AriaDialogTrigger>
    </Provider>
  );
};

interface PopoverProps extends PopoverContentProps {
  title?: string;
  description?: string;
}
const Popover = ({ title, description, ...props }: PopoverProps) => {
  return (
    <PopoverOverlay>
      <PopoverContent {...props}>
        {composeRenderProps(props.children, (children) => (
          <>
            {(title || description) && (
              <PopoverHeader>
                {title && <PopoverTitle>{title}</PopoverTitle>}
                {description && <PopoverDescription>{description}</PopoverDescription>}
              </PopoverHeader>
            )}
            {children}
          </>
        ))}
      </PopoverContent>
    </PopoverOverlay>
  );
};

const PopoverOverlay = (props: OverlayProps) => {
  const { isMobile, mobileType } = usePopoverContext();
  const { overlay, backdrop } = popoverStyles();
  return (
    <Overlay
      isDismissable
      type={isMobile ? mobileType : "popover"}
      classNames={{ overlay: overlay(), backdrop: backdrop() }}
      {...props}
    />
  );
};

type PopoverContentProps = AriaDialogProps;
const PopoverContent = ({ children, className, ...props }: PopoverContentProps) => {
  const { content } = popoverStyles();
  return (
    <AriaDialog className={content({ className })} {...props}>
      {children}
    </AriaDialog>
  );
};

type PopoverHeaderProps = React.ComponentProps<"header">;
const PopoverHeader = ({ children, className, ...props }: PopoverHeaderProps) => {
  const { header } = popoverStyles();
  return (
    <header className={header({ className })} {...props}>
      {children}
    </header>
  );
};

type PopoverTitleProps = AriaHeadingProps;
const PopoverTitle = ({ className, ...props }: PopoverTitleProps) => {
  const { title } = popoverStyles();
  return <AriaHeading slot="title" className={title({ className })} {...props} />;
};

type PopoverDescriptionProps = AriaTextProps;
const PopoverDescription = ({ className, ...props }: PopoverDescriptionProps) => {
  const { description } = popoverStyles();
  return (
    <AriaText slot="description" className={description({ className })} {...props} />
  );
};

type PopoverBody = React.ComponentProps<"div">;
const PopoverBody = ({ className, ...props }: PopoverDescriptionProps) => {
  const { body } = popoverStyles();
  return <div className={body({ className })} {...props} />;
};

type PopoverFooterProps = React.ComponentProps<"footer">;
const PopoverFooter = ({ className, ...props }: PopoverFooterProps) => {
  const { footer } = popoverStyles();
  return <footer slot="description" className={footer({ className })} {...props} />;
};

type PopoverInsetProps = React.ComponentProps<"div">;
const PopoverInset = ({ className, ...props }: PopoverInsetProps) => {
  const { inset } = popoverStyles();
  return <div className={inset({ className })} {...props} />;
};

const PopoverContext = React.createContext<{
  isMobile: boolean;
  mobileType: "drawer" | "modal";
} | null>(null);

function usePopoverContext() {
  const context = React.useContext(PopoverContext);
  if (!context) {
    throw new Error("usePopoverContext must be used within a <MenuRoot />");
  }
  return context;
}

export type {
  PopoverRootProps,
  PopoverProps,
  PopoverContentProps,
  PopoverHeaderProps,
  PopoverTitleProps,
  PopoverDescriptionProps,
  PopoverFooterProps,
  PopoverInsetProps,
};
export {
  PopoverRoot,
  PopoverContent,
  Popover,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  PopoverBody,
  PopoverFooter,
  PopoverInset,
};
