import {
  AudioPlayer,
  AudioPlayerPlayButton,
  AudioPlayerSeekSlider,
  AudioPlayerTime,
} from '@/registry/ui/audio-player'

export default function Demo() {
  return (
    <AudioPlayer
      src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
      className="max-w-2xs"
    >
      <AudioPlayerPlayButton size="sm" />
      <AudioPlayerSeekSlider />
      <AudioPlayerTime variant="remaining" />
    </AudioPlayer>
  )
}
