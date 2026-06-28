'use client'

import {
  Mention,
  MentionInput,
  MentionItem,
  MentionList,
} from '@/registry/ui/mention'

const usernames = [
  'alexmiller',
  'sarahjones',
  'davidkim',
  'emmawatson',
  'oliverliu',
  'ellagreen',
  'lucasbrown',
  'amandarivera',
  'masonlee',
  'nataliasmith',
].map((id) => ({ id }))

export default function Demo() {
  return (
    <Mention className="w-[320px]">
      <MentionInput
        label="Comment"
        placeholder="Type @ to mention someone..."
      />
      <MentionList
        items={usernames}
        renderEmptyState={() => 'No results found.'}
      >
        {(item) => (
          <MentionItem id={item.id} textValue={item.id}>
            {item.id}
          </MentionItem>
        )}
      </MentionList>
    </Mention>
  )
}
