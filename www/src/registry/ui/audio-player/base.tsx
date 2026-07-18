'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
  RotateCwIcon,
  Volume1Icon,
  Volume2Icon,
  VolumeX,
} from 'lucide-react'
import { composeRenderProps } from 'react-aria-components/composeRenderProps'

import { Button } from '@/registry/ui/button'
import type { ButtonProps } from '@/registry/ui/button'
import { Slider, SliderControl } from '@/registry/ui/slider'
import type { SliderProps } from '@/registry/ui/slider'

import { useStyles } from './styles'

// MARK: AudioPlayer

interface AudioPlayerContextValue {
  isPlaying: boolean
  duration: number
  currentTime: number
  volume: number
  isMuted: boolean
  playbackRate: number
  isDisabled: boolean
  audioRef: React.RefObject<HTMLAudioElement | null>
  play: () => void
  pause: () => void
  toggle: () => void
  seek: (time: number) => void
  seekBy: (seconds: number) => void
  setVolume: (volume: number) => void
  toggleMuted: () => void
  setPlaybackRate: (rate: number) => void
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null)

const useAudioPlayer = (): AudioPlayerContextValue => {
  const context = useContext(AudioPlayerContext)
  if (!context) {
    throw new Error('useAudioPlayer must be used within an <AudioPlayer>')
  }
  return context
}

