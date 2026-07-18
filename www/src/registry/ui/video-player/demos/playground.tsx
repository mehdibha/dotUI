'use client'

import {
  VideoPlayer,
  VideoPlayerControls,
  VideoPlayerVideo,
} from '@/registry/ui/video-player'

export default function Demo({
  muted = false,
  loop = false,
}: {
  muted?: boolean
  loop?: boolean
} = {}) {
  return (
    <VideoPlayer className="max-w-xl">
      <VideoPlayerVideo
        data-control-target
        src="https://media.w3.org/2010/05/sintel/trailer.mp4"
        poster="https://media.w3.org/2010/05/sintel/poster.png"
        preload="metadata"
        muted={muted}
        loop={loop}
      />
      <VideoPlayerControls />
    </VideoPlayer>
  )
}
