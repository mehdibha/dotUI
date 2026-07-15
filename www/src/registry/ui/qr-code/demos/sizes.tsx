import { QRCode } from '@/registry/ui/qr-code'

export default function Sizes() {
  return (
    <div className="flex items-end gap-4">
      <QRCode value="https://dotui.org" className="size-20" />
      <QRCode value="https://dotui.org" className="size-32" />
      <QRCode value="https://dotui.org" className="size-44" />
    </div>
  )
}
