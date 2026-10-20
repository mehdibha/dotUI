import { createDynamicComponent } from "@/lib/styles"

import { QRCode as DotsQRCode } from "./base.dots"
import { QRCode as RoundedQRCode } from "./base.rounded"
import { type QRCodeProps, QRCode as SquaresQRCode } from "./base.squares"
import meta from "./meta"

const QRCode = createDynamicComponent({
  meta,
  paramName: "style",
  components: {
    squares: SquaresQRCode,
    rounded: RoundedQRCode,
    dots: DotsQRCode,
  },
  displayName: "QRCode",
})

export type { QRCodeProps }
export { QRCode }
