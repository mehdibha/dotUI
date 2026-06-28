'use client'

import React from 'react'

import { UploadIcon } from '@/registry/__generated__/icons'
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/ui/avatar'
import { Button } from '@/registry/ui/button'
import { FileTrigger } from '@/registry/ui/file-trigger'

export default function Demo() {
  const [src, setSrc] = React.useState<string | null>(null)
  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar size="lg">
        {src && <AvatarImage src={src} alt="Profile picture" />}
        <AvatarFallback>M</AvatarFallback>
      </Avatar>
      <FileTrigger
        acceptedFileTypes={['image/*']}
        onSelect={(e) => {
          if (e) {
            const file = Array.from(e)[0]
            if (file) setSrc(URL.createObjectURL(file))
          }
        }}
      >
        <Button variant="default" size="sm">
          <UploadIcon /> {src ? 'Change photo' : 'Upload photo'}
        </Button>
      </FileTrigger>
    </div>
  )
}
