import * as ModalPrimitives from "react-aria-components/Modal";

/**
 * A modal is an overlay element which blocks interaction with elements outside it.
 */
export interface ModalProps extends ModalOverlayProps {}

/**
 * A ModalOverlay is a wrapper for a Modal which allows customizing the backdrop element.
 */
export interface ModalOverlayProps extends React.ComponentProps<typeof ModalPrimitives.ModalOverlay> {}

/**
 * Missing description.
 */
export interface ModalContentProps extends React.ComponentProps<typeof ModalPrimitives.Modal> {}

/**
 * Missing description.
 */
export interface ModalBackdropProps extends React.ComponentProps<"div"> {}
