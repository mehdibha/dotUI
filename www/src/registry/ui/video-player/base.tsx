'use client'

import { useEffect, useRef, useState } from 'react'
import type { ComponentProps } from 'react'
import {
  MaximizeIcon,
  MinimizeIcon,
  PauseIcon,
  PictureInPicture2Icon,
  PlayIcon,
  Volume2Icon,
  VolumeXIcon,
} from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { Slider, SliderControl } from '@/registry/ui/slider'

import { useStyles } from './styles'

// MARK: VideoPlayer

interface VideoPlayerProps extends ComponentProps<'video'> {
  src: string
}

const VideoPlayer = ({ src, className, ...props }: VideoPlayerProps) => {
  const { root, video, bigButton, controls, time, spacer } = useStyles()()
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volumeLevel, setVolumeLevel] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const node = videoRef.current
    if (!node) return
    const onTime = () => setCurrentTime(node.currentTime)
    const onMeta = () => setDuration(node.duration)
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onEnded = () => setIsPlaying(false)
    const onVolume = () => {
      setVolumeLevel(node.volume)
      setIsMuted(node.muted)
    }
    node.addEventListener('timeupdate', onTime)
    node.addEventListener('loadedmetadata', onMeta)
    node.addEventListener('durationchange', onMeta)
    node.addEventListener('play', onPlay)
    node.addEventListener('pause', onPause)
    node.addEventListener('ended', onEnded)
    node.addEventListener('volumechange', onVolume)
    return () => {
      node.removeEventListener('timeupdate', onTime)
      node.removeEventListener('loadedmetadata', onMeta)
      node.removeEventListener('durationchange', onMeta)
      node.removeEventListener('play', onPlay)
      node.removeEventListener('pause', onPause)
      node.removeEventListener('ended', onEnded)
      node.removeEventListener('volumechange', onVolume)
    }
  }, [])

  useEffect(() => {
    const onFullscreen = () =>
      setIsFullscreen(document.fullscreenElement != null)
    document.addEventListener('fullscreenchange', onFullscreen)
    return () => document.removeEventListener('fullscreenchange', onFullscreen)
  }, [])

  const togglePlay = () => {
    const node = videoRef.current
    if (!node) return
    if (node.paused) void node.play()
    else node.pause()
  }

  const handleSeek = (value: number | number[]) => {
    const node = videoRef.current
    if (!node) return
    const next = Array.isArray(value) ? (value[0] ?? 0) : value
    node.currentTime = next
    setCurrentTime(next)
  }

  const handleVolume = (value: number | number[]) => {
    const node = videoRef.current
    if (!node) return
    const next = Array.isArray(value) ? (value[0] ?? 0) : value
    node.volume = next
    node.muted = next === 0
  }

  const toggleMute = () => {
    const node = videoRef.current
    if (node) node.muted = !node.muted
  }

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen()
    else void containerRef.current?.requestFullscreen()
  }

  const togglePip = () => {
    const node = videoRef.current
    if (!node) return
    if (document.pictureInPictureElement) void document.exitPictureInPicture()
    else void node.requestPictureInPicture()
  }

  const showVolumeOff = isMuted || volumeLevel === 0

  return (
    <div
      ref={containerRef}
      data-video-player=""
      data-paused={!isPlaying || undefined}
      className={root({ className })}
    >
      <video
        ref={videoRef}
        src={src}
        className={video()}
        playsInline
        {...props}
      />
      {!isPlaying && (
        <button
          type="button"
          aria-label="Play"
          className={bigButton()}
          onClick={togglePlay}
        >
          <PlayIcon />
        </button>
      )}
      <div data-video-player-controls="" className={controls()}>
        <Slider
          aria-label="Seek"
          value={Math.min(currentTime, duration || 0)}
          minValue={0}
          maxValue={duration || 1}
          step={0.1}
          onChange={handleSeek}
        >
          <SliderControl />
        </Slider>
        <div className="flex items-center gap-1">
          <Button
            variant="quiet"
            size="sm"
            isIconOnly
            onPress={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </Button>
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
            className="hidden w-16 sm:flex"
            value={isMuted ? 0 : volumeLevel}
            minValue={0}
            maxValue={1}
            step={0.01}
            onChange={handleVolume}
          >
            <SliderControl />
          </Slider>
          <span className={time()}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <span className={spacer()} />
          <Button
            variant="quiet"
            size="sm"
            isIconOnly
            onPress={togglePip}
            aria-label="Picture in picture"
          >
            <PictureInPicture2Icon />
          </Button>
          <Button
            variant="quiet"
            size="sm"
            isIconOnly
            onPress={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <MinimizeIcon /> : <MaximizeIcon />}
          </Button>
        </div>
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

export type { VideoPlayerProps }
export { VideoPlayer }
