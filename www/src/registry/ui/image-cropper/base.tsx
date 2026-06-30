'use client'

import * as React from 'react'
import Cropper from 'react-easy-crop'
import type { Area, Point } from 'react-easy-crop'

import { Button } from '@/registry/ui/button'
import { Slider, SliderControl } from '@/registry/ui/slider'

import { useStyles } from './styles'

// MARK: imageCropperStyles

// MARK: helpers

type CroppedArea = Area

const ASPECT_PRESETS = [
  { label: 'Free', value: undefined },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '16:9', value: 16 / 9 },
] as const

/** Normalize a RAC Slider value (number | number[]) down to a single number. */
const toNumber = (value: number | number[]): number =>
  Array.isArray(value) ? (value[0] ?? 0) : value

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180

/**
 * Render the cropped region onto a canvas and return it as a data URL.
 * `rotation` is in degrees; pass the same value used by the cropper.
 */
async function getCroppedImg(
  imageSrc: string,
  croppedAreaPixels: CroppedArea,
  rotation = 0,
): Promise<string | null> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const radians = toRadians(rotation)
  const sin = Math.abs(Math.sin(radians))
  const cos = Math.abs(Math.cos(radians))
  const boxWidth = image.width * cos + image.height * sin
  const boxHeight = image.width * sin + image.height * cos

  // Draw the rotated source image onto an intermediate canvas.
  canvas.width = boxWidth
  canvas.height = boxHeight
  ctx.translate(boxWidth / 2, boxHeight / 2)
  ctx.rotate(radians)
  ctx.drawImage(image, -image.width / 2, -image.height / 2)

  const data = ctx.getImageData(0, 0, boxWidth, boxHeight)

  // Resize the canvas to the cropped region and paint the rotated pixels back.
  canvas.width = croppedAreaPixels.width
  canvas.height = croppedAreaPixels.height
  ctx.putImageData(
    data,
    Math.round(-boxWidth / 2 + image.width / 2 - croppedAreaPixels.x),
    Math.round(-boxHeight / 2 + image.height / 2 - croppedAreaPixels.y),
  )

  return canvas.toDataURL('image/png')
}

// MARK: ImageCropper

interface ImageCropperProps extends Omit<
  React.ComponentProps<'div'>,
  'onChange'
> {
  /** The source URL of the image to crop. */
  image: string
  /** The aspect ratio of the crop area (width / height). Omit for a free crop. */
  aspect?: number
  /** Show the zoom slider. */
  showZoom?: boolean
  /** Show the rotate slider. */
  showRotate?: boolean
  /** Show the aspect-ratio presets. */
  showAspectPresets?: boolean
  /** Called whenever the crop selection settles, with pixel coordinates. */
  onCropComplete?: (croppedAreaPixels: CroppedArea) => void
}

function ImageCropper({
  image,
  aspect: aspectProp,
  showZoom = true,
  showRotate = false,
  showAspectPresets = false,
  onCropComplete,
  className,
  children,
  ...props
}: ImageCropperProps) {
  const { root, cropper, controls, control, controlLabel, actions } =
    useStyles()()

  const [crop, setCrop] = React.useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = React.useState(1)
  const [rotation, setRotation] = React.useState(0)
  const [aspect, setAspect] = React.useState<number | undefined>(aspectProp)

  React.useEffect(() => {
    setAspect(aspectProp)
  }, [aspectProp])

  const handleCropComplete = React.useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      onCropComplete?.(croppedAreaPixels)
    },
    [onCropComplete],
  )

  return (
    <div data-image-cropper="" className={root({ className })} {...props}>
      <div data-image-cropper-surface="" className={cropper()}>
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          onCropComplete={handleCropComplete}
        />
      </div>

      <div data-image-cropper-controls="" className={controls()}>
        {showAspectPresets && (
          <div data-image-cropper-aspect="" className={actions()}>
            {ASPECT_PRESETS.map((preset) => (
              <Button
                key={preset.label}
                size="sm"
                variant={aspect === preset.value ? 'primary' : 'quiet'}
                onPress={() => setAspect(preset.value)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        )}

        {showZoom && (
          <div data-image-cropper-zoom="" className={control()}>
            <span className={controlLabel()}>Zoom</span>
            <Slider
              aria-label="Zoom"
              value={zoom}
              minValue={1}
              maxValue={3}
              step={0.01}
              onChange={(value) => setZoom(toNumber(value))}
              className="flex-1"
            >
              <SliderControl />
            </Slider>
          </div>
        )}

        {showRotate && (
          <div data-image-cropper-rotate="" className={control()}>
            <span className={controlLabel()}>Rotate</span>
            <Slider
              aria-label="Rotate"
              value={rotation}
              minValue={0}
              maxValue={360}
              step={1}
              onChange={(value) => setRotation(toNumber(value))}
              className="flex-1"
            >
              <SliderControl />
            </Slider>
          </div>
        )}

        {children}
      </div>
    </div>
  )
}

// MARK: separator

export type { CroppedArea, ImageCropperProps }
export { getCroppedImg, ImageCropper }
