'use client'

import { useState } from 'react'

import {
  FileUpload,
  FileUploadItem,
  FileUploadList,
} from '@/registry/ui/file-upload'

interface UploadedFile {
  id: string
  name: string
  size: number
}

export default function Demo() {
  const [files, setFiles] = useState<UploadedFile[]>([
    { id: 'design-spec.pdf', name: 'design-spec.pdf', size: 248_000 },
  ])

  return (
    <div className="w-full max-w-md">
      <FileUpload
        description="PNG, JPG or PDF, up to 10MB"
        onAdd={(added) =>
          setFiles((prev) => [
            ...prev,
            ...added.map((file) => ({
              id: `${file.name}-${file.lastModified}`,
              name: file.name,
              size: file.size,
            })),
          ])
        }
      />
      {files.length > 0 && (
        <FileUploadList>
          {files.map((file) => (
            <FileUploadItem
              key={file.id}
              name={file.name}
              size={file.size}
              status="complete"
              onRemove={() =>
                setFiles((prev) => prev.filter((item) => item.id !== file.id))
              }
            />
          ))}
        </FileUploadList>
      )}
    </div>
  )
}
