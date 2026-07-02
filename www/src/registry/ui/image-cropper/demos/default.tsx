'use client'

import * as React from 'react'

import { Button } from '@/registry/ui/button'
import { getCroppedImg, ImageCropper } from '@/registry/ui/image-cropper'
import type { CroppedArea } from '@/registry/ui/image-cropper'

const IMAGE_SRC =
  'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=800&q=80'

export default function Demo() {
  const [croppedAreaPixels, setCroppedAreaPixels] =
    React.useState<CroppedArea | null>(null)
  const [result, setResult] = React.useState<string | null>(null)

  const handleCrop = async () => {
    if (!croppedAreaPixels) return
    const dataUrl = await getCroppedImg(IMAGE_SRC, croppedAreaPixels)
    setResult(dataUrl)
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <ImageCropper
        image={IMAGE_SRC}
        aspect={1}
        onCropComplete={setCroppedAreaPixels}
      >
        <div className="flex justify-end">
          <Button size="sm" variant="primary" onPress={handleCrop}>
            Crop image
          </Button>
        </div>
      </ImageCropper>

      {result && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-fg-muted">Result</span>
          <img
            src={result}
            alt="Cropped result"
            className="size-16 rounded-(--image-cropper-radius) object-cover"
          />
        </div>
      )}
    </div>
  )
}
