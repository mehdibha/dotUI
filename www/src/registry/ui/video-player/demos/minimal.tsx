import {
  VideoPlayer,
  VideoPlayerControls,
  VideoPlayerPlayButton,
  VideoPlayerSeekSlider,
  VideoPlayerTime,
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
      <VideoPlayerControls>
        <div className="flex items-center gap-1">
          <VideoPlayerPlayButton />
          <VideoPlayerSeekSlider className="flex-1" />
          <VideoPlayerTime />
        </div>
      </VideoPlayerControls>
    </VideoPlayer>
  )
}
