import { PdfViewer } from '@/registry/ui/pdf-viewer'

export default function Demo() {
  return (
    <PdfViewer
      file="https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf"
      className="mx-auto max-w-xl"
    />
  )
}
