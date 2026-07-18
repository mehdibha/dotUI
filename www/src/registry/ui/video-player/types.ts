import type * as ButtonPrimitives from 'react-aria-components/Button'
import type * as SliderPrimitives from 'react-aria-components/Slider'

interface VideoPlayerButtonProps extends React.ComponentProps<
  typeof ButtonPrimitives.Button
> {
  /**
   * The visual style of the button.
   * @default "quiet"
   */
  variant?: 'default' | 'primary' | 'quiet' | 'link' | 'warning' | 'danger'

  /**
   * The size of the button.
   * @default "sm"
   */
  size?: 'xs' | 'sm' | 'md' | 'lg'

  /**
   * Render the button as a square icon cell.
   * @default true
   */
  isIconOnly?: boolean
}

/**
 * A video player pairs a video element with composable playback controls. It
 * holds the shared playback state every part reads from.
 */
export interface VideoPlayerProps extends React.ComponentProps<'div'> {}

/**
 * The video element. Clicking it toggles playback, and its media events keep
 * the player state in sync.
 */
export interface VideoPlayerVideoProps extends React.ComponentProps<'video'> {}

/**
 * The control bar. Without children it renders the default layout: a seek bar
 * above a row with play, volume, time, and fullscreen controls. Overlay styles
 * fade it out while the video plays and the pointer is idle.
 */
export interface VideoPlayerControlsProps extends React.ComponentProps<'div'> {}

/**
 * A button that toggles playback. Built on top of Button, so it shares its
 * `variant` and `size`.
 */
export interface VideoPlayerPlayButtonProps extends VideoPlayerButtonProps {}

/**
 * A button that jumps the playhead by a fixed number of seconds. Built on top
 * of Button, so it shares its `variant` and `size`.
 */
export interface VideoPlayerSkipButtonProps extends VideoPlayerButtonProps {
  /**
   * How far to jump, in seconds. Negative values jump backwards.
   * @default 10
   */
  seconds?: number
}

/**
 * A button that toggles the muted state. Its icon reflects the current volume.
 * Built on top of Button, so it shares its `variant` and `size`.
 */
export interface VideoPlayerMuteButtonProps extends VideoPlayerButtonProps {}

/**
 * Groups the mute button and volume slider. Without children it renders both.
 */
export interface VideoPlayerVolumeProps extends React.ComponentProps<'div'> {}

/**
 * A slider that controls the volume. Built on top of Slider, so it follows the
 * design system's slider styles. Dragging it above zero unmutes the video.
 */
export interface VideoPlayerVolumeSliderProps extends React.ComponentProps<
  typeof SliderPrimitives.Slider
> {}

/**
 * A slider bound to the playhead. Built on top of Slider, so it follows the
 * design system's slider styles.
 */
export interface VideoPlayerSeekSliderProps extends React.ComponentProps<
  typeof SliderPrimitives.Slider
> {}

/**
 * Displays the elapsed and total time, like `1:04 / 3:36`.
 */
export interface VideoPlayerTimeProps extends React.ComponentProps<'span'> {}

/**
 * A button that toggles fullscreen on the whole player, so the controls stay
 * available. Built on top of Button, so it shares its `variant` and `size`.
 */
export interface VideoPlayerFullscreenButtonProps extends VideoPlayerButtonProps {}
