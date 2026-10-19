"use client"

import * as AutocompletePrimitive from "react-aria-components/Autocomplete"

import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from "@/registry/ui/list-box"
import { SearchField } from "@/registry/ui/search-field"

import { useStyles } from "./styles"

// MARK: commandStyles

// MARK: Separator

interface CommandProps<T extends object>
  extends
    Omit<AutocompletePrimitive.AutocompleteProps<T>, "children" | "filter">,
    Omit<React.ComponentProps<"div">, "slot"> {
  filter?: Intl.CollatorOptions
}

function Command<T extends object>({
  className,
  slot,
  filter,
  inputValue,
  defaultInputValue,
  onInputChange,
  disableAutoFocusFirst,
  disableVirtualFocus,
  ...props
}: CommandProps<T>) {
  const styles = useStyles()
  const { contains } = AutocompletePrimitive.useFilter({
    sensitivity: "base",
    ignorePunctuation: true,
    ...filter,
  })

  return (
    <AutocompletePrimitive.Autocomplete
      slot={slot}
      filter={contains}
      inputValue={inputValue}
      defaultInputValue={defaultInputValue}
      onInputChange={onInputChange}
      disableAutoFocusFirst={disableAutoFocusFirst}
      disableVirtualFocus={disableVirtualFocus}
    >
      <div data-command="" className={styles({ className })} {...props} />
    </AutocompletePrimitive.Autocomplete>
  )
}

// MARK: Separator

export type { CommandProps }
export {
  Command,
  ListBox as CommandContent,
  ListBoxItem as CommandItem,
  ListBoxSection as CommandSection,
  ListBoxSectionHeader as CommandSectionHeader,
  SearchField as CommandInput,
}
