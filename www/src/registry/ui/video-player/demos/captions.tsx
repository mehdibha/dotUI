'use client'

import { useRef, useState } from 'react'

import { CaptionsIcon } from '@/registry/__generated__/icons'
import { ToggleButton } from '@/registry/ui/toggle-button'
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
  const [showCaptions, setShowCaptions] = useState(false)
  return (
    <VideoPlayer className="max-w-xl">
      <VideoPlayerVideo
        ref={videoRef}
        src="https://media.w3.org/2010/05/sintel/trailer.mp4"
        poster="https://media.w3.org/2010/05/sintel/poster.png"
        preload="metadata"
      >
        <track
          kind="captions"
          src="/captions/sintel-en.vtt"
          srcLang="en"
          label="English"
        />
      </VideoPlayerVideo>
      <VideoPlayerControls>
        <VideoPlayerSeekSlider />
        <div className="flex items-center gap-1">
          <VideoPlayerPlayButton />
          <VideoPlayerVolume />
          <VideoPlayerTime />
          <div className="ml-auto flex items-center gap-1">
            <ToggleButton
              aria-label="Captions"
              variant="quiet"
              size="sm"
              isIconOnly
              isSelected={showCaptions}
              onChange={(isSelected) => {
                const track = videoRef.current?.textTracks[0]
                if (track) track.mode = isSelected ? 'showing' : 'hidden'
                setShowCaptions(isSelected)
              }}
            >
              <CaptionsIcon />
            </ToggleButton>
            <VideoPlayerFullscreenButton />
          </div>
        </div>
      </VideoPlayerControls>
    </VideoPlayer>
  )
}
