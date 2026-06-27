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
import {
  Button,
  Card,
  Command,
  Input,
  InputGroup,
  InputGroupAddon,
  Kbd,
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
  SearchField,
  Separator,
} from 'www'

export const Default = () => (
  <Card style={{ width: 360, padding: 0 }}>
    <Command aria-label="Command menu">
      <SearchField aria-label="Search">
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <Input placeholder="Type a command or search..." />
          <InputGroupAddon>
            <Button isIconOnly variant="quiet" aria-label="Clear">
              <XIcon aria-hidden="true" />
            </Button>
          </InputGroupAddon>
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
)
