'use client'

import React from 'react'

import {
  FileTextIcon,
  TrashIcon,
  UploadIcon,
} from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { FileTrigger } from '@/registry/ui/file-trigger'

export default function Demo() {
  const [docs, setDocs] = React.useState<string[]>([])
  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <FileTrigger
        acceptedFileTypes={[
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ]}
        allowsMultiple
        onSelect={(e) => {
          if (e) {
            const names = Array.from(e).map((file) => file.name)
            setDocs((prev) => [...prev, ...names])
          }
        }}
      >
        <Button variant="default" className="w-full">
          <UploadIcon /> Upload documents
        </Button>
      </FileTrigger>
      {docs.length > 0 && (
        <ul className="flex flex-col gap-1">
          {docs.map((name, i) => (
            <li
              key={`${name}-${i}`}
              className="flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-sm"
            >
              <FileTextIcon className="size-4 shrink-0 text-fg-muted" />
              <span className="flex-1 truncate">{name}</span>
              <Button
                variant="quiet"
                size="xs"
                isIconOnly
                aria-label={`Remove ${name}`}
                onPress={() =>
                  setDocs((prev) => prev.filter((_, idx) => idx !== i))
                }
              >
                <TrashIcon />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
