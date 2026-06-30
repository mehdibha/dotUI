/**
 * The container for a video call. Renders a dark stage that auto-lays out its
 * participant tiles into a responsive grid. Pair it with a `VideoCallControls`
 * bar to build a complete call surface.
 */
export interface VideoCallUiProps extends React.ComponentProps<'div'> {
  /**
   * Number of columns in the tile grid. When omitted, the grid lays out
   * automatically: 1 tile → 1 column, 2 → 2 columns, 3 or more → 3 columns.
   */
  columns?: number
}

/**
 * A single participant tile. Renders a 16:9 video area (poster, live `<video>`
 * via `VideoCallTileVideo`, or custom children), the participant's name label,
 * and a muted-mic indicator. When the camera is off it falls back to an avatar.
 */
export interface VideoCallTileProps extends React.ComponentProps<'div'> {
  /**
   * The participant's display name, shown in the bottom-left label and used to
   * derive the avatar fallback initials.
   */
  name?: string

  /**
   * Poster image rendered in the video area, e.g. the last received frame or a
   * thumbnail. Ignored when the camera is off.
   */
  poster?: string

  /**
   * Whether the participant's microphone is muted. Shows a muted-mic indicator.
   * @default false
   */
  isMuted?: boolean

  /**
   * Whether the participant's camera is off. Falls back to the avatar (or custom
   * children) placeholder instead of the video area.
   * @default false
   */
  isCameraOff?: boolean
}

/**
 * A live `<video>` element scoped to a `VideoCallTile`. Wire a `MediaStream` or
 * a LiveKit track's `attach()` target to it. Renders nothing while the tile's
 * camera is off.
 */
export interface VideoCallTileVideoProps extends React.ComponentProps<'video'> {}

/**
 * The control bar of a video call. A horizontal toolbar that holds the call's
 * toggle buttons (mic, camera, screen share) and the leave button.
 */
export interface VideoCallControlsProps extends React.ComponentProps<'div'> {}

/**
 * An icon-only toggle button for the control bar (mic, camera, screen share).
 * Reflects its on/off state via `aria-pressed` and a danger style when inactive.
 */
export interface VideoCallControlButtonProps extends React.ComponentProps<'button'> {
  /**
   * Whether the control is active (e.g. mic on, camera on). When `false`, the
   * button reads as the "off" state and adopts the danger style.
   * @default true
   */
  isActive?: boolean

  /**
   * The visual style of the underlying button. Overrides the active/inactive
   * default styling when set.
   */
  variant?: 'default' | 'primary' | 'quiet' | 'link' | 'warning' | 'danger'
}

/**
 * The danger button that ends/leaves the call. Defaults to a phone-off icon and
 * a "Leave" label; pass children to override.
 */
export interface VideoCallLeaveButtonProps extends React.ComponentProps<'button'> {}
