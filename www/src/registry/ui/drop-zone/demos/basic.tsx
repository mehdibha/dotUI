import { UploadIcon } from '@/registry/__generated__/icons'
import { DropZone } from '@/registry/ui/drop-zone'

export default function Demo() {
  return (
    <DropZone>
      <UploadIcon className="size-5 text-fg-muted" />
    </DropZone>
  )
}
