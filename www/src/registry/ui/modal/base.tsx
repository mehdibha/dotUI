"use client";

import { composeRenderProps } from "react-aria-components/composeRenderProps";
import * as ModalPrimitives from "react-aria-components/Modal";
import type React from "react";

import { useStyles } from "./styles";

// MARK: modalStyles

// MARK: Separator

interface ModalProps extends ModalOverlayProps {}

const Modal = ({ children, className, ...props }: ModalProps) => (
	<ModalOverlay {...props}>
		<ModalBackdrop />
		<ModalViewport>
			<ModalPanel className={className}>
						{children}
			</ModalPanel>
		</ModalViewport>
	</ModalOverlay>
);

// MARK: Separator

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

// MARK: Separator

interface ModalPanelProps extends React.ComponentProps<typeof ModalPrimitives.Modal> {}
const ModalPanel = ({ children, className, ...props }: ModalPanelProps) => {
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

interface ModalViewportProps extends React.ComponentProps<"div"> {}
const ModalViewport = ({ className, ...props }: ModalViewportProps) => {
	const { viewport } = useStyles()();
	return <div data-slot="modal-viewport" className={viewport({ className })} {...props} />;
};

export type { ModalBackdropProps, ModalOverlayProps, ModalPanelProps, ModalProps, ModalViewportProps };
export { Modal, ModalBackdrop, ModalOverlay, ModalPanel, ModalViewport };
