"use client";

import { Modal as AriaModal, ModalOverlay as AriaModalOverlay, composeRenderProps } from "react-aria-components";
import { tv } from "tailwind-variants";
import type React from "react";

const modalStyles = tv({
	slots: {
		overlay: "group/modal absolute top-0 left-0 z-100 h-(--page-height) w-full",
		backdrop: [
			"size-full bg-bg/40 duration-200 group-exiting/modal:duration-150",
			"transition-opacity group-entering/modal:opacity-0 group-exiting/modal:opacity-0",
		],
		modal: [
			"fixed top-[calc(var(--visual-viewport-height)/2)] left-1/2 max-h-(--visual-viewport-height) w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-bg shadow-lg sm:max-w-lg",
			"transition-[opacity,scale] ease-[cubic-bezier(0.165,0.84,0.44,1)]",
			"entering:scale-95 entering:opacity-0 duration-200",
			"exiting:scale-95 exiting:opacity-0 exiting:duration-150",
		],
	},
});

const { overlay, modal, backdrop } = modalStyles();

/* -----------------------------------------------------------------------------------------------*/

interface ModalProps extends ModalOverlayProps {}

const Modal = ({ children, className, ...props }: ModalProps) => (
	<ModalOverlay {...props}>
		<ModalBackdrop />
		<ModalContent className={className}>{children}</ModalContent>
	</ModalOverlay>
);

/* -----------------------------------------------------------------------------------------------*/

interface ModalOverlayProps extends React.ComponentProps<typeof AriaModalOverlay> {}
const ModalOverlay = ({ children, className, isDismissable = true, ...props }: ModalOverlayProps) => (
	<AriaModalOverlay
		isDismissable={isDismissable}
		className={composeRenderProps(className, (className) => overlay({ className }))}
		{...props}
	>
		{children}
	</AriaModalOverlay>
);

/* -----------------------------------------------------------------------------------------------*/

interface ModalContentProps extends React.ComponentProps<typeof AriaModal> {}
const ModalContent = ({ children, className, ...props }: ModalContentProps) => (
	<AriaModal data-modal="" className={composeRenderProps(className, (className) => modal({ className }))} {...props}>
		{children}
	</AriaModal>
);

interface ModalBackdropProps extends React.ComponentProps<"div"> {}
const ModalBackdrop = ({ className, ...props }: ModalBackdropProps) => (
	<div className={backdrop({ className })} {...props} />
);

export { Modal, ModalOverlay, ModalContent, ModalBackdrop };

export type { ModalProps, ModalOverlayProps, ModalContentProps, ModalBackdropProps };
