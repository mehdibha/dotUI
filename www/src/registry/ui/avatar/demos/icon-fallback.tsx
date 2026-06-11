import { UserIcon } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/registry/ui/avatar'

export default function Demo() {
  return (
    <Avatar>
      <AvatarFallback>
        <UserIcon className="size-4" />
      </AvatarFallback>
    </Avatar>
  )
}
