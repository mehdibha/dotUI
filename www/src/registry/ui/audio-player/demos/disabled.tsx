import { AudioPlayer } from '@/registry/ui/audio-player'

export default function Demo() {
  return (
    <AudioPlayer
      src="/audio/audio-sample.mp3"
      isDisabled
      className="max-w-md"
    />
  )
}
