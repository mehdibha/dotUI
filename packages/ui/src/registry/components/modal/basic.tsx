"use client";

import React from "react";
import {
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
  composeRenderProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import type { SlotsToClassNames } from "@dotui/ui/lib/utils";

const modalStyles = tv({
  slots: {
    overlay:
      "h-(--visual-viewport-height) bg-bg-inverse/40 dark:bg-bg/40 entering:opacity-0 exiting:opacity-0 fixed left-0 top-0 z-50 flex w-screen items-center justify-center opacity-100 duration-200 ease-[cubic-bezier(0.165,0.84,0.44,1)] will-change-[opacity]",
    modal:
      "bg-bg entering:scale-95 exiting:scale-95 relative z-50 w-full max-w-lg scale-100 border shadow-lg duration-200 ease-[cubic-bezier(0.165,0.84,0.44,1)] will-change-transform sm:rounded-lg md:w-full",
  },
});

const { overlay, modal } = modalStyles();

interface ModalProps extends React.ComponentProps<typeof AriaModal> {
  classNames?: SlotsToClassNames<typeof modalStyles>;
}

const Modal = ({ className, isDismissable = true, ...props }: ModalProps) => (
  <AriaModalOverlay
    isDismissable={isDismissable}
    className={composeRenderProps(className, (className) => overlay({}))}
    {...props}
  >
    <AriaModal
      isDismissable={isDismissable}
      className={composeRenderProps(className, (className) =>
        modal({ className }),
      )}
      {...props}
    />
  </AriaModalOverlay>
);

export type { ModalProps };
export { Modal };
