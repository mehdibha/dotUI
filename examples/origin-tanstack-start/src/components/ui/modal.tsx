"use client";

import type * as React from "react";
import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as ModalPrimitives from "react-aria-components/Modal";
import { useIsHidden } from "react-aria/private/collections/Hidden";
import { tv, type VariantProps } from "tailwind-variants";
const modalVariants = tv({
  slots: {
    overlay:
      "group/modal absolute top-0 left-0 isolate z-100 h-(--page-height) w-full",
    backdrop: [
      "absolute inset-0",
      "bg-overlay/40 backdrop-blur-sm",
      "transition-opacity duration-enter group-exiting/modal:duration-exit motion-reduce:transition-none group-entering/modal:opacity-0 group-exiting/modal:opacity-0",
    ],
    viewport: [
      "@container-[size] sticky top-0 left-0 flex h-(--visual-viewport-height) w-full justify-center",
      "items-center",
    ],
    modal: [
      "relative flex w-full max-w-[calc(100vw-2rem)] flex-col rounded-xl border border-(--overlay-border) bg-(--modal-background) shadow-[var(--shadow-modal,var(--shadow-lg))] [backdrop-filter:var(--overlay-backdrop-filter,none)] [--surface-radius:var(--modal-radius)]",
      "sm:max-w-sm",
      "max-h-[calc(var(--visual-viewport-height)-2rem)] sm:max-h-[calc(var(--visual-viewport-height)*.9)]",
      "transition-[opacity,scale]",
      "duration-enter ease-enter exiting:duration-exit exiting:ease-out motion-reduce:transition-none",
      "entering:scale-95 entering:opacity-0 exiting:scale-95 exiting:opacity-0",
    ],
  },
});

interface ModalProps extends ModalOverlayProps {}

const Modal = ({ children, className, ...props }: ModalProps) => {
  const isHidden = useIsHidden();

  if (isHidden) {
    return <>{children}</>;
  }

  return (
    <ModalOverlay {...props}>
      <ModalBackdrop />
      <ModalViewport>
        <ModalPanel className={className}>{children}</ModalPanel>
      </ModalViewport>
    </ModalOverlay>
  );
};

interface ModalOverlayProps extends React.ComponentProps<
  typeof ModalPrimitives.ModalOverlay
> {}
const ModalOverlay = ({
  children,
  className,
  isDismissable = true,
  ...props
}: ModalOverlayProps) => {
  const { overlay } = modalVariants();
  return (
    <ModalPrimitives.ModalOverlay
      isDismissable={isDismissable}
      className={composeRenderProps(className, (className) =>
        overlay({ className }),
      )}
      {...props}
    >
      {children}
    </ModalPrimitives.ModalOverlay>
  );
};

interface ModalPanelProps extends React.ComponentProps<
  typeof ModalPrimitives.Modal
> {}
const ModalPanel = ({ children, className, ...props }: ModalPanelProps) => {
  const { modal } = modalVariants();
  return (
    <ModalPrimitives.Modal
      data-modal=""
      className={composeRenderProps(className, (className) =>
        modal({ className }),
      )}
      {...props}
    >
      {children}
    </ModalPrimitives.Modal>
  );
};

interface ModalBackdropProps extends React.ComponentProps<"div"> {}
const ModalBackdrop = ({ className, ...props }: ModalBackdropProps) => {
  const { backdrop } = modalVariants();
  return <div className={backdrop({ className })} {...props} />;
};

interface ModalViewportProps extends React.ComponentProps<"div"> {}
const ModalViewport = ({ className, ...props }: ModalViewportProps) => {
  const { viewport } = modalVariants();
  return (
    <div
      data-slot="modal-viewport"
      className={viewport({ className })}
      {...props}
    />
  );
};

export type {
  ModalBackdropProps,
  ModalOverlayProps,
  ModalPanelProps,
  ModalProps,
  ModalViewportProps,
};
export { Modal, ModalBackdrop, ModalOverlay, ModalPanel, ModalViewport };
