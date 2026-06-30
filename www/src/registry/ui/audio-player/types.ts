import type { ComponentProps, ReactNode } from 'react'

/**
 * An audio player renders a themeable control bar over a native `<audio>`
 * element: play/pause, a seek slider with elapsed/total time, and volume.
 * The transport controls are built on React Aria `Button` and `Slider`.
 */
export interface AudioPlayerProps extends Omit<ComponentProps<'div'>, 'title'> {
  /** The audio source URL. */
  src: string
  /** Track title shown in the now-playing area. */
  title?: ReactNode
  /** Artist / subtitle shown next to the title. */
  artist?: ReactNode
}
