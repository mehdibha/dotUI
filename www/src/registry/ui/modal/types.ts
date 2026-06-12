import type * as ModalPrimitives from 'react-aria-components/Modal'

/**
 * A modal is an overlay element which blocks interaction with elements outside it.
 */
export interface ModalProps extends ModalOverlayProps {}

/**
 * A ModalOverlay is a wrapper for a Modal which allows customizing the backdrop element.
 */
export interface ModalOverlayProps extends React.ComponentProps<
  typeof ModalPrimitives.ModalOverlay
> {}

/**
 * The modal panel that contains the dialog content.
 */
export interface ModalContentProps extends React.ComponentProps<
  typeof ModalPrimitives.Modal
> {}

/**
 * The backdrop displayed behind the modal, which dims the underlying page content.
 */
export interface ModalBackdropProps extends React.ComponentProps<'div'> {}

/**
 * The viewport container that centers the modal within the visible area of the screen.
 */
export interface ModalViewportProps extends React.ComponentProps<'div'> {}
