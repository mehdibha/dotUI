import { AudioPlayer } from '@/registry/ui/audio-player'

export default function Demo({
  isDisabled = false,
  loop = false,
}: {
  isDisabled?: boolean
  loop?: boolean
} = {}) {
  return (
    <AudioPlayer
      src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
      isDisabled={isDisabled}
      loop={loop}
      className="max-w-md"
    />
  )
}
