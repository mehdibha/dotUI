"use client";

import * as React from "react";
import { useSlotId } from "@react-aria/utils";
import { XIcon } from "lucide-react";
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
  OverlayTriggerStateContext,
} from "react-aria-components";
import { Provider } from "react-aria-components";
import { tv } from "tailwind-variants";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { Button, type ButtonProps } from "./button";
import { Overlay, type OverlayProps } from "./overlay";

const dialogStyles = tv({
  slots: {
    overlay: "",
    backdrop: "",
    content: "relative outline-none rounded-[inherit] p-3 sm:p-6",
    header: "mb-4",
    title: "text-xl font-semibold",
    description: "text-sm text-fg-muted",
    body: "space-y-4",
    footer: "flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4",
    inset: "-mx-3 sm:-mx-6",
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
  mediaQuery?: string;
  type?: OverlayProps["type"];
  mobileType?: OverlayProps["type"];
  showDismissButton?: boolean;
  isDismissable?: boolean;
}
const Dialog = ({
  title,
  description,
  type: typeProp = "modal",
  mobileType = "drawer",
  mediaQuery = "(max-width: 640px)",
  isDismissable: isDismissableProp,
  showDismissButton: showDismissButtonProp,
  ...props
}: DialogProps) => {
  const isMobile = useMediaQuery(mediaQuery);
  const type = mobileType ? (isMobile ? mobileType : typeProp) : typeProp;
  const currentType = isMobile ? mobileType : type;
  const isDismissable = isDismissableProp ?? (props.role === "alertdialog" ? false : true);
  const showDismissButton = showDismissButtonProp ?? isDismissable;
  return (
    <Overlay isDismissable={isDismissableProp} type={type}>
      <DialogContent {...props}>
        {composeRenderProps(props.children, (children) => (
          <>
            {(title || description) && (
              <DialogHeader>
                {title && <DialogTitle>{title}</DialogTitle>}
                {description && <DialogDescription>{description}</DialogDescription>}
              </DialogHeader>
            )}
            {children}
            {showDismissButton && ["modal", "popover"].includes(currentType) && (
              <DismissButton className="absolute right-3 top-3" />
            )}
          </>
        ))}
      </DialogContent>
    </Overlay>
  );
};

type DialogContentProps = AriaDialogProps;
const DialogContent = ({ children, className, ...props }: DialogContentProps) => {
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

type DialogTitleProps = AriaHeadingProps;
const DialogTitle = ({ className, ...props }: DialogTitleProps) => {
  const { title } = dialogStyles();
  return <AriaHeading slot="title" className={title({ className })} {...props} />;
};

type DialogDescriptionProps = AriaTextProps;
const DialogDescription = ({ className, ...props }: DialogDescriptionProps) => {
  const { description } = dialogStyles();
  return <AriaText slot="description" className={description({ className })} {...props} />;
};

type DialogBody = React.ComponentProps<"div">;
const DialogBody = ({ className, ...props }: DialogDescriptionProps) => {
  const { body } = dialogStyles();
  return <div className={body({ className })} {...props} />;
};

type DialogFooterProps = React.ComponentProps<"footer">;
const DialogFooter = ({ className, ...props }: DialogFooterProps) => {
  const { footer } = dialogStyles();
  return <footer slot="description" className={footer({ className })} {...props} />;
};

type DialogInsetProps = React.ComponentProps<"div">;
const DialogInset = ({ className, ...props }: DialogInsetProps) => {
  const { inset } = dialogStyles();
  return <div className={inset({ className })} {...props} />;
};

const DismissButton = (props: ButtonProps) => {
  const state = React.useContext(OverlayTriggerStateContext);
  return (
    <Button
      shape="square"
      variant="quiet"
      size="sm"
      aria-label="Close"
      {...props}
      onPress={() => state.close()}
    >
      <XIcon className="size-4" />
    </Button>
  );
};

// const DialogContext = React.createContext<{
//   isMobile: boolean;
//   mobileType: "drawer" | "modal";
// } | null>(null);

// function useDialogContext() {
//   const context = React.useContext(DialogContext);
//   if (!context) {
//     throw new Error("useDialogContext must be used within a <MenuRoot />");
//   }
//   return context;
// }

export type {
  DialogRootProps,
  DialogProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogInsetProps,
};
export {
  DialogRoot,
  DialogContent,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogInset,
};
