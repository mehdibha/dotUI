"use client";

import * as AutocompletePrimitive from "react-aria-components/Autocomplete";

import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from "@/components/ui/list-box";
import { SearchField } from "@/components/ui/search-field";
import { tv } from "tailwind-variants";

const commandVariants = tv({
  base: "group/command flex w-full flex-col gap-1 text-fg [--command-inset:--spacing(2)] in-data-popover:[--command-inset:--spacing(1)] max-h-[inherit] **:data-search-field:shrink-0 **:data-listbox:min-h-0 **:data-listbox:overflow-y-auto in-data-modal:**:data-listbox-item:py-2 in-data-modal:**:data-menu-item:py-2 in-data-modal:**:data-listbox-item:rounded-md in-data-modal:**:data-menu-item:rounded-md in-data-sheet:**:data-listbox-item:py-2 in-data-sheet:**:data-menu-item:py-2 not-in-data-popover:**:data-listbox-item:py-1.5 **:data-listbox-section-header:py-1.5 **:data-listbox-section-header:font-medium **:data-search-field:px-(--command-inset) **:data-search-field:pt-(--command-inset) **:data-search-field:pb-0 **:data-listbox:scroll-py-(--command-inset) **:data-listbox:pt-0 **:data-listbox:pb-(--command-inset) **:data-listbox:**:data-separator:my-(--command-inset) **:[[data-search-field]>[data-input-group]]:rounded-[max(var(--radius-md),calc(var(--surface-radius,var(--radius-lg))-var(--command-inset)))] **:data-listbox:px-(--command-inset) **:data-listbox:**:data-separator:-mx-(--command-inset) in-data-modal:**:data-listbox-item:px-2 in-data-modal:**:data-menu-item:px-2 in-data-sheet:**:data-listbox-item:px-2 in-data-sheet:**:data-menu-item:px-2",
});

/* -------------------------------------------------------------------------- */

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
  const { contains } = AutocompletePrimitive.useFilter({
    sensitivity: "base",
    ignorePunctuation: true,
    ...filter,
  });

  return (
    <AutocompletePrimitive.Autocomplete filter={contains}>
      <div
        data-command=""
        className={commandVariants({ className })}
        {...props}
      />
    </AutocompletePrimitive.Autocomplete>
  );
}

/* -------------------------------------------------------------------------- */

export type { CommandProps };
export {
  Command,
  ListBox as CommandContent,
  ListBoxItem as CommandItem,
  ListBoxSection as CommandSection,
  ListBoxSectionHeader as CommandSectionHeader,
  SearchField as CommandInput,
};
