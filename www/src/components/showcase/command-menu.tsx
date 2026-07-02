'use client'

import {
  FilePlusIcon,
  MoonIcon,
  SearchIcon,
  SettingsIcon,
  UserPlusIcon,
  XIcon,
} from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import { Card, CardContent } from '@/registry/ui/card'
import {
  Command,
  CommandContent,
  CommandInput,
  CommandItem,
  CommandSection,
  CommandSectionHeader,
} from '@/registry/ui/command'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { Kbd } from '@/registry/ui/kbd'

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
  return (
    <Card className={cn(className)} {...props}>
      <CardContent className="space-y-2">
        <Command aria-label="Command menu">
          <CommandInput aria-label="Type a command or search">
            <InputGroup>
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <Input placeholder="Type a command or search…" />
              <InputGroupAddon className="[--addon-button-inset:--spacing(2)]">
                <Button isIconOnly variant="quiet">
                  <XIcon aria-hidden="true" />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </CommandInput>
          <CommandContent aria-label="Commands">
            <CommandSection>
              <CommandSectionHeader>Actions</CommandSectionHeader>
              {commands.map((c) => (
                <CommandItem key={c.id} id={c.id} textValue={c.label}>
                  <c.icon />
                  {c.label}
                  <Kbd className="ml-auto">{c.shortcut}</Kbd>
                </CommandItem>
              ))}
            </CommandSection>
          </CommandContent>
        </Command>
      </CardContent>
    </Card>
  )
}
