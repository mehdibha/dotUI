import { createDynamicComponent } from "@/lib/styles"

import { type ModalProps, Modal as CenterModal } from "./base"
import { Modal as SheetModal } from "./base.sheet"

const Modal = createDynamicComponent<
  ModalProps,
  "center" | "sheet" | "fullscreen"
>({
  componentName: "modal",
  paramName: "mobile",
  defaultValue: "center",
  components: {
    center: CenterModal,
    sheet: SheetModal,
    fullscreen: CenterModal,
  },
  displayName: "Modal",
})

export type {
  ModalBackdropProps,
  ModalOverlayProps,
  ModalPanelProps,
  ModalProps,
  ModalViewportProps,
} from "./base"
export { ModalBackdrop, ModalOverlay, ModalPanel, ModalViewport } from "./base"
export { Modal }
