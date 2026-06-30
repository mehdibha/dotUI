import type { Area } from 'react-easy-crop'

/**
 * An image cropper presents an interactive crop surface over an image, with
 * controls for zoom, rotation, and aspect ratio. It reports the cropped region
 * in pixel coordinates so you can produce the final image with `getCroppedImg`.
 */
export interface ImageCropperProps extends Omit<
  React.ComponentProps<'div'>,
  'onChange'
> {
  /**
   * The source URL of the image to crop.
   */
  image: string

  /**
   * The aspect ratio of the crop area, expressed as `width / height`.
   * Omit for a free-form crop.
   */
  aspect?: number

  /**
   * Whether to show the zoom slider.
   * @default true
   */
  showZoom?: boolean

  /**
   * Whether to show the rotate slider.
   * @default false
   */
  showRotate?: boolean

  /**
   * Whether to show the aspect-ratio presets.
   * @default false
   */
  showAspectPresets?: boolean

  /**
   * Called whenever the crop selection settles, with the cropped region in
   * pixel coordinates. Pass the result to `getCroppedImg` to render the output.
   */
  onCropComplete?: (croppedAreaPixels: Area) => void
}
