'use client'

import { useEffect, useRef, useState } from 'react'

import { CastIcon } from '@/registry/__generated__/icons'
import { Button } from '@/registry/ui/button'
import {
  VideoPlayer,
  VideoPlayerControls,
  VideoPlayerFullscreenButton,
  VideoPlayerPlayButton,
  VideoPlayerSeekSlider,
  VideoPlayerTime,
  VideoPlayerVideo,
  VideoPlayerVolume,
} from '@/registry/ui/video-player'

type WebKitVideo = HTMLVideoElement & {
  webkitShowPlaybackTargetPicker?: () => void
}

export default function Demo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [castAvailable, setCastAvailable] = useState(false)

  // The button only enables when the browser reports a castable device.
  useEffect(() => {
    const video = videoRef.current as WebKitVideo | null
    if (!video) return
    const remote = video.remote
    if (!remote?.watchAvailability) {
      setCastAvailable(!!video.webkitShowPlaybackTargetPicker)
      return
    }
    let watchId: number | undefined
    remote
      .watchAvailability((available) => setCastAvailable(available))
      .then((id) => {
        watchId = id
      })
      .catch(() => setCastAvailable(false))
    return () => {
      if (watchId !== undefined) {
        remote.cancelWatchAvailability(watchId).catch(() => {})
      }
    }
  }, [])

  const cast = () => {
    const video = videoRef.current as WebKitVideo | null
    if (!video) return
    if (video.remote) {
      video.remote.prompt().catch(() => {})
    } else {
      video.webkitShowPlaybackTargetPicker?.()
    }
  }

  return (
    <VideoPlayer className="max-w-xl">
      <VideoPlayerVideo
        ref={videoRef}
        src="https://media.w3.org/2010/05/sintel/trailer.mp4"
        poster="https://media.w3.org/2010/05/sintel/poster.png"
        preload="metadata"
      />
      <VideoPlayerControls>
        <VideoPlayerSeekSlider />
        <div className="flex items-center gap-1">
          <VideoPlayerPlayButton />
          <VideoPlayerVolume />
          <VideoPlayerTime />
          <div className="ml-auto flex items-center gap-1">
            <Button
              aria-label="Cast"
              variant="quiet"
              size="sm"
              isIconOnly
              isDisabled={!castAvailable}
              onPress={cast}
            >
              <CastIcon />
            </Button>
            <VideoPlayerFullscreenButton />
          </div>
        </div>
      </VideoPlayerControls>
    </VideoPlayer>
  )
}
