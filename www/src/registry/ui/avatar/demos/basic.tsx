import { Avatar, AvatarFallback, AvatarImage } from '@/registry/ui/avatar'

export default function Demo() {
  return (
    <Avatar>
      <AvatarImage src="https://github.com/mehdibha.png" alt="@mehdibha" />
      <AvatarFallback>M</AvatarFallback>
    </Avatar>
  )
}
