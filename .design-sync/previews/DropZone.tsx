import { UploadIcon } from 'lucide-react'
import { Button, DropZone, DropZoneLabel, FileTrigger } from 'www'

export const Basic = () => (
  <DropZone>
    <UploadIcon style={{ width: 20, height: 20 }} />
  </DropZone>
)

export const WithLabel = () => (
  <DropZone>
    <UploadIcon style={{ width: 20, height: 20 }} />
    <DropZoneLabel>Drag and drop files here</DropZoneLabel>
  </DropZone>
)

export const WithFileTrigger = () => (
  <DropZone style={{ width: 280 }}>
    <UploadIcon style={{ width: 20, height: 20 }} />
    <DropZoneLabel>Drag and drop files here</DropZoneLabel>
    <FileTrigger>
      <Button>Select files</Button>
    </FileTrigger>
  </DropZone>
)
