'use client'

import { useEffect, useRef, useState } from 'react'
import type { ComponentProps, ReactNode } from 'react'
import { PauseIcon, PlayIcon, Volume2Icon, VolumeXIcon } from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { Slider, SliderControl } from '@/registry/ui/slider'

import { useStyles } from './styles'

// MARK: AudioPlayer

interface AudioPlayerProps extends Omit<ComponentProps<'div'>, 'title'> {
  src: string
  title?: ReactNode
  artist?: ReactNode
}

const AudioPlayer = ({
  src,
  title,
  artist,
  className,
  ...props
}: AudioPlayerProps) => {
  const {
    root,
    info,
    title: titleStyle,
    artist: artistStyle,
    seek,
    time,
    volume,
  } = useStyles()()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volumeLevel, setVolumeLevel] = useState(1)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setCurrentTime(audio.currentTime)
    const onMeta = () => setDuration(audio.duration)
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onEnded = () => setIsPlaying(false)
    const onVolume = () => {
      setVolumeLevel(audio.volume)
      setIsMuted(audio.muted)
    }
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('durationchange', onMeta)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('volumechange', onVolume)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('durationchange', onMeta)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('volumechange', onVolume)
    }
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) void audio.play()
    else audio.pause()
  }

  const handleSeek = (value: number | number[]) => {
    const audio = audioRef.current
    if (!audio) return
    const next = Array.isArray(value) ? (value[0] ?? 0) : value
    audio.currentTime = next
    setCurrentTime(next)
  }

  const handleVolume = (value: number | number[]) => {
    const audio = audioRef.current
    if (!audio) return
    const next = Array.isArray(value) ? (value[0] ?? 0) : value
    audio.volume = next
    audio.muted = next === 0
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
  }

  const showVolumeOff = isMuted || volumeLevel === 0

  return (
    <div data-audio-player="" className={root({ className })} {...props}>
      <audio ref={audioRef} src={src} preload="metadata" />
      <Button
        variant="default"
        size="sm"
        isIconOnly
        onPress={togglePlay}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </Button>
      <div className={info()}>
        {(title || artist) && (
          <div className="flex items-baseline gap-1.5 truncate">
            {title && <span className={titleStyle()}>{title}</span>}
            {artist && <span className={artistStyle()}>{artist}</span>}
          </div>
        )}
        <div className={seek()}>
          <span className={time()}>{formatTime(currentTime)}</span>
          <Slider
            aria-label="Seek"
            className="flex-1"
            value={Math.min(currentTime, duration || 0)}
            minValue={0}
            maxValue={duration || 1}
            step={0.1}
            onChange={handleSeek}
          >
            <SliderControl />
          </Slider>
          <span className={time()}>{formatTime(duration)}</span>
        </div>
      </div>
      <div className={volume()}>
        <Button
          variant="quiet"
          size="sm"
          isIconOnly
          onPress={toggleMute}
          aria-label={showVolumeOff ? 'Unmute' : 'Mute'}
        >
          {showVolumeOff ? <VolumeXIcon /> : <Volume2Icon />}
        </Button>
        <Slider
          aria-label="Volume"
          className="hidden w-20 sm:flex"
          value={isMuted ? 0 : volumeLevel}
          minValue={0}
          maxValue={1}
          step={0.01}
          onChange={handleVolume}
        >
          <SliderControl />
        </Slider>
      </div>
    </div>
  )
}

// MARK: formatTime

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

// MARK: Separator

export type { AudioPlayerProps }
export { AudioPlayer }
