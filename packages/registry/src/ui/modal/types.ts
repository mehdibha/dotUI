import type {
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
} from "react-aria-components";

export interface ModalProps extends ModalOverlayProps {}

export interface ModalOverlayProps
  extends React.ComponentProps<typeof AriaModalOverlay> {}

export interface ModalContentProps
  extends React.ComponentProps<typeof AriaModal> {}

export interface ModalBackdropProps extends React.ComponentProps<"div"> {}

