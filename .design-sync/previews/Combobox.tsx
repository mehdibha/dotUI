import { ChevronDownIcon } from 'lucide-react'
import {
  Button,
  Combobox,
  Input,
  InputGroup,
  InputGroupAddon,
  ListBox,
  ListBoxItem,
  Popover,
} from 'www'

export const Open = () => (
  <Combobox defaultOpen aria-label="Country">
    <InputGroup>
      <Input placeholder="Select a country..." />
      <InputGroupAddon>
        <Button variant="quiet" isIconOnly aria-label="Show suggestions">
          <ChevronDownIcon />
        </Button>
      </InputGroupAddon>
    </InputGroup>
    <Popover>
      <ListBox>
        <ListBoxItem>Canada</ListBoxItem>
        <ListBoxItem>France</ListBoxItem>
        <ListBoxItem>Germany</ListBoxItem>
        <ListBoxItem>Spain</ListBoxItem>
        <ListBoxItem>Tunisia</ListBoxItem>
        <ListBoxItem>United States</ListBoxItem>
        <ListBoxItem>United Kingdom</ListBoxItem>
      </ListBox>
    </Popover>
  </Combobox>
)
