'use client'

import React from 'react'

import { UploadIcon } from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { FileTrigger } from '@/registry/ui/file-trigger'

export default function Demo() {
  const [files, setFiles] = React.useState<string[] | null>(null)
  return (
    <div className="flex flex-col items-center gap-4">
      <FileTrigger
        acceptDirectory
        onSelect={(e) => {
          if (e) {
            const files = Array.from(e)
            const filenames = files.map((file) => file.name)
            setFiles(filenames)
          }
        }}
      >
        <Button>
          <UploadIcon /> Upload a directory
        </Button>
      </FileTrigger>
      {files && (
        <ul>
          {files.map((file) => (
            <li key={file}>{file}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
