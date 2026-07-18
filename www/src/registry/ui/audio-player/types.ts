import type * as SliderPrimitives from 'react-aria-components/Slider'

/**
 * An audio player plays a sound source and renders controls for it. It manages
 * the underlying `audio` element and shares playback state with its parts.
 * Without children it renders a default composition: play button, elapsed
 * time, seek slider, duration, and mute button.
 */
export interface AudioPlayerProps extends React.ComponentProps<'div'> {
  /** The URL of the audio to play. */
  src?: string

  /** Whether playback starts as soon as the audio can play. */
  autoPlay?: boolean

  /** Whether playback restarts from the beginning when the audio ends. */
  loop?: boolean

  /**
   * How much of the audio to load before playback.
   * @default "metadata"
   */
  preload?: 'none' | 'metadata' | 'auto'

  /** The CORS mode used to fetch the audio. */
  crossOrigin?: '' | 'anonymous' | 'use-credentials'

  /** Whether the player and all of its controls are disabled. */
  isDisabled?: boolean
}

/**
 * A button that toggles between playing and pausing the audio. Built on top of
 * the Button, so it shares its `variant` and `size`.
 */
export interface AudioPlayerPlayButtonProps extends React.ComponentProps<'button'> {
  /**
   * The visual style of the button.
   * @default "quiet"
   */
  variant?: 'default' | 'primary' | 'quiet' | 'link' | 'warning' | 'danger'

  /**
   * The size of the button.
   * @default "md"
   */
  size?: 'xs' | 'sm' | 'md' | 'lg'

  /**
   * Render the button as a square icon cell.
   * @default true
   */
  isIconOnly?: boolean

  /** Whether the button is disabled. Defaults to the player's `isDisabled`. */
  isDisabled?: boolean
}

/**
 * A button that skips playback forward or backward by a fixed number of
 * seconds. Built on top of the Button, so it shares its `variant` and `size`.
 */
export interface AudioPlayerSeekButtonProps extends React.ComponentProps<'button'> {
  /**
   * How many seconds to skip. Negative values skip backward.
   * @default 10
   */
  seconds?: number

  /**
   * The visual style of the button.
   * @default "quiet"
   */
  variant?: 'default' | 'primary' | 'quiet' | 'link' | 'warning' | 'danger'

  /**
   * The size of the button.
   * @default "md"
   */
  size?: 'xs' | 'sm' | 'md' | 'lg'

  /**
   * Render the button as a square icon cell.
   * @default true
   */
  isIconOnly?: boolean

  /** Whether the button is disabled. Defaults to the player's `isDisabled`. */
  isDisabled?: boolean
}

/**
 * A slider that displays and scrubs the playback position. Built on top of the
 * Slider; while dragging it previews the target position and seeks on release.
 */
export interface AudioPlayerSeekSliderProps extends Omit<
  React.ComponentProps<typeof SliderPrimitives.Slider>,
  | 'value'
  | 'defaultValue'
  | 'minValue'
  | 'maxValue'
  | 'onChange'
  | 'onChangeEnd'
> {}

/**
 * A text label displaying the elapsed time, the total duration, or the
 * remaining time of the audio.
 */
export interface AudioPlayerTimeProps extends React.ComponentProps<'span'> {
  /**
   * Which time to display.
   * @default "elapsed"
   */
  variant?: 'elapsed' | 'duration' | 'remaining'
}

/**
 * A button that toggles the audio's muted state. Its icon reflects the current
 * volume. Built on top of the Button, so it shares its `variant` and `size`.
 */
export interface AudioPlayerMuteButtonProps extends React.ComponentProps<'button'> {
  /**
   * The visual style of the button.
   * @default "quiet"
   */
  variant?: 'default' | 'primary' | 'quiet' | 'link' | 'warning' | 'danger'

  /**
   * The size of the button.
   * @default "md"
   */
  size?: 'xs' | 'sm' | 'md' | 'lg'

  /**
   * Render the button as a square icon cell.
   * @default true
   */
  isIconOnly?: boolean

  /** Whether the button is disabled. Defaults to the player's `isDisabled`. */
  isDisabled?: boolean
}

/**
 * A slider that displays and adjusts the audio volume. Built on top of the
 * Slider. Changing the volume while muted unmutes the audio.
 */
export interface AudioPlayerVolumeSliderProps extends Omit<
  React.ComponentProps<typeof SliderPrimitives.Slider>,
  'value' | 'defaultValue' | 'minValue' | 'maxValue' | 'onChange'
> {}
