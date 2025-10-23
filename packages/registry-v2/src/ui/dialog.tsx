"use client";

import type * as React from "react";
import {
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  Heading as AriaHeading,
  Text as AriaText,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { Drawer } from "@dotui/registry-v2/ui/drawer";
import { Modal } from "@dotui/registry-v2/ui/modal";
import { Overlay } from "@dotui/registry-v2/ui/overlay";
import { Popover } from "@dotui/registry-v2/ui/popover";
import type { OverlayProps } from "@dotui/registry-v2/ui/overlay";

const dialogStyles = tv({
  slots: {
    content: "relative flex flex-col gap-4 p-6 outline-none in-popover:p-4",
    header: "flex flex-col gap-2 text-left",
    heading:
      "text-lg leading-none font-semibold in-popover:text-base in-popover:font-medium",
    description: "text-sm text-fg-muted",
    body: "flex flex-1 flex-col gap-2 overflow-y-auto",
    inset: "-mx-6 border bg-muted px-6 py-4 in-popover:-mx-4 in-popover:px-4",
    footer: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
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

/* -----------------------------------------------------------------------------------------------*/

interface DialogContentProps extends React.ComponentProps<typeof AriaDialog> {}

const DialogContent = ({ className, ...props }: DialogContentProps) => {
  return (
    <AriaDialog
      data-slot="dialog-content"
      className={content({ className })}
      {...props}
    />
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface DialogHeaderProps extends React.ComponentProps<"header"> {}

const DialogHeader = ({ className, ...props }: DialogHeaderProps) => {
  return <header className={header({ className })} {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

interface DialogHeadingProps extends React.ComponentProps<typeof AriaHeading> {}

const DialogHeading = ({ className, ...props }: DialogHeadingProps) => {
  return <AriaHeading className={heading({ className })} {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

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

/* -----------------------------------------------------------------------------------------------*/

interface DialogBodyProps extends React.ComponentProps<"div"> {}

const DialogBody = ({ className, ...props }: DialogBodyProps) => {
  return <div className={body({ className })} {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

type DialogFooterProps = React.ComponentProps<"footer">;

const DialogFooter = ({ className, ...props }: DialogFooterProps) => {
  return <footer className={footer({ className })} {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

type DialogInsetProps = React.ComponentProps<"div">;

const DialogInset = ({ className, ...props }: DialogInsetProps) => {
  return <div className={inset({ className })} {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

const CompoundDialog = Object.assign(DialogRoot, {
  Header: DialogHeader,
  Heading: DialogHeading,
  Description: DialogDescription,
  Content: DialogContent,
  Body: DialogBody,
  Footer: DialogFooter,
  Inset: DialogInset,
  Popover,
  Modal,
  Drawer,
  Overlay,
});

export {
  DialogRoot,
  CompoundDialog as Dialog,
  DialogHeader,
  DialogHeading,
  DialogDescription,
  DialogContent,
  DialogBody,
  DialogFooter,
  DialogInset,
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
