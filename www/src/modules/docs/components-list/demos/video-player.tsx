import {
  VideoPlayer,
  VideoPlayerControls,
  VideoPlayerVideo,
} from '@/registry/ui/video-player'

export function VideoPlayerDemo() {
  return (
    <VideoPlayer className="w-md">
      <VideoPlayerVideo
        src="https://media.w3.org/2010/05/sintel/trailer.mp4"
        poster="https://media.w3.org/2010/05/sintel/poster.png"
        preload="none"
      />
      <VideoPlayerControls />
    </VideoPlayer>
  )
}
