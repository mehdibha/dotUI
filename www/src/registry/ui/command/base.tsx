"use client"

import type * as React from "react"
import * as AutocompletePrimitives from "react-aria-components/Autocomplete"

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
    Omit<AutocompletePrimitives.AutocompleteProps<T>, "children" | "filter">,
    Omit<React.ComponentProps<"div">, "slot"> {
  filter?: Intl.CollatorOptions
}

const Command = <T extends object>({
  className,
  slot,
  filter,
  ...props
}: CommandProps<T>) => {
  const styles = useStyles()
  const { contains } = AutocompletePrimitives.useFilter({
    sensitivity: "base",
    ignorePunctuation: true,
    ...filter,
  })

  return (
    <AutocompletePrimitives.Autocomplete filter={contains}>
      <div data-command="" className={styles({ className })} {...props} />
    </AutocompletePrimitives.Autocomplete>
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
