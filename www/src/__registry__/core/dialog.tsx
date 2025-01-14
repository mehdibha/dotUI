"use client";

import * as React from "react";
import {
  composeRenderProps,
  DialogTrigger as AriaDialogTrigger,
  Dialog as AriaDialog,
  type DialogProps as AriaDialogProps,
  type DialogTriggerProps as AriaDialogTriggerProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { Heading } from "@/registry/core/heading";
import { Overlay, type OverlayProps } from "@/registry/core/overlay";
import { Text } from "@/registry/core/text";

const dialogStyles = tv({
  slots: {
    content: [
      "outline-hidden relative flex max-w-full flex-col rounded-[inherit] p-4",
      "group-data-[type=modal]/overlay:p-6",
      "group-data-[type=drawer]/overlay:pt-0",
    ],
    header: "mb-4",
    footer: "flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end",
    inset:
      "-mx-4 px-4 py-4 group-data-[type=modal]/overlay:-mx-6 group-data-[type=modal]/overlay:px-6",
  },
});

type DialogRootProps = AriaDialogTriggerProps;
const DialogRoot = (props: DialogRootProps) => {
  return <AriaDialogTrigger {...props} />;
};

interface DialogProps
  extends DialogContentProps,
    Omit<OverlayProps, "children"> {
  title?: string;
  description?: string;
}
const Dialog = ({
  title,
  description,
  type = "modal",
  mobileType = "drawer",
  mediaQuery,
  modalProps,
  popoverProps,
  drawerProps,
  ...props
}: DialogProps) => {
  return (
    <Overlay
      type={type}
      mobileType={mobileType}
      mediaQuery={mediaQuery}
      modalProps={modalProps}
      popoverProps={popoverProps}
      drawerProps={drawerProps}
    >
      <DialogContent {...props}>
        {composeRenderProps(props.children, (children) => (
          <>
            {(title || description) && (
              <DialogHeader>
                {title && <Heading>{title}</Heading>}
                {description && <Text slot="description">{description}</Text>}
              </DialogHeader>
            )}
            {children}
          </>
        ))}
      </DialogContent>
    </Overlay>
  );
};

type DialogContentProps = AriaDialogProps;
const DialogContent = ({
  children,
  className,
  ...props
}: DialogContentProps) => {
  const { content } = dialogStyles();
  return (
    <AriaDialog className={content({ className })} {...props}>
      {children}
    </AriaDialog>
  );
};

type DialogHeaderProps = React.ComponentProps<"header">;
const DialogHeader = ({ children, className, ...props }: DialogHeaderProps) => {
  const { header } = dialogStyles();
  return (
    <header className={header({ className })} {...props}>
      {children}
    </header>
  );
};

type DialogFooterProps = React.ComponentProps<"footer">;
const DialogFooter = ({ className, ...props }: DialogFooterProps) => {
  const { footer } = dialogStyles();
  return <footer className={footer({ className })} {...props} />;
};

type DialogInsetProps = React.ComponentProps<"div">;
const DialogInset = ({ className, ...props }: DialogInsetProps) => {
  const { inset } = dialogStyles();
  return <div className={inset({ className })} {...props} />;
};

export type {
  DialogRootProps,
  DialogProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogFooterProps,
  DialogInsetProps,
};
export {
  DialogRoot,
  DialogContent,
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogInset,
};
