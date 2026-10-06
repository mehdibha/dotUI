import { ChevronDownIcon, MailIcon } from "@/registry/__generated__/icons"
import { Button } from "@/registry/ui/button"
import { Combobox } from "@/registry/ui/combobox"
import { Description, FieldError, Label } from "@/registry/ui/field"
import {
  Input,
  InputGroup,
  InputGroupAddon,
  TextArea,
} from "@/registry/ui/input"
import { ListBox, ListBoxItem } from "@/registry/ui/list-box"
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
} from "@/registry/ui/number-field"
import {
  OTPField,
  OTPFieldGroup,
  OTPFieldSeparator,
} from "@/registry/ui/otp-field"
import { Popover } from "@/registry/ui/popover"
import { SearchField } from "@/registry/ui/search-field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/ui/select"
import { TextField } from "@/registry/ui/text-field"

import { Cell, Sheet } from "./layout"

export function FieldsSheet() {
  return (
    <Sheet className="grid-cols-3">
      <Cell label="text field · description">
        <TextField className="w-full">
          <Label>Email</Label>
          <Input placeholder="you@example.com" />
          <Description>We'll never share your email.</Description>
        </TextField>
      </Cell>
      <Cell label="text field · focused">
        <TextField className="w-full" defaultValue="Acme Inc.">
          <Label>Company</Label>
          <Input data-specimen-focus="" />
          <Description>Shown on invoices.</Description>
        </TextField>
      </Cell>
      <Cell label="text field · invalid">
        <TextField className="w-full" defaultValue="hello@" isInvalid>
          <Label>Email</Label>
          <Input />
          <FieldError>Enter a valid email address.</FieldError>
        </TextField>
      </Cell>

      <Cell label="select · trigger">
        <Select className="w-full" defaultValue="replicate">
          <Label>Provider</Label>
          <SelectTrigger />
          <SelectContent>
            <SelectItem id="perplexity">Perplexity</SelectItem>
            <SelectItem id="replicate">Replicate</SelectItem>
            <SelectItem id="together">Together AI</SelectItem>
          </SelectContent>
        </Select>
      </Cell>
      <Cell label="select · placeholder">
        <Select className="w-full" placeholder="Choose a region">
          <Label>Region</Label>
          <SelectTrigger />
          <SelectContent>
            <SelectItem id="eu">Europe</SelectItem>
            <SelectItem id="us">United States</SelectItem>
          </SelectContent>
        </Select>
      </Cell>
      <Cell label="combobox">
        <Combobox className="w-full" defaultInputValue="France">
          <Label>Country</Label>
          <InputGroup>
            <Input />
            <InputGroupAddon>
              <Button variant="quiet" isIconOnly aria-label="Show countries">
                <ChevronDownIcon />
              </Button>
            </InputGroupAddon>
          </InputGroup>
          <Popover>
            <ListBox>
              <ListBoxItem>Canada</ListBoxItem>
              <ListBoxItem>France</ListBoxItem>
            </ListBox>
          </Popover>
        </Combobox>
      </Cell>

      <Cell label="number field">
        <NumberField className="w-full" defaultValue={1024}>
          <Label>Width</Label>
          <NumberFieldGroup>
            <NumberFieldDecrement />
            <Input />
            <NumberFieldIncrement />
          </NumberFieldGroup>
        </NumberField>
      </Cell>
      <Cell label="search field">
        <SearchField className="w-full" defaultValue="design tokens">
          <Label>Search</Label>
          <Input />
        </SearchField>
      </Cell>
      <Cell label="input group · addon">
        <TextField className="w-full">
          <Label>Work email</Label>
          <InputGroup>
            <InputGroupAddon>
              <MailIcon />
            </InputGroupAddon>
            <Input placeholder="name@company.com" />
          </InputGroup>
        </TextField>
      </Cell>

      <Cell label="otp field">
        <OTPField length={6} defaultValue="428">
          <Label>Verification code</Label>
          <div className="flex items-center">
            <OTPFieldGroup>
              <Input aria-label="Digit 1" />
              <Input aria-label="Digit 2" />
              <Input aria-label="Digit 3" />
            </OTPFieldGroup>
            <OTPFieldSeparator className="px-2 text-fg-muted">
              -
            </OTPFieldSeparator>
            <OTPFieldGroup>
              <Input aria-label="Digit 4" />
              <Input aria-label="Digit 5" />
              <Input aria-label="Digit 6" />
            </OTPFieldGroup>
          </div>
        </OTPField>
      </Cell>
      <Cell label="textarea">
        <TextField
          className="w-full"
          defaultValue="Buttons lose their focus ring inside dialogs."
        >
          <Label>Description</Label>
          <TextArea rows={3} />
        </TextField>
      </Cell>
      <Cell label="text field · disabled">
        <TextField
          className="w-full"
          defaultValue="read-only@acme.com"
          isDisabled
        >
          <Label>Billing email</Label>
          <Input />
        </TextField>
      </Cell>
    </Sheet>
  )
}
