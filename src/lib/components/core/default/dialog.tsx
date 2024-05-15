"use client";

import * as React from "react";
import {
  DialogTrigger as AriaDialogTrigger,
  Dialog as AriaDialog,
  type DialogProps as AriaDialogProps,
  type DialogTriggerProps as AriaDialogTriggerProps,
} from "react-aria-components";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { Overlay, type OverlayProps } from "./overlay";

const DialogContext = React.createContext<{
  isMobile: boolean;
} | null>(null);

function useDialogContext() {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error("useDilaogContext must be used within a <MenuRoot />");
  }
  return context;
}

interface DialogRootProps extends Omit<AriaDialogTriggerProps, "children"> {
  children: React.ReactNode;
}

const DialogRoot = ({ children, ...props }: DialogRootProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <DialogContext.Provider value={{ isMobile }}>
      <AriaDialogTrigger {...props}>{children}</AriaDialogTrigger>
    </DialogContext.Provider>
  );
};

const DialogOverlay = (props: OverlayProps) => {
  const { isMobile } = useDialogContext();
  return <Overlay isDismissable type={isMobile ? "drawer" : "modal"} {...props} />;
};

type DialogContentProps = AriaDialogProps;

const DialogContent = ({ children, ...props }: DialogContentProps) => {
  return <AriaDialog {...props}>{children}</AriaDialog>;
};

const Dialog = ({ children, ...props }: DialogContentProps) => {
  return (
    <DialogOverlay>
      <DialogContent {...props}>{children}</DialogContent>
    </DialogOverlay>
  );
};

export { DialogRoot, DialogContent, Dialog };
