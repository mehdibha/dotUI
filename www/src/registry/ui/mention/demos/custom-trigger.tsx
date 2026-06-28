'use client'

import {
  Mention,
  MentionInput,
  MentionItem,
  MentionList,
} from '@/registry/ui/mention'

const channels = [
  { id: 'general' },
  { id: 'random' },
  { id: 'design' },
  { id: 'engineering' },
  { id: 'product' },
  { id: 'marketing' },
]

export default function Demo() {
  return (
    <Mention trigger="#" className="w-[320px]">
      <MentionInput label="Message" placeholder="Type # to link a channel..." />
      <MentionList
        items={channels}
        renderEmptyState={() => 'No channels found.'}
      >
        {(channel) => (
          <MentionItem id={channel.id} textValue={channel.id}>
            #{channel.id}
          </MentionItem>
        )}
      </MentionList>
    </Mention>
  )
}
