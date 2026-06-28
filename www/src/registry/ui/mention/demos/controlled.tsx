'use client'

import * as React from 'react'

import {
  Mention,
  MentionInput,
  MentionItem,
  MentionList,
} from '@/registry/ui/mention'

const people = [
  { id: 'alexmiller' },
  { id: 'sarahjones' },
  { id: 'davidkim' },
  { id: 'emmawatson' },
]

export default function Demo() {
  const [value, setValue] = React.useState('Hey ')
  return (
    <div className="flex w-[320px] flex-col gap-2">
      <Mention value={value} onChange={setValue}>
        <MentionInput
          label="Comment"
          placeholder="Type @ to mention someone..."
        />
        <MentionList items={people}>
          {(person) => (
            <MentionItem id={person.id} textValue={person.id}>
              @{person.id}
            </MentionItem>
          )}
        </MentionList>
      </Mention>
      <p className="text-sm text-fg-muted">Value: {value}</p>
    </div>
  )
}
