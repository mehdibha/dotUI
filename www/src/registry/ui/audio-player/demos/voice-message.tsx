import {
  AudioPlayer,
  AudioPlayerPlayButton,
  AudioPlayerSeekSlider,
  AudioPlayerTime,
} from '@/registry/ui/audio-player'

export default function Demo() {
  return (
    <AudioPlayer src="/audio/audio-sample.mp3" className="max-w-2xs">
      <AudioPlayerPlayButton size="sm" />
      <AudioPlayerSeekSlider />
      <AudioPlayerTime variant="remaining" />
    </AudioPlayer>
  )
}
