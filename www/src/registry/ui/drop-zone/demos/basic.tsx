import { UploadIcon } from "@/registry/icons"
import { DropZone } from "@/registry/ui/drop-zone"

export default function Demo() {
  return (
    <DropZone>
      <UploadIcon className="size-5 text-fg-muted" />
    </DropZone>
  )
}
