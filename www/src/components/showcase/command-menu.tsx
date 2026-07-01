'use client'

import { useState } from 'react'
import {
  FilePlusIcon,
  MoonIcon,
  SearchIcon,
  SettingsIcon,
  UserPlusIcon,
} from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import { Card, CardContent } from '@/registry/ui/card'
import { Kbd } from '@/registry/ui/kbd'
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from '@/registry/ui/list-box'
import { SearchField } from '@/registry/ui/search-field'

const commands = [
  { id: 'new-file', label: 'New file', icon: FilePlusIcon, shortcut: '⌘N' },
  { id: 'search-docs', label: 'Search docs', icon: SearchIcon, shortcut: '⌘K' },
  { id: 'toggle-theme', label: 'Toggle theme', icon: MoonIcon, shortcut: '⌘D' },
  { id: 'invite', label: 'Invite people', icon: UserPlusIcon, shortcut: '⌘I' },
  {
    id: 'settings',
    label: 'Open settings',
    icon: SettingsIcon,
    shortcut: '⌘,',
  },
]

export function CommandMenu({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [query, setQuery] = useState('')

  const results = commands.filter((c) =>
    c.label.toLowerCase().includes(query.trim().toLowerCase()),
  )

  return (
    <Card className={cn(className)} {...props}>
      <CardContent className="space-y-2">
        <SearchField
          aria-label="Type a command or search"
          placeholder="Type a command or search…"
          value={query}
          onChange={setQuery}
          className="border-b pb-2"
        />

        {results.length > 0 ? (
          <ListBox
            aria-label="Commands"
            selectionMode="single"
            className="border-0 shadow-none"
          >
            <ListBoxSection>
              <ListBoxSectionHeader>Actions</ListBoxSectionHeader>
              {results.map((c) => (
                <ListBoxItem key={c.id} id={c.id} textValue={c.label}>
                  <c.icon />
                  {c.label}
                  <Kbd className="ml-auto">{c.shortcut}</Kbd>
                </ListBoxItem>
              ))}
            </ListBoxSection>
          </ListBox>
        ) : (
          <p className="px-2 py-6 text-center text-xs text-fg-muted">
            No commands found.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
