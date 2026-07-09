'use client'

import * as AutocompletePrimitive from 'react-aria-components/Autocomplete'
import { tv } from 'tailwind-variants'

import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from '@/ui/list-box'
import { SearchField } from '@/ui/search-field'
const commandVariants = tv({
  base: [
    'group/command flex w-full flex-col gap-1 text-fg',
    'max-h-[inherit] overflow-y-auto',
    'p-1.5 **:data-listbox:overflow-visible **:data-listbox:p-0 **:data-search-field:pb-0 **:data-listbox:**:data-separator:-mx-1.5 **:data-listbox:**:data-separator:my-1.5 **:[[data-search-field]>[data-input-group]]:rounded-sm',
  ],
})

interface CommandProps<T extends object>
  extends
    Omit<AutocompletePrimitive.AutocompleteProps<T>, 'children' | 'filter'>,
    Omit<React.ComponentProps<'div'>, 'slot'> {
  filter?: Intl.CollatorOptions
}

function Command<T extends object>({
  className,
  slot,
  filter,
  ...props
}: CommandProps<T>) {
  const styles = commandVariants
  const { contains } = AutocompletePrimitive.useFilter({
    sensitivity: 'base',
    ignorePunctuation: true,
    ...filter,
  })

  return (
    <AutocompletePrimitive.Autocomplete filter={contains}>
      <div data-command="" className={styles({ className })} {...props} />
    </AutocompletePrimitive.Autocomplete>
  )
}

export type { CommandProps }
export {
  Command,
  ListBox as CommandContent,
  ListBoxItem as CommandItem,
  ListBoxSection as CommandSection,
  ListBoxSectionHeader as CommandSectionHeader,
  SearchField as CommandInput,
}
