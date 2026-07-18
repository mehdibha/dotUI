'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  MaximizeIcon,
  MinimizeIcon,
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
  RotateCwIcon,
  Volume1Icon,
  Volume2Icon,
  VolumeXIcon,
} from 'lucide-react'
import { chain } from 'react-aria'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'

import { Button } from '@/registry/ui/button'
import type { ButtonProps } from '@/registry/ui/button'
import {
  Slider,
  SliderControl,
  SliderFill,
  SliderThumb,
  SliderTrack,
} from '@/registry/ui/slider'
import type { SliderProps } from '@/registry/ui/slider'

import { useStyles } from './styles'

// MARK: videoPlayerStyles

// MARK: Separator

interface VideoPlayerContextValue {
  videoRef: React.RefObject<HTMLVideoElement | null>
  seekingRef: React.RefObject<boolean>
  playing: boolean
  muted: boolean
  volume: number
  currentTime: number
  duration: number
  fullscreen: boolean
  sync: () => void
  togglePlay: () => void
  toggleMute: () => void
  toggleFullscreen: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
}

const VideoPlayerContext = createContext<VideoPlayerContextValue | null>(null)

const useVideoPlayerContext = () => {
  const context = useContext(VideoPlayerContext)
  if (!context) {
    throw new Error('VideoPlayer parts must be used within a <VideoPlayer>.')
  }
  return context
}

