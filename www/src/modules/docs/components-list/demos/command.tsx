import {
  CalculatorIcon,
  CalendarIcon,
  CreditCardIcon,
  SearchIcon,
  SettingsIcon,
  SmileIcon,
  UserIcon,
} from "lucide-react"

import { Card } from "@/registry/ui/card"
import { Command } from "@/registry/ui/command"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { Kbd } from "@/registry/ui/kbd"
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from "@/registry/ui/list-box"
import { SearchField } from "@/registry/ui/search-field"
import { Separator } from "@/registry/ui/separator"

export function CommandDemo() {
  return (
    <div className="absolute inset-0 flex items-start justify-center px-4 pt-4">
      <Card className="w-full max-w-[17rem] p-0">
        <Command aria-label="Command menu">
          <SearchField aria-label="Search">
            <InputGroup>
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
      </Card>
    </div>
  )
}
