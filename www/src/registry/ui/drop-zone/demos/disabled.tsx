import { UploadIcon } from '@/registry/__generated__/icons'
import { DropZone, DropZoneLabel } from '@/registry/ui/drop-zone'

export default function Demo() {
  return (
    <DropZone isDisabled>
      <UploadIcon className="size-5" />
      <DropZoneLabel>Drag and drop files here</DropZoneLabel>
    </DropZone>
  )
}
