"use client";

import { createDynamicComponent } from "@dotui/registry/_helpers/create-dynamic-component";
import {
  ListBoxItem,
  ListBoxSection,
  ListBoxSectionHeader,
} from "@dotui/registry/ui/list-box";

import {
  Command as _Command,
  CommandContent as _CommandContent,
  CommandInput as _CommandInput,
} from "./basic";
import type {
  CommandContentProps,
  CommandInputProps,
  CommandProps,
} from "./types";

export const Command = createDynamicComponent<CommandProps>(
  "command",
  "Command",
  _Command,
  {},
);

export const CommandContent = <T extends object = object>(
  props: CommandContentProps<T>,
) => {
  const Component = createDynamicComponent<CommandContentProps<T>>(
    "command",
    "CommandContent",
    _CommandContent,
    {},
  );
  return <Component {...props} />;
};

export const CommandInput = (props: CommandInputProps) => {
  const Component = createDynamicComponent<CommandInputProps>(
    "command",
    "CommandInput",
    _CommandInput,
    {},
  );
  return <Component {...props} />;
};

export {
  ListBoxItem as CommandItem,
  ListBoxSection as CommandSection,
  ListBoxSectionHeader as CommandSectionHeader,
};

export type { CommandContentProps, CommandInputProps, CommandProps };
