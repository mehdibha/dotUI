import { CameraIcon } from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { FileTrigger } from '@/registry/ui/file-trigger'

export default function Demo() {
  return (
    <FileTrigger defaultCamera="environment">
      <Button>
        <CameraIcon /> Take a picture
      </Button>
    </FileTrigger>
  )
}
