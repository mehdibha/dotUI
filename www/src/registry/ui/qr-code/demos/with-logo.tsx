import { GlobeIcon } from 'lucide-react'

import { QRCode } from '@/registry/ui/qr-code'

export default function WithLogo() {
  return (
    <QRCode value="https://dotui.org" aria-label="dotUI website">
      <GlobeIcon />
    </QRCode>
  )
}
