"use client";

import React from "react";
import {
  composeRenderProps,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
} from "react-aria-components";
import { tv } from "tailwind-variants";

const modalStyles = tv({
  slots: {
    backdrop: [
      "h-(--visual-viewport-height) fixed left-0 top-0 z-50 flex w-[100vw] items-center justify-center bg-black/40 backdrop-blur-sm",
      "entering:animate-in entering:fade-in-0 entering:zoom-in-95 exiting:animate-out exiting:fade-out-0 exiting:zoom-out-95 entering:duration-200 exiting:duration-150",
    ],
    overlay: [
      "group/overlay relative z-50 w-full max-w-lg",
      "bg-bg border shadow-lg sm:rounded-lg md:w-full",
      "entering:animate-in entering:fade-in-0 entering:zoom-in-95 exiting:animate-out exiting:fade-out-0 exiting:zoom-out-95 entering:duration-200 exiting:duration-150",
    ],
  },
});

const { backdrop, overlay } = modalStyles();

interface ModalProps extends React.ComponentProps<typeof AriaModalOverlay> {}
function Modal({ isDismissable = true, className, ...props }: ModalProps) {
  return (
    <AriaModalOverlay
      isDismissable={isDismissable}
      className={composeRenderProps(className, (className) =>
        backdrop({ className })
      )}
      {...props}
    >
      <AriaModal className={overlay()}>{props.children}</AriaModal>
    </AriaModalOverlay>
  );
}

export type { ModalProps };
export { Modal };
