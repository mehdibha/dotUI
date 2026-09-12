"use client";

import type * as React from "react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as DialogPrimitive from "react-aria-components/Dialog";
import * as TextPrimitives from "react-aria-components/Text";

import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tv } from "tailwind-variants";

const dialogVariants = tv({
  slots: {
    content:
      "relative flex max-h-[inherit] min-h-0 flex-col gap-4 p-(--dialog-padding) outline-none has-data-command:p-0 [@container_(height<31.25rem)]:overflow-y-auto text-sm [--dialog-padding:--spacing(4)] in-data-popover:[--dialog-padding:--spacing(2.5)]",
    header: "flex flex-col gap-2 in-data-popover:gap-0.5",
    title:
      "font-heading font-medium in-data-modal:text-base in-data-modal:leading-none",
    description: "text-fg-muted",
    body: "-mx-(--dialog-padding) flex min-h-0 flex-1 flex-col gap-2 px-(--dialog-padding) in-data-modal:[@container_(height<31.25rem)]:mx-0 in-data-modal:[@container_(height<31.25rem)]:shrink-0 in-data-modal:[@container_(height<31.25rem)]:overflow-y-visible in-data-modal:[@container_(height<31.25rem)]:px-0",
    footer: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
    closeButton: "absolute top-2 right-2",
  },
});
const { content, closeButton, header, title, description, body, footer } =
  dialogVariants();

/* -------------------------------------------------------------------------- */

interface DialogProps extends React.ComponentProps<
  typeof DialogPrimitive.DialogTrigger
> {}

const Dialog = (props: DialogProps) => {
  return <DialogPrimitive.DialogTrigger {...props} />;
};

/* -------------------------------------------------------------------------- */

interface DialogContentProps extends React.ComponentProps<
  typeof DialogPrimitive.Dialog
> {
  showCloseButton?: boolean;
}

const DialogContent = ({
  className,
  children,
  showCloseButton = false,
  ...props
}: DialogContentProps) => {
  return (
    <DialogPrimitive.Dialog
      data-slot="dialog-content"
      className={content({ className })}
      {...props}
    >
      {composeRenderProps(children, (children) => (
        <>
          {children}
          {showCloseButton && (
            <Button
              slot="close"
              variant="quiet"
              size="sm"
              isIconOnly
              aria-label="Close"
              className={closeButton()}
            >
              <XIcon />
            </Button>
          )}
        </>
      ))}
    </DialogPrimitive.Dialog>
  );
};

/* -------------------------------------------------------------------------- */

interface DialogHeaderProps extends React.ComponentProps<"header"> {}

const DialogHeader = ({ className, ...props }: DialogHeaderProps) => {
  return (
    <header
      data-slot="dialog-header"
      className={header({ className })}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface DialogTitleProps extends React.ComponentProps<
  typeof DialogPrimitive.Heading
> {}

const DialogTitle = ({ className, ...props }: DialogTitleProps) => {
  return (
    <DialogPrimitive.Heading
      slot="title"
      data-slot="dialog-heading"
      className={title({ className })}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface DialogDescriptionProps extends Omit<
  React.ComponentProps<typeof TextPrimitives.Text>,
  "slot"
> {}

const DialogDescription = ({ className, ...props }: DialogDescriptionProps) => {
  return (
    <TextPrimitives.Text
      data-slot="dialog-description"
      className={description({ className })}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

interface DialogBodyProps extends React.ComponentProps<"div"> {}

const DialogBody = ({ className, ...props }: DialogBodyProps) => {
  return (
    <div data-slot="dialog-body" className={body({ className })} {...props} />
  );
};

/* -------------------------------------------------------------------------- */

type DialogInsetProps = React.ComponentProps<"div">;

const DialogInset = (props: DialogInsetProps) => {
  return <div data-slot="dialog-inset" {...props} />;
};

/* -------------------------------------------------------------------------- */

type DialogFooterProps = React.ComponentProps<"footer">;

const DialogFooter = ({ className, ...props }: DialogFooterProps) => {
  return (
    <footer
      data-slot="dialog-footer"
      className={footer({ className })}
      {...props}
    />
  );
};

/* -------------------------------------------------------------------------- */

export type {
  DialogBodyProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogHeaderProps,
  DialogInsetProps,
  DialogProps,
  DialogTitleProps,
};
export {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogInset,
  DialogTitle,
};
