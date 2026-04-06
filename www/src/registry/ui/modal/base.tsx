"use client";

import { Modal as AriaModal, ModalOverlay as AriaModalOverlay, composeRenderProps } from "react-aria-components";
import type React from "react";

import { useStyles } from "./styles";

// MARK: modalStyles

// MARK: seperator

interface ModalProps extends ModalOverlayProps {}

const Modal = ({ children, className, ...props }: ModalProps) => (
	<ModalOverlay {...props}>
		<ModalBackdrop />
		<ModalContent className={className}>{children}</ModalContent>
	</ModalOverlay>
);

// MARK: seperator

interface ModalOverlayProps extends React.ComponentProps<typeof AriaModalOverlay> {}
const ModalOverlay = ({ children, className, isDismissable = true, ...props }: ModalOverlayProps) => {
	const { overlay } = useStyles()();
	return (
		<AriaModalOverlay
			isDismissable={isDismissable}
			className={composeRenderProps(className, (className) => overlay({ className }))}
			{...props}
		>
			{children}
		</AriaModalOverlay>
	);
};

// MARK: seperator

interface ModalContentProps extends React.ComponentProps<typeof AriaModal> {}
const ModalContent = ({ children, className, ...props }: ModalContentProps) => {
	const { modal } = useStyles()();
	return (
		<AriaModal data-modal="" className={composeRenderProps(className, (className) => modal({ className }))} {...props}>
			{children}
		</AriaModal>
	);
};

interface ModalBackdropProps extends React.ComponentProps<"div"> {}
const ModalBackdrop = ({ className, ...props }: ModalBackdropProps) => {
	const { backdrop } = useStyles()();
	return <div className={backdrop({ className })} {...props} />;
};

export { Modal, ModalOverlay, ModalContent, ModalBackdrop };

export type { ModalProps, ModalOverlayProps, ModalContentProps, ModalBackdropProps };
