'use client'

import { cn } from 'cnfast'
import {
  BoxIcon,
  CircleDotIcon,
  SearchIcon,
  SettingsIcon,
  SignalHighIcon,
  SquarePenIcon,
  TagIcon,
  UserIcon,
} from 'lucide-react'

import { Card } from '@/registry/ui/card'
import { Command } from '@/registry/ui/command'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { Kbd } from '@/registry/ui/kbd'
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from '@/registry/ui/list-box'
import { SearchField } from '@/registry/ui/search-field'
import { Separator } from '@/registry/ui/separator'

export function CommandMenu({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <Card className={cn('p-0', className)} {...props}>
      <Command aria-label="Command menu">
        <SearchField aria-label="Search">
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <Input placeholder="Type a command or search..." />
          </InputGroup>
        </SearchField>
        <ListBox aria-label="Commands" onAction={() => console.log('action')}>
          <ListBoxSection>
            <ListBoxSectionHeader>Issue</ListBoxSectionHeader>
            <ListBoxItem textValue="Assign to">
              <UserIcon />
              <span>Assign to...</span>
              <Kbd>A</Kbd>
            </ListBoxItem>
            <ListBoxItem textValue="Change status">
              <CircleDotIcon />
              <span>Change status...</span>
              <Kbd>S</Kbd>
            </ListBoxItem>
            <ListBoxItem textValue="Set priority">
              <SignalHighIcon />
              <span>Set priority...</span>
              <Kbd>P</Kbd>
            </ListBoxItem>
            <ListBoxItem textValue="Add label">
              <TagIcon />
              <span>Add label...</span>
              <Kbd>L</Kbd>
            </ListBoxItem>
          </ListBoxSection>
          <Separator />
          <ListBoxSection>
            <ListBoxSectionHeader>Navigation</ListBoxSectionHeader>
            <ListBoxItem textValue="Create new issue">
              <SquarePenIcon />
              <span>Create new issue</span>
              <Kbd>C</Kbd>
            </ListBoxItem>
            <ListBoxItem textValue="Go to project">
              <BoxIcon />
              <span>Go to project</span>
            </ListBoxItem>
            <ListBoxItem textValue="Open settings">
              <SettingsIcon />
              <span>Open settings</span>
            </ListBoxItem>
          </ListBoxSection>
        </ListBox>
      </Command>
    </Card>
  )
}
