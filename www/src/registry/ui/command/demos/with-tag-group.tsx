'use client'

import { SearchIcon } from 'lucide-react'

import { Command } from '@/registry/ui/command'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { SearchField } from '@/registry/ui/search-field'
import { Tag, TagGroup, TagList } from '@/registry/ui/tag-group'

export default function Demo() {
  return (
    <Command aria-label="Command menu" className="gap-2">
      <SearchField aria-label="Search" autoFocus>
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <Input placeholder="Type a command or search..." />
        </InputGroup>
      </SearchField>
      <TagGroup aria-label="Interest tags" selectionMode="multiple">
        <TagList
          renderEmptyState={() => (
            <p className="text-xs text-fg-muted">No results.</p>
          )}
        >
          <Tag>News</Tag>
          <Tag>Travel</Tag>
          <Tag>Shopping</Tag>
          <Tag>Business</Tag>
          <Tag>Entertainment</Tag>
          <Tag>Food</Tag>
          <Tag>Technology</Tag>
          <Tag>Health</Tag>
          <Tag>Science</Tag>
        </TagList>
      </TagGroup>
    </Command>
  )
}
