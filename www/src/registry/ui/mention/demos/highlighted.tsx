'use client'

import * as React from 'react'

import { TextArea } from '@/registry/ui/input'
import { Mention } from '@/registry/ui/mention'
import { MenuContent, MenuItem } from '@/registry/ui/menu'
import { Popover } from '@/registry/ui/popover'

const people = [
  { id: 'alexmiller' },
  { id: 'sarahjones' },
  { id: 'davidkim' },
  { id: 'emmawatson' },
  { id: 'oliverliu' },
  { id: 'ellagreen' },
]

// Split the text into plain runs and `@mention` tokens so the overlay can color
// the mentions the way Twitter/X does.
function highlight(value: string) {
  const regex = /(^|\s)(@\w+)/g
  const nodes: React.ReactNode[] = []
  let last = 0
  let match: RegExpExecArray | null
  let key = 0
  while ((match = regex.exec(value)) !== null) {
    const lead = match[1] ?? ''
    const mention = match[2] ?? ''
    const start = match.index + lead.length
    if (start > last) nodes.push(value.slice(last, start))
    nodes.push(
      <span key={key++} className="font-medium text-fg-accent">
        {mention}
      </span>,
    )
    last = regex.lastIndex
  }
  if (last < value.length) nodes.push(value.slice(last))
  return nodes
}

// A textarea can't color part of its own text, so we render the mentions in an
// overlay that mirrors the textarea's layout exactly, then make the textarea's
// own text transparent (its caret stays visible).
export default function Demo() {
  const [value, setValue] = React.useState(
    'Shipping this with @alexmiller and @sarahjones 🚀',
  )
  return (
    <Mention value={value} onChange={setValue} className="w-[320px]">
      <div className="relative w-full rounded-md border bg-bg text-sm leading-6 focus-within:ring-2 focus-within:ring-border-focus">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 px-3 py-2 break-words whitespace-pre-wrap text-fg"
        >
          {highlight(value)}
        </div>
        <TextArea
          aria-label="Post"
          placeholder="What's happening?"
          // `text-sm!`/`leading-6!` override the textarea slot's own metrics so
          // they match the overlay exactly (otherwise long lines drift apart).
          className="relative block min-h-24 w-full resize-none border-0 bg-transparent px-3 py-2 text-sm! leading-6! text-transparent caret-fg shadow-none outline-none placeholder:text-fg-muted"
        />
      </div>
      <Popover>
        <MenuContent items={people} renderEmptyState={() => 'No people found.'}>
          {(person) => (
            <MenuItem id={person.id} textValue={person.id}>
              @{person.id}
            </MenuItem>
          )}
        </MenuContent>
      </Popover>
    </Mention>
  )
}
