'use client'

import { UploadIcon } from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { FileTrigger } from '@/registry/ui/file-trigger'

import { DemoPress, useAutoplay } from '../autoplay'

export function FileTriggerDemo() {
  const { phase } = useAutoplay([
    { name: 'idle', duration: 850 },
    { name: 'hover', duration: 520 },
    { name: 'press', duration: 260 },
  ])
  return (
    <FileTrigger onSelect={(e) => console.log(e)}>
      <DemoPress phase={phase}>
        <Button>
          <UploadIcon />
          Upload
        </Button>
      </DemoPress>
    </FileTrigger>
  )
}