const formatTime = (seconds: number) => {
  const total = Math.max(0, Math.floor(seconds))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = String(total % 60).padStart(2, '0')
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`
}

// MARK: Separator

interface VideoPlayerProps extends React.ComponentProps<'div'> {}

const VideoPlayer = ({ className, children, ...props }: VideoPlayerProps) => {
  const { root } = useStyles()()
  const rootRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const seekingRef = useRef(false)
  const idleTimer = useRef<number | undefined>(undefined)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [volume, setVolumeState] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [idle, setIdle] = useState(false)

  const wake = useCallback(() => {
    setIdle(false)
    window.clearTimeout(idleTimer.current)
    idleTimer.current = window.setTimeout(() => setIdle(true), 2500)
  }, [])

  useEffect(() => {
    if (playing) wake()
    else setIdle(false)
    return () => window.clearTimeout(idleTimer.current)
  }, [playing, wake])

  useEffect(() => {
    const onFullscreenChange = () =>
      setFullscreen(document.fullscreenElement === rootRef.current)
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () =>
      document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  const sync = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    setPlaying(!video.paused)
    setMuted(video.muted)
    setVolumeState(video.volume)
    setDuration(Number.isFinite(video.duration) ? video.duration : 0)
    if (!seekingRef.current) setCurrentTime(video.currentTime)
  }, [])

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) void video.play()
    else video.pause()
  }, [])

  const toggleMute = useCallback(() => {
    const video = videoRef.current
    if (video) video.muted = !video.muted
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement === rootRef.current) {
      void document.exitFullscreen()
    } else {
      void rootRef.current?.requestFullscreen()
    }
  }, [])

  const seek = useCallback((time: number) => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = time
    setCurrentTime(time)
  }, [])

  const setVolume = useCallback((value: number) => {
    const video = videoRef.current
    if (!video) return
    video.volume = value
    if (value > 0) video.muted = false
  }, [])

  const context = useMemo<VideoPlayerContextValue>(
    () => ({
      videoRef,
      seekingRef,
      playing,
      muted,
      volume,
      currentTime,
      duration,
      fullscreen,
      sync,
      togglePlay,
      toggleMute,
      toggleFullscreen,
      seek,
      setVolume,
    }),
    [
      playing,
      muted,
      volume,
      currentTime,
      duration,
      fullscreen,
      sync,
      togglePlay,
      toggleMute,
      toggleFullscreen,
      seek,
      setVolume,
    ],
  )

  return (
    <VideoPlayerContext.Provider value={context}>
      <div
        data-video-player=""
        {...props}
        ref={rootRef}
        data-idle={playing && idle ? '' : undefined}
        data-fullscreen={fullscreen ? '' : undefined}
        className={root({ className })}
        onPointerMove={chain(props.onPointerMove, wake)}
        onPointerLeave={chain(props.onPointerLeave, () => {
          window.clearTimeout(idleTimer.current)
          if (playing) setIdle(true)
        })}
      >
        {children}
      </div>
    </VideoPlayerContext.Provider>
  )
}

// MARK: Separator

interface VideoPlayerVideoProps extends React.ComponentProps<'video'> {}

const VideoPlayerVideo = ({
  className,
  ref,
  ...props
}: VideoPlayerVideoProps) => {
  const { video } = useStyles()()
  const { videoRef, sync, togglePlay } = useVideoPlayerContext()

  // The video may load (metadata included) before this mounts and attaches
  // the media event handlers, e.g. during hydration.
  useEffect(sync, [sync])

  return (
    <video
      data-video-player-video=""
      playsInline
      {...props}
      ref={(node) => {
        videoRef.current = node
        if (typeof ref === 'function') return ref(node)
        if (ref) ref.current = node
      }}
      className={video({ className })}
      onClick={chain(props.onClick, togglePlay)}
      onPlay={chain(props.onPlay, sync)}
      onPause={chain(props.onPause, sync)}
      onEnded={chain(props.onEnded, sync)}
      onTimeUpdate={chain(props.onTimeUpdate, sync)}
      onDurationChange={chain(props.onDurationChange, sync)}
      onLoadedMetadata={chain(props.onLoadedMetadata, sync)}
      onVolumeChange={chain(props.onVolumeChange, sync)}
    />
  )
}

// MARK: Separator

interface VideoPlayerControlsProps extends React.ComponentProps<'div'> {}

const VideoPlayerControls = ({
  className,
  children,
  ...props
}: VideoPlayerControlsProps) => {
  const { controls, row } = useStyles()()
  return (
    <div
      data-video-player-controls=""
      className={controls({ className })}
      {...props}
    >
      {children ?? (
        <>
          <VideoPlayerSeekSlider />
          <div data-video-player-row="" className={row()}>
            <VideoPlayerPlayButton />
            <VideoPlayerVolume />
            <VideoPlayerTime />
            <VideoPlayerFullscreenButton className="ml-auto" />
          </div>
        </>
      )}
    </div>
  )
}

// MARK: Separator

interface VideoPlayerPlayButtonProps extends ButtonProps {}

const VideoPlayerPlayButton = ({
  children,
  ...props
}: VideoPlayerPlayButtonProps) => {
  const { playing, togglePlay } = useVideoPlayerContext()
  return (
    <Button
      aria-label={playing ? 'Pause' : 'Play'}
      data-video-player-play-button=""
      variant="quiet"
      size="sm"
      isIconOnly
      {...props}
      onPress={chain(props.onPress, togglePlay)}
    >
      {children ?? (playing ? <PauseIcon /> : <PlayIcon />)}
    </Button>
  )
}

// MARK: Separator

interface VideoPlayerSkipButtonProps extends ButtonProps {
  seconds?: number
}

const VideoPlayerSkipButton = ({
  seconds = 10,
  children,
  ...props
}: VideoPlayerSkipButtonProps) => {
  const { videoRef, duration, seek } = useVideoPlayerContext()
  const skip = () => {
    const video = videoRef.current
    if (!video) return
    seek(Math.min(Math.max(video.currentTime + seconds, 0), duration || 0))
  }
  return (
    <Button
      aria-label={
        seconds < 0 ? `Back ${-seconds} seconds` : `Forward ${seconds} seconds`
      }
      data-video-player-skip-button=""
      variant="quiet"
      size="sm"
      isIconOnly
      {...props}
      onPress={chain(props.onPress, skip)}
    >
      {children ?? (seconds < 0 ? <RotateCcwIcon /> : <RotateCwIcon />)}
    </Button>
  )
}

// MARK: Separator

interface VideoPlayerMuteButtonProps extends ButtonProps {}

const VideoPlayerMuteButton = ({
  children,
  ...props
}: VideoPlayerMuteButtonProps) => {
  const { muted, volume, toggleMute } = useVideoPlayerContext()
  const VolumeIcon =
    muted || volume === 0
      ? VolumeXIcon
      : volume < 0.5
        ? Volume1Icon
        : Volume2Icon
  return (
    <Button
      aria-label={muted ? 'Unmute' : 'Mute'}
      data-video-player-mute-button=""
      variant="quiet"
      size="sm"
      isIconOnly
      {...props}
      onPress={chain(props.onPress, toggleMute)}
    >
      {children ?? <VolumeIcon />}
    </Button>
  )
}

// MARK: Separator

interface VideoPlayerVolumeProps extends React.ComponentProps<'div'> {}

const VideoPlayerVolume = ({
  className,
  children,
  ...props
}: VideoPlayerVolumeProps) => {
  const { volume } = useStyles()()
  return (
    <div
      data-video-player-volume=""
      className={volume({ className })}
      {...props}
    >
      {children ?? (
        <>
          <VideoPlayerMuteButton />
          <VideoPlayerVolumeSlider />
        </>
      )}
    </div>
  )
}

// MARK: Separator

interface VideoPlayerVolumeSliderProps extends SliderProps {}

const VideoPlayerVolumeSlider = ({
  className,
  children,
  ...props
}: VideoPlayerVolumeSliderProps) => {
  const { volumeSlider } = useStyles()()
  const { muted, volume, setVolume } = useVideoPlayerContext()
  return (
    <Slider
      aria-label="Volume"
      data-video-player-volume-slider=""
      value={muted ? 0 : volume}
      minValue={0}
      maxValue={1}
      step={0.05}
      {...props}
      className={composeRenderProps(className, (cn) =>
        volumeSlider({ className: cn }),
      )}
      onChange={chain(props.onChange, (value: number | number[]) =>
        setVolume(Array.isArray(value) ? (value[0] ?? 0) : value),
      )}
    >
      {children ?? <SliderControl />}
    </Slider>
  )
}

// MARK: Separator

interface VideoPlayerSeekSliderProps extends SliderProps {}

const VideoPlayerSeekSlider = ({
  className,
  children,
  ...props
}: VideoPlayerSeekSliderProps) => {
  const { seekSlider } = useStyles()()
  const { seekingRef, currentTime, duration, seek } = useVideoPlayerContext()
  const toValue = (value: number | number[]) =>
    Array.isArray(value) ? (value[0] ?? 0) : value
  return (
    <Slider
      aria-label="Seek"
      data-video-player-seek-slider=""
      value={currentTime}
      minValue={0}
      maxValue={duration || 100}
      step={1}
      {...props}
      className={composeRenderProps(className, (cn) =>
        seekSlider({ className: cn }),
      )}
      onChange={chain(props.onChange, (value: number | number[]) => {
        seekingRef.current = true
        seek(toValue(value))
      })}
      onChangeEnd={chain(props.onChangeEnd, (value: number | number[]) => {
        seekingRef.current = false
        seek(toValue(value))
      })}
    >
      {children ?? (
        <SliderControl>
          <SliderTrack>
            <SliderFill />
          </SliderTrack>
          <SliderThumb />
        </SliderControl>
      )}
    </Slider>
  )
}

// MARK: Separator

interface VideoPlayerTimeProps extends React.ComponentProps<'span'> {}

const VideoPlayerTime = ({
  className,
  children,
  ...props
}: VideoPlayerTimeProps) => {
  const { time } = useStyles()()
  const { currentTime, duration } = useVideoPlayerContext()
  return (
    <span data-video-player-time="" className={time({ className })} {...props}>
      {children ?? `${formatTime(currentTime)} / ${formatTime(duration)}`}
    </span>
  )
}

// MARK: Separator

interface VideoPlayerFullscreenButtonProps extends ButtonProps {}

const VideoPlayerFullscreenButton = ({
  children,
  ...props
}: VideoPlayerFullscreenButtonProps) => {
  const { fullscreen, toggleFullscreen } = useVideoPlayerContext()
  return (
    <Button
      aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      data-video-player-fullscreen-button=""
      variant="quiet"
      size="sm"
      isIconOnly
      {...props}
      onPress={chain(props.onPress, toggleFullscreen)}
    >
      {children ?? (fullscreen ? <MinimizeIcon /> : <MaximizeIcon />)}
    </Button>
  )
}

// MARK: Separator

export type {
  VideoPlayerControlsProps,
  VideoPlayerFullscreenButtonProps,
  VideoPlayerMuteButtonProps,
  VideoPlayerPlayButtonProps,
  VideoPlayerProps,
  VideoPlayerSeekSliderProps,
  VideoPlayerSkipButtonProps,
  VideoPlayerTimeProps,
  VideoPlayerVideoProps,
  VideoPlayerVolumeProps,
  VideoPlayerVolumeSliderProps,
}
export {
  VideoPlayer,
  VideoPlayerControls,
  VideoPlayerFullscreenButton,
  VideoPlayerMuteButton,
  VideoPlayerPlayButton,
  VideoPlayerSeekSlider,
  VideoPlayerSkipButton,
  VideoPlayerTime,
  VideoPlayerVideo,
  VideoPlayerVolume,
  VideoPlayerVolumeSlider,
}
