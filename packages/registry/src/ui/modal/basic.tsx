"use client";

import React from "react";
import {
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const modalStyles = tv({
  slots: {
    overlay:
      "fixed top-0 left-0 z-50 flex h-(--visual-viewport-height) w-screen items-center justify-center bg-inverse/40 opacity-100 duration-200 ease-[cubic-bezier(0.165,0.84,0.44,1)] will-change-[opacity] dark:bg-bg/40 entering:opacity-0 exiting:opacity-0",
    modal:
      "relative z-50 w-full max-w-lg scale-100 border bg-bg shadow-lg duration-200 ease-[cubic-bezier(0.165,0.84,0.44,1)] will-change-transform sm:rounded-lg md:w-full entering:scale-95 exiting:scale-95",
  },
});

const { overlay, modal } = modalStyles();

interface ModalProps extends React.ComponentProps<typeof AriaModal> {
  overlayClassName?: string;
}

const Modal = ({
  children,
  className,
  overlayClassName,
  isDismissable = true,
  ...props
}: ModalProps) => (
  <AriaModalOverlay
    isDismissable={isDismissable}
    className={overlay({ className: overlayClassName })}
    {...props}
  >
    <AriaModal
      className={composeRenderProps(className, (className) =>
        modal({ className }),
      )}
    >
      {children}
    </AriaModal>
  </AriaModalOverlay>
);

export type { ModalProps };
export { Modal };
