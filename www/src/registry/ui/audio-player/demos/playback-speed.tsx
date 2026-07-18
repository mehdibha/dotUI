import {
  AudioPlayer,
  AudioPlayerPlayButton,
  AudioPlayerSeekSlider,
  AudioPlayerTime,
  useAudioPlayer,
} from '@/registry/ui/audio-player'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/registry/ui/select'

function SpeedSelect() {
  const player = useAudioPlayer()
  return (
    <Select
      aria-label="Playback speed"
      className="w-auto"
      selectedKey={String(player.playbackRate)}
      onSelectionChange={(key) => player.setPlaybackRate(Number(key))}
      isDisabled={player.isDisabled}
    >
      <SelectTrigger size="sm" variant="quiet" />
      <SelectContent>
        <SelectItem id="0.75">0.75×</SelectItem>
        <SelectItem id="1">1×</SelectItem>
        <SelectItem id="1.25">1.25×</SelectItem>
        <SelectItem id="1.5">1.5×</SelectItem>
        <SelectItem id="2">2×</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default function Demo() {
  return (
    <AudioPlayer
      src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
      className="max-w-lg"
    >
      <AudioPlayerPlayButton />
      <AudioPlayerTime />
      <AudioPlayerSeekSlider />
      <AudioPlayerTime variant="duration" />
      <SpeedSelect />
    </AudioPlayer>
  )
}
