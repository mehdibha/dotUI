import { createDynamicComponent } from '@/lib/styles'

import { QRCode as DotsQRCode } from './base.dots'
import { QRCode as RoundedQRCode } from './base.rounded'
import { type QRCodeProps, QRCode as SquaresQRCode } from './base.squares'

const QRCode = createDynamicComponent<
  QRCodeProps,
  'squares' | 'rounded' | 'dots'
>({
  componentName: 'qr-code',
  paramName: 'style',
  defaultValue: 'squares',
  components: {
    squares: SquaresQRCode,
    rounded: RoundedQRCode,
    dots: DotsQRCode,
  },
  displayName: 'QRCode',
})

export type { QRCodeProps }
export { QRCode }
