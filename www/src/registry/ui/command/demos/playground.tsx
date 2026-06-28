'use client'

import {
  CalculatorIcon,
  CalendarIcon,
  SearchIcon,
  SmileIcon,
} from 'lucide-react'

import { Card } from '@/registry/ui/card'
import { Command } from '@/registry/ui/command'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from '@/registry/ui/list-box'
import { SearchField } from '@/registry/ui/search-field'

export default function Demo({ placeholder = 'Type a command...' } = {}) {
  return (
    <Card className="w-[300px] p-0">
      <Command aria-label="Command menu">
        <SearchField aria-label="Search">
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <Input data-control-target placeholder={placeholder} />
          </InputGroup>
        </SearchField>
        <ListBox
          aria-label="Suggestions"
          onAction={() => console.log('action')}
        >
          <ListBoxSection>
            <ListBoxSectionHeader>Suggestions</ListBoxSectionHeader>
            <ListBoxItem textValue="Calendar">
              <CalendarIcon />
              <span>Calendar</span>
            </ListBoxItem>
            <ListBoxItem textValue="Search Emoji">
              <SmileIcon />
              <span>Search Emoji</span>
            </ListBoxItem>
            <ListBoxItem textValue="Calculator">
              <CalculatorIcon />
              <span>Calculator</span>
            </ListBoxItem>
          </ListBoxSection>
        </ListBox>
      </Command>
    </Card>
  )
}
