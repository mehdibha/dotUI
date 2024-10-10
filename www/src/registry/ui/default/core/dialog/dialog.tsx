"use client";

import * as React from "react";
import { useSlotId } from "@react-aria/utils";
import {
  composeRenderProps,
  DialogContext as AriaDialogContext,
  DialogTrigger as AriaDialogTrigger,
  Dialog as AriaDialog,
  type DialogProps as AriaDialogProps,
  type DialogTriggerProps as AriaDialogTriggerProps,
  TextContext,
} from "react-aria-components";
import { Provider } from "react-aria-components";
import { tv } from "tailwind-variants";
import { Heading } from "@/registry/ui/default/core/heading";
import { Overlay, type OverlayProps } from "@/registry/ui/default/core/overlay";
import { Text } from "@/registry/ui/default/core/text";

const dialogStyles = tv({
  slots: {
    content: [
      "relative flex max-w-full flex-col rounded-[inherit] p-4 outline-none",
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
  const descriptionId = useSlotId();
  return (
    <Provider
      values={[
        [AriaDialogContext, { "aria-describedby": descriptionId }],
        [TextContext, { slots: { description: { id: descriptionId } } }],
      ]}
    >
      <AriaDialogTrigger {...props} />
    </Provider>
  );
};

interface DialogProps extends DialogContentProps {
  title?: string;
  description?: string;
  type?: OverlayProps["type"];
  showDismissButton?: OverlayProps["showDismissButton"];
  mobileType?: OverlayProps["mobileType"];
  mediaQuery?: OverlayProps["mediaQuery"];
  isDismissable?: boolean;
  placement?: OverlayProps["placement"];
}
const Dialog = ({
  title,
  description,
  type = "modal",
  mobileType = "drawer",
  mediaQuery,
  isDismissable: isDismissableProp,
  showDismissButton,
  placement,
  ...props
}: DialogProps) => {
  const isDismissable =
    isDismissableProp ?? (props.role === "alertdialog" ? false : true);
  return (
    <Overlay
      isDismissable={isDismissable}
      showDismissButton={showDismissButton}
      type={type}
      mobileType={mobileType}
      mediaQuery={mediaQuery}
      placement={placement}
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
