'use client'

import { QRCode, type QRCodeProps } from '@/registry/ui/qr-code'

export default function Demo({
  value = 'https://dotui.org',
  errorCorrection = 'M',
}: {
  value?: string
  errorCorrection?: QRCodeProps['errorCorrection']
} = {}) {
  return <QRCode value={value} errorCorrection={errorCorrection} />
}
