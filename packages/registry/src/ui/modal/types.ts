import type { Modal as AriaModal, ModalOverlay as AriaModalOverlay } from "react-aria-components";

/**
 * A modal is an overlay element which blocks interaction with elements outside it.
 */
export interface ModalProps extends ModalOverlayProps {}

/**
 * A ModalOverlay is a wrapper for a Modal which allows customizing the backdrop element.
 */
export interface ModalOverlayProps extends React.ComponentProps<typeof AriaModalOverlay> {}

/**
 * Missing description.
 */
export interface ModalContentProps extends React.ComponentProps<typeof AriaModal> {}

/**
 * Missing description.
 */
export interface ModalBackdropProps extends React.ComponentProps<"div"> {}
