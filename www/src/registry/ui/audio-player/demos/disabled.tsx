import { AudioPlayer } from '@/registry/ui/audio-player'

export default function Demo() {
  return (
    <AudioPlayer
      src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
      isDisabled
      className="max-w-md"
    />
  )
}
