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
    underlay:
      "exiting:opacity-0 entering:opacity-0 bg-bg-inverse/40 dark:bg-bg/40 fixed top-0 left-0 z-50 flex h-(--visual-viewport-height) w-screen items-center justify-center opacity-100 backdrop-blur-xs transition-opacity duration-200 ease-[cubic-bezier(0.165,0.84,0.44,1)] will-change-[opacity]",
    overlay:
      "bg-bg entering:scale-95 exiting:scale-95 relative z-50 w-full max-w-lg scale-100 border shadow-lg duration-200 ease-[cubic-bezier(0.165,0.84,0.44,1)] will-change-transform sm:rounded-lg md:w-full",
  },
});

const { underlay, overlay } = modalStyles();

interface ModalProps extends React.ComponentProps<typeof AriaModal> {}
const Modal = ({ className, isDismissable = true, ...props }: ModalProps) => (
  <AriaModalOverlay
    isDismissable={isDismissable}
    className={composeRenderProps(className, () => underlay())}
    {...props}
  >
    <AriaModal
      isDismissable={isDismissable}
      className={composeRenderProps(className, (className) =>
        overlay({ className }),
      )}
      {...props}
    />
  </AriaModalOverlay>
);

export type { ModalProps };
export { Modal };
