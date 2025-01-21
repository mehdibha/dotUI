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
    underlay:
      "h-(--visual-viewport-height) entering:animate-in entering:fade-in exiting:animate-out exiting:fade-out-0 entering:duration-200 exiting:duration-150 bg-bg-inverse dark:bg-bg/40 fixed left-0 top-0 z-50 flex w-[100vw] items-center justify-center ease-[cubic-bezier(0.165,0.84,0.44,1)]",
    overlay:
      "bg-bg entering:animate-in entering:zoom-in-95 exiting:animate-out exiting:zoom-out-95 entering:duration-200 exiting:duration-150 relative z-50 w-full max-w-lg border shadow-lg ease-[cubic-bezier(0.165,0.84,0.44,1)] sm:rounded-lg md:w-full",
  },
});

const { underlay, overlay } = modalStyles();

interface ModalProps extends React.ComponentProps<typeof AriaModal> {}
const Modal = ({ className, isDismissable = true, ...props }: ModalProps) => (
  <AriaModalOverlay
    isDismissable={isDismissable}
    className={composeRenderProps(className, (className) =>
      underlay({ className })
    )}
    {...props}
  >
    <AriaModal
      isDismissable={isDismissable}
      className={composeRenderProps(className, (className) =>
        overlay({ className })
      )}
      {...props}
    />
  </AriaModalOverlay>
);

export type { ModalProps };
export { Modal };
