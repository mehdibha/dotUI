import { Avatar, AvatarFallback, AvatarImage } from '@/registry/ui/avatar'
import { VoiceMessage } from '@/registry/ui/voice-message'

export default function Demo() {
  return (
    <div className="flex w-full max-w-md items-end gap-2">
      <Avatar>
        <AvatarImage src="https://i.pravatar.cc/80?img=12" alt="Olivia" />
        <AvatarFallback>OL</AvatarFallback>
      </Avatar>
      <VoiceMessage
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
        className="w-full"
      />
    </div>
  )
}
