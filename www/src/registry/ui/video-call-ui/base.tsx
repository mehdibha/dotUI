'use client'

import * as React from 'react'
import { MicOffIcon, PhoneOffIcon } from 'lucide-react'

import { createContext } from '@/registry/lib/context'
import { Avatar, AvatarFallback } from '@/registry/ui/avatar'
import { Button } from '@/registry/ui/button'

import { useStyles } from './styles'

// MARK: VideoCallUI

interface VideoCallUiProps extends React.ComponentProps<'div'> {
  /**
   * Number of columns in the tile grid. When omitted, the grid lays out
   * automatically from the number of `VideoCallTile` children: 1 → 1 column,
   * 2 → 2 columns, 3 or more → 3 columns.
   */
  columns?: number
}

function VideoCallUI({
  columns,
  className,
  style,
  children,
  ...props
}: VideoCallUiProps) {
  const { root } = useStyles()()

  // Auto-grid is driven by tile count only, so a control bar passed as a child
  // (with `col-span-full`) doesn't skew the column math.
  const tileCount = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === VideoCallTile,
  ).length
  const resolvedColumns =
    columns ?? (tileCount <= 1 ? 1 : tileCount === 2 ? 2 : 3)

  return (
    <div
      data-video-call-ui=""
      className={root({ className })}
      style={{
        gridTemplateColumns: `repeat(${resolvedColumns}, minmax(0, 1fr))`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}

// MARK: VideoCallTile

interface TileContextValue {
  isCameraOff: boolean
}

const [TileContext, useTileContext] = createContext<TileContextValue>({
  name: 'VideoCallTile',
  strict: true,
})

interface VideoCallTileProps extends React.ComponentProps<'div'> {
  /** The participant's display name, shown in the bottom-left label. */
  name?: string
  /** Poster image rendered in the video area (e.g. last received frame). */
  poster?: string
  /** Whether the participant's microphone is muted. Shows a muted indicator. */
  isMuted?: boolean
  /**
   * Whether the participant's camera is off. Falls back to the avatar/children
   * placeholder instead of the video area.
   */
  isCameraOff?: boolean
}

function VideoCallTile({
  name,
  poster,
  isMuted = false,
  isCameraOff = false,
  className,
  children,
  ...props
}: VideoCallTileProps) {
  const { tile, media, placeholder, label, labelText, mutedIndicator } =
    useStyles()()

  return (
    <TileContext value={{ isCameraOff }}>
      <div
        data-video-call-tile=""
        data-camera-off={isCameraOff ? '' : undefined}
        data-muted={isMuted ? '' : undefined}
        className={tile({ className })}
        {...props}
      >
        {isCameraOff ? (
          <div className={placeholder()}>
            {children ?? (
              <Avatar size="lg" className="size-16 text-lg">
                <AvatarFallback>{getInitials(name)}</AvatarFallback>
              </Avatar>
            )}
          </div>
        ) : poster ? (
          <img src={poster} alt={name ?? ''} className={media()} />
        ) : (
          children
        )}
        {name && (
          <div className={label()}>
            {isMuted && <MicOffIcon className="size-3 shrink-0" />}
            <span className={labelText()}>{name}</span>
          </div>
        )}
        {isMuted && !name && (
          <div className={mutedIndicator()}>
            <MicOffIcon />
          </div>
        )}
      </div>
    </TileContext>
  )
}

// MARK: VideoCallTileVideo

interface VideoCallTileVideoProps extends React.ComponentProps<'video'> {}

function VideoCallTileVideo({ className, ...props }: VideoCallTileVideoProps) {
  const { media } = useStyles()()
  const { isCameraOff } = useTileContext('VideoCallTileVideo')
  if (isCameraOff) return null
  return (
    <video
      data-video-call-tile-video=""
      className={media({ className })}
      {...props}
    />
  )
}

// MARK: VideoCallControls

interface VideoCallControlsProps extends React.ComponentProps<'div'> {}

function VideoCallControls({
  className,
  children,
  ...props
}: VideoCallControlsProps) {
  const { controls } = useStyles()()
  return (
    <div
      data-video-call-controls=""
      className={controls({ className })}
      {...props}
    >
      {children}
    </div>
  )
}

// MARK: VideoCallControlButton

interface VideoCallControlButtonProps extends React.ComponentProps<
  typeof Button
> {
  /** When `false`, the button reads as the "off" state (e.g. muted, camera off). */
  isActive?: boolean
}

function VideoCallControlButton({
  isActive = true,
  variant,
  ...props
}: VideoCallControlButtonProps) {
  return (
    <Button
      isIconOnly
      variant={variant ?? (isActive ? 'default' : 'danger')}
      aria-pressed={!isActive}
      {...props}
    />
  )
}

// MARK: VideoCallLeaveButton

interface VideoCallLeaveButtonProps extends React.ComponentProps<
  typeof Button
> {}

function VideoCallLeaveButton({
  children,
  ...props
}: VideoCallLeaveButtonProps) {
  return (
    <Button variant="danger" {...props}>
      {children ?? (
        <>
          <PhoneOffIcon data-icon-start="" />
          Leave
        </>
      )}
    </Button>
  )
}

// MARK: Helpers

function getInitials(name?: string): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return (first + last).toUpperCase() || '?'
}

// MARK: Exports

export type {
  VideoCallControlButtonProps,
  VideoCallControlsProps,
  VideoCallLeaveButtonProps,
  VideoCallTileProps,
  VideoCallTileVideoProps,
  VideoCallUiProps,
}
export {
  VideoCallControlButton,
  VideoCallControls,
  VideoCallLeaveButton,
  VideoCallTile,
  VideoCallTileVideo,
  VideoCallUI,
}
