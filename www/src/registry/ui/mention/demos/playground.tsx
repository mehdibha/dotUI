'use client'

import { Avatar, AvatarFallback } from '@/registry/ui/avatar'
import {
  Mention,
  MentionInput,
  MentionItem,
  MentionList,
} from '@/registry/ui/mention'

const people = [
  { id: 'alexmiller', name: 'Alex Miller' },
  { id: 'sarahjones', name: 'Sarah Jones' },
  { id: 'davidkim', name: 'David Kim' },
  { id: 'emmawatson', name: 'Emma Watson' },
  { id: 'oliverliu', name: 'Oliver Liu' },
  { id: 'ellagreen', name: 'Ella Green' },
  { id: 'lucasbrown', name: 'Lucas Brown' },
  { id: 'amandarivera', name: 'Amanda Rivera' },
]

export default function Demo({
  label = 'Comment',
  placeholder = 'Type @ to mention someone...',
} = {}) {
  return (
    <Mention className="w-[320px]">
      <MentionInput
        data-control-target
        label={label}
        placeholder={placeholder}
      />
      <MentionList items={people} renderEmptyState={() => 'No people found.'}>
        {(person) => (
          <MentionItem id={person.id} textValue={person.id}>
            <Avatar size="sm">
              <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm">{person.name}</span>
              <span className="text-xs text-fg-muted">@{person.id}</span>
            </div>
          </MentionItem>
        )}
      </MentionList>
    </Mention>
  )
}
