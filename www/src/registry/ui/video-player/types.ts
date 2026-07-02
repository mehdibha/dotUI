import type { ComponentProps } from 'react'

/**
 * A video player renders a themeable control bar over a native `<video>`
 * element: play/pause, a seek slider, volume, time, picture-in-picture, and
 * fullscreen. Controls are built on React Aria `Button` and `Slider`, with no
 * media engine — only stable browser APIs (works with `hls.js` if you wire
 * streaming yourself). Extra props are forwarded to the `<video>` element.
 */
export interface VideoPlayerProps extends ComponentProps<'video'> {
  /** The video source URL. */
  src: string
}
