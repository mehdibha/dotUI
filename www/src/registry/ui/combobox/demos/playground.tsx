"use client"

import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import { Combobox, type ComboboxProps } from "@/registry/ui/combobox"
import { Description, Label } from "@/registry/ui/field"
import { Input, InputGroup, InputGroupAddon } from "@/registry/ui/input"
import { ListBox, ListBoxItem } from "@/registry/ui/list-box"
import { Popover } from "@/registry/ui/popover"

export default function Demo({
  label = "Country",
  placeholder = "Search countries...",
  description = "",
  menuTrigger = "focus",
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  isInvalid = false,
  allowsCustomValue = false,
}: {
  label?: string
  placeholder?: string
  description?: string
  menuTrigger?: ComboboxProps<object>["menuTrigger"]
  isDisabled?: boolean
  isReadOnly?: boolean
  isRequired?: boolean
  isInvalid?: boolean
  allowsCustomValue?: boolean
} = {}) {
  return (
    <Combobox
      className="w-52"
      menuTrigger={menuTrigger}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      isInvalid={isInvalid}
      allowsCustomValue={allowsCustomValue}
    >
      {label && <Label>{label}</Label>}
      <InputGroup>
        <Input data-control-target placeholder={placeholder} />
        <InputGroupAddon>
          <Button variant="quiet" isIconOnly>
            <ChevronDownIcon />
          </Button>
        </InputGroupAddon>
      </InputGroup>
      {description && <Description>{description}</Description>}
      <Popover>
        <ListBox>
          <ListBoxItem id="us">United States</ListBoxItem>
          <ListBoxItem id="uk">United Kingdom</ListBoxItem>
          <ListBoxItem id="fr">France</ListBoxItem>
          <ListBoxItem id="de">Germany</ListBoxItem>
          <ListBoxItem id="jp">Japan</ListBoxItem>
        </ListBox>
      </Popover>
    </Combobox>
  )
}
