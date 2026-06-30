/**
 * A single image entry rendered in the lightbox grid and viewer.
 */
export interface LightboxImage {
  /** The image source URL. */
  src: string
  /**
   * Alternative text for the image. Also used as the viewer caption and the
   * thumbnail's accessible label.
   */
  alt?: string
}

/**
 * A media lightbox: a responsive grid of thumbnails that opens a fullscreen
 * viewer with previous/next navigation, a close button, and keyboard support
 * (ArrowLeft, ArrowRight, Escape).
 */
export interface LightboxProps extends React.ComponentProps<'div'> {
  /** The images to display in the grid and viewer. */
  images: LightboxImage[]
}

/**
 * The fullscreen viewer rendered inside the modal. Displays the active image
 * with previous/next controls, a counter, and an optional caption. Exposed for
 * advanced use; most consumers should use `Lightbox`.
 */
export interface LightboxViewerProps {
  /** The full set of images to navigate between. */
  images: LightboxImage[]
  /** The index of the currently displayed image. */
  index: number
  /** Called with the next index when the user navigates. */
  onIndexChange: (index: number) => void
  /** Called when the user requests to close the viewer. */
  onClose: () => void
}
