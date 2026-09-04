"use client";

import * as AutocompletePrimitive from "react-aria-components/Autocomplete";

import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from "@/components/ui/list-box";
import { SearchField } from "@/components/ui/search-field";
import { tv, type VariantProps } from "tailwind-variants";
const commandVariants = tv({
  base: [
    "group/command flex w-full flex-col gap-1 text-fg",
    "max-h-[inherit]",
    "**:data-search-field:shrink-0",
    "**:data-listbox:min-h-0 **:data-listbox:overflow-y-auto",
    "in-data-modal:**:data-listbox-item:px-2 in-data-modal:**:data-listbox-item:py-2 in-data-modal:**:data-menu-item:px-2 in-data-modal:**:data-menu-item:py-2",
    "in-data-drawer:**:data-listbox-item:px-2 in-data-drawer:**:data-listbox-item:py-2 in-data-drawer:**:data-menu-item:px-2 in-data-drawer:**:data-menu-item:py-2",
    "**:data-search-field:px-1.5 **:data-search-field:pt-1.5 **:data-search-field:pb-0",
    "**:data-listbox:scroll-py-1.5 **:data-listbox:px-1.5 **:data-listbox:pt-0 **:data-listbox:pb-1.5",
    "**:data-listbox:**:data-separator:-mx-1.5 **:data-listbox:**:data-separator:my-1.5",
    "**:[[data-search-field]>[data-input-group]]:rounded-[calc(var(--surface-radius,var(--radius-surface))-(--spacing(1.5)))]",
    "in-data-modal:**:data-search-field:px-2 in-data-modal:**:data-search-field:pt-2",
    "in-data-modal:**:data-listbox:scroll-py-2 in-data-modal:**:data-listbox:px-2 in-data-modal:**:data-listbox:pb-2",
    "in-data-modal:**:data-listbox:**:data-separator:-mx-2",
    "in-data-modal:**:[[data-search-field]>[data-input-group]]:rounded-[calc(var(--surface-radius,var(--radius-surface))-(--spacing(2)))]",
  ],
});

interface CommandProps<T extends object>
  extends
    Omit<AutocompletePrimitive.AutocompleteProps<T>, "children" | "filter">,
    Omit<React.ComponentProps<"div">, "slot"> {
  filter?: Intl.CollatorOptions;
}

function Command<T extends object>({
  className,
  slot,
  filter,
  ...props
}: CommandProps<T>) {
  const styles = commandVariants;
  const { contains } = AutocompletePrimitive.useFilter({
    sensitivity: "base",
    ignorePunctuation: true,
    ...filter,
  });

  return (
    <AutocompletePrimitive.Autocomplete filter={contains}>
      <div data-command="" className={styles({ className })} {...props} />
    </AutocompletePrimitive.Autocomplete>
  );
}

export type { CommandProps };
export {
  Command,
  ListBox as CommandContent,
  ListBoxItem as CommandItem,
  ListBoxSection as CommandSection,
  ListBoxSectionHeader as CommandSectionHeader,
  SearchField as CommandInput,
};
