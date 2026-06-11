'use client'

import {
  CalculatorIcon,
  CalendarIcon,
  CreditCardIcon,
  SearchIcon,
  SettingsIcon,
  SmileIcon,
  UserIcon,
  XIcon,
} from 'lucide-react'

import { Button } from '@/registry/ui/button'
import { Command } from '@/registry/ui/command'
import { Dialog, DialogContent } from '@/registry/ui/dialog'
import { Input, InputGroup, InputGroupAddon } from '@/registry/ui/input'
import { Kbd } from '@/registry/ui/kbd'
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from '@/registry/ui/list-box'
import { Modal } from '@/registry/ui/modal'
import { SearchField } from '@/registry/ui/search-field'
import { Separator } from '@/registry/ui/separator'

export default function Demo() {
  return (
    <Dialog>
      <Button>Open Command</Button>
      <Modal>
        <DialogContent>
          {({ close }) => (
            <Command aria-label="Command menu">
              <SearchField aria-label="Search" autoFocus>
                <InputGroup size="lg">
                  <InputGroupAddon>
                    <SearchIcon />
                  </InputGroupAddon>
                  <Input placeholder="Type a command or search..." />
                  <InputGroupAddon>
                    <Button slot="close" onPress={close} className="px-1">
                      <Kbd className="bg-transparent">Esc</Kbd>
                    </Button>
                    <Button variant="quiet" isIconOnly>
                      <XIcon aria-hidden="true" />
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </SearchField>
              <ListBox
                aria-label="Commands"
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
                <Separator />
                <ListBoxSection>
                  <ListBoxSectionHeader>Settings</ListBoxSectionHeader>
                  <ListBoxItem textValue="Profile">
                    <UserIcon />
                    <span>Profile</span>
                    <Kbd>⌘P</Kbd>
                  </ListBoxItem>
                  <ListBoxItem textValue="Billing">
                    <CreditCardIcon />
                    <span>Billing</span>
                    <Kbd>⌘B</Kbd>
                  </ListBoxItem>
                  <ListBoxItem textValue="Settings">
                    <SettingsIcon />
                    <span>Settings</span>
                    <Kbd>⌘S</Kbd>
                  </ListBoxItem>
                </ListBoxSection>
              </ListBox>
            </Command>
          )}
        </DialogContent>
      </Modal>
    </Dialog>
  )
}
