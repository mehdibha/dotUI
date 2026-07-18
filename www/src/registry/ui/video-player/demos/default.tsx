import {
  VideoPlayer,
  VideoPlayerControls,
  VideoPlayerVideo,
} from '@/registry/ui/video-player'

export default function Demo() {
  return (
    <VideoPlayer className="max-w-xl">
      <VideoPlayerVideo
        src="https://media.w3.org/2010/05/sintel/trailer.mp4"
        poster="https://media.w3.org/2010/05/sintel/poster.png"
        preload="metadata"
      />
      <VideoPlayerControls />
    </VideoPlayer>
  )
}
