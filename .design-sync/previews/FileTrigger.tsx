import { ImageIcon, UploadIcon } from 'lucide-react'
import { Button, FileTrigger } from 'www'

export const Default = () => (
  <FileTrigger>
    <Button>
      <UploadIcon /> Upload
    </Button>
  </FileTrigger>
)

export const ImageOnly = () => (
  <FileTrigger acceptedFileTypes={['image/*']}>
    <Button variant="primary">
      <ImageIcon /> Upload image
    </Button>
  </FileTrigger>
)

export const Multiple = () => (
  <FileTrigger allowsMultiple>
    <Button variant="default">
      <UploadIcon /> Select files
    </Button>
  </FileTrigger>
)
