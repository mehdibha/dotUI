"use client";

import { SearchIcon } from "lucide-react";
import {
  Autocomplete as AriaAutocomplete,
  useFilter,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { Input, InputAddon, InputGroup } from "@dotui/registry-v2/ui/input";
import { SearchField } from "@dotui/registry-v2/ui/search-field";
import type { SearchFieldProps } from "@dotui/registry-v2/ui/search-field";

import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from "./list-box";

const commandStyles = tv({
  slots: {
    base: [
      "rounded-lg not-in-popover:not-in-modal:not-in-drawer:border not-in-popover:not-in-modal:not-in-drawer:bg-card in-popover:rounded-[inherit] in-modal:rounded-[inherit] in-drawer:rounded-[inherit]",
      "[&_[data-slot=list-box]]:w-full [&_[data-slot=list-box]]:border-0 [&_[data-slot=list-box]]:bg-transparent",
      "[&_[data-slot=search-field]]:w-full [&_[data-slot=search-field]]:outline-none [&_[data-slot=search-field]_[data-slot=input-group]]:rounded-b-none [&_[data-slot=search-field]_[data-slot=input-group]]:border-0 [&_[data-slot=search-field]_[data-slot=input-group]]:border-b [&_[data-slot=search-field]_[data-slot=input-group]]:bg-transparent",
      "in-modal:w-full",
    ],
  },
});

const { base } = commandStyles();

/* -----------------------------------------------------------------------------------------------*/

interface CommandProps extends React.ComponentProps<"div"> {}

function Command({ className, ...props }: CommandProps) {
  const { contains } = useFilter({
    sensitivity: "base",
    ignorePunctuation: true,
  });

  return (
    <AriaAutocomplete filter={contains}>
      <div {...props} className={base({ className })}></div>
    </AriaAutocomplete>
  );
}

/* -----------------------------------------------------------------------------------------------*/

const CommandInput = ({
  placeholder,
  ...props
}: SearchFieldProps & { placeholder?: string }) => {
  return (
    <SearchField {...props}>
      <InputGroup>
        <InputAddon>
          <SearchIcon />
        </InputAddon>
        <Input placeholder={placeholder} />
      </InputGroup>
    </SearchField>
  );
};

/* -----------------------------------------------------------------------------------------------*/

export {
  Command,
  CommandInput,
  ListBox as CommandList,
  ListBoxItem as CommandItem,
  ListBoxSection as CommandSection,
  ListBoxSectionHeader as CommandSectionHeader,
};
