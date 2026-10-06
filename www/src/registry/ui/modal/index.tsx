import { createDynamicComponent } from "@/lib/styles"

import { Modal as CenterModal } from "./base"
import { Modal as FullscreenModal } from "./base.fullscreen"
import { Modal as SheetModal } from "./base.sheet"
import meta from "./meta"

const Modal = createDynamicComponent({
  meta,
  paramName: "mobile",
  components: {
    center: CenterModal,
    sheet: SheetModal,
    fullscreen: FullscreenModal,
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
