"use client";

import { SearchIcon } from "lucide-react";
import {
  Autocomplete as AriaAutocomplete,
  useFilter,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { Input, InputAddon, InputGroup } from "@dotui/registry/ui/input";
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
  ListBoxVirtualizer,
} from "@dotui/registry/ui/list-box";
import { SearchField } from "@dotui/registry/ui/search-field";
import type { ListBoxProps } from "@dotui/registry/ui/list-box";
import type { PopoverProps } from "@dotui/registry/ui/popover";
import type { SearchFieldProps } from "@dotui/registry/ui/search-field";

const commandStyles = tv({
  slots: {
    base: [
      "in-drawer:rounded-[inherit] in-modal:rounded-[inherit] in-popover:rounded-[inherit] rounded-lg not-in-popover:not-in-modal:not-in-drawer:border not-in-popover:not-in-modal:not-in-drawer:bg-card",
      "**:data-[slot=list-box]:w-full **:data-[slot=list-box]:border-0 **:data-[slot=list-box]:bg-transparent",
      "**:data-[slot=search-field]:w-full **:data-[slot=search-field]:outline-none [&_[data-slot=search-field]_[data-slot=input-group]]:rounded-b-none [&_[data-slot=search-field]_[data-slot=input-group]]:border-0 [&_[data-slot=search-field]_[data-slot=input-group]]:border-b [&_[data-slot=search-field]_[data-slot=input-group]]:bg-transparent",
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

interface CommandInputProps extends SearchFieldProps {
  placeholder?: string;
}

const CommandInput = ({ placeholder, ...props }: CommandInputProps) => {
  return (
    <SearchField {...props}>
      {/* TODO: Remove this */}
      <InputGroup className="w-full">
        <InputAddon>
          <SearchIcon />
        </InputAddon>
        <Input placeholder={placeholder} />
      </InputGroup>
    </SearchField>
  );
};

/* -----------------------------------------------------------------------------------------------*/

interface CommandContentProps<T extends object> extends ListBoxProps<T> {
  placement?: PopoverProps["placement"];
  virtulized?: boolean;
}

const CommandContent = <T extends object>({
  virtulized,
  placement,
  ...props
}: CommandContentProps<T>) => {
  if (virtulized) {
    return (
      <ListBoxVirtualizer>
        <ListBox {...props} className="h-80 w-48 overflow-y-auto p-0" />
      </ListBoxVirtualizer>
    );
  }

  return <ListBox {...props} />;
};

/* -----------------------------------------------------------------------------------------------*/

export {
  Command,
  CommandInput,
  CommandContent,
  ListBoxItem as CommandItem,
  ListBoxSection as CommandSection,
  ListBoxSectionHeader as CommandSectionHeader,
};

export type { CommandProps, CommandContentProps, CommandInputProps };
