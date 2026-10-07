import {
  CalculatorIcon,
  CalendarIcon,
  CreditCardIcon,
  SearchIcon,
  SettingsIcon,
  SmileIcon,
  UserIcon,
} from "@/registry/__generated__/icons"
import { Command } from "@/registry/ui/command"
import { DialogContent } from "@/registry/ui/dialog"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { Kbd } from "@/registry/ui/kbd"
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from "@/registry/ui/list-box"
import { Modal } from "@/registry/ui/modal"
import { SearchField } from "@/registry/ui/search-field"
import { Separator } from "@/registry/ui/separator"

import { Backdrop } from "./dialog"

/* The palette in a modal, as the in-modal Command demo; menuSearch and
   menuScale show here. */
export function CommandSheet() {
  return (
    <>
      <Backdrop />
      <Modal isOpen isDismissable={false}>
        <DialogContent>
          <Command aria-label="Command menu">
            <SearchField aria-label="Search">
              <InputGroup size="lg">
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
                <Input placeholder="Type a command or search..." />
              </InputGroup>
            </SearchField>
            <ListBox aria-label="Commands">
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
        </DialogContent>
      </Modal>
    </>
  )
}
