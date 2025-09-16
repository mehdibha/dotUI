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
      "h-(--visual-viewport-height) bg-inverse/40 backdrop-blur-xs dark:bg-bg/40 entering:opacity-0 exiting:opacity-0 fixed left-0 top-0 z-50 flex w-screen items-center justify-center opacity-100 transition-opacity duration-200 ease-[cubic-bezier(0.165,0.84,0.44,1)] will-change-[opacity]",
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
