import { AudioPlayer } from '@/registry/ui/audio-player'

export default function Demo() {
  return (
    <AudioPlayer
      className="max-w-md"
      src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
      title="Midnight City"
      artist="SoundHelix"
    />
  )
}
