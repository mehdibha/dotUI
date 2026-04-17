"use client";

import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as ModalPrimitives from "react-aria-components/Modal";
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

interface ModalOverlayProps extends React.ComponentProps<typeof ModalPrimitives.ModalOverlay> {}
const ModalOverlay = ({ children, className, isDismissable = true, ...props }: ModalOverlayProps) => {
	const { overlay } = useStyles()();
	return (
		<ModalPrimitives.ModalOverlay
			isDismissable={isDismissable}
			className={composeRenderProps(className, (className) => overlay({ className }))}
			{...props}
		>
			{children}
		</ModalPrimitives.ModalOverlay>
	);
};

// MARK: seperator

interface ModalContentProps extends React.ComponentProps<typeof ModalPrimitives.Modal> {}
const ModalContent = ({ children, className, ...props }: ModalContentProps) => {
	const { modal } = useStyles()();
	return (
		<ModalPrimitives.Modal
			data-modal=""
			className={composeRenderProps(className, (className) => modal({ className }))}
			{...props}
		>
			{children}
		</ModalPrimitives.Modal>
	);
};

interface ModalBackdropProps extends React.ComponentProps<"div"> {}
const ModalBackdrop = ({ className, ...props }: ModalBackdropProps) => {
	const { backdrop } = useStyles()();
	return <div className={backdrop({ className })} {...props} />;
};

export type { ModalBackdropProps, ModalContentProps, ModalOverlayProps, ModalProps };
export { Modal, ModalBackdrop, ModalContent, ModalOverlay };
