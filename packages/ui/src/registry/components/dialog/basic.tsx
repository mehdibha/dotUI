"use client";

import * as React from "react";
import {
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  Heading as AriaHeading,
  Text as AriaText,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { Overlay } from "@dotui/ui/components/overlay";
import type { OverlayProps } from "@dotui/ui/components/overlay";

const dialogStyles = tv({
  slots: {
    content: [
      "relative flex h-[inherit] max-h-[inherit] flex-col rounded-[inherit] p-6 outline-hidden",
    ],
    header: "mb-4",
    heading: "block text-2xl font-medium",
    description: "text-sm text-fg-muted",
    body: "-mx-4 flex-1 space-y-2 overflow-y-auto px-4 py-2",
    inset: "-mx-4 border bg-bg-muted px-4 py-4",
    footer: "flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end",
  },
});

const { content, header, heading, description, body, footer, inset } =
  dialogStyles();

interface DialogRootProps
  extends React.ComponentProps<typeof AriaDialogTrigger> {}
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
  modalProps,
  popoverProps,
  drawerProps,
  isDismissable: isDismissableProp,
  role,
  isOpen,
  defaultOpen,
  onOpenChange,
  isKeyboardDismissDisabled,
  shouldCloseOnInteractOutside,
  ...props
}: DialogProps) => {
  const isDismissable = isDismissableProp ?? role !== "alertdialog";
  return (
    <Overlay
      type={type}
      mobileType={mobileType}
      isOpen={isOpen}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
      shouldCloseOnInteractOutside={shouldCloseOnInteractOutside}
      modalProps={modalProps}
      popoverProps={popoverProps}
      drawerProps={drawerProps}
    >
      <DialogContent role={role} {...props}>
        {composeRenderProps(props.children, (children) => (
          <>
            {(title || description) && (
              <DialogHeader>
                {title && <DialogHeading>{title}</DialogHeading>}
                {description && (
                  <DialogDescription>{description}</DialogDescription>
                )}
              </DialogHeader>
            )}
            {children}
          </>
        ))}
      </DialogContent>
    </Overlay>
  );
};

interface DialogContentProps extends React.ComponentProps<typeof AriaDialog> {}
const DialogContent = ({ className, ...props }: DialogContentProps) => {
  return <AriaDialog className={content({ className })} {...props} />;
};

interface DialogHeaderProps extends React.ComponentProps<"header"> {}
const DialogHeader = ({ className, ...props }: DialogHeaderProps) => {
  return <header className={header({ className })} {...props} />;
};

interface DialogHeadingProps extends React.ComponentProps<typeof AriaHeading> {}
const DialogHeading = ({ className, ...props }: DialogHeadingProps) => {
  return <AriaHeading className={heading({ className })} {...props} />;
};

interface DialogDescriptionProps
  extends Omit<React.ComponentProps<typeof AriaText>, "slot"> {}
const DialogDescription = ({ className, ...props }: DialogDescriptionProps) => {
  return (
    <AriaText
      slot="description"
      className={description({ className })}
      {...props}
    />
  );
};

interface DialogBodyProps extends React.ComponentProps<"div"> {}
const DialogBody = ({ className, ...props }: DialogBodyProps) => {
  return <div className={body({ className })} {...props} />;
};

type DialogFooterProps = React.ComponentProps<"footer">;
const DialogFooter = ({ className, ...props }: DialogFooterProps) => {
  return <footer className={footer({ className })} {...props} />;
};

type DialogInsetProps = React.ComponentProps<"div">;
const DialogInset = ({ className, ...props }: DialogInsetProps) => {
  return <div className={inset({ className })} {...props} />;
};

export type {
  DialogRootProps,
  DialogProps,
  DialogBodyProps,
  DialogHeaderProps,
  DialogHeadingProps,
  DialogDescriptionProps,
  DialogContentProps,
  DialogFooterProps,
  DialogInsetProps,
};
export {
  DialogRoot,
  Dialog,
  DialogHeader,
  DialogHeading,
  DialogDescription,
  DialogContent,
  DialogBody,
  DialogFooter,
  DialogInset,
};
