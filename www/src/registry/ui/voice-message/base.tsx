'use client'

import * as React from 'react'
import { PauseIcon, PlayIcon } from 'lucide-react'
import WaveSurfer from 'wavesurfer.js'

import { Button } from '@/registry/ui/button'

import { useStyles } from './styles'

// MARK: voiceMessageStyles

// MARK: helpers

/**
 * wavesurfer needs concrete colors, not CSS variables, so resolve dotUI tokens
 * off a live element. Falls back to a sensible value when the var is unset
 * (e.g. during SSR or before the element is attached).
 */
function resolveColor(
  el: HTMLElement,
  token: string,
  fallback: string,
): string {
  const value = getComputedStyle(el).getPropertyValue(token).trim()
  return value.length > 0 ? value : fallback
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const total = Math.floor(seconds)
  const mins = Math.floor(total / 60)
  const secs = total % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// MARK: VoiceMessage

interface VoiceMessageProps extends Omit<
  React.ComponentProps<'div'>,
  'children'
> {
  /** The audio source URL to play. */
  src: string
  /**
   * Total duration in seconds, shown before the audio metadata loads. Once the
   * waveform is ready the real duration replaces it.
   */
  duration?: number
}

function VoiceMessage({
  src,
  duration,
  className,
  ...props
}: VoiceMessageProps) {
  const { root, waveform, time } = useStyles()()
  const waveformRef = React.useRef<HTMLDivElement>(null)
  const wavesurferRef = React.useRef<WaveSurfer | null>(null)

  const [isPlaying, setIsPlaying] = React.useState(false)
  const [isReady, setIsReady] = React.useState(false)
  const [totalDuration, setTotalDuration] = React.useState(duration ?? 0)
  const [elapsed, setElapsed] = React.useState(0)

  React.useEffect(() => {
    const container = waveformRef.current
    if (!container) return

    const ws = WaveSurfer.create({
      container,
      url: src,
      height: 32,
      barWidth: 2,
      barGap: 2,
      barRadius: 2,
      cursorWidth: 0,
      waveColor: resolveColor(container, '--color-fg-muted', '#a1a1aa'),
      progressColor: resolveColor(container, '--color-primary', '#6366f1'),
    })
    wavesurferRef.current = ws

    const subscriptions = [
      ws.on('ready', (dur) => {
        setIsReady(true)
        setTotalDuration(dur)
      }),
      ws.on('timeupdate', (current) => setElapsed(current)),
      ws.on('play', () => setIsPlaying(true)),
      ws.on('pause', () => setIsPlaying(false)),
      ws.on('finish', () => {
        setIsPlaying(false)
        setElapsed(0)
      }),
    ]

    return () => {
      for (const unsubscribe of subscriptions) unsubscribe()
      ws.destroy()
      wavesurferRef.current = null
    }
  }, [src])

  const togglePlay = () => {
    wavesurferRef.current?.playPause()
  }

  // Before playback the bubble shows the total length; once the user starts, it
  // counts the elapsed time like a typical voice message.
  const shownTime = isPlaying || elapsed > 0 ? elapsed : totalDuration

  return (
    <div data-voice-message="" className={root({ className })} {...props}>
      <Button
        variant="primary"
        aria-label={isPlaying ? 'Pause' : 'Play'}
        isDisabled={!isReady}
        onPress={togglePlay}
        isIconOnly
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </Button>
      <div ref={waveformRef} data-waveform="" className={waveform()} />
      <span data-time="" className={time()}>
        {formatTime(shownTime)}
      </span>
    </div>
  )
}

// MARK: exports

export type { VoiceMessageProps }
export { VoiceMessage }
