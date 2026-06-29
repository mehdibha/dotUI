'use client'

import React from 'react'

import { ImageIcon, UploadIcon } from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import { FileTrigger } from '@/registry/ui/file-trigger'

export default function Demo() {
  const [images, setImages] = React.useState<string[]>([])
  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <div className="grid grid-cols-3 gap-2">
        {images.map((src, i) => (
          <img
            key={`${src}-${i}`}
            src={src}
            alt={`Upload ${i + 1}`}
            className="aspect-square w-full rounded-md border object-cover"
          />
        ))}
        <FileTrigger
          acceptedFileTypes={['image/*']}
          allowsMultiple
          onSelect={(e) => {
            if (e) {
              const urls = Array.from(e).map((file) =>
                URL.createObjectURL(file),
              )
              setImages((prev) => [...prev, ...urls])
            }
          }}
        >
          <Button
            variant="quiet"
            aria-label="Add images"
            className="flex aspect-square size-full flex-col gap-1 border border-dashed text-fg-muted"
          >
            <ImageIcon className="size-5" />
          </Button>
        </FileTrigger>
      </div>
      <FileTrigger
        acceptedFileTypes={['image/*']}
        allowsMultiple
        onSelect={(e) => {
          if (e) {
            const urls = Array.from(e).map((file) => URL.createObjectURL(file))
            setImages((prev) => [...prev, ...urls])
          }
        }}
      >
        <Button variant="default" size="sm" className="w-full">
          <UploadIcon /> Upload images
        </Button>
      </FileTrigger>
    </div>
  )
}
