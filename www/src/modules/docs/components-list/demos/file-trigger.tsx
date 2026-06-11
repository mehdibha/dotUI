'use client'

import { UploadIcon } from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { FileTrigger } from '@/registry/ui/file-trigger'

export function FileTriggerDemo() {
  return (
    <FileTrigger onSelect={(e) => console.log(e)}>
      <Button>
        <UploadIcon />
        Upload
      </Button>
    </FileTrigger>
  )
}