const formatTime = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const total = Math.floor(seconds)
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor(total / 60) % 60
  const rest = String(total % 60).padStart(2, '0')
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, '0')}:${rest}`
    : `${minutes}:${rest}`
}

interface AudioPlayerProps extends React.ComponentProps<'div'> {
  src?: string
  autoPlay?: boolean
  loop?: boolean
  preload?: 'none' | 'metadata' | 'auto'
  crossOrigin?: '' | 'anonymous' | 'use-credentials'
  isDisabled?: boolean
}

const AudioPlayer = ({
  src,
  autoPlay,
  loop,
  preload = 'metadata',
  crossOrigin,
  isDisabled = false,
  className,
  children,
  ...props
}: AudioPlayerProps) => {
  const { root } = useStyles()()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolumeState] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRateState] = useState(1)

  // The audio can load (or start, with `autoPlay`) before hydration attaches
  // the event handlers below — sync the state it may have reached silently.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (Number.isFinite(audio.duration)) setDuration(audio.duration)
    setCurrentTime(audio.currentTime)
    setVolumeState(audio.volume)
    setIsMuted(audio.muted)
    setPlaybackRateState(audio.playbackRate)
    setIsPlaying(!audio.paused)
  }, [])

  const context = useMemo<AudioPlayerContextValue>(() => {
    const seek = (time: number) => {
      const audio = audioRef.current
      if (!audio) return
      audio.currentTime = Math.max(0, Math.min(time, duration || Infinity))
      setCurrentTime(audio.currentTime)
    }
    const play = () => {
      void audioRef.current?.play().catch(() => {})
    }
    const pause = () => audioRef.current?.pause()
    return {
      isPlaying,
      duration,
      currentTime,
      volume,
      isMuted,
      playbackRate,
      isDisabled,
      audioRef,
      play,
      pause,
      toggle: () => (audioRef.current?.paused ? play() : pause()),
      seek,
      seekBy: (seconds) => seek((audioRef.current?.currentTime ?? 0) + seconds),
      setVolume: (value) => {
        const audio = audioRef.current
        if (!audio) return
        audio.volume = Math.max(0, Math.min(value, 1))
        if (audio.muted && value > 0) audio.muted = false
      },
      toggleMuted: () => {
        const audio = audioRef.current
        if (audio) audio.muted = !audio.muted
      },
      setPlaybackRate: (rate) => {
        const audio = audioRef.current
        if (audio) audio.playbackRate = rate
      },
    }
  }, [
    isPlaying,
    duration,
    currentTime,
    volume,
    isMuted,
    playbackRate,
    isDisabled,
  ])

  return (
    <div
      role="group"
      aria-label="Audio player"
      data-audio-player=""
      data-playing={isPlaying || undefined}
      data-disabled={isDisabled || undefined}
      className={root({ className })}
      {...props}
    >
      <audio
        ref={audioRef}
        src={src}
        autoPlay={autoPlay}
        loop={loop}
        preload={preload}
        crossOrigin={crossOrigin}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onDurationChange={(e) => {
          const value = e.currentTarget.duration
          setDuration(Number.isFinite(value) ? value : 0)
        }}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onVolumeChange={(e) => {
          setVolumeState(e.currentTarget.volume)
          setIsMuted(e.currentTarget.muted)
        }}
        onRateChange={(e) => setPlaybackRateState(e.currentTarget.playbackRate)}
      />
      <AudioPlayerContext.Provider value={context}>
        {children ?? (
          <>
            <AudioPlayerPlayButton />
            <AudioPlayerTime />
            <AudioPlayerSeekSlider />
            <AudioPlayerTime variant="duration" />
            <AudioPlayerMuteButton />
          </>
        )}
      </AudioPlayerContext.Provider>
    </div>
  )
}

// MARK: AudioPlayerPlayButton

interface AudioPlayerPlayButtonProps extends ButtonProps {}

const AudioPlayerPlayButton = ({
  variant,
  isIconOnly = true,
  isDisabled,
  onPress,
  children,
  ...props
}: AudioPlayerPlayButtonProps) => {
  const player = useAudioPlayer()
  return (
    <Button
      aria-label={player.isPlaying ? 'Pause' : 'Play'}
      data-audio-player-play-button=""
      variant={variant ?? 'quiet'}
      isIconOnly={isIconOnly}
      isDisabled={isDisabled ?? player.isDisabled}
      onPress={(e) => {
        player.toggle()
        onPress?.(e)
      }}
      {...props}
    >
      {children ?? (player.isPlaying ? <PauseIcon /> : <PlayIcon />)}
    </Button>
  )
}

// MARK: AudioPlayerSeekButton

interface AudioPlayerSeekButtonProps extends ButtonProps {
  seconds?: number
}

const AudioPlayerSeekButton = ({
  seconds = 10,
  variant,
  isIconOnly = true,
  isDisabled,
  onPress,
  children,
  ...props
}: AudioPlayerSeekButtonProps) => {
  const player = useAudioPlayer()
  const isBackward = seconds < 0
  return (
    <Button
      aria-label={
        isBackward ? `Back ${-seconds} seconds` : `Forward ${seconds} seconds`
      }
      data-audio-player-seek-button=""
      variant={variant ?? 'quiet'}
      isIconOnly={isIconOnly}
      isDisabled={isDisabled ?? player.isDisabled}
      onPress={(e) => {
        player.seekBy(seconds)
        onPress?.(e)
      }}
      {...props}
    >
      {children ?? (isBackward ? <RotateCcwIcon /> : <RotateCwIcon />)}
    </Button>
  )
}

// MARK: AudioPlayerSeekSlider

interface AudioPlayerSeekSliderProps extends Omit<
  SliderProps,
  | 'value'
  | 'defaultValue'
  | 'minValue'
  | 'maxValue'
  | 'onChange'
  | 'onChangeEnd'
> {}

const AudioPlayerSeekSlider = ({
  isDisabled,
  className,
  children,
  ...props
}: AudioPlayerSeekSliderProps) => {
  const { seekSlider } = useStyles()()
  const player = useAudioPlayer()
  // While scrubbing, show the drag position; the seek commits on release.
  const [dragValue, setDragValue] = useState<number | null>(null)
  return (
    <Slider
      aria-label="Seek"
      data-audio-player-seek-slider=""
      value={dragValue ?? player.currentTime}
      minValue={0}
      maxValue={player.duration || 1}
      step={1}
      onChange={(value) => setDragValue(value as number)}
      onChangeEnd={(value) => {
        setDragValue(null)
        player.seek(value as number)
      }}
      isDisabled={isDisabled ?? (player.isDisabled || player.duration === 0)}
      className={composeRenderProps(className, (cn) =>
        seekSlider({ className: cn }),
      )}
      {...props}
    >
      {children ?? <SliderControl />}
    </Slider>
  )
}

// MARK: AudioPlayerTime

interface AudioPlayerTimeProps extends React.ComponentProps<'span'> {
  variant?: 'elapsed' | 'duration' | 'remaining'
}

const AudioPlayerTime = ({
  variant = 'elapsed',
  className,
  children,
  ...props
}: AudioPlayerTimeProps) => {
  const { time } = useStyles()()
  const player = useAudioPlayer()
  const value =
    variant === 'duration'
      ? player.duration
      : variant === 'remaining'
        ? Math.max(player.duration - player.currentTime, 0)
        : player.currentTime
  return (
    <span data-audio-player-time="" className={time({ className })} {...props}>
      {children ?? `${variant === 'remaining' ? '-' : ''}${formatTime(value)}`}
    </span>
  )
}

// MARK: AudioPlayerMuteButton

interface AudioPlayerMuteButtonProps extends ButtonProps {}

const AudioPlayerMuteButton = ({
  variant,
  isIconOnly = true,
  isDisabled,
  onPress,
  children,
  ...props
}: AudioPlayerMuteButtonProps) => {
  const player = useAudioPlayer()
  const isSilent = player.isMuted || player.volume === 0
  return (
    <Button
      aria-label={isSilent ? 'Unmute' : 'Mute'}
      data-audio-player-mute-button=""
      variant={variant ?? 'quiet'}
      isIconOnly={isIconOnly}
      isDisabled={isDisabled ?? player.isDisabled}
      onPress={(e) => {
        player.toggleMuted()
        onPress?.(e)
      }}
      {...props}
    >
      {children ??
        (isSilent ? (
          <VolumeX />
        ) : player.volume < 0.5 ? (
          <Volume1Icon />
        ) : (
          <Volume2Icon />
        ))}
    </Button>
  )
}

// MARK: AudioPlayerVolumeSlider

interface AudioPlayerVolumeSliderProps extends Omit<
  SliderProps,
  'value' | 'defaultValue' | 'minValue' | 'maxValue' | 'onChange'
> {}

const AudioPlayerVolumeSlider = ({
  isDisabled,
  className,
  children,
  ...props
}: AudioPlayerVolumeSliderProps) => {
  const { volumeSlider } = useStyles()()
  const player = useAudioPlayer()
  return (
    <Slider
      aria-label="Volume"
      data-audio-player-volume-slider=""
      value={player.isMuted ? 0 : player.volume}
      minValue={0}
      maxValue={1}
      step={0.05}
      onChange={(value) => player.setVolume(value as number)}
      isDisabled={isDisabled ?? player.isDisabled}
      className={composeRenderProps(className, (cn) =>
        volumeSlider({ className: cn }),
      )}
      {...props}
    >
      {children ?? <SliderControl />}
    </Slider>
  )
}

export type {
  AudioPlayerMuteButtonProps,
  AudioPlayerPlayButtonProps,
  AudioPlayerProps,
  AudioPlayerSeekButtonProps,
  AudioPlayerSeekSliderProps,
  AudioPlayerTimeProps,
  AudioPlayerVolumeSliderProps,
}
export {
  AudioPlayer,
  AudioPlayerMuteButton,
  AudioPlayerPlayButton,
  AudioPlayerSeekButton,
  AudioPlayerSeekSlider,
  AudioPlayerTime,
  AudioPlayerVolumeSlider,
  useAudioPlayer,
}
