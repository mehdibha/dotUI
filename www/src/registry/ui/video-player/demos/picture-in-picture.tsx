'use client'

import { useRef } from 'react'

import { PictureInPictureIcon } from '@/registry/__generated__/icons'
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

export default function Demo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const togglePictureInPicture = async () => {
    const video = videoRef.current
    if (!video) return
    if (document.pictureInPictureElement === video) {
      await document.exitPictureInPicture()
    } else {
      await video.requestPictureInPicture()
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
              aria-label="Picture in picture"
              variant="quiet"
              size="sm"
              isIconOnly
              onPress={() => void togglePictureInPicture()}
            >
              <PictureInPictureIcon />
            </Button>
            <VideoPlayerFullscreenButton />
          </div>
        </div>
      </VideoPlayerControls>
    </VideoPlayer>
  )
}
