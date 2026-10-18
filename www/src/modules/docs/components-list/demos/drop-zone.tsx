import { UploadIcon } from "@/registry/__generated__/icons"
import { DropZone } from "@/registry/ui/drop-zone"

export function DropZoneDemo() {
  return (
    <DropZone aria-label="Upload files">
      <UploadIcon className="size-5 text-fg-muted" />
      <span className="text-fg-muted">Drop files here</span>
    </DropZone>
  )
}
