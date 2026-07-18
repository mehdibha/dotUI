import {
  VideoPlayer,
  VideoPlayerControls,
  VideoPlayerFullscreenButton,
  VideoPlayerMuteButton,
  VideoPlayerPlayButton,
  VideoPlayerSeekSlider,
  VideoPlayerSkipButton,
  VideoPlayerTime,
  VideoPlayerVideo,
  VideoPlayerVolume,
  VideoPlayerVolumeSlider,
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
        <VideoPlayerSeekSlider />
        <div className="flex items-center gap-1">
          <VideoPlayerSkipButton seconds={-10} />
          <VideoPlayerPlayButton />
          <VideoPlayerSkipButton seconds={10} />
          <VideoPlayerVolume>
            <VideoPlayerMuteButton />
            <VideoPlayerVolumeSlider />
          </VideoPlayerVolume>
          <VideoPlayerTime />
          <VideoPlayerFullscreenButton className="ml-auto" />
        </div>
      </VideoPlayerControls>
    </VideoPlayer>
  )
}
