import {
  AudioPlayer,
  AudioPlayerMuteButton,
  AudioPlayerPlayButton,
  AudioPlayerSeekButton,
  AudioPlayerSeekSlider,
  AudioPlayerTime,
  AudioPlayerVolumeSlider,
} from '@/registry/ui/audio-player'

export default function Demo() {
  return (
    <AudioPlayer
      src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
      className="max-w-xl"
    >
      <AudioPlayerSeekButton seconds={-10} />
      <AudioPlayerPlayButton />
      <AudioPlayerSeekButton seconds={10} />
      <AudioPlayerTime />
      <AudioPlayerSeekSlider />
      <AudioPlayerTime variant="duration" />
      <AudioPlayerMuteButton />
      <AudioPlayerVolumeSlider />
    </AudioPlayer>
  )
}
