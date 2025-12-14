"use client";

import {
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  Heading as AriaHeading,
  Text as AriaText,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type * as React from "react";

const dialogStyles = tv({
  slots: {
    content:
      "relative flex flex-col gap-4 in-data-popover:p-4 p-6 outline-none",
    header: "flex flex-col gap-2 text-left",
    heading:
      "font-semibold in-popover:font-medium in-popover:text-base text-lg leading-none",
    description: "text-fg-muted text-sm",
    body: "flex flex-1 flex-col gap-2",
    inset: "-mx-6 in-popover:-mx-4 border bg-muted in-popover:px-4 px-6 py-4",
    footer: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
  },
});

const { content, header, heading, description, body, footer, inset } =
  dialogStyles();

/* -----------------------------------------------------------------------------------------------*/

interface DialogProps extends React.ComponentProps<typeof AriaDialogTrigger> {}

const Dialog = (props: DialogProps) => {
  return <AriaDialogTrigger {...props} />;
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

export {
  Dialog,
  DialogHeader,
  DialogHeading,
  DialogDescription,
  DialogContent,
  DialogBody,
  DialogFooter,
  DialogInset,
};

export type {
  DialogProps,
  DialogBodyProps,
  DialogHeaderProps,
  DialogHeadingProps,
  DialogDescriptionProps,
  DialogContentProps,
  DialogFooterProps,
  DialogInsetProps,
};
